/**'
 * 天润
 * Created by Bing on 2017/6/16 0016.
 */
import {apiBase} from '../api.config';

export function TIANRUN() {
  return {
    "ToolBar": {
      "login": apiBase() + '/SeatsManager/loginSeatsAndOnLine',//登陆并上线天润
      // "onLine": apiBase() + '/SeatsManager/seatsOnLine',//天润上线
      "offLine": apiBase() + '/SeatsManager/seatsOffLine',//天润下线
      "seatsBind": apiBase() + '/SeatsManager/seatsBind',//修改坐席绑定电话
      "editSeatsCallStatus": apiBase() + '/SeatsManager/editSeatsCallStatus',//修改坐席状态
    },
    "Call": {
      "outCall": apiBase() + '/outCall/doPreviewOutCall',//外呼
    }
  }
}
