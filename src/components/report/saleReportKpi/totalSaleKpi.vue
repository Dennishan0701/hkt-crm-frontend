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
</style>
<template>
  <div class="total-sale-kpi">
    <div class="searchForm">
      <Row>
        <i-col span=24 class="right">
          <i-select :size="$store.state.searchModuleSize" v-model="type" @on-change="changeSelectedCount" placeholder="入职情况" style="width:150px">
            <i-option v-for="(item,index) in saleList" :key='index' :value="item.value">{{ item.name }}</i-option>
          </i-select>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" :value="daterage" @on-change="changeDate" placement="bottom-end" placeholder="选择日期" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="search" @click="search">搜索</i-button>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-download-outline" @click="exportExcel">导出</i-button>

        </i-col>
      </Row>
    </div>
    <div class="content">
      <table class="report-form">
        <caption><h2>总计</h2></caption>
        <thead>
          <tr class="bg-total">
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
            <td>{{(totalSaleKpiVo.sumRealityMonery || totalSaleKpiVo.sumRealityMonery == 0) ? totalSaleKpiVo.sumRealityMonery : '-'}}</td>
            <!--<td>{{(totalSaleKpiVo.realityMonery || totalSaleKpiVo.realityMonery == 0) ? totalSaleKpiVo.realityMonery : '-'}}</td>-->
            <td>{{(totalSaleKpiVo.realityMonery || totalSaleKpiVo.realityMonery == 0) ? totalSaleKpiVo.realityMonery : '-'}}</td>
            <td>{{(totalSaleKpiVo.makeContractPeople || totalSaleKpiVo.makeContractPeople == 0) ? totalSaleKpiVo.makeContractPeople : '-'}}</td>
            <!--<td>{{(totalSaleKpiVo.havePayMakeContractPeople || totalSaleKpiVo.havePayMakeContractPeople == 0) ? totalSaleKpiVo.havePayMakeContractPeople : '-'}}</td>-->
            <td>{{(totalSaleKpiVo.averageSingleBottom || totalSaleKpiVo.averageSingleBottom == 0) ? totalSaleKpiVo.averageSingleBottom : '-'}}</td>
            <td>{{(totalSaleKpiVo.leadsLists || totalSaleKpiVo.leadsLists == 0) ? totalSaleKpiVo.leadsLists : '-'}}</td>
            <td>{{(totalSaleKpiVo.arrangeCourseNumber || totalSaleKpiVo.arrangeCourseNumber == 0) ? totalSaleKpiVo.arrangeCourseNumber : '-'}}</td>
            <td>{{(totalSaleKpiVo.arrangeCourseRate || totalSaleKpiVo.arrangeCourseRate == 0) ? totalSaleKpiVo.arrangeCourseRate+'%' : '-'}}</td>
            <td>{{(totalSaleKpiVo.arrangeCourseChangeRate || totalSaleKpiVo.arrangeCourseChangeRate == 0) ? totalSaleKpiVo.arrangeCourseChangeRate+'%' : '-'}}</td>
            <td>{{(totalSaleKpiVo.totalChangeRate || totalSaleKpiVo.totalChangeRate == 0) ? totalSaleKpiVo.totalChangeRate+'%' : '-'}}</td>
          </tr>
        </tbody>
      </table>
      <table class="report-form">
        <caption><h2>新签方面</h2></caption>
        <thead>
          <tr class="bg-total">
            <th class="bg-new">总营收金额　</th>
            <th class="bg-new">实收金额</th>
            <th class="bg-new">签约人数</th>
            <th class="bg-new">平均单底</th>
            <th class="bg-new">名单数</th>
            <th class="bg-new">排课数</th>
            <th class="bg-new">排课率</th>
            <th class="bg-new">排课转化率</th>
            <th class="bg-new">转化率</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{(newKpiVo.sumRealityMonery || newKpiVo.sumRealityMonery == 0) ? newKpiVo.sumRealityMonery : '-'}}</td>
            <td>{{(newKpiVo.realityMonery || newKpiVo.realityMonery == 0) ? newKpiVo.realityMonery : '-'}}</td>
            <td>{{(newKpiVo.makeContractPeople || newKpiVo.makeContractPeople == 0) ? newKpiVo.makeContractPeople : '-'}}</td>
            <td>{{(newKpiVo.averageSingleBottom || newKpiVo.averageSingleBottom == 0) ? newKpiVo.averageSingleBottom : '-'}}</td>
            <td>{{(newKpiVo.leadsLists || newKpiVo.leadsLists == 0) ? newKpiVo.leadsLists : '-'}}</td>
            <td>{{(newKpiVo.arrangeCourseNumber || newKpiVo.arrangeCourseNumber == 0) ? newKpiVo.arrangeCourseNumber : '-'}}</td>
            <td>{{(newKpiVo.arrangeCourseRate || newKpiVo.arrangeCourseRate == 0) ? newKpiVo.arrangeCourseRate+'%' : '-'}}</td>
            <td>{{(newKpiVo.arrangeCourseChangeRate || newKpiVo.arrangeCourseChangeRate == 0) ? newKpiVo.arrangeCourseChangeRate+'%' : '-'}}</td>
            <td>{{(newKpiVo.totalChangeRate || newKpiVo.totalChangeRate == 0) ? newKpiVo.totalChangeRate+'%' : '-'}}</td>
          </tr>
        </tbody>
      </table>
      <table class="report-form">
        <caption><h2>续费方面</h2></caption>
        <thead>
          <tr class="bg-total">
            <th class="bg-new">总营收金额　</th>
            <th class="bg-xu">实收金额</th>
            <th class="bg-new">签约人数</th>
            <th class="bg-xu">平均单底</th>
            <th class="bg-xu">名单数</th>
            <th class="bg-xu">排课数</th>
            <th class="bg-xu">排课率</th>
            <th class="bg-xu">排课转化率</th>
            <th class="bg-xu">转化率</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{(continueKpiVo.sumRealityMonery || continueKpiVo.sumRealityMonery == 0) ? continueKpiVo.sumRealityMonery : '-'}}</td>
            <td>{{(continueKpiVo.realityMonery || continueKpiVo.realityMonery == 0) ? continueKpiVo.realityMonery : '-'}}</td>
            <td>{{(continueKpiVo.makeContractPeople || continueKpiVo.makeContractPeople == 0) ? continueKpiVo.makeContractPeople : '-'}}</td>
            <td>{{(continueKpiVo.averageSingleBottom || continueKpiVo.averageSingleBottom == 0) ? continueKpiVo.averageSingleBottom : '-'}}</td>
            <td>{{(continueKpiVo.leadsLists || continueKpiVo.leadsLists == 0) ? continueKpiVo.leadsLists : '-'}}</td>
            <td>{{(continueKpiVo.arrangeCourseNumber || continueKpiVo.arrangeCourseNumber == 0) ? continueKpiVo.arrangeCourseNumber : '-'}}</td>
            <td>{{(continueKpiVo.arrangeCourseRate || continueKpiVo.arrangeCourseRate == 0) ? continueKpiVo.arrangeCourseRate+'%' : '-'}}</td>
            <td>{{(continueKpiVo.arrangeCourseChangeRate || continueKpiVo.arrangeCourseChangeRate == 0) ? continueKpiVo.arrangeCourseChangeRate+'%' : '-'}}</td>
            <td>{{(continueKpiVo.totalChangeRate || continueKpiVo.totalChangeRate == 0) ? continueKpiVo.totalChangeRate+'%' : '-'}}</td>
          </tr>
        </tbody>
      </table>
      <table class="report-form">
        <caption><h2>渠道等级A</h2></caption>
        <thead>
          <tr>
            <th width="60" class="bg-ca">总营收金额</th>
            <th width="60" class="bg-ca">实收金额</th>
            <th width="60" class="bg-ca">签约人数</th>
            <th width="60" class="bg-ca">平均单底</th>
            <th width="60" class="bg-ca">名单数</th>
            <th width="60" class="bg-ca">排课数</th>
            <th width="60" class="bg-ca">排课率</th>
            <th width="70" class="bg-ca">排课转化率</th>
            <th width="60" class="bg-ca">转化率</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{(totalSaleKpiVo.asumRealityMonery || totalSaleKpiVo.asumRealityMonery == 0) ? totalSaleKpiVo.asumRealityMonery : '-'}}</td>
            <td>{{(totalSaleKpiVo.arealityMonery || totalSaleKpiVo.arealityMonery == 0) ? totalSaleKpiVo.arealityMonery : '-'}}</td>
            <td>{{(totalSaleKpiVo.amakeContractPeople || totalSaleKpiVo.amakeContractPeople == 0) ? totalSaleKpiVo.amakeContractPeople : '-'}}</td>
            <td>{{(totalSaleKpiVo.aaverageSingleBottom || totalSaleKpiVo.aaverageSingleBottom == 0) ? totalSaleKpiVo.aaverageSingleBottom : '-'}}</td>
            <td>{{(totalSaleKpiVo.aleadsLists || totalSaleKpiVo.aleadsLists == 0) ? totalSaleKpiVo.aleadsLists : '-'}}</td>
            <td>{{(totalSaleKpiVo.aarrangeCourseNumber || totalSaleKpiVo.aarrangeCourseNumber == 0) ? totalSaleKpiVo.aarrangeCourseNumber : '-'}}</td>
            <td>{{(totalSaleKpiVo.aarrangeCourseRate || totalSaleKpiVo.aarrangeCourseRate == 0) ? totalSaleKpiVo.aarrangeCourseRate+'%' : '-'}}</td>
            <td>{{(totalSaleKpiVo.aarrangeCourseChangeRate || totalSaleKpiVo.aarrangeCourseChangeRate == 0) ? totalSaleKpiVo.aarrangeCourseChangeRate+'%' : '-'}}</td>
            <td>{{(totalSaleKpiVo.atotalChangeRate || totalSaleKpiVo.atotalChangeRate == 0) ? totalSaleKpiVo.atotalChangeRate+'%' : '-'}}</td>
          </tr>
        </tbody>
      </table>
      <table class="report-form">
        <caption><h2>渠道等级B</h2></caption>
        <thead>
        <tr>
          <th width="60" class="bg-ca">总营收金额</th>
          <th width="60" class="bg-ca">实收金额</th>
          <th width="60" class="bg-ca">签约人数</th>
          <th width="60" class="bg-ca">平均单底</th>
          <th width="60" class="bg-ca">名单数</th>
          <th width="60" class="bg-ca">排课数</th>
          <th width="60" class="bg-ca">排课率</th>
          <th width="70" class="bg-ca">排课转化率</th>
          <th width="60" class="bg-ca">转化率</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{{(totalSaleKpiVo.b_sumRealityMonery || totalSaleKpiVo.b_sumRealityMonery == 0) ? totalSaleKpiVo.b_sumRealityMonery : '-'}}</td>
          <td>{{(totalSaleKpiVo.b_realityMonery || totalSaleKpiVo.b_realityMonery == 0) ? totalSaleKpiVo.b_realityMonery : '-'}}</td>
          <td>{{(totalSaleKpiVo.b_makeContractPeople || totalSaleKpiVo.b_makeContractPeople == 0) ? totalSaleKpiVo.b_makeContractPeople : '-'}}</td>
          <td>{{(totalSaleKpiVo.b_averageSingleBottom || totalSaleKpiVo.b_averageSingleBottom == 0) ? totalSaleKpiVo.b_averageSingleBottom : '-'}}</td>
          <td>{{(totalSaleKpiVo.b_leadsLists || totalSaleKpiVo.b_leadsLists == 0) ? totalSaleKpiVo.b_leadsLists : '-'}}</td>
          <td>{{(totalSaleKpiVo.b_arrangeCourseNumber || totalSaleKpiVo.b_arrangeCourseNumber == 0) ? totalSaleKpiVo.b_arrangeCourseNumber : '-'}}</td>
          <td>{{(totalSaleKpiVo.b_arrangeCourseRate || totalSaleKpiVo.b_arrangeCourseRate == 0) ? totalSaleKpiVo.b_arrangeCourseRate+'%' : '-'}}</td>
          <td>{{(totalSaleKpiVo.b_arrangeCourseChangeRate || totalSaleKpiVo.b_arrangeCourseChangeRate == 0) ? totalSaleKpiVo.b_arrangeCourseChangeRate+'%' : '-'}}</td>
          <td>{{(totalSaleKpiVo.b_totalChangeRate || totalSaleKpiVo.b_totalChangeRate == 0) ? totalSaleKpiVo.b_totalChangeRate+'%' : '-'}}</td>
        </tr>
        </tbody>
      </table>
      <table class="report-form">
        <caption><h2>渠道等级C</h2></caption>
        <thead>
        <tr>
          <th width="60" class="bg-ca">总营收金额</th>
          <th width="60" class="bg-ca">实收金额</th>
          <th width="60" class="bg-ca">签约人数</th>
          <th width="60" class="bg-ca">平均单底</th>
          <th width="60" class="bg-ca">名单数</th>
          <th width="60" class="bg-ca">排课数</th>
          <th width="60" class="bg-ca">排课率</th>
          <th width="70" class="bg-ca">排课转化率</th>
          <th width="60" class="bg-ca">转化率</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{{(totalSaleKpiVo.c_sumRealityMonery || totalSaleKpiVo.c_sumRealityMonery == 0) ? totalSaleKpiVo.c_sumRealityMonery : '-'}}</td>
          <td>{{(totalSaleKpiVo.c_realityMonery || totalSaleKpiVo.c_realityMonery == 0) ? totalSaleKpiVo.c_realityMonery : '-'}}</td>
          <td>{{(totalSaleKpiVo.c_makeContractPeople || totalSaleKpiVo.c_makeContractPeople == 0) ? totalSaleKpiVo.c_makeContractPeople : '-'}}</td>
          <td>{{(totalSaleKpiVo.c_averageSingleBottom || totalSaleKpiVo.c_averageSingleBottom == 0) ? totalSaleKpiVo.c_averageSingleBottom : '-'}}</td>
          <td>{{(totalSaleKpiVo.c_leadsLists || totalSaleKpiVo.c_leadsLists == 0) ? totalSaleKpiVo.c_leadsLists : '-'}}</td>
          <td>{{(totalSaleKpiVo.c_arrangeCourseNumber || totalSaleKpiVo.c_arrangeCourseNumber == 0) ? totalSaleKpiVo.c_arrangeCourseNumber : '-'}}</td>
          <td>{{(totalSaleKpiVo.c_arrangeCourseRate || totalSaleKpiVo.c_arrangeCourseRate == 0) ? totalSaleKpiVo.c_arrangeCourseRate+'%' : '-'}}</td>
          <td>{{(totalSaleKpiVo.c_arrangeCourseChangeRate || totalSaleKpiVo.c_arrangeCourseChangeRate == 0) ? totalSaleKpiVo.c_arrangeCourseChangeRate+'%' : '-'}}</td>
          <td>{{(totalSaleKpiVo.c_totalChangeRate || totalSaleKpiVo.c_totalChangeRate == 0) ? totalSaleKpiVo.c_totalChangeRate+'%' : '-'}}</td>
        </tr>
        </tbody>
      </table>
      <table class="report-form">
        <caption><h2>渠道等级E</h2></caption>
        <thead>
        <tr>
          <th width="60" class="bg-ca">总营收金额</th>
          <th width="60" class="bg-ca">实收金额</th>
          <th width="60" class="bg-ca">签约人(单)数</th>
          <th width="60" class="bg-ca">平均单底</th>
          <th width="60" class="bg-ca">名单数</th>
          <th width="60" class="bg-ca">排课数</th>
          <th width="60" class="bg-ca">排课率</th>
          <th width="70" class="bg-ca">排课转化率</th>
          <th width="60" class="bg-ca">转化率</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{{(totalSaleKpiVo.e_sumRealityMonery || totalSaleKpiVo.e_sumRealityMonery == 0) ? totalSaleKpiVo.e_sumRealityMonery : '-'}}</td>
          <td>{{(totalSaleKpiVo.e_realityMonery || totalSaleKpiVo.e_realityMonery == 0) ? totalSaleKpiVo.e_realityMonery : '-'}}</td>
          <td>{{(totalSaleKpiVo.e_makeContractPeople || totalSaleKpiVo.e_makeContractPeople == 0) ? totalSaleKpiVo.e_makeContractPeople : '-'}}</td>
          <td>{{(totalSaleKpiVo.e_averageSingleBottom || totalSaleKpiVo.e_averageSingleBottom == 0) ? totalSaleKpiVo.e_averageSingleBottom : '-'}}</td>
          <td>{{(totalSaleKpiVo.e_leadsLists || totalSaleKpiVo.e_leadsLists == 0) ? totalSaleKpiVo.e_leadsLists : '-'}}</td>
          <td>{{(totalSaleKpiVo.e_arrangeCourseNumber || totalSaleKpiVo.e_arrangeCourseNumber == 0) ? totalSaleKpiVo.e_arrangeCourseNumber : '-'}}</td>
          <td>{{(totalSaleKpiVo.e_arrangeCourseRate || totalSaleKpiVo.e_arrangeCourseRate == 0) ? totalSaleKpiVo.e_arrangeCourseRate+'%' : '-'}}</td>
          <td>{{(totalSaleKpiVo.e_arrangeCourseChangeRate || totalSaleKpiVo.e_arrangeCourseChangeRate == 0) ? totalSaleKpiVo.e_arrangeCourseChangeRate+'%' : '-'}}</td>
          <td>{{(totalSaleKpiVo.e_totalChangeRate || totalSaleKpiVo.e_totalChangeRate == 0) ? totalSaleKpiVo.e_totalChangeRate+'%' : '-'}}</td>
        </tr>
        </tbody>
      </table>
      <table class="report-form">
        <caption><h2>渠道等级G</h2></caption>
        <thead>
        <tr>
          <th width="60" class="bg-ca">总营收金额</th>
          <th width="60" class="bg-ca">实收金额</th>
          <th width="60" class="bg-ca">签约人数</th>
          <th width="60" class="bg-ca">平均单底</th>
          <th width="60" class="bg-ca">名单数</th>
          <th width="60" class="bg-ca">排课数</th>
          <th width="60" class="bg-ca">排课率</th>
          <th width="70" class="bg-ca">排课转化率</th>
          <th width="60" class="bg-ca">转化率</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{{(totalSaleKpiVo.g_sumRealityMonery || totalSaleKpiVo.g_sumRealityMonery == 0) ? totalSaleKpiVo.g_sumRealityMonery : '-'}}</td>
          <td>{{(totalSaleKpiVo.g_realityMonery || totalSaleKpiVo.g_realityMonery == 0) ? totalSaleKpiVo.g_realityMonery : '-'}}</td>
          <td>{{(totalSaleKpiVo.g_mgakeContractPeople || totalSaleKpiVo.g_makeContractPeople == 0) ? totalSaleKpiVo.g_makeContractPeople : '-'}}</td>
          <td>{{(totalSaleKpiVo.g_averageSingleBottom || totalSaleKpiVo.g_averageSingleBottom == 0) ? totalSaleKpiVo.g_averageSingleBottom : '-'}}</td>
          <td>{{(totalSaleKpiVo.g_leadsLists || totalSaleKpiVo.g_leadsLists == 0) ? totalSaleKpiVo.g_leadsLists : '-'}}</td>
          <td>{{(totalSaleKpiVo.g_arrangeCourseNumber || totalSaleKpiVo.g_arrangeCourseNumber == 0) ? totalSaleKpiVo.g_arrangeCourseNumber : '-'}}</td>
          <td>{{(totalSaleKpiVo.g_arrangeCourseRate || totalSaleKpiVo.g_arrangeCourseRate == 0) ? totalSaleKpiVo.g_arrangeCourseRate+'%' : '-'}}</td>
          <td>{{(totalSaleKpiVo.g_arrangeCourseChangeRate || totalSaleKpiVo.g_arrangeCourseChangeRate == 0) ? totalSaleKpiVo.g_arrangeCourseChangeRate+'%' : '-'}}</td>
          <td>{{(totalSaleKpiVo.g_totalChangeRate || totalSaleKpiVo.g_totalChangeRate == 0) ? totalSaleKpiVo.g_totalChangeRate+'%' : '-'}}</td>
        </tr>
        </tbody>
      </table>
      <!--K-->
      <table class="report-form">
        <caption><h2>渠道等级K</h2></caption>
        <thead>
        <tr>
          <th width="60" class="bg-ca">总营收金额</th>
          <th width="60" class="bg-ca">实收金额</th>
          <th width="60" class="bg-ca">签约人数</th>
          <th width="60" class="bg-ca">平均单底</th>
          <th width="60" class="bg-ca">名单数</th>
          <th width="60" class="bg-ca">排课数</th>
          <th width="60" class="bg-ca">排课率</th>
          <th width="70" class="bg-ca">排课转化率</th>
          <th width="60" class="bg-ca">转化率</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{{(totalSaleKpiVo.krealityMonery || totalSaleKpiVo.krealityMonery == 0) ? totalSaleKpiVo.krealityMonery : '-'}}</td>
          <td>{{(totalSaleKpiVo.ksumRealityMonery || totalSaleKpiVo.ksumRealityMonery == 0) ? totalSaleKpiVo.ksumRealityMonery : '-'}}</td>
          <td>{{(totalSaleKpiVo.kmakeContractPeople || totalSaleKpiVo.kmakeContractPeople == 0) ? totalSaleKpiVo.kmakeContractPeople : '-'}}</td>
          <td>{{(totalSaleKpiVo.kaverageSingleBottom || totalSaleKpiVo.kaverageSingleBottom == 0) ? totalSaleKpiVo.kaverageSingleBottom : '-'}}</td>
          <td>{{(totalSaleKpiVo.kleadsLists || totalSaleKpiVo.kleadsLists == 0) ? totalSaleKpiVo.kleadsLists : '-'}}</td>
          <td>{{(totalSaleKpiVo.karrangeCourseNumber || totalSaleKpiVo.karrangeCourseNumber == 0) ? totalSaleKpiVo.karrangeCourseNumber : '-'}}</td>
          <td>{{(totalSaleKpiVo.karrangeCourseRate || totalSaleKpiVo.karrangeCourseRate == 0) ? totalSaleKpiVo.karrangeCourseRate+'%' : '-'}}</td>
          <td>{{(totalSaleKpiVo.karrangeCourseChangeRate || totalSaleKpiVo.karrangeCourseChangeRate == 0) ? totalSaleKpiVo.karrangeCourseChangeRate+'%' : '-'}}</td>
          <td>{{(totalSaleKpiVo.ktotalChangeRate || totalSaleKpiVo.ktotalChangeRate == 0) ? totalSaleKpiVo.ktotalChangeRate+'%' : '-'}}</td>
        </tr>
        </tbody>
      </table>
      <!--Q-->
      <table class="report-form">
        <caption><h2>渠道等级Q</h2></caption>
        <thead>
        <tr>
          <th width="60" class="bg-ca">总营收金额</th>
          <th width="60" class="bg-ca">实收金额</th>
          <th width="60" class="bg-ca">签约人数</th>
          <th width="60" class="bg-ca">平均单底</th>
          <th width="60" class="bg-ca">名单数</th>
          <th width="60" class="bg-ca">排课数</th>
          <th width="60" class="bg-ca">排课率</th>
          <th width="70" class="bg-ca">排课转化率</th>
          <th width="60" class="bg-ca">转化率</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{{(totalSaleKpiVo.qrealityMonery || totalSaleKpiVo.qrealityMonery == 0) ? totalSaleKpiVo.qrealityMonery : '-'}}</td>
          <td>{{(totalSaleKpiVo.qsumRealityMonery || totalSaleKpiVo.qsumRealityMonery == 0) ? totalSaleKpiVo.qsumRealityMonery : '-'}}</td>
          <td>{{(totalSaleKpiVo.qmakeContractPeople || totalSaleKpiVo.qmakeContractPeople == 0) ? totalSaleKpiVo.qmakeContractPeople : '-'}}</td>
          <td>{{(totalSaleKpiVo.qaverageSingleBottom || totalSaleKpiVo.qaverageSingleBottom == 0) ? totalSaleKpiVo.qaverageSingleBottom : '-'}}</td>
          <td>{{(totalSaleKpiVo.qleadsLists || totalSaleKpiVo.qleadsLists == 0) ? totalSaleKpiVo.qleadsLists : '-'}}</td>
          <td>{{(totalSaleKpiVo.qarrangeCourseNumber || totalSaleKpiVo.qarrangeCourseNumber == 0) ? totalSaleKpiVo.qarrangeCourseNumber : '-'}}</td>
          <td>{{(totalSaleKpiVo.qarrangeCourseRate || totalSaleKpiVo.qarrangeCourseRate == 0) ? totalSaleKpiVo.qarrangeCourseRate+'%' : '-'}}</td>
          <td>{{(totalSaleKpiVo.qarrangeCourseChangeRate || totalSaleKpiVo.qarrangeCourseChangeRate == 0) ? totalSaleKpiVo.qarrangeCourseChangeRate+'%' : '-'}}</td>
          <td>{{(totalSaleKpiVo.qtotalChangeRate || totalSaleKpiVo.qtotalChangeRate == 0) ? totalSaleKpiVo.qtotalChangeRate+'%' : '-'}}</td>
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
          let apiUrl = REPORT().Sale.generateTotalKpiExcelol;
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
          url: REPORT().Sale.saleKpiTotalol + param,
          method: 'get',
          success: function (res) {
            let data = res.data;
            if(data){
              _this.totalSaleKpiVo = data.totalSaleKpiVo;
              _this.newKpiVo = data.newKpiVo;
              _this.continueKpiVo = data.continueKpiVo;
            }
          }
        });
      },
      changeDate(value) {
        this.daterage = value;
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
