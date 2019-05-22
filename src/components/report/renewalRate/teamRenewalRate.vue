<template>
  <div style="padding: 10px">
    <o-breadcrumb second="数据报表" third="团队到期续费率"></o-breadcrumb>

    <div class="content">
      <div class="grid-widget">
        <Row>
          <i-col span=24 class="right">
            <i-select :size="$store.state.searchModuleSize" v-model="Search.teamUuid" clearable  placeholder="团队" style="width:120px;">
              <i-option v-for="(item,index) in teamList" :key='index' :value="item.uuid">{{ item.name }}</i-option>
              <!--<i-option v-for="(item,index) in teamList" :key='index' :value="item.uuid">{{ item.name }}</i-option>-->
            </i-select>
            <i-button :size="$store.state.searchModuleSize" type="primary" icon="search" @click="searchForm">搜索</i-button>
          </i-col>
        </Row>
      </div>

      <div class='main0'>
        <!--TOP10渠道-->

        <div class="item">
          <div class="grid-widget">
            <!--<caption></caption>-->
            <h2><Icon type="grid" style="margin-right: 5px"></Icon>团队到期续费率</h2>
          </div>
          <div class="item_list">
            <div class="w48">
              <i-table size="small" highlight-row height="300" border :columns="teamColumns" :data="teamData" @on-current-change="getUserSelections"></i-table>
            </div>
            <div id="team_channel" class="w48">
            </div>
          </div>
        </div>
        <div class="item">
          <div class="grid-widget">
            <h2><Icon type="ios-book" style="margin-right: 5px"></Icon>个人续费率&nbsp;&nbsp;&nbsp;&nbsp;<span class="des">说明：选择上表对应月份，展示团队个人该月续费率</span></h2>
            <!--<caption></caption>-->
          </div>
          <div class="item_list">
            <div class="w48">
              <i-table size="small" highlight-row height="300" border :columns="personalColumns" :data="personalData"></i-table>
            </div>
            <div id="personal_channel" class="w48">
            </div>
          </div>
        </div>


      </div>
    </div>
    <!--<i-table size="small" highlight-row :columns="saleTeamColumns" :data="saleTeamData"></i-table>-->
    <!--<div class="gridPage">-->
    <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    <!--</div>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {REPORT} from 'common/api/report.js';
  import {formateDate, common, hideCharAtNumber, getFullPhone, urlParam} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  let echarts = require('echarts/lib/echarts') //
  let myChart1, myChart2, myChart3, myChart4;
  require('echarts/lib/chart/map')
  require('echarts/map/js/china.js')
  export default{
    data() {
      return {
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md'?5:7,
        teamList:[],
        teamData: [],
        personalData: [],
//        saleTeamData: [],
        Search: {
          teamUuid:'',
          userUuid:'',
        },
        teamColumns: [
          {
            title:'序号',
            type:'index',
            minWidth:40
          },
          {
            title: '月份',
            key: 'renewPayDate',
            align: 'center',
            minWidth:90
          },
          {
            title: '续费人数',
            key: 'renewPayNum',
            align: 'center',
            minWidth:90,
            render(h, params) {
              return h('span',params.row.renewPayNum||0)

            }
          },
          {
            title: '新签人数',
            key: 'newPayNum',
            align: 'center',
            minWidth:90,
            render(h, params) {
              return h('span',params.row.newPayNum||0)
            }
          },
          {
            title: '到期续费率（%）',
            key: 'renewPayRate',
            align: 'center',
            minWidth:90
          },
        ],
        personalColumns: [
          {
            title:'序号',
            type:'index',
            minWidth:40
          },
          {
            title: 'CR',
            key: 'userName',
            align: 'center',
            minWidth:90
          },
          {
            title: '续费人数',
            key: 'renewPayNum',
            align: 'center',
            minWidth:90,
            render(h, params) {
              return h('span',params.row.renewPayNum||0)
            }
          },
          {
            title: '新签人数',
            key: 'newPayNum',
            align: 'center',
            minWidth:90,
            render(h, params) {
              return h('span',params.row.newPayNum||'0')
            }
          },
          {
            title: '到期续费率（%）',
            key: 'renewPayRate',
            align: 'center',
            minWidth:90
          },
        ],
      }
    },
    mounted() {
      const _this = this;
      let user = JSON.parse(localStorage.getItem("user"))
      common.ajax({
        url: COMMON_API().crTeamList,
        method: 'get',
        data:{"userUuid":user.uuid},
        success: function (res) {
          _this.teamList = res.data;
        }
      });
      window.onresize = function () {
        myChart1.resize();
        myChart2.resize();
      }
    },
    methods: {
      searchForm() {
        this.loadDataGrid({
          teamUuid: this.Search.teamUuid,
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?teamUuid=${search.teamUuid}`;
        const _this = this;
        common.ajax({
          url: REPORT().renewalRate.teamRenewalRate+param,
          method: 'get',
          success: function (res) {
            _this.teamData = [];
            let team_channel_list = [];
            _this.teamData = [];
            team_channel_list.push({
              name:res.data.feb.renewPayDate||'2月份',
              value:res.data.feb.renewPayRate||'',
            },{
              name:res.data.mar.renewPayDate||'3月份',
              value:res.data.mar.renewPayRate||'',
            },{
              name:res.data.apr.renewPayDate||'4月份',
              value:res.data.apr.renewPayRate||'',
            },{
              name:res.data.may.renewPayDate||'5月份',
              value:res.data.may.renewPayRate||'',
            },{
              name:res.data.jun.renewPayDate||'6月份',
              value:res.data.jun.renewPayRate||'',
            },{
              name:res.data.jul.renewPayDate||'7月份',
              value:res.data.jul.renewPayRate||'',
            })
            _this.team_channel(team_channel_list||[]);
            _this.teamData.push({
              newPayNum:res.data.feb.newPayNum||'',
              renewPayDate:res.data.feb.renewPayDate||'2月份',
              dataTime:'2018-02',
              renewPayNum:res.data.feb.renewPayNum||'',
              renewPayRate:res.data.feb.renewPayRate||'',
            },{
              newPayNum:res.data.mar.newPayNum||'',
              renewPayDate:res.data.mar.renewPayDate||'3月份',
              dataTime:'2018-03',
              renewPayNum:res.data.mar.renewPayNum||'',
              renewPayRate:res.data.mar.renewPayRate||'',
            },{
              newPayNum:res.data.apr.newPayNum||'',
              renewPayDate:res.data.apr.renewPayDate||'4月份',
              dataTime:'2018-04',
              renewPayNum:res.data.apr.renewPayNum||'',
              renewPayRate:res.data.apr.renewPayRate||'',
            },{
              newPayNum:res.data.may.newPayNum||'',
              renewPayDate:res.data.may.renewPayDate||'5月份',
              dataTime:'2018-05',
              renewPayNum:res.data.may.renewPayNum||'',
              renewPayRate:res.data.may.renewPayRate||'',
            },{
              newPayNum:res.data.jun.newPayNum||'',
              renewPayDate:res.data.jun.renewPayDate||'6月份',
              dataTime:'2018-06',
              renewPayNum:res.data.jun.renewPayNum||'',
              renewPayRate:res.data.jun.renewPayRate||'',
            },{
              newPayNum:res.data.jul.newPayNum||'',
              renewPayDate:res.data.jul.renewPayDate||'7月份',
              dataTime:'2018-07',
              renewPayNum:res.data.jul.renewPayNum||'',
              renewPayRate:res.data.jul.renewPayRate||'',
            })

          }
        });
      },
//      团队续费
      team_channel(data){
        let top10_name = [], top10_value = [];
        data.forEach(function (v, i) {
          top10_name.push(v.name)
          top10_value.push(v.value.split('%')[0])
        });
        myChart1 = echarts.init(document.getElementById('team_channel'));

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
              relVal += params[0].value+'%';
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
          grid:{
            height:"60%"
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
            data: ['本团队到期续费率Kpi']
          },
          xAxis: {
            data: top10_name,
            axisLabel: {
              interval:0,//横轴信息全部显示
              rotate: 45,
              shadowColor:'rgba(168,225,226,0.5)',
              textStyle: {
                color: '#737373',
                fontSize: '14px'
              }
            }
          },
          yAxis: {
            axisLabel: {
              formatter: function (value) {
//                var texts = [];
//                texts.push('1223')
                return value+'%';
              }
            }},
          series: [{
            name: '本团队到期续费率Kpi',
            type: 'line',
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
//      个人续费
      personalChannel(data){
        let top10_name = [], top10_value = [];
        data.forEach(function (v, i) {
          top10_name.push(v.name)
          top10_value.push(v.value)
        });
        myChart2 = echarts.init(document.getElementById('personal_channel'));

        myChart2.setOption({
//          title:{
//            show:true,
//            text:'柱状图',
//            link:'https://image.baidu.com/search/index?tn=baiduimage&ct=201326592&lm=-1&cl=2&ie=gbk&word=%B6%FE%D6%F9%D7%D3&fr=ala&ori_query=%E4%BA%8C%E6%9F%B1%E5%AD%90&ala=0&alatpl=sp&pos=0&hs=2&xthttps=111111'
//          },
          tooltip: {
            show: true,
            trigger: 'axis',
            formatter: function (params) {
              var relVal = params[0].renewPayDate;
              relVal += params[0].renewPayRate+'%';
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
          grid:{
            height:"60%"
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
            data: ['本团队个人到期续费率Kpi']
          },
          xAxis: {
            data: top10_name,
            axisLabel: {
              interval:0,//横轴信息全部显示
              rotate: 45,
              shadowColor:'rgba(168,225,226,0.5)',
              textStyle: {
                color: '#737373',
                fontSize: '14px'
              }
            }
          },
          yAxis: {},
          series: [{
            name: '本团队个人到期续费率Kpi',
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

        })
      },

      getUserSelections(currentRow) {
        const _this = this;
        common.ajax({
          url: REPORT().renewalRate.teamRenewalRatePersonal,
          data:{
            "renewPayDate":currentRow.dataTime,
            "teamUuid":_this.Search.teamUuid,
          },
          method: 'get',
          success: function (res) {

            _this.personalChannel(res.data||[]);
            _this.personalData = res.data||[];

          }
        });
      },
//      pageChange(pageIndex) {
//        this.pageIndex = pageIndex;
//        this.getUserSelections();
//      }
    },
    computed: {},
    components: {
      OBreadcrumb
    }
  };
</script>

<style lang="less" scope  rel="stylesheet/less">
  .content{
    padding: 0 10px;
    .item{
      margin-top: 15px;
      border:1px solid #e3e8ee;
      background-color: #fafcfe;
      padding:10px 0;
      border-radius: 4px;
      .grid-widget{
        /*margin:10px 0;*/
        /*margin-top: 0;*/
        h2{
          margin-left: 10px;
          .des{
            font-size: 14px;
          }
        }
      }
      .item_list{
        margin: 0 10px;
      }
    }
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
