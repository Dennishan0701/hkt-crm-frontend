<template>
  <div class="trCcOutBoundLog">
    <o-breadcrumb second="日志监控" third="cc外呼名单跟进"></o-breadcrumb>
    <div class="grid-widget">
      <i-form ref="formValidate" :model="searchData" :rules="ruleValidate" :label-width="80">
        <Row>
          <i-col span="24" class="right">
            <i-input v-model="searchData.leadsParam" :size="$store.state.searchModuleSize" @on-keyup.enter="search(1)" placeholder="学生姓名/手机号码" style="width:110px;margin-right:3px;"></i-input>
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
            <!--<Row type="flex" justify="end" align="top" style="margin-bottom: -22px;">-->
          </i-col>
        </Row>
        <Row>
          <i-col span="24" class="right">
            <Form-item prop="callValue" style="display: inline-block;margin-bottom:6px;">
              <Date-picker type="daterange" :size="$store.state.searchModuleSize" v-model="searchData.callValue" @on-change="changeDate" placement="bottom-end" placeholder="通话日期" style="width: 200px"></Date-picker>
            </Form-item>
            <Date-picker type="daterange" :size="$store.state.searchModuleSize" @on-change="changeDistributionDate" placement="bottom-end" placeholder="分配日期" style="width: 200px"></Date-picker>
            <Date-picker type="daterange" :size="$store.state.searchModuleSize" @on-change="changeRegistDate" placement="bottom-end" placeholder="报名日期" style="width: 200px"></Date-picker>
            <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="search(1,'formValidate')">搜索</i-button>
            <a :href="param" target="_blank"><i-button disabled :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="exportExcel">导出</i-button></a>
          </i-col>
        </Row>
      </i-form>
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
  import {formateDate,common} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      const validatePass = (rule, value, callback) => {
        // console.log(value);
        if (!value[0] || !value[1]) {
          callback(new Error('请选择要查询的日期'));
        } else {
          callback();
        }
      };
      return {
        param:'javascript:;',
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
          status:'',//接听状态
          callValue:[],
        },
        ruleValidate: {
          callValue: [
            { validator: validatePass, trigger: 'change' }
          ]
        },
        createDateStart: '',
        createDateEnd: '',
        distributionDateStart: '',
        distributionDateEnd: '',
        registTimeStart: '',
        registTimeEnd: '',
        columns: [
          {
            title: '序号',
            type:"index",
            width:60,
            align:'center',
          },
          {
            title: '呼叫情况',
            key: 'callState',
            align:'center',
            width:90,
          },
          {
            title: '学生姓名',
            key: 'leadsName',
            align:'center',
            width:90,
          },
          {
            title: '学生手机号',
            key: 'leadsPhone',
            align:'center',
            width:90,
          },
          {
            title: '渠道',
            key: 'channel',
            align:'center',
            width:150,
          },
          {
            title: '销售姓名',
            key: 'saleName',
            align:'center',
            width:90,
          },
          {
            title: '团队',
            key: 'team',
            align:'center',
            width:90,
          },
          {
            title: '接听状态',
            key: 'status',
            align:'center',
            width:90,
          },
          {
            title: '客户接听时间',
            key: 'startTime',
            align:'center',
            width:150,
          },
          {
            title: '结束时间',
            key: 'endTime',
            align:'center',
            width:150,
          },
          {
            title: '通话时长',
            key: 'bridgeDuration',
            align:'center',
            width:90,
          },
          {
            title: '呼叫结果',
            key: 'callResult',
            align:'center',
            width:90,
          },
          {
            title: '负责时间',
            key: 'TakeTime',
            align:'center',
            width:90,
          },
          {
            title: '是否排课',
            key: 'planCourse',
            align:'center',
            width:90,
          },
          {
            title: '是否付费',
            key: 'payMoney',
            align:'center',
            width:90,
          },
          {
            title: '付费金额',
            key: 'payNum',
            align:'center',
            width:90,
          },
          {
            title: '支付方式',
            key: 'payWay',
            align:'center',
            width:90,
          },
          {
            title: '操作',
            align: 'center',
          width:120,
            render (h, params) {
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
                        this.debugCourseLog(params.row.uniqueId)
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
      this.searchData.callValue = [this.GetDateStr(-7),new Date().toLocaleDateString().replace(/\//g, "-")];
      this.createDateStart = this.searchData.callValue[0];
      this.createDateEnd = this.searchData.callValue[1];
      // this.search();
      this.loadDataGrid({
        leadsParam:this.searchData.leadsParam,
        userParam:this.searchData.userParam,
        userType:this.searchData.userType,
        teamName:this.searchData.teamName,
        status:this.searchData.status,
        courseStartDate: this.createDateStart,
        courseEndDate: this.createDateEnd,
        distributionDateStart: this.distributionDateStart,
        distributionDateEnd: this.distributionDateEnd,
        registTimeStart: this.registTimeStart,
        registTimeEnd: this.registTimeEnd,
      });
    },
    methods: {
      GetDateStr(AddDayCount) {
         var dd = new Date();
         dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
         var y = dd.getFullYear();
         var m = dd.getMonth()+1;//获取当前月份的日期
         var d = dd.getDate();
         return y+"-"+m+"-"+d;
      },
      search(val,name) {
        if(val) this.pageIndex = val;
        const _this = this;
        this.$refs[name].validate((valid) => {
          console.log(1);
          if (valid) {
           // this.$Message.success('提交成功!');
            this.loadDataGrid({
              leadsParam:_this.searchData.leadsParam,
              userParam:_this.searchData.userParam,
              userType:_this.searchData.userType,
              teamName:_this.searchData.teamName,
              status:_this.searchData.status,
              courseStartDate: _this.createDateStart,
              courseEndDate: _this.createDateEnd,
              distributionDateStart: _this.distributionDateStart,
              distributionDateEnd: _this.distributionDateEnd,
              registTimeStart: _this.registTimeStart,
              registTimeEnd: _this.registTimeEnd,
            });
         } else {
           // this.$Message.error('表单验证失败!');
         }
       })
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        const _this = this;
        common.ajax({
          url: SYS_BUSINESS().DebugCourse.queryTrOutBoundCCPage,
          data: {
            status: search.status,
            leadsParams: search.leadsParam,
            saleName: search.userParam,
            saleType: search.userType,
            team: search.teamName,
            startTime: search.courseStartDate,
            endTime: search.courseEndDate,
            distributionDateStart: search.distributionDateStart,
            distributionDateEnd: search.distributionDateEnd,
            registTimeStart: search.registTimeStart,
            registTimeEnd: search.registTimeEnd,
            pageIndex: _this.pageIndex,
            pageNumber: _this.pageNumber,
            orderBy: orderBy,
            sortBy: sortBy,
          },
          method: 'get',
          success: function (res) {
              if(res.data['outboundList']){
                res.data['outboundList'].forEach(function (v, i) {
                  v.iconPlay = true;
                })
              }
            _this.data = res.data['outboundList'] || [];
            _this.total = res.data.total;
          }
        });
      },
      courseAudio(uniqueId,recordFile,index){
        const _this = this;
      _this.audioModal = true;
        let voiceUrl;
        let apiUrl = SYS_BUSINESS().downloadVoiceFile;
        apiUrl += `?uniqueId=${uniqueId}&recordFile=${recordFile}`;
        common.ajax({
          url: apiUrl,
          success(res) {
            voiceUrl = res.data.voiceUrl
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
      downloadVoiceFile(uniqueId,recordFile){

        let apiUrl = SYS_BUSINESS().downloadVoiceFile;
        apiUrl += `?uniqueId=${uniqueId}&recordFile=${recordFile}`;
        common.ajax({
          url: apiUrl,
          success(res) {
            GLOBAL.newTab(res.data.voiceUrl,true);
          }
        })
      },
      pageChange(pageIndex) {
        const _this = this;
        this.pageIndex = pageIndex;
        this.loadDataGrid({
          leadsParam:_this.searchData.leadsParam,
          userParam:_this.searchData.userParam,
          userType:_this.searchData.userType,
          teamName:_this.searchData.teamName,
          status:_this.searchData.status,
          courseStartDate: _this.createDateStart,
          courseEndDate: _this.createDateEnd,
          distributionDateStart: _this.distributionDateStart,
          distributionDateEnd: _this.distributionDateEnd,
          registTimeStart: _this.registTimeStart,
          registTimeEnd: _this.registTimeEnd,
        });
      },
      changeDate(value) {
        this.createDateStart = value[0] || '';
        this.createDateEnd = value[1] || '';
      },
      changeDistributionDate(value) {
        this.distributionDateStart = value[0] || '';
        this.distributionDateEnd = value[1] || '';
      },
      changeRegistDate(value) {
        this.registTimeStart = value[0] || '';
        this.registTimeEnd = value[1] || '';
      },
      exportExcel(){
        let tokens = $.localStorage.get('token');
        this.param = `${SYS_BUSINESS().exportExcel.importOutboundExcel}?token=${tokens}&startTime=${this.createDateStart}&endTime=${this.createDateEnd}`
      }
    },
    components: {OBreadcrumb,PageModel}
  };
</script>

<style>

</style>
