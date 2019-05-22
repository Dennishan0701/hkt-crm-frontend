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
          <i-select v-model="classLengthValue" style="width:80px">
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
          <date-picker type="date" placement="bottom-start" v-model="startDate" @on-change="changeStartDate" placeholder="选择日期" style="width: 200px"></date-picker>
        </td>
      </tr>
      <tr>
        <th class="required">上课时间</th>
        <td>
          <i-select v-model="startTime" @on-change="changeStartTime" style="width:87px">
            <i-option v-for="(item,index) in startTimeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
          &nbsp;至&nbsp;
          <i-select v-model="endTime" style="width:87px">
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
        classLengthValue: '',   //课程时长
        startTimeList: [],
        endTimeList: [],
        startTime: '',               //开始时间
        startDate: '',               //开始日期
        courseorderUuid: '',      //课程订单uuid
        leadsUuid: '',
        payUuid: '',
        courseRequestUuid: '',
        tipMsg: '',
        teacherUuid: ''
      }
    },
    computed: {
      endTime() {
        let val = computedEndTime(this.classLengthValue, this.startTime);
        (val > '24:00') ? this.tipMsg = '无语！动点脑子好不？上课时长+开始时间超过24点了。。' : this.tipMsg = '';
        if (this.endTimeList.length > 0) return val;
      }
    },
    methods: {
      show(leadsUuid, courseorderUuid, payUuid, courseRequestUuid,teacherUuid) {
        this.courseorderUuid = courseorderUuid;
        this.leadsUuid = leadsUuid;
        this.payUuid = payUuid;
        this.courseRequestUuid = courseRequestUuid;
        this.teacherUuid = teacherUuid;
        this.modal = true;
        this.loadClassTime('start');
      },
      ok() {
        let length = this.classLengthValue;
        let coursedate = this.startDate || '';
        let starttime = this.startTime;
        let endtime = this.endTime;
        let tipMsg = this.tipMsg;

        if (length == "" || coursedate == "" || starttime == "" || (endtime == "" || endtime > '24:00' )) {
          common.msg('请填写完整必填项！');
          return false;
        } else {
          const that = this;
          common.ajax({
            url: SCS().WaitFirstCourse.createCourse,
            data: {
              courseOrderUuid: that.courseorderUuid,
//              courseRequestUuid: that.courseRequestUuid,
              payUuid: that.payUuid,
              length: length,
              courseType: 1,
              courseDate: coursedate,
              startTime: starttime,
              endTime: endtime,
              teacherUuid: that.teacherUuid,
              leadsUuid: that.leadsUuid
            },
            success: function (response) {
              common.notices('操作成功！！');
              that.reset();
              _this.$emit('reFresh', 'success');
            }
          });
        }
      },
      changeStartTime(value) {
        this.loadClassTime('end', value);
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
        this.startDate = '';
        this.startTime = '';
        this.endTime = '';
      },
      changeStartDate(value) {
        this.startDate = value;
      },
    }
  };
</script>

<style>

</style>
