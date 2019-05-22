<template>
  <Modal
    title="新增课程订单"
    v-model="modal"
    :mask-closable="false"
    :closable="false"
    :loading = "loading"
    @on-ok="onOk('formValidate')"
    class-name="vertical-center-modal">
    <i-form ref="formValidate" :model="formItem" :rules="ruleValidateModel" :label-width="80">

      <Form-item label="学生手机号:" prop="studentPhone">
        <i-input v-model="formItem.studentPhone" style="width:200px" placeholder="请输入手机号"></i-input>
      </Form-item>
      <Form-item label="老师手机号:" prop="studentPhone">
        <i-input v-model="formItem.teacherPhone" style="width:200px" placeholder="请输入手机号"></i-input>
      </Form-item>

      <Form-item label="年级" prop="grade">
        <i-select v-model="formItem.grade" style="width:200px" placeholder="请选择年级">
          <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
        </i-select>
      </Form-item>

      <Form-item label="科目" prop="grade">
        <i-select v-model="formItem.subject" style="width:200px" placeholder="请选择科目">
          <i-option v-for="(item,index) in subjectList" :key='index' :value="item.value">{{ item.value }}</i-option>
        </i-select>
      </Form-item>
    </i-form>

  </Modal>
</template>

<script type="text/ecmascript-6">
  import {STUDY_COURSE} from 'common/api/studyCourse.js';
  import {common} from 'common/js/common.js';

  export default{
    data() {
      return {
        loading: true,
        modal: false,
        gradeList:[],
        subjectList:[],
        formItem: {
          studentPhone: '',
          teacherPhone: '',
          grade: '',
          subject: '',
        },
        ruleValidateModel: {
          studentPhone: [
            {required: true, message: '请输入手机号', trigger: 'blur'}
          ],
          grade: [
            {required: true, message: '请输入手机号', trigger: 'change'}
          ],
        },
      }
    },
    methods: {
      show() {
        const _this = this;
        //获取年级科目
        $.getJSON("static/data.json", function (json) {
          _this.gradeList = json.gradeList;
          _this.subjectList = json.subjectList;
        });
        _this.modal = true;
      },
      onOk(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            console.log(_this.formItem.week);
            common.ajax({
              url: STUDY_COURSE().formalClass.addCourse,
              data: {
                stuPhone: _this.formItem.studentPhone,
                tcPhone: _this.formItem.teacherPhone,
                grade: _this.formItem.grade,
                courseStartDate: _this.formItem.date,
                subject: _this.formItem.subject,
              },
              success: function (res) {
                _this.modal = false;
                common.notices('操作成功！');
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
    }
  };
</script>

<style>

</style>
