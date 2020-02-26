<template>
    <div class="index">
        <el-row :gutter="20">
            <el-col :span="8">
                <!--登陆管理员的信息-->
                <el-card shadow="hover" class="mgb20">
                    <div class="user">
                        <img src="../assets/imgs/img.jpg" class="user-avatar" alt="">
                        <div class="account">
                            <a href="/#/login" v-if="!nickname">请登录</a>
                            <template v-else>
                                <div class="nickname">{{nickname}}</div>
                                <div>{{role}}</div>
                            </template>
                        </div>
                    </div>
                </el-card>
                <!--语言详情卡片-->
                <el-card shadow="hover" class="language">
                    <span>语言详情</span>
                    <p>
                        Vue
                        <el-progress :percentage="71.3" color="#42b983"></el-progress>
                    </p>
                    <p>
                        Javascript
                        <el-progress :percentage="24.1" color="#f1e05a"></el-progress>
                    </p>
                    <p>
                        Css
                        <el-progress :percentage="13.7"></el-progress>
                    </p>
                    <p>
                        Html
                        <el-progress :percentage="5.9" color="#f56c6c"></el-progress>
                    </p>
                </el-card>
            </el-col>
            <!--代办事项-->
            <el-col :span="16">
                <el-card shadow="hover">
                    <div slot="header" class="todo-header">
                        <span>待办事项</span>
                        <!--                        <el-button size="mini" type="primary">添加</el-button>-->
                    </div>
                    <el-table class="todoList"
                              :show-header="false"
                              :data="todoList">
                        <el-table-column width="40">
                            <!--修改todolist的完成状态-->
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.status"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <div class="todo-item" :class="{'todo-item-del':scope.row.status}">
                                    {{scope.row.title}}
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                todoList: [
                    {
                        title: '一夜小園開似雪',
                        status: false
                    },
                    {
                        title: '詩酒獨游寺，琴書多寄僧',
                        status: false
                    },
                    {
                        title: '峴首飛黄葉，湘湄走白波',
                        status: false
                    },
                    {
                        title: '寒清萬國土，冷鬭四維根',
                        status: false
                    },
                    {
                        title: '萬木殘秋裏，孤舟半夜猿',
                        status: true
                    },
                    {
                        title: '近代無人尋異事，野泉噴月瀉秋池',
                        status: false
                    },
                    {
                        title: '駿馬機前異，遊人肘後懸',
                        status: false
                    },
                ]
            }
        },
        computed: {
            nickname() {
                let nickname = this.$store.state.nickname;
                return nickname ? nickname : ""
            },
            role() {
                return this.$store.state.nickname == this.nickname ? "管理员" : "普通用户"
            }
        }
    }
</script>

<style lang="scss">
    .index {
        text-align: left;

        .user {
            display: flex;
            align-items: center;

            img {
                width: 120px;
                border-radius: 50%;
            }

            .account {
                padding-left: 50px;
                flex: 1;
                color: #999;

                div:first-child {
                    font-size: 30px;
                    color: #222;
                }
            }
        }

        .language {

            .el-card__body{
                width: 90%;
                height: 240px;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
            }
        }

        .todo-item {
            font-size: 14px;
        }

        .todo-item-del {
            text-decoration: line-through;
            color: #999999;
        }
    }
</style>