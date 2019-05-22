<template>
<div>
  <o-breadcrumb second="指标管理" third="业绩指标管理"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="14">
        <i-button :size="$store.state.searchModuleSize" type="primary" icon="edit" @click="showAdd">批量修改</i-button>
        <span class="c-red" style="line-height: 30px;font-size: 16px;margin-left: 10px;vertical-align: middle">总月标{{saleTarget}}万元</span>
      </i-col>
      <i-col span="10" class="right">
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

  <add @reFresh="reFresh" ref="add"></add>
  <edit @reFresh="reFresh" ref="edit"></edit>
</div>
</template>

<script type="text/ecmascript-6">
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import add from 'components/teamTarget/add';
  import edit from 'components/teamTarget/edit';
  import {TARGET} from 'common/api/target.js';
  import {common} from 'common/js/common.js';
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
        saleTarget: 0,
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
            title: '团队',
            key: 'teamName',
            align:'center',
            minWidth:90,
          },
          {
            title: '属性',
            key: 'teamType',
            align:'center',
            minWidth:90,
          },
          {
            title: '时间',
            key: 'month',
            align:'center',
            minWidth:120,
          },
          {
            title: '类型',
            key: 'targetType',
            align:'center',
            minWidth:90,
          },
          {
            title: '指标（元）',
            key: 'saleTarget',
            align:'center',
            minWidth:90,
          },
          {
            title: '更新时间',
            key: 'updateDate',
            align:'center',
            minWidth:150,
          },
          {
            title:'操作',
            key: 'action',
            align: 'center',
            minWidth:150,
            // render (row, column, index) {
            //   return `<i-button type="primary" size="small" icon="edit" title="编辑" @click="showEdit('${row.teamUuid}','${row.saleTargetId}','${row.teamName}','${row.teamType}','${row.saleTarget}')"></i-button>`;
            // },
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
                      this.showEdit(params.row.teamUuid,params.row.saleTargetId,params.row.teamName,params.row.teamType,params.row.saleTarget);
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
        // let apiUrl = TARGET().target.dataGrid+param;
        // const _this = this;
        // common.ajax({
        //   url: apiUrl,
        //   method: 'get',
        //   success: function(res){
        //     _this.data = res.data['saleTargetVos'] || [];
        //     _this.total = res.data.total;
        //     _this.saleTarget = res.data.saleTarget;
        //   }
        // });
        this.$axios.get(TARGET().target.dataGrid,{
          params:{
            month : search.month,
            pageIndex : this.pageIndex,
            pageNumber : this.pageNumber,
            orderBy : orderBy,
            sortBy : sortBy,
          },
        }).then( ({data}) => {
          this.data = data.data['saleTargetVos']|| [];
          this.total = data.data.total;
          this.saleTarget = data.data.saleTarget;
        })
      },
      showAdd() {
        this.$refs.add.show();
      },
      showEdit(teamUuid,saleTargetId,teamName,teamType,saleTarget) {
        let month = this.month;
        this.$refs.edit.show(teamUuid,saleTargetId,teamName,teamType,saleTarget,month);
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
      add,
      edit,PageModel
    }
  };
</script>

<style>

</style>
