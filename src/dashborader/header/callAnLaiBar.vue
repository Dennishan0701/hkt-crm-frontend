<style scoped>
  @import'./callAnLaiBar.less';
</style>
<template>
  <div>
    <div v-if="loginAnlai">
      <Form ref="formValidate2" :model="formItem2" :rules="ruleValidate2">
        <Button type='success' size='small'>安莱账号：{{anLaiAccout.userLogin||''}}</Button>
        <FormItem class="phoneInput" label="" prop="phoneNum" style="display:inline-block;margin-top: -3px;margin-bottom: 0">
          <Input  size='small' v-model="formItem2.phoneNum" placeholder="请输入手机号" style="width:140px;"></Input>
        </FormItem>
        <Button type="info" size='small' icon="android-call" @click="callAnLaiPhone('formValidate2')">拨打</Button>
        <Button type="info" size='small' icon="android-mail" @click="sendModalShow('formValidate2')">发短信</Button>
        <Button type="warning" size='small' icon="android-call" @click="handUpAnLaiPhone">一键挂断</Button>
        <Button type='error' @click='loginOut' size='small'>退出</Button>
      </Form>
    </div>
    <div v-else class="call-tool">
      <Poptip placement="bottom" confirm @on-ok="onLogin('formValidate')" ok-text='登录'>
        <Button size='small' type='success'>登录安莱</Button>
        <div class="api" slot="title" style="margin-right: 25px;">
          <i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
            <Form-item label="用户账户">
              <i-input v-model="anLaiAccout.userLogin" disabled placeholder="请输入..." style="width:200px"></i-input>
            </Form-item>
            <!--<Form-item label="用户密码" prop="userPass">-->
            <!--<i-input v-model="formItem.userPass" placeholder="请输入..."-->
            <!--style="width:200px"></i-input>-->
            <!--</Form-item>-->
            <Form-item label="分机号" prop="phoneLogin">
              <i-input v-model="formItem.phoneLogin" @on-keyup.enter="onLogin('formValidate')" placeholder="请输入..." style="width:200px"></i-input>
            </Form-item>
            <!--<Form-item label="分机密码" prop="phonePass">-->
            <!--<i-input v-model="formItem.phonePass" placeholder="请输入..." style="width:200px"></i-input>-->
            <!--</Form-item>-->
          </i-form>
          <p class="c-red text-center" v-show="errorTips !== ''">{{errorTips}}</p>
          <!--<div class="center">-->
          <!--<i-button type="primary" @click="">确定</i-button>-->
          <!--</div>-->
        </div>
      </Poptip>
    </div>
    <Modal
      v-model="messageModal"
      title="发短信"
      :mask-closable="false"
      :closable="false">
      <i-form ref='formValidate3' :model="formItem3" :rules="ruleValidate3">
        <FormItem label="" prop="content">
          <i-input type="textarea" v-model="formItem3.content" :rows="4" :maxlength="500" placeholder="请输入短信内容"></i-input>
          <span style="float:right">你还可以输入{{295-formItem3.content.length}}字</span>
        </FormItem>
      </i-form>
      <div slot="footer" style="text-align: center">
        <i-button type="success" @click="sendMessage('formValidate3')">发送</i-button>
        <i-button type="ghost" @click="messageModal = false">关闭</i-button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {ANLAI} from 'common/api/anlai.js';
  import {common, formateDate} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  const $localStorage = $.localStorage;
  export default{
    data() {
      const ruleValidate2 = (rule, value, callback) => {
        if (value == ''|| value == null) {
          callback(new Error());
          this.$Message.error('请输入手机号');
        } else {
          if(!(/^1\d{10}$/.test(value))){
            callback(new Error());
            this.$Message.error('请正确填写手机号');
          }else{
            callback();
          }
          callback();
        }
      };
      return {
        loginAnlai:false,
        messageModal:false,
        errorTips:'',
        anLaiAccout:{
          userUuid:'',
          userLogin:'',
          userPass:'',
          phoneLogin:'',
          phonePass:'',
          loginStatus:'',
        },
        formItem: {
          userLogin: '',
          phoneLogin: '',
        },
        formItem2: {
          phoneNum:''
        },
        formItem3: {
          content:''
        },
        ruleValidate: {
//          userLogin: [
//            {required: true, message: '请填入用户账号', trigger: 'blur'}
//          ],
//          userPass: [
//            {required: true, message: '请填入用户密码', trigger: 'blur'}
//          ],
          phoneLogin: [
            {required: true, message: '请填入分机账号', trigger: 'blur'}
          ],
//          phonePass: [
//            {required: true, message: '请填入分机密码', trigger: 'blur'}
//          ]
        },
        ruleValidate2: {
          phoneNum: [
            {validator: ruleValidate2, trigger: 'blur'}
          ],
        },
        ruleValidate3: {
          content: [
            {required: true, message: '请填入短信内容', trigger: 'blur'}
          ],
        }
      }
    },
    mounted() {
      this.getAnLanStatus();
    },
    methods: {
      handUpAnLaiPhone(){
        let anLaiAccout = $localStorage.get('anLaiAccout');
        if (anLaiAccout) {
          common.ajax({
            url: ANLAI().CallPhone.handUp,
            success(res) {
              common.msg('挂断成功！！！', 'success');
            }
          });
        } else {
          common.msg('未登录安莱账号！！！', 'error');
        }
      },
      onLogin(name) {
        const _this = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            common.ajax({
              url: ANLAI().ToolBar.login,
              data: {
                userLogin: _this.anLaiAccout.userLogin||'',
//                userPass: _this.formItem.userPass||'',
                phoneLogin: _this.formItem.phoneLogin||'',
//                phonePass: _this.formItem.phonePass||'',
              },
              success(res){
                let anLaiAccout = {
                  userLogin:res.data.userLogin ||'',
                  userPass:res.data.userPass ||'',
                  phoneLogin:res.data.phoneLogin ||'',
                  phonePass:res.data.phonePass ||'',
                };
                $localStorage.set('anLaiAccout',JSON.stringify(anLaiAccout));
                _this.loginAnlai = true;
                _this.anLaiAccout = $localStorage.get('anLaiAccout');
              },
              successError(res) {
                _this.errorTips = res.msg;
              }
            });
          }
        });
      },
      loginOut(){
        const _this = this;
        common.ajax({
          url: ANLAI().ToolBar.loginOut,
          data: {
            userLogin: _this.anLaiAccout.userLogin,
            userPass: _this.anLaiAccout.userPass,
            phoneLogin: _this.anLaiAccout.phoneLogin,
            phonePass: _this.anLaiAccout.phonePass,
          },
          success(res){
//            $localStorage.remove('anLaiAccout');
            common.notices('退出成功！！！');
            _this.loginAnlai = false;
            _this.getAnLanStatus();
          },
          successError(res) {
            _this.errorTips = res.msg;
            _this.getAnLanStatus();
          }
        });
      },
      // 安莱拨打电话
      callAnLaiPhone(name){
        const _this = this;
        let anLaiAccout = $localStorage.get('anLaiAccout');
        this.$refs[name].validate((valid) => {
          if (valid) {
//            this.$Message.success('Success!');
            if (anLaiAccout) {
              common.ajax({
                url: ANLAI().CallPhone.call,
                data: {
                  userLogin: anLaiAccout.userLogin,
                  userPass: anLaiAccout.userPass,
                  phoneLogin: anLaiAccout.phoneLogin,
                  phonePass: anLaiAccout.phonePass,
                  phoneNumber: _this.formItem2.phoneNum,
                },
                success(res) {
                  common.msg('拨打成功', 'success');
                }
              });
            } else {
              common.msg('未登录安莱账号！！！', 'error');
            }
          } else {
            // this.$Message.error('Fail!');
          }
        })
      },
      // 发信息
      sendModalShow(name){
        let app = this;
        // let anLaiAccout = $localStorage.get('anLaiAccout');
        this.$refs[name].validate((valid) => {
          if (valid) {
            // if (anLaiAccout) {
              app.messageModal = true;
            // }else{
            //   common.msg('未登录安莱账号！！！', 'error');
            // }
          } else {
            common.msg('Fail', 'error');
          }
        })
      },
      sendMessage(name){
        let app = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
              this.$Modal.confirm({
                title: '提示',
                content: '确认要发送短信 <span class="c-red">'+app.formItem3.content+'</span> 到 <span class="c-red">'+ app.formItem2.phoneNum +'</span> ？',
                onOk() {
                  this.$axios.get(ANLAI().SendMessage.send,{
                    params:{
                      phone: app.formItem2.phoneNum,
                      content: app.formItem3.content,
                    }
                  }).then( ({data}) => {
                    common.msg('发送成功', 'success');
                    app.messageModal = false;
                  })
                }
              });
          } else {
            common.msg('Fail', 'error');
          }
        })
      },
      getAnLanStatus(){
        const _this = this;
        common.ajax({
          url: ANLAI().ToolBar.getAnLanStatus,
          method:'get',
          success(res) {
            if(res.data){
              _this.anLaiAccout = {
                userUuid:res.data.userUuid||'',
                userLogin:res.data.userLogin||'',
                userPass:res.data.userPass||'',
                phoneLogin:res.data.phoneLogin||'',
                phonePass:res.data.phonePass||'',
                loginStatus:res.data.loginStatus||'',
              }
              if(res.data.loginStatus){
                _this.loginAnlai = true;
              }
              $localStorage.set('anLaiAccout',JSON.stringify(_this.anLaiAccout));
            }
          },
          successError(res) {

          }
        });
      }
    }
  };
</script>


