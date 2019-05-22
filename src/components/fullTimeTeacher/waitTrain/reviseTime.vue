<template>
  <div>
    <Modal
      v-model="modal"
      title="调整培训时间"
      :closable="false"
      :mask-closable="false"
      :loading="loading"
      @on-ok="onOk('formValidate')">
      <i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
        <span class="text16">原培训安排：</span>
        <p>培训时间：<span>{{oldAccount.trainingDate}}</span></p>
        <p>培训账号：<span>{{oldAccount.account}}</span></p>
        <hr class="split"/>
        <span class="text16">调整培训安排：</span>
        <Form-item label="培训时间" prop="date">
          <Date-picker type="date" @on-change="changeDate" placeholder="选择日期" style="width: 120px"></Date-picker>
        </Form-item>
        <p>请在周二到周五之间选择</p>
        <Form-item label="培训时间" prop="dataTime">
          <i-select v-model="formItem.dataTime" @on-change="changeDateTime" placeholder="请选择培训时间"
                    style="width: 120px">
            <i-option value="10:00">上午</i-option>
            <i-option value="14:00">下午</i-option>
          </i-select>
        </Form-item>

        <Form-item label="培训账号">
          嗨课堂 <span class="c-primary">{{account}}</span>
        </Form-item>
      </i-form>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {ZHAO_TEACHER} from 'common/api/teacher.js';
  import {common} from 'common/js/common.js';

  export default{
    data() {
      return {
        trainingTime: '10:00',
        modal: false,
        loading: true,
        trainingAccountId: '',
        natureOfWorkDesc: '',
        teacherUuid: '',
        account: '',
        oldAccount: {
          trainingDate: '',
          account: '',
          trainingAccount: ''
        },
        formItem: {
          date: '',
          dateTime: ''
        },
        ruleValidate: {
          date: [
            {required: true, message: '请选择日期', trigger: 'change'}
          ],
          dataTime: [
            {required: true, message: '请选择培训时间', trigger: 'change'}
          ],
        }
      }
    },
    methods: {
      show(trainingAccountId, natureOfWorkDesc, account, uuid) {
        this.trainingAccountId = trainingAccountId;
        this.natureOfWorkDesc = natureOfWorkDesc;
        this.account = account;
        this.teacherUuid = uuid;
        this.modal = true;
        this.getOld();
      },
      getOld() {
        const _this = this;
        if (_this.account == "null") {
          console.log(1);
        } else {
          // common.ajax({
          //   url: ZHAO_TEACHER().fullTimeTeacher.getTrainingDateById,
          //   method: 'get',
          //   data: {id: _this.trainingAccountId},
          //   success(res) {
          //     if(res.data){
          //       let data = res.data;
          //       _this.oldAccount.trainingDate = data.trainingDate;
          //       _this.oldAccount.account = data.account;
          //       _this.oldAccount.trainingAccount = data.trainingAccount;
          //     }
          //   }
          // });
          this.$axios.get( ZHAO_TEACHER().fullTimeTeacher.getTrainingDateById,{
            params:{
              id: _this.trainingAccountId
            }
          }).then( ({data}) => {
            if(data.data){
              let datas = data.data;
              _this.oldAccount.trainingDate = datas.trainingDate;
              _this.oldAccount.account = datas.account;
              _this.oldAccount.trainingAccount = datas.trainingAccount;
            }
          })
        }
      },
      onOk(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            let url;
            console.log(_this.account);
            if (!_this.oldAccount.account) {
              url = ZHAO_TEACHER().fullTimeTeacher.addTrainingDateById;
              // common.ajax({
              //   url: url,
              //   data: {
              //     trainingDate: _this.formItem.date,
              //     trainingTime: _this.formItem.dateTime,
              //     trainingAccount: _this.account,
              //     natureOfWork: 1,
              //     teacherUuid: _this.teacherUuid
              //   },
              //   success: function (response) {
              //     common.notices('操作成功！！');
              //     _this.$emit('reFresh', 'success');
              //     _this.modal = false;
              //   }
              // });
              this.$axios.post( url,{
                trainingDate: _this.formItem.date,
                trainingTime: _this.formItem.dateTime,
                trainingAccount: _this.account,
                natureOfWork: 1,
                teacherUuid: _this.teacherUuid
              }).then( () => {
                common.notices('操作成功！！');
                _this.$emit('reFresh', 'success');
                _this.modal = false;
              })
            } else {
              url = ZHAO_TEACHER().fullTimeTeacher.updateTrainingDateById;
              // common.ajax({
              //   url: url,
              //   data: {
              //     id: _this.trainingAccountId,
              //     trainingDate: _this.formItem.date,
              //     trainingTime: _this.formItem.dateTime,
              //     trainingAccount: _this.account,
              //     natureOfWork: 1,
              //     teacherUuid: _this.teacherUuid
              //   },
              //   success: function (response) {
              //     common.notices('操作成功！！');
              //     _this.$emit('reFresh', 'success');
              //     _this.modal = false;
              //   }
              // });
              this.$axios.post( url,{
                id: _this.trainingAccountId,
                trainingDate: _this.formItem.date,
                trainingTime: _this.formItem.dateTime,
                trainingAccount: _this.account,
                natureOfWork: 1,
                teacherUuid: _this.teacherUuid
              }).then( () => {
                common.notices('操作成功！！');
                _this.$emit('reFresh', 'success');
                _this.modal = false;
              })
            }
          } else {
            setTimeout(() => {
              this.loading = true;
            }, 0);
          }
        });
      },
      changeDateTime(value) {
        this.formItem.dateTime = value;
      },
      changeDate(value) {
        this.formItem.date = value;
        const _this = this;
        // common.ajax({
        //   url: ZHAO_TEACHER().fullTimeTeacher.getAccoutByDate,
        //   method: 'get',
        //   data: {trainingDate: value, natureOfWork: 1},
        //   success(res) {
        //     let data = res.data;
        //     console.log(data);
        //     if (data && data.flag === 'success') {
        //       _this.account = data.account;
        //     } else {
        //       common.notices(data.msg, '出错了', 'error');
        //     }
        //   }
        // });
        this.$axios.get(  ZHAO_TEACHER().fullTimeTeacher.getAccoutByDate,{
          params:{
            trainingDate: value,
            natureOfWork: 1
          }
        }).then( ({data}) => {
          let datas = data.data;
          console.log(datas);
          if (datas && datas.flag === 'success') {
            _this.account = datas.account;
          } else {
            common.notices(datas.msg, '出错了', 'error');
          }
        })
      }
    }
  };
</script>

<style scoped>
  .text16 {
    font-size: 16px;
    line-height: 40px;
  }

  p {
    padding-left: 20px;
    font-weight: bold;
    line-height: 32px;
  }

  p span {
    font-weight: normal;
  }
</style>
