<template>
  <Modal
    title="新增招师代理级别"
    v-model="channelModal"
    :mask-closable="false"
    :closable="false"
    :loading = "loading"
    @on-ok="onOk('formValidate')"
    class-name="vertical-center-modal">
    <i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
      <Form-item label="级别：" prop="grade">
        <i-input v-model="formItem.grade" placeholder="薪资级别"></i-input>
      </Form-item>
      <Form-item label="薪资：" prop="salary">
        <i-input v-model="formItem.salary" placeholder="元/人"></i-input>
      </Form-item>
      <Form-item label="指标：" prop="task">
        <i-input v-model="formItem.task" placeholder="人/月"></i-input>
      </Form-item>
      <Form-item label="描述：" prop="desc">
        <i-input type="textarea" v-model="formItem.desc" :rows="4" :maxlength="500" placeholder="500字以内"></i-input>
      </Form-item>
    </i-form>
  </Modal>
</template>

<script type="text/ecmascript-6">
  import {AGENT_TEACHER} from 'common/api/teacher.js';
  import {common} from 'common/js/common.js';
  export default{
    data() {
      const validate = (rule, value, callback) => {
      if (isNaN(value) || !value ||!/^\d+$/.test(value)) {
        return callback(new Error('请输入整数数字'));
      }else {
        callback();
      }
    };
      return {
        channelModal: false,
        loading: true,
        formItem: {
          grade: '',
          salary: '',
          task: '',
          desc: ''
        },
        typeList: [],
        ruleValidate: {
          grade: [
            {required: true, message: '不能为空',  trigger: 'blur'},
          ],
          salary: [
            {required: true,validator: validate,  trigger: 'blur'},
          ],
          task: [
            {required: true, validator: validate, trigger: 'blur' },
          ],
        }
      }
    },
    methods: {
      show() {
        this.channelModal = true;
      },
      onOk(name) {
        this.loading = false;
        const _this = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            common.ajax({
              url: AGENT_TEACHER().addAgentGrade,
              data: {
                grade: _this.formItem.grade,
                salary: _this.formItem.salary,
                task: _this.formItem.task,
                lpPage: _this.formItem.lpPage,
                gradeStatus: _this.gradeStatus,
                description: _this.formItem.desc
              },
              success: function (response) {
                  _this.channelModal = false;
                  common.notices('操作成功！！');
                _this.$emit('reFresh', 'add.success');
              },
              successError:function (response) {
                common.notices(response.data,"提示","warning");
              },
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
