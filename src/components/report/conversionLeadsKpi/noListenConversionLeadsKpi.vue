<template>
  <div class="mc">
    <o-breadcrumb second="数据报表" third="未试听转化明细"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span=24 class="right">
          <i-input :size="$store.state.searchModuleSize" v-model="Search.leadsName" @on-keyup.enter="search(1)"
                   placeholder="leads姓名" style="width:100px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.leadsPhone" @on-keyup.enter="search(1)"
                   placeholder="leads电话号码" style="width:100px;margin-right:2px;"></i-input>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.grade" clearable placeholder="年级"
                    style="width:100px;">
            <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.ccName" @on-keyup.enter="search(1)"
                   placeholder="跟进cc姓名" style="width:100px;margin-right:2px;"></i-input>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.ccTeam" clearable placeholder="跟进cc团队"
                    style="width:100px;">
            <i-option v-for="(item,index) in ccTeamList" :key='index' :value="item.name">{{ item.name }}</i-option>
          </i-select>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.crName" @on-keyup.enter="search(1)"
                   placeholder="跟进cr姓名" style="width:100px;margin-right:2px;"></i-input>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.crTeam" clearable placeholder="跟进cr团队"
                    style="width:100px;">
            <i-option v-for="(item,index) in crTeamList" :key='index' :value="item.name">{{ item.name }}</i-option>
          </i-select>
          <!--<i-select :size="$store.state.searchModuleSize" v-model="Search.subject" clearable placeholder="科目" style="width:80px;">-->
          <!--<i-option v-for="(item,index) in subjectList" :key='index' :value="item">{{ item }}</i-option>-->
          <!--</i-select>-->
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" @on-change="changeSignUpDate"
                       placement="bottom-end" ref="sigup" placeholder="报名时间" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="search" @click="search(1)">搜索</i-button>
          <i-button :size="$store.state.searchModuleSize" type="ghost" @click="clearSearch">重置</i-button>
        </i-col>
      </Row>
    </div>
    <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
      <checkbox label="leadsName">学生姓名</checkbox>
      <checkbox label="leadsPhone">学生电话</checkbox>
      <checkbox label="subject">科目</checkbox>
      <checkbox label="grade">年级</checkbox>
      <checkbox label="ccName">cc姓名</checkbox>
      <checkbox label="ccTeam">cc团队</checkbox>
      <checkbox label="crName">cr姓名</checkbox>
      <checkbox label="crTeam">cr团队</checkbox>
      <checkbox label="payCommitTime">业绩提交时间</checkbox>
      <!--<checkbox value="leadPhone">备注信息</checkbox>-->
    </checkbox-group>
    <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
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
        tableColumnsChecked: ['index','leadsName', 'leadsPhone', 'subject', 'grade', 'ccName', 'ccTeam', 'crName', 'crTeam',
          'payCommitTime'],
        historyRemarkList: [],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        Search: {
          leadsName: '',
          leadsPhone: '',
          grade: '',
//          subject: '',
          ccName: '',
          ccTeam: '',
          crName: '',
          crTeam: '',
          payCommitStartDate: '',
          payCommitEndDate: '',
        },
//        subjectList: [],
        ccTeamList: [],
        crTeamList: [],
        gradeList: [],
        columns: []
      }
    },
    mounted() {
      const _this = this;
      this.changeTableColumns();
      this.search();
//      common.ajax({
//        url: COMMON_API().allSubject,
//        method: 'get',
//        success: function (res) {
//          _this.subjectList = res.data || [];
//        }
//      });
      common.ajax({ //获取CC团队
        url: COMMON_API().ccTeamList,
        method: 'get',
        success: function (res) {
          _this.ccTeamList = res.data || [];
        }
      });
      common.ajax({ //获取CR团队
        url: COMMON_API().crTeamList,
        method: 'get',
        success: function (res) {
          _this.crTeamList = res.data || [];
        }
      });
      $.getJSON("static/data.json", function (json) { //获取年级
        _this.gradeList = json.gradeList;
      });
    },
    methods: {
      getTableColumns () {
        const columns = {
          index: {
            title: '序号',
            type: 'index',
            align: 'center',
            minWidth: 60
          },
          leadsName: {
            title: '学生姓名',
            key: 'leadsName',
            align: 'center',
            minWidth: 90
          },
          leadsPhone: {
            title: '学生电话',
            key: 'leadsPhone',
            align: 'center',
            minWidth: 90,
            render(h, params) {
              return h('span', hideCharAtNumber(params.row.leadsPhone));
            }
          },
          subject: {
            title: '科目',
            key: 'subject',
            align: 'center',
            minWidth: 90,
          },
          grade: {
            title: '年级',
            key: 'grade',
            align: 'center',
            minWidth: 90
          },
          ccName: {
            title: 'cc姓名',
            key: 'ccName',
            align: 'center',
            minWidth: 120
          },
          ccTeam: {
            title: 'cc团队',
            key: 'ccTeam',
            align: 'center',
            minWidth: 90
          },
          crName: {
            title: 'cr姓名',
            key: 'crName',
            minWidth: 90,
            align: 'center',
          },
          crTeam: {
            title: 'cr团队',
            key: 'crTeam',
            align: 'center',
            minWidth: 90
          },
          payCommitTime: {
            title: '业绩提交时间',
            key: 'payCommitTime',
            minWidth: 150,
            align: 'center',
            render(h, params) {
              return h('span', formateDate(params.row.payCommitTime, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
        };
        let datas=[]
        this.tableColumnsChecked.forEach(col => datas.push(columns[col]));
        return datas;
      },
      search(val) {
        if (val) this.pageIndex = val;
        this.loadDataGrid({
          leadsName: this.Search.leadsName,
          leadsPhone: this.Search.leadsPhone,
//          subject: this.Search.subject,
          grade: this.Search.grade,
          ccName: this.Search.ccName,
          ccTeam: this.Search.ccTeam,
          crName: this.Search.crName,
          crTeam: this.Search.crTeam,
          payCommitStartDate: this.Search.payCommitStartDate,
          payCommitEndDate: this.Search.payCommitEndDate,
        });
      },
      clearSearch() {
        clearSearchForm(this.Search, this.$refs.sigup);
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?leadsName=${search.leadsName}&leadsPhone=${search.leadsPhone}&grade=${search.grade}&ccName=${search.ccName}&ccTeam=${search.ccTeam}&crName=${search.crName}&crTeam=${search.crTeam}`;
        param += `&payCommitStartDate=${search.payCommitStartDate}&payCommitEndDate=${search.payCommitEndDate}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: REPORT().conversionLeads.noListenConversionLeadsKpi + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['dtos'] || [];
            _this.total = res.data['total'];
          }
        });
      },
      changeSignUpDate(value) {
        this.Search.payCommitStartDate = value[0] || '';
        this.Search.payCommitEndDate = value[1] || '';
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
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470 : '';
      }
    },
    components: {OBreadcrumb, PageModel}
  };
</script>

<style>

</style>
