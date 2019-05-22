<template>
<div>
  <div class="roleManager">
    <o-breadcrumb second="权限管理" third="角色管理"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24">
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="plus" @click="addModal = true">新增</i-button>
        </i-col>
      </Row>
    </div>
    <i-table :height="theight" size="small" stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
  </div>
  <Modal
    title="新增"
    v-model="addModal"
    :mask-closable="false"
    :closable="false"
    :loading = "loading"
    @on-ok="handleSubmit0('formValidateAdd')"
    class-name="vertical-center-modal">
    <i-form ref='formValidateAdd' :model="addFormItem" :rules="ruleValidateModel" :label-width="80">
      <Form-item label="角色名称" prop="name">
        <i-input v-model="addFormItem.name" placeholder="请输入..." style="width: 200px"></i-input>
      </Form-item>
      <Form-item label="备注" prop="remark">
        <i-input type="textarea" v-model="addFormItem.remark" :rows="4" :maxlength="500" placeholder="不要超过500字"></i-input>
      </Form-item>
    </i-form>
  </Modal>

  <Modal
    title="编辑"
    v-model="editModal"
    :mask-closable="false"
    :closable="false"
    :loading = "loading"
    @on-ok="handleSubmit('formValidateEdit')"
    class-name="vertical-center-modal">
    <i-form ref='formValidateEdit' :model="formItem" :rules="ruleValidateModel" :label-width="80">
      <Form-item label="角色名称" prop="name">
        <i-input v-model="formItem.name" placeholder="请输入..." style="width: 200px"></i-input>
      </Form-item>
      <Form-item label="备注" prop="remark">
        <i-input type="textarea" v-model="formItem.remark" :rows="4" :maxlength="500" placeholder="不要超过500字"></i-input>
      </Form-item>
    </i-form>
  </Modal>
</div>
</template>

<script type="text/ecmascript-6">
  import {AUTHORITY} from 'common/api/authority.js';
  import {common,formateDate} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        columns: [
          {
            title: '角色名称',
            key: 'name',
            align:'center',
            minWidth:90,
          },
          {
            title: '角色代码',
            key: 'alias',
            align:'center',
            minWidth:90,
          },
          {
            title: '角色描述',
            key: 'description',
            align:'center',
            minWidth:120,
          },
          {
            title: '创建时间',
            key: 'createDate',
            align:'center',
            minWidth:150,
            render (h,params) {
              return h('span',formateDate(params.row.createDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '操作',
            key: 'action',
            align:'center',
            minWidth:200,
            render:(h,params) => {
              return h('div',[
                h('Button',{
                  props:{
                    type:'success',
                    size:"small",
                    icon:"locked"
                  },
                  style:{
                    margin:'2px'
                  },
                  on:{
                    click:()=>{
                      this.grant(params.row.name,params.row.uuid)
                  }
                  }
                },'授权'),
                h('Button',{
                  props:{
                    type:'primary',
                    size:"small",
                    icon:"edit"
                  },
                  style:{
                    margin:'2px'
                  },
                  on:{
                    click:()=>{
                      this.editRole(params.row.uuid)
                  }
                  }
                },'编辑'),
                h('Button',{
                  props:{
                    type:'error',
                    size:"small",
                    icon:"android-cancel"
                  },
                  style:{
                    margin:'2px'
                  },
                  on:{
                    click:()=>{
                      this.grant(params.row.name,params.row.uuid)
                  }
                  }
                },'删除')
              ])
          }
//            render (row, column, index) {
//              return `<i-button type="success" size="small" icon="locked" @click="grant('${row.name}','${row.uuid}')">授权</i-button>
//              <i-button type="primary" size="small" icon="edit" @click="editRole('${row.uuid}')">编辑</i-button>
//              <i-button type="error" size="small" icon="android-cancel" @click="deleteRole('${row.uuid}')">删除</i-button>`;
//            }
          }
        ],
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        addModal: false,
        editModal: false,
        uuid: '',
        loading: true,
        formItem: {
          name: '',
          remark: ''
        },
        addFormItem: {
          name: '',
          remark: ''
        },
        ruleValidateModel: {
          name: [
            {required: true, message: '请填写角色名称',  trigger: 'blur'},
          ]
        }
      };
    },
    mounted() {
      this.loadDataGrid();
    },
    methods: {
      grant(name,uuid) {
        sessionStorage.setItem('uuid',uuid);
        sessionStorage.setItem('name',name);
        location.hash = '/authority/roleGrant';
      },
      editRole(uuid) {
        this.editModal = true;
        this.uuid = uuid;
        const _this = this;
        // common.ajax({
        //   url: AUTHORITY().Role.getRoleByUuid,
        //   method: 'get',
        //   data: {uuid: uuid},
        //   success: function (res) {
        //     _this.formItem.name = res.data.name;
        //     _this.formItem.remark = res.data.description;
        //   }
        // });
        this.$axios.get(AUTHORITY().Role.getRoleByUuid,{
          params:{
            uuid: uuid
          }
        }).then( ({data}) => {
          _this.formItem.name = data.data.name;
          _this.formItem.remark = data.data.description;
        })
      },
      handleSubmit(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            // common.ajax({
            //   url: AUTHORITY().Role.editRoleInfo,
            //   data: {
            //     roleName: _this.formItem.name,
            //     uuid: _this.uuid,
            //     description: _this.formItem.remark
            //   },
            //   success: function (res) {
            //     common.notices(res.msg);
            //     _this.loading = false;
            //     _this.loadDataGrid();
            //   }
            // });
            this.$axios.post(AUTHORITY().Role.editRoleInfo,{
              roleName: _this.formItem.name,
              uuid: _this.uuid,
              description: _this.formItem.remark
            }).then( ({data}) => {
              common.notices(data.msg);
              _this.loading = false;
              _this.loadDataGrid();
            })
          } else {
            setTimeout(() => {
              this.loading = true;
            }, 0);
          }
        });
      },
      handleSubmit0(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            // common.ajax({
            //   url: AUTHORITY().Role.createRole,
            //   data: {
            //     roleName: _this.addFormItem.name,
            //     description: _this.addFormItem.remark
            //   },
            //   success: function (res) {
            //     common.notices(res.msg);
            //     _this.loading = false;
            //     _this.loadDataGrid();
            //   }
            // });
            this.$axios.post(AUTHORITY().Role.createRole,{
              roleName: _this.addFormItem.name,
              description: _this.addFormItem.remark
            }).then( ({data}) => {
              common.notices(data.msg);
              _this.loading = false;
              _this.loadDataGrid();
            })
          } else {
            setTimeout(() => {
              this.loading = true;
            }, 0);
          }
        });
      },
      deleteRole(uuid) {
        const _this = this;
        this.$Modal.confirm({
          title: '确认',
          content: '确认删除该角色？',
          onOk: function () {
            this.$axios.post(AUTHORITY().Role.deleteRoleInfo,{
              uuid: uuid
            }).then( () => {
              common.notices('操作成功！');
              _this.loadDataGrid();
            })
          }
        });
      },
      loadDataGrid(val) {
        let param = `?pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}`;
        const _this = this;
        // common.ajax({
        //   url: AUTHORITY().Role.dataGrid + param,
        //   method: 'get',
        //   success: function (res) {
        //     _this.data = res.data['roles'] || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get(AUTHORITY().Role.dataGrid,{
          params:{
            pageIndex: this.pageIndex,
            pageNumber: this.pageNumber,
          }
        }).then( ({data}) => {
          _this.data = data.data['roles'] || [];
          _this.total = data.data.total;
        })
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.loadDataGrid();
      }
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470: '';
      }
    },
    components: { OBreadcrumb  ,PageModel}
  };
</script>

<style>

</style>
