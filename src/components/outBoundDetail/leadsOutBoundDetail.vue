<template>
  <div class="businessLog">
    <o-breadcrumb second="数据报表" third="外呼明细"  four="leads外呼明细(T+1)"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span=24 class="right">
          <i-input v-model="searchData.leadsParam" :size="$store.state.searchModuleSize" @on-keyup.enter="search(1)" clearable placeholder="学生姓名/手机号" style="width:150px;margin-right:3px;"></i-input>
          <i-input v-model="searchData.saleName" :size="$store.state.searchModuleSize" @on-keyup.enter="search(1)" clearable placeholder="销售姓名/手机号" style="width:150px;margin-right:3px;"></i-input>
          <i-select v-model="searchData.teamName" :size="$store.state.searchModuleSize" placeholder="团队" filterable clearable style="width:150px;margin-right:3px;">
            <i-option v-for="(item,index) in teamList" :key='index' :value="item">{{ item }}</i-option>
          </i-select>
          <!--<i-input v-model="searchData.teamName" :size="$store.state.searchModuleSize" @on-keyup.enter="search(1)" placeholder="团队" style="width:100px;margin-right:3px;"></i-input>-->
          <i-select v-model="searchData.isArchive" :size="$store.state.searchModuleSize" placeholder="是否接通过" filterable clearable style="width:150px;margin-right:3px;">
            <i-option value="0">未接通</i-option>
            <i-option value="1">已接通</i-option>
          </i-select>
          <!--<Date-picker type="daterange" :size="$store.state.size" @on-change="distributionDate" placement="bottom-end" placeholder="分配时间" style="width: 200px"></Date-picker>-->
          <Date-picker v-model="dateChanges" type="daterange" :size="$store.state.searchModuleSize" @on-change="changeDate" placement="bottom-end" placeholder="外呼时间" style="width: 200px"></Date-picker>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="search(1)">搜索</i-button>
          <!--<i-button type="primary" :size="$store.state.searchModuleSize" icon="" @click="dawnloadAll">下载全部音频</i-button>-->
        </i-col>
      </Row>
    </div>
    <i-table size="small" highlight-row stripe border :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    </div>
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
  import {OUTBOUNDDETAIL} from 'common/api/outBoundDetail.js';
  import {formateDate,common} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        dateChanges:[],
        data: [],
        teamList: [],
        audioModal:false,
        total: 0,
        iconPlay:true,
        pageIndex: 1,
        pageNumber: 10,
        searchData:{
          leadsParam:'',//学生姓名
          saleName:'',//销售姓名
          teamName:'',//团队姓名
          isArchive:'',
        },
        startCallTime: '',
        endCallTime: '',
        distributionStartTime: '',
        distributionEndTime: '',
        columns: [
          {
            title: '序号',
            type:"index",
            minWidth:60,
            align:'center',
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
          },
          {
            title: '分配销售',
            key: 'saleName',
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
            title: '拨打时间',
            key: 'startTime',
            align:'center',
            minWidth:150,
            // render(h, params) {
            //   return h('span',formateDate(params.row.distributionDate, 'yyyy-MM-dd hh:mm:ss'));
            // }
          },
          {
            title: '累计外呼次数',
            key: 'callNums',
            align:'center',
            minWidth:90,
          },
          {
            title: '是否接通过',
            key: 'isArchive',
            align:'center',
            minWidth:90,
          },
          {
            title: '累计通话时长',
            key: 'talkSecondsTotal',
            align:'center',
            minWidth:90,
          },
          {
            title: '渠道名称',
            key: 'channelName',
            align:'center',
            minWidth:90,
          },
          {
            title: '渠道等级',
            key: 'channelLevel',
            align:'center',
            minWidth:90,
          },
          {
            title: '操作',
            align: 'center',
            minWidth:200,
            render: (h, params) =>{
              if(params.row.uniqueid){
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
                          this.courseAudio(params.row.uniqueid,params.row.userLogin,params.row.userPass,params.index)
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
                          this.downloadVoiceFile(params.row.uniqueid,params.row.userLogin,params.row.userPass)
                        }
                      }
                    },'下载音频')
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
                          this.stopAudio(params.row.uniqueid,params.index)
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
                          this.downloadVoiceFile(params.row.uniqueid,params.row.userLogin,params.row.userPass)
                        }
                      }
                    },'下载音频')
                  ])
                }
              }else {
                return h('span','无')
              }
            }
          },
        ],
      }
    },
    mounted() {
      this.dateChange();
      this.search();
      this.$axios.get( OUTBOUNDDETAIL().outBoundDetail.getTeams,{})
      .then( ({data}) => {
        this.teamList = data.data['teams'] || [];
      })
    },
    methods: {
      search(val) {
        if(val) this.pageIndex = val;
        const _this = this;
        this.loadDataGrid({
          leadsParam:_this.searchData.leadsParam,
          saleName:_this.searchData.saleName,
          teamName:_this.searchData.teamName,
          startCallTime: _this.startCallTime,
          endCallTime: _this.endCallTime,
          isArchive: _this.searchData.isArchive,
          distributionStartTime: _this.distributionStartTime,
          distributionEndTime: _this.distributionEndTime,
        });
      },
      loadDataGrid(search) {
        this.$axios.get( OUTBOUNDDETAIL().outBoundDetail.getAnLanLeadsObCallRecord,{
          params:{...search,
            pageIndex : this.pageIndex,
            pageNumber : this.pageNumber,},
        }).then( ({data}) => {
          if(data.data['anLanObCallRecordDtos']){
            data.data['anLanObCallRecordDtos'].forEach(function (v, i) {
              v.iconPlay = true;
            })
          }
          this.data = data.data['anLanObCallRecordDtos'] || [];
          this.total = data.data.total;
        })
      },
      courseAudio(uniqueid ,userLogin ,userPass,index){
        const _this = this;
        this.audioModal = true;
        let voiceUrl;
        this.$axios.get(OUTBOUNDDETAIL().outBoundDetail.getAnLanCallRecordingInfo,{
          params:{
            uniqueid : uniqueid,
            userLogin : userLogin,
            userPass : userPass,
          },
        }).then( ({data}) => {
          voiceUrl = data.data;
          // voiceUrl = 'http://api.clink.cn/20180712/3004776-20180712171053-13968700787-02145957216-record-10.10.56.80-1531386653.149625.mp3?enterpriseId=3004776&userName=admin&seed=onlyhi&pwd=6a34572cbe3fe550431e837b732f83e4';
          _this.data.forEach(function (v,i) {
            if(i == index){
              var myAudio = document.getElementById('Audio');
              if(v.iconPlay == true){
                myAudio.setAttribute("src",'');
                console.log(voiceUrl);
                myAudio.setAttribute("src",voiceUrl);
                myAudio.play();
                if(_this.data){
                  _this.data.forEach(function (v,i) {
                    v.iconPlay = true;
                  })
                }
              }
              if(v.iconPlay == false){
                myAudio.setAttribute("src",'');
              }
              v.iconPlay = v.iconPlay == true ? false : true;
            }
          })
        })
      },
      downloadVoiceFile(uniqueid ,userLogin ,userPass){
        this.$axios.get(OUTBOUNDDETAIL().outBoundDetail.getAnLanCallRecordingInfo,{
          params:{
            uniqueid : uniqueid,
            userLogin : userLogin,
            userPass : userPass,
          },
        }).then( ({data}) => {
          GLOBAL.newTab(data.data,true);
        })
      },
      stopAudio(uniqueid,index){
        var myAudio = document.getElementById('Audio');
        myAudio.pause();
        this.data.forEach(function (v,i) {
          if(i == index){
            var myAudio = document.getElementById('Audio');
            v.iconPlay = v.iconPlay == true ? false : true;
          }
        })
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.search();
      },
      distributionDate(value) {
        this.distributionStartTime = value[0] || '';
        this.distributionEndTime = value[1] || '';
      },
      changeDate(value) {
        this.startCallTime = value[0] || '';
        this.endCallTime = value[1] || '';
      },
      dateChange(){
        var curDate = new Date();
        var lastDate = new Date(curDate.getTime() - 24*60*60*1000);
        var finalDate = lastDate.getFullYear() + '-' + (lastDate.getMonth() + 1 < 10 ? "0" +(lastDate.getMonth()+1):lastDate.getMonth()+ 1) + '-' + (lastDate.getDate() < 10 ? "0" +(lastDate.getDate()):lastDate.getDate());
        this.dateChanges[0] = finalDate;
        this.dateChanges[1] = finalDate;
        this.startCallTime = finalDate;
        this.endCallTime = finalDate;
      }
    },
    components: {OBreadcrumb,PageModel}
  };
</script>

<style>

</style>
