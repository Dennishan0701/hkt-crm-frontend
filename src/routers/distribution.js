/**
 * 分配管理
 * Created by ShenBo on 2018/5/9
 */

import router from 'components/router';
import leads from 'components/distribution/newLeads/newLeads';
import giveupLeads from 'components/distribution/giveupLeads/giveupLeads';
import formalStudent from 'components/distribution/formalStudent/formalStudent.vue';
import againFormalStudent from 'components/distribution/formalStudent/againFormalStudent.vue';
import teamFormalStudent from 'components/distribution/formalStudent/teamStudent.vue';
import distributeRecord from 'components/distribution/distributeRecord/distributeRecord.vue';
import distributeStudyRecord from 'components/distribution/distributeRecord/distributeStudyRecord.vue';
import quitLeads from 'components/distribution/quit/leads.vue';
import quitFormalStudent from 'components/distribution/quit/formalStudent.vue';
import recoverDistribution  from 'components/distribution/recover/recover .vue';
import repeatLeads  from 'components/distribution/repeatLeads/repeatLeads.vue';
import tmkDistribution  from 'components/distribution/tmkDistribution/tmkDistribution.vue';
import intentionListDistribution  from 'components/distribution/tmkDistribution/intentionListDistribution.vue';
import debugListDistribution  from 'components/distribution/tmkDistribution/debugListDistribution.vue';
import classEndingDistribution  from 'components/distribution/tmkDistribution/classEndingDistribution.vue';
export default{
  path:'/distribute',
  component:router,
  children :[
    {
      path:'leads',//新名单分配
      name:'leads',
      component: leads
    },
    {
      path:'giveupLeads',//藏经阁分配
      name:'giveupLeads',
      component: giveupLeads
    },
    {
      path:'formalStudent',//新正式生分配
      name:'formalStudent',
      component: formalStudent
    },
    {
      path:'againFormalStudent',//正式生再分配
      name:'againFormalStudent',
      component: againFormalStudent
    },
    {
      path:'teamFormalStudent',//本团队新正式生分配
      name:'teamFormalStudent',
      component: teamFormalStudent
    },
    {
      path:'distributeRecord',//分配Leads记录
      name:'distributeRecord',
      component: distributeRecord
    },
    {
      path:'distributeStudyRecord',//分配正式生记录
      name:'distributeStudyRecord',
      component: distributeStudyRecord
    },
    {
      path:'quitLeads',//离职人员leads分配
      name:'quitLeads',
      component: quitLeads
    },
    {
      path:'quitFormalStudent',//离职人员正式生分配
      name:'quitFormalStudent',
      component: quitFormalStudent
    },
    {
      path:'recoverDistribution',//回收站分配
      name:'recoverDistribution',
      component: recoverDistribution
    },
    {
      path:'repeatLeads',//重复报名leads分配
      name:'repeatLeads',
      component: repeatLeads
    },
    {
      path:'tmkDistribution',//TMK名单分配
      name:'tmkDistribution',
      component: tmkDistribution
    },
    {
      path:'intentionListDistribution',//意向名单分配
      name:'intentionListDistribution',
      component: intentionListDistribution
    },
    {
      path:'debugListDistribution',//调试课名单分配
      name:'debugListDistribution',
      component: debugListDistribution
    },
    {
      path:'classEndingDistribution',//结课名单分配
      name:'classEndingDistribution',
      component: classEndingDistribution
    },
  ]
};
