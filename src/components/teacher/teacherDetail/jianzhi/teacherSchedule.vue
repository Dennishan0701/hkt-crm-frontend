<template>
  <div class="mc" style="padding-bottom: 30px">
    <o-breadcrumb second="师资库" third="老师排课"></o-breadcrumb>
    <h1>{{name}}</h1>
    <!--<div class="date_picker">-->
      <!--<div class="date_input_box" style="display: none">-->
        <!--{{reslt}}-->
      <!--</div>-->
      <!--<schedule-calendar :choosed="choosed"></schedule-calendar>-->
    <!--</div>-->
    <!--<h3>{{dataTime}}   排课信息</h3>-->
    <!--&lt;!&ndash;<datePanel :panelStatus="panelStatus" :clearPanelTimer="clearPanelTimer" :hidePanel="hidePanel" :choosed="choosed"></datePanel>&ndash;&gt;-->
    <!--<i-table size="small" height='300' highlight-row stripe :columns="columns" :data="data"></i-table>-->
    <div v-html="iframe" style="overflow-x: hidden;overflow-y: auto;min-height: 600px">
    </div>




    <h1 style="line-height: 60px;">所带学员</h1>
    <i-table size="small" height='300' stripe :columns="studyListC" :data="studyList"></i-table>

    <h1 style="line-height: 60px;">学员信息</h1>
    <i-table size="small" height='300' stripe :columns="agentListC" :data="agentList"></i-table>

  </div>
</template>
<script>
  import {COMMON_API} from 'common/api.config.js';
  import {ZHAO_TEACHER,TEACHER} from 'common/api/teacher.js';
  import {formateDate, common, hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import scheduleCalendar from '../scheduleCalendar'

  const curDate = new Date();
  const curYear = curDate.getFullYear();
  const curMonth = curDate.getMonth() + 1 < 10 ? "0" +(curDate.getMonth()+1):curDate.getMonth()+ 1;
  const curDay = curDate.getDate() <10?'0'+curDate.getDate():curDate.getDate();

  export default {
    name: 'datepicker',
    components: {scheduleCalendar , OBreadcrumb},
    data () {
      return {
        yearMonthDay: curYear+'-'+curMonth+'-'+curDay,
        yearMonth: curYear+'-'+curMonth+'-'+curDay,
        data: [],
        dataTime:'',
        uuid:'',
        name:'',
        url:'',
        iframe:'',
        studyList: [],
        agentList: [],
        teamUuid: '',
        pageNumber: SCREEN_SIZE === 'md' ? 11: 17,
        //一个setTimeout的储存器
        panelTimer: '',
        //保存选择的年月日
        choosed: {
          year: '',
          month: '',
          day: ''
        },
        columns: [
          {
            title: '时间',
            key: 'courseTime',
            align: 'center',
          },
          {
            title: '年级',
            key: 'grade',
            align: 'center',
          },
          {
            title: '科目',
            align: 'center',
            key: 'subject',
          },
          {
            title: '学生姓名',
            key: 'stuName',
            align: 'center',
          },
          {
            title: '课程类型',
            key: 'courseType',
            align: 'center',
          },
          {
            title: '教务老师',
            key: 'userName',
            align: 'center',
          },
          {
            title: '教务老师手机号',
            key: 'phone',
            align: 'center',
          },
          {
            title: '课后反馈',
            key: 'feedback',
            align: 'center',
          },
        ],//获取这一天的课程老师信息
        studyListC: [
          {
            title: '姓名',
            key: 'stuName',
            align: 'center',
          },
          {
            title: '年级',
            align: 'center',
            key: 'grade',
          },
          {
            title: '科目',
            key: 'subject',
            align: 'center',
          },
          {
            title: '教务老师',
            key: 'crName',
            align: 'center',
          },
          {
            title: '教务老师手机号',
            key: 'crPhone',
            align: 'center',
          },
          {
            title: '已上课时',
            key: 'finishCount',
            align: 'center',
          },
          {
            title: '预上课时',
            key: 'unfinishCount',
            align: 'center',
          },
          {
            title: '操作',
            key: 'parentAgent',
            align: 'center',
            // render (row, column, index) {
            //   return `<i-button type="warning" size="small" icon="calendar" title="查询课时记录" @click="getAgentList('${row.teacherUuid}','${row.leadsUuid}')">查询课时记录</i-button>`
            // },
            render : (h, params) => {
              return h('div',[
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small',
                    icon: 'calendar',
                  },
                  attrs: {
                    title: '查询课时记录',
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.getAgentList(params.row.teacherUuid,params.row.leadsUuid);
                    }
                  }
                })
              ])
            }

          },
        ],
        agentListC: [
          {
            title: '时间',
            key: 'courseTime',
            align: 'center',
          },
          {
            title: '年级',
            align: 'center',
            key: 'grade',
          },
          {
            title: '科目',
            key: 'subject',
            align: 'center',
          },
          {
            title: '学生姓名',
            key: 'stuName',
            align: 'center',
          },
          {
            title: '课程类型',
            key: 'courseType',
            align: 'center',
          },
          {
            title: '教务老师',
            key: 'userName',
            align: 'center',
          },
          {
            title: '教务老师手机号',
            key: 'phone',
            align: 'center',
          },
          {
            title: '课后反馈',
            key: 'feedback',
            align: 'center',
          },
        ],
      }
    },
    mounted(){
      const that = this;
      that.uuid =sessionStorage.getItem('template_Schedule');
      that.name =sessionStorage.getItem('template_teacherName');
      this.iframe = '';
      this.iframe = `<iframe id="childFree" src="../../../../../static/timetable.html?uuid=${that.uuid}" frameborder="0" width=100% height=600px frameborder=auto></iframe>`;

      let param = `?teacherUuid=${that.uuid}`;
      if(that.uuid){
        common.ajax({
          url: TEACHER().JianSchedule.getCourseCount + param,
          method: 'get',
          success: function (res) {
            that.studyList = res.data["studentList"] || [];
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
        let dataym = year+'-'+month+'-'+day =='--'?_self.yearMonthDay:year+'-'+month+'-'+day;
        _self.dataTime = dataym;
        let param = `?teacherUuid=${_self.uuid}&courseDate=${dataym}&leadsUuid=`;
        if(_self.uuid){
          common.ajax({
            url: TEACHER().JianSchedule.getCourseList + param,
            method: 'get',
            success: function (res) {
              _self.data = res.data['courseCountList'] || [];
            }
          });
        }
        return !year || !month || !day ? 'please choose date' : (year + '-' + month + '-' + day);
      },
      //根据选择的年月发送请求
    },
    methods: {
      getAgentList(teacherUuid,leadsUuid){
        const that = this;
        let param = `?teacherUuid=${teacherUuid}&leadsUuid=${leadsUuid}`;
        common.ajax({
          url: TEACHER().JianSchedule.getCourseList + param,
          method: 'get',
          success: function (res) {
            that.agentList = res.data['courseCountList'] || [];
          }
        });
      },
    },
  }
</script>
<style lang="less" scoped>
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

