<template>
 <div>
   <o-breadcrumb second="招师流程" third="待分配老师"></o-breadcrumb>
   <div class="grid-widget">
     <Row>
       <i-col span="4">
         <i-button :size="$store.state.searchModuleSize" type="primary" icon="paper-airplane" @click="showSalesModal">批量分配</i-button>
       </i-col>
       <i-col span="20" class="right">
         <i-input :size="$store.state.searchModuleSize" v-model="Search.tcName" @on-keyup.enter="searchForm(1)" placeholder="姓名"
                  style="width:150px;margin-right: 2px;"></i-input>
         <i-input :size="$store.state.searchModuleSize" v-model="Search.phone" @on-keyup.enter="searchForm(1)" placeholder="手机号码"
                  style="width:150px;margin-right: 2px;"></i-input>
         <i-input :size="$store.state.searchModuleSize" v-model="Search.email" @on-keyup.enter="searchForm(1)" placeholder="邮箱"
                  style="width:200px;margin-right:2px;"></i-input>
         <i-input :size="$store.state.searchModuleSize" v-model="Search.referral" @on-keyup.enter="searchForm(1)" placeholder="推荐人"
                  style="width:90px;margin-right:2px;"></i-input>
         <i-input :size="$store.state.searchModuleSize" v-model="Search.invitationUser" @on-keyup.enter="searchForm(1)" placeholder="邀约人"
                  style="width:90px;margin-right:2px;"></i-input>
         <i-select :size="$store.state.searchModuleSize" v-model="Search.invitationIsNull" clearable placeholder="是否已经分配" style="width:100px">
           <i-option value="true">已分配</i-option>
           <i-option value="false">未分配</i-option>
         </i-select>
         <i-select :size="$store.state.searchModuleSize" v-model="Search.teachingSubject" clearable placeholder="科目" style="width:100px">
           <i-option v-for='(item,index) in subjectList' :key='index' :value="item.uuid">{{item.enumName}}</i-option>
         </i-select>
       </i-col>
       <i-col span="24" class="right">
         <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-start" @on-change="changeSingUpDate"
                      placeholder="报名时间" style="width: 200px"></Date-picker>
         <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-end" @on-change="changeUpdateDate"
                      placeholder="更新时间" style="width: 200px"></Date-picker>
         <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
         <i-button :size="$store.state.searchModuleSize" type="primary" icon="paper-airplane" @click="showAll">按条件分配</i-button>
       </i-col>
     </Row>
   </div>
   <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
     <checkbox label="phone">手机号</checkbox>
     <checkbox label="email">邮箱</checkbox>
     <checkbox label="schoolLocation">院校</checkbox>
     <checkbox label="qq">QQ</checkbox>
     <checkbox label="wechat">微信号</checkbox>
     <checkbox label="natureOfWorkDesc">工作性质</checkbox>
     <checkbox label="teachingSubject">科目</checkbox>
     <checkbox label="referral">推荐人</checkbox>
     <checkbox label="haveVideoDesc">是否发视频</checkbox>
     <checkbox label="registrationTime">报名时间</checkbox>
     <checkbox label="updateDate">更新时间</checkbox>
   </checkbox-group>
   <i-table size="small" :height="theight" highlight-row stripe @on-selection-change="getSelections"
            @on-select-all="getSelectionAll" :columns="columns" :data="data"></i-table>
   <div class="gridPage">
     <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
     <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
   </div>
   <select-assign @reFresh="reFresh" ref="assign"></select-assign>
 </div>

</template>

<script type="text/ecmascript-6">
  import {ZHAO_TEACHER, TEACHER} from 'common/api/teacher.js';
  import {formateDate, common, hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import selectAssign from './selectAssign';
  import PageModel from 'dashborader/page/page.vue';
  const $sStorage = $.sessionStorage;

  export default{
    data() {
      return {
        data: [],
        tableColumnsChecked:['tcName','phone','email','schoolLocation','qq','wechat','natureOfWorkDesc','teachingSubject','referral','haveVideoDesc','registrationTime','updateDate','action'],
        total: 0,
        assignTeacherRows: [],
        subjectList: [],
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        Search: {
          tcName: '',
          invitationUser: '',
          invitationIsNull: '',
          phone: '',
          email: '',
          natureOfWork: '2',
          referral: '',
          teachingSubject: '',
          haveVideo: '',
          createDateStart: '',
          createDateEnd: '',
          updateDateStart: '',
          updateDateEnd: ''
        },
        columns: [],
      }
    },
    mounted() {
      this.searchForm();
      this.changeTableColumns();
      const _this = this;
      common.ajax({
        url: TEACHER().Public.getAllSubject,
        method: 'get',
        success: function (res) {
          _this.subjectList = res.data||[];
        }
      })
    },
    methods: {
      getTableColumns () {
        const columns = {
          selection:{
          fixed: 'left',
            type: 'selection',
          minWidth: 40,
          align: 'center'
        },
          tcName:{
          title: '姓名',
            key: 'tcName',
          sortable: true,
            minWidth: 90,
          fixed: 'left',
          align: 'center',
          // render (row, column, index) {
          //   return `<Icon type="person"></Icon> <strong><a href="javascript:GLOBAL.redirectTo('/teacher/teacherDetail/view/jianzhi','${row.uuid}');">${row.tcName}</a></strong>`;
          // },
          render:(h,params) => {
            return h('div',[
              h('Icon',{
                props:{
                  type:'person',
                  size:'',
                  icon:''
                },
                attrs:{
                  title:''
                },
                style:{
                  margin:'2px'
                }
              }),
              h('strong',[
                h('a',{
                  props:{
                    size:'',
                    icon:''
                  },
                  attrs:{
                    title: ''
                  },
                  style:{
                    margin:'2px'
                  },
                  on:{
                    click:()=>{
                      GLOBAL.redirectTo("/teacher/viewTeacherDetailByJianzhi",params.row.uuid);
                    }
                  }
                },params.row.tcName)
              ]),
            ])
          }
        },
          phone:{
          title: '手机号',
            key: 'phone',
          align: 'center',
            minWidth: 120,
          // render (row, column, index) {
          //   return hideCharAtNumber(row.phone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.uuid}')" class="eye" title="显示全部"></Icon>`;;
          // },
          render:(h,params) => {
            return h('div',[
              h('span',hideCharAtNumber(params.row.phone)),
              h('i',{
                attrs:{
                  title:"显示全部",
                  class:'ivu-icon ivu-icon-ios-eye',
                },
                style:{
                  margin:'2px',
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
          }
        },
          email:{
          title: '邮箱',
            key: 'email',
          align: 'center',
            minWidth: 155
        },
          schoolLocation:{
          title: '院校',
            key: 'schoolLocation',
          align: 'center',
            minWidth: 120
        },
        qq:{
          title: 'QQ',
            key: 'qq',
          align: 'center',
          minWidth: 120
        },
          wechat:{
          title: '微信号',
            key: 'wechat',
          align: 'center',
            minWidth: 120
        },
          natureOfWorkDesc:{
          title: '工作性质',
            key: 'natureOfWorkDesc',
          align: 'center',
            minWidth: 120
        },
          teachingSubject:{
          title: '科目',
            key: 'teachingSubject',
          align: 'center',
            minWidth: 100
        },
          referral:{
          title: '推荐人',
            key: 'referral',
          align: 'center',
            minWidth: 90
        },
          haveVideoDesc:{
          title: '是否发视频',
            key: 'haveVideoDesc',
          align: 'center',
            minWidth: 90
        },
          registrationTime:{
          title: '报名时间',
            key: 'registrationTime',
          align: 'center',
          // render (row, column, index) {
          //   return formateDate(row.registrationTime, 'yyyy-MM-dd hh:mm:ss');
          // },
          render:(h,params) =>{
            return h('div',[
              h('span',{},formateDate(params.row.registrationTime,'yyyy-MM-dd hh:mm:ss'))
            ])
          },
            minWidth: 180,
        },
          updateDate:{
          title: '更新时间',
            key: 'updateDate',
          align: 'center',
            minWidth: 180,
          // render (row, column, index) {
          //   return formateDate(row.registrationTime, 'yyyy-MM-dd hh:mm:ss');
          // },
          render:(h,params) =>{
            return h('div',[
              h('span',{},formateDate(params.row.updateDate,'yyyy-MM-dd hh:mm:ss'))
            ])
          },
        },
        // {
        //   title: '&nbsp;',
        //   key: '',
        //   width: 30,
        // },
        action:{
          title: '操作',
          key:'action',
          minWidth: 90,
          align: 'center',
          fixed: 'right',
          // render (row, column, index) {
          //   return `<i-button type="primary" size="small" icon="paper-airplane" @click="distribution('${row.uuid}')">分配</i-button>`;
          // },
          render : (h, params) => {
            return h('div',[
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  icon: 'paper-airplane',
                },
                attrs: {
                  title: '分配',
                },
                style: {
                  margin: '2px',
                },
                on: {
                  click: () => {
                    this.distribution(params.row.uuid);
                  }
                }
              })
            ])
          }
        }
        };
        let datas = [columns.selection];
        this.tableColumnsChecked.forEach(col => {
          datas.push(columns[col]);
          // console.log(datas);
        });
        return datas;
      },
      getSelections(selection) {
        $sStorage.set('assignTeacherRows', selection);
        this.assignTeacherRows = selection;
      },
      getSelectionAll(selection) {
        $sStorage.set('assignTeacherRows', selection);
        this.assignTeacherRows = selection;
      },
      showAll(){
        this.$refs.assign.show('all',this.Search);
      },
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
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          tcName: this.Search.tcName,
          invitationUser: this.Search.invitationUser,
          invitationIsNull: this.Search.invitationIsNull,
          phone: this.Search.phone,
          email: this.Search.email,
          referral: this.Search.referral,
          natureOfWork: this.Search.natureOfWork,
          haveVideo: this.Search.haveVideo,
          createDateStart: this.Search.createDateStart,
          createDateEnd: this.Search.createDateEnd,
          teachingSubject: this.Search.teachingSubject,
          updateDateStart: this.Search.updateDateStart,
          updateDateEnd: this.Search.updateDateEnd
        });
      },
      getFullPhone(teacherUuid) {
        const _this = this;
        common.ajax({
          url: TEACHER().Public.fullPhone,
          method: 'get',
          data: {uuid: teacherUuid, moduleName: '招师-待邀约'},
          success: function (res) {
            _this.$Modal.info({
              content: (res.data !== null) ? res.data.phone : ''
            });
          }
        })
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?teachingSubject=${search.teachingSubject}&tcName=${search.tcName}&invitationUser=${search.invitationUser}&invitationIsNull=${search.invitationIsNull}&phone=${search.phone}&email=${search.email}&referral=${search.referral}&natureOfWork=${search.natureOfWork}&haveVideo=${search.haveVideo}`;
        param += `&createDateStart=${search.createDateStart}&createDateEnd=${search.createDateEnd}&updateDateStart=${search.updateDateStart}&updateDateEnd=${search.updateDateEnd}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: ZHAO_TEACHER().waitAssignTeacher.dataGrid + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['teacherList'] || [];
            _this.total = res.data.total;
          }
        });
      },
      changeUpdateDate(value) {
        this.Search.updateDateStart = value[0] || '';
        this.Search.updateDateEnd = value[1] || '';
      },
      changeSingUpDate(value) {
        this.Search.createDateStart = value[0] || '';
        this.Search.createDateEnd = value[1] || '';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      changeTableColumns () {
        this.columns = this.getTableColumns();
      },
      reFresh(){
        this.searchForm();
      }
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470 : '';
      }
    },
    components: {OBreadcrumb, selectAssign,PageModel}
  };
</script>

<style>
  .ivu-select-dropdown-list {
    text-align: left;
  }
</style>
