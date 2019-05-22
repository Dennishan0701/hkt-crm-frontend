<template>
  <Modal
    v-model="modal"
    title="付费申请"
    width="600">
    <i-form :label-width="100" label-position="left">
      <Form-item label="购买课时">
        {{formItem.buyLength}}（小时）
      </Form-item>
      <Form-item label="课时级别">
        {{formItem.courseLevel | convertCourseLevel}}
      </Form-item>
      <Form-item label="金额">
        ￥{{formItem.money}}
      </Form-item>
      <Form-item label="参与活动">
        {{formItem.inActivities}}
      </Form-item>
      <Form-item label="付费方式">
        {{formItem.payType | convertPayType}}
      </Form-item>
      <Form-item label="付款时间" prop="payDate">
        {{formItem.payTime}}
      </Form-item>
      <Form-item label="提交时间">
        {{formItem.createDate}}
      </Form-item>
      <Form-item label="贷款人">
        {{formItem.lender}}
      </Form-item>
      <Form-item label="贷款人手机号码">
        {{formItem.lenderPhone}}
      </Form-item>
      <Form-item label="付费截图">
        <!--<Poptip v-for="item in formItem.payPictureUrl">-->
          <!--<a trigger="hover" @click="openNew(item)" href="javascript:;"><img :src="item" style="max-width: 40px;"/></a>-->
          <!--<div slot="content" style="max-height: 500px;"><img :src="item" style="max-width: 150px;"/></div>-->
        <!--</Poptip>-->
        <a v-for="(item,index) in formItem.payPictureUrl" :key='index' trigger="hover" @click="openNew(item)" href="javascript:;"><img :src="item" style="max-width: 60px; margin: 0 5px;"/></a>
      </Form-item>
      <i-table size="small"  highlight-row stripe :columns="columns"
               :data="formItem.detailList" ></i-table>
      <Modal title="查看图片" v-model="visible" style="position: relative;z-index: 999999">
        <img :src="imgUrl" v-if="visible" style="width: 800px">
      </Modal>
    </i-form>
  </Modal>
</template>

<script type="text/ecmascript-6">
  import {SCS} from 'common/api/scs.js';
  import {common} from 'common/js/common.js';
  export default{
    data() {
      return {
        modal: false,
        visible: false,
        imgUrl: '',
        formItem: {
          buyLength: '',//购买时长
          courseLevel: '',//课程级别
          createDate: '',//提交时间
          inActivities: '',//参与活动
          money: '',//购买金额
          payTime: '',//支付时间
          payType: '',//付费方式，bank：银行支付taobao：淘宝alipay：支付宝weixin：微信
          lender: '',//贷款人
          lenderPhone: '',//贷款手机号
          payPictureUrl: '',//贷款截图
        },
        columns: [
          {
            title: '序号',
            width: 40,
            type:'index',
            align:'center',
            minWidth:40,
          },
          {
            title: '付款方式',
            key: 'payType',
            minWidth: 100,
            align: 'center',
            render: (h, params) => {
              if(params.row.params == 'bank'){
                return h('span','银行转账')
              }else if(params.row.params == 'taobao'){
                return h('span','淘宝')
              }else if(params.row.params == 'alipay'){
                return h('span','支付宝')
              }else if(params.row.params == 'weixin'){
                return h('span','微信')
              }else if(params.row.params == 'kuStaging'){
                return h('span','库分期')
              }else if(params.row.params == 'huixuexi'){
                return h('span','惠学习')
              }else{
                return h('span','其他')
              }
            }
          },
          {
            title: '付款金额',
            key: 'amount',
            minWidth: 80,
            align: 'center',
          },
          {
            title: '付费截图',
            key: 'amount',
            minWidth: 80,
            align: 'center',
            render: (h, params) => {
              return h('div',[
                h('Tooltip',{
                  props:{
                    placement:'top',
                    content: '查看付费截图',
                  },
                },[
                  h('Icon',{
                    props:{
                      type:'image'
                    },
                    style:{
                      cursor:'pointer'
                    },
                    on:{
                      click:()=>{
                        this.imgUrl = params.row.fileAddress
                        this.visible = true
                      }
                    }
                  }),
                ])
              ])
            }
          },
        ]
      }
    },
    methods: {
      openNew(payPicture){
        console.log(payPicture);
        let open = window.open();
        open.location.href = payPicture
      },
      show(payUuid,leadsUuid) {
        this.modal = true;
        this.getInfo(payUuid);
      },
      getInfo(payUuid) {
        const that = this;
        common.ajax({
          url: SCS().WaitPay.getPayRequest,
          method: 'get',
          data: { payUuid: payUuid },
          success: function (res) {
            let data = res.data;
            if(data) {
              that.formItem.buyLength = data.buyLength;
              that.formItem.courseLevel = data.courseLevel;
              that.formItem.createDate = data.createDate;
              that.formItem.inActivities = data.inActivities;
              that.formItem.money = data.money;
              that.formItem.payTime = data.payTime;
              that.formItem.payType = data.payType;
              that.formItem.lender = data.lender;
              that.formItem.lenderPhone = data.lenderPhone;
              that.formItem.payPictureUrl = data.payPictureUrl;
              that.formItem.detailList = data.detailList;
            }
          }
        });
      }
    },
    filters: {
      convertCourseLevel(value) {
        if(value == 0) {
          return "普通";
        } else if(value == 1) {
          return "清北";
        } else if(value == 2) {
          return "明星课程";
        } else {
          return value;
        }
      },
      convertPayType(value) {
        if(value == "bank") {
          return "银行支付";
        } else if(value == "taobao") {
          return "淘宝";
        } else if(value == "alipay") {
          return "支付宝";
        } else if(value == "weixin") {
          return "微信";
        } else if(value == "kuStaging") {
          return "库分期";
        } else if(value == "baiduStaging") {
          return "百度分期";
        }else if(value == "lovehaimi") {
          return "爱海米分期";

        } else {
          return value;
        }
      }
    }
  };
</script>

<style>

</style>
