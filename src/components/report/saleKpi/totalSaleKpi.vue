<style scoped>
  .report-form{min-width: inherit;}
  .report-form th,
  .report-form td{ padding: 2px; }
  .report-form th.bg-total { background-color: #339933;color:#fff; }
  .report-form th.bg-new { background-color: #666600;color:#fff; }
  .report-form th.bg-xu { background-color: #009999;color:#fff; }
  .report-form th.bg-ca { background-color: #999966;color:#fff; }
  caption h2 {text-align: left;}
  .report-form tr:nth-child(even){ background-color: #fff;}
  .table-wrap{
    overflow: auto
  }
</style>
<template>
  <div class="total-sale-kpi">
    <div class="searchForm">
      <Row>
        <i-col span=24 class="right">
          <i-select :size="$store.state.searchModuleSize" v-model="type" clearable @on-change="changeSelectedCount" placeholder="入职情况" style="width:150px">
            <i-option v-for="(item,index) in saleList" :key='index' :value="item.value">{{ item.name }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="dateType" clearable @on-change="checkDateType" placeholder="时间类型" style="width:150px">
            <i-option value="0">人工月</i-option>
            <i-option value="1">人工周</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="date" clearable @on-change="checkDate" placeholder="人工月/人工周" style="width:150px">
            <i-option v-for="(item,index) in timeDate" :key='index' :value="item">{{ item }}</i-option>
          </i-select>
          <!--<Date-picker :size="$store.state.searchModuleSize" type="daterange" :value="daterage" @on-change="changeDate" placement="bottom-end" placeholder="选择日期" style="width: 200px"></Date-picker>-->
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="search" @click="search">搜索</i-button>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-download-outline" @click="exportExcel">导出</i-button>
        </i-col>
      </Row>
    </div>
    <div class="table-wrap">
      <table class="report-form" >
        <thead>
          <tr>
            <th colspan="6" class="bg-total">总计</th>
            <th colspan="2" class="bg-ca">市场</th>
            <th colspan="1" class="bg-total">排课</th>
            <th colspan="7" class="bg-ca">销售</th>
            <th colspan="5" class="bg-total">续费</th>
            <!--<th colspan="9" class="bg-ca">退费</th>-->
          </tr>
          <tr class="bg-total">
            <!--总计-->
            <th class="bg-total">总营收金额</th>
            <th class="bg-total">总实收金额</th>
            <th class="bg-total">总付费人数</th>
            <th class="bg-total">平均单底</th>
            <th class="bg-total">销售金额预测</th>
            <th class="bg-total">指标完成率</th>
            <!--市场-->
            <th class="bg-ca">总名单数</th>
            <th class="bg-ca">名单内已分配数</th>
            <!--排课-->
            <th class="bg-total">总排课数</th>
            <!--销售-->
            <th class="bg-ca">本月分配新名单数</th>
            <th class="bg-ca">总新签人数</th>
            <th class="bg-ca">总排课率</th>
            <th class="bg-ca">排课转化率</th>
            <th class="bg-ca">总转化率</th>
            <th class="bg-ca">总新签金额</th>
            <th class="bg-ca">新签销售占总销售金额比(%)</th>
            <!--续费-->
            <th class="bg-total">总续费金额</th>
            <th class="bg-total">总续费人数</th>
            <th class="bg-total">在读学员</th>
            <th class="bg-total">续费人数率(%)</th>
            <th class="bg-total">续费销售占总销售金额比(%)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <!--总计-->
            <td>{{(totalSaleKpiVo.realityMoney || totalSaleKpiVo.realityMoney == 0) ? totalSaleKpiVo.realityMoney : '-'}}</td>
            <td>{{(totalSaleKpiVo.sumRealityMoney || totalSaleKpiVo.sumRealityMoney == 0) ? totalSaleKpiVo.sumRealityMoney : '-'}}</td>
            <td>{{(totalSaleKpiVo.makeContractPeople || totalSaleKpiVo.makeContractPeople == 0) ? totalSaleKpiVo.makeContractPeople : '-'}}</td>
            <td>{{(totalSaleKpiVo.averageSingleBottom || totalSaleKpiVo.averageSingleBottom == 0) ? totalSaleKpiVo.averageSingleBottom : '-'}}</td>
            <td>{{(totalSaleKpiVo.saleTargetMoney || totalSaleKpiVo.saleTargetMoney == 0) ? totalSaleKpiVo.saleTargetMoney : '-'}}</td>
            <td>{{(totalSaleKpiVo.saleTargetCompleteRate || totalSaleKpiVo.saleTargetCompleteRate == 0) ? totalSaleKpiVo.saleTargetCompleteRate+'%'  : '-'}}</td>
            <!--市场-->
            <td>{{(totalSaleKpiVo.signUpLeadsNum || totalSaleKpiVo.signUpLeadsNum == 0) ? totalSaleKpiVo.signUpLeadsNum : '-'}}</td>
            <td>{{(totalSaleKpiVo.signUpLeadsDistributionNum || totalSaleKpiVo.signUpLeadsDistributionNum == 0) ? totalSaleKpiVo.signUpLeadsDistributionNum : '-'}}</td>
            <!--排课-->
            <td>{{(totalSaleKpiVo.arrangeCourseNum || totalSaleKpiVo.arrangeCourseNum == 0) ? totalSaleKpiVo.arrangeCourseNum : '-'}}</td>
            <!--销售-->
            <td>{{(totalSaleKpiVo.newLeadsDistributionNum || totalSaleKpiVo.newLeadsDistributionNum == 0) ? totalSaleKpiVo.newLeadsDistributionNum : '-'}}</td>
            <td>{{(totalSaleKpiVo.newPayLeadsNum || totalSaleKpiVo.newPayLeadsNum == 0) ? totalSaleKpiVo.newPayLeadsNum : '-'}}</td>
            <td>{{(totalSaleKpiVo.arrangeCourseRate || totalSaleKpiVo.arrangeCourseRate == 0) ? totalSaleKpiVo.arrangeCourseRate+'%'  : '-'}}</td>
            <td>{{(totalSaleKpiVo.arrangeCourseChangeRate || totalSaleKpiVo.arrangeCourseChangeRate == 0) ? totalSaleKpiVo.arrangeCourseChangeRate+'%'  : '-'}}</td>
            <td>{{(totalSaleKpiVo.newPayLeadsChangerRate || totalSaleKpiVo.newPayLeadsChangerRate == 0) ? totalSaleKpiVo.newPayLeadsChangerRate+'%'  : '-'}}</td>
            <td>{{(totalSaleKpiVo.newPayMoney || totalSaleKpiVo.newPayMoney == 0) ? totalSaleKpiVo.newPayMoney : '-'}}</td>
            <td>{{(totalSaleKpiVo.newPayMoneyRate || totalSaleKpiVo.newPayMoneyRate == 0) ? totalSaleKpiVo.newPayMoneyRate+'%'  : '-'}}</td>

            <!--续费-->
            <td>{{(totalSaleKpiVo.renewPayMoney || totalSaleKpiVo.renewPayMoney == 0) ? totalSaleKpiVo.renewPayMoney : '-'}}</td>
            <td>{{(totalSaleKpiVo.renewPayLeadsNum || totalSaleKpiVo.renewPayLeadsNum == 0) ? totalSaleKpiVo.renewPayLeadsNum : '-'}}</td>
            <td>{{(totalSaleKpiVo.readingStudentNum || totalSaleKpiVo.readingStudentNum == 0) ? totalSaleKpiVo.readingStudentNum : '-'}}</td>
            <td>{{(totalSaleKpiVo.renewPayRate || totalSaleKpiVo.renewPayRate == 0) ? totalSaleKpiVo.renewPayRate+'%'  : '-'}}</td>
            <td>{{(totalSaleKpiVo.renewPayMoneyRate || totalSaleKpiVo.renewPayMoneyRate == 0) ? totalSaleKpiVo.renewPayMoneyRate+'%'  : '-'}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table-wrap">
      <table class="report-form">
        <caption><h2>渠道等级A</h2></caption>
        <thead>
          <tr>
            <th width="60" class="bg-ca">总营收金额</th>
            <th width="60" class="bg-ca">新签金额</th>
            <th width="60" class="bg-ca">新签人数</th>
            <th width="60" class="bg-ca">平均单底</th>
            <th width="60" class="bg-ca">市场名单数</th>
            <th width="60" class="bg-ca">本月分配新名单数</th>
            <th width="60" class="bg-ca">排课数</th>
            <th width="60" class="bg-ca">排课率</th>
            <th width="60" class="bg-ca">排课转化率</th>
            <th width="60" class="bg-ca">转化率</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{(AtotalSaleKpi.realityMoney || AtotalSaleKpi.realityMoney == 0) ? AtotalSaleKpi.realityMoney : '-'}}</td>
            <td>{{(AtotalSaleKpi.sumRealityMoney || AtotalSaleKpi.sumRealityMoney == 0) ? AtotalSaleKpi.sumRealityMoney : '-'}}</td>
            <td>{{(AtotalSaleKpi.makeContractPeople || AtotalSaleKpi.makeContractPeople == 0) ? AtotalSaleKpi.makeContractPeople : '-'}}</td>
            <td>{{(AtotalSaleKpi.averageSingleBottom || AtotalSaleKpi.averageSingleBottom == 0) ? AtotalSaleKpi.averageSingleBottom : '-'}}</td>
            <td>{{(AtotalSaleKpi.signUpLeadsNum || AtotalSaleKpi.signUpLeadsNum == 0) ? AtotalSaleKpi.signUpLeadsNum : '-'}}</td>
            <td>{{(AtotalSaleKpi.newLeadsDistributionNum || AtotalSaleKpi.newLeadsDistributionNum == 0) ? AtotalSaleKpi.newLeadsDistributionNum : '-'}}</td>
            <td>{{(AtotalSaleKpi.arrangeCourseNum || AtotalSaleKpi.arrangeCourseNum == 0) ? AtotalSaleKpi.arrangeCourseNum : '-'}}</td>
            <td>{{(AtotalSaleKpi.arrangeCourseNumRate || AtotalSaleKpi.arrangeCourseNumRate == 0) ? AtotalSaleKpi.arrangeCourseNumRate+'%' : '-'}}</td>
            <td>{{(AtotalSaleKpi.arrangeCourseChangeRate || AtotalSaleKpi.arrangeCourseChangeRate == 0) ? AtotalSaleKpi.arrangeCourseChangeRate+'%' : '-'}}</td>
            <td>{{(AtotalSaleKpi.newPayLeadsChangerRate || AtotalSaleKpi.newPayLeadsChangerRate == 0) ? AtotalSaleKpi.newPayLeadsChangerRate+'%' : '-'}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table-wrap">
      <table class="report-form">
        <caption><h2>渠道等级B</h2></caption>
        <thead>
        <tr>
          <th width="60" class="bg-ca">总营收金额</th>
          <th width="60" class="bg-ca">新签金额</th>
          <th width="60" class="bg-ca">新签人数</th>
          <th width="60" class="bg-ca">平均单底</th>
          <th width="60" class="bg-ca">市场名单数</th>
          <th width="60" class="bg-ca">本月分配新名单数</th>
          <th width="60" class="bg-ca">排课数</th>
          <th width="60" class="bg-ca">排课率</th>
          <th width="60" class="bg-ca">排课转化率</th>
          <th width="60" class="bg-ca">转化率</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{{(BtotalSaleKpi.realityMoney || BtotalSaleKpi.realityMoney == 0) ? BtotalSaleKpi.realityMoney : '-'}}</td>
          <td>{{(BtotalSaleKpi.sumRealityMoney || BtotalSaleKpi.sumRealityMoney == 0) ? BtotalSaleKpi.sumRealityMoney : '-'}}</td>
          <td>{{(BtotalSaleKpi.makeContractPeople || BtotalSaleKpi.makeContractPeople == 0) ? BtotalSaleKpi.makeContractPeople : '-'}}</td>
          <td>{{(BtotalSaleKpi.averageSingleBottom || BtotalSaleKpi.averageSingleBottom == 0) ? BtotalSaleKpi.averageSingleBottom : '-'}}</td>
          <td>{{(BtotalSaleKpi.signUpLeadsNum || BtotalSaleKpi.signUpLeadsNum == 0) ? BtotalSaleKpi.signUpLeadsNum : '-'}}</td>
          <td>{{(BtotalSaleKpi.newLeadsDistributionNum || BtotalSaleKpi.newLeadsDistributionNum == 0) ? BtotalSaleKpi.newLeadsDistributionNum : '-'}}</td>
          <td>{{(BtotalSaleKpi.arrangeCourseNum || BtotalSaleKpi.arrangeCourseNum == 0) ? BtotalSaleKpi.arrangeCourseNum : '-'}}</td>
          <td>{{(BtotalSaleKpi.arrangeCourseNumRate || BtotalSaleKpi.arrangeCourseNumRate == 0) ? BtotalSaleKpi.arrangeCourseNumRate+'%' : '-'}}</td>
          <td>{{(BtotalSaleKpi.arrangeCourseChangeRate || BtotalSaleKpi.arrangeCourseChangeRate == 0) ? BtotalSaleKpi.arrangeCourseChangeRate+'%' : '-'}}</td>
          <td>{{(BtotalSaleKpi.newPayLeadsChangerRate || BtotalSaleKpi.newPayLeadsChangerRate == 0) ? BtotalSaleKpi.newPayLeadsChangerRate+'%' : '-'}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="table-wrap">
      <table class="report-form">
        <caption><h2>渠道等级C</h2></caption>
        <thead>
        <tr>
          <th width="60" class="bg-ca">总营收金额</th>
          <th width="60" class="bg-ca">新签金额</th>
          <th width="60" class="bg-ca">新签人数</th>
          <th width="60" class="bg-ca">平均单底</th>
          <th width="60" class="bg-ca">市场名单数</th>
          <th width="60" class="bg-ca">本月分配新名单数</th>
          <th width="60" class="bg-ca">排课数</th>
          <th width="60" class="bg-ca">排课率</th>
          <th width="60" class="bg-ca">排课转化率</th>
          <th width="60" class="bg-ca">转化率</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{{(CtotalSaleKpi.realityMoney || CtotalSaleKpi.realityMoney == 0) ? CtotalSaleKpi.realityMoney : '-'}}</td>
          <td>{{(CtotalSaleKpi.sumRealityMoney || CtotalSaleKpi.sumRealityMoney == 0) ? CtotalSaleKpi.sumRealityMoney : '-'}}</td>
          <td>{{(CtotalSaleKpi.makeContractPeople || CtotalSaleKpi.makeContractPeople == 0) ? CtotalSaleKpi.makeContractPeople : '-'}}</td>
          <td>{{(CtotalSaleKpi.averageSingleBottom || CtotalSaleKpi.averageSingleBottom == 0) ? CtotalSaleKpi.averageSingleBottom : '-'}}</td>
          <td>{{(CtotalSaleKpi.signUpLeadsNum || CtotalSaleKpi.signUpLeadsNum == 0) ? CtotalSaleKpi.signUpLeadsNum : '-'}}</td>
          <td>{{(CtotalSaleKpi.newLeadsDistributionNum || CtotalSaleKpi.newLeadsDistributionNum == 0) ? CtotalSaleKpi.newLeadsDistributionNum : '-'}}</td>
          <td>{{(CtotalSaleKpi.arrangeCourseNum || CtotalSaleKpi.arrangeCourseNum == 0) ? CtotalSaleKpi.arrangeCourseNum : '-'}}</td>
          <td>{{(CtotalSaleKpi.arrangeCourseNumRate || CtotalSaleKpi.arrangeCourseNumRate == 0) ? CtotalSaleKpi.arrangeCourseNumRate+'%' : '-'}}</td>
          <td>{{(CtotalSaleKpi.arrangeCourseChangeRate || CtotalSaleKpi.arrangeCourseChangeRate == 0) ? CtotalSaleKpi.arrangeCourseChangeRate+'%' : '-'}}</td>
          <td>{{(CtotalSaleKpi.newPayLeadsChangerRate || CtotalSaleKpi.newPayLeadsChangerRate == 0) ? CtotalSaleKpi.newPayLeadsChangerRate+'%' : '-'}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="table-wrap">
      <table class="report-form">
        <caption><h2>渠道等级E</h2></caption>
        <thead>
        <tr>
          <th width="60" class="bg-ca">总营收金额</th>
          <th width="60" class="bg-ca">新签金额</th>
          <th width="60" class="bg-ca">新签人数</th>
          <th width="60" class="bg-ca">平均单底</th>
          <th width="60" class="bg-ca">市场名单数</th>
          <th width="60" class="bg-ca">本月分配新名单数</th>
          <th width="60" class="bg-ca">排课数</th>
          <th width="60" class="bg-ca">排课率</th>
          <th width="60" class="bg-ca">排课转化率</th>
          <th width="60" class="bg-ca">转化率</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{{(EtotalSaleKpi.realityMoney || EtotalSaleKpi.realityMoney == 0) ? EtotalSaleKpi.realityMoney : '-'}}</td>
          <td>{{(EtotalSaleKpi.sumRealityMoney || EtotalSaleKpi.sumRealityMoney == 0) ? EtotalSaleKpi.sumRealityMoney : '-'}}</td>
          <td>{{(EtotalSaleKpi.makeContractPeople || EtotalSaleKpi.makeContractPeople == 0) ? EtotalSaleKpi.makeContractPeople : '-'}}</td>
          <td>{{(EtotalSaleKpi.averageSingleBottom || EtotalSaleKpi.averageSingleBottom == 0) ? EtotalSaleKpi.averageSingleBottom : '-'}}</td>
          <td>{{(EtotalSaleKpi.signUpLeadsNum || EtotalSaleKpi.signUpLeadsNum == 0) ? EtotalSaleKpi.signUpLeadsNum : '-'}}</td>
          <td>{{(EtotalSaleKpi.newLeadsDistributionNum || EtotalSaleKpi.newLeadsDistributionNum == 0) ? EtotalSaleKpi.newLeadsDistributionNum : '-'}}</td>
          <td>{{(EtotalSaleKpi.arrangeCourseNum || EtotalSaleKpi.arrangeCourseNum == 0) ? EtotalSaleKpi.arrangeCourseNum : '-'}}</td>
          <td>{{(EtotalSaleKpi.arrangeCourseNumRate || EtotalSaleKpi.arrangeCourseNumRate == 0) ? EtotalSaleKpi.arrangeCourseNumRate+'%' : '-'}}</td>
          <td>{{(EtotalSaleKpi.arrangeCourseChangeRate || EtotalSaleKpi.arrangeCourseChangeRate == 0) ? EtotalSaleKpi.arrangeCourseChangeRate+'%' : '-'}}</td>
          <td>{{(EtotalSaleKpi.newPayLeadsChangerRate || EtotalSaleKpi.newPayLeadsChangerRate == 0) ? EtotalSaleKpi.newPayLeadsChangerRate+'%' : '-'}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="table-wrap">
      <table class="report-form">
        <caption><h2>渠道等级G</h2></caption>
        <thead>
        <tr>
          <th width="60" class="bg-ca">总营收金额</th>
          <th width="60" class="bg-ca">新签金额</th>
          <th width="60" class="bg-ca">新签人数</th>
          <th width="60" class="bg-ca">平均单底</th>
          <th width="60" class="bg-ca">市场名单数</th>
          <th width="60" class="bg-ca">本月分配新名单数</th>
          <th width="60" class="bg-ca">排课数</th>
          <th width="60" class="bg-ca">排课率</th>
          <th width="60" class="bg-ca">排课转化率</th>
          <th width="60" class="bg-ca">转化率</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{{(GtotalSaleKpi.realityMoney || GtotalSaleKpi.realityMoney == 0) ? GtotalSaleKpi.realityMoney : '-'}}</td>
          <td>{{(GtotalSaleKpi.sumRealityMoney || GtotalSaleKpi.sumRealityMoney == 0) ? GtotalSaleKpi.sumRealityMoney : '-'}}</td>
          <td>{{(GtotalSaleKpi.makeContractPeople || GtotalSaleKpi.makeContractPeople == 0) ? GtotalSaleKpi.makeContractPeople : '-'}}</td>
          <td>{{(GtotalSaleKpi.averageSingleBottom || GtotalSaleKpi.averageSingleBottom == 0) ? GtotalSaleKpi.averageSingleBottom : '-'}}</td>
          <td>{{(GtotalSaleKpi.signUpLeadsNum || GtotalSaleKpi.signUpLeadsNum == 0) ? GtotalSaleKpi.signUpLeadsNum : '-'}}</td>
          <td>{{(GtotalSaleKpi.newLeadsDistributionNum || GtotalSaleKpi.newLeadsDistributionNum == 0) ? GtotalSaleKpi.newLeadsDistributionNum : '-'}}</td>
          <td>{{(GtotalSaleKpi.arrangeCourseNum || GtotalSaleKpi.arrangeCourseNum == 0) ? GtotalSaleKpi.arrangeCourseNum : '-'}}</td>
          <td>{{(GtotalSaleKpi.arrangeCourseNumRate || GtotalSaleKpi.arrangeCourseNumRate == 0) ? GtotalSaleKpi.arrangeCourseNumRate+'%' : '-'}}</td>
          <td>{{(GtotalSaleKpi.arrangeCourseChangeRate || GtotalSaleKpi.arrangeCourseChangeRate == 0) ? GtotalSaleKpi.arrangeCourseChangeRate+'%' : '-'}}</td>
          <td>{{(GtotalSaleKpi.newPayLeadsChangerRate || GtotalSaleKpi.newPayLeadsChangerRate == 0) ? GtotalSaleKpi.newPayLeadsChangerRate+'%' : '-'}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="table-wrap">
      <table class="report-form">
        <caption><h2>渠道等级K</h2></caption>
        <thead>
        <tr>
          <th width="60" class="bg-ca">总营收金额</th>
          <th width="60" class="bg-ca">新签金额</th>
          <th width="60" class="bg-ca">新签人数</th>
          <th width="60" class="bg-ca">平均单底</th>
          <th width="60" class="bg-ca">市场名单数</th>
          <th width="60" class="bg-ca">本月分配新名单数</th>
          <th width="60" class="bg-ca">排课数</th>
          <th width="60" class="bg-ca">排课率</th>
          <th width="60" class="bg-ca">排课转化率</th>
          <th width="60" class="bg-ca">转化率</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{{(KtotalSaleKpi.realityMoney || KtotalSaleKpi.realityMoney == 0) ? KtotalSaleKpi.realityMoney : '-'}}</td>
          <td>{{(KtotalSaleKpi.sumRealityMoney || KtotalSaleKpi.sumRealityMoney == 0) ? KtotalSaleKpi.sumRealityMoney : '-'}}</td>
          <td>{{(KtotalSaleKpi.makeContractPeople || KtotalSaleKpi.makeContractPeople == 0) ? KtotalSaleKpi.makeContractPeople : '-'}}</td>
          <td>{{(KtotalSaleKpi.averageSingleBottom || KtotalSaleKpi.averageSingleBottom == 0) ? KtotalSaleKpi.averageSingleBottom : '-'}}</td>
          <td>{{(KtotalSaleKpi.signUpLeadsNum || KtotalSaleKpi.signUpLeadsNum == 0) ? KtotalSaleKpi.signUpLeadsNum : '-'}}</td>
          <td>{{(KtotalSaleKpi.newLeadsDistributionNum || KtotalSaleKpi.newLeadsDistributionNum == 0) ? KtotalSaleKpi.newLeadsDistributionNum : '-'}}</td>
          <td>{{(KtotalSaleKpi.arrangeCourseNum || KtotalSaleKpi.arrangeCourseNum == 0) ? KtotalSaleKpi.arrangeCourseNum : '-'}}</td>
          <td>{{(KtotalSaleKpi.arrangeCourseNumRate || KtotalSaleKpi.arrangeCourseNumRate == 0) ? KtotalSaleKpi.arrangeCourseNumRate+'%' : '-'}}</td>
          <td>{{(KtotalSaleKpi.arrangeCourseChangeRate || KtotalSaleKpi.arrangeCourseChangeRate == 0) ? KtotalSaleKpi.arrangeCourseChangeRate+'%' : '-'}}</td>
          <td>{{(KtotalSaleKpi.newPayLeadsChangerRate || KtotalSaleKpi.newPayLeadsChangerRate == 0) ? KtotalSaleKpi.newPayLeadsChangerRate+'%' : '-'}}</td>
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
        continueKpiVo: {},
        newKpiVo: {},
        totalSaleKpiVo: {},
        AtotalSaleKpi: {},
        BtotalSaleKpi: {},
        CtotalSaleKpi: {},
        EtotalSaleKpi: {},
        GtotalSaleKpi: {},
        KtotalSaleKpi: {},
        saleList:[],
        type:'',
        dateType:'',
        monthDate:'',
        weekDate:'',
        timeDate:'',
        date:'',
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
        let userInductionType = this.type;
        let checkDateType = this.dateType;
        let checkDate = this.date;
        this.loadDataGrid(userInductionType, checkDateType, checkDate);
      },
      isSearchNull() {
        let userInductionTypes = this.type;
        let checkDateTypes = this.dateType;
        let checkDates = this.date;
          if( !userInductionTypes && !checkDateTypes && !checkDates){
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
        let userInductionTypes = this.type;
        let checkDateTypes = this.dateType;
        let checkDates = this.date;
        let apiUrl = REPORT().Sale.generateTotalKpiExcel;
        apiUrl += `?token=${localStorage.getItem('token')}&userInductionType=${userInductionTypes}&checkDateType=${checkDateTypes}&checkDate=${checkDates}`;
        GLOBAL.newTab(apiUrl,true);
      },
      changeSelectedCount(value){
        const _this = this;
        _this.type = value
      },
      loadDataGrid(userInductionType, checkDateType,checkDate) {
        const _this = this;
        common.ajax({
          url: REPORT().Sale.saleKpiTotal,
          data:{
            userInductionType: userInductionType,
            checkDateType: checkDateType,
            checkDate: checkDate,
          },
          method: 'get',
          success: function (res) {
            if(res.data){
              _this.totalSaleKpiVo = res.data.totalKpi;
              _this.AtotalSaleKpi = res.data.AtotalKpi;
              _this.BtotalSaleKpi = res.data.BtotalKpi;
              _this.CtotalSaleKpi = res.data.CtotalKpi;
              _this.EtotalSaleKpi = res.data.EtotalKpi;
              _this.GtotalSaleKpi = res.data.GtotalKpi;
              _this.KtotalSaleKpi = res.data.KtotalKpi;
            }
          }
        });
      },
      changeDate(value) {
        this.daterage = value;
      },
      checkDateType(){
        const _this = this;
        if(this.dateType == 0){
          common.ajax({
            url: REPORT().Sale.getArtificialMonth,
            method: 'get',
            success: function (res) {
              if(res.data){
                _this.timeDate = res.data;
              }
            }
          });
        }else if(this.dateType == 1){
          common.ajax({
            url: REPORT().Sale.getArtificialWeek,
            method: 'get',
            success: function (res) {
              if(res.data){
                _this.timeDate = res.data;
              }
            }
          });
        }
      },
      checkDate(){

      }
    },
    filters: {
      convertNumber(value) {
        if(value) {
          return Number(value).toFixed(2);
        }else{
          return '-';
        }
      }
    }
  };
</script>
