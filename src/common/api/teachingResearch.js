/**
 * 教研
 * Created by Bing on 2017/6/16 0016.
 */

import {apiBase} from '../api.config';
export function TEACHING_RESEARCH() {
  return {
    "CourseWare": {
      "dataGrid": apiBase() + '/coursewareManage/getCoursewareList',
      "save": apiBase() + '/coursewareManage/uploadFile',//新增课件保存
      "upload": apiBase() + '/coursewareManage/updateCourseware',//上传课件
      "delete": apiBase() + '/coursewareManage/deleteCourseware',//删除课件
      "getCoursewareById": apiBase() + '/coursewareManage/getCoursewareInfo',//根据id获取课件信息
      "update": apiBase() + '/coursewareManage/updateCourseware',//更新课件信息
      "getChildKnowledgeByParentId": apiBase() + '/course/knowledge/getChildKnowledges',//根据父ID获取子知识点
      "getKnowledgesByLevelOne": apiBase() + '/course/knowledge/getKnowledgesByLevelOne',//获取某年级一级知识点
      "getCourseVersionByGrades": apiBase() + '/coursewareManage/getCourseVersionByGrades',//获取版本号
      "downloadCourseware": apiBase() + '/coursewareManage/downloadCourseware'//下载课件记录
    },
    "Library": {
      "dataGrid": apiBase() + '/coursewareManage/getTeacherCouresewares'
    }
  }
}
