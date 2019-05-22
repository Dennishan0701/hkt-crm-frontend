/**
 * 客户端管理
 * Created by ShenBo on 2018/5/9
 */

import router from 'components/router';
import clientDown from 'components/client/clientDown/clientDown';
import clientFile from 'components/client/clientFile/clientFile';
import clientRemark from 'components/client/clientRemark/clientRemark';

export default{
  path:'/client',
  component:router,
  children :[
    {
      path:'clientDown',//下载统计
      name:'clientDown',
      component: clientDown
    },
    {
      path:'clientFile',//版本管理
      name:'clientFile',
      component: clientFile
    },
    {
      path:'clientRemark',//意见反馈
      name:'clientRemark',
      component: clientRemark
    },
  ]
};
