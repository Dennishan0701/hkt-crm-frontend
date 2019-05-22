<template>
<div>
  <o-breadcrumb second="分配管理" third="新正式生分配"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="6">
        <i-button type="primary" :size="$store.state.searchModuleSize" icon="paper-airplane" @click="showSalesModal">批量分配</i-button>
      </i-col>
      <i-col span="18" class="right">
        <form id="searchForm">
          <strong class="label">姓名\手机：</strong>
          <i-input v-model="nameAndPhoneValue" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="学生姓名 \ 手机号码" style="width:150px;margin-right: 2px;"></i-input>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索</i-button>
        </form>
      </i-col>
    </Row>
  </div>
  <i-table size="small" highlight-row stripe :columns="columns" :data="data" @on-selection-change="getSelections" @on-select-all="getSelectionAll"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>
  <Modal
    title="订单信息"
    v-model="modal"
    :mask-closable="false"
    :closable="false" width="900">
    <i-table size="small" highlight-row border :columns="modalColumns" :data="modalData"></i-table>
  </Modal>
  <select-sales @reFresh="reFresh"  ref="sales" form-type="2"></select-sales>

</div>
</template>

<script type="text/ecmascript-6">
  import {DISTRIBUTE} from 'common/api/distribute.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import selectSales from './formalStudentSelectSales';
  import PageModel from 'dashborader/page/page.vue';
  const $sStorage = $.sessionStorage;
  export default{
    data() {
      return {
        data: [],
        modal:false,
        modalData:[],
        total: 0,
        selectionRows: [],
        pageIndex: 1,
        pageNumber: 10,
        nameAndPhoneValue: '',
        modalColumns:[
          {
            title: '订单号',
            key: 'orderNo',
            align: 'center'
          },
          {
            title: '支付方式',
            key: 'payType',
            align: 'center'
          },
          {
            title: '课时',
            key: 'length',
            align: 'center'
          },
          {
            title: '优惠码',
            key: 'promotionCode',
            align: 'center'
          },
          {
            title: '参与活动',
            key: 'promotionName',
            align: 'center'
          },
          {
            title: '赠送课时',
            key: 'giveLength',
            align: 'center'
          },
          {
            title: '金额',
            key: 'money',
            align: 'center'
          },
          {
            title: '成交/审核通过时间',
            key: 'payTime',
            align: 'center',
            render(h, params) {
              if(params.row.payTime) {
                return h('span',formateDate(params.row.payTime,'yyyy-MM-dd hh:mm:ss'));
              }else{
                return '';
              }
            }
          },
          {
            title: '签单销售',
            key: 'userName',
            align: 'center'
          },
        ],
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '学生',
            key: 'name',
            width: 100,
            sortable: true,
            render : (h, params) => {
              return h('div',[
                h('Icon',{
                  props:{
                    type:'person'
                  },
                  style:{
                    marginRight:'2px'
                  }
                }),
                h('a',{
                  on:{
                    click:()=>{
                      GLOBAL.viewLeadsDetail(params.row.leadUuid)
                    }
                  }
                },params.row.name)
              ])
//              return `<Icon type="person"></Icon> <strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.leadUuid}');">${row.name}</a></strong>`;
            }
          },
          {
            title: '手机号',
            key: 'phone',
            width: 120,
            render(h, params) {
              return h('span',hideCharAtNumber(params.row.phone));
            }
          },
          {
            title: '付费时间',
            key: 'createDate',
            width: 180,
            render(h, params) {
              return h('span',formateDate(params.row.createDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '移交备注',
            key: 'handoutDes',
            width: 100,
            render : (h, params) => {
              let content = params.row.handoutDes;
              if(content && content.length>40) {
                content = content.slice(0,39)+'...';
                return h('div',[
                  h('span',{
                    props:{
                      title:params.row.handoutDes
                    }
                  },content)
                ])
//                return `<span title="${row.handoutDes}">${content}</span>`;
              } else {
                return h('span',content);
              }
            }
          },
          {
            title: '提交时间',
            key: 'updateDate',
            width: 180,
            render(h, params) {
              if(params.row.updateDate) {
                return h('span',formateDate(params.row.updateDate,'yyyy-MM-dd hh:mm:ss'));
              }else{
                return '';
              }
            }
          },
          {
            title: '订单信息',
            key: 'action',
            width: 100,
            align: 'center',
            render : (h, params) => {
              return h('div',[
                h('Button',{
                  props:{
                    type:'primary',
                    size:'small',
                  },
                  on:{
                    click:()=>{
                      this.getStudentOrder(params.row.leadUuid)
                    }
                  }
                },'点击查看')
              ])

//              return `<i-button type="primary" size="small" @click="getStudentOrder('${row.leadUuid}')">点击查看</i-button>`;
            }
          },
          {
            title: '转介绍信息',
            key: 'action',
            width: 180,
            align: 'center',
            render : (h, params) => {
              return h('div',[
                h('p',{},'是否转介绍：'+ params.row.isIntroduced==true?'是':'否'),
                h('p',{},'推荐 CR：'+ params.row.recommendCrName==null?'无':params.row.recommendCrName)
              ])
//              return `<p>是否转介绍：${}</p>
//                      <p>推荐 CR：${row.recommendCrName==null?'无':row.recommendCrName}</p>`;
            }
          },
          {
            title:'操作',
            key: 'action',
            width: 100,
            align: 'center',
            render : (h, params) => {
              return h('div',[
                h('Button',{
                  props:{
                    type:'primary',
                    size:'small',
                    icon:'paper-airplane',
                  },
                  style:{
                    margin:'2px'
                  },
                  on:{
                    click:()=>{
                      this.distribution(params.row.leadUuid)
                    }
                  }
                },'分配')
              ])
//              return `<i-button type="primary" size="small" icon="paper-airplane" @click="distribution('${row.leadUuid}')">分配</i-button>`;
            }
          }
        ],
      }
    },
    mounted() {
      this.searchForm();
    },
    methods: {
      showSalesModal() {
        let row = this.selectionRows;
        if (row.length > 0) {
          this.$refs.sales.show();
        } else {
          common.msg('请选择名单','warning');
        }
      },
      distribution(leadsIds) {
        this.selectionRows.length = 1;
        this.selectionRows[0] = {"uuid": leadsIds};
        $sStorage.set('selectionRows' ,this.selectionRows);
        this.showSalesModal();
      },
      getStudentOrder(leadsIds) {
        const _this = this;
        // common.ajax({
        //   url: DISTRIBUTE().FormallStudent.getStudentOrder+`?leadsUuid=${leadsIds}`,
        //   method: 'get',
        //   success: function(res){
        //     _this.modalData = res.data || [];
        //     _this.modal = true;
        //   }
        // });
        this.$axios.get(DISTRIBUTE().FormallStudent.getStudentOrder,{
          params:{
            leadsUuid: leadsIds,
          }
        }).then( ({data}) => {
          _this.modalData = data.data || [];
          _this.modal = true;
        })
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        let nameAndPhone = this.nameAndPhoneValue;
        let name = '', phone = '';
        if (!nameAndPhone) nameAndPhone = '';
        if (isNaN(nameAndPhone)) {
          name = nameAndPhone;
        } else {
          phone = nameAndPhone;
        }
        this.loadDataGrid({
          name: name,
          phone: phone
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?name=${search.name}&phone=${search.phone}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        // common.ajax({
        //   url: DISTRIBUTE().FormallStudent.dataGrid+param,
        //   method: 'get',
        //   success: function(res){
        //     _this.data = res.data['students'] || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get(DISTRIBUTE().FormallStudent.dataGrid,{
          params:{
            name: search.name,
            phone: search.phone,
            pageIndex: this.pageIndex,
            pageNumber: this.pageNumber,
            orderBy: orderBy,
            sortBy: sortBy,
          }
        }).then( ({data}) => {
          _this.data = data.data['students'] || [];
          _this.total = data.data.total;
        })
      },
      getSelections(selection) {
        $sStorage.set('selectionRows' ,selection);
        this.selectionRows = selection;
      },
      getSelectionAll(selection) {
        $sStorage.set('selectionRows' ,selection);
        this.selectionRows = selection;
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      reFresh(){
        this.searchForm();
      }
    },
    components: { OBreadcrumb,selectSales ,PageModel}
  };
</script>

<style>
.ivu-select-dropdown-list{
  text-align: left;
}
</style>
