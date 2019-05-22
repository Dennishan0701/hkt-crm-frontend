/**
 * 公共模块
 * Created by ShenBo on 2018/5/9
 */

import router from 'components/router';
// import quickStudent from 'dashborader/quickSearchResult/quickSearchResult';
import center from 'dashborader/center/center.vue';
export default{
  path:'/public',
  component:router,
  children :[
    // {
    //   path:'quickStudent',//快速搜索学生信息
    //   name:'quickStudent',
    //   component: quickStudent
    // },
    {
      path:'center/personal',//个人中心
      name:'center',
      component: center
    },
  ]
};
