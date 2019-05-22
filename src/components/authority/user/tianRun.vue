<template>
  <div>
    <Modal
      title="绑定天润账号"
      v-model="modal"
      :mask-closable="false"
      :closable="false"
      :loading="loading"
      @on-ok="ok('formValidate')">
      <i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
        <Form-item label="坐席号" prop="seatsNo">
          <i-input v-model="formItem.seatsNo" placeholder="" style="width: 200px"></i-input>
        </Form-item>
        <Form-item label="坐席密码" prop="seatsPassword">
          <i-input v-model="formItem.seatsPassword" type="password" placeholder="" style="width: 200px"></i-input>
        </Form-item>
        <Form-item label="热线电话" prop="hotlinePhone">
          <i-input v-model="formItem.hotlinePhone" placeholder="" style="width: 200px"></i-input>
        </Form-item>
      </i-form>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {AUTHORITY} from 'common/api/authority.js';
  import {common} from 'common/js/common.js';

  export default{
    data() {
      let validatePhone = (rule, value, callback) => {
        if (!(/^1\d{10}$/.test(this.formItem.phone))) {
          callback(new Error('请正确填写手机号码'));
        } else {
          callback();
        }
      }
      return {
        modal: false,
        loading: true,
        userUuid: '',
        formItem: {
          seatsNo: '',
          seatsPassword: '',
          hotlinePhone: ''
        },
        ruleValidate: {
          seatsNo: [
            {required: true, message: '必填', trigger: 'blur'},
          ],
          seatsPassword: [
            {required: true, message: '必填', trigger: 'blur'},
          ],
          hotlinePhone: [
            {required: true, message: '必填', trigger: 'blur'},
          ]
        }
      }
    },
    methods: {
      show(uuid,hotlinePhone,seatsNo,seatsPassword){
        if(hotlinePhone){
          this.formItem.seatsNo = seatsNo;
          this.formItem.hotlinePhone = hotlinePhone;
          this.formItem.seatsPassword = seatsPassword;
        }else {
          this.formItem.seatsNo = '';
          this.formItem.hotlinePhone = '';
          this.formItem.seatsPassword = '';
        }
        this.userUuid = uuid;
        this.modal = true;
      },
      ok(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            // common.ajax({
            //   url: AUTHORITY().SystemUser.bindSeats,
            //   data: {
            //     userUuid: _this.userUuid,
            //     seatsNo: _this.formItem.seatsNo,
            //     seatsPassword: _this.formItem.seatsPassword,
            //     hotlinePhone: _this.formItem.hotlinePhone
            //   },
            //   success: function (res) {
            //     _this.modal = false;
            //     common.notices('操作成功！');
            //     _this.$emit('reFresh', 'success');
            //   }
            // });
            this.$axios.post(AUTHORITY().SystemUser.bindSeats,{
              userUuid: _this.userUuid,
              seatsNo: _this.formItem.seatsNo,
              seatsPassword: _this.formItem.seatsPassword,
              hotlinePhone: _this.formItem.hotlinePhone
            }).then( () => {
              _this.modal = false;
              common.notices('操作成功！');
              _this.$emit('reFresh', 'success');
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

<style scoped>

</style>
