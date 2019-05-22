/**
 * 公共管理
 * Created by ShenBo on 2018/5/9
 */

import router from 'components/router';
import notice from 'components/common/notice';
import music from 'components/common/music';
export default{
  path:'/common',
  component:router,
  children :[
    {
      path:'notice',//公告栏
      name:'notice',
      component: notice
    },
    {
      path:'music',//音乐管理
      name:'music',
      component: music
    },
  ]
};
