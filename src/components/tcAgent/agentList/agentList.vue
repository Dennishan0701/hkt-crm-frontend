<template>
 <div>
   <o-breadcrumb second="招师代理" third="代理列表"></o-breadcrumb>
   <div class="grid-widget">
     <Row>
       <i-col span="6">
         <Button-group>
           <i-button :size="$store.state.searchModuleSize" type="primary" @click="addAgent"><Icon type="plus"></Icon> 新增</i-button>
           <i-button :size="$store.state.searchModuleSize" type="info" @click="editResume"><Icon type="edit"></Icon> 编辑</i-button>
           <i-button :size="$store.state.searchModuleSize" type="error" @click="removeAgent"><Icon type="android-delete"></Icon> 删除</i-button>
         </Button-group>
       </i-col>
       <i-col span="18" class="right">
         <form id="searchForm">
           <i-input :size="$store.state.searchModuleSize" v-model="Search.params" @on-keyup.enter="searchForm(1)" placeholder="代理名称/手机号/代理学校" style="width:200px;margin-right:2px;"></i-input>
           <i-input :size="$store.state.searchModuleSize" v-model="Search.parentName" @on-keyup.enter="searchForm(1)" placeholder="上级代理" style="width:100px;margin-right:2px;"></i-input>
           <i-input :size="$store.state.searchModuleSize" v-model="Search.createUser" @on-keyup.enter="searchForm(1)" placeholder="招师专员" style="width:120px;margin-right:2px;"></i-input>
           <i-select :size="$store.state.searchModuleSize" v-model="Search.agentType" clearable placeholder="招师方向" style="width:100px">
             <i-option v-for="(item,index) in agentTypeList" :key='index' :value="item.uuid">{{item.enumName}}</i-option>
           </i-select>
           <Checkbox :size="$store.state.searchModuleSize" :checked="Search.isViewTotalAgent">只看总代理</Checkbox>
           <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
         </form>
       </i-col>
     </Row>
   </div>
   <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
     <checkbox label="phone">手机号</checkbox>
     <checkbox label="agentSchool">代理学校</checkbox>
     <checkbox label="createUser">招师专员</checkbox>
     <checkbox label="agentUrl">报名链接</checkbox>
     <checkbox label="advLinks">推广链接</checkbox>
     <checkbox label="createDate">录入时间</checkbox>
     <checkbox label="agentType">招师方向</checkbox>
     <checkbox label="lecturerCount">入库老师数量</checkbox>
     <checkbox label="teacherCount">报名老师数量</checkbox>
     <checkbox label="parentAgent">上级代理</checkbox>
   </checkbox-group>
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
        tableColumnsChecked:['phone','agentSchool','createUser','agentUrl','advLinks','createDate','agentType','lecturerCount','teacherCount','parentAgent'],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11: 17,
        Search: {
          params: '',
          parentName: '',
          createUser: '',
          agentType: '',
          isViewTotalAgent: false //只看总代理
        },
        agentTypeList: [],
        row: {},
        columns: [],
      }
    },
    mounted() {
      this.searchForm();
      this.changeTableColumns();
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
      getTableColumns () {
        const columns = {
          agentName:{
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
                  GLOBAL.redirectTo('tcAgent/viewResume',params.row.uuid)
              }
          }
        },params.row.agentName)
      ])
//          return `<strong><a href="javascript:GLOBAL.redirectTo('/teacherAgent/resume/view','${row.uuid}');">${row.agentName}</a></strong>`;
        }
        },
          phone:{
          title: '手机号',
            key: 'phone',
          align:'center',
          width: 120,
        },
          agentSchool:{
          title: '代理学校',
            key: 'agentSchool',
          align:'center',
          width: 220,
        },
          createUser:{
          title: '招师专员',
            key: 'createUser',
          align:'center',
          width: 90,
        },
          agentUrl:{
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
//          return `<a href="${row.agentUrl}" target="_blank">${row.agentUrl}</a>`;
        }
        },
          advLinks:{
          title: '推广链接',
            key: 'advLinks',
          align:'center',
          width: 200,
            ellipsis:true,
              render : (h, params) => {
          if(params.row.advLinks){
            return h('div',[
              h('a',{
                attrs:{
                  href:params.row.advLinks,
                  target:'_blank',
                }
              },params.row.advLinks)
            ])
//            return `<a href="${row.advLinks}" target="_blank">${row.advLinks}</a>`;
          }else {
            return '暂无'
          }
        }
        },
          createDate:{
          title: '录入时间',
            key: 'createDate',
          align:'center',
          width: 150,
              render(h, params) {
          return h('span', formateDate(params.row.createDate,'yyyy-MM-dd hh:mm:ss'));
        }
        },
          agentType:{
          title: '招师方向',
            key: 'agentType',
          align:'center',
          width: 100,
        },
          lecturerCount:{
          title: '入库老师数量',
            key: 'lecturerCount',
          align:'center',
          width: 120,
        },
          teacherCount:{
          title: '报名老师数量',
            key: 'teacherCount',
          align:'center',
          width: 120,
        },
          parentAgent:{
          title: '上级代理',
            key: 'parentAgent',
          width: 120,
          align:'center',
        }
        };
        let datas = [columns.agentName];
        this.tableColumnsChecked.forEach(col => {
          datas.push(columns[col]);
        });
        return datas;
      },
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
          common.notice('请选择一行数据','warning');
        }
      },
      removeAgent() {
        if(this.row.uuid) {
          const _this = this;
          this.$Modal.confirm({
            title: '确认',
            content: "确认删除代理 "+ this.row.agentName + ' 吗？',
            cancelText: '再想一想',
            onOk: function() {
              common.ajax({
                url: ZHAO_TEACHER().Agent.removeAgent,
                data: { uuid: _this.row.uuid},
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
          createUser: this.Search.createUser,
          generalAgent: this.Search.isViewTotalAgent ? 1 : ""
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?params=${search.params}&parentName=${search.parentName}&createUser=${search.createUser}&agentType=${search.agentType}&generalAgent=${search.generalAgent}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: ZHAO_TEACHER().Agent.agentDataGrid + param,
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
    components: { OBreadcrumb,PageModel }
  };
</script>

<style>

</style>
