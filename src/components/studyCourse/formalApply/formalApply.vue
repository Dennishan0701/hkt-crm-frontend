<template>
<div>
  <o-breadcrumb second="教学" third="排正式课请求"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="24" class="right">
        <form id="searchForm">
          <i-input :size="$store.state.searchModuleSize" v-model="Search.leadsParam" @on-keyup.enter="searchForm(1)" placeholder="学生姓名/手机号"
                   style="width:150px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.teacherParam" @on-keyup.enter="searchForm(1)" placeholder="老师姓名/老师手机号"
                   style="width:150px;margin-right:2px;"></i-input>

          <i-select :size="$store.state.searchModuleSize" v-model="Search.grade" clearable placeholder="年级" style="width:100px;">
            <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>

          <i-select :size="$store.state.searchModuleSize" v-model="Search.checkStatus" clearable placeholder="是否排课" style="width:90px;">
            <i-option value="0">未排课</i-option>
            <i-option value="1">已排课</i-option>
          </i-select>

          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
        </form>
      </i-col>
    </Row>
  </div>
  <i-table size="small" :height="theight" stripe :columns="columns" :data="data"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>
</div>
</template>

<script type="text/ecmascript-6">
  import {STUDY_COURSE} from 'common/api/studyCourse.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import {formateDate, common, clearSearchForm} from 'common/js/common.js';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        copyValue: '',
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        Search: {
          leadsParam: '',
//          studentPhone: '',
          teacherParam: '',
          checkStatus: '',
//          teacherPhone: '',
//          userName: '',
//          courseDateStart: '',
//          courseDateEnd: '',
          grade: '',
//          subject:'',
        },
        gradeList: [],
//        subjectList: [],//科目
        columns: [
          {
            title: '学生姓名',
            key: 'leadsName',
            width: 90,
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
//              return `<strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.leadsUuid}');">${row.leadsName}</a></strong>`;
            }
          },
          {
            title: '老师',
            key: 'teacherName',
            align: 'center',
            width: 90
          },
          {
            title: '年级',
            key: 'grade',
            align: 'center',
            width: 90
          },
          {
            title: '科目',
            key: 'subject',
            align: 'center',
            width: 90,
          },
          {
            title: 'CR',
            key: 'crName',
            align: 'center',
            width: 90,
          },
          {
            title: '上课规律',
            key: 'courseRule',
            align: 'center',
            width: 90,
          },
          {
            title: '周期',
            key: 'courseStartDate',
            width: 90,
            align: 'center',
            render(h, params) {
              return h('span',params.row.courseStartDate+'-'+ params.row.courseEndDate)
            }
          },
          {
            title: '备注',
            key: 'remark',
            width: 90,
            align: 'center',
            render : (h, params) => {
              let param = params.row.remark||'';
              if(param.length >30){
                param = param.slice(0,28);
                return h('div',[
                  h('span',{
                    attrs:{
                      title:params.row.remark
                    }
                  },param+'...')
                ])
//                return `<span title='${row.remark}'>${params}...</span>`
              }else {
                return h('span',param)
              }
            }
          },
          {
            title: '操作',
            width: 90,
            align: 'center',
            render : (h, params) => {
              if(params.row.checkStatus == 0){
                return h('div',[
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                      icon: 'checkmark',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs:{
                      title:'通过正式课申请'
                    },
                    on: {
                      click: () => {
                      this.addCourseOrderRequest(params.row.courseOrderRequestUuid)
                  }
              }
              })
              ])
//                return `<i-button type="primary" icon="checkmark" size="small" title="通过正式课申请" @click="addCourseOrderRequest('${row.courseOrderRequestUuid}')"></i-button>`;
              }else {
                return h('span',{},'已排课')
              }
            }
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
//      $.getJSON("static/data.json", function (json) {
//        _this.subjectList = json.subjectList;
//      });
    },
    methods: {
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          leadsParam: this.Search.leadsParam,
          teacherParam: this.Search.teacherParam,
          checkStatus: this.Search.checkStatus,
          grade: this.Search.grade,
        });
      },
      addCourseOrderRequest(courseOrderRequestUuid){
        const _this = this;
        this.$Modal.confirm({
          title: '确认',
          content: '是否确认通过排正式课申请',
          onOk: () => {
            common.ajax({
              url: STUDY_COURSE().formalApply.editCourseOrderRequestStatus,
              data:{
                courseOrderRequestUuid:courseOrderRequestUuid,
              },
              success: function (res) {
                common.notices('操作成功！');
                _this.searchForm()
              }
            });
          },
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?leadsParam=${search.leadsParam}&teacherParam=${search.teacherParam}&checkStatus=${search.checkStatus}&grade=${search.grade}`
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: STUDY_COURSE().formalApply.dataGrid + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['courseOrderRequestVos'] || [];
            _this.total = res.data.total;
          }
        });
      },
      changeClassDate(value) {
        this.Search.courseDateStart = value[0] || '';
        this.Search.courseDateEnd = value[1] || '';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      reFresh(){
        this.searchForm();
      }
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470 : '';
      }
    },
    components: {OBreadcrumb,PageModel}
  };
</script>

<style scoped>
  .ivu-btn {
    margin: 3px 0;
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
