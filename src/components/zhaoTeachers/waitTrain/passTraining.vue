<template>
  <Modal
    v-model="modal"
    title="培训"
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
      <Form-item label="培训结果" prop="interviewResult">
        <i-select v-model="formItem.interviewResult" placeholder="培训结果" style="width:200px">
          <i-option value="1">培训通过</i-option>
          <i-option value="2">培训未通过</i-option>
        </i-select>
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
          remark: ''
        },
        ruleValidate: {
          interviewResult: [
            {required: true, message: '请选择内容', trigger: 'change'}
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
      },
      onOk(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            common.ajax({
              url: ZHAO_TEACHER().WaitTrain.training,
              data: {
                interviewResult: _this.formItem.interviewResult,
                teacherUuid: _this.teacherUuid,
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
    }
  };
</script>

<style>

</style>
