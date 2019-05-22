<template>
  <div>
    <Modal
      v-model="modal"
      title="创建惠学习支付订单"
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
            <Select v-model="formValidate.coursePriceActivityType"  style="width:200px" @on-change='changeClassType'>
              <Option value="1">常规</Option>
              <Option value="2">寒春联报</Option>
              <Option value="3">寒假独立</Option>
            </Select>
        </Form-item>
        <Form-item label="首付比例" prop="paymentRatio">
          <i-select v-model="formValidate.paymentRatio" @on-change="changePayType" :label-in-value="true" style="width:200px">
            <i-option v-for="(item,index) in loveHaiMiList" :key='index' :value="item.enumValue">{{item.enumName }}</i-option>
          </i-select>
        </Form-item>
        <Form-item label="购买课时数" prop="buyLength">
          <Input-number :min="1" v-model="formValidate.buyLength" @on-change="changeBuyLength"
                        style="width:200px"></Input-number>
        </Form-item>
        <!--<Form-item label="优惠码">-->
          <!--<i-input v-model="formValidate.promotionCode" @on-blur="blurPromotionCode" style="width:400px"></i-input>-->
        <!--</Form-item>-->
        <Form-item label="贷款人姓名" prop="name">
          <i-input v-model="formValidate.name" @on-blur="blurPromotionCode" style="width:200px"></i-input>
        </Form-item>
        <Form-item label="贷款人手机号" prop="name">
          <i-input v-model="formValidate.phone" @on-blur="blurPromotionCode" style="width:200px"></i-input>
        </Form-item>
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
        <i-button type="text" @click="onCancel('formValidate')">取消</i-button>
        <i-button type="primary" :loading="loading" @click="onOk('formValidate')">提交</i-button>
        <a href="javascript:;" target=_blank><span id="blankMoney"></span></a>

      </div>
    </Modal>
    <Modal
      v-model="modal2"
      title="支付二维码"
      width="300"
      :closable="false"
      :mask-closable="false">
      <span style="font-size: 16px;    word-break: break-all;">{{qrcodeUrl}}</span>
      <div id="qrcode" class="qrcode"></div>
      <span style="font-size: 16px;display: block;text-align: center;margin: 10px;">微信扫描二维码完成支付</span>
      <div slot="footer" class="text-right">
        <i-button type="text" @click="modal2 = false">取消</i-button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {ORDER} from 'common/api/order.js';
  import {common} from 'common/js/common.js';
  import {SCS} from 'common/api/scs.js';
  import divSplit from 'components/o/oDivSplit';

  export default{
    data(){
      return {
        couponList:[],
        qrcodeUrl:'',
        param:'',
        modal: false,
        modal2: false,
        loading: false,
        leadsUuid: '',
        prizeContent: '',
        prizeId: '',
        prizeActivityList: [],
        loveHaiMiList: [],
        money: 0,
        payType: 0,
        formValidate: {
          coupon:'',
          coursePriceType: '',
          coursePriceActivityType: '1',
          buyLength: 40,
          promotionCode: '',
          name: '',
          phone: '',
          paymentRatio:'',
          prizeActivity: 0
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
        ruleValidate: {
          coursePriceType: [
            {required: true, message: '不能为空', trigger: 'change'},
          ],
          coursePriceActivityType: [
            {required: true, message: '不能为空', trigger: 'change'},
          ],
          paymentRatio: [
            {required: true, message: '不能为空', trigger: 'change'},
          ],
          name: [
            {required: true, message: '不能为空', trigger: 'blur'},
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
      this.$axios.get( ORDER().CreateOrder.getLoveHaiMiPayType,{
      }).then( ({data}) => {
        _this.loveHaiMiList = data.data['sysEnumVos'] || [];
      })
      // 获取折扣券
      this.getCouponList();
    },
    methods: {
      // 获取折扣券
      getCouponList(){
        this.$axios.get(SCS().MyStudent.getPayDiscountType,{
          params:{
            fullAmount : 0,
            classType : this.formValidate.coursePriceActivityType,
            classHours : this.formValidate.buyLength,
          },
        }).then( ({data}) => {
          this.couponList = data.data.discountList || [];
        })
      },
      // 课时类别
      changeClassType(){
        this.formValidate.coupon = ''
        this.couponList = []
        this.getCouponList();
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
      changeCoursePriceType(value) {
        this.formValidate.coursePriceType = value;
        this.formValidate.coupon = ''
        this.couponList = []
        this.getMoney();
        this.getCouponList();
      },
      changeBuyLength(value) {
        this.formValidate.buyLength = value;
        this.formValidate.coupon = ''
        this.couponList = []
        this.getMoney();
        this.getCouponList();
      },
      blurPromotionCode(value) {
        this.getMoney();
      },
      changePayType(value){
        this.getMoney();
      },
      // 折扣券
      changeCoupon(value) {
        // console.log(111);
        this.formValidate.coupon = value;
        this.getMoney();
      },
      // 抵用券
      changePrizeActivity(value) {
        this.formValidate.prizeActivity = value;
        this.getMoney();
      },
      getMoney() {
        const _this = this;
        this.$axios.get(ORDER().CreateOrder.getLoveHaiMiPayMoney,{
          params:{
            coursePriceType: this.formValidate.coursePriceType,
            // coursePriceActivityType: this.formValidate.coursePriceActivityType,
            buyLength: this.formValidate.buyLength,
            promotionCode: this.formValidate.promotionCode,
            paymentRatio: this.formValidate.paymentRatio,
            // payType:this.payType,
            prizeId: this.formValidate.prizeActivity,
            discountTypeId: this.formValidate.coupon,
          },
        }).then( ({data}) => {
          this.money = data.data||'';
        })
      },
      onOk(name) {
        const _this = this;
        // this.loading = true;
        let blankMoney = document.getElementById("blankMoney")
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$axios.post(ORDER().CreateOrder.addHuiXueXiOrder,{
              leadsUuid: this.leadsUuid,
              coursePriceType: this.formValidate.coursePriceType,
              coursePriceActivityType: this.formValidate.coursePriceActivityType,
              buyLength: this.formValidate.buyLength,
              promotionCode: this.formValidate.promotionCode,
              name: this.formValidate.name,
              phone: this.formValidate.phone,
              paymentRatio: this.formValidate.paymentRatio,
              payType:this.payType,
              prizeId: this.formValidate.prizeActivity,
              discountTypeId: this.formValidate.coupon,
            }).then( ({data}) => {
              let datas = data.data["resultInfo"];
              console.log(data);
              datas = JSON.parse(datas);
              if (datas.code == 0) {
                this.qrcodeUrl = datas.content;
                // blankMoney.parentNode.setAttribute("href", datas.content)
                // blankMoney.click()
                _this.modal = false;
                _this.modal2 = true;
                this.createQrcode(this.buildQrOption());
                // _this.$Modal.success({
                //   title: '订单已提交通过',
                //   content: `<p>订单已经生成！！！若未跳转<a target=_blank href='${datas.content}'>请点击这里支付</a></p>`,
                //   onOk: function () {
                //     common.notices(datas.desc);
                //     _this.$emit('reFresh', 'success');
                //   }
                // });
              } else {
                common.notices(datas.desc, '操作失败', 'error');
              }
              // _this.loading = false;
            })
          }
        });
      },
      createQrcode(option) {
       // if(this.formItemDetail.agentType2 = == "" && this.formItemBase.agentName === "") return;
        let qrcodeDOM = document.getElementById("qrcode");
        qrcodeDOM.innerHTML = "";
        let qrcode = new QRCode(qrcodeDOM, {
          text: option.url,
          width: option.width,
          height: option.height,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
        // $(qrcodeDOM).prepend(option.width + ' x ' + option.height + '（右键-图片另存为进行下载）');
      },
      buildQrOption() {
        let option = {};
        option.url = this.qrcodeUrl;
        option.url = encodeURI(option.url);
        option.width = 258;
        option.height = 258;
        return option;
      },
      onCancel(name){
        this.modal = false;
        // this.handleReset(name);
      },
      handleReset (name) {
        this.$refs[name].resetFields();
        this.formValidate.prizeActivity = 0;
        this.money = 0;
        this.prizeActivityList = [];
      }
    },
    components: {divSplit}
  };
</script>

<style scoped>
  .money-info span {
    font-size: 25px;
  }
</style>
