<template>
  <div style="padding: 10px">
    <o-breadcrumb second="数据分析" third="销售团队监控"></o-breadcrumb>

    <div class="grid-widget">
      <Row>
        <i-col span=24 class="right">
          <i-select v-model="Search.teamUuid" :size="$store.state.searchModuleSize" clearable placeholder="团队" style="width:80px;">
            <i-option v-for="(item,index) in teamList" :key='index' :value="item.teamUuid">{{ item.teamName }}
            </i-option>
          </i-select>
          <Date-picker type="daterange" :size="$store.state.searchModuleSize" @on-change="changeClassDate" placement="bottom-end" ref="sigup"
                       placeholder="上课时间" style="width: 200px"></Date-picker>
          <Date-picker type="daterange" :size="$store.state.searchModuleSize" @on-change="changeSignUpDate" placement="bottom-end" ref="sigup"
                       placeholder="课程提交时间" style="width: 200px"></Date-picker>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="search" @click="searchForm(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>

    <div class='main0'>
      <!--TOP10渠道-->
      <div class="w48">
        <i-table size="small" highlight-row height="300" border :columns="columns" :data="data"
                 @on-current-change="getUserSelections"></i-table>
      </div>
      <div id="top10_channel" class="w48">

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
  import {dataAnalysis} from 'common/api/dataAnalysis.js';
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
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 5 : 7,
        teamList: [],
        data: [],
        saleTeamData: [],
        Search: {
          teamUuid: '',
          userUuid: '',
          courseStartTime: '',
          courseEndTime: '',
          courseCommitStartTime: '',
          courseCommitEndTime: '',
        },
        columns: [
          {
            title: '序号',
            type: 'index',
            width: 60
          },
          {
            title: '销售姓名',
            key: 'userName',
            align: 'center',
          },
          {
            title: '测评课',
            key: 'count',
            align: 'center',
          },
        ],
        saleTeamColumns: [
          {
            title: '序号',
            type: 'index',
            align: 'center',
            width: 40
          },
          {
            title: '学生姓名',
            key: 'leadsName',
            align: 'center',
            width: 90
          },
          {
            title: '年级',
            key: 'grade',
            align: 'center',
            width: 90
          },
          {
            title: '科目',
            key: 'subject',
            align: 'center',
            width: 90
          },
          {
            title: '课程类型',
            key: 'courseType',
            align: 'center',
            width: 90
          },
          {
            title: '课时类别',
            key: 'courseLevel',
            align: 'center',
            width: 90
          },
          {
            title: '课程时常（h）',
            key: 'length',
            align: 'center',
            width: 120
          },
          {
            title: '上课日期',
            key: 'courseDate',
            align: 'center',
            width: 120
          },
          {
            title: '上课时间',
            key: 'courseStartTime',
            align: 'center',
            width: 120,
            render(h, params) {
              return h('span',params.row.courseStartTime + '~' + params.row.courseEndTime)
            }
          },
          {
            title: '老师姓名',
            key: 'teacherName',
            align: 'center',
            width: 90
          },
          {
            title: '销售姓名',
            key: 'userName',
            align: 'center',
            width: 90
          },
          {
            title: '销售团队',
            key: 'teamName',
            align: 'center',
            width: 90
          },
          {
            title: '课程提交时间',
            key: 'courseCommitTime',
            align: 'center',
            width: 180
          },
          {
            title: '排课时间',
            key: 'courseManagerTime',
            align: 'center',
            width: 180
          },
          {
            title: '课程反馈状态',
            key: 'courseFeedBackStatus',
            align: 'center',
            width: 90
          },
          {
            title: '反馈备注',
            key: 'courseFeedBackRemark',
            align: 'center',
            width: 250,
            render: (h, params) => {
              let content = row.courseFeedBackRemark;
              if (content && content.length > 40) {
                content = content.slice(0, 39) + '...';
                return h('div', [
                  h('span', {
                    attrs: {
                      title: params.row.courseFeedBackRemark
                    },
                    style: {
                      margin: '2px',
                    },
                  }, content)
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
            align: 'center',
            width: 90
          },
        ]
      }
    },
    mounted() {
      const _this = this;
      let user = JSON.parse(localStorage.getItem("user"))
      // common.ajax({
      //   url: dataAnalysis().sales.getUserTeam,
      //   method: 'get',
      //   data: {"userUuid": user.uuid},
      //   success: function (res) {
      //     _this.teamList = res.data;
      //   }
      // });
      this.$axios.get(dataAnalysis().sales.getUserTeam,{
        params:{
          userUuid:user.uuid,
        }
      }).then( ({data}) => {
        _this.teamList = data.data;
      })
      window.onresize = function () {
        myChart1.resize();
      }
    },
    methods: {
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          teamUuid: this.Search.teamUuid,
          courseStartTime: this.Search.courseStartTime,
          courseEndTime: this.Search.courseEndTime,
          courseCommitStartTime: this.Search.courseCommitStartTime,
          courseCommitEndTime: this.Search.courseCommitEndTime,
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?teamUuid=${search.teamUuid}&courseStartTime=${search.courseStartTime}&courseEndTime=${search.courseEndTime}&courseCommitStartTime=${search.courseCommitStartTime}&courseCommitEndTime=${search.courseCommitEndTime}`;
        const _this = this;
        // common.ajax({
        //   url: dataAnalysis().sales.dataGrid + param,
        //   method: 'get',
        //   success: function (res) {
        //     _this.top10_channel(res.data['chartUserCourseCountVos'] || []);
        //     _this.data = res.data['courseCountVos'] || [];
        //     _this.saleTeamData = [];
        //   }
        // });
        this.$axios.get(dataAnalysis().sales.dataGrid,{
          params:{
            teamUuid:search.teamUuid,
            courseStartTime:search.courseStartTime,
            courseEndTime:search.courseEndTime,
            courseCommitStartTime:search.courseCommitStartTime,
            courseCommitEndTime:search.courseCommitEndTime,
          }
        }).then( ({data}) => {
          _this.top10_channel(data.data['chartUserCourseCountVos'] || []);
          _this.data = data.data['courseCountVos'] || [];
          _this.saleTeamData = [];
        })
      },
      top10_channel(data){
        let top10_name = [], top10_value = [];
        data.forEach(function (v, i) {
          top10_name.push(v.name)
          top10_value.push(v.value)
        });
        myChart1 = echarts.init(document.getElementById('top10_channel'));

        var option = {
//          title:{
//            show:true,
//            text:'柱状图',
//            link:'https://image.baidu.com/search/index?tn=baiduimage&ct=201326592&lm=-1&cl=2&ie=gbk&word=%B6%FE%D6%F9%D7%D3&fr=ala&ori_query=%E4%BA%8C%E6%9F%B1%E5%AD%90&ala=0&alatpl=sp&pos=0&hs=2&xthttps=111111'
//          },
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
          grid: {
            height: "60%"
          },
          dataZoom: [
            {
              type: 'slider',
              show: true,
              height: 20,
              backgroundColor: 'rgba(38,227,189,0.3)',
//         fillerColor: 'rgba(167,183,204,0.4)',
              borderColor: '#0a2b24'
            }
          ],
          axisPointer: {
            type: 'line',
            axis: 'auto'
          },
          legend: {
            data: ['本团队销售前10排名']
          },
          xAxis: {
            data: top10_name,
            axisLabel: {
              interval: 0,//横轴信息全部显示
              rotate: 45,
              shadowColor: 'rgba(168,225,226,0.5)',
              textStyle: {
                color: '#737373',
                fontSize: '14px'
              }
            }
          },
          yAxis: {},
          series: [{
            name: '本团队销售前10排名',
            type: 'bar',
            barMaxWidth: 60,
            data: top10_value,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0.5, 1, [{
                  offset: 0,
                  color: 'rgba(35,123,105,1)'
                }, {
                  offset: 1,
                  color: 'rgba(103,237,210,.5)'
                }]),
                borderColor: '#23a5e2',
                borderWidth: 2,
                barBorderRadius: [10, 10, 0, 0],
//           shadowBlur:10,
                shadowColor: 'rgba(168,225,226,0.5)',
//           shadowOffsetX:10,
//           shadowOffsetY:10,
                opacity: .6

              },
              emphasis: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(13,164,171,1)'
                }, {
                  offset: 1,
                  color: 'rgba(64,180,157,.1)'
                }]),
                borderColor: '#0ea4a6',
                borderWidth: 2,
                barBorderRadius: [9, 9, 0, 0],
                shadowBlur: 30,
                shadowColor: 'rgba(32,188 ,157,0.8)',
//           shadowOffsetX:10,
//           shadowOffsetY:10,
                opacity: .7,
                label: {
                  show: true,
                  textStyle: {
                    color: 'rgba(150,197,188,1)'
                  }

                }
              }
            },
            markPoint: {
              symbol: 'circle',
              symbolSize: 50,
              symbolOffset: [0, 0],
              silent: true

            }

          }],
          label: {
            normal: {
              show: true,
              position: 'top'

            }
//       emphasis:{
//         show:false,
//         position:[10,10],
//         formatter:'{b}:{c}',
//         textStyle:{
//           color:'#fff',
//           fontWeight:'bolder',
//           fontSize:14
//         }
//       }
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
      getUserSelections(currentRow) {
        console.log(currentRow);
        const _this = this;
        _this.total = currentRow ? currentRow.count : _this.total;
        _this.Search.userUuid = currentRow ? currentRow.userUuid : _this.Search.userUuid;
//        _this.Search.userUuid = currentRow.userUuid;
//         common.ajax({
//           url: dataAnalysis().sales.getsaleTeamCourseKpi,
//           data: {
//             "userUuid": _this.Search.userUuid,
//             "courseStartTime": _this.Search.courseStartTime,
//             "courseEndTime": _this.Search.courseEndTime,
//             "courseCommitStartTime": _this.Search.courseCommitStartTime,
//             "courseCommitEndTime": _this.Search.courseCommitEndTime,
//             "pageIndex": _this.pageIndex,
//             "pageNumber": _this.pageNumber,
//           },
//           method: 'get',
//           success: function (res) {
//             _this.saleTeamData = res.data || [];
// //            _this.total = res.data.total;
//             console.log(_this.saleTeamData);
//           }
//         });
        this.$axios.get(dataAnalysis().sales.getsaleTeamCourseKpi,{
          params:{
            userUuid: _this.Search.userUuid,
            courseStartTime: _this.Search.courseStartTime,
            courseEndTime: _this.Search.courseEndTime,
            courseCommitStartTime: _this.Search.courseCommitStartTime,
            courseCommitEndTime: _this.Search.courseCommitEndTime,
            pageIndex: _this.pageIndex,
            pageNumber: _this.pageNumber,
          }
        }).then( ({data}) => {
          _this.saleTeamData = data.data || [];
        })
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.getUserSelections();
      }
    },
    computed: {},
    components: {
      OBreadcrumb,PageModel
    }
  };
</script>

<style lang="less" scope rel="stylesheet/less">
  .grid-widget {
    /*padding-bottom: 10px;*/
    /*border-bottom: 1px solid #ccc;*/
  }

  .main0 {
    padding: 10px 0;
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
