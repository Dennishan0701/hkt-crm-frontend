<template>
<div>
  <o-breadcrumb second="课耗管理" third="课程管理"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="24" class="right">
        <form>
          <i-input v-model="Search.leadsParam" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="
学生姓名/手机号"style="width:150px;margin-right: 2px;"></i-input>
          <i-input v-model="Search.teacherParam" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="老师姓名/手机号" style="width:200px;margin-right:2px;"></i-input>
          <i-select v-model="Search.grade" :size="$store.state.searchModuleSize" clearable placeholder="年級" style="width:100px">
            <i-option v-for='(item,index) in gradeList' :key='index' :value=item.value>{{item.value}}</i-option>
          </i-select>
          <i-select v-model="Search.subject" :size="$store.state.searchModuleSize" clearable placeholder="科目" style="width:100px">
            <i-option v-for='(item,index) in subjectList' :value=item.value :key='index'>{{item.value}}</i-option>
          </i-select>
        </form>
      </i-col>
      <i-col span=24 class="right">
        <Date-picker type="daterange" :size="$store.state.searchModuleSize" placement="bottom-end" @on-change="changeUpdateDate" placeholder="上课日期" style="width: 200px"></Date-picker>
        <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索</i-button>
      </i-col>
    </Row>
  </div>
  <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>
  <course-revise-modal @reFresh="reFresh"  ref="revise"></course-revise-modal>
</div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {Course_Cast} from 'common/api/teacher.js';
  import {formateDate,common,hideCharAtNumber,getFullPhone} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import courseReviseModal from 'components/courseCast/courseRevise/courseReviseModal';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        loading: true,
        modal: false,
        data: [],
        gradeList: [],
        subjectList: [],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        Search: {
          leadsParam: '',
          teacherParam: '',
          grade: '',
          subject: '',
          courseStartDate: '',
          courseEndDate: '',
        },
        columns: [
          {
            title: '序号',
            align:'center',
            type:'index',
            width:40,
          },
          {
            title: '学生',
            key: 'leadsName',
            align:'center',
            width:90,
          },
          {
            title: '老师',
            key: 'teacherName',
            align:'center',
            width:90,
          },
          {
            title: '年级',
            key: 'grade',
            align:'center',
            width:90,
          },
          {
            title: '科目',
            key: 'subject',
            align:'center',
            width:90,
          },
          {
            title: '上课日期',
            key: 'courseDate',
            align:'center',
            width:160,
            render (h, params) {
              return h('span',formateDate(params.row.courseDate,'yyyy-MM-dd'));
            }
          },
          {
            title: '开始时间',
            key: 'startTime',
            align:'center',
            width:90,
          },
          {
            title: '结束时间',
            key: 'endTime',
            align:'center',
            width:90,
          },
          {
            title: '时长（h）',
            key: 'length',
            align:'center',
            width:90,
          },
          {
            title: '状态',
            key: 'status',
            align:'center',
            width:90,
            render(h,params){
              if(params.row.status){
                return h('div',[
                  h('Button', {
                    attrs: {
                      class: 'o-tag green'
                    },
                    style: {
                      margin: '2px',
                    },
                  },'正常')
                ])
//                return `<span class="o-tag green">正常</span>`
              }else {
                return h('div',[
                  h('Button', {
                    attrs: {
                      class: 'o-tag red'
                    },
                    style: {
                      margin: '2px',
                    },
                  },'已作废')
                ])
//                return `<span class="o-tag red">已作废</span>`
              }
            }
          },
          {
            title: '操作',
            width: 120,
            key: 'payUuid',
            align:'center',
            render : (h, params) => {
              return h('div',[
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'arrow-swap',
                  },
                  attrs: {
                    title: '调课',
                    disabled: params.row.status==false?true:false,
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.show(params.row.courseUuid,params.row.courseOrderUuid,params.row.courseRequestUuid,params.row.payUuid,params.row.courseType,params.row.saleUserUuid,params.row.teacherUuid,params.row.leadsUuid)
                    }
                  }
                }),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    icon: 'trash-b',
                  },
                  attrs: {
                    title: '作废',
                    disabled: params.row.status==false?true:false,
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.showInvalid(params.row.courseUuid)
                    }
                  }
                })
              ])

//                return `<i-button type="primary" size="small" :disabled='${row.status==false?true:false}' icon="arrow-swap" title="调课" @click="show('${row.courseUuid}','${row.courseOrderUuid}','${row.courseRequestUuid}','${row.payUuid}','${row.courseType}','${row.saleUserUuid}','${row.teacherUuid}','${row.leadsUuid}')"></i-button>
//                        <i-button type="error" size="small" :disabled='${row.status==false?true:false}' icon="trash-b" title="作废" @click="showInvalid('${row.courseUuid}')"></i-button>`;
            }
          }
        ],
      }
    },
    mounted() {
      const _this = this;
      this.searchForm();
      $.getJSON('static/data.json',function (res) {
        _this.gradeList = res.gradeList;
        _this.subjectList = res.subjectList;
      })
    },
    methods: {
      searchForm(val) {
        if(val) this.pageIndex = val;
        let leadsParam = this.Search.leadsParam,teacherParam = this.Search.teacherParam;
        let leadsName = '', leadsPhone = '',teacherName = '', teacherPhone = '';
        if (!leadsParam) leadsParam = '';

        if (!teacherParam) teacherParam = '';

        if (isNaN(leadsParam)) {
          leadsName = leadsParam;
        } else {
          leadsPhone = leadsParam;
        }
        if (isNaN(teacherParam)) {
          teacherName = teacherParam;
        } else {
          teacherPhone = teacherParam;
        }
        this.loadDataGrid({
          leadsName: leadsName,
          leadsPhone: leadsPhone,
          teacherName: teacherName,
          teacherPhone: teacherPhone,
          grade: this.Search.grade,
          subject: this.Search.subject,
          courseStartTime: this.Search.courseStartDate,
          courseEndTime: this.Search.courseEndDate,
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?leadsName=${search.leadsName}&leadsPhone=${search.leadsPhone}&teacherName=${search.teacherName}&teacherPhone=${search.teacherPhone}&grade=${search.grade}&subject=${search.subject}&courseStartTime=${search.courseStartTime}&courseEndTime=${search.courseEndTime}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: Course_Cast().courseRevise.dataGrid + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['courseAdjustmentVos'] || [];
            _this.total = res.data.total;
          }
        });
      },
//      调课
      show(courseUuid,courseOrderUuid,courseRequestUuid,payUuid,courseType,saleUserUuid,teacherUuid,leadsUuid){
          this.$refs.revise.show(courseUuid,courseOrderUuid,courseRequestUuid,payUuid,courseType,saleUserUuid,teacherUuid,leadsUuid)
      },
//      作废
      showInvalid(courseUuid){
        const _this = this;
        this.$Modal.confirm({
          title: '确认',
          content: '确认作废嘛？',
          onOk() {
            common.ajax({
              url: Course_Cast().courseRevise.editCourseStatus,
              data:{
                courseUuid:courseUuid,
                status:0,
              },
              success: function (res) {
                common.notices('操作成功！');
                _this.searchForm();
              }
            });
          }
        });
      },
      getFullPhone(phone) {
        getFullPhone(phone, COMMON_API().Phone.getFullPhone);
      },
      changeUpdateDate(value) {
        this.Search.courseStartDate = value[0] || '';
        this.Search.courseEndDate = value[1] || '';
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
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470: '';
      }
    },
    components: {
      OBreadcrumb, courseReviseModal,PageModel
    }
  };
</script>

<style>

</style>
