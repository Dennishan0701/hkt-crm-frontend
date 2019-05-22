<template>
  <Modal
    title="排课"
    v-model="modal"
    :mask-closable="false"
    :closable="false"
    width="540"
    :loading = "loading"
    @on-ok="onOk('formValidate')"
    class-name="vertical-center-modal">
    <i-form ref="formValidate" :model="formItem" :rules="ruleValidateModel" :label-width="80">
      <Form-item label="老师姓名" prop="teacherName">
        <i-input v-model="formItem.teacherName" placeholder="老师姓名"></i-input>
      </Form-item>
      <Form-item label="老师手机号" prop="teacherPhone">
        <i-input v-model="formItem.teacherPhone" :maxlength="11" placeholder="11位手机号码"></i-input>
      </Form-item>
      <Form-item label="上课日期" prop="startDate">
        <Date-picker type="date" v-model="formItem.date" @on-change="formaterDate" placeholder="选择日期" style="width:200px"></Date-picker>
      </Form-item>
      <Form-item label="上课时间" prop="classTime">
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
  import {STUDY_COURSE} from 'common/api/studyCourse.js';
  import {common} from 'common/js/common.js';

  export default{
    data() {
      let validatePhone = (rule, value, callback) => {
        if ((this.formItem.teacherPhone == "") || !(/^1\d{10}$/.test(this.formItem.teacherPhone))) {
          callback(new Error('请正确填写老师手机号码'));
        } else {
          callback();
        }
      }
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
        formItem: {
          teacherName: '',
          teacherPhone: '',
          date: '',
          startTime: '',
          endTime: '',
        },
        ruleValidateModel: {
          teacherName: [
            {required: true, message: '请正确填写老师姓名', trigger: 'blur'}
          ],
          teacherPhone: [
            {required: true,  validator: validatePhone, trigger: 'blur'}
          ],
          startDate: [
            {required: true,  validator: validateStartDate, trigger: 'change'}
          ],
          classTime: [
            {required: true,  validator: validateClassTime, trigger: 'change'}
          ]
        },
        startTimeList: [],
        endTimeList: [],
        leadsUuid: '',
        payUuid: '',
        courserequestUuid: '',
        courseorderUuid: ''
      }
    },
    methods: {
      show(leadsUuid,courserequestUuid,courseorderUuid,payUuid) {
        this.leadsUuid = leadsUuid;
        this.courserequestUuid = courserequestUuid;
        this.courseorderUuid = courseorderUuid;
        this.payUuid = payUuid;
        this.modal = true;
        this.loadClassTime('start');
      },
      onOk(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            common.ajax({
              url: STUDY_COURSE().WaitCourse.createCourse,
              data: {
                courseOrderUuid: _this.courseorderUuid,
                leadsUuid: _this.leadsUuid,
                payUuid: _this.payUuid,
                courseDate: _this.formItem.date,
                startTime: _this.formItem.startTime,
                endTime: _this.formItem.endTime,
                teacherName: _this.formItem.teacherName,
                teacherPhone: _this.formItem.teacherPhone,
                courseType: 0,
                courseRequestUuid: _this.courserequestUuid
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
