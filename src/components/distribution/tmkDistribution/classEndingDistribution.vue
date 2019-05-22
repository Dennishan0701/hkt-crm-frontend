<template>
  <div>
    <o-breadcrumb second="分配管理" third="结课名单分配"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="4">
          <i-button v-if="assign" type="primary" :size="$store.state.searchModuleSize" icon="paper-airplane" @click="showSalesModal">批量分配</i-button>
          <!--<i-button type="primary" :size="$store.state.searchModuleSize" icon="plus" @click="showAdd">导入</i-button>-->
        </i-col>
        <i-col span="20" class="right">
          <!--<Checkbox v-model="Search.signStatus">S名单</Checkbox>-->
          <i-input v-model="Search.nameAndPhoneValue" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="学生姓名 \ 手机号码" style="width:150px;margin-right: 2px;"></i-input>
          <!--<i-input v-model="Search.ccName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="cc姓名" style="width:150px;margin-right: 2px;"></i-input>-->
          <i-input v-model="Search.tmkFollowUser" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="跟进人姓名" style="width:150px;margin-right: 2px;"></i-input>
          <i-select v-model="Search.channelLevel" :size="$store.state.searchModuleSize" placeholder="渠道等级" style="width:172px" clearable>
            <i-option v-for="(item,index) in channelLevelList" :key='index' :value="item">{{ item }}</i-option>
          </i-select>
          <i-select v-model="Search.isAssign" :size="$store.state.searchModuleSize" placeholder="是否分配" style="width:90px" clearable>
            <i-option :value="1">已分配</i-option>
            <i-option :value="0">未分配</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.subject" clearable placeholder="科目" style="width:200px">
            <i-option v-for="(item,index) in subjectList" :key='index' :value="item">{{ item }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.grade" clearable placeholder="年级" style="width:80px;">
            <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
          <!--<i-select :size="$store.state.searchModuleSize" v-model="Search.callStatus" clearable placeholder="拨打状态" style="width:120px;">-->
            <!--<i-option v-for="(item,index) in callStatusList" :key='index' :value="item.value">{{ item.status }}</i-option>-->
          <!--</i-select>-->
          <Date-picker type="daterange" ref="classDate" :size="$store.state.searchModuleSize" placement="bottom-end" @on-change="setUpTime" placeholder="报名时间" style="width: 200px"></Date-picker>
          <!--<Date-picker v-if="Search.isAssign==1" type="daterange" ref="distributeDate" :size="$store.state.searchModuleSize" placement="bottom-end" @on-change="distributeTime" placeholder="分配时间" style="width: 200px"></Date-picker>-->
          <!--<Date-picker type="daterange" ref="followDate" :size="$store.state.searchModuleSize" placement="bottom-end" @on-change="followTime" placeholder="跟进时间" style="width: 200px"></Date-picker>-->
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
    <add-remark @reFresh="reFresh" ref='addremark' :historyRemarkList="historyRemarkList"></add-remark>
    <Modal
      v-model="ccCallRecordModal"
      title="CC拨打记录"
      :closable="false"
      :mask-closable="false"
      :width=700
      @on-ok="ccCallRecordModal=false">
      <i-table size="small" highlight-row stripe :columns="ccCallRecordColumns" :data="ccCallRecordData" ></i-table>
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
  const $sStorage = $.sessionStorage;
  const $localStorage = $.localStorage;
  import {ANLAI} from 'common/api/anlai.js';
  import addRemark from 'components/distribution/tmkDistribution/addRemark';
  export default{
    data() {
      return {
        data: [],
        ccCallRecordData: [],
        ccCallRecordModal: false,
        ccCallRecordColumns:[
          {
            title: '拨打状态',
            align: 'center',
            key: 'callStatus',
            minWidth: 120,
            render(h, params) {
              if(params.row.callStatus ===  'create') {
                return h('span','新建')
              } else if(params.row.callStatus === 'wait') {
                return h('span','待拨打,待跟进')
              } else if(params.row.callStatus === 'noconnectwait') {
                return h('span','未接通,待跟进')
              } else if(params.row.callStatus === 'connectwait') {
                return h('span','已接通,待跟进')
              } else if(params.row.callStatus === 'successwait') {
                return h('span','已接通,同意排课')
              } else if(params.row.callStatus === 'noconnectgiveup') {
                return h('span','未接通,放弃')
              } else if(params.row.callStatus === 'connectgiveup') {
                return h('span','已接通,放弃')
              } else {
                return h('span','-')
              }
            }
          },
          {
            title: '拨打结果',
            align: 'center',
            key: 'callResult',
            minWidth: 120,
          },{
            title: '拨打人',
            align: 'center',
            key: 'userName',
            minWidth: 120,
          },{
            title: '拨打人',
            align: 'center',
            key: 'userName',
            minWidth: 120,
          },
          {
            title: '拨打时间',
            align: 'center',
            key: 'createDate',
            minWidth: 150,
            render(h, params) {
              return h('span',formateDate(params.row.createDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
        ],
        historyRemarkList: [],  //历史备注列表
        total: 0,
        flag: '',
        assign: false,
        pageIndex: 1,
        pageNumber: 10,
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
          distributeDateStart: '',
          distributeDateEnd: '',
          followTimeStart: '',
          followTimeEnd: '',
          // createStartDate: '',
          // createEndDate: '',
          oldUserName:'',
          channelLevel:'',
          isAssign:0,
          // followResult:'9',
          subject:'',//科目
          grade:'',//年级
          callStatus:'',
          ccName:'',
          tmkFollowUser:'',
        },
        callStatusList:[
          {
            "status":"已接通,待跟进",
            "value": "connectwait",
            "id": 11,
            "detail":[
              "同意排课",
              "暂不排课,保持跟进",
            ]
          },
          {
            "status":"未接通,待跟进",
            "value": "noconnectwait",
            "id": 22,
            "detail":[
              "未接",
              "拒接",
              "关机",
              "呼叫转移"
            ]
          },
          {
            "status":"已接通,放弃",
            "value": "connectgiveup",
            "id": 33,
            "detail":[
              "无设备",
              "信息错误",
              "未预约,不需要",
              "异常原因,无法排课",
            ]
          },
          {
            "status":"未接通,放弃",
            "value": "noconnectgiveup",
            "id": 44,
            "detail":[
              "空号",
              "停机",
              "未接",
              "拒接",
              "关机",
              "呼叫转移",
            ]
          },
        ],
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
            minWidth: 180,
            render : (h, params) => {
              if(params.row.phone) {
                return h('div',[
                  h('span',hideCharAtNumber(params.row.phone)),
                  h('Button', {
                    style: {
                      margin: '2px',
                      marginLeft:'4px'
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
                  })
                ])
              }else{
                return '-';
              }
            }
          },
          {
            title: '渠道名称',
            align: 'center',
            key: 'channelName',
            minWidth: 120,
          },
          {
            title: '分配时间',
            align: 'center',
            key: 'distributeDate',
            minWidth: 150,
            render(h, params) {
              return h('span',formateDate(params.row.distributeDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
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
              } else if(params.row.sourse === 4) {
                return h('span','结课人员')
              } else {
                return h('span','未知')
              }
            }
          },
          {
            title: '销售',
            align: 'center',
            key: 'ccName',
            minWidth: 90,
          },
          {
            title: '操作',
            align: 'center',
            minWidth: 150,
            render : (h, params) => {
              return h('div',[
                h('Button',{
                  props: {
                    type: 'success',
                    size: 'small',
                    icon: 'refresh',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs: {
                    title: '转CC',
                  },
                  on: {
                    click: () => {
                      this.distributionCc(params.row.uuid)
                    }
                  }
                }),
                h('Button',{
                  props: {
                    type: 'info',
                    size: 'small',
                    icon: 'ios-list-outline',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs: {
                    title: 'CC拨打记录',
                  },
                  on: {
                    click: () => {
                      this.ccCallRecord(params.row.uuid)
                    }
                  }
                }),
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
                // h('Button', {
                //   props: {
                //     type: 'info',
                //     size: 'small',
                //     icon: 'ios-chatboxes',
                //   },
                //   style: {
                //     margin: '2px',
                //   },
                //   attrs: {
                //     title: '备注',
                //   },
                //   on: {
                //     click: () => {
                //       this.addRemark(params.row.phone,params.row.uuid)
                //     }
                //   }
                // }),
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
      $.getJSON("static/data.json", function (json) {
        _this.gradeList = json.gradeList;
      });
      this.searchForm();
    },
    methods: {
      // cc
      showCcModal() {
        this.flag = 'sig';
        let row = this.selectionCcRows;
        if (row.length > 0) {
          this.$refs.ccs.show(this.flag);
        } else {
          common.msg('请选择名单','warning');
        }
      },
      // 批量分配
      showSalesModal() {
        this.flag = 'mul';
        let row = this.selectionCcRows;
        let uuids = [];
        if (row.length > 0) {
          row.forEach(function (item) {
            uuids.push(item.uuid)
          })
          this.$refs.ccs.show(this.flag,uuids);
        } else {
          common.msg('请选择名单','warning');
        }
      },
      // showSalesModal() {
      //   let app = this;
      //   app.flag = 'mul';
      //   let row = this.selectionRows;
      //   let uuids = [];
      //   if (row.length > 0) {
      //     row.forEach(function (item, index) {
      //       uuids.push(item.uuid)
      //     })
      //     this.$refs.sales.show(app.flag,uuids);
      //   } else {
      //     common.msg('请选择名单','warning');
      //   }
      // },
      // 点击CC拨打记录
      ccCallRecord(uuid){
        this.ccCallRecordModal = true;
        this.$axios.post(DISTRIBUTE().getLeadsCallRecordByLeadsUuid,{
          leadsUuid: uuid
        }).then( ({data}) => {
          this.ccCallRecordData = data.data.callList
        })
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
      // showSalesModals() {
      //   let row = this.selectionRows;
      //   console.log(row);
      //   if (row.length > 0) {
      //     this.$refs.sales.show();
      //   } else {
      //     common.msg('请选择名单','warning');
      //   }
      // },

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
          distributeDateStart: this.Search.distributeDateStart,
          distributeDateEnd: this.Search.distributeDateEnd,
          followTimeStart: this.Search.followTimeStart,
          followTimeEnd: this.Search.followTimeEnd,
          // leads创建时间
          // createStartDate: this.Search.createStartDate,
          // createEndDate: this.Search.createEndDate,
          oldUserName: this.Search.oldUserName,
          channelLevel: this.Search.channelLevel,
          isAssign: this.Search.isAssign,
          // followResult: this.Search.followResult,
          subject:this.Search.subject,
          grade: this.Search.grade,
          callStatus: this.Search.callStatus,
          ccName: this.Search.ccName,
          tmkFollowUser: this.Search.tmkFollowUser,
          // isRecommend: this.Search.isRecommend,
          // signStatus: this.Search.signStatus ? 1: 0
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        const _this = this;
        this.$axios.post(DISTRIBUTE().TmkDistribution.queryCloseCourseLeadsPage,{
          name: search.name,
          phone: search.phone,
          // signStatus: search.signStatus,
          // startGiveUpDate: search.startGiveUpDate,
          // endGiveUpDate: search.endGiveUpDate,
          signUpStartDate: search.signUpStartDate,
          signUpEndDate: search.signUpEndDate,
          distributeDateStart: search.distributeDateStart,
          distributeDateEnd: search.distributeDateEnd,
          followTimeStart: search.followTimeStart,
          followTimeEnd: search.followTimeEnd,
          //leads创建时间
          // leadsCreateStartDate: search.createStartDate,
          // leadsCreateEndDate: search.createEndDate,
          oldUserName: search.oldUserName,
          isAssign: search.isAssign,
          // followResult: search.followResult,
          subject: search.subject,
          grade: search.grade,
          callStatus: search.callStatus,
          ccName: search.ccName,
          tmkFollowUser: search.tmkFollowUser,
          // isRecommend: search.isRecommend,
          pageIndex: this.pageIndex,
          pageNumber: this.pageNumber,
          orderBy: orderBy,
          sortBy: sortBy,
        }).then( ({data}) => {
          _this.data = data.data['closeCourseLeadsList'] || [];
          _this.total = data.data.total;
          _this.assign = data.data.assign;
          if(data.code !== '100'){
            common.notices(data.code+":"+data.msg,'数据加载失败','error');
          }
        })
      },
      getSelections(selection) {
        // $sStorage.set('selectionRows' ,selection);
        // this.selectionRows = selection;
        $sStorage.set('selectionCcRows' ,selection);
        this.selectionCcRows = selection;
      },
      getSelectionAll(selection) {
        // $sStorage.set('selectionRows' ,selection);
        // this.selectionRows = selection;
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
      distributeTime(value) {
        this.Search.distributeDateStart = value[0] || '';
        this.Search.distributeDateEnd = value[1] || '';
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
        $sStorage.set('selectionCcRows' ,'');
      },
      // 分配刷新
      distributionFresh(){
        this.selectionRows=[];
        // this.selectionCcRows=[];
        this.searchForm();
      },
      showAdd(){
        document.getElementById('fileInput').click();
      },
      onChangeFileOk(event) {
        const _this = this;
        let fileInput = document.getElementById('fileInput');
        let files = fileInput.files[0];
        uploadAjax({
          url: DISTRIBUTE().TmkDistribution.importNewLeads,
          data: {
            "file": files,
          },
          success: function (res) {
            // console.log(1)
            event.target.value = '';
            common.notices(res.msg,'提示')
            _this.searchForm();
          }
        });
      },
      getFullPhone(phone) {
        getFullPhone(phone, COMMON_API().getPhoneHZ);
      },
      callPhone(phone) {
        let user = $localStorage.get('user');
        if (user && user.seatsNo) {
          this.$axios.post(COMMON_API().Phone.callPhone,{
            hotline: user.hotlinePhone,
            cno: user.seatsNo,//坐席号
            pwd: user.seatsPassword,
            phone: phone
          }).then( () => {
            common.msg('拨打成功', 'success');
          })
        } else {
          common.msg('座席号不存在', 'error');
        }
      },
    },
    components: {OBreadcrumb,selectSales,selectDistributionPerson,PageModel,addRemark}
  };
</script>

<style scoped>

</style>
