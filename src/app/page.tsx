"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, Database, Loader2, RefreshCw } from "lucide-react"

interface VerificationResult {
  success: boolean
  timestamp: string
  environment?: any
  connection?: any
  tables?: any
  writeTest?: any
  recommendations?: string[]
  error?: string
}

export default function VerifySupabasePage() {
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runVerification = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/verify-supabase", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message)
      setResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    runVerification()
  }, [])

  const getStatusBadge = (success: boolean) => {
    return success ? (
      <Badge className="bg-green-100 text-green-800">✅ Working</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">❌ Issue</Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Database className="h-12 w-12 text-[#dd2a1b] mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-[#231f20] mb-2">Supabase Connection Verification</h1>
          <p className="text-gray-600">Checking your existing Supabase setup and database status</p>
        </div>

        {/* Control Panel */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Verification Status</span>
              <Button onClick={runVerification} disabled={isLoading} className="bg-[#dd2a1b] hover:bg-[#c02419]">
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                {isLoading ? "Checking..." : "Run Verification"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>❌ Verification failed: {error}</AlertDescription>
              </Alert>
            )}

            {result?.success && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  ✅ Supabase connection verified successfully!
                  {result.tables && ` Found ${result.tables.existing}/${result.tables.total} tables.`}
                </AlertDescription>
              </Alert>
            )}

            {result && !result.success && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>❌ Connection issues detected. Check details below.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Detailed Results */}
        {result && (
          <div className="space-y-4">
            {/* Environment Check */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5" />
                    <span>Environment Configuration</span>
                  </CardTitle>
                  {getStatusBadge(
                    result.environment?.hasUrl && result.environment?.hasAnonKey && result.environment?.hasServiceKey,
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Project URL:</strong> {result.environment?.hasUrl ? "✅ Configured" : "❌ Missing"}
                  </div>
                  <div>
                    <strong>Anon Key:</strong> {result.environment?.hasAnonKey ? "✅ Configured" : "❌ Missing"}
                  </div>
                  <div>
                    <strong>Service Key:</strong> {result.environment?.hasServiceKey ? "✅ Configured" : "❌ Missing"}
                  </div>
                  <div>
                    <strong>Project ID:</strong> {result.environment?.projectId || "Unknown"}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Connection Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Database Connection</span>
                  </CardTitle>
                  {getStatusBadge(result.connection?.status === "connected")}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {result.connection?.status === "connected"
                    ? `✅ Successfully connected to project: ${result.connection.projectId}`
                    : "❌ Connection failed"}
                </p>
              </CardContent>
            </Card>

            {/* Tables Status */}
            {result.tables && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Database className="h-5 w-5" />
                      <span>
                        Database Tables ({result.tables.existing}/{result.tables.total})
                      </span>
                    </CardTitle>
                    {getStatusBadge(result.tables.existing === result.tables.total)}
                  </div>
                </CardHeader>
                <CardContent>
                  {result.tables.existingTables.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-green-700 mb-2">✅ Existing Tables:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {result.tables.existingTables.map((table: any) => (
                          <div key={table.name} className="flex justify-between">
                            <span>{table.name}</span>
                            <span className="text-gray-500">
                              {table.hasData ? `${table.recordCount} records` : "Empty"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.tables.missingTables.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2">❌ Missing Tables:</h4>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        {result.tables.missingTables.map((table: string) => (
                          <span key={table} className="text-red-600">
                            {table}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Write Test */}
            {result.writeTest && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5" />
                      <span>Write Permissions</span>
                    </CardTitle>
                    {getStatusBadge(result.writeTest.success)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {result.writeTest.success
                      ? "✅ Write permissions working - can insert and delete records"
                      : `❌ Write test failed: ${result.writeTest.error}`}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {result.recommendations && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm flex items-start space-x-2">
                        <span className="text-blue-600">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 text-center space-x-4">
          {result?.tables?.missing > 0 && (
            <Button variant="outline" asChild>
              <a href="/setup-database">Create Missing Tables</a>
            </Button>
          )}

          {result?.success && result?.tables?.existing === result?.tables?.total && (
            <Button variant="outline" asChild>
              <a href="/admin">Go to Admin Dashboard</a>
            </Button>
          )}

          <Button variant="outline" asChild>
            <a href="/test-connection">Full System Test</a>
          </Button>
        </div>
      </div>
    </div>
  )
}