/**
 * 数据分析
 * Created by ShenBo on 2018/5/9
 */

import router from 'components/router';
import payLeads from 'components/dataAnalysis/payLeads';
import signUpLeads from 'components/dataAnalysis/signUpLeads';
import salesTeamData from 'components/dataAnalysis/salesTeamData';
export default{
  path:'/dataAnalysis',
  component:router,
  children :[
    {
      path:'payLeads',//付费数据分析
      name:'payLeads',
      component: payLeads
    },
    {
      path:'signUpLeads',//报名数据分析
      name:'signUpLeads',
      component: signUpLeads
    },
    {
      path:'salesTeamData',//销售团队监控
      name:'salesTeamData',
      component: salesTeamData
    },
  ]
};
