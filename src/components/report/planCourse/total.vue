<template>
  <div class="total">
    <div class="grid-widget">
      <Row>
        <i-col span=24 class="right">
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" @on-change="changeDate" placement="bottom-end" placeholder="时间" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="search" @click="searchFrom">搜索</i-button>
        </i-col>
      </Row>
    </div>

    <table class="onlyhi-table border" border="0" cellpadding="0" cellspacing="0">
      <caption><h2><Icon type="grid"></Icon> 总KPI</h2></caption>
      <thead>
        <tr>
          <th>总测评课数</th>
          <th>测评总转化数</th>
          <th>测评总转化率</th>
          <th>总扩科数</th>
          <th>扩科总转化数</th>
          <th>扩科总转化率</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{Total.ccTestCourseNumber}}</td>
          <td>{{Total.ccTestCourseSuccessNumber}}</td>
          <td>{{Total.ccTestCourseChargeRate}}</td>
          <td>{{Total.crTestCourseNumber}}</td>
          <td>{{Total.crTestCourseSuccessNumber}}</td>
          <td>{{Total.crTestCourseChargeRate}}</td>
        </tr>
      </tbody>
    </table>

    <div style="margin-bottom: 2px;">
      <h2><Icon type="social-buffer"></Icon> 科目KPI</h2>
      <i-select v-model="subject" @on-change="changeSubject" size="small" clearable placeholder="科目" style="width:80px">
        <i-option v-for="(item,index) in subjectList" :key='index' :value="item.value">{{ item.value }}</i-option>
      </i-select>
    </div>
    <i-table size="small" highlight-row stripe :columns="columns" :data="data" ></i-table>
  </div>
</template>

<script type="text/ecmascript-6">
  import {REPORT} from 'common/api/report.js';
  import {formateDate,common} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';

  export default{
    data() {
      return {
        Search: {
          startTime: '',
          endTime: '',
          subject: ''
        },
        subject: '',
        subjectList: [],
        Total: {
          ccTestCourseChargeRate: '',
          ccTestCourseNumber: '',
          ccTestCourseSuccessNumber: '',
          crTestCourseChargeRate: '',
          crTestCourseNumber: '',
          crTestCourseSuccessNumber: '',
        },
        data: [],
        columns: [
          {
            title: '统计',
            key: 'name',
            render:(h,params)=> {
              return h('div',[
                h('strong',{},params.row.name)
              ])
//              return `<!--<strong>${row.name}</strong>-->`;
            }
          },
          {
            title: '汇总',
            key: 'sum'
          },
          {
            title: '小三',
            key: 'grade1'
          },
          {
            title: '小四',
            key: 'grade2'
          },
          {
            title: '小五',
            key: 'grade3'
          },
          {
            title: '小六',
            key: 'grade4'
          },
          {
            title: '预初',
            key: 'grade5'
          },
          {
            title: '初一',
            key: 'grade6'
          },
          {
            title: '初二',
            key: 'grade7'
          },
          {
            title: '初三',
            key: 'grade8'
          },
          {
            title: '初四',
            key: 'grade9'
          },
          {
            title: '高一',
            key: 'grade10'
          },
          {
            title: '高二',
            key: 'grade11'
          },
          {
            title: '高三',
            key: 'grade12'
          }
        ]
      }
    },
    mounted() {
      const _this = this;
      $.getJSON("static/data.json", (json) => {
        _this.subjectList = json.subjectList;
      });
      this.searchFrom();
    },
    methods: {
      getTotalData(search) {
        const _this = this;
        let param = `?startTime=${search.startTime}&endTime=${search.endTime}`;
        common.ajax({
          url: REPORT().PlanCourse.planCourseToTotal + param,
          method: 'get',
          success: function(res) {
            _this.Total.ccTestCourseChargeRate = res.data.kpiList[0].ccTestCourseChargeRate;//测评总转化率
            _this.Total.ccTestCourseNumber = res.data.kpiList[0].ccTestCourseNumber;//总测评课数
            _this.Total.ccTestCourseSuccessNumber = res.data.kpiList[0].ccTestCourseSuccessNumber;//测评总转化数
            _this.Total.crTestCourseChargeRate = res.data.kpiList[0].crTestCourseChargeRate;//扩科总转化率
            _this.Total.crTestCourseNumber = res.data.kpiList[0].crTestCourseNumber;//总扩科数
            _this.Total.crTestCourseSuccessNumber = res.data.kpiList[0].crTestCourseSuccessNumber;//扩科总转化数
          }
        });
      },
      getTotalToSubject(search) {
        const _this = this;
        let param = `?startTime=${search.startTime}&endTime=${search.endTime}&subject=${search.subject}`;
        common.ajax({
          url: REPORT().PlanCourse.planCourseBySubject + param,
          method: 'get',
          success: function(res) {
            _this.data = res.data.kpiList || [];
          }
        });
      },
      searchFrom() {
        this.getTotalData({
          startTime: this.Search.startTime,
          endTime: this.Search.endTime
        });
        this.getTotalToSubject({
          startTime: this.Search.startTime,
          endTime: this.Search.endTime,
          subject: this.Search.subject
        });
      },
      changeSubject(value) {
        this.Search.subject = value;
        this.getTotalToSubject({
          startTime: this.Search.startTime,
          endTime: this.Search.endTime,
          subject: this.Search.subject
        });
      },
      changeDate(value) {
        this.Search.startTime = value[0] || '';
        this.Search.endTime = value[1] || '';
      }
    },
    components: { OBreadcrumb }
  };
</script>

<style scoped>
  .total { padding: 0 10px 10px 10px;}
  h2 {
    display: inline-block;
    vertical-align: middle;
  }
</style>
