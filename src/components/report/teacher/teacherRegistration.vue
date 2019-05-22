<template>
  <div class="mc">
    <o-breadcrumb second="数据报表" third="老师报名数据"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span=24 class="right">
          <i-input :size="$store.state.searchModuleSize" v-model="Search.tcName" @on-keyup.enter="search(1)" placeholder="姓名" style="width:100px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.phone" @on-keyup.enter="search(1)" placeholder="手机号码" style="width:100px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.invitationUser" @on-keyup.enter="search(1)" placeholder="邀约人" style="width:120px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.interviewUser" @on-keyup.enter="search(1)" placeholder="面试人" style="width:120px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.email" @on-keyup.enter="search(1)" placeholder="邮箱" style="width:150px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.wechat" @on-keyup.enter="search(1)" placeholder="微信号" style="width:150px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.referral" @on-keyup.enter="search(1)" placeholder="推荐人" style="width:100px;margin-right:2px;"></i-input>
        </i-col>
        <i-col span=24 class="right">
          <i-select :size="$store.state.searchModuleSize" v-model="Search.natureOfWorkKey" ref='natureOfWorkKey' clearable placeholder="工作性质" style="width:100px">
            <i-option value="1">社招全职</i-option>
            <i-option value="2">兼职</i-option>
            <i-option value="3">校招全职</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.teacherStatus" clearable placeholder="状态" style="width:150px">
            <i-option value="0">待邀约</i-option>
            <i-option value="1">待面试</i-option>
            <i-option value="2">待培训</i-option>
            <i-option value="3">待完善资料</i-option>
            <i-option value="4">待第二次培训</i-option>
            <i-option value="5">讲师可排课</i-option>
            <i-option value="6">讲师不可排课</i-option>
            <i-option value="20">回收站</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.teachingSubjectKey" filterable clearable ref='teachingSubjectKey' placeholder="科目" style="width:90px">
            <i-option v-for="(item,index) in subjectList" :key='index' :value="item.uuid">{{ item.enumValue }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.schoolLocationKey" filterable clearable ref='schoolLocationKey' placeholder="院校" style="width:200px">
            <i-option v-for="(item,index) in schoolList" :key='index' :value="item.uuid">{{ item.schoolName }}</i-option>
          </i-select>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-end" @on-change="changeRegistrationDate" ref='registerDate' placeholder="报名时间" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="search" @click="search(1)">搜索</i-button>
          <i-button :size="$store.state.searchModuleSize" type="ghost" @click="clearSearch">重置</i-button>
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
  import {REPORT} from 'common/api/report.js';
  import {TEACHER} from 'common/api/teacher.js';
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
          tcName: '',
          invitationUser: '',
          interviewUser: '',
          email: '',
          phone: '',
          wechat: '',
          teachingSubjectKey: '',
          schoolLocationKey: '',
          natureOfWorkKey: '',
          referral: '',
          registrationTimeStart: '',
          registrationTimeEnd: '',
          teacherStatus: ''
        },
        schoolList: [],
        subjectList: [],
        columns: [
          {
            title: '姓名',
            key: 'tcName',
            width: 90,
            align:'center',
            render : (h, params) => {
                if(params.row.natureOfWork == 2){

        return h('div',[
          h('a',{
            on:{
              click:()=>{
              GLOBAL.redirectTo('/teacher/viewTeacherDetailByJianzhi',params.row.uuid)
          }
      }
      },params.row.tcName)
      ])
//                  return `<strong><a href="javascript:GLOBAL.redirectTo('/teacher/teacherDetail/view/jianzhi','${row.uuid}');">${row.tcName}</a></strong>`;
                }else {

        return h('div',[
          h('a',{
            on:{
              click:()=>{
              GLOBAL.redirectTo('/teacher/viewTeacherDetailByQuanzhi',params.row.uuid)
          }
      }
      },params.row.tcName)
      ])
//                  return `<strong><a href="javascript:GLOBAL.redirectTo('/teacher/teacherDetail/view/quanzhi','${row.uuid}');">${row.tcName}</a></strong>`;
                }
            }
          },
          {
            title: '手机号',
            key: 'phone',
            width: 120,
            align:'center',
            render : (h, params) => {

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
                  this.getFullPhone(params.row.uuid)
              }
          }
          })
          ])
//              return hideCharAtNumber(row.phone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.uuid}')" class="eye" title="显示全部"></Icon>`;
            }
          },
          {
            title: '院校',
            key: 'schoolLocation',
            align:'center',
            width: 120
          },
          {
            title: '科目',
            key: 'teachingSubject',
            align:'center',
            width: 90
          },
          {
            title: '工作性质',
            key: 'natureOfWorkDesc',
            align:'center',
            width: 90
          },
          {
            title: '推荐人',
            key: 'referral',
            align:'center',
            width: 90
          },
          {
            title: '报名时间',
            key: 'registrationTime',
            align:'center',
            width: 135,
            render(h, params) {
              return h('span',formateDate(params.row.registrationTime,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '邀约人',
            key: 'invitationUser',
            align:'center',
            width: 90
          },
          {
            title: '面试人',
            key: 'interviewUser',
            align:'center',
            width: 90
          },
          {
            title: '邮箱',
            key: 'email',
            align:'center',
            width: 90
          },
          {
            title: '状态',
            align:'center',
            key: 'teacherStatusDesc',
            width: 120
          }
        ]
      }
    },
    mounted() {
      const _this = this;
      this.search();
      common.ajax({
        url: COMMON_API().allSchool,
        method: 'get',
        success: function (response) {
          _this.schoolList = response.data || [];
        }
      });
      common.ajax({
        url: TEACHER().Detail.getAllSubject,
        method: 'get',
        success: function (res) {
          _this.subjectList = res.data || [];
        }
      });
    },
    methods: {
      getFullPhone(teacherUuid) {
        const _this = this;
        common.ajax({
          url: REPORT().Teacher.fullPhone,
          method: 'get',
          data: { uuid: teacherUuid ,moduleName: '老师报名数据' },
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
          tcName: this.Search.tcName,
          invitationUser: this.Search.invitationUser,
          interviewUser: this.Search.interviewUser,
          email: this.Search.email,
          phone: this.Search.phone,
          wechat: this.Search.wechat,
          teachingSubject: this.Search.teachingSubjectKey,
          schoolLocation: this.Search.schoolLocationKey,
          natureOfWork: this.Search.natureOfWorkKey,
          referral: this.Search.referral,
          registrationTimeStart: this.Search.registrationTimeStart,
          registrationTimeEnd: this.Search.registrationTimeEnd,
          teacherStatus: this.Search.teacherStatus
        });
      },
      clearSearch() {
        clearSearchForm(this.Search,[this.$refs.registerDate, this.$refs.teachingSubjectKey], this);
        this.search();
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?wechat=${search.wechat}&tcName=${search.tcName}&invitationUser=${search.invitationUser}&interviewUser=${search.interviewUser}&email=${search.email}&phone=${search.phone}&teachingSubject=${search.teachingSubject}&schoolLocation=${search.schoolLocation}&natureOfWork=${search.natureOfWork}&referral=${search.referral}&registrationTimeStart=${search.registrationTimeStart}&registrationTimeEnd=${search.registrationTimeEnd}&teacherStatus=${search.teacherStatus}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: REPORT().Teacher.teacherRegistration + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['teacherList'] || [];
            _this.total = res.data.total;
          }
        });
      },
      changeRegistrationDate(value) {
        this.Search.registrationTimeStart = value[0] || '';
        this.Search.registrationTimeEnd = value[1] || '';
      },
      pageChange(pageIndex) {
      	this.pageIndex = pageIndex;
      	this.search();
      }
    },
    components: { OBreadcrumb ,PageModel}
  };
</script>

<style>

</style>
