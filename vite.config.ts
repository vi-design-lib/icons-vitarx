import { defineConfig } from 'vite'
import vitarx from 'vite-plugin-vitarx'
import dtsPlugin from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vitarx(),
    dtsPlugin({
      insertTypesEntry: true,
      include: ['src'],
      rollupTypes: true
    })
  ],
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/index.ts',
      name: 'Icons',
      fileName: (format) => `icons.${format}.js`,
      formats: ['es', 'umd']
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
