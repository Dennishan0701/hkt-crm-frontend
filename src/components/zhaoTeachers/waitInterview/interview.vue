<template>
  <Modal
    v-model="modal"
    title="面试"
    :closable="false"
    :mask-closable="false"
    :loading = "loading"
    @on-ok="onOk('formValidate')">
    <i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
      <Form-item label="姓名">
        {{tcName}}
      </Form-item>
      <Form-item label="手机号">
        {{phone}}
      </Form-item>
      <Form-item label="面试结果" prop="interviewResult">
        <i-select v-model="formItem.interviewResult" placeholder="面试结果" style="width:200px">
          <i-option value="1">面试通过</i-option>
          <i-option value="2">面试未通过</i-option>
          <i-option value="3">需要二次面试</i-option>
        </i-select>
      </Form-item>
      <Form-item label="等级" prop="level" v-show="formItem.interviewResult == 1">
        <i-select v-model="formItem.level" placeholder="薪资等级" style="width:200px">
          <i-option v-for="(item,index) in salaryLevalList" :key='index' :value="item.id">{{item.grade}}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="培训日期" prop="trainingDate" v-show="formItem.interviewResult == 1">
        <Date-picker type="date" placeholder="培训日期" @on-change="changeTrainingDate" style="width: 200px"></Date-picker> {{trainingDatetime}}
      </Form-item>
      <Form-item label="培训帐号" prop="trainingAccount" v-show="formItem.interviewResult == 1">
        <span class="c-blue">{{formItem.trainingAccount}}</span> <span class="c-red">{{errorTip}}</span>
      </Form-item>
      <Form-item label="面试备注" prop="remark">
        <i-input type="textarea" v-model="formItem.remark" :rows="4" :maxlength="500" placeholder="不要超过500字"></i-input>
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
      let validateLevel = (rule, value, callback) => {
        if(this.formItem.interviewResult == 1 && value === "") {
          callback(new Error('不能为空，请选择'));
        } else {
          callback();
        }
      };
      let validateRemark = (rule, value, callback) => {
        if(value === "") {
          callback(new Error('不能为空，请选择'));
        } else {
          callback();
        }
      };
      let validateTrainingDate = (rule, value, callback) => {
      	if(this.formItem.interviewResult == 1 && value === '') {
          callback(new Error('不能为空，请选择'));
        } else {
          callback();
        }
      };
      return {
        loading: true,
        modal: false,
        teacherUuid: '',
        tcName: '',
        phone: '',
        trainingDatetime: '14:00',
        errorTip: '',
        formItem: {
          interviewResult: '',
          level: '',
          trainingDate: '',
          trainingAccount: '00',
          remark: ''
        },
        ruleValidate: {
          interviewResult: [
            {required: true, message: '请选择内容', trigger: 'change'}
          ],
          level: [
            {required: true, validator: validateLevel, trigger: 'change'}
          ],
          trainingDate: [
            {required: true, validator: validateTrainingDate, trigger: 'change'}
          ],
          remark: [
            {required: true, validator: validateRemark, trigger: 'blur'}
          ]
        },
        salaryLevalList: []
      }
    },
    methods: {
      show(uuid,tcName,phone) {
        this.teacherUuid = uuid;
        this.tcName = tcName;
        this.phone = phone;
        this.modal = true;
        this.$refs.formValidate.resetFields();
        const _this = this;
        common.ajax({
          url: COMMON_API().getAllPayGrade,
          method: 'get',
          data: {natureOfWork: 2},
          success:function(res){
            _this.salaryLevalList = res.data || [];
          }
        });
      },
      onOk(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            common.ajax({
              url: ZHAO_TEACHER().WaitInterview.interview,
              data: {
                interviewResult: _this.formItem.interviewResult,
                teacherUuid: _this.teacherUuid,
                payGrade: _this.formItem.level,
                trainingDate: _this.formItem.trainingDate,
                trainingAccount: _this.formItem.trainingAccount,
                remark: _this.formItem.remark
              },
              success: function(response){
                _this.modal = false;
                common.notices('操作成功！！');
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
      changeTrainingDate(value) {
        this.formItem.trainingDate = value;
        const _this = this;
        common.ajax({
          url: ZHAO_TEACHER().WaitInterview.getAccoutByDate,
          method: 'get',
          data: { trainingDate: value},
          success:function(res){
            let data = res.data;
            if(data.flag === 'success') {
              _this.formItem.trainingAccount = res.data.account;
            }else{
              _this.errorTip = data.msg;
            }
          }
        });
      }
    }
  };
</script>

<style>

</style>
