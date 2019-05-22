<template>
  <div>
    <o-breadcrumb second="分配管理" third="重复报名分配"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <!--<Radio-group v-model="radioType">-->
            <!--<Radio value="S名单"></Radio>-->
            <!--<Radio value="推荐"></Radio>-->
          <!--</Radio-group>-->
          <i-input v-model="Search.name" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)"  placeholder="学生姓名" style="width:150px;margin-right:2px;"></i-input>
          <i-input v-model="Search.phone" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)"  placeholder="学生手机号" style="width:150px;margin-right:2px;"></i-input>
          <i-input v-model="Search.oldUserName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)"  placeholder="前销售姓名" style="width:150px;margin-right:2px;"></i-input>
          <i-input v-model="Search.oldUserPhone" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)"  placeholder="前销售手机号码" style="width:150px;margin-right:2px;"></i-input>
          <i-select v-model="Search.status" :size="$store.state.searchModuleSize" clearable  placeholder="leads状态" style="width:120px;">
            <i-option value="1" style="color:#3399ff;">藏金阁</i-option>
            <i-option value="4" style="color:#ff6600;">回收站</i-option>
          </i-select>

        </i-col>

        <i-col span="4">
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="paper-airplane" @click="showSalesModal">批量分配</i-button>
        </i-col>
        <i-col span=20 class="right">
          <Date-picker type="daterange" :size="$store.state.searchModuleSize" placement="bottom-end" @on-change="changeSignupDate" ref="signupDate" placeholder="报名时间" style="width: 200px"></Date-picker>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索</i-button>
          <i-button type="ghost" :size="$store.state.searchModuleSize" @click="clearForm">重置</i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" highlight-row stripe :columns="columns" :data="data" @on-selection-change="getSelections" @on-select-all="getSelectionAll" @on-sort-change="sortChange"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>

    <select-sales @reFresh="reFresh"  ref="sales" :form-type="type"></select-sales>

  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
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
        orderBy: '',
        sortBy: '',
        leadsNum:'',
        type:'',
        Search: {
          name: '',
          phone: '',
          oldUserName: '',
          oldUserPhone: '',
          status: '',
          startDate:'',
          endDate:'',
        },
        gradeList: [],
        subjectList: [],
        columns: [
          {
            type: 'selection',
            width: 40,
            align: 'center'
          },
          {
            title: '学生',
            key: 'name',
            width: 90,
            align: 'center',
          },
          {
            title: '手机号',
            key: 'phone',
            width: 90,
            align: 'center',
            render(h, params) {
              return h('span',hideCharAtNumber(params.row.phone));
            }
          },
          {
            title: '最近一次报名时间',
            width: 180,
            key: 'latelySingnUpDate',
            align: 'center',
          },
          {
            title: '前销售',
            width: 90,
            key: 'userName',
            align: 'center',
          },
          {
            title: '状态',
            key: 'type',
            width: 90,
            align: 'center',
            render(h, params) {
                if(params.row.type == 5){
                    return h('span','回收站')
                }
                if(params.row.type == 1){
                  return h('span','藏经阁')
                }
            }
          },
          {
            title:'操作',
            key: 'action',
            align: 'center',
            width:90,
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
                  this.distribution(params.row.uuid,params.row.type)
              }
          }
      },'分配')
    ])
//              return `<i-button type="primary" size="small" icon="paper-airplane" @click="distribution('${row.uuid}','${row.type}')">分配</i-button>`;
            }
          }
        ],
      }
    },
    mounted() {
      this.searchForm();
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
      distribution(leadsIds,type) {
        this.selectionRows.length = 1;
        this.selectionRows[0] = {"uuid": leadsIds};
        this.type = type;
        $sStorage.set('selectionRows' ,this.selectionRows);
        this.showSalesModal();
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        let nameAndPhone = this.Search.nameAndPhoneValue;
        let name = '', phone = '';
        if (!nameAndPhone) nameAndPhone = '';
        if (isNaN(nameAndPhone)) {
          name = nameAndPhone;
        } else {
          phone = nameAndPhone;
        }
        let channelLevel = this.Search.channelLevel;
        if(channelLevel) channelLevel = channelLevel.toLocaleUpperCase();
        this.loadDataGrid({
          name: this.Search.name,
          phone: this.Search.phone,
          oldUserName: this.Search.oldUserName,
          oldUserPhone: this.Search.oldUserPhone,
          status: this.Search.status,
          startDate: this.Search.startDate,
          endDate: this.Search.endDate,
        });
      },
      loadDataGrid(search) {
        let param = `?name=${search.name}&phone=${search.phone}&oldUserName=${search.oldUserName}&oldUserPhone=${search.oldUserPhone}&studentStatus=${search.status}&lastSingUpStartDate=${search.startDate}&lastSingUpEndDate=${search.endDate}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${this.orderBy}&sortBy=${this.sortBy}&type=1`;
        const _this = this;
        // common.ajax({
        //   url: DISTRIBUTE().Leads.getRepeatSignUpLeads + param,
        //   method: 'get',
        //   success: function (res) {
        //     _this.data = res.data['repeatSignUpLeadsVos'] || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get( DISTRIBUTE().Leads.getRepeatSignUpLeads + param,{
        }).then( ({data}) => {
          _this.data = data.data['repeatSignUpLeadsVos'] || [];
          _this.total = data.data.total;
        })
      },
      clearForm() {
        clearSearchForm(this.Search, [this.$refs.signupDate], this);
        this.radioType = '';
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
      sortChange(obj) {
        this.orderBy = obj.key;
        this.sortBy = obj.order;
        this.searchForm();
      },
      changeSignupDate(value) {
        this.Search.startDate = value[0] || '';
        this.Search.endDate = value[1] || '';
      },
      reFresh(){
        this.searchForm();
      }
    },
    components: { OBreadcrumb,selectSales ,PageModel}
  };
</script>

<style>

</style>
