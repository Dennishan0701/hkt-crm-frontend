/**
 * 课耗管理
 * Created by ShenBo on 2018/5/9.
 */
import router from 'components/router';
import courseCast from 'components/courseCast/courseCast.vue';
import CourseConsume from 'components/courseCast/CourseConsume/CourseConsume.vue';//课时管理
import courseRevise from 'components/courseCast/courseRevise/courseRevise.vue';//课程调整

export default{
  path:'/courseCast',
  component:router,
  children :[
    {
      path:'courseCast',//完课管理
      name:'courseCast',
      component: courseCast,
    },
    {
      path:'CourseConsume',//课时管理
      name:'CourseConsume',
      component: CourseConsume,
    },
    {
      path:'courseRevise',//课程调整
      name:'courseRevise',
      component: courseRevise,
    },
  ]
};
