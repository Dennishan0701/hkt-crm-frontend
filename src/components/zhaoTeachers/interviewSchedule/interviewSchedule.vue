<template>
<div>
  <o-breadcrumb second="招师流程" third="老师面试安排"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="24" class="right">
        <i-input :size="$store.state.searchModuleSize" v-model="Search.tcName" @on-keyup.enter="searchForm(1)" placeholder="老师姓名"
                 style="width:150px;margin-right: 2px;"></i-input>
        <i-input :size="$store.state.searchModuleSize" v-model="Search.interviewAccount" @on-keyup.enter="searchForm(1)" placeholder="好视通账号"
                 style="width:150px;margin-right: 2px;"></i-input>

      </i-col>
      <i-col span="24" class="right">
        <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-end" @on-change="changeSingUpDate" placeholder="面试日期" style="width: 200px"></Date-picker>
        <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
      </i-col>
    </Row>
  </div>
  <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>

  <confirm @reFresh="reFresh" ref="confirm"></confirm>
</div>
</template>

<script type="text/ecmascript-6">
  import {ZHAO_TEACHER,TEACHER} from 'common/api/teacher.js';
  import {formateDate, common, hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import confirm from 'components/zhaoTeachers/interviewSchedule/confirm';
  import PageModel from 'dashborader/page/page.vue';
  const $sStorage = $.sessionStorage;

  export default{
    data() {
      return {
        data: [],
        total: 0,
        assignTeacherRows: [],
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11: 17,
        Search: {
          tcName: '',
          interviewAccount: '',
          interviewDateStart: '',
          interviewDateEnd: '',
        },
        columns: [
          {
            title: '老师姓名',
            key: 'tcName',
            align:'center',
            width: 90,
          },
          {
            title: '账号',
            key: 'interviewAccount',
            align:'center',
            width: 90,
          },
          {
            title: '面试日期',
            key: 'interviewDate',
            align:'center',
            width: 90,
          },
          {
            title: '面试时间',
            key: 'interviewTime',
            align:'center',
            width: 90,
          },
          {
            title: '创建时间',
            key: 'createDate',
            align:'center',
            width: 180,
            // render (row, column, index) {
            //   return formateDate(row.createDate, 'yyyy-MM-dd hh:mm:ss');
            // },
            render:(h,params) =>{
              return h('div',[
                h('span',{},formateDate(params.row.createDate,'yyyy-MM-dd hh:mm:ss'))
              ])
            }
          },
          {
            title: '更新时间',
            key: 'updateDate',
            align:'center',
            width: 180,
            // render (row, column, index) {
            //   return formateDate(row.updateDate, 'yyyy-MM-dd hh:mm:ss');
            // },
            render:(h,params) =>{
              return h('div',[
                h('span',{},formateDate(params.row.updateDate,'yyyy-MM-dd hh:mm:ss'))
              ])
            }
          },
          {
            title: '操作',
            width: 90,
            align: 'center',
            // render (row, column, index) {
            //     return `<i-button type="primary" size="small"title="修改预约面试" icon="videocamera" @click="confirm('${row.teacherUuid}','${row.tcName}','${row.interviewAccount}','${row.interviewDate}','${row.interviewTime}','${row.id}')"></i-button>`;
            // },
            render:(h,params) => {
              return h('div',[
                h('Button',{
                  props:{
                    type:'primary',
                    size:'small',
                    icon:'videocamera'
                  },
                  attrs:{
                    title:'修改预约面试'
                  },
                  style:{
                    margin:'2px'
                  },
                  on:{
                    click:()=>{
                      this.confirm(params.row.teacherUuid,params.row.tcName,params.row.interviewAccount,params.row.interviewDate,params.row.interviewTime,params.row.id)
                    }
                  }
                })
              ])
            }
          }
        ],
      }
    },
    mounted() {
      this.searchForm();
    },
    methods: {
      showSalesModal(temp) {
        console.log(temp);
        let row = this.assignTeacherRows;
        if (row.length > 0) {
          this.$refs.assign.show(temp);
        } else {
          common.msg('请选择名单', 'warning');
        }
      },
      distribution(leadsIds) {
        this.assignTeacherRows.length = 1;
        this.assignTeacherRows[0] = {"uuid": leadsIds};
        $sStorage.set('assignTeacherRows', this.assignTeacherRows);
        this.showSalesModal('one');
      },
      confirm (uuid,name,interviewAccount,data,time,id) {
        this.$refs.confirm.show(uuid,name,interviewAccount,data,time,id);
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          tcName: this.Search.tcName,
          interviewAccount: this.Search.interviewAccount,
          interviewDateStart: this.Search.interviewDateStart,
          interviewDateEnd: this.Search.interviewDateEnd,
        });
      },
      getFullPhone(teacherUuid) {
        const _this = this;
        common.ajax({
          url: TEACHER().Public.fullPhone,
          method: 'get',
          data: { uuid: teacherUuid, moduleName: '招师-待邀约'  },
          success: function (res) {
            _this.$Modal.info({
              content: (res.data !== null) ? res.data.phone : ''
            });
          }
        })
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?tcName=${search.tcName}&interviewAccount=${search.interviewAccount}&interviewDateStart=${search.interviewDateStart}&interviewDateEnd=${search.interviewDateEnd}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: ZHAO_TEACHER().interviewSchedule.dataGrid + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['scheduleList']|| [];
            _this.total = res.data.total;
          }
        });
      },
      changeSingUpDate(value) {
        this.Search.interviewDateStart = value[0] || '';
        this.Search.interviewDateEnd = value[1] || '';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      reFresh(){
        this.searchForm();
      }
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470: '';
      }
    },
    components: {OBreadcrumb, confirm,PageModel}
  };
</script>

<style>
  .ivu-select-dropdown-list {
    text-align: left;
  }
</style>
