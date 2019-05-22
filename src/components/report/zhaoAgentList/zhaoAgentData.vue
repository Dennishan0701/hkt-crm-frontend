<template>
  <div class="mc">
    <o-breadcrumb second="数据报表" third="招生代理报名数据"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">

          <i-select :size="$store.state.searchModuleSize" v-model="Search.channelAdid" clearable placeholder="渠道" style="width:150px">
            <i-option v-for='(item,index) in leadsAgentList' :key='index' :value=item.channelAdid>{{item.channelName}}</i-option>
          </i-select>
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
    <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
      <checkbox label="leadsName">学生姓名</checkbox>
      <checkbox label="leadsPhone">手机号</checkbox>
      <checkbox label="grade">年级</checkbox>
      <checkbox label="subject">科目</checkbox>
      <checkbox label="phoneLocation">号码归属地</checkbox>
      <checkbox label="signUpDate">报名时间</checkbox>
      <checkbox label="saleName">所属销售</checkbox>
      <checkbox label="chargeTime">负责时间</checkbox>
      <checkbox label="isManagerCourse">是否排课</checkbox>
      <checkbox label="firstTestCourseStartTime">首次测评课时间</checkbox>
      <checkbox label="isPay">是否付费</checkbox>
      <checkbox label="payTime">付费时间</checkbox>
      <checkbox label="buyLength">购买课时</checkbox>
      <checkbox label="money">付费金额</checkbox>
      <!--<checkbox label="mobileNoTrack">备注信息</checkbox>-->
    </checkbox-group>
    <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
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
        tableColumnsChecked:['leadsName','leadsPhone','grade','subject','phoneLocation','signUpDate','saleName','chargeTime','isManagerCourse','firstTestCourseStartTime','isPay','payTime','buyLength','money','mobileNoTrack'],
        historyRemarkList:[],
        leadsAgentList:[],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11: 17,
        Search: {
          leadsName: '',
          leadsPhone: '',
          channelAdid: '',
          isManagerCourse: '',
          isPay:'',
          payStartDate: '',
          payEndDate: '',
          signUpStartDate: '',
          signUpEndDate: '',
        },
        columns: [],
      }
    },
    mounted() {
      const _this = this;
      this.searchForm();
      this.changeTableColumns();

//      获取招生所有渠道
      common.ajax({
        url: REPORT().ZhaoAgent.getLeadsAgentChannel,
        method: 'get',
        success: function (res) {
          _this.leadsAgentList = res.data;
        }
      });
    },
    methods: {
      getTableColumns () {
        const columns = {
          channelName:{
          title: '渠道名称',
            key: 'channelName',
          align:'center',
          minWidth:90,
          fixed:'left'
        },
          leadsName:{
          title: '学生姓名',
            key: 'leadsName',
          align:'center',
            minWidth:90,
        },
          leadsPhone:{
          title: '手机号',
            key: 'leadsPhone',
          align:'center',
            minWidth:120,
            render(h, params) {
          return h('span',hideCharAtNumber(params.row.leadsPhone));
        }
        },
          grade:{
          title: '年级',
            align:'center',
          key: 'grade',
            minWidth:90,
        },
          subject:{
          title: '科目',
            key: 'subject',
          align:'center',
            minWidth:90,
        },
          phoneLocation:{
          title: '电话号码归属地',
            key: 'phoneLocation',
          align:'center',
            minWidth:120,
        },
          signUpDate:{
          title: '报名时间',
            align:'center',
          key: 'signUpDate',
            minWidth:180,
            render(h, params) {
          return h('span',formateDate(params.row.signUpDate,'yyyy-MM-dd hh:mm:ss'));
        }
        },
          saleName:{
          title: '所属销售',
            key: 'saleName',
          align:'center',
            minWidth:90,
        },
          chargeTime:{
          title: '负责时间',
            key: 'chargeTime',
          align:'center',
            minWidth:180,
            render(h, params) {
          return h('span',formateDate(params.row.chargeTime,'yyyy-MM-dd hh:mm:ss'));
        }
        },
          isManagerCourse:{
          title: '是否排课',
            key: 'isManagerCourse',
          align:'center',
            minWidth:90,
        },
          firstTestCourseStartTime:{
          title: '首次测评课时间',
            key: 'firstTestCourseStartTime',
          align:'center',
            minWidth:180,
            render(h, params) {
          return h('span', formateDate(params.row.firstTestCourseStartTime,'yyyy-MM-dd hh:mm:ss'));
        }
        },
          isPay:{
          title: '是否付费',
            key: 'isPay',
          align:'center',
            minWidth:90,
        },
          payTime:{
          title: '付费时间',
            key: 'payTime',
          align:'center',
            minWidth:180,
            render(h, params) {
          return h('span',formateDate(params.row.payTime,'yyyy-MM-dd hh:mm:ss'));
        }
        },
          buyLength:{
          title: '购买课时',
            key: 'buyLength',
          align:'center',
            minWidth:90,
        },
          money:{
          title: '付费金额',
            key: 'money',
          align:'center',
            minWidth:90,
        },
        mobileNoTrack:{
          title: '备注信息',
            key: 'mobileNoTrack',
          minWidth:90,
          fixed:'right',
          align:'center',
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
//          return `<i-button type="warning" size="small" icon="social-twitch-outline" title="获取历史备注信息" @click="getStudentHistoryInfo('${row.leadsPhone}')"></i-button>`
        }
        },
        };
        let datas = [columns.channelName];
        this.tableColumnsChecked.forEach(col => datas.push(columns[col]));
        return datas;
      },

      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          leadsName: this.Search.leadsName,
          leadsPhone: this.Search.leadsPhone,
          channelAdid: this.Search.channelAdid,
          isManagerCourse: this.Search.isManagerCourse,
          isPay: this.Search.isPay,
          payStartDate: this.Search.payStartDate,
          payEndDate: this.Search.payEndDate,
          signUpStartDate: this.Search.signUpStartDate,
          signUpEndDate: this.Search.signUpEndDate,
        });
      },
      loadDataGrid(search) {
        let param = `?&leadsName=${search.leadsName}&leadsPhone=${search.leadsPhone}&channelAdid=${search.channelAdid}&isManagerCourse=${search.isManagerCourse}&isPay=${search.isPay}&payStartDate=${search.payStartDate}&payEndDate=${search.payEndDate}&signUpStartDate=${search.signUpStartDate}&signUpEndDate=${search.signUpEndDate}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}`;
        const _this = this;
        common.ajax({
          url: REPORT().ZhaoAgent.zhaoAgentData + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['agentDetailVos'] || [];
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
            that.$refs.inforemark.show();

          }
        });
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
      },
      changeTableColumns () {
        this.columns = this.getTableColumns();
      }
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470: '';
      }
    },
    components: {OBreadcrumb , infoRemark,PageModel}
  };
</script>

<style>

</style>
