<template>
  <Modal
    :title="modalTitle"
    v-model="channelModal"
    :mask-closable="false"
    width='400'
    :loading="loading"
    @on-ok="onOk('formValidate')"
    class-name="vertical-center-modal">
    <i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="120">
      <Form-item label="月份" prop="name">
        <Date-picker @on-change='getMonth' v-model="formItem.month" type="month" placeholder="选择年月"
                     style="width: 200px"></Date-picker>
      </Form-item>
      <Form-item label="指标（万元）" prop="saleTarget">
        <i-input v-model="formItem.saleTarget" placeholder="请填写" style="width: 200px"></i-input>
      </Form-item>
    </i-form>

  </Modal>
</template>

<script type="text/ecmascript-6">
  import {TARGET} from 'common/api/target.js';
  import {common,formateDate} from 'common/js/common.js';

  export default{
    data() {
      return {
        channelModal: false,
        loading: true,
        flag: '',
        formItem: {
          saleTarget: '',
          month: '',
        },
        ruleValidate: {
          saleTarget: [
            {required: true, message: '不能为空', trigger: 'blur'},
          ],
        }
      }
    },
    methods: {
      getMonth(value){
        this.month = value;
      },
      show(saleTarget, month, edit) {
        this.$refs['formValidate'].resetFields();
        this.flag = edit;
        this.formItem.saleTarget = saleTarget || '' ;
        this.formItem.month = month;
        this.channelModal = true;
      },
      onOk(name) {
        this.loading = false;
        const _this = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            // common.ajax({
            //   url: TARGET().allTarget.edit,
            //   data: {
            //     month: formateDate(_this.formItem.month,'yyyy-MM'),
            //     saleTarget: _this.formItem.saleTarget,
            //   },
            //   success: function (response) {
            //     _this.channelModal = false;
            //     common.notices('操作成功！！');
            //     _this.$emit('reFresh', 'success');
            //   }
            // });
            this.$axios.get(TARGET().allTarget.edit,{
              params:{
                month: formateDate(this.formItem.month,'yyyy-MM'),
                saleTarget: this.formItem.saleTarget,
              },
            }).then( () => {
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
    },

    computed: {
      modalTitle() {
        return (this.flag === 'edit') ? '修改月指标' : '新增月指标';
      }
    }
  };
</script>

<style>
</style>
