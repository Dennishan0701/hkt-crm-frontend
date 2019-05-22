/**
 * 师资管理
 * Created by ShenBo on 2018/5/9
 */
import router from 'components/router';
/** 师资管理 **/
import hefeiTeacherLibrary from 'components/teacher/hefei/hefeiTeacherLibrary.vue';
import hefeiCanCourse from 'components/teacher/hefei/hefeiCanCourse.vue';
import hefeiTimeTable from 'components/teacher/hefei/hefeiTimeTable.vue';
import hefeiTcFree from 'components/teacher/hefei/hefeiTcFree.vue';
import hefeiCourseLessonsQuan from 'components/teacher/hefei/hefeiCourseLessonsQuan.vue';
import teacherLibrary from 'components/teacher/teacherLibrary/teacherLibrary.vue';
import leaveLibrary from 'components/teacher/leaveLibrary/leaveLibrary.vue';
import courseFeedback from 'components/teacher/courseFeedback/courseFeedback.vue';
import studentEval from 'components/teacher/courseFeedback/studentEval.vue';
import tcFree from 'components/teacher/tcFree/tcFree.vue';
import canCourseTeacher from 'components/teacher/canCourseTeacher/canCourseTeacher.vue';
import jianzhiTeacher from 'components/teacher/addTeacher/jianzhiTeacher.vue';
import quanzhiTeacher from 'components/teacher/addTeacher/quanzhiTeacher.vue';
import recover from 'components/teacher/recover/recover.vue';
import courseLessonsJian from 'components/teacher/courseLessons/courseLessonsJian.vue';
import courseLessonsQuan from 'components/teacher/courseLessons/courseLessonsQuan.vue';
import sendMail from 'components/teacher/sendMail/sendMail.vue';
import modifyPhone from 'components/teacher/modifyPhone/modifyPhone.vue';
import teacherDetailByJianzhi from 'components/teacher/teacherDetail/jianzhi/teacherDetail';
import viewTeacherDetailByJianzhi from 'components/teacher/teacherDetail/jianzhi/viewTeacherDetail';
import teacherSchedule from 'components/teacher/teacherDetail/jianzhi/teacherSchedule';
import teacherDetailByQuanzhi from 'components/teacher/teacherDetail/quanzhi/teacherDetail';
import viewTeacherDetailByQuanzhi from 'components/teacher/teacherDetail/quanzhi/viewTeacherDetail';
export default{
  path:'/teacher',
  component:router,
  children :[
    {
      path:'hefeiTeacherLibrary',//合肥-师资库
      name:'hefeiTeacherLibrary',
      component: hefeiTeacherLibrary,
    },
    {
      path:'hefeiCanCourse',//合肥-可排课老师
      name:'hefeiCanCourse',
      component: hefeiCanCourse,
    },
    {
      path:'hefeiTimeTable',//合肥-监课表
      name:'hefeiTimeTable',
      component: hefeiTimeTable,
    },
    {
      path:'hefeiTcFree',//合肥-老师空闲时间
      name:'hefeiTcFree',
      component: hefeiTcFree,
    },
    {
      path:'hefeiCourseLessonsQuan',//合肥-全职老师课程课耗
      name:'hefeiCourseLessonsQuan',
      component: hefeiCourseLessonsQuan,
    },
    {
      path:'teacherLibrary',//师资库
      name:'teacherLibrary',
      component: teacherLibrary,
    },
    {
      path:'leaveLibrary',//离职库
      name:'leaveLibrary',
      component: leaveLibrary,
    },
    {
      path:'tcFree',//老师空闲时间
      name:'tcFree',
      component: tcFree,
    },
    {
      path:'canCourseTeacher',//可排课老师
      name:'canCourseTeacher',
      component: canCourseTeacher,
    },
    {
      path:'jianzhiTeacher',//新增老师-兼职
      name:'jianzhiTeacher',
      component: jianzhiTeacher,
    },
    {
      path:'quanzhiTeacher',//新增老师-全职
      name:'quanzhiTeacher',
      component: quanzhiTeacher,
    },
    {
      path:'courseFeedback',//老师的课程反馈
      name:'courseFeedback',
      component: courseFeedback,
    },
    {
      path:'studentEval',//学生评价
      name:'studentEval',
      component: studentEval,
    },
    {
      path:'recover',//回收站
      name:'recover',
      component: recover,
    },
    {
      path:'sendMail',//发送邮件
      name:'sendMail',
      component: sendMail,
    },
    {
      path:'modifyPhone',//老师更换手机号
      name:'modifyPhone',
      component: modifyPhone,
    },
    {
      path:'courseLessonsJian',//课程课耗-兼职
      name:'courseLessonsJian',
      component: courseLessonsJian,
    },
    {
      path:'courseLessonsQuan',//课程课耗-全职
      name:'courseLessonsQuan',
      component: courseLessonsQuan,
    },
    {
      path:'teacherDetailByJianzhi',//老师详情-兼职-编辑  隐藏
      name:'teacherDetailByJianzhi',
      component: teacherDetailByJianzhi,
    },
    {
      path:'teacherDetailByQuanzhi/:step',//老师详情-全职-编辑  隐藏
      name:'teacherDetailByQuanzhi',
      component: teacherDetailByQuanzhi,
    },
    {
      path:'viewTeacherDetailByJianzhi',//老师详情-兼职-查看  隐藏
      name:'viewTeacherDetailByJianzhi',
      component: viewTeacherDetailByJianzhi,
    },
    {
      path:'teacherSchedule',//查看课程  隐藏
      name:'teacherSchedule',
      component: teacherSchedule,
    },
    {
      path:'viewTeacherDetailByQuanzhi',//老师详情-全职-查看  隐藏
      name:'viewTeacherDetailByQuanzhi',
      component: viewTeacherDetailByQuanzhi,
    },
  ]
};
