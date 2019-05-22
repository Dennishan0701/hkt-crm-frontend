<template>
 <div>
   <o-breadcrumb second="招师代理" third="代理回收站"></o-breadcrumb>
   <div class="grid-widget">
     <Row>
       <i-col span="24" class="right">
         <form id="searchForm">
           <i-input :size="$store.state.searchModuleSize" v-model="Search.params" @on-keyup.enter="searchForm(1)" placeholder="代理名称/手机号/代理学校" style="width:200px;margin-right:2px;"></i-input>
           <i-input :size="$store.state.searchModuleSize" v-model="Search.parentName" @on-keyup.enter="searchForm(1)" placeholder="上级代理" style="width:100px;margin-right:2px;"></i-input>
           <i-select :size="$store.state.searchModuleSize" v-model="Search.agentType" clearable placeholder="招师方向" style="width:100px">
             <i-option v-for="(item,index) in agentTypeList" :key='index' :value="item.uuid">{{item.enumValue}}</i-option>
           </i-select>
           <Checkbox :size="$store.state.searchModuleSize" :checked="Search.isViewTotalAgent">只看总代理</Checkbox>
           <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
         </form>
       </i-col>
     </Row>
   </div>
   <i-table size="small" :height="theight" highlight-row :columns="columns" :data="data" @on-row-click="selectDataRow"></i-table>
   <div class="gridPage">
     <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
     <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
   </div>

 </div>
</template>

<script type="text/ecmascript-6">
  import {ZHAO_TEACHER} from 'common/api/teacher.js';
  import {formateDate,common} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11: 17,
        Search: {
          params: '',
          parentName: '',
          agentType: '',
          isViewTotalAgent: false //只看总代理
        },
        agentTypeList: [],
        row: {},
        columns: [
          {
            title: '代理名称',
            key: 'agentName',
            width: 90,
            fixed:'left',
            align:'center',
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
                      GLOBAL.redirectTo('/tcAgent/viewResume',params.row.uuid)
                    }
                  }
                },params.row.agentName)
              ])
//              return `<strong><a href="javascript:GLOBAL.redirectTo('/teacherAgent/resume/view','${row.uuid}')">${row.agentName}</a></strong>`;
            }
          },
          {
            title: '手机号',
            key: 'phone',
            align:'center',
            width: 120,
          },
          {
            title: '代理学校',
            key: 'agentSchool',
            align:'center',
            width: 120,
          },
          {
            title: '报名链接',
            key: 'agentUrl',
            align:'center',
            width: 200,
            render : (h, params) => {
              return h('div',[
                h('a',{
                  attrs:{
                    href:params.row.agentUrl,
                    target:'_blank',
                  }
                },params.row.agentUrl)
              ])
//              return `<a href="${row.agentUrl}" target="_blank">${row.agentUrl}</a>`;
            }
          },
          {
            title: '录入时间',
            key: 'createDate',
            align:'center',
            width: 150,
            render(h, params) {
              return h('span',formateDate(params.row.createDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '招师方向',
            key: 'agentType',
            align:'center',
            width: 100,
          },
          {
            title: '入库老师数量',
            key: 'lecturerCount',
            align:'center',
            width: 120,
          },
          {
            title: '报名老师数量',
            key: 'teacherCount',
            align:'center',
            width: 120,
          },
          {
            title: '上级代理',
            key: 'parentAgent',
            width: 120,
            align:'center',
          },
          {
            title: '&nbsp;',
            key: '',
            width: 30,
          },
          {
            title: '操作',
            key: '',
            width: 80,
            align:'center',
            fixed:'right',
            render : (h, params) => {
              return h('div',[
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs:{
                    title:''
                  },
                  on: {
                    click: () => {
                      this.rollBack(params.row.agentName,params.row.uuid)
                    }
                  }
                },'激活')
              ])
//              return `<i-button type="success" size="small" @click="rollBack('${row.agentName}','${row.uuid}')">激活</i-button>`;
            }
          }
        ]
      }
    },
    mounted() {
      this.searchForm();
      const _this = this;
      common.ajax({
        url: ZHAO_TEACHER().Agent.agentTypeList,
        method: 'get',
        success: function(res) {
          _this.agentTypeList = res.data;
        }
      });
    },
    methods: {
      selectDataRow(row) {
        this.row = row;
        sessionStorage.setItem('template_uuid', row.uuid);
      },
      addAgent() {
        location.hash = '/tcAgent/addAgent';
      },
      editResume() {
        if(this.row.uuid) {
          location.hash = '/tcAgent/editResume';
        } else {
          common.notices('请选择一行数据','warning');
        }
      },
      rollBack(agentName,uuid) {
        if(uuid) {
          const _this = this;
          this.$Modal.confirm({
            title: '确认',
            content: "确认激活代理 "+ agentName + ' 吗？',
            cancelText: '再想一想',
            onOk: function() {
              common.ajax({
                url: ZHAO_TEACHER().agentRecover.rollBack,
                data: { uuid: uuid},
                success: function(res) {
                  _this.searchForm();
                  common.notices('操作成功！');
                }
              });
            }
          });
        } else {
          common.notices('请选择一行数据','提示','warning');
        }
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          params: this.Search.params,
          parentName: this.Search.parentName,
          agentType: this.Search.agentType,
          generalAgent: this.Search.isViewTotalAgent ? 1 : ""
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?params=${search.params}&parentName=${search.parentName}&agentType=${search.agentType}&generalAgent=${search.generalAgent}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: ZHAO_TEACHER().agentRecover.getTrashAgentPage + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['agentList'] || [];
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
    components: { OBreadcrumb ,PageModel}
  };
</script>

<style>

</style>
