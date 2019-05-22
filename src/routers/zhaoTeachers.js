/**
 * 招师流程
 * Created by ShenBo on 2018/5/9.
 */

import router from 'components/router';
import interviewSchedule from 'components/zhaoTeachers/interviewSchedule/interviewSchedule';
import waitAssignTeacher from 'components/zhaoTeachers/waitAssignTeacher/waitAssignTeacher';
import waitToOffer from 'components/zhaoTeachers/waitToOffer/waitToOffer';
import waitInterview from 'components/zhaoTeachers/waitInterview/waitInterview';
import waitTrain from 'components/zhaoTeachers/waitTrain/waitTrain';
import waitPerfectInfo from 'components/zhaoTeachers/waitPerfectInfo/waitPerfectInfo';
import waitSecondTrain from 'components/zhaoTeachers/waitSecondTrain/waitSecondTrain';
export default{
  path:'/zhaoTeachers',
  component:router,
  children :[
    {
      path:'interviewSchedule',//老师面试安排
      name:'interviewSchedule',
      component: interviewSchedule,
    },
    {
      path:'waitAssignTeacher',//分配老师
      name:'waitAssignTeacher',
      component: waitAssignTeacher,
    },
    {
      path:'waitToOffer',//待邀约
      name:'waitToOffer',
      component: waitToOffer,
    },
    {
      path:'waitInterview',//待面试
      name:'waitInterview',
      component: waitInterview,
    },
    {
      path:'waitTrain',//待培训
      name:'waitTrain',
      component: waitTrain,
    },
    {
      path:'waitPerfectInfo',//待完善审核
      name:'waitPerfectInfo',
      component: waitPerfectInfo,
    },
    {
      path:'waitSecondTrain',//待二次培训
      name:'waitSecondTrain',
      component: waitSecondTrain,
    },
  ]
};
