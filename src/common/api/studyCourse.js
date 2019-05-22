/**
 * 排课
 * Created by Bing on 2017/6/16 0016.
 */
import {apiBase,apiHiCRM} from '../api.config';
export function STUDY_COURSE() {
  return {
    "Home": {
      "index": apiBase() + '/TdHomePage/getHomePage',
      "teacherCourse": apiBase() + '/TdHomePage/queryTeacherCoursePage',
    },
    //待排课
    "WaitCourse": {
      "dataGrid": apiBase() + '/WaitCourse/getPageWaitCourse',
      "createCourse": apiBase() + '/TeachingDepartment/createCourse',//排课
      "reject": apiBase() + '/TeachingDepartment/refuseCourseRequest',//拒绝
      "errorQuestion": apiBase() + '/TeachingDepartment/getErrorQuestionByCourseRequestUuid',//获取错题
      "getWaitCourseInfoByRequestUuid": apiBase() + '/WaitCourse/getWaitCourseInfo',//通过课程请求uuid获取对应的课程请求信息
      "sendMessage": apiBase() + '/HaveCourse/sendMessage',//发送提醒
      "copyCourseRequest": apiBase() + '/copyCourseRequeset/copyCourseRequest'//复制课程要求按钮发送给老师
    },
    //已排课程
    "AlreadyCourse": {
      "dataGrid" : apiBase() + '/HaveCourse/getPageHaveCourse',
      "dataGrids" : apiHiCRM() + '/crm/course/HaveCourse/getPageHaveCourse',
      "backOut": apiBase() + '/TeachingDepartment/backOutCourse',
      "copyTeacherInfo": apiBase() + '/tcTeacher/copyTeacherInfo',//复制老师信息
      "queryExportHaveCourse": apiBase() + '/exportHaveCourse/queryExportHaveCourse'//已排课程导出
    },
    //拒绝排课
    "rejectedCourse" : {
      "dataGrid" : apiBase() + '/refuseCouse/getRefuseCousePage',
    },
    //正式生排课
    "formalClass" : {
      // "dataGrid" : apiBase() + '/courseManage/findAllFormalOrder',//正式生课程列表
      // crm/course
      // "dataGrid" : apiHiCRM() + '/findAllFormalOrder',//正式生课程列表
      "dataGrid" : apiHiCRM() + '/crm/course/findAllFormalOrder',//正式生课程列表
      "updateCourseSchedule" :apiHiCRM() + '/crm/course/updateCourseSchedule?',//正式生排课修改年级科目
      // "formalCourse" : apiBase() + '/courseManage/batchFormalCourse',//按周批量排正式课
      // "formalCourse" : apiHiCRM() + '/batchFormalCourse',//按周批量排正式课
      "formalCourse" : apiHiCRM() + '/crm/course/batchFormalCourse',//按周批量排正式课
      // "addCourse" : apiHiCRM() + '/addCourseOrder',//新增课程订单
      "addCourse" : apiHiCRM() + '/crm/course/addCourseOrder',//新增课程订单
      "batchScheduleCourse" : apiHiCRM() + '/crm/course/batchScheduleFormalCourse',//
      // "batchScheduleCourse" : apiHiCRM() + '/batchScheduleFormalCourse',//
      "changeCourseScheduleTeacher" : apiHiCRM() + '/crm/course/changeCourseScheduleTeacher',//课表换老师
      "deleteCourseSchedule" : apiHiCRM() + '/crm/course/deleteCourseSchedule',//删除课表
    },
    //正式生排课
    "formalApply" : {
      "dataGrid" : apiHiCRM() + '/crm/course/getCourseOrderRequest',//排正式课请求列表
      "addCourseOrderRequest" : apiHiCRM() + '/crm/course/addCourseOrderRequest',//提交排正式课申请
      "editCourseOrderRequestStatus" : apiHiCRM() + '/crm/course/editCourseOrderRequestStatus',//审核是否已排课
    }
  }
}
