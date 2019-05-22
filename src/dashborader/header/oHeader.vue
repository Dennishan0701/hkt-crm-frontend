<template>
  <div class="o-header">
    <header>
      <div class="header-bg" style="display: flex;justify-content: space-between;align-items: center;">
        <div class="left">
          <a class="logo" style="vertical-align: middle;padding: 5px;width: 200px;text-align: center;display: inline-block;">
            <img src="../../assets/img/logo.png" style="margin-left: 5px;">
          </a>
          <div style="display: inline-block;">
            <!--<callAnLaiBar v-if="user.alias === 'cc' || user.alias === 'sm'|| user.alias === 'cr'|| user.alias === 'tmk'" ref='anLaiCall' style="float:left;"></callAnLaiBar>-->
            <callToolBar  ref='callToolBar'></callToolBar>
          </div>
        </div>
        <div class="right">
          <span class="role-span">当前角色：</span>
          <Select @on-change="roleChange" size="small" class='headerRole trans' v-model="role" style="width:98px;background-color: transparent;">
            <Option v-for="(item,index) in rolesList" :value="item.roleUuid" :key=index>{{ item.roleName }}</Option>
          </Select>
          <i-input class="trans" size="small" v-model="search.param" icon="ios-search" @on-enter="quickSearchResult" placeholder="请输入姓名\手机号" style="width: 150px;vertical-align: bottom;margin-right:4px;"></i-input>
          <Button type='ghost' class="btn-person trans" size="small" :title="user.roleName" icon="person" @click="toPersonalCenter()">{{user.name}}</Button>
          <Badge :count="noticeCount" overflow-count="99" class="badge-count">
            <Button type='ghost' class="btn-message trans" size="small" icon="android-notifications" @click="toCenter()"></Button>
          </Badge>
          <Button class="btn-exit" type="ghost" size="small" icon="power" title="退出系统" onclick="GLOBAL.logout()"></Button>
          <Button size="small" type="ghost"><a :href="API_BASE_URL" style="color: #444; line-height: 18px;font-size: 12px;">工单系统</a></Button>
        </div>
      </div>
    </header>
    <quickSearchResultModal ref="searchresultmodal"></quickSearchResultModal>
    <msgCenter ref="msgCenter" @noticePushCourseCount="noticePushCourseCount"></msgCenter>
  </div>

</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {common} from 'common/js/common.js';
  import quickSearchResultModal from 'dashborader/quickSearchResult/quickSearchResultModal';
  import callToolBar from './callToolBar.vue';
  import callAnLaiBar from './callAnLaiBar.vue';
  import msgCenter from '../center/msgCenter';
  const $localStorage = $.localStorage;
  let timerId;
  export default{
    props: {
      user: Object,
      colSpan: Object
    },
    data() {
      return {
        noticeCount: '',
        search: {
          param: ''
        },
        rolesList: [],
        role: sessionStorage.getItem("roleUuid") || '',
        API_BASE_URL:''
      }
    },
    mounted() {
     // this.noticePushCourseCount();
      this.loadAllRoles();
      let order_token = localStorage.getItem("token");
      let order_user = localStorage.getItem("user");
      let hostname = window.location.hostname;

      if (hostname === 'crm.xuezaijia.net' || hostname === 'crm.kiwiji.com') {  //正式环境
        this.API_BASE_URL = `http://order.onlyhi.cn?user=${order_user}&token=${order_token}`;
      } else if (hostname === 'xcrm.onlyeduhi.cn') {//测试环境
        this.API_BASE_URL = `http://order.onlyeduhi.cn?user=${order_user}&token=${order_token}`;
      } else {
        this.API_BASE_URL = `http://order.onlyhi.cn?user=${order_user}&token=${order_token}`;
//        this.API_BASE_URL = 'http://order.onlyeduhi.cn';//测试工单环境
      }
    },
    methods: {
      roleChange(){
        const _this = this;
        sessionStorage.clear()
        sessionStorage.setItem('roleUuid',_this.role);
        common.ajax({
          url: COMMON_API().Role.switchUserRole+'?roleUuid='+_this.role,
          method: 'get',
          success: function(response){
            sessionStorage.setItem('lock',1);
            let user = $localStorage.get('user');
            user.alias = response.data.alias;
            user.roleName = response.data.roleName;
            user.roleUuid = response.data.roleUuid;
            $localStorage.set('user', user);
            location.href = '/';
          }
        });
      },
      loadAllRoles() {
        const _this = this;
        common.ajax({
          url: COMMON_API().Role.getAllUserRole,
          method: 'get',
          success: function(response){
            _this.rolesList = response.data || [];
            response.data.forEach(function (item) {
              if(item.nowRoleUuid == 1){
                _this.role = item.roleUuid
              }
            })
          }
        });
      },
      toCenter() {
        this.$refs.msgCenter.show();
      },
      toPersonalCenter() {
        location.hash = '/public/center/personal';
      },
      // toggleMainMenu() {
      //   let letSpan = this.colSpan.asideColSpan;
      //   let rightSpan = this.colSpan.wrapperAsideColSpan;
      //   if (letSpan === 3) {
      //     this.$emit('toggle', 0,24);
      //   } else {
      //     this.$emit('toggle', 3,21);
      //   }
      // },
      //快速搜索学生功能
      quickSearchResult() {
        let param = this.search.param;
        if (param) this.$refs.searchresultmodal.show(param);
      },
      interval() {
        /**
         * 新消息提示定时器
         * 定时器开启原则： 只有CC、CR角色才会运行
         * 定时器关闭原则： 1. 浏览器关闭 、2. Vue实例被销毁
         * @type {string}
         */
//        let isCloseBrowse = '', that = this, user = $localStorage.get('user');
//        if (user.alias === "cc" || user.alias === "cr") {
//          timerId = setInterval(function () {
//            isCloseBrowse = sessionStorage.getItem('RES_STATUS_SUCCESS');
//            if (isCloseBrowse !== '') {
//              that.noticePushCourseCount();
//            } else {
//              clearInterval(timerId);
//            }
//          }, 60000);
//        }
      },
      noticePushCourseCount(unReadMes,newMes) {
        // console.log (unReadMes,newMes);
        this.noticeCount = unReadMes || 0
        if(newMes == 1){
          this.$Notice.info({
            title: '请注意',
            desc: '你有新消息，快去查看',
            duration: 0
          });
        }
        localStorage.setItem('noticeCounts', unReadMes);
      }
    },
    destroyed() {
      clearInterval(timerId);
      localStorage.removeItem('noticeCounts');
    },
    components: {quickSearchResultModal, callToolBar,callAnLaiBar,msgCenter}
  };
</script>

<style scoped>
  header{
    /*overflow: hidden;*/
    /*height:50px;*/
    box-sizing: border-box;
    background: #09C;

  }
  .logo{
    border-right: none !important;
  }
  .ivu-btn{
    margin:0;
  }
  .role-span{
    color: #fff;
    vertical-align: middle;
  }
  .ivu-btn-ghost{
    color: #fff !important;
  }
  .ivu-input-wrapper-small .ivu-input-icon.ivu-input{
    background-color: transparent !important;
  }
  a{
    color: #FFF !important;
  }
</style>
