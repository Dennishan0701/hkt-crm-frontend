<template>
  <div>
    <o-breadcrumb second="CR首页"></o-breadcrumb>
    <div class="sc-cr-index">
      <Row>
        <i-col span="24" style="margin-bottom: 25px;">
          <div class="center">
            <div :class="oHeight? 'moreHeight' : 'lessHeight'">
              <h1 style="text-align: left;line-height: 50px;">公告栏
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
        <i-col span="24">
          <h2>我的本月业绩 {{date}}</h2>
          <table class="onlyhi-table" style="width: 100%" cellpadding="0" cellspacing="0">
            <tr>
              <th>#</th>
              <th>名单数</th>
              <th>续费数</th>
              <th>排课数</th>
              <th>续费金额（元）</th>
              <th>续费单数（笔）</th>
            </tr>
            <tr>
              <th>统计</th>
              <td>{{Sel.lists}}</td>
              <td>{{Sel.signLeadsNumber}}</td>
              <td>{{Sel.arrangeCourseNumber}}</td>
              <td>{{Sel.signMoney}}</td>
              <td>{{Sel.signOrderNumber}}</td>
            </tr>
          </table>
        </i-col>
      </Row>
      <Row :gutter="5">
        <i-col span="24">
          <div class="school">
            <h2>前十高校讲师比例(%)</h2>
            <table class="onlyhi-table top10">
              <tbody>
              <tr>
                <td v-for="item in limitBy5" :key="item.collegeName">{{item.collegeName}}<span class="o-tag green">{{item.rate | convertRate}}%</span></td>
              </tr>
              <tr>
                <td v-for="item in limitBy56" :key="item.collegeName">{{item.collegeName}}<span class="o-tag green">{{item.rate | convertRate}}%</span></td>
              </tr>
              <tr>
                <td v-for="item in limitBy511" :key="item.collegeName">{{item.collegeName}}<span class="o-tag green">{{item.rate | convertRate}}%</span></td>
              </tr>
              <tr>
                <td v-for="item in limitBy516" :key="item.collegeName">{{item.collegeName}}<span class="o-tag green">{{item.rate | convertRate}}%</span></td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="school">
            <h2>可排课讲师资源分布(%)</h2>
            <table class="onlyhi-table top10">
              <tr>
                <th style="width: 100px;">最多</th>
                <td v-for="item in limitByTop10" :key="item.collegeName">{{item.collegeName}}<span class="o-tag green">{{item.rate | convertRate}}%</span></td>
              </tr>
              <tr>
                <th style="width: 100px;">最少</th>
                <td v-for="item in limitByDown10" :key="item.collegeName">{{item.collegeName}}<span class="o-tag green">{{item.rate | convertRate}}%</span></td>
              </tr>
            </table>
          </div>
        </i-col>
      </Row>
      <Row :gutter="2">
        <i-col span="6">
          <div class="school">
            <Card dis-hover>
              <p slot="title">本月个人业绩榜</p>
              <table class="onlyhi-table top10" cellpadding="0" cellspacing="0">
                <thead>
                <tr>
                  <th>排行</th>
                  <th>姓名</th>
                  <th>续费</th>
                </tr>
                </thead>
                <tbody class="toplist">
                <tr v-for="(item, index) in monthPersonalTopTenSale" :key="item.name">
                  <th>{{index+1}}</th>
                  <td>{{item.name}}</td>
                  <td>{{item.newSignMoney}}</td>
                </tr>
                </tbody>
              </table>
            </Card>
          </div>
        </i-col>
        <i-col span="6">
          <div class="school">
            <Card dis-hover>
              <p slot="title">今日个人业绩榜</p>
              <table class="onlyhi-table top10" cellpadding="0" cellspacing="0">
                <thead>
                <tr>
                  <th>排行</th>
                  <th>姓名</th>
                  <th>续费</th>
                </tr>
                </thead>
                <tbody class="toplist">
                <tr v-for="(item, index) in todayPersonalTopTenSale" :key="item.name">
                  <th>{{index+1}}</th>
                  <td>{{item.name}}</td>
                  <td>{{item.newSignMoney}}</td>
                </tr>
                </tbody>
              </table>
            </Card>
          </div>
        </i-col>
        <i-col span="6">
          <div class="school">
            <Card dis-hover>
              <p slot="title">本月团队业绩榜</p>
              <table class="onlyhi-table top10" cellpadding="0" cellspacing="0">
                <thead>
                <tr>
                  <th>排行</th>
                  <th>姓名</th>
                  <th>业绩</th>
                </tr>
                </thead>
                <tbody class="toplist">
                <tr v-for="(item, index) in monthTeamTopTenSale" :key="item.name">
                  <th>{{index+1}}</th>
                  <td>{{item.name}}</td>
                  <td>{{item.newSignMoney}}</td>
                </tr>
                </tbody>
              </table>
            </Card>
          </div>
        </i-col>
        <i-col span="6">
          <div class="school">
            <Card dis-hover>
              <p slot="title">今日团队业绩榜</p>
              <table class="onlyhi-table top10" cellpadding="0" cellspacing="0">
                <thead>
                <tr>
                  <th>排行</th>
                  <th>姓名</th>
                  <th>业绩</th>
                </tr>
                </thead>
                <tbody class="toplist">
                <tr v-for="(item, index) in todayTeamTopTenSale" :key="item.name">
                  <th>{{index+1}}</th>
                  <td>{{item.name}}</td>
                  <td>{{item.newSignMoney}}</td>
                </tr>
                </tbody>
              </table>
            </Card>
          </div>
        </i-col>
      </Row>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {SCS} from 'common/api/scs.js';
  import {common,Moment} from 'common/js/common.js';
  import {COMMON_API} from 'common/api.config.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';

  export default{
    data() {
      return {
        oHeight:false,
        btnIsShow:false,
        create_date:'',
        content:'',
        date: Moment().format('YYYY-MM'),
        Sel: {
          lists: '',//名单数
          signLeadsNumber: '',//新签数
          arrangeCourseNumber: '',//排课数
          signMoney: '',//新签金额（元）
          signOrderNumber: '',//新签单数（元）
        },
        tenSchoolArray: [],//十大高校讲师占比
        coolegesRateDownFive: [],//可排课讲师资源分布-后五
        coolegesRateTopFive: [],//可排课讲师资源分布-前五
        monthPersonalTopTenSale: [],//个人本月新签金额前十业绩榜
        todayPersonalTopTenSale: [],//个人今日新签金额前十业绩榜
        monthTeamTopTenSale: [],//团队本月新签金额前十业绩榜
        todayTeamTopTenSale: [],//团队今日新签金额前十业绩榜
      }
    },
    mounted() {
      const that = this;
      //获取公告栏内容
      this.getNoticeDeatil();
      common.ajax({
        method: 'get',
        url: SCS().ccHome,
        data: {},
        success: function(res) {
          if(res.data){
            let selData = res.data.homePageSelfDeesVo;
            if(selData){
              that.Sel.lists = selData.lists;
              that.Sel.signLeadsNumber = selData.signLeadsNumber;
              that.Sel.arrangeCourseNumber = selData.arrangeCourseNumber;
              that.Sel.signMoney = selData.signMoney;
              that.Sel.signOrderNumber = selData.signOrderNumber;
            }
            that.tenSchoolArray = res.data.tenCollegesRateVo;
            that.coolegesRateDownFive = res.data.coolegesRateDownFive;
            that.coolegesRateTopFive = res.data.coolegesRateTopFive;
            that.monthPersonalTopTenSale = res.data.monthPersonalTopTenSale;
            that.todayPersonalTopTenSale = res.data.todayPersonalTopTenSale;
            that.monthTeamTopTenSale = res.data.monthTeamTopTenSale;
            that.todayTeamTopTenSale = res.data.todayTeamTopTenSale;
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
    computed:{
      limitBy5: function () {
        return this.tenSchoolArray.slice(0, 5)
      },
      limitBy56: function () {
        return this.tenSchoolArray.slice(6, 11)
      },
      limitBy511: function () {
        return this.tenSchoolArray.slice(11, 16)
      },
      limitBy516: function () {
        return this.tenSchoolArray.slice(16, 21)
      },
      limitByTop10: function () {
        return this.coolegesRateTopFive.slice(0, 10)
      },
      limitByDown10: function () {
        return this.coolegesRateDownFive.slice(0, 10)
      }
    },
    filters: {
      convertRate(value) {
        if(value) {
          return (value * 100).toFixed(2);
        }
        return "-";
      }
    },
    components: { OBreadcrumb }
  };
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .sc-cr-index {
    padding: 0 10px 0 10px;
  }
  .school { margin: 10px 0; }
  .top10 {
    width: 100%;
    margin-left: 0;
  }
  .top10 td,
  .top10 th{
    border-right: 1px solid #e3e8ee;
  }
  .toplist tr:nth-child(1),
  .toplist tr:nth-child(1) th{
    background-color: #ff6600;
    color: #fff;
    position: relative;
  }
  .toplist tr:nth-child(1) th:after{
    content: '冠 军';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 38px;
    line-height: 38px;
    display: block;
    background-color: #ff6600;
  }
  .toplist tr:nth-child(2),
  .toplist tr:nth-child(2) th{
    background-color: #ff9900;
    color: #fff;
    position: relative;
  }
  .toplist tr:nth-child(2) th:after{
    content: '亚 军';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 38px;
    line-height: 38px;
    display: block;
    background-color: #ff9900;
  }
  .toplist tr:nth-child(3),
  .toplist tr:nth-child(3) th{
    background-color: #657180;
    color: #fff;
    position: relative;
  }
  .toplist tr:nth-child(3) th:after{
    content: '季 军';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 38px;
    line-height: 38px;
    display: block;
    background-color: #657180;
  }
  .o-tag {
    margin-left: 2px;
    height: 18px;
    line-height: 18px;
  }
  .center{
    border: 1px solid #d7dde4;
    border-radius: 5px;
    margin-top: 5px;
    padding: 0px 5px;
    overflow: hidden;
    padding-bottom: 10px;
    /*margin-bottom: 10px;*/
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
