<template>
  <div>
    <Modal
      title="新增用户"
      v-model="modal"
      :mask-closable="false"
      :closable="false"
      :loading = "loading"
      width="650"
      @on-ok="ok('formValidate')"
      class-name="vertical-center-modal">
      <i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80" inline>
        <Form-item label="登录名" prop="loginName">
          <i-input v-model="formItem.loginName" placeholder="如：zhangsan" style="width: 200px"></i-input>
        </Form-item>
        <Form-item label="姓名" prop="name">
          <i-input v-model="formItem.name" placeholder="如：张三" style="width: 200px"></i-input>
        </Form-item>
        <Form-item label="职位" prop="postsUuid">
          <i-select v-model="formItem.postsUuid" placeholder="选择职位" style="width:200px">
            <i-option v-for="(item,index) in postsList" :key='index' :value="item.uuid">{{ item.name }}</i-option>
          </i-select>
        </Form-item>
        <Form-item label="团队" prop="team">
          <i-select v-model="formItem.team" placeholder="选择团队" style="width:200px">
            <i-option v-for="(item,index) in teamList" :key="index" :value="item.uuid">{{ item.name }}</i-option>
          </i-select>
        </Form-item>
        <Form-item label="角色" prop="role">
          <i-select v-model="roles" multiple placeholder="选择角色"  style="width:200px">
            <i-option v-for="(item,index) in roleList" :value="item.uuid" :key='index'>{{ item.name }}</i-option>
          </i-select>
        </Form-item>
        <Form-item label="电话" prop="phone">
          <i-input v-model="formItem.phone" :maxlength="11" placeholder="11位手机号码" style="width: 200px"></i-input>
        </Form-item>
        <Form-item label="部门" prop="pidModel">
          <i-select v-model="formItem.organizationUuid" placeholder="选择部门" style="width:200px">
            <i-option v-for="(item,index) in organizationList" :key='index' :value="item.uuid">{{ item.name }}</i-option>
          </i-select>
        </Form-item>
      </i-form>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {AUTHORITY} from 'common/api/authority.js';
  import {common} from 'common/js/common.js';
  export default{
    data() {
      var validateLoginName = (rule, value, callback) => {
        if (!/^[A-Za-z0-9_]+$/.test(this.formItem.loginName)) {
          callback(new Error('不能为中文，建议使用公司邮箱前缀'));
        } else {
          callback();
        }
      }
      let validatePhone = (rule, value, callback) => {
        // if (!(/^1[34578]\d{9}$/.test(this.formItem.phone))) {
        if (!(/^1\d{10}$/.test(this.formItem.phone))) {
          callback(new Error('请正确填写手机号码'));
        } else {
          callback();
        }
      }
      let validatePosts = (rule, value,callback) =>{
        if(value == []){
          callback(new Error('请选择一个角色'));
        } else {
          callback();
        }
      }
      return {
        modal: false,
        loading: true,
        roles: [],
        formItem: {
          loginName: '',
          name: '',
          postsUuid: '',
          team: '',
          phone: '',
          organizationUuid: '',
        },
        roleList: [],
        postsList: [],
        organizationList: [],
        teamList: [],
        ruleValidate: {
          loginName: [
            {required: true, validator: validateLoginName, trigger: 'blur'},
          ],
          name: [
            {required: true, message: '请填写姓名',  trigger: 'blur'},
          ],
          postsUuid: [
            {required: true, message: '请选择职位',  trigger: 'change'},
          ],
          team: [
            {required: true, message: '请选择团队',  trigger: 'change'},
          ],
          role: [
            {required: true,validator: validatePosts, message: '请选择角色',  trigger: 'change'},
          ],
          pidModel: [
            {required: true,validator: validatePosts, message: '请选择角色',  trigger: 'change'},
          ],
          phone: [
            {required: true, validator: validatePhone, trigger: 'blur'},
          ]
        }
      }
    },
    methods: {
      show() {
        this.modal = true;
        //获取角色下拉列表
        this.loadAllRole();
        //获取团队下拉列表
        this.loadAllTeam();
        //获取职位下拉列表
        this.loadAllPosts();
        //获取部门下拉列表
        this.loadAllOrganization();
      },
      ok(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            // common.ajax({
            //   url: AUTHORITY().SystemUser.saveOrUpate,
            //   data: {
            //     loginName: _this.formItem.loginName,
            //     phone: _this.formItem.phone,
            //     postsUuid: _this.formItem.postsUuid,
            //     organizationUuid: _this.formItem.organizationUuid,
            //     roleUuids: _this.roles.join(','),
            //     name: _this.formItem.name,
            //     teamUuid: _this.formItem.team,
            //     userType: 0,
            //     sex: 1
            //   },
            //   success: function (res) {
            //     _this.modal = false;
            //     common.notices('操作成功！');
            //     _this.$emit('reFresh', 'success');
            //   }
            // });
            this.$axios.post(AUTHORITY().SystemUser.saveOrUpate,{
              loginName: _this.formItem.loginName,
              phone: _this.formItem.phone,
              postsUuid: _this.formItem.postsUuid,
              organizationUuid: _this.formItem.organizationUuid,
              roleUuids: _this.roles.join(','),
              name: _this.formItem.name,
              teamUuid: _this.formItem.team,
              userType: 0,
              sex: 1
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
      },
      loadAllRole() {
        const _this = this;
        // common.ajax({
        //   url: AUTHORITY().Role.allRole,
        //   method: 'get',
        //   success: function (response) {
        //     _this.roleList = response.data || [];
        //   }
        // });
        this.$axios.get(AUTHORITY().Role.allRole,{
        }).then( ({data}) => {
          _this.roleList = data.data || [];
        });
      },
      loadAllTeam() {
        const _this = this;
        // common.ajax({
        //   url: AUTHORITY().Team.allTeam,
        //   method: 'get',
        //   success: function(response){
        //     _this.teamList = response.data || [];
        //   }
        // });
        this.$axios.get(AUTHORITY().Team.allTeam,{
        }).then( ({data}) => {
          _this.teamList = data.data || [];
        });
      },
      loadAllPosts() {
        const _this = this;
        // common.ajax({
        //   url: AUTHORITY().Posts.allPosts,
        //   method: 'get',
        //   success: function(response){
        //     _this.postsList = response.data || [];
        //   }
        // });
        this.$axios.get(AUTHORITY().Posts.allPosts,{
        }).then( ({data}) => {
          _this.postsList = data.data || [];
        });
      },
      loadAllOrganization() {
        const _this = this;
        // common.ajax({
        //   url: AUTHORITY().Organization.dataGrid,
        //   method: 'get',
        //   success: function(response){
        //     _this.organizationList = response.data || [];
        //   }
        // });
        this.$axios.get(AUTHORITY().Organization.dataGrid,{
        }).then( ({data}) => {
          _this.organizationList = data.data || [];
        });
      },
    }
  };
</script>

<style>

</style>
