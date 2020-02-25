<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'App',
        components: {},
        mounted() {
          let userId = this.$cookie.get("userId");
          if (userId) {
            this.getUser();
          }
        },
        methods: {
            // 获取用户信息
            getUser() {
              this.axios.get('/admin/userInfo').then((res = {}) => {
                  this.$store.dispatch("saveNickname", res.nickname);
              });
            }
        }
    }
</script>

<style lang="scss">
    @import "./assets/scss/reset";
    @import "./assets/scss/mixin";
    @import "./assets/scss/color-dark";
    @import "./assets/scss/base";
</style>
