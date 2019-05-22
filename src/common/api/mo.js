/**
 * 市场与运营
 * Created by Bing on 2017/6/16 0016.
 */
import {apiBase,apiHiCRM} from '../api.config';
export function MO() {
  return {
    "Team": {//团队管理
      "dataGrid": apiBase() + '/team/getPageTeam',
      "allTeam": apiBase() + '/team/getAllTeam',
      "getTeamByUuid": apiBase() + '/team/getTeamByUuid',
      "saveOrUpdate": apiBase() + '/team/createOrUpdateTeam',
      "delete": apiBase() + '/team/deleteTeam',
    },
    "Channel": {
      "dataGrid": apiBase() + '/channel/getPageChannel',
      "saveOrUpdate": apiBase() + '/channel/createOrEditChannel',
      "delete": apiBase() + '/channel/deleteChannel',
      "getChannel": apiBase() + '/channel/getChannelByUuid',
      "allChannel": apiBase() + '/channel/getAllChannel'
    },
    "channelBusiness": {//渠道商管理
      // "dataGrid": apiHiCRM() + '/crm/common/getPageChannelUser',//获取渠道商信息
      "dataGrid": apiHiCRM() + '/crm/channel/getPageChannelUser',//获取渠道商信息
      "getManagerChannel": apiHiCRM() + '/crm/common/getManagerChannel',//获取管理的渠道信息
      "getPageChannel": apiHiCRM() + '/crm/common/getPageChannel',//获取所有渠道信息
      // "addChannelUser": apiHiCRM() + '/crm/common/addChannelUser',//新增
      "addChannelUser": apiHiCRM() + '/crm/channel/addChannelUser',//新增
      // "editChannelUser": apiHiCRM() + '/crm/common/editChannelUser',//编辑
      "editChannelUser": apiHiCRM() + '/crm/channel/editChannelUser',//编辑
      "deleteChannelUser": apiHiCRM() + '/crm/common/deleteChannelUser',//删除
    },
    "ChannelType": {
      "allChannelType": apiBase() + '/channel/getAllChannelType'
    },
    "Leads": {
      "create": apiBase() + '/leads/createLeads',//新增Leads
      // "detailByCc": apiBase() + '/student/getLeadsOrStudentInfo',//CC学生详情
      "detailByCc":apiHiCRM() + '/crm/account/leadsStudent/getLeadsOrStudentInfo',//CC学生详情
      "detailByCcNew": apiHiCRM() + '/crm/account/getLeadsRemark',//获取历史备注
      "detailByCr": apiBase() + '/CrBaseInfo/getStudentBaseInfo',//CR学生详情
      "updateDetail": apiBase() + '/student/editLeadsOrStudentInfo',//编辑学生详情基本信息
      "getSysEnumBaseIndo": apiHiCRM() + '/crm/common/getSysEnumBaseIndo',//获取考试类型
      "addScore": apiHiCRM() + '/crm/course/saveScore',//新增考试成绩
      "getRyUpgradeReportByLeadsUuid": apiHiCRM() + '/crm/courseware/ryTestAnalysis/getRyUpgradeReportByLeadsUuid',//学习方案附件
      "createUpgradeReportByReportRecordId": apiHiCRM() + '/crm/courseware/ryTestAnalysis/createUpgradeReportByReportRecordId',//生成提分策
    },
    "CoursePackage": {// 课时包管理
      "dataGrid": apiBase() + '/CoursePriceManager/getCoursePriceInfo',
      "createAndUpdate": apiBase() + '/CoursePriceManager/createOrEditCoursePrice',
      "online": apiBase() + '/CoursePriceManager/onlineCoursePrice',
      "offline": apiBase() + '/CoursePriceManager/offerLineCoursePrice',
      "getByUuid": apiBase() + '/CoursePriceManager/getCoursePriceBaseInfo',
    },
    "PromotionCode": {//优惠码管理
      "dataGrid": apiBase() + '/PromotionCodeManager/getPromotionCode',
      "updateCodeStatus": apiBase() + '/PromotionCodeManager/editPromotionCodeStatus',
    },
    "banner": {//banner管理
      "getWebSiteBannerDetail": apiBase() + '/WebSiteShow/getWebSiteBannerDetail',//获取banner
      "uploadFile": apiBase() + '/WebSiteShow/uploadFile',//上传
      "saveWebSiteBanner": apiBase() + '/WebSiteShow/saveWebSiteBanner',//保存信息
      "editWebSiteBannerStatus": apiBase() + '/WebSiteShow/editWebSiteBannerStatus',//上线下线管理
      "updateBannnerSort": apiBase() + '/WebSiteShow/updateBannnerSort',//排序
    },
    "TMK": {//banner管理
      "uploadFile": apiHiCRM() + '/crm/auth/readExeclTmkList',//上传TMK报表
      "getWrongImportList": apiHiCRM() + '/crm/auth/getWrongImportList',//上传TMK报表
      "getTmkWaitRemark": apiHiCRM() + '/crm/auth/getTmkWaitRemark',//获取TMK跟进名单
    },
    "coupon": {//兑换码管理
      "queryChannelPage": apiHiCRM() + '/crm/product/queryChannelPage',//分页查询兑换码
      "addCouponCode": apiHiCRM() + '/crm/product/addCouponCode',//新增兑换码
      "downCouponCode": apiHiCRM() + '/crm/product/downCouponCode',//下载兑换码
      "getAllBatchNumber": apiHiCRM() + '/crm/product/getAllBatchNumber',//获取批次号
    },
    "createLeadsRemark": {//新增leads备注
      "tmkLeadsCheck": apiHiCRM() + '/crm/account/tmkLeadsCheck',//校验leads是否存在
      "tmkNewLeadsRemark": apiHiCRM() + '/crm/account/tmkNewLeadsRemark',//提交
    }
  }
}
