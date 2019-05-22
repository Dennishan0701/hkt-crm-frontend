$(function() {




     $('#calendar').fullCalendar({
       themeSystem: 'bootstrap3',
       defaultView:'agendaWeek',
       editable: true,
       aspectRatio: 1.8,
       scrollTime: '00:00',
       firstDay:1,
       timeFormat: 'H:mm',
       slotLabelFormat:'H:mm',
       defaultTimedEventDuration:'01:00:00',
       slotDuration:'01:00:00',
       locale:'zh-cn',
       allDaySlot:false,
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
           type:'post',
           url: API_BASE_URL + '/wechat/tcTeacher/getTeacherDate',
           dataType:'json',
           timeout:3000,
           data:{
             token:localStorage.getItem("token"),
             teacherUuid:GetQueryString('uuid'),
             tcDateStart: tcDateStart,
             tcDateEnd: tcDateEnd,
           },
           success:function (res) {
             var arr = new Array(); //数据列表
             res.data.forEach(function(v,i){
               var item = {
                 start: v.tcDate + 'T' + v.tcTime,
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
         var start = date.format().substring(0,16);
         var item = {
           title:'',
           start: start,
         };
         $('#calendar').fullCalendar('renderEvent',item);

       },
       eventClick: function (calEvent, jsEvent, view) {
         var _id = calEvent._id;
         $('#calendar').fullCalendar('removeEvents',_id);
       },
       eventAllow: function(dropLocation, draggedEvent) {
         if(dropLocation.start.day() < dropLocation.end.day()){
           if(dropLocation.end.hour()==0 && dropLocation.end.minute()==0 && dropLocation.end.day() - dropLocation.start.day() == 1){
             return true;
           }else{
             return false;
           }
         } else {
           return true;
         }
       },
       // eventMouseover: function (event, jsEvent, view) {
       //   var deleteBtn = '<span class=deleteBtn>x</span>';
       //   $(this).append(deleteBtn);
       // },
       // eventMouseout: function (event, jsEvent, view) {
       //   $(this).find('.deleteBtn').remove();
       // },
     });

  $(".save").on('click',function () {
    var teacherDateList = '', //保存空闲时间
        view = $('#calendar').fullCalendar('getView'),
        startDate = view.start.format(),
        endDate = view.end.format(),

        data = $('#calendar').fullCalendar('clientEvents'),
        tcTime,item,tcStartDate,tcEndMinute,tcStartMinute,
        totalMinute,count,tcHour,tcMinute;
    console.log(data);
    data.forEach(function(v,i){
      tcStartDate = v.start.format('YYYY-MM-DD');
      console.log(new Date(moment().format('YYYY-MM-DD')));
      console.log(new Date(tcStartDate));


      if ( v.end === null ) {
        tcTime = v.start.format('HH:mm');
        if(new Date(moment().format('YYYY-MM-DD')) < new Date(tcStartDate)){
          console.log(1);
          item = '{'+
            '"teacherUuid" :' + GetQueryString('uuid') + ','+
            '"tcDate" : "'+ tcStartDate +'",'+
            '"tcTime" : "'+ tcTime + '"' +
            '},';
        }else {
          console.log(2);
          item = '';
        }
        teacherDateList+=item;
      } else {
        tcStartMinute = v.start._i[3] * 60 + v.start._i[4];
        tcEndMinute = v.end._i[3] * 60 + v.end._i[4];
        if(tcEndMinute == 0) tcEndMinute = 1440;
        totalMinute =  tcEndMinute - tcStartMinute;
        count = totalMinute/60;
        for ( var i = 0; i < count; i++ ) {

          if(new Date(moment().format('YYYY-MM-DD')) < new Date(tcStartDate)){
            console.log(3);
            tcHour = parseInt(tcStartMinute/60)<10?'0' + parseInt(tcStartMinute/60):parseInt(tcStartMinute/60);
            tcMinute = tcStartMinute%60==30? tcStartMinute%60 : '00';
            tcTime = tcHour + ':' + tcMinute;
            tcStartMinute+=60;
            item = '{'+
              '"teacherUuid" :'+ GetQueryString('uuid') +','+
              '"tcDate" : "'+ tcStartDate +'",'+
              '"tcTime" : "'+ tcTime + '"' +
              '},';
          }else {
            console.log(4);
            break;
          }
          teacherDateList+=item;
        }
      }
    });

    console.log('[' + teacherDateList.substring(0,teacherDateList.length -1 ) + ']');
    saveFree(teacherDateList);
    function saveFree(teacherDateList){
      $.ajax({
        type:'post',
        url:API_BASE_URL + '/teacherTime/updateTeacherTime',
        dataType:'json',
        timeout:3000,
        data:{
          token:localStorage.getItem("token"),
          teacherUuid:GetQueryString('uuid'),
          startDate: startDate,
          endDate: endDate,
          teacherDateList:'[' + teacherDateList.substring(0,teacherDateList.length -1 ) + ']',
        },
        success:function (res) {

        },
        error:function () {
          alert('网络延迟，请稍后再试');
        }
      })
    }
  });

});
