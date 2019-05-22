<template>
  <div class="plan-course">
    <o-breadcrumb second="数据报表" third="排课KPI"></o-breadcrumb>
    <Tabs size="small" :animated="false" :active-key="showKey">
      <Tab-pane label="总KPI" icon="grid" key="personal">
        <total ref='total'></total>
      </Tab-pane>
      <Tab-pane label="个人KPI" icon="person" key="message">
        <personal ref='personal'></personal>
      </Tab-pane>
    </Tabs>
  </div>
</template>

<script type="text/ecmascript-6">
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import total from 'components/report/planCourse/total';
  import personal from 'components/report/planCourse/personal';
  export default{
    data() {
      return {
        showKey: this.$route.params.name
      }
    },
    mounted() {
      console.log(this.$route.params.name);
    },
    methods: {},
    components: {OBreadcrumb, total, personal}
  };
</script>

<style>
  .plan-course table.border {
    margin: 0 0 10px 0;
    width: 100%;
  }
  .plan-course table caption { text-align: left}
  .plan-course table caption h2 {
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
  }
</style>
