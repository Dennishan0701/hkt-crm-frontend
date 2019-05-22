<template>
  <div class="mc">
    <o-breadcrumb second="数据报表" third="学生成绩报表"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span=24 class="right">
          <i-input :size="$store.state.searchModuleSize" v-model="Search.name" @on-keyup.enter="search(1)" placeholder="学生姓名/手机" style="width:150px;margin-right:2px;"></i-input>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.subject" clearable placeholder="科目" style="width:120px;">
            <i-option v-for="(item,index) in subjectList" :key='index' :value="item">{{ item }}</i-option>
          </i-select>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" @on-change="changeDate" placement="bottom-end" placeholder="签单时间" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="search" @click="search(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
    <hand-out-remark ref="handOutRemark"></hand-out-remark>
    <info-remark ref="inforemark"></info-remark>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {REPORT} from 'common/api/report.js';
  import {common, formateDate, hideCharAtNumber, clearSearchForm} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import handOutRemark from 'components/sc/contractStudents/handOutRemark';
  import infoRemark from 'components/report/zhaoAgentList/infoRemark';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md'?11: 15,
        Search: {
          name: '',
          subject: '',
          createDateStart:'',
          createDateEnd:''
        },
        subjectList: [],
        columns: [
          {
            title: '序号',
            align:'center',
            type:'index',
            width: 40
          },
          {
            title: '学生姓名',
            key: 'leadsName',
            align:'center',
            width: 90
          },
          {
            title: '手机号',
            key: 'leadsPhone',
            align:'center',
            width: 120,
            render : (h, params) => {
              if(params.row.leadsPhone) {
                return h('div',[
                  h('span',hideCharAtNumber(params.row.leadsPhone)),
                ])
              }else{
                return '-';
              }
            }
          },
          {
            title: '负责CR',
            key: 'crName',
            align:'center',
            width: 90
          },
          {
            title: '科目',
            key: 'subject',
            align:'center',
            width: 90
          },
          {
            title: '最初分数',
            key: 'firstScore',
            align:'center',
            width: 90
          },
          {
            title: '最高分数',
            key: 'maxSscore',
            align:'center',
            width: 90
          },
          {
            title: '最高分数时间',
            key: 'maxSscoreTime',
            align:'center',
            width: 90,
            render(h, params) {
              return h('span',formateDate(params.row.maxSscoreTime,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '签单时间',
            key: 'createDate',
            align:'center',
            width: 90,
            render(h, params) {
              return h('span',formateDate(params.row.createDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
        ]
      }
    },
    mounted() {
      const _this = this;
      this.search();
//      获取所有科目
      common.ajax({
        url: COMMON_API().allSubject,
        method: 'get',
        success: function (res) {
          _this.subjectList = res.data || [];
        }
      });
    },
    methods: {
      search(val) {
          if(val) this.pageIndex = val;
        this.loadDataGrid({
          name: this.Search.name,
          subject: this.Search.subject,
          createDateStart: this.Search.createDateStart,
          createDateEnd: this.Search.createDateEnd,
        });
      },
      // getStudentHistoryInfo(leadsPhone){
      //   const that = this;
      //   common.ajax({
      //     url: REPORT().Leads.getStudentHistoryInfo + `?leadsPhone=${leadsPhone}`,
      //     method: 'get',
      //     success: function (res) {
      //       that.historyRemarkList = res.data || [];
      //       that.$refs.inforemark.show();
      //     }
      //   });
      // },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        const _this = this;
        common.ajax({
          url: REPORT().Student.queryLeadsScorePage,
          method: 'get',
          data:{
            leadsParams:search.name,
            subject:search.subject,
            createDateStart:search.createDateStart,
            createDateEnd:search.createDateEnd,
            pageIndex:_this.pageIndex,
            pageNumber:_this.pageNumber,
          },
          success: function (res) {
            _this.data = res.data['leadsScoreList'] || [];
            _this.total = res.data['total'];
          }
        });
      },
      changeDate(value) {
        this.Search.createDateStart = value[0] || '';
        this.Search.createDateEnd = value[1] || '';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.search();
      }
    },
    components: { OBreadcrumb ,handOutRemark,infoRemark,PageModel}
  };
</script>

<style>

</style>
