<template>
  <div class="mc">
    <o-breadcrumb second="师资管理_" third="合肥-监课表"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span=24 class="right">
          <i-select :size="$store.state.searchModuleSize" v-model="Search.subject" clearable placeholder="科目" style="width:60px;">
            <i-option v-for="(item,index) in subjectList" :key='index' :value="item">{{ item }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.grade" clearable placeholder="年级" style="width:60px;">
            <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.type" clearable placeholder="课程类型" style="width:80px">
            <i-option value="0">测评课</i-option>
            <i-option value="1">正式课</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.level" clearable placeholder="课时级别" style="width:90px">
            <i-option value="0">普通</i-option>
            <i-option value="1">清北</i-option>
            <i-option value="2">明星</i-option>
          </i-select>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.tcName" @on-keyup.enter="search(1)" placeholder="老师姓名" style="width:80px;margin-right:2px;"></i-input>
          <!--<i-select v-model="Search.natureOfWork" clearable size="small" placeholder="工作性质" style="width:90px">-->
            <!--<i-option value="1">社招全职</i-option>-->
            <!--<i-option value="2">兼职</i-option>-->
            <!--<i-option value="3">校招全职</i-option>-->
          <!--</i-select>-->
          <i-select :size="$store.state.searchModuleSize" v-model="Search.feedbackStaus" placeholder="课程反馈状态" style="width:120px;">
            <i-option value="0" label="暂无反馈"><span><Icon type="record" class="c-grey"></Icon> 暂无反馈</span></i-option>
            <i-option value="1" label="待跟进"><span><Icon type="record" class="c-warning"></Icon> 待跟进</span></i-option>
            <i-option value="2" label="转化成功"><span><Icon type="record" class="c-success"></Icon> 转化成功</span></i-option>
            <i-option value="3" label="转化成功，换老师"><span><Icon type="record" class="c-primary"></Icon> 转化成功，换老师</span></i-option>
            <i-option value="4" label="换老师，转化成功"><span><Icon type="record" class="c-primary"></Icon> 换老师，转化成功</span></i-option>
            <i-option value="5" label="转化失败"><span><Icon type="record" class="c-error"></Icon> 转化失败</span></i-option>
            <i-option value="6" label="老师放鸽子"><span><Icon type="record" class="c-error"></Icon>老师放鸽子</span></i-option>
            <i-option value="7" label="学生放鸽子"><span><Icon type="record" class="c-error"></Icon>学生放鸽子</span></i-option>
          </i-select>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.sale" @on-keyup.enter="search(1)" placeholder="销售姓名" style="width:80px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.team" @on-keyup.enter="search(1)" placeholder="销售团队" style="width:100px;margin-right:2px;"></i-input>


        </i-col>
        <i-col span=24 class="right">
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" @on-change="changeClassDate" ref="classDate" placement="bottom-end" placeholder="上课时间" style="width: 180px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="search" @click="search(1)">搜索</i-button>
          <i-button :size="$store.state.searchModuleSize" type="ghost" @click="clearSearch">重置</i-button>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-download-outline" @click="exportExcel">导出</i-button>
        </i-col>
      </Row>
    </div>
    <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
      <checkbox label="grade">年级</checkbox>
      <checkbox label="subject">科目</checkbox>
      <checkbox label="courseType">课程类型</checkbox>
      <checkbox label="courseLevel">课时类别</checkbox>
      <checkbox label="length">课程时长</checkbox>
      <checkbox label="courseDate">上课时间</checkbox>
      <checkbox label="tcName">老师姓名</checkbox>
      <checkbox label="teacherPhone">老师手机号</checkbox>
      <checkbox label="natureOfWorkDesc">工作性质</checkbox>
      <checkbox label="sale">销售姓名</checkbox>
      <checkbox label="team">销售团队</checkbox>
      <checkbox label="feedbackDesc">课程反馈状态</checkbox>
      <checkbox label="ispayDesc">付费</checkbox>
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
        tableColumnsChecked:['grade','subject','courseType','courseLevel','length',
          'courseDate','tcName','teacherPhone','natureOfWorkDesc','sale',
          'team','feedbackDesc','ispayDesc'],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11: 17,
        Search: {
          courseDateStart: '',
          branch: '2',
          courseDateEnd: '',
          subject: '',
          grade: '',
          type: '',
          level: '',
          tcName: '',
          sale: '',
          team: '',
          feedbackStaus:''
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
          leadsName: {
          title: '学生姓名',
            key: 'leadsName',
          align:'center',
          fixed:'left',
          width: 90
        },
          grade:{
          title: '年级',
            key: 'grade',
          align:'center',
          width: 90
        },
          subject:{
          title: '科目',
            align:'center',
          key: 'subject',
          width: 90
        },
          courseType:{
          title: '课程类型',
            align:'center',
          key: 'courseType',
          width: 90
        },
          courseLevel:{
          title: '课时类别',
            key: 'courseLevel',
          align:'center',
          width: 90,
          // render(row) {
          //   if(row.courseLevel == 0) {
          //     return '普通';
          //   } else if(row.courseLevel == 1) {
          //     return '清北';
          //   } else if(row.courseLevel == 2) {
          //     return '明星';
          //   } else {
          //     return row.courseLevel;
          //   }
          // },
          render:(h,params) =>{
            if(params.row.courseLevel == 0) {
              return h('div',[
                h('span',{},'普通')
              ])
            } else if(params.row.courseLevel == 1) {
              return h('div',[
                h('span',{},'清北')
              ])
            } else if(params.row.courseLevel == 2) {
              return h('div',[
                h('span',{},'明星')
              ])
            } else {
              return h('div',[
                h('span',{},params.row.courseLevel)
              ])
            }

          }
        },
          length:{
          title: '课程时长（h）',
            align:'center',
          key: 'length',
          width: 120
        },
          courseDate:{
          title: '上课时间',
            key: 'courseDate',
          align:'center',
          width: 120,
          // render(row) {
          //   return row.courseDate+' '+row.startTime
          // },
          render:(h,params) =>{
            return h('div',[
              h('span',{},params.row.courseDate + ' '+ params.row.startTime)
            ])
          }
        },
          tcName:{
          title: '老师姓名',
            align:'center',
          key: 'tcName',
          width: 90
        },
          teacherPhone:{
          title: '老师手机号',
          align:'center',
          key: 'teacherPhone',
          width: 120,
          // render (row, column, index) {
          //   if(row.teacherPhone) {
          //     return hideCharAtNumber(row.teacherPhone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.teacherUuid}')" class="eye" title="显示全部"></Icon>`;
          //   }else{
          //     return '-';
          //   }
          // },
          render : (h, params) => {
            if(params.row.phone) {
              return h('div',[
                h('span',hideCharAtNumber(params.row.teacherPhone)),
                h('i',{
                  style:{
                    margin:'2px'
                  },
                  attrs:{
                    class:'ivu-icon ivu-icon-ios-eye',
                    title:'显示全部'
                  },
                  style:{
                    fontSize:'18px',
                    verticalAlign:'top',
                    cursor:'pointer'
                  },
                  on:{
                    click:()=>{
                      this.getFullPhone(params.row.teacherUuid)
                    }
                  }
                })
              ])
            }else{
              return '-';
            }
          }
        },
          natureOfWorkDesc:{
          title: '工作性质',
            align:'center',
          key: 'natureOfWorkDesc',
          width: 90
        },
          sale:{
          title: '销售姓名',
            align:'center',
          key: 'sale',
          width: 90
        },
          team:{
          title: '销售团队',
            align:'center',
          key: 'team',
          width: 90
        },
          feedbackDesc:{
          title: '课程反馈状态',
            align:'center',
          key: 'feedbackDesc',
          width: 120
        },
          ispayDesc:{
          title: '付费',
            align:'center',
          key: 'ispayDesc',
          width:90
        }
        };
        let datas = [columns.leadsName];
        this.tableColumnsChecked.forEach(col => datas.push(columns[col]));
        return datas;
      },

      exportExcel() {
        if(this.Search.courseDateStart === '') {
          const _this = this;
          this.$Modal.confirm({
            title: '导出',
            content: '没有选择上课时间，若不选择时间段，默认导出当前自然月的数据',
            onOk() {
              _this.exportData();
            }
          });
        }else{
          this.exportData();
        }
      },
      exportData() {
        let apiUrl = REPORT().Course.MonitorCourse.exportData;
        apiUrl += '?courseStartTime=' + this.Search.courseDateStart + '&branch=2' + '&courseSEndTime=' + this.Search.courseDateEnd;
        apiUrl += '&token=' + localStorage.getItem('token');
        console.log(apiUrl);
        GLOBAL.newTab(apiUrl,true);
      },
      getFullPhone(teacherUuid) {
        const _this = this;
        common.ajax({
          url: REPORT().Course.MonitorCourse.fullPhone,
          method: 'get',
          data: { uuid: teacherUuid },
          success: function (res) {
            _this.$Modal.info({
              content: (res.data !== null) ? res.data.phone : ''
            });
          }
        })
      },
      search(val) {
          if(val) this.pageIndex = val;
        this.loadDataGrid({
          courseDateStart: this.Search.courseDateStart,
          branch: this.Search.branch,
          courseDateEnd: this.Search.courseDateEnd,
          subject: this.Search.subject,
          grade: this.Search.grade,
          type: this.Search.type,
          level: this.Search.level,
          tcName: this.Search.tcName,
          sale: this.Search.sale,
          team: this.Search.team,
          feedbackStaus: this.Search.feedbackStaus
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?feedbackStaus=${search.feedbackStaus}&branch=2&courseDateStart=${search.courseDateStart}&courseDateEnd=${search.courseDateEnd}&subject=${search.subject}&grade=${search.grade}&type=${search.type}&level=${search.level}&tcName=${search.tcName}&sale=${search.sale}&team=${search.team}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: REPORT().Course.MonitorCourse.dataGrid + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['teacherList'] || [];
            _this.total = res.data['total'];
          }
        });
      },
      clearSearch() {
        clearSearchForm(this.Search,[this.$refs.classDate],this);
        this.search();
      },
      changeClassDate(value) {
        this.Search.courseDateStart = value[0] || '';
        this.Search.courseDateEnd = value[1] || '';
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
    components: { OBreadcrumb ,PageModel}
  };
</script>

<style>

</style>
