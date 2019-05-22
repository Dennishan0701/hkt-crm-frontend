<template>
  <div>
    <o-breadcrumb second="财务" third="待审核业绩"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="left">
          <i-input v-model="Search.orderNo" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)"
                   placeholder="订单号" style="width:150px;margin-right:2px;"></i-input>
          <i-input v-model="Search.leadsName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)"
                   placeholder="学生姓名" style="width:150px;margin-right: 2px;"></i-input>
          <i-input v-model="Search.leadsPhone" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)"
                   placeholder="学生手机号码" style="width:150px;margin-right:2px;"></i-input>
          <i-input v-model="Search.submitter" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)"
                   placeholder="提交人" style="width:150px;margin-right:2px;"></i-input>
          <i-select v-model="Search.payType" :size="$store.state.searchModuleSize" clearable style="width:200px"
                    placeholder="支付方式">
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
          <i-select v-model="Search.largeArea" :size="$store.state.searchModuleSize" clearable style="width:100px"
                    placeholder="大区">
            <i-option value="1">一区</i-option>
            <i-option value="3">三区</i-option>
            <i-option value="4">四区</i-option>
            <i-option value="5">五区</i-option>
          </i-select>
          <i-select v-model="Search.channelName" :size="$store.state.searchModuleSize" filterable clearable
                    @on-clear="clearChannel"
                    placeholder="渠道名称" style="width:150px;">
            <i-option v-for="(item,index) in allChannelList" :key='index' :value="item.name">{{ item.name }}</i-option>
          </i-select>
          <i-select v-model="Search.teamName" :size="$store.state.searchModuleSize" filterable clearable
                    placeholder="所属团队" style="width:150px;">
            <i-option v-for="(item,index) in allTeamList" :key='index' :value="item.name">{{ item.name }}</i-option>
          </i-select>
          <Date-picker type="daterange" :size="$store.state.searchModuleSize" placement="bottom-start"
                       @on-change="changeSubmitDate" placeholder="提交时间" style="width: 200px"></Date-picker>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索
          </i-button>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-download-outline"
                    @click="exportExcel">导出
          </i-button>
        </i-col>
      </Row>
    </div>
    +
    <div class="left" style="font-size: 15px;margin-left: 8px;">
      <span style="font-weight: 700;">总金额：</span><span style="">{{totalAmount}}</span>
    </div>
    <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns" class="left"
                    style="margin-left: 8px;">
      <checkbox label="payNo">订单号</checkbox>
      <checkbox label="leadsName">学生</checkbox>
      <checkbox label="leadsPhone">手机号</checkbox>
      <checkbox label="grade">年级</checkbox>
      <checkbox label="courseHour">课时</checkbox>
      <checkbox label="money">金额</checkbox>
      <checkbox label="giveLength">赠送课时</checkbox>
      <checkbox label="amount">付费金额</checkbox>
      <checkbox label="payType">支付类型</checkbox>
      <checkbox label="payPicture">付费截图</checkbox>
      <checkbox label="payRemark">付费备注</checkbox>
      <checkbox label="channelName">渠道名称</checkbox>
      <checkbox label="teamName">团队</checkbox>

      <checkbox label="sumLength">总课时</checkbox>
      <!--<checkbox label="payType">支付方式</checkbox>-->
      <checkbox label="saleType">销售类型</checkbox>
      <checkbox label="largeArea">大区</checkbox>
      <checkbox label="submitter">提交人</checkbox>
      <checkbox label="submitTime">提交时间</checkbox>
      <!--<checkbox label="fileAddress">付费截图</checkbox>-->
      <!--<checkbox label="lender">贷款人</checkbox>-->
      <!--<checkbox label="lenderPhone">贷款人手机号</checkbox>-->
      <checkbox label="action">操作</checkbox>
    </checkbox-group>
    <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
    <Modal
      v-model="modal"
      title="拒绝原因"
      :closable="false"
      :mask-closable="false"
      :loading="loading"
      @on-ok="reasonOk('formValidate')">
      <i-form ref="formValidate" :model="formItem" :rules="ruleValidate">
        <Form-item prop="reason">
          <i-input type="textarea" v-model="formItem.reason" :rows="4" :maxlength="500"
                   placeholder="不要超过500字"></i-input>
        </Form-item>
      </i-form>
    </Modal>
    <Modal
      v-model="revisemodal"
      title="修改订单信息"
      :closable="false"
      :mask-closable="false"
      :loading="loading"
      @on-ok="reviseOk('formValidateRevise')">
      <i-form ref="formValidateRevise" :model="formItemRevise" :rules="ruleValidateRevise">
        <Form-item prop="money">
          金额：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <i-input v-model="formItemRevise.money"
                   :size="$store.state.searchModuleSize"
                   placeholder="请填入金额"
                   style="width:360px;margin-right: 2px;"></i-input>
          元
        </Form-item>
        <Form-item prop="inActivity">
          备注：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <i-input type="textarea" v-model="formItemRevise.inActivity"
                   :rows="2" :maxlength="500" placeholder="请填入备注"
                   style="width:360px;margin-right: 2px;"></i-input>
        </Form-item>
        <Form-item prop="modifyReason">
          修改原因：
          <i-input type="textarea" v-model="formItemRevise.modifyReason" :rows="4" :maxlength="500"
                   placeholder="不要超过500字" style="width:360px;margin-right: 2px;"></i-input>
        </Form-item>
      </i-form>
    </Modal>
    <Modal title="查看图片" v-model="visible" style="position: relative;z-index: 999999">
      <img :src="imgUrl" v-if="visible" style="width: 400px">
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {FINANCE} from 'common/api/finance.js';
  import {formateDate, common, hideCharAtNumber, getFullPhone, clearSearchForm} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import {REPORT} from 'common/api/report.js';
  import PageModel from 'dashborader/page/page.vue';

  export default {
    data () {
      return {
        visible: false,
        tableColumnsChecked: ['payNo', 'leadsName', 'leadsPhone', 'grade', 'courseHour', 'money', 'giveLength', 'amount', 'payType', 'payPicture', 'payRemark', 'channelName', 'teamName', 'sumLength', 'saleType', 'largeArea', 'submitter', 'submitTime', 'action'],
        modal: false,
        revisemodal: false,
        loading: true,
        data: [],
        totalAmount: '',
        total: 0,
        pageIndex: 1,
        pageNumber: 15,
        payUuid: '',
        id: '',
        Search: {
          leadsName: '',
          leadsPhone: '',
          submitter: '',
          orderNo: '',
          submitStartTime: '',
          payType: '',
          submitEndTime: '',
          saleType: '',
          largeArea: '',
          channelName: '',
          teamName: '',
        },
        formItemRevise: {
          payUuid: '',
          money: '',
          inActivity: '',
          modifyReason: '',
        },
        formItem: {
          reason: ''
        },
        ruleValidate: {
          reason: [
            {required: true, message: '不能为空', trigger: 'change'}
          ]
        },
        ruleValidateRevise: {
          money: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          inActivity: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          modifyReason: [
            {required: true, message: '不能为空', trigger: 'change'}
          ]
        },
        columns: [],
        allChannelList: [],
        allTeamList: [],

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
      // 获取团队
      common.ajax ({
        url: COMMON_API ().ccTeamList,
        method: 'get',
        success: function (response) {
          console.log (response.data);
          _this.allTeamList = response.data || [];
        }
      });
    },
    methods: {
      clearChannel () {

      },
      getTableColumns () {
        const columns = {
          payNo: {
            title: '订单号',
            align: 'center',
            key: 'payNo',
            minWidth: 180,
          },
          leadsName: {
            title: '学生',
            key: 'leadsName',
            align: 'center',
            minWidth: 90,
            render: (h, params) => {
              return h ('div', [
                h ('strong', params.row.leadsName)
              ])
//          return `<strong>${row.leadsName}</strong>`;
            }
          },
          leadsPhone: {
            title: '手机号',
            align: 'center',
            key: 'leadsPhone',
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
              } else {
                return h ('span', '-');
              }
            }
          },
          grade: {
            title: '年级',
            align: 'center',
            key: 'grade',
            minWidth: 90,
          },
          courseHour: {
            title: '课时',
            key: 'courseHour',
            align: 'center',
            minWidth: 90,
          },
          money: {
            title: '总金额',
            key: 'money',
            align: 'center',
            minWidth: 90,
          },
          giveLength: {
            title: '赠送课时',
            align: 'center',
            key: 'giveLength',
            minWidth: 90,
          },
          amount: {
            title: '付费金额',
            key: 'amount',
            align: 'center',
            minWidth: 90,
          },
          payType: {
            title: '支付类型',
            key: 'payPurpose',
            align: 'center',
            minWidth: 90,
            render (h, params) {
              if (params.row.payPurpose === 'taobao') {
                return h ('span', '淘宝')
              } else if (params.row.payPurpose === 'bank') {
                return h ('span', '银行转账')
              } else if (params.row.payPurpose === 'alipay') {
                return h ('span', '支付宝')
              } else if (params.row.payPurpose === 'weixin') {
                return h ('span', '微信')
              } else if (params.row.payPurpose === 'kuStaging') {
                return h ('span', '库分期')
              } else if (params.row.payPurpose === 'baiduStaging') {
                return h ('span', '百度分期')
              } else if (params.row.payPurpose === 'lovehaimi') {
                return h ('span', '爱海米分期')
              } else if (params.row.payPurpose === 'huixuexi') {
                return h ('span', '惠学习')
              }else if (params.row.payPurpose === 'fendan') {
                return h ('span', '分蛋分期')
              } else if (params.row.payPurpose === 'huixuexi_qr') {
                return h ('span', '惠学习扫码支付')
              } else if (params.row.payPurpose === "wx_pub_qr") {
                return h ('span', '微信扫码');
              } else if (params.row.payPurpose === "alipay_qr") {
                return h ('span', '支付宝扫码');
              } else {
                return h ('span', params.row.payPurpose)
              }
            }
          },
          payPicture: {
            title: '付费截图',
            key: 'payPicture',
            align: 'center',
            minWidth: 90,
            render: (h, params) => {
              // let params1 = '暂无';
              const _this = this;
              if (params.row.payPicture) {
                // params1 = [];
                // params.row.payPicture.forEach(function (v, i) {
                //   params1.push(
                return h ('div', [
                  h ('Poptip', {
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
                          _this.openNew (params.row.payPicture)
                        }
                      }
                    }, `付款截图`),
                    h ('div', {
                      slot: 'content',
                      style: {
                        maxHeight: '500px'
                      }
                    }, [
                      h ('img', {
                        attrs: {
                          src: params.row.payPicture
                        },
                        style: {
                          maxWidth: '90px'
                        }
                      })
                    ])
                  ])
                ])
              } else {
                return h ('span', '暂无')
              }
            }
          },
          payRemark: {
            title: '付费备注',
            key: 'inActivity',
            align: 'center',
            minWidth: 260,
          },
          channelName: {
            title: '渠道名称',
            key: 'channelName',
            align: 'center',
            minWidth: 90,
          },
          teamName: {
            title: '团队',
            key: 'teamName',
            align: 'center',
            minWidth: 90,
          },
          sumLength: {
            title: '总课时',
            align: 'center',
            key: 'sumLength',
            minWidth: 90,
          },
          //   payType:{
          //   title: '支付方式',
          //   key: 'payType',
          //     align:'center',
          //     minWidth: 90,
          //   render:(h,params)=>{
          //     if(params.row.payType == 'kuStaging'){
          //       return h('span',{},'库分期');
          //     }else {
          //       return h('span',{},params.row.payType);
          //     }
          //   }
          // },
          saleType: {
            title: '销售类型',
            key: 'saleType',
            align: 'center',
            minWidth: 90,
          },
          largeArea: {
            title: '大区',
            key: 'largeArea',
            align: 'center',
            minWidth: 90,
            render (h, params) {
              if (params.row.largeArea == '1') {
                return h ('span', {}, '一区');
              } else if (params.row.largeArea == '3') {
                return h ('span', {}, '三区');
              } else if (params.row.largeArea == '4') {
                return h ('span', {}, '四区');
              } else if (params.row.largeArea == '5') {
                return h ('span', {}, '五区');
              } else {
                return h ('span', {}, '其他');
              }
            }
          },
          submitter: {
            title: '提交人',
            align: 'center',
            key: 'submitter',
            minWidth: 90,
          },
          submitTime: {
            title: '提交时间',
            align: 'center',
            key: 'submitTime',
            minWidth: 120,
            render (h, params) {
              return h ('span', formateDate (params.row.submitTime, 'yyyy-MM-dd hh:mm:ss'));
            }
          },

          action: {
            title: '操作',
            align: 'center',
            minWidth: 200,
            fixed: 'right',
            render: (h, params) => {
              return h ('div', [
                h ('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.pass (params.row.payUuid, params.row.leadsUuid, params.row.id)
                    }
                  }
                }, '通过'),
                h ('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.reject (params.row.payUuid, params.row.id)
                    }
                  }
                }, '拒绝'),
                h ('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.revise (params.row.payUuid, params.row.money, params.row.inActivity)
                    }
                  }
                }, '修改订单信息'),
              ])
//          return `<i-button type="success" size="small" @click="pass('${row.payUuid}','${row.leadsUuid}')">通过</i-button>
//              <i-button type="error" size="small" @click="reject('${row.payUuid}')">拒绝</i-button>`;
            }
          }
        };
        let datas = [];
        this.tableColumnsChecked.forEach (col => datas.push (columns[col]));
        return datas;
      },
      openNew (payPicture) {
        let open = window.open ();
        open.location.href = payPicture
      },
      pass (payUuid, leadsUuid, id) {
        const _this = this;
        this.$Modal.confirm ({
          title: '确认',
          content: '确认审核通过吗？',
          onOk () {
            // common.ajax({
            //   url: FINANCE().WaitCheckDeeds.pass,
            //   data: {
            //     payUuid: payUuid,
            //     leadsUuid:　leadsUuid
            //   },
            //   success: function(response){
            //     common.notices('操作成功！');
            //     _this.searchForm();
            //   }
            // });
            this.$axios.post (FINANCE ().WaitCheckDeeds.pass, {
              payUuid: payUuid,
              leadsUuid: leadsUuid,
              id: id,
            }).then (() => {
              common.notices ('操作成功！');
              _this.searchForm ();
            })
          }
        });
      },
      reject (payUuid, id) {
        this.payUuid = payUuid;
        this.id = id;
        this.modal = true;
      },
      revise (payUuid, money, inActivity) {
        this.$refs["formValidateRevise"].resetFields ();
        this.formItemRevise.payUuid = payUuid;
        this.formItemRevise.money = money;
        // this.formItemRevise.inActivity = inActivity;
        this.revisemodal = true;
        this.formItemRevise.inActivity = inActivity
      },
      reasonOk (name) {
        const _this = this;
        this.loading = false;
        this.$refs[name].validate ((valid) => {
          if (valid) {
            // common.ajax({
            //   url: FINANCE().WaitCheckDeeds.reject,
            //   data: {
            //     payUuid: _this.payUuid,
            //     refuseCause: _this.formItem.reason
            //   },
            //   success: function(response){
            //     _this.modal = false;
            //     common.notices('操作成功！');
            //     _this.searchForm();
            //   }
            // });
            this.$axios.post (FINANCE ().WaitCheckDeeds.reject, {
              payUuid: _this.payUuid,
              refuseCause: _this.formItem.reason,
              id: _this.id
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
      // 修改订单信息
      reviseOk (name) {
        const _this = this;
        this.loading = false;
        this.$refs[name].validate ((valid) => {
          if (valid) {
            this.$axios.post (FINANCE ().WaitCheckDeeds.revise, {
              payUuid: this.formItemRevise.payUuid,
              money: this.formItemRevise.money,
              inActivity: this.formItemRevise.inActivity,
              modifyReason: this.formItemRevise.modifyReason,
            }).then (({data}) => {
              _this.revisemodal = false;
              common.notices (data.msg);
              _this.searchForm ();
            })
          } else {
            setTimeout (() => {
              this.loading = true;
            }, 0);
          }
        });
      },
      searchForm (val) {
        if (val) this.pageIndex = val;
        this.loadDataGrid ({
          leadsName: this.Search.leadsName,
          leadsPhone: this.Search.leadsPhone,
          submitter: this.Search.submitter,
          orderNo: this.Search.orderNo,
          submitStartTime: this.Search.submitStartTime,
          submitEndTime: this.Search.submitEndTime,
          payType: this.Search.payType,
          saleType: this.Search.saleType,
          largeArea: this.Search.largeArea,
          channelName: this.Search.channelName,
          teamName: this.Search.teamName,
        });
      },
      loadDataGrid (search, orderBy = '', sortBy = '') {
        let param = `?leadsName=${search.leadsName}&leadsPhone=${search.leadsPhone}&payType=${search.payType}&submitter=${search.submitter}&submitStartTime=${search.submitStartTime}&submitEndTime=${search.submitEndTime}&orderNo=${search.orderNo}&channelName=${search.channelName}&teamName=${search.teamName}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}&saleType=${search.saleType}&largeArea=${search.largeArea}`;
        const _this = this;
        this.$axios.get (FINANCE ().WaitCheckDeeds.dataGrid + param, {}).then (({data}) => {
          _this.data = data.data['waitCheckDeedsVos'] || [];
          _this.totalAmount = data.data['totalAmount'] || '';
          _this.total = data.data.total;
        })
      },
      isSearchNull () {
        let startTime = '', endTime = '';
        let leadsName = this.Search.leadsName;
        let leadsPhone = this.Search.leadsPhone;
        let submitter = this.Search.submitter;
        let orderNo = this.Search.orderNo;
        let payType = this.Search.payType;
        let saleType = this.Search.saleType;
        let largeArea = this.Search.largeArea;
        let channelName = this.Search.channelName;

        startTime = this.Search.submitStartTime;
        endTime = this.Search.submitEndTime;
        console.log (startTime);
        console.log (endTime);
        if (!startTime && !startTime && !leadsName && !leadsPhone && !submitter && !orderNo && !payType && !saleType && !largeArea && !channelName) {
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
        let saleType = this.Search.saleType;
        let largeArea = this.Search.largeArea;
        let channelName = this.Search.channelName;

        startTime = this.Search.submitStartTime;
        endTime = this.Search.submitEndTime;
        let apiUrl = FINANCE ().waitSale.generateTeamKpiExcel;
        apiUrl += `?token=${localStorage.getItem ('token')}&submitStartTime=${startTime}&submitEndTime=${endTime}&leadsName=${leadsName}&leadsPhone=${leadsPhone}&submitter=${submitter}&payType=${payType}&saleType=${saleType}&largeArea=${largeArea}&channelName=${channelName}`;
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

<style lang="less" rel="stylesheet/less">

</style>
