/**
 * Axios封装
 **/
import axios from 'axios'
import { Notice,Message,Modal,Spin } from 'iview';
import store from '../vuex/store'
import { apiBase , apiHiCRM } from 'common/api.config';
import qs from 'qs'
import {common} from '../common/js/common.js';
import iView from 'iview'

// axios 配置
axios.defaults.timeout = 600000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = apiBase();
axios.defaults.loading = true;
//POST传参序列化
axios.interceptors.request.use((config) => {
  store.state.loading = true;//loading等待
  let token = localStorage.getItem("token")
  if( config.loading ) {
    AJAX_NUM++;
    $('.loding-spin','.dashborad-wrapper').show();
  }
  if(config.method  === 'post'){
    let data = qs.parse(config.data)
    config.data = qs.stringify({
      token: token,
      ...data
    })
    // config.data = qs.stringify(config.data);
  } else if(config.method  === 'get'){
    config.params = {
      token: token,
      ...config.params,
    }
  }
  return config;
},(error) =>{
  return Promise.reject(error);
});
//返回状态判断
axios.interceptors.response.use((res) =>{
  AJAX_NUM--;
  if (AJAX_NUM === 0) { //所有Ajax加载完毕
    $('.loding-spin','.dashborad-wrapper').hide();
  }
  store.state.loading = false;//loading等待
  if(res.data.code){
    if (res.data.code == 100) {
      return res;
    }else if(res.data.code == 103){ //token失败
      Notice.error({
        title: '登录验证失败',
        desc: res.data.msg,
        duration:3,
        onClose:function () {
          location.href = '/static/login.html';
        }
      });
      localStorage.removeItem('user');
    }else if(res.data.code == 104){ //新用户，默认密码，需要修改默认密码
      common.dialog('重要提示',res.data.msg,() => {
        location.hash = '/public/center/personal';
        $('#editPasswordBtn').trigger('click');
      });
    }else if(res.data.code == 101){ //参数有误或后台报错
      common.notices(res.data.code +"："+ res.data.msg , '操作失败', 'warning');
    }else{
      Notice.error({
        title: '操作失败',
        desc:  res.data.msg,
        duration:3,
      });
      return Promise.reject(res);
    }
  }
}, (error) => {
  store.state.loading = false;//loading等待
  AJAX_NUM = 0;
  Notice.error({
    title: '网络异常 '+ error,
    desc: '请检查网络，或者稍后刷新重试',
    duration:4,
  });
  $('.loding-spin','.dashborad-wrapper').hide();
  return Promise.reject(error);
});

export function fetch(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => {
        resolve(res);
      }, err => {
        reject(err);
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function fetchGet(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, params)
      .then(response => {
        resolve(response);
      }, err => {
        reject(err);
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function fetchJSON(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, params)
      .then(response => {
        resolve(response);
      }, err => {
        reject(err);
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let token = localStorage.getItem("token");

export default {
  get(url,data) {
    return fetchGet(url,data)
  },
  post(url,data) {
    return fetch(url,data)
  },
  getJSON(url,data) {
    return fetchJSON(url,data)
  }
}
