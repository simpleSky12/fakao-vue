<template>
    <div>
        <nav-header></nav-header>
        <router-view></router-view>
        <nav-slide></nav-slide>
    </div>
</template>

<script>
    import NavHeader from "../components/NavHeader";
    import NavSlide from "../components/NavSlide";

    export default {
        name: "home",
        components:{
            NavHeader,
            NavSlide
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/reset";

</style>