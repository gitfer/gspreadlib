const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.js',
    css: './src/css/style.scss'
  },
  output: {
    filename: 'bundle-[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/public/'
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
            }
          },
          { loader: 'extract-loader' },
          { loader: 'css-loader' },
          {
            loader: 'sass-loader',
            options: {
              importer: function(url, prev) {
                if (url.indexOf('@material') === 0) {
                  var filePath = url.split('@material')[1];
                  var nodeModulePath = `./node_modules/@material/${filePath}`;
                  return { file: require('path').resolve(nodeModulePath) };
                }
                return { file: url };
              }
            }
          }
        ]
      }
    ]
  },
  watch: true,
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new CopyWebpackPlugin([{ from: 'public', to: 'public' }], {})
  ]
};
