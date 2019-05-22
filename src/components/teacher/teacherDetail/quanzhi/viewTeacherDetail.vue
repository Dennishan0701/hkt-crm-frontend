 <template>
  <div>
    <o-breadcrumb second="全职老师详情"></o-breadcrumb>
    <h1 class="title">{{Base.tcName}}老师详情</h1>
    <o-div-split text="状态"></o-div-split>
    <div class="p10">
      <table class="onlyhi-table">
        <tr>
          <th>排课状态：</th>
          <td>{{Base.courseStatus}}</td>
          <th>排课状态备注：</th>
          <td>{{Base.remark}}</td>
          <th>是否入库：</th>
          <td>{{Base.inventoryStatus}}</td>
        </tr>
      </table>
    </div>

    <o-div-split text="基本信息"></o-div-split>
    <div class="p10">
      <table class="onlyhi-table">
        <tr>
          <th>姓名：</th>
          <td>{{Base.tcName}}</td>
          <th>性别：</th>
          <td>
            <template v-if="Base.gender == 0">男</template>
            <template v-else>女</template>
          </td>
          <th>手机号：</th>
          <td>{{Base.phone}}</td>
          <th>QQ：</th>
          <td>{{Base.qq}}</td>
          <th>邮箱：</th>
          <td>{{Base.email}}</td>
        </tr>
        <tr>
          <th>微信号：</th>
          <td>{{Base.wechat}}</td>
          <th>师训中心：</th>
          <td>{{Base.branchDesc}}</td>
          <th>身份证号：</th>
          <td>{{Base.idCard}}</td>
        </tr>
      </table>
    </div>

    <o-div-split text="高考所在地"></o-div-split>
    <div class="p10">
      <table class="onlyhi-table">
        <tr>
          <th>省：</th>
          <td>{{Gaokao.province}}</td><th>市：</th>
          <td>{{Gaokao.cityName}}</td>
          <th>区：</th>
          <td>{{Gaokao.area}}</td>
          <th>高考文理科：</th>
          <td>
            <template v-if="Gaokao.wlsubject == 1">文科</template>
            <template v-if="Gaokao.wlsubject == 0">理科</template>
            <template v-else></template>
          </td>
        </tr>
      </table>
    </div>

    <o-div-split text="学历信息"></o-div-split>
    <div class="p10">
      <table class="onlyhi-table">
        <tr>
          <th>学校：</th>
          <td>{{Xueli.school}}</td>
          <th>学历：</th>
          <td>{{Xueli.xueli | conversionXueli }}</td>
          <th>年级：</th>
          <td>{{Xueli.grade}}</td>
          <th>最高学历：</th>
          <td>{{Xueli.maxXueli | conversionXueli }}</td>
          <th>专业：</th>
          <td>{{Xueli.major}}</td>
        </tr>
      </table>
    </div>

    <o-div-split text="授课偏好"></o-div-split>
    <div class="p10">
      <table class="onlyhi-table">
        <tr>
          <th>科目：</th>
          <td>{{Preference.teachingSubject}}</td>
          <th>第二科目：</th>
          <td>{{Preference.twoSubject}}</td>
          <th>第三科目：</th>
          <td>{{Preference.threeSubject}}</td>
          <th>年级偏好：</th>
          <td>
            <i-select v-model="Preference.gradePreference" disabled style="width:120px">
              <i-option v-for="(item,index) in gradePreferenceList" :key='index' :value="item.value">{{ item.text }}</i-option>
            </i-select>
          </td>
        </tr>
      </table>
    </div>

    <div class="split-div">
      <div>
        <div class="title">监课备注</div>
      </div>
    </div>
    <div style="margin:0 10px;">
      <i-table border stripe size="large" :columns="historyRemarksColumns" :data="historyRemarksDate"></i-table>
    </div>
    <div class="split-div">
      <div>
        <div class="title">面试评价</div>
      </div>
    </div>
    <div style="margin:0 10px;">
      <i-table border stripe size="large" :columns="interviewRecord" :data="interviewRecordData"></i-table>
    </div>

    <o-div-split text="薪资信息"></o-div-split>
    <div class="p10">
      <table class="onlyhi-table">
        <tr>
          <th>工作性质：</th>
          <td>{{Base.natureOfWorkDesc}}</td>
          <th>薪资等级：</th>
          <td>{{Base.payGradeDesc}}</td>
          <th>时薪：</th>
          <td>{{Base.hourlyWage}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {ZHAO_TEACHER,TEACHER} from 'common/api/teacher.js';
  import {formateDate,common} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import oDivSplit from 'components/o/oDivSplit';
  export default{
    data() {
      return {
        Base: {
          tcName: '',
          gender: '',
          phone: '',
          branchDesc: '',
          qq: '',
          email: '',
          wechat: '',
          idCard: '',
          natureOfWorkDesc: '',
          payGradeDesc: '',
          hourlyWage: '',
          courseStatus: '',
          remark: '',
          inventoryStatus: ''
        },
        historyRemarksDate: [],//历史备注
        historyRemarksColumns: [//历史备注
          {
            title: '备注人',
            key: 'teacherName',
          },
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
            title: '内容',
            key: 'remark',
          },
        ],
        interviewRecordData: [],//面试备注
        interviewRecord: [//面试备注
          {
            title: '面试人',
            key: 'interviewUser',
          },
          {
            title: '面试时间',
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
            title: '面试评价',
            key: 'remark',
          },
        ],
        Gaokao: {
          province: '',
          cityName: '',
          area: '',
          wlsubject: ''
        },
        Xueli: {
          school: '',
          xueli: '',
          maxXueli: '',
          grade: '',
          major: ''
        },
        Preference: {
          teachingSubject: '',
          twoSubject: '',
          threeSubject: '',
          gradePreference: ''
        },
        gradePreferenceList: []
      }
    },
    mounted() {
      this.hiInit();
    },
    methods: {
      hiInit() {
        const _this = this;
        common.ajax({
          url: TEACHER().Detail.getByUuidToView,
          method: 'get',
          async: false,
          data: {uuid: sessionStorage.getItem('template_uuid')},
          success: function (res) {
            _this.Base = {
              tcName: res.data.tcName,
              branchDesc: res.data.branchDesc,
              gender: res.data.sex,
              phone: res.data.phone,
              qq: res.data.qq,
              email: res.data.email,
              wechat: res.data.wechat,
              idCard: res.data.idNumber,
              remark: res.data.remark,
              natureOfWorkDesc: res.data.natureOfWorkDesc,
              payGradeDesc: res.data.payGradeDesc,
              hourlyWage: res.data.hourlyWage,
              courseStatus: res.data.courseStatus,
              inventoryStatus: res.data.inventoryStatus,
            };
            _this.Gaokao.province = res.data.province;
            _this.Gaokao.cityName = res.data.city;
            _this.Gaokao.area = res.data.district;
            _this.Gaokao.wlsubject = res.data.artsOrScience;
            _this.historyRemarksDate = res.data.notesList || [];
            _this.interviewRecordData = res.data.interviewRecord || [];//面试

            _this.Xueli = {
              school: res.data.schoolLocation,
              xueli: res.data.education,
              maxXueli: res.data.highestEducation,
              grade: res.data.grade,
              major: res.data.major,
            };
            _this.Preference = {
              teachingSubject: res.data.teachingSubject,
              twoSubject: res.data.secondSubject,
              threeSubject: res.data.thirdSubject,
              gradePreference: res.data.gradePreference
            };
          }
        });
        $.getJSON("static/data.json", (json) => {
          _this.gradePreferenceList = json.gradePreferenceList;
        });
      }
    },
    filters: {
      formateDate(time) {
        let date = new Date(time);
        return formateDate(date, 'yyyy-MM-dd hh:mm');
      },
      conversionSalaryLeval(value) {
        if (value == 1) {
          return "C";
        } else if (value == 2) {
          return "B";
        } else if (value == 3) {
          return "A";
        } else if (value == 4) {
          return "S";
        } else if (value == 5) {
          return "S+";
        } else if (value == 6) {
          return "明星";
        } else {
          return "未知状态："+value;
        }
      },
      conversionWorkNature(value) {
        if (value == 1) {
          return "社招全职";
        } else if (value == 2) {
          return "兼职";
        } else if (value == 3) {
          return "校招全职";
        } else {
          return "未知状态："+value;
        }
      },
      conversionXueli(value) {
        if (value == 1) {
          return "本科";
        } else if (value == 2) {
          return "研究生";
        } else if (value == 3) {
          return "博士";
        } else {
          return " ";
        }
      }
    },
    components: {OBreadcrumb, oDivSplit}
  };
</script>

<style scoped>
  table.onlyhi-table {width: 100% !important;}
  .p10 {padding: 0 10px;}
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
  table.onlyhi-table td,
  table.onlyhi-table th {
    border-right: 1px solid #e3e8ee;
  }
  .ivu-select-single .ivu-select-selection .ivu-select-placeholder,
  .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
      cursor: auto !important;
      color: #000 !important;
  }
</style>
