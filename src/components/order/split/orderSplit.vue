<template>
  <div>
    <o-breadcrumb second="销售与客服" third="订单拆分"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <i-input v-model="Search.leadsName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="学生" style="width:150px;margin-right: 2px;"></i-input>
          <i-input v-model="Search.leadsPhone" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="手机号码" style="width:150px;margin-right:2px;"></i-input>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <table class="onlyhi-table">
      <thead>
        <tr>
          <th style="width: 30px;">子单</th>
          <th style="width:156px;">订单号</th>
          <th style="width:90px;">学生</th>
          <th>手机号</th>
          <th>课时</th>
          <th>金额</th>
          <th>状态</th>
          <th>创建时间</th>
          <th>更新时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if='item' v-for="(item,index) in data" :key='index'>
          <td colspan="10" style="padding: 0;">
            <table class="onlyhi-table" style="width: 100%;">
              <tbody>
                <tr>
                  <td style="width: 30px;">
                    <div v-if="item.split">
                      <i-button type="ghost" :icon="isExpansion === index ? 'arrow-up-b': 'arrow-down-b' " size="small" @click="showChildrenOrders(index)"></i-button>
                    </div>
                    <div v-else>
                    </div>
                  </td>
                  <td style="width:156px;">{{item.payOrderNo}}</td>
                  <td style="width:90px;"><a v-bind:href="'javascript:GLOBAL.viewLeadsDetail(\'' + item.leadsUuid + '\');'">{{item.name}}</a></td>
                  <td>{{item.phone}}</td>
                  <td>{{item.length}}</td>
                  <td>{{item.money}}</td>
                  <td>{{item.payStatus | convertPayStatus}}</td>
                  <td>{{item.createDate | convertDate}}</td>
                  <td>{{item.updateDate | convertDate}}</td>
                  <td><i-button type="primary" size="small" @click="splitShow(item)">拆单</i-button></td>
                </tr>
                <tr v-for="(item,index) in childrenData" :key='index' v-show="isExpansion === index" class="children-tr">
                  <td></td>
                  <td>{{item.payOrderNo}}</td>
                  <td><a v-bind:href="'javascript:GLOBAL.viewLeadsDetail(\'' + item.leadsUuid + '\');'">{{item.name}}</a></td>
                  <td>{{item.phone}}</td>
                  <td>{{item.length}}</td>
                  <td>{{item.money}}</td>
                  <td>{{convertPayStatus(payStatus)}}</td>
                  <td>{{convertDate(item.createDate)}}</td>
                  <td>{{convertDate(item.updateDate)}}</td>
                  <td>
                    <template v-if="item.payStatus === 0 || item.payStatus === 5">
                      <i-button type="success" size="small" @click="showPayRequest(item.payOrderNo)">提交付费申请</i-button>
                    </template>
                    <template v-else-if="item.payStatus === 1">
                      <i-button type="info" size="small" @click="showViewPayRequest(item.payOrderUuid)">查看付费申请</i-button>
                    </template>
                    <template v-else>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr v-else>
          <td colspan="10" style="text-align: center">暂无数据</td>
        </tr>
      </tbody>
    </table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>

    <Modal
      v-model="modal"
      title="订单拆分"
      :closable="false"
      :mask-closable="false"
      :loading="loading"
      @on-ok="splitOk">
      <p><strong>父单</strong></p>
      <table class="onlyhi-table">
        <tr>
          <td class="text-left">{{currentRow.name}}</td>
          <td class="text-left">{{currentRow.length}}课时</td>
          <td class="required text-left">￥{{currentRow.money}}</td>
        </tr>
      </table>
      <br/>
      <p><strong>子单</strong> <span class="c-red">未拆：{{notYetMoney}}</span></p>
      <table class="onlyhi-table">
        <tr v-for="(item,index) in payChildOrderBranchVo" :key='index'>
          <td class="text-left" style="width: 50px;">{{index + 1}}</td>
          <td class="text-left">
            <Input-number :max="currentRow.money" :min="1" v-model="item.money" style="width: 100px"></Input-number>
            <Icon type="plus-circled" class="ar-btn" @click="addItem"></Icon>
            <Icon type="minus-circled" class="ar-btn" @click="payChildOrderBranchVo.splice(index, 1)" v-show="payChildOrderBranchVo.length > 1 && item.payStatus !== 2 "></Icon>
          </td>
        </tr>
      </table>
    </Modal>
    <payRequest @reFresh="reFresh"  ref="payRequest"></payRequest>
    <viewPayRequest @reFresh="reFresh"></viewPayRequest>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {ORDER} from 'common/api/order.js';
  import {formateDate,common,hideCharAtNumber,getFullPhone} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import payRequest from 'components/order/split/payRequest';
  import viewPayRequest from 'components/order/split/viewPayRequest';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        childrenData: [],
        total: 0,
        pageIndex: 1,
        pageNumber: 15,
        Search: {
          leadsName: '',
          leadsPhone: '',
        },
        currentRow: {},
        modal: false,
        loading: true,
        rowIndex: -1,
        expansionIcon: 'arrow-down-b',
        payChildOrderBranchVo: [
          {
            money: 1,
            payStatus: 0
          }
        ]
      }
    },
    mounted() {
      this.searchForm();
    },
    methods: {
      showChildrenOrders(index) {
        if(this.rowIndex === index) {
          this.rowIndex = -1;
        }else {
          this.rowIndex = index;
        }
        if(this.rowIndex > -1) {
          let payOrderNo = this.data[index].payOrderNo;
          this.getChildrenOrders(payOrderNo);
        }
      },
      splitShow(row) {
        this.modal = true;
        this.currentRow = row;
        this.getChildrenOrders(row.payOrderNo);
        if(this.childrenData.length > 0) {
          this.payChildOrderBranchVo = this.childrenData;
        } else {
          this.payChildOrderBranchVo = [
            {
              money: 1,
              payStatus: 0
            }
          ];
        }
      },
      splitOk() {
        const _this = this;
        this.loading = false;
        if(this.notYetMoney !== 0) {
          this.$Message.error('未拆金额必须为0');
          setTimeout(() => {
            this.loading = true;
          }, 0);
        } else {
          // common.ajax({
          //   url: ORDER().OrderSplit.branchOrder,
          //   data: {
          //     payOrderNo: _this.currentRow.payOrderNo,
          //     banchMoney: _this.branchMoney(),
          //     leadsUuid: _this.currentRow.leadsUuid
          //   },
          //   success: function(res) {
          //     common.notices('操作成功！');
          //     _this.modal = false;
          //     _this.searchForm();
          //   }
          // });
          this.$axios.post(ORDER().OrderSplit.branchOrder,{
            payOrderNo: _this.currentRow.payOrderNo,
            banchMoney: _this.branchMoney(),
            leadsUuid: _this.currentRow.leadsUuid
          }).then( () => {
            common.notices('操作成功！');
            _this.modal = false;
            _this.searchForm();
          })
        }
      },
      showPayRequest(payOrderNo) {
        this.$refs.payRequest.show(payOrderNo);
      },
      showViewPayRequest(payOrderUuid) {
        this.$refs.viewRequest.show(payOrderUuid);
      },
      getChildrenOrders(payOrderNo) {
        const _this = this;
        // common.ajax({
        //   url: ORDER().OrderSplit.getChildOrder,
        //   method: 'get',
        //   isAsync: 'no',
        //   data: {parentOrderNo: payOrderNo},
        //   success: function (res) {
        //     _this.childrenData = res.data || [];
        //   }
        // })
        this.$axios.get( ORDER().OrderSplit.getChildOrder,{
          params:{
            parentOrderNo: payOrderNo
          }
        }).then( ({data}) => {
          _this.childrenData = data.data || [];
        })
      },
      getFullPhone(phone) {
        getFullPhone(phone, COMMON_API().getPhoneHZ);
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          leadsName: this.Search.leadsName,
          leadsPhone: this.Search.leadsPhone
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?leadsName=${search.leadsName}&leadsPhone=${search.leadsPhone}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        // common.ajax({
        //   url: ORDER().OrderSplit.dataGrid + param,
        //   method: 'get',
        //   success: function (res) {
        //     if(res.data) {
        //       _this.data = res.data['banchVos'] || [];
        //       _this.total = res.data.total;
        //     }
        //   }
        // });
        this.$axios.get(ORDER().OrderSplit.dataGrid,{
          params:{
            leadsName: search.leadsName,
            leadsPhone: search.leadsPhone,
            pageIndex:this.pageIndex,
            pageNumber:this.pageNumber,
            orderBy:orderBy,
            sortBy:sortBy,
          }
        }).then( ({data}) => {
          _this.data = data.data['banchVos'] || [];
          _this.total = data.data.total;
        })
      },
      branchMoney() {
        let child = '';
        this.payChildOrderBranchVo.forEach((item, index) => {
          child +=  item.money + ',';
        });
        child = child.slice(0,-1);
        return child;
      },
      addItem() {
        if(this.notYetMoney > 0) {
          this.payChildOrderBranchVo.push({ money: 1 });
        }else{
          common.msg('未拆金额已经为0，不能继续拆了！');
        }
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      reFresh(){
        let payOrderNo = this.data[this.rowIndex].payOrderNo;
        this.getChildrenOrders(payOrderNo);
      }
    },
    computed: {
      isExpansion() {
        return this.rowIndex;
      },
      notYetMoney() {
        let total = this.currentRow.money;
        let child = 0;
        this.payChildOrderBranchVo.forEach((item, index) => {
          child +=  item.money;
        });
        let money = total - child;
        if(money < 0) {
          this.$Message.error('未拆金额必须为0');
        } else {
            return money;
        }
      },
      iTableHeight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470: '';
      },
      convertDate(value) {
        return formateDate(value,'yyyy-MM-dd hh:mm:ss');
      },
      convertPayStatus(value) {
        if(value === 0) {//待支付
          return '待支付';
        }else if(value === 1) {
          return '待审核';
        }else if(value === 2) {
          return '已支付';
        }else if(value === 4) {
          return '已审核';
        }else if(value === 5) {
          return '已拒绝';
        }else{
          return '未知状态：'+value;
        }
      }
    },

    components: { OBreadcrumb, payRequest, viewPayRequest ,PageModel}
  };
</script>

<style scoped>
  .onlyhi-table{
    width: 100% !important;
    margin: 0 auto;
    text-align: center;
  }
  .onlyhi-table td { padding: 0 !important; }
  .onlyhi-table .children-tr:hover { background-color: #fff; }
  .ar-btn {
    font-size: 20px;vertical-align: inherit;cursor: pointer;
  }
  .ar-btn:hover {
    color: #3399ff;
  }
</style>
