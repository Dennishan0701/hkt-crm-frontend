<template>
  <div class="mc">
    <o-breadcrumb second="数据报表" third="在读学员"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span=24 class="right">
          <i-input :size="$store.state.searchModuleSize" v-model="Search.name" @on-keyup.enter="search(1)" placeholder="学生姓名/手机" style="width:120px;margin-right:2px;"></i-input>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.grade" clearable placeholder="年级" style="width:80px;">
            <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.ccName" @on-keyup.enter="search(1)" placeholder="签单CC" style="width:100px;margin-right:2px;"></i-input>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.ccTeamUuid" clearable placeholder="所属CC团队" style="width:90px;">
            <i-option v-for="(item,index) in ccTeamList" :key='index' :value="item.uuid">{{ item.name }}</i-option>
          </i-select>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.crName" @on-keyup.enter="search(1)" placeholder="跟进CR" style="width:100px;margin-right:2px;"></i-input>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.crTeamUuid" clearable placeholder="所属CR团队" style="width:90px;">
            <i-option v-for="(item,index) in crTeamList" :key='index' :value="item.uuid">{{ item.name }}</i-option>
          </i-select>
          <!--<i-input v-model="Search.crTeam" @on-keyup.enter="search" size="small" placeholder="所属CR团队" style="width:100px;margin-right:2px;"></i-input>-->

          <Date-picker :size="$store.state.searchModuleSize" type="daterange" @on-change="changeHandOutDate" placement="bottom-end" ref="handeout" placeholder="报名时间" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="search" @click="search(1)">搜索</i-button>
        </i-col>
        <i-col span=24 class="right">
          <!--<i-button type="primary" icon="ios-download-outline" size="small" @click="exportExcel">导出</i-button>-->
        </i-col>
      </Row>
    </div>
    <i-table size="small" stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
    <hand-out-remark ref="handOutRemark"></hand-out-remark>
    <info-remark ref="inforemark" :history-remark-list="historyRemarkList"></info-remark>
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
        crTeamList:[],
        ccTeamList:[],
        historyRemarkList:[],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md'?11: 15,
        Search: {
          name: '',
          grade: '',
          ccName: '',
          crName: '',
          crTeamUuid: '',
          ccTeamUuid: '',
          handOutStartTime: '',
          handOutEndTime: ''
        },
        gradeList: [],
        columns: [
          {
            title: '序号',
            align:'center',
            type:'index',
            width: 60
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
            title: '年级',
            key: 'grade',
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
            title: '签单CC',
            key: 'ccName',
            align:'center',
            width: 90
          },
          {
            title: '所属CC团队',
            key: 'ccTeam',
            align:'center',
            width: 90
          },
          {
            title: '跟进CR',
            key: 'crName',
            align:'center',
            width: 90
          },
          {
            title: '所属CR团队',
            key: 'crTeam',
            align:'center',
            width: 90
          },
          {
            title: '移交时间',
            key: 'handOutTime',
            align:'center',
            width: 150,
            render(h, params) {
              return h('span',formateDate(params.row.handOutTime,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '学生购买课时长',
            key: 'stuBuyLength',
            align:'center',
            width: 150,
          },
          {
            title: '学生剩余课时长',
            key: 'stuRestLength',
            align:'center',
            width: 150,
          },
          {
            title: '操作',
            key: 'handOutTime',
            align:'center',
            width: 150,
            render : (h, params) => {
            return h('div',[
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                  icon: 'ios-eye',
                },
                style: {
                  margin: '2px',
                },
                attrs:{
                  title:'查看移交表'
                },
                on: {
                  click: () => {
                  this.getHandOutRemark(params.row.leadsUuid)
              }
          }
      }),
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
//              return `<i-button type="success" icon="ios-eye" title="查看移交表" size="small" @click="getHandOutRemark('${row.leadsUuid}')"></i-button>
//                      <i-button type="warning" size="small" icon="social-twitch-outline" title="获取历史备注信息" @click="getStudentHistoryInfo('${row.leadsPhone}')"></i-button>`
            }
          },
        ]
      }
    },
    mounted() {
      const _this = this;
      this.search();
//      获取cc团队
      common.ajax({
        url: COMMON_API().ccTeamList,
        method: 'get',
        success: function (res) {
          _this.ccTeamList = res.data || [];
        }
      });
//      获取cr团队
      common.ajax({
        url: COMMON_API().crTeamList,
        method: 'get',
        success: function (res) {
          _this.crTeamList = res.data || [];
        }
      });
      $.getJSON("static/data.json", function (json) {
        _this.gradeList = json.gradeList;
      });
    },
    methods: {
//      查看移交表
      getHandOutRemark(leadsUuid){
        this.$refs.handOutRemark.show(leadsUuid,'get');
      },
      search(val) {
          if(val) this.pageIndex = val;
        this.loadDataGrid({
          name: this.Search.name,
          grade: this.Search.grade,
          ccName: this.Search.ccName,
          crName: this.Search.crName,
          crTeamUuid: this.Search.crTeamUuid,
          ccTeamUuid: this.Search.ccTeamUuid,
          handOutStartTime: this.Search.handOutStartTime,
          handOutEndTime: this.Search.handOutEndTime,
          keyPoint:''
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
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?keyPoint=${search.keyPoint}&leadsParam=${search.name}&grade=${search.grade}&ccName=${search.ccName}&crName=${search.crName}`;
        param += `&crTeamUuid=${search.crTeamUuid}&ccTeamUuid=${search.ccTeamUuid}&signUpStartTime=${search.handOutStartTime}&signUpEndTime=${search.handOutEndTime}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: REPORT().Sale.getStudentByStatus + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['studentByStatusServerDtos'] || [];
            _this.total = res.data['total'];
          }
        });
      },
      changeHandOutDate(value) {
        this.Search.handOutStartTime = value[0] || '';
        this.Search.handOutEndTime = value[1] || '';
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
