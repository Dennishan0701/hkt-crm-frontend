<template>
<div>
  <o-breadcrumb second="市场与运营" third="新增Leads"></o-breadcrumb>
  <div class="title"><h1 class="title">新增Leads</h1></div>
  <i-form ref='formValidate' :model="formValidate" :rules="ruleValidate" :label-width="100">
    <Form-item label="学生姓名" prop="name">
      <i-input v-model="formValidate.name" placeholder="请输入学生姓名" style="width:200px"></i-input>
    </Form-item>
    <Form-item label="手机号码" prop="phone">
      <i-input v-model="formValidate.phone" placeholder="请输入学生手机号码" style="width:200px"></i-input>
    </Form-item>
    <Form-item label="年级" prop="grade">
      <i-select v-model="formValidate.grade"  style="width:200px">
        <i-option value="小四">小四</i-option>
        <i-option value="小五">小五</i-option>
        <i-option value="小六">小六</i-option>
        <i-option value="预初">预初</i-option>
        <i-option value="初一">初一</i-option>
        <i-option value="初二">初二</i-option>
        <i-option value="初三">初三</i-option>
        <i-option value="初四">初四</i-option>
        <i-option value="高一">高一</i-option>
        <i-option value="高二">高二</i-option>
        <i-option value="高三">高三</i-option>
      </i-select>
    </Form-item>
    <Form-item label="科目" prop="subject">
      <i-select v-model="formValidate.subject" style="width:200px">
        <i-option v-for="(item,index) in subjectList" :key='index' :value="item">{{ item }}</i-option>
      </i-select>
    </Form-item>
    <Form-item label="渠道" prop="channel">
      <i-select v-model="formValidate.channel" filterable clearable style="width:200px">
        <i-option v-for="(item,index) in channelList" :key='index' :value="item.uuid">{{ item.name }}</i-option>
      </i-select>
    </Form-item>
    <Form-item label="是否为S名单">
      <Radio-group v-model="formValidate.signStatus" type="button">
        <Radio label="1">是</Radio>
        <Radio label="0">否</Radio>
      </Radio-group>
    </Form-item>
    <Form-item label="是否转介绍">
      <Radio-group v-model="formValidate.isIntroduced" type="button">
        <Radio label="1">是</Radio>
        <Radio label="0">否</Radio>
      </Radio-group>
      <i-input v-model="formValidate.introducer" v-show="formValidate.isIntroduced == 1" placeholder="请输入转介绍人姓名或手机号" style="width:200px;vertical-align: text-top;"></i-input>
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
          callback();
        }
      }
      return {
        formValidate: {
          name: '',
          phone: '',
          grade: '',
          subject: '',
          channel: '',
          isIntroduced: 0,       //是否转介绍
          signStatus: 0,       //是否为S名单
          introducer: '',        //介绍人
          desc: ''
        },
        subjectList: [],
        channelList: [],
        ruleValidate: {
          name: [
            {required: true, message: '姓名不能为空', trigger: 'blur'}
          ],
          phone: [
            {required: true, validator: validatePhone, trigger: 'blur' }
          ],
          grade: [
            {required: true, message: '请选择年级', trigger: 'change'}
          ],
          subject: [
            {required: true, message: '请选择科目', trigger: 'change'}
          ],
          channel: [
            {required: true, message: '请选择渠道', trigger: 'change'}
          ],
          desc: [
            { type: 'string', max: 500, message: '备注不能大于500个字', trigger: 'change' }
          ]
        }
      }
    },
    mounted() {
      //获取科目列表
      const _this = this;
      common.ajax({
        url: COMMON_API().allSubject,
        method: 'get',
        success: function (res) {
          _this.subjectList = res.data || [];
        }
      });
      common.ajax({
        url: MO().Channel.allChannel,
        method: 'get',
        success: function (res) {
          _this.channelList = res.data || [];
        }
      });
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            common.ajax({
              url: MO().Leads.create,
              data: {
                name: _this.formValidate.name,
                phone: _this.formValidate.phone,
                grade: _this.formValidate.grade,
                subject: _this.formValidate.subject,
                isIntroduced: _this.formValidate.isIntroduced,
                introducer: _this.formValidate.introducer,
                signStatus: _this.formValidate.signStatus,
                channelUuid: _this.formValidate.channel,
                remarkContent: _this.formValidate.desc
              },
              success: function (response) {
                common.notices('操作成功！！');
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
    components: {
      'o-breadcrumb': OBreadcrumb
    }
  }
</script>

<style scoped>
.title{text-align:left;margin-left:50px;}
</style>
