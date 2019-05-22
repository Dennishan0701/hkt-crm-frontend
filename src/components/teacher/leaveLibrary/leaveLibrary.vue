<template>
<div>
  <o-breadcrumb second="师资管理" third="离职库"></o-breadcrumb>
  <div class="grid-widget right">
    <Row>
      <i-col span="24">
        <i-input :size="$store.state.searchModuleSize" v-model="Search.word" @on-keyup.enter="searchForm(1)" placeholder="老师姓名/手机号"
                 style="width:150px;margin-right:2px;"></i-input>
        <i-select :size="$store.state.searchModuleSize" v-model="Search.natureOfWork" placeholder="工作性质" style="width:172px" clearable>
          <i-option :value="1">社招全职</i-option>
          <i-option :value="2">兼职</i-option>
          <i-option :value="3">校招全职</i-option>
        </i-select>
        <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-end" @on-change="changePushDate"
                     placeholder="更新时间" style="width: 200px"></Date-picker>
        <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
      </i-col>
    </Row>
  </div>
  <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>
</div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {TEACHER} from 'common/api/teacher.js';
  import {formateDate, common, hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';
  export default{
    data() {
      return {
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        Search: {
          word: '',
          schoolLocation: '',
          natureOfWork: '',
          startDate: '',
          endDate: '',
        },
        schoolList: [],
        columns: [
          {
            title: '姓名',
            key: 'tcName',
            width: 90,
            align: 'center',
            // render (row, column, index) {
            //   return `<strong><a href="javascript:;" @click="viewDetail('${row.natureOfWork}','${row.uuid}')">${row.tcName}</a></strong>`;
            // },
            render:(h,params) => {
              return h('div',[
                h('strong',[
                  h('a',{
                    on:{
                      click:() => {
                        this.viewDetail(params.row.natureOfWork,params.row.uuid);x
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
            align: 'center',
            width: 120,
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
            title: '工作性质',
            align: 'center',
            key: 'natureOfWork',
            width: 100,
            render : (h, params) => {
              if(params.row.natureOfWork == 1){
                return h('div',[
                  h('span',{},'社招全职')
                ]);
              }else if(params.row.natureOfWork == 2){
                return h('div',[
                  h('span',{},'兼职')
                ]);
              } else if(params.row.natureOfWork == 3){
                return h('div',[
                  h('span',{},'校招全职')
                ]);
              }
            }
          },
          {
            title: '离职时间',
            key: 'teacherLeaveTime',
            align: 'center',
            width: 150,
            // render (row, column, index) {
            //   return formateDate(row.teacherLeaveTime, 'yyyy-MM-dd hh:mm:ss');
            // },
            render:(h,params) =>{
              return h('div',[
                h('span',{},formateDate(params.row.teacherLeaveTime,'yyyy-MM-dd hh:mm:ss'))
              ])
            }
          },
          {
            title: '时薪',
            key: 'hourlyWage',
            align: 'center',
            width: 90
          },
          {
            title: '操作',
            width: 100,
            align: 'center',
            // render (row, column, index) {
            //   return `<i-button type="warning" icon="arrow-return-right" title="激活" size="small" @click="interview('${row.uuid}','${row.tcName}','${row.natureOfWork}','${row.payGrade}')"></i-button>`;
            // },
            render : (h, params) => {
              return h('div',[
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small',
                    icon: 'arrow-return-right',
                  },
                  attrs: {
                    title: '激活',
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.interview(params.row.uuid,params.row.tcName,params.row.natureOfWork,params.row.payGrade);
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
      viewDetail(natureOfWorkDesc, uuid) {
        if (natureOfWorkDesc && natureOfWorkDesc.indexOf('兼职') !== -1) {
          GLOBAL.redirectTo('/teacher/viewTeacherDetailByJianzhi',uuid);
        }else if(natureOfWorkDesc && natureOfWorkDesc.indexOf('全职') !== -1) {
          GLOBAL.redirectTo('/teacher/viewTeacherDetailByQuanzhi',uuid);
        } else {
          common.msg('工作性质为空，无法查看详情');
        }
      },
      interview(uuid, tcName, natureOfWork, payGrade) {
        const _this = this;
        let title = natureOfWork == '2' ? '待邀约' : '待培训'
        this.$Modal.confirm({
          title: '确认',
          content: `您确认将<span style="color: red;">【${tcName}】</span>激活到` + title + '中？',
          onOk() {
            common.ajax({
              url: TEACHER().leaveLibrary.leaveTeacherActivate,
              method: 'post',
              data: {
                uuid: uuid,
                natureOfWork: natureOfWork + '',
                payGrade: payGrade == 'null' ? 0 : payGrade,
              },
              success: function (res) {
                console.log(res);
                common.notices('您可以到【招师流程】【'+ title +'】中查看', '操作成功');
                _this.searchForm();
              }
            });
          }
        });
      },
      getFullPhone(teacherUuid) {
        const _this = this;
        common.ajax({
          url: TEACHER().Public.displayPhone,
          method: 'get',
          data: {uuid: teacherUuid, moduleName: '师资管理-离职库'},
          success: function (res) {
            _this.$Modal.info({
              content: (res.data !== null) ? res.data.phone : ''
            });
          }
        })
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          word: this.Search.word,
          natureOfWork: this.Search.natureOfWork,
          startDate: this.Search.startDate,
          endDate: this.Search.endDate,
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?word=${search.word}&natureOfWork=${search.natureOfWork}&startDate=${search.startDate}&endDate=${search.endDate}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: TEACHER().leaveLibrary.dataGrid + param,
          success: function (response) {
            _this.data = response.data.list || [];
            _this.total = response.data.total;
          }
        });
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      changePushDate(value) {
        this.Search.startDate = value[0] || '';
        this.Search.endDate = value[1] || '';
      },
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470 : '';
      }
    },
    components: {OBreadcrumb,PageModel}
  };
</script>

<style>

</style>
