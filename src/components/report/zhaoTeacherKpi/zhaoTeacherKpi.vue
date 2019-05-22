<template>
  <div class="mc">
    <o-breadcrumb second="数据报表" third="招师部KPI"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-end" @on-change="changeUpdateDate" placeholder="工作日期" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API,TEACHER} from 'common/api.config.js';
  import {REPORT} from 'common/api/report.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11: 17,
        Search: {
          createDateStart: '',
          createDateEnd: '',
        },
        columns: [
          {
            title: '招师专员',
            key: 'name',
            align:'center',
            minWidth:90,
          },
          {
            title: '邀约总人数',
            key: 'invitationSum',
            align:'center',
            minWidth:90,
          },
          {
            title: '邀约成功总数',
            key: 'invitationSuccessSum',
            align:'center',
            minWidth:90,
          },
          {
            title: '邀约成功率',
            align:'center',
            key: 'successRate',
            minWidth:90,
            render(h, params) {
              return h('span',params.row.successRate+'%')
            }
          },
          {
            title: '入职数',
            key: 'inductionSum',
            align:'center',
            minWidth:90,
          },

          {
            title: '代理数',
            key: 'agentSum',
            align:'center',
            minWidth:90,
          },
          {
            title: '累计报名数',
            align:'center',
            key: 'registionSum',
            minWidth:90,
          },
          {
            title: '累计入职数',
            key: 'lecturerLibrarySum',
            align:'center',
            minWidth:90,
          }
        ]
      }
    },
    mounted() {
      this.searchForm();
    },
    methods: {
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          createDateStart: this.Search.createDateStart,
          createDateEnd: this.Search.createDateEnd,
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?createDateStart=${search.createDateStart}&createDateEnd=${search.createDateEnd}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: REPORT().zhaoTeacher.dataGrid + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['recruitTeacherKpiList'] || [];
            _this.total = res.data.total;
          }
        });
      },
      changeUpdateDate(value) {
        this.Search.createDateStart = value[0] || '';
        this.Search.createDateEnd = value[1] || '';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      }
    },
    components: { OBreadcrumb,PageModel }
  };
</script>

<style>

</style>
