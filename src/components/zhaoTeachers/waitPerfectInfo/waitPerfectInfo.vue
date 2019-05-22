<template>
<div>
  <o-breadcrumb second="招师" third="待完善审核"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="24" class="right">
        <form id="searchForm">
          <i-input :size="$store.state.searchModuleSize" v-model="tcName" @on-keyup.enter="searchForm(1)" placeholder="老师姓名" style="width:150px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="phone" @on-keyup.enter="searchForm(1)" placeholder="手机号码" style="width:150px;margin-right:2px;"></i-input>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
        </form>
      </i-col>
    </Row>
  </div>
  <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
    <checkbox label="rate">完善进度</checkbox>
    <checkbox label="phone">手机号</checkbox>
    <checkbox label="email">邮箱</checkbox>
    <checkbox label="schoolLocation">院校</checkbox>
    <checkbox label="qq">QQ</checkbox>
    <checkbox label="wechat">微信</checkbox>
    <checkbox label="natureOfWorkDesc">工作性质</checkbox>
    <checkbox label="teachingSubject">第一科目</checkbox>
    <checkbox label="referral">推荐人</checkbox>
    <checkbox label="interviewDate">培训通过时间</checkbox>
  </checkbox-group>
  <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>

  <giveup @reFresh="reFresh" ref="givup" from-type="perfectInfo"></giveup>
  <inventory @reFresh="reFresh" ref="inventory"></inventory>
</div>
</template>

<script type="text/ecmascript-6">
  import {ZHAO_TEACHER,TEACHER} from 'common/api/teacher.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import giveup from 'components/zhaoTeachers/giveup';
  import inventory from './inventory';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        tableColumnsChecked:['rate','phone','email','schoolLocation','qq','wechat','natureOfWorkDesc','teachingSubject','referral','interviewDate','action'],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11: 17,
        tcName: '',
        phone: '',
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
          tcName: {
            title: '姓名',
            key: 'tcName',
            fixed: 'left',
            align:'center',
            width: 90,
            // render (row, column, index) {
            //   if(row.rate == 100){
            //     return `<strong><a href="javascript:GLOBAL.redirectTo('/teacher/teacherDetail/view/jianzhi','${row.uuid}');" style="color: #ed3f14">${row.tcName}</a></strong>`;
            //   }else{
            //     return `<strong><a href="javascript:GLOBAL.redirectTo('/teacher/teacherDetail/view/jianzhi','${row.uuid}');">${row.tcName}</a></strong>`;
            //   }
            // },
            render:(h,params) => {
              if(params.row.rate == 100){
                return h('div',[
                  h('strong',[
                    h('a', {
                      props: {

                      },
                      attrs: {
                        href:'javascript:;'
                      },
                      style: {
                        margin: '2px',
                        color:'#ed3f14'
                      },
                      on: {
                        click: () => {
                          GLOBAL.redirectTo('/teacher/viewTeacherDetailByJianzhi',params.row.uuid);
                        }
                      },
                    },params.row.tcName)
                  ])
                ])
              }else{
                return h('div',[
                  h('strong',[
                    h('a', {
                      props: {

                      },
                      attrs: {
                        href:'javascript:;'
                      },
                      style: {
                        margin: '2px',
                      },
                      on: {
                        click: () => {
                          GLOBAL.redirectTo('/teacher/viewTeacherDetailByJianzhi',params.row.uuid);
                        }
                      },
                    },params.row.tcName)
                  ])
                ])
              }
            }
          },
          rate:{
            title: '完善进度',
            key: 'rate',
            align:'center',
            width: 90,
            render:(h,params) =>{
              return h('div',[
                h('span',{},params.row.rate+'%')
              ])
            }
          },
          phone: {
            title: '手机号',
            key: 'phone',
            align:'center',
            width: 120,
            // render (row, column, index) {
            //   return hideCharAtNumber(row.phone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.uuid}')" class="eye" title="显示全部"></Icon>`;
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
          email: {
            title: '邮箱',
            key: 'email',
            align: 'center',
            width: 155
          },
          schoolLocation: {
            title: '院校',
            key: 'schoolLocation',
            align: 'center',
            width: 120
          },
          qq: {
            title: 'QQ',
            key: 'qq',
            align: 'center',
            width: 120
          },
          wechat: {
            title: '微信',
            key: 'wechat',
            align: 'center',
            width: 120
          },
          natureOfWorkDesc: {
            title: '工作性质',
            key: 'natureOfWorkDesc',
            align: 'center',
            width: 100,
          },
          teachingSubject: {
            title: '第一科目',
            key: 'teachingSubject',
            align: 'center',
            width: 90
          },
          referral: {
            title: '推荐人',
            key: 'referral',
            align: 'center',
            width: 90
          },
          interviewDate: {
            title: '培训通过时间',
            key: 'interviewDate',
            align:'center',
            width: 180,
            // render (row, column, index) {
            //   return formateDate(row.interviewDate,'yyyy-MM-dd hh:mm:ss');
            // },
            render:(h,params) =>{
              return h('div',[
                h('span',{},formateDate(params.row.interviewDate,'yyyy-MM-dd hh:mm:ss'))
              ])
            }
          },
          action: {
            title: '操作',
            align: 'center',
            width: 140,
            fixed: 'right',
            // render (row, column, index) {
            //   let one;
            //   let two;
            //   if(row.rate == 100 && row.isPass == 1){
            //     one = `<i-button type="info" size="small" disabled icon="forward" title="审核通过" @click="confirm('${row.uuid}')"></i-button>`
            //   }else if(row.rate == 100) {
            //     one = `<i-button type="info" size="small" icon="forward" title="审核通过" @click="confirm('${row.uuid}')"></i-button>`
            //   }else {
            //     one = `<i-button type="info" size="small" disabled icon="forward" title="审核通过" @click="confirm('${row.uuid}')"></i-button>`
            //   }
            //   if(row.isPass == 1){
            //     two = `<i-button type="info" size="small" icon="compose" title="入库" @click="inventory('${row.uuid}')"></i-button>`
            //   }else {
            //     two = `<i-button type="info" size="small" disabled icon="compose" title="入库" @click="inventory('${row.uuid}')"></i-button>`
            //   }
            //   return`${one}
            //   ${two}
            //   <i-button type="error" size="small" icon="trash-b" title="放弃" @click="giveup('${row.uuid}','${row.tcName}','${row.phone}')"></i-button>
            //   <i-button type="info" size="small" icon="edit" title="编辑资料" @click="editProfile('${row.uuid}','${row.id}')"></i-button>`;
            // },
            render:(h,params)=>{
//              console.log(params);
              let one;
              let two;
              if(params.row.rate == 100 && params.row.isPass == 1){
                one = h('Button',{
                  props:{
                    type:'info',
                    size:'small',
                    icon:'forward'
                  },
                  style:{
                    margin:'2px'
                  },
                  attrs:{
                    title:'审核通过',
                    disabled:true,
                  },
                  on:{
                    click:()=>{
                      this.confirm(params.row.uuid)
                    }
                  }
                })
              }else if(params.row.rate == 100) {
                one = h('Button',{
                  props:{
                    type:'info',
                    size:'small',
                    icon:'forward'
                  },
                  style:{
                    margin:'2px'
                  },
                  attrs:{
                    title:'审核通过',
                  },
                  on:{
                    click:()=>{
                      this.confirm(params.row.uuid)
                    }
                  }
                })
              }else {
                one = h('Button',{
                  props:{
                    type:'info',
                    size:'small',
                    icon:'forward'
                  },
                  style:{
                    margin:'2px'
                  },
                  attrs:{
                    title:'审核通过',
                    disabled:true,
                  },
                  on:{
                    click:()=>{
                      this.confirm(params.row.uuid)
                    }
                  }
                })
              }
              if(params.row.isPass == 1){
                two = h('Button',{
                  props:{
                    type:'info',
                    size:'small',
                    icon:'compose'
                  },
                  style:{
                    margin:'2px'
                  },
                  attrs:{
                    title:'入库',
                  },
                  on:{
                    click:()=>{
                      this.inventory(params.row.uuid)
                    }
                  }
                })
              }else {
                two = h('Button',{
                  props:{
                    type:'info',
                    size:'small',
                    icon:'compose'
                  },
                  style:{
                    margin:'2px'
                  },
                  attrs:{
                    title:'入库',
                    disabled:true,
                  },
                  on:{
                    click:()=>{
                      this.inventory(params.row.uuid)
                    }
                  }
                })
              }
              return h('div',[
                one,
                two,
                h('Button',{
                  props:{
                    type:'error',
                    size:'small',
                    icon:'trash-b'
                  },
                  style:{
                    margin:'2px'
                  },
                  attrs:{
                    title:'放弃',
                  },
                  on:{
                    click:()=>{
                      this.giveup(params.row.uuid,params.row.tcName,params.row.phone)
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
                      this.editProfile(params.row.uuid,params.row.id)
                    }
                  }
                }),
              ])
            }
          }
        };
        let datas = [columns.tcName];
        this.tableColumnsChecked.forEach(col => datas.push(columns[col]));
        return datas;
      },
      confirm (uuid) {
        const _this = this;
        this.$Modal.confirm({
          title: '审核通过',
          content: '确认审核通过',
          onOk: () => {
            common.ajax({
              url: ZHAO_TEACHER().WaitPerfectInfo.pass,
              method: 'get',
              data: { teacherUuid: uuid, isPass: 1},
              success: function (res) {
                _this.searchForm();
              }
            })
          },
          onCancel: () => {
            this.$Message.info('审核未通过通过');
          }
        });
      },
      getFullPhone(teacherUuid) {
        const _this = this;
        common.ajax({
          url: TEACHER().Public.fullPhone,
          method: 'get',
          data: { uuid: teacherUuid, moduleName: '招师-待完善资料'  },
          success: function (res) {
            _this.$Modal.info({
              content: (res.data !== null) ? res.data.phone : ''
            });
          }
        })
      },
      editProfile(uuid, id) {
        sessionStorage.setItem('template_uuid',uuid);
        sessionStorage.setItem('template_id',id);
        location.hash = '/teacher/teacherDetailByJianzhi';
      },
      giveup(uuid,ctName,phone) {
        this.$refs.givup.show(uuid,ctName,phone);
      },
      inventory(uuid) {
        this.$refs.inventory.show(uuid);
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          tcName: this.tcName,
          phone: this.phone
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?tcName=${search.tcName}&phone=${search.phone}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: ZHAO_TEACHER().WaitPerfectInfo.dataGrid + param,
          method: 'get',
          success: function (res) {
            console.log(res);
            _this.data = res.data['teacherList'] || [];
            _this.total = res.data.total;
          }
        });
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
      OBreadcrumb, giveup,inventory,PageModel
    }
  };
</script>

<style lang="less" rel="stylesheet/less">

</style>
