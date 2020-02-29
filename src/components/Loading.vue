<template>
    <div class="loading">
        <img src="../assets/loading-svg/loading-bars.svg" alt="">
    </div>
</template>

<script>
    export default {
        name: "Loading"
    }
</script>

<style lang="scss">
    .loading{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999;
        background-color: rgba(38, 38, 38, .7);

        img{
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            height: 80px;
            line-height: 80px;
            text-align: center;
            padding: 30px 0;
        }
    }

</style>