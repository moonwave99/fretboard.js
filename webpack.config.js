const path = require('path');

module.exports = {
  entry: './demo/index.js',
  output: {
    filename: 'demo.js',
    path: path.resolve(__dirname, 'demo'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'demo'),
    compress: true,
    port: 9000
  },
};
