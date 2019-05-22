<template>
  <Modal
    title="课程调整"
    v-model="modal"
    :mask-closable="false"
    :closable="false"
    width="540"
    :loading = "loading"
    @on-ok="onOk('formValidate')"
    class-name="vertical-center-modal">
    <i-form ref="formValidate" :model="formItem" :rules="ruleValidateModel" :label-width="80">

      <Form-item label="上课日期" prop="startDate">
        <Date-picker type="date" v-model="formItem.date" @on-change="formaterDate" placeholder="选择日期" style="width:200px"></Date-picker>
      </Form-item>

      <Form-item label="开始时间" prop="classTime">
        <i-select v-model="formItem.startTime" @on-change="changeStartTime" style="width:87px">
          <i-option v-for="(item,index) in startTimeList" :key='index' :value="item.value">{{ item.value }}</i-option>
        </i-select>
        &nbsp;至&nbsp;
        <i-select v-model="formItem.endTime" style="width:87px">
          <i-option v-for="(item,index) in endTimeList" :key='index' :value="item.value">{{ item.value }}</i-option>
        </i-select>
      </Form-item>

    </i-form>

  </Modal>
</template>

<script type="text/ecmascript-6">
  import {Course_Cast} from 'common/api/teacher.js';
  import {common} from 'common/js/common.js';

  export default{
    data() {
      let validateClassTime = (rule, value, callback) => {
        if (this.formItem.startTime == "" || this.formItem.endTime == "") {
          callback(new Error('请填写上课开始时间和结束时间'));
        } else {
          callback();
        }
      }
      let validateStartDate = (rule, value, callback) => {
        if (this.formItem.date == "") {
          callback(new Error('请填写上课日期'));
        } else {
          callback();
        }
      }
      return {
        loading: true,
        modal: false,
        unNum: 0,
        formItem: {
          date: '',
          startTime: '',
          endTime: '',
        },
        ruleValidateModel: {
          startDate: [
            {required: true,  validator: validateStartDate, trigger: 'change'}
          ],
          classTime: [
            {required: true,  validator: validateClassTime, trigger: 'change'}
          ]
        },
        startTimeList: [],
        endTimeList: [],
        courseUuid:'',
        courseOrderUuid:'',
        courseRequestUuid:'',
        payUuid:'',
        courseType:'',
        saleUserUuid:'',
        teacherUuid:'',
        leadsUuid:'',
      }
    },
    methods: {
      show(courseUuid,courseOrderUuid,courseRequestUuid,payUuid,courseType,saleUserUuid,teacherUuid,leadsUuid) {
        this.courseUuid = courseUuid;
        this.courseOrderUuid = courseOrderUuid;
        this.courseRequestUuid = courseRequestUuid;
        this.payUuid = payUuid;
        this.courseType = courseType;
        this.saleUserUuid = saleUserUuid;
        this.teacherUuid = teacherUuid;
        this.leadsUuid = leadsUuid;
        this.modal = true;
        this.loadClassTime('start');
      },
      onOk(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            common.ajax({
              url: Course_Cast().courseRevise.createCourse,
              data: {
                courseDate: _this.formItem.date,
                startTime: _this.formItem.startTime,
                endTime: _this.formItem.endTime,
                uuid: _this.courseUuid,
                courseOrderUuid: _this.courseOrderUuid,
                courseRequestUuid: _this.courseRequestUuid,
                payUuid: _this.payUuid,
                courseType: _this.courseType,
                saleUserUuid: _this.saleUserUuid,
                teacherUuid: _this.teacherUuid,
                leadsUuid: _this.leadsUuid,
              },
              success: function (res) {
                _this.modal = false;
                common.notices('操作成功！');
                _this.$emit('reFresh', 'success');
              }
            });
          } else {
            setTimeout(() => {
              this.loading = true;
            }, 0);
          }
        });
      },

      changeStartTime(value) {
        this.loadClassTime('end', value);
      },



      loadClassTime(type, range) {
        let _this = this;
        //上课时间开始时间7-23
        if (type === 'start') {
          $.getJSON("static/data.json", function (json) {
            var list = json.courseRangTimes30;
            list = list.slice(0, list.length - 2);
            _this.startTimeList = list;
          });
        }
        //结束时间8-24
        if (type === 'end') {
          range = range || '';
          _this.endTimeList = [];
          $.getJSON("static/data.json", function (json) {
            json.courseRangTimes30.forEach((item, index) => {
              if (item.value > range) {
                _this.endTimeList.push(item);
              }
            });
          });
        }
      },
      formaterDate(value) {
        this.formItem.date = value;
      }
    }
  };
</script>

<style>

</style>
