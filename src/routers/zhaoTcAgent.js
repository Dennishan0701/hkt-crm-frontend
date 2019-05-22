/**
 * 招师代理
 * Created by ShenBo on 2018/5/9.
 */
import router from 'components/router';
import levelSalary from 'components/tcAgent/levelSalary/levelSalary.vue';
import childAgent from 'components/tcAgent/agentChildList/agentChildList.vue';
import agentList from 'components/tcAgent/agentList/agentList.vue';
import agentRecover from 'components/tcAgent/agentRecover/agentRecover.vue';
import addAgent from 'components/tcAgent/resume/addAgent.vue';
import viewResume from 'components/tcAgent/resume/viewResume.vue';
import editResume from 'components/tcAgent/resume/editResume.vue';
import teacherList from 'components/tcAgent/teacherList/teacherList.vue';
export default{
  path:'/tcAgent',
  component:router,
  children :[
    {
      path:'levelSalary',//级别薪资管理
      name:'levelSalary',
      component: levelSalary,
    },
    {
      path:'childAgent',//我的分代理
      name:'childAgent',
      component: childAgent,
    },
    {
      path:'agentList',//代理列表
      name:'agentList',
      component: agentList,
    },
    {
      path:'agentRecover',// 代理回收站
      name:'agentRecover',
      component: agentRecover,
    },
    {
      path:'addAgent',//新增代理信息档案  隐藏
      name:'addAgent',
      component: addAgent,
    },
    {
      path:'viewResume',//查看代理信息档案  隐藏
      name:'viewResume',
      component: viewResume,
    },
    {
      path:'editResume',//编辑代理信息档案  隐藏
      name:'editResume',
      component: editResume,
    },
    {
      path:'teacherList',//老师列表  隐藏
      name:'teacherList',
      component: teacherList,
    },
  ]
};
