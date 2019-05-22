<template>
<div>
  <o-breadcrumb second="师资管理" third="学生评价"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="24">
        <i-input :size="$store.state.searchModuleSize" v-model="Search.teacherParams" @on-keyup.enter="searchForm(1)" placeholder="老师的姓名/手机号码" style="width:150px;margin-right:2px;"></i-input>
        <i-input :size="$store.state.searchModuleSize" v-model="Search.stuParams" @on-keyup.enter="searchForm(1)" placeholder="学生的姓名/手机号码" style="width:150px;margin-right: 2px;"></i-input>
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
  import {formateDate,common,hideCharAtNumber,getFullPhone} from 'common/js/common.js';
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
          teacherParams: '',
          stuParams: '',
          createDateStart: '',
          createDateEnd: '',
        },
        columns: [
          {
            title: '序号',
            type:'index',
            align:'center',
            width:40
          },
          {
            title: '上课日期',
            key: 'courseDate',
            align:'center',
            width:120
          },
          {
            title: '开始结束时间',
            key: 'courseTime',
            align:'center',
            width:120
          },
          {
            title: '老师',
            key: 'teacherName',
            align:'center',
            width:90
          },
          {
            title: '老师手机号',
            key: 'teacherPhone',
            align:'center',
            width:120,
            // render(row,column,index){
            //   return hideCharAtNumber(row.teacherPhone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.teacherPhone}')" class="eye" title="显示全部"></Icon>`;
            // },
            render : (h, params) => {
              if(params.row.phone) {
                return h('div',[
                  h('span',hideCharAtNumber(params.row.teacherPhone)),
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
                        this.getFullPhone(params.row.teacherPhone)
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
            title: '学生',
            key: 'stuName',
            align:'center',
            width:90
          },
          {
            title: '学生手机号',
            key: 'stuPhone',
            align:'center',
//            render(row,column,index){
//              return hideCharAtNumber(row.stuPhone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.stuPhone}')" class="eye" title="显示全部"></Icon>`;
//            },
            render : (h, params) => {
              if(params.row.phone) {
                return h('div',[
                  h('span',hideCharAtNumber(params.row.stuPhone)),
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
                        this.getFullPhone(params.row.stuPhone)
                      }
                    }
                  })
                ])
              }else{
                return '-';
              }
            },
            width:120
          },
          {
            title: '星级',
            key: 'star',
            align:'center',
            width:120,
            // render (row,column,index){
            //   let params = '';
            //   for(let i = 0;i<row.star;i++){
            //     params += '★'
            //   }
            //   return `<span class="c-success">${params}</span>`;
            // },
            render:(h,params) => {
              let val = '';
              for(let i = 0;i<params.row.star;i++){
                val += '★'
              }
              return h('div',[
                h('span',{
                  attrs:{
                    class:'c-success',
                  }
                },val)
              ])
            }
          },
          {
            title: '反馈内容',
            key: 'saturationLevel',
            align:'center',
            width:120,
            // render (row, column, index) {
            //   let params = row.appraiseContent;
            //   if(params.length >25){
            //     params = params.slice(0,15);
            //     return `<span title="${row.appraiseContent}">${params}...</span>`
            //   }else {
            //     return row.appraiseContent;
            //   }
            // },
            render: (h, params) => {
              let content = params.row.appraiseContent;
              if(content.length>25) {
                content = content.slice(0,15);
                return h('div',[
                  h('span',{
                    attrs:{
                      title:params.row.appraiseContent
                    }
                  },content)
                ])
              } else {
                return h('div',[
                  h('span',{},params.row.appraiseContent)
                ])
              }
            }
          },
          {
            title: '反馈时间',
            key: 'createDate',
            align:'center',
            width:150,
            // render (row, column, index) {
            //     return formateDate(row.createDate,'yyyy-MM-dd hh:mm:ss')
            // },
            render:(h,params) =>{
              return h('div',[
                h('span',{},formateDate(params.row.createDate,'yyyy-MM-dd hh:mm:ss'))
              ])
            }
          }
        ]
      }
    },
    mounted() {
      this.searchForm();
    },
    methods: {
//      getFullPhone(teacherUuid) {
//        const _this = this;
//        common.ajax({
//          url: TEACHER().Public.displayPhone,
//          method: 'get',
//          data: { uuid: teacherUuid, moduleName: '师资管理-课程课耗-全职'},
//          success: function (res) {
//            _this.$Modal.info({
//              content: (res.data !== null) ? res.data.phone : ''
//            });
//          }
//        })
//      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          stuParams: this.Search.stuParams,
          teacherParams: this.Search.teacherParams,
          createDateStart: this.Search.createDateStart,
          createDateEnd: this.Search.createDateEnd,
        });
      },
      loadDataGrid(search) {
        let param = `?stuParams=${search.stuParams}&teacherParams=${search.teacherParams}`;
        param += `&courseDateStart=${search.createDateStart}&courseDateEnd=${search.createDateEnd}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}`;
        const _this = this;
        common.ajax({
          url: TEACHER().courseFeedback.studentEval + param,
          method: 'get',
          success: function(response){
            _this.data = response.data.appraiseList || [];
            _this.total = response.data.total;
          }
        });
      },
      getFullPhone(phone) {
        getFullPhone(phone, COMMON_API().getPhoneHZ);
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
