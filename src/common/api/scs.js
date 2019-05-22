/**
 * 销售与客服模块
 * Created by Bing on 2017/6/16 0016.
 */

import {apiBase,apiHiCRM} from '../api.config.js';

export function SCS() {
  return {
    "index": apiBase() + '/srNewLeads/getHomePage',
    "ccHome": apiBase() + '/CcHomePage/getHomePageDeesInfo',
    "Leads": {
      // "addRecommendLeads": apiBase() + '/CrRecommendLeads/createRecommendLeads',//新增推荐Leads
      "addRecommendLeads": apiHiCRM() + '/crm/account/recommend/createRecommendLeads',//新增推荐Leads
      "getLeadsByPhone": apiBase() + '/CrRecommendLeads/getLeadsByPhone',//通过电话号码查询对应的Leads
    },
    /**
     * 我的学生
     */
    "MyStudent": {
      // "cc_dataGrid": apiBase() + '/ccLeads/getCCManagerLeads',
      "cc_dataGrid": apiHiCRM() + '/crm/account/leads/saleTrajectory/getCcLeadsList',
      "cr_dataGrid": apiBase() + '/crStudent/getCrStudent',
      "greenChannelByCr": apiBase() + '/cr/mystudent/createPayGreenChannel',//绿色通道
      "greenChannelByCc": apiBase() + '/cc/MyStudent/createPayGreenChannel',//绿色通道
      "getCrMyMaintainStudent": apiBase() + '/crMyMaintainStudent/getCrMyMaintainStudent',//我的维护学生信息
      "keyPoint": apiBase() + '/cr/mystudent/addStudentKeyPoint',//标记
      "cancelKeyPoint": apiBase() + '/cr/mystudent/removeStudentKeyPoint',//取消标记
      "getStudentCourseInfo": apiBase() + '/CrBaseInfo/getStudentCourseInfo',//学生课表
      "getDayCourseDetailRecord": apiBase() + '/CrBaseInfo/getDayCourseDetailRecord',//获取一天学生课表
      "editLeadsFamily": apiBase() + '/CcBaseInfo/editLeadsFamily',//更新CC家长信息
      "createDubugCourse": apiBase() + '/DebugCourse/createDubugCourse',//开调试课
      "isDebuging": apiBase() + '/DebugCourse/isDebuging',//判断leads是否已在调课中
      "addCourseOrderRequest": apiHiCRM() + '/crm/course/addCourseOrderRequest',//cr学生提交正式课申请
      // "getHandOutRemark": apiBase() + '/HandOutRemark/getHandOutRemark',//获取移交备注
      "getHandOutRemark": apiHiCRM() + '/crm/account/handOutRemark/getHandOutRemark',//获取移交备注
      // "addHandOutRemark": apiBase() + '/HandOutRemark/addHandOutRemark',//新增移交备注
      "addHandOutRemark": apiHiCRM() + '/crm/account/handOutRemark/addHandOutRemark',//新增移交备注
      // "updateHandOutRemark": apiBase() + '/HandOutRemark/updateHandOutRemark',//编辑移交备注
      "updateHandOutRemark": apiHiCRM() + '/crm/account/handOutRemark/updateHandOutRemark',//编辑移交备注
      "getCcMySignStudent": apiBase() + '/cc/MySignStudent/getCcMySignStudent',//我签约的学生
      "queryCrNewSignedStudent": apiHiCRM() + '/crm/kpi/queryCrNewSignedStudent',//2~5月新签学生
      "queryCrRenewStudent": apiHiCRM() + '/crm/kpi/queryCrRenewStudent',//本月已续费
      "classList": apiHiCRM() + '/crm/order/classList',//课时列表
      // "classList":'http://172.16.20.96:8118/classList',//课时列表
      // ****2018.4.16新添加****
      // "getHandOutRemark2": apiHiCRM() + 'onlyhi-admin/HandOutRemark/getHandOutRemark',//获取移交备注
      // "getPayDiscountType": apiHiCRM() + '/crm/account/payDiscount/getPayDiscountType',//获取折扣券
      "getPayDiscountType": apiHiCRM() + '/crm/order/payDiscount/getPayDiscountType',//获取折扣券
      "createQuickMark": apiHiCRM() + '/crm/order/ping/createQuickMark',//Ping ++支付生成二维码
      "getHuiXueXiPaymentUrl": apiHiCRM() + '/crm/order/huiXueXi/getHuiXueXiPaymentUrl',//获取惠学习支付的二维码
      "deletePaymentDetail": apiHiCRM() + '/crm/order/payRequest/deletePaymentDetail',//删除支付详情
    },

    /**
     * 待跟进
     */
    "WaitFollowed": {
      "dataGrid": apiHiCRM() + '/crm/account/leads/saleTrajectory/getCcWaitConnect',//获取待跟进列表
      // "dataGrid": apiBase() + '/leads/getWaitLeads',//获取待跟进列表
      // "dataGrid": apiHiCRM() + '/crm/account/ccFollow/queryCcFollowPage',//获取待跟进列表
      "giveUpType": apiBase() + '/leads/getAllGiveUpType',//放弃
      // "giveUp": apiBase() + '/leads/giveUpLeads',//添加备注
      "giveUp": apiHiCRM() + '/crm/account/ccLeadsStatus/giveUpLeads',//添加备注
      // "addRemark": apiBase() + '/leads/createLeadsRemark',//显示历史备注信息
      "addRemark": apiHiCRM() + '/crm/account/ccLeadsRemark/addLeadsRemark',//显示历史备注信息
      // "historyRemark": apiBase() + '/leads/getAllLeadsRemark',//历史备注
      "historyRemark": apiHiCRM() + '/crm/account/ccLeadsRemark/getLeadsRemarkByLeadsPhone',//历史备注
      // "updateCallState": apiBase() + '/leads/editCallState',//记录leads电话拨打记录以及跟进备注
      "updateCallState": apiHiCRM() + '/crm/account/ccLeadsStatus/editCallState',//记录leads电话拨打记录以及跟进备注
      // "createCourse": apiBase() + '/course/createCourseOrder',//创建预约课程
      "createCourse": apiHiCRM() + '/crm/account/ccCourseOrder/ccCreateCourseOrder',//创建预约课程
      // "priorityFollow": apiBase() + '/ccWaitFollow/addKeyPointFollow',//标记为优先跟进
      "priorityFollow": apiHiCRM() + '/crm/account/ccFollow/addKeyPointFollow',//标记为优先跟进
      // "cancelPriorityFollow": apiBase() + '/ccWaitFollow/removeKeyPointFollow',//取消标记为优先跟进
      "cancelPriorityFollow": apiHiCRM() + '/crm/account/ccFollow/removeKeyPointFollow',//取消标记为优先跟进
      "tmkWaitSign": apiHiCRM() + '/crm/auth/tmkWaitSign',//标记TMK跟进
      "addCallState": apiHiCRM() + '/crm/account/ccLeadsStatus/addCallState',
    },
    /**
     * 待排课
     */
    "WaitCourse": {
      // "dataGrid": apiBase() + '/course/getPageCourse',
      "dataGrid": apiHiCRM() + '/crm/account/ccWaitManagerCourse/queryWaitManagerPage',
      "cr_dataGrid": apiBase() + '/crStudent/getCrWaitCourseStudent',
      //提交排课要求
      // "saveRequirements": apiBase() + '/course/createCourseRequest',
      "saveRequirements": apiHiCRM() + '/crm/account/ccCourseRequest/ccCreateCourseRequest',
      //放弃排课、预约要求
      "giveUpRequirements": apiBase() + '/course/giveUpCourseRequest',
      //放弃课程预约
      // "giveUpCourse": apiBase() + '/course/giveUpCourse',
      "giveUpCourse": apiHiCRM() + '/crm/account/ccWaitManagerCourse/giveUpCourse',
      //查看排课要求
      // "viewRequirements": apiBase() + '/ccWaitManagerCourse/getCourseBaseInfo',
      "viewRequirements": apiHiCRM() + '/crm/account/ccWaitManagerCourse/getCourseBaseInfo',
      //获取一条课程信息
      "getCourseOrder": apiBase() + '/course/getCourseOrder',
      //文件上传
      "uploadFile": apiBase() + '/upload/uploadFile',
      //删除文件
      "deleteFile": apiBase() + '/upload/deleteUploadFile',
      //获取老师的课程安排和空闲时间
      "getTeacherTimeSchedule": apiBase() + '/teacherDate/getTeacherTimeSchedule'
    },
    /**
     * 待反馈
     */
    "WaiteFeedBack": {
      // "dataGrid": apiBase() + '/course/getFeedBackCourse',
      "dataGrid": apiHiCRM() + '/crm/account/ccFeedBackCourse/queryCcFeedBackCoursePage',
      "cr_dataGrid": apiBase() + '/crStudent/getCrWaitFeedbackStudent',
      //提交反馈
      // "addFeedback": apiBase() + '/course/editFeedBackInfo',
      "addFeedback": apiHiCRM() + '/crm/account/ccFeedBackCourse/editFeedBackInfo',
    },
    /**
     * 待付费
     */
    "WaitPay": {
      // "dataGrid": apiBase() + '/course/getWaitPayLeads',
      "dataGrid": apiHiCRM() + '/crm/account/ccWaitPay/queryWaitPayPage',
      "cr_dataGrid": apiBase() + '/crStudent/getCrWaitPayStudent',
      // "payRequest": apiBase() + '/payOrder/createPayRequest',//提交付费申请
      // "payRequest": apiHiCRM() + '/crm/account/ccWaitPay/ccCreatePayRequest',//提交付费申请
      // "payRequest": apiHiCRM() + '/crm/account/payRequest/createPayRequest',//提交付费申请
      "payRequest": apiHiCRM() + '/crm/order/payRequest/updatePayRequest',//提交付费申请  2019.1.29更新
      // "getPayRequest": apiBase() + '/payOrder/getPayOrderInfo',//查看付费申请
      // "getPayRequest": apiHiCRM() + '/crm/account/ccWaitPay/getPayOrderInfo',//查看付费申请
      "getPayRequest":apiHiCRM() +'/crm/account/payRequest/getPayOrderInfo',//查看付费申请
      "updateCourseOrder": apiBase() + '/CrUpdateCourse/updateCourseOrder',//更改已支付状态
      "uploadPayPicture": apiBase() + '/payOrder/uploadPayPicture',//上传付费截图
      // "uploadPayPicture2":apiHiCRM() +'/crm/account/payRequest/uploadPayPicture',//上传付费截图2
      "uploadPayPicture2":apiHiCRM() +'/crm/order/payRequest/uploadPayPicture',//上传付费截图2
      "updateHandOutRemark": apiBase() + 'onlyhi-admin/HandOutRemark/updateHandOutRemark',//编辑移交表
    },
    /**
     * 待开第一节正式课
     */
    "WaitFirstCourse": {
      "dataGrid": apiBase() + '/student/getPageWaitPlanFirstCourseStudent',
      "createCourse": apiBase() + '/course/createCourse',//开课
      "MakeUpLessons": apiBase() + '/CrBaseInfo/MakeUpLessons',//补课
      "getByUuid": apiBase() + '/student/getWaitPlanFirstCourseByUuid'
    },
    /**
     * 待移交正式生
     */
    "WaitHandOutStudnt": {
      "dataGrid": apiBase() + '/student/getWaitHandOutStudnt',
      "getAllCrInfo": apiBase() + '/student/getAllCrInfo',//获取所有CR
      //移交
      "handOutStudent": apiBase() + '/student/handOutStudent'
    },
    /**
     * 正式课排课表
     */
    "FormalCourse": {
      "getFormalCourseInfo": apiBase() + '/FormalCourse/getFormalCourseInfo',//获取管理的学生对应的正式课排课信息
      "batchCreateFormalCourse": apiBase() + '/FormalCourse/batchCreateFormalCourse',//批量创建课程
      "isLegalCourseDate": apiBase() + '/FormalCourse/isLegalCourseDate',//判断日期是否符合规范
      "getWeek": apiBase() + '/FormalCourse/getWeek',//获取下周日期
    }
  }
}
