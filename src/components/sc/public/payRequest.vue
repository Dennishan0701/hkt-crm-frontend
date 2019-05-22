<template>
  <Modal
    v-model="payRequestModal"
    :title="modalTitle"
    width="900"
    :loading="loading"
    :closable="false"
    :mask-closable="false"
    @on-ok="onOk">
    <i-form ref='formValidate' :model="formValidate" inline :rules="ruleValidate" :label-width="100">
      <Form-item label="购买课时包" prop="coursePriceType">
        <i-select v-model="formValidate.coursePriceType" @on-change="changeCoursePriceType" style="width:200px">
          <i-option v-for="(item,index) in coursePriceTypeList" :key='index' :value="item.value">{{ item.value }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="购买课时数" prop="buyLength">
        <Input-number :min="1" v-model="formValidate.buyLength" @on-change='showPay' style="width:200px"></Input-number>
      </Form-item>
      <Form-item label="课时包活动类别" prop="coursePriceActivityType">
        <i-select v-model="formValidate.coursePriceActivityType" style="width:200px">
          <i-option value="常规">常规</i-option>
          <i-option value="特殊">特殊</i-option>
          <i-option value="暑秋联报">暑秋联报</i-option>
          <i-option value="常规暑秋联报">常规暑秋联报</i-option>
          <i-option value="精品暑秋联报">精品暑秋联报</i-option>
          <i-option value="寒假联报">寒假联报</i-option>
          <i-option value="夏令营">夏令营</i-option>
          <i-option value="暑期专题">暑期专题</i-option>
          <i-option value="399系列">399系列</i-option>
          <i-option value="9999系列">9999系列</i-option>
        </i-select>
      </Form-item>
      <Form-item label="课时级别">
        <Radio-group v-model="formValidate.level">
          <Radio label="0">普通</Radio>
          <Radio label="1">清北</Radio>
          <Radio label="2">明星课程</Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="付费方式" prop="payType">
        <i-select v-model="formValidate.payType" @on-change="changePayType" style="width:200px">
          <i-option value="bank">银行转账</i-option>
          <i-option value="taobao">淘宝</i-option>
          <i-option value="alipay">支付宝</i-option>
          <i-option value="weixin">微信</i-option>
          <i-option value="kuStaging">库分期</i-option>
          <i-option value="baiduStaging" v-if='showPayType'>百度分期</i-option>
          <i-option value="lovehaimi" v-if='showPayType'>爱海米分期</i-option>
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
        <i-input v-model="formValidate.otherBank" placeholder="下拉列表没有？请在这里填写其他银行" style="width:200px"></i-input>
      </Form-item>
      <Form-item label="付款时间" prop="payDate">
        <date-picker type="date" :value="formValidate.payDate" @on-change="changePayDate" placeholder="选择日期"
                     style="width: 200px"></date-picker>
      </Form-item>
      <Form-item label="参与活动">
        <i-input v-model="formValidate.inActivities" style="width:200px"></i-input>
      </Form-item>
      <Form-item label="优惠码" prop="promotionCode">
        <i-input v-model="formValidate.promotionCode" style="width:200px"></i-input>
      </Form-item>
      <Form-item label=赠送课时>
        <i-input v-model="formValidate.giveLength" style="width:200px"></i-input>
      </Form-item>
      <Form-item label="付款截图">
        <!--<i-button type="success" icon="upload" @click="upLoad">上传</i-button>-->

        <div class="demo-upload-list" v-for="(item,index) in defaultList" :key='index'>
          <template v-if="item.status === 'finished'">
            <img :src="item.imgUrl">
            <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click="handleView(item.imgUrl)"></Icon>
              <Icon type="ios-trash-outline" @click="handleRemove(item)"></Icon>
            </div>
          </template>
          <template v-else>
            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
          </template>
        </div>
        <Upload
          ref='upload'
          :show-upload-list="false"
          :default-file-list="defaultList"
          :on-success="handleSuccess"
          :format="['jpg','jpeg','png']"
          :max-size="20480"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :before-upload="handleBeforeUpload"
          multiple
          :data="token"
          type="drag"
          :action="upUrl"
          style="display: inline-block;width:58px;">
          <div style="width: 58px;height:58px;line-height: 58px;">
            <Icon type="camera" size="20"></Icon>
          </div>
        </Upload>
        <Modal title="查看图片" v-model="visible">
          <img :src="imgUrl" v-if="visible" style="width: 100%">
        </Modal>
      </Form-item>
      <Form-item label="优惠活动" prop="prizeActivity">
        <i-select v-model="formValidate.prizeActivity" @on-change="changePrizeActivity" style="width:200px">
          <!--<i-option :value="prizeId">{{prizeContent}}</i-option>-->
          <i-option value="0">不选择优惠</i-option>
          <i-option v-for="(item,index) in prizeActivityList" :key='index' :value="item.prizeId">{{item.prizeContent}}</i-option>
        </i-select>
      </Form-item>
      <!--<Form-item label="已上传文件">-->
        <!--<p>{{formValidate.payPicture}}</p>-->
      <!--</Form-item>-->
      <div class="txt-center money-info">
        <span>支付金额：{{payMoney}} 元</span>
      </div>
      <!--移交表-->
      <!--<hr class="split"/>-->


      <!--<div class="split-div">-->
        <!--<div class="title">基本信息</div>-->
      <!--</div>-->
      <!--<Form-item label="学生姓名" prop="name">-->
        <!--<i-input v-model="Student.name" placeholder="学生姓名" style="width:200px"></i-input>-->
      <!--</Form-item>-->
      <!--<Form-item label="性别" prop="sex">-->
        <!--<i-select v-model="Student.sex" placeholder="性别" style="width:200px">-->
          <!--<i-option value=0>男</i-option>-->
          <!--<i-option value=1>女</i-option>-->
        <!--</i-select>-->
      <!--</Form-item>-->
      <!--<Form-item label="年级" prop="grade">-->
        <!--<i-select v-model="Student.grade" placeholder="年级" style="width:200px">-->
          <!--<i-option v-for="item in gradeList" :value="item.value">{{ item.value }}</i-option>-->
        <!--</i-select>-->
      <!--</Form-item>-->
      <!--<Form-item label="科目" prop="subject">-->
        <!--<i-select v-model="Student.subject" placeholder="性别" style="width:200px">-->
          <!--<i-option value=1>文科</i-option>-->
          <!--<i-option value=0>理科</i-option>-->
        <!--</i-select>-->
      <!--</Form-item>-->
      <!--<Form-item label="省" prop="provinceId">-->
        <!--<i-select v-model="Student.provinceId" :label-in-value="true" @on-change="changeSelectedCity"-->
                  <!--placeholder="省" style="width:200px">-->
          <!--<i-option v-for="item in provinceList" :value="item.id">{{ item.name }}</i-option>-->
        <!--</i-select>-->
      <!--</Form-item>-->
      <!--<Form-item label="市" prop="cityId">-->
        <!--<i-select v-model="Student.cityId" :label-in-value="true" @on-change="changeSelectedArea" placeholder="市"-->
                  <!--style="width:200px">-->
          <!--<i-option v-for="item in cityArrays" :value="item.id">{{ item.name }}</i-option>-->
        <!--</i-select>-->
      <!--</Form-item>-->
      <!--<Form-item label="区" prop="countId">-->
        <!--<i-select v-model="Student.countId" :label-in-value="true" @on-change="changeSelectedCount" placeholder="区"-->
                  <!--style="width:200px">-->
          <!--<i-option v-for="item in areaList" :value="item.id">{{ item.name }}</i-option>-->
        <!--</i-select>-->
      <!--</Form-item>-->
      <!--<Form-item label="所在学校" prop="school">-->
        <!--<i-select v-model="Student.school" placeholder="学校" style="width:200px">-->
          <!--<i-option v-for="item in scrollList" :value="item.schoolname">{{ item.schoolname }}</i-option>-->
        <!--</i-select>-->
      <!--</Form-item>-->


      <!--<div class="split-div">-->
        <!--<div class="title">成绩情况</div>-->
      <!--</div>-->

      <!--<table class="onlyhi-table">-->
        <!--<tr>-->
          <!--<th>科目</th>-->
          <!--<th>语文</th>-->
          <!--<th>数学</th>-->
          <!--<th>英语</th>-->
          <!--<th>物理</th>-->
          <!--<th>化学</th>-->
          <!--<th>生物</th>-->
          <!--<th>政治</th>-->
          <!--<th>历史</th>-->
          <!--<th>其他</th>-->
        <!--</tr>-->
        <!--<tr>-->
          <!--<td>满分</td>-->
          <!--<td>-->
              <!--<i-input v-model="Student.name" placeholder="分数" style="width:95%;padding-right: 0"></i-input>-->
          <!--</td>-->
          <!--<td>-->
              <!--<i-input v-model="Student.name" placeholder="分数" style="width:95%"></i-input>-->
          <!--</td>-->
          <!--<td>-->
              <!--<i-input v-model="Student.name" placeholder="分数" style="width:95%"></i-input>-->
          <!--</td>-->
          <!--<td>-->
              <!--<i-input v-model="Student.name" placeholder="分数" style="width:95%"></i-input>-->
          <!--</td>-->
          <!--<td>-->
              <!--<i-input v-model="Student.name" placeholder="分数" style="width:95%"></i-input>-->
          <!--</td>-->
          <!--<td>-->
              <!--<i-input v-model="Student.name" placeholder="分数" style="width:95%"></i-input>-->
          <!--</td>-->
          <!--<td>-->
              <!--<i-input v-model="Student.name" placeholder="分数" style="width:95%"></i-input>-->
          <!--</td>-->
          <!--<td>-->
              <!--<i-input v-model="Student.name" placeholder="分数" style="width:95%"></i-input>-->
          <!--</td>-->
          <!--<td>-->
              <!--<i-input v-model="Student.name" placeholder="分数" style="width:95%"></i-input>-->
          <!--</td>-->
        <!--</tr>-->
        <!--<tr>-->
          <!--<td>分数</td>-->
          <!--<td>-->
              <!--<i-input v-model="Student.name" placeholder="分数" style="width:95%"></i-input>-->
          <!--</td>-->
          <!--<td>-->
              <!--<i-input v-model="Student.name" placeholder="分数" style="width:95%"></i-input>-->
          <!--</td>-->
          <!--<td>-->
              <!--<i-input v-model="Student.name" placeholder="分数" style="width:95%"></i-input>-->
          <!--</td>-->
          <!--<td>-->
              <!--<i-input v-model="Student.name" placeholder="分数" style="width:95%"></i-input>-->
          <!--</td>-->
          <!--<td>-->
              <!--<i-input v-model="Student.name" placeholder="分数" style="width:95%"></i-input>-->
          <!--</td>-->
          <!--<td>-->
              <!--<i-input v-model="Student.name" placeholder="分数" style="width:95%"></i-input>-->
          <!--</td>-->
          <!--<td>-->
              <!--<i-input v-model="Student.name" placeholder="分数" style="width:95%"></i-input>-->
          <!--</td>-->
          <!--<td>-->
              <!--<i-input v-model="Student.name" placeholder="分数" style="width:95%"></i-input>-->
          <!--</td>-->
          <!--<td>-->
              <!--<i-input v-model="Student.name" placeholder="分数" style="width:95%"></i-input>-->
          <!--</td>-->
        <!--</tr>-->
        <!--<tr>-->
          <!--<td>教材版本</td>-->
          <!--<td>-->
              <!--<i-select v-model="Student.school" placeholder="版本" style="width:95%">-->
                <!--<i-option v-for="item in scrollList" :value="item.schoolname">{{ item.schoolname }}</i-option>-->
              <!--</i-select>-->
          <!--</td>-->
          <!--<td>-->
              <!--<i-select v-model="Student.school" placeholder="版本" style="width:95%">-->
                <!--<i-option v-for="item in scrollList" :value="item.schoolname">{{ item.schoolname }}</i-option>-->
              <!--</i-select>-->
          <!--</td>-->
          <!--<td>-->
              <!--<i-select v-model="Student.school" placeholder="版本" style="width:95%">-->
                <!--<i-option v-for="item in scrollList" :value="item.schoolname">{{ item.schoolname }}</i-option>-->
              <!--</i-select>-->
          <!--</td>-->
          <!--<td>-->
              <!--<i-select v-model="Student.school" placeholder="版本" style="width:95%">-->
                <!--<i-option v-for="item in scrollList" :value="item.schoolname">{{ item.schoolname }}</i-option>-->
              <!--</i-select>-->
          <!--</td>-->
          <!--<td>-->
              <!--<i-select v-model="Student.school" placeholder="版本" style="width:95%">-->
                <!--<i-option v-for="item in scrollList" :value="item.schoolname">{{ item.schoolname }}</i-option>-->
              <!--</i-select>-->
          <!--</td>-->
          <!--<td>-->
              <!--<i-select v-model="Student.school" placeholder="版本" style="width:95%">-->
                <!--<i-option v-for="item in scrollList" :value="item.schoolname">{{ item.schoolname }}</i-option>-->
              <!--</i-select>-->
          <!--</td>-->
          <!--<td>-->
              <!--<i-select v-model="Student.school" placeholder="版本" style="width:95%">-->
                <!--<i-option v-for="item in scrollList" :value="item.schoolname">{{ item.schoolname }}</i-option>-->
              <!--</i-select>-->
          <!--</td>-->
          <!--<td>-->
              <!--<i-select v-model="Student.school" placeholder="版本" style="width:95%">-->
                <!--<i-option v-for="item in scrollList" :value="item.schoolname">{{ item.schoolname }}</i-option>-->
              <!--</i-select>-->
          <!--</td>-->
          <!--<td>-->
              <!--<i-select v-model="Student.school" placeholder="版本" style="width:95%">-->
                <!--<i-option v-for="item in scrollList" :value="item.schoolname">{{ item.schoolname }}</i-option>-->
              <!--</i-select>-->
          <!--</td>-->
        <!--</tr>-->
      <!--</table>-->


      <!--<div class="split-div">-->
        <!--<div class="title">移交正式生备注</div>-->
      <!--</div>-->
      <!--<Form-item prop="remark" label="客户端是否正常流程">-->
        <!--<i-input type="textarea" v-model="validateRemark.remark" :rows="4" :maxlength="500"-->
                 <!--style="width:200px"></i-input>-->
      <!--</Form-item>-->
      <!--<Form-item prop="remark" label="是否为学员定制课程规划">-->
        <!--<i-input type="textarea" v-model="validateRemark.remark" :rows="4" :maxlength="500"-->
                 <!--style="width:200px"></i-input>-->
      <!--</Form-item>-->
      <!--<Form-item label="首科要上的科目" prop="subject">-->
        <!--<i-select v-model="Student.subject" :disabled="baseDisabled" placeholder="科目" style="width:200px">-->
          <!--<i-option v-for="item in subjectList" :value="item.value">{{ item.value }}</i-option>-->
        <!--</i-select>-->
      <!--</Form-item>-->
      <!--<Form-item label="首科时间" prop="subject">-->
        <!--<Date-picker type="daterange" size="small" @on-change="changeDate" placement="bottom-end" placeholder="负责时间"-->
                     <!--style="width: 200px"></Date-picker>-->
      <!--</Form-item>-->
      <!--<Form-item label="是否有扩科需求">-->
        <!--<Radio-group v-model="formItem.radio" style="width:200px">-->
          <!--<Radio value="male">男</Radio>-->
          <!--<Radio value="female">女</Radio>-->
        <!--</Radio-group>-->
      <!--</Form-item>-->
      <!--<Form-item label="扩科科目" prop="subject">-->
        <!--<i-select v-model="Student.subject" :disabled="baseDisabled" placeholder="科目" style="width:200px">-->
          <!--<i-option v-for="item in subjectList" :value="item.value">{{ item.value }}</i-option>-->
        <!--</i-select>-->
      <!--</Form-item>-->
      <!--<Form-item prop="remark" label="以往补习经历">-->
        <!--<i-input type="textarea" v-model="validateRemark.remark" :rows="4" :maxlength="500"-->
                 <!--style="width:200px"></i-input>-->
      <!--</Form-item>-->
      <!--<Form-item prop="remark" label="具体学习情况及学习主动性">-->
        <!--<i-input type="textarea" v-model="validateRemark.remark" :rows="4" :maxlength="500"-->
                 <!--style="width:200px"></i-input>-->
      <!--</Form-item>-->
      <!--<Form-item prop="remark" label="学生性格特点及相关家庭情况：">-->
        <!--<i-input type="textarea" v-model="validateRemark.remark" :rows="4" :maxlength="500"-->
                 <!--style="width:400px"></i-input>-->
      <!--</Form-item>-->
      <!--<Form-item prop="remark" label="家长关注点以及对老师的要求：">-->
        <!--<i-input type="textarea" v-model="validateRemark.remark" :rows="4" :maxlength="500"-->
                 <!--style="width:400px"></i-input>-->
      <!--</Form-item>-->
      <!--<Form-item prop="remark" label="允许排课时间以及上课频率（作息）：">-->
        <!--<i-input type="textarea" v-model="validateRemark.remark" :rows="4" :maxlength="500"-->
                 <!--style="width:400px"></i-input>-->
      <!--</Form-item>-->
      <!--<Form-item prop="remark" label="其它（特殊情况报备）：">-->
        <!--<i-input type="textarea" v-model="validateRemark.remark" :rows="4" :maxlength="500"-->
                 <!--style="width:400px"></i-input>-->
      <!--</Form-item>-->
      <!--<input type="file" id="addFileInput" @change="onAddChangeFileOk" style="display: none;"/>-->
    </i-form>
    <div slot="footer" class="text-right">
      <i-button type="text" @click="onCancel('formValidate')" >取消</i-button>
      <i-button type="primary"  @click="onOk('formValidate')" >提交</i-button>
    </div>
  </Modal>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {SCS} from 'common/api/scs.js';
  import {ORDER} from 'common/api/order.js';
  import {common,checkImageExt,uploadAjax} from 'common/js/common.js';

  export default{
    data() {
      var validateBank = (rule, value, callback) => {
        if (this.isViewBank && value === "" && this.formValidate.otherBank === "") {
          callback(new Error('请选择一个银行或者填写一个银行'));
        } else {
          callback();
        }
      }
      var validateBuyLength = (rule, value, callback) => {
        if (value.toString().includes('.')) {
          callback(new Error('购买课时不能是小数'));
        } else if (value > 960) {
          callback(new Error('购买课时不能大于960'));
          callback();
        }
      }
      return {
        prizeContent: '',
        prizeId: '',
        prizeActivityList: [],
        token:{
          'token': localStorage.getItem('token')
        },
        defaultList:[],//图片上传
        imgUrl:'',//图片路径
        visible:false,//图片查看
        upUrl:SCS().WaitPay.uploadPayPicture,
        loading: true,
        payRequestModal: false,
        isViewBank: false,
        isLoan: false,
        showPayType: false,
        courseOrderUuid: '',
        payOrderUuid: '',
        leadsUuid: '',
        flag: '',
//        subjectList: [],//科目
//        gradeList: [],
//        provinceList: [],//省
//        cityArrays: [],//市
//        areaList: [],//区
//        scrollList: [],//学校
        formValidate: {
          prizeActivity: 0,
          coursePriceType: '小学',
          coursePriceActivityType: '常规',
          buyLength: 1,
          level: 0,
          inActivities: '',
          payType: '',
          lender: '',
          lenderPhone: '',
          payPicture: '',
          bank: '',
          otherBank: '',
          payDate: '',
          promotionCode: '',
          giveLength: '',

          //移交表

        },
        bankList: [],
        coursePriceTypeList: [],
        ruleValidate: {
          prizeActivity: [
            {required: true, message: '请选择优惠', trigger: 'change'}
          ],
          coursePriceType: [
            {required: true, message: '请选择购买课时包', trigger: 'change'}
          ],
          buyLength: [
            {required: true, validator: validateBuyLength, trigger: ['change', 'blur']},
          ],
          money: [
            {required: true, type: 'number', min: 1, message: '不能小于1', trigger: 'blur'}
          ],
          lender: [
            {required: true, message: '贷款人不能为空', trigger: 'blur'},
          ],
          lenderPhone: [
            {required: true, message: '贷款人手机号码不能为空', trigger: 'blur'},
          ],
          payType: [
            {required: true, message: '付费方式不能为空', trigger: 'change'},
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
      handleView (url) {
        this.imgUrl = url;
        this.visible = true;
        console.log(this.defaultList);
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
      handleMaxSize (file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 20M。'
        });
      },
      handleRemove (file) {
        // 从 upload 实例删除数据
        const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        this.defaultList = this.$refs.upload.fileList;
      },
      handleSuccess (res, file,fileList) {
        // 因为上传过程为实例，这里模拟添加 url
        file.imgUrl = res.data.url;
        file.name = res.data.key;
        this.defaultList = fileList
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
        });
      },
//      onAddChangeFileOk(event){
//        const _this = this;
//        let addFileInput = document.getElementById('addFileInput');
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
//
////              _this.formValidate.fileName = res.data.fileName
////              _this.formValidate.fileOriginalName = res.data.fileOriginalName
//            }
//          });
//        }
//
//      },
      showPay(){
        console.log(this.formValidate.buyLength);
        console.log(this.formValidate.coursePriceType);
        if(this.formValidate.buyLength >=80 && (this.formValidate.coursePriceType == '高三精品' || this.formValidate.coursePriceType == '初三精品')){
          this.showPayType = true
        }else if(this.formValidate.buyLength >=80){
          this.showPayType = true
        }else {
          this.showPayType = false
        }
      },
      show(courseOrderUuid, payOrderUuid, leadsUuid, flag) {
        this.handleReset('formValidate');
        this.defaultList = [];
        this.courseOrderUuid = courseOrderUuid;
        this.payOrderUuid = payOrderUuid;
        this.leadsUuid = leadsUuid;
        this.payRequestModal = true;
        this.formValidate.buyLength = 1;
        this.showPayType = false;
        this.flag = flag;
        const _this = this;
        common.ajax({
          url: COMMON_API().allBank,
          method: 'get',
          success: function (response) {
            _this.bankList = response.data;
          }
        });
        $.getJSON("static/data.json", function (json) {
          _this.coursePriceTypeList = json.coursePriceTypeList;//课时包
        });
        // 获取优惠活动
        this.$axios.post(ORDER().CreateOrder.getLeadsBonusListByLeadsUuid,{
          leadsUuid: leadsUuid,
        }).then( (res) => {
          this.prizeActivityList = res.data.data
          console.log(res);
          this.payRequestModal = true;
          // this.prizeContent = res.data.prizeContent;
          this.prizeId = res.data.data.prizeId;
        })
//        this.init();//页面初始化
      },
      // 优惠活动
      changePrizeActivity(value) {
        this.formValidate.prizeActivity = value;
        // this.getMoney();
      },
//      init(){
//        const _this = this;
//        //获取科目年级
//        $.getJSON("static/data.json", function (json) {
//          _this.gradeList = json.gradeList;
//          _this.subjectList = json.subjectList;
//        });
//        //获取省
//        common.ajax({
//          url: COMMON_API().ssqAreaAllStudy,
//          method: 'get',
//          data: {parentid: 1},
//          success: function (response) {
//            _this.provinceList = response.data || [];
//          }
//        });
//      },
//      省市区学校start
//      changeSelectedCity(areaName) {
//        const _this = this;
//        _this.province = areaName.label;
//        //获取城市
//        common.ajax({
//          url: COMMON_API().ssqAreaAllStudy,
//          method: 'get',
//          data: {parentid: areaName.value},
//          success: function (response) {
//            _this.cityArrays = response.data;
//          }
//        });
//      },
//      changeSelectedArea(areaName) {
//        const _this = this;
//        //获取城市的区域
//        console.log(areaName.label);
//        if (areaName.label) {
//          _this.city = areaName.label;
//        }
//        common.ajax({
//          url: COMMON_API().ssqAreaAllStudy,
//          method: 'get',
//          data: {parentid: areaName.value},
//          success: function (response) {
//            _this.areaList = response.data || [];
//          }
//        });
//      },
//      changeSelectedCount(areaName){
//        const _this = this;
//        console.log(areaName.label);
//        if (areaName.label) {
//          _this.count = areaName.label;
//        }
//        //获取所有学校
//        console.log(areaName);
//        common.ajax({
//          url: COMMON_API().allStudySchool,
//          method: 'get',
//          data: {provinceId: _this.Student.provinceId, cityId: _this.Student.cityId, countyId: areaName.value},
//          success: function (response) {
//            _this.scrollList = response.data || [];
//          }
//        });
//      },
//      省市区学校End
      onOk() {
        let api = SCS().WaitPay.payRequest;
        if (this.flag) {
          api = SCS().MyStudent[this.flag];
        }
        this.loading = false;
        let params = ''
        this.defaultList.forEach(function (v, i) {
          params +=v.name+',';
        });
        this.$refs.formValidate.validate((valid) => {
          if (valid) {
            const _this = this;
            common.ajax({
              url: api,
              data: {
                courseOrderUuid: _this.courseOrderUuid,
                payOrderUuid: _this.payOrderUuid || '',
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
                payTime: _this.formValidate.payDate,
                giveLength: _this.formValidate.giveLength,
                prizeId: _this.formValidate.prizeActivity,
              },
              success: function (response) {
                _this.payRequestModal = false;
                common.notices('操作成功！！');
                _this.$emit('reFresh', 'success');
              }
            });
//            function a() {
//              return new Promise(function (res, rej) {
//              common.ajax({
//                url: api,
//                data: {
//                  courseOrderUuid: _this.courseOrderUuid,
//                  payOrderUuid: _this.payOrderUuid || '',
//                  leadsUuid: _this.leadsUuid,
//                  coursePriceType: _this.formValidate.coursePriceType,
//                  coursePriceActivityType: _this.formValidate.coursePriceActivityType,
//                  promotionCode: _this.formValidate.promotionCode,
//                  buyLength: _this.formValidate.buyLength,
//                  courseLevel: _this.formValidate.level,
//                  inActivities: _this.formValidate.inActivities,
//                  payType: _this.formValidate.payType,
//                  bank: _this.formValidate.bank || _this.formValidate.otherBank,
//                  payTime: _this.formValidate.payDate,
//                  giveLength: _this.formValidate.giveLength,
//                },
//                success: function (response) {
//                  res(1)
//                }
//              });
//              })
//            }
//            //移交表
//            function b() {
//              return new Promise(function (res, rej) {
//                common.ajax({
//                  url: api,
//                  data: {
//                    courseOrderUuid: _this.courseOrderUuid,
//                  },
//                  success: function (response) {
//                    res(2)
//                  }
//                });
//              })
//            }
//            a().then(function (data) {
//              if(data == 1){
//                b().then(function (data) {
//                  if(data == 2){
//                    _this.payRequestModal = false;
//                    common.notices('操作成功！！');
//                  }
//                })
//              }
//            })
//
//

          } else {
            setTimeout(() => {
              this.loading = true;
            }, 0);
          }
        });
      },
      changeCoursePriceType(value) {
        if (value === '清北') {
          this.formValidate.level = 1;
        } else if (value === '明星') {
          this.formValidate.level = 2;
        } else {
          this.formValidate.level = 0;
        }
        this.showPay();
      },
      changePayDate(value) {
        this.formValidate.payDate = value;
      },
      changePayType(value) {
        if(value === "bank") {
          this.isViewBank = true;
          this.isLoan = false;
        } else if (value === 'baiduStaging' || value ==='lovehaimi') {
          this.isLoan = true;
          this.isViewBank = false;
        }else {
          this.isLoan = false;
          this.isViewBank = false;
        }
      },
      onCancel(name){
        this.payRequestModal = false;
        // this.handleReset(name);
      },
      handleReset (name) {
        this.$refs[name].resetFields();
        this.formValidate.prizeActivity = 0;
        this.money = 0;
        this.prizeActivityList = [];
      }
    },
    computed: {
//      uploadList () {
//      return this.$refs.upload ? this.$refs.upload.fileList : [];
//    },
      payMoney() {
        let money = 0;
        let coursePriceType = this.formValidate.coursePriceType;
        if (coursePriceType) {
          let coursePriceActivityType = this.formValidate.coursePriceActivityType;
          let buyLength = this.formValidate.buyLength;
          let promotionCode = this.formValidate.promotionCode;
          let prizeActivity = this.formValidate.prizeActivity;
          common.ajax({
            url: ORDER().CreateOrder.getPayMoney,
            method: 'get',
            isAsync: 'no',
            data: {
              coursePriceType: coursePriceType,
              coursePriceActivityType: coursePriceActivityType,
              buyLength: buyLength,
              promotionCode: promotionCode,
              prizeId: prizeActivity,
            },
            success(res) {
              money = res.data;
            },
            complete: function () {
              return money;
            }
          });
          return money;
        }
        return money;
      },
      modalTitle() {
        return (this.flag === 'greenChannel') ? '绿色通道（未试听学生提交付费申请）' : '付费申请';
      }
    }
  };
</script>

<style scoped>
  .onlyhi-table {
    margin-left: 12px;
    width: 98% !important;
  }
  .money-info span {
    font-size: 25px;
  }

  .split-div {
    position: relative;
    padding: 0;
    height: 32px;
    line-height: 32px;
    border-bottom: 2px solid #e5e5e5;
    margin: 10px 10px 20px 10px;
  }

  .split-div .title {
    position: absolute;
    padding: 0 10px;
    border-bottom: 2px solid #59bc5e;
    color: #3C3C3C;
    top: -2px;
    left: 0;
    font-size: 16px;
    font-weight: bold;
    vertical-align: middle;
  }
  /*上传*/
  .demo-upload-list{
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
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
