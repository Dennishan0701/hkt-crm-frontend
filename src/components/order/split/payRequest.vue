<template>
  <div>
    <Modal
      v-model="modal"
      title="提交付费申请"
      width="600"
      :loading = "loading"
      :mask-closable="false"
      :closable="false"
      @on-ok="onOk('formValidate')">
      <i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100">
        <Form-item label="参与活动">
          <i-input v-model="formItem.inActivities" placeholder="参与活动"></i-input>
        </Form-item>
        <Form-item label="课时包活动类别">
          <i-select v-model="formItem.coursePriceActivityType" style="width:200px">
            <i-option value="常规">常规</i-option>
            <i-option value="特殊">特殊</i-option>
            <i-option value="暑秋联报">暑秋联报</i-option>
            <i-option value="寒假联报">寒假联报</i-option>
            <i-option value="夏令营">夏令营</i-option>
            <i-option value="暑期专题">暑期专题</i-option>
            <i-option value="399系列">399系列</i-option>
            <i-option value="9999系列">9999系列</i-option>
          </i-select>
        </Form-item>
        <Form-item label="付费方式" prop="payType">
          <i-select v-model="formItem.payType" @on-change="changePayType" placeholder="请选择">
            <i-option value="bank">银行转账</i-option>
            <i-option value="taobao">淘宝</i-option>
            <i-option value="alipay">支付宝</i-option>
            <i-option value="weixin">微信</i-option>
            <i-option value="kuStaging">库分期</i-option>
            <i-option value="baiduStaging">百度分期</i-option>
            <i-option value="lovehaimi">爱海米分期</i-option>
          </i-select>
        </Form-item>
        <Form-item label="银行" prop="bank" v-show="isViewBank">
          <i-select v-model="formItem.bank" filterable clearable placeholder="请选择或筛选">
            <i-option v-for="(item,index) in bankList" :key='index' :value="item.bank">{{ item.bank }}</i-option>
          </i-select>
          <i-input v-model="formItem.otherBank" placeholder="其他银行请填写"></i-input>
        </Form-item>
        <Form-item label="付款时间" prop="payDate">
          <Date-picker type="date" v-model="formItem.payDate" @on-change="changePayDate" placeholder="选择日期"></Date-picker>
        </Form-item>
      </i-form>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {ORDER} from 'common/api/order.js';
  import {common} from 'common/js/common.js';
  export default{
    data() {
      let validateBank = (rule, value, callback) => {
        if(this.isViewBank && this.formItem.bank === "" && this.formItem.otherBank === "") {
          callback(new Error('请选择或填写银行'));
        } else {
          callback();
        }
      }
      return {
        modal: false,
        loading: false,
        isViewBank: false,
        orderNo: '',
        bankList: [],
        formItem: {
          inActivities: '',
          coursePriceActivityType: '常规',
          payType: '',
          bank: '',
          otherBank: '',
          payDate: ''
        },
        ruleValidate: {
          payType: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],
          bank: [
            { required: true, validator: validateBank, trigger: 'change' }
          ],
          payDate: [
            { required: true, message: '不能为空', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      show(orderNo) {
        this.orderNo = orderNo;
        this.modal = true;
      },
      onOk(name) {
        const _this = this;
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            common.ajax({
              url: ORDER().OrderSplit.submitPayRequest,
              data: {
                orderNo: _this.orderNo,
                inActivities: _this.formItem.inActivities,
                coursePriceActivityType: _this.formItem.coursePriceActivityType,
                payType: _this.formItem.payType,
                bank: _this.formItem.bank || _this.formItem.otherBank,
                payTime: _this.formItem.payTime
              },
              success: function(response){
                _this.modal = false;
                common.notices('操作成功！！');
                _this.$emit('reFresh', 'success');
              }
            });
          } else {
            setTimeout(() => {
              this.loading = true;
            }, 0);
          }
        });
      },
      changePayType(value) {
        if (value === "bank") {
          this.isViewBank = true;
          const _this = this;
          common.ajax({
            url: COMMON_API().allBank,
            method: 'get',
            success: function (response) {
              _this.bankList = response.data || [];
            }
          });
        } else {
          this.isViewBank = false;
        }
        this.formItem.payType = value;
      },
      changePayDate(value) {
        this.formItem.payDate = value;
      }
    }
  };
</script>

<style>

</style>
