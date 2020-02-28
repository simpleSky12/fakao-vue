<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'App',
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
                  this.$store.dispatch("saveNickname", res.data.nickname);
              });
            }
        },
        computed:{

        }
    }
</script>

<style lang="scss">
    @import "./assets/scss/reset";
    @import "./assets/scss/mixin";
    @import "./assets/scss/color-dark";
    @import "./assets/scss/base";

    .v-modal{
        z-index: 2!important;
    }
</style>
