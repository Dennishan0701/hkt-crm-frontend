<template>
  <div>
    <Modal
      v-model="payRequestModal"
      :title="modalTitle"
      width="1100"
      :closable="false"
      :mask-closable="false">
      <div v-show='title0' slot="header" class="txt-center">
        <h2 class="c-success">绿色通道</h2>
        <p class="c-red">未视听学生提交付费申请</p>
      </div>
      <div v-show='title1' slot="header" class="txt-center">
        <p class="c-red">付费申请</p>
      </div>
      <div v-show='title2' slot="header" class="txt-center">
        <p class="c-red">修改付费申请</p>
      </div>
      <i-form ref='formValidate' :model="formValidate" inline :rules="ruleValidate" :label-width="100">
        <Form-item label="购买课时包" prop="coursePriceType">
          <i-select v-model="formValidate.coursePriceType" @on-change="changeCoursePriceType" style="width:200px"
                    :disabled="isRevise">
            <i-option v-for="(item,index) in coursePriceTypeList" :key='index' :value="item">{{ item }}
            </i-option>
          </i-select>
        </Form-item>
        <Form-item label="购买总课时数" prop="buyLength">
          <Input-number :min="1" v-model="formValidate.buyLength" @on-change='showPay' style="width:100px"
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
          <i-input v-model="formValidate.otherBank" placeholder="下拉列表没有？请在这里填写其他银行" style="width:200px"></i-input>
        </Form-item>
        <!--formValidate.payDate=$event-->
        <Form-item label="付款时间" prop="payDate">
          <date-picker v-model="formValidate.payDate" format="yyyy-MM-dd" type="date"
                       @on-change="changePayDate" placeholder="选择日期" style="width: 200px"
                       :disabled="isOrderSaved"></date-picker>
        </Form-item>
        <Form-item label=赠送课时>
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
          <i-select v-model="formValidate.coupon" @on-change="changeCoupon" style="width:200px" :disabled="isRevise">
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
          <i-input type="textarea" :rows="3" :maxlength="250" v-model="formValidate.inActivities"
                   style="width:600px" :disabled="isOrderSaved"></i-input>
        </Form-item>
        <div style="text-align: right">
          <Button v-if="isSaveBtnShow" :disabled="isFinished" size="default" style="width: 80px;margin-right: 50px;"
                  type="primary"
                  @click="saveFormData">保存订单
          </Button>
        </div>
        <!--<div style="border-bottom: 1px dashed #ccc;">-->
        <!----------------------------付费详情------------------------------>
        <div v-if="isSaved" style="border-bottom: 1px dashed #ccc;">
          <div class="payDetailTitle" style="">付费详情 <span style="color:red;font-size: 12px;margin-left: 20px;">* 生成二维码后金额不可删除修改，请检查输入后再点击"生成二维码"按钮</span>
          </div>
          <ul>
            <li v-for="(item,key) in formValidate.payDetailList" :key='key'>
              <!--<li v-for="(item,key) in formValidate.payDetailList" :key='key' v-if="item.status">-->
              <Form-item label="付费方式" :prop="'payDetailList.' + key + '.pdPayType'"
                         :rules="{required: true, message:'不能为空', trigger: 'change'}">
                <i-select :disabled="item.afterCreateQrcodeType" v-model="item.pdPayType" style="width:150px"
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
                <i-input :disabled="item.afterCreateQrcodeMoney" v-model="item.pdAcountMoney" style="width:150px"
                         @on-blur="changePayAcount(item.pdPayType,key,$event)"></i-input>
              </Form-item>
              <Form-item v-if="item.isShowPayPic" label="付款截图" :prop="'payDetailList.' + key + '.fileList'">
                <div class="demo-upload-list" v-for="(items,keys) in item.fileList" :key='keys'>
                  <template v-if="items.status === 'finished'">
                    <img :src="items.imgUrl">
                    <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click="handleView2(items.imgUrl)"></Icon>
                      <!--<Icon type="ios-trash-outline" @click="handleRemove2(items)"></Icon>-->
                      <Icon type="ios-trash-outline" @click="handleRemove2(items,key)"></Icon>
                    </div>
                  </template>
                  <template v-else>
                    <Progress v-show="items.showProgress" :percent="items.percentage" hide-info></Progress>
                  </template>
                </div>
                <Upload
                  v-if="!item.isPay||!item.afterCreateQrcodeMoney"
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
                <div v-else
                     style="width: 58px;height:60px;line-height:60px;line-height: 58px;border-radius: 4px;border:1px dashed #d7dde4;text-align: center;">
                  不可修改
                </div>
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
        <div v-if="!isShowActualMoney" class="txt-center money-info">
          <span>支付金额：{{payMoney}} 元</span>
        </div>
        <div v-if="isShowActualMoney" class="txt-center money-info">
          <span>实付金额：{{actualMoney}} 元</span>
        </div>
        <div v-show="role == 'cc'">
          移交表
          <hr class="split"/>
          <div class="split-div">
            <div class="title">基本信息</div>
          </div>
          <Form-item label="学生姓名">
            <i-input v-model="formValidate.name" placeholder="学生姓名" style="width:200px"></i-input>
          </Form-item>
          <Form-item label="性别" prop="sex">
            <i-select v-model="formValidate.sex" placeholder="性别" style="width:200px">
              <i-option value=0>男</i-option>
              <i-option value=1>女</i-option>
            </i-select>
          </Form-item>
          <Form-item label="年级" prop="grade">
            <i-select v-model="formValidate.grade" @on-change='getVersion' placeholder="年级" style="width:200px">
              <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
            </i-select>
          </Form-item>
          <!--选择年级为小三、小四、小五、小六、预初时，选择课程时长为45分钟或者60分钟。-->
          <div v-show="hasCourseTimes" style="float:left">
            <Form-item label="课程时长" prop="courseTimes">
              <Radio-group v-model="formValidate.courseTimes">
                <Radio label="45">45分钟</Radio>
                <Radio label="60">60分钟</Radio>
              </Radio-group>
            </Form-item>
          </div>
          <Form-item label="文科/理科" prop="subject">
            <i-select v-model="formValidate.isScience" placeholder="文/理科" style="width:200px">
              <i-option value="">无</i-option>
              <i-option value='0'>文科</i-option>
              <i-option value='1'>理科</i-option>
            </i-select>
          </Form-item>
          <Form-item label="省">
            <i-select v-model="formValidate.provinceId" :label-in-value="true" @on-change="changeSelectedCity"
                      placeholder="省" style="width:200px">
              <i-option v-for="(item,index) in provinceList" :key='index' :value="item.id">{{ item.name }}</i-option>
            </i-select>
          </Form-item>
          <Form-item label="市">
            <i-select v-model="formValidate.cityId" :label-in-value="true" @on-change="changeSelectedArea"
                      placeholder="市"
                      style="width:200px">
              <i-option v-for="(item,index) in cityArrays" :key='index' :value="item.id">{{ item.name }}</i-option>
            </i-select>
          </Form-item>
          <Form-item label="区">
            <i-select v-model="formValidate.countId" :label-in-value="true" @on-change="changeSelectedCount"
                      placeholder="区"
                      style="width:200px">
              <i-option v-for="(item,index) in areaList" :key='index' :value="item.id">{{ item.name }}</i-option>
            </i-select>
          </Form-item>
          <Form-item label="所在学校" prop="school">
            <i-select v-model="formValidate.school" placeholder="所在学校" style="width:200px">
              <i-option v-for="(item,index) in scrollList" :key='index' :value="item.schoolname">{{ item.schoolname }}
              </i-option>
            </i-select>
          </Form-item>
          <i-button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</i-button>
          <div class="split-div">
            <div class="title">成绩情况</div>
          </div>
          <table class="onlyhi-table">
            <tr>
              <th>科目</th>
              <th>语文</th>
              <th>数学</th>
              <th>英语</th>
              <th>物理</th>
              <th>化学</th>
              <th>生物</th>
              <th>政治</th>
              <th>历史</th>
              <th>其他</th>
            </tr>
            <tr>
              <td>满分</td>
              <td>
                <i-input v-model="formValidate.languageFullScore" placeholder="分数"
                         style="width:95%;padding-right: 0"></i-input>
              </td>
              <td>
                <i-input v-model="formValidate.mathematicsFullScore" placeholder="分数"
                         style="width:95%"></i-input>
              </td>
              <td>
                <i-input v-model="formValidate.englishFullScore" placeholder="分数"
                         style="width:95%"></i-input>
              </td>
              <td>
                <i-input v-model="formValidate.physicsFullScore" placeholder="分数"
                         style="width:95%"></i-input>
              </td>
              <td>
                <i-input v-model="formValidate.chemistryFullScore" placeholder="分数"
                         style="width:95%"></i-input>
              </td>
              <td>
                <i-input v-model="formValidate.biologyFullScore" placeholder="分数"
                         style="width:95%"></i-input>
              </td>
              <td>
                <i-input v-model="formValidate.politicsFullScore" placeholder="分数"
                         style="width:95%"></i-input>
              </td>
              <td>
                <i-input v-model="formValidate.historyFullScore" placeholder="分数"
                         style="width:95%"></i-input>
              </td>
              <td>
                <i-input v-model="formValidate.mathematicsFullScore" placeholder="分数"
                         style="width:95%"></i-input>
              </td>
            </tr>
            <tr>
              <td>分数</td>
              <td>
                <i-input v-model="formValidate.languageScore" placeholder="分数" style="width:95%"></i-input>
              </td>
              <td>
                <i-input v-model="formValidate.mathematicsScore" placeholder="分数"
                         style="width:95%"></i-input>
              </td>
              <td>
                <i-input v-model="formValidate.englishScore" placeholder="分数" style="width:95%"></i-input>
              </td>
              <td>
                <i-input v-model="formValidate.physicsScore" placeholder="分数" style="width:95%"></i-input>
              </td>
              <td>
                <i-input v-model="formValidate.chemistryScore" placeholder="分数" style="width:95%"></i-input>
              </td>
              <td>
                <i-input v-model="formValidate.biologyScore" placeholder="分数" style="width:95%"></i-input>
              </td>
              <td>
                <i-input v-model="formValidate.politicsScore" placeholder="分数" style="width:95%"></i-input>
              </td>
              <td>
                <i-input v-model="formValidate.historyScore" placeholder="分数" style="width:95%"></i-input>
              </td>
              <td>
                <i-input v-model="formValidate.otherScore" placeholder="分数" style="width:95%"></i-input>
              </td>
            </tr>
            <tr>
              <td>教材版本</td>
              <td>
                <i-select v-model="formValidate.languageVersion" placeholder="版本" style="width:95%">
                  <i-option v-for="(item,index) in bookVersionList" :key='index' :value="item.version">{{ item.version
                    }}
                  </i-option>
                </i-select>
              </td>
              <td>
                <i-select v-model="formValidate.mathematicsVersion" placeholder="版本" style="width:95%">
                  <i-option v-for="(item,index) in bookVersionList" :key='index' :value="item.version">{{ item.version
                    }}
                  </i-option>
                </i-select>
              </td>
              <td>
                <i-select v-model="formValidate.englishVersion" placeholder="版本" style="width:95%">
                  <i-option v-for="(item,index) in bookVersionList" :key='index' :value="item.version">{{ item.version
                    }}
                  </i-option>
                </i-select>
              </td>
              <td>
                <i-select v-model="formValidate.physicsVersion" placeholder="版本" style="width:95%">
                  <i-option v-for="(item,index) in bookVersionList" :key='index' :value="item.version">{{ item.version
                    }}
                  </i-option>
                </i-select>
              </td>
              <td>
                <i-select v-model="formValidate.chemistryVersion" placeholder="版本" style="width:95%">
                  <i-option v-for="(item,index) in bookVersionList" :key='index' :value="item.version">{{ item.version
                    }}
                  </i-option>
                </i-select>
              </td>
              <td>
                <i-select v-model="formValidate.biologyVersion" placeholder="版本" style="width:95%">
                  <i-option v-for="(item,index) in bookVersionList" :key='index' :value="item.version">{{ item.version
                    }}
                  </i-option>
                </i-select>
              </td>
              <td>
                <i-select v-model="formValidate.politicsVersion" placeholder="版本" style="width:95%">
                  <i-option v-for="(item,index) in bookVersionList" :key='index' :value="item.version">{{ item.version
                    }}
                  </i-option>
                </i-select>
              </td>
              <td>
                <i-select v-model="formValidate.historyVersion" placeholder="版本" style="width:95%">
                  <i-option v-for="(item,index) in bookVersionList" :key='index' :value="item.version">{{ item.version
                    }}
                  </i-option>
                </i-select>
              </td>
              <td>
                <!--<i-select v-model="formValidate.otherVersion" placeholder="版本" style="width:95%">-->
                <!--<i-option v-for="item in scrollList" :value="item.version">{{ item.version }}</i-option>-->
                <!--</i-select>-->
              </td>
            </tr>
          </table>
          <div class="split-div">
            <div class="title">移交正式生备注</div>
          </div>
          <Form-item prop="remark" label="客户端是否正常流畅">
            <i-input type="textarea" v-model="formValidate.clientReamrk" placeholder="客户端是否正常流畅"
                     :rows="4" :maxlength="500"
                     style="width:200px"></i-input>
          </Form-item>
          <Form-item prop="remark" label="是否为学员定制课程规划">
            <i-input type="textarea" v-model="formValidate.coursePlanRemark" placeholder="是否为学员定制课程规划"
                     :rows="4" :maxlength="500"
                     style="width:200px"></i-input>
          </Form-item>
          <Form-item label="首课要上的科目" prop="subject">
            <i-select v-model="formValidate.firstCourseSubject" placeholder="首科要上的科目"
                      style="width:200px">
              <i-option v-for="(item,index) in subjectList" :key='index' :value="item.value">{{ item.value }}</i-option>
            </i-select>
          </Form-item>
          <Form-item label="首课时间" prop="subject">
            <Date-picker type="daterange" v-model='dataTime' size="small" @on-change="changeFirstDate"
                         placeholder="首课时间"
                         placement="bottom-end"
                         style="width: 200px"></Date-picker>
          </Form-item>
          <Form-item label="是否有扩科需求">
            <Radio-group v-model="formValidate.isAddSubject" placeholder="是否有扩科需求" style="width:200px">
              <Radio label="0">否</Radio>
              <Radio label="1">是</Radio>
            </Radio-group>
          </Form-item>
          <Form-item label="扩科科目" prop="subject">
            <i-select v-model="formValidate.addSubject" placeholder="扩科科目"
                      style="width:200px">
              <i-option v-for="(item,index) in subjectList" :key='index' :value="item.value">{{ item.value }}</i-option>
            </i-select>
          </Form-item>
          <Form-item prop="remark" label="以往补习经历">
            <i-input type="textarea" placeholder="以往补习经历" v-model="formValidate.beforeStudy" :rows="4"
                     :maxlength="500"
                     style="width:200px"></i-input>
          </Form-item>
          <Form-item prop="remark" label="具体学习情况及学习主动性">
            <i-input type="textarea" placeholder="具体学习情况及学习主动性" v-model="formValidate.studyInfo"
                     :rows="4" :maxlength="500"
                     style="width:200px"></i-input>
          </Form-item>
          <Form-item prop="remark" label="学生性格特点及相关家庭情况：">
            <i-input type="textarea" placeholder="学生性格特点及相关家庭情况"
                     v-model="formValidate.leadsCharacterFamily" :rows="4"
                     :maxlength="500"
                     style="width:400px"></i-input>
          </Form-item>
          <Form-item prop="remark" label="家长关注点以及对老师的要求：">
            <i-input type="textarea" placeholder="家长关注点以及对老师的要求" v-model="formValidate.familyFocus"
                     :rows="4" :maxlength="500"
                     style="width:400px"></i-input>
          </Form-item>
          <Form-item prop="remark" label="允许排课时间以及上课频率（作息）：">
            <i-input type="textarea" placeholder="允许排课时间以及上课频率（作息）" v-model="formValidate.courseInfo"
                     :rows="4" :maxlength="500"
                     style="width:400px"></i-input>
          </Form-item>
          <Form-item prop="remark" label="其它（特殊情况报备）：">
            <i-input type="textarea" placeholder="其它（特殊情况报备）" v-model="formValidate.otherInfo" :rows="4"
                     :maxlength="500"
                     style="width:400px"></i-input>
          </Form-item>
        </div>
        <!--<input type="file" id="ccAddFileInput" @change="onAddChangeFileOk" style="display: none;"/>-->
      </i-form>
      <div slot="footer" class="text-right">
        <i-button type="text" @click="onCancel('formValidate')">取消</i-button>
        <i-button type="primary" @click="onOk('formValidate')" :disabled="!isFinished">提交</i-button>
      </div>
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
      var validatepdPayType = (rule, value, callback) => {
        if (value === '') {
          callback (new Error ('不能为空'));
        }
        callback ();
      }
      var validatepdAcountMoney = (rule, value, callback) => {
        if (value === '') {
          callback (new Error ('不能为空'));
        }
        callback ();
      }
      return {
        qrcodeUrl: '',
        resUuid: "",
        flagByNum: "",
        isShowPayPic: true,   //付费截图模块显示
        isShowQrcode: true,   //二维码模块显示
        isShowActualMoney: false,
        isRevise: false,
        isOrderSaved: false,  //保存订单之后锁定表单
        isFinished: false,
        isSaved: true,
        isSaveBtnShow: true,    //保存订单按钮显示
        actualMoney: '',
        couponList: [],
        prizeContent: '',
        prizeId: '',
        prizeActivityList: [],
        payMoneys: '',
        token: localStorage.get ('token'),
        defaultList: [],//图片上传
        imgUrl: '',//图片路径
        visible: false,//图片查看
        // upUrl: SCS ().WaitPay.uploadPayPicture,
        upUrl2: SCS ().WaitPay.uploadPayPicture2,
        hasCourseTimes: false,
        loading: false,
        title0: false,
        title1: false,
        title2: false,
        role: localStorage.get ('user').alias,
        payRequestModal: false,
        isViewBank: false,
        isLoan: false,
        showPayType: false,
        courseOrderUuid: '',
        payOrderUuid: '',
        leadsUuid: '',
        flag: '',
        dataTime: [],
        subjectList: [],//科目
        gradeList: [],
        provinceList: [],//省
        cityArrays: [],//市
        areaList: [],//区
        scrollList: [],//学校
        bookVersionList: [],//教材版本
        formValidate: {
          isPayALLMoney: '',
          coupon: '',
          prizeActivity: 0,
          coursePriceType: '小学',
          coursePriceActivityType: '1',
          buyLength: 40,
          limitHours: 0,
          level: '0',
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
          //                    成绩
          biologyFullScore: '',
          biologyScore: '',
          biologyVersion: '',
          chemistryFullScore: '',
          chemistryScore: '',
          chemistryVersion: '',
          englishFullScore: '',
          englishScore: '',
          englishVersion: '',
          historyFullScore: '',
          historyScore: '',
          historyVersion: '',
          languageFullScore: '',
          languageScore: '',
          languageVersion: '',
          mathematicsFullScore: '',
          mathematicsScore: '',
          mathematicsVersion: '',
          otherFullScore: '',
          otherScore: '',
          otherVersion: '',
          physicsFullScore: '',
          physicsScore: '',
          physicsVersion: '',
          politicsFullScore: '',
          politicsScore: '',
          politicsVersion: '',
//                    备注
          addSubject: '',
          beforeStudy: '',
          clientReamrk: '',
          courseInfo: '',
          coursePlanRemark: '',
          familyFocus: '',
          firstCourseEndTime: '',
          firstCourseStartTime: '',
          firstCourseSubject: '',
          isAddSubject: '',
          leadsCharacterFamily: '',
          otherInfo: '',
          studyInfo: '',
//                    基本情况
          city: '',
          cityId: '',
          count: '',
          countId: '',
          grade: '',
          name: '',
          phone: '',
          province: '',
          provinceId: '',
          school: '',
          sex: '',
          subject: '',
          isScience: '',
          // 添加选择课程时间
          courseTimes: 45,
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
              afterCreateQrcodeMoney: false,
              afterCreateQrcodeType: false,
            },
          ],
          // fileList:[],//图片上传
        },
        index: 1,
        keys: 0,
        formData: [],
        uploadLoading: false,
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
          // },
          // {
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
          coursePriceActivityType: [
            {required: true, message: '请选择课时类别', trigger: 'change'}
          ],
          // isPayALLMoney: [
          //   {required: true, message: '请选择是否全款', trigger: 'change'}
          // ],
          // prizeActivity: [
          //   {required: true, message: '请选择优惠', trigger: 'change'}
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
        },
        indexPayDetail: 1
      }
    },
    mounted () {
      const _this = this;
      // 获取购买课时包
      this.$axios.get (COMMON_API ().getAvailableCoursePackage, {}).then (({data}) => {
        _this.coursePriceTypeList = data.data.coursePriceList;
      })
      //获取省
      this.$axios.get (COMMON_API ().ssqAreaAllStudy, {
        params: {
          parentid: 1,
        },
      }).then (({data}) => {
        this.provinceList = data.data || [];
      })
      $.getJSON ("static/data.json", function (json) {
        // _this.coursePriceTypeList = json.coursePriceTypeList;//课时包
        _this.gradeList = json.gradeList;
        _this.subjectList = json.subjectList;
      });
      // 获取折扣券
      this.getCouponList ();
    },
    methods: {
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
      shouldShow (val) {
        return eval (val)
      },
      handleView (url) {
        this.imgUrl = url;
        this.visible = true;
        console.log (this.defaultList);
      },
      handleView2 (url) {
        this.imgUrl = url;
        this.visible = true;
        console.log (this.defaultList);
      },
      handleBeforeUpload () {
        //
      },
      handleBeforeUpload2 () {
        // if(flag){
        //   return false
        // }
        this.uploadLoading = true;
        const check = this.formValidate.payDetailList[this.keys].fileList.length < 1;
        if (!check) {
          this.$Notice.warning ({
            title: '最多只能上传 1 张图片。'
          });
        }
        return check;
      },
      handleMaxSize (file) {
        this.$Notice.warning ({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 20M。'
        });
      },
      handleRemove (file) {
        // 从 upload 实例删除数据
        const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice (fileList.indexOf (file), 1);
        this.defaultList = this.$refs.upload.fileList;
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
      handleSuccess (res, file, fileList) {
        // 因为上传过程为实例，这里模拟添加 url
        file.imgUrl = res.data.url;
        file.name = res.data.key;
        this.defaultList = fileList;
      },
      handleSuccess2 (res, file, fileList) {
        let _this = this;
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
        console.log (fileList);
      },
      handleFormatError (file) {
        this.$Notice.warning ({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
        });
      },
//      onAddChangeFileOk(event){
//        const _this = this;
//        let addFileInput = document.getElementById('ccAddFileInput');
//        let addFileVal = addFileInput.value;
//        if (!checkImageExt(addFileVal)) {
//        } else {
//          let files = addFileInput.files[0];
//          uploadAjax({
//            url: SCS().WaitPay.uploadPayPicture,
//            data: {1351
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
//        console.log(this.formValidate.buyLength);
//        console.log(this.formValidate.coursePriceType);
        if (this.formValidate.buyLength >= 80) {
          this.showPayType = true
        } else {
          this.showPayType = false
        }
      },
      // 课时类别
      changeClassType () {
        this.formValidate.coupon = ''
        this.formValidate.limitHours = 0;
        this.couponList = []
        this.getCouponList ();
      },
      // 是否全款
      changePayAllMoney () {
        this.formValidate.coupon = ''
        this.couponList = []
        this.getCouponList ();
      },
      // handleReset (name) {
      //   this.$refs[name].resetFields();
      // },
      show (courseOrderUuid, payOrderUuid, leadsUuid, studentPhone, flag, flag2) {
        console.log (2);
        console.log (flag);
        let _this = this
        this.payRequestModal = true
        this.studentPhone = studentPhone;
        this.flagByNum = flag2
        this.isFinished = false;
        this.isOrderSaved = false;
        this.isRevise = false
        this.isSaveBtnShow = true
        this.isShowActualMoney = false
        this.formValidate.payDetailList = []
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
          afterCreateQrcodeMoney: false,
          afterCreateQrcodeType: false,
        })
        this.formValidate.coupon = '',
          this.formValidate.isPayALLMoney = ''
        this.handleReset ('formValidate');
        this.changeSelect = false;
        this.defaultList = [];
        this.formValidate.buyLength = 40;
        this.formValidate.limitHours = 0;
        this.showPayType = false;
//        this.$refs['formValidate'].resetFields()
//        clearSearchForm(this.formValidate, [this.$refs.formValidate], this);
        this.courseOrderUuid = courseOrderUuid;
        this.payOrderUuid = payOrderUuid;
        this.leadsUuid = leadsUuid;
        this.flag = flag;
        if (flag == 'greenChannelByCc') {
          this.hiInit (leadsUuid);//页面初始化
          this.title0 = true;
          this.title1 = false;
          this.title2 = false
          this.isSaved = false
          this.isRevise = false
          this.isSaveBtnShow = true
        }
        if (flag == 'greenChannelByCr') {
          this.hiInit (leadsUuid);//页面初始化
          this.title0 = true;
          this.title1 = false;
          this.title2 = false
          this.isSaved = false
          this.isRevise = false
          this.isSaveBtnShow = true
        }
        // 待付费页面 提交申请和重新提交
        if (flag == 'requestByCC') {
          console.log ('requestByCC');
          if (flag2 == 'firSend') {
            // 提交付费申请
            this.hiInit (leadsUuid);//页面初始化
            this.title1 = true;
            this.title2 = false
            this.title0 = false
            this.isSaved = false
            this.isRevise = false
            this.isSaveBtnShow = true
          } else if (flag2 == 'secSend') {
            // 重新提交付费申请
            this.hiInit (leadsUuid);//页面初始化
            this.title2 = true;
            this.title0 = false;
            this.title1 = false;
            this.isSaved = false
            // 获取支付订单内容
            console.log (payOrderUuid);
            if (payOrderUuid) {
              this.$axios.post (ORDER ().CreateOrder.getPayRequestInfoByUuid, {
                uuid: payOrderUuid,
              }).then (({data}) => {
                this.formValidate.buyLength = Number (data.data.buyLength) || ''
                this.formValidate.limitHours = Number (data.data.limitHours) || ''
                this.formValidate.coursePriceActivityType = data.data.coursePriceActivityType || ''
                this.formValidate.coursePriceType = data.data.coursePriceType || ''
                this.formValidate.giveLength = data.data.giveLength || ''
                this.formValidate.inActivities = data.data.inActivities || ''
                this.formValidate.payDate = data.data.payTime || ''
                this.formValidate.payType = data.data.payType || ''
                this.formValidate.level = '0';
                this.actualMoney = Number (data.data.money);
                this.isRevise = true;
                this.isSaved = true
                this.isSaveBtnShow = false
                this.isFinished = true;
                this.isShowActualMoney = true
                this.formValidate.payDetailList = data.data.paymentDetailList
                this.resUuid = data.data.uuid    //获取payOrderUuid
                this.formValidate.payDetailList.forEach (function (item, index) {
                  item.isShowPayPic = true
                  item.isShowQrcode = false
                  item.qrcodeDisabled = false
                  item.isShowQrcodeBtn = true
                  item.afterCreateQrcodeMoney = false
                  item.afterCreateQrcodeType = true
                  item.isShowPayPic = true
                  if (item.pdPayType == 'huixuexi_qr' || item.pdPayType == 'wx_pub_qr' || item.pdPayType == 'alipay_qr' || item.isPay == '1') {
                    _this.formValidate.payDetailList[index].afterCreateQrcodeMoney = true
                    // _this.formValidate.payDetailList[index].afterCreateQrcodeType = true
                    // _this.formValidate.payDetailList[index].isShowQrcodeBtn = false
                    _this.formValidate.payDetailList[index].isShowQrcode = false
                    _this.formValidate.payDetailList[index].ossKey = ''
                    _this.$set (_this.formValidate.payDetailList, index, _this.formValidate.payDetailList[index])
                  }
                  if (item.fileAddress) {
                    item.fileList = [{
                      'name': item.ossKey,
                      'imgUrl': item.fileAddress,
                      'showProgress': false,
                      'status': "finished",
                      'percentage': 100
                    }]
                  } else {
                    item.fileList = []
                  }
                  _this.$set (_this.formValidate.payDetailList, index, _this.formValidate.payDetailList[index])
                })
                console.log (_this.formValidate.payDetailList);
              })
            }
          }
        }
        // 获取优惠活动
        // this.$axios.post(ORDER().CreateOrder.getLeadsBonusListByLeadsUuid,{
        //   leadsUuid: leadsUuid,
        // }).then( (res) => {
        //   this.prizeActivityList = res.data.data
        //   console.log(res);
        //   this.payRequestModal = true;
        //   // this.prizeContent = res.data.prizeContent;
        //   this.prizeId = res.data.data.prizeId;
        // })
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
      hiInit (leadsUuid) {
        const _this = this;
        // clearSearchForm(this.formValidate, [this.$refs.formValidate], this);
        this.formValidate.coupon = '',
          this.formValidate.isPayALLMoney = '',
          this.formValidate.coursePriceType = '小学';
        this.formValidate.coursePriceActivityType = '1';
        this.formValidate.buyLength = 40;
        this.formValidate.limitHours = 0;
        this.formValidate.level = '0';
        this.$axios.get (COMMON_API ().allBank, {}).then (({data}) => {
          this.bankList = data.data;
        })
        this.$axios.get (SCS ().MyStudent.getHandOutRemark, {
          params: {
            leadsUuid: leadsUuid
          },
        }).then (({data}) => {
          let datas = data.data
          if (datas.leadsGrades && datas.handoutRemarks && datas.leads) {
            //                    成绩
            _this.formValidate.biologyFullScore = datas.leadsGrades.biologyFullScore || '';
            _this.formValidate.biologyScore = datas.leadsGrades.biologyScore || '';
            _this.formValidate.biologyVersion = datas.leadsGrades.biologyVersion || '';
            _this.formValidate.chemistryFullScore = datas.leadsGrades.chemistryFullScore || '';
            _this.formValidate.chemistryScore = datas.leadsGrades.chemistryScore || '';
            _this.formValidate.chemistryVersion = datas.leadsGrades.chemistryVersion || '';
            _this.formValidate.englishFullScore = datas.leadsGrades.englishFullScore || '';
            _this.formValidate.englishScore = datas.leadsGrades.englishScore || '';
            _this.formValidate.englishVersion = datas.leadsGrades.englishVersion || '';
            _this.formValidate.historyFullScore = datas.leadsGrades.historyFullScore || '';
            _this.formValidate.historyScore = datas.leadsGrades.historyScore || '';
            _this.formValidate.historyVersion = datas.leadsGrades.historyVersion || '';
            _this.formValidate.languageFullScore = datas.leadsGrades.languageFullScore || '';
            _this.formValidate.languageScore = datas.leadsGrades.languageScore || '';
            _this.formValidate.languageVersion = datas.leadsGrades.languageVersion || '';
            _this.formValidate.mathematicsFullScore = datas.leadsGrades.mathematicsFullScore || '';
            _this.formValidate.mathematicsScore = datas.leadsGrades.mathematicsScore || '';
            _this.formValidate.mathematicsVersion = datas.leadsGrades.mathematicsVersion || '';
            _this.formValidate.otherFullScore = datas.leadsGrades.otherFullScore || '';
            _this.formValidate.otherScore = datas.leadsGrades.otherScore || '';
            _this.formValidate.otherVersion = datas.leadsGrades.otherVersion || '';
            _this.formValidate.physicsFullScore = datas.leadsGrades.physicsFullScore || '';
            _this.formValidate.physicsScore = datas.leadsGrades.physicsScore || '';
            _this.formValidate.physicsVersion = datas.leadsGrades.physicsVersion || '';
            _this.formValidate.politicsFullScore = datas.leadsGrades.politicsFullScore || '';
            _this.formValidate.politicsScore = datas.leadsGrades.politicsScore || '';
            _this.formValidate.politicsVersion = datas.leadsGrades.politicsVersion || '';
//                    备注
            _this.formValidate.addSubject = datas.handoutRemarks.addSubject || '';
            _this.formValidate.beforeStudy = datas.handoutRemarks.beforeStudy || '';
            _this.formValidate.clientReamrk = datas.handoutRemarks.clientReamrk || '';
            _this.formValidate.courseInfo = datas.handoutRemarks.courseInfo || '';
            _this.formValidate.coursePlanRemark = datas.handoutRemarks.coursePlanRemark || '';
            _this.formValidate.familyFocus = datas.handoutRemarks.familyFocus || '';
            _this.formValidate.firstCourseEndTime = datas.handoutRemarks.firstCourseEndTime || '';
            _this.formValidate.firstCourseStartTime = datas.handoutRemarks.firstCourseStartTime || '';
            _this.formValidate.firstCourseSubject = datas.handoutRemarks.firstCourseSubject || '';
            _this.formValidate.isAddSubject = datas.handoutRemarks.isAddSubject || '';
            _this.formValidate.leadsCharacterFamily = datas.handoutRemarks.leadsCharacterFamily || '';
            _this.formValidate.otherInfo = datas.handoutRemarks.otherInfo || '';
            _this.formValidate.studyInfo = datas.handoutRemarks.studyInfo || '';
//                    基本情况
            _this.formValidate.city = datas.leads.city || '';
            _this.formValidate.cityId = datas.leads.cityId || '';
            _this.formValidate.count = datas.leads.count || '';
            _this.formValidate.countId = datas.leads.countId || '';
            _this.formValidate.grade = datas.leads.grade || '';
            _this.formValidate.courseTimes = datas.leads.courseLength || '';
            _this.formValidate.name = datas.leads.name || '';
            _this.formValidate.phone = datas.leads.phone || '';
            _this.formValidate.province = datas.leads.province || '';
            _this.formValidate.provinceId = datas.leads.provinceId || '';
            _this.formValidate.school = datas.leads.school || '';
            _this.formValidate.sex = datas.leads.sex == null ? '' : datas.leads.sex + '';
            _this.formValidate.subject = datas.leads.subject || '';
            _this.formValidate.isScience = datas.leads.isScience == null ? '' : datas.leads.isScience + '';
            _this.dataTime = [
              data.data.handoutRemarks.firstCourseStartTime,
              data.data.handoutRemarks.firstCourseEndTime,
            ];
          }

          function a () {
            return new Promise (function (res, rej) {
              //获取城市
              if (!datas.leads.provinceId) {
                res (1)
              } else {
                // common.ajax({
                //   url: COMMON_API().ssqAreaAllStudy,
                //   method: 'get',
                //   data: {parentid: data.leads.provinceId},
                //   success: function (response) {
                //     _this.cityArrays = response.data;
                //     _this.areaList = [];
                //     _this.scrollList = [];
                //     res(1)
                //   }
                // });
                this.$axios.get (COMMON_API ().ssqAreaAllStudy, {
                  params: {
                    parentid: datas.leads.provinceId
                  }
                }).then (({data}) => {
                  _this.cityArrays = data.data;
                  _this.areaList = [];
                  _this.scrollList = [];
                  res (1)
                })
              }
            })
          };

          function b () {
            return new Promise (function (res, rej) {
              if (!datas.leads.cityId) {
                res (1)
              } else {
                //获取城市
                // common.ajax({
                //   url: COMMON_API().ssqAreaAllStudy,
                //   method: 'get',
                //   data: {parentid: data.leads.cityId},
                //   success: function (response) {
                //     _this.areaList = response.data ||[];
                //     _this.scrollList = [];
                //     res(1)
                //   }
                // });
                this.$axios.get (COMMON_API ().ssqAreaAllStudy, {
                  params: {
                    parentid: datas.leads.cityId
                  }
                }).then (({data}) => {
                  _this.areaList = data.data || [];
                  _this.scrollList = [];
                  res (1)
                })
              }
            })
          };

          function c () {
            return new Promise (function (res, rej) {
              if (!datas.leads.provinceId && !datas.leads.cityId && !datas.leads.countyId) {
                res (1)
              } else {
                this.$axios.get (COMMON_API ().allStudySchool, {
                  params: {
                    provinceId: datas.leads.provinceId,
                    cityId: datas.leads.cityId,
                    countyId: datas.leads.countId,
                  }
                }).then (({data}) => {
                  _this.scrollList = data.data;
                  res (1)
                })
              }
            })
          };
          let arr = ['小三', '小四', '小五', '小六', '预初'];
          if (arr.indexOf (_this.formValidate.grade) != -1) {
            _this.hasCourseTimes = true;
          } else {
            _this.hasCourseTimes = false;
          }
          _this.payRequestModal = true;
        })
      },
//      获取版本
      getVersion (value) {
        const _this = this
        // if(value){
        this.$axios.get (COMMON_API ().allBookVersion, {
          params: {
            grade: value || '',
          },
        }).then (({data}) => {
          _this.bookVersionList = data.data || [];
          let arr = ['小三', '小四', '小五', '小六', '预初']
          if (arr.indexOf (_this.formValidate.grade) != -1) {
            _this.hasCourseTimes = true;
          } else {
            _this.hasCourseTimes = false;
          }
        })
        // }
      },
//      省市区学校start
      changeSelectedCity (areaName) {
        if (areaName.value != '') {
          const _this = this;
          _this.formValidate.province = areaName.label;
          this.$axios.get (COMMON_API ().ssqAreaAllStudy, {
            params: {
              parentid: areaName.value,
            },
          }).then (({data}) => {
            this.cityArrays = data.data;
          })
        }
      },
      changeSelectedArea (areaName) {
        if (areaName.value != '') {
          const _this = this;
          //获取城市的区域
          if (areaName.label) {
            _this.formValidate.city = areaName.label;
          }
          this.$axios.get (COMMON_API ().ssqAreaAllStudy, {
            params: {
              parentid: areaName.value,
            },
          }).then (({data}) => {
            this.areaList = data.data || [];
          })
        }
      },
      changeSelectedCount (areaName) {
        if (areaName.value != '') {
          const _this = this;
          if (areaName.label) {
            _this.formValidate.count = areaName.label;
          }
          this.$axios.get (COMMON_API ().allStudySchool, {
            params: {
              provinceId: this.formValidate.provinceId,
              cityId: this.formValidate.cityId,
              countyId: areaName.value
            },
          }).then (({data}) => {
            this.scrollList = data.data || [];
          })
        }
      },
//      省市区学校End
      onOk () {
        const _this = this;
        let amount = 0;
        let flag = 0
        let num = 0
        this.formValidate.payDetailList.forEach (function (item, index) {
          amount = amount + item.pdAcountMoney * 10000;
        })
        amount = amount / 10000
        if (_this.flagByNum == 'firSend') {
          console.log (amount);
          console.log (this.payMoney);
          if (amount > this.payMoney) {
            this.$Notice.warning ({
              title: '',
              // desc: '付费详情部分所填写金额不正确，与支付总金额不符'
              desc: '付费详情部分所填写金额大于支付总金额，请重新输入'
            });
          }
          else {
            let api = SCS ().WaitPay.payRequest;
            // if (this.flag == 'greenChannelByCc') {
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

                function a () {
                  console.log ('a()');
                  return new Promise (function (res, rej) {
                    _this.$axios.post (api, {
                      courseOrderUuid: _this.courseOrderUuid,
                      // payOrderUuid: _this.payOrderUuid || '',
                      uuid: _this.payOrderUuid || '',
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
                      res (1);
                      console.log (a);
                    })
                  })
                }

//            //移交表
                function b () {
                  console.log ('b()');
                  return new Promise (function (res, rej) {
                    _this.$axios.post (SCS ().MyStudent.addHandOutRemark, {
                      //成绩
                      biologyFullScore: _this.formValidate.biologyFullScore,
                      biologyScore: _this.formValidate.biologyScore,
                      biologyVersion: _this.formValidate.biologyVersion,
                      chemistryFullScore: _this.formValidate.chemistryFullScore,
                      chemistryScore: _this.formValidate.chemistryScore,
                      chemistryVersion: _this.formValidate.chemistryVersion,
                      englishFullScore: _this.formValidate.englishFullScore,
                      englishScore: _this.formValidate.englishScore,
                      englishVersion: _this.formValidate.englishVersion,
                      historyFullScore: _this.formValidate.historyFullScore,
                      historyScore: _this.formValidate.historyScore,
                      historyVersion: _this.formValidate.historyVersion,
                      languageFullScore: _this.formValidate.languageFullScore,
                      languageScore: _this.formValidate.languageScore,
                      languageVersion: _this.formValidate.languageVersion,
                      leadsUuid: _this.formValidateUuid,
                      mathematicsFullScore: _this.formValidate.mathematicsFullScore,
                      mathematicsScore: _this.formValidate.mathematicsScore,
                      mathematicsVersion: _this.formValidate.mathematicsVersion,
                      otherFullScore: _this.formValidate.otherFullScore,
                      otherScore: _this.formValidate.otherScore,
                      otherVersion: _this.formValidate.otherVersion,
                      physicsFullScore: _this.formValidate.physicsFullScore,
                      physicsScore: _this.formValidate.physicsScore,
                      physicsVersion: _this.formValidate.physicsVersion,
                      politicsFullScore: _this.formValidate.politicsFullScore,
                      politicsScore: _this.formValidate.politicsScore,
                      politicsVersion: _this.formValidate.politicsVersion,
                      //备注
                      addSubject: _this.formValidate.addSubject,
                      beforeStudy: _this.formValidate.beforeStudy,
                      clientReamrk: _this.formValidate.clientReamrk,
                      courseInfo: _this.formValidate.courseInfo,
                      coursePlanRemark: _this.formValidate.coursePlanRemark,
                      familyFocus: _this.formValidate.familyFocus,
                      firstCourseEndTime: _this.formValidate.firstCourseEndTime,
                      firstCourseStartTime: _this.formValidate.firstCourseStartTime,
                      firstCourseSubject: _this.formValidate.firstCourseSubject,
                      isAddSubject: _this.formValidate.isAddSubject,
                      leadsCharacterFamily: _this.formValidate.leadsCharacterFamily,
                      otherInfo: _this.formValidate.otherInfo,
                      studyInfo: _this.formValidate.studyInfo,
                      //基本情况
                      city: _this.formValidate.city,
                      cityId: _this.formValidate.cityId,
                      count: _this.formValidate.count,
                      countId: _this.formValidate.countId,
                      grade: _this.formValidate.grade,
                      courseLength: _this.formValidate.courseTimes,
                      name: _this.formValidate.name,
                      phone: _this.formValidate.phone,
                      province: _this.formValidate.province,
                      provinceId: _this.formValidate.provinceId,
                      school: _this.formValidate.school,
                      sex: _this.formValidate.sex,
                      subject: _this.formValidate.subject,
                      isScience: _this.formValidate.isScience,
                      uuid: _this.leadsUuid,
                      prizeId: _this.formValidate.prizeActivity,
                      discountTypeId: _this.formValidate.coupon,
                    }).then (() => {
                      res (2);
                      console.log (b);
                    })
                  })
                }

                if (_this.role == 'cc') {
                  b ().then (function (data) {
                    console.log (data);
                    if (data == 2) {
                      a ().then (function (data) {
                        if (data == 1) {
                          _this.payRequestModal = false;
                          common.notices ('操作成功！！');
                          _this.$emit ('reFresh', 'success');
                          _this.showPayType = false;
                        }
                      })
                    }
                  })
                } else {
                  a ().then (function (data) {
                    if (data == 1) {
                      _this.payRequestModal = false;
                      common.notices ('操作成功！！');
                      _this.$emit ('reFresh', 'success');
                    }
                  })
                }
              } else {
                setTimeout (() => {
                  // this.loading = true;
                }, 0);
              }
            });
          }
        }
        else if (_this.flagByNum == 'secSend') {
          console.log (amount);
          console.log (_this.actualMoney);
          if (amount > _this.actualMoney) {
            _this.$Notice.warning ({
              title: '',
              // desc: '付费详情部分所填写金额不正确，与支付总金额不符'
              desc: '付费详情部分所填写金额大于支付总金额，请重新输入'
            });
          }
          else {
            function a () {
              console.log ('a()');
              return new Promise (function (res, rej) {
                _this.$axios.post (api, {
                  courseOrderUuid: _this.courseOrderUuid,
                  // payOrderUuid: _this.payOrderUuid || '',
                  uuid: _this.payOrderUuid || '',
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
                }).then (() => {
                  res (1);
                  console.log (a);
                })
              })
            }

            //移交表
            function b () {
              console.log ('b()');
              return new Promise (function (res, rej) {
                _this.$axios.post (SCS ().MyStudent.addHandOutRemark, {
                  //成绩
                  biologyFullScore: _this.formValidate.biologyFullScore,
                  biologyScore: _this.formValidate.biologyScore,
                  biologyVersion: _this.formValidate.biologyVersion,
                  chemistryFullScore: _this.formValidate.chemistryFullScore,
                  chemistryScore: _this.formValidate.chemistryScore,
                  chemistryVersion: _this.formValidate.chemistryVersion,
                  englishFullScore: _this.formValidate.englishFullScore,
                  englishScore: _this.formValidate.englishScore,
                  englishVersion: _this.formValidate.englishVersion,
                  historyFullScore: _this.formValidate.historyFullScore,
                  historyScore: _this.formValidate.historyScore,
                  historyVersion: _this.formValidate.historyVersion,
                  languageFullScore: _this.formValidate.languageFullScore,
                  languageScore: _this.formValidate.languageScore,
                  languageVersion: _this.formValidate.languageVersion,
                  leadsUuid: _this.formValidateUuid,
                  mathematicsFullScore: _this.formValidate.mathematicsFullScore,
                  mathematicsScore: _this.formValidate.mathematicsScore,
                  mathematicsVersion: _this.formValidate.mathematicsVersion,
                  otherFullScore: _this.formValidate.otherFullScore,
                  otherScore: _this.formValidate.otherScore,
                  otherVersion: _this.formValidate.otherVersion,
                  physicsFullScore: _this.formValidate.physicsFullScore,
                  physicsScore: _this.formValidate.physicsScore,
                  physicsVersion: _this.formValidate.physicsVersion,
                  politicsFullScore: _this.formValidate.politicsFullScore,
                  politicsScore: _this.formValidate.politicsScore,
                  politicsVersion: _this.formValidate.politicsVersion,
                  //备注
                  addSubject: _this.formValidate.addSubject,
                  beforeStudy: _this.formValidate.beforeStudy,
                  clientReamrk: _this.formValidate.clientReamrk,
                  courseInfo: _this.formValidate.courseInfo,
                  coursePlanRemark: _this.formValidate.coursePlanRemark,
                  familyFocus: _this.formValidate.familyFocus,
                  firstCourseEndTime: _this.formValidate.firstCourseEndTime,
                  firstCourseStartTime: _this.formValidate.firstCourseStartTime,
                  firstCourseSubject: _this.formValidate.firstCourseSubject,
                  isAddSubject: _this.formValidate.isAddSubject,
                  leadsCharacterFamily: _this.formValidate.leadsCharacterFamily,
                  otherInfo: _this.formValidate.otherInfo,
                  studyInfo: _this.formValidate.studyInfo,
                  //基本情况
                  city: _this.formValidate.city,
                  cityId: _this.formValidate.cityId,
                  count: _this.formValidate.count,
                  countId: _this.formValidate.countId,
                  grade: _this.formValidate.grade,
                  courseLength: _this.formValidate.courseTimes,
                  name: _this.formValidate.name,
                  phone: _this.formValidate.phone,
                  province: _this.formValidate.province,
                  provinceId: _this.formValidate.provinceId,
                  school: _this.formValidate.school,
                  sex: _this.formValidate.sex,
                  subject: _this.formValidate.subject,
                  isScience: _this.formValidate.isScience,
                  uuid: _this.leadsUuid,
                  prizeId: _this.formValidate.prizeActivity,
                  discountTypeId: _this.formValidate.coupon,
                }).then (() => {
                  res (2);
                  console.log (b);
                })
              })
            }

            let api = SCS ().WaitPay.payRequest;
            // if (this.flag == 'greenChannelByCc') {
            //   api = SCS().MyStudent[this.flag];
            // }
            // this.loading = false;
            let params = ''
            _this.defaultList.forEach (function (v, i) {
              params += v.name + ',';
            });
            // this.$refs.formValidate.validate ((valid) => {
            // if (valid) {
            _this.formValidate.payDetailList.forEach (function (v, i) {
              flag++
              if (!v.pdAcountMoney || !v.pdPayType) {
                _this.$Notice.warning ({
                  title: '',
                  // desc: '付费详情部分所填写金额不正确，与支付总金额不符'
                  desc: '请输入付费方式和付费金额'
                });
                return false
              }
              num = i + 1
            })
            console.log (flag, num);
            if (flag == num) {
              if (_this.role == 'cc') {
                b ().then (function (data) {
                  console.log (data);
                  if (data == 2) {
                    a ().then (function (data) {
                      if (data == 1) {
                        _this.payRequestModal = false;
                        common.notices ('操作成功！！');
                        _this.$emit ('reFresh', 'success');
                        _this.showPayType = false;
                      }
                    })
                  }
                })
              }
              else {
                a ().then (function (data) {
                  if (data == 1) {
                    _this.payRequestModal = false;
                    common.notices ('操作成功！！');
                    _this.$emit ('reFresh', 'success');
                  }
                })
              }
            } else {
              console.log (" 付费方式或付款金额为空");
              return false
            }
            //   } else {
            //     setTimeout (() => {
            //       // this.loading = true;
            //     }, 0);
            //   }
            // });
          }
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
        if (qrcodeDOM) {
          qrcodeDOM.innerHTML = "";
        }
      },
      changePayDate (value) {
        this.formValidate.payDate = value;
      },
      changeFirstDate (value) {
        this.formValidate.firstCourseStartTime = value[0] || '';
        this.formValidate.firstCourseEndTime = value[1] || '';
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
      onCancel (name) {
        let _this = this
        this.payRequestModal = false;
        this.formValidate.payDetailList.length = 0
        console.log (this.formValidate.payDetailList);
      },
      handleReset (name) {
        this.$refs[name].resetFields ();
        this.formValidate.grade = '';
        this.formValidate.prizeActivity = 0;
        this.formValidate.coupon = '';
        this.money = 0;
        this.prizeActivityList = [];
      },
      addPayDetail () {
        this.index++;
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
          afterCreateQrcodeMoney: false,
          afterCreateQrcodeType: false
        })
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
                } else if (res.data.code == '101') {
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
      manipulationData (data) {
        console.log (data);
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
      clickUpload (key, flag) {
        console.log (key, flag);
        this.keys = key
      },
      //保存订单
      saveFormData () {
        this.$refs.formValidate.validate ((valid) => {
          if (valid) {
            this.$axios.post (ORDER ().CreateOrder.createPayRequest, {
              leadsUuid: this.leadsUuid,
              coursePriceType: this.formValidate.coursePriceType,
              buyLength: this.formValidate.buyLength,
              limitHours: this.formValidate.limitHours,
              inActivities: '',
              payType: this.formValidate.payType,
              bank: this.formValidate.bank || this.formValidate.otherBank || '',
              payTime: this.changeDate (this.formValidate.payDate),
              coursePriceActivityType: this.formValidate.coursePriceActivityType | '',
              giveLength: this.formValidate.giveLength,
              discountTypeId: this.formValidate.coupon,
              courseOrderUuid: this.courseOrderUuid,
            }).then ((res) => {
              // this.actualMoney = data.data.money;
              console.log (res);
              if (res.data.code == '100') {
                this.isFinished = true;
                this.isSaved = true;
                // if(this.flagByNum == 'secSend'){
                //
                // }
                this.isRevise = true;
                this.isOrderSaved = true;
                this.resUuid = res.data.data.uuid
                common.notices ('保存成功！！');
              }
            })
          }
        })
      },
      changePayTypes (money, key, value) {
        let _this = this;
        console.log (money, key, value);
        if (value == "wx_pub_qr" || value == 'alipay_qr' || value == 'upacp_qr' || value == 'huixuexi_qr') {
          // this.isShowPayPic = false
          // this.isShowQrcode = true
          this.formValidate.payDetailList[key].qrcodeDisabled = false
          this.formValidate.payDetailList[key].isShowQrcode = true
          this.formValidate.payDetailList[key].isShowPayPic = false
          this.formValidate.payDetailList[key].isShowQrcodeBtn = true//隐藏生成二维码按钮，显示二维码
          this.formValidate.payDetailList[key].ossKey = ''
          this.formValidate.payDetailList[key].ossKey = ''
          this.$set (_this.formValidate.payDetailList, key, _this.formValidate.payDetailList[key])
        }
        else if (value == 'bank' || value == 'kuStaging' || value == 'weixin' || value == 'alipay' || value == 'huixuexi' || value == 'fendan') {
          // this.isShowPayPic = true
          // this.isShowQrcode = false
          this.formValidate.payDetailList[key].qrcodeDisabled = true
          this.formValidate.payDetailList[key].isShowQrcode = false
          this.formValidate.payDetailList[key].isShowPayPic = true
          // this.formValidate.payDetailList[key].isShowQrcodeBtn = true
          this.$set (_this.formValidate.payDetailList, key, _this.formValidate.payDetailList[key])
        }
      },
      changePayAcount (payType, key, money) {
        // if (payType == "wx_pub_qr" || payType == 'alipay_qr' || payType == 'upacp_qr') {
        //   this.isShowPayPic = false
        //   this.isShowQrcode = true
        //   if (money.target.value) {
        //     this.$axios.post (SCS ().MyStudent.createQuickMark, {
        //       studentPhone: this.studentPhone,
        //       channel: payType,
        //       type: this.formValidate.coursePriceType,
        //       payMoney: money.target.value,
        //     }).then (({data}) => {
        //       console.log (data);
        //       this.qrcodeUrl = data.data.url
        //       this.createQrcode (this.buildQrOption (), key);
        //     })
        //   }
        // }
        // else if(payType == 'huixuexi'){
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
        let _this = this
        console.log (payType, payMoney, key);
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
              this.formValidate.payDetailList[key].afterCreateQrcodeMoney = true//  生成二维码之后不能更改信息
              this.formValidate.payDetailList[key].afterCreateQrcodeType = true//  生成二维码之后不能更改信息
              this.formValidate.payDetailList[key].id = data.data.id
              this.$set (_this.formValidate.payDetailList, key, _this.formValidate.payDetailList[key])
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
              this.formValidate.payDetailList[key].afterCreateQrcodeMoney = true//  生成二维码之后不能更改信息
              this.formValidate.payDetailList[key].afterCreateQrcodeType = true//  生成二维码之后不能更改信息
              this.formValidate.payDetailList[key].id = data.data.id
              this.$set (_this.formValidate.payDetailList, key, _this.formValidate.payDetailList[key])
              // this.$set (_this.formValidate.payDetailList[key], 'afterCreateQrcode', _this.formValidate.payDetailList[key]['afterCreateQrcode'])
            })
          }
        } else {
          this.$Notice.warning ({
            title: '请输入付费方式和付款金额。'
          });
        }
      },
      createQrcode (option, key) {
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
        let money = 0;
        let coursePriceType = this.formValidate.coursePriceType;
        if (coursePriceType) {
          let coursePriceActivityType = this.formValidate.coursePriceActivityType;
          let buyLength = this.formValidate.buyLength;
          let promotionCode = this.formValidate.promotionCode;
          let prizeActivity = this.formValidate.prizeActivity;
          let discountTypeId = this.formValidate.coupon;
          this.$axios.get (ORDER ().CreateOrder.getPayMoney, {
            params: {
              coursePriceType: coursePriceType,
              // coursePriceActivityType: coursePriceActivityType,
              buyLength: buyLength,
              promotionCode: promotionCode,
              prizeId: prizeActivity,
              discountTypeId: discountTypeId,
            }
          }).then (({data}) => {
            this.payMoneys = data.data;
          })
          return this.payMoneys;
        }
        return this.payMoneys;
      },
      modalTitle () {
        return (this.flag === 'greenChannel') ? '付费申请' : '绿色通道（未试听学生提交付费申请）';
      }
    }
  };
</script>
<style scoped lang="less">
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
    margin-top: 8px;
    border-bottom: 1px dashed #ccc;
    color: #3C3C3C;
    font-weight: bold;
    padding: 0 0 5px 20px;
    margin-bottom: 15px;
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
