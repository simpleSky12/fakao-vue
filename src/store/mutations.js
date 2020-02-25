
// 接收 action 发过来的 commit， 然后存入到state中
export default {
    saveNickname(state, nickname) {
        state.nickname = nickname;
    }
}
