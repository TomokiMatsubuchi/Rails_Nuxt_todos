export const state = () => ({
  currentUser: {},
});

export const mutations = {
  setUser(state, user) {
    state.currentUser = user;
  },
};

export const actions = {
  setUser(context, user_data) {
    context.commit("setUser", user_data); //第一引数にmutationsの呼び出す関数の名前を入れ、第二引数に該当mutationsで使用する値を入れる。
  },
};
