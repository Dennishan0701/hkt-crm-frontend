<template>
<div>
  <o-breadcrumb second="招师代理" third="新增代理信息档案"></o-breadcrumb>
  <div class="resume">
    <Row>
      <i-col span="8">
        <div class="base">
          <div class="model">
            <i-form ref="formValidateBase" :model="formItemBase" :rules="ruleValidateBase">
              <!--<Form-item prop="user">-->
              <!--<img :src="formItemBase.headImg" id="headImgUrl" alt="这里是头像" />-->
              <!--<input type="file" id="headImg" @change="uploadFile('headImg')" class="ivu-upload-input">-->
              <!--<i-button type="info" icon="ios-cloud-upload-outline" @click="uploadBtn('headImg')">更换</i-button>-->
              <!--</Form-item>-->
              <Form-item prop="agentName">
                <i-input v-model="formItemBase.agentName" @on-change="changeAgentName"  placeholder="代理姓名" style="width:200px"></i-input>
              </Form-item>
              <Form-item>
                <Checkbox v-model="formItemBase.type">总代理</Checkbox>
              </Form-item>
              <Form-item v-show="!formItemBase.type" prop="parentAgent">
                <i-select v-model="formItemBase.parentAgent" filterable clearable placeholder="上级代理" style="width:200px">
                  <i-option v-for="(item,index) in parentAgentList" :key='index' :value="item.uuid">{{ item.agentName }}</i-option>
                </i-select>
              </Form-item>
              <Form-item>
                <Radio-group v-model="formItemBase.gender">
                  <Radio label="1">男</Radio>
                  <Radio label="0">女</Radio>
                </Radio-group>
              </Form-item>
              <Form-item prop="agentPhone">
                <i-input v-model="formItemBase.agentPhone" placeholder="手机号码" style="width:200px"></i-input>
              </Form-item>
              <Form-item prop="agentEmail">
                <i-input v-model="formItemBase.agentEmail" placeholder="电子邮箱" style="width:200px"></i-input>
              </Form-item>
              <Form-item prop="idCard">
                <i-input v-model="formItemBase.idCard" :maxlength="18" placeholder="身份证号码" style="width:200px"></i-input>
              </Form-item>
              <Form-item prop="salary">
                <i-input v-model="formItemBase.salary" :maxlength="18" placeholder="薪资" style="width:200px"></i-input>
              </Form-item>
            </i-form>
          </div>
        </div>
      </i-col>
      <i-col span="16">
        <div class="detail">
          <i-form ref="formValidateDetail" :model="formItemDetail" :rules="ruleValidateDetail" :label-width="80">
            <o-div-split text="区域"></o-div-split>
            <Form-item>
              <div>
                代理学校：
                <i-select v-model="formItemDetail.agentSchool" multiple filterable placeholder="代理学校,可多选" style="width:380px">
                  <i-option v-for="(item,index) in schoolList" :key='index' :value="item.uuid">{{ item.schoolName }}</i-option>
                </i-select>
              </div>
              <div>
                就读学校：
                <i-select v-model="formItemDetail.schoolLocation" filterable clearable placeholder="就读学校" style="width:200px">
                  <i-option v-for="(item,index) in schoolList" :key='index' :value="item.uuid">{{ item.schoolName }}</i-option>
                </i-select>
              </div>
            </Form-item>
            <o-div-split text="招师方向"></o-div-split>
            <Form-item>
              <Checkbox-group v-model="formItemDetail.agentTypeArray">
                <Checkbox label="1">兼职</Checkbox>
                <Checkbox label="2">公校</Checkbox>
                <Checkbox label="3">校招</Checkbox>
                <Checkbox label="4">三方</Checkbox>
              </Checkbox-group>
            </Form-item>
            <div v-show="formItemBase.type">
              <o-div-split text="银行卡"></o-div-split>
              <Form-item>
                <span class="title">银行：</span>
                <i-select v-model="formItemDetail.bank" filterable clearable placeholder="银行" style="width:200px">
                  <i-option v-for="(item,index) in bankList" :key='index' :value="item.id">{{ item.bank }}</i-option>
                </i-select>
                <div>
                  <span class="title"></span>
                  <i-input v-model="formItemDetail.otherBankName" placeholder="其他银行" style="width:300px"></i-input>
                </div>
              </Form-item>
              <Form-item prop="bankCard">
                <span class="title">银行卡号：</span>
                <i-input v-model="formItemDetail.bankCard" placeholder="银行卡号" style="width:300px"></i-input>
              </Form-item>
              <Form-item>
                <span class="title">开户行地址：</span>
                <i-input v-model="formItemDetail.bankAddress" placeholder="开户行地址" style="width:300px"></i-input>
              </Form-item>
              <o-div-split text="附件上传"></o-div-split>
              <Form-item>
                <div class="file-upload">
                  <span class="title">身份证电子件</span>
                  <span class="filename"><a href="javascript:;" @click="showImg('fileIdCardUrl')">{{fileItem.fileIdCardName | convertImgName}}</a></span>
                  <input type="file" id="fileIdCard" @change="uploadFile('fileIdCard')" class="ivu-upload-input">
                  <i-button type="ghost" icon="ios-cloud-upload-outline" @click="uploadBtn('fileIdCard')">上传文件</i-button>
                </div>
                <div class="file-upload">
                  <span class="title">合同协议</span>
                  <span class="filename"><a href="javascript:;" @click="showImg('fileContractUrl')">{{fileItem.fileContractName | convertImgName}}</a> </span>
                  <input type="file" id="fileContract" @change="uploadFile('fileContract')" class="ivu-upload-input">
                  <i-button type="ghost" icon="ios-cloud-upload-outline" @click="uploadBtn('fileContract')">上传文件</i-button>
                </div>
                <div class="file-upload">
                  <span class="title">其它</span>
                  <span class="filename"><a href="javascript:;" @click="showImg('fileOtherUrl')">{{fileItem.fileOtherName | convertImgName}}</a></span>
                  <input type="file" id="fileOther" @change="uploadFile('fileOther')" class="ivu-upload-input">
                  <i-button type="ghost" icon="ios-cloud-upload-outline" @click="uploadBtn('fileOther')">上传文件</i-button>
                </div>
              </Form-item>
            </div>
            <o-div-split text="报名地址"></o-div-split>
            <Form-item>
              <i-select v-model="formItemDetail.agentType" ref="ignupSelect" @on-change="changeAgentType" style="width:200px">
                <i-option v-for="(item,index) in agentTypeList" :key='index' :value="item.uuid">{{item.enumName}}</i-option>
              </i-select>
              <div>
                <Radio-group v-model="formItemDetail.qrSize" @on-change="changeQrcodeSize">
                  <Radio label="258">边长8厘米</Radio>
                  <Radio label="860">边长30厘米</Radio>
                </Radio-group>
              </div>
              <p v-show="formItemDetail.agentType">{{qrcodeOption.url}}</p>
              <div id="qrcode" class="qrcode"></div>
            </Form-item>
          </i-form>
        </div>

        <Modal
          v-model="modal1"
          :scrollable="true"
          width="1200">
          <img :src="showWhichImg" style="max-width:1170px;max-height:800px;" />
        </Modal>
      </i-col>
    </Row>
  </div>

  <div style="margin-left: 200px;margin-bottom: 10px;">
    <i-button type="primary" icon="android-done" @click="saveResume"> 保 存 </i-button>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {ZHAO_TEACHER} from 'common/api/teacher.js';
  import {formateDate,common,checkImageExt,checkOfficeExt,checkCommonExt,uploadAjax} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import oDivSplit from 'components/o/oDivSplit';
  export default{
    data() {
      let validatePhone = (rule, value, callback) => {
        if(this.formItemBase.type) {
          if (value === "") {
            callback(new Error('手机号码不能为空'));
          } else if (!(/^1\d{10}$/.test(value))) {
            callback(new Error('请填写合法的手机号码'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      };
      let validateIdCard = (rule, value, callback) => {
        if(value !== '' || this.formItemBase.type){
          if (value.toString().length === 18) {
            let pre = value.substr(0, 16);
            pre = Number.parseInt(pre);
            if (pre.toString().length < 16) {
              callback(new Error('请填写合法的身份证号码1'));
            } else if (!/^[X|x|0-9]$/.test(value[17].toString())) {
              callback(new Error('请填写合法的身份证号码2'));
            } else {
              callback();
            }
          }else{
            callback(new Error('请填写18位身份证号码'));
          }
        }else{
          callback();
        }
      };
      let validateParentAgent = (rule, value, callback) => {
        if (this.formItemBase.type) {
          callback();
        } else if(!value){
          callback(new Error('请选择上级代理'));
        } else {
          callback();
        }
      };
      let validateBankCardNumber = (rule, value, callback) => {
        if (value) {
          var patrn=/^[0-9]{1,20}$/;
          if (!patrn.test(value)) {
            callback(new Error('请填写合法的银行卡号'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      };
      return {
        baseDivHeight: 300,
        qrcodeUrl: 'https://www.onlyhi.cn/',
        formItemBase: {
          agentName: '',
          parentAgent: '',
          type: false,
          gender: 1,
          agentPhone: '',
          agentEmail: '',
          idCard: '',
          salary: '',
        },
        ruleValidateBase: {
          agentName: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          parentAgent: [
            {required: true, validator: validateParentAgent, trigger: 'change'}
          ],
          agentPhone: [
            {required: true, validator: validatePhone, trigger: 'blur'}
          ],
          agentEmail: [
            {required: false, type: 'email', message: '请填写合法的邮箱地址', trigger: 'blur'}
          ],
          idCard: [
            {required: true, validator: validateIdCard, trigger: 'blur'}
          ]
        },
        formItemDetail: {
          agentSchool: [],
          schoolLocation: '',
          agentTypeArray: [],
          bank: '',
          otherBankName: '',
          bankCard: '',
          bankAddress: '',
          agentType: '',
          qrSize: '258'
        },
        ruleValidateDetail: {
          bankCard: [
            {required: true, validator: validateBankCardNumber, trigger: 'blur'}
          ],
          templateId: [
            {required: true, message: '请选择邮件模版', trigger: 'change'}
          ]
        },
//        agentTypeList: [],
        schoolList: [],
        parentAgentList: [],
        bankList: [],
        fileItem: {
          fileIdCardName: '',
          fileIdCardUrl: '',
          fileContractName: '',
          fileContractUrl: '',
          fileOtherName: '',
          fileOtherUrl: ''
        },
        modal1: false,
        showWhichImg: '',
        headImgObj: {},
        idCardObj: {},
        contractObj: {},
        otherObj: {},
      }
    },
    mounted() {
      const _this = this;
      common.ajax({
        url: COMMON_API().allSchool,
        method: 'get',
        success: function (response) {
          _this.schoolList = response.data || [];
        }
      });
      common.ajax({
        url: COMMON_API().allBank,
        method: 'get',
        success: function (response) {
          _this.bankList = response.data || [];
        }
      });
      common.ajax({
        url: ZHAO_TEACHER().Agent.agentTypeList,
        method: 'get',
        success: function (response) {
          _this.agentTypeList = response.data || [];
        }
      });
      common.ajax({
        url: ZHAO_TEACHER().Agent.getAllParentAgent,
        method: 'get',
        success: function (response) {
          _this.parentAgentList = response.data || [];
        }
      });

      let hostname = window.location.hostname;
      if(hostname === 'crm.onlyhi.cn') {  //正式环境
        this.qrcodeUrl = 'https://www.onlyhi.cn/';
      } else if(hostname === 'admin.onlyeduhi.cn') {//公网测试环境
        this.qrcodeUrl = 'http://www.onlyeduhi.cn/';
      }
    },
    methods: {
      uploadFile(id) {
        let dom = document.getElementById(id);
        let _this = this;
        let purpose = '';
        let isFail = false;
        let files = dom.files[0];
        let fileSize = files.size / 1024 / 1024;
        if (fileSize > 10) {
          common.notices('上传的文件大小太大，不能超过10MB', '提示','warning');
        } else {
          if (id === 'headImg') {//头像
            purpose = 1;
            if (!checkImageExt(dom.value)) {
              isFail = true;
              common.msg('上传的文件格式不合法，只能上传图片','提示', 'error');
            }
          } else if (id === 'fileIdCard') {//身份证电子证
            purpose = 2;
          } else if (id === 'fileContract') {//合同协议
            purpose = 3;
            if (!checkCommonExt(dom.value)) {
              isFail = true;
              common.msg('上传的文件格式不支持', 'error');
            }
          } else if (id === 'fileOther') {//其他文件
            purpose = 4;
            if (!checkCommonExt(dom.value)) {
              isFail = true;
              common.msg('上传的文件格式不支持', 'error');
            }
          }
          if (!isFail) {
            uploadAjax({
              url: ZHAO_TEACHER().Agent.uploadFile,//
              data: {
                "file": files,
                "name": files.name,
                "purpose": purpose
              },
              success: function (res) {
                if (id === 'headImg') {//头像
                  document.getElementById(id + 'Url').src = res.data.fileAddress;
                  _this.headImgObj = res.data;
                } else {
                  if (id === 'fileIdCard') {
                    _this.idCardObj = res.data;
                  } else if (id === 'fileContract') {
                    _this.contractObj = res.data;
                  } else if (id === 'fileOther') {
                    _this.otherObj = res.data;
                  }
                  _this.fileItem[id + "Name"] = res.data.fileOriginalName;
                  _this.fileItem[id + "Url"] = res.data.fileAddress;
                }
                common.msg('上传成功！！', 'success');
              }
            });
          }
        }
      },
      showImg(url) {
        let fileUrl = this.fileItem[url];
        if(checkImageExt(fileUrl)) {
          this.modal1 = true;
          this.showWhichImg = fileUrl;
        } else {
          let fileName = fileUrl.substr(fileUrl.lastIndexOf('/') + 1);
          let a = document.createElement('a');
          a.id = 'viewErrorQuestion';
          a.innerHTML = '<span>aaaaaa</span>';
          a.href = fileUrl;
          a.download = fileName;
          a.target = '_blank';
          $('body').append(a);
          $('#viewErrorQuestion span','body').trigger('click');
          $('#viewErrorQuestion','body').remove();
        }
      },
      uploadBtn(id) {
        document.getElementById(id).click();
      },
      saveResume() {
        let isBaseSuccess = false, isDetailSuccess = false;
        this.$refs['formValidateBase'].validate((valid) => {
          if (valid) {
            isBaseSuccess = true;
          }
        });
        this.$refs['formValidateDetail'].validate((valid) => {
          if (valid) {
            isDetailSuccess = true;
          }
        });
        if (isBaseSuccess && isDetailSuccess) {
          const _this = this;
          let agentFileList = [];
          if (_this.headImgObj.id) agentFileList.push(_this.headImgObj.id);
          if (_this.idCardObj.id) agentFileList.push(_this.idCardObj.id);
          if (_this.contractObj.id) agentFileList.push(_this.contractObj.id);
          if (_this.otherObj.id) agentFileList.push(_this.otherObj.id);
          common.ajax({
            url: ZHAO_TEACHER().Agent.addAgent,
            data: {
              agentName: _this.formItemBase.agentName,
              sex: _this.formItemBase.gender,
              generalAgent: _this.formItemBase.type ? 1 : 0,
              phone: _this.formItemBase.agentPhone,
              parentAgent: _this.formItemBase.parentAgent,
              email: _this.formItemBase.agentEmail,
              idNumber: _this.formItemBase.idCard.toLocaleUpperCase(),
              salary: _this.formItemBase.salary,
              agentArea: _this.formItemDetail.agentSchool.join(","),
              schoolLocation: _this.formItemDetail.schoolLocation,
              bankId: _this.formItemDetail.bank,
              cardNumber: _this.formItemDetail.bankCard,
              bankAddress: _this.formItemDetail.bankAddress,
              agentTypeList: _this.formItemDetail.agentTypeArray.join(","),
              agentFileList: agentFileList.join(',')
            },
            success: function (res) {
              common.notices('操作成功！');
              location.hash = '/tcAgent/agentList';
            }
          });
        }
      },
      createQrcode(option) {
        const _this = this;
        let qrcodeDOM = document.getElementById("qrcode");
        qrcodeDOM.innerHTML = "";
        var qrcode = new QRCode(qrcodeDOM, {
          text: option.url,
          width: option.width,
          height: option.height,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
        $(qrcodeDOM).prepend(option.width + ' x ' + option.height + '（右键-图片另存为进行下载）');
      },
      changeQrcodeSize(value) {
        this.createQrcode(this.buildQrOption());
      },
      buildQrOption() {
        let option = {};
        option.url = this.qrcodeUrl + `t/teacher-sign.html?type=${this.formItemDetail.agentType}&source=${this.formItemBase.agentName}`;
        option.url = encodeURI(option.url);
        if (this.formItemDetail.qrSize === 860) {
          option.width = 860;
          option.height = 860;
        } else {
          option.width = 258;
          option.height = 258;
        }
        return option;
      },
      changeAgentName(event) {
        this.formItemBase.agentName = event.target.value;
        this.createQrcode(this.buildQrOption());
      },
      changeAgentType(value) {
        this.formItemDetail.agentType = value;
        this.createQrcode(this.qrcodeOption);
      }
    },
    computed: {
      qrcodeOption() {
        return this.buildQrOption();
      },
      agentTypeList() {
        let arr = [];
        let agentTypeArray = this.formItemDetail.agentTypeArray;
        let obj = {
          "1": "兼职",
          "2": "公校",
          "3": "校招",
          "4": "三方"
        };
        agentTypeArray.forEach((item, index) => {
          arr.push({
            uuid: item,
            enumName: obj[item]
          });
        });
        return arr;
      }
    },
    filters: {
      convertImgName(value) {
        if (value) {
          return value.substr(value.lastIndexOf('/') + 1);
        }
        return '';
      }
    },
    components: {
      OBreadcrumb, oDivSplit
    }
  };
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .resume {
    width: 70%;
    margin-bottom: 10px;
    background-color: rgba(102, 102, 102, 1);
    .base {
      position: relative;
      padding: 10px 10px 0 10px;
      height: 500px;
      color:#fff;
      .model {
        position: fixed;
        margin-top: 10px;
        background-color: rgba(102, 102, 102, 1);
        img {
          width: 150px;
          max-width: 225px;
          border: 1px solid rgba(121, 121, 121, 1);
          float: left;
        }
      }
    }
    .detail {
      border:1px solid rgba(121, 121, 121, 1);
      padding: 10px 10px 0 10px;
      background-color: #fff;
      .qrcode {
        width: 258px;
        height: 290px;
        border: 1px solid #ccc;
        padding: 5px;
        box-sizing: content-box;
        text-align: center;
        overflow: hidden;
      }
      .title { width: 80px; display: inline-block;}
    }
    .ivu-upload-input {display: none;}
  }
</style>
