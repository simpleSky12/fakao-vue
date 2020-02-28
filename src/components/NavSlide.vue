<template>
    <div class="slide">
        <el-menu class="slide-el-menu"
                 :default-active="onRoutes"
                 :collapse="collapse"
                 text-color="#bfcbd9"
                 active-text-color="#20a0ff"
                 unique-opened
                 router
                 background-color="#324157">
            <template v-for="menuItem in menuItems">
                <!--判断是否有子级导航栏-->
                <template v-if="menuItem.subs">
                    <el-submenu :index="menuItem.index" :key="menuItem.index">
                        <!--多级分类的父类标题-->
                        <template slot="title">
                            <i :class="menuItem.icon"></i>
                            <span slot="title">{{menuItem.title}}</span>
                        </template>
                        <!--遍历子级分类-->
                        <template v-for="subItem in menuItem.subs">
                            <el-menu-item :index="subItem.index" :key="subItem.index">
                                {{subItem.title}}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <!--没有子级分类的菜单栏-->
                <template v-else>
                    <el-menu-item :index="menuItem.index" :key="menuItem.index">
                        <i :class="menuItem.icon"></i>
                        <span slot="title">{{menuItem.title}}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import Bus from "../utils/Bus";

    export default {
        name: "NavSlide",
        data() {
            return {
                collapse: false,
                menuItems: [
                    {
                        icon: "el-icon-s-home",
                        index: "Index",
                        title: "系统首页"
                    },
                    {
                        icon: "el-icon-s-shop",
                        index: "Product",
                        title: "产品管理"
                    },
                    {
                        icon: "el-icon-picture",
                        index: "3",
                        title: "轮播图管理",
                        subs: [
                            {
                                index: "IndexBanner",
                                title: "首页轮播图"
                            },
                            {
                                index: "NewsBanner",
                                title: "新闻轮播图"
                            }
                        ]
                    },
                    {
                        icon: "el-icon-tickets",
                        index: "4",
                        title: "新闻管理",
                        subs: [
                            {
                                index: "NewsCategory",
                                title: "新闻分类"
                            },
                            {
                                index: "News",
                                title: "新闻列表"
                            }
                        ]
                    },
                    {
                        icon: "el-icon-video-camera-solid",
                        index: "5",
                        title: "课程视频管理",
                        subs:[
                            {
                                index:"LessonChapter",
                                title:"课程大章"
                            },
                            {
                                index: "LessonSection",
                                title: "课程小节"
                            }
                        ]
                    },
                    {
                        icon: "el-icon-s-order",
                        index: "Order",
                        title: "订单列表"
                    }

                ]
            }
        },
        computed: {
            onRoutes() {
                return this.$route.path.replace('/', '');
            }
        },
        created() {
            // 组件间的通信，折叠侧边栏
            Bus.$on("collapse", msg => {
                this.collapse = msg;
                Bus.$emit("collapse-content", msg);
            });
        }
    }
</script>

<style lang="scss">
    .slide {
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom: 0;
        overflow-y: scroll;
        text-align: left;

        &::-webkit-scrollbar {
            width: 0;
        }

        & > ul {
            height: 100%;
        }

        .slide-el-menu {
            &:not(.el-menu--collapse) {
                width: 250px;
            }
        }
    }
</style>