const path = require('path');
const webpack = require('webpack');
const WatchIgnorePlugin = webpack.WatchIgnorePlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AureliaWebpackPlugin = require('aurelia-webpack-plugin');
const project = require('./package.json');

const ENV = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || 'development';
const DEBUG = ENV !== 'production';
const metadata = {
  port: process.env.WEBPACK_PORT || 9000,
  host: process.env.WEBPACK_HOST || '0.0.0.0',
  ENV: ENV,
  HMR: process.argv.join('').indexOf('hot') >= 0 || !!process.env.WEBPACK_HMR
};
const outDir = path.resolve('dist');
const coreBundles = {
  bootstrap: [
    'aurelia-polyfills',
    'aurelia-pal',
    'aurelia-pal-browser',
    'regenerator-runtime',
    'bluebird'
  ],
  aurelia: Object.keys(project.dependencies).filter(dep => dep.startsWith('aurelia-'))
};

module.exports = {
  devtool: 'inline-source-map',
  entry: {
    'app': ['./src/main'],
    'bootstrap': coreBundles.bootstrap,
    'aurelia': coreBundles.aurelia.filter(pkg => coreBundles.bootstrap.indexOf(pkg) === -1)
  },
  externals: { 'interact.js/dist/interact': 'interact' },
  output: {
    path: outDir,
    filename: DEBUG ? '[name].bundle.js' : '[name].[chunkhash].bundle.js',
    sourceMapFilename: DEBUG ? '[name].bundle.map' : '[name].[chunkhash].bundle.map',
    chunkFilename: DEBUG ? '[id].chunk.js' : '[id].[chunkhash].chunk.js'
  },
  resolve: {
    modules: [path.resolve(), 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/, // or include: path.resolve('src'),
        loader: 'babel-loader'
      },
      {
        test: /\.html$/,
        exclude: /index\.html$/, // index.html will be taken care by HtmlWebpackPlugin
        use: [
          'raw-loader',
          'html-minifier-loader'
        ]
      },
      {
        test: /\.(less|css)$/,
        use: [
          {
            loader: 'style-loader',
            query: {
              singleton: !DEBUG
            }
          },
          {
            loader: 'css-loader',
            query: {
              minimize: !DEBUG // <--- Enable style minification if production
            }
          },
          {
            loader: 'less-loader'
          }
          //'postcss-loader' TODO and extracttext
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|woff|woff2|ttf)$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: '[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new WatchIgnorePlugin([
      path.resolve(__dirname, './src/db.json')
    ]),
    new webpack.LoaderOptionsPlugin({
      debug: DEBUG,
      devtool: 'source-map',
      options: {
        context: __dirname,
        'html-minifier-loader': {
          removeComments: true,               // remove all comments
          collapseWhitespace: true,           // collapse white space between block elements (div, header, footer, p etc...)
          collapseInlineTagWhitespace: true,  // collapse white space between inline elements (button, span, i, b, a etc...)
          collapseBooleanAttributes: true,    // <input required="required"/> => <input required />
          removeAttributeQuotes: true,        // <input class="abcd" /> => <input class=abcd />
          minifyCSS: true,                    // <input style="display: inline-block; width: 50px;" /> => <input style="display:inline-block;width:50px;"/>
          minifyJS: true,                     // same with CSS but for javascript
          removeScriptTypeAttributes: true,   // <script type="text/javascript"> => <script>
          removeStyleLinkTypeAttributes: true // <link type="text/css" /> => <link />
        }
      }
    }),
    new webpack.ProvidePlugin({
      regeneratorRuntime: 'regenerator-runtime', // to support await/async syntax
      Promise: 'bluebird', // because Edge browser has slow native Promise object
      jQuery: 'jquery', // because 'bootstrap' by Twitter depends on jQuery
      $: 'jquery' // just an alias
    }),
    new AureliaWebpackPlugin({
      root: path.resolve(),
      src: path.resolve('src')
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: 'head'
    }),
    new webpack.optimize.CommonsChunkPlugin({ // to eliminate code duplication across bundles
      name: ['aurelia']
    })
  ].concat(DEBUG ? [

  ] : [
    new webpack.optimize.UglifyJsPlugin({
      mangle: { screw_ie8: true, keep_fnames: true },
      dead_code: true,
      unused: true,
      comments: true,
      compress: {
        screw_ie8: true,
        keep_fnames: true,
        drop_debugger: false,
        dead_code: false,
        unused: false,
        warnings: false
      }
    })
  ]),
  devServer: {
    port: metadata.port,
    host: metadata.host,
    historyApiFallback: true,
    stats: 'errors-only',
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  }
};
