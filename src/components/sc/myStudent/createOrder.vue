<template>
  <div>
    <Modal
      v-model="modal"
      title="创建官网订单"
      width="600"
      :closable="false"
      :mask-closable="false">
      <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <Form-item label="购买课时包" prop="coursePriceType">
          <i-select v-model="formValidate.coursePriceType" @on-change="changeCoursePriceType" style="width:200px">
            <i-option v-for="(item,index) in coursePriceTypeList" :key='index' :value="item.value">{{ item.name }}</i-option>
          </i-select>
        </Form-item>
        <Form-item label="课时类别" prop="coursePriceActivityType">
          <Select v-model="formValidate.coursePriceActivityType" style="width:200px" @on-change='changeClassType'>
            <Option value="1">常规</Option>
            <Option value="2">寒春联报</Option>
            <Option value="3">寒假独立</Option>
            <!--<i-option value="暑秋联报">暑秋联报</i-option>-->
            <!--<i-option value="常规暑秋联报">常规暑秋联报</i-option>-->
            <!--<i-option value="精品暑秋联报">精品暑秋联报</i-option>-->
            <!--<i-option value="寒假联报">寒假联报</i-option>-->
            <!--<i-option value="夏令营">夏令营</i-option>-->
            <!--<i-option value="暑期专题">暑期专题</i-option>-->
            <!--<i-option value="399系列">399系列</i-option>-->
            <!--<i-option value="9999系列">9999系列</i-option>-->
          </Select>
        </Form-item>
        <Form-item label="购买课时数" prop="buyLength">
          <Input-number :min="1" v-model="formValidate.buyLength" @on-change="changeBuyLength" style="width:200px"></Input-number>
        </Form-item>
        <!--<Form-item label="优惠码">-->
          <!--<i-input v-model="formValidate.promotionCode" @on-blur="blurPromotionCode" style="width:400px"></i-input>-->
        <!--</Form-item>-->
        <!--<Form-item label="抵用券" prop="prizeActivity">-->
          <!--<i-select v-model="formValidate.prizeActivity" @on-change="changePrizeActivity" style="width:200px">-->
            <!--&lt;!&ndash;<i-option :value="prizeId">{{prizeContent}}</i-option>&ndash;&gt;-->
            <!--<i-option value="0">不选择优惠</i-option>-->
            <!--<i-option v-for="(item,index) in prizeActivityList" :key='index' :value="item.prizeId">{{item.prizeContent}}</i-option>-->
          <!--</i-select>-->
        <!--</Form-item>-->
        <Form-item label="折扣券" prop="coupon">
          <i-select v-model="formValidate.coupon" style="width:200px" @on-change="changeCoupon">
            <i-option v-for="(item,index) in couponList" :key='index' :value="item.id">{{item.discountDesc}}</i-option>
          </i-select>
        </Form-item>
      </i-form>
      <div-split></div-split>
      <div class="txt-center money-info">
        <p>
          <span>支付金额：</span>
          <span>{{money}} 元</span>
        </p>
        <p class="c-red">订单创建后2小时内有效</p>
      </div>
      <div slot="footer" class="text-right">
        <i-button type="text" @click="onCancel('formValidate')" >取消</i-button>
        <i-button type="primary" :loading="loading" @click="onOk('formValidate')" >提交</i-button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
    import {ORDER} from 'common/api/order.js';
    import {SCS} from 'common/api/scs.js';
    import {common} from 'common/js/common.js';
    import divSplit from 'components/o/oDivSplit';

    export default{
      data(){
        return {
          couponList:[],
          modal: false,
          loading: false,
          leadsUuid: '',
          prizeContent: '',
          prizeId: '',
          money: 0,
          formValidate: {
            coursePriceType: '',
            coursePriceActivityType: '1',
            buyLength: 40,
            promotionCode: '',
            prizeActivity: 0,
            coupon:''
          },
          coursePriceTypeList: [
            {
              value:'小学',
              name:'小学',
            },{
              value:'初一',
              name:'初一',
            },{
              value:'初二',
              name:'初二',
            },{
              value:'初三',
              name:'初三',
            },{
              value:'高一',
              name:'高一',
            },{
              value:'高二',
              name:'高二',
            },{
              value:'高三',
              name:'高三',
            },
          ],
          prizeActivityList: [],
          ruleValidate: {
            coursePriceType: [
              {required: true, message: '不能为空', trigger: 'change'},
            ],
            coursePriceActivityType: [
              {required: true, message: '不能为空', trigger: 'change'},
            ],
            buyLength: [
              {required: true, type: 'number', min: 1, message: '不能小于1', trigger: 'blur'}
            ],
            // prizeActivity: [
            //   {required: true, message: '请选择优惠', trigger: 'change'}
            // ]
          }
        }
      },
      mounted() {
        const _this = this;
        // $.getJSON("static/data.json", function (json) {
        //   _this.coursePriceTypeList = json.coursePriceTypeList;//购买课时包
        // });
        // 获取折扣券
        this.getCouponList();
        console.log (this.coursePriceTypeList);
      },
      methods: {
        // 获取折扣券
        getCouponList(){
          this.$axios.get(SCS().MyStudent.getPayDiscountType,{
            params:{
              fullAmount : this.formValidate.isPayALLMoney,
              classType : this.formValidate.coursePriceActivityType,
              classHours : this.formValidate.buyLength,
            },
          }).then( ({data}) => {
            this.couponList = data.data.discountList || [];
          })
        },
        show(leadsUuid) {
          this.formValidate.coupon='',
          this.formValidate.isPayALLMoney='',
          this.handleReset('formValidate');
          this.leadsUuid = leadsUuid;
          // 获取优惠活动
          this.$axios.post(ORDER().CreateOrder.getLeadsBonusListByLeadsUuid,{
            leadsUuid: leadsUuid,
          }).then( (res) => {
            this.prizeActivityList = res.data.data
            console.log(res);
            this.modal = true;
            // this.prizeContent = res.data.prizeContent;
            this.prizeId = res.data.data.prizeId;
          })
        },
        // 折扣券
        changeCoupon(value) {
          this.formValidate.coupon = value;
          this.getMoney();
        },
        changeCoursePriceType(value) {
          this.formValidate.coursePriceType = value;
          this.formValidate.coupon = ''
          this.couponList = []
          this.getMoney();
          this.getCouponList();
        },
        // 课时类别
        changeClassType(){
          this.formValidate.coupon = ''
          this.couponList = []
          this.getCouponList();
        },
        // 优惠活动
        changePrizeActivity(value) {
          this.formValidate.prizeActivity = value;
          this.getMoney();
        },
        changeBuyLength(value) {
          this.formValidate.buyLength = value;
          this.getMoney();
        },
        blurPromotionCode(value) {
          this.getMoney();
        },
        getMoney() {
          const _this = this;
          this.$axios.get(ORDER().CreateOrder.getPayMoney,{
            params:{
              coursePriceType: this.formValidate.coursePriceType,
              // coursePriceActivityType: this.formValidate.coursePriceActivityType,
              buyLength: this.formValidate.buyLength,
              promotionCode: this.formValidate.promotionCode,
              prizeId: this.formValidate.prizeActivity,
              discountTypeId: this.formValidate.coupon,
              // paymentRatio: this.formValidate.paymentRatio,
            },
          }).then( ({data}) => {
            this.money = data.data;
          })
        },
        onOk(name) {
          const _this = this;
          // this.loading = true;
          this.$refs[name].validate((valid) => {
            if(valid) {
              this.$axios.post(ORDER().CreateOrder.createWebOrder,{
                leadsUuid: this.leadsUuid,
                coursePriceType: this.formValidate.coursePriceType,
                coursePriceActivityType: this.formValidate.coursePriceActivityType,
                buyLength: this.formValidate.buyLength,
                promotionCode: this.formValidate.promotionCode,
                prizeId: this.formValidate.prizeActivity,
                discountTypeId: this.formValidate.coupon,
              }).then( () => {
                common.notices('操作成功');
                this.modal = false;
                this.$emit('reFresh', 'success');
                // this.loading = false;
              })
            }
          });
        },
        onCancel(name){
          this.modal = false;
          this.handleReset(name);
        },
        handleReset (name) {
          this.$refs[name].resetFields();
          this.formValidate.prizeActivity = 0;
          this.formValidate.coupon = '';
          this.money = 0;
          this.prizeActivityList = [];
        }
      },
      components: {divSplit}
    };
</script>

<style scoped>
.money-info span{ font-size: 25px;}
</style>
