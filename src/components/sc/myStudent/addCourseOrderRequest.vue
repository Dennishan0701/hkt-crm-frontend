<template>
<div>
  <Modal
    v-model="addRemarkModal"
    title="添加备注"
    :loading = "loading"
    @on-ok="addRemarkOk('formValidateRemark')">
    <i-form ref="formValidateRemark" :model="validateRemark" :label-width="80" :rules="ruleValidateRemark">
      <Form-item prop="teacherUuid" label="老师">
        <i-select v-model="validateRemark.teacherUuid" filterable>
          <i-option v-for="(item,index) in allTeacher" :key='index' :value="item.uuid">{{ item.tcName }}</i-option>
        </i-select>
      </Form-item>
      <Form-item prop="courseRule" label="上课规律">
        <i-input type="textarea" v-model="validateRemark.courseRule" :rows="4" :maxlength="500" placeholder="不要超过500字"></i-input>
      </Form-item>
      <Form-item prop="courseDate" label="上课周期">
        <Date-picker type="daterange" v-model="validateRemark.courseDate" @on-change="changeDate" placement="bottom-start" style="width: 180px;" placeholder="上课周期时间"></Date-picker>
      </Form-item>
      <Form-item prop="remark" label="备注">
        <i-input type="textarea" v-model="validateRemark.remark" :rows="4" :maxlength="500" placeholder="不要超过500字"></i-input>
      </Form-item>
    </i-form>
  </Modal>
</div>
</template>

<script type="text/ecmascript-6">
  import {SCS} from 'common/api/scs.js';
  import {formateDate,common} from 'common/js/common.js';
  import {COMMON_API} from 'common/api.config.js';

  const storage = $.localStorage;
  export default{
    data() {
      var courseDate = (rule, value, callback) => {
        console.log(value);
        if (!value[0]) {
          callback(new Error('请选择上课日期'));
        } else {
          callback();
        }
      }
      return {
        addRemarkModal: false,
        loading: true,
        leadsUuid: '',
        allTeacher: [],
        validateRemark: {
          teacherUuid: '',
          courseRule: '',
          courseStartDate: '',
          courseEndDate: '',
          remark: '',
        },
        ruleValidateRemark: {
          teacherUuid: [
            {required: true, message: '请选择老师', trigger: 'change'},
          ],
          courseRule: [
            {required: true, message: '请填写上课规律', trigger: 'blur'},
          ],
          courseDate: [
            {required: true, validator: courseDate, trigger: ['change','blur']},
          ],
          remark: [
            {required: true, message: '请填写备注', trigger: 'blur'},
          ],
        },
      }
    },
    methods: {
      show(uuid) {
        this.leadsUuid = uuid;
        this.addRemarkModal = true;
        const _this = this;
        // common.ajax({
        //   url: COMMON_API().getAllTeacher,
        //   method:'get',
        //   success: function (res) {
        //     _this.allTeacher = res.data||[];
        //   }
        // });
        this.$axios.get(COMMON_API().getAllTeacher,{
        }).then( ({data}) => {
          _this.allTeacher = data.data||[];
        })
      },
      changeDate(value) {
        this.validateRemark.courseStartDate = value[0] || '';
        this.validateRemark.courseEndDate = value[1] || '';
      },
      addRemarkOk(name) {
        const that = this;
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            // common.ajax({
            //   url: SCS().MyStudent.addCourseOrderRequest,
            //   data: {
            //     leadsUuid: that.leadsUuid,
            //     teacherUuid: that.validateRemark.teacherUuid,
            //     courseRule: that.validateRemark.courseRule,
            //     courseStartDate: that.validateRemark.courseStartDate,
            //     courseEndDate: that.validateRemark.courseEndDate,
            //     remark: that.validateRemark.remark,
            //   },
            //   success: function (response) {
            //     that.addRemarkModal = false;
            //     that.$emit('reFresh', 'success');
            //     that.validateRemark ={
            //       teacherUuid: '',
            //       courseRule: '',
            //       courseStartDate: '',
            //       courseEndDate: '',
            //       remark: '',
            //     }
            //
            //
            //     common.notices('操作成功！！');
            //   }
            // });
            this.$axios.post(SCS().MyStudent.addCourseOrderRequest,{
              leadsUuid: that.leadsUuid,
              teacherUuid: that.validateRemark.teacherUuid,
              courseRule: that.validateRemark.courseRule,
              courseStartDate: that.validateRemark.courseStartDate,
              courseEndDate: that.validateRemark.courseEndDate,
              remark: that.validateRemark.remark,
            }).then( () => {
              that.addRemarkModal = false;
              that.$emit('reFresh', 'success');
              that.validateRemark ={
                teacherUuid: '',
                courseRule: '',
                courseStartDate: '',
                courseEndDate: '',
                remark: '',
              }
              common.notices('操作成功！！');
            })
          } else {
            setTimeout(() => {
              this.loading = true;
            }, 0);
          }
        });
      }
    },
    filters: {
      formateDate(time) {
        let date = new Date(time);
        return formateDate(date, 'yyyy-MM-dd hh:mm');
      }
    }
  };
</script>

<style>

</style>
