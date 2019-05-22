<template>
  <div class="mc">
    <o-breadcrumb second="数据报表" third="市场报名数据"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <i-input :size="$store.state.searchModuleSize" v-model="Search.name" @on-keyup.enter="searchForm(1)" placeholder="学生姓名" style="width:90px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.phone" @on-keyup.enter="searchForm(1)" placeholder="手机号" style="width:120px;margin-right:2px;"></i-input>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.channel" clearable filterable placeholder="渠道" style="width:150px">
            <i-option v-for="(item,index) in channelList" :key='index' :value="item.uuid">{{ item.name }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.grade" clearable placeholder="年级" style="width:60px">
            <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.subject" clearable placeholder="科目" style="width:60px">
            <i-option v-for="(item,index) in subjectList" :key='index' :value="item">{{ item }}</i-option>
          </i-select>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.phoneLocaltion" @click.enter="searchForm(1)" placeholder="电话号码归属地" style="width:150px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.jh" @on-keyup.enter="searchForm(1)" placeholder="jh" style="width:100px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.dy" @on-keyup.enter="searchForm(1)" placeholder="dy" style="width:100px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.keyNum" @on-keyup.enter="searchForm(1)" placeholder="key_num" style="width:100px;margin-right:2px;"></i-input>

        </i-col>
        <i-col span=24 class="right">
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" @on-change="changeSignUpTime" placement="bottom-end" placeholder="报名时间" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="search" @click="searchForm(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {REPORT} from 'common/api/report.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 18,
        Search: {
          name: '',
          phone: '',
          channel: '',
          grade: '',
          subject: '',
          phoneLocaltion: '',
          signUpStartTime: '',
          signUpEndTime: '',
          jh: '',
          dy: '',
          keyNum: ''
        },
        gradeList: [],
        channelList: [],
        subjectList: [],
        columns: [
          {
            title: '渠道名称',
            key: 'channelName',
            align:'center',
            minWidth:90
          },
          {
            title: '学生姓名',
            key: 'leadsName',
            align:'center',
            minWidth:90
          },
          {
            title: '手机号',
            key: 'leadsPhone',
            align:'center',
            minWidth:120,
            render(h, params) {
              return h('span',hideCharAtNumber(params.row.leadsPhone));
            }
          },
          {
            title: '年级',
            align:'center',
            key: 'grade',
            minWidth:90,
          },
          {
            title: '科目',
            key: 'subject',
            align:'center',
            minWidth:90,
          },
          {
            title: '电话号码归属地',
            key: 'phoneLocaltion',
            align:'center',
            minWidth:120,
          },
          {
            title: '报名时间',
            align:'center',
            key: 'signUpDate',
            minWidth:150,
            render(h, params) {
              return h('span',formateDate(params.row.signUpDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '金额',
            align:'center',
            key: 'amount',
            minWidth:90,
          },
          {
            title: '是否试听',
            align:'center',
            key: 'isListen',
            minWidth:90,
          },
          {
            title: 'jh',
            align:'center',
            key: 'jh',
            minWidth:90,
          },
          {
            title: 'dy',
            align:'center',
            key: 'dy',
            minWidth:90,
          },
          {
            title: 'key_num',
            align:'center',
            key: 'keyNum',
            minWidth:90,
          },
        ]
      }
    },
    mounted() {
      this.searchForm();
      const _this = this;
      $.getJSON("static/data.json", function (json) {
        _this.gradeList = json.gradeList || [];
      });
      common.ajax({
        url: COMMON_API().allSubject,
        method: 'get',
        success: function (res) {
          _this.subjectList = res.data || [];
        }
      });
      common.ajax({
        url: COMMON_API().allChannel,
        method: 'get',
        success: function (res) {
          _this.channelList = res.data || [];
        }
      });
    },
    methods: {
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          name: this.Search.name,
          phone: this.Search.phone,
          channelUuid: this.Search.channel,
          grade: this.Search.grade,
          subject: this.Search.subject,
          phoneLocaltion: this.Search.phoneLocaltion,
          jh: this.Search.jh,
          dy: this.Search.dy,
          keyNum: this.Search.keyNum,
          signUpStartTime: this.Search.signUpStartTime,
          signUpEndTime: this.Search.signUpEndTime
        });
      },
      loadDataGrid(search) {
        let param = `?name=${search.name}&phone=${search.phone}&channelUuid=${search.channelUuid}&grade=${search.grade}&subject=${search.subject}&phoneLocaltion=${search.phoneLocaltion}&jh=${search.jh}&dy=${search.dy}&keyNum=${search.keyNum}&signUpStartTime=${search.signUpStartTime}&signUpEndTime=${search.signUpEndTime}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}`;
        const _this = this;
        common.ajax({
          url: REPORT().MarketChannel.signUpKpi + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['signUpVos'] || [];
            _this.total = res.data.total;
          }
        });
      },
      changeSignUpTime(value) {
        this.Search.signUpStartTime = value[0] || '';
        this.Search.signUpEndTime = value[1] || '';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      }
    },
    components: {OBreadcrumb ,PageModel}
  };
</script>

<style>

</style>
