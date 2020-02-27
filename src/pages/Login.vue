<template>
    <div class="login">
        <div class="wrapper">
            <div class="title">后台管理系统</div>
            <el-form class="content" :model="param"
                     ref="login"
                     :rules="rules">
                <el-form-item prop="nickname">
                    <el-input clearable
                              v-model="param.nickname"
                              status-icon="true"
                              placeholder="请输入账号">
                        <el-button slot="prepend" icon="el-icon-user"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password"
                              v-model="param.password"
                              show-password
                              @keyup.enter.native="submitForm"
                              placeholder="请输入密码">
                        <el-button slot="prepend" icon="el-icon-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm">登陆</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                param: {
                    nickname: "admin",
                    password: ""
                },
                rules: {
                    nickname: [{ required: true,message: "请输入用户名",trigger: "blur"}],
                    password: [{required: true,message: "请输入登陆密码",trigger: "blur"}]
                }
            }
        },
        methods: {
            submitForm() {
                this.$refs.login.validate(valid => {
                    if (valid) {
                        let {nickname, password} = this.param;
                        this.axios.post("/admin/login", {
                            nickname,
                            password
                        }).then(res => {
                            this.$cookie.set('userId', res.data.id, {expires: 'Session'});
                            this.$store.dispatch("saveNickname",res.data.nickname);  // 向vuex中的 action 派发请求
                            this.$message.success("登陆成功！");
                            this.$router.push('/index');
                        });

                    } else {
                        this.$message.warning("请填写登陆信息！");
                    }
                });
            }
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/mixin";

    .login {
        position: relative;
        @include bgImg(100vw, 100vh, "../assets/imgs/login-bg.jpg", cover);

        .wrapper {
            @include abLeft(420px, auto);
            transform: translate(-50%, -70%);
            border-radius: 5px;
            background: rgba(255, 255, 255, 0.3);

            .title {
                line-height: 70px;
                font-size: 24px;
                font-weight: bold;
                border-bottom: 1px solid;
            }

            .content {
                padding: 30px 30px;
                overflow: hidden;

                input {
                    height: 50px;
                    font-size: 16px;
                }

                .login-btn {
                    width: 100%;

                    button {
                        width: 100%;
                        height: 45px;
                        font-size: 20px;
                    }
                }
            }
        }
    }
</style>