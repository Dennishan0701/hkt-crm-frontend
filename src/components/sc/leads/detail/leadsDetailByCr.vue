<template>
  <div>
    <o-breadcrumb second="学生详情"></o-breadcrumb>
    <h1 class="title">学生详情</h1>

    <div class="split-div">
      <div class="title">基本信息</div>
      <div class="btn">
        <i-button type="info" size="small" @click="baseDisabled = !baseDisabled">{{editText}}</i-button>
        <i-button type="primary" size="small" v-show="!baseDisabled" @click="handleSubmit('formValidateBase')">保存</i-button>
      </div>
    </div>
    <i-form ref='formValidateBase' :model="Student" :label-width="80" :rules="ruleValidateBase" inline>
      <Form-item label="学生姓名" prop="name">
        <i-input v-model="Student.name" :disabled="baseDisabled" placeholder="学生姓名"></i-input>
      </Form-item>
      <Form-item label="手机号" prop="phone">
        <i-input v-model="Student.phone" :disabled="true" placeholder="手机号"></i-input>
      </Form-item>
      <Form-item label="年级" prop="grade">
        <i-select v-model="Student.grade" :disabled="baseDisabled" placeholder="年级" style="width:200px">
          <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="科目" prop="subject">
        <i-select v-model="Student.subject" :disabled="baseDisabled" placeholder="科目" style="width:200px">
          <i-option v-for="(item,index) in subjectList" :key='index' :value="item">{{ item }}</i-option>
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
        <i-select v-model="Student.isHaveMic" :disabled="baseDisabled" placeholder="科目" style="width:200px">
          <i-option value=1>有</i-option>
          <i-option value=0>无</i-option>
        </i-select>
      </Form-item>
      <Form-item label="耳机" prop="isHaveHeadset">
        <i-select v-model="Student.isHaveHeadset" :disabled="baseDisabled" placeholder="科目" style="width:200px">
          <i-option value=1>有</i-option>
          <i-option value=0>无</i-option>
        </i-select>
      </Form-item>
      <Form-item label="电脑" prop="isHaveComputer">
        <i-select v-model="Student.isHaveComputer" :disabled="baseDisabled" placeholder="科目" style="width:200px">
          <i-option value=1>有</i-option>
          <i-option value=0>无</i-option>
        </i-select>
      </Form-item>
      <Form-item label="平板" prop="isHavePad">
        <i-select v-model="Student.isHavePad" :disabled="baseDisabled" placeholder="科目" style="width:200px">
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
        <i-button :type="familyDisabled ? 'primary' : 'info'" size="small" @click="familyDisabled = !familyDisabled">{{editText}}</i-button>
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
      <div class="title">成绩情况</div>
      <div class="btn" v-show='show'>
        <i-button type="primary" size="small" @click="scoreSubmit">添加成绩</i-button>
      </div>
    </div>
    <div style="margin:0 10px 10px 10px;">
      <Tabs size="small">
        <Tab-pane label="全部">
          <i-table size="small" :columns="scoreColumns" :data="scoreData"></i-table>
        </Tab-pane>
        <Tab-pane label="语文">
          <i-table size="small" :columns="scoreColumns" :data="scoreChinese"></i-table>
        </Tab-pane>
        <Tab-pane label="数学">
          <i-table size="small" :columns="scoreColumns" :data="scoreMath"></i-table>
        </Tab-pane>
        <Tab-pane label="英语">
          <i-table size="small" :columns="scoreColumns" :data="scoreEnglish"></i-table>
        </Tab-pane>
        <Tab-pane label="物理">
          <i-table size="small" :columns="scoreColumns" :data="scorePhysical"></i-table>
        </Tab-pane>
        <Tab-pane label="历史">
          <i-table size="small" :columns="scoreColumns" :data="scoreHistory"></i-table>
        </Tab-pane>
        <Tab-pane label="生物">
          <i-table size="small" :columns="scoreColumns" :data="scoreBiology"></i-table>
        </Tab-pane>
        <Tab-pane label="化学">
          <i-table size="small" :columns="scoreColumns" :data="scoreChemistry"></i-table>
        </Tab-pane>
        <Tab-pane label="政治">
          <i-table size="small" :columns="scoreColumns" :data="scorePolitics"></i-table>
        </Tab-pane>
        <Tab-pane label="科学">
          <i-table size="small" :columns="scoreColumns" :data="scoreScience"></i-table>
        </Tab-pane>
      </Tabs>
    </div>
    <o-div-split text="课表"></o-div-split>
    <div style="margin:0 10px 10px 10px;">
      <i-table size="small" :columns="courseTableColumns" :data="courseTableData"></i-table>
    </div>

    <o-div-split text="课时消耗"></o-div-split>
    <div style="margin:0 10px 10px 10px;">
      <i-table size="small" :columns="courseClassColumns" :data="courseClassData"></i-table>
    </div>

    <o-div-split text="学习方案附件"></o-div-split>
    <!--<table class="onlyhi-table">-->
      <!--<tr>-->
        <!--<th>文件名称</th>-->
        <!--<th>更新时间</th>-->
        <!--<th>操作</th>-->
      <!--</tr>-->
      <!--<tr v-if='testPaperName'>-->
        <!--<td>{{testPaperName}}</td>-->
        <!--<td>{{assessmentGenerateTime}}</td>-->
        <!--<td><a :href="blank" target="_blank">查看</a></td>-->
      <!--</tr>-->
      <!--<tr v-else>-->
        <!--<td>学习力测评报告</td>-->
        <!--<td>暂无</td>-->
      <!--</tr>-->
    <!--</table>-->
    <i-table class="onlyhi-table" size="small" :columns="columnsRyTestAnalysis" :data="dataRyTestAnalysis"></i-table>
    <o-div-split text="移交备注"></o-div-split>
    <table class="onlyhi-table">
      <thead>
      <tr>
        <th>备注时间</th>
        <th>内容</th>
        <th>是否转介绍</th>
        <th>是否绑定账号</th>
        <th>备注人</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>{{baseHandOutRemartVo.remarkTime | convertDate}}</td>
        <td>{{baseHandOutRemartVo.content}}</td>
        <td>{{baseHandOutRemartVo.isIntroduced}}</td>
        <td>{{baseHandOutRemartVo.isBound}}</td>
        <td>{{baseHandOutRemartVo.userName}}</td>
      </tr>
      </tbody>
    </table>

    <div class="split-div">
      <div class="title">历史备注</div>
      <div class="btn">
        <i-button type="info" size="small" @click="historyRemarkModal = true">添加</i-button>
      </div>
    </div>
    <div style="margin:0 10px;">
      <i-table border stripe size="large" :columns="historyRemarksColumns" :data="historyRemarksDate"></i-table>
    </div>

    <o-div-split text="订单信息"></o-div-split>
    <div style="margin:0 10px 10px 10px;">
      <i-table size="small" :columns="orderInfoColumns" :data="orderInfoData"></i-table>
    </div>

    <o-div-split text="课程记录"></o-div-split>
    <div style="margin:0 10px 10px 10px;">
      <i-table size="small" :columns="courseRecordColumns" :data="courseRecordData"></i-table>
    </div>

    <div class="txt-center">
      <i-button type="info" icon="ios-arrow-back" @click="back">返回</i-button>
    </div>


    <Modal
      v-model="historyRemarkModal"
      title="添加备注"
      :loading = "loading"
      @on-ok="addRemarkOk('formValidateRemark')">
      <i-form ref='formValidateRemark' :model="validateRemark" :rules="ruleValidateRemark">
        <Form-item prop="remark">
          <i-input type="textarea" v-model="validateRemark.remark" :rows="4" :maxlength="500"></i-input>
        </Form-item>
      </i-form>
    </Modal>
<!--新增成绩-->
    <score-modal @reFresh="reFresh"  ref='score'></score-modal>
<!--补课-->
    <make-up-course @reFresh="reFresh"  ref='makeup'></make-up-course>
    <!--排课-->
    <create-course @reFresh="reFresh"  ref='create'></create-course>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {MO} from 'common/api/mo.js';
  import {SCS} from 'common/api/scs.js';
  import {formateDate,common} from 'common/js/common.js';
  import createCourse from 'components/sc/waitFirstCourse/createCourse';
  import makeUpCourse from 'components/sc/waitFirstCourse/makeUpCourse';//补课
  import scoreModal from './scoreModal';//添加成绩
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import oDivSplit from 'components/o/oDivSplit';
  const storage = $.localStorage;
  export default{
    data() {
      return {
        dataRyTestAnalysis:[],
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
        show:true,
        leadsUuid: sessionStorage.getItem('template_uuid') || '',
        cityArrays: [],
        areaList: [],
        provinceList:[],
        scrollList:[],
        levelList:[],
        rankList:[],
        familys:[],
        familysdData:[],
        province:'',
        city:'',
        count:'',
        Student: {
          name: '',
          phone: '',
          grade: '',
          subject: '',
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
        baseHandOutRemartVo: {},//移交备注
        historyRemarksDate: [],//历史备注
        scoreData: [],//学习情况
        scoreChinese:[],
        scoreMath:[],
        scoreEnglish:[],
        scorePhysical:[],
        scoreHistory:[],
        scoreBiology:[],
        scoreChemistry:[],
        scorePolitics:[],
        scoreScience:[],
        scoreColumns: [//学习情况
          {
            title: '序号',
            type: 'index',
            width:60,
          },
          {
            title: '录入时间',
            key: 'createDate',
            render(h, params) {
              return h('span',formateDate(params.row.createTime,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '科目',
            key: 'subject',
          },
          {
            title: '得分/满分',
            key: 'score',
            render(h, params) {
              return h('span',params.row.score+'/'+params.row.fullScore)
            }
          },
          {
            title: '考试类型',
            key: 'scoreType',
          },
        ],
        historyRemarksColumns: [//历史备注
          {
            title: '备注时间',
            key: 'createDate',
            render(h, params) {
              return h('span',formateDate(params.row.remarkTime,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '备注人',
            key: 'userName',
          },
          {
            title: '内容',
            key: 'content',
          },
        ],
        orderInfoData: [],//订单信息
        orderInfoColumns: [//订单信息
          {
            title: '订单号',
            key: 'orderNo'
          },
          {
            title: '支付方式',
            key: 'payType',
            render(h, params) {
              if(params.row.payType === 'taobao') {
                return h('span','淘宝')
              } else if(params.row.payType === 'bank') {
                return h('span','银行转账')
              } else if(params.row.payType === 'alipay') {
                return h('span','支付宝')
              } else if(params.row.payType === 'weixin') {
                return h('span','微信')
              }else if(params.row.payType === 'kuStaging') {
                return h('span','库分期')
              } else if(params.row.payType === 'baiduStaging') {
                return h('span','百度分期')
              } else if(params.row.payType === 'lovehaimi') {
                return h('span','爱海米分期')
              } else {
                return h('span',params.row.payType)
              }
            }
          },
          {
            title: '课时',
            key: 'length'
          },
          {
            title: '优惠码',
            key: 'promotionCode'
          },
          {
            title: '参与活动',
            key: 'promotionName'
          },
          {
            title: '金额',
            key: 'money'
          },
          {
            title: '成交/审核通过时间',
            key: 'payTime',
            render(h, params) {
              return h('span',formateDate(params.row.payTime,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '签单销售',
            key: 'userName'
          }
        ],
        courseRecordData: [],//课程记录
        courseRecordColumns: [//课程记录
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '年级',
            key: 'grade'
          },
          {
            title: '科目',
            key: 'subject'
          },
          {
            title: '课程类型',
            key: 'type',
            render(h, params) {
              if(params.row.type == '0') {
                return h('span','测评课');
              } else {
                return h('span','正式课');
              }
            }
          },
          {
            title: '课时级别',
            key: 'level',
            render(h, params) {
              if(params.row.level == '0') {
                return h('span','普通');
              } else if(params.row.level == '1') {
                return h('span','清北');
              } else if(params.row.level == '2') {
                return h('span','明星');
              } else {
                return h('span',params.row.level);
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
              return h('span',(params.row.startTime || '-')+' ~ '+(params.row.endTime || '-'));
            }
          },
          {
            title: '老师姓名',
            key: 'teacherName',
          },
          {
            title: '提交人',
            key: 'userName',
          },
          {
            title: '操作',
            align: 'center',
            render : (h, params) => {
              if(params.row.type == '0') {
                return h('div',[
                  h('Button', {
                    props: {
                      size: 'small',
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
//                return `<i-button size="small" @click="viewRequirements('${row.courseOrderUuid}')">查看排课要求</i-button>`
              }
            }
          }
        ],
        courseTableData: [],//课表
        courseTableColumns: [//课表
          {
            title: '年级',
            minWidth:90,
            key: 'grade'
          },
          {
            title: '科目',
            minWidth:90,
            key: 'subject'
          },
          {
            title: '老师姓名',
            minWidth:90,
            key: 'teacherName'
          },
          {
            title: '老师简介',
            minWidth:120,
            key: 'teacherDes'
          },
          {
            title: '课时类别',
            minWidth:90,
            key: 'courseLevel',
          },
          {
            title: '已上课时',
            minWidth:90,
            key: 'haveCourseLength'
          },
          {
            title: '操作',
            align: 'center',
            minWidth:180,
            render : (h, params) => {
              return h('div',[
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs:{
                    title:'补课'
                  },
                  on: {
                    click: () => {
                      this.makeUpCourse(params.row.courseOrderUuid,params.row.courseRequestUuid,params.row.payUuid,params.row.leadsUuid,params.row.teacherUuid)
                    }
                  }
                },'补课'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs:{
                    title:'开课'
                  },
                  on: {
                    click: () => {
                      this.createCourse(params.row.leadsUuid,params.row.courseOrderUuid,params.row.payUuid,params.row.courseRequestUuid,params.row.teacherUuid)
                    }
                  }
                },'开课'),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs:{
                    title:'扩科'
                  },
                  on: {
                    click: () => {
                      this.appointment(params.row.leadsUuid,'2')
                    }
                  }
                },'扩科'),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs:{
                    title:'预约新课程'
                  },
                  on: {
                    click: () => {
                      this.appointment(params.row.leadsUuid,'0')
                    }
                  }
                },'预约新课程'),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs:{
                    title:'换科换老师'
                  },
                  on: {
                    click: () => {
                      this.appointment(params.row.leadsUuid,'1',params.row.courseOrderUuid)
                    }
                  }
                },'换科换老师'),
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs:{
                    title:'查看课程'
                  },
                  on: {
                    click: () => {
                      this.viewCourseCr(params.row.courseOrderUuid)
                    }
                  }
                },'查看课程')
              ])
//              return `<i-button type="info" size="small" title="补课" @click="makeUpCourse('${row.courseOrderUuid}','${row.courseRequestUuid}','${row.payUuid}','${row.leadsUuid}','${row.teacherUuid}')">补课</i-button>
//                <i-button type="primary" size="small" @click="createCourse('${row.leadsUuid}','${row.courseOrderUuid}','${row.payUuid}','${row.courseRequestUuid}','${row.teacherUuid}')">开课</i-button>
//                <i-button type="success" size="small" @click="appointment('${row.leadsUuid}','2')">扩科</i-button>
//                <i-button type="success" size="small" @click="appointment('${row.leadsUuid}','0')">预约新课程</i-button>
//                <i-button type="success" size="small" @click="appointment('${row.leadsUuid}','1','${row.courseOrderUuid}')">换科换老师</i-button>
//                <i-button type="info" size="small" @click="viewCourseCr('${row.courseOrderUuid}')">查看课程</i-button>`;
            }
          }
        ],
        courseClassData: [],//课表
        courseClassColumns: [//课表
          {
            title: '类型',
            key: 'courseLevel',
            align:'center'
          },
          {
            title: '已上课时（h）',
            key: 'haveCourseLength',
            align:'center'
          },
          {
            title: '剩余课时（h）',
            key: 'remainderCourseLength',
            align:'center'
          },
        ],
      }
    },
    mounted() {
      this.hiInit();
      this.blank = `https://www.onlyeduhi.cn/test/test.html?onlymsg=${this.leadsUuid}`;
    },
    computed: {
      editText() {
        return this.baseDisabled == true ? '编辑': '取消';
      }
    },
    methods: {
      hiInit() {
        const that = this;
        //获取家长关系
        $.getJSON("static/data.json",function (res) {
          that.familysdData = res.familys
        })
        common.ajax({
          method: 'get',
          url: MO().Leads.detailByCr,
          data: {leadsUuid: that.leadsUuid},
          success: function(res) {
            //基本信息
            that.Student = res.data.baseStudentBaseVo;
            that.Student.provinceId = res.data.baseStudentBaseVo.provinceId || '';
            that.Student.cityId = res.data.baseStudentBaseVo.cityId || '';
            that.Student.countId = res.data.baseStudentBaseVo.countId || '';
            that.province = res.data.baseStudentBaseVo.province || '';
            that.city = res.data.baseStudentBaseVo.city || '';
            that.count = res.data.baseStudentBaseVo.count || '';
//            that.Student.name = res.data.baseStudentBaseVo.name;
//            that.Student.phone = res.data.baseStudentBaseVo.phone;
//            that.Student.grade = res.data.baseStudentBaseVo.grade;
//            that.Student.subject = res.data.baseStudentBaseVo.subject;
            //移交备注
            that.baseHandOutRemartVo = res.data.baseHandOutRemartVo;
            //历史备注
            that.historyRemarksDate = res.data.baseHistoryRemarkVos;
            //订单信息
            that.orderInfoData = res.data.baseOrderInfoVos;
            //课表
            that.courseTableData = res.data.baseCourseSubjectVos;
            //课时
            that.courseClassData = res.data.baseCourseClassHourVos;
            //课程记录
            that.courseRecordData = res.data.baseCourseRecordVos;
            //学生成绩
            that.scoreData = res.data.leadsScoreInfos || [];
            // that.scoreChinese = res.data.leadsScoreInfos || [];
            res.data.leadsScoreInfos.forEach(function (value,index) {
              if(value.subject == '语文'){
                that.scoreChinese.push(value);
              }else if(value.subject == '数学'){
                that.scoreMath.push(value);
              }else if(value.subject == '英语'){
                that.scoreEnglish.push(value);
              }else if(value.subject == '物理'){
                that.scorePhysical.push(value);
              }else if(value.subject == '历史'){
                that.scoreHistory.push(value);
              }else if(value.subject == '生物'){
                that.scoreBiology.push(value);
              }else if(value.subject == '化学'){
                that.scoreChemistry.push(value);
              }else if(value.subject == '政治'){
                that.scorePolitics.push(value);
              }else if(value.subject == '科学'){
                that.scoreScience.push(value);
              }
            })
            //测评报告更新时间
            // that.assessmentGenerateTime = res.data.assessmentGenerateTime;
            //家庭成员联系方式
            that.familys = res.data.families || [];
//            姓名
            sessionStorage.setItem('appointment_leadsName', res.data.baseStudentBaseVo.name);
          }
        });
        // 获得学习方案附件
        common.ajax({
          url: MO().Leads.getRyUpgradeReportByLeadsUuid,
          data: {
            leadsUuid: that.leadsUuid,
            // leadsUuid: 'C50DCFE9-C43C-48D4-8E44-A25D0B359258',
          },
          method: 'post',
          success: function (res) {
            that.dataRyTestAnalysis = res.data.ryUpgradeReportList;
          }
        });
        //获取科目列表;
        common.ajax({
          url: COMMON_API().allSubject,
          method: 'get',
          success: function (res) {
            that.subjectList = res.data || [];
          }
        });
        //获取年级
        $.getJSON("static/data.json", function (json) {
          that.gradeList = json.gradeList;
        });
        //获取年级排名
        common.ajax({
          url: COMMON_API().getGradeRank,
          method: 'get',
          data: {parentCode: 0},
          success: function (response) {
            that.rankList = response.data || [];
          }
        });
        //获取学校等级
        common.ajax({
          url: COMMON_API().getShoolLevel,
          method: 'get',
          data: {parentCode: 0},
          success: function (response) {
            that.levelList = response.data || [];
          }
        });
        //获取省
        common.ajax({
          url: COMMON_API().ssqAreaAllStudy,
          method: 'get',
          data: {parentid: 1},
          success: function (response) {
            that.provinceList = response.data || [];
          }
        });
      },
      changeSelectedCity(areaName) {
        const _this = this;
        console.log(areaName.label);
        _this.province = areaName.label;
        //获取城市
        common.ajax({
          url: COMMON_API().ssqAreaAllStudy,
          method: 'get',
          data: {parentid: areaName.value},
          success: function (response) {
            _this.cityArrays = response.data || [];
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
        if(areaName){
          console.log(1);
        }else {
          console.log(2);
        }
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
            const that = this;
            common.ajax({
              url: MO().Leads.updateDetail,
              data: {
                uuid: that.leadsUuid,
                name: that.Student.name,
                grade: that.Student.grade,
                subject: that.Student.subject,
                subject: that.Student.subject,
                province:that.province,
                city:that.city,
                count:that.count,
                provinceId:that.Student.provinceId,
                cityId:that.Student.cityId,
                countId:that.Student.countId,
                school:that.Student.school,
                schoolLevel:that.Student.schoolLevel,
                gradeRank:that.Student.gradeRank,
                isHaveMic:that.Student.isHaveMic,
                isHaveHeadset:that.Student.isHaveHeadset,
                isHaveComputer:that.Student.isHaveComputer,
                isHavePad:that.Student.isHavePad,
                sex:that.Student.sex,
              },
              success: function (response) {
                common.notices('操作成功！！');
                that.baseDisabled = true;
              }
            });
          } else {
            common.msg('表单验证失败!');
          }
        });
      },
      scoreSubmit(){
        this.scoreData = [];
        this.scoreMath = [];
        this.scoreChinese = [];
        this.scoreEnglish = [];
        this.scorePhysical = [];
        this.scoreHistory = [];
        this.scoreBiology = [];
        this.scoreChemistry = [];
        this.scorePolitics = [];
        this.scoreScience = [];
        this.$refs.score.show(this.leadsUuid);
      },
      addRemarkOk(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const that = this;
            common.ajax({
              url: SCS().WaitFollowed.addRemark,
              data: {
                leadsPhone: that.Student.phone,
                leadsUuid: that.leadsUuid,
                uesrUuid: storage.get('user').uuid,
                content: that.validateRemark.remark
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
      viewRequirements(courseOrderUuid) {
        sessionStorage.setItem('waitCourse_viewRequirements_courseUuid',courseOrderUuid);
        window.location.hash = '/scs/ccViewRequirements';
      },
      //补课
      makeUpCourse(courseOrderUuid,courseRequestUuid,payUuid,leadsUuid,teacherUuid) {//补课
        this.$refs.makeup.show(courseOrderUuid,courseRequestUuid,payUuid,leadsUuid,teacherUuid);
      },
      createCourse(leadsUuid,courseorderUuid,payUuid,courseRequestUuid,teacherUuid) {
        this.$refs.create.show(leadsUuid,courseorderUuid,payUuid,courseRequestUuid,teacherUuid);
      },

      appointment(uuid,orderType,courseOrderUuid) {
        sessionStorage.setItem('appointment_leadsUuid', uuid);
        sessionStorage.setItem('appointment_orderType', orderType);
        sessionStorage.setItem('appointment_uuid', courseOrderUuid);
        sessionStorage.setItem('appointment_parent_menu_name', '我的学生');
        sessionStorage.setItem('appointment_parent_menu_url', '/leads/leadsDetail/cr');
        window.location.hash = '/scs/appointment';
      },
      viewCourseCr(uuid) {
        sessionStorage.setItem('appointment_courseOrderUuid', uuid);
        window.location.hash = '/scs/leadsDetailByCr';
      },
      back() {
        window.history.back();
      },
      reFresh(){
        this.hiInit();
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
      convertDate(value) {
        return formateDate(value,'yyyy-MM-dd hh:mm:ss');
      }
    },
    components: { OBreadcrumb, oDivSplit, createCourse , makeUpCourse , scoreModal}
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
</style>
