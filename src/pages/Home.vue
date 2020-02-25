<template>
    <div class="home wrapper">
        <nav-header></nav-header>
        <nav-Slide></nav-Slide>
        <!--collapse 表示折叠面板-->
        <div class="content-box" :class="{'content-collapse':collapse}">
            <nav-tags></nav-tags>
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view></router-view>
                    </keep-alive>
                </transition>
                <el-backtop target=".content"></el-backtop>
            </div>
        </div>
    </div>
</template>

<script>
    import NavHeader from "../components/NavHeader";
    import NavSlide from "../components/NavSlide";
    import NavTags from "../components/NavTags";
    import Bus from "../utils/Bus";

    export default {
        name: "home",
        components: {
            NavHeader,
            NavSlide,
            NavTags
        },
        data() {
            return {
                tagsList: [],
                collapse: false
            }
        },
        created() {
            Bus.$on('collapse-content', msg => {
                this.collapse = msg;
            });

            Bus.$on('tags', msg => {
                let arr = [];
                for (let i = 0; i < msg.length; i++) {
                    msg[i].name && arr.push(msg[i].name);
                }
                this.tagsList = arr;
            });
        }

    }
</script>