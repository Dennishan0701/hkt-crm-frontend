<template>
  <div class="businessLog">
    <o-breadcrumb second="日志监控" third="客户端操作日志"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <!--<i-col span="24" class="right">-->
          <!--<i-select v-model="optModule" size="small" placeholder="操作模块" filterable clearable style="width:150px">-->
            <!--<i-option v-for="item in optModuleList" :value="item.id">{{ item.name }}</i-option>-->
          <!--</i-select>-->
          <!--<i-select v-model="optType" size="small" placeholder="动作" filterable clearable style="width:150px">-->
            <!--<i-option v-for="item in optTypeList" :value="item.id">{{ item.name }}</i-option>-->
          <!--</i-select>-->
          <!--<i-input v-model="roleName" @on-keyup.enter="search" size="small" placeholder="角色名" style="width:100px;margin-right:3px;"></i-input>-->
          <!--<i-input v-model="operator" @on-keyup.enter="search" size="small" placeholder="操作人" style="width:100px;margin-right:3px;"></i-input>-->
        <!--</i-col>-->
        <i-col span=24 class="right">
          <Date-picker type="daterange" :size="$store.state.searchModuleSize" @on-change="changeDate"  placement="bottom-end" placeholder="选择日期和时间" style="width: 200px"></Date-picker>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="search">搜索</i-button>
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
  import {SYS_BUSINESS} from 'common/api/logs.js';
  import {formateDate,common} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: 19,
        optModuleList: [],
        optTypeList: [],
        optModule: '',
        optType: '',
        roleName: '',
        operator: '',
        createDateStart: '',
        createDateEnd: '',
        columns: [
          {
            title: '序号',
            type:'index',
            width:40,
            align:'center'
          },
          {
            title: '用户账号',
            key: 'loginName',
            width:180,
            align:'center'
          },
          {
            title: '角色',
            key: 'userType',
            width:90,
            align:'center',
            render(h, params) {
              if(params.row.userType == 0){
                return h('span','学生')
              }else if(params.row.userType == 1){
                return h('span','老师')
              }else if(params.row.userType == 3){
                return h('span','CC')
              }else if(params.row.userType == 4){
                return h('span','CR')
              }else if(params.row.userType == 5){
                return h('span','监课')
              }else {
                return h('span',' ')
              }
            }
          },
          {
            title: '页面',
            key: 'optModuleName',
            width:90,
            align:'center'
          },
          {
            title: '模块',
            key: 'optModuleName',
            width:90,
            align:'center'
          },
          {
            title: '描述',
            key: 'optTypeName',
            width:120,
            align:'center',
          },
          {
            title: '操作时间',
            key: 'createDate',
            align:'center',
            width:180,
            render(h, params) {
              return h('span',formateDate(params.row.createDate, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
        ]
      }
    },
    mounted() {
      this.search();
//      const _this = this;
//      common.ajax({
//        url: SYS_BUSINESS().allOptionModule,
//        method: 'get',
//        success: function (res) {
//          _this.optModuleList = res.data || [];
//        }
//      });
//      common.ajax({
//        url: SYS_BUSINESS().allOptionType,
//        method: 'get',
//        success: function (res) {
//          _this.optTypeList = res.data || [];
//        }
//      });
    },
    methods: {
      search() {
        this.loadDataGrid({
//          optModule: this.optModule,
//          optType: this.optType,
//          roleName: this.roleName,
//          operator: this.operator,
          createDateStart: this.createDateStart,
          createDateEnd: this.createDateEnd
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?beginTime=${search.createDateStart}&endTime=${search.createDateEnd}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        // common.ajax({
        //   url: SYS_BUSINESS().getClientInfo + param,
        //   method: 'get',
        //   success: function (res) {
        //     _this.data = res.data['ClientOperationMonitors'] || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get(SYS_BUSINESS().getClientInfo + param,{
        }).then( ({data}) => {
          _this.data = data.data['ClientOperationMonitors'] || [];
          _this.total = data.data.total;
        })
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.search();
      },
      changeDate(value) {
        this.createDateStart = value[0] || '';
        this.createDateEnd = value[1] || '';
      }
    },
    components: {OBreadcrumb ,PageModel}
  };
</script>

<style>

</style>
