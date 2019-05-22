/**
 * 模板管理
 * Created by ShenBo on 2018/5/9
 */

/** 模板管理 **/
import router from 'components/router';
import NewsBoard from 'components/templateBoard/NewsBoard/NewsBoard.vue';
import SMSboard from 'components/templateBoard/SMSboard/SMSboard.vue';
export default{
  path:'/templateBoard',
  component:router,
  children :[
    {
      path:'NewsBoard',//消息模板管理
      name:'NewsBoard',
      component: NewsBoard
    },
    {
      path:'SMSboard',//短信模板管理
      name:'SMSboard',
      component: SMSboard
    },
  ]
};
