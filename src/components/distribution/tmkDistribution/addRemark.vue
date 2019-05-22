<template>
  <div>
    <Modal
      v-model="addRemarkModal"
      title="添加备注"
      :mask-closable="false"
      :closable="false"
      :loading="loading"
      @on-ok="addRemarkOk('formValidateRemark')"
      @on-cancel="cancel">
      <i-form ref="formValidateRemark" :model="validateRemark" :rules="ruleValidateRemark">
        <Form-item prop="followResult" style="display: inline-block">
          <i-select v-model="validateRemark.followResult" clearable placeholder="跟进结果" style="width:150px;"
                    @on-change="changeFollowResult">
            <i-option v-for="(item,index) in followResultList" :key="index+'f'" :value="item.followResult">
              {{item.followContent}}
            </i-option>
          </i-select>
        </Form-item>
        <!--<Form-item v-if="isDistributionCcShow" prop="distributionCc" style="display: inline-block">-->
          <!--<i-select v-model="validateRemark.distributionCc" clearable filterable placeholder="分配CC" style="width:150px;"-->
                    <!--@on-change="changeDistributionCc">-->
            <!--<i-option v-for="(item,index) in ccUserList" :key="index+'c'" :value="item.uuid">-->
              <!--{{item.userName}}-->
            <!--</i-option>-->
          <!--</i-select>-->
        <!--</Form-item>-->
        <Form-item prop="remark">
          <i-input type="textarea" v-model="validateRemark.remark" :rows="4" :maxlength="500"
                   placeholder="不要超过500字"></i-input>
        </Form-item>
      </i-form>

      <!--<div class="o-strong-title">历史备注</div>-->
      <table class="o-table" cellspacing="0" style="width:100%;">
        <tr>
          <th>备注时间</th>
          <th>跟进结果</th>
          <th style="width:200px">内容</th>
          <th>备注人</th>
        </tr>
        <tr v-for="(item,index) in historyRemarkList" :key='index'>
          <td>{{item.followTime | formateDate}}</td>
          <td>{{item.followResult}}</td>
          <td>{{item.followDesc}}</td>
          <td>{{item.followUser}}</td>
        </tr>
      </table>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {SCS} from 'common/api/scs.js';
  import {COMMON_API} from 'common/api.config.js';
  import {formateDate, common} from 'common/js/common.js';
  import {DISTRIBUTE} from 'common/api/distribute.js';

  const storage = $.localStorage;
  export default {
    props: {
      historyRemarkList: {
        type: Array
      }
    },
    data () {
      var validateFollowResult = (rule, value, callback) => {
        if (value == "" || value == undefined) {
          callback (new Error ('请选择跟进结果'));
        } else {
          callback ();
        }
      }
      return {
        isDistributionCcShow:false,
        addRemarkModal: false,
        loading: true,
        validateRemark: {
          remark: '',
          followResult: '',
          // distributionCc: ''
        },
        ruleValidateRemark: {
          remark: [
            {required: true, message: '请填写内容', trigger: 'blur'}
          ],
          followResult: [
            {required: true, validator: validateFollowResult, trigger: 'change'}
          ],
          // distributionCc: [
          //   {required: true, message: '请选择', trigger: 'change'}
          // ]
        },
        userUuid: '',
        leadsPhone: '',
        leadsUuid: '',
        followResultList: [],
        ccUserList: [],
      }
    },
    mounted () {
      // 获取跟进结果列表
      this.$axios.get (DISTRIBUTE ().TmkDistribution.getLeadsFollow, {}).then (({data}) => {
        console.log (data);
        this.followResultList = data.data || [];
      })
      this.$axios.get (DISTRIBUTE ().distributionLeadsToUser, {
        params: {
          param: '',
          pageIndex: 1,
          pageNumber: 1000,
          // orderBy: '',
          // sortBy: ''
        }
      }).then (({data}) => {
        console.log (data);
        this.ccUserList = data.data.distributionUserVos || [];
      })
    },
    methods: {
      show (phone, uuid) {
        this.userUuid = storage.get ('user').uuid;
        this.leadsPhone = phone;
        this.leadsUuid = uuid;
        this.addRemarkModal = true;
        this.validateRemark.remark = '';
      },
      addRemarkOk (name) {
        this.loading = false;
        this.$refs[name].validate ((valid) => {
          if (valid) {
            const that = this;
            this.$axios.get (DISTRIBUTE ().TmkDistribution.addTmkFollowRecord, {
              params: {
                leadsUuid: that.leadsUuid,
                followResult: that.validateRemark.followResult,
                followDesc: that.validateRemark.remark,
                // ccUuid: that.validateRemark.distributionCc,
              },
            }).then (() => {
              common.notices ('操作成功！！');
              that.$emit ('reFresh', 'success');
            })
            this.addRemarkModal = false;
          } else {
            setTimeout (() => {
              this.loading = true;
            }, 0);
          }
        });
      },
      changeFollowResult (value) {
        if (value == 9 || value == 10) {  //意向试听或调试课
          this.isDistributionCcShow = true
        }else{
          this.isDistributionCcShow = false
        }
      },
      changeDistributionCc () {

      },
      cancel () {
        this.validateRemark = {
          remark: '',
          followResult: '',
          distributionCc: ''
        }
        this.isDistributionCcShow = false
      }
    },
    filters: {
      formateDate (time) {
        let date = new Date (time);
        return formateDate (date, 'yyyy-MM-dd hh:mm');
      }
    }
  };
</script>

<style>

</style>
