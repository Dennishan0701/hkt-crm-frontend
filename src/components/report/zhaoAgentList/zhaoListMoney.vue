<template>
  <div class="mc" style="margin-bottom: 30px">
    <o-breadcrumb second="数据报表" third="招师代理薪资"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-end" @on-change="dateTime" placeholder="时间" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="search" @click="searchForm(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>

    <h1 style="line-height: 60px;">总代薪资：</h1>
    <i-table size="small" height='400' highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :current="pageIndex" :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
    <Modal
      v-model="addRemarkModal"
      title="分代薪资"
      :mask-closable="true"
      :closable="true"
      :loading = "loading"
      width='800'
      height='400'
      @on-ok="addRemarkOk()" >
      <i-table size="small" highlight-row stripe :columns="columnsList" :data="agentList"></i-table>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {REPORT} from 'common/api/report.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import infoRemark from './infoRemark';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        agentList:[],
        addRemarkModal: false,
        loading: true,
        total: 0,
        pageIndex: 1,
        pageNumber: 5000,
//        pageNumber: SCREEN_SIZE === 'md' ? 11 : 18,
        Search: {
          inventoryDateStart: '',
          inventoryDateEnd: '',
        },
        columns: [
          {
            title: '代理姓名',
            key: 'agentName',
            align:'center',
            minWidth:60
          },
          {
            title: '上级代理名称',
            align:'center',
            key: 'parentName',
            minWidth:60
          },
          {
            title: '报名数量',
            key: 'registCount',
            align:'center',
            minWidth:60
          },
          {
            title: '入库数量',
            key: 'inventoryCount',
            align:'center',
            minWidth:60
          },
          {
            title: '级别',
            key: 'salary',
            align:'center',
            minWidth:60
          },
          {
            title: '薪资',
            align:'center',
            key: 'salary',
            minWidth:60
          },
          {
            title: '薪资统计',
            align:'center',
            key: 'sumSalary',
            minWidth:60
          },
          {
            title: '查看分代理',
            key: 'parentAgent',
            align:'center',
            minWidth:90,
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
                    title:'获取分代理薪资'
                  },
                  on: {
                    click: () => {
                    this.getAgentList(params.row.uuid)
                }
            }
            })
            ])
//              return `<i-button type="warning" size="small" icon="calendar" title="获取分代理薪资" @click="getAgentList('${row.uuid}')"></i-button>`
            }
          },
        ],
        columnsList:[
          {
            title: '代理姓名',
            key: 'agentName',
            align:'center',
            minWidth:60
          },
          {
            title: '上级代理名称',
            align:'center',
            key: 'parentName',
            minWidth:60
          },
          {
            title: '报名数量',
            key: 'registCount',
            align:'center',
            minWidth:60
          },
          {
            title: '入库数量',
            key: 'inventoryCount',
            align:'center',
            minWidth:60
          },
          {
            title: '级别',
            key: 'salary',
            align:'center',
            minWidth:60
          },
          {
            title: '薪资',
            align:'center',
            key: 'salary',
            minWidth:60
          },
          {
            title: '薪资统计',
            align:'center',
            key: 'sumSalary',
            minWidth:60
          },
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
          inventoryDateStart: this.Search.inventoryDateStart,
          inventoryDateEnd: this.Search.inventoryDateEnd,
        });
      },
      loadDataGrid(search) {
        let param = `?inventoryDateStart=${search.inventoryDateStart}&inventoryDateEnd=${search.inventoryDateEnd}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}`;
        const _this = this;
        common.ajax({
          url: REPORT().ZhaoAgent.zhaoListMoney + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['agentKpiList'] || [];
            _this.total = res.data.total;
            _this.agentList = [];
          }
        });
      },
      getAgentList(uuid,agentName){
        const that = this;
        that.agentName = agentName;
        console.log(that.agentName);
        let param = `?parentAgent=${uuid}&inventoryDateStart=${that.Search.inventoryDateStart}&inventoryDateEnd=${that.Search.inventoryDateEnd}`;
        param += `&pageIndex=1&pageNumber=1000`;
        common.ajax({
          url: REPORT().ZhaoAgent.zhaoListMoney + param,
          method: 'get',
          success: function (res) {
            that.agentList = res.data['agentKpiList'] || [];
            that.addRemarkModal = true;
          }
        });
      },
      addRemarkOk() {
        this.addRemarkModal = false;
        this.loading = false;
      },
      show() {
        this.addRemarkModal = true;
      },
      dateTime(value) {
        this.Search.inventoryDateStart = value[0] || '';
        this.Search.inventoryDateEnd = value[1] || '';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      }
    },
    components: {OBreadcrumb , infoRemark,PageModel}
  };
</script>

<style>

</style>
