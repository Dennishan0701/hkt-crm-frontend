<template>
  <div class="mc">
    <o-breadcrumb second="数据报表" third="教师推荐Leads数据"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span=24 class="right">
          <i-input :size="$store.state.searchModuleSize" v-model="Search.leadsName" @on-keyup.enter="search(1)" placeholder="学生姓名" style="width:100px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.leadsPhone" @on-keyup.enter="search(1)" placeholder="手机号" style="width:100px;margin-right:2px;"></i-input>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.grade" clearable placeholder="年级" style="width:80px;">
            <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.subject" clearable placeholder="科目" style="width:80px;">
            <i-option v-for="(item,index) in subjectList" :key='index' :value="item">{{ item }}</i-option>
          </i-select>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.recommendCcName" @on-keyup.enter="search(1)" placeholder="推荐CC" style="width:100px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.recommendCrName" @on-keyup.enter="search(1)" placeholder="推荐CR" style="width:100px;margin-right:2px;"></i-input>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.createUser" filterable clearable placeholder="录入人" style="width:90px;">
            <i-option v-for="(item,index) in createUserList" :key="index" :value="item">{{item}}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.isManagerCourse" clearable placeholder="是否排课" style="width:90px;">
            <i-option value="1">是</i-option>
            <i-option value="0">否</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.isPay" clearable placeholder="是否付费" style="width:90px;">
            <i-option value="1">是</i-option>
            <i-option value="0">否</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.branch" clearable placeholder="老师所属分部" style="width:120px;">
            <i-option value="1">总部</i-option>
            <i-option value="2">合肥</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.natureOfWork" clearable placeholder="老师工作性质" style="width:120px;">
            <i-option value="1">全职</i-option>
            <i-option value="2">兼职</i-option>
          </i-select>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" @on-change="changeSignUpDate" transfer  ref="sigup" placeholder="报名时间" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="search" @click="search(1)">搜索</i-button>
          <i-button :size="$store.state.searchModuleSize" type="ghost" @click="clearSearch">重置</i-button>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-download-outline" @click="exportExcel">导出</i-button>
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
        Search: {
          leadsName: '',
          leadsPhone: '',
          subject: '',
          grade: '',
          createUser: '',
          recommendCcName: '',
          recommendCrName: '',
          signUpStartTime: '',
          signUpEndTime: '',
          isManagerCourse: '',
          isPay: '',
          branch: '',
          natureOfWork: '',
        },
        subjectList: [],
        gradeList: [],
        createUserList: [],
        columns: [
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
            title: '年级',
            key: 'grade',
            align:'center',
            minWidth: 90
          },
          {
            title: '科目',
            key: 'subject',
            align:'center',
            minWidth: 90
          },
          {
            title: '推荐CC',
            key: 'recommendCcName',
            align:'center',
            minWidth: 90
          },
          {
            title: '推荐CR',
            key: 'recommendCrName',
            align:'center',
            minWidth: 90
          },
          {
            title: '录入人',
            key: 'createUser',
            align:'center',
            minWidth: 90
          },
          {
            title: '转介绍人',
            key: 'introducer',
            align:'center',
            minWidth: 90
          },
          {
            title: '所属销售',
            key: 'crName',
            align:'center',
            minWidth: 90,
            render(h, params) {
              return h('span',params.row.crName ? params.row.crName : params.row.ccName);
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
            title: '是否排课',
            key: 'isManagerCourse',
            align:'center',
            minWidth:90
          },
          {
            title: '是否付费',
            key: 'isPay',
            align:'center',
            minWidth: 90
          },
          {
            title: '付费金额',
            key: 'payMoney',
            align:'center',
            minWidth: 90
          },
          {
            title: '付费时间',
            align:'center',
            key: 'payTime',
            minWidth: 180,
            render(h, params) {
              return h('span',formateDate(params.row.payTime,'yyyy-MM-dd hh:mm:ss'));
            }
          }
        ]
      }
    },
    mounted() {
      const _this = this;
      this.search();
      common.ajax({ //录入人
        url:  REPORT().Leads.getCreateUser,
        method: 'get',
        success: function (res) {
          _this.createUserList = res.data;
        }
      });
      common.ajax({ //获取所有科目
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
      exportExcel() {
        if(this.Search.commitStartTime === '') {
          const _this = this;
          this.$Modal.confirm({
            title: '导出',
            content: '没有选择付费提交时间，默认导出当月',
            onOk() {
              _this.exportData();
            }
          });
        }else{
          this.exportData();
        }
      },
      exportData() {
        let apiUrl = REPORT().Leads.hefeiGenerateExcelAndLoad;
        apiUrl += `?createUser=${this.Search.createUser}&leadsName=${this.Search.leadsName}&leadsPhone=${this.Search.leadsPhone}&subject=${this.Search.subject}&grade=${this.Search.grade}&recommendCcName=${this.Search.recommendCcName}&recommendCrName=${this.Search.recommendCrName}`;
        apiUrl += `&signUpStartTime=${this.Search.signUpStartTime}&signUpEndTime=${this.Search.signUpEndTime}&isPay=${this.Search.isPay}&isManagerCourse=${this.Search.isManagerCourse}`;
       apiUrl += `&branch=${this.Search.branch}&natureOfWork=${this.Search.natureOfWork}`
        apiUrl += '&token=' + localStorage.getItem('token');
        GLOBAL.newTab(apiUrl,true);
      },
      search(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          leadsName: this.Search.leadsName,
          leadsPhone: this.Search.leadsPhone,
          subject: this.Search.subject,
          grade: this.Search.grade,
          createUser: this.Search.createUser,
          recommendCcName: this.Search.recommendCcName,
          recommendCrName: this.Search.recommendCrName,
          signUpStartTime: this.Search.signUpStartTime,
          signUpEndTime: this.Search.signUpEndTime,
          isPay: this.Search.isPay,
          branch: this.Search.branch,
          natureOfWork: this.Search.	natureOfWork,
          isManagerCourse: this.Search.isManagerCourse
        });
      },
      clearSearch() {
        clearSearchForm(this.Search, this.$refs.sigup);
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?createUser=${search.createUser}&leadsName=${search.leadsName}&leadsPhone=${search.leadsPhone}&subject=${search.subject}&grade=${search.grade}&recommendCcName=${search.recommendCcName}&recommendCrName=${search.recommendCrName}`;
        param += `&signUpStartTime=${search.signUpStartTime}&signUpEndTime=${search.signUpEndTime}&isPay=${search.isPay}&branch=${search.branch}&natureOfWork=${search.natureOfWork}&isManagerCourse=${search.isManagerCourse}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: REPORT().Leads.hefeiRecommendLeads + param,
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
