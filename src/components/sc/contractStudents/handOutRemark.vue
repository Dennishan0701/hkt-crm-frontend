<template>
  <Modal
    v-model="payRequestModal"
    :title="modalTitle"
    width="1000"
    :loading="loading"
    :closable="false"
    :mask-closable="false"
    @on-ok="onOk">

    <div v-show='title0' slot="header" class="txt-center">
      <p class="c-red">查看移交表</p>
      <div>
        <Icon type="ios-camera" @click="capture"></Icon>
        <a class="down" download="downImg" href=""></a>
      </div>
    </div>
    <div v-show='title1' slot="header" class="txt-center">
      <p class="c-red">修改移交表</p>
    </div>
    <div class="capture-main">
      <i-form ref="formValidate" :model="formValidate" inline :rules="ruleValidate" :label-width="100">

        移交表
        <hr class="split"/>


        <div class="split-div">
          <div class="title">基本信息</div>
        </div>
        <Form-item label="学生姓名">
          <i-input v-model="formValidate.name" :disabled="baseDisabled" placeholder="学生姓名" style="width:200px"></i-input>
        </Form-item>
        <Form-item label="性别">
          <i-select v-model="formValidate.sex" :disabled="baseDisabled" placeholder="性别" style="width:200px">
            <i-option value="1">女</i-option>
            <i-option value="0">男</i-option>
          </i-select>
        </Form-item>
        <Form-item label="年级" prop="grade">
          <i-select v-model="formValidate.grade" @on-change='getVersion' :disabled="baseDisabled" placeholder="年级" style="width:200px">
            <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
        </Form-item>

        <!--选择年级为小三、小四、小五、小六、预初时，选择课程时长为45分钟或者60分钟。-->
        <div v-show="hasCourseTimes" style="float:left">
          <Form-item label="课程时长" prop="courseTimes">
            <Radio-group v-model="formValidate.courseTimes">
              <Radio label="45">45分钟</Radio>
              <Radio label="60">60分钟</Radio>
            </Radio-group>
          </Form-item>
        </div>

        <Form-item label="文科/理科" prop="subject">
          <i-select v-model="formValidate.isScience" :disabled="baseDisabled" placeholder="文科/理科" style="width:200px">
            <i-option value="">无</i-option>
            <i-option value="0">文科</i-option>
            <i-option value="1">理科</i-option>
          </i-select>
        </Form-item>
        <Form-item label="省">
          <i-select v-model="formValidate.provinceId" :disabled="baseDisabled" :label-in-value="true" @on-change="changeSelectedCity"
                    placeholder="省" style="width:200px">
            <i-option v-for="(item,index) in provinceList" :key='index' :value="item.id">{{ item.name }}</i-option>
          </i-select>
        </Form-item>
        <Form-item label="市">
          <i-select v-model="formValidate.cityId" :disabled="baseDisabled" :label-in-value="true" @on-change="changeSelectedArea"
                    placeholder="市"
                    style="width:200px">
            <i-option v-for="(item,index) in cityArrays" :key='index' :value="item.id">{{ item.name }}</i-option>
          </i-select>
        </Form-item>
        <Form-item label="区">
          <i-select v-model="formValidate.countId" :disabled="baseDisabled" :label-in-value="true" @on-change="changeSelectedCount"
                    placeholder="区"
                    style="width:200px">
            <i-option v-for="(item,index) in areaList" :key='index' :value="item.id">{{ item.name }}</i-option>
          </i-select>
        </Form-item>
        <Form-item label="所在学校" prop="school">
          <i-select v-model="formValidate.school" :disabled="baseDisabled" placeholder="学校" style="width:200px">
            <i-option v-for="(item,index) in scrollList" :key='index' :value="item.schoolname">{{ item.schoolname }}</i-option>
          </i-select>
        </Form-item>


        <div class="split-div">
          <div class="title">成绩情况</div>
        </div>

        <table class="onlyhi-table">
          <tr>
            <th>科目</th>
            <th>语文</th>
            <th>数学</th>
            <th>英语</th>
            <th>物理</th>
            <th>化学</th>
            <th>生物</th>
            <th>政治</th>
            <th>历史</th>
            <th>其他</th>
          </tr>
          <tr>
            <td>满分</td>
            <td>
              <i-input :disabled="baseDisabled" v-model="formValidate.languageFullScore" placeholder="分数"
                       style="width:95%;padding-right: 0"></i-input>
            </td>
            <td>
              <i-input :disabled="baseDisabled" v-model="formValidate.mathematicsFullScore" placeholder="分数"
                       style="width:95%"></i-input>
            </td>
            <td>
              <i-input :disabled="baseDisabled" v-model="formValidate.englishFullScore" placeholder="分数"
                       style="width:95%"></i-input>
            </td>
            <td>
              <i-input :disabled="baseDisabled" v-model="formValidate.physicsFullScore" placeholder="分数"
                       style="width:95%"></i-input>
            </td>
            <td>
              <i-input :disabled="baseDisabled" v-model="formValidate.chemistryFullScore" placeholder="分数"
                       style="width:95%"></i-input>
            </td>
            <td>
              <i-input :disabled="baseDisabled" v-model="formValidate.biologyFullScore" placeholder="分数"
                       style="width:95%"></i-input>
            </td>
            <td>
              <i-input :disabled="baseDisabled" v-model="formValidate.politicsFullScore" placeholder="分数"
                       style="width:95%"></i-input>
            </td>
            <td>
              <i-input :disabled="baseDisabled" v-model="formValidate.historyFullScore" placeholder="分数"
                       style="width:95%"></i-input>
            </td>
            <td>
              <i-input :disabled="baseDisabled" v-model="formValidate.mathematicsFullScore" placeholder="分数"
                       style="width:95%"></i-input>
            </td>
          </tr>
          <tr>
            <td>分数</td>
            <td>
              <i-input :disabled="baseDisabled" v-model="formValidate.languageScore" placeholder="分数" style="width:95%"></i-input>
            </td>
            <td>
              <i-input :disabled="baseDisabled" v-model="formValidate.mathematicsScore" placeholder="分数"
                       style="width:95%"></i-input>
            </td>
            <td>
              <i-input :disabled="baseDisabled" v-model="formValidate.englishScore" placeholder="分数" style="width:95%"></i-input>
            </td>
            <td>
              <i-input :disabled="baseDisabled" v-model="formValidate.physicsScore" placeholder="分数" style="width:95%"></i-input>
            </td>
            <td>
              <i-input :disabled="baseDisabled" v-model="formValidate.chemistryScore" placeholder="分数" style="width:95%"></i-input>
            </td>
            <td>
              <i-input :disabled="baseDisabled" v-model="formValidate.biologyScore" placeholder="分数" style="width:95%"></i-input>
            </td>
            <td>
              <i-input :disabled="baseDisabled" v-model="formValidate.politicsScore" placeholder="分数" style="width:95%"></i-input>
            </td>
            <td>
              <i-input :disabled="baseDisabled" v-model="formValidate.historyScore" placeholder="分数" style="width:95%"></i-input>
            </td>
            <td>
              <i-input :disabled="baseDisabled" v-model="formValidate.otherScore" placeholder="分数" style="width:95%"></i-input>
            </td>
          </tr>
          <tr>
            <td>教材版本</td>
            <td>
              <i-select :disabled="baseDisabled" v-model="formValidate.languageVersion" placeholder="版本" style="width:95%">
                <i-option v-for="(item,index) in bookVersionList" :key='index' :value="item.version">{{ item.version }}</i-option>
              </i-select>
            </td>
            <td>
              <i-select :disabled="baseDisabled" v-model="formValidate.mathematicsVersion" placeholder="版本" style="width:95%">
                <i-option v-for="(item,index) in bookVersionList" :key='index' :value="item.version">{{ item.version }}</i-option>
              </i-select>
            </td>
            <td>
              <i-select :disabled="baseDisabled" v-model="formValidate.englishVersion" placeholder="版本" style="width:95%">
                <i-option v-for="(item,index) in bookVersionList" :key='index' :value="item.version">{{ item.version }}</i-option>
              </i-select>
            </td>
            <td>
              <i-select :disabled="baseDisabled" v-model="formValidate.physicsVersion" placeholder="版本" style="width:95%">
                <i-option v-for="(item,index) in bookVersionList" :key='index' :value="item.version">{{ item.version }}</i-option>
              </i-select>
            </td>
            <td>
              <i-select :disabled="baseDisabled" v-model="formValidate.chemistryVersion" placeholder="版本" style="width:95%">
                <i-option v-for="(item,index) in bookVersionList" :key='index' :value="item.version">{{ item.version }}</i-option>
              </i-select>
            </td>
            <td>
              <i-select :disabled="baseDisabled" v-model="formValidate.biologyVersion" placeholder="版本" style="width:95%">
                <i-option v-for="(item,index) in bookVersionList" :key='index' :value="item.version">{{ item.version }}</i-option>
              </i-select>
            </td>
            <td>
              <i-select :disabled="baseDisabled" v-model="formValidate.politicsVersion" placeholder="版本" style="width:95%">
                <i-option v-for="(item,index) in bookVersionList" :key='index' :value="item.version">{{ item.version }}</i-option>
              </i-select>
            </td>
            <td>
              <i-select :disabled="baseDisabled" v-model="formValidate.historyVersion" placeholder="版本" style="width:95%">
                <i-option v-for="(item,index) in bookVersionList" :key='index' :value="item.version">{{ item.version }}</i-option>
              </i-select>
            </td>
            <td>
              <!--<i-select v-model="formValidate.otherVersion" placeholder="版本" style="width:95%">-->
              <!--<i-option v-for="item in scrollList" :value="item.version">{{ item.version }}</i-option>-->
              <!--</i-select>-->
            </td>
          </tr>
        </table>


        <div class="split-div">
          <div class="title">移交正式生备注</div>
        </div>
        <Form-item prop="remark" label="客户端是否正常流畅">
          <i-input type="textarea" :disabled="baseDisabled" placeholder="客户端是否正常流畅"  v-model="formValidate.clientReamrk" :rows="4" :maxlength="500"
                   style="width:200px"></i-input>
        </Form-item>
        <Form-item prop="remark" label="是否为学员定制课程规划">
          <i-input type="textarea" :disabled="baseDisabled" placeholder="是否为学员定制课程规划" v-model="formValidate.coursePlanRemark" :rows="4" :maxlength="500"
                   style="width:200px"></i-input>
        </Form-item>
        <Form-item label="首课要上的科目" prop="subject">
          <i-select v-model="formValidate.firstCourseSubject" :disabled="baseDisabled" placeholder="首科要上的科目" style="width:200px">
            <i-option v-for="(item,index) in subjectList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
        </Form-item>
        <Form-item label="首课时间" prop="subject">
          <Date-picker type="daterange" v-model='dataTime' size="small" :disabled="baseDisabled" @on-change="changeDate" placement="bottom-end" placeholder="首课时间"
                       style="width: 200px"></Date-picker>
        </Form-item>
        <Form-item label="是否有扩科需求">
          <Radio-group v-model="formValidate.isAddSubject" style="width:200px">
            <Radio label="0" :disabled="baseDisabled">否</Radio>
            <Radio label="1" :disabled="baseDisabled">是</Radio>
          </Radio-group>
        </Form-item>
        <Form-item label="扩科科目" prop="subject" v-show="formValidate.isAddSubject==1">
          <i-select v-model="formValidate.addSubject" :disabled="baseDisabled" placeholder="扩科科目"
                    style="width:200px">
            <i-option v-for="(item,index) in subjectList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
        </Form-item>
        <Form-item prop="remark" label="以往补习经历">
          <i-input type="textarea" v-model="formValidate.beforeStudy" placeholder="以往补习经历" :disabled="baseDisabled" :rows="4" :maxlength="500"
                   style="width:200px"></i-input>
        </Form-item>
        <Form-item prop="remark" label="具体学习情况及学习主动性">
          <i-input type="textarea" v-model="formValidate.studyInfo" placeholder="具体学习情况及学习主动性" :disabled="baseDisabled" :rows="4" :maxlength="500"
                   style="width:200px"></i-input>
        </Form-item>
        <Form-item prop="remark" label="学生性格特点及相关家庭情况：">
          <i-input type="textarea" v-model="formValidate.leadsCharacterFamily" placeholder="学生性格特点及相关家庭情况" :disabled="baseDisabled" :rows="4"
                   :maxlength="500"
                   style="width:400px"></i-input>
        </Form-item>
        <Form-item prop="remark" label="家长关注点以及对老师的要求：">
          <i-input type="textarea" v-model="formValidate.familyFocus" placeholder="家长关注点以及对老师的要求" :disabled="baseDisabled" :rows="4" :maxlength="500"
                   style="width:400px"></i-input>
        </Form-item>
        <Form-item prop="remark" label="允许排课时间以及上课频率（作息）：">
          <i-input type="textarea" v-model="formValidate.courseInfo" placeholder="允许排课时间以及上课频率（作息）" :disabled="baseDisabled" :rows="4" :maxlength="500"
                   style="width:400px"></i-input>
        </Form-item>
        <Form-item prop="remark" label="其它（特殊情况报备）：">
          <i-input type="textarea" v-model="formValidate.otherInfo" placeholder="其它（特殊情况报备）" :disabled="baseDisabled" :rows="4" :maxlength="500"
                   style="width:400px"></i-input>
        </Form-item>
      </i-form>
    </div>
  </Modal>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {SCS} from 'common/api/scs.js';
  import {ORDER} from 'common/api/order.js';
  import {common,clearSearchForm} from 'common/js/common.js';
  import html2canvas from 'html2canvas';

  export default{
    data() {
//      var validateBank = (rule, value, callback) => {
//        if (this.isViewBank && value === "" && this.formValidate.otherBank === "") {
//          callback(new Error('请选择一个银行或者填写一个银行'));
//        } else {
//          callback();
//        }
//      }
//      var validateBuyLength = (rule, value, callback) => {
//        if (value.toString().includes('.')) {
//          callback(new Error('购买课时不能是小数'));
//        } else if (value > 960) {
//          callback(new Error('购买课时不能大于960'));
//          callback();
//        }
//      }
      return {
        // 添加课程时长阿选择显示标识符
        hasCourseTimes:false,
        loading: true,
        title0: false,
        title1: false,
        payRequestModal: false,
        changeSelect: false,
        baseDisabled: false,
        leadsUuid: '',
        dataTime: [],
        flag: '',
        subjectList: [],//科目
        gradeList: [],
        provinceList: [],//省
        cityArrays: [],//市
        areaList: [],//区
        scrollList: [],//学校
        bookVersionList: [],//教材版本
//        bookVersionList2: [],//教材版本
//        bookVersionList3: [],//教材版本
//        bookVersionList4: [],//教材版本
//        bookVersionList5: [],//教材版本
//        bookVersionList6: [],//教材版本
//        bookVersionList7: [],//教材版本
//        bookVersionList8: [],//教材版本
        formValidate: {
          //移交表
          //                    成绩
          biologyFullScore : '',
          biologyScore : '',
          biologyVersion : '',
          chemistryFullScore : '',
          chemistryScore : '',
          chemistryVersion : '',
          englishFullScore : '',
          englishScore : '',
          englishVersion :'',
          historyFullScore : '',
          historyScore : '',
          historyVersion :'',
          languageFullScore : '',
          languageScore : '',
          languageVersion : '',
          mathematicsFullScore : '',
          mathematicsScore : '',
          mathematicsVersion : '',
          otherFullScore : '',
          otherScore : '',
          otherVersion :'',
          physicsFullScore : '',
          physicsScore :'',
          physicsVersion : '',
          politicsFullScore : '',
          politicsScore : '',
          politicsVersion : '',
//                    备注
          addSubject : '',
          beforeStudy : '',
          clientReamrk : '',
          courseInfo : '',
          coursePlanRemark : '',
          familyFocus : '',
          firstCourseEndTime : '',
          firstCourseStartTime : '',
          firstCourseSubject : '',
          isAddSubject : '',
          leadsCharacterFamily : '',
          otherInfo : '',
          studyInfo :'',
//                    基本情况
          city : '',
          cityId : '',
          count : '',
          countId : '',
          grade : '',
          name : '',
          phone : '',
          province :'',
          provinceId : '',
          school : '',
          sex : '',
          subject :'',
          isScience : '',
          // 添加选择课程时间
          courseTimes:45,
        },
        bankList: [],
        coursePriceTypeList: [],
        ruleValidate: {
//          coursePriceType: [
//            {required: true, message: '请选择购买课时包', trigger: 'change'}
//          ],
//          buyLength: [
//            {required: true, validator: validateBuyLength, trigger: ['change', 'blur']},
//          ],
//          money: [
//            {required: true, type: 'number', min: 1, message: '不能小于1', trigger: 'blur'}
//          ],
//          payType: [
//            {required: true, message: '付费方式不能为空', trigger: 'change'},
//          ],
//          bank: [
//            {required: true, validator: validateBank, trigger: ['blur', 'change']}
//          ],
//          payDate: [
//            {required: true, type: 'string', message: '请选择付款时间', trigger: 'change'}
//          ]
        }
      }
    },
    mounted(){
      const _this = this;
      //获取省
      common.ajax({
        url: COMMON_API().ssqAreaAllStudy,
        method: 'get',
        data: {parentid: 1},
        success: function (response) {
          _this.provinceList = response.data || [];
//          _this.cityArrays = [];
//          _this.areaList = [];
//          _this.scrollList = [];

        }
      });
    },
    methods: {
      capture () {  //截图下载
        html2canvas(document.querySelector(".capture-main")).then(function(canvas) {
          let e = document.createEvent("MouseEvents")
          e.hiInitEvent("click", true, true);
          let down = document.querySelector(".down");
          down.setAttribute('href',canvas.toDataURL("image/jpg"));
          down.dispatchEvent(e);
        });
      },
      show(leadsUuid, flag) {
        clearSearchForm(this.formValidate, [this.$refs.formValidate], this);
        this.leadsUuid = leadsUuid;

        this.flag = flag;
        if (flag == 'get') {
          this.title0 = true;
          this.baseDisabled = true;
        }
        if (flag == 'modify') {
          this.title1 = true;
          this.baseDisabled = false;
        }
        this.hiInit(leadsUuid);//页面初始化
      },
      hiInit(leadsUuid){
        const _this = this;
        _this.changeSelect == false;
        //获取科目年级
        $.getJSON("static/data.json", function (json) {
          _this.gradeList = json.gradeList;
          _this.subjectList = json.subjectList;
        });
        //获取基本信息
        common.ajax({
          url: SCS().MyStudent.getHandOutRemark,
          method: 'get',
          data: {
            leadsUuid: leadsUuid
          },
          success: function (res) {
            console.log(res);
            let data = res.data;
            if(data){
              if(data.leadsGrades && data.handoutRemarks && data.leads) {
                console.log(11);
                // 成绩
                _this.formValidate.biologyFullScore = data.leadsGrades.biologyFullScore || '';
                _this.formValidate.biologyScore = data.leadsGrades.biologyScore || '';
                _this.formValidate.biologyVersion = data.leadsGrades.biologyVersion || '';
                _this.formValidate.chemistryFullScore = data.leadsGrades.chemistryFullScore || '';
                _this.formValidate.chemistryScore = data.leadsGrades.chemistryScore || '';
                _this.formValidate.chemistryVersion = data.leadsGrades.chemistryVersion || '';
                _this.formValidate.englishFullScore = data.leadsGrades.englishFullScore || '';
                _this.formValidate.englishScore = data.leadsGrades.englishScore || '';
                _this.formValidate.englishVersion = data.leadsGrades.englishVersion || '';
                _this.formValidate.historyFullScore = data.leadsGrades.historyFullScore || '';
                _this.formValidate.historyScore = data.leadsGrades.historyScore || '';
                _this.formValidate.historyVersion = data.leadsGrades.historyVersion || '';
                _this.formValidate.languageFullScore = data.leadsGrades.languageFullScore || '';
                _this.formValidate.languageScore = data.leadsGrades.languageScore || '';
                _this.formValidate.languageVersion = data.leadsGrades.languageVersion || '';
                _this.formValidate.mathematicsFullScore = data.leadsGrades.mathematicsFullScore || '';
                _this.formValidate.mathematicsScore = data.leadsGrades.mathematicsScore || '';
                _this.formValidate.mathematicsVersion = data.leadsGrades.mathematicsVersion || '';
                _this.formValidate.otherFullScore = data.leadsGrades.otherFullScore || '';
                _this.formValidate.otherScore = data.leadsGrades.otherScore || '';
                _this.formValidate.otherVersion = data.leadsGrades.otherVersion || '';
                _this.formValidate.physicsFullScore = data.leadsGrades.physicsFullScore || '';
                _this.formValidate.physicsScore = data.leadsGrades.physicsScore || '';
                _this.formValidate.physicsVersion = data.leadsGrades.physicsVersion || '';
                _this.formValidate.politicsFullScore = data.leadsGrades.politicsFullScore || '';
                _this.formValidate.politicsScore = data.leadsGrades.politicsScore || '';
                _this.formValidate.politicsVersion = data.leadsGrades.politicsVersion || '';

                // 备注
                _this.formValidate.addSubject = data.handoutRemarks.addSubject || '';
                _this.formValidate.beforeStudy = data.handoutRemarks.beforeStudy || '';
                _this.formValidate.clientReamrk = data.handoutRemarks.clientReamrk || '';
                _this.formValidate.courseInfo = data.handoutRemarks.courseInfo || '';
                _this.formValidate.coursePlanRemark = data.handoutRemarks.coursePlanRemark || '';
                _this.formValidate.familyFocus = data.handoutRemarks.familyFocus || '';
                _this.formValidate.firstCourseEndTime = data.handoutRemarks.firstCourseEndTime || '';
                _this.formValidate.firstCourseStartTime = data.handoutRemarks.firstCourseStartTime || '';
                _this.formValidate.firstCourseSubject = data.handoutRemarks.firstCourseSubject || '';
                _this.formValidate.isAddSubject = data.handoutRemarks.isAddSubject || '';
                _this.formValidate.leadsCharacterFamily = data.handoutRemarks.leadsCharacterFamily || '';
                _this.formValidate.otherInfo = data.handoutRemarks.otherInfo || '';
                _this.formValidate.studyInfo = data.handoutRemarks.studyInfo || '';
                _this.dataTime = [
                  res.data.handoutRemarks.firstCourseStartTime,
                  res.data.handoutRemarks.firstCourseEndTime,
                ];

                // 基本情况
                _this.formValidate.city = data.leads.city || '';
                _this.formValidate.cityId = data.leads.cityId || '';
                _this.formValidate.count = data.leads.count || '';
                _this.formValidate.countId = data.leads.countId || '';
                _this.formValidate.grade = data.leads.grade || '';
                _this.formValidate.courseTimes = data.leads.courseLength || '';
                _this.formValidate.name = data.leads.name || '';
                _this.formValidate.phone = data.leads.phone || '';
                _this.formValidate.province = data.leads.province || '';
                _this.formValidate.provinceId = data.leads.provinceId || '';
                _this.formValidate.school = data.leads.school || '';
                _this.formValidate.sex = data.leads.sex == null ? '' : data.leads.sex + '';
                _this.formValidate.subject = data.leads.subject || '';
                _this.formValidate.isScience = data.leads.isScience == null ? '' : data.leads.isScience + '';
              }
              // console.log(_this.formValidate.countId);
              _this.payRequestModal = true;
            }else{
              _this.$Modal.warning({
                title: '提示',
                content: res.msg
              });
            }

            function a() {
              return new Promise(function (res, rej) {
                //获取城市
                if(!data.leads.provinceId){
                  res(1)
                }else {
                  common.ajax({
                    url: COMMON_API().ssqAreaAllStudy,
                    method: 'get',
                    data: {parentid: _this.formValidate.provinceId},
                    success: function (response) {
                      _this.cityArrays = response.data;
                      res(1)
                    }
                  });
                }
              })
            };
            function b() {
              return new Promise(function (res, rej) {
                if(!data.leads.cityId){
                  res(1)
                }else {
                  //获取城市
                  common.ajax({
                    url: COMMON_API().ssqAreaAllStudy,
                    method: 'get',
                    data: {parentid: _this.formValidate.cityId},
                    success: function (response) {
                      _this.areaList = response.data || [];
                      res(1)
                    }
                  });
                }
              })
            };
            function c() {
              return new Promise(function (res, rej) {
                if(!data.leads.provinceId && !data.leads.cityId && !data.leads.countId){
                  res(1)
                }else {
                  //学校
                  common.ajax({
                    url: COMMON_API().allStudySchool,
                    method: 'get',
                    data: {
                      provinceId: _this.formValidate.provinceId,
                      cityId: _this.formValidate.cityId,
                      countId: _this.formValidate.countId,
                    },
                    success: function (response) {
                      _this.scrollList = response.data || [];
                      res(1)
                    }
                  });
                }
              })
            };
//            a().then(function (data0) {
//              if(data0 == 1){
//                b().then(function (data0) {
//                  if(data0 == 1){
//                    c().then(function () {
//                      _this.payRequestModal = true;
//                      setTimeout(function () {
//                        _this.changeSelect = true;
//                      },1000)
//                    })
//                  }
//                })
//              }
//            })
            let arr = ['小三','小四','小五','小六','预初'];
            if(arr.indexOf(_this.formValidate.grade) != -1){
              _this.hasCourseTimes = true;
            } else {
              _this.hasCourseTimes = false;
            }
          }
        });
      },
      getVersion(value){
        const _this = this;
        common.ajax({
          url: COMMON_API().allBookVersion,
          method: 'get',
          data: {grade: value},
          success: function (response) {
            _this.bookVersionList = response.data || [];
            let arr = ['小三','小四','小五','小六','预初'];
            if(arr.indexOf(_this.formValidate.grade) != -1){
              _this.hasCourseTimes = true;
            } else {
              _this.hasCourseTimes = false;
            }
          }
        });
      },
//      省市区学校start
      changeSelectedCity(areaName) {
          if(areaName.value != '') {
            const _this = this;
            _this.formValidate.province = areaName.label;
            //获取城市
            common.ajax({
              url: COMMON_API().ssqAreaAllStudy,
              method: 'get',
              data: {parentid: areaName.value},
              success: function (response) {
                _this.cityArrays = response.data || [];
//                _this.areaList = [];
//                _this.scrollList = [];
              }
            });
          }
      },
      changeSelectedArea(areaName) {
        if(areaName.value != '') {
          const _this = this;
          //获取城市的区域
          if (areaName.label) {
            _this.formValidate.city = areaName.label;
          }
          common.ajax({
            url: COMMON_API().ssqAreaAllStudy,
            method: 'get',
            data: {parentid: areaName.value},
            success: function (response) {
              _this.areaList = response.data || [];
//              _this.scrollList = [];
            }
          });
        }
      },
      changeSelectedCount(areaName){
        if(areaName.value != '') {
          const _this = this;
          if (areaName.label) {
            _this.formValidate.count = areaName.label;
          }
          common.ajax({
            url: COMMON_API().allStudySchool,
            method: 'get',
            data: {
              provinceId: _this.formValidate.provinceId,
              cityId: _this.formValidate.cityId,
              countyId: areaName.value
            },
            success: function (response) {
              _this.scrollList = response.data || [];
            }
          });
        }

      },
//      省市区学校End
      onOk() {
        this.loading = false;
        this.$refs.formValidate.validate((valid) => {
          if (valid) {
            const _this = this;
            if(_this.flag == 'get'){

              _this.payRequestModal = false;
            }else{
              common.ajax({
                url: SCS().MyStudent.updateHandOutRemark,
                data: {
                  // 成绩
                  biologyFullScore: _this.formValidate.biologyFullScore,
                  biologyScore: _this.formValidate.biologyScore,
                  biologyVersion: _this.formValidate.biologyVersion,
                  chemistryFullScore: _this.formValidate.chemistryFullScore,
                  chemistryScore: _this.formValidate.chemistryScore,
                  chemistryVersion: _this.formValidate.chemistryVersion,
                  englishFullScore: _this.formValidate.englishFullScore,
                  englishScore: _this.formValidate.englishScore,
                  englishVersion: _this.formValidate.englishVersion,
                  historyFullScore: _this.formValidate.historyFullScore,
                  historyScore: _this.formValidate.historyScore,
                  historyVersion: _this.formValidate.historyVersion,
                  languageFullScore: _this.formValidate.languageFullScore,
                  languageScore: _this.formValidate.languageScore,
                  languageVersion: _this.formValidate.languageVersion,
                  leadsUuid: _this.formValidateUuid,
                  mathematicsFullScore: _this.formValidate.mathematicsFullScore,
                  mathematicsScore: _this.formValidate.mathematicsScore,
                  mathematicsVersion: _this.formValidate.mathematicsVersion,
                  otherFullScore: _this.formValidate.otherFullScore,
                  otherScore: _this.formValidate.otherScore,
                  otherVersion: _this.formValidate.otherVersion,
                  physicsFullScore: _this.formValidate.physicsFullScore,
                  physicsScore: _this.formValidate.physicsScore,
                  physicsVersion: _this.formValidate.physicsVersion,
                  politicsFullScore: _this.formValidate.politicsFullScore,
                  politicsScore: _this.formValidate.politicsScore,
                  politicsVersion: _this.formValidate.politicsVersion,
//                    备注
                  addSubject: _this.formValidate.addSubject,
                  beforeStudy: _this.formValidate.beforeStudy,
                  clientReamrk: _this.formValidate.clientReamrk,
                  courseInfo: _this.formValidate.courseInfo,
                  coursePlanRemark: _this.formValidate.coursePlanRemark,
                  familyFocus: _this.formValidate.familyFocus,
                  firstCourseEndTime: _this.formValidate.firstCourseEndTime,
                  firstCourseStartTime: _this.formValidate.firstCourseStartTime,
                  firstCourseSubject: _this.formValidate.firstCourseSubject,
                  isAddSubject: _this.formValidate.isAddSubject,
                  leadsCharacterFamily: _this.formValidate.leadsCharacterFamily,
                  otherInfo: _this.formValidate.otherInfo,
                  studyInfo: _this.formValidate.studyInfo,
//                    基本情况
                  city: _this.formValidate.city,
                  cityId: _this.formValidate.cityId,
                  count: _this.formValidate.count,
                  countId: _this.formValidate.countId,
                  grade: _this.formValidate.grade,
                  courseLength: _this.formValidate.courseTimes,
                  name: _this.formValidate.name,
                  phone: _this.formValidate.phone,
                  province: _this.formValidate.province,
                  provinceId: _this.formValidate.provinceId,
                  school: _this.formValidate.school,
                  sex: _this.formValidate.sex,
                  subject: _this.formValidate.subject,
                  isScience: _this.formValidate.isScience,
                  uuid: _this.leadsUuid,
                },
                success: function (response) {
                  _this.payRequestModal = false;
                  common.notices('操作成功！！');
                  _this.$emit('reFresh', 'success');
                }
              });
            }
          } else {
            setTimeout(() => {
              this.loading = true;
            }, 0);
          }
        });
      },
//      changeCoursePriceType(value) {
//        if (value === '清北') {
//          this.formValidate.level = 1;
//        } else if (value === '明星') {
//          this.formValidate.level = 2;
//        } else {
//          this.formValidate.level = 0;
//        }
//      },
//      changePayDate(value) {
//        this.formValidate.payDate = value;
//      },
      changeDate(value) {
        this.formValidate.firstCourseStartTime = value[0] || '';
        this.formValidate.firstCourseEndTime = value[1] || '';

      },
//      changePayType(value) {
//        if (value === "bank") {
//          this.isViewBank = true;
//        } else {
//          this.isViewBank = false;
//        }
//      }
    },
    computed: {
//      payMoney() {
//        let money = 0;
//        let coursePriceType = this.formValidate.coursePriceType;
//        if (coursePriceType) {
//          let coursePriceActivityType = this.formValidate.coursePriceActivityType;
//          let buyLength = this.formValidate.buyLength;
//          let promotionCode = this.formValidate.promotionCode;
//          common.ajax({
//            url: ORDER().CreateOrder.getPayMoney,
//            method: 'get',
//            isAsync: 'no',
//            data: {
//              coursePriceType: coursePriceType,
//              coursePriceActivityType: coursePriceActivityType,
//              buyLength: buyLength,
//              promotionCode: promotionCode
//            },
//            success(res) {
//              money = res.data;
//            },
//            complete: function () {
//              return money;
//            }
//          });
//          return money;
//        }
//        return money;
//      },
      modalTitle() {
        return (this.flag === 'greenChannel') ? '付费申请' : '绿色通道（未试听学生提交付费申请）';
      },
    }
  };
</script>

<style scoped>
  .onlyhi-table {
    margin-left: 12px;
    width: 98% !important;
  }

  .money-info span {
    font-size: 25px;
  }

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
    font-weight: bold;
    vertical-align: middle;
  }
  .txt-center{
    position: relative;
  }
  .txt-center div{
    position: absolute;
    right: 10px;
    height: 20px;
    top: -10px;
    font-size: 40px;
    cursor: pointer;
  }
  .txt-center div:active{
    transform: scale(.9);
  }

</style>
