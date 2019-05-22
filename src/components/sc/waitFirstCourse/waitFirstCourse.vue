<template>
  <div>
    <o-breadcrumb second="销售与客服" third="待排第一节正式课"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <i-input :size="$store.state.searchModuleSize" v-model="paramStr" @on-keyup.enter="searchForm(1)" placeholder="学生\手机号" style="width:150px;margin-right: 2px;"></i-input>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>

    <create-course  @reFresh="reFresh" ref="create"></create-course>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {SCS} from 'common/api/scs.js';
  import {formateDate,common,hideCharAtNumber,getFullPhone} from 'common/js/common.js';
  import createCourse from 'components/sc/waitFirstCourse/createCourse';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: 15,
        paramStr: '',
        columns: [
          {
            title: '学生姓名',
            align:'center',
            key: 'name',
            minWidth:90,
            render : (h, params) => {
            return h('div',[
              h('Icon',{
                props:{
                  type:'person'
                }
              }),
              h('a',{
                on:{
                  click:()=>{
                    GLOBAL.viewLeadsDetail(params.row.leadUuid)
                  }
                }
              },params.row.name)
            ])
//              return `<Icon type="person"></Icon> <strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.leadUuid}');">${row.name}</a></strong>`;
            }
          },
          {
            title: '手机号',
            key: 'phone',
            align:'center',
            minWidth:120,
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
                  this.getFullPhone(params.row.phone)
              }
          }
          })
          ])
//              return hideCharAtNumber(row.phone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.phone}')" class="eye" title="显示全部"></Icon>`;
            }
          },
          {
            title: '年级',
            align:'center',
            key: 'grade',
            minWidth:90,
          },
          {
            title: '科目',
            align:'center',
            key: 'subject',
            minWidth:90,
          },
          {
            title: '付费时间',
            align:'center',
            key: 'payTime',
            minWidth:150,
            render(h, params) {
              return h('span',formateDate(params.row.payTime,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title:'操作',
            key: 'action',
            align:'center',
            minWidth:120,
            render : (h, params) => {
              if(params.row.courseOrderUuid) {
                return h('div',[
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs:{
                      title:''
                    },
                    on: {
                      click: () => {
                      this.createCourse(params.row.leadUuid,params.row.courseOrderUuid,params.row.payUuid,params.row.courseRequestUuid,params.row.teacherUuid)
                  }
              }
              },'开课')
              ])
//                return `<i-button type="primary" size="small" @click="createCourse('${row.leadUuid}','${row.courseOrderUuid}','${row.payUuid}','${row.courseRequestUuid}','${row.teacherUuid}')">开课</i-button>`;
              }else{
                return h('div',[
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs:{
                      title:''
                    },
                    on: {
                      click: () => {
                      this.appointment(params.row.leadUuid,'0')
                  }
              }
              },'预约课程')
              ])
                return `<i-button type="success" size="small" @click="appointment('${row.leadUuid}','0')">预约课程</i-button>`;
              }
            }
          }
        ]
      }
    },
    mounted() {
      this.loadDataGrid({
        name: '',
        phone: ''
      });
    },
    methods: {
      getFullPhone(phone) {
        getFullPhone(phone, COMMON_API().getPhoneHZ, function(){});
      },
      createCourse(leadsUuid,courseorderUuid,payUuid,courseRequestUuid,teacherUuid) {
        this.$refs.create.show(leadsUuid,courseorderUuid,payUuid,courseRequestUuid,teacherUuid);
      },
      appointment(uuid,orderType) {
        sessionStorage.setItem('appointment_leadsUuid', uuid);
        sessionStorage.setItem('appointment_orderType', orderType);
        sessionStorage.setItem('appointment_parent_menu_name', '待排第一节正式课');
        sessionStorage.setItem('appointment_parent_menu_url', '/leads/waitFirstCourse');
        window.location.hash = '/scs/appointment';
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?name=${search.name}&phone=${search.phone}&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        let apiUrl = SCS().WaitFirstCourse.dataGrid+param;
        const that = this;
        // common.ajax({
        //   url: apiUrl,
        //   method: 'get',
        //   success: function(response){
        //     that.data = response.data.students || [];
        //     that.total = response.data.total;
        //   }
        // });
        this.$axios.get(SCS().WaitFirstCourse.dataGrid,{
          params:{
            name:search.name,
            phone:search.phone,
            pageIndex:this.pageIndex,
            pageNumber:this.pageNumber,
            orderBy:orderBy,
            sortBy:sortBy,
          },
        }).then( ({data}) => {
          that.data = data.data.students || [];
          that.total = data.data.total;
        })
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        let paramStr = this.paramStr;
        let name = '',phone = '';
        if(!paramStr) paramStr = '';
        if (isNaN(paramStr)) {
          name = paramStr;
        } else {
          phone = paramStr;
        }
        this.loadDataGrid({
          name: name,
          phone: phone
        });
      },
      pageChange(pageIndex){
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      reFresh(){
        this.searchForm();
      }
    },
    components: {
      OBreadcrumb, createCourse,PageModel
    }
  };
</script>

<style>

</style>
