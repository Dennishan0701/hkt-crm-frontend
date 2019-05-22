<template>
  <div>
    <o-breadcrumb second="分配管理" third="离职人员名单分配"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="6">
          <i-button type="primary" :size="$store.state.searchModuleSize" @click="showSalesModal">批量分配</i-button>
          <i-button type="success" :size="$store.state.searchModuleSize" icon="plus" @click="importTmk">导入TMK名单</i-button>
        </i-col>
        <i-col span="18" class="right">
          <Checkbox :checked="Search.signStatus">S名单</Checkbox>
          <i-input v-model="Search.name" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="学生姓名" style="width:150px;margin-right:2px;"></i-input>
          <i-input v-model="Search.phone" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="手机号码" style="width:150px;margin-right:2px;"></i-input>
          <i-input v-model="Search.oldCc" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="前销售" style="width:150px;margin-right:2px;"></i-input>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" highlight-row stripe :columns="columns" :data="data" @on-selection-change="getSelections" @on-select-all="getSelectionAll" @on-sort-change="sortChange"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>

    <select-sales @reFresh="reFresh"  ref="sales" form-type="leads"></select-sales>
  </div>
</template>

<script type="text/ecmascript-6">
  import {DISTRIBUTE} from 'common/api/distribute.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import selectSales from './selectSales.vue';
  import PageModel from 'dashborader/page/page.vue';
  const $sStorage = $.sessionStorage;
  export default{
    data() {
      return {
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: 10,
        loading: true,
        Search: {
          name: '',
          phone: '',
          oldCc: '',
          signStatus: false,
        },
        orderBy: '',
        sortBy: '',
        selectionRows: [],
        columns: [
          {
            type: 'selection',
            minWidth: 40,
            align: 'center'
          },
          {
            title: '学生',
            key: 'leadsName',
            minWidth:60,
            align: 'center',
            render : (h, params) => {
            return h('div',[
              h('a',{
                on:{
                  click:()=>{
                  GLOBAL.viewLeadsDetail(params.row.leadsUuid)
              }
          }
      },params.row.leadsName)
    ])
//              return `<strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.leadsUuid}');">${row.leadsName}</a></strong>`;
            }
          },
          {
            title: '手机号',
            key: 'leadsPhone',
            align: 'center',
            minWidth:120,
            render(h, params) {
              return h('span',hideCharAtNumber(params.row.leadsPhone));
            }
          },
          {
            title: '报名时间',
            key: 'sighUpDate',
            align: 'center',
            minWidth:150,
            render(h, params) {
              return h('span',formateDate(params.row.sighUpDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '前销售',
            align: 'center',
            key: 'oldUserName',
            minWidth:120,
          },
          {
            title: '转交时间',
            align: 'center',
            key: 'managerTime',
            minWidth:150,
            render(h, params) {
              return h('span',formateDate(params.row.managerTime,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title:'操作',
            key: 'action',
            align: 'center',
            minWidth:100,
            render : (h, params) => {
            return h('div',[
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  icon: 'paper-airplane',
                },
                style: {
                  margin: '2px',
                },
                on: {
                  click: () => {
                  this.distribution(params.row.leadsUuid,params.row.oldUserUuid)
              }
          }
          },'分配')
          ])
//              return `<i-button type="primary" icon="paper-airplane" size="small" @click="distribution('${row.leadsUuid}','${row.oldUserUuid}')">分配</i-button>`;
            }
          }
        ]
      }
    },
    mounted() {
      this.searchForm();
    },
    methods: {
      showSalesModal() {
        let row = this.selectionRows;
        if (row.length > 0) {
          this.$refs.sales.show();
        } else {
          common.msg('请选择名单','warning');
        }
      },
      distribution(leadsIds, oldUserUuid) {
        this.selectionRows.length = 1;
        this.selectionRows[0] = { "uuid": leadsIds, "oldUserUuid": oldUserUuid};
        $sStorage.set('selectionRows' ,this.selectionRows);
        this.showSalesModal();
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          name: this.Search.name,
          phone: this.Search.phone,
          oldCc: this.Search.oldCc,
          signStatus: this.Search.signStatus ? 1 : 0
        });
      },
      loadDataGrid(search) {
        let param = `?name=${search.name}&phone=${search.phone}&oldCc=${search.oldCc}&signStatus=${search.signStatus}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${this.orderBy}&sortBy=${this.sortBy}`;
        const _this = this;
        // common.ajax({
        //   url: DISTRIBUTE().QuitLeads.dataGrid + param,
        //   method: 'get',
        //   success: function (res) {
        //     _this.data = res.data['dimissionLeadsOrStudentVos'] || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get(DISTRIBUTE().QuitLeads.dataGrid + param,{
        }).then( ({data}) => {
          _this.data = data.data['dimissionLeadsOrStudentVos'] || [];
          _this.total = data.data.total;
        })
      },
      getSelections(selection) {
        $sStorage.set('selectionRows' ,selection);
        this.selectionRows = selection;
      },
      getSelectionAll(selection) {
        $sStorage.set('selectionRows' ,selection);
        this.selectionRows = selection;
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      sortChange(obj) {
        this.orderBy = obj.key;
        this.sortBy = obj.order;
        this.searchForm();
      },
      reFresh(){
        this.searchForm();
      },
      importTmk(){
        let app = this;
        if(!app.Search.name && !app.Search.phone && !app.Search.oldCc){
          this.$Modal.confirm({
            title: '提示',
            content: '<p style="font-size: 16px;">可在输入框里输入条件按需导入。</p><p style="font-size: 16px;">确认导入所有？</p>',
            onOk: () => {
              app.$axios.get(DISTRIBUTE().QuitLeads.dimissionToTmk,{
                params:{
                  name:'',
                  phone:'',
                  oldCc:'',
                },
              }).then( (res) => {
                console.log(res);
                app.searchForm();
                app.$Notice.success({
                  title: '',
                  desc: res.data.msg
                });
              })
            },
          });
        }else{
          app.$axios.get(DISTRIBUTE().QuitLeads.dimissionToTmk,{
            params:{
              name:app.Search.name,
              phone:app.Search.phone,
              oldCc:app.Search.oldCc,
            },
          }).then( (res) => {
            console.log(res);
            app.searchForm();
            app.$Notice.success({
              title: '',
              desc: res.data.msg
            });
          })
        }
      }
    },
    components: { OBreadcrumb,selectSales ,PageModel}
  };
</script>

<style>
  .ivu-select-dropdown-list{
    text-align: left;
  }
</style>
