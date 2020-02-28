<template>
    <div class="news">
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item>
                    <i class="el-icon-tickets"></i>
                    新闻管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>
                    新闻列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="test">
            <div class="title" @click="showUl = !showUl">一级标题</div>
            <ul :class="showUl?'':'height0'">
                <li>二级标题</li>
                <li>二级标题</li>
                <li>二级标题</li>
                <li>二级标题</li>
                <li>二级标题</li>
                <li>二级标题</li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "news",
        data() {
            return {
                showUl:false,
            }
        }
    }
</script>

<style lang="scss">
    .test{
        font-size: 20px;
        text-align: center;
        margin: 60px auto;
        width: 600px;
        div{
            width: 100px;
            cursor: pointer;
            background-color: #d9d9d9;
        }
        ul{
            background-color: #20a0ff;
            width: 500px;
            height: 200px;
            overflow: hidden;
            transition: height .6s;
            &.height0{
                height: 0 !important;
            }
        }
    }
</style>