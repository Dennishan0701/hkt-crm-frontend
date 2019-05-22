<template>
  <div>
    <o-breadcrumb second="招师" third="待面试"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <form id="searchForm">
            <i-input :size="$store.state.searchModuleSize" v-model="Search.tcName" @on-keyup.enter="searchForm(1)" placeholder="老师姓名" style="width:90px;margin-right: 2px;"></i-input>
            <i-input :size="$store.state.searchModuleSize" v-model="Search.phone" @on-keyup.enter="searchForm(1)" placeholder="手机号码" style="width:120px;margin-right:2px;"></i-input>
            <i-select :size="$store.state.searchModuleSize" v-model="Search.interviewResult" clearable placeholder="是否二次面试" style="width:100px">
              <i-option value="true">是</i-option>
              <i-option value="false">否</i-option>
            </i-select>
            <i-input :size="$store.state.searchModuleSize" v-model="Search.email" @on-keyup.enter="searchForm(1)" placeholder="邮箱" style="width:200px;margin-right:2px;"></i-input>
            <i-input :size="$store.state.searchModuleSize" v-model="Search.referral" @on-keyup.enter="searchForm(1)" placeholder="推荐人" style="width:90px;margin-right:2px;"></i-input>

          </form>
        </i-col>
        <i-col span="24" class="right">
            <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-start" @on-change="changeSingUpDate" placeholder="报名时间" style="width: 200px"></Date-picker>
            <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-end" @on-change="changeUpdateDate" placeholder="更新时间" style="width: 200px"></Date-picker>
            <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
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
      <checkbox label="invitationUser">邀约人</checkbox>
    </checkbox-group>
    <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
    <giveup @reFresh="reFresh" ref="givup" from-type="interview"></giveup>
    <interview @reFresh="reFresh" ref="interview"></interview>
  </div>
</template>

<script type="text/ecmascript-6">
  import {ZHAO_TEACHER,TEACHER} from 'common/api/teacher.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import interview from 'components/zhaoTeachers/waitInterview/interview';
  import giveup from 'components/zhaoTeachers/giveup';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        tableColumnsChecked:['phone','email','schoolLocation','qq','wechat','natureOfWorkDesc','teachingSubject','referral','haveVideoDesc','registrationTime','updateDate','invitationUser','action'],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11: 17,
        Search: {
          tcName: '',
          phone: '',
          email: '',
          referral: '',
          natureOfWork: '2',
          interviewResult: '',
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
    },
    methods: {
      getTableColumns () {
        const columns = {
          tcName:{
            title: '姓名',
            key: 'tcName',
            fixed: 'left',
            align:'center',
            minWidth: 120,
            // render (row, column, index) {
            //   return `<strong><a href="javascript:GLOBAL.redirectTo('/teacher/teacherDetail/view/jianzhi','${row.uuid}');">${row.tcName}</a></strong>`;
            // },
            render:(h,params) => {
              return h('div',[
                h('strong',[
                  h('a',{
                    on:{
                      click:() => {
                        GLOBAL.redirectTo('/teacher/viewTeacherDetailByJianzhi',params.row.uuid);
                      }
                    }
                  },params.row.tcName)
                ])
              ])
            }
          },
          phone:{
            title: '手机号',
            key: 'phone',
            align:'center',
            className:'tdHeight',
            minWidth: 120,
            // render (row, column, index) {
            //   return hideCharAtNumber(row.phone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.uuid}')" class="eye" title="显示全部"></Icon>`;
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
            minWidth: 180,
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
            align:'center',
            minWidth: 120,
            // render (row, column, index) {
            //   if (row.haveVideoDesc == "是") {
            //     return '<span class="o-tag green">是</span>';
            //   } else {
            //     return '<span class="o-tag black">否</span>';
            //   }
            // },
            render:(h,params)=>{
              if (params.row.haveVideoDesc == "是") {
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag green',
                    }
                  },'是')
                ])
              }else{
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag black',
                    }
                  },'否')
                ])
              }
            }
          },
          registrationTime:{
            title: '报名时间',
            key: 'registrationTime',
            align:'center',
            minWidth: 180,
            // render (row, column, index) {
            //   return formateDate(row.registrationTime,'yyyy-MM-dd hh:mm:ss');
            // }
            render:(h,params) =>{
              return h('div',[
                h('span',{},formateDate(params.row.registrationTime,'yyyy-MM-dd hh:mm:ss'))
              ])
            }
          },
          updateDate:{
            title: '更新时间',
            key: 'updateDate',
            align:'center',
            minWidth: 180,
            // render (row, column, index) {
            //   return formateDate(row.updateDate,'yyyy-MM-dd hh:mm:ss');
            // }
            render:(h,params) =>{
              return h('div',[
                h('span',{},formateDate(params.row.updateDate,'yyyy-MM-dd hh:mm:ss'))
              ])
            }
          },
          invitationUser:{
            title: '邀约人',
            key: 'invitationUser',
            align:'center',
            minWidth: 100,
          },
          // {
          //   title: '&nbsp;',
          //   key: '',
          //   width: 30,
          // },
          action:{
            title: '操作',
            key:'action',
            align: 'center',
            minWidth: 150,
            fixed: 'right',
            // render (row, column, index) {
            //   return `<i-button type="info" size="small" icon="edit" title="编辑资料" @click="editProfile('${row.uuid}','${row.id}')"></i-button>
            //     <i-button type="primary" size="small" icon="ios-chatboxes" title="面试" @click="interview('${row.uuid}','${row.tcName}','${row.phone}')"></i-button>
            //     <i-button type="error" size="small" icon="trash-b" title="放弃" @click="giveup('${row.uuid}','${row.tcName}','${row.phone}')"></i-button>`;
            // },
            render:(h,params)=>{
              return h('div',[
                h('Button',{
                  props: {
                    type: 'info',
                    size: 'small',
                    icon: 'edit',
                  },
                  attrs: {
                    title: '编辑资料',
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.editProfile(params.row.uuid,params.row.id);
                    }
                  }
                }),
                h('Button',{
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'ios-chatboxes',
                  },
                  attrs: {
                    title: '面试',
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.interview(params.row.uuid,params.row.tcName,params.row.phone);
                    }
                  }
                }),
                h('Button',{
                  props: {
                    type: 'error',
                    size: 'small',
                    icon: 'trash-b',
                  },
                  attrs: {
                    title: '放弃',
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.giveup(params.row.uuid,params.row.tcName,params.row.phone);
                    }
                  }
                })
              ])
            }
          }
        };
        let datas = [columns.tcName];
        this.tableColumnsChecked.forEach(col => {
          datas.push(columns[col]);
          // console.log(datas);
        });
        return datas;
      },
      confirmVideo(uuid) {
        const _this = this;
        this.$Modal.confirm({
          title: '确认',
          content: '您确认收到了视频？',
          onOk() {
            common.ajax({
              url: ZHAO_TEACHER().WaitInterview.isHaveVideo,
              data: {
                uuid: uuid,
                interviewResult: 1
              },
              success: function(response){
                common.notices('操作成功！');
                _this.searchForm();
              }
            });
          }
        });
      },
      giveup(uuid,tcName,phone) {
        this.$refs.givup.show(uuid,tcName,phone);
      },
      editProfile(uuid, id) {
        sessionStorage.setItem('template_uuid',uuid);
        sessionStorage.setItem('template_id',id);
        location.hash = '/teacher/teacherDetailByJianzhi';
      },
      interview(uuid,tcName,phone) {
        this.$refs.interview.show(uuid,tcName,phone);
      },
      getFullPhone(teacherUuid) {
        const _this = this;
        common.ajax({
          url: TEACHER().Public.fullPhone,
          method: 'get',
          data: { uuid: teacherUuid, moduleName: '招师-待面试'  },
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
          email: this.Search.email,
          referral: this.Search.referral,
          natureOfWork: this.Search.natureOfWork,
          interviewResult: this.Search.interviewResult,
          createDateStart: this.Search.createDateStart,
          createDateEnd: this.Search.createDateEnd,
          updateDateStart: this.Search.updateDateStart,
          updateDateEnd: this.Search.updateDateEnd
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?tcName=${search.tcName}&phone=${search.phone}&email=${search.email}&referral=${search.referral}&natureOfWork=${search.natureOfWork}&interviewResult=${search.interviewResult}`;
        param += `&createDateStart=${search.createDateStart}&createDateEnd=${search.createDateEnd}&updateDateStart=${search.updateDateStart}&updateDateEnd=${search.updateDateEnd}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: ZHAO_TEACHER().WaitInterview.dataGrid + param,
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
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470: '';
      }
    },
    components: {
      OBreadcrumb, interview, giveup,PageModel
    }
  };
</script>

<style>
  .tdHeight{
    height: 59px;
  }
</style>
