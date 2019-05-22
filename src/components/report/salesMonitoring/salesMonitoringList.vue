<template>
  <div class="mc">
    <o-breadcrumb second="数据报表" third="团队人员负责leads/学员明细"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <i-select :size="$store.state.searchModuleSize" v-model="Search.teamUuid" placeholder="团队" @on-change='teamChange' style="width:100px">
            <i-option v-for="(item,index in teamList" :key='index' :value="item.uuid">{{ item.name }}</i-option>
          </i-select>

          <i-select :size="$store.state.searchModuleSize" v-model="Search.userUuid" label-in-value @on-change='userChange' placeholder="组员" style="width:100px">
            <i-option v-for="(item,index) in userList" :key='index' :value="item.userUuid">{{ item.userName }}</i-option>
          </i-select>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.leadsName" clearable @on-keyup.enter="searchForm(1)" placeholder="学生姓名" style="width:90px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.leadsPhone" clearable @on-keyup.enter="searchForm(1)" placeholder="手机号" style="width:120px;margin-right:2px;"></i-input>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.grade" clearable placeholder="年级" style="width:90px">
            <i-option value="小四">小四</i-option>
            <i-option value="小五">小五</i-option>
            <i-option value="小六">小六</i-option>
            <i-option value="预初">预初</i-option>
            <i-option value="初一">初一</i-option>
            <i-option value="初二">初二</i-option>
            <i-option value="初三">初三</i-option>
            <i-option value="初四">初四</i-option>
            <i-option value="高一">高一</i-option>
            <i-option value="高二">高二</i-option>
            <i-option value="高三">高三</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.subject" clearable placeholder="科目" style="width:200px">
            <i-option v-for="(item,index) in subjectList" :key='index' :value="item">{{ item }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.provinceId" :label-in-value="true" :clearable="true" filterable @on-change="changeSelectedCity" placeholder="省" style="width:150px">
            <i-option v-for="(item,index) in provinceList" :key='index' :value="item.id">{{ item.name }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.cityId" :label-in-value="true" :clearable="true" @on-change="changeSelectedArea" placeholder="市" style="width:150px">
            <i-option v-for="(item,index) in cityArrays" :key='index' :value="item.id">{{ item.name }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.countId":label-in-value="true" :clearable="true" @on-change="changeSelectedCount" placeholder="区" style="width:150px">
            <i-option v-for="(item,index) in areaList" :key='index' :value="item.id">{{ item.name }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.schoolName" :label-in-value="true" :clearable="true" placeholder="学校" style="width:150px">
            <i-option v-for="(item,index) in schoolNameList" :key='index' :value="item.schoolname">{{ item.schoolname }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.connectStatus" clearable placeholder="拨打状态" style="width:150px">
            <i-option value="create">新建</i-option>
            <i-option value="wait">待拨打 待跟进</i-option>
            <i-option value="noconnectwait">未接通,待跟进</i-option>
            <i-option value="connectwait">已接通,待跟进</i-option>
            <i-option value="successwait">已接通,同意排课</i-option>
            <i-option value="noconnectgiveup">未接通,放弃</i-option>
            <i-option value="connectgiveup">已接通,放弃</i-option>
          </i-select>
        </i-col>
        <i-col span=24 class="right">
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-end" @on-change="signUpStartDate" clearable placeholder="报名时间" style="width: 200px"></Date-picker>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-end" @on-change="chargeDate" clearable placeholder="负责时间" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="search" @click="searchForm(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <h1><span style="color: #f90;line-height: 60px">{{readyName}}</span>负责的leads/学员明细</h1>
    <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
      <checkbox label="leadsPhone">手机号</checkbox>
      <checkbox label="grade">年级</checkbox>
      <checkbox label="channelLevel">渠道等级</checkbox>
      <checkbox label="subject">科目</checkbox>
      <checkbox label="phoneLocaltion">号码归属地</checkbox>
      <checkbox label="province">省</checkbox>
      <checkbox label="city">市</checkbox>
      <checkbox label="count">区/县</checkbox>
      <checkbox label="schoolName">学校</checkbox>
      <checkbox label="gradeRank">年级排名</checkbox>
      <checkbox label="connectStatus">拨打状态</checkbox>
      <checkbox label="signUpDate">报名时间</checkbox>
      <checkbox label="chargeTime">负责时间</checkbox>
    </checkbox-group>
    <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
    <info-remark ref='inforemark' :history-remark-list="historyRemarkList"></info-remark>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {REPORT} from 'common/api/report.js';
  import {formateDate,common,hideCharAtNumber,clearSearchForm} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import infoRemark from './infoRemark';
  import PageModel from 'dashborader/page/page.vue';
  let num = 0;
  export default{
    data() {
      return {
        data: [],
        tableColumnsChecked:['leadsPhone','grade','channelLevel','subject','phoneLocaltion','province','city','count','schoolName','gradeRank','connectStatus','signUpDate','chargeTime','mobileNoTrack'],
        historyRemarkList:[],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11: 17,
        subjectList:[],//获取科目
        provinceList:[],//省列表
        cityArrays: [],//市列表
        areaList: [],//区列表
        schoolNameList:[],//学校
        teamList:[],//团队
        userList:[],//组员
        province:'',//省
        city:'',//市
        count:'',//区
        uuid:'',
        userName:'',
        readyName:'',
        Search: {
          leadsName: '',
          leadsPhone: '',
          signUpStartDate: '',
          signUpEndDate: '',
          chargeStartDate: '',
          chargeEndDate: '',
          provinceId:'',//省
          cityId:'',//市
          countId:'',//区
          schoolName:'',//学校
          grade:'',//年级
          channelLevel:'',
          subject:'',//科目
          connectStatus:'',//联系状态
          teamUuid:'',//团队
          userUuid:'',//组员
        },
        columns: [],
      }
    },
    mounted() {
      this.changeTableColumns();
      let _this = this;
      num = 0;
      _this.Search.userUuid = sessionStorage.getItem('template_userUuidSales');
      _this.readyName = sessionStorage.getItem('template_userNameSales');
//      _this.userName = sessionStorage.getItem('template_userNameSales');
      _this.Search.teamUuid = sessionStorage.getItem('template_teamUuidSales');
//      _this.teamName = sessionStorage.getItem('template_teamNameSales');
      //获取省
      common.ajax({
        url: COMMON_API().ssqAreaAllStudy,
        method: 'get',
        data: {parentid: 1},
        success: function (response) {
          _this.provinceList = response.data || [];
        }
      });
      //获取团队
      common.ajax({
        url: REPORT().Sale.getSaleTeam,
        method: 'get',
        success: function (response) {
          _this.teamList = response.data['teams'] || [];
        }
      });
      //获取科目
      common.ajax({
        url: COMMON_API().allSubject,
        method: 'get',
        success: function (res) {
          _this.subjectList = res.data || [];
        }
      });
      this.searchForm();
    },
    methods: {
      getTableColumns () {
        const columns = {
          leadsName:{
          title: '姓名',
            key: 'leadsName',
          align:'center',
          width:90,
          fixed:'left',
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
                  GLOBAL.viewLeadsDetail(params.row.leadsUuid,'0')
              }
          }
          },params.row.leadsName)
          ])
//          return `<strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.leadsUuid}','0');">${row.leadsName}</a></strong>`;
        }
        },
          leadsPhone:{
          title: '手机号',
            key: 'leadsPhone',
          align:'center',
          width:120,
              render(h, params) {
          return h('span',hideCharAtNumber(params.row.leadsPhone))
        }
        },
          grade:{
          title: '年级',
            key: 'grade',
          align:'center',
          width:90,
        },
          channelLevel:{
          title: '渠道等级',
            key: 'channelLevel',
          align:'center',
          width:90,
        },
          subject:{
          title: '科目',
            align:'center',
          key: 'subject',
          width:90,
        },
          phoneLocaltion:{
          title: '号码归属地',
            key: 'phoneLocaltion',
          align:'center',
          width:90,
        },
          province:{
          title: '省',
            key: 'province',
          align:'center',
          width:90,
        },
          city:{
          title: '市',
            key: 'city',
          align:'center',
          width:90,
        },
          count:{
          title: '区/县',
            align:'center',
          key: 'count',
          width:90,
        },
          schoolName:{
          title: '学校',
            key: 'schoolName',
          align:'center',
          width:90,
        },
          gradeRank:{
          title: '年级排名',
            key: 'gradeRank',
          align:'center',
          width:90,
        },
          connectStatus:{
          title: '拨打状态',
            key: 'connectStatus',
          align:'center',
          width:120,
        },
          signUpDate: {
          title: '报名时间',
            key: 'signUpDate',
          align:'center',
          width:180,
              render(h, params) {
          return h('span',formateDate(params.row.signUpDate,'yyyy-MM-dd hh:mm:ss'));
        }
        },
          chargeTime:{
          title: '负责时间',
            key: 'chargeTime',
          align:'center',
          width:180,
              render(h, params) {
          return h('span',formateDate(params.row.chargeTime,'yyyy-MM-dd hh:mm:ss'));
        }
        },
          mobileNoTrack:{
          title: '备注信息',
            key: 'mobileNoTrack',
          width:90,
          fixed:'right',
          align:'center',
              render : (h, params) => {

              return h('div',[
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small',
                    icon: 'social-twitch-outline',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs:{
                    title:'获取历史备注信息'
                  },
                  on: {
                    click: () => {
                    this.getStudentHistoryInfo(params.row.leadsPhone)
                }
            }
            })
            ])
//          return `<i-button type="warning" size="small" icon="social-twitch-outline" title="获取历史备注信息" @click="getStudentHistoryInfo('${row.leadsPhone}')"></i-button>`
        }
        },
        };
        let datas = [columns.leadsName];
        this.tableColumnsChecked.forEach(col => datas.push(columns[col]));
        return datas;
      },

      userChange(value){
          if(value.label){
            this.userName = value.label;
          }
      },
      teamChange(){
          //重新获取组员
        const _this = this;
        common.ajax({
          url: REPORT().Sale.getTeamSale,
          method: 'get',
          data: {teamUuid: _this.Search.teamUuid},
          success: function (response) {
            _this.Search.userUuid = response.data['teamUserVos'][0].userUuid || '';
            _this.userName = response.data['teamUserVos'][0].userName || '';
            _this.userList = response.data['teamUserVos'] || [];
          }
        });
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          leadsName: this.Search.leadsName,
          leadsPhone: this.Search.leadsPhone,
          signUpStartDate: this.Search.signUpStartDate,
          signUpEndDate: this.Search.signUpEndDate,
          chargeStartDate: this.Search.chargeStartDate,
          chargeEndDate: this.Search.chargeEndDate,
          province:this.province,
          city:this.city,
          count:this.count,
          schoolName:this.Search.schoolName,
          grade:this.Search.grade,
          subject:this.Search.subject,
          connectStatus:this.Search.connectStatus,
          userUuid:this.Search.userUuid,
          teamUuid:this.Search.teamUuid,
          num:num
        });
        num++;
      },
      loadDataGrid(search) {
        let param = `?teamUuid=${search.teamUuid}&userUuid=${search.userUuid}&leadsName=${search.leadsName}&leadsPhone=${search.leadsPhone}&chargeStartDate=${search.chargeStartDate}&chargeEndDate=${search.chargeEndDate}`;
        param += `&signUpStartDate=${search.signUpStartDate}&signUpEndDate=${search.signUpEndDate}&province=${search.province}&city=${search.city}&count=${search.count}&schoolName=${search.schoolName}&grade=${search.grade}&subject=${search.subject}&connectStatus=${search.connectStatus}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}`;
        const _this = this;
        common.ajax({
          url: REPORT().Sale.getUserLeadsInfo + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['leadsInfoVos'] || [];
            console.log(search.num);
            if(search.num>0){
              _this.readyName = _this.userName
            }
            _this.total = res.data.total;
          }
        });
      },
      getStudentHistoryInfo(leadsPhone){
        const that = this;
        common.ajax({
          url: REPORT().Leads.getStudentHistoryInfo + `?leadsPhone=${leadsPhone}`,
          method: 'get',
          success: function (res) {
            that.historyRemarkList = res.data || [];
          }
        });
        this.$refs.inforemark.show();
      },
      //省市区学校
      changeSelectedCity(areaName) {
        const _this = this;
        _this.province = areaName.label;
        //获取城市
        common.ajax({
          url: COMMON_API().ssqAreaAllStudy,
          method: 'get',
          data: {parentid: areaName.value},
          success: function (response) {
            _this.cityArrays = response.data;
          }
        });
      },
      changeSelectedArea(areaName) {
        const _this = this;
        //获取城市的区域
        console.log(areaName.label);
        _this.city = areaName.label;
        common.ajax({
          url: COMMON_API().ssqAreaAllStudy,
          method: 'get',
          data: {parentid: areaName.value},
          success: function (response) {
            _this.areaList = response.data || [];
          }
        });
      },
      changeSelectedCount(areaName){
        const _this = this;
        console.log(areaName.label);
        _this.count = areaName.label;
        //获取所有学校
        console.log(areaName);
        common.ajax({
          url: COMMON_API().allStudySchool,
          method: 'get',
          data: {provinceId:_this.Search.provinceId,cityId: _this.Search.cityId,countyId:areaName.value},
          success: function (response) {
            _this.schoolNameList = response.data || [];
          }
        });
      },
      //省市区学校
      chargeDate(value) {
        this.Search.chargeStartDate = value[0] || '';
        this.Search.chargeEndDate = value[1] || '';
      },
      signUpStartDate(value) {
        this.Search.signUpStartDate = value[0] || '';
        this.Search.signUpEndDate = value[1] || '';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      changeTableColumns () {
        this.columns = this.getTableColumns();
      }
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470: '';
      }
    },
    components: {OBreadcrumb , infoRemark,PageModel}
  };
</script>

<style>

</style>
