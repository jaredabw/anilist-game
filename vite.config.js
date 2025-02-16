import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import graphqlLoader from 'vite-plugin-graphql-loader';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    graphqlLoader(),
  ],
  server: {
    historyApiFallback: true,
  },
  build: {
    outDir: 'dist',
  },
})
