/**
 * 权限管理模块
 * Created by ShenBo on 2018/6/03
 */
import {apiBase , apiHiCRM} from '../api.config';

export function AUTHORITY(){
  return {
    //登录、注册、退出等
    "Login": {
      "login": apiBase() + '/login/login'
    },
    //左侧菜单树
    "MenuTree": apiBase()+'/resource/getAllMenu',
    //角色管理
    "Role": {
      "dataGrid": apiBase()+'/Role/getPageRole',
      //获取所有角色(下拉列表)
      "allRole": apiBase()+'/Role/getAllRole',
      //更新角色的基本信息
      "editRoleInfo": apiBase()+'/Role/editRoleInfo',
      //删除角色基本信息(伪删除)
      "deleteRoleInfo": apiBase()+'/Role/deleteRoleInfo',
      //编辑角色的权限信息
      "editRolePermission": apiBase()+'/Role/editRolePermission',
      "getRoleByUuid": apiBase()+'/Role/getRoleByUuid',
      //创建角色信息
      "createRole": apiBase()+'/Role/createRole',
      "grant": apiBase()+'/Role/editRolePermission'  //角色授权
    },
    //用户管理
    "SystemUser": {
      "dataGrid": apiHiCRM()+'/crm/account/getPageAccount',
      "getByUuid": apiBase()+'/user/getUserByUuid',
      "getByToken": apiBase()+'/user/getUserByToken',
      "saveOrUpate": apiBase()+'/user/createOrUpdateUser',
      // "delete": apiBase()+'/user/deleteUser',
      "delete": apiHiCRM()+'/crm/account/deleteUser',//用户管业页面 删除用户
      "bindSeats": apiBase()+'/user/bindSeats',//绑定天润账号
      "saveWorkingTime":apiBase()+'/userBase/editUserWorkingTime',//用户工作时间
      "getPostToUser": apiBase()+'/user/getPostToUser',//获取职位为销售总监、销售主管、销售经理、客服主管、客服经理的
    },
    //团队管理
    "Team": {
      "allTeam": apiBase()+'/team/getAllTeam',//获取所有团队
      "dataGrid": apiBase()+'/team/getPageTeam',//分页获取团队
      "getTeamByUuid": apiBase()+'/team/getTeamByUuid',//通过uuid获取团队信息
      "saveOrUpdate": apiBase()+'/team/createOrUpdateTeam',//创建或更新团队
      "delete":  apiBase()+'/team/deleteTeam',//删除团队
      "getPostToUser":  apiBase()+'/team/getPostToUser',//获取职位为销售总监、销售主管、销售经理、客服主管、客服经理的
      "getPosts": apiBase()+'/Posts/getPosts',//获取职位为销售总监、销售主管、销售经理、客服主管、客服经理的
      "getOrganizationName": apiBase()+'/team/getOrganizationName'//检测是否为销售部
    },
    //部门管理
    "Organization": {
      "dataGrid":apiBase()+'/Organization/getAllOrganization',
      "getAll": apiBase()+'/Organization/getAllOrganization',
      "saveOrUpdate": apiBase()+'/Organization/createOrUpdateOrganization'
    },
    //职位管理
    "Posts": {
      "dataGrid":  apiBase()+'/Posts/getPagePosts',
      "allPosts": apiBase()+'/Posts/getAllPosts',
      "saveOrUpdate": apiBase()+'/Posts/createOrUpdatePosts'
    },
    //资源管理
    "Resource": {
      "getResourceByMenuId": apiBase()+'/resource/getChildMenu',
      "createOrEditResource": apiBase()+'/resource/createOrEditResource',
      "getResourceByUuid": apiBase()+'/resource/getResourceByUuid',
      "delete": apiBase()+'/resource/deleteResource',
      "getAllResourceByRole": apiBase()+'/resource/getAllResource',
    },
    //密码重置
    "reset": {
      "resetPassword": apiHiCRM() + '/crm/account/editPasswordInfo',
    },
    //学科网
    "xkw": {
      // "dataGrid": apiHiCRM() + '/thirdparty/xkw/xkwAuthentication',
      "dataGrid":'https://hkt.onlyhi.cn/threeparty/xkw/xkwAuthentication',
    },
    "ResetInfo": {
      "resetStudentPhone": apiHiCRM() + '/crm/account/updateStudentPhone',
    }
  }
}
