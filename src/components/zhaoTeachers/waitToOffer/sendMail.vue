<template>
  <Modal
    v-model="modal"
    title="发送邮件"
    :closable="false"
    :mask-closable="false"
    :loading = "loading"
    @on-ok="onOk('formValidate')"
    @on-cancel="onCancel('formValidate')"
  >
    <i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
      <Form-item label="老师姓名">
        {{formItem.tcName}}
      </Form-item>
      <Form-item label="邮件标题" prop="title">
        <i-input v-model="formItem.title" :rows="4" placeholder="邮件标题" style="width: 200px;"></i-input>
      </Form-item>
      <Form-item label="邮件内容" prop="content">
        <i-input type="textarea" v-model="formItem.content" :rows="4" placeholder="邮件内容"></i-input>
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
          callback(new Error('不能为空，填写内容'));
        } else {
          callback();
        }
      };
      return {
        loading: true,
        modal: false,
        formItem: {
          teacherUuid: '',
          tcName: '',
          title: '',
          content: '',
        },
        ruleValidate: {
          title: [
            {required: true,message: '请填写邮件标题', trigger: 'blur'}
          ],
          content: [
            {required: true, validator: validateRemark, trigger: 'blur'}
          ]
        },
      }
    },
    methods: {
      show(uuid,name) {
        this.formItem.teacherUuid = uuid;
        this.formItem.tcName = name;
        this.modal = true;
      },
      onOk(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            common.ajax({
              url: ZHAO_TEACHER().WaitToOffer.sendMail,
              data: {
                teacherUuid: _this.formItem.teacherUuid,
                tcName: _this.formItem.tcName,
                title: _this.formItem.title,
                content: _this.formItem.content,
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
