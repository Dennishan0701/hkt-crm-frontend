/**
 * 订单
 * Created by ShenBo on 2017/6/16 0016.
 */
import {apiBase,apiHiCRM} from '../api.config';
export function ORDER() {
  return {
    "CreateOrder": {//创建官网订单
      "createWebOrder": apiBase() + '/PayOrderMerge/createWebOrder',//创建官网订单
      "createThirdOrder": apiBase() + '/ThirdPayOrder/createThirdOrder',//创建爱海米分期支付订单
      "addHuiXueXiOrder": apiHiCRM() + '/crm/order/huiXueXi/addHuiXueXiOrder',//创建惠学习支付订单
      "getLoveHaiMiPayType": apiBase() + '/ThirdPayOrder/getLoveHaiMiPayType',//获取海米分期付款类别
      "createBaiduOrder": apiBase() + '/ThirdPayOrder/createBaiduOrder',//创建百度分期支付订单
      // "getPayMoney": apiBase() + '/PayOrderMerge/getPayMoney',//获取支付金额
      // "getPayMoney": apiHiCRM() + '/crm/account/payDiscount/getPaymentAmount',//获取支付金额
      // "getPayMoney": apiHiCRM() + '/crm/account/payDiscount/getPaymentAmount',//获取支付金额
      "getPayMoney": apiHiCRM() + '/crm/order/payDiscount/getPaymentAmount',//获取支付金额
      // "getLoveHaiMiPayMoney": apiBase() + '/ThirdPayOrder/getLoveHaiMiPayMoney',//获取支付金额
      "getLoveHaiMiPayMoney": apiHiCRM() + '/crm/account/payDiscount/getPaymentAmount',//获取支付金额
      "getLeadsBonusListByLeadsUuid": apiHiCRM() + '/crm/account/leadsPrize/getLeadsBonusListByLeadsUuid',//获取优惠信息
      "getPayRequestInfoByUuid": apiHiCRM() + '/crm/order/payRequest/getPayRequestInfoByUuid',//获取支付订单内容
      "createPayRequest": apiHiCRM() + '/crm/order/payRequest/createPayRequest',//新增付费申请
    },
    "OrderSplit": {//订单拆分
      "dataGrid": apiBase() + '/PayOrderMerge/getWaitPayWebOrder',
      "getChildOrder": apiBase() + '/PayOrderMerge/gerWebChildOrder',//获取官网子订单信息
      "branchOrder": apiBase() + '/PayOrderMerge/banchOrder',//订单拆分提交
      "submitPayRequest": apiBase() + '/PayOrderMerge/submitPayRequest',//提交付费申请
      "getPayRequest": apiBase() + '/PayOrderBranch/getPayRequest',//查看付费申请
    },
    "Merge": {//待合并订单
      "dataGrid": apiBase() + '/PayOrderMerge/getMergeOrder',
      "merge": apiBase() + '/PayOrderMerge/MergeOrder',//合并订单
    }
  }
}
