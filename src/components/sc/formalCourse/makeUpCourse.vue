<template>
  <Modal
    v-model="modal"
    title="开课"
    :closable="false"
    @on-ok="ok">
    <div style="color:red;text-align:center;">{{tipMsg}}</div>
    <table class="o-table">
      <tr>
        <th width="90">课程类型</th>
        <td>正式课</td>
      </tr>
      <tr>
        <th class="required">课程时长</th>
        <td>
          <i-select @on-change="isLegalCourseDate" v-model="classLengthValue" style="width:80px">
            <i-option value="1">1</i-option>
            <i-option value="1.5">1.5</i-option>
            <i-option value="2">2</i-option>
            <i-option value="2.5">2.5</i-option>
            <i-option value="3">3</i-option>
            <i-option value="3.5">3.5</i-option>
            <i-option value="4">4</i-option>
            <i-option value="4.5">4.5</i-option>
            <i-option value="5">5</i-option>
          </i-select>
          小时
        </td>
      </tr>
      <tr>
        <th class="required">上课日期</th>
        <td>
          <date-picker type="date" placement="bottom-start" :options="options3" :value="dateTime" @on-change="changeStartDate" placeholder="选择日期" style="width: 200px"></date-picker>
        </td>
      </tr>
      <tr>
        <th class="required">上课时间</th>
        <td>
          <i-select v-model="startTime" @on-change="changeStartTime" style="width:87px">
            <i-option v-for="(item,index) in startTimeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
          &nbsp;至&nbsp;
          <i-select @on-change="isLegalCourseDate" v-model="endTime" style="width:87px">
            <i-option v-for="(item,index) in endTimeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
        </td>
      </tr>
    </table>
  </Modal>
</template>

<script type="text/ecmascript-6">
  import {SCS} from 'common/api/scs.js';
  import {common,computedEndTime} from 'common/js/common.js';
  export default{
    data() {
      return {
        modal: false,
//        classLengthValue: '',   //课程时长
//        startTimeList: [],
//        endTimeList: [],
//        startTime: '',               //开始时间
//        endTime: '',
//        courseorderUuid: '',      //课程订单uuid
//        leadsUuid: '',
//        payUuid: '',
//        courseRequestUuid: '',
//        teacherUuid: '',

        options3: {
          disabledDate (date) {
            return date && date.valueOf() < Date.now() - 86400000;
          }
        },
        startTimeList: [],
        endTimeList: [],
        classLengthValue: '',   //课程时长
        dateTime: '',   //上课日期
        startTime: '',               //开始时间
        endTime: '',
        courseOrderUuid:'',
        courseRequestUuid:'',
        teacherUuid:'',
        leadsUuid:'',
        tipMsg: '',
      }
    },
    mounted(){
      let that = this
      $.getJSON("static/data.json", function (json) {
        var list = json.courseRangTimes30;
        list = list.slice(0, list.length - 2);
        that.timeList = list;
      });
    },
    methods: {
      show(courseOrderUuid,courseRequestUuid,teacherUuid,leadsUuid) {
        this.courseOrderUuid = courseOrderUuid
        this.courseRequestUuid = courseRequestUuid
        this.teacherUuid = teacherUuid
        this.leadsUuid = leadsUuid
        this.modal = true;
        this.loadClassTime('start');
      },
      //检测当前排课是否通过
      isLegalCourseDate(index){
        const _this = this;
        let stringData = _this.classLengthValue+','+_this.dateTime+','+_this.startTime+','+_this.endTime+';'
        if(!_this.classLengthValue || !_this.dateTime || !_this.startTime || !_this.endTime){
          _this.$Message.info("请填入全部信息");
          return false
        }else {
          console.log(stringData);
          common.ajax({
            url: SCS().FormalCourse.isLegalCourseDate,
            data: {
              teacherUuid: this.teacherUuid,
              courseDates:stringData
            },
            success: function (response) {
              _this.$Message.info(response.msg);
            },
            successError:function (response) {
              _this.$Message.error(response.msg);
            }
          });
        }


      },
      ok() {
        const that = this;
        let stringData = that.classLengthValue+','+that.dateTime+','+that.startTime+','+that.endTime+';'
        console.log(stringData);
        common.ajax({
          url: SCS().FormalCourse.isLegalCourseDate,
          data: {
            teacherUuid: this.teacherUuid,
            courseDates:stringData
          },
          success: function (response) {
            common.ajax({
              url: SCS().FormalCourse.batchCreateFormalCourse,
              data: {
                courseOrderUuid: that.courseOrderUuid,
                courseRequestUuid: that.courseRequestUuid,
                teacherUuid: that.teacherUuid,
                leadsUuid: that.leadsUuid,
                courseDates:stringData
              },
              success: function (response) {
                common.notices('操作成功！！');
                that.reset();
                that.$emit('reFresh', 'success');
              }
            });
          },
          successError:function (response) {
            that.$Message.error(response.msg);
          }
        });





//        let length = this.classLengthValue;
//        let coursedate = this.startDate || '';
//        let starttime = this.startTime;
//        let endtime = this.endTime;
//        let tipMsg = this.tipMsg;
//
//        if (length == "" || coursedate == "" || starttime == "" || (endtime == "" || endtime > '24:00' )) {
//          common.msg('请填写完整必填项！');
//          return false;
//        } else {
//          const that = this;
//          common.ajax({
//            url: SCS().WaitFirstCourse.MakeUpLessons,
//            data: {
//              courseOrderUuid: this.courseorderUuid,
//              courseRequestUuid: this.courseRequestUuid,
//              teacherUuid: this.teacherUuid,
//              payUuid: this.payUuid,
//              length: length,
//              courseType: 1,
//              courseDate: coursedate,
//              startTime: starttime,
//              endTime: endtime,
//              leadsUuid: this.leadsUuid
//            },
//            success: function (response) {
//              common.notices('操作成功！！');
//              that.reset();
//            }
//          });
//        }
      },
      changeStartTime(value) {
        this.loadClassTime('end', value);
        this.isLegalCourseDate();
      },
      loadClassTime(type, range) {
        let that = this;
        //上课时间开始时间7-23
        if (type === 'start') {
          $.getJSON("static/data.json", function (json) {
            var list = json.courseRangTimes30;
            list = list.slice(0, list.length - 2);
            that.startTimeList = list;
          });
        }
        //结束时间8-24
        if (type === 'end') {
          range = range || '';
          that.endTimeList = [];
          $.getJSON("static/data.json", function (json) {
            json.courseRangTimes30.forEach((item, index) => {
              if (item.value > range) {
                that.endTimeList.push(item);
              }
            });
          });
        }
      },
      reset() {
        this.classLengthValue = '';
        this.dataTime = '';
        this.startTime = '';
        this.endTime = '';
      },
      changeStartDate(value) {
        this.dateTime = value;
        this.isLegalCourseDate();
      },
    }
  };
</script>

<style>

</style>
