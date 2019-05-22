<template>
  <div class="personal">
    <div class="grid-widget">
      <Row>
        <i-col span=24 class="right">
          <i-select :size="$store.state.searchModuleSize" v-model="Search.grade" clearable placeholder="年级" style="width:90px">
            <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" @on-change="changeDate" placement="bottom-end" placeholder="时间" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="search" @click="searchFrom">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <div class="border">
      <h2>测评课</h2>
      <i-table size="small" highlight-row stripe :columns="columns1" :data="data1"></i-table>
    </div>
    <div class="border">
      <h2>正式课</h2>
      <i-table size="small" highlight-row stripe :columns="columns2" :data="data2"></i-table>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {REPORT} from 'common/api/report.js';
  import {common} from 'common/js/common.js';
    import OBreadcrumb from 'components/o/OBreadcrumb';

    export default{
      data() {
        return {
          Search: {
            courseDateStart: '',
            courseDateEnd: '',
            grade: ''
          },
          data1:[],
          data2:[],
          gradeList: [],
          columns1: [
            {
              title: '姓名',
              key: 'tcName',
              render : (h, params) => {
                return h('div',[
                  h('strong',{},params.row.tcName)
                ])
//                return `<strong>${row.tcName}</strong>`;
              }
            },
            {
              title: '总测评课',
              key: 'courseCount',
            },
            {
              title: '语文',
              key: 'chinese',
            },
            {
              title: '数学',
              key: 'math',
            },
            {
              title: '英语',
              key: 'english',
            },
            {
              title: '政治',
              key: 'politics',
            },
            {
              title: '历史',
              key: 'history',
            },
            {
              title: '地理',
              key: 'geography',
            },
            {
              title: '生物',
              key: 'biology',
            },
            {
              title: '化学',
              key: 'chemistry',
            },
            {
              title: '物理',
              key: 'physics',
            },
            {
              title: '科学',
              key: 'science',
            }
          ],
          columns2: [
            {
              title: '姓名',
              key: 'tcName',
              render:(h,params)=> {
                return h('div',[
                  h('strong',{},params.row.tcName)
                ])
//                return `<strong>${row.tcName}</strong>`;
              }
            },
            {
              title: '总正式课',
              key: 'courseCount',
            },
            {
              title: '语文',
              key: 'chinese',
            },
            {
              title: '数学',
              key: 'math',
            },
            {
              title: '英语',
              key: 'english',
            },
            {
              title: '政治',
              key: 'politics',
            },
            {
              title: '历史',
              key: 'history',
            },
            {
              title: '地理',
              key: 'geography',
            },
            {
              title: '生物',
              key: 'biology',
            },
            {
              title: '化学',
              key: 'chemistry',
            },
            {
              title: '物理',
              key: 'physics',
            },
            {
              title: '科学',
              key: 'science',
            }
          ]
        }
      },
      mounted() {
        const _this = this;
        $.getJSON("static/data.json", function (json) {
          _this.gradeList = json.gradeList;
        });
        this.searchFrom();
      },
      methods: {
        searchFrom() {
          this.loadData({
            courseDateStart: this.Search.courseDateStart,
            courseDateEnd: this.Search.courseDateEnd,
            grade: this.Search.grade
          });
        },
        loadData(search) {
          const _this = this;
          let param1 = `?courseType=0&courseDateStart=${search.courseDateStart}&courseDateEnd=${search.courseDateEnd}&grade=${search.grade}`;
          let param2 = `?courseType=1&courseDateStart=${search.courseDateStart}&courseDateEnd=${search.courseDateEnd}&grade=${search.grade}`;
          common.ajax({//测评课
            url: REPORT().PlanCourse.planCourseToPerson + param1,
            method: 'get',
            success: function (res) {
              if(res.data) {
                _this.data1 = res.data.teacherCourseList || [];
              }
            }
          });
          common.ajax({//正式课
            url: REPORT().PlanCourse.planCourseToPerson + param2,
            method: 'get',
            success: function (res) {
              if(res.data) {
                _this.data2 = res.data.teacherCourseList || [];
              }
            }
          });
        },
        changeDate(value) {
          this.Search.courseDateStart = value[0] || '';
          this.Search.courseDateEnd = value[1] || '';
        }
      },
      components: {
          OBreadcrumb
      }
    };
</script>

<style scoped>
  .personal { padding: 0 10px 10px 10px;}
  .personal .border {
    margin: 10px 0;
  }
</style>
