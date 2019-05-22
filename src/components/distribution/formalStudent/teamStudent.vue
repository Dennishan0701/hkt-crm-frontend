<template>
<div>
  <o-breadcrumb second="分配管理" third="本团队新正式生分配"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="6">
        <i-button type="primary" :size="$store.state.searchModuleSize" icon="paper-airplane" @click="showSalesModal">批量分配</i-button>
      </i-col>
      <i-col span="18" class="right">
        <form id="searchForm">
          <strong class="label">姓名\手机：</strong>
          <i-input v-model="nameAndPhoneValue" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="学生姓名 \ 手机号码" style="width:150px;margin-right: 2px;"></i-input>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索</i-button>
        </form>
      </i-col>
    </Row>
  </div>
  <i-table size="small" highlight-row stripe :columns="columns" :data="data" @on-selection-change="getSelections" @on-select-all="getSelectionAll"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>

  <selectSales @reFresh="reFresh"  ref="sales" ></selectSales>
  <hand-out-remark @reFresh="reFresh"  ref="handOutRemark"></hand-out-remark>

</div>
</template>

<script type="text/ecmascript-6">
  import {DISTRIBUTE} from 'common/api/distribute.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import selectSales from './selectSalesNew';
  import handOutRemark from 'components/sc/contractStudents/handOutRemark';
  import PageModel from 'dashborader/page/page.vue';
  const $sStorage = $.sessionStorage;
  export default{
    data() {
      return {
        data: [
//          {"age":null,"ccUuid":"64392477-83DB-4C15-9F56-75941CF5ADE9","connectStatus":null,"crUuid":null,"createDate":1488259694000,"examArea":null,"firstCourseSubject":null,"firstCourseTime":null,"firstCourseUuid":"FCB1CD5D-B808-406A-88AB-E7B6BDF16B1F","grade":"小四","handoutDes":"ddd","id":8,"introducer":"dd","isBound":false,"isDimissionType":null,"isDistribution":false,"isFirstCourse":true,"isHandout":true,"isIntroduced":false,"keyPoint":1,"leadUuid":"AFBA2107-7631-4E39-85BF-CAB703A91F71","name":"测试数据9","password":null,"phone":"15004869521","sex":null,"status":true,"stuNo":"1401130471","subject":"语文","teacherUuid":null,"updateDate":1499310176000},{"age":null,"ccUuid":"37828288-EEAD-431D-B248-6D317A1A563B","connectStatus":null,"crUuid":null,"createDate":1498539065000,"examArea":null,"firstCourseSubject":null,"firstCourseTime":null,"firstCourseUuid":null,"grade":"初一","handoutDes":"班主任尽快联系","id":1354,"introducer":"","isBound":true,"isDimissionType":false,"isDistribution":false,"isFirstCourse":false,"isHandout":true,"isIntroduced":true,"keyPoint":0,"leadUuid":"7804ECAD-4B1F-4A76-9895-9AF5EAFD0D75","name":"周锐","password":"4d6698c1e6b230c5ff80935bc26b722e743487b05b0da398d4716ad43e725c17e8b02ccabc2c593b5dd9547191386ae5add75a8873b3162d9544b7eba873a170","phone":"18974036008","sex":null,"status":true,"stuNo":"2101291318","subject":"语文","teacherUuid":null,"updateDate":1498545521000},{"age":null,"ccUuid":"9565E738-58CC-44A3-BC2E-FC09B8EA7CA8","connectStatus":null,"crUuid":null,"createDate":1498542367000,"examArea":null,"firstCourseSubject":null,"firstCourseTime":null,"firstCourseUuid":null,"grade":"初一","handoutDes":"1  160课 22311  奖学金活动\n2 没有和学生规划具体的上课时间\n3 正常 没有绑定\n\n5  和孩子的爸爸沟通的 家里情况一般                                                                \n6 孩子比较叛逆 现在想学好 成绩比较差 60\n7 目前沟通没有\n8 和孩子的爸爸聊了 前期顾虑挺多的 一度孩子表示不想学了 后期和爸爸说了学习的必要性 愿意让孩子跟着我们学 家长比较重视孩子在我们这里的提分","id":1359,"introducer":"","isBound":true,"isDimissionType":false,"isDistribution":false,"isFirstCourse":false,"isHandout":true,"isIntroduced":true,"keyPoint":0,"leadUuid":"619C999B-DDDA-44B5-B166-15C55070825B","name":"朱维汉","password":"4d6698c1e6b230c5ff80935bc26b722e743487b05b0da398d4716ad43e725c17e8b02ccabc2c593b5dd9547191386ae5add75a8873b3162d9544b7eba873a170","phone":"13793479419","sex":null,"status":true,"stuNo":"2102611802","subject":"数学","teacherUuid":null,"updateDate":1498544249000},{"age":null,"ccUuid":"02C3709E-AC76-4C2B-87F5-E09BFC7CB4EA","connectStatus":null,"crUuid":null,"createDate":1498542455000,"examArea":null,"firstCourseSubject":null,"firstCourseTime":null,"firstCourseUuid":null,"grade":"初二","handoutDes":"林炜荏，男，初二，数，语文，物和小科都不及格，英语90-100/120，广州地区，320课时分期44111，暑秋联报，账号已绑定，爸爸是装修设计师，4--8节课爸爸希望给到具体的各科学习规划和提分方案，先安排暑假的，数学老师石迪，谢谢","id":1360,"introducer":"","isBound":false,"isDimissionType":false,"isDistribution":false,"isFirstCourse":false,"isHandout":true,"isIntroduced":true,"keyPoint":0,"leadUuid":"0B37FFD7-3338-497D-9926-80CA4C51B467","name":"林炜荏","password":"4d6698c1e6b230c5ff80935bc26b722e743487b05b0da398d4716ad43e725c17e8b02ccabc2c593b5dd9547191386ae5add75a8873b3162d9544b7eba873a170","phone":"13808861691","sex":null,"status":true,"stuNo":"2202123773","subject":"数学","teacherUuid":null,"updateDate":1498544116000},{"age":null,"ccUuid":"F0D59AB5-EDBC-48E6-A79E-20EE3C2AD4BC","connectStatus":null,"crUuid":null,"createDate":1498539458000,"examArea":null,"firstCourseSubject":null,"firstCourseTime":null,"firstCourseUuid":null,"grade":"初二","handoutDes":"1.320课时44111，奖学金，物理老师牛帅\n2.6月27日晚7点-9点第一次正式课\n3.未绑定，笔记本电脑，流畅\n4.人教版\n5.妈妈性格很好，呆萌的，家里面有个5个月的宝宝，爸爸守河堤的。\n6.孩子挺漂亮的，全科都是7.80分的样子。在暑假可以每天都上的。 班主任重点关注一下。爸爸不太想让孩子玩电脑。  一定多关注一下这个孩子。假期可以每天都学的，今天开始期末考试。孩子不挑老师， \n7.已经聊好数学，语文一起上。上3科，适当的可以安排一个化学老师做预习。\n8.孩子想找开朗的大姐姐\n9.百度分期 12期","id":1357,"introducer":"","isBound":true,"isDimissionType":false,"isDistribution":false,"isFirstCourse":false,"isHandout":true,"isIntroduced":true,"keyPoint":0,"leadUuid":"1812F814-5185-4AC0-9907-623B193A14F5","name":"郭潇敏","password":"4d6698c1e6b230c5ff80935bc26b722e743487b05b0da398d4716ad43e725c17e8b02ccabc2c593b5dd9547191386ae5add75a8873b3162d9544b7eba873a170","phone":"18373620707","sex":null,"status":true,"stuNo":"2207276216","subject":"物理","teacherUuid":null,"updateDate":1498544086000},{"age":null,"ccUuid":"E2C94635-2260-4ED1-B73E-A2299E528A0D","connectStatus":null,"crUuid":null,"createDate":1498538449000,"examArea":null,"firstCourseSubject":null,"firstCourseTime":null,"firstCourseUuid":null,"grade":"高一","handoutDes":"1、240课时 36631，奖学金，送手写板，送课时\n2、第一次课本周三政治测评课\n3、客户端正常，账户未绑定\n4、数学  人教版\n5、妈妈性格：性格直爽，担心效果，担心版本和老师是否了解当地政策，支付能较强\n6、性格：外向，态度：想进步，成绩不及格，语文不及格到100（150），外语：110以上\n7、扩课：语文、英语、文综和理综\n8、在点出不足，给予美好肯定\n9、孩子周三可以安排试听\n10、建议先给孩子安排正式课，这样更保险","id":1350,"introducer":"","isBound":true,"isDimissionType":false,"isDistribution":false,"isFirstCourse":false,"isHandout":true,"isIntroduced":true,"keyPoint":0,"leadUuid":"7519BA82-8939-4F00-A0CD-49448616C837","name":"杨帼鑫","password":"4d6698c1e6b230c5ff80935bc26b722e743487b05b0da398d4716ad43e725c17e8b02ccabc2c593b5dd9547191386ae5add75a8873b3162d9544b7eba873a170","phone":"13998484817","sex":null,"status":true,"stuNo":"3102638493","subject":"数学","teacherUuid":null,"updateDate":1498543658000}
        ],
        total: 0,
        selectionRows: [],
        selectionTeam: [],
        pageIndex: 1,
        pageNumber: 10,
        nameAndPhoneValue: '',
        columns: [
          {
            type: 'selection',
            minWidth: 60,
            align: 'center',
          },
          {
            title: '学生',
            key: 'name',
            minWidth: 90,
            align: 'center',
            render : (h, params) => {
              return h('div',[
                h('Icon',{
                  props:{
                    type:'person'
                  }
                }),
                h('a',{
                  on:{
                    click:()=>{
                      GLOBAL.viewLeadsDetail(params.row.leadsUuid)
                    }
                  }
                },params.row.leadsName)
              ])
//              return `<Icon type="person"></Icon> <strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.leadsUuid}');">${row.leadsName}</a></strong>`;
            }
          },
          {
            title: '手机号',
            key: 'phone',
            minWidth: 120,
            align: 'center',
            render(h, params) {
              return h('span',hideCharAtNumber(params.row.leadsPhone));
            }
          },
          {
            title: '付费时间',
            key: 'payTime',
            minWidth: 150,
            align: 'center',
            render(h, params) {
              return h('span',formateDate(params.row.payTime,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '更新时间',
            key: 'updateTime',
            minWidth: 150,
            align: 'center',
            render(h, params) {
              if(params.row.updateTime) {
                return h('span',formateDate(params.row.updateTime,'yyyy-MM-dd hh:mm:ss'));
              }else{
                return h('span','--');
              }
            }
          },
          {
            title: '移交备注',
            key: 'handOutDes',
            minWidth: 150,
            align: 'center',
            render : (h, params) => {
              let content = row.handOutDes;
              if(content && content.length>40) {
                content = content.slice(0,39)+'...';
                return h('div',[
                  h('span',{
                    attrs:{
                      title:params.row.handOutDes
                    }
                  },content)
                ])
//                return `<span title="${row.handOutDes}">${content}</span>`;
              } else {
                return h('span',content);
              }
            }
          },
          {
            title: '操作',
            minWidth: 120,
            align: 'center',
            render : (h, params) => {
              return h('div',[
                h('Button',{
                  props:{
                    type:'success',
                    icon:'ios-eye',
                    size:'small',
                  },
                  attrs:{
                    title:'查看移交表'
                  },
                  style:{
                    margin:'2px'
                  },
                  on:{
                    click:()=>{
                      this.getHandOutRemark(params.row.leadsUuid)
                    }
                  }
                }),
                h('Button',{
                  props:{
                    type:'primary',
                    icon:'paper-airplane',
                    size:'small',
                  },
                  attrs:{
                    title:'分配'
                  },
                  style:{
                    margin:'2px'
                  },
                  on:{
                    click:()=>{
                      this.distribution(params.row.leadsUuid,params.row.teamUuid)
                    }
                  }
                })
              ])
//              return `<i-button type="success" icon="ios-eye" title="查看移交表" size="small" @click="getHandOutRemark('${row.leadsUuid}')"></i-button>
//                      <i-button type="primary" size="small" icon="paper-airplane" title="分配" @click="distribution('${row.leadsUuid}','${row.teamUuid}')"></i-button>`;
            }
          }
        ],
      }
    },
    mounted() {
      this.searchForm();
    },
    methods: {
//      查看移交表
      getHandOutRemark(leadsUuid){
        this.$refs.handOutRemark.show(leadsUuid,'get');
      },
      showSalesModal() {
        let row = this.selectionRows||[];
        if (row.length > 0) {
          this.$refs.sales.show();
        } else {
          common.msg('请选择名单','warning');
        }
      },
      distribution(leadsIds,teamUuid) {
        this.selectionRows.length = 1;
        this.selectionTeam.length = 1;
        this.selectionRows[0] = {"uuid": leadsIds};
        this.selectionTeam[0] = {"teamUuid": teamUuid};
        $sStorage.set('selectionTeam' ,this.selectionTeam);
        $sStorage.set('selectionRows' ,this.selectionRows);
        this.showSalesModal();
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        let nameAndPhone = this.nameAndPhoneValue;
        let name = '', phone = '';
        if (!nameAndPhone) nameAndPhone = '';
        if (isNaN(nameAndPhone)) {
          name = nameAndPhone;
        } else {
          phone = nameAndPhone;
        }
        this.loadDataGrid({
          studentName: name,
          studentPhone: phone
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?studentName=${search.studentName}&studentPhone=${search.studentPhone}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        // common.ajax({
        //   url: DISTRIBUTE().Team.teamFormallStudentPage+param,
        //   method: 'get',
        //   success: function(res){
        //     _this.data = res.data['distributionStudentVos'] || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get(DISTRIBUTE().Team.teamFormallStudentPage,{
          params:{
            studentName: search.studentName,
            studentPhone: search.studentPhone,
            pageIndex: this.pageIndex,
            pageNumber: this.pageNumber,
            orderBy: orderBy,
            sortBy: sortBy,
          }
        }).then( ({data}) => {
          _this.data = data.data['distributionStudentVos'] || [];
          _this.total = data.data.total;
        })
      },
      getSelections(selection) {
        $sStorage.set('selectionRows' ,selection);
        $sStorage.set('selectionTeam' ,selection);
        this.selectionRows = [{uuid:selection.leadsUuid}];
        this.selectionTeam = [{teamUuid:selection.teamUuid}];
      },
      getSelectionAll(selection) {
        $sStorage.set('selectionRows' ,selection);
//        $sStorage.set('selectionTeam' ,selection);
        this.selectionRows = selection;
//        this.selectionTeam = selection;
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      reFresh(){
        this.searchForm();
      }
    },
    components: { OBreadcrumb,selectSales,handOutRemark ,PageModel}
  };
</script>

<style>
  .ivu-select-dropdown-list{
    text-align: left;
  }
</style>
