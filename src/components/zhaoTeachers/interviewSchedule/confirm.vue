<template>
  <Modal
    v-model="modal"
    title="修改预约面试"
    :closable="false"
    :mask-closable="false"
    :loading="loading"
    @on-ok="onOk('formValidate')">
    <i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
      <Form-item label="姓名" prop="phone">
        {{name}}
      </Form-item>
      <Form-item label="面试日期" prop="interviewDate">
        <Date-picker type="date" @on-change="changeDate" v-model="formItem.interviewDate"  :options="options3"  placeholder="选择日期" style="width: 200px"></Date-picker>
      </Form-item>
      <Form-item label="面试时间" prop="interviewTime">
        <i-select placeholder="面试时间" v-model="formItem.interviewTime" @on-change="getInterviewUser" style="width:200px">
          <i-option v-for="(item,index) in timeList" :key='index' :value="item.enumValue">{{item.enumName}}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="好视通账号" prop="interviewAccount">
        <i-select placeholder="好视通账号" v-model="formItem.interviewAccount" clearable style="width:200px">
          <i-option v-for="(item,index) in interviewAccountList" :key='index' :value="item">{{item}}</i-option>
        </i-select>
      </Form-item>
    </i-form>
  </Modal>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {ZHAO_TEACHER} from 'common/api/teacher.js';
  import {common} from 'common/js/common.js';

  export default{
    data() {
      return {
        loading: true,
        modal: false,
        teacherUuid: '',
        uuid: '',
        name: '',
        data0: '',
        time0: '',
        timeList: [],
        interviewAccountList: [],
        options3: {
          disabledDate (date) {
            return date && date.valueOf() < Date.now() - 86400000;
          }
        },
        formItem: {
          interviewAccount:'',
          interviewDate:'',
          interviewTime:'',
          id:'',
        },
        ruleValidate: {
          interviewAccount: [
            {required: true, message: '请输入好视通账号', trigger: 'change'}
          ],
          interviewDate: [
            {required: true, message: '请选择日期', trigger: 'change'}
          ],
          interviewTime: [
            {required: true, message: '请选择内容', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      show(uuid,name,interviewAccount,data,time,id) {
        let _this = this;
        common.ajax({
          url: ZHAO_TEACHER().WaitToOffer.getInterviewTime,
          success: function (res) {
            _this.timeList = res.data;
          }
        });
        _this.uuid = uuid;
        _this.name = name;
        _this.formItem.interviewAccount = interviewAccount;
        _this.formItem.interviewDate = data;
        _this.data0 = data;
        _this.time0 = time;
        _this.formItem.interviewTime = time;
        _this.formItem.id = id;
        this.modal = true;
      },
      getInterviewUser(){
        const _this = this;
        common.ajax({
          url: ZHAO_TEACHER().WaitToOffer.getInterviewAccount,
          data: {
            interviewDate:_this.formItem.interviewDate,
            interviewTime:_this.formItem.interviewTime,
          },
          success: function (res) {
            _this.interviewAccountList = res.data;
            _this.interviewAccountList.push(_this.formItem.interviewAccount)
          }
        });
      },
      onOk(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            common.ajax({
              url: ZHAO_TEACHER().interviewSchedule.updateInterviewDateById,
              data: {
                teacherUuid:_this.uuid,
                tcName:_this.name,
                interviewDate:_this.formItem.interviewDate,
                interviewTime:_this.formItem.interviewTime,
                interviewAccount:_this.formItem.interviewAccount,
                id:_this.formItem.id,
              },
              success: function (response) {
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
      changeDate(value) {
        this.formItem.interviewDate = value;
//        common.ajax({
//          url: ZHAO_TEACHER().WaitToOffer.getInterviewAccoutByDate,
//          data: {
//            interviewDate:_this.formItem.interviewDate,
//          },
//          success: function (res) {
//            if(res.data.flag == 'success'){
//              _this.formItem.interviewAccount = res.data.account;
//            }else {
//              common.notices(res.data.msg,'提示','warning');
//            }
//          }
//        });
        this.getInterviewUser();
      },
    }
  };
</script>

<style>

</style>
