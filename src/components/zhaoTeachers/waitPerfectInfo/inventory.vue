<template>
  <Modal
    v-model="modal"
    title="入库"
    :closable="false"
    :mask-closable="false"
    :loading = "loading"
    @on-ok="onOk('formValidate')">
    <i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100">
      <Form-item label="选择排课状态" prop="giveUpCause">
        <i-select v-model="formItem.giveUpCause" placeholder="排课状态" style="width:200px">
          <i-option value="5">可排课</i-option>
          <i-option value="6">不可排课</i-option>
        </i-select>
      </Form-item>
    </i-form>
  </Modal>
</template>

<script type="text/ecmascript-6">
  import {ZHAO_TEACHER,TEACHER} from 'common/api/teacher.js';
  import {common} from 'common/js/common.js';

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
        formItem: {
          giveUpCause: '',
        },
        ruleValidate: {
          giveUpCause: [
            {required: true, message: '请选择内容', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      show(uuid) {
        this.teacherUuid = uuid;
        this.modal = true;
        this.isFullPhone = true;
      },
      onOk(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {

            const _this = this;
            common.ajax({
              url: ZHAO_TEACHER().WaitPerfectInfo.inInventory,
              data: {
                teacherUuid: _this.teacherUuid,
                teacherStatus: _this.formItem.giveUpCause,
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
  };
</script>

<style>

</style>
