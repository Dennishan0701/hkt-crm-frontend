/**
 * 指标管理
 * Created by ShenBo on 2018/5/9
 */

import router from 'components/router';
import target from 'components/teamTarget/target';
import allTarget from 'components/teamTarget/allTarget/allTarget';
export default{
  path:'/teamTarget',
  component:router,
  children :[
    {
      path:'target',//业绩指标管理
      name:'target',
      component: target
    },
    {
      path:'allTarget',//销售月指标管理
      name:'allTarget',
      component: allTarget
    },
  ]
};
