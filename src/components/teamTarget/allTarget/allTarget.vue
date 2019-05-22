<template>
<div>
  <o-breadcrumb second="指标管理" third="销售月指标管理"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="6">
        <i-button :size="$store.state.searchModuleSize" type="primary" icon="edit" @click="showEdit()">新增</i-button>
      </i-col>
      <i-col span="18" class="right">
        <Date-picker :size="$store.state.searchModuleSize" @on-change='getMonth' type="month" placeholder="选择年月" style="width: 200px"></Date-picker>
        <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
      </i-col>
    </Row>
  </div>
  <i-table size="small" stripe :columns="columns" :data="data" @on-current-change="currentData"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :current="pageIndex" :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>
  <edit @reFresh="reFresh" ref="edit"></edit>
</div>
</template>

<script type="text/ecmascript-6">
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import edit from './edit';
  import {TARGET} from 'common/api/target.js';
  import {common,formateDate} from 'common/js/common.js';
  import PageModel from 'dashborader/page/page.vue';
  let month0 = new Date().getMonth()+1;
  if(month0<10){
    month0 = '0'+month0;
  }

  let month = new Date().getFullYear() + '-' + month0;
  console.log(month);
  export default{
    props: {
      user: {
        type: Object
      }
    },
    data() {
      return {
        uuid: '',
        month: month,
        currentRowData: {},
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: 10,
        columns: [
          {
            title: '序号',
            width: 40,
            type:'index',
            align:'center',
            minWidth:50,
          },
          {
            title: '人工月',
            key: 'month',
            align:'center',
            minWidth:90,
          },
          {
            title: '类型',
            key: 'targetType',
            align:'center',
            minWidth:90,
          },
          {
            title: '指标（万元）',
            key: 'saleTarget',
            align:'center',
            minWidth:90,
          },
          {
            title: '创建时间',
            key: 'createDate',
            align:'center',
            minWidth:150,
            // render(row,column,index){
            //   return formateDate(row.createDate)
            // },
            render:(h,params) =>{
              return h('div',[
                h('span',{},formateDate(params.row.createDate))
              ])
            }
          },
          {
            title:'操作',
            key: 'action',
            align: 'center',
            minWidth:150,
//            render (row, column, index) {
//              return `<i-button type="primary" size="small" icon="edit" title="编辑" @click="showEdit('${row.saleTarget}','edit')"></i-button>`;
//            },
            render : (h, params) => {
              return h('div',[
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'edit',
                  },
                  attrs: {
                    title: '编辑',
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.showEdit(params.row.saleTarget,params.row.month,'edit');
                    }
                  }
                })
              ])
            }

          }
        ]
      }
    },
    mounted(){
      this.searchForm();
    },
    methods: {
      getMonth(value){
          this.month = value;
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        // let param = `?month=${search.month}&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        // let apiUrl = TARGET().allTarget.dataGrid+param;
        const _this = this;
        // common.ajax({
        //   url: apiUrl,
        //   method: 'get',
        //   success: function(res){
        //     _this.data = res.data['saleTargetVos'] || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get(TARGET().allTarget.dataGrid,{
          params:{
            month : search.month,
            pageIndex : this.pageIndex,
            pageNumber : this.pageNumber,
            orderBy : orderBy,
            sortBy : sortBy,
          },
        }).then( ({data}) => {
          this.data = data.data['saleTargetVos'] || [];
          this.total = data.data.total;
        })
      },
      showEdit(saleTarget,edit) {
        let month = this.month;
        this.$refs.edit.show(saleTarget,month,edit);
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          month: this.month
        });
      },
      currentData(currentRow) {
        this.currentRowData = currentRow;
      },
      pageChange(pageIndex){
        this.pageIndex = pageIndex;
        this.loadDataGrid({month: this.month});
      },
      reFresh(){
        this.loadDataGrid({month: this.month});
      }
    },
    components: {
      OBreadcrumb,
      edit,PageModel
    }
  };
</script>

<style>

</style>
