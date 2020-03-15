module.exports = {
    // 代理跨域
    devServer: {
        host: "localhost",
        port: 9090,
        // 代理拦截，自动跳转
        proxy: {
            "/api": {
                target: "https://fk.c8xh.com/",
                changeOrigin: true, // 将主机的点设为原点
                /*pathRewrite: {
                    "/api": "" // 添加主机的转发规则
                }*/
            }
        }
    },
    productionSourceMap:false,
    // 产出页面中head头部标签中的 预加载文件，即rel=“prefetch”
    chainWebpack:(config) => {
        config.plugins.delete('prefetch');
    }
};