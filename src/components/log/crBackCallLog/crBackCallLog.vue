<template>
  <div class="businessLog">
    <o-breadcrumb second="日志监控" third="天润回访统计"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span=24 class="right">
          <i-input v-model="searchData.userName" :size="$store.state.searchModuleSize" @on-keyup.enter="search(1)" placeholder="CR姓名" style="width:100px;margin-right:3px;"></i-input>
          <i-input v-model="searchData.team" :size="$store.state.searchModuleSize" @on-keyup.enter="search(1)" placeholder="团队" style="width:100px;margin-right:3px;"></i-input>
          <Date-picker type="daterange" :size="$store.state.searchModuleSize" @on-change="changeDate" placement="bottom-end" placeholder="拨打日期" style="width: 200px"></Date-picker>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="search(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <i-table :row-class-name="rowClassName" size="small" :height="theight" highlight-row stripe border :columns="columns" :data="data"></i-table>
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
        total:0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        searchData:{
          userName:'',//学生姓名
          team:'',//销售姓名
        },
        createDateStart: '',
        createDateEnd: '',
        columns: [
          {
            title: '回访次数',
            key: 'userName',
            align:'center'
          },
          {
            title: '0',
            key: 'returnZeroVisitCount',
            align:'center'
          },
          {
            title: '1',
            key: 'returnOneVisitCount',
            align:'center'
          },
          {
            title: '2',
            key: 'returnTwoVisitCount',
            align:'center'
          },
          {
            title: '3',
            key: 'returnThreeVisitCount',
            align:'center'
          },
          {
            title: '4',
            key: 'returnFourVisitCount',
            align:'center'
          },
          {
            title: '5',
            key: 'returnFiveVisitCount',
            align:'center'
          },
          {
            title: '5+',
            key: 'returnFiveMoreVisitCount',
            align:'center',
          },
        ],
      }
    },
    mounted() {
      this.search();
    },
    methods: {
      rowClassName (row, index) {
        if (index === 0) {
          return 'demo-table-info-row';
        }
        return '';
      },
      search(val) {
        if(val) this.pageIndex = val;
        const _this = this;
        this.loadDataGrid({
          userName:_this.searchData.userName,
          team:_this.searchData.team,
          backCallDateStart: _this.createDateStart,
          backCallDateEnd: _this.createDateEnd
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?crName=${search.userName}&teamName=${search.team}&returnVistiStartTime=${search.backCallDateStart}&returnVistiEndTime=${search.backCallDateEnd}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        // common.ajax({
        //   url: SYS_BUSINESS().DebugCourse.getAllCrTrCdrOb + param,
        //   method: 'get',
        //   success: function (res) {
        //
        //     _this.data = res.data['crReturnVisitVos'] || [];
        //
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get( SYS_BUSINESS().DebugCourse.getAllCrTrCdrOb + param,{
        }).then( ({data}) => {
          _this.data = data.data['crReturnVisitVos'] || [];
          _this.total = data.data.total;
        })
      },
      courseAudio(audioUrl,index){
        const _this = this;
        _this.data.forEach(function (v,i) {
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

<style scope>
  .ivu-table .demo-table-info-row td{
    background-color: #2db7f5;
    color: #fff;
  }
  /*.ivu-table .demo-table-error-row td{*/
    /*background-color: #ff6600;*/
    /*color: #fff;*/
  /*}*/
</style>
