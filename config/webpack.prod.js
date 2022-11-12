const path = require('path');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const globAll = require('glob-all')  //选择要检测哪些文件里面的类名和id还有标签名称,
const PurgeCSSPlugin = require('purgecss-webpack-plugin')  //移除未使用到的css样式.和mini-css-extract-plugin插件配合使用的
const CompressionPlugin  = require('compression-webpack-plugin')  //打包时生成 gzip资源

module.exports = merge(commonConfig, {
  mode: 'production', // 生产模式,会开启tree-shaking和压缩代码,以及其他优化
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(), // 压缩css
      new TerserPlugin({ // 压缩js
        parallel: true, // 开启多线程压缩
        terserOptions: {
          compress: {
            pure_funcs: ["console.log"] // 删除console.log
          }
        }
      }),
    ],
  },
  plugins: [
    // 复制文件插件
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'), // 复制public下文件
          to: path.resolve(__dirname, '../dist'), // 复制到dist目录中
          filter: source => {
            return !source.includes('index.html') // 忽略index.html
          }
        },
      ],
    }),
    // 抽离css插件
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css' // 抽离css的输出目录和名称
    }),
    new CompressionPlugin({
      test: /.(js|css)$/, // 只生成css,js压缩文件
      filename: '[path][base].gz', // 文件命名
      algorithm: 'gzip', // 压缩格式,默认是gzip
      threshold: 10240, // 只有大小大于该值的资源会被处理。默认值是 10k
      minRatio: 0.8 // 压缩率,默认值是 0.8
    }),
    // 清理无用css
    // new PurgeCSSPlugin({
    //   // 检测src下所有tsx文件和public下index.html中使用的类名和id和标签名称
    //   // 只打包这些文件中用到的样式
    //   paths: globAll.sync([
    //     `${path.join(__dirname, '../src')}/**/*.tsx`,
    //     path.join(__dirname, '../public/index.html')
    //   ]),
    //   /**
    //    * 插件本身也提供了一些白名单safelist属性,符合配置规则选择器都不会被删除掉,比如使用了组件库antd, purgecss-webpack-plugin插件检测src文件下tsx文件中使用的类名和id时
    //    * 是检测不到在src中使用antd组件的类名的,打包的时候就会把antd的类名都给过滤掉,可以配置一下安全选择列表,避免删除antd组件库的前缀ant。
    //    */
    //   safelist: {
    //     standard: [/^ant-/], // 过滤以ant-开头的类名，哪怕没用到也不删除
    //   }
    // }),
  ]
})