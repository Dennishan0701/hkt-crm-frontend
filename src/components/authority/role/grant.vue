<template>
<div>
  <o-breadcrumb second="权限管理" third="角色管理" third-url="/role/manager" four="角色授权"></o-breadcrumb>
  <div style="text-align:center"><h2>{{roleName}}</h2></div>
  <div class="grid-widget affix">
    <Row>
      <i-col span="24">
        <i-button type="info" :size="$store.state.searchModuleSize" icon="refresh" @click="reload">刷新</i-button>
      </i-col>
    </Row>
  </div>

  <div v-for="(one,index) in resourceArray" :key="one.uuid">
    <div class="model">
      <Checkbox-group v-model="uuid">
        <Checkbox :label="one.uuid"><strong><Icon :type="one.iconCls"></Icon> {{one.name}}</strong></Checkbox>
      </Checkbox-group>
    </div>
    <div class="item" v-for="(two,index) in one.resourceManagerVo" :key="two.uuid">
      <div class="modelItem">
        <Checkbox-group v-model="uuid">
          <Checkbox :label="two.uuid"><strong><Icon :type="two.iconCls"></Icon> {{two.name}}</strong></Checkbox>
        </Checkbox-group>
      </div>
      <div class="resItem">
        <Checkbox-group v-model="uuid">
          <div v-for="(item,index) in two.resourceManagerVo" :key="item.uuid">
            <Checkbox :label="item.uuid"><Icon :type="item.iconCls"></Icon> {{item.name}}</Checkbox>
          </div>
          <!--<template v-for="(item,index) in two.resourceManagerVo">-->
          <!--<Checkbox :label="item.uuid"><Icon :type="item.iconCls"></Icon> {{item.name}}</Checkbox>-->
          <!--</template>-->
        </Checkbox-group>
      </div>
    </div>
  </div>
  <div class="btn-tools">
    <i-button type="primary" icon="checkmark" @click="save">确定</i-button>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <i-button icon="close" @click="close">关闭</i-button>
    <span id="tipMsg"></span>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
  import {AUTHORITY} from 'common/api/authority.js';
  import {common} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';

  export default{
    data() {
      return {
        roleName: sessionStorage.getItem('name'),
        uuid: [],
        resourceArray: []
      }
    },
    mounted() {
      this.loadData();
    },
    methods: {
      loadData() {
        let roleUuid = sessionStorage.getItem('uuid');
        const _this = this;
        // common.ajax({
        //   url: AUTHORITY().Resource.getAllResourceByRole,
        //   method: 'get',
        //   data: { roleUuid: roleUuid},
        //   success: function(res) {
        //     _this.resourceArray = res.data || [];
        //     res.data.forEach((one) => {
        //       if (one.isHaving) _this.uuid.push(one.uuid);
        //       one.resourceManagerVo.forEach((two) => {
        //         if (two.isHaving) _this.uuid.push(two.uuid);
        //         two.resourceManagerVo.forEach((item) => {
        //           if (item.isHaving) _this.uuid.push(item.uuid);
        //         });
        //       });
        //     });
        //   }
        // });
        this.$axios.get(AUTHORITY().Resource.getAllResourceByRole,{
          params:{
            roleUuid: roleUuid
          }
        }).then( ({data}) => {
          _this.resourceArray = data.data || [];
          data.data.forEach((one) => {
            if (one.isHaving) _this.uuid.push(one.uuid);
            one.resourceManagerVo.forEach((two) => {
              if (two.isHaving) _this.uuid.push(two.uuid);
              two.resourceManagerVo.forEach((item) => {
                if (item.isHaving) _this.uuid.push(item.uuid);
              });
            });
          });
        })
      },
      save() {
        const _this = this;
        let roleUuid = sessionStorage.getItem('uuid');
        // common.ajax({
        //   url: AUTHORITY().Role.grant,
        //   data: {
        //     roleUuid: roleUuid,
        //     resourceUuids: _this.uuid.join(',')
        //   },
        //   success: function (res) {
        //     common.notices('操作成功！');
        //     _this.close();
        //   },
        //   successError(res) {
        //     $('#tipMsg').html('<span style="color:red">操作失败！' + res + '</span>');
        //   }
        // });
        this.$axios.post(AUTHORITY().Role.grant,{
          roleUuid: roleUuid,
          resourceUuids: _this.uuid.join(',')
        }).then( ({data}) => {
          common.notices('操作成功！');
          _this.close();
          if(data){
            $('#tipMsg').html('<span style="color:red">操作失败！' + data + '</span>');
          }
        })
      },
      reload() {
        this.uuid = [];
        this.loadData();
      },
      close() {
        location.hash = '/authority/role';
      }
    },
    components: {
      OBreadcrumb
    }
  };
</script>

<style scoped>
  .grid-widget {
    /*padding: 0 0 3px 0;*/
  }
  .model {
    line-height: 60px;
    padding: 0 8px;
    color: #fff;
    background-color:#5cadff;
    font-size: 18px;
    margin-top: 43px;
  }
  .item .modelItem {
    line-height: 30px;
    padding: 0 20px;
    background-color:#d7dde4;
  }
  .item .resItem {
    padding: 0 40px;
    line-height: 30px;
    background-color:#f5f7f9;
  }
  .affix {
    position: fixed;
    width: 100%;
    z-index: 1;
  }
  .btn-tools{width:600px;text-align:center;margin:30px 0;margin-left:50px;}
</style>
