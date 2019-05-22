<template>
<div>
  <o-breadcrumb second="排课首页"></o-breadcrumb>
  <div class="sc-index">
    <Row>
      <i-col span="12">
        <table class="onlyhi-table table1" cellpadding="0" cellspacing="0">
          <caption><h2>今日（{{Today.date}}）排课统计</h2></caption>
          <thead>
          <tr>
            <th>统计</th>
            <th>待排课</th>
            <th>已排课</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <th>测评课</th>
            <td class="required">{{Today.dayTestCourseWaitNumber}}</td>
            <td>{{Today.dayTestCourseHaveNumber}}</td>
          </tr>
          <tr>
            <th>正式课</th>
            <td class="required">{{Today.dayFormalCourseWaitNumber}}</td>
            <td>{{Today.dayFormalCourseHaveNumber}}</td>
          </tr>
          <tr>
            <th>合计</th>
            <td class="required">{{Today.dayCourseWaitTotalNumber}}</td>
            <td>{{Today.dayCourseHaveTotalNumber}}</td>
          </tr>
          </tbody>
        </table>
      </i-col>
      <i-col span="12">
        <table class="onlyhi-table table2" cellpadding="0" cellspacing="0">
          <caption><h2>昨日（{{Yesterday.date}}）排课统计</h2></caption>
          <thead>
          <tr>
            <th>统计</th>
            <th>已排课</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <th>测评课</th>
            <td>{{Yesterday.yesterdayTestCourseHaveNumber}}</td>
          </tr>
          <tr>
            <th>正式课</th>
            <td>{{Yesterday.yesterdayFormalCourseHaveNumber}}</td>
          </tr>
          <tr>
            <th>合计</th>
            <td>{{Yesterday.yesterdayHaveCourseTotalNumber}}</td>
          </tr>
          </tbody>
        </table>
      </i-col>
    </Row>
    <Row>
      <i-col class="border">
        <h2>本月测评课排课</h2>
        <i-table size="small" highlight-row stripe :columns="columns1" :data="data1"></i-table>
        <h2>本月正式课排课</h2>
        <i-table size="small" highlight-row stripe :columns="columns2" :data="data2"></i-table>
      </i-col>
    </Row>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
  import {STUDY_COURSE} from 'common/api/studyCourse.js';
  import {common,Moment} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';

  export default{
    data() {
      return {
        Today: {
          date: Moment().format('MM.DD'),
          dayTestCourseWaitNumber: '',//今天测评课待排课数量
          dayTestCourseHaveNumber: '',//今天测评课已排课数量
          dayFormalCourseWaitNumber: '',//今天正式课待排课数量
          dayFormalCourseHaveNumber: '',//今天正式课已排课数量
          dayCourseWaitTotalNumber: '',//今天待排课总数量
          dayCourseHaveTotalNumber: '',//今天已排课总数量
        },
        Yesterday: {
          date: Moment().subtract(1, 'd').format('MM.DD'),
          yesterdayTestCourseHaveNumber: '',//昨天的测评已排课数量
          yesterdayFormalCourseHaveNumber: '',//昨天的正式已排课数量
          yesterdayHaveCourseTotalNumber: '',//昨天的已排课总数量
        },
        data1:[],
        data2:[],
        columns1: [
          {
            title: '姓名',
            key: 'tcName',
            width: 90,
            render : (h, params) => {
              return h('div',[
                h('strong',{

                },params.row.tcName)
              ])
//              return `<strong>${row.tcName}</strong>`;
            }
          },
          {
            title: '总测评课',
            width: 90,
            key: 'courseCount',
          },
          {
            title: '语文',
            width: 60,
            key: 'chinese',
          },
          {
            title: '数学',
            width: 60,
            key: 'math',
          },
          {
            title: '英语',
            width: 60,
            key: 'english',
          },
          {
            title: '政治',
            width: 60,
            key: 'politics',
          },
          {
            title: '历史',
            width: 60,
            key: 'history',
          },
          {
            title: '地理',
            width: 60,
            key: 'geography',
          },
          {
            title: '生物',
            width: 60,
            key: 'biology',
          },
          {
            title: '化学',
            width: 60,
            key: 'chemistry',
          },
          {
            title: '物理',
            width: 60,
            key: 'physics',
          },
          {
            title: '科学',
            width: 60,
            key: 'science',
          }
        ],
        columns2: [
          {
            title: '姓名',
            key: 'tcName',
            width: 90,
            render(h,params) {
              return h('div',[
                h('strong',{

                },params.row.tcName)
              ])
//              return `<strong>${row.tcName}</strong>`;
            }
          },
          {
            title: '总正式课',
            width: 90,
            key: 'courseCount',
          },
          {
            title: '语文',
            width: 60,
            key: 'chinese',
          },
          {
            title: '数学',
            width: 60,
            key: 'math',
          },
          {
            title: '英语',
            width: 60,
            key: 'english',
          },
          {
            title: '政治',
            width: 60,
            key: 'politics',
          },
          {
            title: '历史',
            width: 60,
            key: 'history',
          },
          {
            title: '地理',
            width: 60,
            key: 'geography',
          },
          {
            title: '生物',
            width: 60,
            key: 'biology',
          },
          {
            title: '化学',
            width: 60,
            key: 'chemistry',
          },
          {
            title: '物理',
            width: 60,
            key: 'physics',
          },
          {
            title: '科学',
            width: 60,
            key: 'science',
          }
        ]
      }
    },
    mounted() {
    	this.loadDataForToday();
      this.loadDataForName();
    },
    methods: {
      loadDataForToday() {
        const _this = this;
        common.ajax({
          method: 'get',
          url: STUDY_COURSE().Home.index,
          data: {},
          success: function(res) {
            if(res.data){
              let data = res.data;
              _this.Today.dayTestCourseHaveNumber = data.dayTestCourseHaveNumber;
              _this.Today.dayTestCourseWaitNumber = data.dayTestCourseWaitNumber;
              _this.Today.dayFormalCourseWaitNumber = data.dayFormalCourseWaitNumber;
              _this.Today.dayFormalCourseHaveNumber = data.dayFormalCourseHaveNumber;
              _this.Today.dayCourseHaveTotalNumber = data.dayCourseHaveTotalNumber;
              _this.Today.dayCourseWaitTotalNumber = data.dayCourseWaitTotalNumber;

              _this.Yesterday.yesterdayTestCourseHaveNumber = data.yesterdayTestCourseHaveNumber;
              _this.Yesterday.yesterdayFormalCourseHaveNumber = data.yesterdayFormalCourseHaveNumber;
              _this.Yesterday.yesterdayHaveCourseTotalNumber = data.yesterdayHaveCourseTotalNumber;
            }
          }
        });
      },
      loadDataForName() {
        const _this = this;
        common.ajax({//测评课
          url: STUDY_COURSE().Home.teacherCourse + '?courseType=0',
          method: 'get',
          success: function (res) {
            if(res.data) {
              _this.data1 = res.data || [];
            }
          }
        });
        common.ajax({//正式课
          url: STUDY_COURSE().Home.teacherCourse + '?courseType=1',
          method: 'get',
          success: function (res) {
            if(res.data) {
              _this.data2 = res.data || [];
            }
          }
        });
      },
    },
    components: { OBreadcrumb }
  };
</script>

<style scoped>
  .border {
    margin: 10px 10px;
  }
  .onlyhi-table {width:50% !important;}
  .onlyhi-table td,
  .onlyhi-table th{
    text-align: center;
  }
  .table1 {
    float: right;
    margin-right: 5px;
  }
  .table2 {
    margin-left: 5px;
  }
</style>
