<template>
<div>
  <div class="organizationManager">
    <o-breadcrumb second="权限管理" third="部门管理"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="6">
          <!--<i-button type="primary" icon="plus" @click="showAdd">新增</i-button>-->
        </i-col>
        <i-col span="18" class="right">
        </i-col>
      </Row>
    </div>
    <i-table size="small" :height="theight" highlight-row :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
  </div>

  <add-modal @reFresh="reFresh" ref='add'></add-modal>
</div>
</template>

<script type="text/ecmascript-6">
  import {AUTHORITY} from 'common/api/authority.js';
  import {formateDate,common} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import addModal from 'components/authority/organization/add';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        pageIndex:1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        total: 0,
        columns: [
          {
            title: '部门编号',
            align:'center',
            key: 'code',
            minWidth:60,
          },
          {
            title: '部门名称',
            align:'center',
            key: 'name',
            minWidth:100,
          },
          {
            title: '部门地址',
            align:'center',
            key: 'address',
            minWidth:120,
          },
          {
            title: '排序',
            align:'center',
            key: 'seq',
            minWidth:60,
          },
          {
            title: '创建时间',
            align:'center',
            key: 'createDate',
            minWidth:150,
            render (h, params) {
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
      loadDataGrid(search, pageIndex = 1 ,pageNumber = 15, orderBy = '', sortBy = '') {
        let param = `?pageIndex=${pageIndex}&pageNumber=${pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        // common.ajax({
        //   url: AUTHORITY().Organization.dataGrid+param,
        //   method: 'get',
        //   success: function(res){
        //     _this.data = res.data || [];
        //   }
        // });
        this.$axios.get(AUTHORITY().Organization.dataGrid,{
          params:{
            pageIndex: pageIndex,
            pageNumber: pageNumber,
            orderBy: orderBy,
            sortBy: sortBy,
          }
        }).then( ({data}) => {
          _this.data = data.data || [];
        })
      },
      showAdd() {
        this.$refs.add.show();
      },

      pageChange(val){
        this.pageIndex= val
        this.loadDataGrid({},val);
      },
      reFresh(){
        this.loadDataGrid({});
      }
    },
    // events: {
    //   'add.loadDataGrid'() {
    //     this.loadDataGrid({});
    //   }
    // },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470: '';
      }
    },
    components: { OBreadcrumb, addModal ,PageModel}
  };
</script>

<style lang="less" rel="stylesheet/less">

</style>
