const path = require('path');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
/**不刷新的情况下实现热更新，保留react状态的插件 */
// const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

// 合并公共配置,并添加开发环境配置
module.exports = merge(commonConfig, {
  mode: 'development', // 开发模式,打包更加快速,省了代码优化步骤
  devtool: 'eval-cheap-module-source-map', // 源码调试模式,后面会讲
  devServer: {
    port: 3000, // 服务端口号
    compress: false, // gzip压缩,开发环境不开启,提升热更新速度
    hot: true, // 开启热更新，后面会讲react模块热替换具体配置
    historyApiFallback: true, // 解决history路由404问题
    static: {
      directory: path.join(__dirname, "../public"), //托管静态资源public文件夹
    },
    open: true,
    // host: '0.0.0.0', //指定要使用的 host。如果你想让你的服务器可以被外部访问，
    proxy: {
      '/api': {
        target: 'http://localhost:3000',   //对 /api/users 的请求会将请求代理到 http://localhost:3000/api/users。
        pathRewrite: { '^/api': '' },   //不希望传递/api，则重写路径：
        secure: false,
        changeOrigin: true,  //允许跨域
      },
    },
  },
  // plugins: [
  //   new ReactRefreshWebpackPlugin(), // 添加热更新插件
  // ]
})