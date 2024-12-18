import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    userName: '',
    userAvatar: '',
    teacherId: null,
  },

  //更改状态的方法
  mutations: {
    setUser(state, payload) {
      state.isLoggedIn = payload.isLoggedIn;
      state.userName = payload.userName;
      state.userAvatar = payload.userAvatar;
    },

    setTeacherId(state, teacherId) {
      state.teacherId = teacherId;   //设置教师ID
    }
  },

  //actions 处理业务逻辑，执行异步操作，并通过 commit 调用 mutations 来改变 state。
  actions: {
    login({ commit }, userData) {
      // 在登录成功后调用此方法
      commit('setUser', {
        isLoggedIn: true,
        userName: userData.username,
        userAvatar: userData.avatar,
      });
    },
    //查看是否有token信息或者过期，用来免登录
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
    setTeacherId({ commit }, teacherId) {
      commit('setTeacherId', teacherId);  //更新教师的ID
    }
  },
})
