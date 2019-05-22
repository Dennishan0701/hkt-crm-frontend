<template>
  <div>
    <o-breadcrumb second="全职老师" third="待培训"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <form id="searchForm">
            <i-input v-model="tcName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="老师姓名" style="width:150px;margin-right: 2px;"></i-input>
            <i-input v-model="phone" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="手机号码" style="width:150px;margin-right:3px;"></i-input>
            <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索</i-button>
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
    </checkbox-group>
    <i-table :content="self" size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
    <revise-time @reFresh="reFresh"  ref="revise" ></revise-time>
  </div>
</template>

<script type="text/ecmascript-6">
  import {ZHAO_TEACHER,TEACHER} from 'common/api/teacher.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import reviseTime from './reviseTime.vue';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        self: this,
        tableColumnsChecked:['phone','email','schoolLocation','qq','wechat','natureOfWorkDesc','teachingSubject','referral','interviewDate','account','trainingDate','caozuo'],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        tcName: '',
        phone: '',
        columns:[],
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
              align: 'center',
              fixed: 'left',
              minWidth: 120,
              render(h, params) {
                return h('div',[
                  h('a',{
                    on:{
                      click:()=>{
                      GLOBAL.redirectTo('teacher/viewTeacherDetailByQuanzhi',params.row.uuid)
                  }
              }
              },params.row.tcName)
              ])

//                return `<strong><a href="javascript:GLOBAL.redirectTo('/teacher/teacherDetail/view/quanzhi','${row.uuid}');">${row.tcName}</a></strong>`;
            }
          },
          phone: {
            title: '手机号',
            key: 'phone',
            minWidth: 120,
            align: 'center',
            render : (h, params) => {
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
//              return hideCharAtNumber(row.phone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.uuid}')" class="eye" title="显示全部"></Icon>`;
            }
          },
          email: {
            title: '邮箱',
              key: 'email',
              align: 'center',
            minWidth: 155
          },
          schoolLocation: {
            title: '院校',
              key: 'schoolLocation',
              align: 'center',
            minWidth: 120
          },
          qq: {
            title: 'QQ',
              key: 'qq',
              align: 'center',
            minWidth: 120
          },
          wechat: {
            title: '微信',
              key: 'wechat',
              align: 'center',
            minWidth: 120
          },
          natureOfWorkDesc: {
            title: '工作性质',
              key: 'natureOfWorkDesc',
              align: 'center',
            minWidth: 100,
          },
          teachingSubject: {
            title: '第一科目',
              key: 'teachingSubject',
              align: 'center',
            minWidth: 90
          },
          referral: {
            title: '推荐人',
              key: 'referral',
              align: 'center',
            minWidth: 90
          },
          interviewDate: {
            title: '面试通过时间',
              key: 'interviewDate',
              align: 'center',
            minWidth: 180,
              render(h, params) {
              return h('span',formateDate(params.row.interviewDate, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          account: {
            title: '培训账号',
              key: 'account',
              align: 'center',
            minWidth: 100
          },
          trainingDate: {
            title: '培训时间',
              key: 'trainingDate',
              align: 'center',
            minWidth: 180
          },
          // {
          //   title: '&nbsp;',
          //   key: '',
          //   width: 30,
          // },
          caozuo: {
            title: '操作',
              key: 'caozuo',
              align: 'center',
            minWidth: 120,
              fixed: 'right',
              render : (h, params) => {

              return h('div',[
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    icon: 'checkmark',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs:{
                    title:'培训通过'
                  },
                  on: {
                    click: () => {
                    this.pass(params.row.uuid)
                }
            }
            }),
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small',
                    icon: 'arrow-swap',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs:{
                    title:'调整'
                  },
                  on: {
                    click: () => {
                    this.revise(params.row.trainingAccountId,params.row.natureOfWorkDesc,params.row.account,params.row.uuid)
                }
            }
            }),
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small',
                    icon: 'edit',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs:{
                    title:'编辑资料'
                  },
                  on: {
                    click: () => {
                    this.editProfile(params.row.uuid,params.row.id)
                }
            }
            })
            ])
//              return `<i-button type="success" size="small" icon="checkmark" title="培训通过" @click="pass('${row.uuid}')"></i-button>
//              <i-button type="warning" size="small" icon="arrow-swap" title="调整" @click="revise('${row.trainingAccountId}','${row.natureOfWorkDesc}','${row.account}','${row.uuid}')"></i-button>
//              <i-button type="info" size="small" icon="edit" title="编辑资料" @click="editProfile('${row.uuid}','${row.id}')"></i-button>`;
            }
          }
        };
        let datas = [columns.tcName];
        this.tableColumnsChecked.forEach(col => datas.push(columns[col]));
        return datas;
      },
      pass(uuid) {
        const _this = this;
        this.$Modal.confirm({
          title: '确认',
          content: '确认老师培训通过吗？',
          onOk() {
            // common.ajax({
            //   url: ZHAO_TEACHER().fullTimeTeacher.passTraining,
            //   method: 'get',
            //   data: {
            //     teacherUuid: uuid
            //   },
            //   success: function(response){
            //     common.notices('操作成功！');
            //     _this.searchForm();
            //   }
            // });
            this.$axios.get( ZHAO_TEACHER().fullTimeTeacher.passTraining,{
              params:{
                teacherUuid: uuid
              }
            }).then( () => {
              common.notices('操作成功！');
              _this.searchForm();
            })
          }
        });
      },
      revise(trainingAccountId,natureOfWorkDesc,account,uuid) {
        this.$refs.revise.show(trainingAccountId,natureOfWorkDesc,account,uuid);
      },
      getFullPhone(teacherUuid) {
        const _this = this;
        // common.ajax({
        //   url: TEACHER().Public.fullPhone,
        //   method: 'get',
        //   data: { uuid: teacherUuid, moduleName: '招师-待培训' },
        //   success: function (res) {
        //     _this.$Modal.info({
        //       content: (res.data !== null) ? res.data.phone : ''
        //     });
        //   }
        // })
        this.$axios.get(TEACHER().Public.fullPhone,{
          params:{
            uuid: teacherUuid,
            moduleName: '招师-待培训'
          }
        }).then( ({data}) => {
            _this.$Modal.info({
              content: (data.data !== null) ? data.data.phone : ''
            });
        })
      },
      editProfile(uuid, id) {
        sessionStorage.setItem('template_uuid',uuid);
        sessionStorage.setItem('template_id',id);
        location.hash = '/teacher/teacherDetailByQuanzhi/waitTrain';
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
        // common.ajax({
        //   url: ZHAO_TEACHER().fullTimeTeacher.dataGrid + param,
        //   method: 'get',
        //   success: function (res) {
        //     _this.data = res.data['teacherList'] || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get(  ZHAO_TEACHER().fullTimeTeacher.dataGrid + param,{
        }).then( ({data}) => {
          _this.data = data.data['teacherList'] || [];
          _this.total = data.data.total;
        })
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
    components: { OBreadcrumb , reviseTime ,PageModel}
  };
</script>

<style>

</style>
