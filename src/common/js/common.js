/**
 * Created by zhangbing on 2016/12/6.
 * 工具方法
 */
import Vue from 'vue';
import { Notice,Message,Modal,Spin } from 'iview';
import { apiBase } from 'common/api.config';
import moment from 'moment';
import axios from "axios";
import qs from "qs";
import store from "../../vuex/store"

// const jsSHA = require("jssha");
const lStorage = $.localStorage;
const sStorage = $.sessionStorage;
let GLOBAL = {
  HTTP_SUCCESS_CODE: '100',//HTTP返回200
  PARAM_ERROR_CODE: '101',//参数有误或后台报错
  TOKEN_ERROR_CODE: '103',//token校验失败
  DEFAULT_PASSWORD_CODE: '104',//新用户，默认密码，需要修改默认密码
};


/**
 * Axios封装start
**/
// let AJAX_NUM = 0;
// const token = localStorage.getItem('token');
// const Axios = axios.create({
//   baseURL: apiBase(),
//   timeout: 10000,
//   // responseType: "json",
//   withCredentials: true,
//   // headers: {
//   //   "Content-Type": "application/json;charset=UTF-8"
//   //   // "Content-Type": "application/x-www-form-urlencoded"
//   // },
//   // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
//   loading:true,
// });
//
// //POST传参序列化(添加请求拦截器)
// Axios.interceptors.request.use((config) => {
//   config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
//   store.state.loading = true;
//   // 未登录(本地测试使用)
//   // if ( !token ) {
//   //   location.href = '/static/login.html';
//   // } else {
//   //   // 若是有做鉴权token , 就给头部带上token
//   //   config.headers.token = token;
//   // }
//   if( config.loading ) {
//     AJAX_NUM++;
//     $('.loding-spin','.dashborad-wrapper').show();
//     // store.dispatch('FETCH_LOADING','true');
//   }
//   if(config.method  === 'post'){
//     let data = qs.parse(config.data)
//     config.data = qs.stringify({
//       token: token,
//       ...data
//     })
//   } else if(config.method  === 'get'){
//     config.params = {
//       token: token,
//       ...config.params,
//     }
//   }
//   return config;
// }, (error) => {
//     return Promise.reject(error.data.message);
// });
//
// //返回状态判断(添加响应拦截器)
// Axios.interceptors.response.use((res) => {
//   AJAX_NUM--;
//   if (AJAX_NUM === 0) { //所有Ajax加载完毕
//     $('.loding-spin','.dashborad-wrapper').hide();
//   }
//   store.state.loading = false; //loading等待
//   if(res.data.code){
//     if (res.data.code == 100) {
//       return res;
//     }else if(res.data.code == 103){ //token失败
//       Notice.error({
//         title: '登录验证失败',
//         desc: res.data.msg,
//         duration:3,
//         onClose:function () {
//           location.href = '/static/login.html';
//         }
//       });
//       localStorage.removeItem('user');
//     }else if(res.data.code == 104){ //新用户，默认密码，需要修改默认密码
//       this.dialog('重要提示',res.data.msg,() => {
//         location.hash = '/public/center/personal';
//         $('#editPasswordBtn').trigger('click');
//       });
//     }else if(res.data.code == 101){ //参数有误或后台报错
//       this.notices(res.data.code +"："+ res.data.msg , '操作失败', 'warning');
//     }else{
//       Notice.error({
//         title: '操作失败',
//         desc:  res.data.msg,
//         duration:3,
//       });
//       return Promise.reject(res);
//     }
//   }
// }, (error) => {
//   AJAX_NUM = 0;
//   store.state.loading = false;//loading等待
//   // store.dispatch('FETCH_LOADING', 'false');
//   Notice.error({
//     title: '网络异常 '+ error,
//     desc: '请检查网络，或者稍后刷新重试',
//     duration:4,
//   });
//   return Promise.reject(error);
// });
// Vue.prototype.$axios = Axios;

// /**
//  * fetch 方法封装
//  * @param url
//  * @param params
//  * @returns {Promise}
//  */
// export function fetch(url, params) {
//   return new Promise((resolve, reject) => {
//     axios.get(url, {
//       params:params
//     })
//     .then(res => {
//       resolve(res.data);
//     }, err => {
//       reject(err);
//     })
//     .catch((error) => {
//       reject(error)
//     })
//   })
// }
//
// /**
//  * post 方法封装
//  * @param url
//  * @param data
//  * @returns {Promise}
//  */
// export function post(url, data) {
//   return new Promise((resolve, reject) => {
//     axios.post(url, data)
//       .then(response => {
//         resolve(response.data);
//       }, err => {
//         reject(err);
//       })
//       .catch((error) => {
//         reject(error)
//       })
//   })
// }
//
// /**
//  * Axios封装end
//  */


/**
 * 自定义封装
 */
module.exports.common = GLOBAL.common = {
  //API_BASE_URL
  apiBase: function() { return apiBase() },
  /**
   * 封装jQuery Ajax
   * @param option
   */
  ajax: function(option) {
    var url = option.url;
    var type = option.method || 'post';
    var dataType = option.dataType || 'json';
    var resquestData = option.data || {};
    var isAsync = option.isAsync !== "no" ? true : false;//同步或异步请求
    var timeout = option.timeout || 300000;
    var success = option.success;
    var error = option.error || function(){};
    var successError = option.successError;
    var complete = option.complete;
    var noLoading = option.noLoading === 'yes' ? false : true;//是否出现loading动画，一些请求不需要显示

    var token = lStorage.get('token');

    resquestData.token = token;
    var _this = this;
    $.ajax({
      url: url,
      type: type,
      data: resquestData,
      dataType: dataType,
      async: isAsync,
      timeout: timeout,
      beforeSend: function() {
        if(option.f) {
          option.beforeSend();
        } else {
          if(noLoading) {
            AJAX_NUM++;
            $('.loding-spin','.dashborad-wrapper').show();
          }
        }
      },
      success: function(res) {
        if (res.code === GLOBAL.HTTP_SUCCESS_CODE) {
          success(res);
        } else if(res.code === GLOBAL.TOKEN_ERROR_CODE) { //token校验失败
          alert(res.msg);
          localStorage.removeItem('user');
          location.href = '/static/login.html';
        } else if (res.code === GLOBAL.DEFAULT_PASSWORD_CODE) {  //新用户，默认密码，需要修改默认密码
            _this.dialog('重要提示',res.msg,() => {
              location.hash = '/public/center/personal';
              $('#editPasswordBtn').trigger('click');
            });
        } else if (res.code === GLOBAL.PARAM_ERROR_CODE) {  //参数有误或后台报错
          _this.notices(res.code+"："+res.msg, '操作失败', 'warning');
        } else {
          if(successError) {
            successError(res);
          }else{
            // _this.notices(res.code+"："+res.msg, '操作失败', 'warning');
            _this.notices(res.code+"："+'网络异常，请刷新重试！！！', '网络异常', 'warning');
          }
        }
      },
      error: function(err) {
        if(error) error(err);
        _this.notices('服务异常，'+err.statusText, '操作失败','error');
        // _this.notices('网络环境较差，'+'', '网络异常','error');
      },
      complete: function() {
        if(noLoading) {
          AJAX_NUM--;
          if (AJAX_NUM === 0) { //所有Ajax加载完毕
            $('.loding-spin','.dashborad-wrapper').hide();
          }
        }
        if(complete) complete();
      }
    });
  },
  /**
   * 封装iview Notice 通知提醒组件
   * @param title
   * @param nodesc
   * @param type
   */
  notices: function(nodesc = '', title = '提示', type = 'success', duration = 3) {
    if (type === 'error' || type === 'warning') duration = 5;
    Notice[type]({
      title: title,
      desc: nodesc,
      duration: duration
    });
  },
  /**
   * 封装iview Message 全局提示组件
   * @param conetnt
   * @param duration
   */
  msg: function(conetnt,type = 'error',duration = 5) {
    Message[type](conetnt, duration);
  },
  /**
   * 封装Dialog全局组件
   * @param title 对话框标题
   * @param content 对话框内容
   * @param onOkCallBack 确定按钮会掉函数
   */
  dialog: function(title = "♥", content = "", onOkCallBack) {
    if (onOkCallBack) {
      Modal.info({
        title: title,
        content: content,
        onOk: onOkCallBack()
      });
    } else {
      Modal.info({
        title: title,
        content: content
      });
    }
  }
};

/**
 * 文件上传公共方法
 * @param option 上传选项
 */
export function uploadAjax(option) {
  let formData = new FormData();
  formData.append("token", localStorage.getItem('token'));
  for(let key in option.data) {
    formData.append(key, option.data[key]);
  }
  $.ajax({
    url: option.url,
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function (res) {
      res = JSON.parse(res);
      if (res.code === GLOBAL.HTTP_SUCCESS_CODE) {
        if (option.success) option.success(res);
      } else {
        if (option.successError) option.successError(res);
        GLOBAL.common.notices(res.msg,'上传失败', 'error');
      }
    },
    error: function (res) {
      GLOBAL.common.notices(res.statusText, '服务异常', 'error');
    }
  });
};

/**
 * SHA512哈希加密
 * @param str 要加密的字符串
 * return hash 加密后的哈希值
 */
/*
export function encrypted() {
  var shaObj = new jsSHA("SHA-512", "TEXT");
  shaObj.update(str);
  return shaObj.getHash("HEX");
};
*/

/**
 * 浏览器是否支持localStorage
 * 包括不支持、开启隐私模式等
 * @return true:支持，false:不支持
 */
export function storeEnabled(){
  var store = window.localStorage;
  try {
    if (!store) {
      console.warn('您的浏览器不支持localStorage，请更换高级浏览器！');
      return false;
    }
    store.setItem('storeEnabled', 'yes');
    store.removeItem('storeEnabled');
    return true;
  } catch (err) {
    console.warn('您的浏览器不支持localStorage，请更换高级浏览器或使用非隐私模式！');
    return false;
  }
};

export function Moment() {
  return moment();
}

/**
 * 时钟分钟加减计算上课结束时间
 * @param len 间隔小时
 * @param value 开始时间
 * @returns {string} 结束时间
 */
export function computedEndTime(len, value) {
  //07:00,07:30,10:00,10:30
  let h = value.split(':')[0]; //小时，07
  let m = value.split(':')[1]; //分钟，00
  let time = Number.parseInt(len.split('.')[0]); //时间间隔
  let ih = Number.parseInt(h),
    im = Number.parseInt(m),
    nh = '',
    nm = '';
  if (len.includes('.')) { //小数，1.5
    if (m === '00') { //整点
      nm = '30';
    } else { //半点
      nm = '00';
      ih += 1;
    }
    if (ih + time > 9) {
      nh = ih + time;
    } else {
      nh = '0' + (ih + time);
    }
  } else {
    nm = (m === '00') ? '00' : '30';
    if (ih + time > 9) {
      nh = ih + time;
    } else {
      nh = '0' + (ih + time);
    }
  }
  return nh + ':' + nm;
};

/**
 * 校验是否是图片格式
 * @param filename 文件名
 * @returns {boolean} 是否是图片
 */
export function checkImageExt(filename) {
  let index = filename.lastIndexOf('.');
  let ext = filename.substr(index+1).toLowerCase();
  let ruleExts = ["png","jpg","jpeg","webp","gif","bmp"];
  if (ruleExts.indexOf(ext) === -1) {
    return false;
  }
  return true;
};
/**
 * 校验是否是客户端
 * @param filename 文件名
 * @returns {boolean} 是否是客户端文件
 */
export function checkClientExt(filename) {
  let index = filename.lastIndexOf('.');
  let ext = filename.substr(index+1).toLowerCase();
  let ruleExts = ["rar","exe","zip"];
  if (ruleExts.indexOf(ext) === -1) {
    return false;
  }
  return true;
};

/**
 * 校验是否是办公文件格式
 * @param filename 文件名
 * @returns {boolean} 是否是图片
 */
export function checkOfficeExt(filename) {
  let index = filename.lastIndexOf('.');
  let ext = filename.substr(index+1).toLowerCase();
  let ruleExts = ["doc","docx","wps","xls","xlsx","et","ppt","pptx","dps","pdf"];
  if (ruleExts.indexOf(ext) === -1) {
    return false;
  }
  return true;
};

/**
 * 校验是否是合理的格式
 * @param filename 文件名
 * @returns {boolean} 是否是图片
 */
export function checkCommonExt(filename) {
  let index = filename.lastIndexOf('.');
  let ext = filename.substr(index+1).toLowerCase();
  let ruleExts = ["doc","docx","wps","xls","xlsx","et","ppt","pptx","dps","pdf","png","jpg","jpeg","webp","gif","bmp"];
  if (ruleExts.indexOf(ext) === -1) {
    return false;
  }
  return true;
};

/**
 * 格式化日期时间
 * @param date 时间毫秒数
 * @param fmt 格式化字符串
 * @returns 格式化后的时间
 */
export function formateDate(date, fmt) {
  if(!fmt){
    fmt = 'yyyy-MM-dd'
  }
  if(date) {
    date = new Date(date);
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    };
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + '';
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : _padLeftZero(str));
      }
    }
    return fmt;
  } else {
    return "";
  }
};

function _padLeftZero(str) {
  return ('00' + str).substr(str.length);
}

/**
 * 显示完整手机号码
 * @param phone 手机号码
 * @param url API地址
 * @param onOkCallBack 确定按钮回调函数
 */

export function getFullPhone(phone,url) {
  GLOBAL.common.dialog('',phone,function(){});
  GLOBAL.common.ajax({
    url: url,
    method: 'get',
    data: { phone: phone},
    success: function(res) {
      GLOBAL.common.msg('记录获取号码操作成功','success');
    }
  });
}

/**
 * 隐藏任意个数字符串加星显示
 * @param str 要处理的字符串
 * @param startIndex 开始位置
 * @param endIndex 结束位置
 * @returns {string} 加星后的字符串
 */
export function hideCharAtNumber(str, startIndex = 3, endIndex = 6) {
  if (str) {
    str = str.toString();
    var hideLenth = (endIndex - startIndex) + 1;
    var hideStr = '*'.repeat(hideLenth);
    return str.substring(0, startIndex) + hideStr + str.substring(startIndex + hideLenth);
  }
  return '';
}
/**
 * 清除搜索框数据
 * @param formObject 搜索框data对象
 * @param [refs][Array] 组件v-ref
 */
export function clearSearchForm(formObject, refs, Vue) {
  // console.log(formObject);
  for(let item in formObject) {
    console.log(formObject[item]);
    formObject[item] = '';//重置文本框
    if(item.indexOf('Date') > 0 || item.indexOf('Time') > 0) {//重置时间控件
      if(refs && refs.length > 0) {
        // console.log(refs);
        refs.forEach(function(value, index) {
          if(value.handleClear){
            value.handleClear();
          }
          // console.log(value);
        });
      }
    }
    if(item.endsWith('Key')) {//重置带clear属性的下拉框
      Vue.$refs[item].clearSingleSelect();
      Vue.$refs[item].setQuery('');
    }
  }
}

/**
 * 数组冒泡排序
 * @param arr
 */
export function bubbleSort(arr) {
  var m = 0;	//轮数
  var n = 0;	//次数
  for(var i=0; i<arr.length-1; i++){
    var flag = true;
    for(var j=0; j<arr.length-1-i; j++){
      if(arr[j] > arr[j+1]){
        var temp = arr[j];
        arr[j] = arr[j+1];
        arr[j+1] = temp;
        flag = false;
      }
      n++;
    }
    m++;
    if(flag){
      break;
    }
  }
};
/**
 * 获取url地址参数
 * @param arr
 */
export function urlParam(name) {
    // 如果链接没有参数，或者链接中不存在我们要获取的参数，直接返回空
    if (location.href.indexOf("?") == -1 || location.href.indexOf(name + '=') == -1) {
      return '';
    }

    // 获取链接中参数部分
    var queryString = location.href.substring(location.href.indexOf("?") + 1);
    queryString = decodeURI(queryString);

    // 分离参数对 ?key=value&key2=value2
    var parameters = queryString.split("&");

    var pos, paraName, paraValue;
    for (var i = 0; i < parameters.length; i++) {
      // 获取等号位置
      pos = parameters[i].indexOf('=');
      if (pos == -1) {
        continue;
      }

      // 获取name 和 value
      paraName = parameters[i].substring(0, pos);
      paraValue = parameters[i].substring(pos + 1);

      // 如果查询的name等于当前name，就返回当前值，同时，将链接中的+号还原成空格
      if (paraName == name) {
        return unescape(paraValue.replace(/\+/g, " "));
      }
    }
    return '';
};
