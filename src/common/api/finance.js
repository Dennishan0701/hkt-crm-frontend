/**
 * 财务
 * Created by Bing on 2017/6/16 0016.
 */
import {apiBase,apiHiCRM} from '../api.config';
export function FINANCE() {
  return {
    "WaitCheckDeeds": { //线下业绩
      // "dataGrid": apiBase() + '/GaWaitCheckDeeds/getPageWaitCheckDeeds',
      "dataGrid":apiHiCRM() +'/crm/order/waitCheckDeeds/queryWaitCheckDeesPage',
      "pass": apiHiCRM() + '/crm/order/waitCheckDeeds/passCheck',//审核通过
      "reject": apiHiCRM() + '/crm/order/waitCheckDeeds/refuseCheck',//审核拒绝
      "revise": apiHiCRM() + '/crm/order/waitCheckDeeds/modifyWaitCheckOrders',//修改订单信息
    },
    "AlreadyCheckDeeds": { //已审核业绩
      "dataGrid": apiBase() + '/GaHaveCheckDeeds/getPageHaveCheckDeeds',
    },
    "Tongji": {
      "onlineDataGrid": apiBase() + '/GaOnlineDees/getOnlineDeesInfo',//线上业绩统计
      // "offlineDataGrid": apiBase() + '/GaOfflineDees/getPageDeesInfo',//线下业绩统计
      "offlineDataGrid": apiHiCRM() + '/crm/order/offlineDees/queryOfflineDeesPage',//线下业绩统计
      "queryDepositOrderPage": apiHiCRM() + '/crm/order/depositOrder/queryDepositOrderPage',//已收订金订单
        "queryPaymentOrderPage": apiHiCRM() + '/crm/order/paymentOrder/queryPaymentOrderPage',//我的订单
      // "markForRefund": apiBase() + '/GaOfflineDees/markForRefund',//标记为退费
      "markForRefund": apiHiCRM() + '/crm/order/offlineDees/markForRefund',//标记为退费
    },
    "ChildOrder": {
      "WaitCheck": {//待审核子单
        "dataGrid": apiBase() + '/WaitCheckChildOrder/getWaitCheckChildOrderInfo',
        "passCheck": apiBase() + '/WaitCheckChildOrder/passCheck',//审核通过
        "refuseCheck": apiBase() + '/WaitCheckChildOrder/refuseCheck',//审核拒绝
      },
      "AreadyCheck": {//已审核子单
        "dataGrid": apiBase() + '/HaveCheckChildOrder/getHaveCheckChildOrder',
      }
    },
    "waitSale" : {
      "generateTeamKpiExcel":apiHiCRM() + '/crm/order/waitCheckDeeds/generateWaitCheckDeedsExcel',//线下业绩导出excel
      // "generateTeamKpiExcel":apiBase() + '/GaWaitCheckDeeds/generateWaitCheckDeedsExcel',//线下业绩导出excel
      // "generateTeamKpiExcel":apiHiCRM() + '/crm/order/offlineDees/generateWaitCheckDeedsExcel'//线下业绩导出excel
    },
    "alreadySale" : {
      "generateTeamKpiExcel":apiBase() + '/GaHaveCheckDeeds/generateHaveCheckDeedsExcel'
    },
    "offLineSale" : {
      // "generateTeamKpiExcel":apiBase() + '/GaOfflineDees/generateOfflineDeesExcel'
      // "generateTeamKpiExcel":apiHiCRM() + '/crm/order/offlineDees/generateOfflineDeesExcel',
      // "generateTeamKpiExcel":apiHiCRM() + '/crm/order/offlineDees/getOfflineDeesExcel'
      "generateTeamKpiExcel":apiHiCRM() + '/crm/order/offlineDees/getOfflineDeesExcel'
    },
    //发票管理
    "invoice" : {
      'dataGrid':apiBase() + '/receiptManager/getReceiptManagerOrders',//发票管理列表
      // 'editReceiptStatus':apiBase() + '/receiptManager/editReceiptStatus'//更新发票状态
      'writeInvoice':apiHiCRM() + '/crm/order/offlineDees/writeInvoice'//更新发票状态
    },
    "orderCourseConsume":{
      'queryOfflineDeesPage':apiHiCRM() + '/crm/order/courseOrder/queryOfflineDeesPage',//获取订单
      'queryCourseByOrder':apiHiCRM() + '/crm/order/courseOrder/queryCourseByOrder',//获取已关联订单课程
      'queryUnrelatedCourse':apiHiCRM() + '/crm/order/courseOrder/queryUnrelatedCourse',//获取未关联订单课程
      'queryUnrelatedCourseOrder':apiHiCRM() + '/crm/order/courseOrder/queryUnrelatedCourseOrder',//获取未关联订单排课
      'getOrderNoByLeadsUuid':apiHiCRM() + '/crm/order/courseOrder/getOrderNoByLeadsUuid',//获取学生订单号
      'connectOrder':apiHiCRM() + '/crm/order/courseOrder/connectOrder',//课程关联订单
      'cancelConnectOrder':apiHiCRM() + '/crm/order/courseOrder/cancelConnectOrder',//取消关联
      'createCourseOrder':apiHiCRM() + '/crm/order/courseOrder/createCourseOrder',//新建排课
      'courseConnectCourseOrder':apiHiCRM() + '/crm/order/courseOrder/courseConnectCourseOrder',//课程关联排课
      'updateCourseLeadsByPhone':apiHiCRM() + '/crm/order/courseOrder/updateCourseLeadsByPhone',//课程重新关联学生
    }
  }
}
