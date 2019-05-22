<template>
  <div class="date_panel f_disselected"
       @click="hidePickerNow">
    <div class="panel_head" >
      <span class="change_month" @click="changeMonth(-1)">&lt;</span>
      <span class="choose_btn" @click="showPicker" @mouseout="hidePicker" choosetype="y">{{panelChoosed.year}}</span>
      <span class="choose_btn" @click="showPicker" @mouseout="hidePicker" choosetype="m">{{panelChoosed.month}}</span>
      <span class="change_month" @click="changeMonth(1)">&gt;</span>
      <div class="choose_box"
           :class="{'choose_year_box':changeType === 'y'}"
           @mouseover="clearPickerTimer"
           @mouseout="hidePicker"
           v-show="showChooseBox">
        <p class="change_year" v-if="changeType === 'y'">
          <span @click="changeYearPage" changeval="-8">&lt;</span>
          <span @click="changeYearPage" changeval="8">&gt;</span>
        </p>
        <span class="item"
              v-for="(item,index in items" :key='index'
              @click="chooseYearMonth(item)"
        >{{item}}</span>
      </div>
    </div>
    <div class="panel_body">
      <p class="weekday_box"><span v-for="(weekday,index) in weekdayArry" :key='index' class="weekday">{{ weekday }}</span></p>
      <div class="day_box">
                <span v-for="(item,index) in days" :key='index'
                      :class="{'crn_month':item.isCurMonth,'only_day': item.isChoosed && item.isCurMonth}"
                      @click="choosDay(item.dayNum,item.isCurMonth)">{{ item.dayNum }}
                <b v-if='item.show'>{{item.num}}</b>
                </span>
      </div>
      <!--hidePanel-->
    </div>
  </div>
</template>
<script>

  const curDate = new Date();
  const curYear = curDate.getFullYear();
  const curMonth = curDate.getMonth() + 1 < 10 ? "0" +(curDate.getMonth()+1):curDate.getMonth()+ 1;
  const curDay = curDate.getDate();

  import {COMMON_API} from 'common/api.config.js';
  import {formateDate, common, hideCharAtNumber} from 'common/js/common.js';
  import {ZHAO_TEACHER,TEACHER} from 'common/api/teacher.js';
  export default {
    props: ['choosed'],
    data () {
      return {
        uuid:'',
        weekdayArry: ['日','一','二','三','四','五','六'],
        showChooseBox: false,
        changeYear: '',
        //渲染切换年或者月的标记，''表示不渲染，'y'表示年，‘m’表示切换月
        changeType: '',
        panelChoosed:{
          year: this.choosed.year ? this.choosed.year : curYear,
          month: this.choosed.month ? this.choosed.month : curMonth
        },
        hidePickerTimer: '',
        data:[]
      }
    },
    mounted(){
      const that = this;
      that.uuid =sessionStorage.getItem('template_Schedule');
      that.courseDateNumVos();
    },
    computed: {
      days: function () {
        return getDayArry(this.panelChoosed,this.choosed,this.data);
      },
      items: function () {
        const type = this.changeType;
        let reslt = [];
        let start = 0, end = 0;

        if(type === 'y' && this.changeYear) {
          start = this.changeYear - 4;
          end = this.changeYear + 4;
        };
        if(type === 'm') {
          start = 1;
          end = 12;
        };
        for(let i = start; i <= end; i++){
          if(i<10){
            i = "0"+i
          }
          reslt.push(i);
        };
        return reslt;
      }
    },
    methods: {
      courseDateNumVos:function () {
        const _self = this;
        const year = _self.panelChoosed.year;
        const month = _self.panelChoosed.month;
        let dataym = year+'-'+month =='-'?_self.yearMonth:year+'-'+month
        let param = `?teacherUuid=${_self.uuid}&courseDate=${dataym}`;
        if(_self.uuid){
          common.ajax({
            url: TEACHER().JianSchedule.getTeacherCourseCount + param,
            method: 'get',
            success: function (res) {
              _self.data = res.data["courseCountList"] || [];
            }
          });
        }
      },
      changeMonth: function (_val) {
        const _self = this;
        if(!_val || isNaN(_val)) return;
        const month =  Math.abs(_self.panelChoosed.month) + _val;
        switch (month) {
          case (0):{
            _self.panelChoosed.year = Math.abs(_self.panelChoosed.year) - 1;
            _self.panelChoosed.month = 12;


            _self.courseDateNumVos();
            break;
          };
          case (13):{
            _self.panelChoosed.year = Math.abs(_self.panelChoosed.year) + 1;
            _self.panelChoosed.month = 1;

            _self.courseDateNumVos();
            break;
          };
          default:{
//            Math.abs(_self.panelChoosed.month) + _val <10 ?_self.panelChoosed.month = "0"+Math.abs(_self.panelChoosed.month) + _val:_self.panelChoosed.month = Math.abs(_self.panelChoosed.month) + _val;
//            _self.panelChoosed.month = Math.abs(_self.panelChoosed.month) + _val?_self.panelChoosed.month = "0"+Math.abs(_self.panelChoosed.month) + _val:Math.abs(_self.panelChoosed.month) + _val;
            _self.panelChoosed.month = Math.abs(_self.panelChoosed.month)+_val;
            if(_self.panelChoosed.month<10){
              _self.panelChoosed.month = '0'+_self.panelChoosed.month
            }
            _self.courseDateNumVos();
            break;
          }
        }
      },
      showPicker: function(event){
        event.stopPropagation();
        const type = event.target.getAttribute('choosetype');
        this.clearPickerTimer();
        this.changeType = type ? type : 'm';
        this.changeYear = this.panelChoosed.year;
        this.showChooseBox = true;
      },
      hidePicker: function(){
        const _self = this;
        _self.clearPickerTimer();
        _self.hidePickerTimer = setTimeout(function(){
          _self.showChooseBox = false;
        }, 500)
      },
      hidePickerNow: function(){
        this.clearPickerTimer();
        this.showChooseBox = false;
      },
      clearPickerTimer: function(){
        clearTimeout(this.hidePickerTimer);
      },
      chooseYearMonth: function(_val){
        this.changeType === 'y' ? this.panelChoosed.year = _val : this.panelChoosed.month = _val;
        this.showChooseBox = false;
        this.courseDateNumVos();
      },
      changeYearPage: function(event){
        event.stopPropagation();
        const _val = parseInt(event.target.getAttribute('changeval'));
        this.changeYear = this.changeYear + _val;
      },
      choosDay: function (_day,_isCurMonth) {
        if(!_isCurMonth) return;
        this.choosed.year = this.panelChoosed.year;
        this.choosed.month = this.panelChoosed.month;
        this.choosed.day = _day<10?'0'+_day:_day;
      },
      choosMonth: function (_isCurMonth) {
        if(!_isCurMonth) return;
        this.courseDateNumVos();
      }
    }
  };
  //-------------------------月份数组拼接 START------------------------------------
  function getDayArry(showDate, chooseReslt,list) {
    const year = showDate.year;
    const month = showDate.month;
    const day = showDate.day;
    const chooseDateArry = chooseReslt.year && chooseReslt.month && chooseReslt.day ? [chooseReslt.year,chooseReslt.month,chooseReslt.day] : [curYear,curMonth,curDay];
    //获取当前月天数数组
    const curMonthDays = getMonthDays(month);
    const preMonthDays = getMonthDays(month == 0 ? 11 : month - 1);
    const firstDay = getDayInWeek(year, (month - 1), 1); //当前月第一天是星期几
    const allDays =  Math.ceil((+curMonthDays + firstDay) / 7) * 7;
    let dayArry = [];
    for(let i = 1; i <= allDays; i++){

      const isPre = i <= firstDay;
      const isNxt = i > (firstDay + curMonthDays);
      const isCurMonth = !isPre && !isNxt;
      const dayNum = isPre ? preMonthDays - firstDay + i : isNxt ? i - firstDay - curMonthDays : i - firstDay;
      let num
      let num0
      let numList ='';

//      let timeList =[];
//      list.forEach(function (val,i) {
//        dayNum<10? num0 = "0"+dayNum:num0 = dayNum
//        numList = year+"-"+month+"-"+num0
//        if(val.dataTime == numList){
//          timeList.push({timeList:val.dataTime})
//          timeList.forEach(function (v,i) {
//            if(v.timeList == val.dataTime){
//              let num2 = 0;
//              num2++;
//              console.log(num2);
//              if(num2>1){
//                num = val.num;
//                console.log(1);
//              }else {
//                console.log(2);
//              }
//            }else {
//            }
//          })
//        }
//      })
      list.forEach(function (v,i) {
        dayNum<10?num0 = "0"+dayNum:num0 = dayNum
        numList = year+"-"+month+"-"+num0
        if(v.courseDate == numList){
          num = v.courseSum;
        }
      })
      dayArry.push({
        num:num,
        show:num&&isCurMonth?true:false,
        dayNum: dayNum,
        isChoosed: (chooseDateArry[0] == year && chooseDateArry[1] == month && chooseDateArry[2] == (i - firstDay)),
        isSpecailDay: false,
        isCurMonth: isCurMonth,
        color: false
      })
    };
    return dayArry;
  };

  function getMonthDays(month) {
    //获取某年某月有多少天
    if(!!!month) return;
    const tempDate = new Date(2016, month, 0).getDate();
    return tempDate;
  };
  function getDayInWeek(year, month, day) {
    //返回某年某月某日是星期几
    if(!!!year || !!!month || !!!day || month - 1 < 0) return 0;
    const tempDate = new Date(year, month, day).getDay();
    return tempDate;
  };
  //-------------------------月份数组拼接 END------------------------------------
</script>
<style lang="less" scoped>
  .date_panel {
    margin-top: 10px;
  }

  .date_panel {
    width: 100%;
    border: 1px solid #9D94B0;
    padding: 4px;
    background: #fff;
  }

  .panel_head{
    position: relative;
    height: 45px;
    line-height: 45px;
    font-size: 0;
    margin-bottom: 5px;
    text-align:center;

  span{
    display: inline-block;
    font-size: 16px;
    color: #666;
    cursor: pointer;
    text-align:center;
  &:hover{
     background: #F0F0F0;
   }
  }
  .change_month{
    width:50px;
  }
  .choose_btn{
    width: 120px;
  }
  }

  .choose_box{
    position: absolute;
    top:45px;
    left: 50%;
    width: 120px;
    background: #fff;
    border: 1px solid #9D94B0;
    font-size: 0;
    line-height: 25px;
    z-index:99;
  span{
    display: inline-block;
    width: 40px;
    height: 25px;
    font-size: 12px;
  }
  .change_year span{
    width: 50%;
    font-size: 16px;
  }
  &.choose_year_box{
     left: 50%;
     -webkit-transform: translateX(-120px);
     -moz-transform: translateX(-120px);
     -ms-transform: translateX(-120px);
     -o-transform: translateX(-120px);
     transform: translateX(-120px);
   }
  }


  .panel_body{
    border-top: 1px solid #9D94B0;
    font-size: 0;
    text-align:center;
  span{
    display: inline-block;
    width:14%;
    height: 45px;
    line-height: 45px;
    font-size: 12px;
    color: #59bc5e;
    font-weight: bold;
    text-align:center;
  }
  span:nth-child(7n),
  span:nth-child(7n+1){
    color: #f30;
  }
  .day_box span{
    width:14%;
    box-sizing: border-box;
    border-radius: 3px;
    cursor: pointer;
    position:relative;
    border:1px solid #59bc5e;
  b{
    position: absolute;
    right:0;
    width: 15px;
    height: 15px;
    border-radius: 15px;
    line-height: 20px;
    top:-3px;
    display: inline-block;
    color: #f30;

  }
  }
  .day_box span:not(.crn_month){
    color: #999;
    cursor: inherit;
    border:1px solid #CCC;
  }
  .day_box .only_day,.crn_month:hover{
    background: #59bc5e;
    color: #fff;
  }
  }
</style>

