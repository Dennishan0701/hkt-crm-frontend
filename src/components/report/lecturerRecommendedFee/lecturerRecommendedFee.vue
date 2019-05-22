<template>
  <div class="mc">
    <o-breadcrumb second="数据报表" third="讲师推荐费"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span=24 class="right">
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" @on-change="changeDate" placement="bottom-end" placeholder="选择日期" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="search" @click="search">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" :height="iTableHeight" highlight-row stripe :columns="columns" :data="data"></i-table>
    <!--<div class="gridPage">-->
    <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    <!--</div>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import {REPORT} from 'common/api/report.js';
  import {common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';

  export default{
    data() {
      return {
        startTime: '',
        endTime: '',
        data: [],
        total: 0,
        columns: [
          {
            title: '讲师姓名',
            align:'center',
            key: 'tcName',
            minWidth:90,
          },
          {
            title: '讲师手机号',
            align:'center',
            key: 'phone',
            minWidth:120,
            render(h, params) {
              return h('span',hideCharAtNumber(params.row.phone));
            }
          },
          {
            title: '报名人数',
            align:'center',
            minWidth:90,
            key: 'registCount',
          },
          {
            title: '入库人数',
            align:'center',
            key: 'inventoryCount',
            minWidth:90,
          },
          {
            title: '薪资统计',
            align:'center',
            key: 'sumSalary',
            minWidth:90,
          },
        ]
      }
    },
    methods: {
      search() {
        this.loadDataGrid(this.startTime, this.endTime);
      },
      loadDataGrid(startTime, endTime) {
        let param = `?queryDateStart=${startTime}&queryDateEnd=${endTime}&pageNumber=1000&pageIndex=1`;
        const _this = this;
        common.ajax({
          url: REPORT().Teacher.queryTeacherSchedulePage + param,
//          url: 'https://192.168.1.60:8080/onlyhi-admin/agencyFee/queryAgencyFeePage' + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data["agencyFeeList"] || [];
          }
        });
      },
      changeDate(value) {
        this.startTime = value[0] || '';
        this.endTime = value[1] || '';
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
    components: { OBreadcrumb }
  };
</script>

<style lang="less" rel="stylesheet/less">

</style>
