<template>
  <div>
    <Modal
      title="绑定融营axn"
      v-model="modal"
      :mask-closable="false"
      :closable="false"
      :loading="loading"
      @on-ok="ok('formValidate')"
      @on-cancel="cancel('formValidate')"
    >
      <i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
        <Form-item label="虚拟号码" prop="virtualNum">
          <i-select class="seatsNo" :size="$store.state.searchModuleSize" v-model="formItem.virtualNum"
                    placeholder="请选择坐席号" @on-change="changeSeatsNo" style="width:200px">
            <i-option v-for="(item,index) in seatsNoList" :key='index' :value="item.virtualPhone">{{item.virtualPhone}}</i-option>
          </i-select>
          <Button v-clipboard:copy="formItem.virtualNum" v-clipboard:success="onCopy" v-clipboard:error="onError">复制坐席号</Button>
        </Form-item>
        <Form-item label="用户手机号" prop="caller">
          <i-input  v-model="formItem.caller" placeholder="" style="width: 200px"></i-input>
        </Form-item>
      </i-form>
    </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
  import {AUTHORITY} from 'common/api/authority.js';
  import {common} from 'common/js/common.js';
  import {COMMON_API} from 'common/api.config.js';
  // const $localStorage = $.localStorage;
  export default {
    data () {
      let validatePhone = (rule, value, callback) => {
        if (!(/^1\d{10}$/.test (this.formItem.phone))) {
          callback (new Error ('请正确填写手机号码'));
        } else {
          callback ();
        }
      }
      return {
        modal: false,
        loading: true,
        userUuid: '',
        formItem: {
          userUuid: '',
          caller: '',
          virtualNum: ''
        },
        ruleValidate: {
          caller: [
            {required: true, message: '必填', trigger: 'blur'},
          ],
          virtualNum:[
            {required: true, message: '必填', trigger: 'change'},
          ]
        },
        seatsNoList: [],
        token: $.localStorage.get ('token')
      }
    },
    mounted () {
      // this.$axios.post (COMMON_API ().Phone.getUnusePaasAccount, {
      //   token: this.token,
      // }).then ((res) => {
      //   this.seatsNoList = res.data.data
      //   console.log (this.seatsNoList);
      // })
    },
    methods: {
      show (uuid) {
        // let token = $localStorage.get('token')
        this.$axios.post (COMMON_API ().Phone.getUnusePaasAccount2, {
          token: this.token,
        }).then ((res) => {
          this.seatsNoList = res.data.data
        })
        this.userUuid = uuid;
        this.modal = true;
      },
      ok (name) {
        const _this = this;
        this.loading = false;
        this.$refs[name].validate ((valid) => {
          if (valid) {
            _this.$axios.post (COMMON_API ().Phone.axnbind, {
              token: _this.token,
              userUuid: _this.userUuid,
              virtualNum: _this.formItem.virtualNum,
              caller: _this.formItem.caller,
            }).then (res => {
              if (res) {
                if (res.data.code == '100') {
                  _this.modal = false;
                  common.notices (res.data.msg);
                  _this.$emit ('reFresh', 'success');
                } else {
                  _this.modal = false;
                  _this.$emit ('reFresh', 'success');
                }
              } else {
                _this.modal = false;
                _this.$emit ('reFresh', 'success');
              }
              _this.modal = false;
              this.formItem.virtualNum = '';
              this.formItem.hotlinePhone = '';
              this.formItem.seatsPassword = '';
            });
          } else {
            setTimeout (() => {
              _this.loading = true;
            }, 0);
          }
        });
      },
      cancel () {
        // this.seatsNoList = []
        this.formItem.virtualNum = '';
        this.formItem.hotlinePhone = '';
        this.formItem.seatsPassword = '';
      },
      changeSeatsNo (value) {
        this.formItem.virtualNum = value
        if (this.formItem.virtualNum) {
          this.$axios.post (COMMON_API ().Phone.getUnusePaasAccountInfo, {
            token: this.token,
            voipAccount: this.formItem.virtualNum,
          }).then ((res) => {
            let datas = res.data.data
            this.formItem.seatsPassword = datas.password
            this.formItem.hotlinePhone = datas.displayPhone
          })
        }
      },
      doCopy () {
        // if(this.formItem.virtualNum){
        //   this.$copyText(this.formItem.virtualNum).then(function (e) {
        //     common.notices('已复制')
        //     console.log(e)
        //   }, function (e) {
        //     common.notices('复制失败')
        //     console.log(e)
        //   })
        // }else{
        //   common.notices('请先选择坐席号');
        // }
        var clipboard = new Clipboard ('.seatsNo .ivu-select-selected-value')
        clipboard.on ('success', e => {
          common.notices ("复制成功");//这里你如果引入了elementui的提示就可以用，没有就注释即可
          // 释放内存
          clipboard.destroy ()
        })
        clipboard.on ('error', e => {
          // 不支持复制
          console.log ('该浏览器不支持自动复制')
          // 释放内存
          clipboard.destroy ()
        })
      },
      onCopy(){
        common.notices('已复制')
      },
      onError(){
        common.notices('复制失败')
      }
    }
  };
</script>
<style scoped>
</style>
