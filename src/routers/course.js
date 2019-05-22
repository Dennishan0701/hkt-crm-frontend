/**
 * 课程管理模块
 * Created by ShenBo on 2018/5/9
 */

import router from 'components/router';
import cancelReview from 'components/course/cancelReview';
export default{
  path:'/course',
  component:router,
  children :[
    {
      path:'cancelReview',//测评课取消审核
      name:'cancelReview',
      component: cancelReview
    },
  ]
};
