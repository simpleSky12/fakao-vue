<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    import {mapActions} from 'vuex';

    export default {
        name: 'App',
        components: {},
        mounted() {
          let userId = this.$cookie.get("userId");
          if (userId) {
            this.getUser();
          } else {
            window.location.href = "/#/login";
          }
        },
        methods: {
            ...mapActions(["saveNickname"]),
            // 获取用户信息
            getUser() {
              this.axios.get('/admin/userInfo').then((res = {}) => {
                this.saveNickname(res.nickname);
              });
            }
        }
    }
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
</style>
