<template>
<div>
  <Modal
    v-model="giveUpModal"
    title="放弃学生"
    :closable="false"
    :mask-closable="false"
    :loading = "loading"
    @on-ok="onOk('formValidate')">
    <i-form ref='formValidate' :model="formItem" :rules="ruleValidateModel" :label-width="80">
      <Form-item label="放弃原因" prop="giveUpCause">
        <i-select v-model="formItem.giveUpCause" style="width:200px">
          <i-option v-for="(item,index) in statusList" :key='index' :value="item.giveUpCause">{{ item.giveUpCause }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="备注">
        <i-input type="textarea" v-model="formItem.remark" :rows="4" :maxlength="500" placeholder="不要超过500字"></i-input>
      </Form-item>
    </i-form>
  </Modal>
</div>
</template>

<script type="text/ecmascript-6">
  import {SCS} from 'common/api/scs.js';
  import {common} from 'common/js/common.js';
  export default{
    data() {
      return {
        loading: true,
        giveUpModal: false,
        statusList: [],
        formItem: {
          giveUpCause: '',
          remark: ''
        },
        ruleValidateModel: {
          giveUpCause: [
            {required: true, message: '请选择内容', trigger: 'change'}
          ]
        },
        leadsUuid: ''
      }
    },
    methods: {
      show(uuid) {
        this.leadsUuid = uuid;
        const that = this;
        // common.ajax({
        //   url: SCS().WaitFollowed.giveUpType,
        //   method: 'get',
        //   success: function(response){
        //     that.statusList = response.data || [];
        //   }
        // });
        this.$axios.get(SCS().WaitFollowed.giveUpType,{
        }).then( ({data}) => {
          that.statusList = data.data || [];
        })
        this.giveUpModal = true;
      },
      onOk(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const that = this;
            // common.ajax({
            //   url: SCS().WaitFollowed.giveUp,
            //   method: 'get',
            //   data: {
            //     leadsUuid: that.leadsUuid,
            //     giveUpCause: that.formItem.giveUpCause,
            //     giveUpDes: that.formItem.remark
            //   },
            //   success: function(response){
            //     that.giveUpModal = false;
            //     common.notices('操作成功！！');
            //     that.$emit('reFresh', 'success');
            //   }
            // });
            this.$axios.get(SCS().WaitFollowed.giveUp,{
              params:{
                leadsUuid: that.leadsUuid,
                giveUpCause: that.formItem.giveUpCause,
                giveUpDes: that.formItem.remark
              },
            }).then( () => {
              that.giveUpModal = false;
              common.notices('操作成功！！');
              that.$emit('reFresh', 'success');
            })
          } else {
            setTimeout(() => {
              this.loading = true;
            }, 0);
          }
        });
      }
    }
  };
</script>

<style>

</style>
