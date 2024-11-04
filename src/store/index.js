// src/store/index.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    username: ''
  },
  mutations: {
    setUserName(state, username) {
      state.username = username;
    }
  },
  actions: {
    setUsername({ commit }, username) {
      commit('setUserName', username);
    }
  },
  getters: {
    getUsername: state => state.username
  }
});