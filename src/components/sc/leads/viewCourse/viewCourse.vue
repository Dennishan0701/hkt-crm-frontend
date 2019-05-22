<template>
  <div class="mc" style="padding-bottom: 30px">
    <o-breadcrumb second="学生详情" third="查看课程"></o-breadcrumb>
    <h3>学生信息：{{name}}</h3>
    <i-table size="small" stripe :columns="studyData" :data="studyList"></i-table>
    <h3>选择日期查看学生课程</h3>
    <div class="date_picker">
      <div class="date_input_box" style="display: none">
        {{reslt1}}
      </div>
      <course-data :choosed="choosed"></course-data>
    </div>
    <h3>{{reslt}}   课程信息</h3>
    <i-table size="small" highlight-row stripe :columns="columns" :data="data"></i-table>

    <make-up-course ref='makeup'></make-up-course>
    <create-course ref='create'></create-course>
  </div>
</template>
<script>
  import {COMMON_API} from 'common/api.config.js';
  import {SCS} from 'common/api/scs.js';
  import {formateDate, common, hideCharAtNumber} from 'common/js/common.js';
  import makeUpCourse from 'components/sc/waitFirstCourse/makeUpCourse';//补课
  import createCourse from 'components/sc/waitFirstCourse/createCourse';//开课
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import courseData from '../courseData'

  const curDate = new Date();
  const curYear = curDate.getFullYear();
  const curMonth = curDate.getMonth() + 1 < 10 ? "0" +(curDate.getMonth()+1):curDate.getMonth()+ 1;
  const curDay = curDate.getDate() <10?'0'+curDate.getDate():curDate.getDate();

  export default {
    components: {courseData , OBreadcrumb , createCourse , makeUpCourse},
    data () {
      return {
        yearMonthDay: curYear+'-'+curMonth+'-'+curDay,
        yearMonth: curYear+'-'+curMonth,
        data: [],
        uuid:'',
        name:'',
        studyList: [],
        //一个setTimeout的储存器
        panelTimer: '',
        //保存选择的年月日
        choosed: {
          year: '',
          month: '',
          day: ''
        },
        studyData: [
          {
            title: '年级',
            key: 'grade',
            align: 'center',
            width: 60
          },
          {
            title: '科目',
            align: 'center',
            key: 'subject',
            width: 60
          },
          {
            title: '老师姓名',
            key: 'teacherName',
            align: 'center',
            width: 60
          },
          {
            title: '老师简介',
            key: 'teacherDes',
            align: 'center',
            width: 60
          },
          {
            title: '课程级别',
            key: 'courseLevel',
            align: 'center',
            width: 60
          },
          {
            title: '已上课时',
            key: 'haveCourseLength',
            align: 'center',
            width: 60
          },
          {
            title: '操作',
            key: 'parentAgent',
            align: 'center',
            width: 120,
            render : (h, params) => {
              return h('div',[
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs:{
                    title:'补课'
                  },
                  on: {
                    click: () => {
                      this.distribution(params.row.courseOrderUuid,params.row.courseRequestUuid,params.row.payUuid,params.row.leadsUuid,params.row.teacherUuid)
                    }
                  }
                },'补课'),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs:{
                    title:'开课'
                  },
                  on: {
                    click: () => {
                      this.createCourse(params.row.leadsUuid,params.row.courseOrderUuid,params.row.payUuid,params.row.courseRequestUuid,params.row.teacherUuid)
                    }
                  }
                },'开课')
              ])
//              return `<i-button type="info" size="small" title="补课" @click="makeUpCourse('${row.courseOrderUuid}','${row.courseRequestUuid}','${row.payUuid}','${row.leadsUuid}','${row.teacherUuid}')">补课</i-button>
//                      <i-button type="success" size="small" title="开课" @click="createCourse('${row.leadsUuid}','${row.courseOrderUuid}','${row.payUuid}','${row.courseRequestUuid}','${row.teacherUuid}')">开课</i-button>`
            }
          },
        ],
        columns: [
          {
            title: '上课时间',
            key: 'startTime',
            align: 'center',
            width: 60,
            render(h, params) {
                return h('span',params.row.startTime+'--'+ params.row.endTime)
            }
          },
          {
            title: '年级',
            key: 'grade',
            align: 'center',
            width: 60
          },
          {
            title: '科目',
            align: 'center',
            key: 'subject',
            width: 60
          },
          {
            title: '姓名',
            key: 'leadsName',
            align: 'center',
            width: 60
          },
          {
            title: '课程级别',
            key: 'courseType',
            align: 'center',
            width: 60
          },
          {
            title: '老师姓名',
            key: 'teacherName',
            align: 'center',
            width: 60
          },
          {
            title: '老师简介',
            key: 'teacherDes',
            align: 'center',
            width: 60
          },
          {
            title: '反馈信息',
            key: 'courseEndFeedBack',
            align: 'center',
            width: 60
          },
        ],//获取这一天的课程老师信息
      }
    },
    mounted(){
        const _self = this;
      _self.uuid =sessionStorage.getItem('appointment_courseOrderUuid');
      _self.name =sessionStorage.getItem('appointment_leadsName');
      //获取老师信息
      const year = _self.choosed.year;
      const month = _self.choosed.month;
      let dataym = year+'-'+month =='-'?_self.yearMonth:year+'-'+month
      let param = `?courseOrderUuid=${_self.uuid}&courseDate=${dataym}`;
      if(_self.uuid){
        common.ajax({
          url: SCS().MyStudent.getStudentCourseInfo + param,
          method: 'get',
          success: function (res) {
            _self.studyList = [];
            _self.studyList.push(res.data["baseCourseSubjectVos"]);
          }
        });
      }
    },
    computed: {
      //根据选择的年月日计算最终显示的结果
      reslt: function () {
        const _self = this;
        const year = _self.choosed.year;
        const month = _self.choosed.month;
        const day = _self.choosed.day;
        let dataym = year+'-'+month+'-'+day =='--'?_self.yearMonthDay:year+'-'+month+'-'+day
        let param = `?courseOrderUuid=${_self.uuid}&courseDate=${dataym}`;
        if(_self.uuid){
          common.ajax({
            url: SCS().MyStudent.getDayCourseDetailRecord + param,
            method: 'get',
            success: function (res) {
              _self.data = res.data
            }
          });
        }
        return !year || !month || !day ? _self.yearMonthDay : (year + '-' + month + '-' + day);
      },
    },
    methods: {

//        const _this = this;
//        let param = `?pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}`;
//        common.ajax({
//          url: REPORT().Sale.getManagerTeam + param,
//          method: 'get',
//          success: function (res) {
//            _this.data = res.data['teams'];
//            _this.total = res.data.total;
//            _this.agentList = [];
//          }

      makeUpCourse(courseOrderUuid,courseRequestUuid,payUuid,leadsUuid,teacherUuid) {//补课
        this.$refs.makeup.show(courseOrderUuid,courseRequestUuid,payUuid,leadsUuid,teacherUuid);
      },
      createCourse(leadsUuid,courseorderUuid,payUuid,courseRequestUuid,teacherUuid) {//排课
        this.$refs.create.show(leadsUuid,courseorderUuid,payUuid,courseRequestUuid,teacherUuid);
      },
      getAgentList(uuid){
        const that = this;
        let param = `?teacherUuid=${that.uuid}`;
        common.ajax({
          url: REPORT().Sale.getTeamUser + param,
          method: 'get',
          success: function (res) {
            that.agentList = res.data['teamUserVos'] || [];
          }
        });
      },
    },
  }
</script>
<style lang="less" scoped>
  h3{
    margin: 20px 0;
  }
  .date_picker {
    width: 100%;
    margin: 20px auto;
  }

  .date_input_box {
    position: relative;
    width: 100%;
    background: #fff;

  span {
    display: inline-block;
    float: right;
    position: absolute;
    top: 0;
    right: 0;
    height: 35px;
    line-height: 35px;
    padding: 0 10px;
    border-left: 1px solid #9D94B0;
    cursor: pointer;
  }

  }

  .date_input {
    width: 100%;
    box-sizing: border-box;
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    text-indent: 1em;
    cursor: pointer;
    text-align: center;
  }
</style>

