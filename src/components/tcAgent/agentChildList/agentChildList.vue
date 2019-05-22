<template>
<div>
  <o-breadcrumb second="招师代理" third="我的分代理"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="24" class="right">
        <form id="searchForm">
          <i-input :size="$store.state.searchModuleSize" v-model="Search.params" @on-keyup.enter="searchForm(1)" placeholder="代理名称/手机号/代理学校" style="width:200px;margin-right:2px;"></i-input>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.agentType" clearable placeholder="招师方向" style="width:100px;">
            <i-option v-for="(item,index) in agentTypeList" :key='index' :value="item.uuid">{{item.enumName}}</i-option>
          </i-select>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
        </form>
      </i-col>
    </Row>
  </div>
  <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>
</div>
</template>

<script type="text/ecmascript-6">
  import {ZHAO_TEACHER} from 'common/api/teacher.js';
  import {formateDate,common} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';
  const $localStorage = $.localStorage;
  export default{
    data() {
      return {
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: 15,
        Search: {
          params: '',
          agentType: ''
        },
        agentTypeList: [],
        columns: [
          {
            title: '代理名称',
            key: 'agentName',
            align:'center',
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
                  GLOBAL.redirectTo('tcAgent/viewResume',params.row.uuid)
              }
          }
      },params.row.agentName)
    ])
//              return `<strong><a href="javascript:GLOBAL.redirectTo('/teacherAgent/resume/view','${row.uuid}');">${row.agentName}</a></strong>`;
            }
          },
          {
            title: '手机号',
            align:'center',
            key: 'phone',
            minWidth:120,
          },
          {
            title: '代理学校',
            align:'center',
            key: 'agentSchool',
            minWidth:90,
          },
          {
            title: '报名链接',
            align:'center',
            key: 'agentUrl',
            minWidth:120,
          },
          {
            title: '录入时间',
            align:'center',
            key: 'createDate',
            minWidth:150,
            render(h, params) {
              return h('span',formateDate(params.row.createDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '招师方向',
            align:'center',
            key: 'agentType',
            minWidth:150,
          },
          {
            title: '招师数量',
            align:'center',
            key: 'teacherCount',
            minWidth:90,
          }
        ]
      }
    },
    mounted() {
      this.searchForm();
      const _this = this;
      common.ajax({
        url: ZHAO_TEACHER().Agent.agentTypeList,
        method: 'get',
        success: function(res) {
          _this.agentTypeList = res.data;
        }
      });
    },
    methods: {
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          params: this.Search.params,
          agentType: this.Search.agentType
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let parentAgent = $localStorage.get('user').agentUuid;//10000000000000000000000000000002;
        //let param = `?agentType=${search.agentType}`;
        let param = `?params=${search.params}&agentType=${search.agentType}`;
        param += `&parentAgent=${parentAgent}&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: ZHAO_TEACHER().Agent.childAgentDataGrid + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['agentList'] || [];
            _this.total = res.data.total;
          }
        });
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      }
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470: '';
      }
    },
    components: {
      OBreadcrumb,PageModel
    }
  };
</script>

<style lang="less" rel="stylesheet/less">

</style>
