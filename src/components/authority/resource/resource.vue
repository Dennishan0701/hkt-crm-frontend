<template>
<div class="resource">
  <o-breadcrumb second="权限管理" third="资源管理"></o-breadcrumb>
  <Row type="flex" justify="center">
    <i-col style='position: absolute;left: 10px;overflow-x: hidden;overflow-y: scroll;height:90%;'>
      <Menu theme="light" accordion @on-select="selectMenuItem">
        <Submenu v-for="(menuTree,index) in menuTreeList" :key="index" :name='menuTree.id'>
          <template slot="title">
            <Icon type="ios-keypad"></Icon>
            {{menuTree.id}}-{{menuTree.name}} <a href="javascript:;" :uuid="menuTree.uuid" @click="edit">[编辑]</a>
          </template>
          <template v-if="menuTree.childMenu">
            <Menu-item v-for="(children,index1) in menuTree.childMenu"  :name='children.id' :key="children.id">{{children.id}}-{{children.name}} <a href="javascript:;" :uuid="children.uuid" @click="edit">[编辑]</a></Menu-item>
          </template>
        </Submenu>
      </Menu>
    </i-col>
    <i-col span="24" style="padding-left: 265px;position: absolute;left: 0;padding-right: 20px;">
      <div class="grid-widget">
        <Row>
          <i-col span="24" style="">
            <ButtonGroup>
              <i-button type="primary" :size="$store.state.searchModuleSize" icon="plus" @click="showAdd">新增</i-button>
              <i-button type="info" :size="$store.state.searchModuleSize" icon="edit" @click="showEdit">编辑</i-button>
              <i-button type="error" :size="$store.state.searchModuleSize" icon="android-cancel" @click="del">删除</i-button>
            </ButtonGroup>
          </i-col>
        </Row>
      </div>
      <i-table :columns="columns" :data="data" highlight-row @on-current-change="currentRow"></i-table>
    </i-col>
  </Row>

  <edit-resource ref='edit'></edit-resource>
  <add-resource ref='add'></add-resource>
</div>
</template>

<script type="text/ecmascript-6">
  import {AUTHORITY} from 'common/api/authority.js';
  import {common} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import editResource from './edit.vue';
  import addResource from './add.vue';

  export default{
    data() {
      return {
        data: [],
        menuTreeList: [],
        columns: [
          {
            title: 'ID',
            key: 'id'
          },
          {
            title: '资源名称',
            align:'center',
            key: 'name',
            render : (h, params) => {
              return h('div',[
                h('Icon',{
                  props:{
                    type:params.row.iconCls
                  }
                }),
                h('strong',{
                },params.row.name)
              ])
            }
          },
          {
            title: '排序',
            align:'center',
            key: 'seq'
          },
          {
            title: '图标名',
            align:'center',
            key: 'iconCls'
          },
          {
            title: '资源类型',
            align:'center',
            key: 'resourceType',
            render (h,params) {
              if(params.row.resourceType == 1) {
                return h('span','按钮');
              } else {
                return h('span','菜单');
              }
            }
          }
        ],
        key: '',
        uuid: ''
      }
    },
    mounted() {
      this.loadMenuTree();
    },
    methods: {
      showAdd() {
        this.$refs.add.show();
      },
      showEdit() {
        let uuid = this.uuid;
        if (uuid == '') {
          common.notices('请选择一行数据！','提示', 'warning');
        } else {
          this.$refs.edit.show(uuid);
        }
      },
      edit(event) {
        let uuid = $(event.target).attr('uuid');
        this.$refs.edit.show(uuid,'menu');
      },
      del() {
        let uuid = this.uuid;
        if (uuid == '') {
          common.notices('请选择一行数据！','提示', 'warning');
        } else {
          const _this = this;
          this.$Modal.confirm({
            title: '确认',
            content: '确认删除该资源？',
            onOk: function () {
              // common.ajax({
              //   url: AUTHORITY().Resource.delete,
              //   data: {uuid: uuid},
              //   success: function (res) {
              //     common.notices('操作成功！');
              //     _this.selectMenuItem(_this.key);
              //   }
              // });
              this.$axios.post(AUTHORITY().Resource.delete,{
                uuid: uuid
              }).then( () => {
                common.notices('操作成功！');
                _this.selectMenuItem(_this.key);
              })
            }
          });
        }
      },
      currentRow(currentRow) {
        this.uuid = currentRow.uuid;
      },
      selectMenuItem(key) {
        this.key = key;
        const _this = this;
        // common.ajax({
        //   url: AUTHORITY().Resource.getResourceByMenuId,
        //   data: {resourceId: key},
        //   method: 'get',
        //   success: function (res) {
        //     _this.data = res.data || [];
        //   }
        // });
        this.$axios.get(AUTHORITY().Resource.getResourceByMenuId,{
          params:{
            resourceId: key
          }
        }).then( ({data}) => {
          _this.data = data.data || [];
        })
      },
      loadMenuTree() {
        const _this = this;
        // common.ajax({
        //   url: AUTHORITY().MenuTree+"?systemType=0",
        //   method: 'get',
        //   success: function(res){
        //     _this.menuTreeList = res.data || [];
        //   }
        // });
        this.$axios.get(AUTHORITY().MenuTree,{
          params:{
            systemType: 0,
          }
        }).then( ({data}) => {
          _this.menuTreeList = data.data || [];
        })
      },

      reFresh(value){
        if (value == 'success.reload') {
          this.selectMenuItem(this.key);
        } else if (value == 'success.reload.menu') {
          this.loadMenuTree();
        }
      }
    },
    components: {
      OBreadcrumb, editResource, addResource
    }
  };
</script>

<style scoped lang="less" rel="stylesheet/less">
  .resource{
    position: relative;
    height:100%;
  }
  .ivu-menu .ivu-menu-item a{
    width: auto;
  }
  .ivu-menu-item{
    padding-left: 20px !important;
  }

</style>
