<template>
  <div>
    <Modal
      title="编辑团队"
      v-model="modal"
      :mask-closable="false"
      :closable="false"
      :loading="loading"
      @on-ok="onOk('formValidate')"
      class-name="vertical-center-modal">
      <i-form ref='formValidate' :model="formItem" :rules="ruleValidate" :label-width="80">

        <Form-item label="所属部门：" prop="organizationUuid">
          <i-select v-model="formItem.organizationUuid" @on-change='isCCDetection' style="width:200px">
            <i-option v-for="(item,index) in superLeadsList" :key='index' :value="item.uuid">{{ item.name }}</i-option>
          </i-select>
        </Form-item>

        <Form-item label="团队/组：" prop="name">
          <i-input v-model="formItem.name" placeholder="听说取个好名字会影响人生" style="width: 200px"></i-input>
        </Form-item>

        <Form-item label="类型" :prop="isCC==true?teamType:''" v-show='isCC'>
          <Radio-group v-model="formItem.teamType" type="button">
            <Radio label="0">CC</Radio>
            <Radio label="1">CR</Radio>
          </Radio-group>
        </Form-item>

        <Form-item label="主管：">
          <i-select v-model="formItem.leaderUuid" placeholder="部门主管" style="width:200px">
            <i-option v-for="(item,index) in posts" :key='index' :value="item.userUuid">{{ item.userName }}</i-option>
          </i-select>
        </Form-item>

        <Form-item label="经理：">
          <i-select v-model="formItem.leaderManageUuid" placeholder="部门经理"  style="width:200px">
            <i-option v-for="(item,index) in managerPosts" :key='index' :value="item.userUuid">{{ item.userName }}</i-option>
          </i-select>
        </Form-item>

        <Form-item label="总监" prop="superLeadsUuid">
          <i-select v-model="formItem.superLeadsUuid" placeholder="部门总监" style="width:200px">
            <i-option v-for="(item,index) in chiefPosts" :value="item.userUuid" :key='index'>{{ item.userName }}</i-option>
          </i-select>
        </Form-item>

      </i-form>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {AUTHORITY} from 'common/api/authority.js';
  import {common} from 'common/js/common.js';
  export default {
    data(){
      return {
        modal: false,
        loading: true,
        teamUuid: '',
        isCC: false,
        formItem: {
          name: '',
          teamType: '4',
          leaderUuid: '',
          leaderManageUuid: '',
          superLeadsUuid: '',
          organizationUuid: '',
        },
        superLeadsList: [],
        posts: [],//主管
        managerPosts: [],//经理
        chiefPosts: [],//总监
        ruleValidate: {
          organizationUuid: [
            {required: true, message: '请选择所属部门',  trigger: 'change'},
          ],
          name: [
            {required: true, message: '请填写团队名称',  trigger: 'blur'},
          ],
          teamType: [
            {required: true, message: '请选择团队类型',  trigger: 'change'},
          ],
          superLeadsUuid: [
            {required: true, message: '请选择部门总监',  trigger: 'change'},
          ]
        }
      }
    },
    mounted() {
      let _this = this;
      // common.ajax({
      //   url: AUTHORITY().Organization.dataGrid,//部门列表
      //   method: 'get',
      //   noLoading: 'yes',
      //   success(res){
      //     _this.superLeadsList = res.data || [];
      //   }
      // });
      this.$axios.get(AUTHORITY().Organization.dataGrid,{
      }).then( ({data}) => {
        _this.superLeadsList = data.data || [];
      });
      // common.ajax({
      //   url: AUTHORITY().Team.getPosts,//部门列表
      //   method: 'get',
      //   noLoading: 'yes',
      //   success(res){
      //     _this.posts = res.data['posts'] || [];
      //     _this.managerPosts = res.data['managerPosts'] || [];
      //     _this.chiefPosts = res.data['chiefPosts'] || [];
      //     console.log(_this.chiefPosts);
      //   }
      // });
      this.$axios.get(AUTHORITY().Team.getPosts,{
      }).then( ({data}) => {
        _this.posts = data.data['posts'] || [];
        _this.managerPosts = data.data['managerPosts'] || [];
        _this.chiefPosts = data.data['chiefPosts'] || [];
      });
    },
    methods: {
      show(teamUuid) {
        this.teamUuid = teamUuid;
        this.modal = true;
        let _this = this;
        // let param = "?uuid="+teamUuid;
        // common.ajax({
        //   url: AUTHORITY().Team.getTeamByUuid + param,
        //   method: 'get',
        //   success(res){
        //     console.log(res);
        //     _this.formItem = res.data;
        //   }
        // })
        this.$axios.get(AUTHORITY().Team.getTeamByUuid,{
          params:{
            uuid:teamUuid,
          }
        }).then( ({data}) => {
          _this.formItem = data.data;
        });
      },
      isCCDetection(value){
          if(value){
            const _this = this;
            // common.ajax({
            //   url: AUTHORITY().Team.getOrganizationName,//检测是否为销售部
            //   method: 'get',
            //   data: {
            //     orgUuid: value
            //   },
            //   success(res){
            //     if (res.data.result == true) {
            //       _this.isCC = true;
            //     } else {
            //       _this.isCC = false;
            //       _this.formItem.teamType = '4';
            //     }
            //   }
            // });
            this.$axios.get(AUTHORITY().Team.getOrganizationName,{
              params:{
                orgUuid:value,
              }
            }).then( ({data}) => {
              if (data.data.result == true) {
                _this.isCC = true;
              } else {
                _this.isCC = false;
                _this.formItem.teamType = '4';
              }
            });
          }
      },
      onOk(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            let param= `?uuid=${_this.teamUuid}&name=${_this.formItem.name}
            &teamType=${_this.formItem.teamType}&organizationUuid=${_this.formItem.organizationUuid}&leaderUuid=${_this.formItem.leaderUuid}
            &superLeadsUuid=${_this.formItem.superLeadsUuid}&leaderManageUuid=${_this.formItem.leaderManageUuid}`*7
            // common.ajax({
            //   url: AUTHORITY().Team.saveOrUpdate+param,
            //   method:'get',
            //   success: function(res){
            //     _this.modal = false;
            //     common.notices('操作成功！');
            //     _this.$emit('reFresh', 'success');
            //   },
            // });
            this.$axios.get(AUTHORITY().Team.saveOrUpdate,{
              params:{
                uuid:_this.teamUuid,
                name:_this.formItem.name,
                teamType:_this.formItem.teamType,
                organizationUuid:_this.formItem.organizationUuid,
                leaderUuid:_this.formItem.leaderUuid,
                superLeadsUuid:_this.formItem.superLeadsUuid,
                leaderManageUuid:_this.formItem.leaderManageUuid,
              }
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
    },
  }
</script>

<style scoped>

</style>
