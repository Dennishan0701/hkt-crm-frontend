<template>
  <div class="mc">
    <o-breadcrumb second="数据报表" third="CR推荐leads报表"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span=24 class="right">
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" @on-change="changeSignUpDate" placement="bottom-end" ref="sigup" placeholder="报名时间" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="search" @click="search(1)">搜索</i-button>
          <i-button :size="$store.state.searchModuleSize" type="ghost" size="small" @click="clearSearch">重置</i-button>
        </i-col>
      </Row>
    </div>
    <i-table :row-class-name="rowClassName" size="small" border  stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page  :page-size="pageNumber" size="small" show-total show-elevator></Page>-->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {REPORT} from 'common/api/report.js';
  import {common, formateDate, hideCharAtNumber, clearSearchForm} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
//        total: 0,
//        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        Search: {
          signUpStartTime: '',
          signUpEndTime: '',
        },
        columns: [
          {
            title: '--',
            key: 'userName',
            align:'center',
            width: 90
          },
          {
            title: '推荐人数',
            key: 'recommendLeadsCount',
            align:'center',
            width: 90
          },
          {
            title: '推荐付款数',
            key: 'recommendLeadsPayCount',
            align:'center',
            width: 90,
          },
          {
            title: '推荐排课数',
            key: 'recommendLeadsCourseCount',
            align:'center',
            width: 90
          },
          {
            title: '名单内排课数',
            key: 'recommendLeadsListCourseCount',
            align:'center',
            width: 90
          },
          {
            title: '名单内付款数',
            key: 'recommendLeadsListPayCount',
            align:'center',
            width: 90
          },
        ]
      }
    },
    mounted() {
      this.search();
    },
    methods: {
      rowClassName (row, index) {
        if (index === 0) {
          return 'demo-table-info-row';
        }
        return '';
      },
      search(val) {
          if(val) this.pageIndex = val;
        this.loadDataGrid({
          signUpStartTime: this.Search.signUpStartTime,
          signUpEndTime: this.Search.signUpEndTime,
        });
      },
      clearSearch() {
        clearSearchForm(this.Search, this.$refs.sigup);
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?recommendStartTime=${search.signUpStartTime}&recommendEndTime=${search.signUpEndTime}`;
        param += `&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: REPORT().Leads.getCrRecommendLeadsKpi + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data || [];
          }
        });
      },
      changeSignUpDate(value) {
        this.Search.signUpStartTime = value[0] || '';
        this.Search.signUpEndTime = value[1] || '';
      },
//      pageChange(pageIndex) {
//        this.pageIndex = pageIndex;
//        this.search();
//      }
    },
    components: { OBreadcrumb ,PageModel}
  };
</script>

<style>
  .ivu-table .demo-table-info-row td{
    background-color: #187 !important;
    color: #fff;
  }
</style>
