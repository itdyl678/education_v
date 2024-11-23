// src/store/index.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    username: '',
    avatar: '',
  },
  mutations: {
    setUserName(state, username) {
      state.username = username;
    },
    setAvatar(state, avatar) {
      state.avatar = avatar;
    }
  },
  actions: {
    setUsername({ commit }, username) {
      commit('setUserName', username);
    },
    setAvatar({ commit }, avatar) {
      commit('setAvatar', avatar);
    }
  },
  getters: {
    getUsername: state => state.username,
    getAvatar: state => state.avatar,
  }
});