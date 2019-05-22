<template>
<div>

  <div class="roleManager">
    <o-breadcrumb second="公众管理" third="公告栏"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24">
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="plus" @click="addModal = true">新增</i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :current="pageIndex" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
  </div>

  <Modal
    title="新增公告栏内容"
    v-model="addModal"
    :mask-closable="false"
    :closable="false"
    :loading = "loading"
    @on-ok="handleSubmit('formValidateAdd')"
    class-name="vertical-center-modal">
    <i-form ref="formValidateAdd" :model="formItem" :rules="ruleValidateModel" :label-width="80">
      <Form-item label="公告栏内容" prop="remark">
        <i-input type="textarea" v-model="formItem.remark" :rows="4" :maxlength="500" placeholder="请有序填写公告栏，在欢迎页查看效果" id="remark"></i-input>
      </Form-item>
    </i-form>
  </Modal>

  <Modal
    v-model="modal1"
    title="下架公告栏"
    @on-ok="ok">
    <p>确定下架这条公告栏吗？？？</p>
  </Modal>
</div>
</template>

<script type="text/ecmascript-6">
  import {common,formateDate} from 'common/js/common.js';
  import {COMMON_API} from 'common/api.config';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        columns: [
          {
            type: 'index',
            align: 'center',
            minWidth:60,
          },
          {
            title: '内容',
            key: 'content',
            align: 'center',
            minWidth:200,
          },
          {
            title: '状态',
            key: 'enabled',
            align: 'center',
            minWidth:90,
            render(h, params) {
              if(params.row.enabled == 1){
                return h('span','上架')
              }else {
                return h('span','下架')
              }
            }
          },
          {
            title: '部门',
            key: 'enabled',
            align: 'center',
            minWidth:90,
            render(h, params) {
              if(params.row.noticeType == 1){
                return h('span','销售部')
              }else if(params.row.noticeType == 2){
                return h('span','教学部')
              }else if(params.row.noticeType == 0){
                return h('span','总经办')
              }
            }
          },
          {
            title: '更新时间',
            key: 'updateDate',
            align: 'center',
            minWidth:150,
            render(h, params) {
              return h('span',formateDate(params.row.updateDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            minWidth:200,
            render : (h, params) => {
                if(params.row.enabled){
                  return h('div',[

                    h('Button',{
                      props:{
                        type:'success',
                        size:'small',
                      },
                      style:{
                        margin:'2px'
                      },
                      on:{
                        click:()=>{
                          this.grant(params.row.uuid)
                        }
                      }
                    },'下架'),
                  ])
//                  return `<i-button type="success" size="small" @click="grant('${row.uuid}')">下架</i-button>`
                }else {
                  return h('span','已下架')
                }
            }
          }
        ],
        data: [],
        total: 0,
        modal1: false,
        pageIndex: 1,
        pageNumber: 15,
        addModal: false,
        uuid: '',
        loading: true,
        formItem: {
          remark: ''
        },
        ruleValidateModel: {
          remark: [
            { required: true, message: '请输入公告栏', trigger: 'blur' },
            { type: 'string', min: 5, message: '公告栏不能少于5字', trigger: 'blur' }
          ]
        }
      };
    },
    mounted() {
      this.loadDataGrid();
    },
    methods: {
      grant(uuid) {
        this.modal1 = true;
        this.uuid = uuid;
      },
      ok () {
        const _this = this;
        // common.ajax({
        //   url: COMMON_API().Notice.updateNotice,
        //   data:{
        //       uuid:_this.uuid
        //   },
        //   success: function (res) {
        //     common.notices('下架成功！');
        //     _this.loadDataGrid();
        //   }
        // });
        this.$axios.post( COMMON_API().Notice.updateNotice,{
          uuid:_this.uuid
        }).then( () => {
          common.notices('下架成功！');
          _this.loadDataGrid();
        })
      },

      handleSubmit(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            // common.ajax({
            //   url: COMMON_API().Notice.addNotice,
            //   data: {
            //     content: _this.formItem.remark,
            //   },
            //   success: function (res) {
            //     _this.addModal = false;
            //     common.notices('操作成功！');
            //     _this.loadDataGrid();
            //   }
            // });
            this.$axios.post(COMMON_API().Notice.addNotice,{
              content: _this.formItem.remark,
            }).then( () => {
              _this.addModal = false;
              common.notices('操作成功！');
              _this.loadDataGrid();
            })
          } else {
            setTimeout(() => {
              this.loading = true;
            }, 0);
          }
        });
      },
      loadDataGrid() {
        let param = `?pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}`;
        const _this = this;
        // common.ajax({
        //   url: COMMON_API().Notice.getAllNoticeDeatil + param,
        //   method: 'get',
        //   success: function (res) {
        //     _this.data = res.data['noticeVoList'] || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get(COMMON_API().Notice.getAllNoticeDeatil,{
          params:{
            pageIndex:this.pageIndex,
            pageNumber:this.pageNumber
          }
        }).then( ({data}) => {
          _this.data = data.data['noticeVoList'] || [];
          _this.total = data.data.total;
        })
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.loadDataGrid();
      }
    },
    components: { OBreadcrumb  ,PageModel}
  };
</script>

<style scoped>
  #remark .ivu-input,.ivu-table-row .ivu-table-cell{
    white-space: pre !important;
  }
</style>
