<template>
  <div class="businessLog">
    <o-breadcrumb second="日志监控" third="业务日志"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <i-select v-model="optModule" :size="$store.state.searchModuleSize" placeholder="操作模块" filterable clearable style="width:150px">
            <i-option v-for="(item,index) in optModuleList" :key='index' :value="item.id">{{ item.name }}</i-option>
          </i-select>
          <i-select v-model="optType" :size="$store.state.searchModuleSize" placeholder="动作" filterable clearable style="width:150px">
            <i-option v-for="(item,index) in optTypeList" :value="item.id" :key='index'>{{ item.name }}</i-option>
          </i-select>
          <i-input v-model="roleName" :size="$store.state.searchModuleSize" @on-keyup.enter="search(1)" placeholder="角色名" style="width:100px;margin-right:3px;"></i-input>
          <i-input v-model="operator" :size="$store.state.searchModuleSize" @on-keyup.enter="search(1)" placeholder="操作人" style="width:100px;margin-right:3px;"></i-input>
        </i-col>
        <i-col span=24 class="right">
          <Date-picker type="daterange" :size="$store.state.searchModuleSize" @on-change="changeDate" placement="bottom-end" placeholder="选择日期和时间" style="width: 200px"></Date-picker>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="search(1)">搜索</i-button>
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
  import {COMMON_API,apiHiCRM,apiBase} from 'common/api.config.js';
  import {SYS_BUSINESS} from 'common/api/logs.js';
  import {formateDate,common} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        getBusinessLogPage:this.$store.state.getBusinessLogPage,
        getOptionModule:this.$store.state.getOptionModule,
        getOptionType:this.$store.state.getOptionType,
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
            title: '操作模块',
            key: 'optModuleDesc',
            align:'center'
          },
          {
            title: '操作类型',
            key: 'optTypeDesc',
            align:'center'
          },
          {
            title: '角色名',
            key: 'roleName',
            align:'center'
          },
          {
            title: '操作人',
            key: 'operator',
            align:'center'
          },
          {
            title: '操作时间',
            key: 'createDate',
            align:'center',
            render(h, params) {
              return h('span',formateDate(params.row.createDate, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
        ]
      }
    },
    mounted() {
      this.search();
      // const _this = this;
      // common.ajax({
      //   url: SYS_BUSINESS().allOptionModule,
      //   method: 'get',
      //   success: function (res) {
      //     _this.optModuleList = res.data || [];
      //   }
      // });

      this.$axios.get(SYS_BUSINESS().allOptionModule)
        .then( ({ data }) => {
          this.optModuleList = data.data || [];
        });

      // common.ajax({
      //   url: SYS_BUSINESS().allOptionType,
      //   method: 'get',
      //   success: function (res) {
      //     _this.optTypeList = res.data || [];
      //   }
      // });

      this.$axios.get(SYS_BUSINESS().allOptionType)
        .then( ({ data }) => {
          this.optTypeList = data.data || [];
        });
    },
    methods: {
      search(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          optModule: this.optModule,
          optType: this.optType,
          roleName: this.roleName,
          operator: this.operator,
          createDateStart: this.createDateStart,
          createDateEnd: this.createDateEnd
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        // let param = `?optModule=${search.optModule}&optType=${search.optType}&roleName=${search.roleName}&operator=${search.operator}&createDateStart=${search.createDateStart}&createDateEnd=${search.createDateEnd}`;
        // param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        // const _this = this;
        // common.ajax({
        //   url: SYS_BUSINESS().dataGrid + param,
        //   method: 'get',
        //   success: function (res) {
        //     _this.data = res.data['businessLogs'] || [];
        //     _this.total = res.data.total;
        //   }
        // });

        this.$axios.get( SYS_BUSINESS().dataGrid,{
          params:{
            optModule : search.optModule,
            optType : search.optType,
            roleName : search.roleName,
            operator : search.operator,
            createDateStart : search.createDateStart,
            createDateEnd : search.createDateEnd,
            pageIndex : this.pageIndex,
            pageNumber : this.pageNumber,
            orderBy : orderBy,
            sortBy : sortBy,
          },
        }).then( ({data}) => {
          this.data = data.data['businessLogs'] || [];
          this.total = data.data.total;
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
