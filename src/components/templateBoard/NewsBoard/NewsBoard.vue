<template>
<div>
  <o-breadcrumb second="模板管理" third="消息模板管理"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="6">
        <i-button :size="$store.state.searchModuleSize" type="primary" icon="plus" @click="showAdd">新增</i-button>
      </i-col>
      <i-col span="18" class="right">
        <i-select :size="$store.state.searchModuleSize" v-model="Search.type" clearable placeholder="消息类型" style="width:100px;">
          <i-option v-for="(item,index) in typeList" :key='index' :value="item.enumValue">{{item.enumName}}</i-option>
        </i-select>
        <i-select :size="$store.state.searchModuleSize" v-model="Search.category" clearable placeholder="消息类别" style="width:100px;">
          <i-option v-for="(item,index) in categoryList" :key='index' :value="item.enumValue">{{item.enumName}}</i-option>
        </i-select>

        <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
      </i-col>
    </Row>
  </div>
  <i-table size="small" :height="theight" stripe :columns="columns" :data="data"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :current="pageIndex" :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>

  <add @reFresh="reFresh" ref="add"></add>
  <edit @reFresh="reFresh" ref="edit"></edit>
</div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API,apiHiCRM} from 'common/api.config.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import add from './add';
  import edit from './edit';
  import {TEMPLATE} from 'common/api/templateBoard.js';
  import {common,formateDate} from 'common/js/common.js';
  import PageModel from 'dashborader/page/page.vue';
  export default{
    props: {
    },
    data() {
      return {
        uuid: '',
        data: [],
        typeList: [],
        categoryList: [],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        Search:{
          type:'',
          category:'',
        },
        columns: [
          {
            title: '模版 ID',
            key: 'informationTemplateUuid',
            minWidth: 90,
            align:'center'
          },
          {
            title: '内容',
            key: 'informationContent',
            minWidth: 180,
            align:'center'
          },
          {
            title: '类别',
            key: 'category',
            minWidth: 90,
            align:'center',
            // render(row,column,index){
            //   if(row.category == 0){
            //     return `<span class="o-tag black">销售</span>`
            //   } else if(row.category == 1){
            //     return `<span class="o-tag black">市场</span>`
            //   } else if(row.category == 2){
            //     return `<span class="o-tag black">教学</span>`
            //   } else if(row.category == 3){
            //     return `<span class="o-tag black">财务</span>`
            //   } else if(row.category == 4){
            //     return `<span class="o-tag black">技术</span>`
            //   }
            // },
            render:(h,params)=>{
              if(params.row.category == 0){
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag black',
                    },
                  },'销售')
                ])
              } else if(params.row.category == 1){
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag black',
                    },
                  },'市场')
                ])
              } else if(params.row.category == 2){
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag black',
                    },
                  },'教学')
                ])
              } else if(params.row.category == 3){
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag black',
                    },
                  },'财务')
                ])
              } else if(params.row.category == 4){
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag black',
                    },
                  },'技术')
                ])
              }
            }
          },
          {
            title: '类型',
            key: 'type',
            minWidth: 90,
            align:'center',
            // render(row,column,index){
            //   if(row.type == 0){
            //     return `<span class="o-tag blue">排课类</span>`
            //   } else if(row.type == 1){
            //     return `<span class="o-tag yellow">反馈类</span>`
            //   } else if(row.type == 2){
            //     return `<span class="o-tag red">审核</span>`
            //   } else if(row.type == 3){
            //     return `<span class="o-tag green">提交订单</span>`
            //   }
            // },
            render:(h,params)=>{
              if(params.row.type == 0){
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag blue',
                    },
                  },'排课类')
                ])
              } else if(params.row.type == 1){
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag yellow',
                    },
                  },'反馈类')
                ])
              } else if(params.row.type == 2){
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag red',
                    },
                  },'审核')
                ])
              } else if(params.row.type == 3){
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag green',
                    },
                  },'提交订单')
                ])
              }
            }
          },
          {
            title: '状态',
            key: 'status',
            minWidth: 150,
            align:'center',
            // render(row,column,index){
            //   if(row.status == 0){
            //     return `<span class="o-tag grey">停用</span>`
            //   } else if(row.status == 1){
            //     return `<span class="o-tag green">启用</span>`
            //   }
            // },
            render:(h,params)=>{
              if(params.row.status == 0){
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag grey',
                    },
                  },'停用')
                ])
              } else if(params.row.status == 1){
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag green',
                    },
                  },'启用')
                ])
              }
            }
          },
          {
            title: '更新时间',
            key: 'updateTime',
            minWidth: 150,
            align:'center',
            // render(row,column,index){
            //  return formateDate(row.updateDate,'yyyy-MM-dd hh:mm:ss')
            // },
            render:(h,params) =>{
              return h('div',[
                h('span',{},formateDate(params.row.updateDate,'yyyy-MM-dd hh:mm:ss'))
              ])
            }
          },
          {
              title:'操作',
            key: 'action',
            align: 'center',
            minWidth: 100,
            // render (row, column, index) {
            //     if(row.status == 0){
            //       return `<i-button type="primary" size="small" icon="edit" title="编辑" @click="showEdit('${row.informationTemplateUuid}','${row.informationContent}','${row.category}','${row.status}','${row.type}')"></i-button>
            //   <i-button type="success" size="small" @click="del('${row.informationTemplateUuid}','${row.informationContent}','${row.category}','${row.status}','${row.type}')">启用</i-button>`;
            //     }
            //   return `<i-button type="primary" size="small" icon="edit" title="编辑" @click="showEdit('${row.informationTemplateUuid}','${row.informationContent}','${row.category}','${row.status}','${row.type}')"></i-button>
            //   <i-button type="error" size="small" @click="del('${row.informationTemplateUuid}','${row.informationContent}','${row.category}','${row.status}','${row.type}')">停用</i-button>`;
            // },
            render:(h,params)=>{
              if(params.row.status == 0){
                return h('div',[
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                      icon: 'edit',
                    },
                    attrs: {
                      title: '编辑',
                    },
                    style: {
                      margin: '2px',
                    },
                    on: {
                      click: () => {
                        this.showEdit(params.row.informationTemplateUuid,params.row.informationContent,params.row.category,params.row.status,params.row.type);
                      }
                    }
                  }),
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small',
                      // icon: 'edit',
                    },
                    attrs: {
                      title: '启用',
                    },
                    style: {
                      margin: '2px',
                    },
                    on: {
                      click: () => {
                        this.del(params.row.informationTemplateUuid,params.row.informationContent,params.row.category,params.row.status,params.row.type);
                      }
                    }
                  }),
                ])
              }
              return h('div',[
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'edit',
                  },
                  attrs: {
                    title: '编辑',
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.showEdit(params.row.informationTemplateUuid,params.row.informationContent,params.row.category,params.row.status,params.row.type);
                    }
                  }
                }),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    // icon: 'edit',
                  },
                  attrs: {
                    title: '停用',
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.del(params.row.informationTemplateUuid,params.row.informationContent,params.row.category,params.row.status,params.row.type);
                    }
                  }
                }),
              ])
            }
          }
        ]
      }
    },
    mounted() {
      const _this = this;
      // common.ajax({
      //   url: TEMPLATE().NewsBoard.getType,
      //   method: 'get',
      //   success: function(res){
      //     _this.typeList = res.data.typeEnum || [];
      //   }
      // });
      this.$axios.get(TEMPLATE().NewsBoard.getType,{
        baseURL: apiHiCRM(),
      }).then( ({data}) => {
        this.typeList = data.data['typeEnum']|| [];
      })
      // common.ajax({
      //   url: TEMPLATE().getCategory,
      //   method: 'get',
      //   success: function(res){
      //     _this.categoryList = res.data.categoryEnum || [];
      //   }
      // });
      this.$axios.get(TEMPLATE().getCategory,{
        baseURL: apiHiCRM(),
      }).then( ({data}) => {
        this.categoryList = data.data['categoryEnum']|| [];
      })
      this.searchForm();
    },
    methods: {
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          type:this.Search.type,
          category:this.Search.category,
        })
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?type=${search.type}&category=${search.category}&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        let apiUrl = TEMPLATE().NewsBoard.dataGrid+param;
        const _this = this;
        // common.ajax({
        //   url: apiUrl,
        //   method: 'get',
        //   success: function(res){
        //     _this.data = res.data.informationTemplateInfos || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get(TEMPLATE().NewsBoard.dataGrid,{
          baseURL: apiHiCRM(),
          params:{
            type : search.type,
            category : search.category,
            pageIndex : this.pageIndex,
            pageNumber : this.pageNumber,
            orderBy : orderBy,
            sortBy : sortBy,
          },
        }).then( ({data}) => {
          this.data = data.data['informationTemplateInfos']|| [];
          this.total = data.data.total;
        })
      },
      del(informationTemplateUuid,informationContent,category,status,type) {
        let content = '';
        if(status == 0){
          content = `是否<span class='c-primary'>启用</span>此条消息模板`
        } else{
          content = `是否<span class='c-error'>停用</span>此条消息模板`
        }
        const _this = this;
        this.$Modal.confirm({
          title: '确认',
          content: content,
          onOk: function () {
            // common.ajax({
            //   url: TEMPLATE().NewsBoard.add,
            //   data: {
            //     informationTemplateUuid: informationTemplateUuid,
            //     type: type,
            //     status: status==0?1:0,
            //     category: category,
            //     informationContent: informationContent,
            //   },
            //   success: function (response) {
            //     common.notices('操作成功！');
            //     _this.searchForm({ channelName: '' });
            //   }
            // });
            this.$axios.get(TEMPLATE().NewsBoard.add,{
              baseURL: apiHiCRM(),
              params:{
                informationTemplateUuid :informationTemplateUuid,
                type : type,
                status: status==0?1:0,
                category: category,
                informationContent: informationContent,
              },
            }).then( () => {
              common.notices('操作成功！');
              this.searchForm({ channelName: '' });
            })
          }
        });
      },
      showAdd() {
        this.$refs.add.show();
      },
      showEdit(informationTemplateUuid,informationContent,category,status,type) {
        this.$refs.edit.show(informationTemplateUuid,informationContent,category,status,type);
      },
      pageChange(pageIndex){
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
      OBreadcrumb,
      add,
      edit,PageModel
    }
  };
</script>

<style>

</style>
