# URL Shortener - Frontend Test Submission

## Overview
This is a production-grade React-based URL Shortener Web Application built according to AffordMed Campus Hiring guidelines.

## Features
- ✅ Shorten up to 5 URLs simultaneously
- ✅ Custom shortcode generation with validation
- ✅ URL expiry management (configurable, default 30 minutes)
- ✅ Client-side validation for URLs and shortcodes
- ✅ Click tracking and analytics
- ✅ Statistics dashboard with detailed analytics
- ✅ localStorage persistence for session data
- ✅ Custom logging middleware (no console.log usage)
- ✅ AffordMed API integration ready (authentication & logging)
- ✅ Responsive design with modern UI components
- ✅ Error handling for expired/invalid URLs

## Technical Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui (following Material UI principles)
- **Routing**: Wouter
- **State Management**: React hooks with localStorage persistence
- **Validation**: Zod schemas
- **Date Handling**: date-fns
- **Icons**: Lucide React

## AffordMed Integration

### Current Status
The logging middleware is ready to integrate with AffordMed's evaluation service. Currently, it works locally, but can automatically switch to the AffordMed API once credentials are provided.

### To Enable AffordMed Integration

1. **Register with AffordMed** to get your credentials:
   - Client ID
   - Client Secret
   - Access Code (from email)

2. **Set Environment Variables** (when you have credentials):
   ```bash
   AFFORDMED_EMAIL=your-college@email.edu
   AFFORDMED_NAME="Your Full Name"
   AFFORDMED_ROLL_NO=your-roll-number
   AFFORDMED_ACCESS_CODE=provided-access-code
   AFFORDMED_CLIENT_ID=your-client-id
   AFFORDMED_CLIENT_SECRET=your-client-secret
   ```

3. **Automatic Switching**: The logger will automatically:
   - Try to authenticate with AffordMed API
   - Send logs to their evaluation service
   - Fall back to local logging if credentials aren't available

### Current Logging Behavior
- **Without credentials**: Logs stored locally in localStorage and displayed in UI
- **With credentials**: Logs sent to AffordMed API + local backup
- **API failure**: Automatic fallback to local logging

## Project Structure
