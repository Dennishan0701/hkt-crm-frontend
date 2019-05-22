<template>
  <Modal
    v-model="modal"
    title="备注"
    :closable="false"
    :mask-closable="false"
    :loading = "loading"
    @on-ok="onOk('formValidate')"
    @on-cancel="onCancel('formValidate')"
  >
    <i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
      <Form-item label="邀约备注" prop="remark">
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
      return {
        loading: true,
        modal: false,
        teacherUuid: '',
        formItem: {
          remark: ''
        },
        ruleValidate: {
          remark: [
            {required: true, validator: validateRemark, trigger: 'blur'}
          ]
        },
      }
    },
    methods: {
      show(uuid) {
        this.teacherUuid = uuid;
        this.modal = true;
        const _this = this;
        common.ajax({
          url: ZHAO_TEACHER().WaitToOffer.getTeacherRemark,
          data: {
            teacherUuid: uuid,
          },
          success: function(response){
              _this.formItem.remark = response.data;
          }
        });
      },
      onOk(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            common.ajax({
              url: ZHAO_TEACHER().WaitToOffer.addTeacherRemark,
              data: {
                teacherUuid: _this.teacherUuid,
                remark: _this.formItem.remark
              },
              success: function(response){
                _this.modal = false;
                common.notices('操作成功！！');
                _this.$refs[name].resetFields();
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
      onCancel(name){
        this.$refs[name].resetFields();
      },
    }
  };
</script>

<style>

</style>
