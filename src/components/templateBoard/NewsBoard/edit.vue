<template>
  <Modal
    title="修改消息模板"
    v-model="channelModal"
    :mask-closable="false"
    :closable="false"
    :loading = "loading"
    @on-ok="onOk('formValidate')"
    class-name="vertical-center-modal">
    <i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">

      <Form-item label="消息类型" prop="type">
        <i-select v-model="formItem.type">
          <i-option v-for="(item,index) in typeList" :key='index' :value="item.enumValue">{{ item.enumName }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="消息类别" prop="category">
        <i-select v-model="formItem.category">
          <i-option v-for="(item,index) in categoryList" :key='index' :value="item.enumValue">{{ item.enumName }}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="消息状态" prop="status">
        <i-select v-model="formItem.status">
          <i-option value="0">停用</i-option>
          <i-option value="1">启用</i-option>
        </i-select>
      </Form-item>
      <Form-item label="内容" prop="informationContent">
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
          informationTemplateUuid: '',
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
            {required: true, message: '不能为空',  trigger: 'change'},
          ],
          category: [
            {required: true, message: '不能为空',  trigger: 'change'},
          ],
          status: [
            {required: true, message: '不能为空',  trigger: 'change'},
          ],
          informationContent: [
            {required: true , message: '不能为空',  trigger: 'blur'},
          ],
        }
      }
    },
    methods: {
      show(informationTemplateUuid,informationContent,category,status,type) {
        const _this = this;
        _this.formItem.informationTemplateUuid = informationTemplateUuid;
        _this.formItem.informationContent = informationContent;
        _this.formItem.category = category;
        _this.formItem.type = type;
        _this.formItem.status = status;


        common.ajax({
          url: TEMPLATE().NewsBoard.getType,
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
              url: TEMPLATE().NewsBoard.add,
              data: {
                informationTemplateUuid: _this.formItem.informationTemplateUuid,
                type: _this.formItem.type,
                status: _this.formItem.status,
                category: _this.formItem.category,
                informationContent: _this.formItem.informationContent,
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
