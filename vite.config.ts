import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(({ command }) => {
  const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]

  return {
    base: command === 'build' && repositoryName ? `/${repositoryName}/` : '/',
    plugins: [react(), tailwindcss()],
  }
})
