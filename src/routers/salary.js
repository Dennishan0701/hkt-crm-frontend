/**
 * 薪资管理
 * Created by ShenBo on 2018/5/9
 */

import router from 'components/router';
import salaryJianzhi from 'components/salary/salaryJianzhi.vue';
import salaryQuanzhi from 'components/salary/salaryQuanzhi.vue';
export default{
  path:'/salary',
  component:router,
  children :[
    {
      path:'salaryJianzhi',//等级时薪-兼职
      name:'salaryJianzhi',
      component: salaryJianzhi
    },
    {
      path:'salaryQuanzhi',//等级时薪-全职
      name:'salaryQuanzhi',
      component: salaryQuanzhi
    },
  ]
};
