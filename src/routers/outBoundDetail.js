/**
 * 外呼明细
 * Created by DennisHan on 2018/7/13
 */

import router from 'components/router';
import callAnLaiNumDetail from 'components/outBoundDetail/callAnLaiNumDetail.vue';//安莱呼入号码明细
import anlaiCallDetail from 'components/outBoundDetail/anlaiCallDetail.vue';//安莱外呼通话明细
import anlaiCallTimeCount from 'components/outBoundDetail/anlaiCallTimeCount.vue';//安莱外呼通时通次明细
import rongyingCallTimeCount from 'components/outBoundDetail/rongyingCallTimeCount.vue';//融营外呼通时通次明细
import leadsOutBoundDetail from 'components/outBoundDetail/leadsOutBoundDetail.vue';//leads外呼明细
import anlaiOutBoundCount from 'components/outBoundDetail/anlaiOutBoundCount.vue';//安莱用户外呼统计(实时)
import rongyingOutBoundDetail from 'components/outBoundDetail/rongyingOutBoundDetail.vue';//融营外呼明细
import tianrunCallTimeCount from 'components/outBoundDetail/tianrunCallTimeCount.vue';//天润外呼通时通次明细
export default{
  path:'/outBoundDetail',
  component:router,
  children :[
    {
      path:'callAnLaiNumDetail',//安莱呼入号码明细
      name:'callAnLaiNumDetail',
      component: callAnLaiNumDetail
    },
    {
      path:'anlaiCallDetail',//安莱外呼通话明细
      name:'anlaiCallDetail',
      component: anlaiCallDetail
    },
    {
      path:'anlaiCallTimeCount',//安莱外呼通时通次明细
      name:'anlaiCallTimeCount',
      component: anlaiCallTimeCount
    },
    {
      path:'rongyingCallTimeCount',//融营外呼通时通次明细
      name:'rongyingCallTimeCount',
      component: rongyingCallTimeCount
    },
    {
      path:'leadsOutBoundDetail',//leads外呼明细
      name:'leadsOutBoundDetail',
      component: leadsOutBoundDetail
    },
    {
      path:'anlaiOutBoundCount',//leads外呼明细
      name:'anlaiOutBoundCount',
      component: anlaiOutBoundCount
    },
    {
      path:'rongyingOutBoundDetail',//融营外呼明细
      name:'rongyingOutBoundDetail',
      component: rongyingOutBoundDetail
    },
    {
      path:'tianrunCallTimeCount',//天润外呼同时通次明细
      name:'tianrunCallTimeCount',
      component: tianrunCallTimeCount
    }
  ]
};
