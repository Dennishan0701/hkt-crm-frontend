<template>
  <div>
    <o-breadcrumb second="财务" third="线下已审核业绩"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <form id="searchForm">
            <i-input v-model="Search.leadsName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)"
                     placeholder="老师姓名" style="width:150px;margin-right: 2px;"></i-input>
            <i-input v-model="Search.leadsPhone" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)"
                     placeholder="手机号码" style="width:150px;margin-right:2px;"></i-input>
            <i-input v-model="Search.submitter" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)"
                     placeholder="提交人" style="width:150px;margin-right:2px;"></i-input>
            <i-select v-model="Search.status" :size="$store.state.searchModuleSize" clearable placeholder="状态"
                      style="width:80px">
              <i-option value="1">已审核</i-option>
              <i-option value="2">已拒绝</i-option>
            </i-select>
            <i-select v-model="Search.payType" :size="$store.state.searchModuleSize" clearable style="width:200px">
              <i-option value="bank">银行转账</i-option>
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
            <i-select v-model="Search.saleType" :size="$store.state.searchModuleSize" clearable style="width:100px"
                      placeholder="销售类型">
              <i-option value="cc">cc</i-option>
              <i-option value="cr">cr</i-option>
            </i-select>
          </form>
        </i-col>
        <i-col span=24 class="right">
          <Date-picker type="daterange" :size="$store.state.searchModuleSize" placement="bottom-end"
                       @on-change="changeSubmitDate" placeholder="提交时间" style="width: 200px"></Date-picker>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索
          </i-button>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-download-outline"
                    @click="exportExcel">导出
          </i-button>
        </i-col>
      </Row>
    </div>
    <!--<i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>-->
    <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
      <!--<checkbox value="payNo">订单号</checkbox>-->
      <checkbox label="teamName">签单团队</checkbox>
      <checkbox label="leadsName">学生</checkbox>
      <checkbox label="leadsPhone">手机号</checkbox>
      <checkbox label="grade">年级</checkbox>
      <checkbox label="courseHour">课时</checkbox>
      <checkbox label="giveLength">赠送课时</checkbox>
      <checkbox label="sumLength">总课时</checkbox>
      <checkbox label="money">金额</checkbox>
      <checkbox label="payType">支付方式</checkbox>
      <checkbox label="saleType">销售类型</checkbox>
      <checkbox label="submitter">提交人</checkbox>
      <checkbox label="submitTime">提交时间</checkbox>
      <checkbox label="lender">贷款人</checkbox>
      <checkbox label="lenderPhone">贷款人手机号</checkbox>
      <checkbox label="payPicture">付费截图</checkbox>
      <checkbox label="checkStatus">状态</checkbox>
      <checkbox label="checkTime">审核时间</checkbox>
      <checkbox label="checkUser">审核人</checkbox>
      <checkbox label="payRemark">付费备注</checkbox>
    </checkbox-group>
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

  export default {
    data () {
      return {
        data: [],
        tableColumnsChecked: ['teamName', 'leadsName', 'leadsPhone', 'grade', 'courseHour', 'giveLength', 'sumLength', 'money', 'payType', 'saleType', 'submitter', 'submitTime', 'lender', 'lenderPhone', 'payPicture', 'checkStatus', 'checkTime', 'checkUser', 'payRemark'],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        Search: {
          leadsName: '',
          leadsPhone: '',
          submitter: '',
          status: '',
          submitStartTime: '',
          payType: '',
          submitEndTime: '',
          saleType: '',
        },
        columns: [],
      }
    },
    mounted () {
      this.searchForm ();
      this.changeTableColumns ();
    },
    methods: {
      getTableColumns () {
        const columns = {
          payNo: {
            title: '订单号',
            key: 'payNo',
            align: 'center',
            fixed: 'left',
            minWidth: 190,
          },
          teamName: {
            title: '签单团队',
            key: 'teamName',
            align: 'center',
            minWidth: 160,
          },
          leadsName: {
            title: '学生',
            key: 'leadsName',
            align: 'center',
            minWidth: 90,
            render: (h, params) => {
              return h ('div', [
                h ('strong', {}, params.row.leadsName)
              ])
//          return `<strong>${row.leadsName}</strong>`;
            }
          },
          leadsPhone: {
            title: '手机号',
            key: 'leadsPhone',
            align: 'center',
            minWidth: 120,
            render: (h, params) => {
              if (params.row.leadsPhone) {
                return h ('div', [
                  h ('span', {}, hideCharAtNumber (params.row.leadsPhone)),
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
              } else {
                return '-';
              }
            }
          },
          grade: {
            title: '年级',
            key: 'grade',
            align: 'center',
            minWidth: 90,
          },
          courseHour: {
            title: '课时',
            key: 'courseHour',
            align: 'center',
            minWidth: 90,
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
          payType: {
            title: '支付方式',
            key: 'payType',
            align: 'center',
            minWidth: 90,
            render: (h, params) => {
              if (params.row.payType === "bank") {
                return h ('span', '银行');
              } else if (params.row.payType === "taobao") {
                return h ('span', '淘宝');
              } else if (params.row.payType === "alipay") {
                return h ('span', '支付宝');
              } else if (params.row.payType === "weixin") {
                return h ('span', '微信');
              }else if (params.row.payType == 'kuStaging') {
                return h ('span', {}, '库分期');
              } else if (params.row.payType === "huixuexi") {
                return h ('span', '惠学习');
              } else if (params.row.payType === "wx_pub_qr") {
                return h ('span', '微信扫码');
              }else if (params.row.payType === "alipay_qr") {
                return h ('span', '支付宝扫码');
              } else if (params.row.payType === 'huixuexi_qr') {
                return h ('span', '惠学习扫码支付')
              }else if (params.row.payType === 'fendan') {
                return h ('span', '分蛋分期')
              }else {
                return h ('span', {}, params.row.payType);
              }
            }
          },
          saleType: {
            title: '销售类型',
            key: 'saleType',
            minWidth: 90,
          },
          submitter: {
            title: '提交人',
            key: 'submitter',
            align: 'center',
            minWidth: 90,
          },
          submitTime: {
            title: '提交时间',
            key: 'submitTime',
            align: 'center',
            minWidth: 160,
            render (h, params) {
              return h ('span', formateDate (params.row.submitTime, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          lender: {
            title: '贷款人',
            key: 'lender',
            align: 'center',
            minWidth: 90,
          },
          lenderPhone: {
            title: '贷款人手机号',
            key: 'lenderPhone',
            align: 'center',
            minWidth: 90,
          },
          payPicture: {
            title: '付费截图',
            key: 'payPicture',
            align: 'center',
            minWidth: 90,
            render: (h, params) => {
              let params1 = '暂无';
              const _this = this;
              if (params.row.payPictureUrl) {
                params1 = [];
                params.row.payPictureUrl.forEach (function (v, i) {
                  params1.push (h ('Poptip', {
                      props: {
                        trigger: 'hover'
                      },
                      style: {
                        margin: '5px 0'
                      },
                      attrs: {
                        href: 'javascript:;'
                      }
                    }, [
                      h ('a', {
                        on: {
                          click: () => {
                            _this.openNew (v)
                          }
                        }
                      }, `付款截图${i}`),
                      h ('div', {
                        slot: 'content',
                        style: {
                          maxHeight: '500px'
                        }
                      }, [
                        h ('img', {
                          attrs: {
                            src: v
                          },
                          style: {
                            maxWidth: '90px'
                          }
                        })
                      ])
                    ]),
                  )
                })
              }
              return h ('span', params1)
            }
          },
          checkStatus: {
            title: '状态',
            key: 'checkStatus',
            align: 'center',
            minWidth: 90,
            render: (h, params) => {
              if (params.row.checkStatus == 1) {
                return h ('div', [
                  h ('span', {
                    attrs: {
                      class: 'o-tag green'
                    }
                  }, '已审核')
                ])
//            return '<span class="o-tag green">已审核</span>';
              } else if (params.row.checkStatus == 2) {
                return h ('div', [
                  h ('span', {
                    attrs: {
                      class: 'o-tag red'
                    }
                  }, '已拒绝')
                ])
//            return '<span class="o-tag red">已拒绝</span>';
              } else {
                return '未知状态' + params.row.checkStatus;
              }
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
            align: 'center',
            key: 'checkUser',
            minWidth: 90,
          },
          payRemark: {
            title: '付费备注',
            key: 'payRemark',
            minWidth: 150,
          },
        };
        let datas = [columns.payNo];
        this.tableColumnsChecked.forEach (col => datas.push (columns[col]));
        return datas;
      },
      openNew (payPicture) {
        console.log (payPicture);
        let open = window.open ();
        open.location.href = payPicture
      },
      searchForm (val) {
        if (val) this.pageIndex = val;
        this.loadDataGrid ({
          leadsName: this.Search.leadsName,
          leadsPhone: this.Search.leadsPhone,
          submitter: this.Search.submitter,
          status: this.Search.status,
          submitStartTime: this.Search.submitStartTime,
          submitEndTime: this.Search.submitEndTime,
          payType: this.Search.payType,
          saleType: this.Search.saleType,
        });
      },
      loadDataGrid (search, orderBy = '', sortBy = '') {
        let param = `?leadsName=${search.leadsName}&leadsPhone=${search.leadsPhone}&payType=${search.payType}&submitter=${search.submitter}&submitStartTime=${search.submitStartTime}&submitEndTime=${search.submitEndTime}&checkStatus=${search.status}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}&saleType=${search.saleType}`;
        const _this = this;
        // common.ajax({
        //   url: FINANCE().AlreadyCheckDeeds.dataGrid + param,
        //   method: 'get',
        //   success: function (res) {
        //     _this.data = res.data['chenckDeedsVos'] || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get (FINANCE ().AlreadyCheckDeeds.dataGrid + param, {}).then (({data}) => {
          _this.data = data.data['chenckDeedsVos'] || [];
          _this.total = data.data.total;
        })
      },
      isSearchNull () {
        let startTime = '', endTime = '';
        let leadsName = this.Search.leadsName;
        let leadsPhone = this.Search.leadsPhone;
        let submitter = this.Search.submitter;
        let payType = this.Search.payType;
        let status = this.Search.status;
        let saleType = this.Search.saleType;

        startTime = this.Search.submitStartTime;
        endTime = this.Search.submitEndTime;
        console.log (startTime);
        console.log (endTime);
        if (!startTime && !startTime && !leadsName && !leadsPhone && !submitter && !payType && !status && !saleType) {
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

        let leadsName = this.Search.leadsName;
        let leadsPhone = this.Search.leadsPhone;
        let submitter = this.Search.submitter;
        let payType = this.Search.payType;
        let status = this.Search.status;
        let saleType = this.Search.saleType;

        startTime = this.Search.submitStartTime;
        endTime = this.Search.submitEndTime;
        let apiUrl = FINANCE ().alreadySale.generateTeamKpiExcel;
        apiUrl += `?token=${localStorage.getItem ('token')}&submitStartTime=${startTime}&submitEndTime=${endTime}&leadsName=${leadsName}&leadsPhone=${leadsPhone}&submitter=${submitter}&payType=${payType}&checkStatus=${status}&saleType=${saleType}`;
        GLOBAL.newTab (apiUrl, true);

      },
      getFullPhone (phone) {
        getFullPhone (phone, COMMON_API ().Phone.getFullPhone);
      },
      changeSubmitDate (value) {
        this.Search.submitStartTime = value[0] || '';
        this.Search.submitEndTime = value[1] || '';
      },
      pageChange (pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm ();
      },
      changeTableColumns () {
        this.columns = this.getTableColumns ();
      }
    },
    computed: {
      theight () {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470 : '';
      }
    },
    components: {
      OBreadcrumb, PageModel
    }
  };
</script>

<style>

</style>
