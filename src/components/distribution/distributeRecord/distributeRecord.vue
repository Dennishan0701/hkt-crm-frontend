<template>
<div>
  <o-breadcrumb second="分配管理" third="分配leads记录"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="24" class="right">
        <form id="searchForm">
          <i-input v-model="Search.name" :size="$store.state.searchModuleSize" placeholder="学生姓名" style="width:150px;margin-right:2px;"></i-input>
          <i-input v-model="Search.phone" :size="$store.state.searchModuleSize" placeholder="学生手机号" style="width:150px;margin-right:2px;"></i-input>
          <i-input v-model="Search.distributeUser" :size="$store.state.searchModuleSize" placeholder="分配销售" style="width:150px;margin-right:2px;"></i-input>
          <i-input v-model="Search.channelLevel" :size="$store.state.searchModuleSize" placeholder="渠道等级" style="width:100px;margin-right:2px;"></i-input>
          <i-select v-model="Search.channelUuid" :size="$store.state.searchModuleSize" filterable clearable placeholder="渠道名称" style="width:150px;">
            <i-option v-for="(item,index) in allChannelList" :key='index' :value="item.uuid">{{ item.name }}</i-option>
          </i-select>
          <i-select v-model="Search.grade" :size="$store.state.searchModuleSize" clearable  placeholder="年级" style="width:80px;">
            <i-option v-for="(item,index) in gradeList" :key="index" :value="item.value">{{ item.value }}</i-option>
          </i-select>
          <i-select v-model="Search.subject" :size="$store.state.searchModuleSize" clearable  placeholder="科目" style="width:80px;">
            <i-option v-for="(item,index) in subjectList" :key='index' :value="item">{{ item }}</i-option>
          </i-select>
          <i-select v-model="Search.distributeType" :size="$store.state.searchModuleSize" clearable placeholder="分配类别" style="width:100px;">
            <i-option value="0">新名单</i-option>
            <i-option value="1">藏经阁</i-option>
            <i-option value="3">离职名单</i-option>
          </i-select>
        </form>
      </i-col>
      <i-col span=24 class="right">
        <Date-picker type="daterange" :size="$store.state.searchModuleSize" placement="bottom-end" @on-change="changeOperateDate" placeholder="操作时间" style="width: 200px"></Date-picker>
        <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索</i-button>
      </i-col>
    </Row>
  </div>
  <i-table size="small" :height="theight" stripe :columns="columns" :data="data"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>
</div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {DISTRIBUTE} from 'common/api/distribute.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        allChannelList:[],
        data: [],
        gradeList: [],
        subjectList: [],
        total: 0,
        pageIndex: 1,
        // pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        pageNumber: 100,
        Search: {
          name: '',
          grade: '',
          subject: '',
          phone: '',
          distributeUser: '',
          channelLevel: '',
          channelUuid:'',
          distributeType: '',
          operateStartTime: '',
          operateEndTime: ''
        },
        columns: [
          {
            title: '学生',
            key: 'leadsName',
            align: 'center',
            minWidth:90,
            render : (h, params) => {
              return h('div',[
                h('a',{
                  on:{
                    click:()=>{
                      GLOBAL.viewLeadsDetail(params.row.leadsUuid)
                    }
                  }
                },params.row.leadsName)
              ])
//              return `<strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.leadsUuid}');">${row.leadsName}</a></strong>`;
            }
          },
          {
            title: '手机号',
            key: 'leadsPhone',
            align: 'center',
            minWidth:120,
            render (h, params) {
              return h('span',hideCharAtNumber(params.row.leadsPhone));
            }
          },
          {
            title: '年级',
            key: 'grade',
            align: 'center',
            minWidth:90,
          },
          {
            title: '科目',
            key: 'subject',
            align: 'center',
            minWidth:90,
          },
          {
            title: '分配销售',
            align: 'center',
            key: 'saleUserName',
            minWidth:90,
          },
          {
            title: '渠道等级',
            key: 'channelLevel',
            align: 'center',
            minWidth:90,
          },
          {
            title: '渠道名称',
            align: 'center',
            key: 'channelName',
            width: 90
          },
          {
            title: '操作时间',
            key: 'distributeTime',
            align: 'center',
            minWidth:150,
            render(h, params) {
              return h('span',formateDate(params.row.distributeTime,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '操作人',
            align: 'center',
            key: 'distributer',
            minWidth:90,
          },
          {
            title: '类别',
            align: 'center',
            key: 'type',
            minWidth:90,
          }
        ]
      }
    },
    mounted() {
      this.getAllChannel();
      this.searchForm();
      const _this = this;
// //      获取科目
//       common.ajax({
//         url: COMMON_API().allSubject,
//         method: 'get',
//         success: function (res) {
//           _this.subjectList = res.data || [];
//         }
//       });
      this.$axios.get(COMMON_API().allSubject,{
      }).then( ({data}) => {
        _this.subjectList = data.data || [];
      })
     // 获取年级
      $.getJSON("static/data.json", function (json) {
        _this.gradeList = json.gradeList;
      });
    },
    methods: {
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          name: this.Search.name,
          phone: this.Search.phone,
          channelLevel: this.Search.channelLevel ? this.Search.channelLevel.toLocaleUpperCase() : '',
          distributeUser: this.Search.distributeUser,
          distributeType: this.Search.distributeType,
          grade: this.Search.grade,
          channelUuid:this.Search.channelUuid||"",
          subject: this.Search.subject,
          operateStartTime: this.Search.operateStartTime,
          operateEndTime: this.Search.operateEndTime
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?name=${search.name}&phone=${search.phone}&grade=${search.grade}&subject=${search.subject}&distributeUser=${search.distributeUser}&channelLevel=${search.channelLevel}&channelUuid=${search.channelUuid}`;
        param += `&distributeType=${search.distributeType}&operateStartTime=${search.operateStartTime}&operateEndTime=${search.operateEndTime}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        // common.ajax({
        //   url: DISTRIBUTE().distributeRecord + param,
        //   method: 'get',
        //   success: function (res) {
        //     _this.data = res.data['distributeRecordVos'] || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get(DISTRIBUTE().distributeRecord,{
          params:{
            name: search.name,
            phone: search.phone,
            grade: search.grade,
            subject: search.subject,
            distributeUser: search.distributeUser,
            channelLevel: search.channelLevel,
            channelUuid: search.channelUuid,
            distributeType: search.distributeType,
            operateStartTime: search.operateStartTime,
            operateEndTime: search.operateEndTime,
            pageIndex: this.pageIndex,
            pageNumber: this.pageNumber,
            orderBy:orderBy,
            sortBy:sortBy,
          }
        }).then( ({data}) => {
          _this.data = data.data['distributeRecordVos'] || [];
          _this.total = data.data.total;
        })
      },
      changeOperateDate(value) {
        this.Search.operateStartTime = value[0] || '';
        this.Search.operateEndTime = value[1] || '';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      // 获取所有渠道
      getAllChannel(){
        const _this = this;
        // common.ajax({
        //   url: COMMON_API().allChannel,
        //   method: 'get',
        //   success: function(response){
        //     _this.allChannelList = response.data || [];
        //   }
        // });
        this.$axios.get(COMMON_API().allChannel,{
        }).then( ({data}) => {
          _this.allChannelList = data.data || [];
        })
      },
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470: '';
      }
    },
    components: { OBreadcrumb,PageModel }
  };
</script>

<style>

</style>
