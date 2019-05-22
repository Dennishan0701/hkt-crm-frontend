<template>
  <div class="sale-kpi">
    <o-breadcrumb second="数据报表" third="销售报表KPI"></o-breadcrumb>
    <Tabs size="small" :animated="false">
      <Tab-pane label="总KPI" icon="grid">
        <total-sale-kpi></total-sale-kpi>
      </Tab-pane>
      <Tab-pane label="团队KPI" icon="ios-people">
        <team-sale-kpi></team-sale-kpi>
      </Tab-pane>
      <Tab-pane label="CC_KPI" icon="person">
        <cc-sale-kpi></cc-sale-kpi>
      </Tab-pane>
      <Tab-pane label="CR_KPI" icon="person">
        <cr-sale-kpi></cr-sale-kpi>
      </Tab-pane>
    </Tabs>
  </div>
</template>

<script type="text/ecmascript-6">
  import {REPORT} from 'common/api/report.js';
  import {common} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import teamSaleKpi from 'components/report/saleReportKpi/teamSaleKpi';
  import totalSaleKpi from 'components/report/saleReportKpi/totalSaleKpi';
  import ccSaleKpi from 'components/report/saleReportKpi/ccSaleKpi';
  import crSaleKpi from 'components/report/saleReportKpi/crSaleKpi';

  export default{
    components: {OBreadcrumb, teamSaleKpi, totalSaleKpi, ccSaleKpi,crSaleKpi}
  };
</script>

<style>
.sale-kpi .ivu-tabs-bar { margin-bottom: 2px !important; }
.ivu-tabs-tabpane .content { min-height:300px; overflow: auto;}
.searchForm { margin-bottom: 2px;}
.report-form { border-collapse: collapse; box-sizing: border-box; min-width:1826px;}
.report-form td,
.report-form th {border: 1px solid #ccc;text-align:left;box-sizing: border-box;padding: 2px;min-width: 90px;}
.report-form tr:nth-child(even) {background-color: #f5f7f9;}
.report-form tr:hover {background-color: #ebf7ff;}
.report-form tbody td { text-overflow: ellipsis; }
.content{overflow-y: hidden;}
td .td-data-list { overflow-y: auto; }
td .td-data-list::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: #F5F5F5;
}
td .td-data-list::-webkit-scrollbar{
  width: 0;
  background-color: #F5F5F5;
}
td .td-data-list::-webkit-scrollbar-thumb{
  background-color: #555;
}
.td-data-list table {width: 100%;border-collapse: collapse;}
</style>
