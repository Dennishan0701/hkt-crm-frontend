<style scoped>
  .total { padding: 0 10px 10px 10px;}
  .onlyhi-table {width: 100% !important;margin-top: 20px;}
  .onlyhi-table caption { text-align: left;}
  caption h2 { display: inline-block; vertical-align: middle; }
  .bg-green { background-color: #00cc66;color: #fff; }
  .bg-red { background-color: #ff6600;color: #fff; }
  .bg-blue { background-color: #39f;color: #fff; }
</style>
<template>
  <div class="total">
    <o-breadcrumb second="数据报表" third="培训部KPI"></o-breadcrumb>

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
          <th >统计</th>
          <th class="bg-green">面试总人数</th>
          <th class="bg-green">面试通过人数</th>
          <th class="bg-green">面试通过率</th>
          <th class="bg-green">985占比（面试）</th>
          <th class="bg-red">培训总人数</th>
          <th class="bg-red">培训通过人数</th>
          <th class="bg-red">培训通过率</th>
          <th class="bg-red">985占比（培训）</th>
          <th class="bg-blue">面试培训通过率</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in totalKpiList" :key='index'>
          <td>{{item.teacherName}}</td>
          <td>{{item.interviewCount}}</td>
          <td>{{item.interviewPassCount}}</td>
          <td>{{item.interviewPassCountRate}}%</td>
          <td>{{item.interviewIs985Rate}}%</td>
          <td>{{item.secondTrainingCount}}</td>
          <td>{{item.secondTrainingPassCount}}</td>
          <td>{{item.secondTrainingPassRate}}%</td>
          <td>{{item.trainingIs985Rate}}%</td>
          <td>{{item.interviewTrainingPassRate}}%</td>
        </tr>
        <tr v-show="totalKpiList.length === 0">
          <td colspan="9">暂无数据</td>
        </tr>
      </tbody>
    </table>

    <table class="onlyhi-table border" border="0" cellpadding="0" cellspacing="0">
      <caption>
        <h2><Icon type="social-buffer"></Icon> 科目KPI</h2>
        <i-select v-model="Search.teachingSubject" @on-change="changeSubject" size="small" clearable placeholder="科目" style="width:80px">
          <i-option v-for="(item,index) in subjectList" :key='index' :value="item.uuid">{{ item.enumValue }}</i-option>
        </i-select>
      </caption>
      <thead>
        <tr>
          <th>统计</th>
          <th>汇总</th>
          <th>小学</th>
          <th>小学、初中</th>
          <th>小学、初中、高中</th>
          <th>初中</th>
          <th>初中、高中</th>
          <th>高中</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in subjectkpiList" :key='index'>
          <td v-html="item.name"></td>
          <td v-html="getFilter(item.sum,index)"></td>
          <td v-html="getFilter(item.gradePreference1,index)"></td>
          <td v-html="getFilter(item.gradePreference2,index)"></td>
          <td v-html="getFilter(item.gradePreference3,index)"></td>
          <td v-html="getFilter(item.gradePreference4,index)"></td>
          <td v-html="getFilter(item.gradePreference5,index)"></td>
          <td v-html="getFilter(item.gradePreference6,index)"></td>
        </tr>
        <tr v-show="subjectkpiList.length === 0">
          <td colspan="8">暂无数据</td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script type="text/ecmascript-6">
  import {REPORT} from 'common/api/report.js';
  import {TEACHER} from 'common/api/teacher.js';
  import {common} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  export default{
    data() {
      return {
        Search: {
          createDateStart: '',
          createDateEnd: '',
          teachingSubject: '48'
        },
        subjectList: [],
        totalKpiList: [],
        subjectkpiList: []
      }
    },
    mounted() {
      const _this = this;
      common.ajax({
        url: TEACHER().Detail.getAllSubject,
        method: 'get',
        success: function (res) {
          res.data.push({"uuid":"all","enumValue":"全部"})
          _this.subjectList = res.data;
        }
      });
    },
    methods: {
      getFilter(value,index){
        if(index == 3 || index == 2 || index == 6 || index == 7 || index == 8){
          return value+'%';
        }else {
          return value
        }
      },
      searchFrom() {
        this.loadTotal();
        this.loadSubject();
      },
      loadTotal() {
        let param = `?createDateStart=${this.Search.createDateStart}&createDateEnd=${this.Search.createDateEnd}`;
        const _this = this;
        common.ajax({
          url: REPORT().Train.totalKpi + param,
          method: 'get',
          success: function (res) {
            _this.totalKpiList = res.data.teacherList || [];
          }
        });
      },
      loadSubject() {
        let param = `?createDateStart=${this.Search.createDateStart}&createDateEnd=${this.Search.createDateEnd}&teachingSubject=${this.Search.teachingSubject}`;
        const _this = this;
        common.ajax({
          url: REPORT().Train.subjectKpi + param,
          method: 'get',
          success: function (res) {
            _this.subjectkpiList = res.data.teacherList || [];
          }
        });
      },
      changeSubject(value) {
        this.Search.teachingSubject = value;
        this.loadSubject();
      },
      changeDate(value) {
        this.Search.createDateStart = value[0] || '';
        this.Search.createDateEnd = value[1] || '';
      }
    },
    components: { OBreadcrumb }
  };
</script>
