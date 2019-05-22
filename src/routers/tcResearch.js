/**
 * 教研
 * Created by ShenBo on 2018/5/9.
 */

import router from 'components/router';
import courseWare from 'components/teachingResearch/courseware/courseware.vue';
import systemCourseware from 'components/teachingResearch/courseware/systemCourseware.vue';
import courseWareLibrary from 'components/teachingResearch/courseware/library.vue';
export default{
  path:'/research',
  component:router,
  children :[
    {
      path:'courseWare',//课件管理
      name:'courseWare',
      component: courseWare
    },
    {
      path:'systemCourseware',//系统课件管理
      name:'systemCourseware',
      component: systemCourseware
    },
    {
      path:'courseWareLibrary',//自主上传课件库
      name:'courseWareLibrary',
      component: courseWareLibrary
    },
  ]
};
