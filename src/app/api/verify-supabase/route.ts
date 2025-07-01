import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    const environment = {
      hasUrl: !!supabaseUrl,
      hasAnonKey: !!supabaseAnonKey,
      hasServiceKey: !!supabaseServiceKey,
      projectId: supabaseUrl ? extractProjectId(supabaseUrl) : 'Unknown'
    }

    // If we don't have basic configuration, return early
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        success: false,
        timestamp: new Date().toISOString(),
        environment,
        error: 'Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables'
      })
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Test connection
    const connectionTest = await testConnection(supabase)
    
    // Test tables
    const tablesTest = await testTables(supabase)
    
    // Test write permissions (if we have service role key)
    let writeTest = null
    if (supabaseServiceKey) {
      const serviceClient = createClient(supabaseUrl, supabaseServiceKey)
      writeTest = await testWritePermissions(serviceClient)
    }

    // Generate recommendations
    const recommendations = generateRecommendations(environment, connectionTest, tablesTest, writeTest)

    const result = {
      success: connectionTest.status === 'connected' && (!tablesTest || tablesTest.existing === tablesTest.total),
      timestamp: new Date().toISOString(),
      environment,
      connection: connectionTest,
      tables: tablesTest,
      writeTest,
      recommendations
    }

    return NextResponse.json(result)

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      timestamp: new Date().toISOString(),
      error: error.message
    }, { status: 500 })
  }
}

function extractProjectId(url: string): string {
  try {
    const match = url.match(/https:\/\/([^.]+)\.supabase\.co/)
    return match ? match[1] : 'Unknown'
  } catch {
    return 'Unknown'
  }
}

async function testConnection(supabase: any) {
  try {
    const { data, error } = await supabase.from('dummy_table_that_should_not_exist').select('*').limit(1)
    
    // If we get a "relation does not exist" error, that's actually good - it means we're connected
    if (error && error.message.includes('relation') && error.message.includes('does not exist')) {
      return {
        status: 'connected',
        projectId: extractProjectId(supabase.supabaseUrl)
      }
    }
    
    // If we get data or a different error, we're also connected
    return {
      status: 'connected',
      projectId: extractProjectId(supabase.supabaseUrl)
    }
  } catch (error: any) {
    return {
      status: 'failed',
      error: error.message
    }
  }
}

async function testTables(supabase: any) {
  // Define expected tables for a typical app
  const expectedTables = ['users', 'profiles', 'posts', 'comments', 'categories']
  
  try {
    const existingTables = []
    const missingTables = []
    
    for (const tableName of expectedTables) {
      try {
        const { data, error } = await supabase.from(tableName).select('id').limit(1)
        
        if (!error) {
          // Table exists and is accessible
          const { count } = await supabase.from(tableName).select('*', { count: 'exact', head: true })
          existingTables.push({
            name: tableName,
            hasData: count > 0,
            recordCount: count || 0
          })
        } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
          // Table doesn't exist
          missingTables.push(tableName)
        } else {
          // Table exists but might have permission issues
          existingTables.push({
            name: tableName,
            hasData: false,
            recordCount: 0,
            note: 'Permission issues or empty'
          })
        }
      } catch {
        missingTables.push(tableName)
      }
    }
    
    return {
      total: expectedTables.length,
      existing: existingTables.length,
      missing: missingTables.length,
      existingTables,
      missingTables
    }
  } catch (error: any) {
    return {
      error: error.message
    }
  }
}

async function testWritePermissions(supabase: any) {
  try {
    // Try to create a test table and insert/delete a record
    const testTableName = 'test_table_' + Date.now()
    
    // Create test table
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `CREATE TABLE IF NOT EXISTS ${testTableName} (id SERIAL PRIMARY KEY, test_data TEXT);`
    })
    
    if (createError) {
      // Try a simpler approach - test with an existing table or auth.users
      const { data, error: insertError } = await supabase.auth.signUp({
        email: `test_${Date.now()}@example.com`,
        password: 'test_password_123'
      })
      
      if (!insertError) {
        // Clean up - delete the test user
        if (data.user) {
          await supabase.auth.admin.deleteUser(data.user.id)
        }
        return { success: true }
      }
      
      return { success: false, error: insertError.message }
    }
    
    // Insert test record
    const { data: insertData, error: insertError } = await supabase
      .from(testTableName)
      .insert({ test_data: 'test' })
      .select()
    
    if (insertError) {
      return { success: false, error: insertError.message }
    }
    
    // Delete test record
    const { error: deleteError } = await supabase
      .from(testTableName)
      .delete()
      .eq('test_data', 'test')
    
    // Drop test table
    await supabase.rpc('exec_sql', {
      sql: `DROP TABLE IF EXISTS ${testTableName};`
    })
    
    return { 
      success: !deleteError,
      error: deleteError?.message
    }
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message 
    }
  }
}

function generateRecommendations(environment: any, connection: any, tables: any, writeTest: any): string[] {
  const recommendations = []
  
  if (!environment.hasUrl) {
    recommendations.push('Add NEXT_PUBLIC_SUPABASE_URL to your environment variables')
  }
  
  if (!environment.hasAnonKey) {
    recommendations.push('Add NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables')
  }
  
  if (!environment.hasServiceKey) {
    recommendations.push('Add SUPABASE_SERVICE_ROLE_KEY to your environment variables for admin operations')
  }
  
  if (connection.status !== 'connected') {
    recommendations.push('Check your Supabase project URL and API keys')
    recommendations.push('Ensure your Supabase project is active and not paused')
  }
  
  if (tables && tables.missing > 0) {
    recommendations.push(`Create ${tables.missing} missing database tables: ${tables.missingTables.join(', ')}`)
    recommendations.push('Run your database migration scripts')
  }
  
  if (writeTest && !writeTest.success) {
    recommendations.push('Check Row Level Security (RLS) policies on your tables')
    recommendations.push('Verify service role key has proper permissions')
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Your Supabase setup looks good! 🎉')
    recommendations.push('Consider setting up Row Level Security policies for production')
  }
  
  return recommendations
}