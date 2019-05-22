<template>
  <div class="businessLog">
    <o-breadcrumb second="数据报表" third="外呼明细" four="融营外呼通时通次明细"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span=24 class="right">
          <i-button style="float: left;" type="primary" :size="$store.state.searchModuleSize" icon="ios-loop-strong" @click="recoverData()">获取呼叫记录</i-button>
          <i-input v-model="searchData.userName" :size="$store.state.searchModuleSize" @on-keyup.enter="search(1)"
                   clearable placeholder="销售姓名/手机号" style="width:150px;margin-right:3px;"></i-input>
          <i-select v-model="searchData.teamUuid" :size="$store.state.searchModuleSize" placeholder="团队" filterable
                    clearable style="width:150px;margin-right:3px;">
            <i-option v-for="(item,index) in teamList" :key='index' :value="item.teamUuid">{{ item.teamName }}</i-option>
          </i-select>
          <i-select v-model="searchData.channelName" :size="$store.state.searchModuleSize" placeholder="渠道" filterable
                    clearable style="width:150px;margin-right:3px;">
            <i-option v-for="(item,index) in channelList" :key='index' :value="item.uuid">{{ item.name }}</i-option>
          </i-select>
          <!--<i-input v-model="searchData.teamName" :size="$store.state.searchModuleSize" @on-keyup.enter="search(1)" placeholder="团队" style="width:100px;margin-right:3px;"></i-input>-->
          <Date-picker v-model="dateChanges" type="daterange" :size="$store.state.searchModuleSize"
                       @on-change="changeDate" placement="bottom-end" placeholder="外呼时间"
                       style="width: 200px"></Date-picker>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="search(1)">搜索</i-button>
        </i-col>
      </Row>
      <Row style="margin-top: 10px;">
        <i-col span=24 class="left total">
          <span style="margin-left: 10px;">总计：</span>
          <span class="title">总外呼次数：</span><span>{{dataTotal.sumCallNumber ||''}}</span>
          <span class="title">总外呼人数：</span><span>{{dataTotal.sumCallPeople||''}}</span>
          <span class="title">外呼双方接听次数：</span><span>{{dataTotal.sumCallReceivedNumber||''}}</span>
          <span class="title">外呼双方接听人数：</span><span>{{dataTotal.sumCallReceivedPeopleNumber||''}}</span>
          <span class="title">外呼总通话时长(分钟)：</span><span>{{dataTotal.sumOutboundCallDuration||''}}</span>
        </i-col>
      </Row>
    </div>
    <i-table size="small" highlight-row stripe border :columns="columns" :data="data"></i-table>
    <!--<div class="gridPage">-->
      <!--<PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>-->
    <!--</div>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import {OUTBOUNDDETAIL} from 'common/api/outBoundDetail.js';
  import {formateDate, common} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';
  import {COMMON_API} from 'common/api.config.js';
  import ICol from "iview/src/components/grid/col";

  export default {
    data () {
      return {
        currentStartDate:'',
        currentEndDate:'',
        channelList:[],
        dateChanges: [],
        data: [],
        teamList: [],
        dataTotal: {},
        audioModal: false,
        total: 0,
        iconPlay: true,
        pageIndex: 1,
        pageNumber: 10,
        searchData: {
          leadsParam: '',//学生姓名
          userName: '',//销售姓名
          teamUuid: '',//团队姓名
          channelName: '',
        },
        startDate: '',
        endDate: '',
        columns: [
          {
            title: '序号',
            type: "index",
            minWidth: 60,
            align: 'center',
          },
          {
            title: '所属团队',
            key: 'teamName',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '销售姓名',
            key: 'userName',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '销售类型',
            key: 'saleType',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '总外呼次数',
            key: 'sumCallNumber',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '总外呼人数',
            key: 'sumCallPeople',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '外呼双方接听次数',
            key: 'sumCallReceivedNumber',
            align: 'center',
            minWidth: 120,
          },
          {
            title: '外呼双方接听人数',
            key: 'sumCallReceivedPeopleNumber',
            align: 'center',
            minWidth: 120,
          },
          {
            title: '外呼总通话时长(分钟)',
            key: 'sumOutboundCallDuration',
            align: 'center',
            minWidth: 120,
          },
          {
            title: '外呼接通率',
            key: 'outboundCallRate',
            align: 'center',
            minWidth: 90,
            render: (h, params) => {
              if (params.row.outboundCallRate) {
                return h ('span', params.row.outboundCallRate + '%')
              }
            }
          },
        ],
      }
    },
    mounted () {
      this.dateChange ();
      this.search ();
      // 获取团队
      this.$axios.get (OUTBOUNDDETAIL ().outBoundDetail.getAllTeam, {})
        .then (({data}) => {
          // console.log (data);
          this.teamList = data.data || [];
        })
      // 获取所有渠道
      this.$axios.get (COMMON_API ().allChannel, {})
        .then ((res) => {
          this.channelList = res.data.data || [];
        })
    },
    methods: {
      search (val) {
        if (val) this.pageIndex = val;
        const _this = this;
        this.loadDataGrid ({
          leadsParam: _this.searchData.leadsParam,
          userName: _this.searchData.userName,
          teamUuid: _this.searchData.teamUuid,
          channelUuid: _this.searchData.channelName,
          startDate: _this.startDate,
          endDate: _this.endDate
        });
      },
      loadDataGrid (search) {
        this.$axios.get (OUTBOUNDDETAIL ().outBoundDetail.callGeneralTime, {
          params: {
            ...search,
            // pageIndex: this.pageIndex,
            // pageNumber: this.pageNumber,
          },
        }).then (({data}) => {
          this.data = data.data['allUsers'] || [];
          this.dataTotal = data.data['generalTimeTotalDto'] || '';
          this.total = data.data.total;
        })
      },
      pageChange (pageIndex) {
        this.pageIndex = pageIndex;
        this.search ();
      },
      changeDate (value) {
        this.startDate = value[0] || '';
        this.endDate = value[1] || '';
      },
      dateChange () {
        var curDate = new Date ();
        var lastDate = new Date (curDate.getTime () - 24 * 60 * 60 * 1000);
        var lastDates = new Date (curDate.getTime ());
        var finalDate = lastDate.getFullYear () + '-' + (lastDate.getMonth () + 1 < 10 ? "0" + (lastDate.getMonth () + 1) : lastDate.getMonth () + 1) + '-' + (lastDate.getDate () < 10 ? "0" + (lastDate.getDate ()) : lastDate.getDate ());
        var finalDates = lastDates.getFullYear () + '-' + (lastDates.getMonth () + 1 < 10 ? "0" + (lastDates.getMonth () + 1) : lastDates.getMonth () + 1) + '-' + (lastDates.getDate () < 10 ? "0" + (lastDates.getDate ()) : lastDates.getDate ());
        this.dateChanges[0] = finalDate;
        this.dateChanges[1] = finalDate;
        this.startDate = finalDate;
        this.endDate = finalDate;
        this.currentStartDate = finalDates;
        this.currentEndDate = finalDates;
      },
      recoverData(){
        this.$axios.get (OUTBOUNDDETAIL ().outBoundDetail.releaseRecordTest, {
          params: {
            startDate: this.currentStartDate,
            endDate: this.currentEndDate
          },
        }).then ((res) => {
          console.log (res);
          common.notices('获取成功');
        })
      }
    },
    components: {
      ICol,
      OBreadcrumb, PageModel
    }
  };
</script>

<style>
  .total span {
    font-size: 13px;
  }

  .total .title {
    margin-left: 10px;
    font-weight: bold;
  }
</style>
