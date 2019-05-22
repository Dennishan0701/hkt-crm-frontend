<template>
  <div class="mc">
    <o-breadcrumb second="onlyHi课堂"></o-breadcrumb>
    <div style='text-align: center'>
      <h1 style='line-height: 50px'>嗨课堂，欢迎你</h1>
      <h2 style='line-height: 50px;margin-bottom: 20px'>{{time}}</h2>
    </div>
    <div class="center">
      <div :class="oHeight? 'moreHeight' : 'lessHeight'">
        <h1 style="text-align: left;line-height: 50px;margin-left: 10px;">公告栏
          <!--<span style="font-size: 16px">{{create_date}}</span>-->
        </h1>
        <!--<p style='white-space:pre;padding: 0 20px;padding-bottom:10px;line-height: 24px;font-size: 16px;text-align: left;'>-->
        <!--&lt;!&ndash;本次更新功能：<br>&ndash;&gt;-->
        <!--&lt;!&ndash;1、新增销售业绩指标管理功能<br>&ndash;&gt;-->
        <!--&lt;!&ndash;2、更新销售业绩榜TV团队业绩排行为达标率排行<br>&ndash;&gt;-->
        <!--&lt;!&ndash;3、新增CR 结课学生页面<br>&ndash;&gt;-->
        <!--&lt;!&ndash;4、修复已知bug<br>&ndash;&gt;-->
        <!--&lt;!&ndash;5、优化用户体验<br>&ndash;&gt;-->
        <!--&lt;!&ndash;{{content}}&ndash;&gt;-->
        <!--</p>-->
        <p ref="pHeight" style='white-space:pre-wrap;padding: 0 20px;padding-bottom:20px;line-height: 24px;font-size: 16px;text-align: left;' v-html='content'>
        </p>
      </div>
      <div v-if="btnIsShow" class="clickShowMore" @click="oHeight = !oHeight">
        <i v-if="!oHeight" class="ivu-icon ivu-icon-ios-arrow-down"></i>
        <i v-if="oHeight" class="ivu-icon ivu-icon-ios-arrow-up"></i>
        <!--<button v-if="!oHeight" type="button" class="ivu-btn ivu-btn-text">-->
        <!--<span>查看详情</span>-->
        <!--</button>-->
        <!--<button v-if="oHeight" type="button" class="ivu-btn ivu-btn-text">-->
        <!--<span>收起</span>-->
        <!--</button>-->
      </div>
    </div>
    <div class="center" style="text-align: left;margin-bottom: 50px">
      <h1 style="margin-left: 10px;line-height: 50px">工作权限</h1>
      <Radio-group v-model="role" @on-change="roleChange" style="margin: 10px;">
        <Radio :label="item.roleUuid" v-for='(item,index) in rolesList' :key='index' style='padding: 5px 10px ;margin: 5px;border:1px solid #d7dde4;border-radius: 32px;'>
          <span>{{item.roleName}}</span>
        </Radio>
      </Radio-group>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import {COMMON_API} from 'common/api.config.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  const $localStorage = $.localStorage;
  export default{
    data() {
      return {
        oHeight:false,
        btnIsShow:false,
        disabled:false,
        modal:false,
        formDynamic: {
          items: [
            {
              value: ''
            }
          ]
        },
        rolesList: [],
        role: '',
        time:'',
        uuid:'',
        create_date:'',
        content:'',
      }
    },
    mounted() {
      const _this = this;
      this.loadAllRoles();
      //获取公告栏内容
      this.getNoticeDeatil()
    },
    updated(){
      let heights;
      heights =  this.$refs.pHeight.offsetHeight;
      if(heights>=140){
        this.btnIsShow = true;
      }else {
        this.btnIsShow = false;
      }
    },
    methods: {
      getNoticeDeatil(){
        const _this = this;
        common.ajax({
          url: COMMON_API().Notice.getNoticeDeatil,
          method: 'get',
          success: function(response){
              if(response.data["notice"]){
                _this.create_date = response.data["notice"].createDate;
                _this.content = response.data["notice"].content;
              }
          }
        });
      },
      roleChange(){
        const _this = this;
        sessionStorage.setItem('roleUuid',_this.role);
        common.ajax({
          url: COMMON_API().Role.switchUserRole+'?roleUuid='+_this.role,
          method: 'get',
          success: function(response){
            sessionStorage.setItem('lock',1);
            let user = $localStorage.get('user');
            user.alias = response.data.alias;
            user.roleName = response.data.roleName;
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
            if(_this.rolesList){
              _this.rolesList.forEach(item => {
                if(item.nowRoleUuid == 1){
                  _this.role = item.roleUuid
                }
              })
            }
          }
        });
      }
    },
    components: { OBreadcrumb }
  };
</script>

<style lang="less" rel="stylesheet/less" scoped>
.center{
  border: 1px solid #d7dde4;
  border-radius: 5px;
  margin: 10px 20px;
  padding: 5px;
  overflow: hidden;
  position: relative;
}
.moreHeight{
  height: auto;
}
.lessHeight{
  height: 190px;
}
.clickShowMore{
  /*display: flex;*/
  /*justify-content: center;*/
  /*align-items: center;*/
  position: absolute;
  bottom:1px;
  left: 4px;
  right: 4px;
  text-align: center;
  cursor: pointer;
  padding: 5px 0;
  .ivu-btn{
    margin-top: -8px;
    padding: 8px 10px;
  }
  i{
    cursor: pointer;
    font-size: 18px;
    font-weight: 700;
    position: relative;
    top: 6px;
    z-index: 2;
  }
}
.clickShowMore:after{
  content: "";
  width: 100%;
  height: 75px;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;
  box-shadow: inset 0 -25px 40px #fff;
  box-sizing: border-box;
}
</style>
