/**
 * 路由总文件
 * Created by Bing on 2017/6/19 0019.
 */


import Vue from 'vue';
import Router from 'vue-router';
import App from './App';

Vue.use(Router);

import authority from './routers/authority';
import client from './routers/client';
import common from './routers/common';
import course from './routers/course';
import courseCast from './routers/courseCast';
import dataAnalysis from './routers/dataAnalysis';
import distribution from './routers/distribution';
import eacharts from './routers/eacharts';
import finance from './routers/finance';
import fullTimeTeacher from './routers/fullTimeTeacher';
import leave from './routers/leave';
import logs from './routers/logs';
import mo from './routers/mo';
import order from './routers/order';
import publics from './routers/public';
import report from './routers/report';
import salary from './routers/salary';
import scs from './routers/scs';
import study from './routers/study';
import target from './routers/target';
import tcResearch from './routers/tcResearch';
import teachers from './routers/teachers';
import templateBoard from './routers/templateBoard';
import zhaoTcAgent from './routers/zhaoTcAgent';
import zhaoTeachers from './routers/zhaoTeachers';
import outBoundDetail from './routers/outBoundDetail';
export default new Router({
  mode: 'hash',
  routes: [
    {
      path: "/",
      compontent: App,
      redirect: ''
    },
    authority,//基础与权限模块
    client,//客户端模块
    common,//公共管理
    course,//课程管理
    courseCast,//课耗管理
    dataAnalysis,//数据分析模块
    distribution,//分配管理
    eacharts,//echart表格模块
    finance,//财务
    fullTimeTeacher,//全职老师
    leave,//课程管理
    logs,//日志相关
    mo,//市场与运营
    order,//订单相关
    publics,//公共模块
    report,//数据报表
    salary,//薪资管理
    scs,//销售与客服
    study,//排课管理
    target,//指标管理
    tcResearch,//教研
    teachers,//师资管理
    templateBoard,//模板管理
    zhaoTcAgent,//招师代理
    zhaoTeachers,//招师流程
    outBoundDetail,//外呼明细
  ]
})
