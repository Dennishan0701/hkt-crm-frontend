/**
 * 排课管理
 * 教研
 * Created by ShenBo on 2018/5/9
 */

import router from 'components/router';
import courseIndex from 'components/studyCourse/index/index';
import waitCourse from 'components/studyCourse/waitCourse/waitCourse';
import alreadyCourse from 'components/studyCourse/alreadyCourse/alreadyCourse';
import formalClass from 'components/studyCourse/formalClass/formalClass';
import formalApply from 'components/studyCourse/formalApply/formalApply';
import gearCourse from 'components/studyCourse/waitCourse/gearCourse';
import rejectedCourse from 'components/studyCourse/rejectedCourse/rejectedCourse';
export default{
  path:'/study',
  component:router,
  children :[
    {
      path:'courseIndex',//排课首页
      name:'courseIndex',
      component: courseIndex
    },
    {
      path:'waitCourse',//待排课程
      name:'waitCourse',
      component: waitCourse
    },
    {
      path:'gearCourse',//待排  隐藏
      name:'gearCourse',
      component: gearCourse
    },
    {
      path:'rejectedCourse',//已拒绝课程
      name:'rejectedCourse',
      component: rejectedCourse
    },
    {
      path:'alreadyCourse',//已排课程
      name:'alreadyCourse',
      component: alreadyCourse
    },
    {
      path:'formalClass',//正式课排课表
      name:'formalClass',
      component: formalClass
    },
    {
      path:'formalApply',//排正式课请求表
      name:'formalApply',
      component: formalApply
    },
  ]
};
