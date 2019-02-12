import nodePath from 'path'
import pkg from './package.json'

const buildDir = 'dist'
const moduleFormat = 'cjs'

const nodeModules = ['fs']

export default {
  input: 'lib/index.ts',
  external: nodeModules.concat(Object.keys(pkg.dependencies || {})),
  output: {
    file: nodePath.join(buildDir, 'index.js'),
    format: moduleFormat,
    name: 'index',
    sourcemap: true
  },
  plugins: [

  ]
}
