<style scoped>
  .report-form{min-width: inherit;}
  .report-form th,
  .report-form td{ padding: 2px; }
  .report-form th.bg-total { background-color: #339933;color:#fff; }
  .report-form th.bg-ca { background-color: #999966;color:#fff; }
</style>
<template>
  <div class="total-sale-kpi">
    <div class="searchForm">
      <Row>
        <i-col span=24 class="right">
          <i-select :size="$store.state.searchModuleSize" v-model="type" @on-change="changeSelectedCount" placeholder="入职情况" style="width:150px">
            <i-option v-for="(item,index) in saleList" :key='index' :value="item.value">{{ item.name }}</i-option>
          </i-select>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" :value="daterage"  @on-change="changeDate" placement="bottom-end" placeholder="选择日期" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="search" @click="search">搜索</i-button>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-download-outline" @click="exportExcel">导出</i-button>
        </i-col>
      </Row>
    </div>
    <div class="content">
      <table class="report-form">
        <thead>
          <tr>
            <th colspan="12" class="bg-total">个人KPI</th>
            <th colspan="9" class="bg-ca">渠道等级（A）</th>
            <th colspan="9" class="bg-total">渠道等级（B）</th>
            <th colspan="9" class="bg-ca">渠道等级（C）</th>
            <th colspan="9" class="bg-total">渠道等级（E）</th>
          </tr>
          <tr class="bg-total">
            <!--总计-->
            <th class="bg-total">姓名</th>
            <th class="bg-total">团队</th>
            <th class="bg-total">职位（CC/CR）</th>
            <th class="bg-total">总营收金额</th>
            <th class="bg-total">实收金额</th>
            <th class="bg-total">签约人数</th>
            <th class="bg-total">平均单底</th>
            <th class="bg-total">名单数</th>
            <th class="bg-total">排课数</th>
            <th class="bg-total">排课率</th>
            <th class="bg-total">排课转化率</th>
            <th class="bg-total">转化率</th>
            <!-- 渠道等级A -->
            <th class="bg-ca">总营收金额</th>
            <th class="bg-ca">实收金额</th>
            <th class="bg-ca">签约人数</th>
            <th class="bg-ca">平均单底</th>
            <th class="bg-ca">名单数</th>
            <th class="bg-ca">排课数</th>
            <th class="bg-ca">排课率</th>
            <th class="bg-ca">排课转化率</th>
            <th class="bg-ca">转化率</th>
            <!-- 渠道等级B -->
            <th class="bg-total">总营收金额</th>
            <th class="bg-total">实收金额</th>
            <th class="bg-total">签约人数</th>
            <th class="bg-total">平均单底</th>
            <th class="bg-total">名单数</th>
            <th class="bg-total">排课数</th>
            <th class="bg-total">排课率</th>
            <th class="bg-total">排课转化率</th>
            <th class="bg-total">转化率</th>
            <!-- 渠道等级C -->
            <th class="bg-ca">总营收金额</th>
            <th class="bg-ca">实收金额</th>
            <th class="bg-ca">签约人数</th>
            <th class="bg-ca">平均单底</th>
            <th class="bg-ca">名单数</th>
            <th class="bg-ca">排课数</th>
            <th class="bg-ca">排课率</th>
            <th class="bg-ca">排课转化率</th>
            <th class="bg-ca">转化率</th>
            <!-- 渠道等级E -->
            <th class="bg-total">总营收金额</th>
            <th class="bg-total">实收金额</th>
            <th class="bg-total">签约人数</th>
            <th class="bg-total">平均单底</th>
            <th class="bg-total">名单数</th>
            <th class="bg-total">排课数</th>
            <th class="bg-total">排课率</th>
            <th class="bg-total">排课转化率</th>
            <th class="bg-total">转化率</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="47" style="padding: 0;border: 0;">
              <div class="td-data-list" :style="{'max-height': divHeight}">
                <table>
                  <tbody>
                    <tr v-for="(item,index) in data" :key='index' :title="item.userName+'：'+item.userType">
                      <!--总计-->
                      <td>{{item.userName || '-'}}</td>
                      <td>{{item.teamName || '-'}}</td>
                      <td>{{item.userType || '-'}}</td>
                      <td>{{(item.sumRealityMonery || item.sumRealityMonery == 0) ? item.sumRealityMonery : '-'}}</td>
                      <td>{{(item.realityMonery || item.realityMonery == 0) ? item.realityMonery : '-'}}</td>
                      <td>{{(item.makeContractPeople || item.makeContractPeople == 0) ? item.makeContractPeople : '-'}}</td>
                      <td>{{(item.averageSingleBottom || item.averageSingleBottom == 0) ? item.averageSingleBottom : '-'}}</td>
                      <td>{{(item.leadsLists || item.leadsLists == 0) ? item.leadsLists : '-'}}</td>
                      <td>{{(item.arrangeCourseNumber || item.arrangeCourseNumber == 0) ? item.arrangeCourseNumber : '-'}}</td>
                      <td>{{(item.arrangeCourseRate || item.arrangeCourseRate == 0) ? item.arrangeCourseRate+'%' : '-'}}</td>
                      <td>{{(item.arrangeCourseChangeRate || item.arrangeCourseChangeRate == 0) ? item.arrangeCourseChangeRate+'%' : '-'}}</td>
                      <td>{{(item.totalChangeRate || item.totalChangeRate == 0) ? item.totalChangeRate+'%' : '-'}}</td>
                      <!--渠道等级A-->
                      <td>{{(item.asumRealityMonery || item.asumRealityMonery == 0) ? item.asumRealityMonery : '-'}}</td>
                      <td>{{(item.arealityMonery || item.arealityMonery == 0) ? item.arealityMonery : '-'}}</td>
                      <td>{{(item.amakeContractPeople || item.amakeContractPeople == 0) ? item.amakeContractPeople : '-'}}</td>
                      <td>{{(item.aaverageSingleBottom || item.aaverageSingleBottom == 0) ? item.aaverageSingleBottom : '-'}}</td>
                      <td>{{(item.aleadsLists || item.aleadsLists == 0) ? item.aleadsLists : '-'}}</td>
                      <td>{{(item.aarrangeCourseNumber || item.aarrangeCourseNumber == 0) ? item.aarrangeCourseNumber : '-'}}</td>
                      <td>{{(item.aarrangeCourseRate || item.aarrangeCourseRate == 0) ? item.aarrangeCourseRate+'%' : '-'}}</td>
                      <td>{{(item.aarrangeCourseChangeRate || item.aarrangeCourseChangeRate == 0) ? item.aarrangeCourseChangeRate+'%' : '-'}}</td>
                      <td>{{(item.atotalChangeRate || item.atotalChangeRate == 0) ? item.atotalChangeRate+'%' : '-'}}</td>
                      <!--渠道等级B-->
                      <td>{{(item.b_sumRealityMonery || item.b_sumRealityMonery == 0) ? item.b_sumRealityMonery : '-'}}</td>
                      <td>{{(item.b_realityMonery || item.b_realityMonery == 0) ? item.b_realityMonery : '-'}}</td>
                      <td>{{(item.b_makeContractPeople || item.b_makeContractPeople == 0) ? item.b_makeContractPeople : '-'}}</td>
                      <td>{{(item.b_averageSingleBottom || item.b_averageSingleBottom == 0) ? item.b_averageSingleBottom : '-'}}</td>
                      <td>{{(item.b_leadsLists || item.b_leadsLists == 0) ? item.b_leadsLists : '-'}}</td>
                      <td>{{(item.b_arrangeCourseNumber || item.b_arrangeCourseNumber == 0) ? item.b_arrangeCourseNumber : '-'}}</td>
                      <td>{{(item.b_arrangeCourseRate || item.b_arrangeCourseRate == 0) ? item.b_arrangeCourseRate+'%' : '-'}}</td>
                      <td>{{(item.b_arrangeCourseChangeRate || item.b_arrangeCourseChangeRate == 0) ? item.b_arrangeCourseChangeRate+'%' : '-'}}</td>
                      <td>{{(item.b_totalChangeRate || item.b_totalChangeRate == 0) ? item.b_totalChangeRate+'%' : '-'}}</td>
                      <!--渠道等级C-->
                      <td>{{(item.c_sumRealityMonery || item.c_sumRealityMonery == 0) ? item.c_sumRealityMonery : '-'}}</td>
                      <td>{{(item.c_realityMonery || item.c_realityMonery == 0) ? item.c_realityMonery : '-'}}</td>
                      <td>{{(item.c_makeContractPeople || item.c_makeContractPeople == 0) ? item.c_makeContractPeople : '-'}}</td>
                      <td>{{(item.c_averageSingleBottom || item.c_averageSingleBottom == 0) ? item.c_averageSingleBottom : '-'}}</td>
                      <td>{{(item.c_leadsLists || item.c_leadsLists == 0) ? item.c_leadsLists : '-'}}</td>
                      <td>{{(item.c_arrangeCourseNumber || item.c_arrangeCourseNumber == 0) ? item.c_arrangeCourseNumber : '-'}}</td>
                      <td>{{(item.c_arrangeCourseRate || item.c_arrangeCourseRate == 0) ? item.c_arrangeCourseRate+'%' : '-'}}</td>
                      <td>{{(item.c_arrangeCourseChangeRate || item.c_arrangeCourseChangeRate == 0) ? item.c_arrangeCourseChangeRate+'%' : '-'}}</td>
                      <td>{{(item.c_totalChangeRate || item.c_totalChangeRate == 0) ? item.c_totalChangeRate+'%' : '-'}}</td>
                      <!--渠道等级E-->
                      <td>{{(item.e_sumRealityMonery || item.e_sumRealityMonery == 0) ? item.e_sumRealityMonery : '-'}}</td>
                      <td>{{(item.e_realityMonery || item.e_realityMonery == 0) ? item.e_realityMonery : '-'}}</td>
                      <td>{{(item.e_makeContractPeople || item.e_makeContractPeople == 0) ? item.e_makeContractPeople : '-'}}</td>
                      <td>{{(item.e_averageSingleBottom || item.e_averageSingleBottom == 0) ? item.e_averageSingleBottom : '-'}}</td>
                      <td>{{(item.e_leadsLists || item.e_leadsLists == 0) ? item.e_leadsLists : '-'}}</td>
                      <td>{{(item.e_arrangeCourseNumber || item.e_arrangeCourseNumber == 0) ? item.e_arrangeCourseNumber : '-'}}</td>
                      <td>{{(item.e_arrangeCourseRate || item.e_arrangeCourseRate == 0) ? item.e_arrangeCourseRate+'%' : '-'}}</td>
                      <td>{{(item.e_arrangeCourseChangeRate || item.e_arrangeCourseChangeRate == 0) ? item.e_arrangeCourseChangeRate+'%' : '-'}}</td>
                      <td>{{(item.e_totalChangeRate || item.e_totalChangeRate == 0) ? item.e_totalChangeRate+'%' : '-'}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {REPORT} from 'common/api/report.js';
  import {common} from 'common/js/common.js';
  export default{
    data() {
      return {
        daterage: [],
        data: [],
        divHeight: SCREEN_SIZE === 'lg' ? '746px': '441px',
        saleList:[],
        type:''
      }
    },
    mounted(){
      const _this = this
      $.getJSON("static/data.json", function (json) {
        _this.saleList = json.saleList;
      });
    },
    methods: {
      search() {
        let date = this.daterage;
        let startTime = '', endTime = '';
        let type = this.type;
        if (date.length>0) {
          startTime = date[0];
          endTime = date[1];
          this.loadDataGrid(startTime, endTime, type);
        }
      },
      isSearchNull() {
        let date = this.daterage;
        let startTime = '', endTime = '';
        let type = this.type;
        startTime = date[0];
        endTime = date[1];
        console.log(startTime);
        console.log(endTime);
        if( !startTime && !startTime && !type){
          return true;
        }else {
          return false;
        }
      },
      exportExcel() {
        let isSearchNull = this.isSearchNull();
        if(isSearchNull) {
          const _this = this;
          this.$Modal.confirm({
            title: '导出',
            content: '没有选择任何筛选条件，将导出全部数据',
            onOk() {
              _this.exportData();
            }
          });
        }else{
          this.exportData();
        }
      },
      exportData() {
        let date = this.daterage;
        let startTime = '', endTime = '';
        let type = this.type;
        if (date.length>0) {
          startTime = date[0];
          endTime = date[1];
        let apiUrl = REPORT().Sale.generateUserKpiExcel;
          apiUrl += `?token=${localStorage.getItem('token')}&startTime=${startTime}&endTime=${endTime}&type=${type}`;

          GLOBAL.newTab(apiUrl,true);
        }
      },
      changeSelectedCount(value){
        const _this = this;
        _this.type = value
      },
      loadDataGrid(startTime, endTime,type) {
        let param = `?startTime=${startTime}&endTime=${endTime}&type=${type}`;
        const _this = this;
        common.ajax({
          url: REPORT().Sale.userSaleKpi + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data || [];
          }
        });
      },
      changeDate(value) {
        this.daterage = value;
      }
    },
  };
</script>
