<template>
  <div class="waitFollowedManager">
    <o-breadcrumb second="销售与客服" third="本月已续费"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <i-input :size="$store.state.searchModuleSize" v-model="Search.paramStr" @on-keyup.enter="searchForm(1)" placeholder="学生\手机号" style="width:150px;margin-right: 2px;"></i-input>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.grade" clearable  placeholder="年级" style="width:80px;">
            <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
          <i-button :size="$store.state.searchModuleSize" type="ghost" @click="clearSarchForm">重置</i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" :height="theight" stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :current="pageIndex" :total="total" :page-size="pageNumber" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
    <hand-out-remark @reFresh="reFresh"  ref="handOutRemark"></hand-out-remark>
  </div>

</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {SCS} from 'common/api/scs.js';
  import {formateDate,common,hideCharAtNumber,hideCharAtStr,getFullPhone,clearSearchForm} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import handOutRemark from 'components/sc/contractStudents/handOutRemark';
  import PageModel from 'dashborader/page/page.vue';

  const $localStorage = $.localStorage;
  export default{
    data() {
      return {
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 9: 15,
        gradeList: [],//年级
        Search: {
          paramStr: '',
          grade: '',//年级
        },
        columns: [
          {
            title: '序号',
            type: 'index',
            width: 60,
            fixed: 'left',
            align: 'center'
          },
          {
            title: '学生',
            key: 'leadsName',
            width: 90,
            fixed: 'left',
            render : (h, params) => {
            return h('div',[
              h('a',{
                on:{
                  click:()=>{
                  GLOBAL.viewLeadsDetail(params.row.leadsUuid,'','cr')
              }
          }
      },params.row.leadsName)
    ])
//              return `<strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.leadsUuid}','','cr')">${row.leadsName}</a></strong>`;
            }
          },
          {
            title: '手机号',
            key: 'leadsPhone',
            align:'center',
            width: 150,
            render : (h, params) => {
              if(params.row.leadsPhone) {

                return h('div',[
                  h('span',hideCharAtNumber(params.row.leadsPhone)),
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
                      this.getFullPhone(params.row.leadsPhone)
                  }
              }
              })
              ])
//                return hideCharAtNumber(row.leadsPhone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.leadsPhone}')" class="eye" title="显示全部"></Icon>`;
              }else{
                return '-';
              }
            }
          },
          {
            title: '跟进提醒',
            key: 'followUpReminding',
            align:'center',
            minWidth: 90,
            render : (h, params) => {
              if(params.row.followUpReminding > 30){
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag red'
                    }
                  },params.row.followUpReminding + '天未跟进')
                ])
//            return `<span class="o-tag red">${row.followDays}天未跟进</span>`;
              }else if(params.row.followUpReminding == 0){
                return ``;
              }else {
                return h('div',[
                  h('span',{},params.row.followUpReminding + '天未跟进')
                ])
//            return `<span>${row.followDays}天未跟进</span>`;
              }
            }
          },
          {
            title: '年级',
            key: 'grade',
            align:'center',
            minWidth: 90
          },
          {
            title: '省',
            key: 'province',
            align:'center',
            minWidth: 90
          },
          {
            title: '市',
            key: 'city',
            align:'center',
            minWidth: 90
          },
          {
            title: '区',
            key: 'district',
            align:'center',
            minWidth: 90
          },
          {
            title: '新签时间',
            key: 'signDate',
            align:'center',
            minWidth: 180,
            render(h, params) {
              return h('span',formateDate(params.row.signDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '最新跟进记录',
            key: 'followUpDesc',
            align:'center',
            minWidth: 120,
            render : (h, params) => {
              let content = params.row.followUpDesc;
              if(content && content.length>38) {
                content = content.slice(0,37)+'...';
                return h('div',[
                  h('span',{
                    attrs:{
                      title:params.row.followUpDesc
                    }
                  },content)
                ])
//                return `<span title="${row.followUpDesc}">${content}</span>`;
              } else {
                return h('span',content);
              }
            }
          },
          {
            title: '停课提醒',
            key: 'stopCourseReminding',
            align:'center',
            minWidth: 90,
            render : (h, params) => {
              if(params.row.stopCourseReminding > 30){
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag red'
                    }
                  },params.row.stopCourseReminding+'天未上课')
                ])
//            return `<span class="o-tag red">${row.suspClasses}天未上课</span>`;
              }else if(params.row.stopCourseReminding == 0){
                return ``;
              } else {
                return h('div',[
                  h('span',{
                  },params.row.stopCourseReminding+'天未上课')
                ])
//            return `<span>${row.suspClasses}天未上课</span>`;
              }
            }
          },
          {
            title: '负责时间',
            key: 'repositionDate',
            align:'center',
            minWidth: 180,
            render(h, params) {
              return h('span',formateDate(params.row.repositionDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title:'移交信息',
            key: 'action',
            align:'center',
            fixed:'right',
            minWidth: 90,
            render : (h, params) => {
            return h('div',[
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                  icon: 'ios-eye',
                },
                style: {
                  margin: '2px',
                },
                attrs:{
                  title:'查看移交表'
                },
                on: {
                  click: () => {
                  this.getHandOutRemark(params.row.leadsUuid)
              }
          }
          })
          ])
//              return `<i-button type="success" icon="ios-eye" title="查看移交表" size="small" @click="getHandOutRemark('${row.leadsUuid}')"></i-button>`;
            }
          }
        ]
      }
    },
    mounted() {
      const _this = this;
      this.searchForm();

      $.getJSON("static/data.json", function (json) {
        _this.gradeList = json.gradeList;
      });
    },
    methods: {
      getFullPhone(phone) {
        getFullPhone(phone, COMMON_API().getPhoneHZ);
      },
      getHandOutRemark(leadsUuid){
        this.$refs.handOutRemark.show(leadsUuid,'get');
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          leadsParams: this.Search.paramStr,
          grade: this.Search.grade,
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?stuParams=${search.leadsParams}&grade=${search.grade}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        // common.ajax({
        //   url: SCS().MyStudent.queryCrRenewStudent + param,
        //   method: 'get',
        //   success: function(response){
        //     _this.data = response.data['studentList'] || [];
        //     _this.total = response.data.total;
        //   }
        // });
        this.$axios.get(SCS().MyStudent.queryCrRenewStudent,{
          params:{
            stuParams: search.leadsParams,
            grade: search.grade,
            pageIndex: this.pageIndex,
            pageNumber: this.pageNumber,
            orderBy: orderBy,
            sortBy: sortBy,
          }
        }).then( ({data}) => {
          _this.data = data.data['studentList'] || [];
          _this.total = data.data.total;
        })
      },
      clearSarchForm() {
        clearSearchForm(this.Search, [this.$refs.daterange]);
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
    components: {OBreadcrumb,handOutRemark,PageModel}
  };
</script>

<style>

  .ivu-input-disabled, .ivu-select-selected-value{
    color:rgba(0,0,0,1) !important;
    /*font-weight: bold;*/
  }
  input::-webkit-input-placeholder,textarea::-webkit-input-placeholder,.ivu-select-placeholder{
    color:rgba(0,0,0,.6) !important;
  }
  input::-moz-placeholder,textarea::-moz-placeholder{   /* Mozilla Firefox 19+ */
    color:rgba(0,0,0,.6) !important;
  }
  input:-moz-placeholder,textarea:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
    color:rgba(0,0,0,.6) !important;
  }
  input:-ms-input-placeholder,textarea:-ms-input-placeholder{  /* Internet Explorer 10-11 */
    color:rgba(0,0,0,.6) !important;
  }
</style>
