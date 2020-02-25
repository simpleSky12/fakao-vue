
// 向 mutations 中发送 数据 commit
export default {
    saveNickname(context, nickname) {
        context.commit("saveNickname", nickname);
    }
}