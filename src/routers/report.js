/**
 * 数据报表
 * Created by ShenBo on 2018/5/9
 */

import router from 'components/router';
import zhaoTeacherKpi from 'components/report/zhaoTeacherKpi/zhaoTeacherKpi';
import saleKpi from 'components/report/saleKpi/saleKpi';
import marketChannel from 'components/report/marketChannel/marketChannel';
import signUpKpi from 'components/report/marketChannel/signUpKpi';
import monitorCourse from 'components/report/monitorCourse/monitorCourse';
import arrangeCourse from 'components/report/arrangeCourse/arrangeCourse';
import hefeiArrangeCourse from 'components/report/arrangeCourse/hefeiArrangeCourse';
import teacherRegistration from 'components/report/teacher/teacherRegistration';
import planCourse from 'components/report/planCourse/planCourse.vue';
import slist from 'components/report/slist/slist.vue';
import plannedTrain from 'components/report/plannedTrain/plannedTrain.vue';
import salesDetails from 'components/report/salesDetails/salesDetails.vue';
import salesMonitoring from 'components/report/salesMonitoring/salesMonitoring.vue';
import salesMonitoringList from 'components/report/salesMonitoring/salesMonitoringList.vue';
import recommendLeads from 'components/report/leads/recommendLeads.vue';//推荐leads数据
import hefeiRecommendLeads from 'components/report/leads/hefeiRecommendLeads.vue';//合肥推荐leads数据
import crRecommend from 'components/report/leads/crRecommend.vue';
import promotionLeadsKpi from 'components/report/leads/promotionLeadsKpi.vue';
import promotionLeadsMoreKpi from 'components/report/leads/promotionLeadsMoreKpi.vue';
import formalStudent from 'components/report/leads/formalStudent.vue';
import trainKpi from 'components/report/train/trainKpi.vue';
import waitHandOutStudent from 'components/report/student/waitHandOutStudent.vue';
import lecturerRecommendedFee from 'components/report/lecturerRecommendedFee/lecturerRecommendedFee.vue';//讲师推荐费
import zhaoListMoney from 'components/report/zhaoAgentList/zhaoListMoney.vue';//招师代理薪资
import zhaoAgentData from 'components/report/zhaoAgentList/zhaoAgentData.vue';//招生代理数据
import zhaoAgentChenFather from 'components/report/zhaoAgentList/zhaoAgentChenFather.vue';//招生代理陈爸爸
import zhaoAgentWangMother from 'components/report/zhaoAgentList/zhaoAgentWangMother.vue';//招生代理王妈妈
import zhaoAgentXiuMother from 'components/report/zhaoAgentList/zhaoAgentXiuMother.vue';//招生代理秀妈
import zhaoAgentZhangChiMother from 'components/report/zhaoAgentList/zhaoAgentZhangChiMother.vue';//招生代理张弛妈
import zhaoAgentXiangTingMother from 'components/report/zhaoAgentList/zhaoAgentXiangTingMother.vue';//招生代理湘婷妈妈
import allRenewalRate from 'components/report/renewalRate/allRenewalRate.vue';//总到期续费率
import teamRenewalRate from 'components/report/renewalRate/teamRenewalRate.vue';//团队总到期续费率
import renewalsKpi from 'components/report/renewalRate/renewalsKpi.vue';//续费Kpi
import boutiqueDetails from 'components/report/boutiqueDetails/boutiqueDetails.vue';//续费Kpi
import stopStudent from 'components/report/student/stopStudent.vue';//停课学员
import classStudent from 'components/report/student/classStudent.vue';//结课学员
import readingStudent from 'components/report/student/readingStudent.vue';//在读学员
import refundStudent from 'components/report/student/refundStudent.vue';//退费学员
import teamSaleKpi from 'components/report/teamSaleKpi/teamKpi.vue';//本团队销售KPI
import leadsPhoneStatus from 'components/report/leads/leadsPhoneStatus.vue';//leads接通情况记录
import resultStudent from 'components/report/student/resultStudent.vue';//学生成绩报表
import salesCourseMonitoring from 'components/report/salesMonitoring/salesCourseMonitoring.vue';//销售总排课监控
import listenNoConversionLeadsKpi from 'components/report/conversionLeadsKpi/listenNoConversionLeadsKpi.vue';//试听未转化明细
import noListenConversionLeadsKpi from 'components/report/conversionLeadsKpi/noListenConversionLeadsKpi.vue';//未试听转化明细
import hefeiTcCourseOrder from 'components/report/hefeiTcCourseOrder/hefeiTcCourseOrder.vue';//合肥老师课表订单
import saleReportKpi from 'components/report/saleReportKpi/saleKpi.vue';//销售报表KPI
import teamDistribution from 'components/report/teamSaleKpi/teamDistribution.vue';//团队分配统计
export default{
  path:'/report',
  component:router,
  children :[
    {
      path:'zhaoTeacherKpi',//招师部KPI
      name:'zhaoTeacherKpi',
      component: zhaoTeacherKpi
    },
    {
      path:'saleKpi',//销售部KPI
      name:'saleKpi',
      component: saleKpi
    },
    {
      path:'saleReportKpi',//销售部KPI
      name:'saleReportKpi',
      component: saleReportKpi
    },
    {
      path:'marketChannel',//市场渠道报表
      name:'marketChannel',
      component: marketChannel
    },
    {
      path:'signUpKpi',//市场报名数据
      name:'signUpKpi',
      component: signUpKpi
    },
    {
      path:'monitorCourse',//教学-监课表
      name:'monitorCourse',
      component: monitorCourse
    },
    {
      path:'arrangeCourse',//排课数据
      name:'arrangeCourse',
      component: arrangeCourse
    },
    {
      path:'hefeiArrangeCourse',//合肥-排课数据
      name:'hefeiArrangeCourse',
      component: hefeiArrangeCourse
    },
    {
      path:'teacherRegistration',//老师报名数据
      name:'teacherRegistration',
      component: teacherRegistration
    },
    {
      path:'planCourse',//排课KPI
      name:'planCourse',
      component: planCourse
    },
    {
      path:'slist',//S名单报表
      name:'slist',
      component: slist
    },
    {
      path:'plannedTrain',//已安排培训列表
      name:'plannedTrain',
      component: plannedTrain
    },
    {
      path:'salesDetails',//销售业绩明细
      name:'salesDetails',
      component: salesDetails
    },
    {
      path:'salesMonitoring',//销售业务监控
      name:'salesMonitoring',
      component: salesMonitoring
    },
    {
      path:'recommendLeads',//推荐leads数据
      name:'recommendLeads',
      component: recommendLeads
    },
    {
      path:'hefeiRecommendLeads',//合肥推荐leads数据
      name:'hefeiRecommendLeads',
      component: hefeiRecommendLeads
    },
    {
      path:'crRecommend',//CR推荐leads报表
      name:'crRecommend',
      component: crRecommend
    },
    {
      path:'promotionLeadsKpi',//推广leads报表
      name:'promotionLeadsKpi',
      component: promotionLeadsKpi
    },
    {
      path:'promotionLeadsMoreKpi',//推广报名数据明细
      name:'promotionLeadsMoreKpi',
      component: promotionLeadsMoreKpi
    },
    {
      path:'formalStudent',//正式生数据
      name:'formalStudent',
      component: formalStudent
    },
    {
      path:'trainKpi',//培训部KPI
      name:'trainKpi',
      component: trainKpi
    },
    {
      path:'waitHandOutStudent',//待催移交学员
      name:'waitHandOutStudent',
      component: waitHandOutStudent
    },
    {
      path:'zhaoListMoney',//招师代理薪资
      name:'zhaoListMoney',
      component: zhaoListMoney
    },
    {
      path:'lecturerRecommendedFee',//讲师推荐费
      name:'lecturerRecommendedFee',
      component: lecturerRecommendedFee
    },
    {
      path:'zhaoAgentData',//招生代理报名数据
      name:'zhaoAgentData',
      component: zhaoAgentData
    },
    {
      path:'zhaoAgentChenFather',//招生代理-陈爸爸
      name:'zhaoAgentChenFather',
      component: zhaoAgentChenFather
    },
    {
      path:'zhaoAgentWangMother',//招生代理-王妈妈
      name:'zhaoAgentWangMother',
      component: zhaoAgentWangMother
    },
    {
      path:'zhaoAgentXiuMother',//招生代理-秀妈
      name:'zhaoAgentXiuMother',
      component: zhaoAgentXiuMother
    },
    {
      path:'zhaoAgentZhangChiMother',//招生代理-张弛妈妈
      name:'zhaoAgentZhangChiMother',
      component: zhaoAgentZhangChiMother
    },
    {
      path:'zhaoAgentXiangTingMother',//招生代理-湘婷妈妈
      name:'zhaoAgentXiangTingMother',
      component: zhaoAgentXiangTingMother
    },
    {
      path:'allRenewalRate',//总到期续费率
      name:'allRenewalRate',
      component: allRenewalRate
    },
    {
      path:'teamRenewalRate',//团队到期续费率
      name:'teamRenewalRate',
      component: teamRenewalRate
    },
    {
      path:'renewalsKpi',//续费KPI
      name:'renewalsKpi',
      component: renewalsKpi
    },
    {
      path:'boutiqueDetails',//精品课业绩明细
      name:'boutiqueDetails',
      component: boutiqueDetails
    },
    {
      path:'stopStudent',//停课学员
      name:'stopStudent',
      component: stopStudent
    },
    {
      path:'classStudent',//结课学员
      name:'classStudent',
      component: classStudent
    },
    {
      path:'readingStudent',//在读学员
      name:'readingStudent',
      component: readingStudent
    },
    {
      path:'refundStudent',//退费学员
      name:'refundStudent',
      component: refundStudent
    },
    {
      path:'teamSaleKpi',//本团队销售KPI
      name:'teamSaleKpi',
      component: teamSaleKpi
    },
    {
      path:'leadsPhoneStatus',//leads接通情况记录
      name:'leadsPhoneStatus',
      component: leadsPhoneStatus
    },
    {
      path:'resultStudent',//学生成绩报表
      name:'resultStudent',
      component: resultStudent
    },
    {
      path:'salesCourseMonitoring',//销售总排课监控
      name:'salesCourseMonitoring',
      component: salesCourseMonitoring
    },
    {
      path:'salesMonitoringList',//销售团队人员负责leads详情  隐藏
      name:'salesMonitoringList',
      component: salesMonitoringList
    },
    {
      path:'listenNoConversionLeadsKpi',//试听未转化明细
      name:'listenNoConversionLeadsKpi',
      component: listenNoConversionLeadsKpi
    },
    {
      path:'noListenConversionLeadsKpi',//未试听转化明细
      name:'noListenConversionLeadsKpi',
      component: noListenConversionLeadsKpi
    },
    {
      path:'hefeiTcCourseOrder',//合肥老师课表订单
      name:'hefeiTcCourseOrder',
      component: hefeiTcCourseOrder
    },
    {
      path:'teamDistribution',//合肥老师课表订单
      name:'teamDistribution',
      component: teamDistribution
    },
  ]
};
