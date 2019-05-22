<template>
  <div class="businessLog">
    <o-breadcrumb second="数据报表" third="外呼明细"  four="融营外呼明细"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span=24 class="right">
          <i-input v-model="searchData.leadsParam" :size="$store.state.searchModuleSize" @on-keyup.enter="search(1)" clearable placeholder="学生姓名/手机号" style="width:150px;margin-right:3px;"></i-input>
          <i-input v-model="searchData.userName" :size="$store.state.searchModuleSize" @on-keyup.enter="search(1)" clearable placeholder="销售姓名" style="width:150px;margin-right:3px;"></i-input>
          <i-select v-model="searchData.teamName" :size="$store.state.searchModuleSize" placeholder="团队" filterable clearable style="width:150px;margin-right:3px;">
            <i-option v-for="(item,index) in teamList" :key='index' :value="item.teamUuid">{{ item.teamName }}</i-option>
          </i-select>
          <i-select v-model="searchData.channelName" :size="$store.state.searchModuleSize" placeholder="渠道" filterable clearable style="width:150px;margin-right:3px;">
            <i-option v-for="(item,index) in channelList" :key='index' :value="item.uuid">{{ item.name }}</i-option>
          </i-select>
          <i-select v-model="searchData.isArchive" :size="$store.state.searchModuleSize" placeholder="是否接通过" filterable clearable style="width:150px;margin-right:3px;">
            <i-option value="0">未接通</i-option>
            <i-option value="1">已接通</i-option>
          </i-select>
          <!--<i-button type="primary" :size="$store.state.searchModuleSize" icon="" @click="dawnloadAll">下载全部音频</i-button>-->
        </i-col>
        <i-col span=24 class="right">
          <Date-picker v-model="dateChanges" type="daterange" :size="$store.state.searchModuleSize" @on-change="changeDate" placement="bottom-end" placeholder="外呼时间" style="width: 200px"></Date-picker>
          <Date-picker type="daterange" :size="$store.state.searchModuleSize" @on-change="changeRecordDate" placement="bottom-end" placeholder="名单录入时间" style="width: 200px"></Date-picker>
          <Date-picker type="daterange" :size="$store.state.searchModuleSize" @on-change="changeDistributeDate" placement="bottom-end" placeholder="名单分配时间" style="width: 200px"></Date-picker>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="search(1)">搜索</i-button>
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
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import {COMMON_API} from 'common/api.config.js';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        channelList:[],
        dateChanges:[],
        data: [],
        teamList: [],
        audioModal:false,
        total: 0,
        iconPlay:true,
        pageIndex: 1,
        pageNumber: 100,
        searchData:{
          leadsParam:'',//学生姓名
          userName:'',//销售姓名
          teamName:'',//团队姓名
          isArchive:'',
          channelName:'',
        },
        startDate: '',
        endDate: '',
        distributionStartDate: '',
        distributionEndDate: '',
        createStartDate: '',
        createEndDate: '',
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
            title: '分配销售',
            key: 'userName',
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
            // key: 'startTime',
            align:'center',
            minWidth:150,
            render(h, params) {
              return h('span',formateDate(params.row.startStamp, 'yyyy-MM-dd hh:mm:ss')+'至'+formateDate(params.row.endStamp, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '是否接通过',
            key: 'connectInfo',
            align:'center',
            minWidth:90,
          },
          {
            title: '名单录入时间',
            key: 'registerTime',
            align:'center',
            minWidth:150,
            render(h, params) {
              return h('span',formateDate(params.row.registerTime, 'yyyy-MM-dd hh:mm:ss'), 'yyyy-MM-dd hh:mm:ss');
            }
          },
          {
            title: '名单分配时间',
            key: 'distributeDate',
            align:'center',
            minWidth:150,
            render(h, params) {
              return h('span',formateDate(params.row.distributeDate, 'yyyy-MM-dd hh:mm:ss'), 'yyyy-MM-dd hh:mm:ss');
            }
          },
          {
            title: '累计通话时长',
            key: 'billsecDisplay',
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
            title: '操作',
            align: 'center',
            minWidth:200,
            render: (h, params) =>{
              console.log (params.row.iconPlay);
              if(params.row.connectInfo ==='已接通' && params.row.recordUrl){
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
                          this.courseAudio(params.row.recordUrl,params.index)
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
                          GLOBAL.newTab(params.row.recordUrl,true);
                        }
                      }
                    },'下载音频')
                  ])
                }else{
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
                          GLOBAL.newTab(params.row.recordUrl,true);
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
      // 获取团队
      this.$axios.get( OUTBOUNDDETAIL().outBoundDetail.getAllTeam,{})
      .then( ({data}) => {
        // console.log (data);
        this.teamList = data.data || [];
      })
      // 获取所有渠道
      this.$axios.get( COMMON_API().allChannel,{})
      .then( (res) => {
        console.log (res);
        this.channelList = res.data.data || [];
      })
    },
    methods: {
      search(val) {
        if(val) this.pageIndex = val;
        const _this = this;
        this.loadDataGrid({
          leadsParam:_this.searchData.leadsParam,
          startDate: _this.startDate,
          endDate: _this.endDate,
          distributionStartDate: _this.distributionStartDate,
          distributionEndDate: _this.distributionEndDate,
          createStartDate: _this.createStartDate,
          createEndDate: _this.createEndDate,
          channelUuid: _this.searchData.channelName,
          userName:_this.searchData.userName,
          teamUuid:_this.searchData.teamName,
          connect:_this.searchData.isArchive,
        });
      },
      loadDataGrid(search) {
        this.$axios.get( OUTBOUNDDETAIL().outBoundDetail.getPaasRecord,{
          params:{...search,
            pageIndex : this.pageIndex,
            pageNumber : this.pageNumber,
          },
        }).then( ({data}) => {
          let _this = this
          if(data.data['result']){
            data.data['result'].forEach(function (v, i) {
              v.iconPlay = true;
              _this.$set(v, 'iconPlay', v['iconPlay'])
            })
          }
          this.data = data.data['result'] || [];
          this.total = data.data.count;
          // this.data.forEach(function (v,i) {
          //   v.iconPlay = true;
          //   this.$set(this.data, i, this.data[i])
          // })
        })
      },
      courseAudio(recordUrl,index){
        const _this = this;
        this.audioModal = true;
        _this.data.forEach(function (v,i) {
          // console.log (v);
          if(i == index){
            var myAudio = document.getElementById('Audio');
            if(v.iconPlay == true){
              myAudio.setAttribute("src",'');
              myAudio.setAttribute("src",recordUrl);
              myAudio.play();
              if(_this.data){
                _this.data.forEach(function (v,i) {
                  v.iconPlay = true;
                  _this.$set(v, 'iconPlay', v['iconPlay'])
                })
              }
            }
            if(v.iconPlay == false){
              myAudio.setAttribute("src",'');
            }
            v.iconPlay = v.iconPlay == true ? false : true;
            _this.$set(v, 'iconPlay', v['iconPlay'])
            console.log (v.iconPlay);
          }
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
        let _this = this
        var myAudio = document.getElementById('Audio');
        myAudio.pause();
        this.data.forEach(function (v,i) {
          if(i == index){
            var myAudio = document.getElementById('Audio');
            v.iconPlay = v.iconPlay == true ? false : true;
            _this.$set(v, 'iconPlay', v['iconPlay'])
          }
        })
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.search();
      },
      changeDate(value) {
        this.startDate = value[0] || '';
        this.endDate = value[1] || '';
      },
      changeDistributeDate(value) {
        this.distributionStartDate = value[0] || '';
        this.distributionEndDate = value[1] || '';
      },
      changeRecordDate(value) {
        this.createStartDate = value[0] || '';
        this.createEndDate = value[1] || '';
      },
      dateChange(){
        var curDate = new Date();
        var lastDate = new Date(curDate.getTime() - 24*60*60*1000);
        var finalDate = lastDate.getFullYear() + '-' + (lastDate.getMonth() + 1 < 10 ? "0" +(lastDate.getMonth()+1):lastDate.getMonth()+ 1) + '-' + (lastDate.getDate() < 10 ? "0" +(lastDate.getDate()):lastDate.getDate());
        this.dateChanges[0] = finalDate;
        this.dateChanges[1] = finalDate;
        this.startDate = finalDate;
        this.endDate = finalDate;
      }
    },
    components: {OBreadcrumb,PageModel}
  };
</script>

<style>

</style>
