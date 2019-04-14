const presets = [
  [
    '@babel/preset-env',
    {
      targets: {
        ie: '11',
        edge: '17',
        firefox: '60',
        chrome: '67',
        safari: '11.1'
      },
      useBuiltIns: 'usage'
    }
  ]
]

module.exports = { presets }
