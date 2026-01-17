import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    ...(mode == 'lib'
      ? [
          dts({
            entryRoot: 'src',
            outDir: 'dist/types',
            include: 'src/index.ts',
            tsconfigPath: path.resolve(__dirname, 'tsconfig.lib.json'),
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 6999,
  },
  build:
    mode === 'lib'
      ? {
          outDir: 'dist',
          emptyOutDir: true,
          cssCodeSplit: true,
          lib: {
            entry: {
              index: path.resolve(__dirname, 'src/index.ts'),
            },
            name: 'BookingPortal',
            formats: ['es', 'cjs'],
            fileName: (format) => `booking-portal.${format}.js`,
          },
          rollupOptions: {
            external: ['react', 'react-dom'],
          },
        }
      : {
          outDir: 'build',
        },
}))
