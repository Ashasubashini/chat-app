import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  console.log('Loaded env:' ,env);
  return {
    define: {
      "process.env.VITE_SERVER_URL": JSON.stringify(env.VITE_SERVER_URL)
    },
    plugins: [react(), tailwindcss()],
  }
});