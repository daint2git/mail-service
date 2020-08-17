import Vue from 'vue';
import Vuex from 'vuex';
import loading from './loading';
import user from './user';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    loading,
    user,
  },
});
