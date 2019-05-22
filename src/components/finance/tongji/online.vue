<template>
  <div>
    <o-breadcrumb second="财务" third="线上业绩统计"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <form id="searchForm">
            <i-input v-model="Search.studentName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm" placeholder="学生姓名"
                     style="width:150px;margin-right:2px;"></i-input>
            <i-input v-model="Search.studentPhone" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm" placeholder="学生手机号"
                     style="width:150px;margin-right:2px;"></i-input>
            <i-select v-model="Search.payType" :size="$store.state.searchModuleSize" clearable placeholder="支付方式" style="width:100px">
              <i-option value="bank">银行</i-option>
              <i-option value="taobao">淘宝</i-option>
              <i-option value="alipay">支付宝</i-option>
              <i-option value="weixin">微信</i-option>
              <i-option value="kuStaging">库分期</i-option>
              <i-option value="baiduStagin">百度分期</i-option>
              <i-option value="lovehaimi">爱海米分期</i-option>
            </i-select>
            <i-input v-model="Search.saleName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="所属销售"
                     style="width:150px;margin-right:2px;"></i-input>
            <i-input v-model="Search.teamName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="所属团队"
                     style="width:150px;margin-right:2px;"></i-input>
          </form>
        </i-col>
        <i-col span=24 class=right>
          <Date-picker type="daterange" :size="$store.state.searchModuleSize" placement="bottom-end" @on-change="changeSubmitDate"
                       placeholder="成交时间" style="width: 200px"></Date-picker>
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
  import {COMMON_API} from 'common/api.config.js';
  import {FINANCE} from 'common/api/finance.js';
  import {formateDate, common, hideCharAtNumber, getFullPhone} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: 10,
        Search: {
          studentName: '',
          studentPhone: '',
          checkStartTime: '',
          checkEndTime: '',
          payType: '',
          saleName: '',
          teamName: '',
        },
        columns: [
          {
            title: '订单号',
            key: 'payNo',
            align: 'center',
            minWidth: 180,
          },
          {
            title: '学生',
            key: 'leadsName',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '手机号',
            key: 'leadsPhone',
            align: 'center',
            minWidth: 120,
            render: (h, params) => {
              if (params.row.leadsPhone) {

                return h('div', [
                  h('span', hideCharAtNumber(params.row.leadsPhone)),
                  h('i', {
                    style: {
                      margin: '2px'
                    },
                    attrs: {
                      class: 'ivu-icon ivu-icon-ios-eye',
                      title: '显示全部'
                    },
                    style: {
                      fontSize: '18px',
                      verticalAlign: 'top',
                      cursor: 'pointer'
                    },
                    on: {
                      click: () => {
                        this.getFullPhone(params.row.leadsPhone)
                      }
                    }
                  })
                ])
//                return hideCharAtNumber(row.leadsPhone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.leadsPhone}')" class="eye" title="显示全部"></Icon>`;
              } else {
                return '-';
              }
            }
          },
          {
            title: '年级',
            key: 'grade',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '课时',
            key: 'courseHour',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '金额',
            key: 'money',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '所属销售',
            key: 'submitter',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '所属团队',
            key: 'teamName',
            align: 'center',
            minWidth: 120,
          },
          {
            title: '支付方式',
            key: 'payType',
            align: 'center',
            minWidth: 120,
            render(h, params) {
              if (params.row.payType === "bank") {
                return h('span','银行');
              } else if (params.row.payType === "taobao") {
                return h('span','淘宝');
              } else if (params.row.payType === "alipay") {
                return h('span','支付宝');
              } else if (params.row.payType === "weixin") {
                return h('span','微信');
              } else if (params.row.payType === "kuStaging") {
                return h('span','库分期');
              } else if (params.row.payType === "baiduStagin") {
                return h('span','百度分期');
              } else if (params.row.payType === "lovehaimi") {
                return h('span','爱海米分期');
              } else {
                return h('span',"未知渠道：" + params.row.payType);
              }
            }
          },
          {
            title: '成交时间',
            key: 'payTime',
            align: 'center',
            minWidth: 180,
            render(h, params) {
              return h('span',formateDate(params.row.payTime, 'yyyy-MM-dd hh:mm:ss'));
            }
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
          studentName: this.Search.studentName,
          studentPhone: this.Search.studentPhone,
          submitter: this.Search.submitter,
          payType: this.Search.payType,
          checkStartTime: this.Search.checkStartTime,
          checkEndTime: this.Search.checkEndTime,
          saleName: this.Search.saleName,
          teamName: this.Search.teamName,
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?studentName=${search.studentName}&studentPhone=${search.studentPhone}&payType=${search.payType}&saleName=${search.saleName}&teamName=${search.teamName}&checkStartTime=${search.checkStartTime}&checkEndTime=${search.checkEndTime}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        // common.ajax({
        //   url: FINANCE().Tongji.onlineDataGrid + param,
        //   method: 'get',
        //   success: function (res) {
        //     _this.data = res.data['deesInfoVos'] || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get( FINANCE().Tongji.onlineDataGrid + param,{
        }).then( ({data}) => {
          _this.data = data.data['deesInfoVos'] || [];
          _this.total = data.data.total;
        })
      },
      getFullPhone(phone) {
        getFullPhone(phone, COMMON_API().Phone.getFullPhone);
      },
      changeSubmitDate(value) {
        this.Search.checkStartTime = value[0] || '';
        this.Search.checkEndTime = value[1] || '';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      }
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470 : '';
      }
    },
    components: {OBreadcrumb,PageModel}
  };
</script>

<style>

</style>
