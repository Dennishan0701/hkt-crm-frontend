<template>
  <div>
    <o-breadcrumb second="数据分析" third="付费lead分析"></o-breadcrumb>

    <div class="grid-widget">
      <Row>
        <i-col span=24 class="right">
          <label>提交付费时间：</label>
          <Date-picker type="daterange" :size="$store.state.searchModuleSize" @on-change="changeSignUpDate" placement="bottom-end" ref="sigup"
                       placeholder="报名时间" style="width: 200px"></Date-picker>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="search" @click="searchForm">搜索</i-button>
        </i-col>
      </Row>
    </div>

    <div class='main'>
      <!--TOP10渠道-->
      <div id="top10_channel" class="box w48">

      </div>
      <!--年级分布-->
      <div id="gradeDistribution" class="box w48">

      </div>

      <!--TOP30城市-->
      <div id="top30_city" class="box">

      </div>

      <!--地区分布-->
      <div id="localDistribution" class="box h70">

      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {dataAnalysis} from 'common/api/dataAnalysis.js';
  import {formateDate, common, hideCharAtNumber, getFullPhone, urlParam} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  //  import {Echarts} from '../../../static/js/echarts.min'
  let echarts = require('echarts/lib/echarts') //
  let myChart1, myChart2, myChart3, myChart4;
  require('echarts/lib/chart/map')
  require('echarts/map/js/china.js')
  export default{
    data() {
      return {
//        top10_channel:'',//TOP10渠道
//        gradeDistribution:'',//年级分布
//        top30_city:'',//TOP30城市
//        localDistribution:'',//地区分布
        Search: {
          commitStartTime: '',
          commitEndTime: '',
        }
      }
    },
    mounted() {
        this.searchForm();
        window.onresize = function () {
          myChart1.resize();
          myChart2.resize();
          myChart3.resize();
          myChart4.resize();
        }
    },
    methods: {
      searchForm() {
        this.loadDataGrid({
          commitStartTime: this.Search.commitStartTime,
          commitEndTime: this.Search.commitEndTime,
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?commitStartTime=${search.commitStartTime}&commitEndTime=${search.commitEndTime}`;
        const _this = this;
        // common.ajax({
        //   url: dataAnalysis().analyzePayLeads.dataGrid + param,
        //   method: 'get',
        //   success: function (res) {
        //       _this.top10_channel(res.data['channelRankVos'])
        //       _this.gradeDistribution(res.data['gradeRankVos'])
        //       _this.top30_city(res.data['leadsCityAreaRanks'])
        //       _this.localDistribution(res.data['areaRankVos'] || [], res.data['areaRankVos'][0].value);
        //   }
        // });
        this.$axios.get(dataAnalysis().analyzePayLeads.dataGrid,{
          params:{
            commitStartTime:search.commitStartTime,
            commitEndTime:search.commitEndTime,
          }
        }).then( ({data}) => {
          _this.top10_channel(data.data['channelRankVos'])
          _this.gradeDistribution(data.data['gradeRankVos'])
          _this.top30_city(data.data['leadsCityAreaRanks'])
          _this.localDistribution(data.data['areaRankVos'] || [], data.data['areaRankVos'][0].value);
        })
      },
      top10_channel(data){
        let top10_name = [], top10_value = [];
        data.forEach(v => {top10_name.push(v.channalName);top10_value.push(v.count);});
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
            data: ['渠道前10排名']
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
            name: '渠道前10排名',
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
      gradeDistribution(res){
        let data = [], dataName = [];
        res.forEach(v => {data.push({value: v.count||0, name: v.gradeName});dataName.push(v.gradeName);})
        myChart2 = echarts.init(document.getElementById('gradeDistribution'));
        var option = {
          backgroundColor: '#fff',
//          title: {
//            text: '注册资金',
//            subtext: '2016年',
//            x: 'center',
//            y: 'center',
//            textStyle: {
//              fontWeight: 'normal',
//              fontSize: 16
//            }
//          },
          tooltip: {
            show: true,
            trigger: 'item',
            formatter: "{b}: {c} ({d}%)"
          },
          legend: {
            orient: 'horizontal',
            bottom: '0%',
            data: dataName
          },
          series: [{
            type: 'pie',
            selectedMode: 'single',
            radius: ['25%', '58%'],
            color: ['#86D560', '#AF89D6', '#59ADF3', '#FF999A', '#FFCC67'],

            label: {
              normal: {
                position: 'inner',
                formatter: '{d}%',

                textStyle: {
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: data
          }, {
            type: 'pie',
            radius: ['58%', '83%'],
            itemStyle: {
              normal: {
                color: '#F2F2F2'
              },
              emphasis: {
                color: '#ADADAD'
              }
            },
            label: {
//              normal: {
//                position: 'inner',
//                formatter: '{c}家',
//                textStyle: {
//                  color: '#777777',
//                  fontWeight: 'bold',
//                  fontSize: '12px'
//                }
//              }
            },
            data: data
          }]
        };

        myChart2.setOption(option)
      },
      top30_city(data){

        let top30_name = [], top30_value = [];
        data.forEach(v => {top30_name.push(v.name);top30_value.push(v.value);})
        myChart3 = echarts.init(document.getElementById('top30_city'));

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
            data: ['城市前30排名']
          },

          grid:{
            height:"75%"
          },
          xAxis: {
            data: top30_name,
            axisLabel: {
              rotate: 45,
              textStyle: {
                color: '#737373',
                fontSize: '14px'
              }
            }
          },
          yAxis: {},
          series: [{
            name: '城市前30排名',
            type: 'bar',
            barMaxWidth: 60,
            data: top30_value,
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

        myChart3.setOption(option)

      },
      localDistribution(areaCountList, maxNumber){
        map();
        function map() {
          myChart4 = echarts.init(document.getElementById('localDistribution'));

          var option = {
            tooltip: {
              trigger: 'item',
              formatter: '{b}'
            },
            visualMap: {
              seriesIndex: 0,
              min: 0,
              max: maxNumber,
              left: 'left',
              top: 'bottom',
              text: ['高', '低'], // 文本，默认为数值文本
              calculable: true
            },
            grid: {
              height: 200,
              width: 8,
              right: 120,
              bottom: 10
            },
            xAxis: {
              type: 'category',
              data: [],
              splitNumber: 1,
              show: false
            },
            yAxis: {
              position: 'right',
              min: 0,
              max: 20,
              splitNumber: 20,
              inverse: true,
              axisLabel: {
                show: true
              },
              axisLine: {
                show: false
              },
              splitLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              data: []
            },
            series: [{
              zlevel: 1,
              name: '中国',
              type: 'map',
              mapType: 'china',
              selectedMode: 'multiple',
              roam: true,
              left: '10%',
              right: '15%',
              itemStyle: {
                normal: {
                  color: undefined,
                  shadowColor: 'rgba(255, 255, 255, .8)',
                  shadowBlur: 10
                }
              },
              label: {
                normal: {
                  show: true
                },
                emphasis: {
                  show: true
                }
              },
              data: areaCountList
            }, {
              zlevel: 2,
              name: '地图指示',
              type: 'bar',
              barWidth: 5,
              itemStyle: {
                normal: {
                  color: undefined,
                  shadowColor: 'rgba(0, 0, 0, 0.1)',
                  shadowBlur: 10
                }
              },
              data: [areaCountList.length]
            }]
          };


          myChart4.setOption(option)
          /**
           * 根据值获取线性渐变颜色
           * @param  {String} start 起始颜色
           * @param  {String} end   结束颜色
           * @param  {Number} max   最多分成多少分
           * @param  {Number} val   渐变取值
           * @return {String}       颜色
           */
          function getGradientColor(start, end, max, val) {
            var rgb = /#((?:[0-9]|[a-fA-F]){2})((?:[0-9]|[a-fA-F]){2})((?:[0-9]|[a-fA-F]){2})/;
            var sM = start.match(rgb);
            var eM = end.match(rgb);
            var err = '';
            max = max || 1
            val = val || 0
            if (sM === null) {
              err = 'start';
            }
            if (eM === null) {
              err = 'end';
            }
            if (err.length > 0) {
              throw new Error('Invalid ' + err + ' color format, required hex color');
            }
            var sR = parseInt(sM[1], 16),
              sG = parseInt(sM[2], 16),
              sB = parseInt(sM[3], 16);
            var eR = parseInt(eM[1], 16),
              eG = parseInt(eM[2], 16),
              eB = parseInt(eM[3], 16);
            var p = val / max;
            var gR = Math.round(sR + (eR - sR) * p).toString(16),
              gG = Math.round(sG + (eG - sG) * p).toString(16),
              gB = Math.round(sB + (eB - sB) * p).toString(16);
            return '#' + gR + gG + gB;
          }

//
          setTimeout(function () {
            var TOPN = 10

            var option = myChart4.getOption()
            // 修改top
            option.grid[0].height = TOPN * 20
            option.yAxis[0].max = TOPN
            option.yAxis[0].splitNumber = TOPN
            option.series[1].data[0] = TOPN
            // 排序
//         console.log(option.series[0].data);
            var data = [];
            option.series[0].data.forEach((v, i) => {
              if (v.value) {
                data = option.series[0].data.slice(0, i + 1)
              }
            });
            data = data.sort((a, b) => {
              if (b.value && a.value) {
                return b["value"] - a["value"]
              }
            })
            var maxValue = data[0].value,
              minValue = data.length > TOPN ? data[TOPN - 1].value : data[data.length - 1].value

            var s = option.visualMap[0].controller.inRange.color[0],
              e = option.visualMap[0].controller.inRange.color.slice(-1)[0]
            var sColor = getGradientColor(s, e, maxValue, minValue)
            var eColor = getGradientColor(s, e, maxValue, maxValue)

            option.series[1].itemStyle.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 1,
              color: sColor
            }, {
              offset: 0,
              color: eColor
            }])

            // yAxis
            var newYAxisArr = []
            echarts.util.each(data, function (item, i) {
              if (i >= TOPN) {
                return false
              }
              var c = getGradientColor(sColor, eColor, maxValue, item.value)
              newYAxisArr.push({
                value: item.name,
                textStyle: {
                  color: c
                }
              })
            })


//         newYAxisArr=[{"textStyle":"#000","value":"上海市"},{"textStyle":"#000","value":"北京市"}]


            option.yAxis[0].data = newYAxisArr
            option.yAxis[0].axisLabel.formatter = (function (data) {
              return function (value, i) {
                if (!value) return ' '
                return value + ' ' + data[i].value
              }
            })(data)
            myChart4.setOption(option)
          }, 0);
        }

      },
      changeSignUpDate(value) {
        this.Search.commitStartTime = value[0] || '';
        this.Search.commitEndTime = value[1] || '';
      },
    },
    computed: {},
    components: {
      OBreadcrumb
    }
  };
</script>

<style lang="less" scope>
  .main {
    padding: 10px;

  .box {
    padding: 20px;
    width: 100%;
    height: 600px;
  }

  .h70 {
    min-height: 700px;
  }

  .w48 {
    width: 48%;
    display: inline-block;
    height: 450px;
  }

  }
</style>
