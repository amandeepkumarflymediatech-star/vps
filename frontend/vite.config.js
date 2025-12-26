import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  
  extend: {
  colors: {
    primary: "#0852A1",
    primaryDark: "#063F7C",
  },
},

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
