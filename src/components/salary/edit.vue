<template>
  <div>
    <Modal
      v-model="modal"
      :loading = "loading"
      :mask-closable="false"
      :closable="false"
      :title="natureOfWork"
      ok-text="保存并生效"
      @on-ok="onOk('formValidateEdit')">
      <i-form ref='formValidateEdit' :model="validateItem" :rules="ruleValidate" :label-width="80">
        <Form-item label="类型">
          <Radio-group v-model="validateItem.gradeType">
            <Radio label="2">普通</Radio>
            <Radio label="1">清北</Radio>
          </Radio-group>
        </Form-item>
        <Form-item label="等级" prop="grade">
          <i-input v-model="validateItem.grade" placeholder="不可与现有等级重复" style="width: 200px"></i-input>
        </Form-item>
        <Form-item label="时薪" prop="hourlyWage">
          <i-input v-model.number="validateItem.hourlyWage"  placeholder="元/h" style="width: 200px"></i-input> 元/h
        </Form-item>
        <Form-item label="描述" prop="description">
          <i-input type="textarea" v-model="validateItem.description" :maxlength="500" :rows="4" placeholder="口才这么好不说点什么真浪费..."></i-input>
        </Form-item>
      </i-form>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {SALARY} from 'common/api/salary.js';
  import {common} from 'common/js/common.js';
  export default {
    props: {
      natureOfWork: {
        type: String
      }
    },
    data(){
      return {
        modal: false,
        loading: true,
        id: '',
        validateItem: {
          gradeType: '',
          grade: '',
          hourlyWage: '',
          description: ''
        },
        ruleValidate: {
          grade: [
            {required: true, message: '请选择等级', trigger: 'change'}
          ],
          hourlyWage: [
            {required: true, type: 'number', message: '请填写时薪，只能是数字', trigger: 'blur'}
          ]
        },
      }
    },
    mounted(){
    },
    methods: {
      show(id) {
        this.id = id;
        this.modal = true;

        const _this = this;
        common.ajax({
          url: SALARY().Level.getById,
          method: 'get',
          data: { id: id },
          success: function(res) {
            let data = res.data;
            if(data) _this.validateItem = data;
          }
        });
      },
      onOk(name) {
        const _this = this;
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            common.ajax({
              url: SALARY().Level.update,
              data: {
                id: _this.id,
                gradeType: _this.validateItem.gradeType,
                grade: _this.validateItem.grade.toLocaleUpperCase(),
                hourlyWage: _this.validateItem.hourlyWage,
                description: _this.validateItem.description,
                natureOfWork: _this.natureOfWork === '等级时薪管理-兼职' ? 2 : 1
              },
              success: function (response) {
                _this.modal = false;
                common.notices('操作成功！');
                _this.$emit('reFresh', 'success');
              }
            });
          }else{
            setTimeout(() => {
              this.loading = true;
            }, 0);
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>
