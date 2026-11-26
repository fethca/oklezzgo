import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { defineConfig } from 'vite'

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
        },
      }
    },
  }
}

export default defineConfig(async () => ({
  plugins: [react(), injectPackageVersion()],
  server: {
    port: 1420,
    proxy: { '/api': 'http://localhost:3000' },
  },
}))
