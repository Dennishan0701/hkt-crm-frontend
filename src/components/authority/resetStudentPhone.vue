<template>
  <div class="resetStudentPhone">
    <o-breadcrumb second="权限管理" third="正式生修改手机号"></o-breadcrumb>
    <div class="grid-widget">
      <i-form :model="formPhone" label-position="left" :rules="ruleValidate" ref='formValidate' :label-width="60">
        <Form-item label="原手机号" prop="oldPhone">
          <i-input v-model="formPhone.oldPhone" style="width: 300px"></i-input>
        </Form-item>
        <Form-item label="新手机号" prop="newPhone">
          <i-input v-model="formPhone.newPhone" style="width: 300px"></i-input>
        </Form-item>
        <i-button type="primary" @click="handleSubmit('formValidate')" style="margin-left: 60px;">提交</i-button>
      </i-form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {AUTHORITY} from 'common/api/authority.js';
  import {formateDate,common} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';

  export default{
    data() {
      let reg = /^1[0-9]{10}$/;
      const validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入原手机号'));
        }else if(!reg.test(value)){
          callback(new Error('请输入正确的手机号'));
        } else if (value.length !== 11 ) {
          callback(new Error('请输入11位的手机号'));
        } else {
          callback();
        }
      };
      const validateNewPhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新手机号'));
        }else if(!reg.test(value)){
          callback(new Error('请输入正确的手机号'));
        }else if (value.length !== 11 ) {
          callback(new Error('请输入11位的手机号'));
        } else {
          callback();
        }
      };
      return {
        formPhone: {
          oldPhone: '',
          newPhone: ''
        },
        ruleValidate: {
          oldPhone: [
            { validator: validatePhone, trigger: 'blur' },
          ],
          newPhone: [
            { validator: validateNewPhone, trigger: 'blur' },
          ],
        }
      }
    },
    mounted() {

    },
    methods: {
      handleSubmit (name) {
        const _this = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            // common.ajax({
            //   url: AUTHORITY().ResetInfo.resetStudentPhone,
            //   method: 'get',
            //   data: {
            //     beforePhone: _this.formPhone.oldPhone,
            //     phone:_this.formPhone.newPhone,
            //   },
            //   success: function(response){
            //     common.notices('操作成功！');
            //   }
            // });
            this.$axios.get(AUTHORITY().ResetInfo.resetStudentPhone,{
              params:{
                beforePhone: _this.formPhone.oldPhone,
                phone:_this.formPhone.newPhone,
              }
            }).then( () => {
              common.notices('操作成功！');
            })
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
    },
    computed: {

    },
    components: { OBreadcrumb }
  };
</script>

<style>

</style>
