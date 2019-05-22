/**
 * 分配管理
 * Created by Bing on 2017/6/16 0016.
 */
import {apiBase,apiHiCRM} from '../api.config';

export function DISTRIBUTE() {
  return {
    "FormallStudent": {//正式生分配
      "dataGrid": apiBase() + '/student/getPageNoDistributionStudent',
      "getAgainStudentPage": apiBase() + '/StudentAgainDistribution/getStudentInfo',//获取再分配正式生
      "distribution": apiBase() + '/StudentAgainDistribution/StudentAgainDistribution',//正式生再分配
      "distributionTeam": apiBase() + '/srStudent/distributionStudentToTeam',//新正式生分配团队
      "getStudentOrder": apiBase() + '/srStudent/getStudentOrder'//获取订单信息
    },
    "Leads": {//新名单分配
      // "dataGrid": apiBase() + '/leads/getPageLeadsByCriteria',
      "dataGrid": apiHiCRM() + '/crm/account/leads/saleTrajectory/getNewLeadsList',
      // "dataRecycle": apiBase() + '/srOldLeads/getPageLeadsByCriteria',//藏经阁分配
      "dataRecycle": apiHiCRM() + '/crm/account/leads/saleTrajectory/getOldList',//藏经阁分配
      "distribution": apiBase() + '/leads/distributionLeads',//分配销售
      "recycleLeads": apiBase() + '/srOldLeads/recycleLeads',//藏经阁分配置入回收站
      "getRepeatSignUpLeads": apiBase() + '/RepeatSignUpLeads/getRepeatSignUpLeads',//重复报名leads分配
    },
    "QuitLeads": {//离职人员名单分配
      "dataGrid": apiBase() + '/SrDimissionLeads/getPageDimissionLeads',//离职人员
      "distribution": apiBase() + '/SrDimissionLeads/distributionDimissionLeads',//离职人员分配leads
      "dimissionToTmk":apiHiCRM()+ '/crm/distribution/dimissionLeads/dimissionToTmk',//导入TMK名单
    },
    "QuitFormalStudent" : {//离职人员正式生分配
      "dataGrid": apiBase() + '/SrDimissionStudent/getPageDimissionStudent',//离职正式生人员
      "distribution": apiBase() + '/SrDimissionStudent/distributionDimissionLeads',//离职正式生人员分配leads
    },
    "Recover": {//回收站
      "dataGrid": apiBase() + '/SrRecycleLeads/getRecycleLeads',
      "distribution": apiBase() + '/leads/distributionLeads',//回收站分配
    },
    "Team": {
      "teamFormallStudentPage": apiBase() + '/CrNewDistributionStudent/getWaitDistributionStudent',//本团队新正式生分配
      "teamFormallStudentPageTeam": apiBase() + '/CrNewDistributionStudent/getTeamUser',//本团队新正式生分配
      "getTeamUser": apiBase() + '/CrNewDistributionStudent/getTeamUser',//获取管理的团队里的用户信息
      "distribution": apiBase() + '/CrNewDistributionStudent/DistributionStudentToUser',//本团队分配正式生
    },
    "TmkDistribution": {
      "queryTmkLeadsPage": apiHiCRM()+ '/crm/distribution/tmkLeads/queryTmkLeadsPage',//tmk名单列表
      "getLeadsFollow": apiHiCRM()+ '/crm/distribution/leadsFollow/getLeadsFollow',//获取跟进结果
      "addTmkFollowRecord": apiHiCRM()+ '/crm/distribution/tmkFollowLeads/addTmkFollowRecord',//添加跟进记录
      "importNewLeads": apiHiCRM()+ '/crm/distribution/tmkLeadsImport/importNewLeads',//导入TMK渠道新名单
      "importAiLeads": apiHiCRM()+ '/crm/distribution/tmkLeadsImport/importAiLeads',//导入AI名单
      "getTmkUserList": apiHiCRM()+ '/crm/distribution/tmkLeadsAssign/getTmkUserList',//可以选择的分配人员列表
      "assignLeads": apiHiCRM()+ '/crm/distribution/tmkLeadsAssign/assignLeads',//分配
      "batchAssignLeads": apiHiCRM()+ '/crm/distribution/tmkLeadsAssign/batchAssignLeads',//批量分配
      "getLeadsAssignRecordByLeadsUuid": apiHiCRM()+ '/crm/distribution/tmkFollowLeads/getLeadsAssignRecordByLeadsUuid',//历史备注获取
      "queryCloseCourseLeadsPage": apiHiCRM()+ '/crm/distribution/closeCourseLeads/queryCloseCourseLeadsPage',//结课名单列表
      "getAllTmkLeader": apiHiCRM()+ '/crm/distribution/tmkLeadsAssign/getAllTmkLeader',//获取TMK主管列表
    },
    "distributeRecord": apiBase() + '/SrDistributeRecord/getDistributeLeadsRecord',//分配leads记录
    "distributeRecordStudy": apiBase() + '/SrDistributeRecord/getDistributeStudentRecord',//分配正式生操作记录
    "distributionLeadsToUser": apiBase() + '/user/distributionLeadsToUser',//获取分配leads时对应的销售信息
    "distributionStudentToUser": apiBase() + '/user/distributionStudentToUser',//获取分配正式生时对应的销售信息
    "distributionNewStudentTeam": apiBase() + '/team/getAllTeam',//获取所有团队信息
    "distributionNewStudentCrTeam": apiBase() + '/team/getAllCrTeam',//获取分配新正式生时对应的团队信息
    "distributionStudentTeam": apiBase() + '/CrNewDistributionStudent/getUserToTeam',//获取分配正式生时对应的团队信息
    "getLeadsCallRecordByLeadsUuid": apiHiCRM() + '/crm/account/ccLeadsStatus/getLeadsCallRecordByLeadsUuid',//获取cc给学生的拨打记录
    "queryTeamDistributionUserPage": apiHiCRM() + '/crm/distribution/dimissionToUser/queryTeamDistributionUserPage',//获取团队成员
  }
}
