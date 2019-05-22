/**
 * 日志管理
 * Created by ShenBo on 2018/5/9
 */

import router from 'components/router';
import businessLog from 'components/log/businessLog/businessLog';
import debugCourseLog from 'components/log/debugCourseLog/debugCourseLog';
import crBackCallLog from 'components/log/crBackCallLog/crBackCallLog';
import trOutBoundLog from 'components/log/trOutBoundLog/trOutBoundLog';
import trOutBoundRealLog from 'components/log/trOutBoundLog/trOutBoundRealLog';
import trCcOutBoundLog from 'components/log/trOutBoundLog/trCcOutBoundLog';
import clientLog from 'components/log/clientLog/clientLog';
import coursePlaybackLog from 'components/log/coursePlaybackLog/coursePlaybackLog';
import tryCoursePlaybackLog from 'components/log/coursePlaybackLog/tryCoursePlaybackLog';
import userComputer from 'components/log/userComputer/userComputer';
export default{
  path:'/logs',
  component:router,
  children :[
    {
      path:'businessLog',//业务日志
      name:'businessLog',
      component: businessLog
    },
    {
      path:'debugCourseLog',//调试课列表
      name:'debugCourseLog',
      component: debugCourseLog
    },
    {
      path:'crBackCallLog',//天润回访统计
      name:'crBackCallLog',
      component: crBackCallLog
    },
    {
      path:'trOutBoundLog',//天润外呼记录
      name:'trOutBoundLog',
      component: trOutBoundLog
    },
    {
      path:'trCcOutBoundLog',//cc外呼记录
      name:'trCcOutBoundLog',
      component: trCcOutBoundLog
    },
    {
      path:'trOutBoundRealLog',//天润外呼实时记录
      name:'trOutBoundRealLog',
      component: trOutBoundRealLog
    },
    {
      path:'clientLog',//客户端操作日志
      name:'clientLog',
      component: clientLog
    },
    {
      path:'coursePlaybackLog',//课程回放
      name:'coursePlaybackLog',
      component: coursePlaybackLog
    },
    {
      path:'tryCoursePlaybackLog',//试听课课程回放
      name:'tryCoursePlaybackLog',
      component: tryCoursePlaybackLog
    },
    {
      path:'userComputer',//用户设备查询
      name:'userComputer',
      component: userComputer
    },
  ]
};
