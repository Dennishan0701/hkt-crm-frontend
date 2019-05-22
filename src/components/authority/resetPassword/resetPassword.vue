<template>
  <div class="name" style="overflow-x: auto;">
    <o-breadcrumb second="权限管理" third="重置密码"></o-breadcrumb>
    <Row style="min-width: 900px">
      <i-col span=11>
        <o-div-split text="重置老师密码"></o-div-split>
        <i-form ref='teacherValidate' :model="teacher" :rules="ruleValidate1" :label-width="80">
          <Row>
            <i-col span=15>
              <Form-item label="老师手机号" prop="phone">
                <i-input v-model="teacher.phone" :size="$store.state.searchModuleSize" placeholder="请输入"></i-input>
              </Form-item>
            </i-col>
            <i-col span=9>
              <Form-item>
                <i-button type="primary" :size="$store.state.searchModuleSize" @click="handleSubmit('teacherValidate')">点击重置</i-button>
              </Form-item>
            </i-col>
          </Row>
        </i-form>
      </i-col>
      <i-col span=11 offset="1">
        <o-div-split text="重置学生密码密码"></o-div-split>
        <i-form ref='studentValidate' :model="student" :rules="ruleValidate2" :label-width="80">
          <Row>
            <i-col span=15>
              <Form-item label="学生手机号" prop="phone">
                <i-input v-model="student.phone" :size="$store.state.searchModuleSize" placeholder="请输入"></i-input>
              </Form-item>
            </i-col>
            <i-col span=9>
              <Form-item>
                <i-button type="primary" :size="$store.state.searchModuleSize" @click="handleSubmit('studentValidate')">点击重置</i-button>
              </Form-item>
            </i-col>
          </Row>
        </i-form>
      </i-col>
      <i-col span=11>
        <o-div-split text="重置用户密码"></o-div-split>
        <i-form ref='userValidate' :model="user" :rules="ruleValidate3" :label-width="80">
          <Row>
            <i-col span=15>
              <Form-item label="用户名" prop="name">
                <i-input v-model="user.name" :size="$store.state.searchModuleSize" placeholder="请输入"></i-input>
              </Form-item>
            </i-col>
            <i-col span=9>
              <Form-item>
                <i-button type="primary" :size="$store.state.searchModuleSize" @click="handleSubmit('userValidate')">点击重置</i-button>
              </Form-item>
            </i-col>
          </Row>
        </i-form>
      </i-col>
    </Row>
    <!--<div class="split-div">-->
    <!--<div class="title">基本信息</div>-->
    <!--</div>-->


  </div>
</template>

<script>
  import {formateDate, common} from 'common/js/common.js';
  import {AUTHORITY} from 'common/api/authority.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import oDivSplit from 'components/o/oDivSplit';
  export default {
    name: 'name',
    data () {
      return {
        teacher:{
          phone:'',
        },
        student:{
          phone:'',
        },
        user:{
          name:'',
        },
        ruleValidate1:{
          phone: [
            { required: true, message: '号码不能为空', trigger: 'blur' }
          ],
        },
        ruleValidate2:{
          phone: [
            { required: true, message: '号码不能为空', trigger: 'blur' }
          ],
        },
        ruleValidate3:{
          name: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
        }
      }
    },
    mounted() {
    },
    methods: {
      handleSubmit (name) {
        const _this = this;
        let data = {};
        if(name == 'teacherValidate'){
          data = {
            phone:_this.teacher.phone,
            type:1,
          }
        }else if(name == 'studentValidate'){
          data = {
            phone:_this.student.phone,
            type:0,
          }
        }else if(name == 'userValidate'){
          data = {
            loginName:_this.user.name,
          }
        }
        this.$refs[name].validate((valid) => {
          if (valid) {
            // common.ajax({
            //   url: AUTHORITY().reset.resetPassword,
            //   data: data,
            //   success: function (res) {
            //     common.notices('重置成功！！！');
            //   }
            // });
            this.$axios.post(AUTHORITY().reset.resetPassword,{
              ...data
            }).then( () => {
              common.notices('重置成功！！！');
            })
          } else {
            common.notices('操作失败！！','请重试','warning');
          }
        })
      },
    },
    components:{
      OBreadcrumb, oDivSplit
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>
