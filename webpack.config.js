const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: './src/index.js',
    css: './src/css/style.scss'
  },
  output: {
    filename: 'bundle-[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].css'
            },
          },
          { loader: 'extract-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ]
      }
    ]
  },
  watch: true,
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
};
