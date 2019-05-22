<template>
<div>
  <o-breadcrumb second="招师" third="待二次培训"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="24" class="right">
        <form id="searchForm">
          <i-input :size="$store.state.searchModuleSize" v-model="tcName" @on-keyup.enter="searchForm(1)" placeholder="老师姓名" style="width:150px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="phone" @on-keyup.enter="searchForm(1)" placeholder="手机号码" style="width:150px;margin-right:2px;"></i-input>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
        </form>
      </i-col>
    </Row>
  </div>
  <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>

  <giveup @reFresh="reFresh" ref="givup" from-type="secondTrain"></giveup>
</div>
</template>

<script type="text/ecmascript-6">
  import {ZHAO_TEACHER,TEACHER} from 'common/api/teacher.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import giveup from 'components/zhaoTeachers/giveup';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11: 17,
        tcName: '',
        phone: '',
        columns: [
          {
            title: '姓名',
            key: 'tcName',
            fixed: 'left',
            align:'center',
            width: 90,
            // render (row, column, index) {
            //   return `<strong><a href="javascript:GLOBAL.redirectTo('/teacher/teacherDetail/view/jianzhi','${row.uuid}');">${row.tcName}</a></strong>`;
            // },
            render:(h,params)=>{
              return h('div',[
                h('strong',[
                  h('a',{
                    attrs:{
                      href:'javascript:;'
                    },
                    on:{
                      click:()=>{
                        GLOBAL.redirectTo('/teacher/viewTeacherDetailByJianzhi',params.row.uuid)
                      }
                    }
                  },params.row.tcName)
                ])
              ])
            }
          },
          {
            title: '手机号',
            key: 'phone',
            width: 120,
            align:'center',
            // render (row, column, index) {
            //   return hideCharAtNumber(row.phone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.uuid}')" class="eye" title="显示全部"></Icon>`;
            // },
            render : (h, params) => {
              if(params.row.phone) {
                return h('div',[
                  h('span',hideCharAtNumber(params.row.phone)),
                  h('i',{
                    style:{
                      margin:'2px'
                    },
                    attrs:{
                      class:'ivu-icon ivu-icon-ios-eye',
                      title:'显示全部'
                    },
                    style:{
                      fontSize:'18px',
                      verticalAlign:'top',
                      cursor:'pointer'
                    },
                    on:{
                      click:()=>{
                        this.getFullPhone(params.row.uuid)
                      }
                    }
                  })
                ])
              }else{
                return '-';
              }
            }
          },
          {
            title: '邮箱',
            key: 'email',
            align:'center',
            width: 155
          },
          {
            title: '院校',
            key: 'schoolLocation',
            align:'center',
            width: 120
          },
          {
            title: 'QQ',
            key: 'qq',
            align:'center',
            width: 120
          },
          {
            title: '微信',
            key: 'wechat',
            align:'center',
            width: 120
          },
          {
            title: '工作性质',
            key: 'natureOfWorkDesc',
            align:'center',
            width: 100
          },
          {
            title: '第一科目',
            key: 'teachingSubject',
            align:'center',
            width: 90
          },
          {
            title: '推荐人',
            key: 'referral',
            align:'center',
            width: 90
          },
          {
            title: '入库时间',
            key: 'interviewDate',
            align:'center',
            width: 180,
            // render (row, column, index) {
            //   return formateDate(row.interviewDate,'yyyy-MM-dd hh:mm:ss');
            // },
            render:(h,params) =>{
              return h('div',[
                h('span',{},formateDate(params.row.interviewDate,'yyyy-MM-dd hh:mm:ss'))
              ])
            }
          },
          {
            title: '操作',
            align:'center',
            width: 90,
            // render (row, column, index) {
            //   return `<i-button type="error" size="small" icon="trash-b" title="放弃" @click="giveup('${row.uuid}','${row.tcName}','${row.phone}')"></i-button>
            //   <i-button type="success" size="small" icon="checkmark" title="培训通过" @click="pass('${row.uuid}')"></i-button>`;
            // },
            render : (h, params) => {
              return h('div',[
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    icon: 'trash-b',
                  },
                  attrs: {
                    title: '放弃',
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.giveup(params.row.uuid,params.row.tcName,params.row.phone);
                    }
                  }
                }),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    icon: 'checkmark',
                  },
                  attrs: {
                    title: '培训通过',
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.pass(params.row.uuid);
                    }
                  }
                })
              ])
            }
          }
        ]
      }
    },
    mounted() {
      this.searchForm();
    },
    methods: {
      pass(uuid) {
        const _this = this;
        this.$Modal.confirm({
          title: '确认',
          content: '确认老师培训通过吗？',
          onOk() {
            common.ajax({
              url: ZHAO_TEACHER().pass,
              method: 'get',
              data: {
                teacherUuid: uuid,
                interviewResult: 1,
                recordType: 4
              },
              success: function(response){
                common.notices('操作成功！');
                _this.searchForm();
              }
            });
          }
        });
      },
      getFullPhone(teacherUuid) {
        const _this = this;
        common.ajax({
          url: TEACHER().Public.fullPhone,
          method: 'get',
          data: { uuid: teacherUuid, moduleName: '招师-待二次培训' },
          success: function (res) {
            _this.$Modal.info({
              content: (res.data !== null) ? res.data.phone : ''
            });
          }
        })
      },
      giveup(uuid,tcName,phone) {
        this.$refs.givup.show(uuid,tcName,phone,'secondTrain');
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          tcName: this.tcName,
          phone: this.phone
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?tcName=${search.tcName}&phone=${search.phone}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}&type=1`;
        const _this = this;
        common.ajax({
          url: ZHAO_TEACHER().WaitSecondTrain.dataGrid + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['teacherList'] || [];
            _this.total = res.data.total;
          }
        });
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
      OBreadcrumb, giveup,PageModel
    }
  };
</script>

<style>

</style>
