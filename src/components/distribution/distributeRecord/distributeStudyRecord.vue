<template>
<div>
  <o-breadcrumb second="分配管理" third="分配正式生记录"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="24" class="left">
        <form id="searchForm">
          <i-input v-model="Search.name" :size="$store.state.searchModuleSize" placeholder="学生姓名" style="width:150px;margin-right:2px;"></i-input>
          <i-input v-model="Search.phone" :size="$store.state.searchModuleSize" placeholder="学生手机号" style="width:150px;margin-right:2px;"></i-input>
          <i-input v-model="Search.distributeUser" :size="$store.state.searchModuleSize" placeholder="分配销售" style="width:150px;margin-right:2px;"></i-input>
          <i-input v-model="Search.channelLevel" :size="$store.state.searchModuleSize" placeholder="渠道等级" style="width:100px;margin-right:2px;"></i-input>
          <i-select v-model="Search.distributeType" :size="$store.state.searchModuleSize" clearable  placeholder="分配类别" style="width:100px;">
            <i-option value="2">正式生</i-option>
            <i-option value="3">离职名单</i-option>
            <i-option value="6">正式生再分配</i-option>
          </i-select>
        </form>
      </i-col>
      <i-col span=24>
        <Date-picker type="daterange" :size="$store.state.searchModuleSize" placement="bottom-start" @on-change="changeOperateDate" placeholder="操作时间" style="width: 200px"></Date-picker>
        <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索</i-button>
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
  import {DISTRIBUTE} from 'common/api/distribute.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
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
          name: '',
          phone: '',
          distributeUser: '',
          channelLevel: '',
          distributeType: '',
          operateStartTime: '',
          operateEndTime: ''
        },
        columns: [
          {
            title: '学生',
            key: 'leadsName',
            align: 'center',
            minWidth:90,
            render : (h, params) => {
             return h('div',[
               h('a',{
                 on:{
                   click:()=>{
                   GLOBAL.viewLeadsDetail(params.row.leadsUuid)
                  }
                 }
               },params.row.leadsName)
             ])
//              return `<strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.leadsUuid}');">${row.leadsName}</a></strong>`;
            }
          },
          {
            title: '手机号',
            key: 'leadsPhone',
            align: 'center',
            minWidth:120,
            render(h, params) {
              return h('span',hideCharAtNumber(params.row.leadsPhone));
            }
          },
          {
            title: '分配销售',
            align: 'center',
            key: 'saleUserName',
            minWidth:90,
          },
          {
            title: '分配团队',
            align: 'center',
            minWidth:90,
            key: 'distributeTeamName'
          },
          {
            title: '渠道等级',
            align: 'center',
            key: 'channelLevel',
            minWidth:90,
          },
          {
            title: '操作时间',
            align: 'center',
            key: 'distributeTime',
            minWidth:150,
            render(h, params) {
              return h('span',formateDate(params.row.distributeTime,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '本团队分配者',
            align: 'center',
            key: 'distributer',
            minWidth:90,
          },
          {
            title: '新正式生分配者',
            align: 'center',
            key: 'teamDistributer',
            minWidth:90,
          },
          {
            title: '类别',
            align: 'center',
            key: 'type',
            minWidth:150,
          }
        ]
      }
    },
    mounted() {
      this.searchForm();
    },
    methods: {
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          name: this.Search.name,
          phone: this.Search.phone,
          channelLevel: this.Search.channelLevel ? this.Search.channelLevel.toLocaleUpperCase() : '',
          distributeUser: this.Search.distributeUser,
          distributeType: this.Search.distributeType,
          operateStartTime: this.Search.operateStartTime,
          operateEndTime: this.Search.operateEndTime
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?name=${search.name}&phone=${search.phone}&distributeUser=${search.distributeUser}&channelLevel=${search.channelLevel}`;
        param += `&distributeType=${search.distributeType}&operateStartTime=${search.operateStartTime}&operateEndTime=${search.operateEndTime}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        // common.ajax({
        //   url: DISTRIBUTE().distributeRecordStudy + param,
        //   method: 'get',
        //   success: function (res) {
        //     _this.data = res.data['distributeRecordVos'] || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get(DISTRIBUTE().distributeRecordStudy,{
          params:{
            name: search.name,
            phone: search.phone,
            distributeUser: search.distributeUser,
            channelLevel: search.channelLevel,
            distributeType: search.distributeType,
            operateStartTime: search.operateStartTime,
            operateEndTime: search.operateEndTime,
            pageIndex: this.pageIndex,
            pageNumber: this.pageNumber,
            orderBy:orderBy,
            sortBy:sortBy,
          }
        }).then( ({data}) => {
          _this.data = data.data['distributeRecordVos'] || [];
          _this.total = data.data.total;
        })
      },
      changeOperateDate(value) {
        this.Search.operateStartTime = value[0] || '';
        this.Search.operateEndTime = value[1] || '';
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
    components: { OBreadcrumb ,PageModel}
  };
</script>

<style>

</style>
