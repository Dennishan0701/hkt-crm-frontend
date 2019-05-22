<template>
  <div>
    <o-breadcrumb second="财务" third="待合并订单"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24">
          <i-input v-model="Search.leadsName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm" placeholder="学生" style="width:150px;margin-right: 2px;"></i-input>
          <i-input v-model="Search.leadsPhone" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm" placeholder="手机号码" style="width:150px;margin-right:2px;"></i-input>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <div class="c-red">注意：待审核的订单需先审核通过</div>
    <i-table size="small" :height="iTableHeight" highlight-row stripe :columns="columns" :data="data" @on-selection-change="selectRow"></i-table>
    <p class="merge">
      <span>选择合并后的课时包：</span>
      <i-select v-model="coursePriceType" placeholder="课程包类别" @on-change="changeCoursePriceType" style="width:200px">
        <i-option v-for="(item,index) in coursePriceTypeList" :key='index' :value="item.value">{{item.value}}</i-option>
      </i-select>
      课时：<Input-number :min="1" v-model="buyLength" placeholder="购买课时数" @on-change="changeBuyLength" style="width:200px"></Input-number> h
      &nbsp;
      &nbsp;
      金额：<span class="c-red">{{money}} 元</span>
    </p>
    <p>
      <i-button type="primary" @click="mergeOrder">订单合并</i-button>
    </p>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {ORDER} from 'common/api/order.js';
  import {formateDate,common,hideCharAtNumber,getFullPhone} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';

  export default{
    data() {
      return {
        data: [],
        Search: {
          leadsName: '',
          leadsPhone: '',
        },
        coursePriceType: '',
        buyLength: 1,
        money: 0,
        coursePriceTypeList: [],
        selectionRowData: {},
        columns: [
          {
            type: 'selection',
            width: 40,
            align: 'center'
          },
          {
            title: '订单号',
            key: 'payOrderNo'
          },
          {
            title: '学生',
            key: 'leadsName',
            render : (h, params) => {
              return h('div',[
                h('a',{
                  on:{
                    click:()=>{
                    redirectTo('/leads/leadsDetailCc',params.row.leadsUuid)
                  }
                  }
                },params.row.leadsName)
              ])
//              return `<strong><a href="javascript:redirectTo('/leads/leadsDetail','${row.leadsUuid}');">${row.leadsName}</a></strong>`;
            }
          },
          {
            title: '手机号',
            key: 'leadsPhone'
          },
          {
            title: '金额',
            key: 'money'
          },
          {
            title: '状态',
            key: 'payStatus',
            render : (h, params) => {
              if(params.row.payStatus === 0) {//待支付
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag yellow'
                    }
                  },'待支付')
                ])
//                return '<span class="o-tag yellow">待支付</span>';
              }else if(params.row.payStatus === 1) {
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag blue'
                    }
                  },'待审核')
                ])
//                return '<span class="o-tag blue">待审核</span>';
              }else if(params.row.payStatus === 2) {
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag green'
                    }
                  },'已支付')
                ])
//                return '<span class="o-tag green">已支付</span>';
              }else if(params.row.payStatus === 4) {
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag green'
                    }
                  },'已审核')
                ])
//                return '<span class="o-tag green">已审核</span>';
              }else if(params.row.payStatus === 5) {
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag red'
                    }
                  },'已拒绝')
                ])
//                return '<span class="o-tag red">已拒绝</span>';
              }else{
                return '未知状态：' + params.row.payStatus;
              }
            }
          },
          {
            title: '成单时间',
            key: 'createDate',
            render(h, params) {
              return h('span',formateDate(params.row.createDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '更新时间',
            key: 'updateDate',
            render(h, params) {
              return h('span',formateDate(params.row.updateDate,'yyyy-MM-dd hh:mm:ss'));
            }
          }
        ]
      }
    },
    mounted() {
      const _this = this;
      $.getJSON("static/data.json", function (json) {
        _this.coursePriceTypeList = json.coursePriceTypeList;//购买课时包
      });
    },
    methods: {
      mergeOrder() {
        const _this = this;
        let row = this.selectionRowData;
        if(row.constructor !== Array || row.length === 0) {
          common.msg('请选择一条数据','info');
        } else if(!this.checkedPayStatus()) {
          common.msg('可合并子单，支付状态必须为已审核或已支付','warning');
        } else {
          if(this.coursePriceType) {
            let mergeOrderNos = this.getMergeOrderNos();
            let leadsUuid = row[0].leadsUuid;
            common.ajax({
              url: ORDER().Merge.merge,
              data: {
                mergeOrderNos: mergeOrderNos,
                leadsUuid: leadsUuid,
                coursePriceType: _this.coursePriceType,
                buyLength: _this.buyLength,
              },
              success(res) {
                common.notices('操作成功');
              }
            });
          } else {
            common.msg('请选择课时包','info');
          }
        }
      },
      checkedPayStatus() {
        let item;
        for(let i = 0; i < this.selectionRowData.length; i++) {
          item = this.selectionRowData[i];
          if(item.payStatus !== 2 && item.payStatus !== 4) return false;
        }
        return true;
      },
      getMergeOrderNos() {
        let list = '';
        this.selectionRowData.forEach((value) => {
          list += value.payOrderNo + ',';
        });
        if(list) list = list.slice(0,-1);
        return list;
      },
      searchForm() {
        this.loadDataGrid({
          leadsName: this.Search.leadsName,
          leadsPhone: this.Search.leadsPhone
        });
      },
      loadDataGrid(search) {
        let param = `?leadsName=${search.leadsName}&leadsPhone=${search.leadsPhone}`;
        const _this = this;
        common.ajax({
          url: ORDER().Merge.dataGrid + param,
          method: 'get',
          success: function (res) {
            if(res.data) {
              _this.data = res.data || [];
            }
          }
        });
      },
      getMoney() {
        const _this = this;
        common.ajax({
          url: ORDER().CreateOrder.getPayMoney,
          method: 'get',
          isAsync: 'no',
          data: {
            coursePriceType: _this.coursePriceType,
            buyLength: _this.buyLength,
            promotionCode: ''
          },
          success(res) {
            _this.money = res.data;
          }
        });
      },
      changeCoursePriceType(value) {
        this.coursePriceType = value;
        this.getMoney();
      },
      changeBuyLength(value) {
        this.buyLength = value;
        this.getMoney();
      },
      selectRow(selection) {
        this.selectionRowData = selection;
      }
    },
    computed: {
      iTableHeight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470: '';
      }
    },
    components: { OBreadcrumb }
  };
</script>

<style scoped>
  .merge {
    font-size: 18px;
    margin: 5px 0;
  }
</style>
