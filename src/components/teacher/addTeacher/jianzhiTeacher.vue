<template>
  <div>
    <o-breadcrumb second="师资管理" third="新增兼职老师"></o-breadcrumb>
    <h1 style="text-align: center;">新增兼职老师</h1>
    <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" inline>
      <o-div-split text="基本信息"></o-div-split>
      <Form-item label="老师姓名" prop="tcName">
        <i-input v-model="formValidate.tcName" placeholder="老师姓名" style="width:300px"></i-input>
      </Form-item>
      <Form-item label="手机号码" prop="phone">
        <i-input v-model="formValidate.phone" placeholder="手机号码" style="width:300px"></i-input>
      </Form-item>
      <Form-item label="工作性质" prop="natureOfWork">
        <i-select v-model="formValidate.natureOfWork" disabled clearable placeholder="工作性质" style="width:300px">
          <i-option value="2">兼职</i-option>
          <i-option value="1">社招全职</i-option>
          <i-option value="3">校招全职</i-option>
        </i-select>
      </Form-item>
      <Form-item label="电子邮箱" prop="email">
        <i-input v-model="formValidate.email" placeholder="电子邮箱" style="width:300px"></i-input>
      </Form-item>
      <Form-item label="所属院校" prop="schoolLocation">
        <i-select v-model="formValidate.schoolLocation" filterable clearable placeholder="所属院校" style="width:300px">
          <i-option v-for="(item,index) in schoolList" :key='index' :value="item.uuid">{{ item.schoolName }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="QQ" prop="qq">
        <i-input v-model.number="formValidate.qq"  placeholder="QQ" style="width:300px"></i-input>
      </Form-item>
      <Form-item label="微信号" prop="wechat">
        <i-input v-model="formValidate.wechat" placeholder="微信号" style="width:300px"></i-input>
      </Form-item>
      <Form-item label="长期居住地址" prop="address">
        <i-input v-model="formValidate.address" placeholder="长期居住地址" style="width:300px"></i-input>
      </Form-item>

      <o-div-split text="授课偏好"></o-div-split>

      <Form-item label="年级偏好" prop="gradePreference">
        <i-select v-model="formValidate.gradePreference" clearable placeholder="年级偏好" style="width:300px">
          <i-option v-for="(item,index) in gradePreferenceList" :key='index' :value="item.value">{{ item.text }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="科目" prop="teachingSubject">
        <i-select v-model="formValidate.teachingSubject" placeholder="第一科目" style="width:300px">
          <i-option v-for="(item,index) in subjectList" :key='index' :value="item.uuid">{{ item.enumName }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="第二科目" prop="secondSubject">
        <i-select v-model="formValidate.secondSubject" placeholder="第二科目" style="width:300px">
          <i-option v-for="(item,index) in subjectList" :key='index' :value="item.uuid">{{ item.enumName }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="第三科目" prop="thirdSubject">
        <i-select v-model="formValidate.thirdSubject" placeholder="第三科目" style="width:300px">
          <i-option v-for="(item,index) in subjectList" :key='index' :value="item.uuid">{{ item.enumName }}</i-option>
        </i-select>
      </Form-item>
      <o-div-split text="其它"></o-div-split>
      <Form-item label="推荐人" prop="referral">
        <i-input v-model="formValidate.referral" placeholder="请输入转介绍人姓名或手机号码" style="width:300px"></i-input>
      </Form-item>
    </i-form>

    <div style="text-align: center;">
      <i-button type="primary" icon="checkmark" @click="handleSubmit('formValidate')">提交</i-button>
      <i-button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</i-button>
      <span class="c-success">{{tip}}</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {ZHAO_TEACHER,TEACHER} from 'common/api/teacher.js';
  import {common} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import oDivSplit from 'components/o/oDivSplit';

  export default{
    data() {
      const validatePhone = (rule, value, callback) => {
        if (value === "") {
          callback(new Error('手机号码不能为空'));
        } else if (!(/^1\d{10}$/.test(value))) {
          callback(new Error('请填写合法的手机号码'));
        } else {
          callback();
        }
      };
      const validateWechat = (rule, value, callback) => {
        //微信账号仅支持6-20个字母、数字、下划线或减号，以字母开头
        if(!/^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,20}$/.test(value) && !/^1\d{10}$/.test(value)) {
          callback(new Error('请填写合法的微信号或者绑定的手机号'));
        } else {
          callback();
        }
      };
      //判断要添加的老师是否已经存在
      const validateTcName = (rule, value, callback) => {
        if (value) {
          const _this = this;
          common.ajax({
            url: ZHAO_TEACHER().fullTimeTeacher.isExist,
            method: 'get',
            data: {
              name: _this.formValidate.tcName,
            },
            success: function (res) {
              if(res.data.exist){
                callback(new Error('该姓名库内已存在'));
              }else{
                callback();
              }
            }
          })
        }else{
          callback(new Error('老师姓名不能为空'));
        }
      };
      return {
        tip: '',
        formValidate: {
          tcName: '',
          phone: '',
          natureOfWork: '2',
          email: '',
          schoolLocation: '',
          qq: '',
          wechat: '',
          teachingSubject: '',
          secondSubject: '',
          thirdSubject: '',
          gradePreference: '',
          referral: '',
          address: '',
        },
        subjectList: [],
        gradePreferenceList: [],
        schoolList: [],
        ruleValidate: {
          tcName: [
            {validator: validateTcName, trigger: 'blur'}
          ],
          phone: [
            {required: true, validator: validatePhone, trigger: 'blur' }
          ],
          email: [
            {required: true, type: 'email', message: '请输入合法的邮箱地址', trigger: 'blur' }
          ],
          qq: [
            {required: true, type: 'number', message: '请输入合法的QQ号码', trigger: 'blur'}
          ],
          wechat: [
            {required: true, validator: validateWechat, trigger: 'blur'}
          ],
          grade: [
            {required: true, message: '请选择年级', trigger: 'change'}
          ],
          gradePreference: [
            {required: true, message: '请选择年级偏好', trigger: 'change'}
          ],
          schoolLocation: [
            {required: true, message: '所属院校不能为空', trigger: 'change'}
          ],
          teachingSubject: [
            {required: true, message: '第一学科不能为空', trigger: 'change'}
          ],
          address: [
            {required: true, message: '居住地址不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    mounted() {
      const _this = this;
      common.ajax({
        url: TEACHER().Public.getAllSubject,
        method: 'get',
        success: function (res) {
          _this.subjectList = res.data || [];
        }
      });
      $.getJSON("static/data.json", (json) => {
        _this.gradePreferenceList = json.gradePreferenceList;
      });
      common.ajax({
        url: COMMON_API().allSchool,
        method: 'get',
        success: function (response) {
          _this.schoolList = response.data || [];
        }
      });
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            common.ajax({
              url: TEACHER().AddTeacher.jianzhi,
              data: {
                tcName: _this.formValidate.tcName,
                phone: _this.formValidate.phone,
                natureOfWork: _this.formValidate.natureOfWork,
                email: _this.formValidate.email,
                schoolLocation: _this.formValidate.schoolLocation,
                qq: _this.formValidate.qq,
                wechat: _this.formValidate.wechat,
                grade: _this.formValidate.grade,
                teachingSubject: _this.formValidate.teachingSubject,
                secondSubject: _this.formValidate.secondSubject,
                thirdSubject: _this.formValidate.thirdSubject,
                gradePreference: _this.formValidate.gradePreference,
                referral: _this.formValidate.referral,
                address: _this.formValidate.address
              },
              success: function (response) {
                common.notices('可到【招师】【待面试】中查看','操作成功');
                _this.tip = '操作成功！可到【招师】【待面试】中查看';
              }
            });
          } else {
            common.msg('表单验证失败!');
          }
        });
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      }
    },
    components: { OBreadcrumb, oDivSplit }
  }
</script>

<style scoped>
</style>
