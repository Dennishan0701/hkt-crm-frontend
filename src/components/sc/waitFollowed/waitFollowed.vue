<template>
  <div>
    <o-breadcrumb second="销售与客服" third="待跟进"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <i-button :size="$store.state.searchModuleSize" type="error" icon="checkmark"
                    @click="priorityFollow('enter')">优先跟进
          </i-button>
          <i-button :size="$store.state.searchModuleSize" icon="minus" @click="priorityFollow('cancel')">取消优先跟进
          </i-button>
          <i-button :size="$store.state.searchModuleSize" type="warning" icon="checkmark" @click="TMKFollow('enter')">
            TMK跟进标记
          </i-button>
          <i-button :size="$store.state.searchModuleSize" icon="minus" @click="TMKFollow('cancel')">取消TMK跟进标记</i-button>
        </i-col>
      </Row>
      <Row>
        <i-col span="24" class="right">
          <Checkbox :size="$store.state.searchModuleSize" v-model="Search.keyPointType">优先跟进</Checkbox>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.paramStr" @on-keyup.enter="searchForm(1)"
                   placeholder="学生\手机号"
                   style="width:150px;margin-right: 2px;"></i-input>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.grade" clearable placeholder="年级"
                    style="width:90px;">
            <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
          <i-select v-model="Search.channelName" :size="$store.state.searchModuleSize" filterable clearable
                    placeholder="渠道名称" style="width:150px;">
            <i-option v-for="(item,index) in allChannelList" :key='index' :value="item.name">{{ item.name }}</i-option>
          </i-select>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-end"
                       @on-change="changeSingupDate"
                       placeholder="报名时间" style="width: 200px"></Date-picker>
          <!--<i-select :size="$store.state.searchModuleSize" v-model="Search.connectStatus" clearable placeholder="接通状态" style="width:150px;">-->
          <!--<i-option value="create">新建</i-option>-->
          <!--<i-option value="wait">待拨打,待跟进</i-option>-->
          <!--<i-option value="noconnectwait">未接通,待跟进</i-option>-->
          <!--<i-option value="connectwait">已接通,待跟进</i-option>-->
          <!--<i-option value="successwait">已接通,同意排课</i-option>-->
          <!--<i-option value="noconnectgiveup">未接通,放弃</i-option>-->
          <!--<i-option value="connectgiveup">已接通,放弃</i-option>-->
          <!--</i-select>-->
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索
          </i-button>
        </i-col>
      </Row>
    </div>
    <div v-if="alias=='cc'">
      <checkbox-group v-model="tableColumnChecked" @on-change="changeTableColumns">
        <checkbox label="signUpCount">预约次数</checkbox>
        <checkbox label="lpPage">渠道投放页</checkbox>
        <checkbox label="lastCallTime">未跟进天数</checkbox>
        <checkbox label="phone">手机号</checkbox>
        <checkbox label="grade">年级</checkbox>
        <checkbox label="channelName">渠道名称</checkbox>
        <checkbox label="subject">试听科目</checkbox>
        <checkbox label="channelLevel">渠道等级</checkbox>
        <checkbox label="connectStatus">接通状态</checkbox>
        <checkbox label="tmkFollowDesc">TMK跟进记录</checkbox>
        <checkbox label="remarkContent">最新跟进记录</checkbox>
        <checkbox label="inChargeDate">负责时间</checkbox>
      </checkbox-group>
    </div>
    <div v-else>
      <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
        <checkbox label="signUpCount">预约次数</checkbox>
        <checkbox label="phone">手机号</checkbox>
        <checkbox label="grade">年级</checkbox>
        <checkbox label="channelName">渠道名称</checkbox>
        <checkbox label="subject">试听科目</checkbox>
        <checkbox label="channelLevel">渠道等级</checkbox>
        <checkbox label="connectStatus">接通状态</checkbox>
        <checkbox label="remarkContent">最新跟进记录</checkbox>
        <checkbox label="signupDate">报名时间</checkbox>
        <checkbox label="inChargeDate">负责时间</checkbox>
      </checkbox-group>
    </div>
    <i-table size="small" :row-class-name="rowClassName" :height="iTableHeight"
             :columns="alias=='cc'?column:columns" :data="data" @on-sort-change='sort'
             @on-selection-change="selectRow"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :current="pageIndex" :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>

    <add-remark @reFresh="reFresh" ref="addremark" :history-remark-list="historyRemarkList"></add-remark>
    <record-call @reFresh="reFresh" ref="recordcall"></record-call>
    <select-sales @reFresh="reFresh" ref="ccs" form-type="1"></select-sales>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {SCS} from 'common/api/scs.js';
  import {ANLAI} from 'common/api/anlai.js';
  import {TIANRUN} from 'common/api/tianrun.js';
  import {formateDate, common, hideCharAtNumber, getFullPhone} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import addRemark from './addRemark';
  import recordCall from './recordCall';
  import PageModel from 'dashborader/page/page.vue';
  import selectSales from './selectSales';

  const $localStorage = $.localStorage;
  const $sStorage = $.sessionStorage;
  export default {
    data () {
      return {
        tmkStatus: 1,
        assign: false,
        data: [],
        tableColumnsChecked: ['signUpCount', 'phone', 'phoneLocation', 'grade', 'channelName', 'subject', 'channelLevel',
          'connectStatus', 'remarkContent', 'signupDate', 'inChargeDate', 'action'],
        tableColumnChecked: ['signUpCount','lpPage','lastCallTime', 'phone', 'phoneLocation', 'grade', 'channelName', 'subject', 'channelLevel',
          'connectStatus', 'tmkFollowDesc', 'remarkContent', 'inChargeDate', 'action'],
        total: 0,
        pageIndex: 1,
        orderBy: '',
        sortBy: '',
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        currentRowData: {},
        historyRemarkList: [],  //历史备注列表
        selectionRows: [],
        selectionCcRows: [],
        gradeList: [],
        Search: {
          keyPointType: false,
          paramStr: '',
          startDate: '',
          grade: '',
          endDate: '',
          connectStatus: '',
          channelName: ''
        },
        allChannelList: [],
        selectionRowData: [],
        columns: [],
        column: [],
        alias: $localStorage.get ('user').alias,
      }
    },
    mounted () {
      this.searchForm ();
      this.changeTableColumns ();
      const _this = this;
      $.getJSON ("static/data.json", function (json) {
        _this.gradeList = json.gradeList;
      });
      this.getAllChannel ()
    },
    methods: {
      // 获取所有渠道
      getAllChannel () {
        const _this = this;
        common.ajax ({
          url: COMMON_API ().allChannel,
          method: 'get',
          success: function (response) {
            _this.allChannelList = response.data || [];
          }
        });
      },
      getTableColumn () {
        const columns = {
          selection: {
            type: 'selection',
            minWidth: 25,
            align: 'center',
            fixed: 'left'
          },
          name: {
            title: '学生姓名',
            key: 'name',
            minWidth: 90,
            fixed: 'left',
            align: 'center',
            render: (h, params) => {
              if (params.row.isWarn && params.row.isRedLeads) {
                return h ('div', [
                  h ('a', {
                    style: {
                      color: '#ed3f14'
                    },
                    on: {
                      click: () => {
                        GLOBAL.viewLeadsDetail (params.row.uuid)
                      }
                    }
                  }, [
                    h ('span', {}, params.row.name),
                    h ('i', {
                      prosps: {
                        class: 'ivu-icon ivu-icon-alert-circled'
                      },
                      style: {
                        color: '#ed3f14'
                      }
                    })
                  ])
                ])

//            return `<strong><a style="color: #ed3f14;" href="javascript:GLOBAL.viewLeadsDetail('${row.uuid}');">${row.name}<Icon style='color: #ed3f14;' type="alert-circled"></Icon></a></strong>`;
              } else if (params.row.isWarn) {
                return h ('div', [
                  h ('a', {
                    style: {},
                    on: {
                      click: () => {
                        GLOBAL.viewLeadsDetail (params.row.uuid)
                      }
                    }
                  }, [
                    h ('span', {}, params.row.name),
                    h ('i', {
                      prosps: {
                        class: 'ivu-icon ivu-icon-alert-circled'
                      },
                      style: {
                        color: '#ed3f14'
                      }
                    })
                  ])
                ])
//            return `<strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.uuid}');">${row.name}<Icon style='color: #ed3f14;' type="alert-circled"></Icon></a></strong>`;
              } else if (params.row.isRedLeads) {
                return h ('div', [
                  h ('a', {
                    style: {
                      color: '#ed3f14'
                    },
                    on: {
                      click: () => {
                        GLOBAL.viewLeadsDetail (params.row.uuid)
                      }
                    }
                  }, [
                    h ('span', {}, params.row.name),
                    h ('i', {
                      prosps: {},
                      style: {
                        color: '#ed3f14'
                      }
                    })
                  ])
                ])
//            return `<strong><a style="color: #ed3f14;" href="javascript:GLOBAL.viewLeadsDetail('${row.uuid}');">${row.name}</a></strong>`;
              } else {
                return h ('div', [
                  h ('a', {
                    style: {},
                    on: {
                      click: () => {
                        GLOBAL.viewLeadsDetail (params.row.uuid)
                      }
                    }
                  }, [
                    h ('span', {}, params.row.name),
                    h ('i', {
                      prosps: {},
                      style: {}
                    })
                  ])
                ])
//            return `<strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.uuid}');">${row.name}</a></strong>`;
              }
            }
          },
          signUpCount: {
            title: '预约次数',
            key: 'signUpCount',
            minWidth: 90,
            align: 'center',
          },
          lpPage: {
            title: '渠道投放页',
            key: 'lpPage',
            align: 'center',
            minWidth: 150,
          },
          lastCallTime: {
            title: '未跟进天数',
            key: 'lastCallTime',
            align: 'center',
            minWidth: 90,
          },
          phone: {
            title: '手机号',
            key: 'phone',
            align: 'center',
            minWidth: 220,
            render: (h, params) => {
              if (params.row.phone) {
                return h ('div', [
                  h ('span', hideCharAtNumber (params.row.phone)),
                  h ('Button', {
                    style: {
                      margin: '2px'
                    },
                    props: {
                      size: 'small',
                    },
                    attrs: {
                      type: 'success',
                      icon: 'eye',
                      title: '显示完整号码'
                    },
                    on: {
                      click: () => {
                        this.getFullPhone (params.row.phone)
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
                      type: 'info',
                      icon: 'android-call',
                      title: '融营拨打电话'
                    },
                    on: {
                      click: () => {
                        this.callPhone (params.row.phone, params.row.channelUuid)
                      }
                    }
                  }),
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
                  // }),
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
                ])
              } else {
                return '-';
              }
            }
          },
          grade: {
            title: '年级',
            align: 'center',
            key: 'grade',
            minWidth: 80
          },
          phoneLocation: {
            title: '号码归属地',
            align: 'center',
            key: 'phoneLocation',
            minWidth: 90
          },
          channelName: {
            title: '渠道名称',
            align: 'center',
            key: 'channelName',
            minWidth: 90
          },
          subject: {
            title: '试听科目',
            key: 'subject',
            align: 'center',
            minWidth: 100
          },
          channelLevel: {
            title: '渠道等级',
            key: 'channelLevel',
            align: 'center',
            minWidth: 90,
          },
          connectStatus: {
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
          tmkFollowDesc: {
            title: 'tmk跟进记录',
            key: 'tmkFollowDesc',
            align: 'center',
            minWidth: 150,
          },
          remarkContent: {
            title: '最新跟进记录',
            key: 'remarkContent',
            align: 'center',
            minWidth: 300,
            render: (h, params) => {
              let content = params.row.remarkContent;
              if (content && content.length > 62) {
                content = content.slice (0, 61) + '...';
                return h ('div', [
                  h ('span', {
                    props: {
                      title: params.row.remarkContent
                    }
                  }, content)
                ])
//            return `<span title="${row.remarkContent}">${content}</span>`;
              } else {
                return h ('div', [
                  h ('span', {}, content)
                ]);
              }
            }
          },
          inChargeDate: {
            title: '负责时间',
            key: 'inChargeDate',
            align: 'center',
            minWidth: 180,
            render (h, params) {
              return h ('span', {}, formateDate (params.row.inChargeDate, 'yyyy-MM-dd hh:mm:ss'))
            }
          },
          action: {
            title: '操作',
            key: 'action',
            minWidth: 150,
            align: 'center',
            fixed: 'right',
            render: (h, params) => {
              if (params.row.connectStatus === 'successwait') {
                return h ('div', [
                  h ('Button', {
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
                        this.recordCall (params.row.uuid, params.row.connectStatus)
                      }
                    }
                  }),
                  h ('Button', {
                    props: {
                      type: 'success',
                      size: 'small',
                      icon: 'clock',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs: {
                      title: '预约课程'
                    },
                    on: {
                      click: () => {
                        this.appointment (params.row.uuid)
                      }
                    }
                  }),
                  h ('Button', {
                    props: {
                      type: 'info',
                      size: 'small',
                      icon: 'ios-chatboxes',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs: {
                      title: '备注'
                    },
                    on: {
                      click: () => {
                        this.addRemark (params.row.phone, params.row.uuid)
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
                        this.distribution (params.row.uuid)
                      }
                    }
                  })
                ])
//            return `<i-button type="primary" size="small" icon="edit" title="记录拨打" @click="recordCall('${row.uuid}','${row.connectStatus}')"></i-button>
//                <i-button type="success" size="small" icon="clock" title="预约课程" @click="appointment('${row.uuid}')"></i-button>
//                <i-button type="info" size="small" icon="ios-chatboxes" title="备注" @click="addRemark('${row.phone}')"></i-button>`;
              }
              else {
                return h ('div', [
                  h ('Button', {
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
                        this.recordCall (params.row.uuid, params.row.connectStatus)
                      }
                    }
                  }),
                  h ('Button', {
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
                      disabled: true
                    },
                    on: {
                      click: () => {
                        this.appointment (params.row.uuid)
                      }
                    }
                  }),
                  h ('Button', {
                    props: {
                      type: 'info',
                      size: 'small',
                      icon: 'ios-chatboxes',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs: {
                      title: '备注'
                    },
                    on: {
                      click: () => {
                        this.addRemark (params.row.phone, params.row.uuid)
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
                        this.distribution (params.row.uuid)
                      }
                    }
                  })
                ])
//            return `<i-button type="primary" size="small" icon="edit" title="记录拨打" @click="recordCall('${row.uuid}','${row.connectStatus}')"></i-button>
//                <i-button type="success" size="small" icon="clock" title="预约课程" disabled @click="appointment('${row.uuid}')"></i-button>
//                <i-button type="info" size="small" icon="ios-chatboxes" title="备注" @click="addRemark('${row.phone}')"></i-button>`;
              }
            }
          }
        };
        let datas = [columns.selection, columns.name,];
        this.tableColumnChecked.forEach (col => datas.push (columns[col]));
        return datas;
      },
      getTableColumns () {
        const columns = {
          selection: {
            type: 'selection',
            minWidth: 25,
            align: 'center',
            fixed: 'left'
          },
          name: {
            title: '学生姓名',
            key: 'name',
            minWidth: 90,
            fixed: 'left',
            align: 'center',
            render: (h, params) => {
              if (params.row.isWarn && params.row.isRedLeads) {
                return h ('div', [
                  h ('a', {
                    style: {
                      color: '#ed3f14'
                    },
                    on: {
                      click: () => {
                        GLOBAL.viewLeadsDetail (params.row.uuid)
                      }
                    }
                  }, [
                    h ('span', {}, params.row.name),
                    h ('i', {
                      prosps: {
                        class: 'ivu-icon ivu-icon-alert-circled'
                      },
                      style: {
                        color: '#ed3f14'
                      }
                    })
                  ])
                ])

//            return `<strong><a style="color: #ed3f14;" href="javascript:GLOBAL.viewLeadsDetail('${row.uuid}');">${row.name}<Icon style='color: #ed3f14;' type="alert-circled"></Icon></a></strong>`;
              } else if (params.row.isWarn) {
                return h ('div', [
                  h ('a', {
                    style: {},
                    on: {
                      click: () => {
                        GLOBAL.viewLeadsDetail (params.row.uuid)
                      }
                    }
                  }, [
                    h ('span', {}, params.row.name),
                    h ('i', {
                      prosps: {
                        class: 'ivu-icon ivu-icon-alert-circled'
                      },
                      style: {
                        color: '#ed3f14'
                      }
                    })
                  ])
                ])
//            return `<strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.uuid}');">${row.name}<Icon style='color: #ed3f14;' type="alert-circled"></Icon></a></strong>`;
              } else if (params.row.isRedLeads) {
                return h ('div', [
                  h ('a', {
                    style: {
                      color: '#ed3f14'
                    },
                    on: {
                      click: () => {
                        GLOBAL.viewLeadsDetail (params.row.uuid)
                      }
                    }
                  }, [
                    h ('span', {}, params.row.name),
                    h ('i', {
                      prosps: {},
                      style: {
                        color: '#ed3f14'
                      }
                    })
                  ])
                ])
//            return `<strong><a style="color: #ed3f14;" href="javascript:GLOBAL.viewLeadsDetail('${row.uuid}');">${row.name}</a></strong>`;
              } else {
                return h ('div', [
                  h ('a', {
                    style: {},
                    on: {
                      click: () => {
                        GLOBAL.viewLeadsDetail (params.row.uuid)
                      }
                    }
                  }, [
                    h ('span', {}, params.row.name),
                    h ('i', {
                      prosps: {},
                      style: {}
                    })
                  ])
                ])
//            return `<strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.uuid}');">${row.name}</a></strong>`;
              }
            }
          },
          signUpCount: {
            title: '预约次数',
            key: 'signUpCount',
            minWidth: 90,
            align: 'center',
          },
          phone: {
            title: '手机号',
            key: 'phone',
            align: 'center',
            minWidth: 180,
            render: (h, params) => {
              if (params.row.phone) {
                return h ('div', [
                  h ('span', hideCharAtNumber (params.row.phone)),

                  h ('Button', {
                    style: {
                      margin: '2px'
                    },
                    props: {
                      size: 'small',
                    },
                    attrs: {
                      type: 'success',
                      icon: 'eye',
                      title: '显示完整号码'
                    },
                    on: {
                      click: () => {
                        this.getFullPhone (params.row.phone)
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
                      type: 'info',
                      icon: 'android-call',
                      title: '融营拨打电话'
                    },
                    on: {
                      click: () => {
                        this.callPhone (params.row.phone, params.row.channelUuid)
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
            }
          },
          grade: {
            title: '年级',
            align: 'center',
            key: 'grade',
            minWidth: 80
          },
          phoneLocation: {
            title: '号码归属地',
            align: 'center',
            key: 'phoneLocation',
            minWidth: 90
          },
          channelName: {
            title: '渠道名称',
            align: 'center',
            key: 'channelName',
            minWidth: 90
          },
          subject: {
            title: '试听科目',
            key: 'subject',
            align: 'center',
            minWidth: 100
          },
          channelLevel: {
            title: '渠道等级',
            key: 'channelLevel',
            align: 'center',
            minWidth: 90,
          },
          connectStatus: {
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
          remarkContent: {
            title: '最新跟进记录',
            key: 'remarkContent',
            align: 'center',
            minWidth: 300,
            render: (h, params) => {
              let content = params.row.remarkContent;
              if (content && content.length > 62) {
                content = content.slice (0, 61) + '...';
                return h ('div', [
                  h ('span', {
                    props: {
                      title: params.row.remarkContent
                    }
                  }, content)
                ])
//            return `<span title="${row.remarkContent}">${content}</span>`;
              } else {
                return h ('div', [
                  h ('span', {}, content)
                ]);
              }
            }
          },
          signupDate: {
            title: '报名时间',
            key: 'signupDate',
            align: 'center',
            minWidth: 180,
            sortable: true,
            render (h, params) {
              return h ('span', {}, formateDate (params.row.signupDate, 'yyyy-MM-dd hh:mm:ss'))
            }
          },
          inChargeDate: {
            title: '负责时间',
            key: 'inChargeDate',
            align: 'center',
            minWidth: 180,
            render (h, params) {
              return h ('span', {}, formateDate (params.row.inChargeDate, 'yyyy-MM-dd hh:mm:ss'))
            }
          },
          action: {
            title: '操作',
            key: 'action',
            minWidth: 120,
            align: 'center',
            fixed: 'right',
            render: (h, params) => {
              if (params.row.connectStatus === 'successwait') {
                return h ('div', [
                  h ('Button', {
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
                        this.recordCall (params.row.uuid, params.row.connectStatus)
                      }
                    }
                  }),
                  h ('Button', {
                    props: {
                      type: 'success',
                      size: 'small',
                      icon: 'clock',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs: {
                      title: '预约课程'
                    },
                    on: {
                      click: () => {
                        this.appointment (params.row.uuid)
                      }
                    }
                  }),
                  h ('Button', {
                    props: {
                      type: 'info',
                      size: 'small',
                      icon: 'ios-chatboxes',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs: {
                      title: '备注'
                    },
                    on: {
                      click: () => {
                        this.addRemark (params.row.phone, params.row.uuid)
                      }
                    }
                  })
                ])
              } else {
                return h ('div', [
                  h ('Button', {
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
                        this.recordCall (params.row.uuid, params.row.connectStatus)
                      }
                    }
                  }),
                  h ('Button', {
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
                      disabled: true
                    },
                    on: {
                      click: () => {
                        this.appointment (params.row.uuid)
                      }
                    }
                  }),
                  h ('Button', {
                    props: {
                      type: 'info',
                      size: 'small',
                      icon: 'ios-chatboxes',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs: {
                      title: '备注'
                    },
                    on: {
                      click: () => {
                        this.addRemark (params.row.phone, params.row.uuid)
                      }
                    }
                  })
                ])
              }
            }
          }
        };
        let datas = [columns.selection, columns.name,];
        this.tableColumnsChecked.forEach (col => datas.push (columns[col]));
        return datas;
      },
      sort (value) {
        console.log (value.order);
        if (value.order == 'normal') {
          this.sortBy = ''
          this.orderBy = ''
        } else {
          this.sortBy = value.order
          this.orderBy = 'signupDate'
        }
        this.searchForm ();
      },
      priorityFollow (flag) {
        const that = this;
        let row = this.selectionRowData;
        let url = SCS ().WaitFollowed.priorityFollow;
        let text = (flag === 'cancel') ? '取消' : '标记';
        if (flag === 'cancel') {
          url = SCS ().WaitFollowed.cancelPriorityFollow;
        }
        if (row.length === 0) {
          common.notices ('提示', '请选择一条数据', 'warning');
        } else if (row.length > 1) {
          common.notices ('提示', '一次只能操作一条数据', 'warning');
        } else {
          this.$Modal.confirm ({
            title: '确认',
            content: '学生<span class="required">【' + row[0].name + '】</span>确认要【' + text + '优先跟进】吗？',
            onOk: function () {
              this.$axios.post (url, {
                leadsUuid: row[0].uuid
              }).then (() => {
                common.notices ('操作成功！');
                that.searchForm ();
              })
            }
          });
        }
      },
      TMKFollow (flag) {
        const that = this;
        let row = this.selectionRowData;
        let url = SCS ().WaitFollowed.tmkWaitSign;
        let text = (flag === 'cancel') ? '取消' : '标记';
        if (flag === 'cancel') {
          url = SCS ().WaitFollowed.tmkWaitSign;
          that.tmkStatus = 0;
        } else if (flag === 'enter') {
          that.tmkStatus = 1;
        }
        if (row.length === 0) {
          common.notices ('提示', '请选择一条数据', 'warning');
        } else if (row.length > 1) {
          common.notices ('提示', '一次只能操作一条数据', 'warning');
        } else {
          this.$Modal.confirm ({
            title: '确认',
            content: '学生<span class="required">【' + row[0].name + '】</span>确认要【' + text + 'TMK跟进】吗？',
            onOk: function () {
              this.$axios.get (url, {
                params: {
                  leadsUuid: row[0].uuid,
                  tmkStatus: that.tmkStatus,
                }
              }).then (() => {
                common.notices ('操作成功！');
                that.searchForm ();
              })
            }
          });
        }
      },
      callAnLaiPhone (phone) {
        let anLaiAccout = $localStorage.get ('anLaiAccout');
        if (anLaiAccout) {
          this.$axios.post (ANLAI ().CallPhone.call, {
            userLogin: anLaiAccout.userLogin,
            userPass: anLaiAccout.userPass,
            phoneLogin: anLaiAccout.phoneLogin,
            phonePass: anLaiAccout.phonePass,
            phoneNumber: phone,
          }).then (() => {
            common.msg ('拨打成功', 'success');
          })
        } else {
          common.msg ('未登录安莱账号！！！', 'error');
        }
      },
      callTianRunPhone (phone) {
          this.$axios.post (TIANRUN ().Call.outCall, {
            phone: phone,
          }).then (() => {
            common.msg ('拨打成功', 'success');
          })
      },
      callPhone (phone, channelUuid) {
        let user = $localStorage.get ('user');
        if (user && user.uuid) {
          this.$axios.post (COMMON_API ().Phone.RYcallPhone, {
            toPhone: phone,
            uuid: user.uuid,
            channelUuid: channelUuid || '',
          }).then (() => {
            common.msg ('拨打成功', 'success');
          })
        } else {
          common.msg ('拨打失败，请重新登录', 'error');
        }
      },
      getFullPhone (phone) {
        getFullPhone (phone, COMMON_API ().getPhoneHZ);
      },
      searchForm (val) {
        if (val) this.pageIndex = val;
        let paramStr = this.Search.paramStr, name = '', phone = '';
        if (!paramStr) paramStr = '';
        if (isNaN (paramStr)) {
          name = paramStr;
        } else {
          phone = paramStr;
        }
        this.loadDataGrid ({
          keyPointType: this.Search.keyPointType ? 1 : 0,
          name: name,
          phone: phone,
          startDate: this.Search.startDate,
          grade: this.Search.grade,
          endDate: this.Search.endDate,
          connectStatus: this.Search.connectStatus,
          channelName: this.Search.channelName,
        });
      },
      loadDataGrid (search, orderBy = this.orderBy, sortBy = this.sortBy) {
        const that = this;
        this.$axios.get (SCS ().WaitFollowed.dataGrid, {
          params: {
            keyPointType: search.keyPointType,
            grade: search.grade,
            name: search.name,
            phone: search.phone,
            startDate: search.startDate,
            endDate: search.endDate,
            connectStatus: search.connectStatus,
            channelName: search.channelName,
            pageIndex: this.pageIndex,
            pageNumber: this.pageNumber,
            orderBy: orderBy,
            sortBy: sortBy,
          }
        }).then (({data}) => {
          that.data = data.data.leads || [];
          that.total = data.data.total;
          that.assign = data.data.assign;
        })
      },
      recordCall (uuid, connectStatus) {
        this.$refs.recordcall.show (uuid, connectStatus);
      },
      addRemark (phone, uuid) {
        let param = "?leadsPhone=" + phone + "&leadsUuid=" + uuid;
        const that = this;
        this.$axios.get (SCS ().WaitFollowed.historyRemark, {
          params: {
            leadsPhone: phone,
            leadsUuid: uuid,
          }
        }).then (({data}) => {
          that.historyRemarkList = data.data || [];
          that.total = data.data.total;
        })
        this.$refs.addremark.show (phone, uuid);
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
      appointment (uuid) {
        sessionStorage.setItem ('appointment_leadsUuid', uuid);
        sessionStorage.setItem ('appointment_parent_menu_name', '待跟进');
        sessionStorage.setItem ('appointment_parent_menu_url', '/scs/waitFollowed');
        window.location.hash = '/scs/appointment';
      },
      rowClassName (row, index) {
        if (row.keyPoint) {
          return 'demo-table-error-row';
        } else if (row.tmkSignStatus) {
          return 'demo-table-warning-row';
        }
        return '';
      },
      selectRow (selection) {
        this.selectionRowData = selection;
        console.log (selection);
      },
      pageChange (pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm ();
      },
      changeSingupDate (value) {
        this.Search.startDate = value[0] || '';
        this.Search.endDate = value[1] || '';
      },
      changeTableColumns () {
        this.columns = this.getTableColumns ();
        this.column = this.getTableColumn ();
      },
      reFresh () {
        this.searchForm ();
      }
    },
    computed: {
      theight () {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470 : '';
      },
      iTableHeight () {
        if (SCREEN_SIZE === 'md' && this.data.length > 11) {
          return 510;
        } else if (SCREEN_SIZE === 'lg' && this.data.length > 19) {
          return 820;
        } else {
          return '';
        }
      }
    },
    components: {
      OBreadcrumb, addRemark, recordCall, PageModel, selectSales
    }
  };
</script>

<style scoped>
  .ivu-table .demo-table-error-row td {
    background-color: #424242 !important;
    color: #fff;
  }

  .ivu-table .demo-table-error-row td a {
    color: #fff;
  }

  .ivu-table .demo-table-warning-row td {
    background-color: #ffbe28 !important;
    color: #fff;
  }

  .ivu-table .demo-table-warning-row td a {
    color: #fff;
  }
</style>
