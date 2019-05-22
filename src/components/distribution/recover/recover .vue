<template>
  <div>
    <o-breadcrumb second="分配管理" third="回收站分配"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="4">
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="paper-airplane" @click="showSalesModal">批量分配</i-button>
        </i-col>
        <i-col span="20" class="right">
          <i-input v-model="Search.nameAndPhoneValue" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="学生姓名 \ 手机号码" style="width:150px;margin-right: 2px;"></i-input>
          <i-select v-model="Search.recycleCause" :size="$store.state.searchModuleSize" placeholder="回收原因" style="width:200px">
            <i-option v-for="(item,index) in recycleCauseList" :key='index' :value="item.giveUpCause">{{ item.giveUpCause }}</i-option>
          </i-select>
          <Date-picker type="daterange" :size="$store.state.searchModuleSize" placement="bottom-end" @on-change="changeRecycleTime" ref="recycleTime" placeholder="回收时间" style="width: 200px"></Date-picker>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索</i-button>
          <i-button type="ghost" :size="$store.state.searchModuleSize" @click="clearSearchForm">重置</i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" highlight-row stripe :columns="columns" :data="data" @on-selection-change="getSelections" @on-select-all="getSelectionAll"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" size="small" :page-size="pageNumber" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>

    <select-sales @reFresh="reFresh"  ref="sales" form-type="5"></select-sales>

  </div>
</template>

<script type="text/ecmascript-6">
  import {SCS} from 'common/api/scs.js';
  import {DISTRIBUTE} from 'common/api/distribute.js';
  import {formateDate,common,hideCharAtNumber,clearSearchForm} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import selectSales from '../selectSales';
  import PageModel from 'dashborader/page/page.vue';
  const $sStorage = $.sessionStorage;
  export default{
    data() {
      return {
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: 10,
        selectionRows: [],
        recycleCauseList: [],
        Search: {
          nameAndPhoneValue: '',
          recycleCause: '',
          recycleStartTime: '',
          recycleEndTime: '',
        },
        columns: [
          {
            type: 'selection',
            minWidth: 40,
            align: 'center'
          },
          {
            title: '学生',
            key: 'leadsName',
            align: 'center',
            minWidth: 60,
            sortable: true,
            render : (h, params) => {
            return h('div',[
              h('a',{
                on:{
                  click:()=>{
                  GLOBAL.viewLeadsDetail(params.row.leadsUuid)
              }
          }
      },params.row.leadsName)
    ])
//              return `<strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.leadsUuid}');">${row.leadsName}</a></strong>`;
            }
          },
          {
            title: '手机号',
            key: 'leadsPhone',
            align: 'center',
            minWidth: 120,
            render(h, params) {
              return h('span',hideCharAtNumber(params.row.leadsPhone));
            }
          },
          {
            title: '回收时间',
            key: 'recycleTime',
            align: 'center',
            minWidth: 150,
            render(h, params) {
              return h('span',formateDate(params.row.recycleTime,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '回收原因',
            align: 'center',
            key: 'recycleCause',
            minWidth: 120,
          },
          {
            title: '回收备注',
            align: 'center',
            key: 'recycleDes',
            minWidth: 120,

          },
          {
            title: '前销售',
            align: 'center',
            key: 'userName',
            minWidth: 90,
          },
          {
            title: '操作',
            align: 'center',
            minWidth: 100,
            render : (h, params) => {
            return h('div',[
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  icon: 'paper-airplane',
                },
                style: {
                  margin: '2px',
                },
                on: {
                  click: () => {
                  this.distribution(params.row.leadsUuid)
              }
          }
          },'分配')
          ])
//              return `<i-button type="primary" icon="paper-airplane" size="small" @click="distribution('${row.leadsUuid}')">分配</i-button>`;
            }
          }
        ],
      }
    },
    mounted() {
      this.searchForm();
      const _this = this;
      // common.ajax({
      //   url: SCS().WaitFollowed.giveUpType,
      //   method: 'get',
      //   success: function(response){
      //     _this.recycleCauseList = response.data;
      //   }
      // });
      this.$axios.get(SCS().WaitFollowed.giveUpType,{
      }).then( ({data}) => {
        _this.recycleCauseList = data.data;
      })
    },
    methods: {
      showSalesModal() {
        let row = this.selectionRows;
        if (row.length > 0) {
            this.$refs.sales.show();
        } else {
          common.msg('请选择名单','warning');
        }
      },
      distribution(leadsUuid) {
        this.selectionRows.length = 1;
        this.selectionRows[0] =  {"uuid": leadsUuid};
        $sStorage.set('selectionRows' ,this.selectionRows);
        this.showSalesModal();
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        let nameAndPhone = this.Search.nameAndPhoneValue;
        let name = '',phone = '';
        if(!nameAndPhone) nameAndPhone = '';
        if (isNaN(nameAndPhone)) {
          name = nameAndPhone;
        } else {
          phone = nameAndPhone;
        }
        this.loadDataGrid({
          name: name,
          phone: phone,
          recycleCause: this.Search.recycleCause,
          recycleStartTime: this.Search.recycleStartTime,
          recycleEndTime: this.Search.recycleEndTime
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?name=${search.name}&phone=${search.phone}&recycleCause=${search.recycleCause}&recycleStartTime=${search.recycleStartTime}&recycleEndTime=${search.recycleEndTime}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}&type=0`;
        const _this = this;
        // common.ajax({
        //   url: DISTRIBUTE().Recover.dataGrid+param,
        //   method: 'get',
        //   success: function(res){
        //     _this.data = res.data['leadVos'] || [];
        //     _this.total = res.data.total;
        //   },
        //   successError(res){
        //     common.notices(res.code+":"+res.msg,'数据加载失败','error');
        //   }
        // });
        this.$axios.get(DISTRIBUTE().Recover.dataGrid+param,{
        }).then( ({data}) => {
          _this.data = data.data['leadVos'] || [];
          _this.total = data.data.total;
        })
      },
      clearSearchForm() {
        clearSearchForm(this.Search,[this.$refs.recycleTime], this);
      },
      getSelections(selection) {
        $sStorage.set('selectionRows' ,selection);
        this.selectionRows = selection;
      },
      getSelectionAll(selection) {
        $sStorage.set('selectionRows' ,selection);
        this.selectionRows = selection;
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      changeRecycleTime(value) {
        this.Search.recycleStartTime = value[0] || '';
        this.Search.recycleEndTime = value[1] || '';
      },
      reFresh(){
        this.searchForm();
      }
    },
    components: {OBreadcrumb, selectSales,PageModel}
  };
</script>

<style scoped>

</style>
