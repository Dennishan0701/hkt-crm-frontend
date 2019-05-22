<template>
  <div class="mc">
    <o-breadcrumb second="数据报表" third="合肥排课数据"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class=right>
          <i-input v-model="Search.leadsName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="姓名" style="width:90px;margin-right:2px;"></i-input>
          <i-input v-model="Search.subject" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="科目" style="width:90px;margin-right:2px;"></i-input>
          <i-select v-model="Search.grade" :size="$store.state.searchModuleSize" clearable clearable placeholder="年级" style="width:100px">
            <i-option v-for="(item,index) in gradeList" :value="item.value" :key='index'>{{ item.value }}</i-option>
          </i-select>
          <i-select v-model="Search.courseType" :size="$store.state.searchModuleSize" clearable placeholder="课程类型" style="width:120px">
            <i-option value="0">测评课</i-option>
            <i-option value="1">正式课</i-option>
          </i-select>
          <i-select v-model="Search.courseLevel" :size="$store.state.searchModuleSize" clearable clearable placeholder="课时级别" style="width:100px">
            <i-option value="0" label="普通"><span>普通</span></i-option>
            <i-option value="1" label="清北"><span class="c-success">清北</span></i-option>
            <i-option value="2" label="明星"><span class="c-red">明星</span></i-option>
          </i-select>
          <i-select v-model="Search.feedbackStaus" :size="$store.state.searchModuleSize" clearable placeholder="课程反馈状态" style="width:120px;">
            <i-option value="0" label="暂无反馈"><span><Icon type="record" class="c-grey"></Icon> 暂无反馈</span></i-option>
            <i-option value="1" label="待跟进"><span><Icon type="record" class="c-warning"></Icon> 待跟进</span></i-option>
            <i-option value="2" label="转化成功"><span><Icon type="record" class="c-success"></Icon> 转化成功</span></i-option>
            <i-option value="3" label="转化成功，换老师"><span><Icon type="record" class="c-primary"></Icon> 转化成功，换老师</span></i-option>
            <i-option value="4" label="换老师，转化成功"><span><Icon type="record" class="c-primary"></Icon> 换老师，转化成功</span></i-option>
            <i-option value="5" label="转化失败"><span><Icon type="record" class="c-error"></Icon> 转化失败</span></i-option>
            <i-option value="6" label="老师放鸽子"><span><Icon type="record" class="c-error"></Icon>老师放鸽子</span></i-option>
            <i-option value="7" label="学生放鸽子"><span><Icon type="record" class="c-error"></Icon>学生放鸽子</span></i-option>
          </i-select>
          <i-input v-model="Search.teacherName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="老师" style="width:90px;margin-right:2px;"></i-input>
          <i-input v-model="Search.saleName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="销售" style="width:90px;margin-right:2px;"></i-input>
          <i-input v-model="Search.teamName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="销售团队" style="width:90px;margin-right:2px;"></i-input>
        </i-col>
      </Row>
      <Row>
        <i-col span="24" class="right">
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" @on-change="changeCourseDate" ref='courseDate' placeholder="上课日期" style="width: 200px"></Date-picker>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" @on-change="changeCourseCommitTime" ref='commitTime' placeholder="课程提交时间" style="width: 200px"></Date-picker>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-end" @on-change="changeArrangeCourseTime" ref='arrangeTime' placeholder="排课时间" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
          <i-button :size="$store.state.searchModuleSize" type="ghost" @click="clearSearchForm">重置</i-button>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-download-outline" @click="exportExcel">导出</i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" highlight-row stripe :columns="columns0" border :data="data0"></i-table>
    <i-table size="small" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {REPORT} from 'common/api/report.js';
  import {formateDate,common,hideCharAtNumber,clearSearchForm} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        data0: [],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        Search: {
          leadsName:'',
          subject: '',
          grade: '',
          courseStartDate: '',
          courseEndDate: '',
          courseType: '',
          courseLevel: '',
          teacherName: '',
          saleName: '',
          teamName: '',
          courseCommitStartTime: '',
          courseCommitEndTime: '',
          arrangeCourseStartTime: '',
          arrangeCourseEndTime: '',
          feedbackStaus:''
        },
        gradeList: [],
        columns0: [
          {
            title: '角色',
            key: 'subject',
            align:'center',
            width: 90,
            render(h, params) {
              return h('span','CC');
            }
          },
          {
            title: '测评课',
            key: 'ccTestCount',
            align:'center',
            width: 90,
          },
          {
            title: '角色',
            key: 'subject',
            align:'center',
            width: 90,
            render(h, params) {
              return h('span','CR');
            }
          },
          {
            title: '测评课',
            key: 'crTestCount',
            align:'center',
            width: 90,
          },
          {
            title: '正式课',
            key: 'crFormalCount',
            align:'center',
            width: 90,
          },
        ],
        columns: [
          {
            title: '学生姓名',
            key: 'leadsName',
            align:'center',
            width: 90,
            fixed:'left',
            render(h, params) {
              return h('div',[
                h('a',{
                  on:{
                    click:()=>{
                    GLOBAL.viewLeadsDetail(params.row.leadsUuid)
                }
            }
            },params.row.leadsName)
            ])
//              return `<a href="javascript:GLOBAL.viewLeadsDetail('${row.leadsUuid}');">${row.leadsName}</a>`;
            }
          },
          {
            title: '年级',
            key: 'grade',
            align:'center',
            width: 90,
          },
          {
            title: '科目',
            key: 'subject',
            align:'center',
            width: 90,
          },
          {
            title: '课程类型',
            key: 'courseType',
            align:'center',
            width: 90,
          },
          {
            title: '课时类别',
            key: 'courseLevel',
            align:'center',
            width: 90,
          },
          {
            title: '课程时长（h）',
            key: 'courseLength',
            align:'center',
            width: 90,
          },
          {
            title: '上课日期',
            key: 'courseDate',
            align:'center',
            width: 100,
          },
          {
            title: '上课时间',
            align:'center',
            key: 'courseDate',
            width: 100,
            render(h, params) {
              return h('span',params.row.courseStartTime+' - '+ params.row.courseEndTime);
            }
          },
          {
            title: '老师姓名',
            key: 'teacherName',
            align:'center',
            width: 90,
          },
          {
            title: '销售姓名',
            key: 'saleName',
            align:'center',
            width: 90,
          },
          {
            title: '销售团队',
            key: 'teamName',
            align:'center',
            width: 120,
          },
          {
            title: '课程提交时间',
            key: 'commitTime',
            align:'center',
            width: 180,
            render(h, params) {
              return h('span',formateDate(params.row.commitTime,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '排课时间',
            key: 'arrangeCourseTime',
            align:'center',
            width: 180,
            render(h, params) {
              return h('span',formateDate(params.row.arrangeCourseTime,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '课程反馈状态',
            key: 'courseFeedBackStatus',
            align:'center',
            width: 120,
            render(h, params) {
              let status = params.row.courseFeedBackStatus;
              switch (status) {
                case '0':
                  return h('span','暂无反馈')
                case '1':
                  return h('span','待跟进')
                case '2':
                  return h('span','转化成功')
                case '3':
                  return h('span','转化成功，换老师')
                case '4':
                  return h('span','转化成功')
                case '5':
                  return h('span','转化失败')
                case '6':
                  return h('span','老师放鸽子')
                  return '';
                case '7':
                  return h('span','学生放鸽子')
                default:
                  return h('span','未知状态:'+status)
              }
            }
          },
          {
            title: '反馈备注',
            key: 'feedBackRemark',
            align:'center',
            width: 120,
          },
          {
            title: '付费',
            key: 'ispay',
            align:'center',
            width: 90
          },
        ]
      }
    },
    mounted() {
      this.searchForm();
      const _this = this;
      $.getJSON("static/data.json", function (json) {
        _this.gradeList = json.gradeList;
      });
    },
    methods: {
      isSearchNull() {
        let obj = this.Search;
        for(let item in obj) {
           if(obj[item] !== '') {
             return false;
           }
        }
        return true;
      },
      exportExcel() {
        let isSearchNull = this.isSearchNull();
        if(isSearchNull) {
          const _this = this;
          this.$Modal.confirm({
            title: '导出',
            content: '没有选择任何筛选条件，将导出全部数据',
            onOk() {
              _this.exportData();
            }
          });
        }else{
          this.exportData();
        }
      },
      exportData() {
        let apiUrl = REPORT().Course.ArrangCourse.exportData;
        apiUrl += `?branch=2&grade=${this.Search.grade}&leadsName=${this.Search.leadsName}&subject=${this.Search.subject}&courseStartDate=${this.Search.courseStartDate}&courseEndDate=${this.Search.courseEndDate}`;
        apiUrl += `&courseType=${this.Search.courseType}&courseLevel=${this.Search.courseLevel}&teacherName=${this.Search.teacherName}&saleName=${this.Search.saleName}`;
        apiUrl += `&teamName=${this.Search.teamName}&courseCommitStartTime=${this.Search.courseCommitStartTime}&courseCommitEndTime=${this.Search.courseCommitEndTime}`;
        apiUrl += `&arrangeCourseStartTime=${this.Search.arrangeCourseStartTime}&arrangeCourseEndTime=${this.Search.arrangeCourseEndTime}`;
        apiUrl += `&token=${localStorage.getItem('token')}`;
        console.log(apiUrl);
        GLOBAL.newTab(apiUrl,true);
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          leadsName: this.Search.leadsName,
          grade: this.Search.grade,
          subject: this.Search.subject,
          courseStartDate: this.Search.courseStartDate,
          courseEndDate: this.Search.courseEndDate,
          courseType: this.Search.courseType,
          courseLevel: this.Search.courseLevel,
          teacherName: this.Search.teacherName,
          saleName: this.Search.saleName,
          teamName: this.Search.teamName,
          courseCommitStartTime: this.Search.courseCommitStartTime,
          courseCommitEndTime: this.Search.courseCommitEndTime,
          arrangeCourseStartTime: this.Search.arrangeCourseStartTime,
          arrangeCourseEndTime: this.Search.arrangeCourseEndTime,
          feedbackStaus: this.Search.feedbackStaus
        });
      },
      clearSearchForm() {
        clearSearchForm(this.Search, [this.$refs.courseDate, this.$refs.commitTime, this.$refs.arrangeTime], this);
        this.searchForm();
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?branch=2&feedbackStaus=${search.feedbackStaus}&grade=${search.grade}&leadsName=${search.leadsName}&subject=${search.subject}&courseStartDate=${search.courseStartDate}&courseEndDate=${search.courseEndDate}&courseLevel=${search.courseLevel}`;
        param += `&courseType=${search.courseType}&teacherName=${search.teacherName}&saleName=${search.saleName}&teamName=${search.teamName}&courseCommitStartTime=${search.courseCommitStartTime}`;
        param += `&courseCommitEndTime=${search.courseCommitEndTime}&arrangeCourseStartTime=${search.arrangeCourseStartTime}&arrangeCourseEndTime=${search.arrangeCourseEndTime}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        this.data0 = [];
        common.ajax({
          url: REPORT().Course.ArrangCourse.dataGrid + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['arrangeControllerDetailVos'] || [];
            _this.total = res.data.total;
            console.log(res.data.ccTestCount);
            console.log(res.data.crTestCount);
            console.log(res.data.crFormalCount);
            _this.data0.push({'ccTestCount':res.data.ccTestCount,'crTestCount':res.data.crTestCount,'crFormalCount':res.data.crFormalCount});
          }
        });
      },
      changeCourseDate(value) {
        this.Search.courseStartDate = value[0] || '';
        this.Search.courseEndDate = value[1] || '';
      },
      changeCourseCommitTime(value) {
        this.Search.courseCommitStartTime = value[0] || '';
        this.Search.courseCommitEndTime = value[1] || '';
      },
      changeArrangeCourseTime(value) {
        this.Search.arrangeCourseStartTime = value[0] || '';
        this.Search.arrangeCourseEndTime = value[1] || '';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      }
    },
    components: { OBreadcrumb,PageModel }
  };
</script>

<style>

</style>
