/**
 * Created by ShenBo on 2017/11/27.
 */
import {apiBase,apiHiCRM} from '../api.config';

export function CLIENT(){
  return {
    "clientDown":{//下载
      "dataGrid":apiBase()+"/clientDownloadCount/queryClientDownloadCountPage",//下载统计查询

    },
    "ClientFile":{//上传下载
      "dataGrid":apiBase()+"/clientFile/queryClientFilePage",//下载统计查询
      "addClientFile":apiBase()+"/clientFile/addClientFile",//添加客户端
      "updateClientFile":apiBase()+"/clientFile/updateClientFile",//添加客户端
      "getClientType":apiBase()+"/clientFile/getClientType",//客户端类型
      "uploadClientFile":apiBase()+"/clientFile/uploadClientFile",//上传客户端文件
      "downloadClientFile":apiBase()+"/clientFile/downloadClientFile",//下载客户端文件
    },
    "clientRemark":{//上传下载
      "dataGrid":apiHiCRM()+"/crm-businessmonitor/getClientFeedbackInfo",//下载统计查询
    }
  }
}
