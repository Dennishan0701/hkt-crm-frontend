<template>
  <div class="mc">
    <o-breadcrumb second="数据报表" third="已安排培训列表"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <i-input :size="$store.state.searchModuleSize" v-model="Search.tcName" @on-keyup.enter="searchForm(1)" placeholder="姓名" style="width:150px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.phone" @on-keyup.enter="searchForm(1)" placeholder="手机号" style="width:150px;margin-right: 2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.trainingAccount" @on-keyup.enter="searchForm(1)" placeholder="培训账号号码" style="width:150px;margin-right: 2px;"></i-input>
        </i-col>
        <i-col span="24" class="right">
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-start" @on-change="changeTrainingDate" placeholder="培训日期" style="width: 200px"></Date-picker>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-end" @on-change="changeUpdateDate" placeholder="更新时间" style="width: 200px"></Date-picker>
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
  import {COMMON_API} from 'common/api.config.js';
  import {REPORT} from 'common/api/report.js';
  import {TEACHER} from 'common/api/teacher.js';
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
          tcName: '',
          phone: '',
          trainingAccount: '',
          trainingDateStart: '',
          trainingDateEnd: '',
          updateDateStart: '',
          updateDateEnd: '',
        },
        channelList: [],
        columns: [
          {
            title: '姓名',
            key: 'tcName',
            align:'center',
            minWidth:90,
            render : (h, params) => {
            return h('div',[
              h('a',{
                on:{
                  click:()=>{
                  GLOBAL.redirectTo('/teacher/viewTeacherDetailByJianzhi',params.row.uuid)
              }
          }
      },params.row.tcName)
    ])
//              return `<strong><a href="javascript:GLOBAL.redirectTo('/teacher/teacherDetail/view/jianzhi','${row.uuid}');">${row.tcName}</a></strong>`;
            }
          },
          {
            title: '手机号',
            key: 'phone',
            align:'center',
            minWidth:120,
            render : (h, params) => {
            return h('div',[
              h('span',hideCharAtNumber(params.row.phone)),
              h('i',{
                style:{
                  margin:'2px'
                },
                attrs:{
                  class:'ivu-icon ivu-icon-ios-eye',
                  title:'显示全部'
                },
                style:{
                  fontSize:'18px',
                  verticalAlign:'top',
                  cursor:'pointer'
                },
                on:{
                  click:()=>{
                  this.getFullPhone(params.row.uuid)
              }
          }
          })
          ])
//              return hideCharAtNumber(row.phone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.uuid}')" class="eye" title="显示全部"></Icon>`;
            }
          },
          {
            title: '培训账号',
            align:'center',
            key: 'account',
            minWidth:90,
          },
          {
            title: '培训时间',
            key: 'trainingDate',
            align:'center',
            minWidth:150,
            render(h, params) {
              return h('span',formateDate(params.row.trainingDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '面试通过时间',
            key: 'interviewPassDate',
            align:'center',
            minWidth:150,
            render(h, params) {
              return h('span',formateDate(params.row.interviewPassDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '更新时间',
            key: 'updateDate',
            align:'center',
            minWidth:150,
            render(h, params) {
              return h('span',formateDate(params.row.updateDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '状态',
            align:'center',
            key: 'status',
            minWidth:90,
          }
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
          url: TEACHER().Public.displayPhone,
          method: 'get',
          data: { uuid: teacherUuid, moduleName: '数据报表-已经安排培训列表' },
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
          tcName: this.Search.tcName,
          phone: this.Search.phone,
          trainingAccount: this.Search.trainingAccount,
          trainingDateStart: this.Search.trainingDateStart,
          trainingDateEnd: this.Search.trainingDateEnd,
          updateDateStart: this.Search.updateDateStart,
          updateDateEnd: this.Search.updateDateEnd
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?tcName=${search.tcName}&phone=${search.phone}&trainingAccount=${search.trainingAccount}`;
        param += `&trainingDateStart=${search.trainingDateStart}&trainingDateEnd=${search.trainingDateEnd}&updateDateStart=${search.updateDateStart}&updateDateEnd=${search.updateDateEnd}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: REPORT().PlannedTrain.dataGrid + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['teacherList'] || [];
            _this.total = res.data.total;
          }
        });
      },
      changeTrainingDate(value) {
        this.Search.trainingDateStart = value[0] || '';
        this.Search.trainingDateEnd = value[1] || '';
      },
      changeUpdateDate(value) {
        this.Search.updateDateStart = value[0] || '';
        this.Search.updateDateEnd = value[1] || '';
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
