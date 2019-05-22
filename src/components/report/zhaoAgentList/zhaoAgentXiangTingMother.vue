<template>
<div>
  <div class="mc">
    <o-breadcrumb second="数据报表" third="招生代理-湘婷妈妈"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">


          <i-input :size="$store.state.searchModuleSize" v-model="Search.leadsName" @on-keyup.enter="searchForm(1)" placeholder="学生姓名" style="width:90px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.leadsPhone" @on-keyup.enter="searchForm(1)" placeholder="手机号" style="width:120px;margin-right:2px;"></i-input>


          <i-select :size="$store.state.searchModuleSize" v-model="Search.isPay" clearable placeholder="是否支付" style="width:90px">
            <i-option value="0">未支付</i-option>
            <i-option value="1">已支付</i-option>
          </i-select>

          <i-select :size="$store.state.searchModuleSize" v-model="Search.isManagerCourse" clearable placeholder="是否排课" style="width:90px">
            <i-option value="0">未排课</i-option>
            <i-option value="1">已排课</i-option>
          </i-select>
        </i-col>
        <i-col span="24" class="right">

          <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-start" @on-change="payDate" placeholder="付费时间" style="width: 200px"></Date-picker>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-end" @on-change="signUpStartDate" placeholder="报名时间" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="search" @click="searchForm(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
  </div>
  <info-remark ref='inforemark' :history-remark-list="historyRemarkList"></info-remark>
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
        historyRemarkList:[],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11: 17,
        Search: {
          channelType:'4',
          leadsName: '',
          leadsPhone: '',
          isManagerCourse: '',
          isPay:'',
          payStartDate: '',
          payEndDate: '',
          signUpStartDate: '',
          signUpEndDate: '',
        },
        columns: [
          {
            title: '学生姓名',
            key: 'leadsName',
            align:'center',
            minWidth:90,
          },
          {
            title: '手机号',
            key: 'leadsPhone',
            align:'center',
            minWidth:120,
            render (h,params) {
              return h('span', hideCharAtNumber(params.row.leadsPhone));
            }
          },
          {
            title: '年级',
            align:'center',
            key: 'grade',
            minWidth:90,
          },
          {
            title: '科目',
            key: 'subject',
            align:'center',
            minWidth:90,
          },
          {
            title: '电话号码归属地',
            key: 'phoneLocation',
            align:'center',
            minWidth:90,
          },
          {
            title: '报名时间',
            align:'center',
            key: 'signUpDate',
            minWidth:140,
            render(h, params) {
              return h('span',formateDate(params.row.signUpDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '是否排课',
            key: 'isManagerCourse',
            align:'center',
            minWidth:90,
          },
          {
            title: '是否付费',
            key: 'isPay',
            align:'center',
            minWidth:90,
          },
          {
            title: '付费金额',
            key: 'payMoney',
            align:'center',
            minWidth:90,
          },
          {
            title: '付费时间',
            key: 'payTime',
            align:'center',
            minWidth:140,
            render(h, params) {
              return h('span',formateDate(params.row.payTime,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '备注信息',
            key: 'mobileNoTrack',
            align:'center',
            minWidth:90,
            render : (h, params) => {
            return h('div',[
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small',
                  icon: 'social-twitch-outline',
                },
                style: {
                  margin: '2px',
                },
                attrs:{
                  title:'获取历史备注信息'
                },
                on: {
                  click: () => {
                  this.getStudentHistoryInfo(params.row.leadsPhone)
              }
          }
      })
    ])
//              return `<i-button type="warning" size="small" icon="social-twitch-outline" title="获取历史备注信息" @click="getStudentHistoryInfo('${row.leadsPhone}')"></i-button>`
            }
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
          isManagerCourse: this.Search.isManagerCourse,
          isPay: this.Search.isPay,
          payStartDate: this.Search.payStartDate,
          payEndDate: this.Search.payEndDate,
          signUpStartDate: this.Search.signUpStartDate,
          signUpEndDate: this.Search.signUpEndDate,
          channelType:this.Search.channelType
        });
      },
      loadDataGrid(search) {
        let param = `?channelType=${search.channelType}&leadsName=${search.leadsName}&leadsPhone=${search.leadsPhone}&isManagerCourse=${search.isManagerCourse}&isPay=${search.isPay}&payStartDate=${search.payStartDate}&payEndDate=${search.payEndDate}&signUpStartDate=${search.signUpStartDate}&signUpEndDate=${search.signUpEndDate}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}`;
        const _this = this;
        common.ajax({
          url: REPORT().ZhaoAgent.zhaoAgentList + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['agentVos'] || [];
            _this.total = res.data.total;
          }
        });
      },
      getStudentHistoryInfo(leadsPhone){
        const that = this;
        common.ajax({
          url: REPORT().Leads.getStudentHistoryInfo + `?leadsPhone=${leadsPhone}`,
          method: 'get',
          success: function (res) {

            that.historyRemarkList = res.data || [];
          }
        });
        this.$refs.inforemark.show();
      },
      payDate(value) {
        this.Search.payStartDate = value[0] || '';
        this.Search.payEndDate = value[1] || '';
      },
      signUpStartDate(value) {
        this.Search.signUpStartDate = value[0] || '';
        this.Search.signUpEndDate = value[1] || '';
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
