<template>
  <div style="padding: 10px">
    <o-breadcrumb second="数据报表" third="销售总排课监控"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span=24 class="right">
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" @on-change="changeClassDate" placement="bottom-end" ref='sigup'
                       placeholder="上课时间" style="width: 200px"></Date-picker>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" @on-change="changeSignUpDate" placement="bottom-end" ref='sigup'
                       placeholder="课程提交时间" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="search" @click="searchForm(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>

    <div class='main0'>
      <div class="w48">
        <i-table size="small" highlight-row height="300" border :columns="columns" :data="data" @on-current-change="getCourseDetail"></i-table>
      </div>
      <div id="paintPic" class="w48">

      </div>
    </div>
    <i-table size="small" highlight-row :columns="saleTeamColumns" :data="saleTeamData"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :current="pageIndex" :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {REPORT} from 'common/api/report.js';
  import {formateDate, common, hideCharAtNumber, getFullPhone, urlParam} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';
  //  import {Echarts} from '../../../static/js/echarts.min'
  let echarts = require('echarts/lib/echarts') //
  let myChart1, myChart2, myChart3, myChart4;
  require('echarts/lib/chart/map')
  require('echarts/map/js/china.js')
  export default{
    data() {
      return {
        teamNames:'',
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md'?11:17,
        data: [],
        saleTeamData: [],
        Search: {
          teamUuid:'',
          courseStartTime: '',
          courseEndTime: '',
          courseCommitStartTime: '',
          courseCommitEndTime: '',
        },
        columns: [
          {
            title:'序号',
            type:'index',
            minWidth:40,
            align: 'center',
          },
          {
            title: '团队名称',
            key: 'teamName',
            align: 'center',
            minWidth:80,
          },
          {
            title: '测评课',
            key: 'testCourseCount',
            align: 'center',
            minWidth:60,
          },
          {
            title: '正式课',
            key: 'formalCourseCount',
            align: 'center',
            minWidth:60,
          }
        ],
        saleTeamColumns:[
          {
            title: '序号',
            type:'index',
            align:'center',
            minWidth:40
          },
          {
            title: '学生姓名',
            key: 'leadsName',
            align:'center',
            width:90
          },
          {
            title: '年级',
            key: 'grade',
            align:'center',
            width:90
          },
          {
            title: '科目',
            key: 'subject',
            align:'center',
            width:90
          },
          {
            title: '课程类型',
            key: 'courseType',
            align:'center',
            minWidth:90
          },
          {
            title: '课时类别',
            key: 'courseLevel',
            align:'center',
            minWidth:90
          },
          {
            title: '课程时长（h）',
            key: 'length',
            align:'center',
            minWidth:120,
          },
          {
            title: '上课日期',
            key: 'courseDate',
            align:'center',
            minWidth:120
          },
          {
            title: '上课时间',
            key: 'courseStartTime',
            align:'center',
            minWidth:120,
            render:(h,params)=>{
              return h('span',params.row.courseStartTime+'~'+params.row.courseEndTime)
            }
          },
          {
            title: '老师姓名',
            key: 'teacherName',
            align:'center',
            minWidth:90
          },
          {
            title: '销售姓名',
            key: 'userName',
            align:'center',
            minWidth:90
          },
          {
            title: '销售团队',
            key: 'teamName',
            align:'center',
            minWidth:90
          },
          {
            title: '课程提交时间',
            key: 'courseCommitTime',
            align:'center',
            minWidth:180
          },
          {
            title: '排课时间',
            key: 'courseManagerTime',
            align:'center',
            minWidth:180
          },
          {
            title: '课程反馈状态',
            key: 'courseFeedBackStatus',
            align:'center',
            minWidth:90
          },
          {
            title: '反馈备注',
            key: 'courseFeedBackRemark',
            align:'center',
            minWidth:250,
            render :(h,params)=>{
              let content = params.row.courseFeedBackRemark;
              if(content && content.length>40) {
                content = content.slice(0,39)+'...';
                return h('div',[
                  h('span',{
                    attrs:{
                      title:params.row.courseFeedBackRemark
                    }
                  },content)
                ])
//                return `<span title="${row.courseFeedBackRemark}">${content}</span>`;
              } else {
                return h('span',content);
              }
            }
          },
          {
            title: '是否支付',
            key: 'isPay',
            align:'center',
            minWidth:90
          },
        ]
      }
    },
    mounted() {
      let user = JSON.parse(localStorage.getItem("user"))
      window.onresize = function () {
        myChart1.resize();
      }
    },
    methods: {
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          courseStartTime: this.Search.courseStartTime,
          courseEndTime: this.Search.courseEndTime,
          courseCommitStartTime: this.Search.courseCommitStartTime,
          courseCommitEndTime: this.Search.courseCommitEndTime,
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?courseDateStart=${search.courseStartTime}&courseDateEnd=${search.courseEndTime}&createDateStart=${search.courseCommitStartTime}&createDateEnd=${search.courseCommitEndTime}`;
        const _this = this;
        common.ajax({
          url: REPORT().Sale.queryTeamCourseCount + param,
          method: 'get',
          success: function (res) {
            _this.paintPic(res.data['chartUserCourseCountVos']||[]);
            _this.data = res.data['teamCourseCountList']||[];
            _this.saleTeamData = [];
          }
        });
      },
      paintPic(saleNames,courseCount){
        myChart1 = echarts.init(document.getElementById('paintPic'));
        var option = {
          tooltip: {
            show: true,
            trigger: 'axis',
            formatter: function (params) {
              var relVal = params[0].name;
              relVal += params[0].value;
              return relVal;
            },
            showDelay: 0,
            hideDelay: 50,
            transitionDuration: 0,
            backgroundColor: 'rgba(50,50,50,1)',
            borderColor: '#aaa',
            showContent: true,
            borderRadius: 8,
            padding: 10
          },
          toolbox: {
            show : true,
            feature : {
              saveAsImage : {
                show: true,
                name: this.teamNames + '课程数量'
              }
            }
          },
          calculable : true,
          grid:{
            height:"60%"
          },
          axisPointer: {
            type: 'line',
            axis: 'auto'
          },
          xAxis: {
            type: 'category',
            name: '销售',
            data: saleNames,
          },
          yAxis: {
            type: 'value',
            name: '课程数量',
          },
          dataZoom: [
            {
              type:'slider',
            },
            {
              type: 'inside',
            },
          ],
          series: [
            {
              name: '课程数量',
              type: 'bar',
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
              data:courseCount
            }
          ],

          label: {
            normal: {
              show: true,
              position: 'top'
            }
          }
        };

        myChart1.setOption(option)
      },
      changeClassDate(value) {
        this.Search.courseStartTime = value[0] || '';
        this.Search.courseEndTime = value[1] || '';
      },
      changeSignUpDate(value) {
        this.Search.courseCommitStartTime = value[0] || '';
        this.Search.courseCommitEndTime = value[1] || '';
      },
      getCourseDetail(currentRow) {
        this.teamNames = currentRow.teamName;
        const _this = this;
        _this.total = currentRow?currentRow.count:_this.total;
        _this.Search.teamUuid = currentRow.teamUuid;
        common.ajax({
          url: REPORT().Sale.queryCourseDetail,
          data:{
            "teamUuid":_this.Search.teamUuid,
            "courseDateStart":_this.Search.courseStartTime,
            "courseDateEnd":_this.Search.courseEndTime,
            "createDateStart":_this.Search.courseCommitStartTime,
            "createDateEnd":_this.Search.courseCommitEndTime,
            "pageIndex":_this.pageIndex,
            "pageNumber":_this.pageNumber,
          },
          method: 'get',
          success: function (res) {
            _this.total = res.data.total;
            _this.saleTeamData = res.data['courseDetailList']||[];
          }
        });
        common.ajax({
          url: REPORT().Sale.queryPersonalCourseCount,
          data:{
            "teamUuid":_this.Search.teamUuid,
            "courseDateStart":_this.Search.courseStartTime,
            "courseDateEnd":_this.Search.courseEndTime,
            "createDateStart":_this.Search.courseCommitStartTime,
            "createDateEnd":_this.Search.courseCommitEndTime,
            "pageIndex":1,
            "pageNumber":1000,
          },
          method: 'get',
          success: function (res) {
            console.log(res.data['personalCourseCountList']);
            let saleNames = [];
            let courseCount = [];
            if(res.data['personalCourseCountList']){
              res.data['personalCourseCountList'].forEach(function (item , index) {
                saleNames.push(item.saleName);
                courseCount.push(item.courseSum);
              })
              _this.paintPic(saleNames,courseCount);
            }else{
              return;
            }
          }
        });
      },
      pageChange(pageIndex) {
        const _this = this;
        this.pageIndex = pageIndex;
        common.ajax({
          url: REPORT().Sale.queryCourseDetail,
          data:{
            "teamUuid":_this.Search.teamUuid,
            "courseDateStart":_this.Search.courseStartTime,
            "courseDateEnd":_this.Search.courseEndTime,
            "createDateStart":_this.Search.courseCommitStartTime,
            "createDateEnd":_this.Search.courseCommitEndTime,
            "pageIndex":_this.pageIndex,
            "pageNumber":_this.pageNumber,
          },
          method: 'get',
          success: function (res) {
            _this.total = res.data.total;
            _this.saleTeamData = res.data['courseDetailList']||[];
          }
        });
      }
    },
    computed: {},
    components: {
      OBreadcrumb,PageModel
    }
  };
</script>

<style lang="less" scope  rel="stylesheet/less">
  .grid-widget{
    /*padding-bottom: 10px;*/
    /*border-bottom: 1px solid #ccc;*/
  }
  .main0 {
    padding:10px 0;
    .box {
      padding: 20px;
      width: 100%;
      height: 600px;
    }
    .w48 {
      width: 48%;
      display: inline-block;
      height: 300px;
      vertical-align: top;
    }

  }
</style>
