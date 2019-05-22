<style lang="less">
  @import'./callToolBar.less';
  .call-tool-box{
    .status-selects {
      width: 90px!important;
      height: 24px!important;
      margin-right: 2px;
      .ivu-select-selection{
        height: 24px!important;
        background: #0099cc!important;
        border-radius: 3px!important;
      }
    }
  }
</style>
<template>
  <div class="call-tool-box">
    <!--<Poptip placement="bottom">-->
    <!--&lt;!&ndash;<i-button type="ghost" icon="android-call">登录呼叫系统</i-button>&ndash;&gt;-->
    <!--<div class="login-div" v-show="isLogin !== 'yes'">-->
    <!--<Icon type="android-call"></Icon> 登录呼叫系统-->
    <!--</div>-->
    <!--<div class="api" slot="content" style="margin-right: 25px;">-->
    <!--<i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">-->
    <!--<Form-item label="座席号" prop="seatsNo">-->
    <!--<i-input v-model="formItem.seatsNo" placeholder="请输入..." style="width:200px"></i-input>-->
    <!--</Form-item>-->
    <!--<Form-item label="密码" prop="seatsPassword">-->
    <!--<i-input v-model="formItem.seatsPassword" type="password" placeholder="请输入..." style="width:200px"></i-input>-->
    <!--</Form-item>-->
    <!--<Form-item label="热线电话" prop="bindPhone">-->
    <!--<i-input v-model="formItem.bindPhone" placeholder="请输入..." style="width:200px"></i-input>-->
    <!--</Form-item>-->
    <!--</i-form>-->
    <!--<p class="c-red text-center" v-show="errorTips !== ''">{{errorTips}}</p>-->
    <!--<div class="center">-->
    <!--<i-button type="primary" @click="onLogin('formValidate')">登录</i-button>-->
    <!--</div>-->
    <!--</div>-->
    <!--</Poptip>-->
    <Poptip placement="bottom" v-show="isOnline !== 'online'">
      <div class="getlist-div">
        <Icon type="ios-telephone"></Icon>
        登陆天润
      </div>
      <div class="api" slot="content" style="margin-right: 25px;">
        <i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
          <Form-item label="座席号" prop="seatsNo">
            <i-input v-model="formItem.seatsNo" placeholder="请输入..." style="width:200px"></i-input>
          </Form-item>
          <Form-item label="密码" prop="seatsPassword">
            <i-input v-model="formItem.seatsPassword" type="password" placeholder="请输入..."
                     style="width:200px"></i-input>
          </Form-item>
          <Form-item label="热线电话" prop="bindPhone">
            <i-input v-model="formItem.bindPhone" placeholder="请输入..." style="width:200px"></i-input>
          </Form-item>
        </i-form>
        <p class="c-red text-center" v-show="errorTips !== ''">{{errorTips}}</p>
        <div class="center">
          <i-button type="primary" @click="onLogin('formValidate')">确定</i-button>
        </div>
      </div>
    </Poptip>
    <i-select v-model="seatdStatus" @on-change="changeStatus" v-show="isOnline === 'online'" class="status-selects">
      <i-option value="0">空闲</i-option>
      <i-option value="1">勿打扰</i-option>
      <i-option value="2">WC</i-option>
      <i-option value="3">吃饭</i-option>
      <i-option value="4">午休</i-option>
    </i-select>
    <div v-show="tianrunOffShow" class="no-getlist-div" @click="seatsOffLine">
      <Icon type="android-notifications-off"></Icon>
      退出登陆
    </div>
    <!--<p class="listed-count">今日已获取<span class="c-error" id="call_in_leads_count">{{leadsCount}}</span>个Leads</p>-->
  </div>
</template>
<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {TIANRUN} from 'common/api/tianrun.js';
  import {common, formateDate} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  const $localStorage = $.localStorage;
  let websocket = null;
  let today = '', oldDay = '';
  export default{
    data() {
      return {
        tianrunOffShow:false,
        formItem: {
          seatsNo: '',
          seatsPassword: '',
          bindPhone: ''
        },
        leadsCount: localStorage.getItem('call_in_leads_count') || 0,
        errorTips: '',
        isLogin: localStorage.getItem('tianrun_login_status') || 'no',
        isOnline: localStorage.getItem('tianrun_online_status') || 'offline',
        seatdStatus: '0',
        ccUuid: $localStorage.get('user').uuid,
        ruleValidate: {
          seatsNo: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          seatsPassword: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          bindPhone: [
            {required: true, message: '必填', trigger: 'blur'}
          ]
        }
      }
    },
    mounted() {
      console.log (1);
      // this.setLayout();
      console.log (2);
      // if (this.isOnline === 'online') this.sse();
      console.log (3);
      this.clearLeadsCount();
      console.log (4);
      this.longQuery();
      console.log (5);
      this.tianrunOffShow =  $localStorage.get('tianrunOffShow');
      let account = $localStorage.get('tianrun_account');
      if (account && Object.keys(account).length > 0) {
        this.formItem.seatsNo = account.seatsNo;
        this.formItem.seatsPassword = account.seatsPassword;
        this.formItem.bindPhone = account.bindPhone;
      }
      console.log (this.tianrunOffShow);
    },
    methods: {
      onLogin(name) {
        const _this = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            common.ajax({
              url: TIANRUN().ToolBar.login,
              method: 'get',
              data: {
                seatsNo: _this.formItem.seatsNo,
                seatsPassword: _this.formItem.seatsPassword,
                bindPhone: _this.formItem.bindPhone,
              },
              success(res){
                $localStorage.set('tianrun_account', {
                  seatsNo: _this.formItem.seatsNo,
                  seatsPassword: _this.formItem.seatsPassword,
                  bindPhone: _this.formItem.bindPhone,
                });
                localStorage.setItem('tianrun_login_status', 'yes');
//                _this.seatsOnLine();
                _this.isOnline = 'online';
                _this.tianrunOffShow = true;
                localStorage.setItem("tianrunOffShow",_this.tianrunOffShow);
                localStorage.setItem('tianrun_online_status', 'online');
                // _this.sse();
                location.reload();
              },
              successError(res) {
                _this.errorTips = res.msg;
              }
            });
          }
        });
      },
//      seatsOnLine() {
//      	const _this = this;
//        common.ajax({
//          url: TIANRUN().ToolBar.onLine,
//          success(res){
//          }
//        });
//      },
      seatsOffLine() {
        const _this = this;
        common.ajax({
          url: TIANRUN().ToolBar.offLine,
          success(res){
            common.msg(res.data, 'success');
//            if (es) es.close();
//            console.log('----------SSE连接关闭-----------------------');
//            _this.isOnline = 'offline';
//            localStorage.setItem('tianrun_online_status', 'offline');
//            localStorage.setItem('tianrun_login_status', 'no');
            //连接关闭的回调方法
            console.log(res.data);
            common.msg(res.data, 'success');
            if (websocket) websocket.close();
            console.log('----------SSE连接关闭-----------------------');
            _this.isOnline = 'offline';
            console.log(_this.isOnline);
            localStorage.setItem('tianrun_online_status', 'offline');
            localStorage.setItem('tianrun_login_status', 'no');
            _this.tianrunOffShow = false;
            localStorage.setItem("tianrunOffShow",_this.tianrunOffShow);
          },
          successError(res) {
            common.msg(res.data);
          }
        });
      },
//       sse() {
// //        es = new EventSource("https://cmsapi.onlyhi.cn/NewNameList/getLeadsData?ccUuid=" + this.ccUuid);
// //        console.log('----------SSE连接打开-----------------------');
//         let json;
//         let message = this.ccUuid;
//         console.log(message);
//         if ('WebSocket' in window) {
//           websocket = new WebSocket(COMMON_API().csyWs);
//         }
//         else {
//           alert('当前浏览器不支持websocket')
//         }
//         //连接发生错误的回调方法
//         websocket.onerror = function () {
//           console.log('WebSocket连接发生错误');
//         };
//         //连接成功建立的回调方法
//         websocket.onopen = function (event) {
//           websocket.send(message);
//           console.log('WebSocket连接成功');
//         }
//         //接收到消息的回调方法
//         websocket.onmessage = function (event) {
//           console.log('打印开始');
// //          console.log(event.data);
//           json = JSON.parse(event.data);
//           if (json.code === '100') {
//             let data = json.data;
//             console.log(data);
//             if (data.ccUuid) {
//               if (data.ccUuid === $localStorage.get('user').uuid) {
//                 let leadsCount = Number.parseInt(localStorage.getItem('call_in_leads_count') || 0);
//                 leadsCount++;
//                 localStorage.setItem('call_in_leads_count', leadsCount);
//                 this.leadsCount = leadsCount;
//                 if (window.location.hash == '#/scs/leadsDetailByCr' || window.location.hash == '#/scs/leadsDetailByCc') {
//                   sessionStorage.setItem('template_uuid', data.leadsUuid);
//                   location.reload();
//                   console.log(window.location.hash);
//                 } else {
//                   console.log(window.location.hash);
//                   GLOBAL.viewLeadsDetail(data.leadsUuid);
//                   console.log(1);
//                 }
//               }
//             }
//             console.log('打印结束');
//           } else {
//             console.error(json.msg);
//           }
//         }
//         //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
//         window.onbeforeunload = function () {
//           websocket.close();
//         }
// //        //连接关闭的回调方法
// //        websocket.onclose = function(){
// //          console.log('close');
// //        }
//         //发送消息
// //        es.addEventListener('message', e => {
// //          json = JSON.parse(e.data);
// //          if (json.code === '100') {
// //            let data = json.data;
// //            data = JSON.parse(data);
// //            if (data.ccUuid) {
// //              if (data.ccUuid === $localStorage.get('user').uuid) {
// //                let leadsCount = Number.parseInt(localStorage.getItem('call_in_leads_count') || 0);
// //                leadsCount++;
// //                localStorage.setItem('call_in_leads_count', leadsCount);
// //                this.leadsCount = leadsCount;
// //                GLOBAL.viewLeadsDetail(data.leadsUuid);
// //              }
// //            }
// //          } else {
// //            cosnole.error(json.msg);
// //          }
// //        });
//       },
      changeStatus(value) {
        common.ajax({
          url: TIANRUN().ToolBar.editSeatsCallStatus,
          data: {seatsCallStatus: value},
          success(res){
            common.msg('操作成功', 'success');
          }
        });
      },
      clearLeadsCount() {
        oldDay = localStorage.getItem('todayDate', new Date());
        if (oldDay) {
          oldDay = this.__getDay__(oldDay);
          today = this.__getDay__(new Date());
          if (today !== oldDay) {//不是同一天，重置leads数为0
            localStorage.setItem('call_in_leads_count', '0');
          }
        }
        localStorage.setItem('todayDate', new Date());
      },
      longQuery() {
        const _this = this;
        setInterval(function () {
          _this.clearLeadsCount();
        }, 1000 * 60 * 60);
      },
      __getDay__(date) {
        let fmt = formateDate(date, 'yyyy-MM-dd hh:mm:ss');
        let ymd = fmt.split(/\s/)[0];
        return ymd.split('-')[2];
      },
      setLayout() {
        let selection = document.querySelector(".ivu-select-single .ivu-select-selection");
        selection.style.height = "50px";
        selection.style.borderRadius = "0";
        let selectedValue = selection.querySelector(".ivu-select-selected-value");
        selectedValue.style.height = "50px";
        selectedValue.style.lineHeight = "50px";
        selectedValue.style.fontSize = "16px";
        selectedValue.style.textAlign = "center";
      }
    }
  };
</script>
