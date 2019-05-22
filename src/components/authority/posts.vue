<template>
  <div class="postsManager">
    <o-breadcrumb second="权限管理" third="职位管理"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="6">
          <!--<i-button type="primary" icon="plus">新增</i-button>-->
        </i-col>
        <i-col span="18" class="right">
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
  import {AUTHORITY} from 'common/api/authority.js';
  import {formateDate,common} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        total: 0,
        pageIndex:1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        columns: [
          {
            title: '职位名称',
            key: 'name',
            align:'center',
            minWidth:120,
          },
          {
            title: '职位代号',
            key: 'code',
            align:'center',
            minWidth:120,
          },
          {
            title: '职位描述',
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
        ]
      }
    },
    mounted() {
      this.loadDataGrid({});
    },
    methods: {
      loadDataGrid(search, pageIndex = 1 ,pageNumber = this.pageNumber, orderBy = '', sortBy = '') {
        let param = `?pageIndex=${pageIndex}&pageNumber=${pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        // common.ajax({
        //   url: AUTHORITY().Posts.dataGrid+param,
        //   method: 'get',
        //   success: function(response){
        //     _this.data = response.data.posts || [];
        //     _this.total = response.data.total;
        //   }
        // });
        this.$axios.get(AUTHORITY().Posts.dataGrid,{
          params:{
            pageIndex:pageIndex,
            pageNumber:pageNumber,
            orderBy:orderBy,
            sortBy:sortBy,
          }
        }).then( ({data}) => {
          _this.data = data.data.posts || [];
          _this.total = data.data.total;
        });
      },
      pageChange(val){
        this.pageIndex= val
        this.loadDataGrid({},val)
      },
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470: '';
      }
    },
    components: { OBreadcrumb,PageModel }
  };
</script>

<style>

</style>
