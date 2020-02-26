module.exports = {
    // 代理跨域
    devServer: {
        host: "localhost",
        port: 9090,
        // 代理拦截，自动跳转
        proxy: {
            "/api": {
                target: "http://3dff54.natappfree.cc",
                changeOrigin: true, // 将主机的点设为原点
                pathRewrite: {
                    "/api": "" // 添加主机的转发规则
                }
            }
        }
    }
};