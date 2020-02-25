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
                    component: Index,
                    meta: { title: '系统首页' }
                },
                {
                    path: "/IndexBanner",
                    name: "IndexBanner",
                    meta: { title: '首页轮播图' },
                    component: () => import('./pages/IndexBanner')  // 路由的按需加载
                },
                {
                    path: "/NewsBanner",
                    name: "NewsBanner",
                    meta: { title: '新闻轮播图' },
                    component: () => import('./pages/NewsBanner')
                },
                {
                    path: "/Product",
                    name: "Product",
                    meta: { title: '产品管理' },
                    component: () => import('./pages/Product')
                },
                {
                    path: "/News",
                    name: "News",
                    meta: { title: '新闻列表' },
                    component: () => import('./pages/News')
                },
                {
                    path: "/NewsCategory",
                    name: "NewsCategory",
                    meta: { title: '新闻分类' },
                    component: () => import('./pages/NewsCategory')
                },
                {
                    path: "/LessonChapter",
                    name: "LessonChapter",
                    meta: { title: '课程大章' },
                    component: () => import("./pages/LessonChapter")
                },
                {
                    path: "/LessonSection",
                    name: "LessonSection",
                    meta: { title: '课程小节' },
                    component: () => import("./pages/LessonSection")
                },
                {
                    path:"/Order",
                    name:"Order",
                    meta: { title: '订单列表' },
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