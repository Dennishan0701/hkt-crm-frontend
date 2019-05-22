<template>
  <Modal
    v-model="modal"
    title="编辑基本资料"
    :closable="false"
    :mask-closable="false"
    :loading = "loading"
    @on-ok="onOk('formValidate')"
    @on-cancel="onCancel('formValidate')"
  >
    <i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
      <Form-item label="姓名" prop="tcName">
        <i-input v-model="formItem.tcName" placeholder="请输入姓名" style="width: 300px"></i-input>
      </Form-item>
      <Form-item label="性别" prop="sex">
        <i-select placeholder="性别" v-model="formItem.sex" style="width:200px" clearable>
          <i-option value=1>男</i-option>
          <i-option value=2>女</i-option>
        </i-select>
      </Form-item>
      <Form-item label="手机号" prop="phone">
        {{formItem.phone}}
      </Form-item>
      <Form-item label="QQ" prop="qq">
        <i-input v-model="formItem.qq" placeholder="请输入QQ" style="width: 300px"></i-input>
      </Form-item>
      <Form-item label="邮箱" prop="email">
        <i-input v-model="formItem.email" placeholder="请输入邮箱" style="width: 300px"></i-input>
      </Form-item>
      <Form-item label="微信号" prop="wechat">
        <i-input v-model="formItem.wechat" placeholder="请输入微信号" style="width: 300px"></i-input>
      </Form-item>
      <Form-item label="在读院校">
        <i-select v-model="formItem.scroll" size="small" filterable style="width:200px">
          <i-option v-for="(item,index) in scrollAll" :key='index' :value="item.uuid">{{ item.schoolName }}</i-option>
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
      let qqRemark = (rule, value, callback) => {
        if(value === "") {
          callback(new Error('不能为空，请输入'));
        } else {
          callback();
        }
      };
      let mailRemark = (rule, value, callback) => {
        if(value === "") {
          callback(new Error('不能为空，请输入'));
        } else {
          callback();
        }
      };
      let wechatRemark = (rule, value, callback) => {
        if(value === "") {
          callback(new Error('不能为空，请输入'));
        } else {
          callback();
        }
      };
      let sexRemark = (rule, value, callback) => {
        if(value === "" || value == null+''|| value == null) {
          callback(new Error('请选择性别'));
        } else {
          callback();
        }
      };
      return {
        loading: true,
        modal: false,
        teacherUuid: '',
        errorTip: '',
        scrollAll: [],
        formItem:{
          sex: '',
          tcName: '',
          qq: '',
          phone: '',
          scroll: '',
          wechat: '',
          email: '',
        },
        ruleValidate: {
          sex: [
            {required: true, validator: sexRemark, trigger: 'change'}
          ],
          tcName: [
            {required: true,type:"string",min:2, message: '名字最少为两个字符', trigger: 'blur'}
          ],
          qq: [
            {required: true, validator: qqRemark, trigger: 'blur'}
          ],
          email: [
            {required: true, validator: mailRemark, trigger: 'blur'}
          ],
          wechat: [
            {required: true, validator: wechatRemark, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      show(sex,uuid, tcName, phone,qq,email,wechat,idNumber,scrool) {
        console.log(sex)
        let _this = this;
        this.formItem = {
          sex: sex+'',
          tcName: tcName,
          qq: qq,
          phone: phone,
          scroll: scrool+'',
          wechat: wechat,
          email: email,
        },
        this.teacherUuid = uuid;
        this.idNumber = idNumber== 'null' ? '' : idNumber;
        common.ajax({
          url: ZHAO_TEACHER().WaitToOffer.getAllSchool,
          data:{uuid},
          method: 'get',
          success: function (res) {
            _this.scrollAll =  res.data || [];
          }
        });
        console.log(this.formItem);
        this.modal = true;
      },
      onCancel(name){
        this.$refs[name].resetFields();
      },
      onOk(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            console.log(_this.teacherUuid);
            common.ajax({
              url: ZHAO_TEACHER().WaitToOffer.saveTeacherDetail,
              data: {
                checkType:"noCheck",
                sex: _this.formItem.sex,
                uuid: _this.teacherUuid,
                phone: _this.formItem.phone,
                qq: _this.formItem.qq,
                email: _this.formItem.email,
                wechat: _this.formItem.wechat,
                tcName: _this.formItem.tcName,
                schoolLocation: _this.formItem.scroll
              },
              success: function(response){
                _this.modal = false;
                _this.$refs[name].resetFields();
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
      }
    }
  };
</script>

<style>

</style>
