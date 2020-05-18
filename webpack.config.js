const path = require('path');

module.exports = {
  entry: {
    index: './demo/index.js',
    tetrachords: './demo/tetrachords.js'
  },
  output: {
    filename: '[name]-bundle.js',
    path: path.resolve(__dirname, 'demo'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'demo'),
    compress: true,
    port: 9000
  },
};
