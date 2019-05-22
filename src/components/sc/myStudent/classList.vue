<template>
  <div class="classList">
    <o-breadcrumb second="销售与客服" third="我的学生课时"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <i-input :size="$store.state.searchModuleSize" v-model="Search.paramStr" @on-keyup.enter="searchForm(1)" placeholder="学生\手机号" style="width:150px;margin-right: 2px;"></i-input>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" :height="theight" stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {SCS} from 'common/api/scs.js';
  import {formateDate,common,hideCharAtNumber,hideCharAtStr,getFullPhone} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
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
            minWidth: 40,
            align: 'center'
          },
          {
            title: '学生',
            key: 'name',
            minWidth: 90,
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
                      GLOBAL.viewLeadsDetail(params.row.leadUuid,'','cr')
                    }
                  }
                },params.row.name)
              ])
//              return `<strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.leadUuid}','','cr')">${row.name}</a></strong>`;
            }
          },
          {
            title: '手机号',
            key: 'phone',
            align:'center',
            minWidth: 120,
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
                        this.getFullPhone(params.row.phone)
                      }
                    }
                  })
                ])
//                return hideCharAtNumber(row.phone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.phone}')" class="eye" title="显示全部"></Icon>`;
              }else{
                return '-';
              }
            }
          },
          {
            title: '购买课时（h）',
            key: 'buyLength',
            align:'center',
            minWidth: 90
          },
          {
            title: '赠送课时（h）',
            key: 'giveLength',
            align:'center',
            minWidth: 90
          },
          {
            title: '消耗购买课时（h）',
            key: 'consumeBuyLength',
            align:'center',
            minWidth: 90
          },
          {
            title: '消耗赠送课时（h）',
            key: 'consumeGiveLength',
            align:'center',
            minWidth: 90
          },
          {
            title: '剩余课时（h）',
            key: 'residueLength',
            align:'center',
            minWidth: 90
          },
          {
            title: '剩余购买课时（h）',
            key: 'residueBuyLength',
            align:'center',
            minWidth: 90
          },
          {
            title: '剩余赠送课时（h）',
            key: 'residueGiveLength',
            align:'center',
            minWidth: 90
          },
        ]
      }
    },
    mounted() {
      this.searchForm();
    },
    methods: {
      getFullPhone(phone) {
        getFullPhone(phone, COMMON_API().getPhoneHZ);
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          leadsParams: this.Search.paramStr,
          grade: this.Search.grade,
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
//        let param = `?word=${search.leadsParams}`;
//        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
//         common.ajax({
//           url: SCS().MyStudent.classList+'?word='+search.leadsParams+'&pageIndex='+_this.pageIndex+'&pageNumber='+_this.pageNumber,
// //          dataType:'json',
//           method:'get',
// //          data:{
// //            word:search.leadsParams,
// //            pageIndex:_this.pageIndex,
// //            pageNumber:_this.pageNumber,
// //          },
//           success: function(response){
//             _this.data = response.data['classList'] || [];
//             _this.total = response.data.total;
//           }
//         });
        this.$axios.get( SCS().MyStudent.classList,{
          params:{
            word:search.leadsParams,
            pageIndex:_this.pageIndex,
            pageNumber:_this.pageNumber,
          }
        }).then( ({data}) => {
          _this.data = data.data['classList'] || [];
          _this.total = data.data.total;
        })
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470: '';
      }
    },
    components: {OBreadcrumb,PageModel}
  };
</script>

<style>
</style>
