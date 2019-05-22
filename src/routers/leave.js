/**
 * 课程管理模块
 * Created by ShenBo on 2018/5/9
 */

import router from 'components/router';
import testLeave from 'components/leave/testLeave';
import formalLeave from 'components/leave/formalLeave';
export default{
  path:'/leave',
  component:router,
  children :[
    {
      path:'testLeave',//测试请假审批
      name:'testLeave',
      component: testLeave
    },
    {
      path:'formalLeave',//正式请假审批
      name:'formalLeave',
      component: formalLeave
    },
  ]
};
