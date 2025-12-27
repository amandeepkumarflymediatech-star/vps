// Helper to check if Google OAuth is configured
export const isGoogleAuthEnabled = () => {
  return !!import.meta.env.VITE_GOOGLE_CLIENT_ID;
};

// Get Google Client ID
export const getGoogleClientId = () => {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID || null;
};

