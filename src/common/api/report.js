/**
 * 数据报表
 * Created by Bing on 2017/6/16 0016.
 */
import {apiBase,apiHiCRM} from '../api.config';

export function REPORT() {
  return {
    "Sale": {
      //销售报表KPI新加
      "saleKpiTotalol": apiBase() + '/SaleKpi/getTotalSaleKpi',//获取总的销售KPI
      // 销售报表KPI新加
      "saleKpiTotal": apiHiCRM() + '/crm/kpi/getTotalSaleKpiInfo',//获取总的销售KPI
      "userSaleKpi": apiBase() + '/SaleKpi/getUserSaleKpi',//个人KPI
      "ccSaleKpi": apiBase() + '/SaleKpi/getCcUserSaleKpi',//CCKPI
      "crSaleKpi": apiBase() + '/SaleKpi/getCrUserSaleKpi',//CRKPI
      "teamKpi": apiBase() + '/SaleKpi/getTeamSaleKpi',//团队KPI
      //销售报表KPI新加
      "generateTotalKpiExcelol": apiBase() + '/SaleKpi/generateTotalKpiExcel',//导出总的KPI
      //销售报表KPI新加
      "generateTotalKpiExcel": apiHiCRM() + '/crm/kpi/generateTotalSaleKpiExcel',//导出总的KPI
      // "generateUserKpiExcel": apiBase() + '/SaleKpi/generateUserKpiExcel',//导出个人KPI
      "generateCcUserKpiExcel": apiBase() + '/SaleKpi/generateCcUserKpiExcel',//导出CC_KPI
      "generateCrUserKpiExcel": apiBase() + '/SaleKpi/generateCrUserKpiExcel',//导出CR_KPI
      "generateTeamKpiExcel": apiBase() + '/SaleKpi/generateTeamKpiExcel',//导出团队KPI
      "salesDetails": apiHiCRM() + '/crm/kpi/getSaleDetailKpi',//销售业绩明细报表
      // "salesDetails": apiBase() + '/SaleDetailKpi/getSaleDetailKpi',//销售业绩明细报表
      "exportSalesDetails": apiBase() + '/SaleDetailKpi/generateExcelAndLoad',//导出销售业绩明细报表
      "getManagerTeam": apiBase() + '/OperationMonitor/getManagerTeam',//获取管理的团队
      "getTeamUser": apiBase() + '/OperationMonitor/getTeamUser',//获取团队的组员
      "getSaleTeam": apiBase() + '/team/getSaleTeam',//获取销售团队
      "getTeamSale": apiBase() + '/OperationMonitor/getTeamSale',//获取销售团队的组员
      "getUserLeadsInfo": apiBase() + '/OperationMonitor/getUserLeadsInfo',//获取团队组员管理的leads信息
      "getCoursePriceType": apiBase() + '/CoursePriceManager/getCoursePriceType',//获取课时包类型
      "getStudentByStatus": apiHiCRM() + '/crm/kpi/getStudentByStatus',//通过学生状态查询对应学生信息

      "getManagerTeamSaleKpi": apiBase() + '/SaleKpi/getManagerTeamSaleKpi',//获取负责的团队的销售KPI
      "getManagerUserSaleKpi": apiBase() + '/SaleKpi/getManagerUserSaleKpi',//获取负责的销售的销售KPI

      "queryTeamCourseCount": apiHiCRM() + '/crm/kpi/queryTeamCourseCount',//各个团队排课情况
      "queryCourseDetail": apiHiCRM() + '/crm/kpi/queryCourseDetail',//获取排课数据
      "queryPersonalCourseCount": apiHiCRM() + '/crm/kpi/queryPersonalCourseCount',//获取个人排课数据

      "getArtificialMonth": apiHiCRM() + '/crm/common/getArtificialMonth',//获取人工月
      "getArtificialWeek": apiHiCRM() + '/crm/common/getArtificialWeek',//获取人工周
    },
    "MarketChannel": {
      "market": apiBase() + '/marketKpi/getMarketKpi',//市场渠道KPI报表
      // "signUpKpi": apiBase() + '/SignUpKpi/getSignUpKpi',//开发市场报名数据
      "signUpKpi": apiHiCRM() + '/crm/kpi/channelSignUpKpi/querySignUpDataPage',//开发市场报名数据
      "getGradeCount": apiBase() + '/marketKpi/getGradeCount',//渠道年级分布统计
    },
    "Course": {//课程相关
      "MonitorCourse": {//监课表
        "dataGrid": apiBase() + '/courseManage/queryCourseManagePage',
        "exportData": apiBase() + '/courseManage/generateExcelAndLoad',
        "fullPhone": apiBase() + '/courseManage/displayPhone',
      },
      "ArrangCourse": {//排课表
        // crm/kpi/
        "dataGrid": apiHiCRM() + '/crm/kpi/getArrangeCourseDetail',
        "exportData": apiHiCRM() + '/crm/kpi/generateExcelAndLoad',
      }
    },
    "Teacher": {//老师
      "teacherRegistration": apiBase() + '/teacherRegistration/queryTeacherRegistrationPage',//老师报名数据
      "fullPhone": apiBase() + '/teacherRegistration/displayPhone',//老师报名数据显示号码
      "queryTeacherSchedulePage": apiBase() + '/agencyFee/queryAgencyFeePage',//讲师推荐费
    },
    "PlanCourse": {//排课KPI报表
      "planCourseToTotal": apiBase() + '/arrangeCourseKpi/queryCourseKPI',//排课总KPI
      "planCourseBySubject": apiBase() + '/arrangeCourseKpi/querySubjectKPI',//排课总KPI按科目查看
      "planCourseToPerson": apiBase() + '/teacherCourse/queryTeacherCoursePage',//排课个人KPI
    },
    "S": {//S名
      "dataGrid": apiBase() + '/SignLeadsManager/getSignLeads',//S名单报表
    },
    "PlannedTrain": {//已安排培训列表
      "dataGrid": apiBase() + '/teacherTraining/queryTeacherTrainingPage'
    },
    "Leads": {
      "getCreateUser" : apiHiCRM() + '/crm/kpi/RecommendLeadsKpi/getRecommendCreateUser',//录入人
    "recommendLeads": apiHiCRM() + '/crm/kpi/RecommendLeadsKpi/getRecommendLeadsKpi',//推荐leads数据
    "hefeiRecommendLeads": apiHiCRM() + '/crm/kpi/RecommendLeadsKpi/getHfRecommendLeadsKpi',//合肥推荐leads数据
    "generateExcelAndLoad": apiHiCRM() + '/crm/kpi/RecommendLeadsKpi/generateExcelAndLoad',//推荐leads数据导出
    "hefeiGenerateExcelAndLoad": apiHiCRM() +'/crm/kpi/RecommendLeadsKpi/generateHfExcelAndLoad',//合肥推荐leads数据导出
    "getCrRecommendLeadsKpi": apiHiCRM()+ '/crm/kpi/CrRecommendLeadsKpi/getRecommendLeadsKpi',//CR推荐leads报表
      // "recommendLeads": apiBase() + '/RecommendLeadsKpi/getRecommendLeadsKpi',//推荐leads数据
      // "getCrRecommendLeadsKpi": apiBase() + '/RecommendLeadsKpi/getCrRecommendLeadsKpi',//CR推荐leads报表
      "getNoRepeatRecommendLeadsKpi": apiBase() + '/GeneralizeLeads/getNoRepeatRecommendLeadsKpi',//推广leads数据
      "getRecommendLeadsMoreKpi": apiBase() + '/GeneralizeLeads/getRecommendLeadsKpi',//推广报名数据明细
      "getStudentInfo": apiBase() + '/Studentkpi/getStudentInfo',//正式生KPI
      "getStudentHistoryInfo": apiBase() + '/leads/getAllLeadsRemark',//获取备注信息
      "allChannel": apiBase() + '/channel/getAllChannel',//获取所有渠道
      "getGeneralizeChannel": apiBase() + '/channel/getGeneralizeChannel',//获取推广渠道
      "exportSalesDetails": apiBase() + '/Studentkpi/generateStudentInfoExcel',//导出销售业绩明细报表
      // "generateExcelAndLoad": apiBase() + '/RecommendLeadsKpi/generateExcelAndLoad',//推荐leads数据导出
      "queryLeadsScorePage": apiHiCRM() + '/crm/tr/queryLeadsCallRecordPage'//leads接通情况记录
    },
    "Student": {
      "waitHandOutStudent": apiBase() + '/WaitHandOutAllStudent/getPageAllWaitHandOutStudent',//待催移交学员
      "queryLeadsScorePage": apiHiCRM() + '/crm/kpi/queryLeadsScorePage'//学生成绩报表查询
    },
    "Train": {//培训部KPI
      "totalKpi": apiBase() + '/trainingKpi/queryTrainingPage',
      "subjectKpi": apiBase() + '/trainingKpi/queryTrainingPageByGradePreference',
    },
    "ZhaoAgent": {//招生报表
      "zhaoAgentData": apiBase() + '/LeadsAgentKpi/getLeadsAgentDetailKpi', //招生代理数据
      "zhaoAgentList": apiBase() + '/LeadsAgentKpi/getLeadsAgentKpi',//招生代理报表
      "zhaoListMoney": apiBase() + '/agentKpi/queryAgentKpiPage',//招生代理薪资
      "getLeadsAgentChannel": apiBase() + '/LeadsAgentKpi/getLeadsAgentChannel',//获取所有招生渠道
    },
    "zhaoTeacher": {//招生报表
      "dataGrid": apiBase() + '/recruitTeacherKpi/queryRecruitTeacherKpiPage', //招生代理数据
    },
    "renewalRate":{
      "allRenewalRate": apiHiCRM() + '/crm/kpi/getExpireTotalRenewPayKpi', //获取总的到期续费Kpi
      "allRenewalRateTeam": apiHiCRM() + '/crm/kpi/getExpireTotalTeamRenewPayKpi', //获取总的团队到期续费Kpi
      "teamRenewalRate": apiHiCRM() + '/crm/kpi/getExpireTeamRenewPayKpi', //获取团队2-7月份到期续费
      "teamRenewalRatePersonal": apiHiCRM() + '/crm/kpi/getExpireTeamUserRenewPayKpi', //获取个人到期续费
      "getRenewPayKpi": apiHiCRM() + '/crm/kpi/getRenewPayKpi', //获取总续费kpi
      "getReanewPayUserKpi": apiHiCRM() + '/crm/kpi/getReanewPayUserKpi', //获取总的团队用户续费kpi
    },
    "boutique":{
      "dataGrid": apiHiCRM() + '/crm/kpi/getOutiqueCourseKpi',//精品课业绩明细
      "getLeadsTeacher": apiHiCRM() + '/crm/kpi/getLeadsTeacher',//精品课业绩明细
    },
    "conversionLeads":{                   //转化leads明细
      "listenNoConversionLeadsKpi": apiHiCRM() + '/crm/kpi/listenNoConversionLeadsKpi',//试听未转化
      "noListenConversionLeadsKpi": apiHiCRM() + '/crm/kpi/noListenConversionLeadsKpi',//未试听转化
    },
    "hefeiTcCourseOrder":{
      "hefeiTcCourseOrder": apiHiCRM() + '/crm/kpi/hfCourse/queryHfCourseOrderPage',//合肥老师课表订单查询
      "getPriceClassHour": apiHiCRM() + '/crm/course/getLeadsPriceClassHour',//课时包的课时消耗列表
      "getClassHour": apiHiCRM() + '/crm/course/getLeadsClassHour',//课时列表
    },
    // 团队分配统计报表
    "teamDistribution":{
      "teamDistributionList": apiHiCRM() + '/crm/kpi/teamDistributionKpi/queryTeamDistributionKpiPage',//团队分配统计
      "teamDistributionDetail": apiHiCRM() + '/crm/kpi//teamDistributionKpi/queryTeamDistributionDetail',//团队分配详情
    },
  }
}
