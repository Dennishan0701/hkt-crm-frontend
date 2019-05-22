<template>
  <div>
    <Modal
      v-model="payRequestModal"
      width="1100"
      :loading="loading"
      :closable="false"
      :mask-closable="false"
      @on-ok="onOk">
      <div slot="header" class="txt-center">
        <h2 class="c-success">绿色通道</h2>
        <p class="c-red">未视听学生提交付费申请</p>
      </div>
      <i-form ref='formValidate' :model="formValidate" inline :rules="ruleValidate" :label-width="100">
        <Form-item label="购买课时包" prop="coursePriceType">
          <i-select v-model="formValidate.coursePriceType" @on-change="changeCoursePriceType" style="width:200px"
                    :disabled="isRevise">
            <i-option v-for="(item,index) in coursePriceTypeList" :key='index' :value="item">{{ item }}
            </i-option>
          </i-select>
        </Form-item>
        <Form-item label="购买课时数" prop="buyLength">
          <Input-number :min="1" v-model="formValidate.buyLength" style="width:100px" @on-change='showPay'
                        :disabled="isRevise"></Input-number>
        </Form-item>
        <Form-item v-if="formValidate.coursePriceActivityType==4" label="时效课时数" prop="limitHours">
          <Input-number :min="0" :max="formValidate.buyLength" v-model="formValidate.limitHours" style="width:100px"
                        :disabled="isRevise"></Input-number>
        </Form-item>
        <Form-item label="课时类别" prop="coursePriceActivityType">
          <Select v-model="formValidate.coursePriceActivityType" style="width:200px" @on-change='changeClassType'
                  :disabled="isRevise">
            <Option value="1">常规</Option>
            <!--<Option value="2">寒春连报</Option>-->
            <!--<Option value="3">寒假独立</Option>-->
            <Option value="4">暑秋连报</Option>
            <Option value="5">暑假独立</Option>
          </Select>
        </Form-item>
        <!--<hr class="split" />-->
        <Form-item label="课时级别">
          <Radio-group v-model="formValidate.level" style="width:200px">
            <Radio label="0" :disabled="isRevise">普通</Radio>
            <Radio label="1" :disabled="isRevise">清北</Radio>
          </Radio-group>
        </Form-item>
        <Form-item label="付费方式" prop="payType">
          <i-select v-model="formValidate.payType" @on-change="changePayType" style="width:200px"
                    :disabled="isOrderSaved">
            <i-option value="bank">银行转账</i-option>
            <!--<i-option value="taobao">淘宝</i-option>-->
            <i-option value="alipay">支付宝</i-option>
            <i-option value="weixin">微信</i-option>
            <i-option value="kuStaging">库分期</i-option>
            <i-option value="huixuexi">惠学习</i-option>
            <i-option value="fendan">分蛋分期</i-option>
            <i-option value="huixuexi_qr">惠学习扫码支付</i-option>
            <!--<i-option value="baiduStaging" v-if='showPayType'>百度分期</i-option>-->
            <!--<i-option value="lovehaimi" v-if='showPayType'>爱海米分期</i-option>-->
            <i-option value="wx_pub_qr">微信付款码支付</i-option>
            <i-option value="alipay_qr">支付宝条码支付</i-option>
            <!--<i-option value="upacp_qr">银联二维码（被扫）</i-option>-->
          </i-select>
        </Form-item>
        <Form-item label="贷款人姓名" prop="lender" v-if='isLoan'>
          <i-input v-model="formValidate.lender" style="width:200px"></i-input>
        </Form-item>
        <Form-item label="贷款人手机号" prop="lenderPhone" v-if='isLoan'>
          <i-input v-model="formValidate.lenderPhone" style="width:200px"></i-input>
        </Form-item>
        <Form-item label="银行" prop="bank" v-show="isViewBank">
          <i-select v-model="formValidate.bank" clearable filterable style="width:200px">
            <i-option v-for="(item,index) in bankList" :key='index' :value="item.bank">{{ item.bank }}</i-option>
          </i-select>
          <i-input v-model="formValidate.otherBank" placeholder="下拉列表没有？请在这里填写其他银行" style="width:250px"></i-input>
        </Form-item>
        <Form-item label="付款时间" prop="payDate">
          <date-picker type="date" :value="formValidate.payDate" @on-change="changePayDate" placeholder="选择日期"
                       style="width: 200px" :disabled="isOrderSaved"></date-picker>
        </Form-item>
        <Form-item label="赠送课时">
          <i-input v-model="formValidate.giveLength" style="width:200px" :disabled="isOrderSaved"></i-input>
        </Form-item>
        <Form-item label="是否全款" prop="isPayALLMoney">
          <i-select v-model="formValidate.isPayALLMoney" style="width:200px" @on-change="changePayAllMoney"
                    :disabled="isRevise">
            <i-option value="1">是</i-option>
            <i-option value="0">否</i-option>
          </i-select>
        </Form-item>
        <Form-item label="折扣券" prop="coupon">
          <i-select v-model="formValidate.coupon" style="width:200px" @on-change="changeCoupon" :disabled="isRevise">
            <i-option v-for="(item,index) in couponList" :key='index' :value="item.id">{{item.discountDesc}}</i-option>
          </i-select>
        </Form-item>
        <!--<Form-item label="抵用券" prop="prizeActivity">-->
        <!--<i-select v-model="formValidate.prizeActivity" @on-change="changePrizeActivity" style="width:200px">-->
        <!--<i-option value="0">不选择优惠</i-option>-->
        <!--<i-option v-for="(item,index) in prizeActivityList" :key='index' :value="item.prizeId">{{item.prizeContent}}</i-option>-->
        <!--</i-select>-->
        <!--</Form-item>-->
        <Form-item label="备注">
          <i-input type="textarea" :rows="3" :maxlength="250" v-model="formValidate.inActivities" style="width:600px"
                   :disabled="isOrderSaved"></i-input>
        </Form-item>
        <div style="text-align: right">
          <Button v-if="isSaveBtnShow" :disabled="isFinished" size="default" style="width: 80px;margin-right: 50px;"
                  type="primary" @click="saveFormData">保存订单
          </Button>
        </div>
        <!--——————————————————————————————————————————————-->
        <div v-if="isSaved" style="border-bottom: 1px dashed #ccc;">
          <div class="payDetailTitle" style="">付费详情<span style="color:red;font-size: 12px;margin-left: 20px;">* 生成二维码后金额不可删除修改，请检查输入后再点击"生成二维码"按钮</span>
          </div>
          <ul>
            <li v-for="(item,key) in formValidate.payDetailList" :key='key' v-if="item.status">
              <Form-item label="付费方式" :prop="'payDetailList.' + key + '.pdPayType'"
                         :rules="{required: true, message:'不能为空', trigger: 'change'}">
                <i-select :disabled="item.afterCreateQrcode" v-model="item.pdPayType" style="width:150px"
                          @on-change="changePayTypes(item.pdAcountMoney,key,$event)">
                  <i-option value="bank">银行转账</i-option>
                  <!--<i-option value="taobao">淘宝</i-option>-->
                  <i-option value="alipay">支付宝</i-option>
                  <i-option value="weixin">微信</i-option>
                  <i-option value="kuStaging">库分期</i-option>
                  <i-option value="huixuexi">惠学习</i-option>
                  <i-option value="fendan">分蛋分期</i-option>
                  <i-option value="huixuexi_qr">惠学习扫码支付</i-option>
                  <i-option value="wx_pub_qr">微信付款码支付</i-option>
                  <i-option value="alipay_qr">支付宝条码支付</i-option>
                  <!--<i-option value="upacp_qr">银联二维码（被扫）</i-option>-->
                </i-select>
              </Form-item>
              <Form-item label="付款金额" :prop="'payDetailList.' + key + '.pdAcountMoney'"
                         :rules="{required: true ,message:'不能为空,请填写数字', trigger: 'blur'}">
                <i-input :disabled="item.afterCreateQrcode" v-model="item.pdAcountMoney" style="width:150px"
                         @on-blur="changePayAcount(item.pdPayType,key,$event)"></i-input>
              </Form-item>
              <Form-item v-if="item.isShowPayPic" label="付款截图" :prop="'payDetailList.' + key + '.fileList'">
                <div class="demo-upload-list" v-for="(items,indexs) in item.fileList" :key='indexs'>
                  <template v-if="items.status === 'finished'">
                    <img :src="items.imgUrl">
                    <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click="handleView2(items.imgUrl)"></Icon>
                      <Icon type="ios-trash-outline" @click="handleRemove2(items,key)"></Icon>
                    </div>
                  </template>
                  <template v-else>
                    <Progress v-show="items.showProgress" :percent="items.percentage" hide-info></Progress>
                  </template>
                </div>
                <Upload
                  :ref="'upload2'+key"
                  :show-upload-list="false"
                  :default-file-list="item.fileList"
                  v-model="item.fileList"
                  :on-success="handleSuccess2"
                  :format="['jpg','jpeg','png']"
                  :max-size="20480"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  :before-upload="handleBeforeUpload2"
                  :data="{'token': token,'id': item.id}"
                  type="drag"
                  :action="upUrl2"
                  style="display: inline-block;width:58px;">
                  <div style="width: 58px;height:58px;line-height: 58px;" @click="clickUpload(key,item.isPay)">
                    <Icon type="camera" size="20"></Icon>
                  </div>
                </Upload>
                <Modal title="查看图片" v-model="visible">
                  <img :src="imgUrl" v-if="visible" style="width: 100%">
                </Modal>
              </Form-item>
              <div v-if="item.isShowQrcode" id="qrCodeImgWrap" class="qrCodeImgWrap">
                <span class="qrCodeTitle">二维码</span>
                <Button :disabled="item.qrcodeDisabled" v-show="item.isShowQrcodeBtn" size="default"
                        @click="createQrcodeBtn(item.pdPayType,item.pdAcountMoney,key)">生成二维码
                </Button>
                <div v-show="!item.isShowQrcodeBtn" :id="'qrcode' + key" class="qrcode">
                </div>
              </div>
              <!--<div v-if="!item.afterCreateQrcode" class="deleteWrap">-->
              <div class="deleteWrap">
                <Tooltip content="删除该条" placement="top" transfer>
                  <Icon class="deleteIcon" type="ios-trash-outline" size="16" @click="delPayDetail(key,item.id)"></Icon>
                </Tooltip>
              </div>
            </li>
            <div style="text-align: center;">
              <Button size="large" style="margin-bottom: 10px;" icon="ios-plus" type="text" @click="addPayDetail">添加
              </Button>
            </div>
          </ul>
        </div>
        <!--——————————————————————————————————————————————-->
        <!--<hr class="split" />-->
        <div class="txt-center money-info">
          <span>支付金额：{{payMoney}} 元</span>
        </div>
      </i-form>
      <div slot="footer" class="text-right">
        <i-button type="text" @click="onCancel('formValidate')">取消</i-button>
        <i-button type="primary" @click="onOk('formValidate')" :disabled="!isFinished">提交</i-button>
      </div>
      <!--<input type="file" id="myStudentFileInput" @change="onAddChangeFileOk" style="display: none;"/>-->
    </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {SCS} from 'common/api/scs.js';
  import {ORDER} from 'common/api/order.js';
  import {common, clearSearchForm, checkImageExt, uploadAjax} from 'common/js/common.js';

  let localStorage = $.localStorage;
  export default {
    mounted () {
      // console.log(this.formValidate.payDetailList);
      // 获取折扣券
      this.getCouponList ();
      // let hostname = window.location.hostname;
      // if(hostname === 'crm.onlyhi.cn') {  //正式环境
      //   this.qrcodeUrl = 'https://www.onlyhi.cn/';
      // } else if(hostname === 'admin.onlyeduhi.cn') {//公网测试环境
      //   this.qrcodeUrl = 'http://www.onlyeduhi.cn/';
      // }
      // this.createQrcode(this.buildQrOption());
    },
    data () {
      var validateBank = (rule, value, callback) => {
        if (this.isViewBank && value === "" && this.formValidate.otherBank === "") {
          callback (new Error ('请选择一个银行或者填写一个银行'));
        } else {
          callback ();
        }
      }
      var validateBuyLength = (rule, value, callback) => {
        if (value.toString ().includes ('.')) {
          callback (new Error ('购买课时不能是小数'));
        } else if (value > 960) {
          callback (new Error ('购买课时不能大于960'));
          callback ();
        }
      }
      return {
        qrcodeDisabled: false,   //控制二维码生成按钮
        isShowPayPic: true,   //付费截图模块显示
        isShowQrcode: true,   //二维码模块显示
        isShowQrcodeBtn: true,   //生成二维码按钮显示
        resUuid: "",
        flagByNum: "",
        isShowActualMoney: false,
        isRevise: false,
        isOrderSaved: false,  //保存订单之后锁定表单
        isFinished: false,
        isSaved: true,
        isSaveBtnShow: true,    //保存订单按钮显示
        actualMoney: '',
        qrcodeUrl: '',
        couponList: [],
        prizeContent: '',
        prizeId: '',
        prizeActivityList: [],
        moneys: 0,
        token: localStorage.get ('token'),
        role: localStorage.get ('user').alias,
        defaultList: [],//图片上传
        imgUrl: '',//图片路径
        visible: false,//图片查看
        upUrl2: SCS ().WaitPay.uploadPayPicture2,
        index: 1,
        keys: 0,
        formData: [],
        uploadLoading: false,
        upUrl: SCS ().WaitPay.uploadPayPicture,
        loading: true,
        payRequestModal: false,
        isViewBank: false,
        isLoan: false,
        showPayType: false,
        courseOrderUuid: '',
        leadsUuid: '',
        studentPhone: '',
        flag: '',
        formValidate: {
          payDetailList: [
            {
              pdPayType: '',
              pdAcountMoney: '',
              id: '',
              ossKey: '',
              index: 1,
              status: 1,
              fileList: [],
              isShowPayPic: true,
              isShowQrcode: true,
              qrcodeDisabled: false,
              isShowQrcodeBtn: true,
              afterCreateQrcode: false
            },
          ],
          prizeActivity: 0,
          coupon: '',
          isPayALLMoney: '',
          coursePriceType: '小学',
          coursePriceActivityType: '1',
          buyLength: 40,
          limitHours: 0,
          level: 0,
          inActivities: '',
          lender: '',
          lenderPhone: '',
          payPicture: '',
          payType: '',
          bank: '',
          otherBank: '',
          payDate: '',
          promotionCode: '',
          giveLength: '',
        },
        bankList: [],
        coursePriceTypeList: [
          // {
          //   value: '小学',
          //   name: '小学',
          // }, {
          //   value: '初一',
          //   name: '初一',
          // }, {
          //   value: '初二',
          //   name: '初二',
          // }, {
          //   value: '初三',
          //   name: '初三',
          // }, {
          //   value: '高一',
          //   name: '高一',
          // }, {
          //   value: '高二',
          //   name: '高二',
          // }, {
          //   value: '高三',
          //   name: '高三',
          // },
          // {
          //   value: '西点暑期训练营',
          //   name: '西点暑期训练营',
          // }, {
          //   value: '昂立游学美国',
          //   name: '昂立游学美国',
          // }, {
          //   value: '昂立游学英国',
          //   name: '昂立游学英国',
          // }, {
          //   value: '昂立游学新加坡',
          //   name: '昂立游学新加坡',
          // },
        ],
        ruleValidate: {
          // prizeActivity: [
          //   {required: true, message: '请选择优惠', trigger: 'change'}
          // ],
          coursePriceActivityType: [
            {required: true, message: '请选择课时类别', trigger: 'change'}
          ],
          // isPayALLMoney: [
          //   {required: true, message: '请选择是否全款', trigger: 'change'}
          // ],
          coursePriceType: [
            {required: true, message: '请选择购买课时包', trigger: 'change'}
          ],
          buyLength: [
            {required: true, validator: validateBuyLength, trigger: ['change', 'blur']},
          ],
          limitHours: [
            {required: true, validator: validateBuyLength, trigger: ['change', 'blur']},
          ],
          money: [
            {required: true, type: 'number', min: 1, message: '不能小于1', trigger: 'blur'}
          ],
          payType: [
            {required: true, message: '付费方式不能为空', trigger: 'change'},
          ],
          lender: [
            {required: true, message: '贷款人不能为空', trigger: 'blur'},
          ],
          lenderPhone: [
            {required: true, message: '贷款人手机号码不能为空', trigger: 'blur'},
          ],
          bank: [
            {required: true, validator: validateBank, trigger: ['blur', 'change']}
          ],
          payDate: [
            {required: true, type: 'string', message: '请选择付款时间', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      //保存订单
      saveFormData () {
        let _this = this;
        console.log (1);
        this.$refs.formValidate.validate ((valid) => {
          if (valid) {
            console.log (2);
            console.log (_this.$axios.post);
            _this.$axios.post (ORDER ().CreateOrder.createPayRequest, {
              leadsUuid: _this.leadsUuid,
              coursePriceType: _this.formValidate.coursePriceType,
              buyLength: _this.formValidate.buyLength,
              limitHours: _this.formValidate.limitHours,
              inActivities: '',
              payType: _this.formValidate.payType,
              bank: _this.formValidate.bank || _this.formValidate.otherBank || '',
              payTime: _this.changeDate (_this.formValidate.payDate),
              coursePriceActivityType: _this.formValidate.coursePriceActivityType | '',
              giveLength: _this.formValidate.giveLength,
              discountTypeId: _this.formValidate.coupon,
              courseOrderUuid: _this.courseOrderUuid,
            }).then ((res) => {
              // this.actualMoney = data.data.money;
              console.log (res);
              if (res.data.code == '100') {
                _this.isFinished = true;
                _this.isSaved = true;
                // if(this.flagByNum == 'secSend'){
                //
                // }
                _this.isRevise = true;
                _this.isOrderSaved = true;
                _this.resUuid = res.data.data.uuid
                common.notices ('保存成功！！');
              }
            })
          }
        })
      },
      // 获取折扣券
      getCouponList () {
        this.$axios.get (SCS ().MyStudent.getPayDiscountType, {
          params: {
            fullAmount: this.formValidate.isPayALLMoney,
            classType: this.formValidate.coursePriceActivityType,
            classHours: this.formValidate.buyLength,
          },
        }).then (({data}) => {
          this.couponList = data.data.discountList || [];
        })
      },
      // 课时类别
      changeClassType () {
        this.formValidate.limitHours = 0;
        this.formValidate.coupon = ''
        this.couponList = []
        this.getCouponList ();
      },
      // 是否全款
      changePayAllMoney () {
        this.formValidate.coupon = ''
        this.couponList = []
        this.getCouponList ();
      },
      handleView (url) {
        this.imgUrl = url;
        this.visible = true;
        console.log (this.defaultList);
      },
      handleBeforeUpload () {
//        const check = this.uploadList.length < 5;
//        if (!check) {
//          this.$Notice.warning({
//            title: '最多只能上传 5 张图片。'
//          });
//        }
//        return check;
      },
      // handleMaxSize (file) {
      //   this.$Notice.warning({
      //     title: '超出文件大小限制',
      //     desc: '文件 ' + file.name + ' 太大，不能超过 20M。'
      //   });
      // },
      handleRemove (file) {
        // 从 upload 实例删除数据
        const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice (fileList.indexOf (file), 1);
        this.defaultList = this.$refs.upload.fileList;
      },
      handleSuccess (res, file, fileList) {
        // 因为上传过程为实例，这里模拟添加 url
        file.imgUrl = res.data.url;
        file.name = res.data.key;
        this.defaultList = fileList;
        console.log (fileList);
      },
      handleFormatError (file) {
        this.$Notice.warning ({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
        });
      },
//      upLoad(){
//        document.getElementById('myStudentFileInput').click();
//      },
//      onAddChangeFileOk(event){
//        const _this = this;
//        let addFileInput = document.getElementById('myStudentFileInput');
//        let addFileVal = addFileInput.value;
//        if (!checkImageExt(addFileVal)) {
//        } else {
//          let files = addFileInput.files[0];
//          uploadAjax({
//            url: SCS().WaitPay.uploadPayPicture,
//            data: {
//              "file": files,
//            },
//            success: function (res) {
//              event.target.value = '';
//              console.log(res.data);
//              _this.formValidate.payPicture = res.data;
////              _this.formValidate.fileName = res.data.fileName
////              _this.formValidate.fileOriginalName = res.data.fileOriginalName
//            }
//          });
//        }
//
//      },
      showPay () {
        if (this.formValidate.buyLength >= 80) {
          this.showPayType = true
        } else {
          this.showPayType = false
        }
      },
      show (courseOrderUuid, leadsUuid, studentPhone, flag) {
        if (flag == 'greenChannelByCr') {
          // this.hiInit (leadsUuid);//页面初始化
          this.title0 = true;
          this.title1 = false;
          this.isSaved = false
          this.isRevise = false
          this.isSaveBtnShow = true
        }
        this.isFinished = false;
        this.isOrderSaved = false;
        this.isRevise = false
        this.isSaveBtnShow = true
        this.isShowActualMoney = false
        this.leadsUuid = leadsUuid;
        this.handleReset ('formValidate');
        this.defaultList = [];
        this.showPayType = false;
        this.formValidate = {
          coupon: '',
          isPayALLMoney: '',
          coursePriceType: '小学',
          coursePriceActivityType: '1',
          buyLength: 40,
          limitHours: 0,
          level: 0,
          inActivities: '',
          lender: '',
          lenderPhone: '',
          payPicture: '',
          payType: '',
          bank: '',
          otherBank: '',
          payDate: '',
          promotionCode: '',
          giveLength: '',
          payDetailList: [
            {
              pdPayType: '',
              pdAcountMoney: '',
              id: '',
              ossKey: '',
              index: 1,
              status: 1,
              fileList: [],
              isShowPayPic: true,
              isShowQrcode: true,
              qrcodeDisabled: false,
              isShowQrcodeBtn: true,
              afterCreateQrcode: false
            },
          ],
        },
          this.courseOrderUuid = courseOrderUuid;
        this.leadsUuid = leadsUuid;
        this.studentPhone = studentPhone;
        this.payRequestModal = true;
        this.flag = flag;
        const _this = this;
        this.$axios.get (COMMON_API ().allBank, {}).then (({data}) => {
          _this.bankList = data.data;
        })
        // 获取购买课时包
        this.$axios.get (COMMON_API ().getAvailableCoursePackage, {}).then (({data}) => {
          _this.coursePriceTypeList = data.data.coursePriceList;
        })
        // 获取优惠活动
        this.$axios.post (ORDER ().CreateOrder.getLeadsBonusListByLeadsUuid, {
          leadsUuid: leadsUuid,
        }).then ((res) => {
          this.prizeActivityList = res.data.data
          console.log (res);
          this.payRequestModal = true;
          // this.prizeContent = res.data.prizeContent;
          this.prizeId = res.data.data.prizeId;
        })
      },
      // 抵用券
      changePrizeActivity (value) {
        this.formValidate.prizeActivity = value;
        // this.getMoney();
      },
      // 折扣券
      changeCoupon (value) {
        this.formValidate.coupon = value;
        // this.getMoney();
      },
      onOk () {
        let amount = 0;
        this.formValidate.payDetailList.forEach (function (item, index) {
          amount = amount + item.pdAcountMoney * 10000;
        })
        amount = amount / 10000
        console.log (amount);
        console.log (this.payMoney);
        if (amount > this.payMoney) {
          this.$Notice.warning ({
            title: '',
            desc: '付费详情部分所填写金额大于支付总金额，请重新输入'
          });
        } else {
          let api = SCS ().WaitPay.payRequest;
          // if(this.flag) {
          //   api = SCS().MyStudent[this.flag];
          // }
          // this.loading = false;
          let params = ''
          this.defaultList.forEach (function (v, i) {
            params += v.name + ',';
          });
          this.$refs.formValidate.validate ((valid) => {
            if (valid) {
              const _this = this;
              this.$axios.post (api, {
                courseOrderUuid: _this.courseOrderUuid,
                leadsUuid: _this.leadsUuid,
                coursePriceType: _this.formValidate.coursePriceType,
                coursePriceActivityType: _this.formValidate.coursePriceActivityType,
                promotionCode: _this.formValidate.promotionCode,
                buyLength: _this.formValidate.buyLength,
                lender: _this.formValidate.lender,
                lenderPhone: _this.formValidate.lenderPhone,
                payPicture: params,
                courseLevel: _this.formValidate.level,
                inActivities: _this.formValidate.inActivities,
                payType: _this.formValidate.payType,
                bank: _this.formValidate.bank || _this.formValidate.otherBank,
                payTime: _this.changeDate (_this.formValidate.payDate),
                giveLength: _this.formValidate.giveLength,
                prizeId: _this.formValidate.prizeActivity,
                discountTypeId: _this.formValidate.coupon,
                paymentDetail: JSON.stringify (_this.manipulationData (_this.formValidate.payDetailList)),
                uuid: _this.resUuid
              }).then (() => {
                _this.payRequestModal = false;
                common.notices ('操作成功！！');
                _this.$emit ('reFresh', 'success');
              })
            } else {
              setTimeout (() => {
                // this.loading = true;
              }, 0);
            }
          });
        }
      },
      changeCoursePriceType (value) {
        if (value === '清北') {
          this.formValidate.level = 1;
        } else if (value === '明星') {
          this.formValidate.level = 2;
        } else {
          this.formValidate.level = 0;
        }
        this.formValidate.coupon = ''
        this.couponList = []
        this.showPay ();
        this.getCouponList ();
        // 清空支付二维码
        let qrcodeDOM = document.getElementById ("qrcode");
        qrcodeDOM.innerHTML = "";
      },
      changePayDate (value) {
        this.formValidate.payDate = value;
      },
      changePayType (value) {
        if (value === "bank") {
          this.isViewBank = true;
          this.isLoan = false;
        } else if (value === 'baiduStaging' || value === 'lovehaimi') {
          this.isLoan = true;
          this.isViewBank = false;
        } else {
          this.isLoan = false;
          this.isViewBank = false;
        }
      },
      changePayTypes (money, key, value) {
        console.log (value);
        if (value == "wx_pub_qr" || value == 'alipay_qr' || value == 'upacp_qr' || value == 'huixuexi_qr') {
          // this.isShowPayPic = false
          // this.isShowQrcode = true
          this.formValidate.payDetailList[key].qrcodeDisabled = false
          this.formValidate.payDetailList[key].isShowQrcode = true
          this.formValidate.payDetailList[key].isShowPayPic = false
        }
        else if (value == 'bank' || value == 'kuStaging' || value == 'weixin' || value == 'alipay' || value == 'huixuexi' || value == 'fendan') {
          // this.isShowPayPic = true
          // this.isShowQrcode = false
          this.formValidate.payDetailList[key].qrcodeDisabled = true
          this.formValidate.payDetailList[key].isShowQrcode = false
          this.formValidate.payDetailList[key].isShowPayPic = true
        }
      },
      changePayAcount (payType, key, money) {
        // if(payType == "wx_pub_qr"|| payType == 'alipay_qr'|| payType == 'upacp_qr'){
        //   this.isShowPayPic = false
        //   this.isShowQrcode = true
        //   if(money.target.value){
        //     this.$axios.post(SCS().MyStudent.createQuickMark,{
        //         studentPhone : this.studentPhone,
        //         channel : payType,
        //         type : this.formValidate.coursePriceType,
        //         payMoney : money.target.value,
        //     }).then( ({data}) => {
        //       console.log (data);
        //       this.qrcodeUrl = data.data.url
        //       this.createQrcode(this.buildQrOption(),key);
        //     })
        //   }
        // }else if(payType == 'huixuexi'){
        //   this.isShowPayPic = false
        //   this.isShowQrcode = true
        //   this.$axios.post (SCS ().MyStudent.getHuiXueXiPaymentUrl, {
        //     coursePriceType: this.formValidate.coursePriceType,
        //     phone: this.studentPhone,
        //     amount: money.target.value,
        //   }).then (({data}) => {
        //     console.log (data);
        //     this.qrcodeUrl = data.data.url
        //     this.createQrcode (this.buildQrOption (), key);
        //   })
        // }
        // else if(payType == 'huixuexi'){
        //   this.isShowPayPic = false
        //   this.isShowQrcode = true
        // }
        // else if(payType == 'bank' || value == 'kuStaging'){
        //   this.isShowPayPic = true
        //   this.isShowQrcode = false
        // }
      },
      // 点击生成二维码按钮
      createQrcodeBtn (payType, payMoney, key) {
        console.log (payType, payMoney);
        if (payType && payMoney) {
          if (payType == "wx_pub_qr" || payType == 'alipay_qr' || payType == 'upacp_qr') {
            // this.isShowPayPic = false
            this.formValidate.payDetailList[key].isShowPayPic = false
            // this.isShowQrcode = true
            this.formValidate.payDetailList[key].isShowQrcode = true
            this.$axios.post (SCS ().MyStudent.createQuickMark, {
              studentPhone: this.studentPhone,
              channel: payType,
              type: this.formValidate.coursePriceType,
              payMoney: payMoney,
              payRequestUuid: this.resUuid,
              length: this.formValidate.buyLength
            }).then (({data}) => {
              this.qrcodeUrl = data.data.url
              this.createQrcode (this.buildQrOption (), key);
              this.formValidate.payDetailList[key].isShowQrcodeBtn = false//隐藏生成二维码按钮，显示二维码
              this.formValidate.payDetailList[key].afterCreateQrcode = true//  生成二维码之后不能更改信息
              this.formValidate.payDetailList[key].id = data.data.id
            })
          } else if (payType == 'huixuexi_qr') {
            // this.isShowPayPic = false
            this.formValidate.payDetailList[key].isShowPayPic = false
            // this.isShowQrcode = true
            this.formValidate.payDetailList[key].isShowQrcode = true
            this.$axios.post (SCS ().MyStudent.getHuiXueXiPaymentUrl, {
              coursePriceType: this.formValidate.coursePriceType,
              phone: this.studentPhone,
              amount: payMoney,
              payRequestUuid: this.resUuid,
              buyLength: this.formValidate.buyLength
            }).then (({data}) => {
              this.qrcodeUrl = data.data.url
              this.createQrcode (this.buildQrOption (), key);
              this.formValidate.payDetailList[key].isShowQrcodeBtn = false//隐藏生成二维码按钮，显示二维码
              this.formValidate.payDetailList[key].afterCreateQrcode = true//  生成二维码之后不能更改信息
              this.formValidate.payDetailList[key].id = data.data.id
            })
          }
        } else {
          this.$Notice.warning ({
            title: '请输入付费方式和付款金额。'
          });
        }
      },
      onCancel (name) {
        this.payRequestModal = false;
        // this.handleReset(name);
      },
      handleReset (name) {
        this.$refs[name].resetFields ();
        this.formValidate.prizeActivity = 0;
        this.money = 0;
        this.prizeActivityList = [];
      },
      // 付费详情
      handleBeforeUpload2 () {
        this.uploadLoading = true;
        const check = this.formValidate.payDetailList[this.keys].fileList.length < 1;
        if (!check) {
          this.$Notice.warning ({
            title: '最多只能上传 1 张图片。'
          });
        }
        return check;
      },
      handleSuccess2 (res, file, fileList) {
        let _this = this;
        if (res.code == '103') {
          this.$Notice.warning ({
            title: '',
            desc: '上传失败'
          });
        }
        console.log (res);
        this.uploadLoading = false;
        console.log (this.keys);
        file.imgUrl = res.data.url;
        file.name = res.data.key;
        this.formValidate.payDetailList[this.keys].fileList = fileList
        this.formValidate.payDetailList[this.keys].ossKey = res.data.key
        this.formValidate.payDetailList[this.keys].id = res.data.id;
        this.$Notice.success ({
          title: '',
          desc: '上传成功'
        });
        _this.$set (_this.formValidate.payDetailList, this.keys, _this.formValidate.payDetailList[this.keys])
        console.log (res, file, fileList);
      },
      handleMaxSize (file) {
        this.$Notice.warning ({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 20M。'
        });
      },
      clickUpload (key, flag) {
        console.log (key, flag);
        this.keys = key
      },
      delPayDetail (key, id) {
        console.log (key, id);
        let app = this;
        if (id) {
          this.$Modal.confirm ({
            title: '',
            content: '确认删除该条记录？',
            onOk: function () {
              app.$axios.post (SCS ().MyStudent.deletePaymentDetail, {
                id: id
              }).then ((res) => {
                console.log (res);
                if (res.data.code == '100') {
                  app.$Notice.success ({
                    title: '',
                    desc: '删除成功'
                  });
                  app.formValidate.payDetailList[key].status = 0;
                  app.formValidate.payDetailList.splice (key, 1)
                }
                else if (res.data.code == '101') {
                  app.$Notice.warning ({
                    title: '',
                    desc: '删除失败'
                  });
                }
              })
            }
          });
        } else {
          app.formValidate.payDetailList[key].status = 0;
          app.formValidate.payDetailList.splice (key, 1)
        }
      },
      addPayDetail () {
        // this.index++;
        this.formValidate.payDetailList.push ({
          pdPayType: '',
          pdAcountMoney: '',
          id: '',
          ossKey: '',
          index: this.index,
          status: 1,
          fileList: [],
          isShowPayPic: true,
          isShowQrcode: true,
          qrcodeDisabled: false,
          isShowQrcodeBtn: true,
          afterCreateQrcode: false
        })
        // console.log(this.formValidate.payDetailList);
      },
      handleView2 (url) {
        this.imgUrl = url;
        this.visible = true;
        console.log (this.defaultList);
      },
      handleRemove2 (file, key) {
        console.log (file, key);
        // 从 upload 实例删除数据
        let _this = this;
        let ref = 'upload2' + key
        const fileList = this.$refs[ref][0].fileList;
        this.formValidate.payDetailList[key].fileList = []
        this.$set (_this.formValidate.payDetailList, key, _this.formValidate.payDetailList[key])
      },
      manipulationData (data) {
        let app = this;
        let result = [];
        data.forEach (function (item, index) {
          result.push ({
            payType: item.pdPayType,
            amount: item.pdAcountMoney,
            id: item.id,
            ossKey: item.ossKey,
          })
        })
        console.log (result);
        return result;
      },
      createQrcode (option, key) {
        // if(this.formItemDetail.agentType2 === "" && this.formItemBase.agentName === "") return;
        let qrcodeDOM = document.getElementById ("qrcode" + key);
        qrcodeDOM.innerHTML = "";
        let qrcode = new QRCode (qrcodeDOM, {
          text: option.url,
          width: 100,
          height: 100,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      },
      buildQrOption () {
        let option = {};
        option.url = this.qrcodeUrl;
        return option;
      },
      //时区日期格式转换(TZ)
      changeDate (dateA) {
        var dateee = new Date (dateA).toJSON ();
        var date = new Date (+new Date (dateee) + 8 * 3600 * 1000).toISOString ().replace (/T/g, ' ').replace (/\.[\d]{3}Z/, '');
        return date;
      }
    },
    computed: {
//      uploadList () {
//        return this.$refs.upload ? this.$refs.upload.fileList : [];
//      },
      payMoney () {
        console.log (1);
        let money = 0;
        let coursePriceType = this.formValidate.coursePriceType;
        if (coursePriceType) {
          let buyLength = this.formValidate.buyLength;
          let promotionCode = this.formValidate.promotionCode;
          let coursePriceActivityType = this.formValidate.coursePriceActivityType;
          let prizeActivity = this.formValidate.prizeActivity;
          let discountTypeId = this.formValidate.coupon
          this.$axios.get (ORDER ().CreateOrder.getPayMoney, {
            params: {
              coursePriceType: coursePriceType,
              // coursePriceActivityType: coursePriceActivityType,
              buyLength: buyLength,
              promotionCode: promotionCode,
              prizeId: prizeActivity,
              discountTypeId: discountTypeId,
            },
          }).then (({data}) => {
            this.moneys = data.data;
          })
          return this.moneys;
        }
        return this.moneys;
      },
      modalTitle () {
        return (this.flag === 'greenChannel') ? '绿色通道（未试听学生提交付费申请）' : '付费申请';
      }
    }
  };
</script>
<style scoped lang="less">
  .money-info span {
    font-size: 25px;
  }

  /*上传*/
  .demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }

  .payDetailTitle {
    font-size: 16px;
    padding-left: 20px;
    margin-top: 8px;
    margin-bottom: 18px;
    padding-bottom: 5px;
    border-bottom: 1px dashed #ccc;
    color: #3C3C3C;
    font-weight: bold;
  }

  .qrCodeImgWrap {
    display: inline-block;
    .qrCodeTitle {
      text-align: right;
      vertical-align: middle;
      font-size: 12px;
      color: #657180;
      line-height: 1;
      padding: 10px 12px 10px 0;
      box-sizing: border-box;
      width: 100px;
      font-weight: 700;
      float: left;
    }
    .qrcode {
      border: 1px dashed #d7dde4;
      display: inline-block;
      width: 100px;
      height: 100px;
      border-radius: 4px;
    }
  }

  .deleteWrap {
    display: inline-block;
    width: 50px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    vertical-align: top;
    .deleteIcon {
      cursor: pointer;
      padding-top: 5px;
      padding-left: 30px;
    }
  }
</style>
