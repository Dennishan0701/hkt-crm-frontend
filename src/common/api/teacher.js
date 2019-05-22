/**
 * 老师相关
 * Created by Bing on 2017/6/16 0016.
 */

import {apiBase,apiHiCRM} from '../api.config';

/**
 * 师资管理
 */
export function TEACHER() {
  return {
    "Library": {//师资库
      "dataGrid": apiBase() + '/lecturerLibrary/queryLecturerLibraryPage',
      "updateCourseStatus": apiBase() + '/lecturerLibrary/updateCourseStatus',//停止、恢复排课
      "updateRemark": apiBase() + '/lecturerLibrary/editRemark',//编辑备注提交
      "editDetail": apiBase() + '/lecturerLibrary/editLecturer',//编辑老师详情
      "getMailPurpose": apiBase() + '/teacherMail/getMailPurpose',//显示发送邮件的类型
      "getTeacherPage": apiBase() + '/teacherMail/getTeacherPage',//查询发送邮件老师列表
      "sendMail": apiBase() + '/teacherMail/sendMail',//老师发送邮件
      "editPhone": apiBase() + '/teacherPhone/editPhone',//查询老师列表
      "teacherLeave": apiHiCRM() + '/crm/account/teacherStatusUpdate',//老师离职
    },
    "CanCourseTeacher": {//可排课老师
      "dataGrid": apiBase() + '/teacherSchedule/queryTeacherSchedulePage',
      "updateRemark": apiBase() + '/teacherSchedule/editRemark',//编辑备注的提交
    },
    "AddTeacher": {//新增老师
      // "jianzhi": apiBase() + '/tcTeacher/addTeacher',
      "jianzhi": apiHiCRM() + '/crm/parttime/teacher/tcTeacher/addTeacherByCRM',
      "quanzhi": apiBase() + '/tcTeacher/addTeacher',
      "addFullTimeTeacher": apiBase() + '/tcTeacher/addFullTimeTeacher',
    },
    "Recover": {//回收站
      "dataGrid": apiBase() + '/trash/queryTrashPage',
      "rollBackInterview": apiBase() + '/trash/rollBackInterview',//回首面试
    },
    "leaveLibrary": {//离职库
      "dataGrid": apiHiCRM() + '/crm/account/leaveTeacherList',//获取离职老师列表
      // "dataGrid": apiHiCRM() + '/leaveTeacherList',//获取离职老师列表test
      "leaveTeacherActivate": apiHiCRM() + '/crm/account/leaveTeacherActivate',//离职老师激活
    },
    "Detail": {//老师详情页预览和编辑
      "getByUuidToEdit": apiBase() + '/interview/getTeacherByUuid', //打开编辑老师页面
      "getByUuidToView": apiBase() + '/interview/getTeacherDetailByUuid', //打开老师详情页面
      "getAllSubject": apiBase() + '/interview/getAllSubject',
      "saveTeacherDetail": apiBase() + '/interview/editTeacher',//编辑老师页面的提交
      "getAnnex": apiBase() + '/tcTeacher/getFileByTeacherId',//获取附件
      "uploadFile": apiBase() + '/tcTeacher/uploadFile',//附件上传
      "deleteFile": apiBase() + '/tcTeacher/deleteTeacherFile',//删除附件
      "dowmFile": apiBase() + '/tcTeacher/downloadFile',//下载附件
      "addTeacherNotes": apiBase() + '/lecturerLibrary/addTeacherNotes',//下载附件
      "getTeacherNotes": apiBase() + '/lecturerLibrary/getTeacherNotes',//获取监课备注
    },
    //老师的课程反馈
    "courseFeedback": {
      "dataGrid": apiBase() + '/teacherAppraise/queryTeacherAppraisePage',//老师的课程反馈列表
      "studentEval": apiBase() + '/studentAppraise/queryStudentAppraisePage',//学生评价
      "downLoadTeacherAppraise": apiHiCRM() + '/crm/course/teacherCourse/downLoadTeacherAppraise',//老师的课程反馈导出
    },
    "Public": {
      "getAllSubject": apiBase() + '/interview/getAllSubject',
      "displayPhone": apiBase() + '/tcTeacher/displayPhone',
      "fullPhone": apiBase() + '/tcTeacher/displayPhone',
    },
    "JianSchedule": {//兼职老师课表
      "getTeacherCourseCount": apiBase() + '/teacherCourseCount/getTeacherCourseCount',//获取老师本月课程数
      "getCourseCount": apiBase() + '/teacherCourseCount/getCourseCount',//获取这一天的课程老师信息
      "getCourseList": apiBase() + '/teacherCourseCount/getCourseList',//学生今日上课详情
      "queryTeacherCoursePage": apiBase() + '/teacherCourseCount/queryTeacherCoursePage',//获取课程消耗老师列表
    },
    "tcFree": {//老师空闲时间
      "dataGrid": apiBase() + '/teacherTime/queryTacherTimePage',//老师空闲时间
      "getTeacherTimeSchedule": apiBase() + '/teacherTime/getTeacherTimeSchedule',//查看老师的空闲时间和课程
    },
  }
}

/**
 * 招师流程
 */
export function ZHAO_TEACHER() {
  return {
    //待面试
    "WaitInterview": {
      "dataGrid": apiBase() + '/interviewRecord/getTeacherPage', //获取列表
      "isHaveVideo": apiBase() + '/interviewRecord/haveVideo',  //是否接到视频
      // "interview": apiBase() + '/interviewRecord/interviewRecord',  //面试
      "interview": apiHiCRM() + '/crm/parttime/teacher/interviewRecord/interviewRecord',  //面试
      "giveUp": apiBase() + '/interviewRecord/giveUp',  //放弃
      "getAccoutByDate": apiBase() + '/interviewRecord/getAccoutByDate',  //根据日期获取培训账号
    },
    //待培训
    "WaitTrain": {
      "dataGrid": apiBase() + '/training/getTeacherPage',
      // "giveUp": apiBase() + '/training/giveUp',//放弃
      "giveUp": apiHiCRM() +'/crm/parttime/teacher/training/giveUp',//放弃
      // "training": apiBase() + '/training/training',//培训通过
      "training":apiHiCRM() +'/crm/parttime/teacher/training/training',//培训通过
      "getTrainingDateById": apiBase() + '/interviewRecord/getTrainingDateById',//获取培训账号
      "getAccoutByDate": apiBase() + '/interviewRecord/getAccoutByDate',//根据日期获取培训账号
      // "updateTrainingDateById": apiBase() + '/interviewRecord/updateTrainingDateById',//更新培训培训时间
      "updateTrainingDateById": apiHiCRM() +'/crm/parttime/teacher/interviewRecord/updateTrainingDateById',//更新培训培训时间
    },
    //待完善资料
    "WaitPerfectInfo": {
      "dataGrid": apiBase() + '/imperfect/getTeacherPage',
      "giveUp": apiBase() + '/imperfect/giveUp',//放弃
      "savePerfection": apiBase() + '/imperfect/editTeacher',//编辑老师页面的提交
      "pass": apiBase() + '/imperfect/pass',//审核通过
      "inInventory": apiBase() + '/imperfect/inInventory',//老师入库
    },
    //待二次培训
    "WaitSecondTrain": {
      "dataGrid": apiBase() + '/secondTraining/getTeacherPage',
      "giveUp": apiBase() + '/secondTraining/giveUp',//放弃
      "savePerfection": apiBase() + '/secondTraining/passTraining',//编辑老师页面的提交
    },
    //待邀约
    "pass": apiBase() + '/interview/pass',
    "WaitToOffer": {
      "dataGrid": apiBase() + '/beforeInterview/getTeacherPage',//待邀约老师列表
      "isHaveVideo": apiBase() + '/beforeInterview/haveVideo',  //确认收到视屏
      "giveUp": apiBase() + '/beforeInterview/giveUp',  //放弃
      "saveTeacherDetail": apiBase() + '/interview/editTeacher',//编辑老师页面的提交
      "getAllSchool": apiBase() + '/interview/getAllSchool',//获取老师学校
      "addTeacherRemark": apiBase() + '/beforeInterview/addTeacherRemark',//待邀约添加备注
      "getTeacherRemark": apiBase() + '/beforeInterview/getTeacherRemark',//待邀约查看备注
      "addInterviewSchedule": apiBase() + '/beforeInterview/addInterviewSchedule',//安排面试
      "sendMail": apiBase() + '/beforeInterview/sendMail',//根据时间获取面试账号
      "getInterviewAccount": apiBase() + '/interviewSchedule/getInterviewAccount',//根据日期和时间获取面试人列表
      "getInterviewTime": apiBase() + '/interviewSchedule/getInterviewTime',//获取面试时间
      "getInterviewAccoutByDate": apiBase() + '/interviewSchedule/getInterviewAccoutByDate',//根据时间获取面试账号
    },
    "interviewSchedule": {
      "dataGrid": apiBase() + '/interviewSchedule/queryTeacherSchedulePage',//老师面试安排列表
      "updateInterviewDateById": apiBase() + '/interviewSchedule/updateInterviewDateById',//更新面试日期
    },
    //待分配老师
    "waitAssignTeacher": {
      "dataGrid": apiBase() + '/assign/queryAssignTeacherPage',//待分配老师列表
      "getUserList": apiBase() + '/assign/getUserList',//分配人员列表
      "assignInvitaion": apiBase() + '/assign/assignInvitaion',//单个分配
      "batchAssign": apiBase() + '/assign/batchAssign',//分配

    },
    //招师代理
    "Agent": {
      "childAgentDataGrid": apiBase() + '/tcAgent/getAgentPageByParent',//总代获取分代理列表
      "agentDataGrid": apiBase() + '/tcAgent/getAgentPage',//获取所有招师代理列表
      "agentTypeList": apiBase() + '/tcAgent/getAagentType',//招师方向
      "uploadFile": apiBase() + '/agentInfo/uploadFile',//上传代理的文件
      "agentInfo": apiBase() + '/agentInfo/getAagentDetailByUuid',//代理详情查看
      "agentInfoByEdit": apiBase() + '/agentInfo/getAagentByUuid',//代理详情编辑
      "removeAgent": apiBase() + '/tcAgent/removeAgent',//删除代理
      "editAgent": apiBase() + '/agentInfo/editAgent',//编辑代理
      "addAgent": apiBase() + '/tcAgent/addAagent',//新增代理
      "getAllParentAgent": apiBase() + '/agentInfo/getAllParentAgent',//获取所有总代理
      "teacherList": apiBase() + '/agentTeacher/getAgentTeacherPage',//老师列表
    },
    //全职老师
    "fullTimeTeacher": {
      "dataGrid": apiBase() + '/fullTimeTeacherTrainging/getFullTimeTeacherPage',//待培训列表
      "giveUp": apiBase() + '/fullTimeTeacherTrainging/giveUp',//放弃
      "passTraining": apiBase() + '/fullTimeTeacherTrainging/passTraining',//培训通过
      "getTrainingDateById": apiBase() + '/interviewRecord/getTrainingDateById',//获取培训账号
      "getAccoutByDate": apiBase() + '/fullTimeTeacherTrainging/getFullAccoutByDate',//根据日期获取培训账号
      "updateTrainingDateById": apiBase() + '/interviewRecord/updateTrainingDateById',//更新培训培训时间
      "addTrainingDateById": apiBase() + '/fullTimeTeacherTrainging/addTrainingAccount',//更新培训培训时间
      "addInterview": apiBase() + '/fullTimeTeacherTrainging/addInterview',//添加全职老师的面试评价
      "isExist": apiBase() + '/tcTeacher/isExist',//根据姓名判断老师是否存在
    },
    //回收站
    "agentRecover": {
      "getTrashAgentPage": apiBase() + '/tcAgent/getTrashAgentPage',//获取代理回收站列表
      "rollBack": apiBase() + '/tcAgent/rollBack',//激活代理
    }
  }
}

/**
 * 招师代理
 */
export function AGENT_TEACHER() {
  return {
    "childAgentDataGrid": apiBase() + '/tcAgent/getAgentPageByParent',//总代获取分代理列表
    "agentDataGrid": apiBase() + '/tcAgent/getAgentPage',//获取所有招师代理列表
    "agentTypeList": apiBase() + '/tcAgent/getAagentType',//招师方向
    "uploadFile": apiBase() + '/agentInfo/uploadFile',//上传代理的文件
    "agentInfo": apiBase() + '/agentInfo/getAagentDetailByUuid',//代理详情查看
    "agentInfoByEdit": apiBase() + '/agentInfo/getAagentByUuid',//代理详情编辑
    "removeAgent": apiBase() + '/tcAgent/removeAgent',//删除代理
    "editAgent": apiBase() + '/agentInfo/editAgent',//编辑代理
    "addAgent": apiBase() + '/tcAgent/addAagent',//新增代理
    "getAllParentAgent": apiBase() + '/agentInfo/getAllParentAgent',//获取所有总代理
    "teacherList": apiBase() + '/agentTeacher/getAgentTeacherPage',//老师列表
    "getAgentGradePage": apiBase() + '/agentGrade/getAgentGradePage',//代理级别薪资列表
    "getAgentGradeById": apiBase() + '/agentGrade/getAgentGradeById',//根据ID获取代级别薪资
    "addAgentGrade": apiBase() + '/agentGrade/addAgentGrade',//新增级别薪资
    "updateAgentGrade": apiBase() + '/agentGrade/updateAgentGrade',//更新级别薪资
    "updateAgentGradeStatus": apiBase() + '/agentGrade/updateAgentGradeStatus',//更新状态
  }
}
/**
 * 完课管理
 */
export function Course_Cast() {
  return {
    // "getPageWaitCourse": apiBase() + '/CourseCast/getPageWaitCourse',//获取所有课程
    "getPageWaitCourse":apiHiCRM() + '/crm/course/courseEnd/queryCourseEnd',//获取所有课程
    // "queryCourseLog": apiBase() + '/CourseCast/queryCourseLog',//获取日志
    "queryCourseLog":apiHiCRM() + '/crm/course/courseEnd/queryCourseLog',//获取日志
    // "editCourseLength": apiBase() + '/CourseCast/editCourseLength',//编辑
    "editCourseLength": apiHiCRM() + '/crm/course/courseEnd/editCourseLength',//编辑
    //课时管理
    "CourseConsume": {
      'dataGrid': apiBase() + '/CourseConsume/getCourseConsumeLength',//课时管理列表
      'editCourseConsume': apiBase() + '/CourseConsume/editCourseConsume',//编辑课时
      'getCourseLengthRecord': apiBase() + '/CourseConsume/getCourseLengthRecord',//修改日志列表
    },
    //课程调整
    "courseRevise": {
      'dataGrid': apiBase() + '/CourseAdjustment/getCourseAdjustment',//获取课程列表
      'createCourse': apiBase() + '/CourseAdjustment/createCourse',//调课
      'editCourseStatus': apiBase() + '/CourseAdjustment/editCourseStatus',//作废
    }
  }
}

