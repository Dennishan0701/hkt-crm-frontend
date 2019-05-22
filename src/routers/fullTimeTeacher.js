/**
 * 全职老师
 * Created by ShenBo on 2018/5/9
 */
import router from 'components/router';
import waitTrain from 'components/fullTimeTeacher/waitTrain/waitTrain';
export default{
  path:'/fullTimeTeacher',
  component:router,
  children :[
    {
      path:'waitTrain',//待培训
      name:'waitTrain',
      component: waitTrain
    },
  ]
};
