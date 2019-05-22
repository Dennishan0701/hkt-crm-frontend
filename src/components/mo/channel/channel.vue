<template>
<div>
  <o-breadcrumb second="市场与运营" third="渠道投放"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="6">
        <i-button type="primary" :size="$store.state.searchModuleSize" icon="plus" @click="showAdd">新增</i-button>
      </i-col>
      <i-col span="18" class="right">
        <i-input v-model="nameValue" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="渠道名称" style="width:150px;margin-right:2px;"></i-input>
        <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索</i-button>
      </i-col>
    </Row>
  </div>
  <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data" @on-current-change="currentData"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :current="pageIndex" :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>

  <add @reFresh="reFresh"  ref=add></add>
  <edit @reFresh="reFresh"  ref='edit'></edit>
</div>
</template>

<script type="text/ecmascript-6">
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import add from 'components/mo/channel/add';
  import edit from 'components/mo/channel/edit';
  import {MO} from 'common/api/mo.js';
  import {common} from 'common/js/common.js';
  import PageModel from 'dashborader/page/page.vue';
  export default{
    props: {
      user: {
        type: Object
      }
    },
    data() {
      return {
        uuid: '',
        nameValue: '',
        currentRowData: {},
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        columns: [
          {
            title: '渠道名称',
            key: 'name',
            minWidth: 150,
            fixed:'left',
            align:'center'
          },
          {
            title: '渠道等级',
            key: 'level',
            minWidth: 100,
            align:'center'
          },
          {
            title: '渠道类别',
            key: 'channelTypeName',
            minWidth: 100,
            align:'center'
          },
          {
            title: '设备平台',
            key: 'platform',
            minWidth: 100,
            align:'center'
          },
          {
            title: 'ADID',
            key: 'adid',
            minWidth: 150,
            align:'center'
          },
          {
            title: '投放链接',
            key: 'pageAddress',
          align:'center',
            minWidth:250,
            render : (h, params) => {
              let pageAddress = params.row.pageAddress || '';
              return h('div',[
                h('a',{
                  attrs:{
                    href:pageAddress,
                    target:'_blank',
                  }
                },pageAddress)
              ])
//              return `<a href='${pageAddress}' target='_blank'>${pageAddress}</a>`;
            }
          },
          {
            title: '描述',
            key: 'description',
            align:'center',
            minWidth:100,
          },
          {
              title:'操作',
            key: 'action',
            align: 'center',
            fixed:'right',
            minWidth: 100,
            render : (h, params) => {

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
                  this.showEdit(params.row.uuid)
              }
          }
          }),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  icon: 'trash-b',
                },
                style: {
                  margin: '2px',
                },
                attrs:{
                  title:'删除'
                },
                on: {
                  click: () => {
                  this.del(params.row.uuid)
              }
          }
          })
          ])
//              return `<i-button type="primary" size="small" icon="edit" title="编辑" @click="showEdit('${row.uuid}')"></i-button>
//              <i-button type="error" size="small" icon="trash-b" title="删除" @click="del('${row.uuid}')"></i-button>`;
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
        let param = `?channelName=${search.channelName}&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        let apiUrl = MO().Channel.dataGrid+param;
        const _this = this;
        common.ajax({
          url: apiUrl,
          method: 'get',
          success: function(res){
            _this.data = res.data.channels || [];
            _this.total = res.data.total;
          }
        });
      },
      del(uuid) {
        const _this = this;
        this.$Modal.confirm({
          title: '确认',
          content: '确认删除该渠道？',
          onOk: function () {
            common.ajax({
              url: MO().Channel.delete,
              data: {uuid: uuid},
              success: function(response){
                common.notices('操作成功！');
                _this.loadDataGrid({ channelName: '' });
              }
            });
          }
        });
      },
      showAdd() {
        this.$refs.add.show();
      },
      showEdit(uuid) {
        this.$refs.edit.show(uuid);
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          channelName: this.nameValue,});
      },
      currentData(currentRow) {
        this.currentRowData = currentRow;
      },
      pageChange(pageIndex){
        this.pageIndex = pageIndex;
        this.loadDataGrid({channelName: this.nameValue});
      },
      reFresh(){
        this.loadDataGrid({channelName: this.nameValue});
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
