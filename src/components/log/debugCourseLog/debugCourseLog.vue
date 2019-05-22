<template>
  <div class="businessLog">
    <o-breadcrumb second="日志监控" third="调试课信息"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span=24 class="right">
          <i-input v-model="searchData.leadsParam" :size="$store.state.searchModuleSize" @on-keyup.enter="search(1)" placeholder="学生姓名" style="width:100px;margin-right:3px;"></i-input>
          <i-input v-model="searchData.userParam" :size="$store.state.searchModuleSize" @on-keyup.enter="search(1)" placeholder="销售姓名" style="width:100px;margin-right:3px;"></i-input>
          <!--<i-input v-model="searchData.userType" @on-keyup.enter="search" size="small" placeholder="销售类型" style="width:100px;margin-right:3px;"></i-input>-->
          <i-select v-model="searchData.userType" :size="$store.state.searchModuleSize" placeholder="销售类型" filterable clearable style="width:150px">
            <i-option value="cc">cc</i-option>
            <i-option value="cr">cr</i-option>
          </i-select>
          <i-input v-model="searchData.teamName" :size="$store.state.searchModuleSize" @on-keyup.enter="search(1)" placeholder="团队" style="width:100px;margin-right:3px;"></i-input>
          <Date-picker type="daterange" :size="$store.state.searchModuleSize" @on-change="changeDate" placement="bottom-end" placeholder="上课日期" style="width: 200px"></Date-picker>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="search(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" :height="theight" highlight-row stripe border :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
    <Modal
      title="查看日志"
      width=600
      v-model="channelModal"
      :mask-closable="false"
      :closable="false">
      <i-table size="small" highlight-row stripe :columns="columns1" :data="data1"></i-table>
    </Modal>
    <Modal
      title="音频播放"
      width=600
      v-model="audioModal"
      :mask-closable="false"
      :closable="false">
      <div style="text-align: center">
        <audio controls src="" id="Audio"></audio>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {SYS_BUSINESS} from 'common/api/logs.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        data1: [],
        channelModal:false,
        audioModal:false,
        total: 0,
        iconPlay:true,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        searchData:{
          leadsParam:'',//学生姓名
          userParam:'',//销售姓名
          userType:'',//销售类型
          teamName:''//团队姓名
        },
        createDateStart: '',
        createDateEnd: '',
        columns: [
          {
            title: '序号',
            type:"index",
            minWidth:60,
            align:'center'
          },
          {
            title: '课程类型',
            key: 'courseType',
            align:'center',
            minWidth:90,
          },
          {
            title: '学生姓名',
            key: 'leadsName',
            align:'center',
            minWidth:90,
          },
          {
            title: '学生手机号',
            key: 'leadsPhone',
            align:'center',
            minWidth:120,
            render : (h, params) => {
              if(params.row.leadsPhone) {
                return h('div',[
                  h('span',hideCharAtNumber(params.row.leadsPhone)),
                ])
              }else{
                return '-';
              }
            }
          },
          {
            title: '销售姓名',
            key: 'userName',
            align:'center',
            minWidth:90,
          },
          {
            title: '销售类型',
            key: 'userType',
            align:'center',
            minWidth:90,
          },
          {
            title: '团队',
            key: 'teamName',
            align:'center',
            minWidth:90,
          },
          {
            title: '上课日期',
            key: 'courseDate',
            align:'center',
            minWidth:150,
            render(h, params) {
              return h('span',formateDate(params.row.courseDate, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '开始时间',
            key: 'courseStartTime',
            align:'center',
            minWidth:90,
          },
          {
            title: '结束时间',
            key: 'courseEndTime',
            align:'center',
            minWidth:90,
          },
          {
            title: '操作',
            align: 'center',
            minWidth:200,
            fixed:'right',
            render : (h, params) => {
              if(params.row.iconPlay){
                return h('div',[
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                      icon:'ios-play'
                    },
                    style: {
                      margin: '2px',
                    },
                    on: {
                      click: () => {
                        this.courseAudio(params.row.courseVoiceAddress,params.index)
                      }
                    }
                  },'播放音频'),
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                    },
                    style: {
                      margin: '2px',
                    },
                    on: {
                      click: () => {
                        this.debugCourseLog(params.row.classRoomUuid)
                      }
                    }
                  },'查看日志')
                ])
              }else {
                return h('div',[
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small',
                      icon:'ios-pause'
                    },
                    style: {
                      margin: '2px',
                    },
                    on: {
                      click: () => {
                        this.stopAudio(params.row.courseVoiceAddress,params.index)
                      }
                    }
                  },'停止播放'),
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                    },
                    style: {
                      margin: '2px',
                    },
                    on: {
                      click: () => {
                        this.debugCourseLog(params.row.classRoomUuid)
                      }
                    }
                  },'查看日志')
                ])
              }
//                return `
//                      <i-button v-if="${row.iconPlay}" icon="ios-play" size="small" @click="courseAudio('${row.courseVoiceAddress}','${index}')">播放音频</i-button>
//                      <i-button type="error" v-else icon="ios-pause" size="small" @click="stopAudio('${row.courseVoiceAddress}','${index}')">停止播放</i-button>
//                      <i-button type="primary" size="small" @click="debugCourseLog('${row.classRoomUuid}')">查看日志</i-button>`;
            }
          },
        ],
        columns1:[
          {
            title: '序号',
            type:"index",
            minWidth:60,
            align:'center'
          },
          {
            title: '客户端',
            key: 'systemClient',
            align:'center',
            minWidth:90,
          },
          {
            title: '登录用户名',
            key: 'userName',
            align:'center',
            minWidth:90,
          },
          {
            title: '用户类型',
            key: 'userType',
            align:'center',
            minWidth:90,
          },
          {
            title: '进入房间时间',
            key: 'enterTime',
            align:'center',
            minWidth:120,
          },
          {
            title: '退出房间时间',
            key: 'leaveTime',
            align:'center',
            minWidth:120,
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
        const _this = this;
        this.loadDataGrid({
          leadsParam:_this.searchData.leadsParam,
          userParam:_this.searchData.userParam,
          userType:_this.searchData.userType,
          teamName:_this.searchData.teamName,
          courseStartDate: _this.createDateStart,
          courseEndDate: _this.createDateEnd
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?leadsParam=${search.leadsParam}&userParam=${search.userParam}&userType=${search.userType}&teamName=${search.teamName}&courseStartDate=${search.courseStartDate}&courseEndDate=${search.courseEndDate}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        // common.ajax({
        //   url: SYS_BUSINESS().DebugCourse.getDebugCourse + param,
        //   method: 'get',
        //   success: function (res) {
        //     if(res.data['dubugCourseVos']){
        //       res.data['dubugCourseVos'].forEach(function (v, i) {
        //         v.iconPlay = true;
        //       })
        //     }
        //     _this.data = res.data['dubugCourseVos'] || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get(SYS_BUSINESS().DebugCourse.getDebugCourse + param,{
        }).then( ({data}) => {
          if(data.data['dubugCourseVos']){
            data.data['dubugCourseVos'].forEach(function (v, i) {
              v.iconPlay = true;
            })
          }
          _this.data = data.data['dubugCourseVos'] || [];
          _this.total = data.data.total;
        })
      },
      courseAudio(audioUrl,index){
        const _this = this;
        _this.audioModal = true;
        _this.data.forEach(function (v,i) {
          console.log(v.iconPlay);
          if(i == index){
            var myAudio = document.getElementById('Audio');
            if(v.iconPlay == true){
              myAudio.setAttribute("src",'');
              myAudio.setAttribute("src",v.courseVoiceAddress);
              myAudio.play();
              _this.data.forEach(function (v,i) {
                  v.iconPlay = true;
              })
            }
            if(v.iconPlay == false){
              myAudio.setAttribute("src",'');
            }
            v.iconPlay = v.iconPlay == true ? false : true;
          }
        })
      },
      stopAudio(uniqueId,index){
        var myAudio = document.getElementById('Audio');
        myAudio.pause();

        this.data.forEach(function (v,i) {
          if(i == index){
            var myAudio = document.getElementById('Audio');
            v.iconPlay = v.iconPlay == true ? false : true;
          }
        })
      },
      debugCourseLog(uuid){
        const _this = this;
        _this.channelModal = true;
        // common.ajax({
        //   url: SYS_BUSINESS().DebugCourse.getDebugCourseLog + `?classRoomUuid=${uuid}`,
        //   method: 'get',
        //   success: function (res) {
        //     _this.data1 = res.data || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get(SYS_BUSINESS().DebugCourse.getDebugCourseLog + `?classRoomUuid=${uuid}`,{
        }).then( ({data}) => {
          _this.data1 = data.data || [];
          _this.total = data.data.total;
        })
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
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470: '';
      }
    },
    components: {OBreadcrumb,PageModel}
  };
</script>

<style>

</style>
