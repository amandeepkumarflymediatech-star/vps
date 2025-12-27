# Google OAuth Setup Guide

## Problem Fixed
The Google Login button was showing errors because the Google Client ID was not configured. The app now handles this gracefully:
- Google Login buttons only appear if Client ID is configured
- App works normally without Google Login
- Console warning shows setup instructions in development mode

## How to Enable Google Login

### Step 1: Get Google OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: **Web application**
   - Name: "The English Raj" (or any name)
   - Authorized JavaScript origins:
     - `http://localhost:5173`
     - `http://localhost:5174`
     - `http://localhost:3000` (if using different port)
   - Authorized redirect URIs:
     - `http://localhost:5173`
     - `http://localhost:5174`
     - `http://localhost:3000` (if using different port)
   - Click "Create"
   - Copy the **Client ID** (looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)

### Step 2: Configure Frontend

1. Create a `.env` file in the `frontend` folder (if it doesn't exist)
2. Add the following line:
   ```env
   VITE_GOOGLE_CLIENT_ID=your-client-id-here
   ```
   Replace `your-client-id-here` with the Client ID you copied

3. Restart your frontend development server:
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

### Step 3: Test Google Login

1. The Google Login button should now appear on Login and Register pages
2. Click it to test the Google Sign-In flow
3. After successful login, you should be redirected to the dashboard

## Troubleshooting

### Still seeing errors?
- Make sure the `.env` file is in the `frontend` folder (not `backend`)
- Make sure the variable name is exactly: `VITE_GOOGLE_CLIENT_ID`
- Restart the dev server after creating/modifying `.env`
- Check browser console for any error messages

### Google Login button not showing?
- Check if `VITE_GOOGLE_CLIENT_ID` is set in `.env`
- Check browser console for warnings
- The button is hidden if Client ID is not configured (this is intentional)

### 403 Error from Google?
- Make sure you've added the correct origins in Google Cloud Console
- Make sure the port matches (5173 for Vite default)
- Wait a few minutes after creating credentials (Google needs time to propagate)

## Optional: Disable Google Login

If you don't want to use Google Login, simply:
- Don't create the `.env` file, OR
- Don't add `VITE_GOOGLE_CLIENT_ID` to `.env`

The app will work perfectly without it - Google Login buttons just won't appear.

