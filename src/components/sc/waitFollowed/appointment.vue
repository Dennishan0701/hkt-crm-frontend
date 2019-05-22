<template>
<div>
  <o-breadcrumb second="销售与客服" third="待跟进" third-url="/waitFollowed/manager" four="预约课程"></o-breadcrumb>
  <form>
    <table class="onlyhi-table">
      <tr>
        <th width="120">课程类型</th>
        <td>测评课</td>
      </tr>
      <tr>
        <th>上课时长</th>
        <td>1小时</td>
      </tr>
      <tr>
        <th>上课形式</th>
        <td>
          <Radio-group v-model="classTypeValue">
            <Radio label="0">预习</Radio>
            <Radio label="1">复习</Radio>
          </Radio-group>
        </td>
      </tr>
      <tr>
        <th>课时级别</th>
        <td>
          <Radio-group v-model="classHoursLevelValue">
            <Radio label="0">普通</Radio>
            <Radio label="1">清北</Radio>
            <Radio label="2">明星课程</Radio>
          </Radio-group>
        </td>
      </tr>
      <tr>
        <th>正式课频率</th>
        <td>
          <i-select v-model="hz" style="width:200px">
            <i-option v-for="(item,index) in hzList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
        </td>
      </tr>

      <!--<tr>-->
      <!--<th class="required">正式课频率</th>-->
      <!--<td>-->
      <!--<input class="o-input" id="formalClassFrequencyValue" value="" placeholder="如：一周一次" style="width: 200px">-->
      <!--</td>-->
      <!--</tr>-->
      <!--<tr v-if="historyHzArray">-->
      <!--<th></th>-->
      <!--<td colspan="2">-->
      <!--<template v-for="item in historyHzArray">-->
      <!--<span @click="selectedTag" class="o-tag grey">{{item}}</span>-->
      <!--</template>-->
      <!--</td>-->
      <!--</tr>-->
    </table>
    <div-split text="老师要求"></div-split>
    <table class="onlyhi-table">
      <tr>
        <th width="120">性别</th>
        <td>
          <Radio-group v-model="genderValue">
            <Radio label="0">无要求</Radio>
            <Radio label="1">男</Radio>
            <Radio label="2">女</Radio>
          </Radio-group>
        </td>
      </tr>
      <tr>
        <th class="required" style="vertical-align: top;">授课要求</th>
        <td>
          <textarea class="o-input" id="classRequirementsValue" maxlength="500" style="width:300px;height:100px" placeholder="500字以内"></textarea>
        </td>
      </tr>
    </table>
    <div-split text="学习要求"></div-split>
    <table class="onlyhi-table">
      <tr>
        <th class="required" width="120">上课年级</th>
        <td>
          <i-select v-model="gradeValue" @on-change="changeGrade" style="width:200px">
            <i-option v-for="(item,index) in gradeList"  :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
        </td>
      </tr>
      <tr>
        <th class="required">上课科目</th>
        <td>
          <i-select v-model="subjectValue" style="width:200px">
            <i-option v-for="(item,index) in subjectList" :key='index' :value="item">{{ item }}</i-option>
          </i-select>
        </td>
      </tr>
      <tr>
        <th class="required">教材版本</th>
        <td>
          <i-select v-model="bookVersionValue" style="width:200px">
            <i-option v-for="(item,index) in bookVersionList" :key='index' :value="item.version">{{ item.version }}</i-option>
          </i-select>
        </td>
      </tr>
      <tr>
        <th class="required" style="vertical-align: top;">成绩</th>
        <td>
          <table class="o-table" cellspacing="0" cellspacing="0" style="margin: 0;">
            <tr>
              <th style="width:100px"></th>
              <th>分数</th>
              <th>满分</th>
              <th style="width:300px">试听知识点</th>
            </tr>
            <tr>
              <td style="width:100px">单元测验/月考</td>
              <td>
                <i-input :value="unitScoreValue" @on-change="changeUnitScore" style="width:78px"></i-input>
              </td>
              <td>
                <i-input :value="unitFullScoreValue" @on-change="changeUnitFullScore" style="width:78px"></i-input>
              </td>
              <td>
                <i-input type="textarea" :model="unitShitingValue" @on-change="changeUnitShiting" :autosize="{minRows: 1,maxRows: 5}" placeholder="请输入..." style="height: 32px;"></i-input>
              </td>
            </tr>
            <tr>
              <td style="width:100px">期中/期末</td>
              <td>
                <i-input :value="qizhongScoreValue" @on-change="changeQizhongScore" style="width:78px"></i-input>
              </td>
              <td>
                <i-input :value="qizhongFullScoreValue" @on-change="changeQizhongScoreFull" style="width:78px"></i-input>
              </td>
              <td>
                <i-input type="textarea" :model="qizhongShitingValue" @on-change="changeQizhongShiting" :autosize="{minRows: 1,maxRows: 5}" placeholder="请输入..." style="height: 32px;"></i-input>
              </td>
            </tr>
            <tr>
              <td>其他</td>
              <td>
                <i-input :value="otherScoreValue" @on-change="changeOtherScore" style="width:78px"></i-input>
              </td>
              <td>
                <i-input :value="otherScoreFullValue" @on-change="changeOtherScoreFull" style="width:78px"></i-input>
              </td>
              <td>
                <i-input type="textarea" :model="otherShitingValue" @on-change="changeOtherShiting" :autosize="{minRows: 1,maxRows: 5}" placeholder="请输入..." style="height: 32px;"></i-input>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <th class="required" style="vertical-align: top;">学习情况</th>
        <td>
          <Checkbox-group v-model="studyStatus">
            <Checkbox label="厌学"></Checkbox>
            <Checkbox label="贪玩"></Checkbox>
            <Checkbox label="基础薄弱"></Checkbox>
            <Checkbox label="方法不佳"></Checkbox>
            <Checkbox label="均衡"></Checkbox>
            <Checkbox label="拔高"></Checkbox>
          </Checkbox-group>
          <textarea class="o-input" id="studyStatusDescValue" maxlength="500" style="width:300px;height:100px" placeholder="500字以内"></textarea>
        </td>
      </tr>
    </table>
    <div-split></div-split>
    <table class="onlyhi-table">
      <tr>
        <th class="required" width="120"><Icon type="alert-circled"></Icon> 注意：</th>
      </tr>
      <tr>
        <td colspan="2" class="required">
          <p>1. 标红项为必填！</p>
          <p>2. 成绩字段，三选一！</p>
        </td>
      </tr>
    </table>

    <div class="btn-tools">
      <i-button type="primary" icon="checkmark" @click="save">确定</i-button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <i-button icon="close" @click="close">关闭</i-button>
    </div>
  </form>
</div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {SCS} from 'common/api/scs.js';
  import {common,bubbleSort} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import divSplit from 'components/o/oDivSplit';
  export default{
    data() {
      return {
        courseTypeValue: 0,  //课程类型
        classLengthValue: '1', //上课时长
        classTypeValue: 0,   //上课形式
        hz: '一周2节',
        hzList: [],
        classHoursLevelValue: 0,     //课时级别
        genderValue: 0,              //性别
        subjectList: [],              //上课科目列表
        subjectValue: '',             //上课科目
        bookVersionList: [],          //教材版本列表
        bookVersionValue: '',         //教材版本
        gradeValue: '',
        gradeList: [],
        studyStatus: [],                //学习情况
        //historyHzArray: this.showRecordHz()
      }
    },
    mounted() {
      //获取科目列表
      const that = this;
      // common.ajax({
      //   url: COMMON_API().allSubject,
      //   method: 'get',
      //   success: function(res){
      //     that.subjectList = res.data;
      //   }
      // });
      this.$axios.get(COMMON_API().allSubject,{
      }).then( ({data}) => {
        that.subjectList = data.data;
      });
      //获取年级
      $.getJSON("static/data.json", function (json) {
        that.gradeList = json.gradeList;
      });
      //获取正式课频率
      $.getJSON("static/data.json", function (json) {
        that.hzList = json.formalClassList;
      });
    },
    methods: {
      save() {
        let leadsUuid = sessionStorage.getItem('waitFollowed_appointment_leadsUuid');
        let courseTypeValue = this.courseTypeValue;   //课程类型
        let classLengthValue = this.classLengthValue; //上课时长
        let classTypeValue = this.classTypeValue;     //上课形式
        //let formalClassFrequencyValue = $('#formalClassFrequencyValue').val();     //正式课频率
        let formalClassFrequencyValue = this.hz;     //正式课频率
        let classHoursLevelValue = this.classHoursLevelValue;     //课时级别
        let genderValue = this.genderValue;     //性别
        let classRequirementsValue = $('#classRequirementsValue').val();     //授课要求
        let gradeValue = this.gradeValue;     //上课年级
        let subjectValue = this.subjectValue;     //上课科目
        let bookVersionValue = this.bookVersionValue;     //教材版本

        let studyStatus = this.studyStatus || [];     //学习情况
        let studyStatusDescValue = $('#studyStatusDescValue').val(); //学习情况说明

        if (formalClassFrequencyValue == "") {
          common.msg('请填写正式课频率！');
          return false;
        } else if (classRequirementsValue == "") {
          common.msg('请填写授课要求！');
          return false;
        } else if (gradeValue == "") {
          common.msg('请填写上课年级！');
          return false;
        } else if (subjectValue == "") {
          common.msg('请填写上课科目！');
          return false;
        } else if (bookVersionValue == "") {
          common.msg('请填写教材版本！');
          return false;
        } else if (this._checkScoreNull()) {
          common.msg('成绩项不能全为空，请选择其中一项填写完整！');
          return false;
        } else if (studyStatus.length == 0 && studyStatusDescValue == "") {
          common.msg('请填写学习情况！');
          return false;
        } else {
          if (studyStatusDescValue != "") {
            if(this.studyStatus.indexOf(studyStatusDescValue) == -1){
              this.studyStatus.shift();
              this.studyStatus.push(studyStatusDescValue);
            }
          }else{
            this.studyStatus.shift();
          }
          studyStatus = this.studyStatus.join(',');
          studyStatus = studyStatus.slice(0, -1);
          const that = this;
          // common.ajax({
          //   url: SCS().WaitFollowed.createCourse,
          //   method: 'post',
          //   data: {
          //     leadsUuid: leadsUuid,
          //     type: courseTypeValue,
          //     length: classLengthValue,
          //     style: classTypeValue,
          //     hz: formalClassFrequencyValue,
          //     level: classHoursLevelValue,
          //     teacherSex: genderValue,
          //     teachRequest: classRequirementsValue,
          //     grade: gradeValue,
          //     subject: subjectValue,
          //     subjectVersion: bookVersionValue,
          //     studyStatus: studyStatus,
          //     monthSocre: this.unitScoreValue,
          //     fullMonthScore: this.unitFullScoreValue,
          //     monthPoint: this.unitShitingValue,
          //     termScore: this.qizhongScoreValue,
          //     fullTeamScore: this.qizhongFullScoreValue,
          //     termPoint: this.qizhongShitingValue,
          //     otherScore: this.otherScoreValue,
          //     fullOtherScore: this.otherScoreFullValue,
          //     otherPoint: this.otherShitingValue,
          //     orderType: 0
          //   },
          //   success: function (response) {
          //     common.notice('操作成功！！');
          //     //that.recordHz(formalClassFrequencyValue);
          //     that.close();
          //   }
          // });
          this.$axios.post(SCS().WaitFollowed.createCourse,{
            leadsUuid: leadsUuid,
            type: courseTypeValue,
            length: classLengthValue,
            style: classTypeValue,
            hz: formalClassFrequencyValue,
            level: classHoursLevelValue,
            teacherSex: genderValue,
            teachRequest: classRequirementsValue,
            grade: gradeValue,
            subject: subjectValue,
            subjectVersion: bookVersionValue,
            studyStatus: studyStatus,
            monthSocre: this.unitScoreValue,
            fullMonthScore: this.unitFullScoreValue,
            monthPoint: this.unitShitingValue,
            termScore: this.qizhongScoreValue,
            fullTeamScore: this.qizhongFullScoreValue,
            termPoint: this.qizhongShitingValue,
            otherScore: this.otherScoreValue,
            fullOtherScore: this.otherScoreFullValue,
            otherPoint: this.otherShitingValue,
            orderType: 0
          }).then( () => {
            common.notice('操作成功！！');
            that.close();
          })
        }
      },
      recordHz(hz) {
        let storage = $.localStorage;
        let val = storage.get('formalClassFrequencyValue') || {};
        if(val[hz]) {
          val[hz]++;
        } else {
          val[hz] = 1;
        }
        storage.set('formalClassFrequencyValue',val);
      },
      showRecordHz() {
        let storage = $.localStorage;
        let val = storage.get('formalClassFrequencyValue');
        var arr = [], len;
        if(!$.isEmptyObject(val)) {
          for(var item in val) {
            if(arr.length <= 5) {
              arr.push(item+":"+val[item]);
            }
          }
          var newArr = arr.sort(function(a, b){
            a = a.split(':')[1];
            b = b.split(':')[1];
            return b - a;
          });
          arr = [], len = newArr.length;
          if(len>5) len = 5;
          for(var i=0; i<len; i++) {
            arr.push(newArr[i].split(':')[0]);
          }
          return arr;
        }
      },
      selectedTag(event) {
        $('#formalClassFrequencyValue').val(event.target.innerText);
      },
      _checkScoreNull() {
        let unitScoreValue = this.unitScoreValue || '';     //月考成绩
        let unitFullScoreValue = this.unitFullScoreValue || '';     //月考成绩满分
        let unitShitingValue = this.unitShitingValue || '';     //月考试听
        let qizhongScoreValue = this.qizhongScoreValue || '';     //期中考试听
        let qizhongFullScoreValue = this.qizhongFullScoreValue || '';     //期中考试听
        let qizhongShitingValue = this.qizhongShitingValue || '';     //期中考试听
        let otherScoreValue = this.otherScoreValue || '';     //期中考试听
        let otherScoreFullValue = this.otherScoreFullValue || '';     //期中考试听
        let otherShitingValue = this.otherShitingValue || '';     //期中考试听
        //全为空
        if (unitScoreValue == "" && unitFullScoreValue == "" && unitShitingValue == ""
          && qizhongScoreValue == "" && qizhongFullScoreValue == "" && qizhongShitingValue == ""
          && otherScoreValue == "" && otherScoreFullValue == "" && otherShitingValue == "") {
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
      changeOtherShiting(event) {
        this.otherShitingValue = event.target.value;
      },
      changeOtherScoreFull(event){
        this.otherScoreFullValue = event.target.value;
      },
      changeOtherScore(event) {
        this.otherScoreValue = event.target.value;
      },
      changeQizhongShiting(event) {
        this.qizhongShitingValue = event.target.value;
      },
      changeQizhongScoreFull(event) {
        this.qizhongFullScoreValue = event.target.value;
      },
      changeQizhongScore(event) {
        this.qizhongScoreValue = event.target.value;
      },
      changeUnitShiting(event) {
        this.unitShitingValue = event.target.value;
      },
      changeUnitFullScore(event) {
        this.unitFullScoreValue = event.target.value;
      },
      changeUnitScore(event) {
        this.unitScoreValue = event.target.value;
      },
      changeGrade(value) {
        //获取教材版本列表
        const that = this;
        // common.ajax({
        //   url: COMMON_API().allBookVersion + "?grade=" + value,
        //   method: 'get',
        //   success: function (res) {
        //     that.bookVersionList = res.data;
        //   },
        //   successError(res){
        //     that.notices('res.msg','提示', 'error');
        //   }
        // });
        this.$axios.get( COMMON_API().allBookVersion,{
          params:{
            grade:value
          }
        }).then( ({data}) => {
          that.bookVersionList = data.data;
        })
      },
      close() {
        window.location.hash = "/scs/waitFollowed";
      }
    },
    components: { OBreadcrumb, divSplit }
  };
</script>

<style scoped>
  form{margin-bottom: 20px;}
  .onlyhi-table{margin-left:12px;width: 98%;border: none;}
  .onlyhi-table td,th{ text-align: left;}
  .o-table td,th{text-align:left;}
  .btn-tools{width:600px;text-align:center;margin-top:30px;margin-left:50px;}
  .o-tag{cursor: pointer;}
</style>
