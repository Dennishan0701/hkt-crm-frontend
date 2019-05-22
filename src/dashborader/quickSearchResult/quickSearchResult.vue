<template>
  <div>
    <o-breadcrumb second="搜索" third="快速搜索学生"></o-breadcrumb>
    <i-table size="small" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :current="pageIndex" :total="total" :page-size="10" size="small" show-total @on-change="pageChange"></Page>-->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {common} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';
  const $sessionStorage = $.localStorage;
  export default{
    data() {
      return {
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: 15,
        columns: [
          {
            title: '身份',
            key: 'identity'
          },
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '手机号',
            key: 'phone'
          },
          {
            title: '所属销售',
            key: 'ccName'
          },
          {
            title: '销售手机号',
            key: 'ccPhone'
          }
        ]
      }
    },
    mounted() {
      this.loadDataGrid(this.$route.params.name);
    },
    methods: {
      loadDataGrid(param,orderBy = '', sortBy = '') {
        let parameter = `?param=${param}&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}&type=1`;
        const _this = this;
        common.ajax({
          url: COMMON_API().getAllStudent + parameter,
          method: 'get',
          success: function (res) {
            _this.data = res.data['checkInfos'];
            _this.total = res.data.total;
          }
        });
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.loadDataGrid(this.$route.params.name);
      }
    },
    components: { OBreadcrumb,PageModel }
  };
</script>

<style lang="less" rel="stylesheet/less">

</style>
