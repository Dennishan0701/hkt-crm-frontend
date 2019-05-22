<template>
<div>
  <Modal
    v-model="addRemarkModal"
    title="添加备注"
    :mask-closable="false"
    :closable="false"
    :loading = "loading"
    @on-ok="addRemarkOk('formValidateRemark')" >
    <i-form ref="formValidateRemark" :model="validateRemark" :rules="ruleValidateRemark">
      <Form-item prop="remark">
        <i-input type="textarea" v-model="validateRemark.remark" :rows="4" :maxlength="500" placeholder="不要超过500字"></i-input>
      </Form-item>
    </i-form>

    <!--<div class="o-strong-title">历史备注</div>-->
    <table class="o-table" cellspacing="0" style="width:100%;">
      <tr>
        <th>备注时间</th>
        <th style="width:300px">内容</th>
        <th>备注人</th>
      </tr>
      <tr v-for="(item,index) in historyRemarkList" :key='index'>
        <td>{{item.createDate | formateDate}}</td>
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
        validateRemark: {
          remark: ''
        },
        ruleValidateRemark: {
          remark: [
            {required: true, message: '请填写内容', trigger: 'blur'}
          ]
        },
        userUuid: '',
        leadsPhone: '',
        leadsUuid:''
      }
    },
    methods: {
      show(phone,uuid) {
        this.userUuid = storage.get('user').uuid;
        this.leadsPhone = phone;
        this.leadsUuid = uuid;
        this.addRemarkModal = true;
        this.validateRemark.remark = '';
      },
      addRemarkOk(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            console.log(2);
            const that = this;
            // common.ajax({
            //   url: SCS().WaitFollowed.addRemark,
            //   method:'get',
            //   data: {
            //     leadsUuid: that.leadsUuid,
            //     leadsPhone: that.leadsPhone,
            //     uesrUuid: that.userUuid,
            //     content: that.validateRemark.remark,
            //   },
            //   success: function (response) {
            //     common.notices('操作成功！！');
            //     that.$emit('reFresh', 'success');
            //   }
            // });
            this.$axios.get(SCS().WaitFollowed.addRemark,{
              params:{
                leadsUuid: that.leadsUuid,
                leadsPhone: that.leadsPhone,
                uesrUuid: that.userUuid,
                content: that.validateRemark.remark,
              },
            }).then( () => {
              common.notices('操作成功！！');
              that.$emit('reFresh', 'success');
            })
            this.addRemarkModal = false;
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
