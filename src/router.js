// 承载路由

import Vue from "vue";
import Router from "vue-router";

import Home from "./pages/Home";
import Index from "./pages/Index";
import Login from "./pages/Login";

Vue.use(Router);

export default new Router({
    // 配置路由与子路由
    routes:[
        {
            path:'/',
            name: "Home",
            component: Home,
            redirect: '/index',
            children:[
                {
                    path:"/index",
                    name: "Index",
                    component: Index
                },
                {
                    path: "/banner",
                    name: "Banner",
                    component: () => import('./pages/Banner')  // 路由的按需加载
                },
                {
                    path: "/product",
                    name: "Product",
                    component: () => import('./pages/Product')
                },
                {
                    path: "/news",
                    name: "News",
                    component: () => import('./pages/News')
                },
                {
                    path: "/newsCategory",
                    name: "NewsCategory",
                    component: () => import('./pages/NewsCategory')
                }
            ]
        },
        {
            path: "/login",
            name: "Login",
            component: Login
        }
    ]
})