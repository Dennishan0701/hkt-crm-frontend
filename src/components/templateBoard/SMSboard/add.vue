<template>
  <Modal
    title="新增短信模板"
    v-model="channelModal"
    :mask-closable="false"
    :closable="false"
    :loading = "loading"
    @on-ok="onOk('formValidate')"
    class-name="vertical-center-modal">
    <i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">

      <Form-item label="短信类型" prop="type">
        <i-select v-model="formItem.type">
          <i-option v-for="(item,index) in typeList" :key='index' :value="item.enumValue">{{ item.enumName }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="短信类别" prop="category">
        <i-select v-model="formItem.category">
          <i-option v-for="(item,index) in categoryList" :key='index' :value="item.enumValue">{{ item.enumName }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="短信状态" prop="status">
        <i-select v-model="formItem.status">
          <i-option value="0">停用</i-option>
          <i-option value="1">启用</i-option>
        </i-select>
      </Form-item>
      <Form-item label="短信内容" prop="informationContent">
        <i-input type="textarea" v-model="formItem.informationContent" :rows="4" :maxlength="500" placeholder="500字以内"></i-input>
      </Form-item>
    </i-form>
  </Modal>
</template>

<script type="text/ecmascript-6">
  import {TEMPLATE} from 'common/api/templateBoard.js';
  import {common} from 'common/js/common.js';
  export default{
    data() {
      return {
        channelModal: false,
        loading: true,
        formItem: {
          type: '',
          category: '',
          informationContent: '',
          status: '',
        },
        typeList: [],
        categoryList: [],
        typeList: [],
        ruleValidate: {
          type: [
            {required: true, message: '短信类型不能为空',  trigger: 'change'},
          ],
          category: [
            {required: true, message: '短信类别不能为空',  trigger: 'change'},
          ],
          informationContent: [
            {required: true , message: '短信内容不能为空',  trigger: 'blur'},
          ],
          status: [
            {required: true , message: '短信状态不能为空',  trigger: 'blur'},
          ],
        }
      }
    },
    methods: {
      show() {
        const _this = this;

        common.ajax({
          url: TEMPLATE().SMSboard.getType,
          method: 'get',
          success: function(res){
            _this.typeList = res.data.typeEnum || [];
          }
        });
        common.ajax({
          url: TEMPLATE().getCategory,
          method: 'get',
          success: function(res){
            _this.categoryList = res.data.categoryEnum || [];
          }
        });

        this.channelModal = true;
      },
      onOk(name) {
        this.loading = false;
        const _this = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            common.ajax({
              url: TEMPLATE().SMSboard.add,
              data: {
                purpose: _this.formItem.type,
                category: _this.formItem.category,
                messageContent: _this.formItem.informationContent,
                status: _this.formItem.status,
              },
              success: function (response) {
                _this.channelModal = false;
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
      }
    }
  };
</script>

<style>
</style>
