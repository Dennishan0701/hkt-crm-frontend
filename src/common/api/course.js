/**
 * 权限管理模块
 * Created by Bing on 2017/6/16 0016.
 */
import {apiBase} from '../api.config';

export function COURSE(){
  return {
    //测评课
    "cancel": {
      "cancelReview": apiBase() + '/assessmentCourseApply/getAssessmentCourseApply',//测评课取消审批
      "cancelApproval": apiBase() + '/assessmentCourseApply/assessmentCourseApproval'//测评课通过/拒绝审批
    },
    //正式课
    "formal": {
      "formalReview": apiBase() + '/assessmentCourseApply/getAssessmentCourseApply',//正式课取消审批
      "formalApproval": apiBase() + '/assessmentCourseApply/assessmentCourseApproval'//正式课取消审批
    }
  }
}
