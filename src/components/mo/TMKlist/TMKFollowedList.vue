<template>
  <div>
    <o-breadcrumb second="市场与运营" third="TMK跟进名单"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <i-input v-model="Search.paramStr" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="学生\手机号" style="width:150px;margin-right: 2px;"></i-input>
          <!--<i-input v-model="Search.channelLevel" @on-keyup.enter="searchForm" size="small" placeholder="渠道等级" style="width:150px;margin-right: 2px;" clearable></i-input>-->
          <i-select v-model="Search.channelLevel" :size="$store.state.searchModuleSize" placeholder="渠道等级" style="width:172px" clearable>
            <i-option v-for="(item,index) in channelLevelList" :key='index' :value="item">{{ item }}</i-option>
          </i-select>
          <i-select v-model="Search.channelName" :size="$store.state.searchModuleSize" filterable clearable placeholder="渠道名称" style="width:150px;">
            <i-option v-for="(item,index) in allChannelList" :key='index' :value="item.uuid">{{ item.name }}</i-option>
          </i-select>
          <i-input v-model="Search.ccParam" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="所属CC姓名/手机号"
                   style="width:150px;margin-right: 2px;"></i-input>
          <i-select v-model="Search.teamName" :size="$store.state.searchModuleSize" filterable clearable placeholder="所属团队" style="width:150px;">
            <i-option v-for="(item,index) in allTeamList" :key='index' :value="item.uuid">{{ item.name }}</i-option>
          </i-select>
          <Date-picker type="daterange" :size="$store.state.searchModuleSize" placement="bottom-end" @on-change="changeSingupDate"
                       placeholder="标记时间" style="width: 200px"></Date-picker>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="search" @click="searchForm(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
      <checkbox label="signUpCount">预约次数</checkbox>
      <checkbox label="channelLevel">渠道等级</checkbox>
      <checkbox label="channelName">渠道名称</checkbox>
      <checkbox label="phone">手机号</checkbox>
      <checkbox label="grade">年级</checkbox>
      <checkbox label="subject">试听科目</checkbox>
      <checkbox label="remarkContent">最新跟进记录</checkbox>
      <checkbox label="signupDate">报名时间</checkbox>
      <checkbox label="markDate">标记时间</checkbox>
      <checkbox label="ccName">所属CC</checkbox>
      <checkbox label="teamName">所属团队</checkbox>
    </checkbox-group>
    <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data" @on-sort-change='sort' @on-selection-change="selectRow"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
    <add-remark ref="addremark" @reFresh="reFresh" :history-remark-list="historyRemarkList"></add-remark>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {TIANRUN} from 'common/api/tianrun.js';
  import {SCS} from 'common/api/scs.js';
  import {MO} from 'common/api/mo.js';
  import {ANLAI} from 'common/api/anlai.js';
  import addRemark from './addRemark';
  import {formateDate,common,hideCharAtNumber,getFullPhone} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';
  const $localStorage = $.localStorage;
  export default{
    data() {
      return {
        data: [],
        historyRemarkList: [],  //历史备注列表
        tableColumnsChecked:['signUpCount','channelLevel','channelName','phone','grade','subject',
          'remarkContent','signupDate','markDate','ccName','teamName','action'],
        total: 0,
        pageIndex: 1,
        orderBy:'',
        sortBy:'',
        pageNumber: SCREEN_SIZE === 'md' ? 11: 17,
        currentRowData: {},
        Search: {
          paramStr:'',
          ccParam:'',
          teamName: '',
          channelName:'',
          channelLevel:'',
          startDate:'',
          endDate:'',
        },
        channelLevelList:[],
        allChannelList:[],
        allTeamList:[],
        selectionRowData: [],
        columns: []
      }
    },
    mounted() {
      this.getAllChannel();
      this.getAllChannelLevel();
      this.getAllTeam();
      this.searchForm();
      this.changeTableColumns();
    },
    methods: {
      // 获取渠道等级
      getAllChannelLevel(){
        const _this = this;
        common.ajax({
          url: COMMON_API().allChannelLevel,
          method: 'get',
          success: function(response){
            _this.channelLevelList = response.data || []
          }
        });
      },
      // 获取所有渠道
      getAllChannel(){
        const _this = this;
        common.ajax({
          url: COMMON_API().allChannel,
          method: 'get',
          success: function(response){
            _this.allChannelList = response.data || [];
          }
        });
      },
      // 获取cc团队
      getAllTeam(){
        const _this = this;
        common.ajax({
          url: COMMON_API().ccTeamList,
          method: 'get',
          success: function(response){
            console.log(response.data);
            _this.allTeamList = response.data || [];
          }
        });
      },
      getTableColumns () {
        const columns = {
          index: {
            type: 'index',
            width: 40,
            align: 'center',
            fixed: 'left'
          },
          name: {
            title: '学生姓名',
            key: 'name',
            width: 90,
            fixed: 'left',
            align: 'center',
          },
          signUpCount: {
            title: '预约次数',
            key: 'signUpCount',
            width: 90,
            align: 'center',
          },
          channelLevel: {
            title: '渠道等级',
            align: 'center',
            key: 'level',
            width: 90
          },
          channelName: {
            title: '渠道名称',
            align: 'center',
            key: 'channelName',
            width: 90
          },
          phone: {
            title: '手机号',
            key: 'phone',
            align: 'center',
            width: 180,
            render:(h, params) => {
              if (params.row.phone) {
                return h('div', [
                  h('span', hideCharAtNumber(params.row.phone)),
                  h('i', {
                    style: {
                      margin: '2px'
                    },
                    attrs: {
                      class: 'ivu-icon ivu-icon-eye',
                      title: '显示完整号码'
                    },
                    style: {
                      fontSize: '18px',
                      verticalAlign: 'top',
                      cursor: 'pointer',
                      margin: '1px'
                    },
                    on: {
                      click: () => {
                        this.getFullPhone(params.row.phone)
                      }
                    }
                  }),
                  h('Button', {
                    style: {
                      margin: '2px',
                      display: this.$store.state.callPhoneIsOn
                    },
                    props:{
                      size:'small',
                    },
                    attrs: {
                      type:'info',
                      icon:'android-call',
                      title: '融营拨打电话'
                    },
                    on: {
                      click: () => {
                        this.callPhone(params.row.phone,params.row.channelUuid)
                      }
                    }
                  }),
                  h ('Button', {
                    style: {
                      margin: '2px',
                      display: this.$store.state.callPhoneIsOn
                    },
                    props: {
                      size: 'small',
                    },
                    attrs: {
                      type: 'default',
                      icon: 'android-call',
                      title: '天润拨打电话'
                    },
                    on: {
                      click: () => {
                        this.callTianRunPhone (params.row.phone)
                      }
                    }
                  })
                  // h ('Button', {
                  //   style: {
                  //     margin: '2px'
                  //   },
                  //   props: {
                  //     size: 'small',
                  //   },
                  //   attrs: {
                  //     type: 'success',
                  //     icon: 'android-call',
                  //     title: '安莱拨打电话'
                  //   },
                  //   on: {
                  //     click: () => {
                  //       this.callAnLaiPhone (params.row.phone)
                  //     }
                  //   }
                  // })
                ])
//            return hideCharAtNumber(row.phone) + ` <Icon type="eye" @click="getFullPhone('${row.phone}')" class="eye" title="显示完整号码"></Icon>
//                 <Icon type="android-call" @click="callPhone('${row.phone}')" class="call" title="拨打电话"></Icon>`;
              } else {
                return '-';
              }
            },
          },
          grade: {
            title: '年级',
            align: 'center',
            key: 'grade',
            width: 80
          },
          subject: {
            title: '试听科目',
            key: 'subject',
            align: 'center',
            width: 100
          },
          remarkContent: {
            title: '最新跟进记录',
            key: 'remarkContent',
            align: 'center',
            width: 300,
            render (h,params) {
              let content = params.row.remarkContent;
              if (content && content.length > 62) {
                content = content.slice(0, 61) + '...';
                return h('div',[
                  h('span',{
                    attrs:{
                      title:params.row.remarkContent
                    }
                  },content)
                ])
//                return `<span title="${row.remarkContent}">${content}</span>`;
              } else {
                return h('span',content);
              }
            }
          },
          signupDate: {
            title: '报名时间',
            key: 'signupDate',
            align: 'center',
            width: 180,
            sortable: true,
            render(h, params) {
              return h('span',formateDate(params.row.signupDate, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          markDate: {
            title: '标记时间',
            key: 'tmkSignTime',
            align: 'center',
            width: 180,
            sortable: true,
            render(h, params) {
              return h('span',formateDate(params.row.tmkSignTime, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          ccName: {
            title: '所属CC',
            key: 'ccName',
            align: 'center',
            width: 100
          },
          teamName: {
            title: '所属团队',
            key: 'teamName',
            align: 'center',
            width: 100
          },
          action: {
            title: '操作',
            key: 'action',
            width: 120,
            align: 'center',
            fixed: 'right',
            render: (h, params) => {

              return h('div', [
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small',
                    icon: 'edit',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs: {
                    title: '备注'
                  },
                  on: {
                    click: () => {
                      this.addRemark(params.row.phone,params.row.leadsUuid)
                    }
                  }
                }, '添加备注')
              ])
//              return `<i-button type="info" size="small" icon="edit" title="备注" @click="addRemark('${row.phone}')">添加备注</i-button>`;
            }
          }
        };
        let datas = [columns.index, columns.name,];
        this.tableColumnsChecked.forEach(col => datas.push(columns[col]));
        return datas;
      },
      sort(value){
        if(value.order == 'normal'){
          this.sortBy = ''
          this.orderBy = ''
        }else {
          this.sortBy = value.order
          this.orderBy = 'signupDate'
        }
        this.searchForm();
      },
      priorityFollow(flag) {
        const that = this;
        let row = this.selectionRowData;
        let url = SCS().WaitFollowed.priorityFollow;
        let text = (flag === 'cancel') ? '取消' : '标记';
        if (flag === 'cancel') {
          url = SCS().WaitFollowed.cancelPriorityFollow;
        }
        if (row.length === 0) {
          common.notice('提示', '请选择一条数据', 'warning');
        } else if (row.length > 1) {
          common.notice('提示', '一次只能操作一条数据', 'warning');
        } else {
          this.$Modal.confirm({
            title: '确认',
            content: '学生<span class="required">【' + row[0].name + '】</span>确认要【' + text + '优先跟进】吗？',
            onOk: function () {
              common.ajax({
                url: url,
                data: {leadsUuid: row[0].uuid},
                success: function (res) {
                  common.notices('操作成功！');
                  that.searchForm();
                }
              });
            }
          });
        }
      },
      // callAnLaiPhone(phone){
      //   let anLaiAccout = $localStorage.get('anLaiAccout');
      //   if (anLaiAccout) {
      //     common.ajax({
      //       url: ANLAI().CallPhone.call,
      //       data: {
      //         userLogin: anLaiAccout.userLogin,
      //         userPass: anLaiAccout.userPass,
      //         phoneLogin: anLaiAccout.phoneLogin,
      //         phonePass: anLaiAccout.phonePass,
      //         phoneNumber: phone,
      //       },
      //       success(res) {
      //         common.msg('拨打成功', 'success');
      //       }
      //     });
      //   } else {
      //     common.msg('未登录安莱账号！！！', 'error');
      //   }
      // },
      callTianRunPhone (phone) {
        this.$axios.post (TIANRUN ().Call.outCall, {
          phone: phone,
        }).then (() => {
          common.msg ('拨打成功', 'success');
        })
      },
      callPhone(phone,channelUuid) {
        let user = $localStorage.get('user');
        if (user && user.uuid ) {
          this.$axios.post (COMMON_API ().Phone.RYcallPhone, {
            toPhone: phone,
            uuid: user.uuid,
            channelUuid: channelUuid||'',
          }).then (() => {
            common.msg ('拨打成功', 'success');
          })
        }else{
          common.msg('拨打失败，请重新登录', 'error');
        }
      },
      getFullPhone(phone) {
        getFullPhone(phone, COMMON_API().getPhoneHZ);
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        let paramStr = this.Search.paramStr,ccParam = this.Search.ccParam, name = '', phone = '',ccName = '',ccPhone = '';
        if(!paramStr) paramStr = '';
        if(!ccParam) ccParam = '';
        if (isNaN(paramStr)) {
          name = paramStr;
        } else {
          phone = paramStr;
        }
        if (isNaN(ccParam)) {
          ccName = ccParam;
        } else {
          ccPhone = ccParam;
        }
        this.loadDataGrid({
          name: name,
          phone: phone,
          level: this.Search.channelLevel,
          channelUuid:this.Search.channelName,
          ccName:ccName,
          ccPhone:ccPhone,
          teamUuid:this.Search.teamName,
          tmkSignupStartDate: this.Search.startDate,
          tmkSignupEndDate: this.Search.endDate,
        });
      },
      loadDataGrid(search, orderBy = this.orderBy, sortBy = this.sortBy) {
        let param = `?name=${search.name}&phone=${search.phone}&level=${search.level}&channelUuid=${search.channelUuid}&ccName=${search.ccName}&ccPhone=${search.ccPhone}&teamUuid=${search.teamUuid}&tmkSignupStartDate=${search.tmkSignupStartDate}&tmkSignupEndDate=${search.tmkSignupEndDate}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortType=${sortBy}`;
        const that = this;
        common.ajax({
          url: MO().TMK.getTmkWaitRemark + param,
          method: 'get',
          success: function(response){
            console.log(response);
            that.data = response.data.tmkleads;
            that.total = response.data.total;
          }
        });
      },
      addRemark(phone,leadsUuid) {
        let param = "?leadsPhone=" + phone+'&leadsUuid='+leadsUuid;
        const that = this;
        common.ajax({
          url: SCS().WaitFollowed.historyRemark + param,
          method: 'get',
          success: function (response) {
            that.historyRemarkList = response.data || [];
            that.total = response.data.total;
          }
        });
        this.$refs.addremark.show(phone,leadsUuid);
      },
      appointment(uuid) {
        sessionStorage.setItem('appointment_leadsUuid', uuid);
        sessionStorage.setItem('appointment_parent_menu_name', '待跟进');
        sessionStorage.setItem('appointment_parent_menu_url', '/waitFollowed/manager');
        window.location.hash = '/scs/appointment';
      },
      selectRow(selection) {
        this.selectionRowData = selection;
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      changeSingupDate(value) {
        this.Search.startDate = value[0] || '';
        this.Search.endDate = value[1] || '';
      },
      changeTableColumns () {
        this.columns = this.getTableColumns();
      },
      reFresh(){
        this.searchForm();
      }
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470 : '';
      }
    },
    components: {
      OBreadcrumb, addRemark,PageModel
    }
  };
</script>

<style scoped>
  .ivu-table .demo-table-error-row td {
    background-color: #f30 !important;
    color: #fff;
  }

  .ivu-table .demo-table-error-row td a {
    color: #fff;
  }
</style>
