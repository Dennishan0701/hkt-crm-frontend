<template>
<div>
  <o-breadcrumb second="客户端管理" third="下载统计"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span='24' class="right">
        <Date-picker type="daterange" placement="bottom-end" :size="$store.state.searchModuleSize" @on-change="changeSubmitDate" placeholder="上课日期" style="width: 200px"></Date-picker>
        <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索</i-button>
      </i-col>
    </Row>
  </div>
  <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>
</div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {CLIENT} from 'common/api/client.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: 15,
        Search: {
          downloadDateStart: '',
          downloadDateEnd: '',
        },
        columns: [
          {
            title: '序号',
            type: 'index',
            align: 'center',
            minWidth:50,
          },
          {
            title: '日期',
            key: 'downloadDate',
            align: 'center',
            minWidth:100,
          },
          {
            title: '客户端类型',
            key: 'clientTypeDesc',
            align: 'center',
            minWidth: 80,
          },
          {
            title: '下载次数',
            key: 'downloadCount',
            align: 'center',
            minWidth: 40,
          },
          {
            title: 'IP数',
            key: 'ipCount',
            align: 'center',
            minWidth: 40,
          },
          {
            title: '操作',
            align: 'center',
            minWidth: 120,
            render : (h, params) => {
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
                      this.pass(params.row.downloadDate,params.row.clientType)
                    }
                  }
                },'查看地区分布')
              ])
//              return `<i-button type="success" size="small" @click="pass('${row.downloadDate}','${row.clientType}')">查看地区分布</i-button>`;
            }
          }
        ]
      }
    },
    mounted() {
      this.searchForm();
    },
    methods: {
      pass(date,clientType){
        console.log(date);
        location.hash = `/echarts/mapEachart?date=${date}&clientType=${clientType}&map=client`;
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          downloadDateStart: this.Search.downloadDateStart,
          downloadDateEnd: this.Search.downloadDateEnd,
        });
      },
      loadDataGrid(search) {
        let param = `?downloadDateStart=${search.downloadDateStart}&downloadDateEnd=${search.downloadDateEnd}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}`;
        const _this = this;
        // common.ajax({
        //   url: CLIENT().clientDown.dataGrid + param,
        //   method: 'get',
        //   success: function (res) {
        //     console.log(res.data);
        //     _this.data = res.data['clientDownloadList'] || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get(CLIENT().clientDown.dataGrid,{
          params:{
            downloadDateStart: search.downloadDateStart,
            downloadDateEnd: search.downloadDateEnd,
            pageIndex: this.pageIndex,
            pageNumber: this.pageNumber,
          }
        }).then( ({data}) => {
          _this.data = data.data['clientDownloadList'] || [];
          _this.total = data.data.total;
        })
      },
      changeSubmitDate(value) {
        this.Search.downloadDateStart = value[0] || '';
        this.Search.downloadDateEnd = value[1] || '';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      }
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470: '';
      }
    },
    components: {
      OBreadcrumb ,PageModel
    }
  };
</script>

<style lang="less" rel="stylesheet/less">

</style>
