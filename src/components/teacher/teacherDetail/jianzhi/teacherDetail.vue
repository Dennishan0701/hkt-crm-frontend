<template>
  <div>
    <o-breadcrumb second="兼职老师详情"></o-breadcrumb>
    <h1 class="title">{{Base.name}}老师详情</h1>

    <div class="split-div">
      <div class="title">基本信息</div>
      <div class="btn">
        <i-button type="info" icon="edit" size="small" @click="Base.isDisabled = !Base.isDisabled">{{editBase}}</i-button>
        <i-button type="success" icon="checkmark" size="small" v-show="!Base.isDisabled" @click="handleSubmit('formValidateBase')">保存</i-button>
      </div>
    </div>
    <i-form ref="formValidateBase" :model="Base" :label-width="80" :rules="ruleValidateBase" inline>
      <Form-item label="姓名" prop="name">
        <i-input v-model="Base.name" :disabled="Base.isDisabled" placeholder="姓名"></i-input>
      </Form-item>
      <Form-item label="性别" prop="gender">
        <i-select v-model="Base.gender" :disabled="Base.isDisabled" placeholder="性别" style="width:172px">
          <i-option :value="0">男</i-option>
          <i-option :value="1">女</i-option>
        </i-select>
      </Form-item>
      <Form-item label="手机号">
        <i-input v-model="Base.phone" :disabled="true" placeholder="手机号"></i-input>
      </Form-item>
      <Form-item label="QQ" prop="qq">
        <i-input v-model="Base.qq" :disabled="Base.isDisabled" placeholder="QQ"></i-input>
      </Form-item>
      <Form-item label="邮箱" prop="email">
        <i-input v-model="Base.email" :disabled="Base.isDisabled" placeholder="邮箱"></i-input>
      </Form-item>
      <Form-item label="微信号" prop="wechat">
        <i-input v-model="Base.wechat" :disabled="Base.isDisabled" placeholder="微信号"></i-input>
      </Form-item>
      <Form-item label="身份证号" prop="idCard">
        <i-input v-model="Base.idCard" :disabled="Base.isDisabled" placeholder="身份证号"></i-input>
      </Form-item>
      <Form-item label="长期居住地址" prop="address">
        <i-input v-model="Base.address" :disabled="Base.isDisabled" placeholder="长期居住地址"></i-input>
      </Form-item>
    </i-form>

    <div class="split-div">
      <div class="title">高考所在地</div>
      <div class="btn">
        <i-button type="info" icon="edit" size="small" @click="Gaokao.isDisabled = !Gaokao.isDisabled">{{editGaokao}}</i-button>
        <i-button type="success" icon="checkmark" size="small" v-show="!Gaokao.isDisabled" @click="handleSubmit('formValidateGaokao')">保存</i-button>
      </div>
    </div>
    <i-form ref="formValidateGaokao" :model="Gaokao" :label-width="80" :rules="ruleValidateGaokao" inline>
      <Form-item label="省" prop="province">
        <i-select v-model="Gaokao.province" :disabled="Gaokao.isDisabled" :clearable="true" filterable @on-change="changeSelectedCity" placeholder="省" style="width:172px">
          <i-option v-for="(item,index) in provinceList" :key='index' :value="item.areaCode">{{ item.areaName }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="市" prop="cityName">
        <i-select v-model="Gaokao.cityName" :disabled="Gaokao.isDisabled" @on-change="changeSelectedArea" placeholder="市" style="width:172px">
          <i-option v-for="(item,index) in cityArrays" :key='index' :value="item.areaCode">{{ item.areaName }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="区" prop="area">
        <i-select v-model="Gaokao.area" :disabled="Gaokao.isDisabled" placeholder="区" style="width:172px">
          <i-option v-for="(item,index) in areaList" :value="item.areaCode" :key='index'>{{ item.areaName }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="高考文理科" prop="wlsubject">
        <i-select v-model="Gaokao.wlsubject" :disabled="Gaokao.isDisabled" placeholder="高考文理科" style="width:172px">
          <i-option :value="1">文科</i-option>
          <i-option :value="2">理科</i-option>
        </i-select>
      </Form-item>
    </i-form>

    <div class="split-div">
      <div class="title">学历信息</div>
      <div class="btn">
        <i-button type="info" icon="edit" size="small" @click="Xueli.isDisabled = !Xueli.isDisabled">{{editXueli}}</i-button>
        <i-button type="success" icon="checkmark" size="small" v-show="!Xueli.isDisabled" @click="handleSubmit('formValidateXueli')">保存</i-button>
      </div>
    </div>
    <i-form ref="formValidateXueli" :model="Xueli" :label-width="80" :rules="ruleValidateXueli" inline>
      <Form-item label="在读院校" prop="school">
        <i-select v-model="Xueli.school" :disabled="Xueli.isDisabled" filterable clearable placeholder="在读院校" style="width:172px">
          <i-option v-for="(item,index) in schoolList" :value="item.uuid" :key='index'>{{ item.schoolName }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="学历" prop="xueli">
        <i-select v-model="Xueli.xueli" :disabled="Xueli.isDisabled" placeholder="学历" style="width:172px">
          <i-option :value="1">本科</i-option>
          <i-option :value="2">研究生</i-option>
          <i-option :value="3">博士</i-option>
        </i-select>
      </Form-item>
      <Form-item label="年级" prop="grade">
        <i-select v-model="Xueli.grade" :disabled="Xueli.isDisabled" placeholder="年级" style="width:172px">
          <i-option v-for="(item,index) in xueLiGradeList" :value="item.text" :key='index'>{{item.text}}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="最高学历" prop="maxXueli">
        <i-select v-model="Xueli.maxXueli" :disabled="Xueli.isDisabled" placeholder="最高学历" style="width:172px">
          <i-option :value="1">本科</i-option>
          <i-option :value="2">研究生</i-option>
          <i-option :value="3">博士</i-option>
        </i-select>
      </Form-item>
      <Form-item label="专业" prop="major">
        <i-input v-model="Xueli.major" :disabled="Xueli.isDisabled" placeholder="专业"></i-input>
      </Form-item>
    </i-form>

    <div class="split-div">
      <div class="title">授课偏好</div>
      <div class="btn">
        <i-button type="info" icon="edit" size="small" @click="Preference.isDisabled = !Preference.isDisabled">{{editPreference}}</i-button>
        <i-button type="success" icon="checkmark" size="small" v-show="!Preference.isDisabled" @click="handleSubmit('formValidatePreference')">保存</i-button>
      </div>
    </div>
    <i-form ref="formValidatePreference" :model="Preference" :label-width="80" :rules="ruleValidatePreference" inline>
      <Form-item label="年级偏好" prop="gradePreference">
        <i-select v-model="Preference.gradePreference" :disabled="Preference.isDisabled" placeholder="年级偏好" style="width:172px">
          <i-option v-for="(item,index) in gradePreferenceList" :key='index' :value="item.value">{{item.text}}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="科目" prop="teachingSubject">
        <i-select v-model="Preference.teachingSubject" :disabled="Preference.isDisabled" placeholder="科目" style="width:172px">
          <i-option v-for="(item,index) in subjectList" :key='index' :value="item.uuid">{{ item.enumValue }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="第二科目" prop="twoSubject">
        <i-select v-model="Preference.twoSubject" :disabled="Preference.isDisabled" placeholder="第二科目" style="width:172px">
          <i-option v-for="(item,index) in subjectList" :key='index' :value="item.uuid">{{ item.enumValue }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="第三科目" prop="threeSubject">
        <i-select v-model="Preference.threeSubject" :disabled="Preference.isDisabled" placeholder="第三科目" style="width:172px">
          <i-option v-for="(item,index) in subjectList" :key='index' :value="item.uuid">{{ item.enumValue }}</i-option>
        </i-select>
      </Form-item>
    </i-form>


    <div class="split-div">
      <div>
        <div class="title">监课备注</div>
        <div class="btn">
          <i-button type="info" size="small" @click="historyRemarkModal = true">添加</i-button>
        </div>
      </div>
    </div>
    <div style="margin:0 10px;">
        <i-table border stripe size="large" :columns="historyRemarksColumns" :data="historyRemarksDate"></i-table>
    </div>


    <div class="split-div">
      <div class="title">银行卡信息</div>
      <div class="btn">
        <i-button type="info" icon="edit" size="small" @click="Bank.isDisabled = !Bank.isDisabled">{{editBank}}</i-button>
        <i-button type="success" icon="checkmark" size="small" v-show="!Bank.isDisabled" @click="handleSubmit('formValidateBank')">保存</i-button>
      </div>
    </div>
    <i-form ref="formValidateBank" :model="Bank" :label-width="80" :rules="ruleValidateBank" inline>
      <Form-item label="银行" prop="bank">
        <i-select v-model="Bank.bankName" :disabled="Bank.isDisabled" ref="selectBank" label-in-value filterable clearable @on-change="changeBank" placeholder="银行" style="width:172px">
          <i-option v-for="(item,index) in bankList" :key='index' :value="item.id">{{ item.bank }}</i-option>
        </i-select>
        <i-input v-model="Bank.otherBank" :disabled="Bank.isDisabled" @on-change="changeOtherBank" placeholder="其他银行" style="width:200px"></i-input>
      </Form-item>
      <Form-item label="卡号" prop="cardNumber">
        <i-input v-model="Bank.cardNumber" :disabled="Bank.isDisabled" placeholder="卡号" style="width:250px;"></i-input>
      </Form-item>
      <Form-item label="开户行" prop="openAccount">
        <i-input v-model="Bank.openAccount" :disabled="Bank.isDisabled" placeholder="开户行" style="width:400px"></i-input>
      </Form-item>
    </i-form>

    <div class="split-div">
      <div class="title">薪资信息</div>
      <div class="btn">
        <i-button type="info" icon="edit" size="small" @click="Salary.isDisabled = !Salary.isDisabled">{{editSalary}}</i-button>
        <i-button type="success" icon="checkmark" size="small" v-show="!Salary.isDisabled" @click="handleSubmit('formValidateSalary')">保存</i-button>
      </div>
    </div>
    <i-form ref="formValidateSalary" :model="Salary" :label-width="80" :rules="ruleValidateSalary" inline>
      <Form-item label="工作性质" prop="workNature">
        <i-select v-model="Salary.workNature" @on-change="changeWorkNature" :disabled="Salary.isDisabled" placeholder="工作性质" style="width:172px">
          <i-option :value="1">社招全职</i-option>
          <i-option :value="2">兼职</i-option>
          <i-option :value="3">校招全职</i-option>
        </i-select>
      </Form-item>
      <Form-item label="薪资等级" prop="salaryLeval">
        <i-select v-model="Salary.salaryLeval"  @on-change="changeSalaryLeval" :disabled="Salary.isDisabled" placeholder="薪资等级" style="width:172px">
          <i-option v-for="(item,index) in salaryGradeList" :key='index' :value="item.id">{{item.grade}}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="时薪">
        <i-input v-model="Salary.hourlyWage" readonly :disabled="Salary.isDisabled" placeholder="时薪"></i-input>
      </Form-item>
    </i-form>
    <o-div-split text="附件"></o-div-split>
    <div class="annex-div">
      <annex ref="annex" :teacher-id="teacherId"></annex>
    </div>
      <Modal
      v-model="historyRemarkModal"
      title="添加备注"
      :loading = "loading"
      @on-ok="addRemarkOk('formValidateRemark')">
      <i-form ref="formValidateRemark" :model="validateRemark" :rules="ruleValidateRemark">
        <Form-item prop="remark">
          <i-input type="textarea" v-model="validateRemark.remark" :rows="4" :maxlength="500"></i-input>
        </Form-item>
      </i-form>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {SALARY} from 'common/api/salary.js';
  import {ZHAO_TEACHER,TEACHER} from 'common/api/teacher.js';
  import {formateDate,common} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import oDivSplit from 'components/o/oDivSplit';
  import annex from 'components/teacher/teacherDetail/annex';
  export default{
    data() {
      let validateBank = (rule, value, callback) => {
        if (this.Bank.bankName === "" && this.Bank.otherBank === "") {
          callback(new Error('请选择一个银行或者填写一个银行，不能都为空'));
        } else {
          callback();
        }
      };
      let validateIdCard = (rule, value, callback) => {
        if (value && value.toString().length === 18) {
          let pre = value.substr(0, 16);
          pre = Number.parseInt(pre);
          if (pre.toString().length < 16) {
            callback(new Error('请填写合法的身份证号码1'));
          } else if (!/^[X|x|0-9]$/.test(value[17].toString())) {
            callback(new Error('请填写合法的身份证号码2'));
          } else {
            callback();
          }
        } else {
          callback(new Error('请填写18位的身份证号码'));
        }
      };
      let validateWechat = (rule, value, callback) => {
        //微信账号仅支持6-20个字母、数字、下划线或减号，以字母开头
        if(!/^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,20}$/.test(value) && !/^1\d{10}$/.test(value)) {
          callback(new Error('请填写合法的微信号或者绑定的手机号'));
        } else {
          callback();
        }
      };
      return {
        loading:false,
        teacherUuid: sessionStorage.getItem('template_uuid') || '',
        teacherId: sessionStorage.getItem('template_id') || null,
        historyRemarkModal: false,
        Base: {
          isDisabled: true,
          name: '',
          gender: '',
          phone: '',
          qq: '',
          email: '',
          wechat: '',
          idCard: '',
          address: ''
        },
        ruleValidateBase: {
          name: [
            {required: true, message: '姓名不能为空', trigger: 'blur'}
          ],
          gender: [
            {required: true, type: 'number', message: '性别不能为空', trigger: 'change'}
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
          idCard: [
            {required: true, validator: validateIdCard, trigger: 'blur'}
          ],
          address: [
            {required: true, message: '长期居住地不能为空', trigger: 'blur'}
          ],
        },
        Gaokao: {
          isDisabled: true,
          province: '',
          cityName: '',
          area: '',
          wlsubject: ''
        },
        ruleValidateGaokao: {
          province: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          cityName: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          area: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          wlsubject: [
            {required: true, type: 'number', message: '不能为空', trigger: 'change'}
          ],
        },
        Xueli: {
          isDisabled: true,
          school: '',
          xueli: '',
          maxXueli: '',
          grade: '',
          major: ''
        },
        ruleValidateXueli: {
          school: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          grade: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          xueli: [
            {required: true, type: 'number', message: '不能为空', trigger: 'change'}
          ],
          maxXueli: [
            {required: true, type: 'number', message: '不能为空', trigger: 'change'}
          ],
          major: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ]
        },
        historyRemarksDate: [],//历史备注
        historyRemarksColumns: [//历史备注
          {
            title: '备注时间',
            key: 'createDate',
            // render (row, column, index) {
            //   return formateDate(row.createDate,'yyyy-MM-dd hh:mm:ss');
            // },
            render:(h,params) =>{
              return h('div',[
                h('span',{},formateDate(params.row.createDate,'yyyy-MM-dd hh:mm:ss'))
              ])
            }
          },
          {
            title: '备注人',
            key: 'teacherName',
          },
          {
            title: '内容',
            key: 'remark',
          },
        ],
        validateRemark: {
          remark: ''
        },
        ruleValidateRemark: {
          remark: [
            {required: true, message: '请填写内容', trigger: 'blur'}
          ]
        },
        Preference: {
          isDisabled: true,
          teachingSubject: '',
          twoSubject: '',
          threeSubject: '',
          gradePreference: ''
        },
        ruleValidatePreference: {
          teachingSubject: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          gradePreference: [
            {required: true, message: '不能为空', trigger: 'change'}
          ]
        },
        Bank: {
          isDisabled: true,
          bank: '',
          bankName: '',
          otherBank: '',
          cardNumber: '',
          openAccount: ''
        },
        ruleValidateBank: {
          bank: [
            {required: true, validator: validateBank, trigger: 'change'}
          ],
          cardNumber: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          openAccount: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ]
        },
        Salary: {
          isDisabled: true,
          workNature: '',
          salaryLeval: '',
          hourlyWage: ''
        },
        ruleValidateSalary: {
          workNature: [
            {required: true, type:'number', message: '工作性质不能为空', trigger: 'change'}
          ],
          salaryLeval: [
            {required: true, type: 'number', message: '请选择薪资等级', trigger: 'change'}
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
    computed: {
      editBase() {
        return this.Base.isDisabled === true ? '编辑' : '取消';
      },
      editGaokao() {
        return this.Gaokao.isDisabled === true ? '编辑' : '取消';
      },
      editXueli() {
        return this.Xueli.isDisabled === true ? '编辑' : '取消';
      },
      editPreference() {
        return this.Preference.isDisabled === true ? '编辑' : '取消';
      },
      editBank() {
        return this.Bank.isDisabled === true ? '编辑' : '取消';
      },
      editSalary() {
        return this.Salary.isDisabled === true ? '编辑' : '取消';
      }
    },
    methods: {
      hiInit() {
        const _this = this;
        //获取科目列表;
        common.ajax({
          url: TEACHER().Detail.getAllSubject,
          method: 'get',
          success: function (res) {
            _this.subjectList = res.data || [];
          }
        });
        //获取银行
        common.ajax({
          url: COMMON_API().allBank,
          method: 'get',
          success: function (response) {
            _this.bankList = response.data || [];
          }
        });
        //获取所有学校
        common.ajax({
          url: COMMON_API().allSchool,
          method: 'get',
          success: function (response) {
            _this.schoolList = response.data || [];
          }
        });
        //获取省
        common.ajax({
          url: COMMON_API().ssqAreaAll,
          method: 'get',
          data: {parentCode: 0},
          success: function (response) {
            _this.provinceList = response.data || [];
          }
        });
        //等级时薪
//        common.ajax({
//          url: SALARY().Level.getPayGradeByType,
//          method: 'get',
//          data: {natureOfWork: _this.Salary.workNature == 2 ? 2 :1},
//          success:function(res){
//            _this.salaryGradeList = res.data;
//          }
//        });
//        获取监课备注
        common.ajax({
          url: TEACHER().Detail.getTeacherNotes,
          method: 'get',
          data: {teacherUuid: _this.teacherUuid},
          success:function(res){
            if(res.data){
              _this.historyRemarksDate = [
                {
                  createDate:res.data.createDate || '',
                  teacherName:res.data.teacherName || '',
                  remark:res.data.remark || ''
                }
              ]
            }
          }
        });
        common.ajax({
          url: TEACHER().Detail.getByUuidToEdit,
          async: false,
          data: {uuid: _this.teacherUuid},
          success: function (res) {
            if (res.data) {
              _this.Base = {
                isDisabled: true,
                name: res.data.tcName,
                gender: res.data.sex,
                phone: res.data.phone,
                qq: res.data.qq,
                email: res.data.email,
                wechat: res.data.wechat,
                idCard: res.data.idNumber,
                address: res.data.address
              };
              _this.Gaokao.isDisabled = true;
              _this.Gaokao.province = res.data.province;
              _this.Gaokao.cityName = res.data.city;
              _this.Gaokao.area = res.data.district;
              _this.Gaokao.wlsubject = res.data.artsOrScience;

              _this.Xueli = {
                isDisabled: true,
                school: +res.data.schoolLocation + '',
                xueli: res.data.education,
                maxXueli: res.data.highestEducation,
                grade: res.data.grade,
                major: res.data.major,
              };
              _this.Preference = {
                isDisabled: true,
                teachingSubject: +res.data.teachingSubject + '',
                twoSubject: +res.data.secondSubject + '',
                threeSubject: +res.data.thirdSubject + '',
                gradePreference: res.data.gradePreference
              };
              _this.Bank = {
                isDisabled: true,
                bankName: +res.data.bank,
                cardNumber: res.data.cardNumber,
                openAccount: res.data.bankAddress,
              };
              _this.Salary = {
                isDisabled: true,
                workNature: res.data.natureOfWork,
                salaryLeval: res.data.payGrade,
                hourlyWage: res.data.hourlyWage
              };
            } else {
              common.notices('接口返回空数据！！'+res, '异常','error');
            }
            if(res.data.natureOfWork){
              let natureOfWorks = (res.data.natureOfWork == 2) ? 2 : 1;
              common.ajax({
                url: SALARY().Level.getPayGradeByType,
                method: 'get',
                noLoading: 'yes',
                data: {natureOfWork: natureOfWorks},
                success: function (response) {
                  let data = response.data;
                  if(data) {
                    _this.salaryGradeList = data || [];
                  }
                }
              });
            }
          }
        });
        $.getJSON("static/data.json", (json) => {
          _this.gradePreferenceList = json.gradePreferenceList;
          _this.xueLiGradeList = json.xueLiGradeList;
        });
      },
//      添加备注
      addRemarkOk(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const that = this;
            common.ajax({
              url: TEACHER().Detail.addTeacherNotes,
              data: {
                teacherUuid: that.teacherUuid,
                remark: that.validateRemark.remark
              },
              success: function (response) {
                common.notices('操作成功！！');
                that.hiInit();
                that.validateRemark.remark = '';
              }
            });
            this.historyRemarkModal = false;
          } else {
            setTimeout(() => {
              this.loading = true;
            }, 0);
          }
        });
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            let apiUrl = TEACHER().Detail.saveTeacherDetail;
            let checkType = "noCheck";
            let step = _this.$route.params.step;
            if (step === "waitPerfectInfo") {
              checkType = "checkAll";
            }
            if(step === "library") {
              apiUrl = TEACHER().Library.editDetail;
            }
            common.ajax({
              url: apiUrl,
              method: 'get',
              data: {
                checkType: checkType,
                uuid: _this.teacherUuid,
                natureOfWork: _this.Base.workNature,
                payGrade: _this.Base.salaryLeval,
                phone: _this.Base.phone,
                qq: _this.Base.qq,
                sex: _this.Base.gender,
                tcName: _this.Base.name,
                wechat: _this.Base.wechat,
                hourlyWage: _this.Base.hourlyWage,
                idNumber: _this.Base.idCard ? _this.Base.idCard.toLocaleUpperCase() : _this.Base.idCard,
                email: _this.Base.email,
                address: _this.Base.address,
                province: _this.Gaokao.province,
                city: _this.Gaokao.cityName,
                district: _this.Gaokao.area,
                artsOrScience: _this.Gaokao.wlsubject,
                education: _this.Xueli.xueli,
                grade: _this.Xueli.grade,
                schoolLocation: _this.Xueli.school,
                highestEducation: _this.Xueli.maxXueli,
                major: _this.Xueli.major,
                gradePreference: _this.Preference.gradePreference,
                subject: _this.Preference.teachingSubject,
                teachingSubject: _this.Preference.teachingSubject,
                secondSubject: _this.Preference.twoSubject,
                thirdSubject: _this.Preference.threeSubject,
                bank: _this.Bank.bank || _this.Bank.otherBank,
                bankAddress: _this.Bank.openAccount,
                cardNumber: _this.Bank.cardNumber,
                natureOfWork: _this.Salary.workNature,
                hourlyWage: _this.Salary.hourlyWage,
                payGrade: _this.Salary.salaryLeval
              },
              success: function (response) {
                common.notices('操作成功！！');
                if (name === "formValidatebank") {
                  _this.Bank.isDisabled = true;
                } else if (name === "formValidateGaokao") {
                  _this.Gaokao.isDisabled = true;
                } else if (name === "formValidateBase") {
                  _this.Base.isDisabled = true;
                } else if (name === "formValidateXueli") {
                  _this.Xueli.isDisabled = true;
                } else if (name === "formValidatePreference") {
                  _this.Preference.isDisabled = true;
                } else if (name === "formValidateSalary") {
                  _this.Salary.isDisabled = true;
                }
              }
            });
          } else {
            common.msg('表单验证失败!');
          }
        });
      },
      changeWorkNature(value) {
        const _this = this;
        let natureOfWork = (value == 2) ? 2 : 1;
        common.ajax({
          url: SALARY().Level.getPayGradeByType,
          method: 'get',
          noLoading: 'yes',
          data: {natureOfWork: natureOfWork},
          success: function (response) {
            let data = response.data;
            if(data) {
              _this.salaryGradeList = data;
            }
          }
        });
      },
      changeSalaryLeval(value) {
        const _this = this;
        common.ajax({
          url: SALARY().Level.getPayGradeById,
          method: 'get',
          noLoading: 'yes',
          data: {id: value},
          success: function (response) {
            let data = response.data;
            if(data) {
              _this.Salary.hourlyWage = data.hourlyWage;
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
            _this.cityArrays = response.data || [];
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
            _this.areaList = response.data || [];
          }
        });
      },
      changeBank(value) {
        this.Bank.bank = value.label;
      },
      changeOtherBank(event) {
        this.$refs.selectBank.clearSingleSelect();
        this.Bank.bankName = "";
        this.Bank.otherBank = event.target.value;
      }
    },
    components: {OBreadcrumb, oDivSplit, annex}
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
