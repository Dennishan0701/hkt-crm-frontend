<template>
<div>
  <o-breadcrumb second="销售助理首页"></o-breadcrumb>
  <div class="sc-index">
    <Row>
      <i-col span="24">
        <div class="center">
          <div :class="oHeight? 'moreHeight' : 'lessHeight'">
            <h1 style="text-align: left;line-height: 50px;margin-left: 10px;">公告栏
              <!--<span style="font-size: 16px">{{create_date}}</span>-->
            </h1>
            <!--<p style='white-space:pre;padding: 0 20px;padding-bottom:10px;line-height: 24px;font-size: 16px;text-align: left;'>-->
            <!--&lt;!&ndash;本次更新功能：<br>&ndash;&gt;-->
            <!--&lt;!&ndash;1、新增销售业绩指标管理功能<br>&ndash;&gt;-->
            <!--&lt;!&ndash;2、更新销售业绩榜TV团队业绩排行为达标率排行<br>&ndash;&gt;-->
            <!--&lt;!&ndash;3、新增CR 结课学生页面<br>&ndash;&gt;-->
            <!--&lt;!&ndash;4、修复已知bug<br>&ndash;&gt;-->
            <!--&lt;!&ndash;5、优化用户体验<br>&ndash;&gt;-->
            <!--&lt;!&ndash;{{content}}&ndash;&gt;-->
            <!--</p>-->
            <p ref="pHeight" style='white-space:pre-wrap;padding: 0 20px;padding-bottom:20px;line-height: 24px;font-size: 16px;text-align: left;' v-html='content'>
            </p>
          </div>
          <div v-if="btnIsShow" class="clickShowMore" @click="oHeight = !oHeight">
            <i v-if="!oHeight" class="ivu-icon ivu-icon-ios-arrow-down"></i>
            <i v-if="oHeight" class="ivu-icon ivu-icon-ios-arrow-up"></i>
            <!--<button v-if="!oHeight" type="button" class="ivu-btn ivu-btn-text">-->
            <!--<span>查看详情</span>-->
            <!--</button>-->
            <!--<button v-if="oHeight" type="button" class="ivu-btn ivu-btn-text">-->
            <!--<span>收起</span>-->
            <!--</button>-->
          </div>
        </div>
      </i-col>
    </Row>
    <Row>
      <i-col span="12">
        <table class="onlyhi-table" border="0" cellpadding="1" cellspacing="0">
          <caption><h2>今日（{{Today.date}}）名单分配统计</h2></caption>
          <thead>
          <tr>
            <th>统计</th>
            <th>待分配</th>
            <th>已分配</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <th>新名单</th>
            <td class="required">{{Today.dayNewWaitDistributeNumber}}</td>
            <td>{{Today.dayNewHaveDistributeNumber}}</td>
          </tr>
          <tr>
            <th>藏金阁</th>
            <td class="required">{{Today.dayOldWaitDistributeNumber}}</td>
            <td>{{Today.dayOldHaveDistributeNumber}}</td>
          </tr>
          <tr>
            <th>正式生</th>
            <td class="required">{{Today.dayFormalWaitDistributeNumber}}</td>
            <td>{{Today.dayFormalHaveDistributeNumber}}</td>
          </tr>
          </tbody>
        </table>
      </i-col>
      <i-col span="12">
        <table class="onlyhi-table" border="0" cellpadding="1" cellspacing="0">
          <caption><h2>昨日（{{Yesterday.date}}）名单分配统计</h2></caption>
          <thead>
          <tr>
            <th>统计</th>
            <th>已分配</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <th>新名单</th>
            <td>{{Yesterday.yesterdayNewHaveDistributeNumber}}</td>
          </tr>
          <tr>
            <th>藏金阁</th>
            <td>{{Yesterday.yesterdayOldHaveDistributeNumber}}</td>
          </tr>
          <tr>
            <th>正式生</th>
            <td>{{Yesterday.yesterdayFormalHaveDistributeNumber}}</td>
          </tr>
          </tbody>
        </table>
      </i-col>
    </Row>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
  import {SCS} from 'common/api/scs.js';
  import {common,Moment} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import {COMMON_API} from 'common/api.config.js';

  export default{
    data() {
      return {
        oHeight:false,
        btnIsShow:false,
        create_date:'',
        content:'',
        Today: {
          date: Moment().format('MM.DD'),
          dayNewWaitDistributeNumber: '',//今日新名单待分配名额
          dayOldWaitDistributeNumber: '',//今日藏金阁待分配名额
          dayFormalWaitDistributeNumber: '',//今日正式生待分配名额
          dayNewHaveDistributeNumber: '',//今日新名单已经分配名额
          dayOldHaveDistributeNumber: '',//今日藏金阁已经分配名额
          dayFormalHaveDistributeNumber: '',//今日正式生已经分配名额
        },
        Yesterday: {
          date: Moment().subtract(1, 'd').format('MM.DD'),
          yesterdayNewHaveDistributeNumber: '',//昨日新名单已经分配名额
          yesterdayOldHaveDistributeNumber: '',//昨日藏金阁已经分配名额
          yesterdayFormalHaveDistributeNumber: '',//昨日正式生已经分配名额
        },
      }
    },
    mounted() {
      const that = this;
      //获取公告栏内容
      this.getNoticeDeatil();
      common.ajax({
        method: 'get',
        url: SCS().index,
        data: {},
        success: function(res) {
          if(res.data){
            let data = res.data.distributeInfoVo;
            that.Today.dayNewWaitDistributeNumber = data.dayNewWaitDistributeNumber;
            that.Today.dayOldWaitDistributeNumber = data.dayOldWaitDistributeNumber;
            that.Today.dayFormalWaitDistributeNumber = data.dayFormalWaitDistributeNumber;
            that.Today.dayNewHaveDistributeNumber = data.dayNewHaveDistributeNumber;
            that.Today.dayOldHaveDistributeNumber = data.dayOldHaveDistributeNumber;
            that.Today.dayFormalHaveDistributeNumber = data.dayFormalHaveDistributeNumber;

            that.Yesterday.yesterdayNewHaveDistributeNumber = data.yesterdayNewHaveDistributeNumber;
            that.Yesterday.yesterdayOldHaveDistributeNumber = data.yesterdayOldHaveDistributeNumber;
            that.Yesterday.yesterdayFormalHaveDistributeNumber = data.yesterdayFormalHaveDistributeNumber;
          }
        }
      });
    },
    updated(){
      let heights;
      heights =  this.$refs.pHeight.offsetHeight;
      if(heights>=140){
        this.btnIsShow = true;
      }else {
        this.btnIsShow = false;
      }
    },
    methods:{
      getNoticeDeatil(){
        const _this = this;
        common.ajax({
          url: COMMON_API().Notice.getNoticeDeatil,
          method: 'get',
          success: function(response){
            if(response.data["notice"]){
              _this.create_date = response.data["notice"].createDate;
              _this.content = response.data["notice"].content;
            }
          }
        });
      },
    },
    components: {
      OBreadcrumb
    }
  };
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .sc-index .onlyhi-table {
    width: 80%;
    margin: 10px 10px;
  }
  .center{
    border: 1px solid #d7dde4;
    border-radius: 5px;
    margin: 10px 20px;
    padding: 5px;
    overflow: hidden;
    position: relative;
  }
  .moreHeight{
    height: auto;
  }
  .lessHeight{
    height: 190px;
  }
  .clickShowMore{
    /*display: flex;*/
    /*justify-content: center;*/
    /*align-items: center;*/
    position: absolute;
    bottom:1px;
    left: 4px;
    right: 4px;
    text-align: center;
    cursor: pointer;
    padding: 5px 0;
  .ivu-btn{
    margin-top: -8px;
    padding: 8px 10px;
  }
  i{
    cursor: pointer;
    font-size: 18px;
    font-weight: 700;
    position: relative;
    top: 6px;
    z-index: 2;
  }
  }
  .clickShowMore:after{
    content: "";
    width: 100%;
    height: 75px;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;
    box-shadow: inset 0 -25px 40px #fff;
    box-sizing: border-box;
  }
</style>
