<template>
  <div class="businessLog">
    <o-breadcrumb second="日志监控" third="天润外呼记录"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span=24 class="right">
          <i-input v-model="searchData.leadsParam" :size="$store.state.searchModuleSize" @on-keyup.enter="search(1)" placeholder="学生姓名/手机号码" style="width:135px;margin-right:3px;"></i-input>
          <i-input v-model="searchData.userParam" :size="$store.state.searchModuleSize" @on-keyup.enter="search(1)" placeholder="销售姓名" style="width:100px;margin-right:3px;"></i-input>
          <i-select v-model="searchData.userType" :size="$store.state.searchModuleSize" placeholder="销售类型" filterable clearable style="width:150px">
            <i-option value="cc">cc</i-option>
            <i-option value="cr">cr</i-option>
          </i-select>
          <i-select v-model="searchData.status" :size="$store.state.searchModuleSize" placeholder="接听状态" clearable style="width:150px">
            <i-option value="双方接听">双方接听</i-option>
            <i-option value="客户未接听">客户未接听</i-option>
            <i-option value="座席未接听">座席未接听</i-option>
          </i-select>
          <!--<i-input v-model="searchData.userType" @on-keyup.enter="search" size="small" placeholder="销售类型" style="width:100px;margin-right:3px;"></i-input>-->
          <i-input v-model="searchData.teamName" :size="$store.state.searchModuleSize" @on-keyup.enter="search(1)" placeholder="团队" style="width:100px;margin-right:3px;"></i-input>
          <Date-picker type="daterange" :size="$store.state.searchModuleSize" @on-change="changeDate" placement="bottom-end" placeholder="拨打日期" style="width: 200px"></Date-picker>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="search(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" highlight-row stripe border :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
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
  import {SYS_BUSINESS} from 'common/api/logs.js';
  import {formateDate,common,hideCharAtNumber,getFullPhone} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        data1: [],
        audioModal:false,
        total: 0,
        iconPlay:true,
        pageIndex: 1,
        pageNumber: 10,
        searchData:{
          leadsParam:'',//学生姓名
          userParam:'',//销售姓名
          userType:'',//销售类型
          teamName:'',//团队姓名
          status:''//接听状态
        },
        createDateStart: '',
        createDateEnd: '',
        columns: [
          {
            title: '序号',
            type:"index",
            minWidth:60,
            align:'center',
          },
          {
            title: '接听状态',
            key: 'status',
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
            minWidth:90,
            render: (h, params) => {
              return h ('div', [
                h ('span', hideCharAtNumber (params.row.leadsPhone)),
              ])
            }
          },
          {
            title: '分配时间',
            key: 'assignTime',
            align:'center',
            minWidth:150,
            render (h, params) {
              return h('span',formateDate(params.row.assignTime, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '销售姓名',
            key: 'saleName',
            align:'center',
            minWidth:90,
          },
          {
            title: '销售类型',
            key: 'saleType',
            align:'center',
            minWidth:90,
          },
          {
            title: '团队',
            key: 'team',
            align:'center',
            minWidth:90,
          },
          {
            title: '客户接听时间',
            key: 'startTime',
            align:'center',
            minWidth:150,
          },
          {
            title: '通话时长',
            key: 'bridgeDuration',
            align:'center',
            minWidth:90,
          },
          {
            title: '操作',
            align: 'center',
            minWidth:120,
            render: (h, params)=> {
              if(params.row.recordFile){
                let params0;
                if(params.row.iconPlay){
                  params0 = h('Button', {
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
                        this.courseAudio(params.row.uniqueId,params.row.recordFile,params.index)
                      }
                    }
                  },'播放音频');
                }else {
                  params0 = h('Button', {
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
                        this.stopAudio(params.row.uniqueId,params.index)
                      }
                    }
                  },'停止播放');
                }

                return h('div',[
                  params0,
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
                        this.downloadVoiceFile(params.row.uniqueId,params.row.recordFile)
                      }
                    }
                  },'下载音频')
                ])
//                return `
//                      <i-button v-if="${row.iconPlay}" icon="ios-play" size="small" @click="courseAudio('${row.uniqueId}','${row.recordFile}','${index}')">播放音频</i-button>
//                      <i-button type="error" v-else icon="ios-pause" size="small" @click="stopAudio('${row.uniqueId}','${index}')">停止播放</i-button>
//                      <i-button type="primary" size="small" @click="downloadVoiceFile('${row.uniqueId}','${row.recordFile}')">下载音频</i-button>`;
              }else {
                return h('span','无')
              }
            }
          },
        ],
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
          status:_this.searchData.status,
          courseStartDate: _this.createDateStart,
          courseEndDate: _this.createDateEnd
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?status=${search.status}&leadsParams=${search.leadsParam}&saleName=${search.userParam}&saleType=${search.userType}&team=${search.teamName}&startTime=${search.courseStartDate}&endTime=${search.courseEndDate}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        // common.ajax({
        //   url: SYS_BUSINESS().DebugCourse.queryOutBoundPage + param,
        //   method: 'get',
        //   success: function (res) {
        //       if(res.data['outboundList']){
        //         res.data['outboundList'].forEach(function (v, i) {
        //           v.iconPlay = true;
        //         })
        //       }
        //
        //     _this.data = res.data['outboundList'] || [];
        //
        //     _this.total = res.data.total;
        //   }
        // });

        this.$axios.get(SYS_BUSINESS().DebugCourse.queryOutBoundPage,{
          params:{
            status : search.status,
            leadsParams : search.leadsParam,
            saleName : search.userParam,
            saleType : search.userType,
            team : search.teamName,
            startTime : search.courseStartDate,
            endTime : search.courseEndDate,
            pageIndex : this.pageIndex,
            pageNumber : this.pageNumber,
            orderBy : orderBy,
            sortBy : sortBy,
          },
        }).then( ({data}) => {
          if(data.data['outboundList']){
            data.data['outboundList'].forEach(function (v, i) {
              v.iconPlay = true;
            })
          }
          this.data = data.data['outboundList'] || [];
          this.total = data.data.total;
        })
      },
      courseAudio(uniqueId,recordFile,index){
        const _this = this;
        _this.audioModal = true;
        let voiceUrl;
        // let apiUrl = SYS_BUSINESS().downloadVoiceFile;
        // apiUrl += `?uniqueId=${uniqueId}&recordFile=${recordFile}`;
        // common.ajax({
        //   url: apiUrl,
        //   success(res) {
        //     voiceUrl = res.data.voiceUrl
        //     _this.data.forEach(function (v,i) {
        //       if(i == index){
        //         var myAudio = document.getElementById('Audio');
        //         if(v.iconPlay == true){
        //           myAudio.setAttribute("src",'');
        //           console.log(voiceUrl);
        //           myAudio.setAttribute("src",voiceUrl);
        //           myAudio.play();
        //           _this.data.forEach(function (v,i) {
        //             v.iconPlay = true;
        //           })
        //         }
        //         if(v.iconPlay == false){
        //           myAudio.setAttribute("src",'');
        //         }
        //         v.iconPlay = v.iconPlay == true ? false : true;
        //       }
        //     })
        //
        //   }
        // })

        this.$axios.get(SYS_BUSINESS().downloadVoiceFile,{
          params:{
            uniqueId : uniqueId,
            recordFile : recordFile
          },
        }).then( ({data}) => {
          voiceUrl = data.data.voiceUrl
          _this.data.forEach(function (v,i) {
            if(i == index){
              var myAudio = document.getElementById('Audio');
              if(v.iconPlay == true){
                myAudio.setAttribute("src",'');
                console.log(voiceUrl);
                myAudio.setAttribute("src",voiceUrl);
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
      downloadVoiceFile(uniqueId,recordFile){

        let apiUrl = SYS_BUSINESS().downloadVoiceFile;
        apiUrl += `?uniqueId=${uniqueId}&recordFile=${recordFile}`;
        // common.ajax({
        //   url: apiUrl,
        //   success(res) {
        //     GLOBAL.newTab(res.data.voiceUrl,true);
        //   }
        // })

        this.$axios.get( SYS_BUSINESS().downloadVoiceFile,{
          params:{
            uniqueId : uniqueId,
            recordFile : recordFile
          },
        }).then( ({data}) => {
          GLOBAL.newTab(data.data.voiceUrl,true);
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
    components: {OBreadcrumb,PageModel}
  };
</script>

<style>

</style>
