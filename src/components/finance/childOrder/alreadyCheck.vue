<template>
  <div>
    <o-breadcrumb second="财务" third="已审核子单"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <i-input v-model="Search.leadsName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="学生" style="width:150px;margin-right: 2px;r"></i-input>
          <i-input v-model="Search.leadsPhone" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="手机号" style="width:150px;margin-right:2px;"></i-input>
          <i-input v-model="Search.submitter" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="提交人" style="width:150px;margin-right:2px;"></i-input>
          <i-select v-model="Search.checkStatus" :size="$store.state.searchModuleSize" placeholder="状态" style="width:80px">
            <i-option value="0">请选择</i-option>
            <i-option value="1">已审核</i-option>
            <i-option value="2">已拒绝</i-option>
          </i-select>
        </i-col>
        <i-col span=24 class="right">
          <Date-picker type="daterange" :size="$store.state.searchModuleSize" placement="bottom-end" @on-change="changeCheckTime" placeholder="审核时间" style="width: 200px"></Date-picker>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索</i-button>
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
  import {FINANCE} from 'common/api/finance.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: 15,
        payUuid: '',
        Search: {
          leadsName: '',
          leadsPhone: '',
          submitter: '',
          checkStatus: '0',
          startCheckTime: '',
          endCheckTime: ''
        },
        columns: [
          {
            title: '子订单号',
            key: 'orderNo',
            align:'center',
            width: 180
          },
          {
            title: '学生',
            key: 'leadsName',
            align:'center',
            width: 90,
            render : (h, params) => {
            return h('div',[
              h('a',{
                on:{
                  click:()=>{
                  GLOBAL.redirectTo('/scs/leadsDetailByCc',params.row.leadsUuid)
              }
          }
      },params.row.leadsName)
    ])
//              return `<strong><a href="javascript:redirectTo('/leads/leadsDetail','${row.leadsUuid}');">${row.leadsName}</a></strong>`;
            }
          },
          {
            title: '手机号',
            key: 'leadsPhone',
            align:'center',
            width: 120,
            render(h, params) {
              return h('span',hideCharAtNumber(params.row.leadsPhone));
            }
          },
          {
            title: '年级',
            key: 'grade',
            align:'center',
            width: 60,
          },
          {
            title: '金额',
            key: 'money',
            align:'center',
            width: 60
          },
          {
            title: '提交人',
            key: 'userName',
            align:'center',
            width: 90
          },
          {
            title: '提交时间',
            key: 'submitTime',
            align:'center',
            width: 160,
            render(h, params) {
              return h('span',formateDate(params.row.submitTime,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '状态',
            key: 'checkStatus',
            align:'center',
            width: 90,
            render : (h, params) => {
              if(params.row.checkStatus === 1) {
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag green'
                    }
                  },'已审核')
                ])
//                return `<span class="o-tag green">已审核</span>`;
              }else if(params.row.checkStatus === 2) {
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag red'
                    }
                  },'已拒绝')
                ])
//                return `<span class="o-tag red">已拒绝</span>`;
              }else{
                return params.row.checkStatus;
              }
            }
          },
          {
            title: '审核时间',
            key: 'checkTime',
            align:'center',
            width: 160,
            render(h, params) {
              return h('span',formateDate(params.row.checkTime,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '审核人',
            width: 90,
            align:'center',
            key: 'gaUserName'
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
          leadsName: this.Search.leadsName,
          leadsPhone: this.Search.leadsPhone,
          submitter: this.Search.submitter,
          checkStatus: this.Search.checkStatus,
          startCheckTime: this.Search.startCheckTime,
          endCheckTime: this.Search.endCheckTime,
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?leadsName=${search.leadsName}&leadsPhone=${search.leadsPhone}&submitter=${search.submitter}&checkStatus=${search.checkStatus}&startCheckTime=${search.startCheckTime}&endCheckTime=${search.endCheckTime}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        // common.ajax({
        //   url: FINANCE().ChildOrder.AreadyCheck.dataGrid + param,
        //   method: 'get',
        //   success: function (res) {
        //     _this.data = res.data['checkChildOrderVos'] || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get( FINANCE().ChildOrder.AreadyCheck.dataGrid + param,{
        }).then( ({data}) => {
          _this.data = data.data['checkChildOrderVos'] || [];
          _this.total = data.data.total;
        })
      },
      changeCheckTime(value) {
        this.Search.startCheckTime = value[0] || '';
        this.Search.endCheckTime = value[1] || '';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      }
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470: '';
      }
    },
    components: {
      OBreadcrumb,PageModel
    }
  };
</script>

<style>

</style>
