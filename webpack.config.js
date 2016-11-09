const path = require('path')

module.exports = {
  entry: __dirname + '/src/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'dfaqapi.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.resolve('node_modules'),
          path.resolve('web_modules')
        ],
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
}
