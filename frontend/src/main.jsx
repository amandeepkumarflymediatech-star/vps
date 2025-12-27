// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import "./index.css";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
//       <App />
//     </GoogleOAuthProvider>
//   </React.StrictMode>
// );



import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

// Get Google Client ID from environment variable
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Warn if Google Client ID is not set (only in development)
if (!googleClientId && import.meta.env.DEV) {
  console.warn(
    "⚠️ Google Client ID not found. Google Login will be disabled.\n" +
    "To enable Google Login:\n" +
    "1. Create a .env file in the frontend folder\n" +
    "2. Add: VITE_GOOGLE_CLIENT_ID=your-google-client-id\n" +
    "3. Get your Client ID from: https://console.cloud.google.com/apis/credentials"
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {googleClientId ? (
      <GoogleOAuthProvider clientId={googleClientId}>
        <App />
      </GoogleOAuthProvider>
    ) : (
      <App />
    )}
  </React.StrictMode>
);




