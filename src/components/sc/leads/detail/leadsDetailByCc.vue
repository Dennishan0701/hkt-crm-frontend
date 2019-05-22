<template>
  <div>
    <o-breadcrumb second="学生详情"></o-breadcrumb>
    <h1 class="title">学生详情</h1>

    <div class="split-div">
      <div class="title">基本信息</div>
      <div class="btn" v-show='show'>
        <i-button :type="baseDisabled ? 'primary' : 'info'" size="small" @click="baseDisabled = !baseDisabled">{{editText}}</i-button>
        <i-button type="primary" size="small" v-show="!baseDisabled" @click="handleSubmit('formValidateBase')">保存</i-button>
      </div>
    </div>
    <i-form ref="formValidateBase" :model="Student" :label-width="80" :rules="ruleValidateBase" inline>
      <Form-item label="学生姓名" prop="name">
        <i-input v-model="Student.name" :disabled="baseDisabled" placeholder="学生姓名"></i-input>
      </Form-item>
      <Form-item label="手机号" prop="phone">
        <i-input :value="phoneNumber" :disabled="true" placeholder="手机号" style="width: 120px;"></i-input>
        <i-button type="ghost" icon="android-call" title="拨打号码" @click="callPhone(Student.phone)"></i-button>
        <!--<i-button type="success" icon="android-call" title="安莱拨打电话" @click="callAnLaiPhone(Student.phone)"></i-button>-->
        <!--<Icon type="android-call" @click="callPhone('${Student.phone}')" class="call" title="拨打电话"></Icon>-->
      </Form-item>
      <Form-item label="年级" prop="grade">
        <i-select v-model="Student.grade" :disabled="baseDisabled" placeholder="年级" style="width:200px">
          <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="科目" prop="subject">
        <i-select v-model="Student.subject" :disabled="baseDisabled" placeholder="科目" style="width:200px">
          <i-option v-for="(item,index) in subjectList" :key='index' :value="item.value">{{ item.value }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="省" prop="provinceId">
        <i-select v-model="Student.provinceId" :disabled="baseDisabled" :label-in-value="true" @on-change="changeSelectedCity" placeholder="省" style="width:172px">
          <i-option v-for="(item,index) in provinceList" :key='index' :value="item.id">{{ item.name }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="市" prop="cityId">
        <i-select v-model="Student.cityId" :disabled="baseDisabled" :label-in-value="true" @on-change="changeSelectedArea" placeholder="市" style="width:172px">
          <i-option v-for="(item,index) in cityArrays" :key='index' :value="item.id">{{ item.name }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="区" prop="countId">
        <i-select v-model="Student.countId" :disabled="baseDisabled" :label-in-value="true" @on-change="changeSelectedCount" placeholder="区" style="width:172px">
          <i-option v-for="(item,index) in areaList" :key='index' :value="item.id">{{ item.name }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="所在学校" prop="school">
        <i-select v-model="Student.school" :disabled="baseDisabled" placeholder="学校" style="width:200px">
          <i-option v-for="(item,index) in scrollList" :key='index' :value="item.schoolname">{{ item.schoolname }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="学校级别" prop="schoolLevel">
        <i-select v-model="Student.schoolLevel" :disabled="baseDisabled" placeholder="学校级别" style="width:200px">
          <i-option v-for="(item,index) in levelList" :key='index' :value="item.enumName">{{ item.enumName }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="年级排名" prop="gradeRank">
        <i-select v-model="Student.gradeRank" :disabled="baseDisabled" placeholder="年级排名" style="width:200px">
          <i-option v-for="(item,index) in rankList" :key='index' :value="item.enumName">{{ item.enumName }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="麦克风" prop="isHaveMic">
        <i-select v-model="Student.isHaveMic" :disabled="baseDisabled" placeholder="麦克风" style="width:200px">
          <i-option value=1>有</i-option>
          <i-option value=0>无</i-option>
        </i-select>
      </Form-item>
      <Form-item label="耳机" prop="isHaveHeadset">
        <i-select v-model="Student.isHaveHeadset" :disabled="baseDisabled" placeholder="耳机" style="width:200px">
          <i-option value=1>有</i-option>
          <i-option value=0>无</i-option>
        </i-select>
      </Form-item>
      <Form-item label="电脑" prop="isHaveComputer">
        <i-select v-model="Student.isHaveComputer" :disabled="baseDisabled" placeholder="电脑" style="width:200px">
          <i-option value=1>有</i-option>
          <i-option value=0>无</i-option>
        </i-select>
      </Form-item>
      <Form-item label="平板" prop="isHavePad">
        <i-select v-model="Student.isHavePad" :disabled="baseDisabled" placeholder="平板" style="width:200px">
          <i-option value=1>有</i-option>
          <i-option value=0>无</i-option>
        </i-select>
      </Form-item>
      <Form-item label="性别" prop="sex">
        <i-select v-model="Student.sex" :disabled="baseDisabled" placeholder="性别" style="width:200px">
          <i-option value=0>男</i-option>
          <i-option value=1>女</i-option>
        </i-select>
      </Form-item>
    </i-form>

    <div class="split-div">
      <div class="title">家长信息</div>
      <div class="btn" v-show='show'>
        <i-button :type="familyDisabled ? 'primary' : 'info'" size="small" @click="familyDisabled = !familyDisabled">{{editHtml}}</i-button>
        <i-button type="primary" size="small" v-show="!familyDisabled"  @click="familysSubmit">保存</i-button>
      </div>
    </div>
    <i-form :label-width="80" inline>
      <div v-for='(item,index) in familys' :key='index'>
        <Form-item label='家长关系'>
          <i-select v-model="item.familyRoleId" :disabled="familyDisabled" placeholder="家长关系" style="width:200px">
            <i-option v-for='(item1,index) in familysdData' :key='index' :value="item1.value">{{item1.label}}</i-option>
          </i-select>
        </Form-item>
        <Form-item label='手机号'>
          <i-input v-model="item.phone" :disabled="familyDisabled" placeholder="手机号" style="width:200px"></i-input>
        </Form-item>
          <i-button type="error"  :disabled="familyDisabled" @click="removeFamilys(index)" style="width:50px">删除</i-button>
      </div>
        <i-button type="primary"  :disabled="familyDisabled" @click="addFamilys" style="width:100px;margin-left: 20px">增加</i-button>
    </i-form>

    <div class="split-div">
      <div class="title">待跟进情况</div>
      <div class="btn" v-show='show'>
        <i-button type="primary" size="small" @click="recordCall">记录拨打</i-button>
      </div>
    </div>
    <i-table size="small" highlight-row stripe :columns="recordListColumns" :data="recordList"></i-table>
    <!--<table class="onlyhi-table">-->
      <!--<tr>-->
        <!--<th>接通状态</th>-->
        <!--<td>{{Student.connectStatus | connectstatusConver}}</td>-->
        <!--<th>详情</th>-->
        <!--<td>{{Student.connectResult}}</td>-->
        <!--&lt;!&ndash;<td>&ndash;&gt;-->
          <!--&lt;!&ndash;<template v-if="userTask.giveupStatus">&ndash;&gt;-->
            <!--&lt;!&ndash;是，{{userTask.giveupCause}}&ndash;&gt;-->
          <!--&lt;!&ndash;</template>&ndash;&gt;-->
          <!--&lt;!&ndash;<template v-else>否</template>&ndash;&gt;-->
        <!--&lt;!&ndash;</td>&ndash;&gt;-->
      <!--</tr>-->
    <!--</table>-->
    <div class="split-div">
      <div class="title">历史备注</div>
      <div class="btn" v-show='show'>
        <i-button type="primary" size="small" @click="historyRemarkModal = true">添加</i-button>
      </div>
    </div>
    <div style="margin:0 10px;">
      <i-table border stripe size="large" :columns="historyRemarksColumns" :data="historyRemarksDate"></i-table>
    </div>

    <o-div-split text="课程记录"></o-div-split>
    <div style="margin:0 10px 10px 10px;">
      <i-table border size="small" :columns="courseRecordColumns" :data="courseRecordData"></i-table>
    </div>

    <o-div-split text="学习方案附件"></o-div-split>
    <!--<table class="onlyhi-table">-->
      <!--<tr>-->
        <!--<th>文件名称</th>-->
        <!--<th>更新时间</th>-->
        <!--<th>操作</th>-->
      <!--</tr>-->
      <!--<tr v-if='assessmentGenerateTime'>-->
        <!--<td>学习力测评报告</td>-->
        <!--<td>{{assessmentGenerateTime}}</td>-->
        <!--<td><a :href="blank" target="_blank">查看</a></td>-->
      <!--</tr>-->
      <!--<tr v-else>-->
        <!--<td>学习力测评报告</td>-->
        <!--<td>暂无</td>-->
      <!--</tr>-->
    <!--</table>-->
    <i-table class="onlyhi-table" size="small" :columns="columnsRyTestAnalysis" :data="dataRyTestAnalysis"></i-table>
    <div class="btn-tools">
      <i-button icon="ios-arrow-back" @click="close" style="width:100px">返回</i-button>
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

    <record-call @reFresh="reFresh" ref="recordcall" v-on:connect="connectStatusSuccess"></record-call>

  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {MO} from 'common/api/mo.js';
  import {SCS} from 'common/api/scs.js';
  import {ANLAI} from 'common/api/anlai.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import oDivSplit from 'components/o/oDivSplit';
  import recordCall from 'components/sc/waitFollowed/recordCall';
  const $localStorage = $.localStorage;
  export default{
    data() {
      return {
        dataRyTestAnalysis:[],
        recordList:[],
        recordListColumns:[
          {
            title: '接通状态',
            align: 'center',
            key: 'callStatus',
            minWidth: 120,
            render(h, params) {
              if(params.row.callStatus ===  'create') {
                return h('span','新建')
              } else if(params.row.callStatus === 'wait') {
                return h('span','待拨打,待跟进')
              } else if(params.row.callStatus === 'noconnectwait') {
                return h('span','未接通,待跟进')
              } else if(params.row.callStatus === 'connectwait') {
                return h('span','已接通,待跟进')
              } else if(params.row.callStatus === 'successwait') {
                return h('span','已接通,同意排课')
              } else if(params.row.callStatus === 'noconnectgiveup') {
                return h('span','未接通,放弃')
              } else if(params.row.callStatus === 'connectgiveup') {
                return h('span','已接通,放弃')
              } else {
                return h('span','-')
              }
            }
          },
          {
            title: '详情',
            align: 'center',
            key: 'callResult',
            minWidth: 120,
          },
        ],
        columnsRyTestAnalysis: [
          {
            title: '文件名称',
            key: 'testPaperName',
            align: 'center',
            minWidth: 180,
          },
          {
            title: '更新时间',
            key: 'createDate',
            align:'center',
            minWidth:160,
            render(h, params) {
              return h('span', formateDate(params.row.createDate, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '操作',
            align: 'center',
            minWidth: 120,
            render: (h, params) => {
              if (params.row.reportUrl) {
                return h('div',[
                  h('Button',{
                    props:{
                      type:'success',
                      size:'small',
                    },
                    style:{
                      margin:'2px'
                    },
                    on:{
                      click:()=>{
                        window.location.href = params.row.reportUrl;
                      }
                    }
                  },'下载')
                ])
              } else {
                this.getReportRecord(params.row.reportRecordId)
                // return h('div',[
                //   h('Button',{
                //     props:{
                //       type:'success',
                //       size:'small',
                //     },
                //     attrs:{
                //       disabled:true,
                //     },
                //     style:{
                //       margin:'2px'
                //     },
                //     on:{
                //       click:()=>{
                //         // window.location.href = params.row.reportUrl;
                //       }
                //     }
                //   },'下载')
                // ])
              }
            }
          },
        ],
        blank:'',
        assessmentGenerateTime:'',
        testPaperName:'',
        historyRemarkModal: false,
        baseDisabled: true,
        familyDisabled: true,
        loading: true,
        leadsUuid: sessionStorage.getItem('template_uuid') || '',
        cityArrays: [],
        areaList: [],
        show:true,
        provinceList:[],
        scrollList:[],
        levelList:[],
        rankList:[],
        province:'',
        city:'',
        count:'',
        familys:[],
        familysdData:[],
        Student: {
          name: '',
          phone: '',
          grade: '',
          subject: '',
          connectStatus: '',
          connectResult: '',
          handoutDes: '暂无记录',
          provinceId:'',
          cityId:'',
          countId:'',
          school:'',
          schoolLevel:'',
          gradeRank:'',
          isHaveMic:'',
          isHaveHeadset:'',
          isHaveComputer:'',
          isHavePad:'',
          sex:''
        },
        validateRemark: {
          remark: ''
        },
        ruleValidateBase: {
          name: [
            {required: true, message: '姓名不能为空', trigger: 'change'}
          ],
          phone: [
            {required: true, message: '不能为空', trigger: 'change' }
          ],
          grade: [
            {required: true, message: '请选择年级', trigger: 'change'}
          ],
          subject: [
            {required: true, message: '请选择科目', trigger: 'change'}
          ],
          school: [
            {required: true, message: '请先选择省市区再选择所在学校', trigger: 'change'}
          ],
          schoolLevel: [
            {required: true, message: '请选择学校级别', trigger: 'change'}
          ],
          isHaveHeadset: [
            {required: true, message: '请选择有无耳机', trigger: 'change'}
          ],
          isHaveMic: [
            {required: true, message: '请选择有无麦克风', trigger: 'change'}
          ],
          isHaveComputer: [
            {required: true, message: '请选择有无电脑', trigger: 'change'}
          ],
          isHavePad: [
            {required: true, message: '请选择有无平板', trigger: 'change'}
          ],
          gradeRank: [
            {required: true, message: '请选择年级排名', trigger: 'change'}
          ],
          sex: [
            {required: true, message: '请选择性别', trigger: 'change'}
          ]
        },
        ruleValidateRemark: {
          remark: [
            {required: true, message: '请填写内容', trigger: 'blur'}
          ]
        },
        subjectList: [],
        gradeList: [],
        historyRemarksColumns: [
          {
            title: '备注时间',
            key: 'createDate',
            render(h, params) {
              return h('span',formateDate(params.row.createDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '备注人',
            key: 'userName',
          },
          {
            title: '内容',
            key: 'content',
          }
        ],
        courseRecordColumns: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '课程类型',
            key: 'courseType',
            render(h, params) {
              if(params.row.courseType == '0') {
                return h('span','测评课');
              } else {
                return h('span','正式课');
              }
            }
          },
          {
            title: '课程时长（h）',
            key: 'courseLength'
          },
          {
            title: '上课日期',
            key: 'courseDate',
          },
          {
            title: '上课时间',
            key: 'courseStartTime',
            render(h, params) {
              return h('span',(params.row.courseStartTime || '-')+' ~ '+(params.row.courseEndTime || '-'));
            }
          },
          {
            title: '老师姓名',
            key: 'teacherName',
          },
          {
            key: '操作',
            align: 'center',
            render : (h, params) => {
              if(params.row.courseType == '0') {
        return h('div',[
          h('Button', {
            props: {
              type: 'primary',
              size: 'small',
              icon: 'ghost',
            },
            style: {
              margin: '2px',
            },
            attrs:{
              title:''
            },
            on: {
              click: () => {
              this.viewRequirements(params.row.courseOrderUuid)
          }
      }
      },'查看排课要求')
      ])
//                return `<i-button type="ghost" type="small" @click="viewRequirements('${row.courseOrderUuid}')">查看排课要求</i-button>`
              }
            }
          },
          {
            title: '提交人',
            key: 'userName',
          }
        ],
        courseRecordData: [],
        historyRemarksDate: [],
        //student: {},
        userTask: {
          giveupStatus: ''
        }
      }
    },
    mounted() {
      this.hiInit();
      this.blank = `http://www.onlyeduhi.cn/test/test.html?onlymsg=${this.leadsUuid}`;
//      let _this = this;
//      setTimeout(function () {
////        _this.disabledColor()
//      },200)
    },
    computed: {
      phoneNumber() {
        return hideCharAtNumber(this.Student.phone)
      },
      editText() {
        return this.baseDisabled ? '编辑': '取消';
      },
      editHtml() {
        return this.familyDisabled ? '编辑': '取消';
      }
    },
    methods: {
      reFresh(){
        this.hiInit();
      },
//      修改禁用后字段显示颜色
      disabledColor(){
        let inputs = document.getElementsByClassName('ivu-input-disabled');
        let selects = document.getElementsByClassName('ivu-select-selected-value');
        let selectp = document.getElementsByClassName('ivu-select-placeholder');
          for(let i = 0; i<inputs.length;i++){
            inputs[i].style.color = '#000'
            console.log(inputs[i]);
          }
          for(let j = 0; j<selects.length;j++){
            selects[j].style.color = '#000'
            console.log(selects[j]);
          }
          for(let j = 0; j<selectp.length;j++){
            selectp[j].style.color = '#000'
            console.log(selectp[j]);
          }
      },
      hiInit() {
        const _this = this;
        //获取家长关系
        $.getJSON("static/data.json",function (res) {
            _this.familysdData = res.familys
        })
        common.ajax({
          method: 'get',
          url: MO().Leads.detailByCc,
          data: {leadsUuid: _this.leadsUuid},
          success: function(res) {
            _this.courseRecordData = res.data.courseRecord;
            // _this.historyRemarksDate = res.data.lpRemarks;
            _this.Student = res.data.student;
            // _this.Student.connectStatus = res.data.leadsCallRecordList.callStatus;
            // _this.Student.connectResult = res.data.leadsCallRecordList.callResult;
            _this.recordList = res.data.leadsCallRecordList||[];
            _this.userTask = res.data.userTask||'';
            _this.Student.provinceId = res.data.student.provinceId || '';
            _this.Student.cityId = res.data.student.cityId || '';
            _this.Student.countId = res.data.student.countId || '';
            _this.province = res.data.student.province || '';
            _this.city = res.data.student.city || '';
            _this.count = res.data.student.count || '';
            //测评报告更新时间
            // _this.assessmentGenerateTime = res.data.assessmentGenerateTime;
            //家庭成员联系方式
            _this.familys = res.data.families || [];
          }
        });
        //获取历史备注数据请求地址更新--2018.10.11
        common.ajax({
          method: 'get',
          url: MO().Leads.detailByCcNew,
          data: {leadsUuid: _this.leadsUuid},
          success: function(res) {
            // _this.courseRecordData = res.data.courseRecord;
            _this.historyRemarksDate = res.data.lpRemarks;
            // _this.Student = res.data.student;
            // _this.userTask = res.data.userTask;
            // _this.Student.provinceId = res.data.student.provinceId || '';
            // _this.Student.cityId = res.data.student.cityId || '';
            // _this.Student.countId = res.data.student.countId || '';
            // _this.province = res.data.student.province || '';
            // _this.city = res.data.student.city || '';
            // _this.count = res.data.student.count || '';
            // console.log(res.data.student.count);
            // //测评报告更新时间
            // // _this.assessmentGenerateTime = res.data.assessmentGenerateTime;
            // //家庭成员联系方式
            // _this.familys = res.data.families || [];
          }
        });
        if(sessionStorage.getItem('template_show') ==0){
          _this.show = false;
        }
        // 获得学习方案附件
        common.ajax({
          url: MO().Leads.getRyUpgradeReportByLeadsUuid,
          data: {
            leadsUuid: _this.leadsUuid,
          },
          method: 'post',
          success: function (res) {
            _this.dataRyTestAnalysis = res.data.ryUpgradeReportList;
          }
        });
        //获取科目年级
        $.getJSON("static/data.json", function (json) {
          _this.gradeList = json.gradeList;
          _this.subjectList = json.subjectList;
        });
        //获取年级排名
        common.ajax({
          url: COMMON_API().getGradeRank,
          method: 'get',
          data: {parentCode: 0},
          success: function (response) {
            _this.rankList = response.data;
          }
        });
        //获取学校等级
        common.ajax({
          url: COMMON_API().getShoolLevel,
          method: 'get',
          data: {parentCode: 0},
          success: function (response) {
            _this.levelList = response.data || [];
          }
        });
        //获取省
        common.ajax({
          url: COMMON_API().ssqAreaAllStudy,
          method: 'get',
          data: {parentid: 1},
          success: function (response) {
            _this.provinceList = response.data || [];
          }
        });
      },
      changeSelectedCity(areaName) {
        const _this = this;
        _this.province = areaName.label;
        //获取城市
        common.ajax({
          url: COMMON_API().ssqAreaAllStudy,
          method: 'get',
          data: {parentid: areaName.value},
          success: function (response) {
            _this.cityArrays = response.data;
          }
        });
      },
      changeSelectedArea(areaName) {
        const _this = this;
        //获取城市的区域
        console.log(areaName.label);
        if(areaName.label){
          _this.city = areaName.label;
        }
        common.ajax({
          url: COMMON_API().ssqAreaAllStudy,
          method: 'get',
          data: {parentid: areaName.value},
          success: function (response) {
            _this.areaList = response.data || [];
          }
        });
      },
      changeSelectedCount(areaName){
        const _this = this;
        console.log(areaName.label);
        if(areaName.label){
          _this.count = areaName.label;
        }
        //获取所有学校
        console.log(areaName);
        common.ajax({
          url: COMMON_API().allStudySchool,
          method: 'get',
          data: {provinceId:_this.Student.provinceId,cityId: _this.Student.cityId,countyId:areaName.value},
          success: function (response) {
            _this.scrollList = response.data || [];
          }
        });
      },
      removeFamilys(index){
        const _this = this;
        _this.familys.splice(index,1)
      },
      addFamilys(){
        const _this = this;
        _this.familys.push(
          {phone:'',familyRoleId:'',familyRoleName:''},
        )
      },
      familysSubmit(){
        const _this = this;
        console.log(_this.familys);
        let parem='';
        _this.familys.forEach(function (v,i) {
          parem +=v.familyRoleId+','+v.phone+';'
        })
        console.log(parem);
        common.ajax({
          url: SCS().MyStudent.editLeadsFamily,
          data: {
            leadsUuid: _this.leadsUuid,
            familys: parem,
          },
          success: function (response) {
            common.notices('操作成功！！');
            _this.familyDisabled = true;
            _this.hiInit();
          },
          successError:function (res) {
            common.msg('请补全信息');
          }
        });
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            common.ajax({
              url: MO().Leads.updateDetail,
              data: {
                uuid: _this.leadsUuid||'',
                name: _this.Student.name||'',
                grade: _this.Student.grade||'',
                subject: _this.Student.subject||'',
                province:_this.province||'',
                city:_this.city||'',
                count:_this.count||'',
                provinceId:_this.Student.provinceId||'',
                cityId:_this.Student.cityId||'',
                countId:_this.Student.countId||'',
                school:_this.Student.school||'',
                schoolLevel:_this.Student.schoolLevel||'',
                gradeRank:_this.Student.gradeRank||'',
                isHaveMic:_this.Student.isHaveMic||'',
                isHaveHeadset:_this.Student.isHaveHeadset||'',
                isHaveComputer:_this.Student.isHaveComputer||'',
                isHavePad:_this.Student.isHavePad||'',
                sex:_this.Student.sex||'',
              },
              success: function (response) {
                common.notices('操作成功！！');
                _this.baseDisabled = true;
              }
            });
          } else {
            const _this = this;
            console.log(_this.Student);
            common.msg('表单验证失败!');
          }
        });
      },
      addRemarkOk(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            common.ajax({
              url: SCS().WaitFollowed.addRemark,
              data: {
                leadsPhone: _this.Student.phone,
                uesrUuid: storage.get('user').uuid,
                content: _this.validateRemark.remark
              },
              success: function (response) {
                common.notices('操作成功！！');
                _this.hiInit();
                _this.validateRemark.remark = '';
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
      recordCall() {
        this.$refs.recordcall.show(this.leadsUuid, this.Student.connectStatus);
      },
      callAnLaiPhone(phone){
        let anLaiAccout = $localStorage.get('anLaiAccout');
        if (anLaiAccout) {
          common.ajax({
            url: ANLAI().CallPhone.call,
            data: {
              userLogin: anLaiAccout.userLogin,
              userPass: anLaiAccout.userPass,
              phoneLogin: anLaiAccout.phoneLogin,
              phonePass: anLaiAccout.phonePass,
              phoneNumber: phone,
            },
            success(res) {
              common.msg('拨打成功', 'success');
            }
          });
        } else {
          common.msg('未登录安莱账号！！！', 'error');
        }
      },
      callPhone(phone) {
        let user = storage.get('user');
        if(user && user.seatsNo) {
          common.ajax({
            url: COMMON_API().Phone.callPhone,

            data: {
              hotline: user.hotlinePhone,
              cno: user.seatsNo,//坐席号
              pwd: user.seatsPassword,
              phone: phone
            },
            success(res) {
              common.msg('拨打成功','success');
            }
          });
        }else{
          common.msg('座席号不存在','error');
        }
      },
      viewRequirements(courseOrderUuid) {
        sessionStorage.setItem('waitCourse_viewRequirements_courseUuid',courseOrderUuid);
        window.location.hash = '/scs/ccViewRequirements';
      },
      close() {
        window.history.back();
      },
      connectStatusSuccess(val) {
      	if(val) {
          console.log('执行了connectStatusSuccess方法.............');
          this.hiInit();
        }
      },
      // 生成提分策
      getReportRecord(reportRecord){
        common.ajax({
          url: MO().Leads.createUpgradeReportByReportRecordId,
          data: {
            reportRecordId: reportRecord,
          },
          method: 'post',
          success: function (res) {
            console.log(res)
            // window.location.reload();
          }
        });
      },
    },
    filters: {
      connectstatusConver(connectstatu) {
        switch (connectstatu) {
          case 'create':
            return '新建';
          case 'wait':
            return '待拨打,待跟进';
          case 'noconnectwait':
            return '未接通,待跟进';
          case 'connectwait':
            return '已接通,待跟进';
          case 'successwait':
            return '已接通,同意排课';
          case 'noconnectgiveup':
            return '未接通,放弃';
          case 'connectgiveup':
            return '已接通,放弃';
          default:
            return '-';
        }
      }
    },
    components: {OBreadcrumb, oDivSplit, recordCall}
  };
</script>

<style scoped>
  .onlyhi-table{margin-left:12px;width: 98% !important;}
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
  .btn-tools{width:600px;text-align:center;margin-top:30px;margin-left:50px;}
</style>
