<template>
  <div>
    <o-breadcrumb second="师资管理" third="新增全职老师"></o-breadcrumb>
    <h1 class="title">新增全职老师</h1>
    <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" inline>
      <o-div-split text="基本信息"></o-div-split>
      <Form-item label="姓名" prop="tcName">
        <i-input v-model="formValidate.tcName" placeholder="姓名"></i-input>
      </Form-item>
      <Form-item label="性别" prop="gender">
        <i-select v-model="formValidate.gender" placeholder="性别" style="width:172px">
          <i-option :value="0">男</i-option>
          <i-option :value="1">女</i-option>
        </i-select>
      </Form-item>
      <Form-item label="师训中心" prop="branch">
        <i-select v-model="formValidate.branch" placeholder="师训中心" style="width:172px">
          <i-option value="1">上海</i-option>
          <i-option value="2">合肥</i-option>
        </i-select>
      </Form-item>
      <Form-item label="手机号" prop="phone">
        <i-input v-model="formValidate.phone"placeholder="手机号"></i-input>
      </Form-item>
      <Form-item label="QQ" prop="qq">
        <i-input v-model="formValidate.qq" placeholder="QQ"></i-input>
      </Form-item>
      <Form-item label="邮箱" prop="email">
        <i-input v-model="formValidate.email" placeholder="邮箱"></i-input>
      </Form-item>
      <Form-item label="微信号" prop="wechat">
        <i-input v-model="formValidate.wechat" placeholder="微信号"></i-input>
      </Form-item>
      <Form-item label="身份证号" prop="idNumber">
        <i-input v-model="formValidate.idNumber" placeholder="身份证号"></i-input>
      </Form-item>

      <o-div-split text="高考所在地"></o-div-split>
      <Form-item label="省" prop="province">
        <i-select v-model="formValidate.province" :clearable="true" filterable @on-change="changeSelectedCity" placeholder="省" style="width:172px">
          <i-option v-for="(item,index) in provinceList" :key='index' :value="item.areaCode">{{ item.areaName }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="市" prop="cityName">
        <i-select v-model="formValidate.cityName" @on-change="changeSelectedArea" placeholder="市" style="width:172px">
          <i-option v-for="(item,index) in cityArrays" :key='index' :value="item.areaCode">{{ item.areaName }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="区" prop="area">
        <i-select v-model="formValidate.area" placeholder="区" style="width:172px">
          <i-option v-for="(item,index) in areaList" :key='index' :value="item.areaCode">{{ item.areaName }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="高考文理科" prop="wlsubject">
        <i-select v-model="formValidate.artsOrScience" placeholder="高考文理科" style="width:172px">
          <i-option :value="1">文科</i-option>
          <i-option :value="2">理科</i-option>
        </i-select>
      </Form-item>

      <o-div-split text="学历信息"></o-div-split>
      <Form-item label="在读院校" prop="schoolLocation">
        <i-select v-model="formValidate.schoolLocation" filterable clearable placeholder="在读院校" style="width:200px">
          <i-option v-for="(item,index) in schoolList" :key='index' :value="item.schoolName">{{ item.schoolName }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="学历" prop="xueli">
        <i-select v-model="formValidate.xueli" placeholder="学历" style="width:172px">
          <i-option :value="1">本科</i-option>
          <i-option :value="2">研究生</i-option>
          <i-option :value="3">博士</i-option>
        </i-select>
      </Form-item>
      <Form-item label="年级" prop="grade">
        <i-select v-model="formValidate.grade" placeholder="年级" style="width:172px">
          <i-option v-for="(item,index) in xueLiGradeList" :key='index' :value="item.text">{{item.text}}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="最高学历" prop="maxXueli">
        <i-select v-model="formValidate.maxXueli" placeholder="最高学历" style="width:172px">
          <i-option :value="1">本科</i-option>
          <i-option :value="2">研究生</i-option>
          <i-option :value="3">博士</i-option>
        </i-select>
      </Form-item>
      <Form-item label="专业" prop="major">
        <i-input v-model="formValidate.major" placeholder="专业"></i-input>
      </Form-item>

      <o-div-split text="授课偏好"></o-div-split>
      <Form-item label="年级偏好" prop="gradePreference">
        <i-select v-model="formValidate.gradePreference" placeholder="年级偏好" style="width:172px">
          <i-option v-for="(item,index) in gradePreferenceList" :key='index' :value="item.value">{{item.text}}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="科目" prop="teachingSubject">
        <i-select v-model="formValidate.teachingSubject" placeholder="科目" style="width:172px">
          <i-option v-for="(item,index) in subjectList" :key='index' :value="item.uuid">{{ item.enumValue }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="第二科目" prop="twoSubject">
        <i-select v-model="formValidate.twoSubject" placeholder="第二科目" style="width:172px">
          <i-option v-for="(item,index) in subjectList" :key='index' :value="item.uuid">{{ item.enumValue }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="第三科目" prop="threeSubject">
        <i-select v-model="formValidate.threeSubject" placeholder="第三科目" style="width:172px">
          <i-option v-for="(item,index) in subjectList" :key='index' :value="item.uuid">{{ item.enumValue }}</i-option>
        </i-select>
      </Form-item>

      <o-div-split text="薪资信息"></o-div-split>
      <Form-item label="工作性质" prop="natureOfWork">
        <i-select v-model="formValidate.natureOfWork" disabled clearable placeholder="工作性质" style="width:300px">
          <i-option value="2">兼职</i-option>
          <i-option value="1">社招全职</i-option>
          <i-option value="3">校招全职</i-option>
        </i-select>
      </Form-item>
      <Form-item label="薪资等级" prop="salaryLeval">
        <i-select v-model="formValidate.salaryLeval" @on-change="changeSalaryLeval" placeholder="薪资等级" style="width:172px">
          <i-option v-for="(item,index) in salaryGradeList" :key='index' :value="item.id">{{item.grade}}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="时薪">
        <i-input v-model="formValidate.hourlyWage" disabled placeholder="时薪"></i-input>
      </Form-item>
      <o-div-split text="面试评价"></o-div-split>
      <Form-item label="评价" prop="interviewRemark">
        <i-input type="textarea" v-model="formValidate.interviewRemark" :rows="4" placeholder="请输入面试评价" style="width:400px"></i-input>
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
  import {SALARY} from 'common/api/salary.js';
  import {ZHAO_TEACHER,TEACHER} from 'common/api/teacher.js';
  import {formateDate,common} from 'common/js/common.js';
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
      const interviewRemark = (rule, value, callback) => {
        //微信账号仅支持6-20个字母、数字、下划线或减号，以字母开头
        if(value !== ''){
          if(value.length < 5) {
            callback(new Error('不能少于5个字'));
          } else if(value.length > 500) {
            callback(new Error('不能多于500个字'));
          }else {
            callback();
          }
        }else{
          callback();
        }
      };
      //判断要添加的老师是否已经存在
      const validateTcName = (rule, value, callback) => {
        if (value) {
          // const _this = this;
          // common.ajax({
          //   url: ZHAO_TEACHER().fullTimeTeacher.isExist,
          //   method: 'get',
          //   data: {
          //     name: _this.formValidate.tcName,
          //   },
          //   success: function (res) {
          //     if(res.data.exist){
          //       callback(new Error('该姓名库内已存在'));
          //     }else{
                callback();
          //     }
          //   }
          // })

        }else{
          callback(new Error('老师姓名不能为空'));
        }
      };
      return {
        teacherUuid: sessionStorage.getItem('template_uuid') || '',
        teacherId: sessionStorage.getItem('template_id') || null,
        tip: '',
        formValidate: {
          tcName: '',
          idNumber: '',
          branch: '',
          gender: '',
          phone: '',
          qq: '',
          email: '',
          wechat: '',
          province: '',
          cityName: '',
          area: '',
          artsOrScience: '',
          schoolLocation: '',
          xueli: '',
          maxXueli: '',
          grade: '',
          major: '',
          teachingSubject: '',
          twoSubject: '',
          threeSubject: '',
          gradePreference: '',
          natureOfWork: '1',
          salaryLeval: '',
          hourlyWage: '',
          interviewRemark:'',
        },
        ruleValidate: {
          tcName: [
            {validator: validateTcName, trigger: 'blur'}
          ],
          phone: [
            {required: true, validator: validatePhone, trigger: 'blur' }
          ],
          gender: [
            {required: true, type: 'number', message: '性别不能为空', trigger: 'change'}
          ],
          branch: [
            {required: true, message: '师训中心不能为空', trigger: 'change'}
          ],
          qq: [
            {required: true, message: 'QQ不能为空', trigger: 'blur'}
          ],
          email: [
            {required: true, type: 'email', message: '请正确填写Email', trigger: 'blur'}
          ],
          wechat: [
            {required: true, validator: validateWechat, trigger: 'blur'}
          ],
          idNumber: [
            {required: true , message: '请填写身份证号', trigger: 'blur'}
          ],
          // province: [
          //   {required: true, message: '不能为空', trigger: 'change'}
          // ],
          // cityName: [
          //   {required: true, message: '不能为空', trigger: 'change'}
          // ],
          // area: [
          //   {required: true, message: '不能为空', trigger: 'change'}
          // ],
          // artsOrScience: [
          //   {required: true, type: 'number', message: '不能为空', trigger: 'change'}
          // ],
          // schoolLocation: [
          //   {required: true, message: '不能为空', trigger: 'change'}
          // ],
          // grade: [
          //   {required: true, message: '不能为空', trigger: 'change'}
          // ],
          // xueli: [
          //   {required: true, type: 'number', message: '不能为空', trigger: 'change'}
          // ],
          // maxXueli: [
          //   {required: true, type: 'number', message: '不能为空', trigger: 'change'}
          // ],
          // major: [
          //   {required: true, message: '不能为空', trigger: 'blur'}
          // ],
          // teachingSubject: [
          //   {required: true, message: '不能为空', trigger: 'change'}
          // ],
          // gradePreference: [
          //   {required: true, message: '不能为空', trigger: 'change'}
          // ],
          // salaryLeval: [
          //   {required: true, type: 'number', message: '请选择薪资等级', trigger: 'change'}
          // ],
          // hourlyWage: [
          //   {required: true, type: 'number', message: '不能为空', trigger: 'blur'}
          // ],
          interviewRemark: [
            {required: true, validator: interviewRemark, type: 'string', trigger: 'change' }
          ]
        },
        subjectList: [],
        schoolList: [],
        provinceList: [],
        cityArrays: [],
        areaList: [],
        bankList: [],
        salaryGradeList: [],
        xueLiGradeList: [],//2017届
        gradePreferenceList: []//年级偏好
      }
    },
    mounted() {
      this.hiInit();
    },
    methods: {
      hiInit() {
        const _this = this;
        //获取科目列表;
        common.ajax({
          url: TEACHER().Detail.getAllSubject,
          method: 'get',
          success: function (res) {
            _this.subjectList = res.data;
          }
        });
        //获取银行
        common.ajax({
          url: COMMON_API().allBank,
          method: 'get',
          success: function (response) {
            _this.bankList = response.data;
          }
        });
        //获取所有学校
        common.ajax({
          url: COMMON_API().allSchool,
          method: 'get',
          success: function (response) {
            _this.schoolList = response.data;
          }
        });
        //获取省
        common.ajax({
          url: COMMON_API().ssqAreaAll,
          method: 'get',
          data: {parentCode: 0},
          success: function (response) {
            _this.provinceList = response.data;
          }
        });
        //等级时薪
        common.ajax({
          url: COMMON_API().getAllPayGrade,
          method: 'get',
          data: {natureOfWork: 1},
          success:function(res){
            _this.salaryGradeList = res.data;
          }
        });
        $.getJSON("static/data.json", (json) => {
          _this.gradePreferenceList = json.gradePreferenceList;
          _this.xueLiGradeList = json.xueLiGradeList;
        });
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            common.ajax({
              url: TEACHER().AddTeacher.addFullTimeTeacher,
              method: 'get',
              data: {
                tcName: _this.formValidate.tcName,
                branch: _this.formValidate.branch,
                phone: _this.formValidate.phone,
                qq: _this.formValidate.qq,
                sex: _this.formValidate.gender,
                wechat: _this.formValidate.wechat,
                email: _this.formValidate.email,
                province: _this.formValidate.province,
                city: _this.formValidate.cityName,
                district: _this.formValidate.area,
                artsOrScience: _this.formValidate.artsOrScience,
                schoolLocation: _this.formValidate.schoolLocation,
                grade: _this.formValidate.grade,
                education: _this.formValidate.xueli,
                highestEducation: _this.formValidate.maxXueli,
                major: _this.formValidate.major,
                gradePreference: _this.formValidate.gradePreference,
                teachingSubject: _this.formValidate.teachingSubject,
                secondSubject: _this.formValidate.twoSubject,
                idNumber: _this.formValidate.idNumber,
                thirdSubject: _this.formValidate.threeSubject,
                natureOfWork: _this.formValidate.natureOfWork,
                payGrade: _this.formValidate.salaryLeval,
                hourlyWage: _this.formValidate.hourlyWage,
                interviewRemark: _this.formValidate.interviewRemark,
              },
              success: function (response) {
                common.notices('操作成功！！');
                _this.tip = '新增成功，可到师资库查看';
              }
            });
          } else {
            common.msg('表单验证失败!');
          }
        });
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      },
      changeSalaryLeval(value) {
        const _this = this;
        common.ajax({
          url: SALARY().Level.getById,
          method: 'get',
          noLoading: 'yes',
          data: {id: value},
          success: function (response) {
            let data = response.data;
            if(data) {
              _this.formValidate.hourlyWage = data.hourlyWage;
            }
          }
        });
      },
      changeSelectedCity(areaName) {
        const _this = this;
        //获取城市
        common.ajax({
          url: COMMON_API().ssqAreaAll,
          method: 'get',
          data: {parentCode: areaName},
          success: function (response) {
            _this.cityArrays = response.data;
          }
        });
      },
      changeSelectedArea(areaName) {
        const _this = this;
        //获取城市的区域
        common.ajax({
          url: COMMON_API().ssqAreaAll,
          method: 'get',
          data: {parentCode: areaName},
          success: function (response) {
            _this.areaList = response.data;
          }
        });
      }
    },
    components: {OBreadcrumb, oDivSplit}
  };
</script>

<style scoped>
  .split-div {
    position: relative;
    padding: 0;
    height: 32px;
    line-height: 32px;
    border-bottom: 2px solid #e5e5e5;
    margin: 10px 10px 20px 10px;
  }
  .split-div .title {
    position: absolute;
    padding: 0 10px;
    border-bottom: 2px solid #59bc5e;
    color: #3C3C3C;
    top: -2px;
    left: 0;
    font-size: 16px;
    font-weight:bold;
    vertical-align: middle;
  }
  .split-div .btn {
    position: absolute;
    right:0;
    top: -9px;
  }
  .ivu-input[disabled], fieldset[disabled] .ivu-input {
    cursor: auto !important;
    color: #000 !important;
  }
  .ivu-select-disabled .ivu-select-selection {
    cursor: auto !important;
    color: #000 !important;
  }
  .annex-div {margin: 0 0 10px 20px;}
</style>
