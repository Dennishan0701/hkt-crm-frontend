<template>
  <div>
    <o-breadcrumb second="分配管理" third="藏金阁分配"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="4">
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="paper-airplane" @click="showSalesModal">批量分配</i-button>
        </i-col>
        <i-col span="20" class="right">
          <Checkbox v-model="Search.signStatus">S名单</Checkbox>
          <i-input v-model="Search.nameAndPhoneValue" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="学生姓名 \ 手机号码" style="width:150px;margin-right: 2px;"></i-input>
		      <i-input v-model="Search.oldUserName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)"  placeholder="前销售" style="width:100px;margin-right: 2px;"></i-input>
          <!--<i-input v-model="Search.channelLevel" :size="$store.state.searchModuleSize" placeholder="渠道等级" style="width:100px;margin-right:2px;"></i-input>-->
          <i-select v-model="Search.channelLevel" :size="$store.state.searchModuleSize" placeholder="渠道等级" style="width:172px" clearable>
            <i-option v-for="(item,index) in channelLevelList" :key='index' :value="item">{{ item }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.subject" clearable placeholder="科目" style="width:200px">
            <i-option v-for="(item,index) in subjectList" :key='index' :value="item">{{ item }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.grade" clearable placeholder="年级" style="width:80px;">
            <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.isRecommend" clearable placeholder="推荐leads" style="width:200px;">
            <i-option value="1" label="">是</i-option>
            <i-option value="0" label="">否</i-option>
          </i-select>
          <Date-picker type="daterange" ref="createDate" :size="$store.state.searchModuleSize" placement="bottom-end" @on-change="createTime" placeholder="leads创建时间" style="width: 200px"></Date-picker>
          <Date-picker type="daterange" ref="classDate" :size="$store.state.searchModuleSize" placement="bottom-end" @on-change="setUpTime" placeholder="报名时间" style="width: 200px"></Date-picker>
          <Date-picker type="daterange" ref="classDates" :size="$store.state.searchModuleSize" placement="bottom-end" @on-change="changeGiveUpTime" placeholder="放弃时间" style="width: 200px"></Date-picker>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索</i-button>
          <i-button :size="$store.state.searchModuleSize" type="ghost" @click="clearSearchForm">重置</i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" highlight-row stripe :columns="columns" :data="data" @on-selection-change="getSelections" @on-select-all="getSelectionAll"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" size="small" :page-size="pageNumber" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>

    <select-sales @reFresh="reFresh"  ref="sales" form-type="1"></select-sales>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {DISTRIBUTE} from 'common/api/distribute.js';
  import {formateDate, common, clearSearchForm,hideCharAtNumber,getFullPhone} from 'common/js/common.js';
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
        subjectList:[],//获取科目
        channelLevelList:[],
        gradeList: [],
        Search: {
          signStatus: false,
          nameAndPhoneValue: '',
          startGiveUpDate: '',
          endGiveUpDate: '',
          signUpStartDate: '',
          signUpEndDate: '',
          createStartDate: '',
          createEndDate: '',
          oldUserName:'',
          channelLevel:'',
          subject:'',//科目
          grade:'',//年级
          isRecommend:'',
        },
        columns: [
          {
            type: 'selection',
            minWidth: 60,
            align: 'center'
          },
          {
            title: '学生',
            key: 'name',
            align: 'center',
            sortable: true,
            minWidth: 90,
            render : (h, params) => {
              return h('div',[
                h('a',{
                  on:{
                    click:()=>{
                      GLOBAL.viewLeadsDetail(params.row.uuid)
                    }
                  }
                },params.row.name)
              ])
//              return `<strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.uuid}');">${row.name}</a></strong>`;
            }
          },
          {
            title: '手机号',
            align: 'center',
            key: 'phone',
            minWidth: 120,
            render(h, params) {
              return h('span', hideCharAtNumber(params.row.phone));
            }
          },
          {
            title: '渠道名称',
            align: 'center',
            key: 'channelName',
            minWidth: 120,
          },
          {
            title: 'leads创建时间',
            align: 'center',
            key: 'leadsCreateDate',
            minWidth: 150,
            render(h, params) {
              return h('span',formateDate(params.row.leadsCreateDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '报名时间',
            align: 'center',
            key: 'signUpDate',
            minWidth: 150,
            render(h, params) {
              return h('span',formateDate(params.row.signUpDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '放弃时间',
            align: 'center',
            key: 'giveUpTime',
            minWidth: 150,
            render(h, params) {
              return h('span',formateDate(params.row.giveUpTime,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '放弃原因',
            align: 'center',
            key: 'giveUpDes',
            minWidth: 120,
          },
          // {
          //   title: '放弃备注',
          //   align: 'center',
          //   key: 'giveUpRemark',
          //   minWidth: 120,
          // },
          {
            title: '前销售',
            align: 'center',
            key: 'userName',
            minWidth: 90,
          },
          {
            title: '操作',
            align: 'center',
            minWidth: 150,
            render : (h, params) => {
              return h('div',[
                h('Button',{
                  props:{
                    type:'primary',
                    size:'small',
                  },
                  style:{
                    margin:'2px'
                  },
                  on:{
                    click:()=>{
                      this.distribution(params.row.uuid)
                    }
                  }
                },'分配'),
                h('Button',{
                  props:{
                    type:'error',
                    size:'small',
                  },
                  style:{
                    margin:'2px'
                  },
                  on:{
                    click:()=>{
                      this.moveRecover(params.row.uuid,params.row.name)
                    }
                  }
                },'置入回收站')
              ])


//              return `<i-button type="primary" size="small" @click="distribution('${row.uuid}')">分配</i-button>
//              <i-button type="error" size="small" @click="moveRecover('${row.uuid}','${row.name}')">置入回收站</i-button>`;
            }
          }
        ]
      }
    },
    mounted() {
      this.getAllChannelLevel();
      let _this = this;
      //获取科目
      // common.ajax({
      //   url: COMMON_API().allSubject,
      //   method: 'get',
      //   success: function (res) {
      //     _this.subjectList = res.data || [];
      //   }
      // });
      this.$axios.get(COMMON_API().allSubject,{
      }).then( ({data}) => {
        _this.subjectList = data.data || [];
      })
      $.getJSON("static/data.json", function (json) {
        _this.gradeList = json.gradeList;
      });
      this.searchForm();
    },
    methods: {
      clearSearchForm() {
        clearSearchForm(this.Search,[this.$refs.createDate,this.$refs.classDate,this.$refs.classDates]);
      },
      // 获取渠道等级
      getAllChannelLevel(){
        const _this = this;
        // common.ajax({
        //   url: COMMON_API().allChannelLevel,
        //   method: 'get',
        //   success: function(response){
        //     _this.channelLevelList = response.data || []
        //   }
        // });
        this.$axios.get(COMMON_API().allChannelLevel,{
        }).then( ({data}) => {
          _this.channelLevelList = data.data || []
        })
      },
      showSalesModal() {
        let row = this.selectionRows;
        if (row.length > 0) {
          this.$refs.sales.show();
        } else {
          common.msg('请选择名单','warning');
        }
      },
      distribution(leadsIds) {
        this.selectionRows.length = 1;
        this.selectionRows[0] =  {"uuid": leadsIds};
        $sStorage.set('selectionRows' ,this.selectionRows);
        this.showSalesModal();
      },
      moveRecover(uuid,name) {
        const _this = this;
        this.$Modal.confirm({
          title: '提示',
          content: '确认要将学生 <span class="c-red">'+name+'</span> 放入回收站吗？',
          onOk() {
            // common.ajax({
            //   url: DISTRIBUTE().Leads.recycleLeads,
            //   method: 'get',
            //   data: { leadsUuid: uuid},
            //   success(res){
            //     common.notices('操作成功');
            //     _this.searchForm();
            //   }
            // });
            this.$axios.get(DISTRIBUTE().Leads.recycleLeads,{
              params:{
                leadsUuid: uuid,
              }
            }).then( () => {
              common.notices('操作成功');
              _this.searchForm();
            })
          }
        });
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
          startGiveUpDate: this.Search.startGiveUpDate,
          endGiveUpDate: this.Search.endGiveUpDate,
          signUpStartDate: this.Search.signUpStartDate,
          signUpEndDate: this.Search.signUpEndDate,
          // leads创建时间
          createStartDate: this.Search.createStartDate,
          createEndDate: this.Search.createEndDate,
		      oldUserName: this.Search.oldUserName,
          channelLevel: this.Search.channelLevel,
          subject:this.Search.subject,
          grade: this.Search.grade,
          isRecommend: this.Search.isRecommend,
          signStatus: this.Search.signStatus ? 1: 0
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        // let param = `?name=${search.name}&phone=${search.phone}&signStatus=${search.signStatus}&startGiveUpDate=${search.startGiveUpDate}&endGiveUpDate=${search.endGiveUpDate}&signUpStartDate=${search.signUpStartDate}&signUpEndDate=${search.signUpEndDate}&oldUserName=${search.oldUserName}&channelLevel=${search.channelLevel}&subject=${search.subject}&grade=${search.grade}&isRecommend=${search.isRecommend}`;
        // param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}&type=0`;
        const _this = this;
        // common.ajax({
        //   url: DISTRIBUTE().Leads.dataRecycle+param,
        //   method: 'get',
        //   success: function(res){
        //     _this.data = res.data['data'] || [];
        //     _this.total = res.data.total;
        //   },
        //   successError(res){
        //     common.notices(res.code+":"+res.msg,'数据加载失败','error');
        //   }
        // });
        this.$axios.post(DISTRIBUTE().Leads.dataRecycle,{
          name: search.name,
          phone: search.phone,
          signStatus: search.signStatus,
          startGiveUpDate: search.startGiveUpDate,
          endGiveUpDate: search.endGiveUpDate,
          signUpStartDate: search.signUpStartDate,
          signUpEndDate: search.signUpEndDate,
          //leads创建时间
          leadsCreateStartDate: search.createStartDate,
          leadsCreateEndDate: search.createEndDate,
          oldUserName: search.oldUserName,
          channelLevel: search.channelLevel,
          subject: search.subject,
          grade: search.grade,
          isRecommend: search.isRecommend,
          pageIndex: this.pageIndex,
          pageNumber: this.pageNumber,
          orderBy: orderBy,
          sortBy: sortBy,
          type:0,
        }).then( ({data}) => {
          _this.data = data.data['data'] || [];
          _this.total = data.data.total;
          if(data.code !== '100'){
            common.notices(data.code+":"+data.msg,'数据加载失败','error');
          }
        })
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
      changeGiveUpTime(value) {
        this.Search.startGiveUpDate = value[0] || '';
        this.Search.endGiveUpDate = value[1] || '';
      },
      setUpTime(value) {
        this.Search.signUpStartDate = value[0] || '';
        this.Search.signUpEndDate = value[1] || '';
      },
      createTime(value) {
        this.Search.createStartDate = value[0] || '';
        this.Search.createEndDate = value[1] || '';
      },
      reFresh(){
        this.searchForm();
      }
    },
    components: {OBreadcrumb,selectSales,PageModel}
  };
</script>

<style scoped>

</style>
