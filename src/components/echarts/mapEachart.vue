<template>
  <div style="width:100%;height:100%;">
    <div id="main" style="width:100%;height:100%;"></div>
    <div class="btn-tools">
      <i-button icon="ios-arrow-back" @click="close" style="width:100px">返回</i-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {ECHARTS} from 'common/api/echarts.js';
  import {formateDate, common, hideCharAtNumber, getFullPhone, urlParam} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  //  import {Echarts} from '../../../static/js/echarts.min'
  let echarts = require('echarts/lib/echarts') //
  require('echarts/lib/chart/map')
  require('echarts/map/js/china.js')
  export default{
    data() {
      return {
      }
    },
    mounted() {
      this.mapShow();
    },
    methods: {
      mapShow(){
        const _this = this;
        let areaCountList;
        let maxNumber;
        if (urlParam("map") == "client") {
          // common.ajax({
          //   url: ECHARTS().getAreaCountByDate+'?downloadDate='+urlParam("date")+'&clientType='+urlParam("clientType"),
          //   method: 'get',
          //   success: function (res) {
          //     areaCountList = res.data['areaCountList'] || [];
          //     maxNumber = res.data.maxNumber
          //     map()
          //   }
          // });
          this.$axios.get(ECHARTS().getAreaCountByDate+'?downloadDate='+urlParam("date")+'&clientType='+urlParam("clientType"),{
          }).then( ({data}) => {
            areaCountList = data.data['areaCountList'] || [];
            maxNumber = data.data.maxNumber
            map()
          })
        }else if(urlParam("map") == "marketChannel"){
            let param = `?startDate=${urlParam("startTime")}&endDate=${urlParam("endTime")}&changeUuid=${urlParam("changeUuid")}`
          // common.ajax({
          //   url: ECHARTS().getChangeAreaCount+param,
          //   method: 'get',
          //   success: function (res) {
          //     areaCountList = res.data['areaCountList'] || [];
          //     maxNumber = res.data.maxNumber
          //     map()
          //   }
          // });
          this.$axios.get( ECHARTS().getChangeAreaCount+param,{
          }).then( ({data}) => {
            areaCountList = data.data['areaCountList'] || [];
            maxNumber = data.data.maxNumber
            map()
          })
        }
     function map() {
       let myChart;
       window.onresize = function () {
         myChart.resize();
       }
       myChart = echarts.init(document.getElementById('main'));

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
           left: 0,
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
           data:areaCountList
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


       myChart.setOption(option)
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

         var option = myChart.getOption()
         // 修改top
         option.grid[0].height = TOPN * 20
         option.yAxis[0].max = TOPN
         option.yAxis[0].splitNumber = TOPN
         option.series[1].data[0] = TOPN
         // 排序
//         console.log(option.series[0].data);
         var data = [];
         option.series[0].data.forEach(function (v,i) {
             if(v.value){
               console.log(v);
               data = option.series[0].data.slice(0,i+1)
             }
         })
         console.log(data);

         data = data.sort(function (a, b) {

          if(b.value && a.value){
            return b["value"] - a["value"]
          }
         })

//         console.log(data);
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
         myChart.setOption(option)
       }, 0);
     }

      },
      close() {
        window.history.back();
      },
    },
    computed: {},
    components: {}
  };
</script>

<style scope>
  .btn-tools {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    margin: 30px 0;
  }
</style>
