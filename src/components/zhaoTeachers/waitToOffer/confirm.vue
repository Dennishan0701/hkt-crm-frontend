<template>
  <Modal
    v-model="modal"
    title="收到视频并安排面试"
    :closable="false"
    :mask-closable="false"
    :loading="loading"
    @on-ok="onOk('formValidate')"
    @on-cancel="onCancel('formValidate')"
  >
    <i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
      <Form-item label="姓名" prop="phone">
        {{name}}
      </Form-item>
      <Form-item label="安排面试">
        <Radio-group v-model="formItem.isInterview" @on-change="radioChange" type="button">
          <Radio label="true">安排</Radio>
          <Radio label="false">不安排</Radio>
        </Radio-group>
      </Form-item>

      <Form-item label="面试日期" prop="interviewDate">
        <Date-picker type="date" @on-change="changeDate" :disabled="formItem.isDisabled"  :options="options3"  placeholder="选择日期" style="width: 200px"></Date-picker>
      </Form-item>
      <Form-item label="面试时间" prop="interviewTime">
        <i-select placeholder="面试时间" :disabled="formItem.isDisabled" v-model="formItem.interviewTime" @on-change="getInterviewUser" style="width:200px">
          <i-option v-for="(item,index) in timeList" :key='index' :value="item.enumValue">{{item.enumName}}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="好视通账号" prop="interviewAccount">
        <i-select placeholder="好视通账号" :disabled="formItem.isDisabled" v-model="formItem.interviewAccount" clearable style="width:200px">
          <i-option v-for="(item,index) in interviewAccountList" :key='index' :value="item">{{item}}</i-option>
        </i-select>
      </Form-item>
    </i-form>
  </Modal>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {ZHAO_TEACHER} from 'common/api/teacher.js';
  import {common} from 'common/js/common.js';

  export default{
    data() {
      return {
        loading: true,
        modal: false,
        teacherUuid: '',
        uuid: '',
        name: '',
        timeList: [],
        interviewAccountList: [],
        options3: {
          disabledDate (date) {
            return date && date.valueOf() < Date.now() - 86400000;
          }
        },
        formItem: {
          interviewAccount:'',
          interviewDate:'',
          interviewTime:'',
          isInterview:'true',
          isDisabled:false
        },
        ruleValidate: {
          interviewAccount: [
            {required: true, message: '请输入好视通账号', trigger: 'change'}
          ],
          interviewDate: [
            {required: true, message: '请选择日期', trigger: 'change'}
          ],
          interviewTime: [
            {required: true, message: '请选择面试时间', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      radioChange(value){
        value == "false"?this.formItem.isDisabled =true:this.formItem.isDisabled =false;
      },
      show(uuid,name) {
        let _this = this;
        _this.uuid = uuid;
        _this.name = name;
        common.ajax({
          url: ZHAO_TEACHER().WaitToOffer.getInterviewTime,
          success: function (res) {
            _this.timeList = res.data;
          }
        });
        this.modal = true;
      },
      getInterviewUser(){
        const _this = this;
        common.ajax({
          url: ZHAO_TEACHER().WaitToOffer.getInterviewAccount,
          data: {
            interviewDate:_this.formItem.interviewDate,
            interviewTime:_this.formItem.interviewTime,
          },
          success: function (res) {
            _this.interviewAccountList = res.data;
          }
        });
      },
      onOk(name) {
        this.loading = false;
        const _this = this;
        this.$refs[name].validate((valid) => {
          console.log(_this.formItem.isInterview);
          if(_this.formItem.isInterview == "false"){
            _this.modal = false;
            console.log(1);
            common.ajax({
            url: ZHAO_TEACHER().WaitToOffer.addInterviewSchedule,
            data: {
              teacherUuid:_this.uuid,
              tcName:_this.name,
                isInterview:_this.formItem.isInterview,
//                interviewDate:_this.formItem.interviewDate,
//                interviewTime:_this.formItem.interviewTime,
//                interviewAccount:_this.formItem.interviewAccount,
            },
            success: function (response) {
              common.notices('操作成功！！');
              _this.formItem.interviewDate='';
              _this.formItem.interviewDate='';
              _this.formItem.isInterview='true';
              _this.formItem.isDisabled=false;
              _this.$refs[name].resetFields();
              _this.$emit('reFresh', 'success');
            }
          });
        }else if (valid) {
            _this.modal = false;
            common.ajax({
              url: ZHAO_TEACHER().WaitToOffer.addInterviewSchedule,
              data: {
                teacherUuid:_this.uuid,
                tcName:_this.name,
                isInterview:_this.formItem.isInterview,
                interviewDate:_this.formItem.interviewDate,
                interviewTime:_this.formItem.interviewTime,
                interviewAccount:_this.formItem.interviewAccount,
              },
              success: function (response) {
                common.notices('操作成功！！');
                _this.formItem.interviewDate='';
                _this.formItem.interviewDate='';
                _this.formItem.isInterview='true';
                _this.formItem.isDisabled=false;
                _this.$refs[name].resetFields();
                _this.$emit('reFresh', 'success');
              }
            });
          }else {
            setTimeout(() => {
              this.loading = true;
            }, 0);
          }
        });
      },
      onCancel(name){
        this.$refs[name].resetFields();
        this.formItem.interviewDate='';
        this.formItem.isInterview='true';
        this.formItem.isDisabled=false;
      },
      changeDate(value) {
        this.formItem.interviewDate = value;
        this.getInterviewUser();
      },
      getUser(res){
        this.formItem.interviewUuid = res.value;
        this.formItem.interviewUser = res.label;
      }
    }
  };
</script>

<style>

</style>
