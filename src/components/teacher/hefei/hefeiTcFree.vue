<template>
<div>
  <o-breadcrumb second="师资管理" third="老师空闲时间查看"></o-breadcrumb>
  <div class="grid-widget right">
    <Row>
      <i-col span="24">
        <i-input :size="$store.state.searchModuleSize" v-model="Search.teacherParams" @on-keyup.enter="searchForm(1)" placeholder="老师姓名/手机号码" style="width:150px;margin-right:2px;"></i-input>
        <i-select :size="$store.state.searchModuleSize" v-model="Search.isUpdate" clearable placeholder="是否更新空闲时间" style="width:172px">
          <i-option :value="2">更新过</i-option>
          <i-option :value="1">没有更新</i-option>
        </i-select>
        <i-select :size="$store.state.searchModuleSize" v-model="Search.natureOfWork" clearable placeholder="工作性质" style="width:172px">
          <i-option :value="1">校招全职</i-option>
          <i-option :value="2">兼职</i-option>
          <i-option :value="3">社招全职</i-option>
        </i-select>
      </i-col>
      <i-col span='24'>
        <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-end" @on-change="changePushDate" placeholder="更新空闲时间" style="width: 200px"></Date-picker>
        <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
      </i-col>
    </Row>
  </div>
  <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>
  <tc-free-model @reFresh="reFresh" ref="tcmodel"></tc-free-model>
  <tc-set-free-model @reFresh="reFresh" ref="tcsetmodel"></tc-set-free-model>
</div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {TEACHER} from 'common/api/teacher.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import tcFreeModel from 'components/teacher/tcFree/tcFreeModel';
  import tcSetFreeModel from 'components/teacher/tcFree/tcSetFreeModel';
  import PageModel from 'dashborader/page/page.vue';
  export default{
    data() {
      return {
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11: 17,
        Search: {
          teacherParams: '',
          isUpdate: '',
          natureOfWork: '',
          updateTimeStart: '',
          updateTimeEnd: '',
        },
        columns: [
          {
            title: '序号',
            type: 'index',
            width: 60,
          },
          {
            title: '老师',
            key: 'tcName',
            width: 90,
            align:'center',
          },
          {
            title: '类型',
            key: 'natureOfWorkDesc',
            align:'center',
            width: 90,
          },

          {
            title: '是否更新空闲时间',
            align:'center',
            key: 'isUpdate',
            width: 120,
          },
          {
            title: '更新时间',
            key: 'updateTime',
            align:'center',
            width: 150,
            // render (row, column, index) {
            //   return formateDate(row.updateTime,'yyyy-MM-dd hh:mm:ss');
            // },
            render:(h,params) =>{
              return h('div',[
                h('span',{},formateDate(params.row.updateTime,'yyyy-MM-dd hh:mm:ss'))
              ])
            }
          },
          {
            title: '操作',
            width: 100,
            align:'center',
            // render (row, column, index) {
            //   return `<i-button type="success" icon="ios-paper-outline" title="查看课表" size="small" @click="interview('${row.teacherUuid}')"></i-button>
            //   <i-button type="success" icon="edit" title="修改空闲时间" size="small" @click="interviewSet('${row.teacherUuid}')"></i-button>`
            // },
            render : (h, params) => {
              return h('div',[
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    icon: 'ios-paper-outline',
                  },
                  attrs: {
                    title: '查看课表',
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.interview(params.row.teacherUuid);
                    }
                  }
                }),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    icon: 'edit',
                  },
                  attrs: {
                    title: '修改空闲时间',
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.interviewSet(params.row.teacherUuid);
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
      this.searchForm();
    },
    methods: {
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          teacherParams: this.Search.teacherParams,
          isUpdate: this.Search.isUpdate,
          natureOfWork: this.Search.natureOfWork,
          updateTimeStart: this.Search.updateTimeStart,
          updateTimeEnd: this.Search.updateTimeEnd,
          branch: '2',
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?branch=${search.branch}&teacherParams=${search.teacherParams}&isUpdate=${search.isUpdate}&natureOfWork=${search.natureOfWork}&updateTimeStart=${search.updateTimeStart}&updateTimeEnd=${search.updateTimeEnd}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: TEACHER().tcFree.dataGrid + param,
          method: 'get',
          success: function(response){
            _this.data = response.data.teacherTimeList || [];
            _this.total = response.data.total;
          }
        });
      },
      interview(uuid) {
        this.$refs.tcmodel.show(uuid);
      },
      interviewSet(uuid) {
        this.$refs.tcsetmodel.show(uuid);
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      changePushDate(value) {
        this.Search.updateTimeStart = value[0] || '';
        this.Search.updateTimeEnd = value[1] || '';
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
    components: { OBreadcrumb ,tcFreeModel,tcSetFreeModel,PageModel}
  };
</script>

<style>

</style>
