/**
 * 财务管理
 * Created by ShenBo on 2018/5/9
 */

import router from 'components/router';
import offlineWaitCheckDeeds from 'components/finance/checkDees/waitCheckDeeds';
import offlinealreadyCheckDeeds from 'components/finance/checkDees/alreadyCheckDeeds';
import offlineDees from 'components/finance/tongji/offline.vue';
import depositOrder from 'components/finance/tongji/depositOrder.vue';
import onlineDees from 'components/finance/tongji/online.vue';
import waitCheckChildOrder from 'components/finance/childOrder/waitCheck.vue';
import alreadyCheckChildOrder from 'components/finance/childOrder/alreadyCheck.vue';
import invoice from 'components/finance/invoice/invoice.vue';
import waitMergeOrder from 'components/order/mergeOrder/waitMergeOrder.vue';
import orderCourseConsume from 'components/finance/tongji/orderCourseConsume.vue';

export default{
  path:'/finance',
  component:router,
  children :[
    {
      path:'offlineWaitCheckDeeds',//线下待审核业绩
      name:'offlineWaitCheckDeeds',
      component: offlineWaitCheckDeeds
    },
    {
      path:'offlinealreadyCheckDeeds',//线下已审核业绩
      name:'offlinealreadyCheckDeeds',
      component: offlinealreadyCheckDeeds
    },
    {
      path:'offlineDees',//线下业绩统计
      name:'offlineDees',
      component: offlineDees
    },
    {
      path:'depositOrder',//已收订金订单
      name:'depositOrder',
      component: depositOrder
    },
    {
      path:'onlineDees',//线上业绩统计
      name:'onlineDees',
      component: onlineDees
    },
    {
      path:'waitCheckChildOrder',//待审核子单
      name:'waitCheckChildOrder',
      component: waitCheckChildOrder
    },
    {
      path:'alreadyCheckChildOrder',//已审核子单
      name:'alreadyCheckChildOrder',
      component: alreadyCheckChildOrder
    },
    {
      path:'invoice',//发票管理
      name:'invoice',
      component: invoice
    },
    {
      path:'waitMergeOrder',//待合并订单
      name:'waitMergeOrder',
      component: waitMergeOrder
    },
    {
      path:'orderCourseConsume',//订单课耗
      name:'orderCourseConsume',
      component: orderCourseConsume
    },
  ]
};
