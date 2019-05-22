/**
 * Created by Administrator on 2016/12/8.
 */

//接口响应成功码
var RES_STATUS_SUCCESS = '100';
var SCREEN_SIZE = 'md';
//开启ajax的数量
var AJAX_NUM = 0;
//全局方法对象
var GLOBAL = {};

$(function() {
  //判断浏览器是否关闭的临时值
  sessionStorage.setItem('RES_STATUS_SUCCESS',RES_STATUS_SUCCESS);
  var width = $('body').width();
  // 大屏幕 大桌面显示器 (≥1900px)
  if (width > 1900) {
    SCREEN_SIZE = 'lg';
  }
});



GLOBAL.init = function() {
  var windowH = $(window).height();
  var headerH = $('header').height();
  $('aside').height(windowH - headerH);
  console.log(windowH,headerH);
  $('.container','.ivu-tabs-content,.aside-right').height(windowH - headerH);
  $('.dashborad-wrapper').height(windowH - headerH - 30);
  $("#silderBar").height(windowH - headerH - 30)
  // $('.ivu-tabs-content','.dashborad-wrapper').height(windowH - headerH);
};

/**
 * 页面跳转
 * @param hashUrl URL哈希值
 * @param uuid
 */
GLOBAL.redirectTo = function (hashUrl, uuid) {
  sessionStorage.setItem('template_uuid', uuid);
  console.log(hashUrl);
  if(hashUrl == 'tcAgent/viewResume'){
    console.log(1);
    location.hash = '/tcAgent/viewResume';
  }else {
    location.hash = hashUrl;
  }
}

/**
 * 查看学生详情
 * @param hashUrl URL哈希值
 * @param uuid
 */
GLOBAL.viewLeadsDetail = function(uuid,id,cr) {
  sessionStorage.setItem('template_uuid', uuid);
  sessionStorage.setItem('appointment_leadsUuid', uuid);
  sessionStorage.setItem('template_show', id);
  var userObj = $.localStorage.get('user');
  console.log(userObj.alias);
  console.log(id);
  if(id == '0'){
    location.hash = '/scs/leadsDetailByCc';
  }else if(cr||userObj.alias === 'cr' ||userObj.alias === 'sm' ||userObj.alias === 'qc'||userObj.alias === 'qczy'||userObj.alias === 'kfzg') {
    location.hash = '/scs/leadsDetailByCr';
  } else if(userObj.alias === 'cc' || userObj.alias ==='tzzy' ||userObj.alias ==='sczj' ) {
    location.hash = '/scs/leadsDetailByCc';
  }else if(userObj.alias === 'sa' || userObj.alias === '15') {
    location.hash = '/scs/leadsDetailByCc';
  } else {
    location.hash = '/scs/leadsDetailByError';
  }
};
GLOBAL.viewLeadsDetailList = function(uuid,name,teamUuid,teamName) {
  sessionStorage.setItem('template_userUuidSales', uuid);
  sessionStorage.setItem('template_userNameSales', name);
  sessionStorage.setItem('template_teamUuidSales', teamUuid);
  sessionStorage.setItem('template_teamNameSales', teamName);
    location.hash = '/report/salesMonitoringList';
};
/**
 * 在浏览器新标签页中打开内容
 * @param url 内容url
 * @param download 是否提供下载，是：true
 * @param fileName 下载需要提供的文件名
 */
GLOBAL.newTab = function (url,download,fileName) {
  var a = document.createElement('a');
  a.id = 'viewErrorQuestion';
  a.innerHTML = '<span>aaaaaa</span>';
  a.href = url;
  download = download || false;
  if(download) a.download = fileName || '';
  a.target = '_blank';
  document.body.appendChild(a);
  var dom = document.getElementById('viewErrorQuestion');
  dom.click();
  document.body.removeChild(dom);
};

GLOBAL.logout = function() {
  sessionStorage.clear();
  localStorage.removeItem('user');
  localStorage.removeItem('anLaiAccout');
  localStorage.setItem('tianrun_login_status', 'no');
  location.href = '/static/login.html';
};

