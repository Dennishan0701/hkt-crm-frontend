<template>
  <div class="mc">
    <o-breadcrumb second="数据报表" third="推广报名数据明细"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span=24 class="right">
          <i-select :size="$store.state.searchModuleSize" v-model="Search.channelName" clearable placeholder="渠道名称" style="width:150px;">
            <i-option v-for="(item,index) in channeList" :key='index' :value="item.name">{{ item.name }}</i-option>
          </i-select>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.leadsName" @on-keyup.enter="search(1)" placeholder="学生姓名" style="width:90px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.leadsPhone" @on-keyup.enter="search(1)" placeholder="手机号" style="width:100px;margin-right:2px;"></i-input>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.grade" clearable placeholder="年级" style="width:80px;">
            <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.subject" clearable placeholder="科目" style="width:80px;">
            <i-option v-for="(item,index) in subjectList" :key='index' :value="item">{{ item }}</i-option>
          </i-select>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.jh" @on-keyup.enter="search(1)" placeholder="jh" style="width:100px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.dy" @on-keyup.enter="search(1)" placeholder="dy" style="width:100px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.keyNum" @on-keyup.enter="search(1)" placeholder="key_num" style="width:100px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.saleName" @on-keyup.enter="search(1)" placeholder="所属销售" style="width:90px;margin-right:2px;"></i-input>

        </i-col>
        <i-col span=24 class="right">
          <i-select :size="$store.state.searchModuleSize" v-model="Search.isManagerCourse" clearable placeholder="是否排课" style="width:90px;">
            <i-option value="1">是</i-option>
            <i-option value="0">否</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.isPay" clearable placeholder="是否付费" style="width:90px;">
            <i-option value="1">是</i-option>
            <i-option value="0">否</i-option>
          </i-select>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" @on-change="changeSignUpDate" placement="bottom-end" ref="sigup" placeholder="报名时间" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="search" @click="search(1)">搜索</i-button>
          <i-button :size="$store.state.searchModuleSize" type="ghost" @click="clearSearch">重置</i-button>
        </i-col>
      </Row>
    </div>
    <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
      <checkbox label="leadsName">学生姓名</checkbox>
      <checkbox label="leadsPhone">手机号</checkbox>
      <checkbox label="grade">年级</checkbox>
      <checkbox label="subject">科目</checkbox>
      <checkbox label="phoneLocation">电话号码归属地</checkbox>
      <checkbox label="signUpDate">报名时间</checkbox>
      <checkbox label="jh">jh</checkbox>
      <checkbox label="dy">dy</checkbox>
      <checkbox label="keyNum">key_num</checkbox>
      <checkbox label="saleName">所属销售</checkbox>
      <checkbox label="isManagerCourse">是否排课</checkbox>
      <checkbox label="isPay">是否付费</checkbox>
      <checkbox label="payTime">付费时间</checkbox>
    </checkbox-group>
    <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
    <info-remark ref="inforemark" :history-remark-list="historyRemarkList"></info-remark>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {REPORT} from 'common/api/report.js';
  import {common, formateDate, hideCharAtNumber, clearSearchForm} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import infoRemark from './infoRemark';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        tableColumnsChecked:['leadsName','leadsPhone','grade','subject','phoneLocation','signUpDate',
          'jh','dy','keyNum','saleName','isManagerCourse','isPay','payTime','leadPhone'],
        historyRemarkList:[],
        channeList:[],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11: 17,
        Search: {
          channelName: '',
          leadsName: '',
          leadsPhone: '',
          subject: '',
          grade: '',
          signUpStartTime: '',
          signUpEndTime: '',
          jh: '',
          dy: '',
          keyNum: '',
          saleName: '',
          isManagerCourse: '',
          isPay: '',
        },
        subjectList: [],
        gradeList: [],
        columns: []
      }
    },
    mounted() {
      const _this = this;
      this.search();
      this.changeTableColumns();
//      获取推广渠道
      common.ajax({
        url: REPORT().Leads.getGeneralizeChannel,
        method: 'get',
        success: function (res) {
          _this.channeList = res.data || [];
        }
      });
      common.ajax({
        url: COMMON_API().allSubject,
        method: 'get',
        success: function (res) {
          _this.subjectList = res.data || [];
        }
      });
      $.getJSON("static/data.json", function (json) {
        _this.gradeList = json.gradeList;
      });
    },
    methods: {
      getTableColumns () {
        const columns = {
          channelName:{
          title: '渠道名称',
            key: 'channelName',
          align:'center',
          fixed:'left',
          minWidth: 120
        },
          leadsName:{
          title: '学生姓名',
            key: 'leadsName',
          align:'center',
            minWidth: 90
        },
          leadsPhone:{
          title: '手机号',
            key: 'leadsPhone',
          align:'center',
            minWidth: 120,
            render(h, params) {
          return h('span',hideCharAtNumber(params.row.leadsPhone));
        }
        },
          grade:{
          title: '年级',
            key: 'grade',
          align:'center',
            minWidth: 90
        },
          subject:{
          title: '科目',
            key: 'subject',
          align:'center',
            minWidth: 90
        },
          phoneLocation:{
          title: '电话号码归属地',
            key: 'phoneLocation',
          align:'center',
            minWidth: 120
        },
          signUpDate:{
          title: '报名时间',
            key: 'signUpDate',
            minWidth: 150,
            render(h, params) {
          return h('span',formateDate(params.row.signUpDate,'yyyy-MM-dd hh:mm:ss'));
        }
        },
          jh:{
          title: 'jh',
            key: 'jh',
          align:'center',
            minWidth: 90
        },
          dy:{
          title: 'dy',
            key: 'dy',
          align:'center',
            minWidth: 90
        },
          keyNum:{
          title: 'key_num',
            key: 'keyNum',
          align:'center',
            minWidth: 90
        },
          saleName:{
          title: '所属销售',
            key: 'saleName',
          align:'center',
            minWidth: 90
        },
          isManagerCourse:{
          title: '是否排课',
            key: 'isManagerCourse',
          align:'center',
            minWidth: 90
        },
          isPay:{
          title: '是否付费',
            key: 'isPay',
          align:'center',
            minWidth: 90,
        },
          payTime:{
          title: '付费时间',
            key: 'payTime',
          align:'center',
            minWidth: 150,
            render(h, params) {
          return h('span',formateDate(params.row.payTime,'yyyy-MM-dd hh:mm:ss'));
        }
        },
          leadPhone:{
          title: '备注信息',
            key: 'leadPhone',
          align:'center',
            minWidth: 90,
          fixed:'right',
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
//            return `<i-button type="warning" size="small" icon="social-twitch-outline" title="获取历史备注信息" @click="getStudentHistoryInfo('${row.leadsPhone}')"></i-button>`
          }
        },
        };
        let datas = [columns.channelName];
        this.tableColumnsChecked.forEach(col => datas.push(columns[col]));
        return datas;
      },
      search(val) {
          if(val) this.pageIndex = val;
        this.loadDataGrid({
          channelName: this.Search.channelName,
          leadsName: this.Search.leadsName,
          leadsPhone: this.Search.leadsPhone,
          subject: this.Search.subject,
          grade: this.Search.grade,
          signUpStartTime: this.Search.signUpStartTime,
          signUpEndTime: this.Search.signUpEndTime,
          jh: this.Search.jh,
          dy: this.Search.dy,
          keyNum: this.Search.keyNum,
          saleName: this.Search.saleName,
          isPay: this.Search.isPay,
          isManagerCourse: this.Search.isManagerCourse
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
      clearSearch() {
        clearSearchForm(this.Search, this.$refs.sigup);
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?channelName=${search.channelName}&leadsName=${search.leadsName}&leadsPhone=${search.leadsPhone}&subject=${search.subject}&grade=${search.grade}`;
        param += `&signUpStartTime=${search.signUpStartTime}&signUpEndTime=${search.signUpEndTime}&jh=${search.jh}&dy=${search.dy}&keyNum=${search.keyNum}`;
        param += `&saleName=${search.saleName}&isPay=${search.isPay}&isManagerCourse=${search.isManagerCourse}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: REPORT().Leads.getRecommendLeadsMoreKpi + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['leadsVos'] || [];
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
    components: { OBreadcrumb , infoRemark ,PageModel}
  };
</script>

<style>

</style>
