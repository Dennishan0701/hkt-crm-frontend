/**
 * 外呼明细
 * Created by Bing on 2018/7/13.
 */
import {apiBase,apiHiCRM} from '../api.config';

export function OUTBOUNDDETAIL() {
  return {
    "outBoundDetail":{
      "getAnLanCallIbRecord":apiHiCRM()+ '/crm/kpi/getAnLanCallIbRecord',//安莱呼入号码明细
      "getAnLanCallObRecord": apiHiCRM()+'/crm/kpi/getAnLanCallObRecord',//安莱外呼通话明细
      "getAnLanObCallGeneralTime": apiHiCRM()+ '/crm/kpi/getAnLanObCallGeneralTime',//安莱外呼通时通次明细
      "getAnLanLeadsObCallRecord": apiHiCRM()+ '/crm/kpi/getAnLanLeadsObCallRecord',//leads外呼明细
      "getTeams": apiHiCRM()+ '/crm/kpi/getTeams',//获取团队
      "getAnLanCallRecordingInfo": apiHiCRM()+ '/crm/kpi/getAnLanCallRecordingInfo',//获取电话录音
      "getAnLanUserReportRecord":apiHiCRM()+ '/crm/kpi/getAnLanUserReportRecord',//安莱用户外呼统计
      "getPaasRecord": apiHiCRM()+'/crm/auth/paas/getPaasRecord',//融营外呼明细
      "callGeneralTime": apiHiCRM()+'/crm/auth/paas/callGeneralTime',//融营外呼通时通次明细
      "trCallGeneralTime": apiHiCRM()+'/crm/auth/tr/callGeneralTime',//天润外呼通时通次明细
      "releaseRecordTest": apiHiCRM()+'/crm/auth/paas/releaseRecordTest',//融营外呼通时通次明细--获取呼叫记录
      "getAllTeam": apiHiCRM()+'/crm/kpi/getAllTeam',//融营获取团队
    },
  }
}
