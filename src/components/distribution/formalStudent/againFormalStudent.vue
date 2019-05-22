<template>
<div>
  <o-breadcrumb second="分配管理" third="正式生再分配"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <Col span='6'>
        <i-button type="primary" :size="$store.state.searchModuleSize" icon="paper-airplane" @click="showSalesModal">批量分配</i-button>
      </Col>
      <i-col span="18" class="right">
        <strong class="label">姓名\手机：</strong>
        <i-input v-model="nameAndPhoneValue" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="学生姓名 \ 手机号码" style="width:150px;margin-right: 2px;"></i-input>
        <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索</i-button>
      </i-col>
    </Row>
  </div>
  <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data" @on-selection-change="getSelections" @on-select-all="getSelectionAll"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>

  <select-sales ref="sales" @reFresh="reFresh"  form-type="2"></select-sales>

</div>
</template>

<script type="text/ecmascript-6">
  import {DISTRIBUTE} from 'common/api/distribute.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import selectSales from './againFormalStudentSelectSales';
  import PageModel from 'dashborader/page/page.vue';
  const $sStorage = $.sessionStorage;
  export default{
    data() {
      return {
        data: [],
        total: 0,
        selectionRows: [],
        selectionOldUuid: [],
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        nameAndPhoneValue: '',
        columns: [
          {
            type: 'selection',
            minWidth: 40,
            align: 'center'
          },
          {
            title: '学生',
            key: 'studentName',
            minWidth:90,
            sortable: true,
            align: 'center',
            render : (h, params) => {
              return h('div',[
                h('Icon',{
                  props:{
                    type:'person'
                  }
                }),
                h('a',{
                  on:{
                    click:() => {
                      GLOBAL.viewLeadsDetail(params.row.leadUuid)
                  }
                  }
                },params.row.studentName)
              ])
//              return `<Icon type="person"></Icon> <strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.leadUuid}');">${row.studentName}</a></strong>`;
            }
          },
          {
            title: '手机号',
            key: 'studentPhone',
            align: 'center',
            minWidth:120,
            render(h, params) {
              return h('span',hideCharAtNumber(params.row.studentPhone));
            }
          },
          {
            title: '所属CR',
            align: 'center',
            key: 'saleUserName',
            minWidth:90,
          },
          {
            title: '负责时间',
            align: 'center',
            key: 'responsibleTime',
            minWidth:150,
            render(h, params) {
              return h('span',formateDate(params.row.responsibleTime,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '操作',
            width: 100,
            align: 'center',
            minWidth:100,
            render : (h, params) => {
              return h('div',[
                h('Button',{
                  props:{
                    type:'primary',
                    size:'small',
                    icon:'paper-airplane',
                  },
                  style:{
                    margin:'2px'
                  },
                  on:{
                    click:()=>{
                      this.distribution(params.row.leadsUuid,params.row.saleUserUuid)
                    }
                  }
                },'分配')
              ])
//              return `<i-button type="primary" size="small" icon="paper-airplane" @click="distribution('${row.leadsUuid}','${row.saleUserUuid}')">分配</i-button>`;
            }
          }
        ],
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
      distribution(leadsIds,oldUuid) {
        this.selectionRows.length = 1;
        this.selectionOldUuid.length = 1;
        this.selectionRows[0] = {"uuid": leadsIds};
        this.selectionOldUuid[0] = {"oldUuid": oldUuid};
        $sStorage.set('selectionOldUuid' ,this.selectionOldUuid);
        $sStorage.set('selectionRows' ,this.selectionRows);
        this.showSalesModal();
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        let nameAndPhone = this.nameAndPhoneValue;
        let name = '', phone = '';
        if (!nameAndPhone) nameAndPhone = '';
        if (isNaN(nameAndPhone)) {
          name = nameAndPhone;
        } else {
          phone = nameAndPhone;
        }
        this.loadDataGrid({
          studentName: name,
          studentPhone: phone
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?studentName=${search.studentName}&studentPhone=${search.studentPhone}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        // common.ajax({
        //   url: DISTRIBUTE().FormallStudent.getAgainStudentPage+param,
        //   method: 'get',
        //   success: function(res){
        //     _this.data = res.data['againDistributionVos'] || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get(DISTRIBUTE().FormallStudent.getAgainStudentPage,{
          params:{
            studentName: search.studentName,
            studentPhone: search.studentPhone,
            pageIndex: this.pageIndex,
            pageNumber: this.pageNumber,
            orderBy: orderBy,
            sortBy: sortBy,
          }
        }).then( ({data}) => {
          _this.data = data.data['againDistributionVos'] || [];
          _this.total = data.data.total;
        })
      },
      getSelections(selection) {
        $sStorage.set('selectionRows' ,selection);
        $sStorage.set('selectionOldUuid' ,selection);
        this.selectionRows = [{uuid:selection.leadsUuid}];
        this.selectionOldUuid = [{oldUuid:selection.saleUserUuid}];
//        this.selectionRows = selection;
//        this.selectionOldUuid = selection;
      },
      getSelectionAll(selection) {
        $sStorage.set('selectionRows' ,selection);
        this.selectionRows = selection;
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      reFresh(){
        this.searchForm();
      }
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470: '';
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
