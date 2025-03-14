module.exports = {
    configureWebpack: {
        entry: './src/main.js', // 自定义入口文件
    },
    devServer: {
        proxy: {
            '^/api': {
                target: 'http://localhost:5000', // 你的后端服务器地址
                changeOrigin: true,
                pathRewrite: { '^/api': '' }, // 去掉 /api 前缀
            },
        },
    },
};
