<template>
  <div>
    <o-breadcrumb second="销售与客服" third="CC我的学生"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="4">
          <i-button v-if="assign" type="primary" :size="$store.state.searchModuleSize" icon="paper-airplane" @click="showSalesModal">
            批量分配
          </i-button>
        </i-col>
        <i-col span="20" class="right">
          <i-button :size="$store.state.searchModuleSize" type="error" icon="checkmark" @click="priorityFollow('enter')">优先跟进</i-button>
          <i-button :size="$store.state.searchModuleSize" icon="minus" @click="priorityFollow('cancel')">取消优先跟进</i-button>
          <!--<i-button :size="$store.state.searchModuleSize" type="primary" icon="pricetag" @click="showCreateOrder">创建官网订单</i-button>-->
          <!--<i-button :size="$store.state.searchModuleSize" type="primary" icon="pricetag" @click="showCreateThirdOrder">创建爱海米分期支付订单</i-button>-->
          <!--<i-button :size="$store.state.searchModuleSize" type="primary" icon="pricetag" @click="showCreateHuiStudyOrder">创建惠学习支付订单</i-button>-->
          <!--<i-button :size="$store.state.searchModuleSize" type="primary" icon="pricetag"  @click="showCreateBaiDuOrder">创建百度分期支付订单</i-button>-->
        </i-col>
      </Row>
      <Row>
        <i-col span="24" class="right">
          <Checkbox :size="$store.state.searchModuleSize"  v-model="Search.keyPointType">优先跟进</Checkbox>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.paramStr" @on-keyup.enter="searchForm(1)" placeholder="学生\手机号"
                   style="width:150px;margin-right: 2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.ccName" @on-keyup.enter="searchForm(1)" placeholder="CC姓名"
                   style="width:150px;margin-right: 2px;"></i-input>
          <i-select :size="$store.state.searchModuleSize" v-model="grade" clearable placeholder="年级" style="width:90px;">
            <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.connectStatus" clearable placeholder="接通状态"
                    style="width:150px;">
            <i-option value="create">新建</i-option>
            <i-option value="wait">待拨打,待跟进</i-option>
            <i-option value="noconnectwait">未接通,待跟进</i-option>
            <i-option value="connectwait">已接通,待跟进</i-option>
            <i-option value="successwait">已接通,同意排课</i-option>
            <i-option value="noconnectgiveup">未接通,放弃</i-option>
            <i-option value="connectgiveup">已接通,放弃</i-option>
            <i-option value="A">A</i-option>
            <i-option value="B">B</i-option>
            <i-option value="C">C</i-option>
            <i-option value="D">D</i-option>
            <i-option value="E">E</i-option>
          </i-select>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" @on-change="changeDate" placement="bottom-end" placeholder="负责时间"
                       style="width: 200px"></Date-picker>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" @on-change="changeDate2" placement="bottom-end" placeholder="报名时间"
                       style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search"  @click="searchForm(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" :height="theight" :row-class-name="rowClassName" highlight-row stripe :columns="alias=='cc'?column:columns"
             :data="data" @on-selection-change="selectRow" @on-select-all="getSelectionAll" ></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :current="pageIndex" :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
    <Modal
      title="中奖信息"
      width=300
      v-model="prizeContentModal"
      :mask-closable="false"
      :closable="false">
      <div style="text-align: center">
        <span>{{this.prizeContent}}</span>
      </div>
    </Modal>
    <give-up @reFresh="reFresh" ref='giveup'></give-up>
    <green-channel @reFresh="reFresh" ref='greenchannel'></green-channel>
    <record-call @reFresh="reFresh" ref="recordcall"></record-call>
    <add-remark @reFresh="reFresh" ref='addremark' :historyRemarkList="historyRemarkList"></add-remark>
    <create-order @reFresh="reFresh" ref='createOrder'></create-order>
    <create-third-order @reFresh="reFresh" ref='createThirdOrder'></create-third-order>
    <create-huistudy-order @reFresh="reFresh" ref='createHuistudyOrder'></create-huistudy-order>
    <create-bai-du-order @reFresh="reFresh" ref='createBaiDuOrder'></create-bai-du-order>
    <select-sales @reFresh="reFresh" ref="ccs" form-type="1"></select-sales>
  </div>
</template>
<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {SCS} from 'common/api/scs.js';
  import {ANLAI} from 'common/api/anlai.js';
  import {TIANRUN} from 'common/api/tianrun.js';
  import {formateDate, common, hideCharAtNumber,getFullPhone} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import giveUp from 'components/sc/myStudent/giveUp';
  import greenChannel from 'components/sc/myStudent/ccPayRequest.vue';
  import recordCall from 'components/sc/waitFollowed/recordCall';
  import addRemark from 'components/sc/waitFollowed/addRemark';
  import createOrder from 'components/sc/myStudent/createOrder';
  import createHuistudyOrder from 'components/sc/myStudent/createHuistudyOrder';
  import createThirdOrder from 'components/sc/myStudent/createThirdOrder';
  import createBaiDuOrder from 'components/sc/myStudent/createBaiDuOrder';
  import PageModel from 'dashborader/page/page.vue';

  import selectSales from '../waitFollowed/selectSales';
  const $localStorage = $.localStorage;
  const $sStorage = $.sessionStorage;
  export default{
    data() {
      return {
        assign: false,
        prizeContentModal:false,
        prizeContent:'',
        // user: $localStorage.get('user') || '',
        data: [],
        total: 0,
        alias: $localStorage.get('user').alias,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        Search: {
          keyPointType: false,
          paramStr: '',
          ccName:"",
          connectStatus:"",
          startDate: '',
          endDate: '',
          signStartTime:"",
          signEndTime:""
        },
        searchSelectStatusModel: '',
        selectionRowData: [],
        historyRemarkList: [],  //历史备注列表
        gradeList: [],
        grade: '',
        column: [
          {
            type: 'selection',
            minWidth: 25,
            align: 'center',
            fixed: 'left',
          },
          {
            title: '学生姓名',
            key: 'leadsName',
            fixed: 'left',
            minWidth: 90,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('a', {
                  on: {
                    click: () => {
                      GLOBAL.viewLeadsDetail(params.row.leadsUuid)
                    }
                  }
                }, params.row.leadsName)
              ])
            }
          },
          {
            title: '手机号',
            key: 'leadsPhone',
            align: 'center',
            minWidth: 180,
            render: (h, params) => {
              return h('div', [
                h('span', hideCharAtNumber(params.row.leadsPhone)),
                h('Button', {
                  style: {
                    margin: '2px'
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
                      this.getFullPhone(params.row.leadsPhone)
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
                      this.callPhone(params.row.leadsPhone,params.row.channelUuid)
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
                      this.callTianRunPhone (params.row.leadsPhone)
                    }
                  }
                })
                // h('Button', {
                //   style: {
                //     margin: '2px'
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
                //       this.callAnLaiPhone(params.row.leadsPhone)
                //     }
                //   }
                // })
              ])
            }
          },
          {
            title: '号码归属地',
            key: 'phoneLocation',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '年级',
            key: 'grade',
            align: 'center',
            minWidth: 90,
          },
          {
            title: 'CC姓名',
            key: 'ccName',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '渠道等级',
            key: 'channelLevel',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '渠道投放页',
            key: 'lpPage',
            align: 'center',
            minWidth: 150,
          },
          {
            title: '未跟进天数',
            key: 'lastCallTime',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '最新跟进记录',
            key: 'remarkContent',
            align: 'center',
            minWidth: 180,
            render: (h, params) => {
              let content = params.row.remarkContent;
              if (content && content.length > 38) {
                content = content.slice(0, 37) + '...';
                return h('div', [
                  h('span', {
                    props: {
                      title: params.row.remarkContent
                    }
                  }, content)
                ])
//                return `<span title="${row.remarkContent}">${content}</span>`;
              } else {
                return h('span', content);
              }
            }
          },
          {
            title: '接通状态',
            minWidth: 150,
            align: 'center',
            key: 'connectStatus',
            render: (h, params) => {
              switch (params.row.connectStatus) {
                case 'create':
                  return h ('div', [
                    h ('span', {
                      attrs: {
                        class: 'o-tag blue'
                      }
                    }, '新建')
                  ])
//              return `<span class="o-tag blue">新建</span>`;
                case 'wait':
                  return h ('div', [
                    h ('span', {
                      attrs: {
                        class: 'o-tag yellow'
                      }
                    }, '待拨打,待跟进')
                  ])
//              return `<span class="o-tag yellow">待拨打,待跟进</span>`;
                case 'noconnectwait':
                  return h ('div', [
                    h ('span', {
                      attrs: {
                        class: 'o-tag red'
                      }
                    }, '未接通,待跟进')
                  ])
//              return `<span class="o-tag red">未接通,待跟进</span>`;
                case 'connectwait':
                  return h ('div', [
                    h ('span', {
                      attrs: {
                        class: 'o-tag green'
                      }
                    }, '已接通,待跟进')
                  ])
//              return `<span class="o-tag green">已接通,待跟进</span>`;
                case 'successwait':
                  return h ('div', [
                    h ('span', {
                      attrs: {
                        class: 'o-tag green'
                      }
                    }, '已接通,同意排课')
                  ])
//              return `<span class="o-tag green">已接通,同意排课</span>`;
                case 'noconnectgiveup':
                  return h ('div', [
                    h ('span', {
                      attrs: {
                        class: 'o-tag red'
                      }
                    }, '未接通,放弃')
                  ])
//              return `<span class="o-tag red">未接通,放弃</span>`;
                case 'connectgiveup':
                  return h ('div', [
                    h ('span', {
                      attrs: {
                        class: 'o-tag red'
                      }
                    }, '已接通,放弃')
                  ])
                case 'A':
                  return h ('div', [
                    h ('span', {
                      attrs: {
                        class: 'o-tag red'
                      }
                    }, 'A')
                  ])
                case 'B':
                  return h ('div', [
                    h ('span', {
                      attrs: {
                        class: 'o-tag red'
                      }
                    }, 'B')
                  ])
                case 'C':
                  return h ('div', [
                    h ('span', {
                      attrs: {
                        class: 'o-tag red'
                      }
                    }, 'C')
                  ])
                case 'D':
                  return h ('div', [
                    h ('span', {
                      attrs: {
                        class: 'o-tag red'
                      }
                    }, 'D')
                  ])
                case 'E':
                  return h ('div', [
                    h ('span', {
                      attrs: {
                        class: 'o-tag red'
                      }
                    }, 'E')
                  ])
//              return `<span class="o-tag red">已接通,放弃</span>`;
                default:
                  return h ('div', [
                    h ('span', {
                      attrs: {
                        class: 'o-tag grey'
                      }
                    }, '未知状态')
                  ])
//              return `<span class="o-tag grey">未知状态</span>`;
              }
            }
          },
          {
            title: '负责时间',
            key: 'inChargeDate',
            align: 'center',
            minWidth: 180,
            render(h, params) {
              return h('span', formateDate(params.row.inChargeDate, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '报名时间',
            key: 'signupDate',
            align: 'center',
            minWidth: 180,
            render(h, params) {
              return h('span', formateDate(params.row.signupDate, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: ' ',
            key: '',
            minWidth: 30,
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            fixed: 'right',
            minWidth: 220,
            render: (h, params) => {
              if (params.row.connectStatus === 'successwait') {
                if(params.row.prizeContent){
                  return h('div', [
                    h('Button', {
                      props: {
                        type: 'warning',
                        size: 'small',
                        icon: 'ios-sunny',
                      },
                      style: {
                        margin: '2px',
                      },
                      attrs: {
                        title: '查看中奖信息',
                      },
                      on: {
                        click: () => {
                          this.showPrizeContent(params.row.prizeContent)
                        }
                      }
                    }),
                    h('Button', {
                      props: {
                        type: 'info',
                        size: 'small',
                        icon: 'ios-book',
                      },
                      style: {
                        margin: '2px',
                      },
                      attrs: {
                        title: '开调试课',
                        disabled: params.row.isDebugging == 1,
                      },
                      on: {
                        click: () => {
                          this.dubugCourse(params.row.leadsUuid)
                        }
                      }
                    }),
                    // h('Button', {
                    //   props: {
                    //     type: 'success',
                    //     size: 'small',
                    //     icon: 'clock',
                    //   },
                    //   style: {
                    //     margin: '2px',
                    //   },
                    //   attrs: {
                    //     title: '预约课程',
                    //   },
                    //   on: {
                    //     click: () => {
                    //       this.appointment(params.row.leadsUuid)
                    //     }
                    //   }
                    // }),
                    h('Button', {
                      props: {
                        type: 'primary',
                        size: 'small',
                        icon: 'edit',
                      },
                      style: {
                        margin: '2px',
                      },
                      attrs: {
                        title: '记录拨打'
                      },
                      on: {
                        click: () => {
                          this.recordCall(params.row.leadsUuid, params.row.connectStatus)
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
                      attrs: {
                        title: '备注',
                      },
                      on: {
                        click: () => {
                          this.addRemark(params.row.leadsPhone,params.row.leadsUuid)
                        }
                      }
                    }),
                    h ('Button', {
                      props: {
                        type: 'success',
                        size: 'small',
                        icon: 'android-sync',
                      },
                      style: {
                        margin: '2px',
                        display: this.assign ? "inline-block" : "none",
                      },
                      attrs: {
                        title: '分配'
                      },
                      on: {
                        click: () => {
                          this.distribution (params.row.leadsUuid)
                        }
                      }
                    })
                  ])
                }else{
                  return h('div', [
                    h('Button', {
                      props: {
                        type: 'info',
                        size: 'small',
                        icon: 'ios-book',
                      },
                      style: {
                        margin: '2px',
                      },
                      attrs: {
                        title: '开调试课',
                        disabled: params.row.isDebugging == 1,
                      },
                      on: {
                        click: () => {
                          this.dubugCourse(params.row.leadsUuid)
                        }
                      }
                    }),
                    // h('Button', {
                    //   props: {
                    //     type: 'success',
                    //     size: 'small',
                    //     icon: 'clock',
                    //   },
                    //   style: {
                    //     margin: '2px',
                    //   },
                    //   attrs: {
                    //     title: '预约课程',
                    //   },
                    //   on: {
                    //     click: () => {
                    //       this.appointment(params.row.leadsUuid)
                    //     }
                    //   }
                    // }),
                    h('Button', {
                      props: {
                        type: 'primary',
                        size: 'small',
                        icon: 'edit',
                      },
                      style: {
                        margin: '2px',
                      },
                      attrs: {
                        title: '记录拨打'
                      },
                      on: {
                        click: () => {
                          this.recordCall(params.row.leadsUuid, params.row.connectStatus)
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
                      attrs: {
                        title: '备注',
                      },
                      on: {
                        click: () => {
                          this.addRemark(params.row.leadsPhone,params.row.leadsUuid)
                        }
                      }
                    }),
                    h ('Button', {
                      props: {
                        type: 'success',
                        size: 'small',
                        icon: 'android-sync',
                      },
                      style: {
                        margin: '2px',
                        display: this.assign ? "inline-block" : "none",
                      },
                      attrs: {
                        title: '分配'
                      },
                      on: {
                        click: () => {
                          this.distribution (params.row.leadsUuid)
                        }
                      }
                    })
                  ])
                }
              }
              else if (params.row.connectStatus === 'openChannel') {
                if(params.row.prizeContent){
                  return h('div', [
                    h('Button', {
                      props: {
                        type: 'warning',
                        size: 'small',
                        icon: 'ios-sunny',
                      },
                      style: {
                        margin: '2px',
                      },
                      attrs: {
                        title: '查看中奖信息',
                      },
                      on: {
                        click: () => {
                          this.showPrizeContent(params.row.prizeContent)
                        }
                      }
                    }),
                    h('Button', {
                      props: {
                        type: 'info',
                        size: 'small',
                        icon: 'ios-book',
                      },
                      style: {
                        margin: '2px',
                      },
                      attrs: {
                        title: '开调试课',
                        disabled: params.row.isDebugging == 1,
                      },
                      on: {
                        click: () => {
                          this.dubugCourse(params.row.leadsUuid)
                        }
                      }
                    }),
                    // h('Button', {
                    //   props: {
                    //     type: 'success',
                    //     size: 'small',
                    //     icon: 'clock',
                    //   },
                    //   style: {
                    //     margin: '2px',
                    //   },
                    //   attrs: {
                    //     title: '预约课程',
                    //   },
                    //   on: {
                    //     click: () => {
                    //       this.appointment(params.row.leadsUuid)
                    //     }
                    //   }
                    // }),
                    h('Button', {
                      props: {
                        type: 'primary',
                        size: 'small',
                        icon: 'edit',
                      },
                      style: {
                        margin: '2px',
                      },
                      attrs: {
                        title: '记录拨打'
                      },
                      on: {
                        click: () => {
                          this.recordCall(params.row.leadsUuid, params.row.connectStatus)
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
                      attrs: {
                        title: '备注',
                      },
                      on: {
                        click: () => {
                          this.addRemark(params.row.leadsPhone,params.row.leadsUuid)
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
                      attrs: {
                        title: '绿色通道',
                      },
                      on: {
                        click: () => {

                          this.greenChannel(params.row.leadsUuid,params.row.leadsPhone)
                        }
                      }
                    }),

                    h ('Button', {
                      props: {
                        type: 'success',
                        size: 'small',
                        icon: 'android-sync',
                      },
                      style: {
                        margin: '2px',
                        display: this.assign ? "inline-block" : "none",
                      },
                      attrs: {
                        title: '分配'
                      },
                      on: {
                        click: () => {
                          this.distribution (params.row.leadsUuid)
                        }
                      }
                    })
                    // h('Button', {
                    //   props: {
                    //     type: 'error',
                    //     size: 'small',
                    //     icon: 'trash-b',
                    //   },
                    //   style: {
                    //     margin: '2px',
                    //   },
                    //   attrs: {
                    //     title: '放弃',
                    //   },
                    //   on: {
                    //     click: () => {
                    //       this.giveUp(params.row.leadsUuid)
                    //     }
                    //   }
                    // })
                  ])
                }else{
                  return h('div', [
                    h('Button', {
                      props: {
                        type: 'info',
                        size: 'small',
                        icon: 'ios-book',
                      },
                      style: {
                        margin: '2px',
                      },
                      attrs: {
                        title: '开调试课',
                        disabled: params.row.isDebugging == 1,
                      },
                      on: {
                        click: () => {
                          this.dubugCourse(params.row.leadsUuid)
                        }
                      }
                    }),
                    h('Button', {
                      props: {
                        type: 'primary',
                        size: 'small',
                        icon: 'edit',
                      },
                      style: {
                        margin: '2px',
                      },
                      attrs: {
                        title: '记录拨打'
                      },
                      on: {
                        click: () => {
                          this.recordCall(params.row.leadsUuid, params.row.connectStatus)
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
                      attrs: {
                        title: '备注',
                      },
                      on: {
                        click: () => {
                          this.addRemark(params.row.leadsPhone,params.row.leadsUuid)
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
                      attrs: {
                        title: '绿色通道',
                      },
                      on: {
                        click: () => {

                          this.greenChannel(params.row.leadsUuid,params.row.leadsPhone)
                        }
                      }
                    }),
                    h ('Button', {
                      props: {
                        type: 'success',
                        size: 'small',
                        icon: 'android-sync',
                      },
                      style: {
                        margin: '2px',
                        display: this.assign ? "inline-block" : "none",
                      },
                      attrs: {
                        title: '分配'
                      },
                      on: {
                        click: () => {
                          this.distribution (params.row.leadsUuid)
                        }
                      }
                    })
                  ])
                }
              }
              else{
                if(params.row.prizeContent){
                  return h('div', [
                    h('Button', {
                      props: {
                        type: 'warning',
                        size: 'small',
                        icon: 'ios-sunny',
                      },
                      style: {
                        margin: '2px',
                      },
                      attrs: {
                        title: '查看中奖信息',
                      },
                      on: {
                        click: () => {
                          this.showPrizeContent(params.row.prizeContent)
                        }
                      }
                    }),
                    h('Button', {
                      props: {
                        type: 'info',
                        size: 'small',
                        icon: 'ios-book',
                      },
                      style: {
                        margin: '2px',
                      },
                      attrs: {
                        title: '开调试课',
                        disabled: params.row.isDebugging == 1,
                      },
                      on: {
                        click: () => {
                          this.dubugCourse(params.row.leadsUuid)
                        }
                      }
                    }),
                    // h('Button', {
                    //   props: {
                    //     type: 'success',
                    //     size: 'small',
                    //     icon: 'clock',
                    //   },
                    //   style: {
                    //     margin: '2px',
                    //   },
                    //   attrs: {
                    //     title: '预约课程',
                    //   },
                    //   on: {
                    //     click: () => {
                    //       this.appointment(params.row.leadsUuid)
                    //     }
                    //   }
                    // }),
                    h('Button', {
                      props: {
                        type: 'primary',
                        size: 'small',
                        icon: 'edit',
                      },
                      style: {
                        margin: '2px',
                      },
                      attrs: {
                        title: '记录拨打'
                      },
                      on: {
                        click: () => {
                          this.recordCall(params.row.leadsUuid, params.row.connectStatus)
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
                      attrs: {
                        title: '备注',
                      },
                      on: {
                        click: () => {
                          this.addRemark(params.row.leadsPhone,params.row.leadsUuid)
                        }
                      }
                    }),
                    h ('Button', {
                      props: {
                        type: 'success',
                        size: 'small',
                        icon: 'android-sync',
                      },
                      style: {
                        margin: '2px',
                        display: this.assign ? "inline-block" : "none",
                      },
                      attrs: {
                        title: '分配'
                      },
                      on: {
                        click: () => {
                          this.distribution (params.row.leadsUuid)
                        }
                      }
                    })
                  ])
                }else{
                  return h('div', [
                    h('Button', {
                      props: {
                        type: 'info',
                        size: 'small',
                        icon: 'ios-book',
                      },
                      style: {
                        margin: '2px',
                      },
                      attrs: {
                        title: '开调试课',
                        disabled: params.row.isDebugging == 1,
                      },
                      on: {
                        click: () => {
                          this.dubugCourse(params.row.leadsUuid)
                        }
                      }
                    }),
                    // h('Button', {
                    //   props: {
                    //     type: 'success',
                    //     size: 'small',
                    //     icon: 'clock',
                    //   },
                    //   style: {
                    //     margin: '2px',
                    //   },
                    //   attrs: {
                    //     title: '预约课程',
                    //   },
                    //   on: {
                    //     click: () => {
                    //       this.appointment(params.row.leadsUuid)
                    //     }
                    //   }
                    // }),
                    h('Button', {
                      props: {
                        type: 'primary',
                        size: 'small',
                        icon: 'edit',
                      },
                      style: {
                        margin: '2px',
                      },
                      attrs: {
                        title: '记录拨打'
                      },
                      on: {
                        click: () => {
                          this.recordCall(params.row.leadsUuid, params.row.connectStatus)
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
                      attrs: {
                        title: '备注',
                      },
                      on: {
                        click: () => {
                          this.addRemark(params.row.leadsPhone,params.row.leadsUuid)
                        }
                      }
                    }),
                    h ('Button', {
                      props: {
                        type: 'success',
                        size: 'small',
                        icon: 'android-sync',
                      },
                      style: {
                        margin: '2px',
                        display: this.assign ? "inline-block" : "none",
                      },
                      attrs: {
                        title: '分配'
                      },
                      on: {
                        click: () => {
                          this.distribution (params.row.leadsUuid)
                        }
                      }
                    })
                  ])

                }
              }
            }
          }
        ],
        columns: [
          {
            type: 'selection',
            minWidth: 25,
            align: 'center',
            fixed: 'left',
          },
          {
            title: '学生姓名',
            key: 'leadsName',
            fixed: 'left',
            minWidth: 90,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('a', {
                  on: {
                    click: () => {
                      GLOBAL.viewLeadsDetail(params.row.leadsUuid)
                    }
                  }
                }, params.row.leadsName)
              ])
            }
          },
          {
            title: '手机号',
            key: 'leadsPhone',
            align: 'center',
            minWidth: 180,
            render: (h, params) => {
              return h('div', [
                h('span', hideCharAtNumber(params.row.leadsPhone)),
                h('Button', {
                  style: {
                    margin: '2px'
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
                      this.getFullPhone(params.row.leadsPhone)
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
                      this.callPhone(params.row.leadsPhone,params.row.channelUuid)
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
                      this.callTianRunPhone (params.row.leadsPhone)
                    }
                  }
                })
                // h('Button', {
                //   style: {
                //     margin: '2px'
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
                //       this.callAnLaiPhone(params.row.leadsPhone)
                //     }
                //   }
                // })
              ])
            }
          },
          {
            title: '号码归属地',
            key: 'phoneLocation',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '年级',
            key: 'grade',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '渠道等级',
            key: 'channelLevel',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '报名时间',
            key: 'signupDate',
            align: 'center',
            minWidth: 180,
            render(h, params) {
              return h('span', formateDate(params.row.signupDate, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '最新跟进记录',
            key: 'remarkContent',
            align: 'center',
            minWidth: 180,
            render: (h, params) => {
              let content = params.row.remarkContent;
              if (content && content.length > 38) {
                content = content.slice(0, 37) + '...';
                return h('div', [
                  h('span', {
                    props: {
                      title: params.row.remarkContent
                    }
                  }, content)
                ])
//                return `<span title="${row.remarkContent}">${content}</span>`;
              } else {
                return h('span', content);
              }
            }
          },
          {
            title: '负责时间',
            key: 'inChargeDate',
            align: 'center',
            minWidth: 180,
            render(h, params) {
              return h('span', formateDate(params.row.inChargeDate, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: ' ',
            key: '',
            minWidth: 30,
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            fixed: 'right',
            minWidth: 210,
            render: (h, params) => {
              if (params.row.connectStatus === 'successwait') {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'warning',
                      size: 'small',
                      icon: 'ios-sunny',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs: {
                      title: '查看中奖信息',
                    },
                    on: {
                      click: () => {
                        this.showPrizeContent(params.row.prizeContent)
                      }
                    }
                  }),
                  h('Button', {
                    props: {
                      type: 'info',
                      size: 'small',
                      icon: 'ios-book',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs: {
                      title: '开调试课',
                      disabled: params.row.isDebugging == 1,
                    },
                    on: {
                      click: () => {
                        this.dubugCourse(params.row.leadsUuid)
                      }
                    }
                  }),
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small',
                      icon: 'clock',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs: {
                      title: '预约课程',
                    },
                    on: {
                      click: () => {
                        this.appointment(params.row.leadsUuid)
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
                    attrs: {
                      title: '备注',
                    },
                    on: {
                      click: () => {
                        this.addRemark(params.row.leadsPhone,params.row.leadsUuid)
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
                    attrs: {
                      title: '绿色通道',
                    },
                    on: {
                      click: () => {

                        this.greenChannel(params.row.leadsUuid,params.row.leadsPhone)
                      }
                    }
                  }),
                ])
              } else {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'warning',
                      size: 'small',
                      icon: 'ios-sunny',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs: {
                      title: '查看中奖信息',
                    },
                    on: {
                      click: () => {
                        this.showPrizeContent(params.row.prizeContent)
                      }
                    }
                  }),
                  h('Button', {
                    props: {
                      type: 'info',
                      size: 'small',
                      icon: 'ios-book',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs: {
                      title: '开调试课',
                      disabled: params.row.isDebugging == 1,
                    },
                    on: {
                      click: () => {
                        this.dubugCourse(params.row.leadsUuid)
                      }
                    }
                  }),
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small',
                      icon: 'clock',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs: {
                      title: '预约课程',
                    },
                    on: {
                      click: () => {
                        this.appointment(params.row.leadsUuid)
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
                    attrs: {
                      title: '备注',
                    },
                    on: {
                      click: () => {
                        this.addRemark(params.row.leadsPhone,params.row.leadsUuid)
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
                    attrs: {
                      title: '绿色通道',
                    },
                    on: {
                      click: () => {
                        this.greenChannel(params.row.leadsUuid,params.row.leadsPhone)
                      }
                    }
                  }),
                ])
              }
            }
          }
        ],
        selectionCcRows: [],
      }
    },
    mounted() {
      this.searchForm();
      const _this = this;
      $.getJSON("static/data.json", function (json) {
        _this.gradeList = json.gradeList;
      });
    },
    methods: {
      selectRow(selection) {
        $sStorage.set('selectionCcRows' ,selection);
        // this.selectionRows = selection;
        this.selectionRowData = selection;
      },
      getSelectionAll(selection) {
        $sStorage.set('selectionCcRows' ,selection);
        this.selectionRowData = selection;
      },
      showSalesModal() {//批量分配
        console.log (this.selectionRowData);
        let row = this.selectionRowData;
        if (row.length > 0) {
          // this.$refs.sales.show();
          this.$refs.ccs.show (this.flag);
        } else {
          common.msg('请选择名单', 'warning');
        }
      },
      // 分配
      distribution (leadsId) {
        this.selectionCcRows.length = 1;
        this.selectionCcRows[0] = {"uuid": leadsId};
        $sStorage.set ('selectionCcRows', this.selectionCcRows);
        this.showDbModal ();
      },

      showDbModal () {
        this.flag = 'sig';
        let row = this.selectionCcRows;
        if (row.length > 0) {
          this.$refs.ccs.show (this.flag);
        } else {
          common.msg ('请选择名单', 'warning');
        }
      },
      recordCall(uuid, connectStatus) {
        this.$refs.recordcall.show(uuid, connectStatus);
      },
      showPrizeContent(prize){
        this.prizeContentModal = true;
        this.prizeContent = prize;
      },
      dubugCourse(uuid){
        const _this = this;
        _this.createDubugConfirm(uuid);
      },
      getFullPhone(phone) {
        getFullPhone(phone, COMMON_API().getPhoneHZ);
      },
      createDubugConfirm (uuid) {//开课弹窗
        const _this = this;
        this.$Modal.confirm({
          title: '开调试课',
          content: '<p>是否确定开通调试课</p>',
          onOk: () => {
            const _this = this;
            this.$axios.get(SCS().MyStudent.createDubugCourse,{
              params:{
                leadsUuid : uuid,
                alias : this.alias,
              },
            }).then( ({data}) => {
              if(data){
                this.$Notice.open({
                  title: '成功',
                  desc: data.msg
                });
              }
              this.searchForm();
            })
          },
        });
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
          common.msg('请选择一条数据', 'warning');
        } else if (row.length > 1) {
          common.msg('一次只能操作一条数据', 'warning');
        } else {
          this.$Modal.confirm({
            title: '确认',
            content: '学生<span class="required">【' + row[0].leadsName + '】</span>确认要【' + text + '优先跟进】吗？',
            onOk: function () {
              this.$axios.post(url,{
                leadsUuid: row[0].leadsUuid
              }).then( () => {
                common.notices('操作成功！');
                that.searchForm();
              })
            }
          });
        }
      },
      callTianRunPhone (phone) {
        this.$axios.post (TIANRUN ().Call.outCall, {
          phone: phone,
        }).then (() => {
          common.msg ('拨打成功', 'success');
        })
      },
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
      greenChannel(leadsUuid,studentPhone) {
        this.$refs.greenchannel.show('', '', leadsUuid, studentPhone,'greenChannelByCc','firSend');
      },
      addRemark(leadsPhone,leadsUuid) {
        let param = "?leadsPhone=" + leadsPhone+'&leadsUuid='+leadsUuid;
        const that = this;
        this.$axios.get(SCS().WaitFollowed.historyRemark,{
          params:{
            leadsPhone: leadsPhone,
            leadsUuid: leadsUuid,
          }
        }).then( ({data}) => {
          that.historyRemarkList = data.data;
          that.total = data.data.total;
        })
        this.$refs.addremark.show(leadsPhone,leadsUuid);
      },
      showCreateOrder() {
        const that = this;
        let row = this.selectionRowData;
        if (row.length === 0) {
          common.msg('请选择一条数据', 'warning');
        } else if (row.length > 1) {
          common.msg('一次只能操作一条数据', 'warning');
        } else {
          that.$refs.createOrder.show(row[0].leadsUuid);
        }
      },
      showCreateThirdOrder() {
        const that = this;
        let row = this.selectionRowData;
        if (row.length === 0) {
          common.msg('请选择一条数据', 'warning');
        } else if (row.length > 1) {
          common.msg('一次只能操作一条数据', 'warning');
        } else {
          that.$refs.createThirdOrder.show(row[0].leadsUuid);
        }
      },
      showCreateHuiStudyOrder() {
        const that = this;
        let row = this.selectionRowData;
        if (row.length === 0) {
          common.msg('请选择一条数据', 'warning');
        } else if (row.length > 1) {
          common.msg('一次只能操作一条数据', 'warning');
        } else {
          that.$refs.createHuistudyOrder.show(row[0].leadsUuid);
        }
      },
      showCreateBaiDuOrder() {
        const that = this;
        let row = this.selectionRowData;
        if (row.length === 0) {
          common.msg('请选择一条数据', 'warning');
        } else if (row.length > 1) {
          common.msg('一次只能操作一条数据', 'warning');
        } else {
          that.$refs.createBaiDuOrder.show(row[0].leadsUuid);
        }
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        let paramStr = this.Search.paramStr, name = '', phone = '';
        if (!paramStr) paramStr = '';
        if (isNaN(paramStr)) {
          name = paramStr;
        } else {
          phone = paramStr;
        }
        this.loadDataGrid({
          keyPointType: this.Search.keyPointType ? 1 : 0,
          name: name,
          phone: phone,
          grade: this.grade,
          ccName: this.Search.ccName,
          connectStatus: this.Search.connectStatus,
          startDate: this.Search.startDate,
          endDate: this.Search.endDate,
          signStartTime: this.Search.signStartTime,
          signEndTime: this.Search.signEndTime,
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?keyPointType=${search.keyPointType}&grade=${search.grade}&name=${search.name}&phone=${search.phone}&ccName=${search.ccName}&connectStatus=${search.connectStatus}
        &startDate=${search.startDate}&endDate=${search.endDate}&signStartTime=${search.signStartTime}&signEndTime=${search.signEndTime}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const that = this;
        this.$axios.get(SCS().MyStudent.cc_dataGrid,{
          params:{
            keyPointType: search.keyPointType,
            grade: search.grade,
            name: search.name,
            phone: search.phone,
            ccName: search.ccName,
            connectStatus: search.connectStatus,
            startDate: search.startDate,
            endDate: search.endDate,
            signStartTime: search.signStartTime,
            signEndTime: search.signEndTime,
            pageIndex: this.pageIndex,
            pageNumber: this.pageNumber,
            orderBy:orderBy,
            sortBy:sortBy,
          }
        }).then( ({data}) => {
          that.data = data.data.ManagerLeadsVos || [];
          that.total = data.data.total;
          that.assign = data.data.assign;
        })
      },
      request(leadsUuid) {
        this.$refs.payrequest.show('', leadsUuid);
      },
      giveUp(uuid) {
        this.$refs.giveup.show(uuid);
      },
      appointment(uuid) {
        sessionStorage.setItem('appointment_leadsUuid', uuid);
        sessionStorage.setItem('appointment_parent_menu_name', '我的学生');
        sessionStorage.setItem('appointment_parent_menu_url', '/scs/ccMyStudent');
        window.location.hash = '/scs/appointment';
      },
      rowClassName(row, index) {
        if (row.keyPoint) {
          return 'demo-table-error-row';
        } else {
          return '';
        }
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
      changeDate2(value) {
        this.Search.signStartTime = value[0] || '';
        this.Search.signEndTime = value[1] || '';
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
      OBreadcrumb, giveUp, greenChannel,recordCall, addRemark, createOrder, createThirdOrder,createHuistudyOrder, createBaiDuOrder,PageModel,selectSales
    }
  };
</script>
<style>
  .ivu-table .demo-table-error-row td {
    background-color: #f30 !important;
    color: #fff;
  }
  .ivu-table .demo-table-error-row td a {
    color: #fff;
  }
</style>
