# Backend API Documentation

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Create `.env` file** in the `backend` folder:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/theenglishraj
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

3. **Start MongoDB** (if not running)
   ```bash
   # Windows (if installed as service, it should auto-start)
   # Or use MongoDB Atlas connection string
   ```

4. **Start Server**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication Routes (`/api/auth`)

- **POST `/api/auth/register`** - Register new user
  - Body: `{ name, email, phone, password }`
  - Returns: `{ message: "Registered successfully" }`

- **POST `/api/auth/login`** - Login user
  - Body: `{ email, password }`
  - Returns: `{ message, token, user }`

- **POST `/api/auth/google`** - Google OAuth login
  - Body: `{ name, email, picture, googleId }`
  - Returns: `{ message, token, user }`

- **POST `/api/auth/forgot-password`** - Send password reset OTP
  - Body: `{ email }`
  - Returns: `{ message }`

- **POST `/api/auth/reset-password`** - Reset password with OTP
  - Body: `{ email, otp, newPassword }`
  - Returns: `{ message }`

- **POST `/api/auth/verify-register-otp`** - Verify registration OTP
  - Body: `{ email, otp }`
  - Returns: `{ message, token, user }`

### OTP Routes (`/api/otp`)

- **POST `/api/otp/send`** - Send OTP to email
  - Body: `{ email }`
  - Returns: `{ message: "OTP sent successfully" }`

- **POST `/api/otp/verify`** - Verify OTP
  - Body: `{ email, otp }`
  - Returns: `{ message: "OTP verified successfully" }`

## Troubleshooting

### 404 Errors
- Make sure the server is running on port 5000
- Check that MongoDB is running and connected
- Verify `.env` file exists with correct values
- Check server console for route logs

### Email Not Sending
- If `EMAIL_USER` and `EMAIL_PASS` are not set, OTP will be logged to console
- For Gmail, use App Password: https://support.google.com/accounts/answer/185833

### MongoDB Connection Issues
- Verify MongoDB is running: `mongosh` or check MongoDB service
- Check `MONGO_URI` in `.env` file
- For MongoDB Atlas, use the connection string provided

