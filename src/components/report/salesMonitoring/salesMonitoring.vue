<template>
  <div class="mc" style="padding-bottom: 30px">
    <o-breadcrumb second="数据报表" third="销售业务监控"></o-breadcrumb>
    <div class="grid-widget">
      <!--<Row>-->
        <!--<i-col span="24">-->
          <!--<Date-picker type="daterange" @on-change="dateTime" size="small" placeholder="时间" style="width: 200px"></Date-picker>-->
          <!--<i-button type="primary" size="small" icon="search" @click="searchForm">查询</i-button>-->
        <!--</i-col>-->
      <!--</Row>-->
    </div>

    <h1 style="line-height: 60px;">选择需要查看的团队</h1>
    <i-table size="small" height='300' highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :current="pageIndex" :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
    <div v-show='isShow'>
    </div>
    <h1 style="line-height: 60px;">选择需要查看的组员</h1>
    <i-table size="small" height='300' stripe :columns="columnsList" :data="agentList"></i-table>
    <div class="gridPage">
      <Page :total="totalList" :page-size="pageNumber" size="small" @on-change="pageChangeList" show-total show-elevator></Page>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {REPORT} from 'common/api/report.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';
  export default{
    data() {
      return {
        data: [],
        agentList:[],
        isShow:false,
        total: 0,
        totalList:0,
        teamUuid:'',
        pageIndex: 1,
        pageIndexList: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11: 17,
        columns: [
          {
            title: '团队名称',
            key: 'teamName',
            align:'center',
            minWidth:90,
          },
          {
            title: '类型',
            align:'center',
            key: 'teamType',
            minWidth:90,
          },
          {
            title: '团队leader',
            key: 'leader',
            align:'center',
            minWidth:90,
          },
          {
            title: 'leader上级',
            key: 'superLeader',
            align:'center',
            minWidth:90,
          },
          {
            title: '在职组员数量',
            key: 'teamUserNum',
            align:'center',
            minWidth:90,
          },
          {
            title: '操作',
            key: 'parentAgent',
            align:'center',
            minWidth:120,
            render : (h, params) => {
            return h('div',[
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small',
                  icon: 'calendar',
                },
                style: {
                  margin: '2px',
                },
                attrs:{
                  title:'查看详情'
                },
                on: {
                  click: () => {
                  this.getAgentList(params.row.teamUuid)
              }
          }
      },'查看详情')
    ])
//              return `<i-button type="warning" size="small" icon="calendar" title="查看详情" @click="getAgentList('${row.teamUuid}')">查看详情</i-button>`
            }
          },
        ],
        columnsList:[
          {
            title: '姓名',
            key: 'userName',
            align:'center',
            minWidth:90,
          },
          {
            title: '跟进中leads/学员数量',
            align:'center',
            key: 'managerLeadsNum',
            minWidth:90,
          },
          {
            title: '操作',
            align:'center',
            key: 'sumSalary',
            minWidth:120,
            render : (h, params) => {
            return h('div',[
              h('a',{
                on:{
                  click:()=>{
                  GLOBAL.viewLeadsDetailList(params.row.userUuid,params.row.userName,params.row.teamUuid,params.row.teamName)
              }
          }
    },'查看详情')
    ])
//              return `<strong><a href="javascript:GLOBAL.viewLeadsDetailList('${row.userUuid}','${row.userName}','${row.teamUuid}','${row.teamName}');">查看详情</a></strong>`;
            }
          },
        ]
      }
    },
    mounted() {
      this.searchForm();
    },
    methods: {
      searchForm() {
        this.loadDataGrid();
      },
      loadDataGrid() {
        const _this = this;
        let param = `?pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}`;
        common.ajax({
          url: REPORT().Sale.getManagerTeam + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['teams'] || [];
            _this.total = res.data.total;
            _this.agentList = [] || [];
          }
        });
      },
      getAgentList(uuid){
        const that = this;
        that.teamUuid = uuid;
        let param = `?teamUuid=${that.teamUuid}&pageIndex=${this.pageIndexList}&pageNumber=${this.pageNumber}`;
        common.ajax({
          url: REPORT().Sale.getTeamUser + param,
          method: 'get',
          success: function (res) {
            that.agentList = res.data['teamUserVos'] || [];
            that.totalList = res.data.total;
            that.isShow = true
          }
        });
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      pageChangeList(pageIndex) {
        this.pageIndexList = pageIndex;
        this.getAgentList(this.teamUuid);
      }
    },
    components: {OBreadcrumb,PageModel,PageModel}
  };
</script>

<style>

</style>
