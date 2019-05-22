<template>
  <div>
    <o-breadcrumb second="销售与客服" third="我的订单"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="left">
          <form id="searchForm">
            <i-input v-model="Search.orderNo" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)"
                     placeholder="订单号" style="width:150px;margin-right:2px;"></i-input>
            <i-input v-model="Search.studentName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)"
                     placeholder="学生姓名" style="width:150px;margin-right:2px;"></i-input>
            <i-input v-model="Search.studentPhone" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)"
                     placeholder="学生手机号" style="width:150px;margin-right:2px;"></i-input>
            <i-input v-model="Search.saleName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)"
                     placeholder="所属销售" style="width:150px;margin-right:2px;"></i-input>
            <i-input v-model="Search.teamName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)"
                     placeholder="所属团队" style="width:150px;margin-right:2px;"></i-input>
          </form>
        </i-col>
        <i-col span=24 class="left">
          <Date-picker type="daterange" :size="$store.state.searchModuleSize" placement="bottom-start"
                       @on-change="changeShDate" placeholder="审核时间" style="width: 200px"></Date-picker>
          <Date-picker type="daterange" :size="$store.state.searchModuleSize" placement="bottom-start"
                       @on-change="changePayDate" placeholder="提交时间" style="width: 200px"></Date-picker>
          <i-select v-model="Search.isPay" :size="$store.state.searchModuleSize" clearable placeholder="审核状态"
                    style="width:100px">
            <i-option value="0">待审核</i-option>
            <i-option value="1">审核通过</i-option>
            <i-option value="2">拒绝</i-option>
          </i-select>
          <i-select v-model="Search.isRefund" :size="$store.state.searchModuleSize" clearable placeholder="是否退费"
                    style="width:100px">
            <i-option value="1">是</i-option>
            <i-option value="0">否</i-option>
          </i-select>
          <!--<i-select v-model="Search.saleType" :size="$store.state.searchModuleSize" style="width:100px" placeholder="销售类型" clearable>-->
          <!--<i-option value="cc">cc</i-option>-->
          <!--<i-option value="cr">cr</i-option>-->
          <!--</i-select>-->
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索
          </i-button>
        </i-col>
      </Row>
    </div>
    <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns" class="left"
                    style="margin-left: 8px;">
      <checkbox label="leadsName">学生</checkbox>
      <checkbox label="leadsPhone">手机号</checkbox>
      <checkbox label="grade">年级</checkbox>
      <checkbox label="courseHour">课时</checkbox>
      <checkbox label="giveLength">赠送课时</checkbox>
      <!--<checkbox label="sumLength">总课时</checkbox>-->
      <checkbox label="money">金额</checkbox>
      <checkbox label="submitter">所属销售</checkbox>
      <checkbox label="paymentDetailList">付费详情</checkbox>
      <!--<checkbox label="saleType">销售类型</checkbox>-->
      <checkbox label="teamName">所属团队</checkbox>
      <!--<checkbox label="payType">支付方式</checkbox>-->
      <checkbox label="payTime">提交时间</checkbox>
      <checkbox label="checkTime">审核时间</checkbox>
      <!--<checkbox label="checkUser">审核人</checkbox>-->
      <checkbox label="isPay">审核状态</checkbox>
      <checkbox label="checkRemark">审核备注</checkbox>
      <checkbox label="payRemark">付费备注</checkbox>
      <checkbox label="isRefund">是否退费</checkbox>
      <checkbox label="refundAmount">退费金额</checkbox>
    </checkbox-group>
    <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    </div>
    <green-channel @reFresh="reFresh" ref='greenchannel'></green-channel>
    <Modal
      v-model="paymentDetailModal"
      title="标记为退费"
      :closable="false"
      :mask-closable="false"
      :loading="loading">
      <i-table size="small" :columns="paymentDetailColumns" :data="paymentDetailData"></i-table>
      <div slot="footer">
        <Button type="primary" :size="$store.state.searchModuleSize" @click="paymentDetailOk">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {FINANCE} from 'common/api/finance.js';
  import {formateDate, common, hideCharAtNumber, getFullPhone} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';
  import greenChannel from 'components/sc/myStudent/ccPayRequest.vue';
  export default {
    data () {
      const validateValue = (rule, value, callback) => {
        var reg = /^[0-9]*$/;
        if (value === '') {
          callback (new Error ('请输入金额'));
        } else {
          // if(!reg.test(value)) {
          //   callback(new Error('请输入数字'));
          // }else{
          callback ();
          // }
          callback ();
        }
      };
      return {
        // totalAmount: '',
        data: [],
        paymentDetailData: [],
        paymentDetailColumns: [
          {
            title: '支付方式',
            key: 'payType',
            align: 'center',
            minWidth: 90,
            render (h, params) {
              if (params.row.payType === 'taobao') {
                return h ('span', '淘宝')
              } else if (params.row.payType === 'bank') {
                return h ('span', '银行转账')
              } else if (params.row.payType === 'alipay') {
                return h ('span', '支付宝')
              } else if (params.row.payType === 'weixin') {
                return h ('span', '微信')
              } else if (params.row.payType === 'kuStaging') {
                return h ('span', '库分期')
              } else if (params.row.payType === 'baiduStaging') {
                return h ('span', '百度分期')
              } else if (params.row.payType === 'lovehaimi') {
                return h ('span', '爱海米分期')
              } else if (params.row.payType === 'huixuexi') {
                return h ('span', '惠学习')
              } else {
                return h ('span', params.row.payType)
              }
            }
          },
          {
            title: '金额',
            key: 'amount',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '付款时间',
            key: 'paymentDate',
            align: 'center',
            minWidth: 120,
          },
        ],
        loading: false,
        FormData: {
          refund: '',
        },
        RefundModal: false,
        paymentDetailModal: false,
        tableColumnsChecked: ['leadsName', 'leadsPhone', 'grade', 'courseHour', 'giveLength', 'money', 'submitter', 'paymentDetailList', 'teamName', 'payTime', 'checkTime', 'isPay', 'checkRemark', 'payRemark', 'isRefund', 'refundAmount', 'action'],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        Search: {
          studentName: '',
          studentPhone: '',
          checkStartTime: '',
          checkEndTime: '',
          payStartTime: '',
          payEndTime: '',
          // payType: '',
          saleName: '',
          teamName: '',
          // saleType:'',
          isRefund: '',
          isPay: '',
          orderNo: '',
        },
        columns: [],
        params: '',
        ruleValidateRefund: {
          refund: [
            {validator: validateValue, trigger: 'blur'},
          ]
        },
      }
    },
    mounted () {
      this.searchForm ();
      this.changeTableColumns ();
    },
    methods: {
      greenChannel (orderNo,leadsUuid, payUuid,studentPhone,flag) {
        // this.$refs.greenchannel.show ('', payUuid, leadsUuid, 'requestByCC');
        this.$refs.greenchannel.show ('', payUuid, leadsUuid, studentPhone,'requestByCC',flag);
      },
      getTableColumns () {
        const columns = {
          payNo: {
            title: '订单号',
            key: 'orderNo',
            align: 'center',
            fixed: 'left',
            minWidth: 180,
          },
          leadsName: {
            title: '学生',
            key: 'studentName',
            align: 'center',
            minWidth: 90,
          },
          leadsPhone: {
            title: '手机号',
            key: 'studentPhone',
            align: 'center',
            minWidth: 120,
            render: (h, params) => {
              if (params.row.studentPhone) {
                return h ('div', [
                  h ('span', hideCharAtNumber (params.row.studentPhone)),
                  h ('i', {
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
                        this.getFullPhone (params.row.studentPhone)
                      }
                    }
                  })
                ])
//            return hideCharAtNumber(row.leadsPhone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.leadsPhone}')" class="eye" title="显示全部"></Icon>`;
              } else {
                return '-';
              }
            }
          },
          grade: {
            title: '年级',
            key: 'grade',
            align: 'center',
            minWidth: 60,
          },
          courseHour: {
            title: '课时',
            key: 'courseHour',
            align: 'center',
            minWidth: 60,
          },
          giveLength: {
            title: '赠送课时',
            key: 'giveLength',
            align: 'center',
            minWidth: 90,
          },
          money: {
            title: '金额',
            key: 'money',
            align: 'center',
            minWidth: 90,
          },
          submitter: {
            title: '所属销售',
            key: 'submitter',
            align: 'center',
            minWidth: 90,
          },
          paymentDetailList: {
            title: '付费详情',
            key: 'paymentDetailList',
            align: 'center',
            minWidth: 120,
            render: (h, params) => {
              if (params.row.paymentDetailList) {
                // params.row.paymentDetailList.forEach(function (item, index) {
                return h ('div', [
                  h ('Button', {
                    props: {
                      type: 'info',
                      size: 'small',
                    },
                    on: {
                      click: () => {
                        this.paymentDetailShow (params.row.paymentDetailList)
                        console.log (params.row.paymentDetailList);
                      }
                    }
                  }, '查看付费详情'),
                ])
                // })
              } else {
                return '-';
              }
            }
          },
          teamName: {
            title: '所属团队',
            key: 'teamName',
            align: 'center',
            minWidth: 120,
          },
          payTime: {
            title: '提交时间',
            key: 'payTime',
            align: 'center',
            minWidth: 180,
            render (h, params) {
              return h ('span', formateDate (params.row.payTime, 'yyyy-MM-dd'));
            }
          },
          checkTime: {
            title: '审核时间',
            key: 'checkTime',
            align: 'center',
            minWidth: 180,
            render (h, params) {
              return h ('span', formateDate (params.row.checkTime, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          //   checkUser:{
          //   title: '审核人',
          //     key: 'checkUser',
          //   align:'center',
          //     minWidth: 90,
          // },
          isPay: {
            title: '审核状态',
            key: 'isPay',
            align: 'center',
            minWidth: 90,
            render (h, params) {
              if (params.row.isPay === 0) {
                return h ('span', "待审核")
              } else if (params.row.isPay === 1) {
                return h ('span', "审核通过")
              } else if (params.row.isPay === 2) {
                return h ('span', "拒绝")
              }
            }
          },
          checkRemark: {
            title: '审核备注',
            key: 'checkRemark',
            align: 'center',
            minWidth: 150,
          },
          payRemark: {
            title: '付费备注',
            key: 'payRemark',
            align: 'center',
            width: 180,
          },
          isRefund: {
            title: '是否退费',
            key: 'isRefund',
            align: 'center',
            minWidth: 90,
            render (h, params) {
              if (params.row.isRefund === 1) {
                return h ('span', "是")
              } else {
                return h ('span', "否")
              }
            }
          },
          refundAmount: {
            title: '退费金额',
            key: 'refundAmount',
            align: 'center',
            minWidth: 90,
          },
          action: {
            title: '操作',
            align: 'center',
            fixed: 'right',
            minWidth: 120,
            render: (h, params) => {
              if (params.row.isPay === 2 || params.row.isPay === 3) {
                return h ('div', [
                  h ('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs: {},
                    on: {
                      click: () => {
                        this.greenChannel (params.row.orderNo,params.row.leadsUuid, params.row.payUuid,params.row.studentPhone,'secSend')
                      }
                    }
                  }, '重新提交')
                ])
              } else {
                return h ('div', [
                  h ('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                      icon: 'paper-airplane',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs: {
                      disabled: true
                    },
                    on: {
                      click: () => {
                        this.greenChannel (params.row.leadsUuid, params.row.payUuid)
                      }
                    }
                  }, '重新提交')
                ])
              }
            }
          }
        };
        let datas = [columns.payNo];
        this.tableColumnsChecked.forEach (col => datas.push (columns[col]));
        return datas;
      },
      searchForm (val) {
        if (val) this.pageIndex = val;
        this.loadDataGrid ({
          studentName: this.Search.studentName,
          orderNo: this.Search.orderNo,
          studentPhone: this.Search.studentPhone,
          // payType: this.Search.payType,
          saleName: this.Search.saleName,
          teamName: this.Search.teamName,
          checkStartTime: this.Search.checkStartTime,
          checkEndTime: this.Search.checkEndTime,
          payStartTime: this.Search.payStartTime,
          payEndTime: this.Search.payEndTime,
          // saleType: this.Search.saleType,
          isRefund: this.Search.isRefund,
          isPay: this.Search.isPay,
        });
      },
      loadDataGrid (search, orderBy = '', sortBy = '') {
        let param = `?studentName=${search.studentName}&orderNo=${search.orderNo}&studentPhone=${search.studentPhone}&saleName=${search.saleName}&teamName=${search.teamName}&checkStartTime=${search.checkStartTime}&checkEndTime=${search.checkEndTime}&payStartTime=${search.payStartTime}&payEndTime=${search.payEndTime}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}&isRefund=${search.isRefund}&isPay=${search.isPay}`;
        const _this = this;
        this.$axios.get (FINANCE ().Tongji.queryPaymentOrderPage + param, {}).then (({data}) => {
          _this.data = data.data['paymentOrderList'] || [];
          // _this.totalAmount = data.data['totalAmount'] || '';
          _this.total = data.data.total;
        })
      },
      isSearchNull () {
        let startTime = '', endTime = '';
        let studentName = this.Search.studentName;
        let orderNo = this.Search.orderNo;
        let studentPhone = this.Search.studentPhone;
        let payStartTime = this.Search.payStartTime;
        let payEndTime = this.Search.payEndTime;
        let saleName = this.Search.saleName;
        let teamName = this.Search.teamName;
        startTime = this.Search.submitStartTime;
        endTime = this.Search.submitEndTime;
        console.log (startTime);
        console.log (endTime);
        if (!startTime && !startTime && !studentName && !orderNo && !studentPhone && !payStartTime && !payEndTime && !saleName && !teamName) {
          return true;
        } else {
          return false;
        }
      },
      exportExcel () {
        let isSearchNull = this.isSearchNull ();
        if (isSearchNull) {
          const _this = this;
          this.$Modal.confirm ({
            title: '导出',
            content: '没有选择任何筛选条件，将导出全部数据',
            onOk () {
              _this.exportData ();
            }
          });
        } else {
          this.exportData ();
        }
      },
      getFullPhone (phone) {
        getFullPhone (phone, COMMON_API ().Phone.getFullPhone);
      },
      changeShDate (value) {
        this.Search.checkStartTime = value[0] || '';
        this.Search.checkEndTime = value[1] || '';
      },
      changePayDate (value) {
        this.Search.payStartTime = value[0] || '';
        this.Search.payEndTime = value[1] || '';
      },
      pageChange (pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm ();
      },
      markRefund (param) {
        const _this = this;
        this.RefundModal = true;
        this.params = param;
//************************************
        // this.$Modal.confirm({
        //   title: '',
        //   content: '确认标记为已退费？',
        //   onOk: () => {
        //     this.$Message.info('点击了确定');
        //     common.ajax({
        //       url: FINANCE().Tongji.markForRefund,
        //       data:{
        //         orderNo:param,
        //       },
        //       method: 'get',
        //       success: function (res) {
        //         console.log(res);
        //         _this.searchForm();
        //       }
        //     });
        //   },
        //   onCancel: () => {
        //     this.$Message.info('点击了取消');
        //   }
        // });
//************************************
      },
      refundOk (name) {
        const _this = this;
        this.loading = false;
        this.$refs[name].validate ((valid) => {
          if (valid) {
            // common.ajax({
            //   url: FINANCE().Tongji.markForRefund,
            //   data:{
            //     orderNo:_this.params,
            //     refundAmount:_this.FormData.refund,
            //   },
            //   method: 'get',
            //   success: function (res) {
            //     console.log(res);
            //     _this.searchForm();
            //   }
            // });
            this.$axios.get (FINANCE ().Tongji.markForRefund, {
              params: {
                orderNo: _this.params,
                refundAmount: _this.FormData.refund,
              }
            }).then (() => {
              _this.searchForm ();
            })
            this.historyRemarkModal = false;
          } else {
            setTimeout (() => {
              this.loading = true;
            }, 0);
          }
        });
      },
      changeTableColumns () {
        this.columns = this.getTableColumns ();
      },
      paymentDetailShow (list) {
        this.paymentDetailModal = true
        this.paymentDetailData = list
      },
      paymentDetailOk () {
        this.paymentDetailModal = false
        this.paymentDetailData = []
      },
      reFresh () {
        this.searchForm ();
      }
    },
    computed: {
      theight () {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470 : '';
      }
    },
    components: {OBreadcrumb, PageModel, greenChannel}
  };
</script>
<style>
</style>
