<template>
  <div>
    <o-breadcrumb second="销售与客服" third="新增推荐Leads"></o-breadcrumb>
    <div class="title"><h1 class="title">新增推荐Leads</h1></div>
    <i-form ref='formValidate' :model="formValidate" :rules="ruleValidate" :label-width="100">
      <Form-item label="学生姓名" prop="leadsName">
        <i-input :size="$store.state.searchModuleSize" v-model="formValidate.leadsName" placeholder="请输入学生姓名" style="width:200px"></i-input>
      </Form-item>
      <Form-item label="手机号码" prop="leadsPhone">
        <i-input :size="$store.state.searchModuleSize" v-model="formValidate.leadsPhone" placeholder="请输入学生手机号码" style="width:200px"></i-input>
      </Form-item>
      <Form-item label="年级" prop="grade">
        <i-select :size="$store.state.searchModuleSize" v-model="formValidate.grade"  style="width:200px">
          <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{item.value}}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="科目" prop="subject">
        <i-select :size="$store.state.searchModuleSize" v-model="formValidate.subject" style="width:200px">
          <i-option v-for="(item,index) in subjectList" :key='index' :value="item">{{ item }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="推荐CC" prop="recommendCcUuid">
        <i-select :size="$store.state.searchModuleSize" v-model="formValidate.recommendCcUuid" @on-change="changeRecommendCc" label-in-value filterable style="width:200px">
          <i-option v-for="(item,index) in ccUserList" :key='index' :value="item.uuid" :label="item.name">{{item.name}}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="渠道" prop="channelUuid">
        <i-select :size="$store.state.searchModuleSize" v-model="formValidate.channelUuid" @on-change="changeChannel" filterable style="width:200px">
          <i-option v-for="(item,index) in channelList" :key='index' :value="item.uuid">{{item.name}}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="在读介绍人" prop="introducer">
        <i-input :disabled="introducerDisable" :size="$store.state.searchModuleSize" v-model="formValidate.introducer" @on-change="getIntroducerbyPhone" placeholder="请输入在读介绍人手机号码" style="width:200px"></i-input>
        <span class="introducer-name">{{introducerName}}</span>
      </Form-item>
      <Form-item label="非在读介绍人" prop="introducer2">
        <i-input :disabled="introducerDisable2" :size="$store.state.searchModuleSize" v-model="formValidate.introducer2" @on-change="getIntroducerbyPhone2" placeholder="请输入非在读介绍人手机号码" style="width:200px"></i-input>
        <span class="introducer-name">{{introducerName2}}</span>
      </Form-item>
      <Form-item label="备注" prop="remark">
        <i-input :size="$store.state.searchModuleSize" type="textarea" v-model="formValidate.remark" :rows="4" placeholder="请输入备注" style="width:400px"></i-input>
      </Form-item>

      <Form-item>
        <i-button :size="$store.state.searchModuleSize" type="primary" icon="checkmark" @click="handleSubmit('formValidate')">提交</i-button>
        <i-button :size="$store.state.searchModuleSize" type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</i-button>
      </Form-item>
    </i-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API,MO_API} from 'common/api.config.js';
  import {SCS} from 'common/api/scs.js';
  import {common} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';

  export default{
    data() {
      let validatePhone = (rule, value, callback) => {
        if (value === "") {
          callback(new Error('手机号码不能为空'));
        } else if (!(/^1\d{10}$/.test(value))) {
          callback(new Error('请填写合法的手机号码'));
        } else {
          callback();
        }
      };
      let validatePhone2 = (rule, value, callback) => {
        if (value === "") {
          callback();
        } else if (!(/^1\d{10}$/.test(value))) {
          callback(new Error('请填写合法的手机号码'));
        } else {
          callback();
        }
      };
      return {
        channelList:[],
        introduceType:'',
        introducerDisable: false,
        introducerDisable2: false,
        formValidate: {
          leadsName: '',
          leadsPhone: '',
          grade: '',
          subject: '',
          recommendCcUuid: '',
          channelUuid: '',
          recommendCcName: '',
          introducer: '',        //介绍人
          introducer2: '',        //介绍人
          remark: ''
        },
        introducerName: '',
        introducerName2: '',
        gradeList: [],
        subjectList: [],
        ccUserList: [],
        ruleValidate: {
          leadsName: [
            {required: true, message: '姓名不能为空', trigger: 'blur'}
          ],
          leadsPhone: [
            {required: true, validator: validatePhone, trigger: 'blur' }
          ],
          grade: [
            {required: true, message: '请选择年级', trigger: 'change'}
          ],
          subject: [
            {required: true, message: '请选择科目', trigger: 'change'}
          ],
          recommendCcUuid: [
            {required: true, message: '推荐CC不能为空', trigger: 'change'}
          ],
          channelUuid: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          introducer: [
            {required: false, validator: validatePhone2, trigger: 'blur'}
          ],
          introducer2: [
            {required: false, validator: validatePhone2, trigger: 'blur'}
          ],
          remark: [
            { type: 'string', max: 500, message: '备注不能大于500个字', trigger: 'change' }
          ]
        }
      }
    },
    mounted() {
      //获取科目列表
      const _this = this;
      this.$axios.get(COMMON_API().allSubject,{
      }).then( ({data}) => {
        _this.subjectList = data.data || [];
      })
      // 获取推荐leads渠道
      this.$axios.get(COMMON_API().getRecommendChannel,{
      }).then( ({data}) => {
        console.log (data);
        _this.channelList = data.data.channelList || [];
      })
      //获取年级
      $.getJSON("static/data.json", function (json) {
        _this.gradeList = json.gradeList;
      });
      this.$axios.get(COMMON_API().getAllCcInfo,{
      }).then( ({data}) => {
        _this.ccUserList = data.data || [];
      })
    },
    watch: {
      'formValidate.introducer'(value) {
        if(value){
          this.introducerDisable2 = true;
        }else if(value === ''){
          this.introducerDisable2 = false;
        }
      },
      'formValidate.introducer2'(value) {
        if(value){
          this.introducerDisable = true;
        }else if(value === ''){
          this.introducerDisable = false;
        }
      }
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            if(this.formValidate.introducer === '' && this.formValidate.introducer2 === ''){
              common.notices('请输入在读介绍人或非在读介绍人手机号','提示','warning');
            }else{
              if(this.introducerDisable){
                this.introduceType = 1
              }else if(this.introducerDisable2){
                this.introduceType = 0
              }
              this.$axios.post(SCS().Leads.addRecommendLeads,{
                leadsName: _this.formValidate.leadsName,
                leadsPhone: _this.formValidate.leadsPhone,
                grade: _this.formValidate.grade,
                subject: _this.formValidate.subject,
                recommendCcUuid: _this.formValidate.recommendCcUuid,
                channelUuid: _this.formValidate.channelUuid,
                recommendCcName: _this.formValidate.recommendCcName,
                introducer: _this.formValidate.introducer || _this.formValidate.introducer2,
                introduceType: _this.introduceType,
                remark: _this.formValidate.remark
              }).then( () => {
                common.notices('请到新名单中查看该Leads','操作成功');
              })
            }
          } else {
            common.msg('表单验证失败!');
          }
        });
      },
      changeRecommendCc(value) {
        this.formValidate.recommendCcName = value.label;
      },
      changeChannel(){

      },
      handleReset (name) {
        this.$refs[name].resetFields();
      },
      getIntroducerbyPhone(value) {
        this.introducerName = ''
        let phone = value.target.value;
        if(phone && phone.length === 11) {
      		const _this = this;
          this.$axios.get(SCS().Leads.getLeadsByPhone,{
            params:{
              phone: phone
            }
          }).then( ({data}) => {
            _this.introducerName = data.data;
          })
        }
      },
      getIntroducerbyPhone2(value) {
        let phone = value.target.value;
        // if(phone && phone.length === 11) {
      	// 	const _this = this;
        //   this.$axios.get(SCS().Leads.getLeadsByPhone,{
        //     params:{
        //       phone: phone
        //     }
        //   }).then( ({data}) => {
        //     _this.introducerName = data.data;
        //   })
        // }
      },
    },
    components: { OBreadcrumb }
  }
</script>

<style scoped>
  .title{text-align:left;margin-left:50px;}
  span.introducer-name { font-size: 16px; margin-left: 5px; }
</style>
