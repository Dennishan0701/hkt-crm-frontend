<template>
  <Modal
    v-model="modal"
    title="记录拨打"
    @on-ok="recordCallOk"
    @on-cancel="cancel"
    :mask-closable="false"
    :width="400">
    <table class="o-table" style="width: 100%">
      <tr>
        <!--<th class="required">请选择</th>-->
        <td style="text-align: left;">
          <!--<i-select v-model="formItem.connectStatus" @on-change="changeConnectStatus" style="width:200px">-->
          <!--<i-option v-for="(item,index) in statusList" :key='index' :value="item.value">{{ item.text }}</i-option>-->
          <!--</i-select>-->
          <Form ref="formItem" :model="formItem" :rules="ruleValidate" inline>
            <!--<FormItem prop="status">-->
            <!--<Select v-model="formItem.status" @on-change="selectStatus" placeholder="请选择接通状态" style="width: 180px;">-->
            <!--<Option v-for="(item,index) in area" :value="item.value" :key="item.id">{{item.status}}</Option>-->
            <!--</Select>-->
            <!--</FormItem>-->
            <!--<FormItem prop="detail">-->
            <!--<Select v-model="formItem.detail"  placeholder="请选择状态详情" @on-change="selectStatus2" style="width: 180px;">-->
            <!--<Option v-for="(item,index) in details" :value="item" :key="index">{{item}}</Option>-->
            <!--</Select>-->
            <!--</FormItem>-->
            <Dropdown trigger="hover" placement="bottom-start">
              <a href="javascript:void(0)">
                {{selectData}}
                <Icon type="arrow-down-b"></Icon>
              </a>
              <DropdownMenu slot="list" style="width: 130px;">
                <!--<DropdownItem>驴打滚</DropdownItem>-->
                <Dropdown placement="right-start" v-for="(item,index) in area" :value="item.value" :key="item.id"
                          @on-click="changeMenu(item.status,item.value,$event)">
                  <DropdownItem :name="item.value">
                    {{item.status}}
                    <Icon type="ios-arrow-right"></Icon>
                  </DropdownItem>
                  <DropdownMenu slot="list">
                    <DropdownItem v-for="(items,indexs) in item.detail" :value="items" :key="indexs" :name="items">
                      {{items}}
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </DropdownMenu>
            </Dropdown>
          </Form>


        </td>
      </tr>
      <!--<template v-if="isGiveup">-->
      <!--<tr>-->
      <!--<th class="required">放弃原因</th>-->
      <!--<td>-->
      <!--<i-select v-model="formItem.giveUpCause" style="width:200px;">-->
      <!--<i-option v-for="(item,index) in errorsStatusList" :key='index' :value="item.giveUpCause">{{ item.giveUpCause }}</i-option>-->
      <!--</i-select>-->
      <!--</td>-->
      <!--</tr>-->
      <!--<tr>-->
      <!--<th style="vertical-align: top;">放弃原因备注</th>-->
      <!--<td>-->
      <!--<i-input type="textarea" v-model="formItem.remark" :autosize="{minRows: 3}" :maxlength="500" placeholder="请输入..."></i-input>-->
      <!--</td>-->
      <!--</tr>-->
      <!--</template>-->
      <tr>
        <th class="required">接通状态</th>
        <td><span>{{status}}</span></td>
        <th class="required">详情</th>
        <td><span>{{showDetail}}</span></td>
      </tr>
    </table>
    <div slot="footer">
      <Button type="primary" @click="recordCallOk">确定</Button>
    </div>
  </Modal>
</template>

<script type="text/ecmascript-6">
  import {SCS} from 'common/api/scs.js';
  import {common} from 'common/js/common.js';

  export default {
    data() {
      return {
        showStatus: '',
        status: '',
        showDetail: '',
        selectData: '接通状态',
        arrayData: [],
        modal: false,
        formItem: {
          status: '',
          detail: '',
        },
        errorsStatusList: [],
        leadsUuid: '',
        area: [
          {
            "status": "已接通,待跟进",
            "value": "connectwait",
            "id": 11,
            "detail": [
              "同意排课",
              "暂不排课,保持跟进",
            ]
          },
          {
            "status": "未接通,待跟进",
            "value": "noconnectwait",
            "id": 22,
            "detail": [
              "未接",
              "拒接",
              "关机",
              "呼叫转移"
            ]
          },
          {
            "status": "已接通,放弃",
            "value": "connectgiveup",
            "id": 33,
            "detail": [
              "无设备",
              "信息错误",
              "未预约,不需要",
              "异常原因,无法排课",
            ]
          },
          {
            "status": "未接通,放弃",
            "value": "noconnectgiveup",
            "id": 44,
            "detail": [
              "空号",
              "停机",
              "未接",
              "拒接",
              "关机",
              "呼叫转移",
            ]
          },
          {
            "status": "提交试听课信息",
            "id": 55,
            "value": "submitInfo",
            "detail": [
              "跳转到排课页面"
            ]
          },
        ],
        details: [],
        ruleValidate: {
          status: [
            {required: true, message: '请选择状态', trigger: 'change'}
          ],
          detail: [
            {required: true, message: '请选择详情', trigger: 'change'}
          ],
        }
      }
    },
    mounted() {
      console.log(this.$route.path);
      if (this.$route.path == "/scs/ccMyStudent") {//cc我的学生页面，点击记录拨打，多一个支付选项
        this.area = [
          {
            "status": "已接通,待跟进",
            "value": "connectwait",
            "id": 11,
            "detail": [
              "同意排课",
              "暂不排课,保持跟进",
            ]
          },
          {
            "status": "未接通,待跟进",
            "value": "noconnectwait",
            "id": 22,
            "detail": [
              "未接",
              "拒接",
              "关机",
              "呼叫转移"
            ]
          },
          {
            "status": "已接通,放弃",
            "value": "connectgiveup",
            "id": 33,
            "detail": [
              "无设备",
              "信息错误",
              "未预约,不需要",
              "异常原因,无法排课",
            ]
          },
          {
            "status": "未接通,放弃",
            "value": "noconnectgiveup",
            "id": 44,
            "detail": [
              "空号",
              "停机",
              "未接",
              "拒接",
              "关机",
              "呼叫转移",
            ]
          },
          {
            "status": "提交试听课信息",
            "id": 55,
            "value": "submitInfo",
            "detail": [
              "跳转到排课页面"
            ]
          },
          {
            "status": "支付",
            "id": 56,
            "value": "openChannel",
            "detail": [
              "打开支付渠道"
            ]
          },

          {
            "status": "A",
            "id": 61,
            "value": "A",
            "detail": [
              "A"
            ]
          },
          {
            "status": "B",
            "id": 57,
            "value": "B",
            "detail": [
              "B"
            ]
          },
          {
            "status": "C",
            "id": 58,
            "value": "C",
            "detail": [
              "C"
            ]
          },
          {
            "status": "D",
            "id": 59,
            "value": "D",
            "detail": [
              "D"
            ]
          },
          {
            "status": "E",
            "id": 60,
            "value": "E",
            "detail": [
              "E"
            ]
          },
        ]
      }
    },
    methods: {
      show(leadsUuid, connectStatus) {
        this.leadsUuid = leadsUuid;
        // this.formItem.connectStatus = connectStatus;
        this.modal = true;
      },
      recordCallOk() {
        const _this = this;
        if (_this.showDetail == '' || _this.showStatus == '' || _this.showStatus == undefined || _this.showDetail == undefined) {
          this.$Message.error('请选择!');
        } else {
          if (_this.showDetail == '跳转到排课页面' || _this.showStatus == '提交试听课信息') {
            _this.$Modal.confirm({
              title: '',
              content: '确认修改为<span style="color:orangered;font-size:16px">' + _this.status + '</span>---<span style="color:orangered;font-size:16px">' + _this.showDetail + '</span>？',
              onOk: function () {
                _this.$axios.post(SCS().WaitFollowed.addCallState, {
                  leadsUuid: _this.leadsUuid,
                  callStatus: _this.showStatus,
                  callResult: _this.showDetail,
                  callDesc: ''
                }).then(() => {
                  _this.modal = false;
                  _this.cancel();
                  _this.$emit('reFresh');
                  sessionStorage.setItem('appointment_leadsUuid', _this.leadsUuid);
                  sessionStorage.setItem('appointment_parent_menu_name', '待跟进');
                  sessionStorage.setItem('appointment_parent_menu_url', '/scs/waitFollowed');
                  // window.location.hash = '/scs/appointment';
                  _this.$router.push('/scs/appointment')
                })
              }
            });
          } else {
            _this.$Modal.confirm({
              title: '',
              content: '确认修改为<span style="color:orangered;font-size:16px">' + _this.status + '</span>---<span style="color:orangered;font-size:16px">' + _this.showDetail + '</span>？',
              onOk: function () {
                _this.$axios.post(SCS().WaitFollowed.addCallState, {
                  leadsUuid: _this.leadsUuid,
                  callStatus: _this.showStatus,
                  callResult: _this.showDetail,
                  callDesc: ''
                }).then(() => {
                  _this.modal = false;
                  _this.cancel();
                  _this.$emit('reFresh');
                })
              }
            });
          }
        }
      },
      cancel() {
        this.showDetail = '';
        this.showStatus = '';
        this.status = '';
      },
      // changeConnectStatus(value) {
      //   const _this = this;
      //   if (value.indexOf('giveup') !== -1) {
      //     this.isGiveup = true;
      //     this.$axios.get(SCS().WaitFollowed.giveUpType,{
      //     }).then( ({data}) => {
      //       _this.errorsStatusList = data.data || [];
      //     })
      //   } else {
      //     this.isGiveup = false;
      //   }
      //   this.formItem.connectStatus = value;
      // },
      // selectStatus(value){
      //   console.log(1);
      //   // console.log(value);
      //   const _this = this;
      //   // this.details = [];
      //   // _this.formItem.detail = '';
      //   this.area.forEach(function (item,index) {
      //     if(item.value == value){
      //       _this.details = item.detail;
      //       // console.log(item.value);
      //       // console.log(_this.detail);
      //       _this.formItem.detail=_this.details[0];
      //       // _this.formItem.detail = '';
      //     }
      //   })
      // },
      changeMenu(status, value, detail) {
        if (this.arrayData.length > 1) {
          this.arrayData = []
        }
        this.status = status
        this.arrayData.push(value)
        this.arrayData.push(detail)
        this.showStatus = this.arrayData[0];
        this.showDetail = this.arrayData[1];
      }
    }
  };
</script>

<style>

</style>
