/**
 * 市场与运营
 * Created by ShenBo on 2018/5/9
 */

import router from 'components/router';
import channelManager from 'components/mo/channel/channel';
import channelType from 'components/mo/channelType/channelType';
import createLeads from 'components/mo/createLeads/createLeads';
import createLeadsRemark from 'components/mo/createLeads/createLeadsRemark';
import coursePackage from 'components/mo/coursePackage/coursePackage';
import promotionCode from 'components/mo/promotionCode/promotionCode';
import banner from 'components/mo/banner/banner';
import channelBusiness from 'components/mo/channelBusiness/channelBusiness';
import TMKlist from 'components/mo/TMKlist/TMKlist';
import coupon from 'components/mo/coupon/coupon';
import TMKFollowedList from 'components/mo/TMKlist/TMKFollowedList';
export default{
  path:'/mo',
  component:router,
  children :[
    {
      path:'channelManager',//渠道投放
      name:'channelManager',
      component: channelManager
    },
    {
      path:'channelBusiness',//渠道商管理
      name:'channelBusiness',
      component: channelBusiness
    },
    {
      path:'channelType',//渠道类别管理
      name:'channelType',
      component: channelType
    },
    {
      path:'createLeads',//新增Leads
      name:'createLeads',
      component: createLeads
    },
    {
      path:'createLeadsRemark',//新增Leads备注
      name:'createLeadsRemark',
      component: createLeadsRemark
    },
    {
      path:'coursePackage',//课程包管理
      name:'coursePackage',
      component: coursePackage
    },
    {
      path:'promotionCode',//优惠码管理
      name:'promotionCode',
      component: promotionCode
    },
    {
      path:'banner',//官网banner管理
      name:'banner',
      component: banner
    },
    {
      path:'TMKlist',//TMK名单导入
      name:'TMKlist',
      component: TMKlist
    },
    {
      path:'coupon',//兑换码管理
      name:'coupon',
      component: coupon
    },
    {
      path:'TMKFollowedList',//TMK跟进名单
      name:'TMKFollowedList',
      component: TMKFollowedList
    },
  ]
};
