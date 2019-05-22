<template>
  <div>
    <Modal
      title="绑定安莱账号"
      v-model="modal"
      :mask-closable="false"
      :closable="false"
      :loading="loading"
      @on-ok="ok('formValidate')">
      <i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
        <Form-item label="用户账户">
          <i-input v-model="formItem.userLogin" disabled placeholder="输入安莱账号" style="width: 200px"></i-input>
        </Form-item>
        <Form-item label="用户密码">
          <i-input v-model="formItem.userPass" disabled placeholder="" style="width: 200px"></i-input>
        </Form-item>
        <Form-item label="用户级别" prop="userLevel">
          <Select v-model="formItem.userLevel" placeholder="选择用户级别" style="width:150px">
            <Option value="5">Agent</Option>
            <Option value="6">QA</Option>
            <Option value="7">Supervisor</Option>
            <Option value="8">Manager</Option>
            <Option value="9">Admin</Option>
          </Select>
        </Form-item>
        <Form-item label="用户组" prop="userGroup">
          <Select v-model="formItem.userGroup" placeholder="选择用户组" style="width:150px">
            <Option v-for="(item,index) in userGroupList" :value="item.usergroup" :key='index'>{{ item.usergroup }}</Option>
          </Select>
        </Form-item>
      </i-form>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {ANLAI} from 'common/api/anlai.js';
  import {common} from 'common/js/common.js';

  export default{
    data() {
      return {
        modal: false,
        userDisabled: false,
        loading: true,
        userUuid: '',
        userGroupList: [],
        formItem: {
          userLogin: '',
          userPass: '123456',
          userLevel: '',
          userGroup: '',
        },
        ruleValidate: {
          userLevel: [
            {required: true, message: '必填', trigger: 'change'},
          ],
          userGroup: [
            {required: true, message: '必填', trigger: 'change'},
          ],
        }
      }
    },
    mounted(){
      const _this = this;
      // common.ajax({
      //   url: ANLAI().ToolBar.getAnLanUserGroup,
      //   method:'get',
      //   success: function (res) {
      //     _this.userGroupList = res.data.userGroupClientDtos
      //   }
      // });
      this.$axios.get(ANLAI().ToolBar.getAnLanUserGroup,{
      }).then( ({data}) => {
        _this.userGroupList = data.data.userGroupClientDtos
      });
    },
    methods: {
      show(userLogin,uuid,userLevel,userGroup,status){
        this.userDisabled = status == 'add' ? false : true;
        this.formItem.userLogin = userLogin;
        this.userUuid = uuid;
        this.formItem.userLevel = userLevel||'';
        this.formItem.userGroup = userGroup||'';
        this.modal = true;
      },
      ok(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            let Url = _this.userDisabled ? ANLAI().ToolBar.updateAccount : ANLAI().ToolBar.bingAnlan;
            // common.ajax({
            //   url: Url,
            //   data: {
            //     userUuid: _this.userUuid,
            //     userLogin: _this.formItem.userLogin,
            //     userPass: _this.formItem.userPass,
            //     userLevel: _this.formItem.userLevel,
            //     userGroup: _this.formItem.userGroup,
            //   },
            //   success: function (res) {
            //     _this.modal = false;
            //     common.notices('操作成功！');
            //     _this.$emit('reFresh', 'success');
            //   }
            // });
            this.$axios.post(Url,{
                userUuid: _this.userUuid,
                userLogin: _this.formItem.userLogin,
                userPass: _this.formItem.userPass,
                userLevel: _this.formItem.userLevel,
                userGroup: _this.formItem.userGroup,
            }).then( () => {
              _this.modal = false;
              common.notices('操作成功！');
              _this.$emit('reFresh', 'success');
            });
          } else {
            setTimeout(() => {
              this.loading = true;
            }, 0);
          }
        });
      }
    }
  };
</script>

<style scoped>
  input:-webkit-autofill {

    -webkit-box-shadow: 0 0 0 1000px white inset !important;
  }
</style>
