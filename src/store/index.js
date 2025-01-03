// src/store/index.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    username: sessionStorage.getItem('username') || '', // 从 sessionStorage 获取用户名
    avatar: sessionStorage.getItem('avatar') || '',     // 从 sessionStorage 获取头像
  },
  mutations: {
    setUserName(state, username) {
      state.username = username;
      sessionStorage.setItem('username', username); // 同步更新 sessionStorage
    },
    setAvatar(state, avatar) {
      state.avatar = avatar;
      sessionStorage.setItem('avatar', avatar); // 同步更新 sessionStorage
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
  },
});