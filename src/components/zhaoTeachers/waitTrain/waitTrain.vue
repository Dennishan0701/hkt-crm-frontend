<template>
  <div>
    <o-breadcrumb second="招师" third="待培训"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <form id="searchForm">
            <i-input :size="$store.state.searchModuleSize" v-model="tcName" @on-keyup.enter="searchForm(1)" placeholder="老师姓名" style="width:150px;margin-right: 2px;"></i-input>
            <i-input :size="$store.state.searchModuleSize" v-model="phone" @on-keyup.enter="searchForm(1)" placeholder="手机号码" style="width:150px;margin-right:3px;"></i-input>
            <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
          </form>
        </i-col>
      </Row>
    </div>
    <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
      <checkbox label="phone">手机号</checkbox>
      <checkbox label="email">邮箱</checkbox>
      <checkbox label="schoolLocation">院校</checkbox>
      <checkbox label="qq">QQ</checkbox>
      <checkbox label="wechat">微信</checkbox>
      <checkbox label="natureOfWorkDesc">工作性质</checkbox>
      <checkbox label="teachingSubject">第一科目</checkbox>
      <checkbox label="referral">推荐人</checkbox>
      <checkbox label="interviewDate">面试通过时间</checkbox>
      <checkbox label="account">培训账号</checkbox>
      <checkbox label="trainingDate">培训时间</checkbox>
      <checkbox label="sumScore">培训得分</checkbox>
    </checkbox-group>
    <i-table size="small" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>-->
    </div>

    <giveup @reFresh="reFresh" ref="givup" from-type="train"></giveup>
    <revise-time @reFresh="reFresh" ref="revise"></revise-time>
    <pass-training @reFresh="reFresh" ref="training"></pass-training>
  </div>
</template>

<script type="text/ecmascript-6">
  import {ZHAO_TEACHER,TEACHER} from 'common/api/teacher.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import giveup from 'components/zhaoTeachers/giveup';
  import reviseTime from './reviseTime.vue';
  import passTraining from './passTraining.vue';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        tableColumnsChecked:['phone','email','schoolLocation','qq','wechat','natureOfWorkDesc','teachingSubject','referral','interviewDate','account','trainingDate','sumScore','action'],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11: 17,
        tcName: '',
        phone: '',
        columns: [],
      }
    },
    mounted() {
      this.changeTableColumns();
      this.searchForm();
    },
    methods: {
      getTableColumns () {
        const columns = {
          tcName: {
            title: '姓名',
            key: 'tcName',
            fixed: 'left',
            align:'center',
            width: 90,
            // render (row, column, index) {
            //   return `<strong><a href="javascript:GLOBAL.redirectTo('/teacher/teacherDetail/view/jianzhi','${row.uuid}');">${row.tcName}</a></strong>`;
            // },
            render:(h,params) => {
              return h('div',[
                h('strong',[
                  h('a',{
                    on:{
                      click:() => {
                        GLOBAL.redirectTo('/teacher/viewTeacherDetailByJianzhi',params.row.uuid);
                      }
                    }
                  },params.row.tcName)
                ])
              ])
            }
          },
          phone: {
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
          email: {
            title: '邮箱',
            key: 'email',
            align: 'center',
            width: 155
          },
          schoolLocation: {
            title: '院校',
            key: 'schoolLocation',
            align: 'center',
            width: 120
          },
          qq: {
            title: 'QQ',
            key: 'qq',
            align: 'center',
            width: 120
          },
          wechat: {
            title: '微信',
            key: 'wechat',
            align: 'center',
            width: 120
          },
          natureOfWorkDesc: {
            title: '工作性质',
            key: 'natureOfWorkDesc',
            align: 'center',
            width: 100,
          },
          teachingSubject: {
            title: '第一科目',
            key: 'teachingSubject',
            align: 'center',
            width: 90
          },
          referral: {
            title: '推荐人',
            key: 'referral',
            align: 'center',
            width: 90
          },
          interviewDate: {
            title: '面试通过时间',
            key: 'interviewDate',
            // align: 'center',
            width: 180,
            // render(row, column, index) {
            //   return formateDate(row.interviewDate, 'yyyy-MM-dd hh:mm:ss');
            // },
            render:(h,params) =>{
              return h('div',[
                h('span',{},formateDate(params.row.interviewDate,'yyyy-MM-dd hh:mm:ss'))
              ])
            }
          },
          account: {
            title: '培训账号',
            key: 'account',
            align: 'center',
            width: 100
          },
          trainingDate: {
            title: '培训时间',
            key: 'trainingDate',
            align: 'center',
            width: 180
          },
          sumScore:{
          title: '培训得分',
          key: 'sumScore',
          align:'center',
          width: 120,
          // render (row, column, index) {
          //   var hostname = window.location.hostname;
          //   var url = 'https://www.onlyeduhi.cn/t/exam/index.html';
          //   if(hostname === 'crm.onlyhi.cn') {  //正式环境
          //     url = 'https://www.onlyhi.cn/t/exam/index.html';
          //   } else if(hostname === 'crm.haiketang.net') {//搬迁环境
          //     url = 'https://www.onlyhi.cn/t/exam/index.html';
          //   }  else if(hostname === 'admin.onlyeduhi.cn') {//公网测试环境
          //     url = 'http://www.onlyeduhi.cn/t/exam/index.html';
          //   }
          //   return `<a target=_blank href="${url}?number=${row.trainingQuestionNumber||''}">${row.sumScore||''}</a>`
          // },
          render:(h,params)=>{
            var hostname = window.location.hostname;
            var url = 'https://www.onlyeduhi.cn/t/exam/index.html';
            if(hostname === 'crm.onlyhi.cn') {  //正式环境
              url = 'https://www.onlyhi.cn/t/exam/index.html';
            } else if(hostname === 'crm.haiketang.net') {//搬迁环境
              url = 'https://www.onlyhi.cn/t/exam/index.html';
            }  else if(hostname === 'admin.onlyeduhi.cn') {//公网测试环境
              url = 'http://www.onlyeduhi.cn/t/exam/index.html';
            }
            return h('div',[
              h('a',{
                attrs:{
                  // target:'_blank',
                  href: url + '?number=' + params.row.trainingQuestionNumber||''
                },
              },params.row.sumScore||'')
            ])
          }
        },
          action: {
            title: '操作',
            key:'action',
            align: 'center',
            width: 160,
            fixed:'right',
            className:'td-height',
            // render (row, column, index) {
            //   return `<i-button type="success" size="small" icon="checkmark" title="培训通过" @click="pass('${row.uuid}','${row.tcName}','${row.phone}')"></i-button>
            //   <i-button type="warning" size="small" icon="arrow-swap" title="调整" @click="revise('${row.trainingAccountId}','${row.natureOfWorkDesc}')"></i-button>
            //   <i-button type="info" size="small" icon="edit" title="编辑资料" @click="editProfile('${row.uuid}','${row.id}')"></i-button>
            //   <i-button type="error" size="small" icon="trash-b" title="放弃" @click="giveup('${row.uuid}','${row.tcName}','${row.phone}')"></i-button>`;
            // },
            render : (h, params) => {
              return h('div',[
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
                      this.pass(params.row.uuid,params.row.tcName,params.row.phone);
                    }
                  }
                }),
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small',
                    icon: 'arrow-swap',
                  },
                  attrs: {
                    title: '调整',
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.revise(params.row.trainingAccountId,params.row.natureOfWorkDesc);
                    }
                  }
                }),
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small',
                    icon: 'edit',
                  },
                  attrs: {
                    title: '编辑资料',
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.editProfile(params.row.uuid,params.row.id);
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
              ])
            }
          }
        };
        let datas = [columns.tcName];
        this.tableColumnsChecked.forEach(col => datas.push(columns[col]));
        return datas;
      },
      pass(uuid,tcName,phone) {
        this.$refs.training.show(uuid,tcName,phone);
      },
      revise(trainingAccountId,natureOfWorkDesc) {
        this.$refs.revise.show(trainingAccountId,natureOfWorkDesc);
      },
      getFullPhone(teacherUuid) {
        const _this = this;
        common.ajax({
          url: TEACHER().Public.fullPhone,
          method: 'get',
          data: { uuid: teacherUuid, moduleName: '招师-待培训' },
          success: function (res) {
            _this.$Modal.info({
              content: (res.data !== null) ? res.data.phone : ''
            });
          }
        })
      },
      giveup(uuid,tcName,phone) {
        this.$refs.givup.show(uuid,tcName,phone,'waitTrain');
      },
      editProfile(uuid, id) {
        sessionStorage.setItem('template_uuid',uuid);
        sessionStorage.setItem('template_id',id);
        location.hash = '/teacher/teacherDetailByJianzhi';
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
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: ZHAO_TEACHER().WaitTrain.dataGrid + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['teacherList'];
            _this.total = res.data.total;
          }
        });
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      changeTableColumns () {
        this.columns = this.getTableColumns();
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
    components: { OBreadcrumb, giveup, reviseTime , passTraining,PageModel,PageModel}
  };
</script>

<style scoped>
  .td-height{

  }
</style>
