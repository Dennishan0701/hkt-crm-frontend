<template>
<div>
  <o-breadcrumb second="客户端管理" third="意见反馈"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="24" class="right">
        <Date-picker type="daterange" :size="$store.state.searchModuleSize" placement="bottom-end" @on-change="changeUpdateDate" placeholder="上课日期" style="width: 200px"></Date-picker>
        <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索</i-button>
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
  import {CLIENT} from 'common/api/client.js';
  import {formateDate, common, hideCharAtNumber,getFullPhone} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';
  const $sStorage = $.sessionStorage;

  export default{
    data() {
      return {
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md'?11:17,
        Search: {
          courseStartDate: '',
          courseEndDate: '',
        },
        columns: [
          {
            title: '序号',
            width: 40,
            type:'index',
            align:'center',
          },
          {
            title: '反馈日期',
            key: 'feedbackDate',
            width: 90,
            align:'center',
          },
//          {
//            title: '反馈端口',
//            key: 'courseCastType',
//            width: 90,
//            align:'center',
//          },
          {
            title: '角色',
            key: 'roleName',
            width: 90,
            align:'center',
          },
          {
            title: '手机号',
            key: 'phone',
            width: 90,
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
                   fontSize:'16px',
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
            title: '反馈内容',
            key: 'content',
            width: 90,
            align:'center',
            render : (h, params) => {
              let param = params.row.content == null ? '' : params.row.content;
              if(param.length>25){
                param = param.slice(0,20);
                h('div',[
                  h('span',{
                    attrs:{
                      title:params.row.content
                    }
                  },param)
                ])
//                return `<span title="${row.content}">${params} ...</span>`
              }else {
                return h('span',params.row.content)
              }
            }
          },
        ],
      }
    },
    mounted() {
      this.searchForm();
    },
    methods: {
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          beginTime: this.Search.courseStartDate,
          endTime: this.Search.courseEndDate,
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?beginTime=${search.beginTime}&endTime=${search.endTime}`
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        // common.ajax({
        //   url: CLIENT().clientRemark.dataGrid+ param,
        //   method: 'get',
        //   success: function (res) {
        //     _this.data = res.data['clientFeedbacks']|| [];
        //     _this.total = res.data.total;
        //   }
        // }
        this.$axios.get(CLIENT().clientRemark.dataGrid,{
          params:{
            beginTime:search.beginTime,
            endTime:search.endTime,
            pageIndex:this.pageIndex,
            pageNumber:this.pageNumber,
            orderBy:orderBy,
            sortBy:sortBy,
          }
        }).then( ({data}) => {
          _this.data = data.data['clientFeedbacks']|| [];
          _this.total = data.data.total;
        })
      },
      getFullPhone(phone) {
        getFullPhone(phone, COMMON_API().getPhoneHZ);
      },
      changeUpdateDate(value) {
        this.Search.courseStartDate = value[0] || '';
        this.Search.courseEndDate = value[1] || '';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      }
    },
    components: {OBreadcrumb,PageModel}
  };
</script>

<style>
  .ivu-select-dropdown-list {
    text-align: left;
  }
</style>
