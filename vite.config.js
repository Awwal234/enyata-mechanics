import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": "http://localhost:5000/api",
      "/meters": "http://localhost:5000/api",
      "/payments": "http://localhost:5000/api",
      "/iot": "http://localhost:5000/api",
    },
  },
});
