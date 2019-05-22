<template>
  <div class="mc">
    <o-breadcrumb second="数据报表" third="待催移交学员"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span=24 class="right">
          <i-input :size="$store.state.searchModuleSize" v-model="Search.studentName" @on-keyup.enter="searchForm(1)" placeholder="姓名" style="width:90px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.studentPhone" @on-keyup.enter="searchForm(1)" placeholder="手机号码" style="width:130px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.saleCc" @on-keyup.enter="searchForm(1)" placeholder="签单CC" style="width:90px;margin-right:2px;"></i-input>
        </i-col>
        <i-col span=24 class="right">
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-start" @on-change="changePayDate" ref="payDate" placeholder="付费时间" style="width: 200px"></Date-picker>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-end" @on-change="changePassDate" ref="passDate" placeholder="审核通过时间" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="search" @click="searchForm(1)">搜索</i-button>
          <i-button :size="$store.state.searchModuleSize" type="ghost" @click="clearSearch">重置</i-button>
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
  import {REPORT} from 'common/api/report.js';
  import {common, formateDate, hideCharAtNumber, clearSearchForm} from 'common/js/common.js';
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
          studentName: '',
          studentPhone: '',
          saleCc: '',
          payStartTime: '',
          payEndTime: '',
          checkStartTime: '',
          checkEndTime: ''
        },
        columns: [
          {
            title: '姓名',
            align:'center',
            key: 'studentName',
            minWidth:90,
          },
          {
            title: '手机号',
            key: 'phone',
            align:'center',
            minWidth:120,
            render(h, params) {
              return h('span',hideCharAtNumber(params.row.studentPhone));
            }
          },
          {
            title: '签单CC',
            align:'center',
            key: 'saleCc',
            minWidth:90,
          },
          {
            title: '签单金额',
            align:'center',
            key: 'money',
            minWidth:90,
          },
          {
            title: '付费时间',
            align:'center',
            key: 'payTime',
            minWidth:150,
            render(h, params) {
              return h('span',formateDate(params.row.payTime,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '审核通过时间',
            align:'center',
            key: 'checkTime',
            minWidth:150,
            render(h, params) {
              return h('span',formateDate(params.row.checkTime,'yyyy-MM-dd hh:mm:ss'));
            }
          },
        ]
      }
    },
    mounted() {
      this.searchForm();
    },
    methods: {
      getFullPhone(teacherUuid) {
        const _this = this;
        common.ajax({
          url: REPORT().Course.fullPhone,
          method: 'get',
          data: { uuid: teacherUuid },
          success: function (res) {
            _this.$Modal.info({
              content: (res.data !== null) ? res.data.phone : ''
            });
          }
        })
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          studentName: this.Search.studentName,
          studentPhone: this.Search.studentPhone,
          saleCc: this.Search.saleCc,
          payStartTime: this.Search.payStartTime,
          payEndTime: this.Search.payEndTime,
          checkStartTime: this.Search.checkStartTime,
          checkEndTime: this.Search.checkEndTime
        });
      },
      clearSearch() {
        clearSearchForm(this.Search,[this.$refs.payDate, this.$refs.passDate], this);
        this.searchForm();
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?studentName=${search.studentName}&studentPhone=${search.studentPhone}&saleCc=${search.saleCc}`;
        param += `&payStartTime=${search.payStartTime}&payEndTime=${search.payEndTime}&checkStartTime=${search.checkStartTime}&checkEndTime=${search.checkEndTime}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: REPORT().Student.waitHandOutStudent + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['handOutStudentVos'] || [];
            _this.total = res.data.total;
          }
        });
      },
      changePayDate(value) {
        this.Search.payStartTime = value[0] || '';
        this.Search.payEndTime = value[1] || '';
      },
      changePassDate(value) {
        this.Search.checkStartTime = value[0] || '';
        this.Search.checkEndTime = value[1] || '';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      }
    },
    components: { OBreadcrumb ,PageModel}
  };
</script>

<style>

</style>
