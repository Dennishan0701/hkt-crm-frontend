/**'
 * 安莱拨打
 * Created by ShenBo on 2017/06/10
 */
import {apiHiCRM} from '../api.config';

export function ANLAI() {
  return {
    "ToolBar": {
  //  /crm/account
      "bingAnlan": apiHiCRM()+'/crm/account/bingAnlanAccout',//绑定安莱账号
      "getAnLanUserGroup": apiHiCRM()+'/crm/account/getAnLanUserGroup',//获取用户组
      "updateAccount": apiHiCRM()+'/crm/account/updateAnLanAccount',//更新安莱账号
      "getAnLanStatus": apiHiCRM() + '/crm/account/getAnLanAccountLoginStatus',//获取安莱状态
      "login": apiHiCRM() + '/crm/account/loginAnlanAccout',//登录安莱
      "loginOut": apiHiCRM() + '/crm/account/logOutAnLanAccount',//退出安莱
    },
    "CallPhone": {
      "call": apiHiCRM() + '/crm/account/dailPhone',//拨打
      "handUp": apiHiCRM() + '/crm/account/handUpDail',//挂断
    },
    "SendMessage": {
      "send": apiHiCRM() + '/crm/account/sendMessage',//发送
    },
    "viewAppraise": {
      "viewAppraiseUrl": apiHiCRM() + '/crm/course/course/viewAppraise',//查看老师评价
    },
  }
}
