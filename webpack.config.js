'use strict';

const DEVELOPMENT = 'development';
const PRODUCTION = 'production';
const NODE_ENV = process.env.NODE_ENV || DEVELOPMENT;

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const plugins = [new webpack.NoErrorsPlugin(), new webpack.DefinePlugin({
  NODE_ENV: JSON.stringify(NODE_ENV)
}), new ExtractTextPlugin('styles.css')];

if (NODE_ENV == PRODUCTION) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false, drop_console: true, unsafe: true
    }
  }));
}


module.exports = {
  context: __dirname, entry: {
    app: "./app", gifts: "./gifts", tasks: "./tasks", faq: "./faq"
  }, output: {
    path: __dirname + "/public", filename: "[name].js"
  },

  watch: NODE_ENV !== PRODUCTION, watchOptions: {
    aggregateTimeout: 100
  },

  devtool: NODE_ENV !== PRODUCTION ? 'module-source-map' : null,

  plugins: plugins,

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: [ "babel?presets[]=es2015" ]
    }, {
      test: /\.hbs/, loader: "handlebars-loader", exclude: /(node_modules)/
    }, {
      exclude: /(node_modules)/,
      test: /\.less$/,
      loader: ExtractTextPlugin.extract('css-loader?sourceMap!less-loader?sourceMap')
    }, {
      test: /\.(png|jpg)$/, loader: "file?name=img/[name].[ext]"
    }, {
      test: /\.(eot|svg|woff|woff2|ttf|otf)$/, loader: "file?name=fonts/[name].[ext]"
    }]
  }
};