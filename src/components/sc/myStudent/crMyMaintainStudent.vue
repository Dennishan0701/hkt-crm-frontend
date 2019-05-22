<template>
<div>
  <div class="waitFollowedManager">
    <o-breadcrumb second="销售与客服" third="CR我的维护学生信息"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="pricetag" @click="showCreateOrder">创建官网订单</i-button>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="pricetag" @click="showCreateThirdOrder">创建爱海米分期支付订单</i-button>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="pricetag" @click="showCreateBaiDuOrder">创建百度分期支付订单</i-button>

          <Dropdown trigger="click" @on-click="changeCheckeMark">
            <i-button :size="$store.state.searchModuleSize" type="primary" icon="checkmark">
              标记为
              <Icon type="arrow-down-b"></Icon>
            </i-button>
            <Dropdown-menu slot="list">
              <Dropdown-item name="1"><Icon type="record" class="c-primary"></Icon> 本月可维护</Dropdown-item>
              <Dropdown-item name="2"><Icon type="record" class="c-warning"></Icon> 本月可续费</Dropdown-item>
              <Dropdown-item name="3"><Icon type="record" class="c-grey"></Icon> 常规维护</Dropdown-item>
              <Dropdown-item name="4"><Icon type="record" class="c-error"></Icon> 本月重点维护</Dropdown-item>
              <Dropdown-item name="5"><Icon type="record" class="c-warning"></Icon> 退费</Dropdown-item>
              <Dropdown-item name="6"><Icon type="record" class="c-primary"></Icon> 结课</Dropdown-item>
              <Dropdown-item name="7"><Icon type="record" class="c-error"></Icon> 停课</Dropdown-item>
            </Dropdown-menu>
          </Dropdown>
          <i-button :size="$store.state.searchModuleSize" icon="minus" @click="cancelMark">取消标记</i-button>
        </i-col>
        <i-col span="24" class="right">
          <i-input :size="$store.state.searchModuleSize" v-model="Search.paramStr" @on-keyup.enter="searchForm(1)" placeholder="学生\手机号" style="width:150px;margin-right: 2px;"></i-input>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.keyPoint" placeholder="标记状态" style="width:120px">
            <i-option value="0" label="未被标记"><span><Icon type="record"></Icon> 未被标记</span></i-option>
            <i-option value="1" label="本月可维护"><span><Icon type="record" class="c-primary"></Icon> 本月可维护</span></i-option>
            <i-option value="2" label="本月可续费"><span><Icon type="record" class="c-warning"></Icon> 本月可续费</span></i-option>
            <i-option value="3" label="常规维护"><span><Icon type="record" class="c-grey"></Icon> 常规维护</span></i-option>
            <i-option value="4" label="本月重点维护"><span><Icon type="record" class="c-error"></Icon> 本月重点维护</span></i-option>
            <i-option value="7" label="停课"><span><Icon type="record" class="c-error"></Icon> 停课</span></i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.grade" clearable  placeholder="年级" style="width:80px;">
            <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.provinceId" :label-in-value="true" :clearable="true" filterable @on-change="changeSelectedCity" placeholder="省" style="width:150px">
            <i-option v-for="(item,index) in provinceList" :key='index' :value="item.id">{{ item.name }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.cityId" :label-in-value="true" @on-change="changeSelectedArea" :clearable="true" placeholder="市" style="width:150px">
            <i-option v-for="(item,index) in cityArrays" :key='index' :value="item.id">{{ item.name }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.countId" :label-in-value="true" @on-change="changeSelectedCount" :clearable="true" placeholder="区" style="width:150px">
            <i-option v-for="(item,index) in areaList" :key='index' :value="item.id">{{ item.name }}</i-option>
          </i-select>
        <!--</i-col>-->
        <!--<i-col span="24" class="right">-->
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" @on-change="changeDate" ref="daterange" placement="bottom-end" placeholder="负责时间" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
          <i-button :size="$store.state.searchModuleSize" type="ghost" @click="clearSarchForm">重置</i-button>
        </i-col>
      </Row>
    </div>
    <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
      <checkbox label="followDays">跟进提醒</checkbox>
      <checkbox label="keyPoint">标记</checkbox>
      <checkbox label="studentPhone">手机号</checkbox>
      <checkbox label="grade">年级</checkbox>
      <checkbox label="province">省</checkbox>
      <checkbox label="city">市</checkbox>
      <checkbox label="count">区</checkbox>
      <checkbox label="payTime">付费时间</checkbox>
      <checkbox label="remarkContent">最新跟进记录</checkbox>
      <checkbox label="suspClasses">停课提醒</checkbox>
      <checkbox label="responsibleTime">负责时间</checkbox>
      <checkbox label="handOutDes">移交信息</checkbox>
    </checkbox-group>
    <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data" @on-selection-change="selectRow"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
  </div>
  <give-up @reFresh="reFresh"  ref="giveup"></give-up>
  <pay-request @reFresh="reFresh"  ref="payrequest"></pay-request>
  <green-channel @reFresh="reFresh"  ref="greenchannel"></green-channel>
  <add-remark @reFresh="reFresh"  ref="addremark" :history-remark-list="historyRemarkList"></add-remark>
  <create-order @reFresh="reFresh"  ref="createOrder"></create-order>
  <create-third-order @reFresh="reFresh"  ref="createThirdOrder"></create-third-order>
  <create-bai-du-order @reFresh="reFresh"  ref="createBaiDuOrder"></create-bai-du-order>
</div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {SCS} from 'common/api/scs.js';
  import {formateDate,common,hideCharAtNumber,hideCharAtStr,getFullPhone,clearSearchForm} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import giveUp from 'components/sc/myStudent/giveUp';
  import greenChannel from 'components/sc/myStudent/payRequest.vue';
  import payRequest from 'components/sc/public/payRequest.vue';
  import addRemark from 'components/sc/waitFollowed/addRemark';
  import createOrder from 'components/sc/myStudent/createOrder';
  import createThirdOrder from 'components/sc/myStudent/createThirdOrder';
  import createBaiDuOrder from 'components/sc/myStudent/createBaiDuOrder';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        tableColumnsChecked:['followDays','keyPoint','studentPhone','grade','province','city',
          'count','payTime','remarkContent','suspClasses','responsibleTime','handOutDes','action'],
        total: 0,
        pageIndex: 1,
        // pageNumber: SCREEN_SIZE === 'md' ? 11: 17,
        pageNumber: 7,
        gradeList: [],//年级
        provinceList:[],//省
        cityArrays: [],//市
        areaList: [],//区
        province:'',//省
        city:'',//市
        count:'',//区
        Search: {
          paramStr: '',
          grade: '',//年级
          startDate: '',
          endDate: '',
          keyPoint: '',
          provinceId:'',
          cityId:'',
          countId:'',
        },
        searchSelectStatusModel: '',
        selectionRowData: [],
        historyRemarkList: [],  //历史备注列表
        columns: []
      }
    },
    mounted() {
      const _this = this;
      this.searchForm();
      this.changeTableColumns();
      $.getJSON("static/data.json", function (json) {
        _this.gradeList = json.gradeList;
      });
      //获取省
      // common.ajax({
      //   url: COMMON_API().ssqAreaAllStudy,
      //   method: 'get',
      //   data: {parentid: 1},
      //   success: function (response) {
      //     _this.provinceList = response.data || [];
      //   }
      // });
      this.$axios.get(COMMON_API().ssqAreaAllStudy,{
        params:{
          parentid: 1
        },
      }).then( ({data}) => {
        _this.provinceList = data.data || [];
      })
    },
    methods: {
      getTableColumns () {
        const columns = {
          selection:{
          type: 'selection',
            align: 'center',
          fixed: 'left',
          minWidth: 40,
        },
          index:{
          title: '序号',
            type: 'index',
          align: 'center',
          fixed: 'left',
            minWidth: 60,
        },
          studentName:{
          title: '学生姓名',
            key: 'studentName',
          fixed: 'left',
            minWidth: 120,
            render : (h, params) => {
              return h('div',[
                h('a',{
                  on:{
                    click:()=>{
                      GLOBAL.viewLeadsDetail(params.row.leadsUuid)
                    }
                  }
                },params.row.studentName)
              ])
//          return `<strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.leadsUuid}');">${row.studentName}</a></strong>`;
        }
        },
          followDays:{
          title: '跟进提醒',
            key: 'followDays',
          align:'center',
            minWidth: 100,
            render : (h, params) => {
          if(params.row.followDays > 30){
            return h('div',[
              h('span',{
                attrs:{
                  class:'o-tag red'
                }
              },params.row.followDays + '天未跟进')
            ])
//            return `<span class="o-tag red">${row.followDays}天未跟进</span>`;
          }else if(params.row.followDays == 0){
            return ``;
          }else {
            return h('div',[
              h('span',{},params.row.followDays + '天未跟进')
            ])
//            return `<span>${row.followDays}天未跟进</span>`;
          }
        }
        },
          keyPoint:{
          title: '标记',
            key: 'keyPoint',
          align:'center',
            minWidth: 100,
            render : (h, params) => {
          if(params.row.keyPoint === 0) {
            return '-';
          }else if(params.row.keyPoint === 1) {
            return h('div',[
              h('span',{
                attrs:{
                  class:'o-tag blue'
                }
              },'本月可维护')
            ])
//            return `<span class="o-tag blue">本月可维护</span>`;
          }else if(params.row.keyPoint === 2) {

            return h('div',[
              h('span',{
                attrs:{
                  class:'o-tag yellow'
                }
              },'本月可续费')
            ])
//            return `<span class="o-tag yellow">本月可续费</span>`;
          }else if(params.row.keyPoint === 3) {
            return h('div',[
              h('span',{
                attrs:{
                  class:'o-tag grey'
                }
              },'常规维护')
            ])
//            return `<span class="o-tag grey">常规维护</span>`;
          }else if(params.row.keyPoint === 4) {
            return h('div',[
              h('span',{
                attrs:{
                  class:'o-tag red'
                }
              },'本月重点维护')
            ])
//            return `<span class="o-tag red">本月重点维护</span>`;
          }else if(params.row.keyPoint === 5) {
            return h('div',[
              h('span',{
                attrs:{
                  class:'o-tag yellow'
                }
              },'退费')
            ])
//            return `<span class="o-tag yellow">退费</span>`;
          }else if(params.row.keyPoint === 6) {
            return h('div',[
              h('span',{
                attrs:{
                  class:'o-tag blue'
                }
              },'结课')
            ])
//            return `<span class="o-tag blue">结课</span>`;
          }else if(params.row.keyPoint === 7) {
            return h('div',[
              h('span',{
                attrs:{
                  class:'o-tag red'
                }
              },'停课')
            ])
//            return `<span class="o-tag red">停课</span>`;
          }else{
            return '未标记';
          }
        }
        },
          studentPhone:{
          title: '手机号',
            key: 'studentPhone',
          align:'center',
            minWidth: 150,
            render : (h, params) => {
          if(params.row.studentPhone) {
            return h('div',[
              h('span',hideCharAtNumber(params.row.studentPhone)),
              h('i',{
                style:{
                  margin:'2px'
                },
                attrs:{
                  class:'ivu-icon ivu-icon-ios-eye',
                  title:'显示全部'
                },
                style:{
                  fontSize:'18px',
                  verticalAlign:'top',
                  cursor:'pointer'
                },
                on:{
                  click:()=>{
                    this.getFullPhone(params.row.studentPhone)
                  }
                }
              }),
              h('i',{
                style:{
                  margin:'2px',
                  fontSize:'18px',
                  verticalAlign:'top',
                  cursor:'pointer',
                  display: this.$store.state.callPhoneIsOn
                },
                attrs:{
                  class:'ivu-icon ivu-icon-android-call',
                  title:'拨打电话'
                },
                on:{
                  click:()=>{
                    this.callPhone(params.row.phone)
                  }
                }
              })
            ])
//            return hideCharAtNumber(row.studentPhone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.studentPhone}')" class="eye" title="显示全部"></Icon>
//                <Icon type="android-call" @click="callPhone('${row.phone}')" class="call" title="拨打电话"></Icon>`;
          }else{
            return '-';
          }
        }
        },
          grade:{
          title: '年级',
            key: 'grade',
          align:'center',
            minWidth: 90
        },
          province:{
          title: '省',
            key: 'province',
          align:'center',
            minWidth: 90
        },
          city:{
          title: '市',
            key: 'city',
          align:'center',
            minWidth: 90
        },
          count:{
          title: '区',
            key: 'count',
          align:'center',
            minWidth: 90
        },
          payTime:{
          title: '付费时间',
            key: 'payTime',
          align:'center',
            minWidth: 180,
            render(h, params) {
          return h('span',formateDate(params.row.payTime,'yyyy-MM-dd hh:mm:ss'));
        }
        },
          remarkContent:{
          title: '最新跟进记录',
            key: 'remarkContent',
          align:'center',
            minWidth: 300,
            render : (h, params) => {
          let content = params.row.remarkContent;
          if(content && content.length>40) {
            content = content.slice(0,39)+'...';
            return h('div',[
              h('span',{
                attrs:{
                  title:params.row.remarkContent
                }
              },content)
            ])
//            return `<span title="${row.remarkContent}">${content}</span>`;
          } else {
            return h('span',content);
          }
        }
        },
          suspClasses:{
          title: '停课提醒',
            key: 'suspClasses',
            minWidth: 100,
          align:'center',
            render : (h, params) => {
          if(params.row.suspClasses > 30){
            return h('div',[
              h('span',{
                attrs:{
                  class:'o-tag red'
                }
              },params.row.suspClasses+'天未上课')
            ])
//            return `<span class="o-tag red">${row.suspClasses}天未上课</span>`;
          }else if(params.row.suspClasses == 0){
            return ``;
          } else {
            return h('div',[
              h('span',{
              },params.row.suspClasses+'天未上课')
            ])
//            return `<span>${row.suspClasses}天未上课</span>`;
          }
        }
        },
          responsibleTime:{
          title: '负责时间',
          key: 'responsibleTime',
          align:'center',
          minWidth: 180,
          render(h, params) {
            return h('span',formateDate(params.row.responsibleTime,'yyyy-MM-dd hh:mm:ss'));
          }
        },
          handOutDes:{
          title: '移交信息',
            key: 'handOutDes',
          align:'center',
            minWidth: 300,
            render : (h, params) => {
          let content = params.row.handOutDes;
          if(content && content.length>40) {
            content = content.slice(0,39)+'...';
            return h('div',[
              h('span',{
                attrs:{
                  title:params.row.handOutDes
                }
              },content)
            ])
//            return `<span title="${row.handOutDes}">${content}</span>`;
          } else {
            return h('span',content);
          }
        }
        },
          action:{
          title:'操作',
            key: 'action',
          align:'center',
          fixed:'right',
            minWidth: 180,
            render : (h, params) => {
              return h('div',[
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    icon: 'clock',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs:{
                    title:'预约课程'
                  },
                  on: {
                    click: () => {
                      this.appointment(params.row.leadsUuid)
                    }
                  }
                }),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'social-yen',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs:{
                    title:'付费申请'
                  },
                  on: {
                    click: () => {
                      this.request(params.row.payUuid,params.row.leadsUuid)
                    }
                  }
                }),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'ios-chatboxes',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs:{
                    title:'备注'
                  },
                  on: {
                    click: () => {
                      this.addRemark(params.row.studentPhone,params.row.leadsUuid)
                    }
                  }
                }),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    icon: 'plane',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs:{
                    title:'绿色通道'
                  },
                  on: {
                    click: () => {
                      this.greenChannel(params.row.leadsUuid)
                    }
                  }
                })
              ])

//          return `<i-button type="success" size="small" icon="clock" title="预约课程" @click="appointment('${row.leadsUuid}')"></i-button>
//              <i-button type="primary" size="small" icon="social-yen" title="付费申请" @click="request('${row.payUuid}','${row.leadsUuid}')"></i-button>
//              <i-button type="info" size="small" icon="ios-chatboxes" title="备注" @click="addRemark('${row.studentPhone}')"></i-button>
//              <i-button type="success" size="small"  icon="plane" title="绿色通道" @click="greenChannel('${row.leadsUuid}')"></i-button>`;
        }
        }
        };
        let datas = [columns.selection,columns.index,columns.studentName];
        this.tableColumnsChecked.forEach(col => datas.push(columns[col]));
        return datas;
      },

      changeCheckeMark(key) {
        console.log(key);
        const _this = this;
        let row = this.selectionRowData;
        if(row.length === 0) {
          common.msg('请选择一个学生','warning');
        }else if(row.length > 1) {
          common.msg('一次只能操作一条数据','warning');
        }else{
          let text = _this.changeKeyPoint(key);
          this.$Modal.confirm({
            title: '确认',
            content: `学生 <strong class="required">${row[0].studentName}</strong> 确认要标记为 <strong class="required">${text}</strong> 吗？`,
            onOk: function () {
              // common.ajax({
              //   url: SCS().MyStudent.keyPoint,
              //   data: { leadsUuid: row[0].leadsUuid, keyPointType: key },
              //   success: function (res) {
              //     common.notices('操作成功！');
              //     _this.searchForm();
              //   }
              // });
              this.$axios.post(SCS().MyStudent.keyPoint,{
                leadsUuid: row[0].leadsUuid,
                keyPointType: key
              }).then( () => {
                common.notices('操作成功！');
                _this.searchForm();
              })
            }
          });
        }
      },

      //省市区
      changeSelectedCity(areaName) {
        const _this = this;
        _this.province = areaName.label;
        //获取城市
        // common.ajax({
        //   url: COMMON_API().ssqAreaAllStudy,
        //   method: 'get',
        //   data: {parentid: areaName.value},
        //   success: function (response) {
        //     _this.cityArrays = response.data || [];
        //   }
        // });
        this.$axios.get(COMMON_API().ssqAreaAllStudy,{
          params:{
            parentid : areaName.value,
          },
        }).then( ({data}) => {
          _this.cityArrays = data.data || [];
        })
      },
      changeSelectedArea(areaName) {
        const _this = this;
        //获取城市的区域
        _this.city = areaName.label;
        // common.ajax({
        //   url: COMMON_API().ssqAreaAllStudy,
        //   method: 'get',
        //   data: {parentid: areaName.value},
        //   success: function (response) {
        //     _this.areaList = response.data || [];
        //   }
        // });
        this.$axios.get(COMMON_API().ssqAreaAllStudy,{
          params:{
            parentid : areaName.value,
          },
        }).then( ({data}) => {
          _this.areaList = data.data || [];
        })
      },
      changeSelectedCount(areaName){
        const _this = this;
        console.log(areaName.label);
        _this.count = areaName.label;
      },
      cancelMark() {
        const _this = this;
        let row = this.selectionRowData;
        if(row.length === 0) {
          common.msg('请选择一个学生','warning');
        }else if(row.length > 1) {
          common.msg('一次只能操作一条数据','warning');
        }else{
          let text = "";
          if(row[0].keyPoint && row[0].keyPoint > 0) {
            let text = _this.changeKeyPoint(row[0].keyPoint.toString());
            this.$Modal.confirm({
              title: '确认',
              content: `学生 <strong class="required">${row[0].studentName}</strong > 确认要取消 <strong class="required">${text}</strong> 标记吗？`,
              onOk: function () {
                // common.ajax({
                //   url: SCS().MyStudent.cancelKeyPoint,
                //   data: { leadsUuid: row[0].leadsUuid },
                //   success: function (res) {
                //     common.notices('操作成功！');
                //     _this.searchForm();
                //   }
                // });
                this.$axios.post(SCS().MyStudent.cancelKeyPoint,{
                  leadsUuid: row[0].leadsUuid
                }).then( () => {
                  common.notices('操作成功！');
                  _this.searchForm();
                })
              }
            });
          } else {
            common.msg('该数据没有被任何被任何标记，无法进行取消操作','warning');
          }
        }
      },
      showCreateThirdOrder() {
        const that = this;
        let row = this.selectionRowData;
        if(row.length === 0) {
          common.msg('请选择一条数据','warning');
        } else if (row.length > 1) {
          common.msg('一次只能操作一条数据','warning');
        } else {
          that.$refs.createThirdOrder.show(row[0].leadsUuid);
        }
      },
      showCreateBaiDuOrder() {
        const that = this;
        let row = this.selectionRowData;
        if(row.length === 0) {
          common.msg('请选择一条数据','warning');
        } else if (row.length > 1) {
          common.msg('一次只能操作一条数据','warning');
        } else {
          that.$refs.createBaiDuOrder.show(row[0].leadsUuid);
        }
      },
      showCreateOrder() {
        const _this = this;
        let row = this.selectionRowData;
        if(row.length === 0) {
          common.msg('请选择一条数据','warning');
        } else if (row.length > 1) {
          common.msg('一次只能操作一条数据','warning');
        } else {
          _this.$refs.createOrder.show(row[0].leadsUuid);
        }
      },
      getFullPhone(phone) {
        getFullPhone(phone, COMMON_API().getPhoneHZ);
      },
      greenChannel(leadsUuid) {
        this.$refs.greenchannel.show('',leadsUuid,'greenChannelByCr');
      },
      addRemark(leadsPhone,leadsUuid) {
        // let param = "?leadsPhone=" + leadsPhone+"&leadsUuid="+leadsUuid;
        const _this = this;
        // common.ajax({
        //   url: SCS().WaitFollowed.historyRemark + param,
        //   method: 'get',
        //   success: function (response) {
        //     _this.historyRemarkList = response.data;
        //     _this.total = response.data.total;
        //   }
        // });
        this.$axios.get(SCS().WaitFollowed.historyRemark,{
          params:{
            leadsPhone : leadsPhone,
            leadsUuid : leadsUuid,
          },
        }).then( ({data}) => {
          _this.historyRemarkList = data.data;
          _this.total = data.data.total;
        })
        this.$refs.addremark.show(leadsPhone,leadsUuid);
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        let paramStr = this.Search.paramStr, name = '', phone = '';
        if(!paramStr) paramStr = '';
        if (isNaN(paramStr)) {
          name = paramStr;
        } else {
          phone = paramStr;
        }
        this.loadDataGrid({
          name: name,
          phone: phone,
          keyPoint: this.Search.keyPoint,
          startDate: this.Search.startDate,
          grade: this.Search.grade,
          province: this.province,
          city: this.city,
          count: this.count,
          endDate: this.Search.endDate
        });
      },
      clearSarchForm() {
        clearSearchForm(this.Search, [this.$refs.daterange]);
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?name=${search.name}&phone=${search.phone}&grade=${search.grade}&province=${search.province}&city=${search.city}&count=${search.count}&startDate=${search.startDate}&endDate=${search.endDate}&keyPoint=${search.keyPoint}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        // common.ajax({
        //   url: SCS().MyStudent.getCrMyMaintainStudent + param,
        //   method: 'get',
        //   success: function(response){
        //     _this.data = response.data.crManagerStudentVos || [];
        //     _this.total = response.data.total;
        //   }
        // });
        this.$axios.get(SCS().MyStudent.getCrMyMaintainStudent,{
          params:{
            name : search.name,
            phone : search.phone,
            grade : search.grade,
            province : search.province,
            city : search.city,
            count : search.count,
            startDate : search.startDate,
            endDate : search.endDate,
            keyPoint : search.keyPoint,
            pageIndex : this.pageIndex,
            pageNumber : this.pageNumber,
            orderBy : orderBy,
            sortBy : sortBy,
          },
        }).then( ({data}) => {
          _this.data = data.data.crManagerStudentVos || [];
          _this.total = data.data.total;
        })
      },
      request(payUuid,leadsUuid) {
        this.$refs.payrequest.show('',payUuid,leadsUuid,'');
      },
      giveUp(uuid) {
        this.$refs.giveup.show(uuid);
      },
      appointment(uuid) {
        sessionStorage.setItem('appointment_leadsUuid',uuid);
        sessionStorage.setItem('appointment_parent_menu_name','我的学生');
        sessionStorage.setItem('appointment_parent_menu_url', '/student/Mystudents/cr');
        window.location.hash = '/scs/appointment';
      },
      selectRow(selection) {
        this.selectionRowData = selection;
      },
      searchSelectStatus(value) {
        this.searchSelectStatusModel = value;
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      changeDate(value) {
        this.Search.startDate = value[0] || '';
        this.Search.endDate = value[1] || '';
      },
      changeKeyPoint(key) {
        switch (key) {
          case '1': return '本月可维护'; break;
          case '2': return '本月可续费'; break;
          case '3': return '常规维护'; break;
          case '4': return '本月重点维护'; break;
          case '5': return '退费'; break;
          case '6': return '结课'; break;
          case '7': return '停课'; break;
          default: return '';
        }
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
        return (SCREEN_SIZE === 'md' && this.data.length > 10) ? 470: '';
      }
    },
    components: {
      OBreadcrumb, giveUp, payRequest, greenChannel, addRemark, createOrder, createThirdOrder, createBaiDuOrder,PageModel
    }
  };
</script>

<style>

</style>
