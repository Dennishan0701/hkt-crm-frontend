/**
 * 日志
 * Created by Bing on 2017/6/16 0016.
 */
import {apiBase,apiHiCRM,apiClient} from '../api.config';

/**
 * 系统业务日志
 */
export function SYS_BUSINESS() {
  return {
    "dataGrid": apiBase() + '/businessLog/getBusinessLogPage', //  业务日志
    "allOptionModule": apiBase() + '/businessLog/getOptionModule', //获取所有操作模块
    "allOptionType": apiBase() + '/businessLog/getOptionType',  //获取所有操作类型
    "downloadVoiceFile": apiBase() + '/trOutboundRecord/downloadVoiceFile',  //天润外呼下载音频
    "downloadVoiceFileReal": apiBase() + '/trRealTimeOutbound/downloadVoiceFile',  //天润外呼实时下载音频
    "getClientInfo": apiHiCRM() + '/operationlog/getClientOperationMonitorInfo',  //获取客户端操作日志查询列表
    "getUserDeviceInformation": apiHiCRM() + '/crm/monitor/getUserDeviceInformation',  //获取用户设备信息
    "DebugCourse":{
      "getDebugCourse": apiBase() + '/DebugCourse/getDebugCourse',  //查询调试课信息
      "getDebugCourseLog": apiBase() + '/DebugCourse/getDebugCourseLog',  //调试课日志信息
      // "getBackCallCount": apiBase() + '/trBackCall/getBackCallCount',  //天润回访统计
      "getAllCrTrCdrOb": apiBase() + '/BusinessMonitors/getAllCrTrCdrOb',  //CR回访表
      "queryOutBoundPage": apiBase() + '/trOutboundRecord/queryOutBoundPage',  //天润外呼记录
      "queryRealTimeOutBoundPage": apiBase() + '/trRealTimeOutbound/queryRealTimeOutBoundPage',  //天润外呼实时记录
      "queryTrOutBoundCCPage": apiHiCRM() + '/crm/tr/queryTrOutBoundCCPage',  //cc外呼实时记录
    },
    "coursePlaybackLog":{
      // "dataGrid": apiHiCRM() + '/crm-businessmonitor/getCoursePlayBack',  //课程回放列表
      "dataGrid": apiHiCRM() + '/crm/course/queryCoursePlayBackPage',  //课程回放列表
      "queryTestCoursePlayBackPage": apiHiCRM() + '/crm/course/queryTestCoursePlayBackPage',  //试听课课程回放列表
      "getCourseLogInfo": apiHiCRM() + '/crm-businessmonitor/getCourseLogInfo',  //查看进出日志
      "getTrackDataInfo": apiHiCRM() + '/crm-businessmonitor/getTrackDataInfo',  //获取视频
    },
    "exportExcel":{
      "importOutboundExcel": apiHiCRM() + '/crm/tr/importOutboundExcel',//导出外呼跟进名单
    },
  }
}
