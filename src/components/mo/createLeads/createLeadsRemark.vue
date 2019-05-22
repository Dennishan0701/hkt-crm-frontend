<template>
<div>
  <o-breadcrumb second="市场与运营" third="新增Leads备注"></o-breadcrumb>
  <i-form ref='formValidate' :model="formValidate" :rules="ruleValidate" :label-width="100">、
    <Form-item label="手机号码" prop="phone">
      <i-input v-model="formValidate.phone" on-change="isExist" placeholder="请输入学生手机号码" style="width:200px"></i-input>
      <span style="color: red;margin-left: 10px;">{{tishi}}</span>
    </Form-item>
    <Form-item label="学生姓名" prop="name">
      <i-input v-model="formValidate.name" placeholder="请输入学生姓名" style="width:200px" readonly></i-input>
    </Form-item>
    <Form-item label="备注" prop="desc">
      <i-input type="textarea" v-model="formValidate.desc" :rows="4" placeholder="请输入备注" style="width:400px"></i-input>
    </Form-item>
    <Form-item>
      <i-button type="primary" @click="handleSubmit('formValidate')">提交</i-button>
      <i-button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</i-button>
    </Form-item>
  </i-form>
</div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {MO} from 'common/api/mo.js';
  import {common} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';

  export default{
    data() {
      var validatePhone = (rule, value, callback) => {
        if (value === "") {
          callback(new Error('手机号码不能为空'));
        } else if (!(/^1\d{10}$/.test(value))) {
          callback(new Error('请填写合法的手机号码'));
        } else {
          this.isExist();
          callback();
        }
      }
      return {
        tishi:'',
        formValidate: {
          name: '',
          phone: '',
          desc: ''
        },
        subjectList: [],
        channelList: [],
        ruleValidate: {
          name: [
            {}
          ],
          phone: [
            {required: true, validator: validatePhone, trigger: 'blur' }
          ],
          desc: [
            { required: true,type: 'string', max: 500, message: '不能为空且不大于500字', trigger: 'change' }
          ]
        }
      }
    },
    mounted() {

    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            this.$axios.get( MO().createLeadsRemark.tmkNewLeadsRemark,{
              params:{
                phone : _this.formValidate.phone,
                content:_this.formValidate.desc
              },
            }).then( (res) => {
              common.notices(res.data.msg);
              this.handleReset(name);
            })
          } else {
            common.msg('表单验证失败!');
          }
        });
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      },
      isExist (){
        this.$axios.get( MO().createLeadsRemark.tmkLeadsCheck,{
          params:{
            phone : this.formValidate.phone,
          },
        }).then( (res) => {
          if(res && res.data.code == 100){
            this.formValidate.name = res.data.data;
            this.tishi = "";
          }else{
            this.tishi = "该leads不存在";
            this.formValidate.name = '';
          }
        })
      },
    },
    components: {
      'o-breadcrumb': OBreadcrumb
    }
  }
</script>

<style scoped>
.title{text-align:left;margin-left:50px;}
</style>
