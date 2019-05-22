<template>
<div>
  <div class="personal-center" v-show="!isShowEditPassword">
    <table class="onlyhi-table">
      <tr>
        <th width="100">姓名</th>
        <td>{{name}}</td>
      </tr>
      <tr>
        <th>手机号</th>
        <td>{{phone}}</td>
      </tr>
      <tr>
        <th>部门</th>
        <td>{{organizationName}}</td>
      </tr>
      <tr>
        <th>团队</th>
        <td>{{teamName}}</td>
      </tr>
      <tr>
        <th>职位</th>
        <td>{{postName}}</td>
      </tr>
      <tr>
        <th>工作时间</th>
        <td>
          <ul>
            <li>
              <span>周一</span>
              <div class="item">
                <i-select v-model="Week.weekDay1.startTime" :disabled="Week.weekDay1.disbaled1" style="width:90px">
                  <i-option v-for="(item,index) in timeList" :key='index' :value="item.value">{{ item.value }}</i-option>
                </i-select>
              </div>至
              <div class="item">
                <i-select v-model="Week.weekDay1.endTime" :disabled="Week.weekDay1.disbaled1" style="width:90px">
                  <i-option v-for="(item,index) in timeList" :key='index' :value="item.value">{{ item.value }}</i-option>
                </i-select>
              </div>
              <div class="item">
                <i-button type="ghost" v-show="Week.weekDay1.disbaled1" @click="editWorkTime(1)" >编辑</i-button>
                <i-button type="primary" v-show="!Week.weekDay1.disbaled1" @click="saveWorkTime(1,'周一')" >保存</i-button>
              </div>
            </li>
            <li>
              <span>周二</span>
              <div class="item">
                <i-select v-model="Week.weekDay2.startTime" :disabled="Week.weekDay2.disbaled2" style="width:90px">
                  <i-option v-for="(item,index) in timeList" :key='index' :value="item.value">{{ item.value }}</i-option>
                </i-select>
              </div>至
              <div class="item">
                <div class="item">
                  <i-select v-model="Week.weekDay2.endTime" :disabled="Week.weekDay2.disbaled2" style="width:90px">
                    <i-option v-for="(item,index) in timeList" :key='index' :value="item.value">{{ item.value }}</i-option>
                  </i-select>
                </div>
              </div>
              <div class="item">
                <i-button type="ghost" v-show="Week.weekDay2.disbaled2" @click="editWorkTime(2)">编辑</i-button>
                <i-button type="primary" v-show="!Week.weekDay2.disbaled2" @click="saveWorkTime(2,'周二')" >保存</i-button>
              </div>
            </li>
            <li>
              <span>周三</span>
              <div class="item">
                <i-select v-model="Week.weekDay3.startTime" :disabled="Week.weekDay3.disbaled3" style="width:90px">
                  <i-option v-for="(item,index) in timeList" :key='index' :value="item.value">{{ item.value }}</i-option>
                </i-select>
              </div>至
              <div class="item">
                <div class="item">
                  <i-select v-model="Week.weekDay3.endTime" :disabled="Week.weekDay3.disbaled3" style="width:90px">
                    <i-option v-for="(item,index) in timeList" :key='index' :value="item.value">{{ item.value }}</i-option>
                  </i-select>
                </div>
              </div>
              <div class="item">
                <i-button type="ghost" v-show="Week.weekDay3.disbaled3" @click="editWorkTime(3)">编辑</i-button>
                <i-button type="primary" v-show="!Week.weekDay3.disbaled3" @click="saveWorkTime(3,'周三')" >保存</i-button>
              </div>
            </li>
            <li>
              <span>周四</span>
              <div class="item">
                <i-select v-model="Week.weekDay4.startTime" :disabled="Week.weekDay4.disbaled4" style="width:90px">
                  <i-option v-for="(item,index) in timeList" :key='index' :value="item.value">{{ item.value }}</i-option>
                </i-select>
              </div>至
              <div class="item">
                <i-select v-model="Week.weekDay4.endTime" :disabled="Week.weekDay4.disbaled4" style="width:90px">
                  <i-option v-for="(item,index) in timeList" :key='index' :value="item.value">{{ item.value }}</i-option>
                </i-select>
              </div>
              <div class="item">
                <i-button type="ghost" v-show="Week.weekDay4.disbaled4" @click="editWorkTime(4)">编辑</i-button>
                <i-button type="primary" v-show="!Week.weekDay4.disbaled4" @click="saveWorkTime(4,'周四')" >保存</i-button>
              </div>
            </li>
            <li>
              <span>周五</span>
              <div class="item">
                <i-select v-model="Week.weekDay5.startTime" :disabled="Week.weekDay5.disbaled5" style="width:90px">
                  <i-option v-for="(item,index) in timeList" :key='index' :value="item.value">{{ item.value }}</i-option>
                </i-select>
              </div>至
              <div class="item">
                <i-select v-model="Week.weekDay5.endTime" :disabled="Week.weekDay5.disbaled5" style="width:90px">
                  <i-option v-for="(item,index) in timeList" :key='index' :value="item.value">{{ item.value }}</i-option>
                </i-select>
              </div>
              <div class="item">
                <i-button type="ghost" v-show="Week.weekDay5.disbaled5" @click="editWorkTime(5)">编辑</i-button>
                <i-button type="primary" v-show="!Week.weekDay5.disbaled5" @click="saveWorkTime(5,'周五')">保存</i-button>
              </div>
            </li>
            <li>
              <span>周六</span>
              <div class="item">
                <i-select v-model="Week.weekDay6.startTime" :disabled="Week.weekDay6.disbaled6" style="width:90px">
                  <i-option v-for="(item,index) in timeList" :key='index' :value="item.value">{{ item.value }}</i-option>
                </i-select>
              </div>至
              <div class="item">
                <i-select v-model="Week.weekDay6.endTime" :disabled="Week.weekDay6.disbaled6" style="width:90px">
                  <i-option v-for="(item,index) in timeList" :key='index' :value="item.value">{{ item.value }}</i-option>
                </i-select>
              </div>
              <div class="item">
                <i-button type="ghost" v-show="Week.weekDay6.disbaled6" @click="editWorkTime(6)">编辑</i-button>
                <i-button type="primary" v-show="!Week.weekDay6.disbaled6" @click="saveWorkTime(6,'周六')">保存</i-button>
              </div>
            </li>
            <li>
              <span>周日</span>
              <div class="item">
                <i-select v-model="Week.weekDay7.startTime" :disabled="Week.weekDay7.disbaled7" style="width:90px">
                  <i-option v-for="(item,index) in timeList" :key='index' :value="item.value">{{ item.value }}</i-option>
                </i-select>
              </div>至
              <div class="item">
                <i-select v-model="Week.weekDay7.endTime" :disabled="Week.weekDay7.disbaled7" style="width:90px">
                  <i-option v-for="(item,index) in timeList" :key='index' :value="item.value">{{ item.value }}</i-option>
                </i-select>
              </div>
              <div class="item">
                <i-button type="ghost" v-show="Week.weekDay7.disbaled7" @click="editWorkTime(7)">编辑</i-button>
                <i-button type="primary" v-show="!Week.weekDay7.disbaled7" @click="saveWorkTime(7,'周日')">保存</i-button>
              </div>
            </li>
          </ul>
        </td>
      </tr>
      <tfoot>
      <tr>
        <td></td>
        <td><i-button type="ghost" id="editPasswordBtn" @click="isShowEditPassword = true">修改密码</i-button></td>
      </tr>
      </tfoot>
    </table>
  </div>

  <div class="edit-password" v-show="isShowEditPassword">
    <i-form ref="formValidate" :model="user" :rules="ruleValidate" :label-width="120">
      <Form-item label="原始密码" prop="oldPassword">
        <i-input type="password" v-model="user.oldPassword" placeholder="原始密码" style="width:500px;">
          <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </i-input>
      </Form-item>
      <Form-item label="新密码" prop="newPassword">
        <i-input type="password" v-model="user.newPassword" placeholder="8~20个字符，字母、数字和标点符号至少包含两种，不区分字母大小写" style="width:500px;">
          <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </i-input>
      </Form-item>
      <Form-item label="再次输入密码" prop="confirmPassword">
        <i-input type="password" v-model="user.confirmPassword" placeholder="请与第一次输入保持一致" style="width:500px;">
          <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </i-input>
      </Form-item>
      <Form-item>
        <i-button type="primary" @click="handleSubmit('formValidate')">保存</i-button>
        <i-button type="ghost" @click="isShowEditPassword = false">关闭</i-button>
      </Form-item>
    </i-form>
  </div>

</div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API,AUTHORITY_API} from 'common/api.config.js';
  import {common} from 'common/js/common.js';

  const storage = $.localStorage;
  export default{
    data() {
      let validatePassword = (rule, value, callback) => {
        if (value.length < 8) {
          callback(new Error('密码必须是8~20个字符，字母、数字和特殊符号至少包含两种'));
        } else if (!/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/.test(value)) {
          callback(new Error('密码必须是8~20个字符，字母、数字和特殊符号至少包含两种'));
        } else {
          callback();
        }
      };
      let validateConfirmPassword = (rule, value, callback) => {
        if (this.user.newPassword !== value) {
          callback(new Error('确认密码与新密码不一致'));
        } else {
          callback();
        }
      };
      return {
        isShowEditPassword: false,
        name: '',
        phone: '',
        organizationName: '',
        teamName: '',
        postName: '',
        startTime: '09:00',
        endTime: '09:00',
        user: {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        },
        Week: {
        	weekDay1: {
            disbaled1: true,
            startTime: '',
            endTime: ''
          },
          weekDay2: {
            disbaled2: true,
            startTime: '',
            endTime: ''
          },
          weekDay3: {
            disbaled3: true,
            startTime: '',
            endTime: ''
          },
          weekDay4: {
            disbaled4: true,
            startTime: '',
            endTime: ''
          },
          weekDay5: {
            disbaled5: true,
            startTime: '',
            endTime: ''
          },
          weekDay6: {
            disbaled6: true,
            startTime: '',
            endTime: ''
          },
          weekDay7: {
            disbaled7: true,
            startTime: '',
            endTime: ''
          }
        },
        ruleValidate: {
          oldPassword: [
            {required: true, message: '请填写原始密码', trigger: 'blur'}
          ],
          newPassword: [
            {required: true, validator: validatePassword, trigger:'change'}
          ],
          confirmPassword: [
            {required: true, validator: validateConfirmPassword, trigger: ['blur', 'change']},
          ]
        },
        timeList: []
      }
    },
    mounted() {
      const _this = this;
      common.ajax({
        url: COMMON_API().getUserBaseinfo,
        method: 'get',
        success: function (res) {
          _this.name = res.data.name;
          _this.phone = res.data.phone;
          _this.organizationName = res.data.organizationName;
          _this.teamName = res.data.teamName;
          _this.postName = res.data.postName;
        }
      });
      $.getJSON("static/data.json", function (json) {
        _this.timeList = json.courseRangTimes30;
      });
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;

            let userName = storage.get("user").loginName
            let time = new Date().getTime();
            let pw0 = sha512(userName + "&" + _this.user.oldPassword + ":onlyhi");
            let pw1 = sha512(userName + "&" + _this.user.newPassword + ":onlyhi");
            let pw2 = sha512(userName + "&" + _this.user.confirmPassword + ":onlyhi");
            common.ajax({
              url: COMMON_API().editUserPassword,
              data: {
                oldPassword: sha512(pw0 + time),
                timestamp: time,
                newPassword: pw1,
                confirmPassword: pw2
//                oldPassword: _this.user.oldPassword,
//                newPassword: _this.user.newPassword,
//                confirmPassword: _this.user.confirmPassword




              },
              success: function (response) {
                _this.$Modal.info({
                  title: '操作成功',
                  content: '修改密码后需要重新用新密码登录',
                  okText: '重新登录',
                  onOk: function () {
                    GLOBAL.logout();
                  }
                });
              }
            });
          }
        });
      },
      editWorkTime(index) {
        this.Week['weekDay'+index]['disbaled'+index] = !this.Week['weekDay'+index]['disbaled'+index];
      },
      saveWorkTime(index, weekDay) {
      	let startTime = this.Week['weekDay'+index]['startTime'];
      	let endTime = this.Week['weekDay'+index]['endTime'];
      	if(startTime === '' || endTime === ''){
      		common.msg('请选择时间！');
        }else{
          const _this = this;
          common.ajax({
            url: AUTHORITY_API().SystemUser.saveWorkingTime,
            data: {
              weekDay: weekDay,
              startTime: startTime,
              endTime: endTime,
            },
            success(res){
              common.notices('操作成功！');
            }
          });
        }
      }
    }
  };
</script>

<style scoped>
.onlyhi-table {border: none;}
.onlyhi-table tr:hover {background: none;}
.onlyhi-table td { text-align: left;}
.onlyhi-table tr:last-child td { border-bottom: none;height: 80px;}
.onlyhi-table li span {
  padding-right: 5px;
}
.onlyhi-table .item {
  display: inline-block;
  width: 95px;
}
</style>
