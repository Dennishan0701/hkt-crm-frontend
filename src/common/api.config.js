import store from "../vuex/store"

/**
 * Created by Administrator on 2016/12/3.
 * API接口地址
 */
export function apiBase() {
  let hostname = window.location.hostname,
    API_BASE_URL = 'https://api.onlyeduhi.cn';
  if (hostname === 'crm.onlyhi.cn') {  //正式环境
    API_BASE_URL = 'https://crmapi.onlyhi.cn';
  } else if (hostname === 'crm.haiketang.net') {//搬迁环境
    API_BASE_URL = 'http://crmapi.onlyhi.cn';
  } else if (hostname === 'admin.onlyeduhi.cn') {//公网测试环境
    API_BASE_URL = 'https://api.onlyeduhi.cn';
  } else if (hostname === 'admin.onlyhi.com') {//内网测试环境
    API_BASE_URL = 'http://api.onlyhi.com';
  } else {//本机测试环境
    // API_BASE_URL = 'https://crmapi.onlyhi.cn';
    // API_BASE_URL = 'http://192.168.0.4:8112';//明珠测试url
    // API_BASE_URL = 'http://172.16.20.96:8080/onlyhi-admin';//仕勇测试url
    // API_BASE_URL = 'http://172.16.20.189:8118';//王乾志测试url
    // API_BASE_URL = 'http://172.16.20.96:8118/onlyhi-admin';//忠星测试url
    // API_BASE_URL = 'http://172.16.20.96:8080/onlyhi-admin';//忠星测试url
    // API_BASE_URL = 'http://192.168.0.16:8080/onlyhi-admin';//姚伟骏测试url
  }

  return API_BASE_URL;
  // return "https://admin.onlyhi.cn";
}
export function apiHiCRM() {
  let hostname = window.location.hostname,
    API_ECHART_URL = 'https://getaway.onlyeduhi.cn';
  if (hostname === 'crm.onlyhi.cn') {  //正式环境
    API_ECHART_URL = 'https://hkt.onlyhi.cn';
  } else if (hostname === 'admin.onlyeduhi.cn') {//公网测试环境
    API_ECHART_URL = 'https://getaway.onlyeduhi.cn';
  } else {//本机测试环境
    // API_ECHART_URL = 'https://hkt.onlyhi.cn';
    // API_ECHART_URL = 'http://172.16.20.94:8122';//明珠测试url
    // API_ECHART_URL = 'http://172.16.21.252:8521';//仕勇测试url
    // API_ECHART_URL = 'http://172.16.20.96:8120';//忠星测试url
    // API_ECHART_URL = 'http://172.16.21.14:8521';//仕勇测试url
    // API_ECHART_URL = 'http://172.16.20.96:8122';//忠星测试url
    // API_ECHART_URL = 'http://172.16.21.14:8521';//仕勇测试url
    // API_ECHART_URL = 'http://172.16.20.96:8114';//忠星测试url
    // API_ECHART_URL = 'http://172.16.20.96:8124';//忠星测试url
    // API_ECHART_URL = 'http://172.16.21.14:8521';//仕勇测试url
    // API_ECHART_URL = 'http://172.16.20.96:8122';//忠星测试url
    // API_ECHART_URL = 'http://172.16.21.14:8521';//仕勇测试url
    // API_ECHART_URL = 'http://172.16.20.96:8114';//忠星测试url
    // API_ECHART_URL = 'http://172.16.20.96:8115';//忠星测试url
    // API_ECHART_URL = 'http://172.16.20.96:8111';//忠星测试url
    // API_ECHART_URL = 'http://172.16.21.252:8522';//姚伟骏测试url
    // API_ECHART_URL = 'http://172.16.21.252:8521';//姚伟骏测试url
    // API_ECHART_URL = 'http://172.16.20.97:8111';//姚伟骏测试url
    // API_ECHART_URL =  apiHiCRM() + '/crm/auth';//姚伟骏测试url
    // API_ECHART_URL = 'http://172.16.10.32:8122';//忠兴测试url
  }

  return API_ECHART_URL;
  // return "https://admin.onlyhi.cn";
}
export function apiClient() {
  let hostname = window.location.hostname,
    API_CLIENT_URL = 'http://client.onlyhi.cn';
  if (hostname === 'crm.onlyhi.cn') {  //正式环境
    API_CLIENT_URL = 'http://client.onlyhi.cn';
  } else if (hostname === 'admin.onlyeduhi.cn') {//公网测试环境
    API_CLIENT_URL = 'http://clienttest.haiketang.net';
  } else {//本机测试环境
    // API_CLIENT_URL = 'http://client.onlyhi.cn';

    // API_CLIENT_URL = 'http://clienttest.haiketang.net';
  }

  return API_CLIENT_URL;
  // return "https://admin.onlyhi.cn";
}
export function zhaoWs() {
  let hostname = window.location.hostname,
    Ws = 'http://client.onlyhi.cn';
  if (hostname === 'crm.onlyhi.cn') {  //正式环境
    Ws = 'http://client.onlyhi.cn';
  } else if (hostname === 'admin.onlyeduhi.cn') {//公网测试环境
    Ws = 'http://clienttest.haiketang.net';
  } else {//本机测试环境
    Ws = 'ws://192.168.0.4:8080';
  }
  return Ws;
  // return "https://admin.onlyhi.cn";
}
export function csyWs() {
  let hostname = window.location.hostname,
    Ws = 'ws://139.196.29.9:8070/onlyhi-admin';
  if (hostname === 'crm.onlyhi.cn') {  //正式环境
    Ws = 'ws://139.196.29.9:8070/onlyhi-admin';
  } else if (hostname === 'admin.onlyeduhi.cn') {//公网测试环境
    Ws = 'ws://api.onlyeduhi.cn:8090/onlyhi-admin-0.0.1-SNAPSHOT';
  } else {//本机测试环境
    Ws = 'ws://192.168.1.16:8080/onlyhi-admin';
  }
  return Ws;
  // return "https://admin.onlyhi.cn";
}
export function hanWs() {
  let hostname = window.location.hostname,
    Ws = 'wss://ws.onlyeduhi.com/onlyhi-WebSocket';
  if (hostname === 'crm.onlyhi.cn') {  //正式环境
    Ws = 'wss://ws.onlyeduhi.com/onlyhi-WebSocket';
  } else if (hostname === 'admin.onlyeduhi.cn') {//公网测试环境
    Ws = 'wss://ws.onlyeduhi.com/onlyhi-WebSocket';
  } else {//本机测试环境
    Ws = 'ws://172.16.10.12:8181/onlyhi-WebSocket';
  }
  return Ws;
  // return "https://admin.onlyhi.cn";
}

/************************
 * 公共API
 * Shen Bo
 * **********************/
export function COMMON_API() {
  return {
    "zhaoWs": zhaoWs()+'/MessagePushWebSocket',//明珠websocket
    "websocketApi":hanWs()+'/MessagePushWebSocket',//websocket
    "csyWs": csyWs() + '/websocket',//陈士勇websocket
    "getCoursePriceType": apiBase() + '/CoursePriceManager/getCoursePriceType',//获取课时包类型
    "getUserBaseinfo": apiBase() + '/userBase/getUserBase',//获取用户基本信息
    "allSubject": apiBase() + '/course/getAllSubject',//获取所有科目
    "allBookVersion": apiBase() + '/course/getAllSubjectVersion',//获取所有教材版本
    "allBank": apiBase() + '/payOrder/getAllBank',//所有银行
    "allChannel": apiBase() + '/channel/getAllChannel',//获取所有渠道
    "getAllCcInfo": apiBase() + '/CrRecommendLeads/getAllCcInfo',//获取所有CC用户
    "getAllTeacher": apiHiCRM() + '/crm/account/getAllTeacher',//获取所有老师
    "allChannelLevel": apiBase() + '/marketKpi/getChannelLevel',//获取渠道等级
    // "getSendRecord": apiHiCRM() + '/crm-notification/getInformationSendRecord',//获取未读信息
    "getSendRecord": apiHiCRM()+'/crm/auth/getMessage',//获取未读信息
    "editSendRecord": apiHiCRM() + '/crm-notification/editInformationSendRecord',//获取未读信息
    "getUserTeam" : apiHiCRM() + '/crm/common/getUserTeam',//获取用户管理的团队信息
    "getRecommendChannel" : apiHiCRM() + '/crm/channel/getRecommendChannel',//获取推荐leads渠道
    "getAvailableCoursePackage" : apiHiCRM() + '/crm/order/coursePrice/getAvailableCoursePackage',//获取购买课时包
    //快速搜索功能
    "quickSearch": {
      // "search": apiBase() + '/leads/getLeadsAndCcInfo',
      "search": apiHiCRM() + '/crm/account/leadsTeacherList',
      "markToS": apiBase() + '/leads/editLeadsToSign'
    },
    // 多权限
    "Role": {
      "getAllUserRole": apiBase() + '/user/getAllUserRole',
      "switchUserRole": apiBase() + '/user/switchUserRole',
    },
    "noticePushCourseCount": apiBase() + '/PushManagerCourseMessage/getHaveManagerCourseCount',//排课消息提醒功能信息 推送总数量
    "noticePushCourseInfo": apiBase() + '/PushManagerCourseMessage/getHaveManagerCourseInfo',//获取销售对应的排课要求通过消息数据
    "allSchool": apiBase() + '/interview/getAllSchool',//获取老师所有学校
    "allStudySchool": apiBase() + '/webapi/school/getSchoolByAreaCode',//获取学生所有学校
    "ssqAreaAll": apiBase() + '/interview/getAreaByParatCode',//老师省市区
    "ssqAreaAllStudy": apiBase() + '/webapi/school/getAreaByParatCode',//学生省市区
    "getGradeRank": apiBase() + '/student/getGradeRank',//获取年级排名
    "getShoolLevel": apiBase() + '/student/getShoolLevel',//获取学校等级
    "getPhoneHZ": apiBase() + '/phone/getPhoneHZ',//获取用户电话号码
    "editUserPassword": apiBase() + '/userBase/editUserPassword',//更新用户密码
    "getAllPayGrade": apiBase() + '/payGrade/getPayGradeByType',//获取薪资等级
    "allPayGrade": apiBase() + '/payGrade/getAllPayGrade',//获取薪资等级
    "ccTeamList": apiBase() + '/team/getAllCcTeam',//获取cc团队
    "crTeamList": apiBase() + '/team/getAllCrTeam',//获取cr团队
    "Phone": {
      "getFullPhone": apiBase() + '/phone/getPhoneHZ',//获取用户电话号码
      "callPhone": apiBase() + '/outCall/doPreviewOutCall',//天润拨打号码
      "RYcallPhone":  apiHiCRM() + '/crm/auth/paas/callEvent',//融营拨打号码
      "axnCallPhone":  apiHiCRM() + '/crm/auth/axn/call',//axn融营拨打号码
      "RYhangup":  apiHiCRM() + '/crm/auth/paas/hangup',//挂机
      "RYonWork":  apiHiCRM() + '/crm/auth/paas/onWork',//上机
      "RYoffWork":  apiHiCRM() + '/crm/auth/paas/offWork',//下机
      "getUnusePaasAccount":  apiHiCRM() + '/crm/auth/paas/getUnusePaasAccount',//获取座机号列表
      "getUnusePaasAccount2":  apiHiCRM() + '/crm/auth/axn/getUnuseAxnAccount',//绑定融营axn获取座机号列表
      "getUnusePaasAccountInfo":  apiHiCRM() + '/crm/auth/paas/getUnusePaasAccountInfo',//根据座机号显示对应的密码和号码
      "binding":  apiHiCRM() + '/crm/auth/paas/binding',//绑定
      "axnbind":  apiHiCRM() + '/crm/auth/axn/bind',//绑定axn
    },
    "Notice": {
      "addNotice": apiBase() + '/notice/addNotice',//公告栏新增
      "getAllNoticeDeatil": apiBase() + '/notice/getAllNoticeDeatil',//公告栏列表
      "getNoticeDeatil": apiBase() + '/notice/getNoticeDeatil',//公告栏查询
      "updateNotice": apiBase() + '/notice/updateNotice',//下架公告栏
    },
    "Music": {
      "editFormalMusicSwitch": apiBase() + '/FormalMusicSwitch/editFormalMusicSwitch',//音乐状态
      "getFormalMusicSwitch": apiBase() + '/FormalMusicSwitch/getFormalMusicSwitch',//音乐播放暂停接口
    }
  }
}

//**********数据报表start**********
//合肥老师课表订单
store.state.queryHfCourseOrderPage =  '/crm/kpi/hfCourse/queryHfCourseOrderPage';//合肥老师课表订单查询


//**********数据报表end**********

//**********日志管理start**********
//业务日志
store.state.getBusinessLogPage = '/businessLog/getBusinessLogPage'; //查询
store.state.getOptionModule = '/businessLog/getOptionModule'; //获取所有操作模块
store.state.getOptionType = '/businessLog/getOptionType';  //获取所有操作类型

//课程回放
store.state.info = '/crm/course/queryCoursePlayBackPage'; //搜索
store.state.getCourseLogInfo = '/crm-businessmonitor/getCourseLogInfo';  //查看进出日志
store.state.getTrackDataInfo = '/crm-businessmonitor/getTrackDataInfo';  //课程回放

//**********日志管理end**********

store.state.MenuTrees = '/resource/getAllMenu';
