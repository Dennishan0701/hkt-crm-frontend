<template>
  <div>
    <o-breadcrumb second="数据报表" third="合肥老师课表订单"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <form id="searchForm">
            <i-input :size="$store.state.searchModuleSize" v-model="Search.studentParams" clearable @on-keyup.enter="searchForm(1)" placeholder="学生姓名/手机号"
                     style="width:150px;margin-right:2px;"></i-input>
            <i-input :size="$store.state.searchModuleSize" v-model="Search.teacherParams" clearable @on-keyup.enter="searchForm(1)" placeholder="老师姓名/手机号"
                     style="width:150px;margin-right:2px;"></i-input>
            <i-select :size="$store.state.searchModuleSize" v-model="Search.grade" clearable placeholder="年级" style="width:90px;">
              <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
            </i-select>
            <i-select :size="$store.state.searchModuleSize" v-model="Search.subject" clearable placeholder="科目" style="width:90px;">
              <i-option v-for="(item,index) in subjectList" :key='index' :value="item.value">{{ item.value }}</i-option>
            </i-select>
            <i-input :size="$store.state.searchModuleSize" v-model="Search.userName" clearable @on-keyup.enter="searchForm(1)" placeholder="CR姓名"
                     style="width:100px;margin-right:2px;"></i-input>

            <Date-picker :size="$store.state.searchModuleSize" ref="classDate" type="daterange" placement="bottom-end" placeholder="上课日期"
                         @on-change="changeClassDate" style="width: 200px"></Date-picker>
            <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
            <i-button :size="$store.state.searchModuleSize" type="ghost" @click="clearSearchForm">重置</i-button>
          </form>
        </i-col>
      </Row>
    </div>
    <i-table size="small" :height="theight" stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
    <!--<input type="text" id="proLink" :value="copyValue">-->
    <textarea rows="3" cols="20" id="proLink">
    {{copyValue}}
</textarea>
    <!--批量iframe排课-->
    <batch-model @reFresh="reFresh" ref="arrange"></batch-model>
    <!--查看订单课时信息-->
    <Modal
      v-model="modal"
      title="查看订单课时信息"
      :mask-closable="false"
      :closable = "false"
      :loading = "loading"
      @on-ok="this.modal= false">
      <i-table size="small" :height="theight"  :columns="columnsCourseHourT1" :data="dataCourseHourT1"></i-table>
      <i-table size="small" :height="theight"  :columns="columnsCourseHourT2" :data="dataCourseHourT2"></i-table>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API,apiHiCRM,apiBase} from 'common/api.config.js';
  import {REPORT} from 'common/api/report.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import {formateDate, common, clearSearchForm,hideCharAtNumber,getFullPhone} from 'common/js/common.js';
  import batchModel from 'components/report/hefeiTcCourseOrder/batchModel';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      const validateTeacher = (rule, value, callback) => {
        if (value === ''||value == null) {
          callback(new Error('不能为空'));
        } else {
          var reg = /^[1][0-9]{10}$/;
          if (!reg.test(value)){
            callback(new Error('请输入正确的手机号'));
          }
          callback();
        }
      };
      return {
        queryHfCourseOrderPage:this.$store.state.queryHfCourseOrderPage,
        data: [],
        dataCourseHourT1: [],
        dataCourseHourT2: [],
        courseOrder:'',
        leads:'',
        formItem:{
          student:'',
          teacher:'',
          grade:'',
          subject:'',
        },
        formClass:{
          grade:'',
          subject:'',
        },
        ruleValidate: {
          teacher: [
            {required: true,validator: validateTeacher,trigger: 'blur',},
            // {required: true, message: '请填写老师上课时长', trigger: 'blur'}
          ]
        },
        ruleValidateClass: {
          grade: [
            {required: true, message: '请选择年级', trigger: 'change'}
          ],
          subject: [
            {required: true, message: '请选择科目', trigger: 'change'}
          ]
        },
        modal: false,
        classModal: false,
        modal2: false,
        copyValue: '',
        loading:false,
        classLoading:false,
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        Search: {
//          studentName: '',
//          studentPhone: '',
          studentParams: '',
          teacherParams: '',
//          teacherName: '',
//          teacherPhone: '',
          userName: '',
          courseDateStart: '',
          courseDateEnd: '',
          grade: '',
          subject:'',
        },
        gradeList: [],
        subjectList: [],//科目
        columns: [
          {
            title: '学生姓名',
            key: 'studentName',
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
                },params.row.studentName)
              ])
//              return `<strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.leadsUuid}');">${row.studentName}</a></strong>`;
            }
          },
          {
            title: '学生手机号',
            key: 'stuPhone',
            minWidth: 120,
            align: 'center',
            render : (h, params) => {
              return h('div',[
                h('span',hideCharAtNumber(params.row.stuPhone)),
                h('i',{
                  attrs:{
                    title:"显示全部",
                    class:'ivu-icon ivu-icon-ios-eye',
                  },
                  style:{
                    margin:'2px',
                    fontSize:'18px',
                    verticalAlign:'top',
                    cursor:'pointer'
                  },
                  on:{
                    click:()=>{
                      this.getFullPhone(params.row.stuPhone)
                    }
                  }
                })
              ])
              // return hideCharAtNumber(row.stuPhone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.stuPhone}')" class="eye" title="显示全部"></Icon>`;
            }
          },
          {
            title: '老师',
            key: 'teacherName',
            align: 'center',
            minWidth: 90
          },
          {
            title: '老师手机号',
            key: 'tcPhone',
            minWidth: 120,
            align: 'center',
            render : (h, params) => {
              return h('div',[
                h('span',hideCharAtNumber(params.row.tcPhone)),
                h('i',{
                  attrs:{
                    title:"显示全部",
                    class:'ivu-icon ivu-icon-ios-eye',
                  },
                  style:{
                    margin:'2px',
                    fontSize:'18px',
                    verticalAlign:'top',
                    cursor:'pointer'
                  },
                  on:{
                    click:()=>{
                      this.getFullPhone(params.row.tcPhone)
                    }
                  }
                })
              ])
              // return hideCharAtNumber(row.tcPhone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.tcPhone}')" class="eye" title="显示全部"></Icon>`;
            }
          },
          {
            title: '年级',
            key: 'grade',
            align: 'center',
            minWidth: 90
          },
          {
            title: '科目',
            key: 'subject',
            align: 'center',
            minWidth: 90,
          },
          {
            title: 'CR',
            key: 'userName',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '操作',
            minWidth: 200,
            align: 'center',
            render : (h, params) => {
              return h('div',[
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    // icon: 'ios-copy-outline',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs:{
                    title:'查看订单课时信息'
                  },
                  on: {
                    click: () => {
                      console.log(params.row);
                      this.modal = true;
                      this.checkOrderCourseInfo(params.row.leadsUuid);
                    }
                  }
                },'查看订单课时信息'),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    // icon: 'clipboard',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs:{
                    title:'课表'
                  },
                  on: {
                    click: () => {
                      this.formalArrange(params.row.leadsUuid,params.row.teacherUuid,params.row.courseOrderUuid,params.row.courseOrderUuid)
                    }
                  }
                },'课表'),
              ])
            }
          },
        ],
        columnsCourseHourT1:[
          {
            title: '消耗购买课时(h)',
            key: 'buyClassHour',
            minWidth: 120,
            align: 'center',
          },
          {
            title: '消耗赠送课时(h)',
            key: 'giveClassHour',
            minWidth: 120,
            align: 'center',
          },
          {
            title: '剩余课时(h)',
            key: 'surplusClassHour',
            minWidth: 120,
            align: 'center',
          },
        ],
        columnsCourseHourT2:[
          {
            title: '序号',
            type:'index',
            minWidth: 50,
            align: 'center',
          },
          {
            title: '课时包',
            key: 'priceName',
            minWidth: 90,
            align: 'center',
          },
          {
            title: '购买课时',
            key: 'buyClassHour',
            minWidth: 60,
            align: 'center',
          },
          {
            title: '赠送课时',
            key: 'giveClassHour',
            minWidth: 60,
            align: 'center',
          },
          {
            title: '提交业绩时间',
            key: 'submitDate',
            minWidth: 150,
            align: 'center',
            render(h, params) {
              return h('span',formateDate(params.row.submitDate, 'yyyy-MM-dd hh:mm:ss'));
            },
          },
          {
            title: '签单人',
            key: 'createUser',
            minWidth: 90,
            align: 'center',
          },
        ]
      }
    },
    mounted() {
      this.searchForm();
      const _this = this;
      $.getJSON("static/data.json", function (json) {
        _this.gradeList = json.gradeList;
      });
      $.getJSON("static/data.json", function (json) {
        _this.subjectList = json.subjectList;
      });
    },
    methods: {
//        起始时间排课
      formalClass(crUuid,courseOrderUuid,teacherUuid,leadsUuid,courseRequestUuid,stuPhone,tcPhone,subject,teacherName,studentName){
        this.$refs.batchformalmodal.show(crUuid,courseOrderUuid,teacherUuid,leadsUuid,courseRequestUuid,stuPhone,tcPhone,subject,teacherName,studentName);
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          studentParams: this.Search.studentParams,
          teacherParams: this.Search.teacherParams,
//          teacherName: this.Search.teacherName,
//          teacherPhone: this.Search.teacherPhone,
          userName: this.Search.userName,
          courseDateStart: this.Search.courseDateStart,
          courseDateEnd: this.Search.courseDateEnd,
          grade: this.Search.grade,
          subject: this.Search.subject,
        });
      },
      clearSearchForm() {
        clearSearchForm(this.Search,[this.$refs.classDate]);
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        // let param = `?studentParams=${search.studentParams}&teacherParams=${search.teacherParams}&userName=${search.userName}&courseDateStart=${search.courseDateStart}&courseDateEnd=${search.courseDateEnd}&grade=${search.grade}&subject=${search.subject}`
        // param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        // const _this = this;
        // common.ajax({
        //   url: REPORT().hefeiTcCourseOrder.hefeiTcCourseOrder + param,
        //   method: 'get',
        //   success: function (res) {
        //     _this.data = res.data['courseOrderList'] || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get(this.queryHfCourseOrderPage,{
          baseURL: apiHiCRM(),
          params:{
            studentParams : search.studentParams,
            teacherParams : search.teacherParams,
            userName : search.userName,
            courseDateStart : search.courseDateStart,
            courseDateEnd : search.courseDateEnd,
            gread : search.gread,
            subject : search.subject,
            pageIndex : this.pageIndex,
            pageNumber : this.pageNumber,
            orderBy : orderBy,
            sortBy : sortBy,
          },
        }).then( ({ data }) => {
          this.data = data.data['courseOrderList']|| [];
          this.total = data.data.total;
        })
      },
      changeClassDate(value) {
        this.Search.courseDateStart = value[0] || '';
        this.Search.courseDateEnd = value[1] || '';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      getFullPhone(phone) {
        getFullPhone(phone, COMMON_API().Phone.getFullPhone);
      },
      reFresh(arg){
        this.searchForm();
      },
      // 查看订单课时信息
      checkOrderCourseInfo(leadsUuid){
        const _this = this;
        common.ajax({
          url: REPORT().hefeiTcCourseOrder.getClassHour,
          method: 'get',
          data: {
            leadsUuid:leadsUuid,
          },
          success: function(res){
            if(res.data){
              _this.dataCourseHourT1 = res.data.classHourVo;
            }
          }
        });
        common.ajax({
          url: REPORT().hefeiTcCourseOrder.getPriceClassHour,
          method: 'get',
          data: {
            leadsUuid:leadsUuid,
          },
          success: function(res){
            if(res.data){
              _this.dataCourseHourT2 = res.data.priceClassHourList;
            }
          }
        });
      },
      // 课表查询
      formalArrange(leadsUuid,teacherUuid,courseOrderUuid){
        this.$refs.arrange.show(leadsUuid,teacherUuid,courseOrderUuid);
      },
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470 : '';
      }
    },
    components: {OBreadcrumb,batchModel,PageModel}
  };
</script>

<style scoped>
  .ivu-btn {
    margin: 3px 0;
  }
  .ivu-modal-content{
    margin-bottom: 180px !important;
  }
  .ivu-poptip-title {
    display: none !important;
  }

  #proLink {
    position: absolute;
    left: -9999999999px;
    top: 0;
  }
</style>
