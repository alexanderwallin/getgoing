const path = require('path')

module.exports = {
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'public/js'),
    publicPath: '/js',
    filename: 'app.js',
    sourceMapFilename: '[file].map',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    alias: {
      src: path.join(__dirname, 'src'),
    },
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 8261,
    historyApiFallback: {
      index: 'index.html',
    },
    inline: true,
  },
}
