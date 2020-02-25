// 声明 vuex， 加入vue实例中

import Vue from 'vue';
import Vuex from 'vuex';
import mutations from "./mutations";
import actions from "./actions";


Vue.use(Vuex);

const state = {
    nickname:'' // 登陆用户名
};

// mutations 和 actions都是复数形式
export default new Vuex.Store({
    state,
    mutations,
    actions
})

/*
import Vuex from 'vuex';


const store = new Vuex.Store({
    state: {
        nickname: ''
    },
    mutations: {
        saveNickname(state,nickname) {
            state.nickname = nickname;
        }
    }
});

export {
    store
}*/
