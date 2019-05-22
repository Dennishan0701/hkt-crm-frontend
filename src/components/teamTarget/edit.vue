<template>
  <Modal
    title="编辑指标"
    v-model="channelModal"
    :mask-closable="false"
    :loading = "loading"
    @on-ok="onOk('formValidate')"
    class-name="vertical-center-modal">
    <i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
      <Form-item label="时间" prop="name">
        <DatePicker @on-change='getMonth' type="month" placeholder="选择年月" style="width: 200px"></DatePicker>
      </Form-item>
      <Form-item label="团队">
        {{formItem.teamName}}
      </Form-item>
      <Form-item label="属性">
        {{formItem.teamType}}
      </Form-item>
      <Form-item label="指标（元）" prop="saleTarget">
        <i-input v-model="formItem.saleTarget" placeholder="请填写" style="width: 200px"></i-input>
      </Form-item>
    </i-form>

  </Modal>
</template>

<script type="text/ecmascript-6">
  import {TARGET} from 'common/api/target.js';
  import {common} from 'common/js/common.js';

  export default{
    data() {
      return {
        channelModal: false,
        loading: true,
        formItem: {
          teamUuid: '',
          saleTargetId: '',
          teamName: '',
          teamType: '',
          saleTarget: '',
          month: '',
        },
        ruleValidate: {
          saleTarget: [
            {required: true, message: '不能为空',  trigger: 'blur'},
          ],
        }
      }
    },
    methods: {
      getMonth(value){
        console.log(value);
        this.formItem.month = value;
      },
      show(teamUuid,saleTargetId,teamName,teamType,saleTarget,month) {
          this.channelModal = true;
          this.formItem.teamUuid = teamUuid;
          this.formItem.saleTargetId = saleTargetId;
          this.formItem.teamName = teamName;
          this.formItem.teamType = teamType;
          this.formItem.saleTarget = saleTarget;
          this.formItem.month = month;
      },
      onOk(name) {
        this.loading = false;
        const _this = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            // common.ajax({
            //   url: TARGET().target.changeTarget,
            //   data: {
            //     saleTargetId: _this.formItem.saleTargetId,
            //     teamUuid: _this.formItem.teamUuid,
            //     month: _this.formItem.month,
            //     saleTarget: _this.formItem.saleTarget,
            //   },
            //   success: function (response) {
            //     _this.channelModal = false;
            //     common.notices('操作成功！！');
            //     _this.$emit('reFresh', 'success');
            //   }
            // });
            this.$axios.get(TARGET().target.changeTarget,{
              params:{
                saleTargetId : this.formItem.saleTargetId,
                teamUuid : this.formItem.teamUuid,
                month : this.formItem.month,
                saleTarget : this.formItem.saleTarget,
              },
            }).then( ({data}) => {
              this.channelModal = false;
              common.notices('操作成功！！');
              this.$emit('reFresh', 'success');
            })
          } else {
            setTimeout(() => {
              this.loading = true;
            }, 0);
          }
        });
      },
    }
  };
</script>

<style>
</style>
