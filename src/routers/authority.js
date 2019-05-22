/**
 * 权限管理模块
 * Created by Bing on 2017/6/19 0019.
 */

import router from 'components/router';
import user from 'components/authority/user/user';
import role from 'components/authority/role/role';
import roleGrant from 'components/authority/role/grant';
import team from 'components/authority/team/team.vue';
import organization from 'components/authority/organization/organization';
import posts from 'components/authority/posts';
import resource from 'components/authority/resource/resource';
import resetPassword from 'components/authority/resetPassword/resetPassword';
import resetStudentPhone from 'components/authority/resetStudentPhone';


export default{
  path:'/authority',
  component:router,
  children :[
    {
      path:'user',//用户管理
      name:'user',//用户
      component: user
    },
    {
      path:'role',//角色管理
      name:'role',
      component: role
    },
    {
      path:'roleGrant',//角色授权 //默认不显示
      name:'roleGrant',
      component: roleGrant
    },
    {
      path:'team',//团队管理
      name:'team',
      component: team
    },
    {
      path:'organization',//部门管理
      name:'organization',
      component: organization
    },
    {
      path:'posts',//职位管理
      name:'posts',
      component: posts
    },
    {
      path:'resource',//资源管理
      name:'resource',//用户
      component: resource
    },
    {
      path:'resetPassword',//重置密码
      name:'resetPassword',
      component: resetPassword
    },
    {
      path:'resetStudentPhone',//修改正式生手机号
      name:'resetStudentPhone',
      component: resetStudentPhone
    },
  ]
};
