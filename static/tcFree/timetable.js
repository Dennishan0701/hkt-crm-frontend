$(function() {

  $('#calendar').fullCalendar({
    themeSystem: 'bootstrap3',
    // editable: true,
    aspectRatio: 1.8,
    scrollTime: '00:00',
    firstDay:1,
    timeFormat: 'H:mm',
    axisFormat: 'H:mm',
    slotMinutes:60,
    defaultTimedEventDuration:'01:00:00',
    slotDuration:'01:00:00',
    locale:'zh-cn',
    header: {
      left: 'today prev,next',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    },
    resources: [

    ],
    events: function (start, end, timezone, callback) {
      var tcDateStart = start.format('YYYY-MM-DD');
      var tcDateEnd = end.format('YYYY-MM-DD');
      $.ajax({
        type:'get',
        url:API_BASE_URL + '/teacherTime/getTeacherTimeSchedule',
        dataType:'json',
        data:{
          token:localStorage.getItem("token"),
          teacherUuid:GetQueryString("uuid"),
          startDate:tcDateStart,
          endDate: tcDateEnd,
        },
        success:function (res) {
          var arr = new Array();
          res.data.teacherDateList.forEach(function(v,i){
            var title = v.subject === null ? '' :  v.subject + '，' + v.grade + '，' + v.stuName;
            var item = {
              start: v.courseDate + 'T' + v.startTime,
              end: v.courseDate + 'T' + v.endTime,
              title:title,
              color: v.subject === null ? 'rgb(45, 140, 240)' : 'rgb(25, 190, 107)'
            };
            arr.push(item);
          });
          callback(arr);
        },
        error:function () {
          alert('网络延迟，请稍后再试');
        }
      })

    },
  });

  window.paramFromParent
  setInterval(function () {
    console.log(window.paramFromParent);
  },1000)
  // function calendar(data) {

   // }

  // function getData(startDate,endDate){
  //
  // }
  //
  // function fun_date(aa){
  //   var date1 = new Date(),
  //     time1=date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();//time1表示当前时间
  //   var date2 = new Date(date1);
  //   date2.setDate(date1.getDate()+aa);
  //   var time2 = date2.getFullYear()+"-"+(date2.getMonth()+1)+"-"+date2.getDate();
  //   return time2
  // }
  //
  // console.log(fun_date(7));;//7天后的日期
  // console.log(fun_date(-7));;//7天前的日期
  //
  // getData(fun_date(-30),fun_date(60));


  // $("#calendar").on('click','.fc-next-button,.fc-prev-button,.fc-today-button',function () {
  //   month = $('#calendar').fullCalendar('getDate').months()+1;
  //   year = $('#calendar').fullCalendar('getDate').year();
  //   console.log($('#calendar').fullCalendar('getDate'));
  //   getData(year,month);
  // });

});
