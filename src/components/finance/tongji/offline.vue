<template>
  <div>
    <o-breadcrumb second="财务" third="线下业绩统计"></o-breadcrumb>
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
            <i-select v-model="Search.receiptStatus" :size="$store.state.searchModuleSize" clearable placeholder="是否开票"
                      style="width:120px">
              <i-option value="0">未开</i-option>
              <i-option value="1">已开</i-option>
            </i-select>
          </form>
        </i-col>
        <i-col span=24 class="left">
          <Date-picker type="daterange" :size="$store.state.searchModuleSize" placement="bottom-start"
                       @on-change="changeShDate" placeholder="审核时间" style="width: 200px"></Date-picker>
          <Date-picker type="daterange" :size="$store.state.searchModuleSize" placement="bottom-start"
                       @on-change="changePayDate" placeholder="提交时间" style="width: 200px"></Date-picker>
          <i-select v-model="Search.payType" :size="$store.state.searchModuleSize" clearable placeholder="支付方式"
                    style="width:100px">
            <i-option value="bank">银行</i-option>
            <i-option value="taobao">淘宝</i-option>
            <i-option value="alipay">支付宝</i-option>
            <i-option value="weixin">微信</i-option>
            <i-option value="kuStaging">库分期</i-option>
            <i-option value="baiduStaging">百度分期</i-option>
            <i-option value="lovehaimi">爱海米分期</i-option>
            <i-option value="huixuexi">惠学习</i-option>
            <i-option value="huixuexi_qr">惠学习扫码支付</i-option>
            <i-option value="fendan">分蛋分期</i-option>
          </i-select>
          <i-select v-model="Search.isRefund" :size="$store.state.searchModuleSize" clearable placeholder="是否退费"
                    style="width:100px">
            <i-option value="1">是</i-option>
            <i-option value="0">否</i-option>
          </i-select>
          <i-select v-model="Search.channelName" :size="$store.state.searchModuleSize" filterable clearable
                    placeholder="渠道名称" style="width:150px;">
            <i-option v-for="(item,index) in allChannelList" :key='index' :value="item.name">{{ item.name }}</i-option>
          </i-select>
          <i-select v-model="Search.saleType" :size="$store.state.searchModuleSize" style="width:100px"
                    placeholder="销售类型" clearable>
            <i-option value="cc">cc</i-option>
            <i-option value="cr">cr</i-option>
          </i-select>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索
          </i-button>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-download-outline"
                    @click="exportExcel">导出
          </i-button>
        </i-col>
      </Row>
    </div>
    <div class="left" style="font-size: 15px;margin-left: 8px;">
      <span style="font-weight: 700;">总金额：</span><span style="">{{totalAmount}}</span>
    </div>
    <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns" class="left"
                    style="margin-left: 8px;">
      <checkbox label="leadsName">学生</checkbox>
      <checkbox label="leadsPhone">手机号</checkbox>
      <checkbox label="grade">年级</checkbox>
      <checkbox label="courseHour">课时</checkbox>
      <checkbox label="giveLength">赠送课时</checkbox>
      <checkbox label="sumLength">总课时</checkbox>
      <checkbox label="money">金额</checkbox>
      <checkbox label="submitter">所属销售</checkbox>
      <checkbox label="channelName">渠道名称</checkbox>
      <checkbox label="paymentDetailList">付费详情</checkbox>
      <checkbox label="saleType">销售类型</checkbox>
      <checkbox label="teamName">所属团队</checkbox>
      <checkbox label="invoiceNum">发票号</checkbox>
      <checkbox label="payType">支付方式</checkbox>
      <checkbox label="payTime">提交时间</checkbox>
      <checkbox label="checkTime">审核时间</checkbox>
      <checkbox label="checkUser">审核人</checkbox>
      <checkbox label="payRemark">付费备注</checkbox>
      <checkbox label="isRefund">是否退费</checkbox>
      <checkbox label="refundAmount">退费金额</checkbox>
      <checkbox label="refundDate">退费日期</checkbox>
    </checkbox-group>
    <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">

      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
    <Modal
      v-model="RefundModal"
      title="标记为退费"
      :loading="loading"
    >
      <i-form ref="formValidateRefund" :model="FormData" :rules="ruleValidateRefund">
        <Form-item prop="refund" label="订单退费金额">
          <i-input v-model="FormData.refund" style="width:120px;" number></i-input>
          <span style="margin-left: 10px;">元</span>
        </Form-item>
        <Form-item prop="refundDate" label="订单退费日期">
          <date-picker type="date" @on-change="changeRefoundDate" placeholder="选择退费日期"
                       style="width: 200px"></date-picker>
        </Form-item>
      </i-form>
      <div slot="footer">
        <Button type="primary" :size="$store.state.searchModuleSize" @click="refundOk('formValidateRefund')">确定</Button>
      </div>
    </Modal>
    <Modal
      v-model="paymentDetailModal"
      title="查看付费详情"
      :closable="false"
      :mask-closable="false"
      :loading="loading">
      <i-table size="small" :columns="paymentDetailColumns" :data="paymentDetailData"></i-table>
      <div slot="footer">
        <Button type="primary" :size="$store.state.searchModuleSize" @click="paymentDetailOk">确定</Button>
      </div>
    </Modal>
    <Modal
      v-model="modal"
      title="确认已开发票"
      :closable="false"
      :mask-closable="false"
      :loading="loading"
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
  import {formateDate, common, hideCharAtNumber, getFullPhone} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

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
        totalAmount: '',
        modal: false,
        formItem: {
          receiptNum: '',
          payUuid: ''
        },
        ruleValidate: {
          receiptNum: [
            {required: true, message: '请输入正确发票号', trigger: 'blur'}
          ]
        },
        columns: [],
        allChannelList: [],
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
              } else if (params.row.payType === 'pingpp') {
                return h ('span', 'ping++')
              } else if (params.row.payType === 'wx_pub_qr') {
                return h ('span', '微信扫码')
              } else if (params.row.payType === 'alipay_qr') {
                return h ('span', '支付宝扫码')
              } else if (params.row.payType === 'huixuexi_qr') {
                return h ('span', '惠学习扫码支付')
              } else if (params.row.payType === 'fendan') {
                return h ('span', '分蛋分期')
              } else {
                return h ('span', params.row.payType)
              }
            }
          },
          {
            title: '交易编号',
            key: 'orderDetailNo',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '外部编号',
            key: 'transactionNo',
            align: 'center',
            minWidth: 90,
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
          {
            title: '付费截图',
            key: 'paymentDate',
            align: 'center',
            minWidth: 120,
            render: (h, params) => {
              let app = this
              return h ('a', {
                on: {
                  click () {
                    app.$Modal.confirm ({
                      title: '',
                      content: "<img class='payImg' src='" + params.row.fileAddress + "'>",
                      onOk () {

                      }
                    })
                  }
                }
              }, '查看付费截图')
            }
          },
        ],
        loading: false,
        FormData: {
          refund: '',
          refundDate: '',
        },
        RefundModal: false,
        paymentDetailModal: false,
        tableColumnsChecked: ['leadsName', 'leadsPhone', 'grade', 'courseHour', 'giveLength', 'sumLength', 'money', 'submitter', 'channelName', 'paymentDetailList', 'saleType', 'teamName', 'invoiceNum', 'payType', 'payTime', 'checkTime', 'checkUser', 'payRemark', 'isRefund', 'refundAmount', 'refundDate', 'action'],
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
          payType: '',
          saleName: '',
          teamName: '',
          receiptStatus: '',
          saleType: '',
          isRefund: '',
          orderNo: '',
          channelName: '',
        },
        columns: [],
        params: '',
        ruleValidateRefund: {
          refund: [
            {required: true, type: 'number', message: '请输入金额', trigger: 'blur'},
          ],
          refundDate: [
            {required: true, message: '请选择日期', trigger: 'change'}
          ]
        },
      }
    },
    mounted () {
      let _this = this
      this.searchForm ();
      this.changeTableColumns ();
      // 获取所有渠道
      common.ajax ({
        url: COMMON_API ().allChannel,
        method: 'get',
        success: function (response) {
          _this.allChannelList = response.data || [];
        }
      });
    },
    methods: {
      reasonOk (name) {
        const _this = this;
        this.loading = false;
        this.$refs[name].validate ((valid) => {
          if (valid) {
            this.$axios.post (FINANCE ().invoice.writeInvoice, {
              cpPayRequestUuid: _this.formItem.payUuid,
              receiptNum: _this.formItem.receiptNum,
              // receiptStatus:　1
            }).then (() => {
              _this.modal = false;
              common.notices ('操作成功！');
              _this.searchForm ();
            })
          } else {
            setTimeout (() => {
              this.loading = true;
            }, 0);
          }
        });
      },
      pass (payUuid, leadsUuid) {
        this.modal = true;
        this.formItem.payUuid = payUuid;
      },
      getTableColumns () {
        const columns = {
          payNo: {
            title: '订单号',
            key: 'payNo',
            align: 'center',
            fixed: 'left',
            minWidth: 180,
          },
          leadsName: {
            title: '学生',
            key: 'leadsName',
            align: 'center',
            minWidth: 90,
          },
          leadsPhone: {
            title: '手机号',
            key: 'leadsPhone',
            align: 'center',
            minWidth: 120,
            render: (h, params) => {
              if (params.row.leadsPhone) {
                return h ('div', [
                  h ('span', hideCharAtNumber (params.row.leadsPhone)),
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
                        this.getFullPhone (params.row.leadsPhone)
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
          sumLength: {
            title: '总课时',
            key: 'sumLength',
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
          channelName: {
            title: '渠道名称',
            key: 'channelName',
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
          saleType: {
            title: '销售类型',
            key: 'saleType',
            align: 'center',
            minWidth: 90,
          },
          teamName: {
            title: '所属团队',
            key: 'teamName',
            align: 'center',
            minWidth: 120,
          },
          invoiceNum: {
            title: '发票号',
            key: 'invoiceNum',
            align: 'center',
            minWidth: 120,
          },
          payType: {
            title: '支付方式',
            key: 'payType',
            align: 'center',
            minWidth: 120,
            render (h, params) {
              if (params.row.payType === "bank") {
                return h ('span', '银行');
              } else if (params.row.payType === "taobao") {
                return h ('span', '淘宝');
              } else if (params.row.payType === "alipay") {
                return h ('span', '支付宝');
              } else if (params.row.payType === "weixin") {
                return h ('span', '微信');
              } else if (params.row.payType === "kuStaging") {
                return h ('span', '库分期');
              } else if (params.row.payType === "baiduStaging") {
                return h ('span', '百度分期');
              } else if (params.row.payType === "lovehaimi") {
                return h ('span', '爱海米分期');
              } else if (params.row.payType === "wx_pub_qr") {
                return h ('span', '微信扫码');
              } else if (params.row.payType === "alipay_qr") {
                return h ('span', '支付宝扫码');
              } else if (params.row.payType === "huixuexi") {
                return h ('span', '惠学习');
              } else if (params.row.payPurpose === 'huixuexi_qr') {
                return h ('span', '惠学习扫码支付')
              }else if (params.row.payType === 'fendan') {
                return h ('span', '分蛋分期')
              } else {
                return h ('span', "未知渠道：" + params.row.payType);
              }
            }
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
          checkUser: {
            title: '审核人',
            key: 'checkUser',
            align: 'center',
            minWidth: 90,
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
          refundDate: {
            title: '退费日期',
            key: 'refundDate',
            align: 'center',
            minWidth: 90,
          },
          receiptStatus: {
            title: '发票状态',
            key: 'receiptStatus',
            align: 'center',
            minWidth: 90,
            render (h, params) {
              if (params.row.receiptStatus === 0) {
                return h ('span', "未开发票")
              } else if (params.row.receiptStatus === 1) {
                return h ('span', "已开发票")
              }
            }
          },
          action: {
            title: '操作',
            align: 'center',
            fixed: 'right',
            minWidth: 200,
            render: (h, params) => {
              if (params.row.isRefund === 1) {
                if (params.row.receiptStatus == 0) {
                  return h ('div', [
                    h ('Button', {
                      props: {
                        type: 'primary',
                        size: 'small',
                      },
                      style: {
                        margin: '2px',
                      },
                      attrs: {
                        disabled: true
                      },
                      on: {
                        click: () => {
                          this.markRefund (params.row.payNo)
                        }
                      }
                    }, '标记为已退费'),
                    h ('Button', {
                      props: {
                        type: 'success',
                        size: 'small',
                        // icon: 'paper-airplane',
                      },
                      style: {
                        margin: '2px',
                      },
                      on: {
                        click: () => {
                          this.pass (params.row.payUuid, params.row.receiptStatus)
                        }
                      }
                    }, '确认已开发票')
                  ])
                } else {
                  return h ('div', [
                    h ('Button', {
                      props: {
                        type: 'primary',
                        size: 'small',
                      },
                      style: {
                        margin: '2px',
                      },
                      attrs: {
                        disabled: true
                      },
                      on: {
                        click: () => {
                          this.markRefund (params.row.payNo)
                        }
                      }
                    }, '标记为已退费'),
                    h ('Button', {
                      props: {
                        type: 'success',
                        size: 'small',
                      },
                      style: {
                        margin: '2px',
                      },
                      attrs: {
                        disabled: true
                      }
                    }, '已开发票')
                  ])
                }
              } else if (params.row.isRefund === 0) {
                if (params.row.receiptStatus == 0) {
                  return h ('div', [
                    h ('Button', {
                      props: {
                        type: 'primary',
                        size: 'small',
                        // icon: 'paper-airplane',
                      },
                      style: {
                        margin: '2px',
                      },
                      attrs: {},
                      on: {
                        click: () => {
                          this.markRefund (params.row.payNo)
                        }
                      }
                    }, '标记为已退费'),
                    h ('Button', {
                      props: {
                        type: 'success',
                        size: 'small',
                        // icon: 'paper-airplane',
                      },
                      style: {
                        margin: '2px',
                      },
                      on: {
                        click: () => {
                          this.pass (params.row.payUuid, params.row.receiptStatus)
                        }
                      }
                    }, '确认已开发票')
                  ])
                } else {
                  return h ('div', [
                    h ('Button', {
                      props: {
                        type: 'primary',
                        size: 'small',
                        // icon: 'paper-airplane',
                      },
                      style: {
                        margin: '2px',
                      },
                      attrs: {},
                      on: {
                        click: () => {
                          this.markRefund (params.row.payNo)
                        }
                      }
                    }, '标记为已退费'),
                    h ('Button', {
                      props: {
                        type: 'success',
                        size: 'small',
                      },
                      style: {
                        margin: '2px',
                      },
                      attrs: {
                        disabled: true
                      }
                    }, '已开发票')
                  ])
                }
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
          payType: this.Search.payType,
          saleName: this.Search.saleName,
          teamName: this.Search.teamName,
          receiptStatus: this.Search.receiptStatus,
          checkStartTime: this.Search.checkStartTime,
          checkEndTime: this.Search.checkEndTime,
          payStartTime: this.Search.payStartTime,
          payEndTime: this.Search.payEndTime,
          saleType: this.Search.saleType,
          isRefund: this.Search.isRefund,
          channelName: this.Search.channelName,
        });
      },
      loadDataGrid (search, orderBy = '', sortBy = '') {
        let param = `?studentName=${search.studentName}&orderNo=${search.orderNo}&studentPhone=${search.studentPhone}&payType=${search.payType}&saleName=${search.saleName}&teamName=${search.teamName}&receiptStatus=${search.receiptStatus}&checkStartTime=${search.checkStartTime}&checkEndTime=${search.checkEndTime}&payStartTime=${search.payStartTime}&payEndTime=${search.payEndTime}&channelName=${search.channelName}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}&saleType=${search.saleType}&isRefund=${search.isRefund}`;
        const _this = this;
        this.$axios.get (FINANCE ().Tongji.offlineDataGrid + param, {}).then (({data}) => {
          _this.data = data.data['deesInfoVos'] || [];
          _this.totalAmount = data.data['totalAmount'] || '';
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
        let payType = this.Search.payType;
        let saleName = this.Search.saleName;
        let teamName = this.Search.teamName;
        let channelName = this.Search.channelName;

        startTime = this.Search.submitStartTime;
        endTime = this.Search.submitEndTime;
        console.log (startTime);
        console.log (endTime);
        if (!startTime && !startTime && !studentName && !orderNo && !studentPhone && !payStartTime && !payEndTime && !payType && !saleName && !teamName && !channelName) {
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
      exportData () {
        let startTime = '', endTime = '';
        let studentName = this.Search.studentName;
        let orderNo = this.Search.orderNo;
        let studentPhone = this.Search.studentPhone;
        let payStartTime = this.Search.payStartTime;
        let payEndTime = this.Search.payEndTime;
        let payType = this.Search.payType;
        let saleName = this.Search.saleName;
        let teamName = this.Search.teamName;
        let channelName = this.Search.channelName;
        startTime = this.Search.checkStartTime;
        endTime = this.Search.checkEndTime;
        let apiUrl = FINANCE ().offLineSale.generateTeamKpiExcel;
        // apiUrl += `?token=${localStorage.getItem('token')}&checkStartTime=${startTime}&checkEndTime=${endTime}&studentName=${studentName}&studentPhone=${studentPhone}&payStartTime=${payStartTime}&payEndTime=${payEndTime}&submitStartTime=${payStartTime}&submitEndTime=${payEndTime}&payType=${payType}&saleName=${saleName}&teamName=${teamName}`;
        apiUrl += `?token=${localStorage.getItem ('token')}&payStartTime=${payStartTime}&payEndTime=${payEndTime}&checkStartTime=${startTime}&checkEndTime=${endTime}&channelName=${channelName}`;
        GLOBAL.newTab (apiUrl, true);
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
            this.$axios.get (FINANCE ().Tongji.markForRefund, {
              params: {
                orderNo: _this.params,
                refundAmount: _this.FormData.refund,
                refundDate: _this.FormData.refundDate,
              }
            }).then ((res) => {
              if (res.data.code == '100') {
                common.notices ('标记成功！！');
              }
              _this.RefundModal = false;
              _this.searchForm ();
            })
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
      changeRefoundDate (value) {
        this.FormData.refundDate = value;
      },
    },
    computed: {
      theight () {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470 : '';
      }
    },
    components: {OBreadcrumb, PageModel}
  };
</script>

<style>
  .payImg {
    display: block;
    width: 300px;
  }
</style>
