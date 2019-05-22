<template>
<div>
  <o-breadcrumb second="招师代理" third="级别薪资管理"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="6">
        <i-button :size="$store.state.searchModuleSize" type="primary" icon="plus" @click="showAdd">新增</i-button>
      </i-col>
      <i-col span="18" class="right">
        <i-input :size="$store.state.searchModuleSize" v-model="grade" placeholder="级别" style="width:150px;margin-right:2px;"></i-input>
        <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
      </i-col>
    </Row>
  </div>
  <i-table size="small" highlight-row stripe :columns="columns" :data="data" @on-current-change="currentData"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :current="pageIndex" :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>

  <add @reFresh="reFresh" ref="add"></add>
  <edit @reFresh="reFresh" ref="edit"></edit>
</div>

</template>

<script type="text/ecmascript-6">
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import add from './add';
  import edit from './edit';
  import {AGENT_TEACHER} from 'common/api/teacher.js';
  import {formateDate,common} from 'common/js/common.js';
  import PageModel from 'dashborader/page/page.vue';
  export default{
    data() {
      return {
        uuid: '',
        grade: '',
        currentRowData: {},
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: 10,
        columns: [
          {
            title: '级别',
            key: 'grade',
            align:'center',
            minWidth:90,
          },
          {
            title: '薪资（元/人）',
            key: 'salary',
            align:'center',
            minWidth:120,
          },
          {
            title: '指标（人/月）',
            key: 'task',
            align:'center',
            minWidth:120,
          },
          {
            title: '描述',
            key: 'description',
            align:'center',
            minWidth:120,
            render : (h, params) => {

              let content = params.row.description;
              if(content && content.length>38) {
                content = content.slice(0,37)+'...';
                return h('div',[
                  h('span',{
                    attrs:{
                      title:params.row.description
                    }
                  },content)
                ])
//                return `<span title="${row.description}">${content}</span>`;
              } else {
                return h('span',content);
              }
            }
          },
          {
            title: '状态',
            key: 'gradeStatusDesc',
            align:'center',
            minWidth:60,
          },
          {
            title: '更新时间',
            key: 'updateDate',
            align:'center',
            minWidth:150,
            render(h, params) {
              return h('span',formateDate(params.row.updateDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '创建时间',
            key: 'createDate',
            align:'center',
            minWidth:150,
            render(h, params) {
                return h('span',formateDate(params.row.createDate,'yyyy-MM-dd hh:mm:ss'))
            }
          },
          {
            title:'操作',
            key: 'action',
            align: 'center',
            minWidth:120,
            render : (h, params) => {

//              if(params.row.gradeStatus === 1) {
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
                        this.showEdit(params.row.id,params.row.gradeStatus)
                      }
                    }
                  }),
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small',
                      icon: 'edit',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs:{
                    },
                    on: {
                      click: () => {
                        let par = params.row.gradeStatus==1?'start':'stop'
                        this.updateStatus(params.row.id,par)
                      }
                    }
                  },params.row.gradeStatus==1?'启用':'停用')
                ])
//                return `<i-button type="primary" size="small" icon="edit" title="编辑" @click="showEdit('${row.id}','${row.gradeStatus}')"></i-button>
//                        <i-button type="success" size="small" @click="updateStatus('${row.id}','start')">启用</i-button>`;
//              }else if(params.row.gradeStatus === 0) {
//                return `<i-button type="primary" size="small" icon="edit" title="编辑" @click="showEdit('${row.id}','${row.gradeStatus}')"></i-button>
//                        <i-button type="error" size="small" @click="updateStatus('${row.id}','stop')">停用</i-button>`;
//              }
            }
          }
        ]
      }
    },
    mounted() {
      this.loadDataGrid({ channelName:'' });
    },
    methods: {
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?grade=${search.channelName}&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}`;
        let apiUrl = AGENT_TEACHER().getAgentGradePage+param;
        const _this = this;
        common.ajax({
          url: apiUrl,
          method: 'get',
          success: function(res){
            _this.data = res.data.agentGradeList || [];
            _this.total = res.data.total;
          }
        });
      },
      updateStatus(promotionUuid, flag) {
        const _this = this;
        let statusText = (flag === 'stop') ? '停用': '启用';
        let status =  (flag === 'stop') ? 1: 0;
        this.$Modal.confirm({
          title: '确认',
          content: '确认' + statusText + '该代理级别吗？',
          onOk: function () {
            common.ajax({
              url: AGENT_TEACHER().updateAgentGradeStatus,
              data: {
                id: promotionUuid,
                gradeStatus: status
              },
              success: function(response){
                common.notices('操作成功！');
                _this.searchForm();
              }
            });
          }
        });
      },
      showAdd() {
        this.$refs.add.show();
      },
      showEdit(uuid,gradeStatusDesc) {
        this.$refs.edit.show(uuid,gradeStatusDesc);
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({channelName: this.grade});
      },
      currentData(currentRow) {
        this.currentRowData = currentRow;
      },
      pageChange(pageIndex){
        this.pageIndex = pageIndex;
        this.loadDataGrid({channelName: this.grade});
      },
      reFresh(){
        this.loadDataGrid({channelName: this.grade});
      }
    },
    components: {
      OBreadcrumb,
      add,
      edit
      ,PageModel
    }
  };
</script>

<style>

</style>
