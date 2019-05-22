<template>
<div>
  <div class="waitFollowedManager">
    <o-breadcrumb second="销售与客服" third="本月重点维护学生"></o-breadcrumb>
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
              <Dropdown-item key="1"><Icon type="record" class="c-primary"></Icon> 本月可维护</Dropdown-item>
              <Dropdown-item key="2"><Icon type="record" class="c-warning"></Icon> 本月可续费</Dropdown-item>
              <Dropdown-item key="3"><Icon type="record" class="c-grey"></Icon> 常规维护</Dropdown-item>
              <Dropdown-item key="4"><Icon type="record" class="c-error"></Icon> 本月重点维护</Dropdown-item>
              <Dropdown-item key="5"><Icon type="record" class="c-warning"></Icon> 退费</Dropdown-item>
              <Dropdown-item key="6"><Icon type="record" class="c-primary"></Icon> 结课</Dropdown-item>
              <Dropdown-item key="7"><Icon type="record" class="c-error"></Icon> 停课</Dropdown-item>
            </Dropdown-menu>
          </Dropdown>
          <i-button :size="$store.state.searchModuleSize" icon="minus" @click="cancelMark">取消标记</i-button>
        </i-col>
        <i-col span="24" class="right">
          <i-input :size="$store.state.searchModuleSize" v-model="Search.paramStr" @on-keyup.enter="searchForm(1)" placeholder="学生\手机号" style="width:150px;margin-right: 2px;"></i-input>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" @on-change="changeDate" ref="daterange" placement="bottom-end" placeholder="负责时间" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
          <i-button :size="$store.state.searchModuleSize" type="ghost" @click="clearSarchForm">重置</i-button>
        </i-col>
      </Row>
    </div>
    <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
      <checkbox label="keyPoint">标记</checkbox>
      <checkbox label="studentPhone">手机号</checkbox>
      <checkbox label="grade">年级</checkbox>
      <checkbox label="payTime">付费时间</checkbox>
      <checkbox label="remarkContent">最新跟进记录</checkbox>
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
  <create-order @reFresh="reFresh" ref="createOrder"></create-order>
  <create-third-order @reFresh="reFresh" ref="createThirdOrder"></create-third-order>
  <create-bai-du-order @reFresh="reFresh" ref="createBaiDuOrder"></create-bai-du-order>
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
        tableColumnsChecked:['keyPoint','studentPhone','grade','payTime','remarkContent','responsibleTime',
          'handOutDes','action'],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11: 17,
        Search: {
          paramStr: '',
          startDate: '',
          endDate: '',
          keyPoint: '',
        },
        searchSelectStatusModel: '',
        selectionRowData: [],
        historyRemarkList: [],  //历史备注列表
        columns: []
      }
    },
    mounted() {
      this.searchForm();
      this.changeTableColumns();

    },
    methods: {
      getTableColumns () {
        const columns = {
          selection:{
            type: 'selection',
            minWidth: 40,
            align: 'center',
            fixed: 'left'
          },
          index:{
            title: '序号',
            type: 'index',
            minWidth: 40,
            fixed: 'left',
            align: 'center'
          },
          studentName:{
            title: '学生姓名',
            key: 'studentName',
            minWidth: 90,
            fixed: 'left',
            render : (h, params) => {
            return h('div',[
              h('Icon',{
                props:{
                  type:'person'
                }
              }),
              h('a',{
                on:{
                  click:()=>{
                  GLOBAL.viewLeadsDetail(params.row.leadsUuid)
              }
          }
        },params.row.studentName)
      ])
//              return `<strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.leadsUuid}');">${row.studentName}</a></strong>`;
            }
          },
          keyPoint:{
            title: '标记',
            key: 'keyPoint',
            minWidth: 100,
            align:'center',
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
                //              return `<span class="o-tag blue">本月可维护</span>`;
              }else if(params.row.keyPoint === 2) {
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag yellow'
                    }
                  },'本月可续费')
                ])
//                return `<span class="o-tag yellow">本月可续费</span>`;
              }else if(params.row.keyPoint === 3) {
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag grey'
                    }
                  },'常规维护')
                ])
                //   return `<span class="o-tag grey">常规维护</span>`;
              }else if(params.row.keyPoint === 4) {
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag red'
                    }
                  },'本月重点维护')
                ])
                //   return `<span class="o-tag red">本月重点维护</span>`;
              }else if(params.row.keyPoint === 5) {
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag red'
                    }
                  },'退费')
                ])
                //   return `<span class="o-tag red">退费</span>`;
              }else if(params.row.keyPoint === 6) {
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag red'
                    }
                  },'结课')
                ])
                //  return `<span class="o-tag red">结课</span>`;
              }else if(params.row.keyPoint === 7) {
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag red'
                    }
                  },'停课')
                ])
                //   return `<span class="o-tag red">停课</span>`;
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
                      fontSize:'18px',
                      verticalAlign:'top',
                      cursor:'pointer',
                      margin:'2px',
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
//                return hideCharAtNumber(row.studentPhone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.studentPhone}')" class="eye" title="显示全部"></Icon>
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
//                return `<span title="${row.remarkContent}">${content}</span>`;
              } else {
                return h('span',content);
              }
            }
          },
          responsibleTime:{
            title: '负责时间',
            align:'center',
            key: 'responsibleTime',
            minWidth: 180,
              render(h, params) {
              return h('span',formateDate(params.row.responsibleTime,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          handOutDes:{
            title: '移交信息',
            key: 'handOutDes',
            align:'center',
            minWidth: 200,
              render(h, params) {
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
//                return `<span title="${row.handOutDes}">${content}</span>`;
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
            minWidth: 150,
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
                    type: 'info',
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
//              return `<i-button type="success" size="small" icon="clock" title="预约课程" @click="appointment('${row.leadsUuid}')"></i-button>
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
        let param = "?leadsPhone=" + leadsPhone+"&leadsUuid="+leadsUuid;
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
            leadsPhone:leadsPhone,
            leadsUuid:leadsUuid,
          }
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
          keyPoint: 4,
          startDate: this.Search.startDate,
          endDate: this.Search.endDate
        });
      },
      clearSarchForm() {
        clearSearchForm(this.Search, [this.$refs.daterange]);
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?name=${search.name}&phone=${search.phone}&startDate=${search.startDate}&endDate=${search.endDate}&keyPoint=${search.keyPoint}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        // common.ajax({
        //   url: SCS().MyStudent.cr_dataGrid + param,
        //   method: 'get',
        //   success: function(response){
        //     _this.data = response.data.crManagerStudentVos || [];
        //     _this.total = response.data.total;
        //   }
        // });
        this.$axios.get(SCS().MyStudent.cr_dataGrid,{
          params:{
            name: search.name,
            phone: search.phone,
            startDate: search.startDate,
            endDate: search.endDate,
            keyPoint: search.keyPoint,
            pageIndex: this.pageIndex,
            pageNumber: this.pageNumber,
            orderBy:orderBy,
            sortBy:sortBy,
          }
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
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470: '';
      }
    },
    components: {
      OBreadcrumb, giveUp, payRequest, greenChannel, addRemark, createOrder, createThirdOrder,
      createBaiDuOrder,PageModel
    }
  };
</script>

<style>

</style>
