<template>
    <div>

        <el-container style="height: 500px; border: 1px solid #eee">
            <el-container>
                <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                    <nav-slide></nav-slide>
                </el-aside>
                <el-main>
                    <nav-header></nav-header>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import NavHeader from "../components/NavHeader";
    import NavSlide from "../components/NavSlide";

    export default {
        name: "home",
        components: {
            NavHeader,
            NavSlide
        },

    }
</script>

<style lang="scss">
    @import "../assets/scss/reset";
    @import "../assets/scss/mixin";

    .el-aside {
        color: #333;
    }
</style>