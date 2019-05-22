<template>
<div>
  <o-breadcrumb second="招师代理" third="代理信息档案"></o-breadcrumb>
  <div class="resume">
    <Row>
      <i-col span="8">
        <div class="base">
          <div class="model">
            <h1>{{formItem.agentName}}</h1>
            <p>{{formItem.parentAgent}}</p>
            <p>{{formItem.gander}}</p>
            <p>{{formItem.phone}}</p>
            <p>{{formItem.email}}</p>
            <p>{{formItem.idCard}}</p>
            <p>￥{{formItem.salary}}</p>
          </div>
        </div>
      </i-col>
      <i-col span="16">
        <div class="detail">
          <o-div-split text="区域"></o-div-split>
          <i-form :label-width="80">
            <Form-item>
              <p>代理学校：{{formItem.agentSchool}}</p>
              <p>就读学校：{{formItem.school}}</p>
            </Form-item>
          </i-form>
          <o-div-split text="招师方向"></o-div-split>
          <i-form :label-width="80">
            <Form-item>
              {{formItem.agentType | convertAgentType}}
            </Form-item>
          </i-form>
          <o-div-split text="银行卡" v-if="formItem.type == '总代理'"></o-div-split>
          <i-form :label-width="80">
            <Form-item>
              <p>{{formItem.bankName}}</p>
              <p>{{formItem.bankCard}}</p>
              <p>{{formItem.bankAddress}}</p>
            </Form-item>
          </i-form>
          <o-div-split text="报名地址"></o-div-split>
          <i-form :label-width="80">
            <Form-item>
              <i-select v-model="formItem.agentType2" ref="signupSelect" @on-change="changeAgentType" style="width:200px">
                <i-option v-for="(item,index) in agentTypeList" :key='index' :value="item.typeCode">{{item.typeName}}</i-option>
              </i-select>

              <div>
                <Radio-group v-model="qrSize" @on-change="changeQrcodeSize">
                  <Radio label="258">边长8厘米</Radio>
                  <Radio label="860">边长30厘米</Radio>
                </Radio-group>
              </div>

              <p>{{qrcodeOption.url}}</p>

              <div id="qrcode" class="qrcode"></div>
            </Form-item>
          </i-form>
        </div>
      </i-col>
    </Row>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
  import {ZHAO_TEACHER} from 'common/api/teacher.js';
  import {formateDate,common} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import oDivSplit from 'components/o/oDivSplit';
  export default{
    data() {
      return {
        baseDivHeight: 300,
        qrcodeUrl: 'https://www.onlyhi.cn/',
        formItem: {
//          headImg: 'https://dunizb.b0.upaiyun.com/p/head.gif',
          agentName: '',
          type: '',
          parentAgent: '',
          gander: '',
          phone: '',
          email: '',
          idCard: '',
          salary: '',
          agentSchool: '',
          school: '',
          agentType: '',
          bankName: '',
          bankCard: '',
          bankAddress: '',
          uuid: '',
          agentType2: '',
        },
        agentTypeList: [],
        qrSize: '258'
      }
    },
    mounted() {
      const _this = this;
      let hostname = window.location.hostname;
      if(hostname === 'crm.onlyhi.cn') {  //正式环境
        this.qrcodeUrl = 'https://www.onlyhi.cn/';
      }else if(hostname === 'crm.haiketang.net') {//新正式环境
        this.qrcodeUrl = 'https://www.onlyhi.cn/';
      } else if(hostname === 'admin.onlyeduhi.cn') {//公网测试环境
        this.qrcodeUrl = 'http://www.onlyeduhi.cn/';
      }
      common.ajax({
        url: ZHAO_TEACHER().Agent.agentInfo,
        method: 'get',
        data: {
          uuid: sessionStorage.getItem('template_uuid')
        },
        success:function(res) {
          let data = res.data;
          if (data) {
            //_this.formItem.headImg = data.logoUrl;
            _this.formItem.agentName = data.agentName;
            _this.formItem.type = (data.generalAgent == 1) ? '总代理' : '分代理';
            _this.formItem.phone = data.phone;
            _this.formItem.parentAgent = data.parentAgent;
            _this.formItem.agentType = data.agentType;
            _this.formItem.agentType2 = data.typeList[0].typeCode;
            _this.formItem.gander = (data.sex == 1) ? '男' : '女';
            _this.formItem.email = data.email;
            _this.formItem.idCard = data.idNumber;
            _this.formItem.salary = data.salary;
            _this.formItem.agentSchool = data.agentArea;
            _this.formItem.school = data.schoolLocation;
            _this.formItem.bankName = data.bank;
            _this.formItem.bankCard = data.cardNumber;
            _this.formItem.bankAddress = data.bankAddress;
            _this.formItem.uuid = data.uuid;
            _this.agentTypeList = data.typeList;

            let agentTypeList2 = [];
            if(_this.formItem.agentType) {
              _this.formItem.agentType.split(',').forEach((item, index) => {
                agentTypeList2.push({ uuid: index, enumName: item})
              });
            }
            if(agentTypeList2.length > 0) _this.$refs.signupSelect.setQuery = agentTypeList2[0];

            _this.createQrcode(_this.qrcodeOption);
          } else {
            common.notices('接口返回了空数据','data==null','error');
          }
        }
      });

//      common.ajax({
//        url: ZHAO_TEACHER().Agent.agentTypeList,
//        method: 'get',
//        success: function (response) {
//          _this.agentTypeList = response.data;
//          console.log(response.data);
//        }
//      });

    },
    methods: {
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
        let option = {};
        option.url = this.qrcodeUrl + `t/teacher-sign.html?type=${this.formItem.agentType2}&source=${this.formItem.uuid}`;
        option.url = encodeURI(option.url);
        if (value === 860) {
          option.width = 860;
          option.height = 860;
        } else {
          option.width = 258;
          option.height = 258;
        }
        this.createQrcode(option);
      },
      changeAgentType(value) {
        this.formItem.agentType2 = value;
        this.createQrcode(this.qrcodeOption);
      }
    },
    computed: {
      qrcodeOption() {
        let option = {};
        option.url = this.qrcodeUrl + `t/teacher-sign.html?type=${this.formItem.agentType2}&source=${this.formItem.uuid}`;
        option.url = encodeURI(option.url);
        if (this.qrSize === 860) {
          option.width = 860;
          option.height = 860;
        } else {
          option.width = 258;
          option.height = 258;
        }
        return option;
      }
    },
    filters: {
      convertAgentType(value) {
        if(value) {
          return value.split(',').join("，");
        }
        return "";
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
         font-size: 14px;
       }
       h1 {letter-spacing:5px;}
       p {line-height: 25px; font-size: 14px;}
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
   }
 }
</style>
