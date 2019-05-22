<template>
  <div class="teamManager">
    <o-breadcrumb second="权限管理" third="团队管理"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="4">
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="plus" @click="showAdd">新增</i-button>
        </i-col>
        <i-col span="20" class="right">
          <i-input v-model="teamName" :size="$store.state.searchModuleSize" placeholder="团队/组" @on-keyup.enter="searchForm(1)" style="width:150px"></i-input>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <i-table :height="theight" border size="small" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>

    <add ref='add' @reFresh="reFresh"></add>
    <edit ref='edit' @reFresh="reFresh"></edit>
  </div>
</template>

<script type="text/ecmascript-6">
  import {AUTHORITY} from 'common/api/authority.js';
  import {formateDate,common} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import add from './add.vue';
  import edit from './edit.vue';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        teamName: '',
        columns: [
          {
            title: '序号',
            align:'center',
            type:'index',
            minWidth:40,
          },
          {
            title: '所属部门',
            align:'center',
            key: 'organizationName',
            minWidth:90,
          },
          {
            title: '团队/组',
            align:'center',
            key: 'teamName',
            minWidth:90,
          },
          {
            title: '类型',
            align:'center',
            key: 'teamType',
            minWidth:90,
          },
          {
            title: '主管',
            align:'center',
            key: 'leaderName',
            minWidth:90,
          },
          {
            title: '经理',
            align:'center',
            key: 'leaderManagerName',
            minWidth:90,
          },
          {
            title: '总监',
            align:'center',
            key: 'superLeaderName',
            minWidth:90,
          },
          {
            title: '更新时间',
            align:'center',
            key: 'updateDate',
            minWidth:150,
            render (h,params) {
              return h('span',formateDate(params.row.updateDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '创建时间',
            align:'center',
            key: 'createDate',
            minWidth:150,
            render (h,params) {
              return h('span',formateDate(params.row.createDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '操作',
            align:'center',
            key: 'action',
            minWidth:120,
            render:(h,params) => {
              return h('div',[
                h('Button',{
                  props:{
                    type:'info',
                    size:'small',
                    icon:'edit'
                  },
                  attrs:{
                    title:'编辑'
                  },
                  style:{
                    margin:'2px'
                  },
                  on:{
                    click:()=>{
                    this.edit(params.row.teamUuid)
                  }
                  }
                }),
                h('Button',{
                  props:{
                    type:'error',
                    size:'small',
                    icon:'minus'
                  },
                  attrs:{
                    title:'删除'
                  },
                  style:{
                    margin:'2px'
                  },
                  on:{
                    click:()=>{
                    this.del(params.row.teamUuid,params.row.teamName)
                  }
                  }
                })
              ])
//              return `<i-button type="info" size="small" icon="edit" title="编辑" @click="edit('${row.teamUuid}')"></i-button>
//                      <i-button type="error" size="small" icon="minus" title="删除" @click="del('${row.teamUuid}','${row.teamName}')"></i-button>`
            }
          }
        ]
      }
    },
    mounted() {
      this.searchForm();
    },
    methods: {
      showAdd(){
        this.$refs.add.show();
      },
      edit(teamUuid) {
        this.$refs.edit.show(teamUuid);
      },
      del(uuid, name) {
        let _this = this;
        this.$Modal.confirm({
          title: '确认',
          content: `确认删除 <span class="c-red">${name}</span> 吗？`,
          onOk: function() {
            // common.ajax({
            //   url: AUTHORITY().Team.delete,
            //   data: {uuid: uuid},
            //   success: function(response){
            //     common.notices('操作成功');
            //     _this.searchForm();
            //   }
            // });
            this.$axios.post(AUTHORITY().Team.delete,{
              uuid:uuid,
            }).then( () => {
              common.notices('操作成功');
              _this.searchForm();
            });
          }
        });
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({});
      },
      loadDataGrid(search) {
        let param = `?pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&teamName=${this.teamName}`;
        const _this = this;
        // common.ajax({
        //   url: AUTHORITY().Team.dataGrid+param,
        //   method: 'get',
        //   success: function(res){
        //     _this.data = res.data['teams'] || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get(AUTHORITY().Team.dataGrid,{
          params:{
            pageIndex:this.pageIndex,
            pageNumber:this.pageNumber,
            teamName:this.teamName,
          }
        }).then( ({data}) => {
          _this.data = data.data['teams'] || [];
          _this.total = data.data.total;
        });
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.loadDataGrid({});
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
      OBreadcrumb, add, edit ,PageModel
    }
  };
</script>

<style>

</style>
