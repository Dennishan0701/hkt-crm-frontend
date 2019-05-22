<template>
<div>
  <o-breadcrumb second="日志监控" third="试听课课程回放"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="24" class="right">
        <!--<i-select v-model="Search.courseType" :size="$store.state.searchModuleSize" clearable placeholder="课程类型" style="width:100px">-->
          <!--<i-option value="0">测评课</i-option>-->
          <!--<i-option value="1">正式课</i-option>-->
        <!--</i-select>-->
        <i-input v-model="Search.leadsParam" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="
学生姓名/手机号"
                 style="width:150px;margin-right: 2px;"></i-input>
        <i-input v-model="Search.teacherParam" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="
老师姓名/手机号" style="width:200px;margin-right:2px;"></i-input>

      </i-col>
      <i-col span="24" class="right">
        <!--<i-select v-model="Search.isPlay" :size="$store.state.searchModuleSize" clearable placeholder="回放" style="width:100px">-->
          <!--<i-option value=" ">全部</i-option>-->
          <!--<i-option value="1">有回放</i-option>-->
          <!--<i-option value="0">无回放</i-option>-->
        <!--</i-select>-->
        <Date-picker type="daterange" :size="$store.state.searchModuleSize" placement="bottom-end" @on-change="changeUpdateDate" placeholder="上课日期" style="width: 200px"></Date-picker>
        <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索</i-button>
      </i-col>
    </Row>
  </div>
  <i-table size="small" highlight-row stripe :columns="columns" :data="data"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>

  <log @reFresh="reFresh"  ref="log"></log>
</div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API,apiHiCRM} from 'common/api.config.js';
  import {SYS_BUSINESS} from 'common/api/logs.js';
  import {formateDate, common, hideCharAtNumber,getFullPhone} from 'common/js/common.js';
  import log from 'components/log/coursePlaybackLog/log';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';
  const $sStorage = $.sessionStorage;

  export default{
    data() {
      return {
        infoUrl:this.$store.state.info,
        getTrackDataInfo:this.$store.state.getTrackDataInfo,
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md'?11:17,
        Search: {
          leadsParam: '',
          teacherParam: '',
          courseStartDate: '',
          courseEndDate: '',
          courseType: '',
          // isPlay:'',
        },
        columns: [
          {
            title: '序号',
            type:'index',
            width: 40,
            align:'center',
          },
          {
            title: '课程类型',
            key: 'courseType',
            width: 90,
            align:'center',
          },
          {
            title: '学生姓名',
            key: 'leadsName',
            width: 90,
            align:'center',
          },
          {
            title: '学生手机号',
            key: 'leadsPhone',
            width: 120,
            align:'center',
            render : (h, params) => {
              return h('div',[
                h('span',hideCharAtNumber(params.row.leadsPhone)),
                h('i',{
                  style:{
                    margin:'2px',
                    fontSize:'18px',
                    verticalAlign:'top',
                    cursor:'pointer'
                  },
                  attrs:{
                    class:'ivu-icon ivu-icon-ios-eye',
                    title:'显示全部'
                  },
                  on:{
                    click:()=>{
                      this.getFullPhone(params.row.leadsPhone)
                    }
                  }
                })
              ])
//              return hideCharAtNumber(row.leadsPhone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.leadsPhone}')" class="eye" title="显示全部"></Icon>`;
            }
          },
          {
            title: '老师姓名',
            key: 'tcName',
            width: 90,
            align:'center',
          },
//           {
//             title: '老师手机号',
//             key: 'tcPhone',
//             width: 120,
//             align:'center',
//             render(h, params){
//               if(params.row.tcPhone){
//                 return h('div',[
//                   h('span',hideCharAtNumber(params.row.tcPhone)),
//                   h('i',{
//                     attrs:{
//                       class:'ivu-icon ivu-icon-ios-eye',
//                       title:'显示全部'
//                     },
//                     style:{
//                       margin:'2px',
//                       fontSize:'18px',
//                       verticalAlign:'top',
//                       cursor:'pointer'
//                     },
//                     on:{
//                       click:()=>{
//                         this.getFullPhone(params.row.tcPhone)
//                       }
//                     }
//                   })
//                 ])
//               }else{
//                 return '-';
//               }
// //              return hideCharAtNumber(row.tcPhone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.phone}')" class="eye" title="显示全部"></Icon>`;
//             }
//           },
          {
            title: '老师手机号',
            key: 'tcPhone',
            minWidth: 120,
            align: 'center',
            render : (h, params) => {
              return h('div',[
                h('span',hideCharAtNumber(params.row.tcPhone)),
                h('i',{
                  attrs:{
                    title:"显示全部",
                    class:'ivu-icon ivu-icon-ios-eye',
                  },
                  style:{
                    margin:'2px',
                    fontSize:'18px',
                    verticalAlign:'top',
                    cursor:'pointer'
                  },
                  on:{
                    click:()=>{
                      this.getFullPhone(params.row.tcPhone)
                    }
                  }
                })
              ])
              // return hideCharAtNumber(row.tcPhone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.tcPhone}')" class="eye" title="显示全部"></Icon>`;
            }
          },
          {
            title: '销售姓名',
            key: 'userName',
            width: 90,
            align:'center',
          },
          {
            title: '销售类型',
            key: 'userType',
            width: 90,
            align:'center',
          },
          {
            title: '团队',
            key: 'teamName',
            width: 90,
            align:'center',
          },
          {
            title: '上课日期',
            key: 'courseDate',
            align:'center',
            width: 180,
          },
          {
            title: '开始结束时间',
            key: 'courseDate',
            align:'center',
            width: 180,
            render(h, params) {
              return h('span',params.row.courseStartTime + '-' + params.row.courseEndTime)
            },
          },
          {
            title: ' ',
            key: '',
            width: 30,
          },
          {
            title: '操作',
            width: 100,
            align: 'center',
            fixed:'right',
            render : (h, params) => {
              if(params.row.url){
                return h('div',[
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small',
                      icon: 'videocamera',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs:{
                      title:'课程回放'
                    },
                    on: {
                      click: () => {
                        this.videoLog(params.row.url)
                      }
                    }
                  }),
                  // h('Button', {
                  //   props: {
                  //     type: 'success',
                  //     size: 'small',
                  //     icon: 'eye',
                  //   },
                  //   style: {
                  //     margin: '2px',
                  //   },
                  //   attrs:{
                  //     title:'查看进出日志'
                  //   },
                  //   on: {
                  //     click: () => {
                  //       this.log(params.row.classRoomUuid)
                  //     }
                  //   }
                  // })
                ])
//                return `<i-button type="success" size="small" icon="videocamera" title="课程回放" @click="videoLog('${row.courseUuid}')"></i-button>
//               <i-button type="success" size="small" icon="eye" title="查看进出日志" @click="log('${row.classRoomUuid}')"></i-button>`;
              }else{

                return h('div',[
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small',
                      icon: 'videocamera',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs:{
                      title:'课程回放'
                    },
                    on: {
                      click: () => {
                        this.alert()
                      }
                    }
                  }),
                  // h('Button', {
                  //   props: {
                  //     type: 'success',
                  //     size: 'small',
                  //     icon: 'eye',
                  //   },
                  //   style: {
                  //     margin: '2px',
                  //   },
                  //   attrs:{
                  //     title:'查看进出日志'
                  //   },
                  //   on: {
                  //     click: () => {
                  //       this.log(params.row.classRoomUuid)
                  //     }
                  //   }
                  // })
                ])
//                return `<i-button size="small" icon="videocamera" title="课程回放" @click="alert"></i-button>
//              <i-button type="success" size="small" icon="eye" title="查看进出日志" @click="log('${row.classRoomUuid}')"></i-button>`;
              }
            }
          }
        ],
      }
    },
    mounted() {
      this.searchForm();
    },
    methods: {
      log(uuid) {
        this.$refs.log.show(uuid);
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          leadsParam: this.Search.leadsParam,
          teacherParam: this.Search.teacherParam,
          courseStartDate: this.Search.courseStartDate,
          courseType: this.Search.courseType,
          courseEndDate: this.Search.courseEndDate,
          // isPlay: this.Search.isPlay,
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        // let param = `?courseType=${search.courseType}&leadsParam=${search.leadsParam}&teacherParam=${search.teacherParam}&courseStartDate=${search.courseStartDate}&courseEndDate=${search.courseEndDate}&isPlay=${search.isPlay}`
        // param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        // const _this = this;
        // common.ajax({
        //   url: SYS_BUSINESS().coursePlaybackLog.dataGrid+ param,
        //   method: 'get',
        //   success: function (res) {
        //     // console.log(res)
        //     _this.data = res.data['coursePlayBacks']|| [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get(SYS_BUSINESS().coursePlaybackLog.queryTestCoursePlayBackPage,{
          baseURL: apiHiCRM(),
          params:{
            courseType : search.courseType,
            leadsParam : search.leadsParam,
            teacherParam : search.teacherParam,
            courseStartDate : search.courseStartDate,
            courseEndDate : search.courseEndDate,
            // isPlay : search.isPlay,
            pageIndex : this.pageIndex,
            pageNumber : this.pageNumber,
            orderBy : orderBy,
            sortBy : sortBy,
          },
          // loading: true,
        }).then( ({data}) => {
          this.data = data.data['coursePlayBacks']|| [];
          this.total = data.data.total;
        })
      },
      videoLog(url){
        let token = localStorage.getItem("token");
        this.$Modal.info({
          title:'回放地址',
          content:`若浏览器不能自动打开新页面播放视频，<a href=${url} target=_blank>请点击这里</a>观看回放`
        });
        window.open(url);
      },
      getFullPhone(phone) {
        getFullPhone(phone, COMMON_API().getPhoneHZ);
      },
      changeUpdateDate(value) {
        this.Search.courseStartDate = value[0] || '';
        this.Search.courseEndDate = value[1] || '';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      alert(){
        this.$Modal.info({
          title:' ',
          content: '此课程没有回放'
        });
      },
      reFresh(){
        this.searchForm();
      }
    },
    components: {OBreadcrumb, log,PageModel}
  };
</script>

<style>
  .ivu-select-dropdown-list {
    text-align: left;
  }
</style>
