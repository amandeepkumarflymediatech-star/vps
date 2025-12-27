# Quick Start Guide - Fix 404 Errors

## Problem: Getting 404 on `/api/otp/send`

This usually means the **backend server is not running**.

## Solution:

### Step 1: Start the Backend Server

Open a **NEW terminal window** and run:

```bash
cd backend
npm install  # (if you haven't already)
npm start
```

You should see:
```
✅ MongoDB Connected
✅ Server running on http://localhost:5000
```

### Step 2: Verify Server is Running

Open your browser and go to:
- http://localhost:5000

You should see: `{ "message": "Backend running 🚀" }`

### Step 3: Test the API

Go to:
- http://localhost:5000/api/test

You should see API status.

### Step 4: Keep Both Servers Running

You need **TWO terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Common Issues:

### Issue 1: MongoDB Not Connected
**Error:** `❌ MongoDB Error`

**Solution:** 
- Make sure MongoDB is running
- Check `.env` file has correct `MONGO_URI`
- If using MongoDB Atlas, verify connection string

### Issue 2: Port Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
- Kill the process using port 5000
- Or change PORT in `.env` file

### Issue 3: Routes Not Found
**Error:** 404 on all routes

**Solution:**
- Make sure server started successfully
- Check console for route logs: `📥 POST /api/otp/send`
- Restart the server

## Verification Checklist:

- [ ] Backend server is running (check terminal)
- [ ] MongoDB is connected (check terminal for "✅ MongoDB Connected")
- [ ] Can access http://localhost:5000
- [ ] Frontend is running on http://localhost:5173
- [ ] Both servers are running simultaneously

