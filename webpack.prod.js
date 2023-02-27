/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-04-19 16:47:25
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-31 09:51:05
 */
const webpack = require('webpack')
const { merge } = require('webpack-merge');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const optimizeCss = require('optimize-css-assets-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const baseWebpackConfig = require('./webpack.base');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = merge(baseWebpackConfig, {
    mode: 'production',
    entry: [
        path.resolve(__dirname, './src/index.js')
    ],
    plugins: [
        // new UglifyJSPlugin(),
        new BundleAnalyzerPlugin({defaultSizes: 'parsed'}),
        new optimizeCss({
            assetNameRegExp: /\.css$/g,
            cssWikicessor: require('cssnano'),
            cssWikicessorOptions: {
                safe: true,
                discardComments: {
                    removeAll: true
                }
            }
        }),
        new ProgressBarPlugin()
    ],
    optimization: {
        minimize: true,
        nodeEnv: process.env.NODE_ENV,
        splitChunks: {
            chunks: "all",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests:1,
            automaticNameDelimiter: '--', // 分包打包生成文件的名称的连接符
            name:false,
            cacheGroups: { //  cacheGroups 缓存组，如：将某个特定的库打包
        
                antIcon: {
                    name: 'chunk-antIcon',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]@ant-design[\\/]/,
                    priority: 90,
                    reuseExistingChunk: true
                },
                tiklabPluginUI: {
                    name: 'chunk-tiklab-plugin-ui',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]tiklab-plugin-ui[\\/]/,
                    priority: 50,
                    reuseExistingChunk: true
                },
                tiklabUserUI: {
                    name: 'chunk-tiklab-user-ui',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]tiklab-user-ui[\\/]/,
                    priority: 50,
                    reuseExistingChunk: true
                },
                tiklabCoreUI: {
                    name: 'chunk-tiklab-core-ui',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]tiklab-core-ui[\\/]/,
                    priority: 50,
                    reuseExistingChunk: true
                },
                tiklabMessageUI: {
                    name: 'chunk-tiklab-message-ui',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]tiklab-message-ui[\\/]/,
                    priority: 80,
                    reuseExistingChunk: true
                },
                tiklabEamUI: {
                    name: 'chunk-tiklab-eam-ui',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]tiklab-eam-ui[\\/]/,
                    priority: 50,
                    reuseExistingChunk: true
                },
                tiklabPrivilegeUI: {
                    name: 'chunk-tiklab-privilege-ui',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]tiklab-privilege-ui[\\/]/,
                    priority: 70,
                    reuseExistingChunk: true
                },
                tiklabSlateUI: {
                    name: 'chunk-tiklab-slate-ui',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]tiklab-slate-ui[\\/]/,
                    priority: 70,
                    reuseExistingChunk: true
                },
                mobx: {
                    name: 'chunk-mobx',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]mobx[\\/]/,
                    priority: 80,
                    reuseExistingChunk: true
                },
                mobxReact: {
                    name: 'chunk-mobx-react',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]mobx-react[\\/]/,
                    priority: 80,
                    reuseExistingChunk: true
                },
             
                reactDom: {
                    name: 'chunk-react-dom',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]react-dom[\\/]/,
                    priority: 30,
                    reuseExistingChunk: true
                },
                antv: {
                    name: 'chunk-antv',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]@antv[\\/]/,
                    priority: -20,
                    reuseExistingChunk: true
                },
                antdUI: {
                    name: 'chunk-antdUI',
                    chunks: 'async',
                    test: /[\\/]node_modules[\\/]antd[\\/]/,
                    priority: 10,
                    reuseExistingChunk: true
                },
                icon: {
                    name: 'chunk-icon',
                    chunks: 'all',
                    test: /[\\/]src[\\/]font-icon[\\/]/,
                    priority: 90,
                    reuseExistingChunk: true
                },
                /* 提取共用部分，一下提取的部分会议commons 命名 */
                commons: {
                    name: 'commons',
                    test: function (module, chunks) {
                        if (/react/.test(module.context)) {
                            return true
                        }
                    },
                    chunks: 'all',
                    minChunks: 2, //  提取公共部分最少的文件数
                    // minportal: 0 // 提取公共部分最小的大小
                    // enforce: true
                }
            }
        },
        minimizer: [
            new TerserPlugin({  // 压缩js
                cache: true,
                parallel: true,
                terserOptions: {
                    compress: {
                        drop_console: true,
                        drop_debugger: true // 去除console.log 和debuger
                    },
                }
            })
        ]
    }
});
