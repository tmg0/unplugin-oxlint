import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Oxlint from '../../src/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Oxlint({
      includes: ['src/**/*.{ts,vue}'],
      deny: ['correctness'],
      packageManager: 'npm',
    }),
  ],
})
