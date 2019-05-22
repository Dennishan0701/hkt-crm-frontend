<template>
 <div>
   <o-breadcrumb second="招师流程" third="待邀约"></o-breadcrumb>
   <div class="grid-widget">
     <Row>
       <i-col span="24" class="right">
         <i-input :size="$store.state.searchModuleSize" v-model="Search.tcName" @on-keyup.enter="searchForm(1)" placeholder="姓名"
                  style="width:150px;margin-right: 2px;"></i-input>
         <i-input :size="$store.state.searchModuleSize" v-model="Search.phone" @on-keyup.enter="searchForm(1)" placeholder="手机号码"
                  style="width:150px;margin-right: 2px;"></i-input>
         <i-input :size="$store.state.searchModuleSize" v-model="Search.email" @on-keyup.enter="searchForm(1)" placeholder="邮箱"
                  style="width:200px;margin-right:2px;"></i-input>
         <i-input :size="$store.state.searchModuleSize" v-model="Search.referral" @on-keyup.enter="searchForm(1)"  placeholder="推荐人"
                  style="width:90px;margin-right:2px;"></i-input>
         <!--<i-select v-model="Search.haveVideo" clearable size="small" placeholder="是否发视频" style="width:100px">-->
         <!--<i-option value="1">是</i-option>-->
         <!--<i-option value="0">否</i-option>-->
         <!--</i-select>-->
       </i-col>
       <i-col span="24" class="right">
         <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-start" @on-change="changeSingUpDate"
                      placeholder="报名时间" style="width: 200px"></Date-picker>
         <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-end" @on-change="changeUpdateDate"
                      placeholder="更新时间" style="width: 200px"></Date-picker>
         <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
       </i-col>
     </Row>
   </div>
   <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
   <div class="gridPage">
     <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
     <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
   </div>

   <to-offer-material @reFresh="reFresh" ref="material"></to-offer-material>
   <giveup @reFresh="reFresh" ref="givup" from-type="waitToOffer"></giveup>
   <interview @reFresh="reFresh" ref="interview"></interview>
   <confirm @reFresh="reFresh" ref="confirm"></confirm>
   <select-assign @reFresh="reFresh" ref="assign"></select-assign>
   <send-mail @reFresh="reFresh" ref="mail"></send-mail>
 </div>
</template>

<script type="text/ecmascript-6">
  import {ZHAO_TEACHER, TEACHER} from 'common/api/teacher.js';
  import {formateDate, common, hideCharAtNumber} from 'common/js/common.js';
  import ToOfferMaterial from 'components/zhaoTeachers/waitToOffer/ToOfferMaterial';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import giveup from 'components/zhaoTeachers/giveup';
  import interview from 'components/zhaoTeachers/waitToOffer/interview';
  import confirm from 'components/zhaoTeachers/waitToOffer/confirm';
  import sendMail from 'components/zhaoTeachers/waitToOffer/sendMail';
  import selectAssign from '../waitAssignTeacher/selectAssign';
  import PageModel from 'dashborader/page/page.vue';
  const $sStorage = $.sessionStorage;

  export default{
    data() {
      return {
        data: [],
        total: 0,
        assignTeacherRows: [],
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        Search: {
          tcName: '',
          phone: '',
          email: '',
          natureOfWork: '2',
          referral: '',
          haveVideo: '',
          createDateStart: '',
          createDateEnd: '',
          updateDateStart: '',
          updateDateEnd: ''
        },
        columns: [
          {
            title: '姓名',
            key: 'tcName',
            sortable: true,
            width: 90,
            fixed: 'left',
            align: 'center',
            // render (row, column, index) {
            //   return `<Icon type="person"></Icon> <strong><a href="javascript:GLOBAL.redirectTo('/teacher/teacherDetail/view/jianzhi','${row.uuid}');">${row.tcName}</a></strong>`;
            // },
            render:(h,params)=>{
              return h('div',[
                h('Icon',{
                  props:{
                    type:'person',
                  }
                }),
                h('strong',[
                  h('a',{
                    attrs:{
                      href:'javascript:;'
                    },
                    on:{
                      click:()=>{
                        GLOBAL.redirectTo('/teacher/viewTeacherDetailByJianzhi',params.row.uuid)
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
            align: 'center',
            width: 120,
            // render (row, column, index) {
            //   return hideCharAtNumber(row.phone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.uuid}')" class="eye" title="显示全部"></Icon>`;;
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
                        this.getFullPhone(params.row.uuid)
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
            title: '邮箱',
            key: 'email',
            align: 'center',
            width: 155
          },
          {
            title: '院校',
            key: 'schoolLocation',
            align: 'center',
            width: 120
          },
          {
            title: 'QQ',
            key: 'qq',
            align: 'center',
            width: 120
          },
          {
            title: '微信号',
            key: 'wechat',
            align: 'center',
            width: 120
          },
          {
            title: '工作性质',
            key: 'natureOfWorkDesc',
            align: 'center',
            width: 120
          },
          {
            title: '科目',
            key: 'teachingSubject',
            align: 'center',
            width: 100
          },
          {
            title: '推荐人',
            key: 'referral',
            align: 'center',
            width: 90
          },
          {
            title: '是否发视频',
            key: 'haveVideoDesc',
            align: 'center',
            width: 90
          },
          {
            title: '邀约备注',
            key: 'registerRemark',
            align:'center',
            width: 180,
            // render(row,column){
            //   let content = row.registerRemark || '';
            //   if(content.length >10){
            //     content = content.slice(0,10)
            //     return `<span title=${row.registerRemark}>${content}...</span>`
            //   }else {
            //     return row.registerRemark;
            //   }
            // },
            render:(h,params)=>{
//              console.log(params.row);
              let content = params.row.registerRemark || '';
              if(content.length >10){
                content = content.slice(0,10)
                return h('div',[
                  h('span',{
                    attrs:{
                      title:params.row.registerRemark
                    }
                  },content + '...')
                ])
              }else {
                return h('div',[
                  h('span',{},params.row.registerRemark)
                ])
              }
            }
          },
          {
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
            width: 180,
          },
          {
            title: '更新时间',
            key: 'updateDate',
            align: 'center',
            width: 180,
            // render (row, column, index) {
            //   return formateDate(row.registrationTime, 'yyyy-MM-dd hh:mm:ss');
            // },
            render:(h,params) =>{
              return h('div',[
                h('span',{},formateDate(params.row.updateDate,'yyyy-MM-dd hh:mm:ss'))
              ])
            },
          },
          {
            title: '操作',
            width: 210,
            align: 'center',
            fixed: 'right',
            // render (row, column, index) {
            //   if (row.haveVideo == 1) {
            //     return `<i-button type="primary" size="small" title="已收到视频并已面试" icon="videocamera" disabled></i-button>
            //             <i-button type="info" size="small" icon="email" title="发送邮件" @click="sendMail('${row.uuid}','${row.tcName}')"></i-button>
            //             <i-button type="primary" size="small" icon="ios-chatboxes" title="备注" @click="interview('${row.uuid}')"></i-button>
            //             <i-button type="info" size="small" icon="edit" title="编辑资料" @click="reMaterial('${row.sex}','${row.uuid}','${row.tcName}','${row.phone}','${row.qq}','${row.email}','${row.wechat}','${row.idNumber}','${row.schoolUuid}')"></i-button>
            //             <i-button type="primary" size="small" icon="paper-airplane" title="分配" @click="distribution('${row.uuid}')"></i-button>
            //             <i-button type="error" size="small" icon="trash-b" title="放弃" @click="giveup('${row.uuid}','${row.tcName}','${row.phone}')"></i-button>`;
            //   } else {
            //     return `<i-button type="primary" size="small"title="确认收到视频预约面试" icon="videocamera" @click="confirm('${row.uuid}','${row.tcName}')"></i-button>
            //             <i-button type="info" size="small" icon="email" title="发送邮件" @click="sendMail('${row.uuid}','${row.tcName}')"></i-button>
            //             <i-button type="primary" size="small" icon="ios-chatboxes" title="备注" @click="interview('${row.uuid}')"></i-button>
            //             <i-button type="info" size="small" icon="edit" title="编辑资料" @click="reMaterial('${row.sex}','${row.uuid}','${row.tcName}','${row.phone}','${row.qq}','${row.email}','${row.wechat}','${row.idNumber}','${row.schoolUuid}')"></i-button>
            //             <i-button type="primary" size="small" icon="paper-airplane" title="分配" @click="distribution('${row.uuid}')"></i-button>
            //             <i-button type="error" size="small" icon="trash-b" title="放弃" @click="giveup('${row.uuid}','${row.tcName}','${row.phone}')"></i-button>`;
            //   }
            // },
            render:(h,params)=>{
              if (params.row.haveVideo == 1) {
                return h('div',[
                  h('Button',{
                    props:{
                      type:'primary',
                      size:'small',
                      icon:'videocamera'
                    },
                    style:{
                      margin:'2px'
                    },
                    attrs:{
                      title:'已收到视频并已面试',
                      disabled:true
                    },
                  }),
                  h('Button',{
                    props:{
                      type:'info',
                      size:'small',
                      icon:'email'
                    },
                    style:{
                      margin:'2px'
                    },
                    attrs:{
                      title:'发送邮件',
                    },
                    on:{
                      click:()=>{
                        this.sendMail(params.row.uuid,params.row.tcName)
                      }
                    }
                  }),
                  h('Button',{
                    props:{
                      type:'primary',
                      size:'small',
                      icon:'ios-chatboxes'
                    },
                    style:{
                      margin:'2px'
                    },
                    attrs:{
                      title:'备注',
                    },
                    on:{
                      click:()=>{
                        this.interview(params.row.uuid)
                      }
                    }
                  }),
                  h('Button',{
                    props:{
                      type:'info',
                      size:'small',
                      icon:'edit'
                    },
                    style:{
                      margin:'2px'
                    },
                    attrs:{
                      title:'编辑资料',
                    },
                    on:{
                      click:()=>{
                        this.reMaterial(params.row.sex,params.row.uuid,params.row.tcName,params.row.phone,params.row.qq,params.row.email,params.row.wechat,params.row.idNumber,params.row.schoolUuid)
                      }
                    }
                  }),
                  h('Button',{
                    props:{
                      type:'primary',
                      size:'small',
                      icon:'paper-airplane'
                    },
                    style:{
                      margin:'2px'
                    },
                    attrs: {
                      title: '分配',
                    },
                    on:{
                      click:()=>{
                        this.distribution(params.row.uuid)
                      }
                    }
                  }),
                  h('Button',{
                    props:{
                      type:'error',
                      size:'small',
                      icon:'trash-b'
                    },
                    style:{
                      margin:'2px'
                    },
                    attrs: {
                      title: '放弃',
                    },
                    on:{
                      click:()=>{
                        this.giveup(params.row.uuid,params.row.tcName,params.row.phone)
                      }
                    }
                  }),
                ])
              }else{
                return h('div',[
                  h('Button',{
                    props:{
                      type:'primary',
                      size:'small',
                      icon:'videocamera'
                    },
                    style:{
                      margin:'2px'
                    },
                    attrs:{
                      title:'确认收到视频预约面试',
                    },
                    on:{
                      click:()=>{
                        this.confirm(params.row.uuid,params.row.tcName)
                      }
                    }
                  }),
                  h('Button',{
                    props:{
                      type:'info',
                      size:'small',
                      icon:'email'
                    },
                    style:{
                      margin:'2px'
                    },
                    attrs:{
                      title:'发送邮件',
                    },
                    on:{
                      click:()=>{
                        this.sendMail(params.row.uuid,params.row.tcName)
                      }
                    }
                  }),
                  h('Button',{
                    props:{
                      type:'primary',
                      size:'small',
                      icon:'ios-chatboxes'
                    },
                    style:{
                      margin:'2px'
                    },
                    attrs:{
                      title:'备注',
                    },
                    on:{
                      click:()=>{
                        this.interview(params.row.uuid)
                      }
                    }
                  }),
                  h('Button',{
                    props:{
                      type:'info',
                      size:'small',
                      icon:'edit'
                    },
                    style:{
                      margin:'2px'
                    },
                    attrs:{
                      title:'编辑资料',
                    },
                    on:{
                      click:()=>{
                        this.reMaterial(params.row.sex,params.row.uuid,params.row.tcName,params.row.phone,params.row.qq,params.row.email,params.row.wechat,params.row.idNumber,params.row.schoolUuid)
                      }
                    }
                  }),
                  h('Button',{
                    props:{
                      type:'primary',
                      size:'small',
                      icon:'paper-airplane'
                    },
                    style:{
                      margin:'2px'
                    },
                    attrs: {
                      title: '分配',
                    },
                    on:{
                      click:()=>{
                        this.distribution(params.row.uuid)
                      }
                    }
                  }),
                  h('Button',{
                    props:{
                      type:'error',
                      size:'small',
                      icon:'trash-b'
                    },
                    style:{
                      margin:'2px'
                    },
                    attrs: {
                      title: '放弃',
                    },
                    on:{
                      click:()=>{
                        this.giveup(params.row.uuid,params.row.tcName,params.row.phone)
                      }
                    }
                  }),
                ])
              }
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
      confirm (uuid, name) {
        this.$refs.confirm.show(uuid, name);
      },
      sendMail (uuid, name) {
        this.$refs.mail.show(uuid, name);
      },
      interview(uuid) {
        this.$refs.interview.show(uuid);
      },
      reMaterial(sex, uuid, tcName, phone, qq, email, wechat, idNumber, scrool) {
        console.log(sex)
        this.$refs.material.show(sex, uuid, tcName == 'null' ? '' : tcName, phone == 'null' ? '' : phone, qq == 'null' ? '' : qq, email, wechat, idNumber, scrool);
      },
      giveup(uuid, tcName, phone) {
        this.$refs.givup.show(uuid, tcName, phone, 'waitToOffer');
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          tcName: this.Search.tcName,
          phone: this.Search.phone,
          email: this.Search.email,
          referral: this.Search.referral,
          natureOfWork: this.Search.natureOfWork,
          haveVideo: this.Search.haveVideo,
          createDateStart: this.Search.createDateStart,
          createDateEnd: this.Search.createDateEnd,
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
        let param = `?tcName=${search.tcName}&phone=${search.phone}&email=${search.email}&referral=${search.referral}&natureOfWork=${search.natureOfWork}&haveVideo=${search.haveVideo}`;
        param += `&createDateStart=${search.createDateStart}&createDateEnd=${search.createDateEnd}&updateDateStart=${search.updateDateStart}&updateDateEnd=${search.updateDateEnd}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: ZHAO_TEACHER().WaitToOffer.dataGrid + param,
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
      reFresh(){
        this.searchForm();
      }
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470 : '';
      }
    },
    components: {OBreadcrumb, ToOfferMaterial, giveup, interview, selectAssign, confirm, sendMail,PageModel}
  };
</script>

<style>
  .ivu-select-dropdown-list {
    text-align: left;
  }
</style>
