<template>
    <div class="tags" v-if="showTags">
        <ul>
            <li v-for="(item,index) in tagsList" :key="index"
                :class="{'active' : isActive(item.path)}">
                <router-link class="title" :to="item.path">
                    {{item.title}}
                </router-link>
                <span class="icon" @click="closeTags(index)">
                    <i class="el-icon-close"></i>
                </span>
            </li>
        </ul>
        <div class="close-box">
            <el-dropdown @command="handleTags">
                <el-button size="mini" type="primary">
                    标签选项
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu size="small" slot="dropdown">
                    <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                    <el-dropdown-item command="all">关闭所有</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    import Bus from "../utils/Bus";
    export default {
        name: "NavTags",
        data(){
            return {
                tagsList:[]
                // showTags: true // 控制标签栏
            }
        },
        methods:{
            // fullPath匹配路由，path匹配路径。
            // 当前标签的路由
            isActive(path) {
                return path == this.$route.fullPath;
            },
            // 关闭单个标签
            closeTags(index) {
                // 点击删除的 tag
                const delItem = this.tagsList.splice(index, 1)[0];
                // 删除后 向左跳转 的tag
                const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1];
                if (item) {
                    delItem.path === this.$route.fullPath && this.$router.push(item.path);
                }else{
                    this.$router.push('/');
                }
            },
            // 关闭全部标签
            closeAll() {
                this.tagsList = [];
                this.$router.push("/");
            },
            // 关闭其他标签
            closeOther() {
                // filter 会将符合条件的元素保留在数组中，形成一个新的数组并返回
                this.tagsList = this.tagsList.filter(item => {
                    return item.path == this.$route.fullPath;
                });
            },
            // 设置标签
            setTags(route) {
                // some 表示 数组中如果有一个元素满足条件，则返回true
                const isExist = this.tagsList.some(item => {
                    return item.path === route.fullPath
                });
                if (!isExist) {
                    if (this.tagsList.length >= 8) {
                        this.tagsList.shift();
                    }
                    this.tagsList.push({
                        title: route.meta.title,
                        path: route.fullPath,
                        name: route.matched[1].components.default.name
                    })
                }
                // $emit 向父组件传递 数值
                Bus.$emit('tags', this.tagsList);
            },
            // 标签的处理函数
            handleTags(command) {
                command === "other" ? this.closeOther() : this.closeAll();
            },
        },
        computed: {
            // 计算，标签栏标签的数据，如果为0，则将data下的 showTags设置为 false
            showTags() {
                return this.tagsList.length > 0;
            }
        },
        // 当 标签切换时，触发监听
        watch: {
            $route(newValue) {
                this.setTags(newValue);
            }
        },
        created() {
            this.setTags(this.$route);
            // 监听关闭页面标签
            Bus.$on('close_current_tags', () => {
                for (let i = 0, len = this.tagsList.length; i < len; i++) {
                    const item = this.tagsList[i];
                    if (item.path === this.$route.fullPath) {
                        // 如果当前的页面不是最后一个页面，则
                        if (i < len - 1) {
                            this.$router.push(this.tagsList[i + 1].path);
                        } else if (i > 0) {
                            this.$router.push(this.tagsList[i - 1].path);
                        } else {
                            this.$route.push("/")
                        }
                        this.tagsList.splice(i,1);
                        break;
                    }
                }
            });
        }
    }
</script>

<style lang="scss">
    .tags{
        position: relative;
        height: 32px;
        line-height: 30px;
        overflow: hidden;
        background-color: #fff;
        box-shadow: 0 5px 10px #ddd;
        ul{
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            list-style: none;
            li{
                margin: 3px 5px 2px 3px;
                border-radius: 3px;
                font-size: 14px;
                cursor: pointer;
                height: 23px;
                line-height: 23px;
                padding: 0 5px 0 12px;
                border: 1px solid #e9eaec;
                transition: all .3s ease-in;
                -webkit-transition: all .3s ease-in;
                -moz-transition: all .3s ease-in;
                &:not(.active):hover{
                    background-color: #f8f8f8;
                }
                &.active{
                    color: #ffffff;
                    border: 1px solid #409EFF;
                    background-color: #409EFF;
                    .title{
                        color: #fff;
                    }
                }
                .title{
                    float: left;
                    max-width: 80px;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    margin-right: 5px;
                    color: #666666;
                }
                .icon{

                }
            }
        }
        .close-box{
            position: absolute;
            right: 0;
            top: 0;
            width: 110px;
            box-shadow: -3px 0 15px 3px rgba(0,0,0, .1);
            z-index: 10;
        }
    }

</style>