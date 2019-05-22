<template>
  <div class="businessLog">
    <o-breadcrumb second="数据报表" third="外呼明细"  four="安莱呼入号码明细(T+1)"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span=24 class="right">
          <i-input v-model="searchData.leadsParam" :size="$store.state.searchModuleSize" @on-keyup.enter="search(1)" clearable placeholder="学生姓名/手机号" style="width:150px;margin-right:3px;"></i-input>
          <i-input v-model="searchData.saleName" :size="$store.state.searchModuleSize" @on-keyup.enter="search(1)" clearable placeholder="销售姓名/手机号" style="width:150px;margin-right:3px;"></i-input>
          <i-select v-model="searchData.teamName" :size="$store.state.searchModuleSize" placeholder="团队" filterable clearable style="width:150px;margin-right:3px;">
            <i-option v-for="(item,index) in teamList" :key='index' :value="item">{{ item }}</i-option>
          </i-select>
          <!--<i-input v-model="searchData.teamName" :size="$store.state.searchModuleSize" @on-keyup.enter="search(1)" placeholder="团队" style="width:100px;margin-right:3px;"></i-input>-->
          <Date-picker v-model="dateChanges" type="daterange" :size="$store.state.searchModuleSize" @on-change="changeDate" placement="bottom-end" placeholder="呼入时间" style="width: 200px"></Date-picker>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="search(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" highlight-row stripe border :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {OUTBOUNDDETAIL} from 'common/api/outBoundDetail.js';
  import {formateDate,common} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        dateChanges:[],
        data: [],
        teamList: [],
        data1: [],
        audioModal:false,
        total: 0,
        iconPlay:true,
        pageIndex: 1,
        pageNumber: 10,
        searchData:{
          leadsParam:'',//学生姓名
          saleName:'',//销售姓名
          teamName:'',//团队姓名
        },
        startCallTime: '',
        endCallTime: '',
        columns: [
          {
            title: '序号',
            type:"index",
            minWidth:60,
            align:'center',
          },
          {
            title: '学生姓名',
            key: 'leadsName',
            align:'center',
            minWidth:90,
          },
          {
            title: '学生手机号',
            key: 'leadsPhone',
            align:'center',
            minWidth:120,
          },
          {
            title: '报名时间',
            key: 'signUpdate',
            align:'center',
            minWidth:150,
            render(h, params) {
              return h('span',formateDate(params.row.signUpdate, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '销售',
            key: 'saleName',
            align:'center',
            minWidth:90,
          },
          {
            title: '团队',
            key: 'teamName',
            align:'center',
            minWidth:90,
          },
          {
            title: '外呼时间',
            key: 'startTime',
            align:'center',
            minWidth:150,
            render(h, params) {
              return h('span',formateDate(params.row.startTime, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '外呼状态',
            key: 'isArchive',
            align:'center',
            minWidth:90,
          },
          {
            title: '通话时长',
            key: 'talkSeconds',
            align:'center',
            minWidth:90,
          },
          {
            title: '客户接听时间',
            key: 'archiveTime',
            align:'center',
            minWidth:150,
          },
          {
            title: '挂断时间',
            key: 'endTime',
            align:'center',
            minWidth:150,
          },
        ],
      }
    },
    mounted() {
      this.dateChange();
      this.search();
      this.$axios.get( OUTBOUNDDETAIL().outBoundDetail.getTeams,{})
        .then( ({data}) => {
          this.teamList = data.data['teams'] || [];
        })
    },
    methods: {
      search(val) {
        if(val) this.pageIndex = val;
        const _this = this;
        this.loadDataGrid({
          leadsParam:_this.searchData.leadsParam,
          saleName:_this.searchData.saleName,
          teamName:_this.searchData.teamName,
          startCallTime: _this.startCallTime,
          endCallTime: _this.endCallTime
        });
      },
      loadDataGrid(search) {
        this.$axios.get( OUTBOUNDDETAIL().outBoundDetail.getAnLanCallIbRecord,{
          params:{...search,
            pageIndex : this.pageIndex,
            pageNumber : this.pageNumber,
          },
        }).then( ({data}) => {
          this.data = data.data['anLanIbCallRecordDtos'] || [];
          this.total = data.data.total;
        })
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.search();
      },
      changeDate(value) {
        this.startCallTime = value[0] || '';
        this.endCallTime = value[1] || '';
      },
      dateChange(){
        var curDate = new Date();
        var lastDate = new Date(curDate.getTime() - 24*60*60*1000);
        var finalDate = lastDate.getFullYear() + '-' + (lastDate.getMonth() + 1 < 10 ? "0" +(lastDate.getMonth()+1):lastDate.getMonth()+ 1) + '-' + (lastDate.getDate() < 10 ? "0" +(lastDate.getDate()):lastDate.getDate());
        this.dateChanges[0] = finalDate;
        this.dateChanges[1] = finalDate;
        this.startCallTime = finalDate;
        this.endCallTime = finalDate;
      }
    },
    components: {OBreadcrumb,PageModel}
  };
</script>

<style>

</style>
