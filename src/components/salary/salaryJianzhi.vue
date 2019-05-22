<template>
  <div>
    <o-breadcrumb second="新增管理" third="等级时薪管理-兼职"></o-breadcrumb>
    <div class="grid-widget">
      <i-button :size="$store.state.searchModuleSize" type="primary" icon="plus" size="small" @click="showAdd">新增</i-button>
    </div>
    <div class="grid-widget">
      <Radio-group :size="$store.state.searchModuleSize" v-model="gradeType" @on-change="changeGradeType">
        <Radio label="">全部</Radio>
        <Radio label="2">普通</Radio>
        <Radio label="1">清北</Radio>
      </Radio-group>
    </div>
    <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :current="pageIndex" :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>


    <edit ref='edit' @reFresh="reFresh"  nature-of-work="等级时薪管理-兼职"></edit>
    <add ref='add' @reFresh="reFresh"  nature-of-work="等级时薪管理-兼职"></add>
  </div>

</template>

<script type="text/ecmascript-6">
  import {SALARY} from 'common/api/salary.js';
  import {formateDate,common} from 'common/js/common.js';
  import add from 'components/salary/add';
  import edit from 'components/salary/edit';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';
  export default{
    data() {
      return {
        data: [],
        total: 0,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        uuid: '',
        gradeType: "",
        editModal: false,
        addModal: false,
        loading: true,
        modalTitle: '编辑等级时薪',
        validateItem: {
          gradeType: '2',
          grade: '',
          hourlyWage: '',
          description: ''
        },
        ruleValidate: {
          grade: [
            {required: true, message: '请选择等级', trigger: 'change'}
          ],
          hourlyWage: [
            {required: true, type: 'number', message: '请填写时薪，只能是数字', trigger: 'blur'}
          ]
        },
        columns: [
          {
            title: '类型',
            align: 'center',
            key: 'gradeTypeDesc',
            minWidth:90,
          },
          {
            title: '等级',
            align: 'center',
            key: 'grade',
            minWidth:90,
          },
          {
            title: '时薪（元/h）',
            align: 'center',
            key: 'hourlyWage',
            minWidth:90,
          },
          {
            title: '工作类型',
            align: 'center',
            key: 'natureOfWorkDesc',
            minWidth:90,
          },
          {
            title: '描述',
            key: 'description',
            minWidth:90,
          },
          {
            title: '状态',
            key: 'gradeStatus',
            align: 'center',
            minWidth:90,
            render : (h, params) => {
              if(params.row.gradeStatus == 0) {
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag green'
                    }
                  },'使用中')
                ])
//        return `<span class="o-tag green">使用中</span>`;
              } else if(params.row.gradeStatus == 1) {
                  return h('div',[
                    h('span',{
                      attrs:{
                        class:'o-tag black'
                      }
                    },'不可用')
                  ])
//                return `<span class="o-tag black">不可用</span>`;
              } else {
                return params.row.gradeStatus;
              }
            }
          },
          {
            title: '更新时间',
            key: 'updateDate',
            align: 'center',
            minWidth:150,
            render(h, params) {
              return h('span',formateDate(params.row.updateDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '创建时间',
            key: 'createDate',
            align: 'center',
            minWidth:150,
            render(h, params) {
              return h('span',formateDate(params.row.createDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '操作',
            align: 'center',
            minWidth:120,
            render : (h, params) => {
              if(params.row.gradeStatus == 0) {

                return h('div',[
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                      icon: 'edit',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs:{
                      title:'编辑'
                    },

                    on: {
                      click: () => {
                      this.showEdit(params.row.id)
                  }
              }
              }),
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small',
                      icon: 'stop',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs:{
                      title:'停用'
                    },

                    on: {
                      click: () => {
                      this.switchStatus(params.row.id,'stop')
                  }
              }
              })
              ])
//                return `<i-button type="primary" size="small" icon="edit" title="编辑" @click="showEdit('${row.id}')"></i-button>
//                <i-button type="error" size="small" icon="stop" title="停用" @click="switchStatus('${row.id}','stop')"></i-button>`;
              } else {

                return h('div',[
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                      icon: 'edit',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs:{
                      title:'编辑'
                    },

                    on: {
                      click: () => {
                      this.showEdit(params.row.id)
                  }
              }
              }),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    icon: 'play',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs:{
                    title:'启用'
                  },

                  on: {
                    click: () => {
                    this.switchStatus(params.row.id,'start')
                }
              }
              })
              ])
//                return `<i-button type="primary" size="small" icon="edit" title="编辑" @click="showEdit('${row.id}')"></i-button>
//                <i-button type="success" size="small" icon="play" title="启用" @click="switchStatus('${row.id}','start')"></i-button>`;
              }
            }
          }
        ]
      }
    },
    mounted() {
      this.searchForm();
    },
    methods: {
      showAdd() {
        this.$refs.add.show();
      },
      showEdit(id) {
        this.$refs.edit.show(id);
      },
      switchStatus(id, status) {
        const _this = this;
        let text = (status === 'stop') ? '停用': '启用';
        let gradeStatus = (status === 'stop') ? 1: 0;
        this.$Modal.confirm({
          title: '确认',
          content: `您确认【${text}】该等级时薪？`,
          onOk() {
            common.ajax({
              url: SALARY().Level.updateStatus,
              data: {
                id: id,
                gradeStatus: gradeStatus,
                gradeType: '',
                grade: '',
                hourlyWage: '',
                description: '',
              },
              success: function(response){
                common.notices('操作成功');
                _this.searchForm();
              }
            });
          }
        });
      },
      searchForm() {
        this.loadDataGrid({
          gradeType: this.gradeType
        });
      },
      loadDataGrid(search, pageIndex = 1, orderBy = '', sortBy = '') {
        let param = `?natureOfWork=2&gradeType=${search.gradeType}`;
        param += `&pageIndex=${pageIndex}&pageNumber=${this.pageNumber}`;
        const _this = this;
        common.ajax({
          url: SALARY().Level.dataGrid + param,
          method: 'get',
          success: function(response){
            _this.data = response.data.gradeList;
            _this.total = response.data.total;
          }
        });
      },
      changeGradeType(value) {
        this.loadDataGrid({
          gradeType: value
        });
      },
      pageChange(pageIndex) {
        this.loadDataGrid({
          gradeType: this.gradeType
        },pageIndex);
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
    components: { OBreadcrumb, add, edit,PageModel }
  };
</script>

<style scoped>

</style>
