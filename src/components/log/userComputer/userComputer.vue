
<template>
  <div class="businessLog">
    <o-breadcrumb second="日志监控" third="用户设备信息"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="23" class="right">
          登录帐号：<i-input v-model="roleName" :size="$store.state.searchModuleSize" @on-keyup.enter="search(1)" placeholder="手机号或登录名" style="width:120px;margin-right:3px;"></i-input>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="search(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <i-table class="userTable" size="large" border stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {SYS_BUSINESS} from 'common/api/logs.js';
  import {formateDate,common} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: 1,
        roleName: '',
        columns: [
          {
            title: '电脑概况',
            key: 'optModuleDesc',
            render : (h, params) => {
              return h('div',[
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'电脑型号'),
                  h('span',{
                    style:{
                      wordWrap:'break-word'
                    }
                  },params.row.computerModel)
                ]),
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'操作系统'),
                  h('span',{
                    style:{
                      wordWrap:'break-word'
                    }
                  },params.row.operationSystem)
                ]),
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'处理器'),
                  h('span',{
                    style:{
                      wordWrap:'break-word'
                    }
                  },params.row.processor)
                ]),
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'主板'),
                  h('span',{
                    style:{
                      wordWrap:'break-word'
                    }
                  },params.row.motherboard)
                ]),
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'字长'),
                  h('span',{
                    style:{
                      wordWrap:'break-word'
                    }
                  },params.row.a)
                ]),
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'内存'),
                  h('span',{
                    style:{
                      wordWrap:'break-word'
                    }
                  },params.row.ram)
                ]),
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'主硬盘'),
                  h('span',{
                    style:{
                      wordWrap:'break-word'
                    }
                  },params.row.hardDisk)
                ]),
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'显卡'),
                  h('span',{
                    style:{
                      wordWrap:'break-word'
                    }
                  },params.row.graphicsCard)
                ]),
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'显示器'),
                  h('span',{
                    style:{
                      wordWrap:'break-word'
                    }
                  },params.row.monitor)
                ]),
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'光驱'),
                  h('span',{
                    style:{
                      wordWrap:'break-word'
                    }
                  },params.row.opticalDrive)
                ]),
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'声卡'),
                  h('span',{
                    style:{
                      wordWrap:'break-word'
                    }
                  },params.row.soundCard)
                ]),
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'网卡'),
                  h('span',{
                    style:{
                      wordWrap:'break-word'
                    }
                  },params.row.networkCard)
                ]),
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'电池'),
                  h('span',{
                    style:{
                      wordWrap:'break-word'
                    }
                  },params.row.battery)
                ]),
              ])
//              return `
//                <p class="userItem"><span>电脑型号</span><span>${row.computerModel}</span></p>
//                <p class="userItem"><span>操作系统</span><span>${row.operationSystem}</span></p>
//                <p class="userItem"><span>处理器</span><span>${row.processor}</span></p>
//                <p class="userItem"><span>主板</span><span>${row.motherboard}</span></p>
//                <!--<p><span>字长</span><span>${row.a}</span></p>-->
//                <p class="userItem"><span>内存</span><span>${row.ram}</span></p>
//                <p class="userItem"><span>主硬盘</span><span>${row.hardDisk}</span></p>
//                <p class="userItem"><span>显卡</span><span>${row.graphicsCard}</span></p>
//                <p class="userItem"><span>显示器</span><span>${row.monitor}</span></p>
//                <p class="userItem"><span>光驱</span><span>${row.opticalDrive}</span></p>
//                <p class="userItem"><span>声卡</span><span>${row.soundCard}</span></p>
//                <p class="userItem"><span>网卡</span><span>${row.networkCard}</span></p>
//                <p class="userItem"><span>电池</span><span>${row.battery}</span></p>
//                `
            }
          },
          {
            title: '操作系统信息',
            key: 'optTypeDesc',
            render(h,params){

              return h('div',[
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'操作系统'),
                  h('span',{
                    style:{
                      wordWrap:'break-word'
                    }
                  },params.row.systemVersion)
                ]),
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'版本号'),
                  h('span',{
                    style:{
                      wordWrap:'break-word'
                    }
                  },params.row.a)
                ]),
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'计算机名'),
                  h('span',{
                    style:{
                      wordWrap:'break-word'
                    }
                  },params.row.computerName)
                ]),
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'系统安装日期'),
                  h('span',{
                    style:{
                      wordWrap:'break-word'
                    }
                  },params.row.systemInstallationDate)
                ]),
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'系统启动时间'),
                  h('span',{
                    style:{
                      wordWrap:'break-word'
                    }
                  },params.row.systemStartupTime)
                ]),
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'制造商'),
                  h('span',{
                    style:{
                      wordWrap:'break-word'
                    }
                  },params.row.manufacturer)
                ]),
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'系统语言'),
                  h('span',{
                    style:{
                      wordWrap:'break-word'
                    }
                  },params.row.systemLanguage)
                ]),
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'系统架构'),
                  h('span',{
                    style:{
                      wordWrap:'break-word'
                    }
                  },params.row.systemStructure)
                ]),
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'IP地址'),
                  h('span',{
                    style:{
                      wordWrap:'break-word'
                    }
                  },params.row.ipAddress)
                ]),
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'MAC地址'),
                  h('span',{
                    style:{
                      wordWrap:'break-word'
                    }
                  },params.row.macAddress)
                ]),
              ])
//              return `
//                <p class="userItem"><span>操作系统</span><span>${row.systemVersion}</span></p>
//                <!--<p><span>版本号</span><span>${row.a}</span></p>-->
//                <p class="userItem"><span>计算机名</span><span>${row.computerName}</span></p>
//                <p class="userItem"><span>系统安装日期</span><span>${row.systemInstallationDate}</span></p>
//                <p class="userItem"><span>系统启动时间</span><span>${row.systemStartupTime}</span></p>
//                <p class="userItem"><span>制造商</span><span>${row.manufacturer}</span></p>
//                <p class="userItem"><span>系统语言</span><span>${row.systemLanguage}</span></p>
//                <p class="userItem"><span>系统架构</span><span>${row.systemStructure}</span></p>
//                <p class="userItem"><span>IP地址</span><span>${row.ipAddress}</span></p>
//                <p class="userItem"><span>MAC地址</span><span>${row.macAddress}</span></p>
//                `
            }
          },
          {
            title: '设备检测结果',
            key: 'roleName',
            render(h, params){

              return h('div',[
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'麦克风设备'),
                  h('span',{
                    style:{
                      wordWrap:'break-word'
                    }
                  },params.row.microphoneEquipment)
                ]),
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'扬声器设备'),
                  h('span',{
                    style:{
                      wordWrap:'break-word'
                    }
                  },params.row.speakerEquipment)
                ]),
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'摄像头设备'),
                  h('span',{
                    style:{
                      wordWrap:'break-word'
                    }
                  },params.row.cameraEquipment)
                ]),
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'手写板设备'),
                  h('span',{
                    style:{
                      wordWrap:'break-word'
                    }
                  },params.row.tabletDevice)
                ]),
                h('p',{
                  attrs:{
                    class:'userItem'
                  }
                },[
                  h('span',{},'最近一次检测时间'),
                  h('span',{
                    style:{
                      wordWrap:'break-word',
                    }
                  },params.row.createDate)
                ]),
              ])
//              return `
//                <p class="userItem"><span>麦克风设备</span><span>${row.microphoneEquipment}</span></p>
//                <p class="userItem"><span>扬声器设备</span><span>${row.speakerEquipment}</span></p>
//                <p class="userItem"><span>摄像头设备</span><span>${row.cameraEquipment}</span></p>
//                <p class="userItem"><span>手写板设备</span><span>${row.tabletDevice}</span></p>
//                <p class="userItem"><span>最近一次检测时间</span><span>${row.createDate}</span></p>
//                `
            }
          },
        ]
      }
    },
    mounted() {
      this.search();
    },
    methods: {
      search(val) {
          if(val) this.pageIndex = val;
        this.loadDataGrid({
          roleName: this.roleName,
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?userParam=${search.roleName}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: SYS_BUSINESS().getUserDeviceInformation + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['userDeviceInformations'] || [];
            _this.total = res.data.total;
          }
        });
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.search();
      },
      changeDate(value) {
        this.createDateStart = value[0] || '';
        this.createDateEnd = value[1] || '';
      }
    },
    components: {OBreadcrumb,PageModel}
  };
</script>

<style lang=less scoped rel="stylesheet/less">
  @import "./userComputer.css";
</style>

