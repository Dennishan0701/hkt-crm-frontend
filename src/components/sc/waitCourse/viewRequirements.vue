<template>
<div>
  <o-breadcrumb second="销售与客服" third="待排课" third-url="/leads/waitCourse" four="排课要求"></o-breadcrumb>
  <Row>
    <h1 class="title">排课要求</h1>
    <i-col span="12">
      <table class="onlyhi-table">
        <tr>
          <th width="120">课程类型</th>
          <td>
            <div v-if="type == 0">测评课</div>
            <div v-else>正式课</div>
          </td>
        </tr>
        <tr>
          <th>上课时长</th>
          <td> {{length || '-'}} 小时 </td>
        </tr>
        <tr>
          <th>上课形式</th>
          <td>
            <div v-if="style == 0">预习</div>
            <div v-else>复习</div>
          </td>
        </tr>
        <tr>
          <th>正式课频率</th>
          <td> {{hz || '-'}} </td>
        </tr>
        <tr>
          <th>课时级别</th>
          <td>{{ level | convertLevel }}</td>
        </tr>
      </table>
      <div-split text="老师要求"></div-split>
      <table class="onlyhi-table">
        <tr>
          <th width="120">性别</th>
          <td>{{ teacherSex | convertTeacherSex  }}</td>
        </tr>
        <tr>
          <th>授课要求</th>
          <td>{{teachRequest || '-'}}</td>
        </tr>
      </table>
      <div-split text="学习要求"></div-split>
      <table class="onlyhi-table">
        <tr>
          <th width="120">上课科目</th>
          <td>{{subject || '-'}}</td>
        </tr>
        <tr>
          <th>教材版本</th>
          <td>{{subjectVersion || '-'}}</td>
        </tr>
        <tr>
          <th style="vertical-align: top;">成绩</th>
          <td>
            <table class="o-table" cellspacing="0" style="width: 100%;">
              <tr>
                <th style="width:118px"></th>
                <th width="90">分数</th>
                <th width="90">满分</th>
                <th style="width:300px">试听知识点</th>
              </tr>
              <tr>
                <td style="width:100px">单元测验/月考</td>
                <td>{{monthSocre || '-'}}</td>
                <td>{{fullMonthScore || '-'}}</td>
                <td>{{monthPoint || '-'}}</td>
              </tr>
              <tr>
                <td style="width:100px">期中/期末</td>
                <td>{{termScore || '-'}}</td>
                <td>{{fullTeamScore || '-'}}</td>
                <td>{{termPoint || '-'}}</td>
              </tr>
              <tr>
                <td>其他</td>
                <td>{{otherScore || '-'}}</td>
                <td>{{fullOtherScore || '-'}}</td>
                <td>{{otherPoint || '-'}}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <th>学习情况</th>
          <td>{{studyStatus || '-'}}</td>
        </tr>
      </table>
    </i-col>
    <i-col span="12">
      <table class="onlyhi-table">
        <tr>
          <th width="120">上课日期</th>
          <td>{{dates || '-'}}</td>
        </tr>
        <tr>
          <th>上课时间</th>
          <td>
            {{startTime || '-'}} 至 {{endTime || '-'}}
          </td>
        </tr>
        <tr>
          <th style="vertical-align: top;">错题或试卷</th>
          <td v-if="errorFiles.length > 0">
            <div v-for="(item,index) in errorFiles" :key='index'>
              <p style="margin: 5px 0;">
              <Poptip trigger="hover" title="Title" content="content">
                  <a :href="item.fileAddress" target="_blank">{{item.originalFileName}}</a>
                <div slot='content'>
                  <img :src="item.fileAddress" style='max-width: 90px' alt="">
                </div>
              </Poptip>
              </p>

            </div>
          </td>
          <td v-else> - </td>
        </tr>
      </table>
      <div-split></div-split>
      <table class="onlyhi-table">
        <tr>
          <th width="120">建议老师</th>
          <td>{{offerTeacher || '-'}} </td>
        </tr>
        <tr>
          <th>其他要求</th>
          <td>{{otherRequest || '-'}} </td>
        </tr>
      </table>
    </i-col>
  </Row>

  <div class="btn-tools">
    <i-button icon="ios-arrow-back" @click="close" style="width:100px">返回</i-button>
  </div>

</div>
</template>

<script type="text/ecmascript-6">
  import {SCS} from 'common/api/scs.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import divSplit from 'components/o/oDivSplit';
  import {formateDate,common} from 'common/js/common.js';
  export default{
    data() {
      return {
        type: '',  //课程类型
        length: '', //上课时长
        style: '',   //上课形式
        hz: '',     //上课频率
        level: '',     //课时级别
        teacherSex: '',//老师性别
        teachRequest: '',//授课要求
        subject: '',//上课科目
        subjectVersion: '',//教材版本
        monthSocre: '',//单元测试月考分数
        fullMonthScore: '',//单元测试月考满数
        monthPoint: '',//单元测试月考知识点
        termScore: '',//期中期末分数
        fullTeamScore: '',//期中期末满分
        termPoint: '',//期中、期末知识点
        otherScore: '',//其他分数
        fullOtherScore: '',//其他满分成绩
        otherPoint: '',//其他知识点
        studyStatus: '',//学习情况
        dates: '',//上课日期
        startTime: '',//上课开始时间
        endTime: '',//上课结束时间
        offerTeacher: '',//建议老师
        otherRequest: '',//其他要求
        errorFiles: []
      }
    },
    mounted() {
      let courseUuid = sessionStorage.getItem('waitCourse_viewRequirements_courseUuid');
      const that = this;
      common.ajax({
        url: SCS().WaitCourse.viewRequirements + "?courseOrderUuid=" + courseUuid,
        method: 'get',
        success: function (response) {
          let data = response.data;
          if(data){
            that.type = data.type;
            that.length = data.length;
            that.style = data.style;
            that.hz = data.hz;
            that.level = data.level;
            that.teacherSex = data.teacherSex;
            that.teachRequest = data.teachRequest;
            that.subject = data.subject;
            that.subjectVersion = data.subjectVersion;
            that.monthSocre = data.monthSocre;
            that.fullMonthScore = data.fullMonthScore;
            that.monthPoint = data.monthPoint;
            that.termScore = data.termScore;
            that.fullTeamScore = data.fullTeamScore;
            that.termPoint = data.termPoint;
            that.otherScore = data.otherScore;
            that.fullOtherScore = data.fullOtherScore;
            that.otherPoint = data.otherPoint;
            that.studyStatus = data.studyStatus;
            that.dates = data.dates;
            that.startTime = data.startTime;
            that.endTime = data.endTime;
            that.offerTeacher = data.offerTeacher;
            that.otherRequest = data.otherRequest;
            that.errorFiles = data.images;
          }
        }
      });
    },
    methods: {
      close() {
        window.history.back();
      }
    },
    filters: {
      convertLevel(value) {
        if(value == 0) {
          return "普通";
        } else if(value == 0) {
          return "清北";
        } else if(value == 1) {
          return "明星课程";
        } else {
          return value;
        }
      },
      convertTeacherSex(value) {
        if(value == 0) {
          return "无要求";
        } else if(value == 1) {
          return "男";
        } else if(value == 2) {
          return "女";
        } else {
          return value;
        }
      }
    },
    components: {
      OBreadcrumb, divSplit
    }
  };
</script>

<style scoped>
  .onlyhi-table{margin-left:12px;width: 98%;border: none;}
  .onlyhi-table td,th{ text-align: left;}
  .o-table td,th{text-align:left;background:#fff;}
  .btn-tools{width:100%;text-align:right;margin-top:30px;padding-right:50px;}
</style>

