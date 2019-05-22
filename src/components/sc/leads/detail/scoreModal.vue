<template>
  <Modal
    v-model="scoreModal"
    title="添加备注"
    :mask-closable="false"
    :closable="false"
    :loading = "loading"
    @on-ok="addRemarkOk('formValidateScore')" >
    <i-form ref="formValidateScore" :model="formItem" :rules="ruleValidateScore" :label-width="80">
      <Form-item prop="scoreType" label="成绩类型:">
        <i-select v-model="formItem.scoreType" placeholder="请选择" style="width:200px">
          <i-option v-for="(item,index) in sysEnumList" :key='index' :value="item.sysEnumName">{{item.sysEnumName}}</i-option>
        </i-select>
      </Form-item>
      <Form-item prop="subject" label="科目:">
        <i-select v-model="formItem.subject" placeholder="请选择" style="width:200px">
          <i-option v-for="(item,index) in subjectList" :key='index' :value="item.value">{{item.value}}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="分数:">
        <Row style="width:280px">
          <i-col span="8">
            <Form-item>
              <i-input v-model="formItem.score" placeholder="当前分数"></i-input>
            </Form-item>
          </i-col>
          <i-col span="2">
            <p style='text-align: center'>/</p>
          </i-col>
          <i-col span="8">
            <Form-item>
              <i-input v-model="formItem.fullScore" placeholder="满分"></i-input>
            </Form-item>
          </i-col>
        </Row>

      </Form-item>
    </i-form>

  </Modal>
</template>

<script type="text/ecmascript-6">
  import {MO} from 'common/api/mo.js';
  import {formateDate,common} from 'common/js/common.js';

  export default{
    data() {
      return {
        scoreModal: false,
        loading: true,
        sysEnumList:[],
        subjectList:[],
        formItem: {
          leadsUuid: '',
          scoreType: '',
          subject: '',
          score: '',
          fullScore: '',
        },
        ruleValidateScore: {
          scoreType: [
            {required: true, message: '请选择成绩类型', trigger: 'blur'}
          ],
          subject: [
            {required: true, message: '请选择科目', trigger: 'blur'}
          ],
          score: [
            {required: true, message: '请填写当前分数', trigger: 'blur'}
          ],
          fullScore: [
            {required: true, message: '请填写满分', trigger: 'blur'}
          ],
        },
        userUuid: '',
        leadsPhone: ''
      }
    },
    methods: {
      show(uuid) {
        const _this = this;
        this.formItem.leadsUuid = uuid
        common.ajax({
          url: MO().Leads.getSysEnumBaseIndo,
          method:'get',
          data: {
            sysEnumType:35
          },
          success: function (res) {
            _this.sysEnumList = res.data || []
          }
        });
        $.getJSON("static/data.json",function (res) {
          _this.subjectList = res.subjectList
        })
        this.$refs['formValidateScore'].resetFields();
        this.scoreModal = true;
      },
      addRemarkOk(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          const that = this;
          if (valid && that.formItem.score && that.formItem.fullScore) {
              common.ajax({
                url: MO().Leads.addScore,
                data: {
                  leadsUuid: that.formItem.leadsUuid,
                  scoreType: that.formItem.scoreType,
                  subject: that.formItem.subject,
                  score: that.formItem.score,
                  fullScore: that.formItem.fullScore,
                },
                success: function (response) {
                  common.notices('操作成功！！');
                  that.$emit('reFresh', 'success');
                }
              });
              this.scoreModal = false;
          } else {
            common.msg('请完善信息！！！')
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
