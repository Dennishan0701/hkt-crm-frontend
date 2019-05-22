/**'
 * 天润
 * Created by Bing on 2017/6/16 0016.
 */
import {apiBase,apiHiCRM} from '../api.config';

export function TEMPLATE() {
  return {
    "getCategory": apiHiCRM() + '/crm-notification/getInformationTemplateCategory',//获取消息短信模板类别
    //短信模板
    "SMSboard": {
      "dataGrid": apiHiCRM() + '/crm-notification/getMessageSendTemplate',//获取短信模板
      "getType": apiHiCRM() + '/crm-notification/getMessageSendTemplateType',//获取短信模板类型
      "add": apiHiCRM() + '/crm-notification/addOrEditMessageSendTemplate',//新增短信模板
    },
    //消息模板
    "NewsBoard": {
      "dataGrid": apiHiCRM() + '/crm-notification/getInformationTemplate',//获取消息模板
      "getType": apiHiCRM() + '/crm-notification/getInformationTemplateType',//获取消息模板类型
      "add": apiHiCRM() + '/crm-notification/addOrEditInformationTemplate',//新增消息模板
    },
  }
}
