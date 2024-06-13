import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

function injectPackageVersion() {
  return {
    name: 'inject-package-version',
    config() {
      const path = resolve(process.cwd(), 'package.json')
      const packageJson = JSON.parse(readFileSync(path, 'utf-8'))
      const version = packageJson.version

      return {
        define: {
          __APP_VERSION__: JSON.stringify(version),
          VITE_API_URL: '__VITE_API_URL__', //placeholders replaced at runtime
          VITE_RADARR_URL: '__VITE_RADARR_URL__',
        },
      }
    },
  }
}

export default defineConfig(async () => ({
  plugins: [react(), tsconfigPaths(), injectPackageVersion()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    proxy: { '/api': 'http://localhost:3000' },
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },
}))
