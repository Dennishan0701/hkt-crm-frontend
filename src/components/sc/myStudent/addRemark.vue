<template>
<div>
  <Modal
    v-model="addRemarkModal"
    title="添加备注"
    :loading = "loading"
    @on-ok="addRemarkOk('formValidateRemark')">
    <i-form ref="formValidateRemark" :model="validateRemark" :rules="ruleValidateRemark">
      <Form-item prop="remark">
        <i-input type="textarea" v-model="validateRemark.remark" :rows="4" :maxlength="500" placeholder="不要超过500字"></i-input>
      </Form-item>
    </i-form>
    <!---->
    <!--<div class="o-strong-title required">备注</div>-->
    <!--<i-input type="textarea" :model="remarkModal" :rows="4" :maxlength="500" @on-change="remarkChange" placeholder="必填"></i-input>-->
    <table class="o-table" cellspacing="0" cellspacing="0" style="width:100%;">
      <tr>
        <th>备注时间</th>
        <th style="width:300px">内容</th>
        <th>备注人</th>
      </tr>
      <tr v-for="(item,index) in historyRemarkList" :key='index'>
        <td>{{item.createTime | formateDate}}</td>
        <td>{{item.content}}</td>
        <td>{{item.userName}}</td>
      </tr>
    </table>
  </Modal>
</div>
</template>

<script type="text/ecmascript-6">
  import {SCS} from 'common/api/scs.js';
  import {formateDate,common} from 'common/js/common.js';

  const storage = $.localStorage;
  export default{
    props: {
      historyRemarkList: {
        type: Array
      }
    },
    data() {
      return {
        addRemarkModal: false,
        loading: true,
        userUuid: '',
        leadsPhone: '',
        validateRemark: {
          remark: ''
        },
        ruleValidateRemark: {
          remark: [
            {required: true, message: '请填写内容', trigger: 'blur'}
          ]
        },
      }
    },
    methods: {
      show(phone) {
        this.userUuid = storage.get('user').uuid;
        this.leadsPhone = phone;
        this.addRemarkModal = true;
      },
      addRemarkOk(name) {
        const that = this;
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            // common.ajax({
            //   url: SCS().WaitFollowed.addRemark,
            //   data: {
            //     leadsPhone: that.leadsPhone,
            //     uesrUuid: that.userUuid,
            //     content: that.validateRemark.remark
            //   },
            //   success: function (response) {
            //     that.addRemarkModal = false;
            //     that.$emit('reFresh', 'success');
            //     common.notices('操作成功！！');
            //   }
            // });
            this.$axios.post(SCS().WaitFollowed.addRemark,{
              leadsPhone: that.leadsPhone,
              uesrUuid: that.userUuid,
              content: that.validateRemark.remark
            }).then( () => {
              that.addRemarkModal = false;
              that.$emit('reFresh', 'success');
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
