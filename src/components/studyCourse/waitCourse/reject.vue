<template>
  <Modal
    v-model="modal"
    title="拒绝原因"
    :closable="false"
    :mask-closable="false"
    :loading = "loading"
    @on-ok="onOk('formValidate')">
    <i-form ref="formValidate" :model="formItem" :rules="ruleValidateModel">
      <Form-item prop="reject">
        <i-input type="textarea" v-model="formItem.reject" :rows="4" :maxlength="500" placeholder="不要超过500字"></i-input>
      </Form-item>
    </i-form>
  </Modal>
</template>

<script type="text/ecmascript-6">
  import {STUDY_COURSE} from 'common/api/studyCourse.js';
  import {common} from 'common/js/common.js';

  export default{
    data() {
      return {
        loading: true,
        modal: false,
        formItem: {
          reject: ''
        },
        ruleValidateModel: {
          reject: [
            {required: true, message: '请填写拒绝原因，不超过500字', trigger: 'blur'}
          ]
        },
        courseRequestUuid: ''
      }
    },
    methods: {
      show(courseRequestUuid) {
        this.courseRequestUuid = courseRequestUuid;
        this.modal = true;
      },
      onOk(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            common.ajax({
              url: STUDY_COURSE().WaitCourse.reject,
              data: {
                courseRequestUuid: _this.courseRequestUuid,
                giveUpCause: _this.formItem.reject
              },
              success: function (response) {
                common.notices('操作成功！！');
                _this.modal = false;
                _this.$emit('reFresh', 'success');
              }
            });
          } else {
            setTimeout(() => {
              this.loading = true;
            }, 0);
          }
        });
      }
    }
  };
</script>

<style>

</style>
