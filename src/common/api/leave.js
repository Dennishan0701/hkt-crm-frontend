/**
 * 权限管理模块
 * Created by Bing on 2017/6/16 0016.
 */
import {apiBase} from '../api.config';

export function LEAVE(){
  return {
    //测评课请假审批
    "testLeave": {
      "dataGrid": apiBase() + '/leave/queryLeavePage',//请假审批
      "auditTestCourseLeave": apiBase() + '/leave/auditTestCourseLeave'//请假审批通过/拒绝
    },
    "formalLeave": {
      "dataGrid": apiBase() + '/leave/queryLeavePage',//请假审批
      "auditFormalCourseLeave": apiBase() + '/leave/auditFormalCourseLeave'//请假审批通过/拒绝
    },
  }
}
