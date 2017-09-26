const webpack = require('webpack');
const path = require('path');

module.exports = {
  devtool: 'inline-source-map',
  entry: {
    bundle: path.join(__dirname, './src/index.js')
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '../public/v2/'),
  },
  module: {
    loaders: [
      {
        rules: [
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          },
          {
            test: /\.scss$/,
            use: [ "style-loader", "css-loader", "sass-loader" ]
          }
        ]
      },
      {
        loader: "babel-loader",
        include: [
          path.join(__dirname, "/src/"),
        ],
        test: /\.jsx?$/,
        query: {
          presets: ['es2015', 'react']
        }
      },
    ]
  }
}