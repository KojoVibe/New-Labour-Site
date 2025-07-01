# Supabase Verification App

A Next.js application that provides a comprehensive verification interface for your Supabase database connection and setup. This tool helps you quickly diagnose issues with your Supabase configuration, check database connectivity, verify table existence, and test write permissions.

## Features

- **Environment Configuration Check**: Verifies all required Supabase environment variables
- **Database Connection Test**: Tests connectivity to your Supabase project
- **Table Verification**: Checks for expected database tables and their data
- **Write Permission Testing**: Validates insert/delete operations work correctly
- **Detailed Recommendations**: Provides specific guidance for fixing any issues found
- **Real-time Status Updates**: Beautiful UI with live verification status

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <your-repo-url>
   cd supabase-verification-app
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

3. **Run the Application**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to `http://localhost:3000` to see the verification interface.

## Getting Your Supabase Keys

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to Settings → API
4. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** key → `SUPABASE_SERVICE_ROLE_KEY`

## What Gets Verified

### Environment Configuration
- ✅ Supabase Project URL
- ✅ Anonymous (public) API key
- ✅ Service role (private) API key
- ✅ Project ID extraction

### Database Connection
- ✅ Connectivity test to Supabase
- ✅ Project authentication
- ✅ Error handling and diagnostics

### Table Verification
The app checks for these common tables:
- `users` - User profiles and data
- `profiles` - Extended user information
- `posts` - Content/posts table
- `comments` - User comments
- `categories` - Content categories

### Write Permissions
- ✅ Insert operation testing
- ✅ Delete operation testing
- ✅ Authentication system testing
- ✅ Row Level Security (RLS) validation

## Customization

### Adding Your Own Tables
Edit `src/app/api/verify-supabase/route.ts` and modify the `expectedTables` array:

```typescript
const expectedTables = ['users', 'profiles', 'your_custom_table']
```

### Customizing Verification Logic
The API route in `src/app/api/verify-supabase/route.ts` contains all verification logic. You can:
- Add new verification checks
- Modify existing table validation
- Customize recommendation messages
- Add specific business logic checks

## API Endpoints

### GET `/api/verify-supabase`
Returns a comprehensive verification report including:
- Environment configuration status
- Database connection results
- Table existence and data counts
- Write permission test results
- Actionable recommendations

## Technology Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Supabase JavaScript Client** - Official Supabase SDK

## Project Structure

```
src/
├── app/
│   ├── api/verify-supabase/route.ts  # Verification API endpoint
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Main verification page
├── components/ui/                    # Reusable UI components
│   ├── alert.tsx
│   ├── badge.tsx
│   ├── button.tsx
│   └── card.tsx
└── lib/
    └── utils.ts                      # Utility functions
```

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Troubleshooting

### Common Issues

1. **"Missing environment variables"**
   - Ensure `.env.local` exists and contains all required keys
   - Restart the development server after adding environment variables

2. **"Connection failed"**
   - Verify your Supabase project URL is correct
   - Check that your project isn't paused (free tier limitation)
   - Confirm API keys are copied correctly

3. **"Missing tables"**
   - Run your database migrations
   - Check table names match exactly (case-sensitive)
   - Verify table permissions and RLS policies

4. **"Write permissions failed"**
   - Check Row Level Security policies
   - Verify service role key has admin permissions
   - Ensure authentication is configured properly

### Debug Mode
Set `NODE_ENV=development` for detailed error messages and logs.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this in your own projects!

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review your Supabase project settings
3. Verify environment variable configuration
4. Check browser console for detailed error messages