import { defineConfig } from 'vite'
import vitarx from '@vitarx/vite-bundler'

export default defineConfig({
  plugins: [vitarx()],
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/index.ts',
      name: 'Icons',
      fileName: (format) => `icons.${format}.js`,
      formats: ['umd']
    },
    rollupOptions: {
      external: ['vitarx', 'vitarx/jsx-runtime'],
      output: {
        globals: {
          vitarx: 'Vitarx',
          'vitarx/jsx-runtime': 'Vitarx'
        }
      }
    }
  }
})
