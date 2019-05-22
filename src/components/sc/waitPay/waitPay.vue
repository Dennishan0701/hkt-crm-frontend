<template>
  <div>
    <o-breadcrumb second="销售与客服" third="待付费"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <i-input :size="$store.state.searchModuleSize" v-model="paramStr" @on-keyup.enter="searchForm(1)"
                   placeholder="学生\手机号" style="width:150px;margin-right:2px;"></i-input>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索
          </i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
    <pay-request @reFresh="reFresh" ref="payrequest"></pay-request>
    <view-pay-request ref="viewpayrequest"></view-pay-request>
    <create-order @reFresh="reFresh" ref="createOrder"></create-order>
    <hand-out-remark @reFresh="reFresh" ref="handOutRemark"></hand-out-remark>
  </div>
</template>
<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {SCS} from 'common/api/scs.js';
  import {common, hideCharAtNumber, getFullPhone} from 'common/js/common.js';
  import payRequest from 'components/sc/myStudent/ccPayRequest.vue';
  import viewPayRequest from 'components/sc/waitPay/viewPayRequest.vue';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import createOrder from 'components/sc/myStudent/createOrder';
  import handOutRemark from 'components/sc/contractStudents/handOutRemark';
  import PageModel from 'dashborader/page/page.vue';

  let localStorage = $.localStorage;
  export default {
    data () {
      return {
        data: [],
        role: localStorage.get ("user").alias,
        total: 0,
        pageIndex: 1,
        pageNumber: 15,
        paramStr: '',
        columns: [
          {
            title: '学生姓名',
            key: 'name',
            align: 'center',
            minWidth: 90,
            render: (h, params) => {
              return h ('div', [
                h ('Icon', {
                  props: {
                    type: 'person'
                  }
                }),
                h ('a', {
                  on: {
                    click: () => {
                      GLOBAL.viewLeadsDetail (params.row.uuid)
                    }
                  }
                }, params.row.name)
              ])
//              return `<strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.uuid}');">${row.name}</a>`;
            }
          },
          {
            title: '手机号',
            key: 'phone',
            align: 'center',
            minWidth: 120,
            render: (h, params) => {
              return h ('div', [
                h ('span', hideCharAtNumber (params.row.phone)),
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
                      this.getFullPhone (params.row.phone)
                    }
                  }
                })
              ])
//              return hideCharAtNumber(row.phone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.phone}')" class="eye" title="显示全部"></Icon>`;
            }
          },
          {
            title: '年级',
            align: 'center',
            key: 'grade',
            minWidth: 90,
          },
          {
            title: '科目',
            align: 'center',
            key: 'subject',
            minWidth: 90,
          },
          {
            title: '状态',
            key: 'isCheck',
            align: 'center',
            minWidth: 90,
            render: (h, params) => {
              if (params.row.isPay == 0) {
                return h ('div', [
                  h ('span', {
                    attrs: {
                      class: 'o-tag yellow'
                    }
                  }, '待审核')
                ])
//                return '<span class="o-tag yellow">待审核</span>';
              } else if (params.row.isPay == 1) {
                return h ('div', [
                  h ('span', {
                    attrs: {
                      class: 'o-tag green'
                    }
                  }, '审核通过')
                ])
//                return '<span class="o-tag green">审核通过</span>';
              } else if (params.row.isPay == 2) {
                return h ('div', [
                  h ('Tooltip', {
                    props: {
                      placement: 'left'
                    },
                    style: {
                      wordWrap: 'break-word'
                    },
                    attrs: {
                      class: 'grey'
                    }
                  }, [
                    h ('span', {
                      class: 'o-tag red'
                    }, '审核拒绝'),
                    h ('div', {
                      slot: 'content',
                      class: 'o-tag red'
                    }, params.row.refuseCause || '-')
                  ])
                ])
              } else if (params.row.isPay == 3) {
                return h ('div', [
                  h ('span', {
                    attrs: {
                      class: 'o-tag grey'
                    }
                  }, '已付定金')
                ])
              } else {
                return h ('div', [
                  h ('span', {
                    attrs: {
                      class: 'o-tag green'
                    }
                  }, '未提交订单')
                ]);
              }
            }
          },
          {
            title: '订单类型',
            align: 'center',
            key: 'orderType',
            minWidth: 90,
            render:(h,params) =>{
              return h ('div', [
                h ('span', {
                }, 'crm订单')
              ])
            }
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            minWidth: 120,
            render: (h, params) => {
              console.log (this.role);
              console.log (params.row);
              if (params.row.isPay == 2 || params.row.isPay == 3) {
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
                      title: ''
                    },
                    on: {
                      click: () => {
                        this.request (params.row.courseOrderUuid, params.row.payOrderUuid, params.row.uuid, params.row.phone, 'secSend')
                      }
                    }
                  }, '重新提交付费申请')
                ])
              }
              else if (params.row.isPay == 1) {
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
                      title: ''
                    },
                    on: {
                      click: () => {
                        this.request (params.row.courseOrderUuid, params.row.payOrderUuid, params.row.uuid, params.row.phone, 'firSend')
                      }
                    }
                  }, '提交付费申请')
                ])
              }
              else if (params.row.isPay === 0) {
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
                    }
                  }, '待审核')
                ])
              }
              else {
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
                      title: ''
                    },
                    on: {
                      click: () => {
                        this.request (params.row.courseOrderUuid, params.row.payOrderUuid, params.row.uuid, params.row.phone, 'firSend')
                      }
                    }
                  }, '提交付费申请')
                ])
              }
            }
          }
        ]
      }
    },
    mounted () {
      this.searchForm ();
    },
    methods: {
      confirm (uuid) {
        const _this = this;
        console.log (uuid);
        let param = {
          isPay: 1,
          uuid: uuid
        }
        this.$Modal.confirm ({
          title: '确认已支付',
          content: '<p>确认学生已付款！！！</p>',
          onOk: () => {
            // common.ajax({
            //   url: SCS().WaitPay.updateCourseOrder,
            //   data:param,
            //   success: function(response){
            //     common.notices(response.msg);
            //     _this.searchForm();
            //   }
            // });
            this.$axios.post (SCS ().WaitPay.updateCourseOrder, {
              isPay: 1,
              uuid: uuid
            }).then (({data}) => {
              common.notices (data.msg);
              _this.searchForm ();
            })
          },
        });
      },
      showCreateOrder (leadsUuid) {
        this.$refs.createOrder.show (leadsUuid);
      },
      getFullPhone (phone) {
        getFullPhone (phone, COMMON_API ().getPhoneHZ, function () {
        });
      },
      viewRequest (payUuid, leadsUuid) {
        this.$refs.viewpayrequest.show (payUuid, leadsUuid);
      },
      request (courseOrderUuid, payOrderUuid, leadsUuid, studentPhone, flag) {
        this.$refs.payrequest.show (courseOrderUuid, payOrderUuid, leadsUuid, studentPhone, 'requestByCC', flag);
        console.log (flag);
      },
      modifyHandOutRemark (leadsUuid) {
        this.$refs.handOutRemark.show (leadsUuid, 'modify');
      },
      loadDataGrid (search, orderBy = '', sortBy = '') {
        let param = `?nameOrPhone=${search.nameOrPhone}&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        let roleName = localStorage.get ('user').roleName;
        let apiUrl = "";
        if (roleName === "班主任") {
          apiUrl = SCS ().WaitPay.cr_dataGrid + param;
        } else {
          apiUrl = SCS ().WaitPay.dataGrid + param;
        }
        const that = this;
        // common.ajax({
        //   url: apiUrl,
        //   method: 'get',
        //   success: function(response){
        //     console.log(response);
        //     that.data = response.data.WaitPayLeads || [];
        //     that.total = response.data.total;
        //   }
        // });
        this.$axios.get (apiUrl, {}).then (({data}) => {
          that.data = data.data.WaitPayLeads || [];
          that.total = data.data.total;
        })
      },
      searchForm (val) {
        if (val) this.pageIndex = val;
        let paramStr = this.paramStr;
        this.loadDataGrid ({
          nameOrPhone: paramStr,
        });
      },
      pageChange (pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm ();
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
    components: {
      OBreadcrumb, payRequest, viewPayRequest, createOrder, handOutRemark, PageModel
    }
  };
</script>
<style>
  .ivu-tooltip-inner {
    padding: 4px 6px !important;
    white-space: normal !important;
    word-break: break-all;
  }
</style>
