<template>
  <Modal
    title="批量排课"
    v-model="modal"
    :mask-closable="false"
    :closable="false"
    width="540"
    :loading = "loading"
    @on-ok="onOk('formValidate')"
    class-name="vertical-center-modal">
    <i-form ref="formValidate" :model="formItem" :rules="ruleValidateModel" :label-width="80">

      <Form-item label="开课日期" prop="startDate">
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

      <Form-item label="数量:" prop="num">
        <i-input v-model="formItem.num" style="width:200px" placeholder="数量"></i-input>
      </Form-item>
      <!--<Form-item label="剩余数量:">-->
        <!--{{unNum}}课时-->
      <!--</Form-item>-->
      <Form-item label="周期规律:">
        <Radio-group v-model="formItem.law">
          <Radio label='2'>每周规律</Radio>
          <Radio label='3'>每月规律</Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="每周规律:"  v-if='formItem.law == 2' prop="week">
        <Checkbox-group v-model="formItem.week">
          <Checkbox label="1">周一</Checkbox>
          <Checkbox label="2">周二</Checkbox>
          <Checkbox label="3">周三</Checkbox>
          <Checkbox label="4">周四</Checkbox>
          <Checkbox label="5">周五</Checkbox>
          <Checkbox label="6">周六</Checkbox>
          <Checkbox label="0">周日</Checkbox>
        </Checkbox-group>
      </Form-item>
      <!--<Form-item label="单双周规律:" prop="week">-->
        <!--<Checkbox-group v-model="formItem.week">-->
          <!--<Checkbox value="1">周一</Checkbox>-->
          <!--<Checkbox value="2">周二</Checkbox>-->
          <!--<Checkbox value="3">周三</Checkbox>-->
          <!--<Checkbox value="4">周四</Checkbox>-->
          <!--<Checkbox value="5">周五</Checkbox>-->
          <!--<Checkbox value="6">周六</Checkbox>-->
          <!--<Checkbox value="0">周日</Checkbox>-->
        <!--</Checkbox-group>-->
      <!--</Form-item>-->
      <Form-item label="每月规律:" v-if='formItem.law == 3'>
        <Radio-group v-model="formItem.month">
          <Radio label='1'>1</Radio>
          <Radio label="2">2</Radio>
          <Radio label="3">3</Radio>
          <Radio label="4">4</Radio>
          <Radio label="5">5</Radio>
          <Radio label="6">6</Radio>
          <Radio label="7">7</Radio>
          <Radio label="8">8</Radio>
          <Radio label="9">9</Radio>
          <Radio label="10">10</Radio>
          <Radio label="11">11</Radio>
          <Radio label="12">12</Radio>
          <Radio label="13">13</Radio>
          <Radio label="14">14</Radio>
          <Radio label="15">15</Radio>
          <Radio label="16">16</Radio>
          <Radio label="17">17</Radio>
          <Radio label="18">18</Radio>
          <Radio label="19">19</Radio>
          <Radio label="20">20</Radio>
          <Radio label="21">21</Radio>
          <Radio label="22">22</Radio>
          <Radio label="23">23</Radio>
          <Radio label="24">24</Radio>
          <Radio label="25">25</Radio>
          <Radio label="26">26</Radio>
          <Radio label="27">27</Radio>
          <Radio label="28">28</Radio>
          <Radio label="29">29</Radio>
          <Radio label="30">30</Radio>
          <Radio label="31">31</Radio>
        </Radio-group>
      </Form-item>
    </i-form>

  </Modal>
</template>

<script type="text/ecmascript-6">
  import {STUDY_COURSE} from 'common/api/studyCourse.js';
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
      let validateCheckAllGroup = (rule, value, callback) => {
        if (this.formItem.week.length == 0) {
          callback(new Error('请选择每周规律'));
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
          law: '',
          month: '',
          startTime: '',
          endTime: '',
          week: [],
          num: '',
        },
        ruleValidateModel: {
          num: [
            {required: true, message: '请输入课时数量', trigger: 'blur'}
          ],
          startDate: [
            {required: true,  validator: validateStartDate, trigger: 'change'}
          ],
          classTime: [
            {required: true,  validator: validateClassTime, trigger: 'change'}
          ],
          week: [
            {required: true,  validator: validateCheckAllGroup, trigger: 'change'}
          ]
        },
        startTimeList: [],
        endTimeList: [],
        crUuid:'',
        courseOrderUuid:'',
        teacherUuid:'',
        leadsUuid:'',
        courseRequestUuid:'',
        stuPhone:'',
        tcPhone:'',
        subject:'',
        teacherName:'',
        studentName:'',
      }
    },
    methods: {
      show(crUuid,courseOrderUuid,teacherUuid,leadsUuid,courseRequestUuid,stuPhone,tcPhone,subject,teacherName,studentName) {
        this.crUuid = crUuid;
        this.courseOrderUuid = courseOrderUuid;
        this.teacherUuid = teacherUuid;
        this.leadsUuid = leadsUuid;
        this.courseRequestUuid = courseRequestUuid;
        this.stuPhone = stuPhone;
        this.tcPhone = tcPhone;
        this.subject = subject;
        this.teacherName = teacherName;
        this.studentName = studentName;
        this.modal = true;
        this.loadClassTime('start');
      },
      onOk(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            console.log(_this.formItem.week);
            common.ajax({
              url: STUDY_COURSE().formalClass.formalCourse,
              data: {
                week: _this.formItem.week.toString(),
                type: _this.formItem.law,
                month: _this.formItem.month.toString(),
                courseStartDate: _this.formItem.date,
                crUuid: _this.crUuid,
                courseStartTime: _this.formItem.startTime,
                courseEndTime: _this.formItem.endTime,
                num: _this.formItem.num,
                courseOrderUuid: _this.courseOrderUuid,
                teacherUuid: _this.teacherUuid,
                leadsUuid: _this.leadsUuid,
                courseRequestUuid: _this.courseRequestUuid,
                stuPhone: _this.stuPhone,
                tcPhone: _this.tcPhone,
                subject: _this.subject,
                teacherName: _this.teacherName,
                studentName: _this.studentName,
              },
              success: function (res) {
                _this.modal = false;
                common.notices('操作成功！');
                _this.$emit('reFresh', 'add.success');
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
