<template>
<div>
  <o-breadcrumb second="师资管理" third="课程课耗-兼职"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="24">
        <i-input :size="$store.state.searchModuleSize" v-model="Search.tcName" @on-keyup.enter="searchForm(1)" placeholder="老师姓名" style="width:150px;margin-right:2px;"></i-input>
        <i-input :size="$store.state.searchModuleSize" v-model="Search.phone" @on-keyup.enter="searchForm(1)" placeholder="手机号" style="width:150px;margin-right: 2px;"></i-input>
        <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-start" @on-change="changePushDate" placeholder="上课日期" style="width: 200px"></Date-picker>
        <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
      </i-col>
    </Row>
  </div>
  <i-table size="small" highlight-row stripe :columns="columns" :data="data"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>
</div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {TEACHER} from 'common/api/teacher.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';
  export default{
    data() {
      return {
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        Search: {
          tcName: '',
          phone: '',
          createDateStart: '',
          createDateEnd: '',
        },
        columns: [
          {
            title: '老师姓名',
            key: 'tcName',
            align:'center',
            // render (row, column, index) {
            //   return `<strong><a href="javascript:;" @click="viewDetail('${row.natureOfWorkDesc}','${row.teacherUuid}')">${row.tcName}</a></strong>`;
            // },
            render:(h,params) => {
              return h('div',[
                h('strong',[
                  h('a',{
                    on:{
                      click:() => {
                        this.viewDetail(params.row.natureOfWorkDesc,params.row.teacherUuid)
                      }
                    }
                  },params.row.tcName)
                ])
              ])
            }
          },
          {
            title: '手机号',
            key: 'phone',
            align:'center',
            // render (row, column, index) {
            //   return hideCharAtNumber(row.phone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.teacherUuid}')" class="eye" title="显示全部"></Icon>`;
            // },
            render : (h, params) => {
              if(params.row.phone) {
                return h('div',[
                  h('span',hideCharAtNumber(params.row.phone)),
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
          {
            title: '工作性质',
            key: 'natureOfWorkDesc',
            align:'center',
          },
          {
            title: '已上课时 (h)',
            key: 'finishCount',
            align:'center',
          },
          {
            title: '预上课时 (h)',
            key: 'unfinishCount',
            align:'center',
          },
          {
            title: '饱和度（%）',
            key: 'saturationLevel',
            align:'center',
            // render (row, column, index) {
            //     return row.saturationLevel+'%'
            // },
            render:(h,params) => {
              return h('div',[
                h('span',{},params.row.saturationLevel+'%')
              ])
            }
          },
          {
            title: '操作',
            align: 'center',
            // render (row, column, index) {
            //   return `<i-button type="success" size="small" @click="viewCourseCr('${row.teacherUuid}','${row.tcName}')">查看课程</i-button>`;
            // },
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    // icon: 'paper-airplane',
                  },
                  attrs: {
                    title: '查看课程',
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.viewCourseCr(params.row.teacherUuid, params.row.tcName);
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
      viewDetail(natureOfWorkDesc, uuid) {
        if(natureOfWorkDesc && natureOfWorkDesc.indexOf('兼职') !== -1) {
          GLOBAL.redirectTo('/teacher/viewTeacherDetailByJianzhi',uuid);
        }else if(natureOfWorkDesc && natureOfWorkDesc.indexOf('全职') !== -1) {
          GLOBAL.redirectTo('/teacher/viewTeacherDetailByQuanzhi',uuid);
        }else{
          common.msg('工作性质为空，无法查看详情');
        }
      },
      getFullPhone(teacherUuid) {
        const _this = this;
        common.ajax({
          url: TEACHER().Public.displayPhone,
          method: 'get',
          data: { uuid: teacherUuid, moduleName: '师资管理-课程课耗-全职'},
          success: function (res) {
            _this.$Modal.info({
              content: (res.data !== null) ? res.data.phone : ''
            });
          }
        })
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          tcName: this.Search.tcName,
          phone: this.Search.phone,
          createDateStart: this.Search.createDateStart,
          createDateEnd: this.Search.createDateEnd,
          natureOfWork:1,
        });
      },
      loadDataGrid(search) {
        let param = `?tcName=${search.tcName}&phone=${search.phone}&natureOfWork=${search.natureOfWork}`;
        param += `&courseDateStart=${search.createDateStart}&courseDateEnd=${search.createDateEnd}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}`;
        const _this = this;
        common.ajax({
          url: TEACHER().JianSchedule.queryTeacherCoursePage + param,
          method: 'get',
          success: function(response){
            _this.data = response.data.teacherList || [];
            _this.total = response.data.total;
          }
        });
      },
      viewCourseCr(uuid,name) {
        sessionStorage.setItem('template_Schedule', uuid);
        sessionStorage.setItem('template_teacherName', name);
        location.hash = '/teacher/teacherSchedule';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      changePushDate(value) {
        this.Search.createDateStart = value[0] || '';
        this.Search.createDateEnd = value[1] || '';
      },
    },
    components: {
      OBreadcrumb,PageModel
    }
  };
</script>

<style>

</style>
