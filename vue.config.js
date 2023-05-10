const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    lintOnSave: false,
    runtimeCompiler: true,
    publicPath: './', // 基本路径
    outputDir: 'dist', // 输出文件目录
    assetsDir: "static", //放置生成的静态文件目录（js css img）
    productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
    transpileDependencies: true,
    devServer: {
        // 设置代理
        proxy: {
            "/api": {
                target: "http://localhost:5000", // 访问数据的计算机域名
                ws: true, // 是否启用websockets
                changOrigin: true, //开启代理,
                pathRewrite: { // 重写代理规则，/api开头，代理到/
                    '^/api': '/'
                    // 例：/api/user/login代理到
                    // http://localhost:5000/user/login
                }
            }
        }
    },

    configureWebpack: {
        performance: {
            hints: 'warning',
            //入口起点的最大体积
            maxEntrypointSize: 50000000,
            //生成文件的最大体积
            maxAssetSize: 30000000,
            // 只给出 js 文件的性能提示
            assetFilter: function (assetFilename) {
                return assetFilename.endsWith('.js')
            }
        }
    }
})