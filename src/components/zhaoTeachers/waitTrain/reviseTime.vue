<template>
	<div>
    <Modal
      v-model="modal"
      title="调整培训时间"
      :closable="false"
      :mask-closable="false"
      :loading = "loading"
      @on-ok="onOk('formValidate')">
      <i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
        <span class="text16">原培训安排：</span>
        <p>培训时间：<span>{{oldAccount.trainingDate}}</span></p>
        <p>培训账号：<span>{{oldAccount.account}}</span></p>
        <hr class="split"/>
        <span class="text16">调整培训安排：</span>
        <Form-item label="培训时间" prop="date">
          <Date-picker type="date" @on-change="changeDate" placeholder="选择日期" style="width: 120px"></Date-picker> 14:00
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
				modal: false,
        loading: true,
        trainingAccountId: '',
        natureOfWorkDesc: '',
        oldAccount: {
					trainingDate: '',
          account: '',
          trainingAccount: ''
        },
        account: '',
        formItem: {
					date: ''
        },
        ruleValidate: {
          date: [
            {required: true, message: '请选择日期', trigger: 'change'}
          ]
        }
      }
		},
		methods: {
			show(trainingAccountId,natureOfWorkDesc) {
				this.trainingAccountId = trainingAccountId;
				this.natureOfWorkDesc = natureOfWorkDesc;
				this.modal = true;

        this.getOld();
      },
      getOld() {
        const _this = this;
        common.ajax({
          url: ZHAO_TEACHER().WaitTrain.getTrainingDateById,
          method: 'get',
          data: { id: _this.trainingAccountId },
          success(res) {
            let data = res.data;
            if(data) {
              _this.oldAccount.trainingDate = data.trainingDate;
              _this.oldAccount.account = data.account;
              _this.oldAccount.trainingAccount = data.trainingAccount;
            }
          }
        });
      },
      onOk(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            let natureOfWork = '';
            if(_this.natureOfWorkDesc.indexOf('兼职') !== -1){
              natureOfWork = 2;
            }else if(_this.natureOfWorkDesc.indexOf('全职') !== -1){
              natureOfWork = 1;
            }
            common.ajax({
              url: ZHAO_TEACHER().WaitTrain.updateTrainingDateById,
              data: {
              	id: _this.trainingAccountId,
                trainingDate: _this.formItem.date,
                trainingAccount: _this.account,
                natureOfWork: natureOfWork
              },
              success: function(response){
                common.notices('操作成功！！');
                _this.$emit('reFresh', 'add.success');
                _this.modal = false;
              }
            });
          }else{
            setTimeout(() => {
              this.loading = true;
            }, 0);
          }
        });
      },
      changeDate(value) {
				this.formItem.date = value;
				const _this = this;
				common.ajax({
          url: ZHAO_TEACHER().WaitTrain.getAccoutByDate,
          method: 'get',
          data: { trainingDate: value },
          success(res) {
          	let data = res.data;
          	if(data && data.flag === 'success') {
          		_this.account = data.account;
            }else{
          		common.notices(data.msg,'出错了','error');
            }
          }
        });
      }
    }
	};
</script>

<style scoped>
  .text16 { font-size: 16px; line-height: 40px;}
  p { padding-left: 20px;font-weight: bold;line-height: 32px; }
  p span {font-weight: normal;}
</style>
