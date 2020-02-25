<template>
    <div class="header">
        <!--折叠按钮-->
        <div class="collapse-btn fl" @click="collapseChange">
            <i class="el-icon-s-unfold" v-if="collapse"></i>
            <i class="el-icon-s-fold" v-else></i>
        </div>
        <div class="logo fl">后台管理系统</div>
        <div class="header-right fr">
            <div class="user-con">
                <!--全屏显示-->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark"
                                placement="bottom"
                                :content="fullscreen ? `取消全屏` : `全屏`">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!--用户头像-->
                <div class="avatar">
                    <img src="../assets/imgs/img.jpg" alt="">
                </div>
                <!--用户名下拉菜单-->
                <el-dropdown class="nickname" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link" v-if="nickname">
                        {{nickname}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <span class="el-dropdown-link" v-else @click="toLogin">请登陆</span>
                    <el-dropdown-menu v-if="nickname" slot="dropdown">
                        <el-dropdown-item command="logout">
                            退出登录
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
    import Bus from "../utils/Bus";

    export default {
        name: "NavHeader",
        data() {
            return {
                collapse: false,
                fullscreen: false
            }
        },
        computed:{
            // 监听 data属性中nickname 的数据有没有发生变化
            nickname() {
                return this.$store.state.nickname;
            },
        },
        mounted(){
            if (document.body.clientWidth < 1500) {
                this.collapseChange();
            }
        },
        methods:{
            toLogin() {
                this.$router.push("/login");
            },
            //  用户名下拉菜单事件
            handleCommand(command) {
                // 注销登陆
                if (command == "logout") {
                    this.axios.post("/admin/logout").then(() => {
                        this.$message.success("用户退出成功！");
                        // 设置cookie 立即失效
                        this.$cookie.set("userId","",{expires: "-1"});
                        // 设置vuex 中的nickname 为空
                        this.$store.dispatch("saveNickname", "");
                        this.$router.push("/login");
                    });
                }
            },
            // 侧边栏折叠
            collapseChange() {
                this.collapse = !this.collapse;
                Bus.$emit("collapse", this.collapse);
            },
            // 全屏事件
            handleFullScreen() {
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            }
        }
    }
</script>

<style lang="scss">
    .header{
        position: relative;
        width: 100%;
        box-sizing: border-box;
        height: 70px;
        font-size: 22px;
        color: #ffffff;
        .collapse-btn {
            padding: 0 21px;
            cursor: pointer;
            line-height: 70px;
        }
        .logo {
            line-height: 70px;
        }
        .header-right {
            padding-right: 50px;
            .user-con {
                display: flex;
                height: 70px;
                align-items: center;
                .btn-fullscreen {
                    transform: rotate(45deg);
                    margin-right: 5px;
                    font-size: 24px;
                    position: relative;
                    width: 30px;
                    height: 30px;
                    text-align: center;
                    border-radius: 15px;
                    cursor: pointer;
                }
                .avatar {
                    margin-left: 20px;
                    img{
                        display: block;
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                    }
                }
                .nickname {
                    margin-left: 10px;
                    .el-dropdown-link {
                        color: #ffffff;
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>