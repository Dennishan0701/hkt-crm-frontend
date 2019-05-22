<template>
  <div class="mc">
    <o-breadcrumb second="数据报表" third="leads接通情况记录"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span=24 class="right">
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-end" placeholder="报名时间" style="width: 200px"></Date-picker>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-end" placeholder="分配时间" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" @click="search(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <!--<checkbox-group v-model="tableColumnsChecked">-->
      <!--<checkbox label="leadsPhone">手机号</checkbox>-->
      <!--<checkbox label="signUpDate">报名时间</checkbox>-->
      <!--<checkbox label="distributionDate">分配时间</checkbox>-->
      <!--<checkbox label="crName">当前所属销售</checkbox>-->
      <!--<checkbox label="team">团队</checkbox>-->
      <!--<checkbox label="firstThroughTime">首次拨打时间</checkbox>-->
      <!--<checkbox label="isThrough">24小时内是否拨通</checkbox>-->
      <!--<checkbox label="isAnswer">是否接通</checkbox>-->
      <!--<checkbox label="bridgeDuration">通话时长</checkbox>-->
    <!--</checkbox-group>-->
    <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :current="pageIndex" :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
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
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11: 17,
//        tableColumnsChecked:[],
        Search: {
          name: '',
          subject: '',
          createDateStart:'',
          createDateEnd:''
        },
        subjectList: [],
        gradeList: [],
        columns: [
          {
            title: '序号',
            align:'center',
            type:'index',
            fixed:'left',
            minWidth:60,
          },
          {
            title: '学生姓名',
            key: 'leadsName',
            align:'center',
            fixed:'left',
            minWidth: 90
          },
          {
            title: '手机号',
            key: 'leadsPhone',
            align:'center',
            minWidth: 120,
            render(h, params) {
              return h('span',hideCharAtNumber(params.row.leadsPhone));
            }
          },
          {
            title: '报名时间',
            key: 'signUpDate',
            align:'center',
            minWidth: 180,
            render(h, params) {
              return h('span',formateDate(params.row.signUpDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '分配时间',
            key: 'distributionDate',
            align:'center',
            minWidth: 90,
            render(h, params) {
              return h('span',formateDate(params.row.distributionDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '当前所属销售',
            key: 'crName',
            align:'center',
            minWidth: 110,
            render(h, params) {
              return h('span',params.row.crName ? params.row.crName : params.row.ccName);
            }
          },
          {
            title: '团队',
            key: 'team',
            align:'center',
            minWidth: 90
          },
          {
            title: '首次拨打时间',
            key: 'firstThroughTime',
            align:'center',
            minWidth: 120
          },
          {
            title: '24小时内是否拨通',
            key: 'isThrough',
            align:'center',
            minWidth: 90
          },
          {
            title: '是否接通',
            key: 'isAnswer',
            align:'center',
            minWidth: 90
          },
          {
            title: '通话时长',
            key: 'bridgeDuration',
            align:'center',
            width:120
          },
          {
            title: '操作',
            align:'center',
            minWidth: 180,
            fixed:'right',
            render : (h, params) => {

            return h('div',[
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                },
                style: {
                  margin: '2px',
                },
                attrs:{
                  title:'查看外呼日志'
                },
                on: {
                  click: () => {
                  this.getOutBound(params.row.leadsUuid)
              }
          }
      },'查看外呼日志')
    ])
//              return `<i-button type="success" size="small" title="查看外呼日志" @click="getOutBound('${row.leadsUuid}')">查看外呼日志</i-button>`
            }
          }
        ]
      }
    },
    mounted() {
      const _this = this;
      this.search();
      common.ajax({
        url: COMMON_API().allSubject,
        method: 'get',
        success: function (res) {
          _this.subjectList = res.data;
        }
      });
      $.getJSON("static/data.json", function (json) {
        _this.gradeList = json.gradeList;
      });
    },
    methods: {
      search(val) {
          if(val) this.pageIndex = val;
        this.loadDataGrid({
          name: this.Search.name,
          subject: this.Search.subject,
          createDateStart: this.Search.createDateStart,
          createDateEnd: this.Search.createDateEnd,
        });
      },
      clearSearch() {
        clearSearchForm(this.Search, this.$refs.sigup);
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        const _this = this;
        common.ajax({
          url: REPORT().Leads.queryLeadsScorePage,
          data:{
            leadsParams:search.name,
            subject:search.subject,
            createDateStart:search.createDateStart,
            createDateEnd:search.createDateEnd,
            pageIndex:_this.pageIndex,
            pageNumber:_this.pageNumber,
          },
          method: 'get',
          success: function (res) {
            _this.data = res.data['leadsScoreList'] || [];
            _this.total = res.data['total'];
          }
        });
      },
      changeSignUpDate(value) {
        this.Search.signUpStartTime = value[0] || '';
        this.Search.signUpEndTime = value[1] || '';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.search();
      }
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470: '';
      }
    },
    components: { OBreadcrumb ,PageModel}
  };
</script>

<style>

</style>
