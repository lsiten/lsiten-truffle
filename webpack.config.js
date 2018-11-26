/*!
 * Webpack config
 * create: 2018/09/08
 * since: 0.0.1
 */
'use strict';

const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const tool_node = require('./tools/node');
const config = require('./config.local.js');
const pkg = require('./package.json');

const WebpackMiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackOptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const WebpackUglifyjsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// const shims = '<!--[if lt IE 9]><script type="text/javascript" src="./assets/html5shiv/js/html5shiv.min.js"></script><script type="text/javascript" src="./assets/respond-js/js/respond.min.js"></script><script type="text/javascript" src="./assets/json3/js/json3.min.js"></script><script type="text/javascript" src="./assets/es5-shim/js/es5-shim.js"></script><script type="text/javascript" src="./assets/es5-shim/js/es5-sham.js"></script><![endif]-->';

// const shims2 = '<!--[if lt IE 9]><script type="text/javascript" src="../assets/html5shiv/js/html5shiv.min.js"></script><script type="text/javascript" src="../assets/respond-js/js/respond.min.js"></script><script type="text/javascript" src="../assets/json3/js/json3.min.js"></script><script type="text/javascript" src="../assets/es5-shim/js/es5-shim.js"></script><script type="text/javascript" src="../assets/es5-shim/js/es5-sham.js"></script><![endif]-->';

module.exports = (env, argv) => {
  const out_base_path = './dist';
  const in_base_path = 'src';
  const base_path = __dirname;
  const entry_path = `${base_path}/${in_base_path}/js`;
  const output_path = `${base_path}/${out_base_path}/js`;
  const htmlPath = path.resolve(base_path, 'src/html');
  const pageTree = tool_node.fileTree(htmlPath);
  const htmlArr = [];
  const prod = argv.mode == 'production';
  const min = prod ? '.min' : '';

  let entries = {};
  fs.readdirSync(entry_path).forEach(filename => {
    if (!fs.statSync(`${entry_path}/${filename}`).isFile()) return;

    let name = path.parse(filename).name;
    entries[name] = `${entry_path}/${name}`;
  });

  pageTree.forEach(page => {
    let _pages = path.parse(path.relative(htmlPath, page));
    let pageName = path.parse(page).name;
    let permission = new Set(config.pagePermission);
    for(let i=0,max=config.pageignore.length; i<max; i++){
      if(pageName == config.pageignore[i]) return;
    }
    htmlArr.push(new HtmlWebpackPlugin({
      title: {
        min,
        author: pkg.author,
        keywords: pkg.keywords.join(', '),
        description: pkg.description,
        // shims: permission.has(pageName) ? shims2 : shims,
        // hrefPrefix: prod ? '/portal/' : '/',
      },
      template: path.resolve(page),
      filename: path.resolve(base_path, out_base_path, `${path.join(_pages.dir, `/${_pages.name}`)}.html`),
      inject: false,
    }));
  });
  return {
    entry: entries,
    output: {
      path: output_path,
      filename: `[name]${min}.js`,
    },
    resolve: {
      alias: {
      },
    },
    externals: {
      json3: 'JSON3',
      jquery: 'jQuery',
    },
    module: {
      rules: [
        {
          test: /\.pug$/,
          use: ['pug-loader'],
        },
        {
          test: /\.css$/,
          use: [
            WebpackMiniCssExtractPlugin.loader,
            'css-loader?sourceMap',
            'postcss-loader?sourceMap',
          ],
        },
        {
          test: /\.scss$/,
          use: [
            WebpackMiniCssExtractPlugin.loader,
            'css-loader?sourceMap',
            'postcss-loader?sourceMap',
            'sass-loader?sourceMap',
          ],
        },
        {
          test: /\.js?$/,
          use: ['babel-loader'],
          exclude: /node_modules/,
        },
        {
          test: /\.(gif|jpe?g|png)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                fallback: 'file-loader',
                limit: 8192,
                name: '../images/[name].[ext]',
              },
            },
          ],
        },
        {
          test: /\.(ttc|ttf|woff|eot|svg|woff2|otf)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                fallback: 'file-loader',
                limit: 8192,
                name: '../fonts/[name].[ext]',
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimizer: [
        new WebpackUglifyjsPlugin({
          uglifyOptions: {
            output: { comments: false },
            ie8: true,
          },
        }),
        new WebpackOptimizeCSSAssetsPlugin({
          cssProcessorOptions: { discardComments: { removeAll: true } },
        }),
      ],
      splitChunks: {
        cacheGroups: {
          common: {
            chunks: 'all',
            minChunks: 2,
            minSize: 1,
            name: 'common',
          },
        },
      },
    },
    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new WebpackMiniCssExtractPlugin({ filename: `../css/[name]${min}.css` }),
    ].concat(htmlArr),
  };
};
