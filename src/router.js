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
            redirect: '/Index',
            children:[
                {
                    path:"/Index",
                    name: "Index",
                    component: Index
                },
                {
                    path: "/IndexBanner",
                    name: "IndexBanner",
                    component: () => import('./pages/IndexBanner')  // 路由的按需加载
                },
                {
                    path: "/NewsBanner",
                    name: "NewsBanner",
                    component: () => import('./pages/NewsBanner')
                },
                {
                    path: "/Product",
                    name: "Product",
                    component: () => import('./pages/Product')
                },
                {
                    path: "/News",
                    name: "News",
                    component: () => import('./pages/News')
                },
                {
                    path: "/NewsCategory",
                    name: "NewsCategory",
                    component: () => import('./pages/NewsCategory')
                },
                {
                    path: "/LessonChapter",
                    name: "LessonChapter",
                    component: () => import("./pages/LessonChapter")
                },
                {
                    path: "/LessonSection",
                    name: "LessonSection",
                    component: () => import("./pages/LessonSection")
                },
                {
                    path:"/Order",
                    name:"Order",
                    component: () => import("./pages/Order")
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