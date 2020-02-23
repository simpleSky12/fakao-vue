import Vue from 'vue';
import ElementUI from 'element-ui';
import axios from "axios";
import VueAxios from "vue-axios";
import VueLazyLoad from "vue-lazyload";
import VueCookie from "vue-cookie";

import App from './App.vue';
import router from './router';
import 'element-ui/lib/theme-chalk/index.css';

// 配置默认接口及超时时间，配合接口代理转发
axios.defaults.baseURL = "/api";
axios.defaults.timeout = 8000;


Vue.config.productionTip = false;
Vue.use(ElementUI, {size: 'small', zIndex: 3000});
Vue.use(VueAxios, axios);
Vue.use(VueLazyLoad, {
    loading: './loading-svg/loading-spin.svg'
});
Vue.use(VueCookie);

// 统一错误拦截
axios.interceptors.response.use(res => {
        let data = res.data;
        // status 状态值 为 0 时，代表成功
        if (data.status == 0) {
            return data.data;
        } else if (data.status == 10) {
            // 状态码为10 表示未登陆，返回登陆页
            window.location.href = '/#/login';
            // 抛出错误，终止promis请求，进入catch
            ElementUI.Message.error(data.msg);
            return Promise.reject(data);
        } else {
            ElementUI.Message.error(data.msg);
            return Promise.reject(data);
        }
    },
    error => {
        // 状态码不为 200 时触发
        let res = error.response;
        ElementUI.Message.error(res.data.message);
        return Promise.reject(res);
    });

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
