/**
 * 分配管理
 * Created by ShenBo on 2018/5/9
 */

import router from 'components/router';
import mapEachart from 'components/echarts/mapEachart';
export default{
  path:'/echarts',
  component:router,
  children :[
    {
      path:'mapEachart',//地区分布图标
      name:'mapEachart',
      component: mapEachart
    },
  ]
};
