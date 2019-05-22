<template>
  <div>
    <o-breadcrumb second="分配管理" third="TMK名单分配"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="4">
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="plus" @click="showAdd">导入</i-button>
          <i-button v-if="assign" type="primary" :size="$store.state.searchModuleSize" icon="paper-airplane" @click="showSalesModal">批量分配</i-button>
          <i-button v-if="assign" type="primary" :size="$store.state.searchModuleSize" icon="ios-" @click="showAIAdd">导入AI拨打结果</i-button>
        </i-col>
        <i-col span="20" class="right">
          <!--<Checkbox v-model="Search.signStatus">S名单</Checkbox>-->
          <i-input v-model="Search.nameAndPhoneValue" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="学生姓名 \ 手机号码" style="width:150px;margin-right: 2px;"></i-input>
          <!--<i-input v-model="Search.ccName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="cc姓名" style="width:150px;margin-right: 2px;"></i-input>-->
          <i-input v-model="Search.tmkFollowUser" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="跟进人姓名" style="width:150px;margin-right: 2px;"></i-input>
          <i-select v-model="Search.channelLevel" :size="$store.state.searchModuleSize" placeholder="渠道等级" style="width:172px" clearable>
            <i-option v-for="(item,index) in channelLevelList" :key='index' :value="item">{{ item }}</i-option>
          </i-select>
          <i-select v-model="Search.followResult" :size="$store.state.searchModuleSize" placeholder="跟进状态" style="width:172px" clearable>
            <i-option v-for="(item,index) in followResultList" :key='index' :value="item.followResult">{{item.followContent}}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.subject" clearable placeholder="科目" style="width:200px">
            <i-option v-for="(item,index) in subjectList" :key='index' :value="item">{{ item }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.grade" clearable placeholder="年级" style="width:80px;">
            <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.sourse" clearable placeholder="名单来源" style="width:150px;">
            <i-option :value="1">新名单</i-option>
            <i-option :value="2">藏经阁</i-option>
            <i-option :value="3">离职leads名单</i-option>
          </i-select>
          <Date-picker type="daterange" ref="classDate" :size="$store.state.searchModuleSize" placement="bottom-end" @on-change="setUpTime" placeholder="报名时间" style="width: 200px"></Date-picker>
          <Date-picker type="daterange" ref="followDate" :size="$store.state.searchModuleSize" placement="bottom-end" @on-change="followTime" placeholder="跟进时间" style="width: 200px"></Date-picker>
          <!--<Date-picker type="daterange" ref="classDates" :size="$store.state.searchModuleSize" placement="bottom-end" @on-change="changeGiveUpTime" placeholder="放弃时间" style="width: 200px"></Date-picker>-->
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索</i-button>
          <i-button :size="$store.state.searchModuleSize" type="ghost" @click="clearSearchForm">重置</i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" highlight-row stripe :columns="columns" :data="data" @on-selection-change="getSelections" @on-select-all="getSelectionAll"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    </div>
    <!--分配-->
    <select-distribution-person @reFresh="distributionFresh"  ref="sales" form-type="1"></select-distribution-person>
    <!--转cc-->
    <select-sales @reFresh="reFresh"  ref="ccs" form-type="1"></select-sales>
    <input type="file" id="fileInput" @change="onChangeFileOk" style="display: none;"/>
    <input type="file" id="fileInput2" @change="onChangeFileOk2" style="display: none;"/>
    <add-remark @reFresh="reFresh" ref='addremark' :historyRemarkList="historyRemarkList"></add-remark>
    <Modal
      v-model="importModal"
      :mask-closable="false"
      :closable="false"
      title="导入">
      <i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="90">
        <Form-item label="TMK主管：" prop="tmkManager">
          <i-select :size="$store.state.searchModuleSize" v-model="formItem.tmkManager"
                    clearable placeholder="请选择" style="width:160px;" @on-change="changeTmkManager" @on-clear="clearTmkManager">
            <i-option v-for="(item,index) in tmkManagerList" :key='index' :value="item.uuid">{{ item.userName }}</i-option>
          </i-select>
          <!--<i-button v-if="isImportBtnShow" type="primary" :size="$store.state.searchModuleSize" @click="showAdd">导入</i-button>-->
        </Form-item>
      </i-form>
      <div slot="footer" style="text-align: right">
        <i-button type="ghost" @click="cancel">关闭</i-button>
        <i-button type="success" @click="onOk('formValidate')">下一步</i-button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {MO} from 'common/api/mo.js';
  import {DISTRIBUTE} from 'common/api/distribute.js';
  import {formateDate,uploadAjax, common, clearSearchForm,hideCharAtNumber,getFullPhone} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import selectSales from './selectSales';
  import selectDistributionPerson from './selectDistributionPerson';
  import PageModel from 'dashborader/page/page.vue';
  import {TIANRUN} from 'common/api/tianrun.js';
  const $sStorage = $.sessionStorage;
  const $localStorage = $.localStorage;
  import {ANLAI} from 'common/api/anlai.js';
  import addRemark from 'components/distribution/tmkDistribution/addRemark';
  export default{
    data() {
      return {
        importModal:false,
        formItem:{
          tmkManager:''
        },
        ruleValidate: {
          tmkManager: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
        },
        isImportBtnShow:false,
        tmkManagerList:[],
        data: [],
        followResultList:[],
        historyRemarkList: [],  //历史备注列表
        total: 0,
        flag: '',
        assign: false,
        pageIndex: 1,
        pageNumber: 15,
        selectionRows: [],
        selectionCcRows: [],
        subjectList:[],//获取科目
        channelLevelList:[],
        gradeList: [],
        Search: {
          // signStatus: false,
          nameAndPhoneValue: '',
          // startGiveUpDate: '',
          // endGiveUpDate: '',
          signUpStartDate: '',
          signUpEndDate: '',
          followTimeStart: '',
          followTimeEnd: '',
          // createStartDate: '',
          // createEndDate: '',
          oldUserName:'',
          channelLevel:'',
          followResult:'',
          subject:'',//科目
          grade:'',//年级
          sourse:'',//
          ccName:'',
          tmkFollowUser:'',
        },
        columns: [
          {
            type: 'selection',
            minWidth: 60,
            align: 'center',
            fixed:'left',
          },
          {
            title: '学生',
            key: 'name',
            align: 'center',
            fixed:'left',
            sortable: true,
            minWidth: 90,
            render : (h, params) => {
              return h('div',[
                h('a',{
                  on:{
                    click:()=>{
                      GLOBAL.viewLeadsDetail(params.row.uuid)
                    }
                  }
                },params.row.name)
              ])
            }
          },
          {
            title: '手机号',
            align: 'center',
            key: 'phone',
            minWidth: 240,
            // render(h, params) {
            //   return h('span', hideCharAtNumber(params.row.phone));
            // }
            render : (h, params) => {
              if(params.row.phone) {
                return h('div',[
                  h('span',hideCharAtNumber(params.row.phone)),
                  h('Button', {
                    style: {
                      margin: '2px',
                      marginLeft:'2px'
                    },
                    props:{
                      size:'small',
                    },
                    attrs: {
                      type:'success',
                      icon:'eye',
                      title: '显示完整号码'
                    },
                    on: {
                      click: () => {
                        this.getFullPhone(params.row.phone)
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
                  }),
                  // h('Button', {
                  //   style: {
                  //     margin: '2px',
                  //     marginLeft:'2px'
                  //   },
                  //   props:{
                  //     size:'small',
                  //   },
                  //   attrs: {
                  //     type:'success',
                  //     icon:'android-call',
                  //     title: '安莱拨打电话'
                  //   },
                  //   on: {
                  //     click: () => {
                  //       this.callAnLaiPhone(params.row.phone)
                  //     }
                  //   }
                  // }),
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
                  h('Button', {
                    style: {
                      margin: '2px',
                      display: this.$store.state.callPhoneIsOn
                    },
                    props:{
                      size:'small',
                    },
                    attrs: {
                      type:'primary',
                      icon:'android-call',
                      title: 'axn融营拨打电话'
                    },
                    on: {
                      click: () => {
                        this.axnCallPhone(params.row.phone,params.row.channelUuid)
                      }
                    }
                  }),
                ])
              }else{
                return '-';
              }
            }
          },
          {
            title: '号码归属地',
            align: 'center',
            key: 'phoneLocation',
            minWidth: 120,
          },
          {
            title: '科目',
            align: 'center',
            key: 'subject',
            minWidth: 90,
          },
          {
            title: '年级',
            align: 'center',
            key: 'grade',
            minWidth: 90,
          },
          {
            title: '渠道名称',
            align: 'center',
            key: 'channelName',
            minWidth: 120,
          },
          // {
          //   title: 'leads创建时间',
          //   align: 'center',
          //   key: 'leadsCreateDate',
          //   minWidth: 150,
          //   render(h, params) {
          //     return h('span',formateDate(params.row.leadsCreateDate,'yyyy-MM-dd hh:mm:ss'));
          //   }
          // },
          {
            title: '报名时间',
            align: 'center',
            key: 'signUpDate',
            minWidth: 150,
            render(h, params) {
              return h('span',formateDate(params.row.signUpDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '跟进记录',
            align: 'center',
            key: 'tmkFollowDesc',
            minWidth: 120,
          },
          {
            title: '跟进状态',
            align: 'center',
            key: 'tmkFollowResult',
            minWidth: 120,
          },
          {
            title: '名单来源',
            align: 'center',
            key: 'sourse',
            minWidth: 120,
            render(h, params) {
              if(params.row.sourse === 1) {
                return h('span','新名单')
              } else if(params.row.sourse === 2) {
                return h('span','藏经阁导入')
              } else if(params.row.sourse === 3) {
                return h('span','离职人员名单导入')
              } else {
                return h('span','未知')
              }
            }
          },
          {
            title: '跟进时间',
            align: 'center',
            key: 'tmkFollowTime',
            minWidth: 150,
            render(h, params) {
              return h('span',formateDate(params.row.tmkFollowTime,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '跟进人',
            align: 'center',
            key: 'tmkFollowUser',
            minWidth: 90,
          },
          {
            title: '操作',
            align: 'center',
            minWidth: 150,
            render : (h, params) => {
              return h('div',[
                // h('Button',{
                //   props: {
                //     type: 'success',
                //     size: 'small',
                //     icon: 'refresh',
                //   },
                //   style: {
                //     margin: '2px',
                //   },
                //   attrs: {
                //     title: '转CC',
                //   },
                //   on: {
                //     click: () => {
                //       this.distributionCc(params.row.uuid)
                //     }
                //   }
                // }),
                // h('Button', {
                //   props: {
                //     type: 'primary',
                //     size: 'small',
                //     icon: 'paper-airplane',
                //   },
                //   style: {
                //     margin: '2px',
                //   },
                //   attrs: {
                //     title: '分配',
                //   },
                //   on: {
                //     click: () => {
                //       this.distribution(params.row.uuid)
                //     }
                //   }
                // }),
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small',
                    icon: 'ios-chatboxes',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs: {
                    title: '备注',
                  },
                  on: {
                    click: () => {
                      this.addRemark(params.row.phone,params.row.uuid)
                    }
                  }
                }),
              ])
            }
          }
        ]
      }
    },
    mounted() {
      this.getAllChannelLevel();
      let _this = this;
      this.$axios.get(COMMON_API().allSubject,{
      }).then( ({data}) => {
        _this.subjectList = data.data || [];
      })
      this.$axios.get(DISTRIBUTE().TmkDistribution.getAllTmkLeader,{
      }).then( ({data}) => {
        _this.tmkManagerList = data.data.userList || [];
      })
      $.getJSON("static/data.json", function (json) {
        _this.gradeList = json.gradeList;
      });
      // 获取跟进结果列表
      this.$axios.get(DISTRIBUTE().TmkDistribution.getLeadsFollow,{
      }).then( ({data}) => {
        console.log(data);
        this.followResultList = data.data || [];
      })
      this.searchForm();
    },
    methods: {
      callTianRunPhone (phone) {
        this.$axios.post (TIANRUN ().Call.outCall, {
          phone: phone,
        }).then (() => {
          common.msg ('拨打成功', 'success');
        })
      },
      // 融营拨打电话
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
      // axn拨打电话
      axnCallPhone(phone,channelUuid) {
        let user = $localStorage.get('user');
        if (user) {
          this.$axios.post (COMMON_API ().Phone.axnCallPhone, {
            callee: phone,
            // uuid: user.uuid,
            channelUuid: channelUuid||'',
          }).then (() => {
            common.msg ('拨打成功', 'success');
          })
        }else{
          common.msg('拨打失败，请重新登录', 'error');
        }
      },
      // 安莱拨打电话
      callAnLaiPhone(phone){
        let anLaiAccout = $localStorage.get('anLaiAccout');
        if (anLaiAccout) {
          this.$axios.post(ANLAI().CallPhone.call,{
            userLogin: anLaiAccout.userLogin,
            userPass: anLaiAccout.userPass,
            phoneLogin: anLaiAccout.phoneLogin,
            phonePass: anLaiAccout.phonePass,
            phoneNumber: phone,
          }).then( () => {
            common.msg('拨打成功', 'success');
          })
        } else {
          common.msg('未登录安莱账号！！！', 'error');
        }
      },
      // 添加备注
      addRemark(phone,uuid) {
        const app = this;
        this.$axios.get(DISTRIBUTE().TmkDistribution.getLeadsAssignRecordByLeadsUuid,{
          params:{
            leadsUuid: uuid,
          }
        }).then( ({data}) => {
          app.historyRemarkList = data.data.list;;
        })
        this.$refs.addremark.show(phone,uuid);
      },
      // 重置搜索框
      clearSearchForm() {
        clearSearchForm(this.Search,[this.$refs.classDate,this.$refs.classDates]);
      },
      // 获取渠道等级
      getAllChannelLevel(){
        const _this = this;
        this.$axios.get(COMMON_API().allChannelLevel,{
        }).then( ({data}) => {
          _this.channelLevelList = data.data || []
        })
      },
      // 批量分配
      // showSalesModal() {
      //   let app = this;
      //   app.flag = 'mul';
      //   app.$refs.sales.show(app.flag,'',app.Search);
      // },
      showSalesModal() {
        let app = this;
        app.flag = 'mul';
        let row = this.selectionRows;
        let uuids = [];
        console.log(row);
        if (row.length > 0) {
          row.forEach(function (item, index) {
            uuids.push(item.uuid)
          })
          // uuids = JSON.stringify(uuids)
          this.$refs.sales.show(app.flag,uuids);
        } else {
          common.msg('请选择名单','warning');
        }
      },
      // cc
      showCcModal() {
        let row = this.selectionCcRows;
        if (row.length > 0) {
          this.$refs.ccs.show();
        } else {
          common.msg('请选择名单','warning');
        }
      },
      distribution(leadsId) {
        let app = this;
        // app.selectionRows.length = 1;
        // app.selectionRows[0] =  {"uuid": leadsId};
        // $sStorage.set('selectionRows' ,app.selectionRows);
        app.flag = 'sig';
        // let row = app.selectionRows;
        // if (row.length > 0) {
        app.$refs.sales.show(app.flag,leadsId);
        // } else {
        //   common.msg('请选择名单','warning');
        // }
      },
      distributionCc(leadsIds) {
        this.selectionCcRows.length = 1;
        this.selectionCcRows[0] = {"uuid": leadsIds};
        $sStorage.set('selectionCcRows' ,this.selectionCcRows);
        this.showCcModal();
      },
      // moveRecover(uuid,name) {
      //   const _this = this;
      //   this.$Modal.confirm({
      //     title: '提示',
      //     content: '确认要将学生 <span class="c-red">'+name+'</span> 放入回收站吗？',
      //     onOk() {
      //       this.$axios.get(DISTRIBUTE().Leads.recycleLeads,{
      //         params:{
      //           leadsUuid: uuid,
      //         }
      //       }).then( () => {
      //         common.notices('操作成功');
      //         _this.searchForm();
      //       })
      //     }
      //   });
      // },
      searchForm(val) {
        if(val) this.pageIndex = val;
        let nameAndPhone = this.Search.nameAndPhoneValue;
        let name = '',phone = '';
        if(!nameAndPhone) nameAndPhone = '';
        if (isNaN(nameAndPhone)) {
          name = nameAndPhone;
        } else {
          phone = nameAndPhone;
        }
        this.loadDataGrid({
          name: name,
          phone: phone,
          // startGiveUpDate: this.Search.startGiveUpDate,
          // endGiveUpDate: this.Search.endGiveUpDate,
          signUpStartDate: this.Search.signUpStartDate,
          signUpEndDate: this.Search.signUpEndDate,
          followTimeStart: this.Search.followTimeStart,
          followTimeEnd: this.Search.followTimeEnd,
          // leads创建时间
          // createStartDate: this.Search.createStartDate,
          // createEndDate: this.Search.createEndDate,
		      oldUserName: this.Search.oldUserName,
          channelLevel: this.Search.channelLevel,
          followResult: this.Search.followResult,
          subject:this.Search.subject,
          grade: this.Search.grade,
          sourse: this.Search.sourse,
          ccName: this.Search.ccName,
          tmkFollowUser: this.Search.tmkFollowUser,
          // isRecommend: this.Search.isRecommend,
          // signStatus: this.Search.signStatus ? 1: 0
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        const _this = this;
        this.$axios.post(DISTRIBUTE().TmkDistribution.queryTmkLeadsPage,{
          name: search.name,
          phone: search.phone,
          // signStatus: search.signStatus,
          // startGiveUpDate: search.startGiveUpDate,
          // endGiveUpDate: search.endGiveUpDate,
          signUpStartDate: search.signUpStartDate,
          signUpEndDate: search.signUpEndDate,
          followTimeStart: search.followTimeStart,
          followTimeEnd: search.followTimeEnd,
          //leads创建时间
          // leadsCreateStartDate: search.createStartDate,
          // leadsCreateEndDate: search.createEndDate,
          oldUserName: search.oldUserName,
          channelLevel: search.channelLevel,
          followResult: search.followResult,
          subject: search.subject,
          grade: search.grade,
          sourse: search.sourse,
          ccName: search.ccName,
          tmkFollowUser: search.tmkFollowUser,
          // isRecommend: search.isRecommend,
          pageIndex: this.pageIndex,
          pageNumber: this.pageNumber,
          orderBy: orderBy,
          sortBy: sortBy,
        }).then( ({data}) => {
          _this.data = data.data['mtkLeadsList'] || [];
          _this.total = data.data.total;
          _this.assign = data.data.assign;
          if(data.code !== '100'){
            common.notices(data.code+":"+data.msg,'数据加载失败','error');
          }
        })
      },
      getSelections(selection) {
        $sStorage.set('selectionRows' ,selection);
        this.selectionRows = selection;
      },
      getSelectionAll(selection) {
        $sStorage.set('selectionRows' ,selection);
        this.selectionRows = selection;
        $sStorage.set('selectionCcRows' ,selection);
        this.selectionCcRows = selection;
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      // changeGiveUpTime(value) {
      //   this.Search.startGiveUpDate = value[0] || '';
      //   this.Search.endGiveUpDate = value[1] || '';
      // },
      setUpTime(value) {
        this.Search.signUpStartDate = value[0] || '';
        this.Search.signUpEndDate = value[1] || '';
      },
      followTime(value) {
        this.Search.followTimeStart = value[0] || '';
        this.Search.followTimeEnd = value[1] || '';
      },
      createTime(value) {
        // this.Search.createStartDate = value[0] || '';
        // this.Search.createEndDate = value[1] || '';
      },
      reFresh(){
        this.searchForm();
      },
      // 分配刷新
      distributionFresh(){
        this.selectionRows=[];
        // this.selectionCcRows=[];
        this.searchForm();
      },
      showAdd(){
        this.importModal = true
      },
      showAIAdd(){
        document.getElementById('fileInput2').click();
      },
      onChangeFileOk(event) {
        const _this = this;
        let fileInput = document.getElementById('fileInput');
        let files = fileInput.files[0];
        uploadAjax({
          url: DISTRIBUTE().TmkDistribution.importNewLeads,
          data: {
            "file": files,
            "userUuid":_this.formItem.tmkManager
          },
          success: function (res) {
            // console.log(1)
            event.target.value = '';
            common.notices(res.msg,'提示')
            _this.importModal = false
            _this.searchForm();
          }
        });
      },
      onChangeFileOk2(event) {
        const _this = this;
        let fileInput = document.getElementById('fileInput2');
        let files = fileInput.files[0];
        uploadAjax({
          url: DISTRIBUTE().TmkDistribution.importAiLeads,
          data: {
            "file": files,
          },
          success: function (res) {
            event.target.value = '';
            common.notices(res.msg,'提示')
            _this.searchForm();
          }
        });
      },
      getFullPhone(phone) {
        getFullPhone(phone, COMMON_API().getPhoneHZ);
      },
      // callPhone(phone) {
      //   let user = $localStorage.get('user');
      //   if (user && user.seatsNo) {
      //     this.$axios.post(COMMON_API().Phone.callPhone,{
      //       hotline: user.hotlinePhone,
      //       cno: user.seatsNo,//坐席号
      //       pwd: user.seatsPassword,
      //       phone: phone
      //     }).then( () => {
      //       common.msg('拨打成功', 'success');
      //     })
      //   } else {
      //     common.msg('座席号不存在', 'error');
      //   }
      // },
      changeTmkManager(value){
        if(value){
          this.isImportBtnShow = true
        }else{
          this.isImportBtnShow = false
        }
      },
      clearTmkManager(){
        this.isImportBtnShow = false
      },
      cancel(){
        this.importModal = false
        this.isImportBtnShow = false
        this.formItem.tmkManager = ''
      },
      onOk(name) {
        const _this = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            document.getElementById('fileInput').click();
          }
        });
      },
    },
    components: {OBreadcrumb,selectSales,selectDistributionPerson,PageModel,addRemark}
  };
</script>

<style scoped>

</style>
