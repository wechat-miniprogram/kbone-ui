const path = require("path");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const TerserPlugin = require('terser-webpack-plugin')
const externalConf = require('./external')
const globby = require('globby')

const basePath = path.join(process.cwd(),'packages')
// 遍历 package/**/index.js 得到所有组件内容
let components = globby.sync(['**/index.js'],{
    cwd: basePath
})

components = components.reduce((accur,item)=>{
    accur[path.dirname(item)] = path.join(basePath,item) 
    return accur
},{})

module.exports = {
  mode: "production",
  entry: {
    index: path.join(process.cwd(), "src/index.js"),
    ...components
  },
  output: {
    path: path.resolve(process.cwd(), "./lib"),
    filename: "[name].js",
    library: "kbone-ui",
    libraryTarget: "umd",
    umdNamedDefine: true,
    libraryExport:"default",
    globalObject: 'this'
  },
  module:{
    rules: [
        {
          test: /\.(jsx?|babel|es6)$/,
          include: process.cwd(),
          exclude: /node_modules|utils\/popper\.js|utils\/date.\js/,
          loader: 'babel-loader'
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            compilerOptions: {
              preserveWhitespace: false
            }
          }
        },
        {
          test: /\.css$/,
          loaders: ['style-loader', 'css-loader']
        },
        {
          test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: path.posix.join('static', '[name].[hash:7].[ext]')
          }
        }
      ]
  },
  resolve:{
    extensions:['.js','.vue','.json'],
    modules: ['node_modules'],
    alias:{
        ...externalConf.alias
    }
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  },
  plugins: [
    new ProgressBarPlugin(),
    new VueLoaderPlugin()
  ]
};
