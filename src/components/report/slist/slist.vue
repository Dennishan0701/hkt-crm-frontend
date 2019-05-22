<template>
  <div class="mc">
    <o-breadcrumb second="数据报表" third="S名单报表"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <i-input :size="$store.state.searchModuleSize" v-model="Search.leadsName" @on-keyup.enter="searchForm(1)" placeholder="姓名" style="width:90px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.leadsPhone" @on-keyup.enter="searchForm(1)" placeholder="手机号" style="width:130px;margin-right: 2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.saleName" @on-keyup.enter="searchForm(1)" placeholder="所属销售" style="width:90px;margin-right: 2px;"></i-input>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.isManagerCourse" placeholder="是否排课" style="width:100px">
            <i-option :value="1">是</i-option>
            <i-option :value="0">否</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.isPay" placeholder="是否付费" style="width:90px">
            <i-option :value="1">是</i-option>
            <i-option :value="0">否</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.channelUuid" clearable filterable placeholder="报名渠道" style="width:172px">
            <i-option v-for="(item,index) in channelList" :key='index' :value="item.uuid">{{item.name}}</i-option>
          </i-select>
        </i-col>
        <i-col span=24 class="right">
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-start" @on-change="changePayTime" placeholder="付费时间" style="width: 200px"></Date-picker>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-start" @on-change="changeSignTime" placeholder="标记时间" style="width: 200px"></Date-picker>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-end" @on-change="changeSignUpTime" placeholder="报名时间" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" :height="iTableHeight" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {REPORT} from 'common/api/report.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: 15,
        Search: {
          leadsName: '',
          leadsPhone: '',
          saleName: '',
          isManagerCourse: '',
          isPay: '',
          payStartTime: '',
          payEndTime: '',
          signStartTime: '',
          signEndTime: '',
          channelUuid: '',
          signUpStartDate: '',
          signUpEndDate: ''
        },
        channelList: [],
        columns: [
          {
            title: '学生姓名',
            key: 'leadsName',
            align: 'center',
            minWidth:90,
            render : (h, params) => {
            return h('div',[
              h('a',{
                on:{
                  click:()=>{
                    GLOBAL.redirectTo('/scs/leadsDetailByCr',params.row.leadsUuid)
                  }
                }
              },params.row.leadsName)
            ])
//      return `<strong><a href="javascript:redirectTo('/leads/leadsDetail','${row.leadsUuid}');">${row.leadsName}</a></strong>`;
            }
          },
          {
            title: '手机号',
            align: 'center',
            key: 'leadsPhone',
            minWidth:120,
            render(h, params) {
              return h('span',hideCharAtNumber(params.row.leadsPhone));
            }
          },
          {
            title: '所属销售',
            align: 'center',
            key: 'ccName',
            minWidth:90,
          },
          {
            title: '是否排课',
            align: 'center',
            key: 'isManagerCourse',
            minWidth:60,
          },
          {
            title: '是否付费',
            align: 'center',
            key: 'isPay',
            minWidth:60,
          },
          {
            title: '付费时间',
            align: 'center',
            key: 'payTime',
            minWidth:150,
          },
          {
            title: '标记时间',
            align: 'center',
            key: 'signTime',
            minWidth:150,
            render(h, params) {
              return h('span',formateDate(params.row.signTime,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '报名渠道',
            align: 'center',
            key: 'channelName',
            minWidth:90,
          },
          {
            title: '报名时间',
            align: 'center',
            key: 'signUpTime',
            minWidth:150,
            render(h, params) {
              return h('span',formateDate(params.row.signUpTime,'yyyy-MM-dd hh:mm:ss'));
            }
          }
        ]
      }
    },
    mounted() {
      this.searchForm();
      const _this = this;
      common.ajax({
        url: COMMON_API().allChannel,
        method: 'get',
        success: function (res) {
          _this.channelList = res.data || [];
        }
      });
    },
    methods: {
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          leadsName: this.Search.leadsName,
          leadsPhone: this.Search.leadsPhone,
          saleName: this.Search.saleName,
          isManagerCourse: this.Search.isManagerCourse ? this.Search.isManagerCourse : 0,
          isPay: this.Search.isPay ? this.Search.isPay : 0,
          payStartTime: this.Search.payStartTime,
          payEndTime: this.Search.payEndTime,
          signStartTime: this.Search.signStartTime,
          signEndTime: this.Search.signEndTime,
          channelUuid: this.Search.channelUuid,
          signUpStartDate: this.Search.signUpStartDate,
          signUpEndDate: this.Search.signUpEndDate
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?leadsName=${search.leadsName}&leadsPhone=${search.leadsPhone}&saleName=${search.saleName}&isManagerCourse=${search.isManagerCourse}`;
        param += `&isPay=${search.isPay}&payStartTime=${search.payStartTime}&payEndTime=${search.payEndTime}&signStartTime=${search.signStartTime}&signEndTime=${search.signEndTime}`;
        param += `&channelUuid=${search.channelUuid}&signUpStartDate=${search.signUpStartDate}&signUpEndDate=${search.signUpEndDate}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: REPORT().S.dataGrid + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['leadsVos'] || [];
            _this.total = res.data.total;
          }
        });
      },
      changePayTime(value) {
        this.Search.payStartTime = value[0] || '';
        this.Search.payEndTime = value[1] || '';
      },
      changeSignTime(value) {
        this.Search.signStartTime = value[0] || '';
        this.Search.signEndTime = value[1] || '';
      },
      changeSignUpTime(value) {
        this.Search.signUpStartDate = value[0] || '';
        this.Search.signUpEndDate = value[1] || '';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      }
    },
    computed: {
      iTableHeight() {
        if (SCREEN_SIZE === 'md' && this.data.length > 12) {
          return 510;
        } else if (SCREEN_SIZE === 'lg' && this.data.length > 19) {
          return 820;
        } else {
          return '';
        }
      }
    },
    components: { OBreadcrumb ,PageModel}
  };
</script>

<style>

</style>
