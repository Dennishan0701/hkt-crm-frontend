<template>
  <Modal
    v-model="modal"
    title="付费申请"
    width="600"
    :mask-closable="false">
    <i-form :label-width="100">
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
    </i-form>
  </Modal>
</template>

<script type="text/ecmascript-6">
  import {SCS} from 'common/api/scs.js';
  import {ORDER} from 'common/api/order.js';
  import {common} from 'common/js/common.js';
  export default{
    data() {
      return {
        modal: false,
        formItem: {
          buyLength: '',
          courseLevel: '',
          inActivities: '',//参与活动
          money: '',//购买金额
          payTime: '',//支付时间
          createDate: '',
          payType: '',//付费方式，bank：银行支付taobao：淘宝alipay：支付宝weixin：微信
        }
      }
    },
    methods: {
      show(payOrderUuid) {
        this.modal = true;
        this.getInfo(payOrderUuid);
      },
      getInfo(payOrderUuid) {
        const _this = this;
        common.ajax({
          url: SCS().WaitPay.getPayRequest,
          method: 'get',
          data: { payUuid: payOrderUuid },
          success: function (res) {
            let data = res.data;
            if(data) {
              _this.formItem.buyLength = data.buyLength;
              _this.formItem.courseLevel = data.courseLevel;
              _this.formItem.createDate = data.createDate;
              _this.formItem.inActivities = data.inActivities;
              _this.formItem.money = data.money;
              _this.formItem.payTime = data.payTime;
              _this.formItem.payType = data.payType;
            }
          }
        });
      }
    },
    filters: {
      convertPayType(value) {
        if(value === "bank") {
          return "银行支付";
        } else if(value === "taobao") {
          return "淘宝";
        } else if(value === "alipay") {
          return "支付宝";
        } else if(value === "weixin") {
          return "微信";
        } else if(value === "kuStaging") {
          return "库分期";
        } else if(value === "baiduStaging") {
          return "百度分期";
        } else if(value === "lovehaimi") {
          return "爱海米分期";
        } else {
          return value;
        }
      },
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
      }
    }
  };
</script>

<style>

</style>
