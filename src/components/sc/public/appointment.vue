<template>
<div>
  <o-breadcrumb second="销售与客服" :third="breadcrumb.third" :third-url="breadcrumb.thirdUrl" four="预约课程"></o-breadcrumb>
  <table class="onlyhi-table">
    <tr>
      <th style="width: 120px">课程类型</th>
      <td>
        <template v-if="formItem.isCr">
          <Radio-group v-model="formItem.courseType">
            <Radio label="0">测评课</Radio>
            <Radio label="1">正式课</Radio>
          </Radio-group>
        </template>
        <template v-else>测评课</template>
      </td>
    </tr>
    <tr>
      <th>上课时长</th>
      <td>
        <template v-if="formItem.isCr">
          <i-select v-model="formItem.classLength" :disabled="formItem.courseType === '0' " style="width:80px">
            <i-option v-for="(item,index) in classLengthList" :key='index' :value="item.value">{{item.value}}</i-option>
          </i-select>
        </template>
        <template v-else> 1 </template>
        小时
      </td>
    </tr>
    <tr>
      <th>上课形式</th>
      <td>
        <Radio-group v-model="formItem.classType">
          <Radio label="0">预习</Radio>
          <Radio label="1">复习</Radio>
        </Radio-group>
      </td>
    </tr>
    <tr>
      <th>课时级别</th>
      <td>
        <Radio-group v-model="formItem.level">
          <Radio label="0">普通</Radio>
          <Radio label="1">清北</Radio>
          <Radio label="2">明星课程</Radio>
        </Radio-group>
      </td>
    </tr>
    <tr>
      <th>正式课频率</th>
      <td>
        <i-select v-model="formItem.hz" style="width:200px">
          <i-option v-for="(item,index) in hzList" :key='index' :value="item.value">{{ item.value }}</i-option>
        </i-select>
      </td>
    </tr>
  </table>
  <div-split text="老师要求"></div-split>
  <table class="onlyhi-table">
    <tr>
      <th width="120">性别</th>
      <td>
        <Radio-group v-model="formItem.gender">
          <Radio label="0">无要求</Radio>
          <Radio label="1">男</Radio>
          <Radio label="2">女</Radio>
        </Radio-group>
      </td>
    </tr>
    <tr>
      <th class="required" style="vertical-align: top;">授课要求</th>
      <td>
        <i-input type="textarea" v-model="formItem.teachRequest" :rows="4" :maxlength="500" placeholder="500字以内，如：我是腿控，我要腿长的女老师！" style="width: 400px"></i-input>
      </td>
    </tr>
  </table>
  <div-split text="学习要求"></div-split>
  <table class="onlyhi-table">
    <tr>
      <th class="required" width="120">上课年级</th>
      <td>
        <i-select v-model="formItem.grade" @on-change="changeGrade" style="width:200px">
          <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
        </i-select>
      </td>
    </tr>
    <tr>
      <th class="required">上课科目</th>
      <td>
        <i-select v-model="formItem.subject" style="width:200px">
          <i-option v-for="(item,index) in subjectList" :key='index' :value="item.value">{{ item.value }}</i-option>
        </i-select>
      </td>
    </tr>
    <tr>
      <th class="required">教材版本</th>
      <td>
        <i-select v-model="formItem.bookVersion" style="width:200px">
          <i-option v-for="(item,index) in bookVersionList" :key='index' :value="item.version">{{ item.version }}</i-option>
        </i-select>
      </td>
    </tr>
    <tr>
      <th class="required" style="vertical-align: top;">成绩</th>
      <td>
        <table class="o-table" cellspacing="0" style="margin: 0;">
          <tr>
            <th style="width:100px"></th>
            <th>分数</th>
            <th>满分</th>
            <th style="width:300px">试听知识点</th>
          </tr>
          <tr>
            <td style="width:100px">单元测验/月考</td>
            <td>
              <i-input v-model="score.unit.score" placeholder="如：75" style="width:88px"></i-input>
            </td>
            <td>
              <i-input v-model="score.unit.fullScore" placeholder="如：120" style="width:88px"></i-input>
            </td>
            <td>
              <i-input type="textarea" v-model="score.unit.shiting" :autosize="{minRows: 1,maxRows: 5}" placeholder="如：勾股定理" style="height: 32px;"></i-input>
            </td>
          </tr>
          <tr>
            <td style="width:100px">期中/期末</td>
            <td>
              <i-input v-model="score.qizhong.score" placeholder="如：105" style="width:88px"></i-input>
            </td>
            <td>
              <i-input v-model="score.qizhong.fullScore" placeholder="如：150" style="width:88px"></i-input>
            </td>
            <td>
              <i-input type="textarea" v-model="score.qizhong.shiting" :autosize="{minRows: 1,maxRows: 5}" placeholder="如：概率统计" style="height: 32px;"></i-input>
            </td>
          </tr>
          <tr>
            <td>其他</td>
            <td>
              <i-input v-model="score.other.score" placeholder="如：105" style="width:88px"></i-input>
            </td>
            <td>
              <i-input v-model="score.other.fullScore" placeholder="如：150" style="width:88px"></i-input>
            </td>
            <td>
              <i-input type="textarea" v-model="score.other.shiting" :autosize="{minRows: 1,maxRows: 5}" placeholder="如：牛顿定律" style="height: 32px;"></i-input>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <th class="required" style="vertical-align: top;">学习情况</th>
      <td>
        <Checkbox-group v-model="studyStatus">
          <Checkbox label="厌学">厌学</Checkbox>
          <Checkbox label="贪玩">贪玩</Checkbox>
          <Checkbox label="基础薄弱">基础薄弱</Checkbox>
          <Checkbox label="方法不佳">方法不佳</Checkbox>
          <Checkbox label="均衡">均衡</Checkbox>
          <Checkbox label="拔高">拔高</Checkbox>
        </Checkbox-group>
        <i-input type="textarea" v-model="formItem.studyStatusDesc" :rows="4" :maxlength="500" placeholder="500字以内，如：这小孩学坏了，没救了！" style="width: 400px"></i-input>
      </td>
    </tr>
  </table>
  <div-split></div-split>
  <table class="onlyhi-table">
    <tr>
      <th class="required" style="width: 120px;text-align: left;"><Icon type="alert-circled"></Icon> 注意：</th>
    </tr>
    <tr>
      <td colspan="2" class="required">
        <p>1. 标红项为必填！</p>
        <p>2. 成绩字段，三选一！</p>
      </td>
    </tr>
  </table>

  <div class="btn-tools1">
    <i-button type="primary" icon="checkmark" @click="save">确定</i-button>
    <i-button icon="ios-arrow-back" @click="close">返回</i-button>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {SCS} from 'common/api/scs.js';
  import {AUTHORITY} from 'common/api/authority.js';
  import {common,bubbleSort} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import divSplit from 'components/o/oDivSplit';
  export default{
    data() {
      return {
        breadcrumb: {
          third: sessionStorage.getItem('appointment_parent_menu_name') || '',
          thirdUrl: sessionStorage.getItem('appointment_parent_menu_url') || ''
        },
        studyStatus: [],//学习情况
        formItem: {
          courseType: '0',  //课程类型
          isCr: false,  //是否显示正式课
          classLength: '1', //上课时长
          classType: 0,   //上课形式
          level: 0,     //课时级别
          hz: '一周2节',
          gender: 0,//性别
          teachRequest: '',//授课要求
          grade: '',//上课年级
          subject: '',//上课科目
          bookVersion: '',//教材版本
          studyStatusDesc: ''
        },
        score: {
          unit: {
            score: '',//单元测验-分数
            fullScore: '',//单元测验-满分
            shiting: '',//试听知识点
          },
          qizhong: {
            score: '',//期中期末-分数
            fullScore: '',//期中期末-满分
            shiting: '',//试听知识点
          },
          other: {
            score: '',//其它-分数
            fullScore: '',//其它-满分
            shiting: '',//其它试听知识点
          }
        },
        hzList: [],
        subjectList: [],  //上课科目列表
        bookVersionList: [], //教材版本列表
        classLengthList: [],//上课时长
        gradeList: []
      }
    },
    mounted() {
      const that = this;
      //获取当前角色
      common.ajax({
        url: AUTHORITY().SystemUser.getByToken,
        method: 'get',
        success: function(res){
          let data = res.data;
          if (data.roleName === '班主任' || data.alias === 'cr') { //CR
            that.formItem.isCr = true;
          }
        }
      });
      $.getJSON("static/data.json", function (json) {
        that.classLengthList = json.classLengthList;//获取上课时长
        that.hzList = json.formalClassList;//获取正式课频率
        that.gradeList = json.gradeList;//获取年级
        that.subjectList = json.subjectList;//获取科目
      });
    },
    methods: {
      save() {
        let leadsUuid = sessionStorage.getItem('appointment_leadsUuid');
        let orderType = sessionStorage.getItem('appointment_orderType');
        let uuid = sessionStorage.getItem('appointment_uuid');
        let courseType = this.formItem.courseType;   //课程类型
        let classLength = this.formItem.classLength; //上课时长
        let classType = this.formItem.classType;     //上课形式
        let hz = this.formItem.hz;     //正式课频率
        let level = this.formItem.level;     //课时级别
        let gender = this.formItem.gender;     //性别
        let teachRequest = this.formItem.teachRequest;     //授课要求
        let grade = this.formItem.grade;     //上课年级
        let subject = this.formItem.subject;     //上课科目
        let bookVersion = this.formItem.bookVersion;     //教材版本
        let studyStatus = this.studyStatus || [];     //学习情况
        let studyStatusDesc = this.formItem.studyStatusDesc;

        if (hz === "") {
          common.msg('请填写正式课频率！');
          return false;
        } else if (teachRequest === "") {
          common.msg('请填写授课要求！');
          return false;
        } else if (grade === "") {
          common.msg('请填写上课年级！');
          return false;
        } else if (subject === "") {
          common.msg('请填写上课科目！');
          return false;
        } else if (bookVersion === "") {
          common.msg('请填写教材版本！');
          return false;
        } else if (this._checkScoreNull()) {
          common.msg('成绩项不能全为空，请选择其中一项填写完整！');
          return false;
        } else if (studyStatus.length === 0 && studyStatusDesc === "") {
          common.msg('请填写学习情况！');
          return false;
        } else {
          if (studyStatusDesc !== "") {
            if(studyStatus.indexOf(studyStatusDesc) === -1){
//              studyStatus.shift();
              studyStatus.push(studyStatusDesc);
            }
          }else{
//            studyStatus.shift();
          }
          studyStatus = studyStatus.join(',');
//          studyStatus = studyStatus.slice(0, -1);
          const that = this;
          common.ajax({
            url: SCS().WaitFollowed.createCourse,
            data: {
              leadsUuid: leadsUuid,
              orderType: orderType,
              uuid: uuid,
              type: courseType,
              length: classLength,
              style: classType,
              hz: hz,
              level: level,
              teacherSex: gender,
              teachRequest: teachRequest,
              grade: grade,
              subject: subject,
              subjectVersion: bookVersion,
              studyStatus: studyStatus,
              monthSocre: this.score.unit.score,
              fullMonthScore: this.score.unit.fullScore,
              monthPoint: this.score.unit.shiting,
              termScore: this.score.qizhong.score,
              fullTeamScore: this.score.qizhong.fullScore,
              termPoint: this.score.qizhong.shiting,
              otherScore: this.score.other.score,
              fullOtherScore: this.score.other.fullScore,
              otherPoint: this.score.other.shiting,
            },
            success: function (response) {
              common.notices('操作成功！！');
              that.close();
            }
          });
        }
      },
      _checkScoreNull() {
        let unitScoreValue = this.score.unit.score || '';     //月考成绩
        let unitFullScoreValue = this.score.unit.fullScore || '';     //月考成绩满分
        let unitShitingValue = this.score.unit.shiting || '';     //月考试听
        let qizhongScoreValue = this.score.qizhong.score || '';     //期中考试听
        let qizhongFullScoreValue = this.score.qizhong.fullScore || '';     //期中考试听
        let qizhongShitingValue = this.score.qizhong.shiting || '';     //期中考试听
        let otherScoreValue = this.score.other.score || '';     //期中考试听
        let otherScoreFullValue = this.score.other.fullScore || '';     //期中考试听
        let otherShitingValue = this.score.other.shiting || '';     //期中考试听
        //全为空
        if (unitScoreValue === "" && unitFullScoreValue === "" && unitShitingValue === ""
          && qizhongScoreValue === "" && qizhongFullScoreValue === "" && qizhongShitingValue === ""
          && otherScoreValue === "" && otherScoreFullValue === "" && otherShitingValue === "") {
          return true;
        }
        //单元测验\月考填写完整
        else if (unitScoreValue !== "" && unitFullScoreValue !== "" && unitShitingValue !== "") {
          return false;
        }
        //期中\期末填写完整
        else if (qizhongScoreValue !== "" && qizhongFullScoreValue !== "" && qizhongShitingValue !== "") {
          return false;
        }
        //其他填写完整
        else if (otherScoreValue !== "" && otherScoreFullValue !== "" && otherShitingValue !== "") {
          return false;
        } else {
          return true;
        }
      },
      changeGrade(value) {
        //获取教材版本列表
        const that = this;
        common.ajax({
          url: COMMON_API().allBookVersion + "?grade=" + value,
          method: 'get',
          success: function (res) {
            that.bookVersionList = res.data;
          },
          successError(res){
            that.notices(res.msg, '提示', 'error');
          }
        });
      },
      close() {
        window.history.back();
      }
    },
    components: { OBreadcrumb, divSplit }
  };
</script>

<style scoped>
  .onlyhi-table{margin-left:12px;width: 98%;border: none;}
  .onlyhi-table td,th{ text-align: left;}
  .onlyhi-table td {border-bottom: none;}
  .o-table td,th{text-align:left;}
  .btn-tools1{width:100%;text-align:center;margin:30px 0;}
</style>
