<template>
  <Modal
    v-model="modal"
    title="放弃"
    :closable="false"
    :mask-closable="false"
    :loading = "loading"
    @on-ok="onOk('formValidate')">
    <i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
      <Form-item label="姓名">
        {{tcName}}
      </Form-item>
      <Form-item label="手机号">
        <div v-show="isFullPhone">
          {{phone | convertPhone}} <Icon type="ios-eye" @click="getFullPhone()" class="eye" title="显示全部"></Icon>
        </div>
        <div v-show="!isFullPhone">{{phone}}</div>
      </Form-item>
      <Form-item label="放弃原因" prop="giveUpCause">
        <i-select v-model="formItem.giveUpCause" placeholder="放弃原因" style="width:200px">
          <i-option value="21">培训未通过</i-option>
          <i-option value="22">老师跑单</i-option>
          <i-option value="23">主动放弃</i-option>
          <i-option value="24">二次培训不通过</i-option>
        </i-select>
      </Form-item>
      <Form-item label="备注">
        <i-input type="textarea" v-model="formItem.remark" :rows="4" :maxlength="500" placeholder="不要超过500字"></i-input>
      </Form-item>
    </i-form>
  </Modal>
</template>

<script type="text/ecmascript-6">
  import {ZHAO_TEACHER,TEACHER} from 'common/api/teacher.js';
  import {common,hideCharAtNumber} from 'common/js/common.js';

  export default{
    props: {
      fromType: {
        type: String
      }
    },
    data() {
      return {
        loading: true,
        modal: false,
        isFullPhone: true,
        teacherUuid: '',
        tcName: '',
        phone: '',
        formItem: {
          giveUpCause: '',
          remark: ''
        },
        ruleValidate: {
          giveUpCause: [
            {required: true, message: '请选择内容', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      show(uuid,tcName,phone) {
        this.teacherUuid = uuid;
        this.tcName = tcName;
        this.phone = phone;
        this.modal = true;
        this.isFullPhone = true;
      },
      getFullPhone() {
        const _this = this;
        common.ajax({
          url: TEACHER().Public.fullPhone,
          method: 'get',
          noLoading: 'yes',
          data: { uuid: _this.teacherUuid, moduleName: '招师-待培训' },
          success: function (res) {
            _this.isFullPhone = false;
          }
        });
      },
      onOk(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {

            const _this = this;
            let apiUrl = "";
            if (this.fromType === 'train') {//待培训
              apiUrl = ZHAO_TEACHER().WaitTrain.giveUp;
            } else if (this.fromType === 'secondTrain') { //待二次培训
              apiUrl = ZHAO_TEACHER().WaitSecondTrain.giveUp;
            } else if (this.fromType === 'perfectInfo') { //待完善资料
              apiUrl = ZHAO_TEACHER().WaitSecondTrain.giveUp;
            } else if (this.fromType === 'interview') { //待面试
              apiUrl = ZHAO_TEACHER().WaitInterview.giveUp;
            }else if (this.fromType === 'waitToOffer') { //待邀约
              apiUrl = ZHAO_TEACHER().WaitToOffer.giveUp;
            }
            common.ajax({
              url: apiUrl,
              data: {
                teacherUuid: _this.teacherUuid,
                interviewResult: _this.formItem.giveUpCause,
                remark: _this.formItem.remark
              },
              success: function(response){
                common.notices('操作成功！！');
                _this.$emit('reFresh', 'success');
                _this.modal = false;
              }
            });
          } else {
            setTimeout(() => {
              this.loading = true;
            }, 0);
          }
        });
      }
    },
    filters: {
      convertPhone(phone) {
        return hideCharAtNumber(phone);
      }
    }
  };
</script>

<style>

</style>
