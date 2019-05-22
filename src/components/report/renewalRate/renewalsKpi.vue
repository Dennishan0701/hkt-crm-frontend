<template>
<div>
  <o-breadcrumb second="数据报表" third="续费KPI"></o-breadcrumb>
  <div class="content">
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <Date-picker :size="$store.state.searchModuleSize" ref="dataYm" @on-change='getMonth' type="month" placeholder="选择年月" style="width: 200px" :value="dateValue"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <div class="item">
      <div class="grid-widget">
        <h2><Icon type="grid" style="margin-right: 5px"></Icon>总续费KPI</h2>
      </div>
      <div class="item_list">
        <i-table size="small" highlight-row stripe :columns="allColumns" :data="allData"></i-table>
      </div>
    </div>
    <div class="item">
      <div class="grid-widget">
        <h2><Icon type="arrow-graph-up-right" style="margin-right: 5px"></Icon>团队续费KPI</h2>
      </div>
      <div class="item_list">
        <i-table size="small" highlight-row stripe :columns="teamColumns" @on-current-change="getUserSelections" :data="teamData"></i-table>
      </div>
    </div>
    <div class="item">
      <div class="grid-widget">
        <h2><Icon type="ios-book" style="margin-right: 5px"></Icon>个人续费KPI</h2>
      </div>
      <div class="item_list">
        <i-table size="small" highlight-row stripe :columns="personalColumns" :data="personalData"></i-table>
      </div>
    </div>

  </div>
</div>
</template>

<script type="text/ecmascript-6">
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import {REPORT} from 'common/api/report.js';
  import {common,formateDate} from 'common/js/common.js';
  let month0 = new Date().getMonth()+1;
  if(month0<10){
    month0 = '0'+month0;
  }
  let month = new Date().getFullYear() + '-' + month0;

  export default{
    props: {
      user: {
        type: Object
      }
    },
    data() {
      return {
        dateValue:'',
        uuid: '',
        month: month,
        allData: [],
        teamData: [],
        personalData: [],
        allColumns: [
          {
            title: '续费人数',
            key: 'renewPayNum',
            align:'center',
            width:90,
            render(h, params) {
              if(params.row.renewPayNum){
                return h('span',params.row.renewPayNum)
              }else {
                return h('span','0')
              }
            }
          },
          {
            title: '在读人数',
            key: 'newPayNum',
            align:'center',
            width:90,
            render(h, params) {
              if(params.row.newPayNum){
                return h('span',params.row.newPayNum)
              }else {
                return h('span','0')
              }
            }
          },
          {
            title: '续费率（%）',
            key: 'renewPayRate',
            align:'center',
            width:90
          },
        ],
        teamColumns: [
          {
            title: '序号',
            width: 40,
            type:'index',
            align:'center',
          },
          {
            title: '团队',
            key: 'teamName',
            align:'center',
            width:90
          },
          {
            title: '续费人数',
            key: 'renewPayNum',
            align:'center',
            width:90,
            render(h, params) {
              if(params.row.renewPayNum){
                return h('span',params.row.renewPayNum)
              }else {
                return h('span','0')
              }
            }
          },
          {
            title: '在读人数',
            key: 'readingStudentNum',
            align:'center',
            width:90,
            render(h, params) {
              if(params.row.readingStudentNum){
                return h('span',params.row.readingStudentNum)
              }else {
                return h('span','0')
              }
            }
          },
          {
            title: '续费率（%）',
            key: 'renewPayRate',
            align:'center',
            width:90
          },
        ],
        personalColumns: [
          {
            title: '序号',
            width: 40,
            type:'index',
            align:'center',
          },
          {
            title: '姓名',
            key: 'userName',
            align:'center',
            width:90
          },
          {
            title: '续费人数',
            key: 'renewPayNum',
            align:'center',
            width:90,
            render(h, params) {
              return h('span',params.row.renewPayNum ||0)
            }
          },
          {
            title: '在读人数',
            key: 'readingStudentNum',
            align:'center',
            width:90,
            render(h, params) {
              return h('span',params.row.readingStudentNum||0)
            }
          },
          {
            title: '续费率（%）',
            key: 'renewPayRate',
            align:'center',
            width:90
          },
        ]
      }
    },
    mounted(){
      this.month = month;
      this.dateValue = month;
      // this.$refs.dataYm.value = month;
      this.searchForm();
    },
    methods: {
      getMonth(value){
        // console.log(value);
        this.month = value;
        console.log(this.$refs.dataYm);
      },
      searchForm(){
        this.loadDataGrid({
          month:this.month
        })
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?renewPayDate=${search.month}&orderBy=${orderBy}&sortBy=${sortBy}`;
        let apiUrl = REPORT().renewalRate.getRenewPayKpi+param;
        const _this = this;
        common.ajax({
          url: apiUrl,
          method: 'get',
          success: function(res){
            _this.allData = [];
            _this.allData.push({
              newPayNum:res.data['renewPayTotalDto'].newPayNum,
              renewPayDate:res.data['renewPayTotalDto'].renewPayDate,
              renewPayNum:res.data['renewPayTotalDto'].renewPayNum,
              renewPayRate:res.data['renewPayTotalDto'].renewPayRate,
          })
            _this.teamData = res.data['readingStudentTeamDtoList'] || [];
          }
        });
      },
      getUserSelections(currentRow) {
        const _this = this;
        common.ajax({
          url: REPORT().renewalRate.getReanewPayUserKpi,
          data:{
            "teamUuid":currentRow.teamUuid,
            "renewPayDate":_this.month,
          },
          method: 'get',
          success: function (res) {

            _this.personalData = res.data||[];

          }
        });
      },
      pageChange(pageIndex){
        this.pageIndex = pageIndex;
        this.loadDataGrid({month: this.month});
      }
    },
    components: {
      OBreadcrumb,
    }
  };
</script>
<style lang="less" scoped rel="stylesheet/less">
.content{
  padding: 0 10px;
  .item{
    margin-bottom: 30px;
    border:1px solid #e3e8ee;
    background-color: #fafcfe;
    padding:10px 0;
    border-radius: 4px;
    .grid-widget{
      /*margin:10px 0;*/
      /*margin-top: 0;*/
      h2{
        margin-left: 10px;
      }
    }
    .item_list{
      margin: 0 10px;
    }
  }
}
</style>
