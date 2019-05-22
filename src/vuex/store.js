import Vue from 'vue'
import Vuex from 'vuex'

import * as types from './type.js';
Vue.use(Vuex);

const store = new Vuex.Store({
  state:{
    searchModuleSize:'default',//搜索栏控件size
    callPhoneIsOn:'none',//拨打电话功能开关  inline-block/none
    loading:true,
  },
  action:{
    // 请求数据时状态loading
    FETCH_LOADING( { commit } , res) {
      commit(types.FETCH_LOADING, res);
    },
  },
  mutations:{
    // 请求数据时loading
    [types.FETCH_LOADING] (state, res) {
      state.fetchLoading = res;
    },
  },
  getters:{
    // sum:state=>{
    //   var sum=0;
    //   state.carts.forEach((cart)=>{
    //     sum+=cart.price*cart.value
    //   })
    //   return sum
    // },
  },
})
export default store
