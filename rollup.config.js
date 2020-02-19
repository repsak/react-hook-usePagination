import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'

const allModules = require ('./publish/readModules')

function buildEntityConfig(entity) {

  return {
    input: entity.input,
    output: {
      file: `dest/${entity.output.file}.min.js`,
      format: 'umd',
      name: entity.output.file
    },

    plugins: [
      babel({
        exclude: 'node_modules/**',
        presets: ['@babel/env']
      }),
      resolve(),
      commonjs(),
      uglify()
    ].concat(entity.plugins || null).filter(Boolean),

    external: [].concat(entity.external || null).filter(Boolean)
  }
}

const rollupConfig = allModules.map(dir => {
  return buildEntityConfig({
    input: `src/${dir}/index.js`,
    output: { file: dir}
  })
})

rollupConfig.push(buildEntityConfig({
  input: `src/index.js`,
  output: { file: 'index'}
}))

export default rollupConfig
