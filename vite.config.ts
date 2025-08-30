import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/index.ts',
      name: 'Icons',
      fileName: (format) => `icons.${format}.js`,
      formats: ['iife']
    },
    rollupOptions: {
      external: ['vitarx'],
      output: {
        globals: {
          vitarx: 'Vitarx'
        }
      }
    }
  }
})
