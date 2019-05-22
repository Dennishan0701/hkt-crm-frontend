<template>
  <div class="addRequirements">
    <o-breadcrumb second="销售与客服" third="待排课" third-url="/leads/waitCourse" four="排课要求"></o-breadcrumb>
    <table class="onlyhi-table">
      <caption><h1 class="title">排课要求</h1></caption>
      <tr>
        <th width="120">课程类型</th>
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
            <i-select v-model="formItem.classLength" style="width:80px">
              <i-option v-for="(item,index) in classLengthList" :key='index' :value="item.value">{{item.value}}</i-option>
            </i-select>
          </template>
          <template v-else>1</template>
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
    <div-split></div-split>
    <table class="onlyhi-table">
      <tr>
        <th class="required" width="120">上课日期</th>
        <td>
          <date-picker type="date" placement="bottom-start" :value="formItem.startDate" @on-change="changeStartDate" placeholder="选择日期" style="width: 200px"></date-picker>
        </td>
      </tr>
      <tr>
        <th class="required">上课时间</th>
        <td>
          <i-select v-model="formItem.startTime" @on-change="changeStartTime" style="width:87px">
            <i-option v-for="(item,index) in startTimeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
          &nbsp;至&nbsp;
          <i-select v-model="endTime" style="width:87px">
            <i-option v-for="(item,index) in endTimeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
          <p style="color:red;text-align:center;">{{tipMsg}}</p>
        </td>
      </tr>
      <tr>
        <th v-show="formItem.errorJuan == 1">有无错题或试卷</th>
        <th class="required" v-show="formItem.errorJuan == 0">有无错题或试卷</th>
        <td>
          <Radio-group v-model="formItem.errorJuan">
            <Radio label="0">有</Radio>
            <Radio label="1">无</Radio>
          </Radio-group>
          <span v-show="formItem.errorJuan == 0" class="errorTip"><Icon type="information-circled"></Icon> 只能上传图片，大小不要超过10MB</span>
        </td>
      </tr>
      <tr v-show="formItem.errorJuan == 0">
        <td colspan="2" id="uploadTd">
          <div class="demo-upload-list" v-for="(item,index) in uploadList" :key='index'>
            <template v-if="item.status === 'finished'">
              <img :src="item.url">
              <div class="demo-upload-list-cover">
                <span @click="handleView(item.response.data.fileAddress)"><Icon type="ios-eye-outline"></Icon></span>
                <span @click="handleRemove(item)"><Icon type="ios-trash-outline" ></Icon></span>
              </div>
            </template>
            <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
          </div>
          <Upload
            ref="upload"
            :show-upload-list="false"
            :default-file-list="defaultList"
            :on-success="handleSuccess"
            :format="uploadFormat"
            :max-size="12040"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            :data="uploadData"
            multiple
            type="drag"
            :action="uploadAction"
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="camera" size="20"></Icon>
            </div>
          </Upload>
          <Modal title="查看图片" v-model="visible">
            <img :src="imgName" v-if="visible" style="width: 100%">
          </Modal>
        </td>
      </tr>
    </table>
    <div-split></div-split>
    <table class="onlyhi-table">
      <tr>
        <th width="120">建议老师</th>
        <td>
          <i-input v-model="formItem.teacher" placeholder="老师姓名" style="width:200px;"></i-input>
        </td>
      </tr>
      <tr>
        <th style="vertical-align: text-top;">其他要求</th>
        <td>
          <i-input type="textarea" v-model="formItem.descValue" :rows="4" :maxlength="500" placeholder="500字以内，如：我是腿控，我要腿长的女老师！" style="width: 400px"></i-input>
          <!--<textarea class="o-input" id="descValue" maxlength="500" style="width: 300px;height:100px;"></textarea>-->
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
  import {STUDY_COURSE} from 'common/api/studyCourse.js';
  import {SCS} from 'common/api/scs.js';
  import {AUTHORITY} from 'common/api/authority.js';
  import {common,computedEndTime,checkImageExt} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import divSplit from 'components/o/oDivSplit';

  export default{
    data() {
      return {
        uploadList:[],
        fixedCourseType:0,
        fixedLength:1,
        loading: false,
        saveLoading: false,
        endTime: '',
        courseUuid: sessionStorage.getItem('waitCourse_addRequirements_courseUuid'),
        formItem: {
          isCr: false,  //是否是CR
          courseType: 0,  //课程类型
          classLength: 1, //上课时长
          classType: 0,   //上课形式
          hz: '一周2节',
          level: 0,
          startTime: '',               //开始时间
          errorJuan: 1,
          teacher: '',
          descValue: ''
        },
        hzList: [],
        startTimeList: [],
        endTimeList: [],
        tipMsg: '',
        defaultList: [
        ],
        classLengthList: [],
        uploadData: {
          token: localStorage.getItem('token'),
          courseUuid: sessionStorage.getItem('waitCourse_addRequirements_courseUuid')
        },
        uploadFormat: ['jpg','jpeg','png','bmp','webp','gif'],
        successViewList: [],
        imgName: '',
        visible: false,
        uploadAction: SCS().WaitCourse.uploadFile
      }
    },
    mounted() {
      console.log(this.$refs.upload.fileList);
      // this.uploadList = this.$refs.upload.fileList;
      const _this = this;
      common.ajax({
        url: SCS().WaitCourse.getCourseOrder,
        method: 'get',
        data: {courseUuid: this.courseUuid},
        success: function (res) {
          let data = res.data;
          // console.log(data);
          if(data){
            _this.formItem.courseType = data.type;
            _this.formItem.classLength = data.length + '';
            _this.formItem.classType = data.style;
            _this.formItem.level = data.level;
          }
        }
      });
      $.getJSON("static/data.json", function (json) {
        _this.classLengthList = json.classLengthList;//获取上课时长
        _this.hzList = json.formalClassList;//获取正式课频率
      });
      //获取当前角色
      common.ajax({
        url: AUTHORITY().SystemUser.getByToken,
        method: 'get',
        success: function (res) {
          let data = res.data;
          let roleName = data.roleName;
          if (roleName === '班主任' || data.alias === 'cr') { //CR
            _this.formItem.isCr = true;
          } else {
            _this.formItem.courseType = 0;
          }
        }
      });
      this.loadClassTime('start');
      //获取错题
      common.ajax({
        url: STUDY_COURSE().WaitCourse.errorQuestion,
        method: 'get',
        data: { courseRequestUuid: _this.courseUuid },
        success: function (res) {
          if (res.data.length) {
            let images = res.data[0].images;
            if(images.length > 0) {
              for(var i=0; i<images.length; i++) {
                _this.defaultList.push({
                  'name': images[i].originalFileName,
                  'url': images[i].fileAddress
                });
              }
            }
          }
        }
      });
    },
//     computed: {
// //      endTime() {
// //        let val = computedEndTime(this.formItem.classLength, this.formItem.startTime);
// //        (val > '24:00') ? this.tipMsg = '无语！动点脑子好不？上课时长+开始时间超过24点了。。' : this.tipMsg = '';
// //        if (this.endTimeList.length > 0) return val;
// //      },
// //       uploadList () {
// //         return this.$refs.upload ? this.$refs.upload.fileList : [];
// //       }
//     },
    methods: {
      save() {
        let courseType = this.formItem.courseType || 0;   //课程类型
        let classLength = this.formItem.classLength || 1; //上课时长
        let classType = this.formItem.classType;     //上课形式
        let hz = this.formItem.hz;     //正式课频率
        let level = this.formItem.level;     //课时级别
        let startDate = this.formItem.startDate || '';
        let startTime = this.formItem.startTime;
        let endTime = this.endTime;
        let errorJuan = this.formItem.errorJuan;
        let desc = this.formItem.descValue;
        let teacher = this.formItem.teacher;  //建议老师
        let tipMsg = this.tipMsg;

        if (hz === "") {
          common.msg('请填写正式课频率！');
          return false;
        } else if (startDate === "") {
          common.msg('请填写上课日期！');
          return false;
        } else if (startTime === "") {
          common.msg('请填写上课开始时间！');
          return false;
        } else if (endTime === "") {
          common.msg('请填写上课结束时间！');
          return false;
        } else if (errorJuan === 0 && this.successViewList.length === 0) {
          common.msg('请上传错题啊，搞什么啊？？！');
          return false;
        } else if (tipMsg !== '') {
          common.msg(tipMsg);
          return false;
        } else {
          const _this = this;
          _this.saveLoading = true;
          common.ajax({
            url: SCS().WaitCourse.saveRequirements,
            data: {
              // courseUuid: this.courseUuid,
              courseOrderUuid: this.courseUuid,
              type: courseType,
              length: classLength,
              style: classType,
              hz: hz,
              level: level,
              dates: startDate,
              startTime: startTime,
              endTime: endTime,
              teacherName: teacher,
              other: desc
            },
            success: function (response) {
              common.notices('操作成功！！');
              _this.close();
            },
            complete: function () {
              _this.saveLoading = false;
            }
          });
        }
      },
      handleView (name) {
        this.imgName = name;
        this.visible = true;
      },
      handleRemove (file) {
        console.log(1);
        let _this = this;
        common.ajax({
          url: SCS().WaitCourse.deleteFile,
          data: {
            fileName: file.response.data.originalFileName,
            requestUuid: file.response.data.courseRequestUuid
          },
          success: function (response) {
            common.msg('操作成功！！','success');
            _this.successViewList.pop();
            const fileList = _this.$refs.upload.fileList;
            _this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
          }
        });
      },
      handleSuccess (res, file) {
        // console.log(res);
        if (res.code === RES_STATUS_SUCCESS) {
          common.msg('上传成功！', 'success');
          file.url = res.data.fileAddress;
          file.name = res.data.originalFileName;
          this.successViewList.push({
            name: res.data.originalFileName,
            url: res.data.fileAddress,
            courseRequestUuid: res.data.courseRequestUuid
          });
          // console.log(this.$refs.upload.fileList);
          this.uploadList = this.$refs.upload.fileList;

        } else {
          this.$Notice.error({
            title: '上传失败失败',
            desc: 'code：' + res.code + '，msg：' + res.msg
          });
        }
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: `文件 ${file.name} 格式不正确，请上传 ${this.uploadFormat.join(',')} 格式的图片。`
        });
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 10M。'
        });
      },
      handleBeforeUpload () {
        const check = this.uploadList.length < 5;
        if (!check) {
          this.$Notice.warning({
            title: '最多只能上传 5 张图片。'
          });
        }
        return check;
      },
      changeStartTime(value) {
        this.loadClassTime('end', value);
      },
      loadClassTime(type, range) {
        let _this = this;
        //上课时间开始时间7-23
        if (type === 'start') {
          $.getJSON("static/data.json", function (json) {
            var list = json.courseRangTimes30;
            list = list.slice(0, list.length - 2);
            _this.startTimeList = list;
          });
        }
        //结束时间8-24
        if (type === 'end') {
          range = range || '';
          _this.endTimeList = [];
          $.getJSON("static/data.json", function (json) {
            json.courseRangTimes30.forEach((item, index) => {
              if (item.value > range) {
              _this.endTimeList.push(item);
              }
            });
          });
        }
      },
      changeStartDate(value) {
        this.formItem.startDate = value;
      },
      close() {
        window.history.back();
      }
    },
    components: {OBreadcrumb, divSplit}
  };
</script>

<style scoped>
  .onlyhi-table{margin-left:12px;width: 98%;border: none;}
  .onlyhi-table td,th{ text-align: left;}
  .o-table td,th{text-align:left;}
  .onlyhi-table td {border-bottom: none;}
  .btn-tools1{width:100%;margin:30px 0;text-align: center}
  .ivu-icon{vertical-align:middle;cursor: pointer;}
  .errorTip {
    color:#ff4949;
    margin-left: 10px;
    vertical-align: middle;
  }
  .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>

