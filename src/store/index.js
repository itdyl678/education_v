import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    userName: '',
    userAvatar: '',
  },
  mutations: {
    setUser(state, payload) {
      state.isLoggedIn = payload.isLoggedIn;
      state.userName = payload.userName;
      state.userAvatar = payload.userAvatar;
    },
  },
  actions: {
    login({ commit }, userData) {
      // 在登录成功后调用此方法
      commit('setUser', {
        isLoggedIn: true,
        userName: userData.username,
        userAvatar: userData.avatar,
      });
    },
    initializeStore({ commit }) {
      const token = localStorage.getItem('token');
      if (token) {
        commit('setUser', {
          isLoggedIn: true,
          userName: localStorage.getItem('username'),
          userAvatar: localStorage.getItem('avatar'),
        });
      }
    },
  },
})
