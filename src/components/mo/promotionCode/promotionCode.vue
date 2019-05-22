<template>
<div>
  <o-breadcrumb second="市场与运营" third="优惠码管理"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="24" class="right">
        <i-input v-model="Search.promotionCode" :size="$store.state.searchModuleSize" placeholder="优惠码" style="width:150px;margin-right:2px;"></i-input>
        <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索</i-button>
      </i-col>
    </Row>
  </div>
  <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :current="pageIndex" :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>

  <add ref="add"></add>
  <edit ref="edit"></edit>
</div>
</template>

<script type="text/ecmascript-6">
  import {MO} from 'common/api/mo.js';
  import {common,formateDate} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import add from 'components/mo/channel/add';
  import edit from 'components/mo/channel/edit';
  import PageModel from 'dashborader/page/page.vue';
  export default{
    data() {
      return {
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        Search: {
          promotionCode: ''
        },
        columns: [
          {
            title: '优惠码',
            key: 'promotionCode',
            align:'center',
            minWidth:90,
          },
          {
            title: '描述',
            key: 'promotionName',
            align:'center',
            minWidth:120,
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
              return h('span',formateDate(params.row.createDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '状态',
            key: 'status',
            align:'center',
            minWidth:90,
            render : (h, params) => {
              if(params.row.status === true) {
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag green'
                    }
                  },'已启用')
                ])
//                return '<span class="o-tag green">已启用</span>';
              }else if(params.row.status === false) {
                return h('div',[
                  h('span',{
                    attrs:{
                      class:'o-tag red'
                    }
                  },'已禁用')
                ])
//                return '<span class="o-tag red">已禁用</span>';
              } else {
                return params.row.status;
              }
            }
          },
          {
            title:'操作',
            align:'center',
            minWidth:90,
            render : (h, params) => {
              if(params.row.status === false) {
                return h('div',[
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small',
                    },
                    style: {
                      margin: '2px',
                    },
                    on: {
                      click: () => {
                        this.updateStatus(params.row.promotionUuid,'start')
                      }
                    }
                  },'启用')
                ])

//                return `<i-button type="success" size="small" @click="updateStatus('${row.promotionUuid}','start')">启用</i-button>`;
              }else if(params.row.status === true) {
                return h('div',[
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small',
                    },
                    style: {
                      margin: '2px',
                    },
                    on: {
                      click: () => {
                        this.updateStatus(params.row.promotionUuid,'stop')
                      }
                    }
                  },'停用')
                ])
//                return `<i-button type="error" size="small" @click="updateStatus('${row.promotionUuid}','stop')">停用</i-button>`;
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
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          promotionCode: this.Search.promotionCode
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?promotionCode=${search.promotionCode}&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        let apiUrl = MO().PromotionCode.dataGrid+param;
        const _this = this;
        common.ajax({
          url: apiUrl,
          method: 'get',
          success: function(res){
            _this.data = res.data['promotionCodeVos'] || [];
            _this.total = res.data.total;
          }
        });
      },
      updateStatus(promotionUuid, flag) {
        const _this = this;
        let statusText = (flag === 'stop') ? '停用': '启用';
        let status =  (flag === 'stop') ? 0: 1;
        this.$Modal.confirm({
          title: '确认',
          content: '确认' + statusText + '该优惠码吗？',
          onOk: function () {
            common.ajax({
              url: MO().PromotionCode.updateCodeStatus,
              data: {
                uuid: promotionUuid,
                status: status
              },
              success: function(response){
                common.notices('操作成功！');
                _this.searchForm();
              }
            });
          }
        });
      },
      pageChange(pageIndex){
        this.pageIndex = pageIndex;
        this.searchForm();
      }
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470: '';
      }
    },
    components: { OBreadcrumb, add, edit ,PageModel}
  };
</script>

<style>

</style>
