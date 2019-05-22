/**
 * 销售与客服
 * Created by ShenBo on 2018/5/9
 */

import router from 'components/router';
import saleIndex from 'components/sc/index/index';
import ccHome from 'components/sc/index/ccHome';
import crHome from 'components/sc/index/crHome';
import waitFollowed from 'components/sc/waitFollowed/waitFollowed';
import appointment from 'components/sc/public/appointment.vue';
import ccWaitCourse from 'components/sc/waitCourse/waitCourse';
import ccAddRequirements from 'components/sc/waitCourse/addRequirements';
import ccViewRequirements from 'components/sc/waitCourse/viewRequirements';
import ccWaitFeedBack from 'components/sc/waitFeedBack/waitFeedBack.vue';
import ccWaitPay from 'components/sc/waitPay/waitPay.vue';
import ccWaitFirstCourse from 'components/sc/waitFirstCourse/waitFirstCourse.vue';
import handOutStudent from 'components/sc/handOutStudent/handOutStudent.vue';
import ccMyStudent from 'components/sc/myStudent/ccMyStudent.vue';
import crMyStudent from 'components/sc/myStudent/crMyStudent.vue';
import contractStudents from 'components/sc/contractStudents/contractStudents.vue';
import NewStudentSigning from 'components/sc/contractStudents/NewStudentSigning.vue';
import renewedTheMonth from 'components/sc/contractStudents/renewedTheMonth.vue';
import defendStudentMonth from 'components/sc/myStudent/defendStudentMonth.vue';
import moneyStudentMonth from 'components/sc/myStudent/moneyStudentMonth.vue';
import focusStudentMonth from 'components/sc/myStudent/focusStudentMonth.vue';
import crMyMaintainStudent from 'components/sc/myStudent/crMyMaintainStudent.vue';
import conclusion from 'components/sc/myStudent/conclusion.vue';
import crMyRefundStudent from 'components/sc/myStudent/crMyRefundStudent.vue';
import crMyClosedStudent from 'components/sc/myStudent/crMyClosedStudent.vue';
import classList from 'components/sc/myStudent/classList.vue';//我的学生课时
import myOrder from 'components/sc/order/myOrder.vue';//我的订单
import leadsDetailByCc from 'components/sc/leads/detail/leadsDetailByCc.vue';
import leadsDetailByCr from 'components/sc/leads/detail/leadsDetailByCr.vue';
import viewCourse from 'components/sc/leads/viewCourse/viewCourse.vue';
import leadsDetailByError from 'components/sc/leads/detail/error.vue';
import addRecommendLeads from 'components/sc/leads/addRecommendLeads/addRecommendLeads.vue';
import formalCourse from 'components/sc/formalCourse/formalCourse.vue';//正式课排课表
import orderSplit from 'components/order/split/orderSplit.vue';
import onlyHi from 'components/onlyHi.vue';//登录欢迎页面
export default{
  path:'/scs',
  component:router,
  children :[
    {
      path:'saleIndex',//首页  隐藏
      name:'saleIndex',
      component: saleIndex
    },
    {
      path:'ccHome',//CC首页  隐藏
      name:'ccHome',
      component: ccHome
    },
    {
      path:'crHome',//CR首页  隐藏
      name:'crHome',
      component: crHome
    },
    {
      path:'ccMyStudent',//CC我的学生
      name:'ccMyStudent',
      component: ccMyStudent
    },
    {
      path:'crMyStudent',//CR我的学生
      name:'crMyStudent',
      component: crMyStudent
    },
    {
      path:'contractStudents',//我签约的学生
      name:'contractStudents',
      component: contractStudents
    },
    {
      path:'NewStudentSigning',//2~5月新签学生
      name:'NewStudentSigning',
      component: NewStudentSigning
    },
    {
      path:'renewedTheMonth',//本月已续费
      name:'renewedTheMonth',
      component: renewedTheMonth
    },
    {
      path:'defendStudentMonth',//本月可维护学生
      name:'defendStudentMonth',
      component: defendStudentMonth
    },
    {
      path:'moneyStudentMonth',//本月可续费学生
      name:'moneyStudentMonth',
      component: moneyStudentMonth
    },
    {
      path:'focusStudentMonth',//本月重点维护学生
      name:'focusStudentMonth',
      component: focusStudentMonth
    },
    {
      path:'crMyMaintainStudent',//CR我的维护学生信息
      name:'crMyMaintainStudent',
      component: crMyMaintainStudent
    },
    {
      path:'conclusion',//CR本月结课学生
      name:'conclusion',
      component: conclusion
    },
    {
      path:'crMyRefundStudent',//CR我的退费学生
      name:'crMyRefundStudent',
      component: crMyRefundStudent
    },
    {
      path:'crMyClosedStudent',//CR我的停课学生
      name:'crMyClosedStudent',
      component: crMyClosedStudent
    },
    {
      path:'classList',//我的学生课时
      name:'classList',
      component: classList
    },
    {
      path:'waitFollowed',//待跟进
      name:'waitFollowed',
      component: waitFollowed
    },
    {
      path:'ccWaitCourse',//待排课
      name:'ccWaitCourse',
      component: ccWaitCourse
    },
    {
      path:'handOutStudent',//移交正式生
      name:'handOutStudent',
      component: handOutStudent
    },
    {
      path:'ccWaitFeedBack',//待反馈
      name:'ccWaitFeedBack',
      component: ccWaitFeedBack
    },
    {
      path:'ccWaitPay',//待付费
      name:'ccWaitPay',
      component: ccWaitPay
    },
    {
      path:'ccWaitFirstCourse',//待开第一节正式课
      name:'ccWaitFirstCourse',
      component: ccWaitFirstCourse
    },
    {
      path:'addRecommendLeads',//新增推荐Leads
      name:'addRecommendLeads',
      component: addRecommendLeads
    },
    {
      path:'formalCourse',//正式课排课表
      name:'formalCourse',
      component: formalCourse
    },
    {
      path:'orderSplit',//订单拆分
      name:'orderSplit',
      component: orderSplit
    },
    {
      path:'onlyHi',//欢迎页  隐藏
      name:'onlyHi',
      component: onlyHi
    },
    {
      path:'viewCourse',//学生课表  隐藏
      name:'viewCourse',
      component: viewCourse
    },
    {
      path:'ccAddRequirements',//待排课-提交课程要求  隐藏
      name:'ccAddRequirements',
      component: ccAddRequirements
    },
    {
      path:'ccViewRequirements',//待排课-查看课程要求  隐藏
      name:'ccViewRequirements',
      component: ccViewRequirements
    },
    {
      path:'leadsDetailByCc',//CC学生详情  隐藏
      name:'leadsDetailByCc',
      component: leadsDetailByCc
    },
    {
      path:'leadsDetailByCr',//CR学生详情  隐藏
      name:'leadsDetailByCr',
      component: leadsDetailByCr
    },
    {
      path:'leadsDetailByError',//详情错误页  隐藏
      name:'leadsDetailByError',
      component: leadsDetailByError
    },
    {
      path:'appointment',//预约课程  隐藏
      name:'appointment',
      component: appointment
    },
    {
      path:'myOrder',//我的订单
      name:'myOrder',
      component: myOrder
    },
  ]
};
