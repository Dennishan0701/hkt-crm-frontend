<template>
  <div class="mc">
    <o-breadcrumb second="数据报表" third="试听未转化明细"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="4" v-if="assign">
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="paper-airplane" @click="showSalesModal">
            批量分配
          </i-button>
        </i-col>
        <i-col span="20" class="right">
          <!--<i-col span=24 class="right">-->
          <i-input :size="$store.state.searchModuleSize" v-model="Search.leadsName" @on-keyup.enter="search(1)"
                   placeholder="leads姓名" style="width:90px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.leadsPhone" @on-keyup.enter="search(1)"
                   placeholder="leads电话号码" style="width:100px;margin-right:2px;"></i-input>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.grade" clearable placeholder="年级"
                    style="width:100px;">
            <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
          <!--<i-select :size="$store.state.searchModuleSize" v-model="Search.subject" clearable placeholder="科目" style="width:100px;">-->
          <!--<i-option v-for="(item,index) in subjectList" :key='index' :value="item">{{ item }}</i-option>-->
          <!--</i-select>-->
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" @on-change="changeSignUpDate"
                       placement="bottom-end" ref="sigup" placeholder="报名时间" style="width: 200px"></Date-picker>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" @on-change="changeCourseDate"
                       placement="bottom-end" ref="courseDate" placeholder="上课日期" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="search" @click="search(1)">搜索</i-button>
          <!--<i-button :size="$store.state.searchModuleSize" type="ghost" @click="clearSearch">重置</i-button>-->
        </i-col>
      </Row>
    </div>
    <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
      <checkbox label="leadsName">学生姓名</checkbox>
      <checkbox label="leadsPhone">学生电话</checkbox>
      <checkbox label="ccName">所属cc姓名</checkbox>
      <checkbox label="commitUserName">课程提交人</checkbox>
      <checkbox label="lastListenTime">最近一次试听课上课日期</checkbox>
      <checkbox label="grade">年级</checkbox>
      <checkbox label="subject">科目</checkbox>
      <checkbox label="signUpDate">报名时间</checkbox>
      <checkbox label="teacherName">老师</checkbox>
      <!--<checkbox value="leadPhone">备注信息</checkbox>-->
    </checkbox-group>
    <i-table size="small" :height="theight" highlight-row stripe :columns="columns" @on-selection-change="getSelections" @on-select-all="getSelectionAll" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
    <select-sales @reFresh="reFresh" ref="sales" form-type="0"></select-sales>
  </div>
</template>
<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {REPORT} from 'common/api/report.js';
  import {common, formateDate, hideCharAtNumber, clearSearchForm} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';
  import selectSales from '../../distribution/selectSales';
  const $sStorage = $.sessionStorage;
  export default {
    data() {
      return {
        data: [],
        tableColumnsChecked: ['selection','index', 'leadsName', 'leadsPhone', 'ccName', 'commitUserName', 'teacherName', 'grade', 'subject', 'lastListenTime', 'signUpDate',
        ],
        historyRemarkList: [],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        assign: false,
        Search: {
          leadsName: '',
          leadsPhone: '',
          grade: '',
          subject: '',
          signUpStartDate: '',
          signUpEndDate: '',
          courseStartDate: "",
          courseEndDate: "",
        },
        subjectList: [],
        gradeList: [],
        columns: [],
        selectionRows: [],
      }
    },
    mounted() {
      const _this = this;
      this.changeTableColumns();
      this.search();
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
      getSelections(selection) {
        $sStorage.set('selectionRows' ,selection);
        this.selectionRows = selection;
      },
      getSelectionAll(selection) {
        $sStorage.set('selectionRows' ,selection);
        this.selectionRows = selection;
      },
      showSalesModal() {//批量分配
        let row = this.selectionRows;
        if (row.length > 0) {
          this.$refs.sales.show();
        } else {
          common.msg('请选择名单', 'warning');
        }
      },
      reFresh() {
        this.search();
      },
      getTableColumns() {
        const columns = {
          selection:{
            fixed:'left',
            type: 'selection',
            width: 40,
            align: 'center',
          },
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
          ccName: {
            title: '所属cc姓名',
            key: 'ccName',
            align: 'center',
            minWidth: 90,
          },
          commitUserName: {
            title: '课程提交人',
            key: 'commitUserName',
            align: 'center',
            minWidth: 90
          },
          grade: {
            title: '年级',
            key: 'grade',
            align: 'center',
            minWidth: 90
          },
          subject: {
            title: '科目',
            key: 'subject',
            minWidth: 90,
            align: 'center',
          },
          teacherName: {
            title: '老师',
            key: 'teacherName',
            align: 'center',
            minWidth: 90
          },
          lastListenTime: {
            title: '最近一次试听课上课日期',
            key: 'lastListenTime',
            align: 'center',
            minWidth: 150,
            render(h, params) {
              return h('span', formateDate(params.row.lastListenTime, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          signUpDate: {
            title: '报名时间',
            key: 'signUpDate',
            minWidth: 150,
            align: 'center',
            render(h, params) {
              return h('span', formateDate(params.row.signUpDate, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
        };
        let datas = []
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
          signUpStartDate: this.Search.signUpStartDate,
          signUpEndDate: this.Search.signUpEndDate,
          courseStartDate: this.Search.courseStartDate,
          courseEndDate: this.Search.courseEndDate,
        });
      },
//      clearSearch() {
//        clearSearchForm(this.Search, this.$refs.sigup);
//      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?leadsName=${search.leadsName}&leadsPhone=${search.leadsPhone}&grade=${search.grade}`;
        param += `&signUpStartDate=${search.signUpStartDate}&signUpEndDate=${search.signUpEndDate}`;
        param += `&courseStartDate=${search.courseStartDate}&courseEndDate=${search.courseEndDate}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: REPORT().conversionLeads.listenNoConversionLeadsKpi + param,
          method: 'get',
          success: function (res) {
            _this.assign = res.data.assign;
            _this.data = res.data['dtos'] || [];
            _this.total = res.data['total'];
          }
        });
      },
      changeSignUpDate(value) {
        this.Search.signUpStartDate = value[0] || '';
        this.Search.signUpEndDate = value[1] || '';
      },
      changeCourseDate(value) {
        this.Search.courseStartDate = value[0] || '';
        this.Search.courseEndDate = value[1] || '';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.search();
      },
      changeTableColumns() {
        this.columns = this.getTableColumns();
      }
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470 : '';
      }
    },
    components: {OBreadcrumb,selectSales, PageModel}
  };
</script>
<style>
</style>
