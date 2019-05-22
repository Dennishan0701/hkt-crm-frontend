<template>
<div>
  <o-breadcrumb second="财务" third="发票管理"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="24" class="right">
        <form id="searchForm">
          <i-input v-model="Search.leadsName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="学生姓名" style="width:150px;margin-right: 2px;"></i-input>
          <i-input v-model="Search.leadsPhone" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)"  placeholder="学生手机号码" style="width:150px;margin-right:2px;"></i-input>
          <i-input v-model="Search.submitter" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)"  placeholder="提交人" style="width:150px;margin-right:2px;"></i-input>
          <i-input v-model="Search.teamName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)"  placeholder="签约团队" style="width:150px;margin-right:2px;"></i-input>
          <i-select v-model="Search.receiptStatus" :size="$store.state.searchModuleSize" clearable placeholder="状态" style="width:80px">
            <i-option value="0">未开</i-option>
            <i-option value="1">已开</i-option>
          </i-select>
        </form>
      </i-col>
      <i-col span=24 class="right">
        <Date-picker type="daterange" :size="$store.state.searchModuleSize" placement="bottom-end" @on-change="changeSubmitDate" placeholder="提交时间" style="width: 200px"></Date-picker>
        <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索</i-button>
      </i-col>
    </Row>
  </div>
  <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
    <!--<checkbox value="index">序号</checkbox>-->
    <!--<checkbox value="payNo">订单号</checkbox>-->
    <checkbox label="teamName">签单团队</checkbox>
    <checkbox label="leadsName">学生姓名</checkbox>
    <checkbox label="leadsPhone">手机号</checkbox>
    <checkbox label="grade">年级</checkbox>
    <checkbox label="courseHour">购买课时</checkbox>
    <checkbox label="giveLength">赠送课时</checkbox>
    <checkbox label="sumLength">总课时</checkbox>
    <checkbox label="payType">支付方式</checkbox>
    <checkbox label="submitter">提交人</checkbox>
    <checkbox label="submitTime">提交时间</checkbox>
    <checkbox label="checkTime">审核时间</checkbox>
    <checkbox label="payRemark">付费备注</checkbox>
    <checkbox label="invoiceNum">发票号</checkbox>
    <checkbox label="receiptStatus">发票状态</checkbox>
  </checkbox-group>
  <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
  <div class="gridPage">

    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>


  <Modal
    v-model="modal"
    title="确认已开发票"
    :closable="false"
    :mask-closable="false"
    :loading = "loading"
    @on-ok="reasonOk('formValidate')">
    <i-form ref="formValidate" :model="formItem" :rules="ruleValidate">
      <Form-item prop="receiptNum" label="发票号：">
        <i-input v-model="formItem.receiptNum" placeholder="请输入发票单号" style="width: 200px;"></i-input>
      </Form-item>
    </i-form>
  </Modal>
</div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {FINANCE} from 'common/api/finance.js';
  import {formateDate,common,hideCharAtNumber,getFullPhone} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        tableColumnsChecked:['teamName','leadsName','leadsPhone','grade','courseHour','giveLength','giveLength','sumLength','payType','submitter','submitTime','checkTime','payRemark','invoiceNum','receiptStatus','payUuid'],
        modal: false,
        loading: true,
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        Search: {
          leadsName: '',
          leadsPhone: '',
          submitter: '',
          receiptStatus: '',
          teamName: '',
          submitStartTime: '',
          submitEndTime: ''
        },
        formItem: {
          receiptNum: '',
          payUuid:''
        },
        ruleValidate: {
          receiptNum: [
            { required: true, message: '请输入正确发票号', trigger: 'blur' }
          ]
        },
        columns: [] ,
      }
    },
    mounted() {
      this.searchForm();
      this.changeTableColumns();
    },
    methods: {
      getTableColumns () {
        const columns = {
          index:{
          title: '序号',
            align:'center',
          type:'index',
          fixed:'left',
          minWidth:40,
        },
          payNo:{
          title: '订单号',
            key: 'payNo',
          align:'center',
          fixed:'left',
            minWidth:180,
        },
          teamName:{
          title: '签单团队',
            key: 'teamName',
          align:'center',
            minWidth:160,
        },
          leadsName:{
          title: '学生姓名',
            key: 'leadsName',
          align:'center',
            minWidth:90,
        },
          leadsPhone:{
          title: '手机号',
            key: 'leadsPhone',
          align:'center',
            minWidth:120,
            render : (h, params) => {
          if(params.row.leadsPhone) {
            return h('div',[
              h('span',hideCharAtNumber(params.row.leadsPhone)),
              h('i',{
                style:{
                  margin:'2px'
                },
                attrs:{
                  class:'ivu-icon ivu-icon-ios-eye',
                  title:'显示全部'
                },
                style:{
                  fontSize:'18px',
                  verticalAlign:'top',
                  cursor:'pointer'
                },
                on:{
                  click:()=>{
                    this.getFullPhone(params.row.leadsPhone)
                  }
                }
              })
            ])
//            return hideCharAtNumber(row.leadsPhone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.leadsPhone}')" class="eye" title="显示全部"></Icon>`;
          }else{
            return h('span','-');
          }
        }
        },
          grade:{
          title: '年级',
            key: 'grade',
          align:'center',
            minWidth:90,
        },
          courseHour:{
          title: '购买课时',
            key: 'courseHour',
          align:'center',
            minWidth:90,
        },
          giveLength:{
          title: '赠送课时',
            key: 'giveLength',
          align:'center',
            minWidth: 90,
        },
          sumLength:{
          title: '总课时',
            key: 'sumLength',
          align:'center',
            minWidth: 90,
        },
          payType:{
          title: '支付方式',
            key: 'payType',
          align:'center',
            minWidth: 90,
        },
          submitter:{
          title: '提交人',
            key: 'submitter',
          align:'center',
            minWidth:90,
        },
          submitTime:{
          title: '提交时间',
            key: 'submitTime',
          align:'center',
            minWidth:160,
            render(h, params) {
          return h('span',formateDate(params.row.submitTime,'yyyy-MM-dd hh:mm:ss'));
        }
        },
          checkTime:{
          title: '审核时间',
            key: 'checkTime',
          align:'center',
            minWidth:180,
            render(h, params) {
          return h('span',formateDate(params.row.checkTime,'yyyy-MM-dd hh:mm:ss'));
        }
        },
          payRemark:{
          title: '付费备注',
            key: 'payRemark',
          align:'center',
            minWidth: 200,
            render : (h, params) => {
          let content = params.row.payRemark;
          if(content.length > 36) {
            content = content.slice(0,36)
            return h('div',[
              h('span',{
                attrs:{
                  title:params.row.payRemark
                }
              },content)
            ])
//            return `<span title='${row.payRemark}'>${content}...</span>`
          }else {
            return h('span',content)
          }
        }
        },
          invoiceNum:{
          title: '发票号',
            key: 'invoiceNum',
          align:'center',
            minWidth:90,
        },
          receiptStatus:{
          title: '发票状态',
            key: 'receiptStatus',
          align:'center',
            minWidth:90,
        },
          payUuid:{
          title: '操作',
            minWidth: 120,
          key: 'payUuid',
          fixed:'right',
          align:'center',
            render : (h, params) => {
          if(params.row.receiptStatus == '未开'){
            return h('div',[
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                  icon: 'paper-airplane',
                },
                style: {
                  margin: '2px',
                },
                on: {
                  click: () => {
                    this.pass(params.row.payUuid,params.row.receiptStatus)
                  }
                }
              },'确认已开发票')
            ])
//            return `<i-button type="success" size="small" @click="pass('${row.payUuid}','${row.receiptStatus}')">确认已开发票</i-button>`;
          }else {
            return h('div',[
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                },
                style: {
                  margin: '2px',
                },
                attrs: {
                  disabled:true
                }
              },'已开发票')
            ])
//            return `<i-button type="success" size="small" disabled>已开发票</i-button>`;
          }

        }
        }
        };
        let datas = [columns.index,columns.payNo];
        this.tableColumnsChecked.forEach(col => datas.push(columns[col]));
        return datas;
      },
      reasonOk(name) {
        const _this = this;
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$axios.post( FINANCE().invoice.editReceiptStatus,{
              cpPayRequestUuid: _this.formItem.payUuid,
              receiptNum: _this.formItem.receiptNum,
              receiptStatus:　1
            }).then( () => {
              _this.modal = false;
              common.notices('操作成功！');
              _this.searchForm();
            })
          } else {
            setTimeout(() => {
              this.loading = true;
            }, 0);
          }
        });
      },
      pass(payUuid, leadsUuid) {
        this.modal = true;
        this.formItem.payUuid = payUuid;


//        const _this = this;
//        this.$Modal.confirm({
//          title: '确认',
//          content: '确认发票已开吗？',
//          onOk() {
//            common.ajax({
//              url: FINANCE().invoice.editReceiptStatus,
//              data: {
//                cpPayRequestUuid: payUuid,
//                receiptStatus:　1
//              },
//              success: function(response){
//                common.notices('操作成功！');
//                _this.searchForm();
//              }
//            });
//          }
//        });
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          leadsName: this.Search.leadsName,
          leadsPhone: this.Search.leadsPhone,
          submitter: this.Search.submitter,
          receiptStatus: this.Search.receiptStatus,
          teamName: this.Search.teamName,
          submitStartTime: this.Search.submitStartTime,
          submitEndTime: this.Search.submitEndTime,
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?leadsName=${search.leadsName}&teamName=${search.teamName}&leadsPhone=${search.leadsPhone}&submitter=${search.submitter}&submitStartTime=${search.submitStartTime}&submitEndTime=${search.submitEndTime}&receiptStatus=${search.receiptStatus}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        // common.ajax({
        //   url: FINANCE().invoice.dataGrid + param,
        //   method: 'get',
        //   success: function (res) {
        //     _this.data = res.data['haveChenckDeedsVos'] || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get( FINANCE().invoice.dataGrid + param,{
        }).then( ({data}) => {
          _this.data = data.data['haveChenckDeedsVos'] || [];
          _this.total = data.data.total;
        })
      },
      getFullPhone(phone) {
        getFullPhone(phone, COMMON_API().Phone.getFullPhone);
      },
      changeSubmitDate(value) {
        this.Search.submitStartTime = value[0] || '';
        this.Search.submitEndTime = value[1] || '';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      changeTableColumns () {
        this.columns = this.getTableColumns();
      }
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470: '';
      }
    },
    components: {
      OBreadcrumb,PageModel
    }
  };
</script>

<style>

</style>
