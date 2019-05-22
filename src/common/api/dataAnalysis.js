/**
 * Created by ShenBo on 2017/12/22.
 */
import {apiHiCRM} from '../api.config';

export function dataAnalysis(){
  return {
    //报名数据分析
    "analyzeSignUpLeads" : {
      "dataGrid" : apiHiCRM() + '/crm/kpi/analyzeSignUpLeads',
    },
    //付费lead分析
    "analyzePayLeads" : {
      "dataGrid" : apiHiCRM() + '/crm/kpi/analyzePayLeads',
    },
    //销售团队数据监控
    "sales" : {
      "dataGrid" : apiHiCRM() + '/crm/kpi/getsaleTeamCourseKpi',//获取团队业绩
      "getUserTeam" : apiHiCRM() + '/crm/common/getUserTeam',//获取用户管理的团队信息
      "getsaleTeamCourseKpi" : apiHiCRM() + '/crm/kpi/getUserCourseKpi',//获取用户的排课数据
    }
  }
}
