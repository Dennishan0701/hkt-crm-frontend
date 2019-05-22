$(function() {
  $('#calendar').fullCalendar({
    themeSystem: 'bootstrap3',
    // editable: true,
    defaultView:'agendaWeek',
    editable: true,
    aspectRatio: 1.8,
    scrollTime: '00:00',
    firstDay:1,
    timeFormat: 'H:mm',
    axisFormat: 'H:mm',
    slotMinutes:15,
    defaultTimedEventDuration:'00:15:00',
    slotDuration:'00:15:00',
    locale:'zh-cn',
    header: {
      left: 'today prev,next',
      center: 'title',
      right: 'agendaWeek'
    },
    resources: [

    ],
    events: function (start, end, timezone, callback) {
      var tcDateStart = start.format('YYYY-MM-DD');
      var tcDateEnd = end.format('YYYY-MM-DD');
      $.ajax({
        type:'get',
        url:API_BASE_URL + '/leadsCourse/getTeacherTimeSchedule',
        dataType:'json',
        data:{
          token:localStorage.getItem("token"),
          teacherUuid:GetQueryString("teacherUuid"),
          leadsUuid:GetQueryString("leadsUuid"),
          startDate:tcDateStart,
          endDate: tcDateEnd,
        },
        success:function (res) {
          var arr = new Array();
          res.data.teacherDateList.forEach(function(v,i){
            var title = v.subject === null ? '' :  v.subject + '，' + v.grade + '，' + (v.tcName||' ');
            var item = {
              start: v.courseDate + 'T' + v.startTime,
              end: v.courseDate + 'T' + v.endTime,
              title:title,
              color: v.stuName === null ? 'rgb(45, 140, 240)' : 'rgb(25, 190, 107)'
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
    dayClick: function(date, jsEvent, view) {
      // console.log(date);
      // var start = date.format().substring(0,16);
      // var item = {
      //   title:'',
      //   start: start,
      //   color:'#f40009'
      // };
      // $('#calendar').fullCalendar('renderEvent',item);
    },
    eventClick: function (calEvent, jsEvent, view) {
      if(calEvent.color=='#f40009'){
        var _id = calEvent._id;
        $('#calendar').fullCalendar('removeEvents',_id);
      }else if(calEvent.color=='rgb(25, 190, 107)'){
        return false;
      }else {
        var start = calEvent.start.format('YYYY-MM-DD')+'T'+ calEvent.start.format('HH:mm');
        var end = calEvent.start.format('YYYY-MM-DD')+'T'+calEvent.start.format('HH') +':' + (Math.ceil(calEvent.start.format('mm'))+45);
        console.log(end);
        var item = {
          title:'',
          start: start,
          end: end,
          color:'#f40009',
        };
        $('#calendar').fullCalendar('renderEvent',item);
      }
    },
    eventAllow: function(dropLocation, draggedEvent) {
      // 判断选择时间差是否符合规则
      var start_b = draggedEvent.start.format('H:mm').split(':')[0];
      var start_e = draggedEvent.start.format('H:mm').split(':')[1];
      var end_b = draggedEvent.end.format('H:mm').split(':')[0];
      var end_e = draggedEvent.end.format('H:mm').split(':')[1];
      var time;
      // 只有新增课程课移动
      if(draggedEvent.color != '#f40009') {
        return false
      }

      //禁止跨天选择
      if(draggedEvent.end.format('DD')!=draggedEvent.start.format('DD')){
        return false;
      }
      if(end_b-start_b>0){
        time = (end_b-start_b)*60+(end_e-start_e);
        if(time == 45 ||time == 60 ||time == 90 ||time == 120 ){
          return true;
        }else {
          return false;
        }
      }else {
        if(end_e==0){
          end_e=60;
        }

        time = (end_e-start_e);
        if(time !=45){
          return false;
        }
      }
    },
  });
  // window.paramFromParent
  // setInterval(function () {
  //   console.log(window.paramFromParent);
  // },1000)

  $(".save").on('click',function () {
    var teacherDateList = '', //保存空闲时间
      view = $('#calendar').fullCalendar('getView'),
      startDate = view.start.format(),
      endDate = view.end.format(),
      data = $('#calendar').fullCalendar('clientEvents'),
      tcTime,endTime,item,tcStartDate,tcEndMinute,tcStartMinute,
      totalMinute,count,tcHour,tcMinute;
    // console.log(view);
    // console.log(data);
    data.forEach(function(v,i){
      tcStartDate = v.start.format('YYYY-MM-DD');
      // console.log(new Date(moment().format('YYYY-MM-DD')));
      // console.log(new Date(tcStartDate));
      if(v.color != '#f40009'){
        return;
      }
      if ( v.end === null ) {
        tcTime = v.start.format('HH:mm');
        endTime = tcTime.split(':')[0]+':'+(Math.ceil(tcTime.split(':')[1])+15);
        console.log(endTime);
        // endTime = tcTime.split(':')[0]+':'+(tcTime.split(':')[1]+15);
        if(new Date(moment().format('YYYY-MM-DD')) <= new Date(tcStartDate)){
          console.log(1);
          item = '{'+
            '"teacherUuid" :' + GetQueryString('teacherUuid') + ','+
            '"leadsUuid" :' + GetQueryString('leadsUuid') + ','+
            '"courseOrderUuid" :' + GetQueryString('courseOrderUuid') + ','+
            '"courseDate" : "'+ tcStartDate +'",'+
            '"startTime" : "'+ tcTime + '",' +
            '"endTime" : "'+ endTime + '"' +
            '},';
        }else {
          console.log(2);
          item = '';
        }
        teacherDateList+=item;
      } else {
        // tcStartMinute = v.start._i[3] * 60 + v.start._i[4];
        // tcEndMinute = v.end._i[3] * 60 + v.end._i[4];
        // if(tcEndMinute == 0) tcEndMinute = 1440;
        // totalMinute =  tcEndMinute - tcStartMinute;
        // count = totalMinute/60;
        // for ( var i = 0; i < count; i++ ) {

        tcTime = v.start.format('HH:mm');
        endTime = v.end.format('HH:mm');
          if(new Date(moment().format('YYYY-MM-DD')) <= new Date(tcStartDate)){
            item = '{'+
              '"teacherUuid" :"'+ GetQueryString('teacherUuid') +'",'+
              '"leadsUuid" :"'+ GetQueryString('leadsUuid') +'",'+
              '"courseOrderUuid" :"'+ GetQueryString('courseOrderUuid') +'",'+
              '"courseDate" : "'+ tcStartDate +'",'+
              '"startTime" : "'+ tcTime + '",' +
              '"endTime" : "'+ endTime + '"' +
              '},';
          }else {
            console.log(4);
            item='';
            // break;
          }
          teacherDateList+=item;
        // }
      }
    });
    // console.log('[' + teacherDateList.substring(0,teacherDateList.length -1 ) + ']');
    saveFree(teacherDateList);
    function saveFree(teacherDateList){
      $.ajax({
        type:'post',
        url:API_BASE_URL + '/leadsCourse/batchScheduleCourse',
        dataType:'json',
        timeout:3000,
        beforeSend:function () {
          $(".save").attr('disabled','true');

        },
        data:{
          token:localStorage.getItem("token"),
          // teacherUuid:GetQueryString('teacherUuid'),
          // startDate: startDate,
          // endDate: endDate,
          courseList:'[' + teacherDateList.substring(0,teacherDateList.length -1 ) + ']',
        },
        complete:function () {
          console.log(1);
          location.reload();
        },
        success:function (res) {
          window.parent.postMessage({msg:res.msg}, '*');
        },
        error:function () {
          window.parent.postMessage({msg:"网络延迟，请稍后再试",type:"error"}, '*')
        }
      })
    }
  });


});
