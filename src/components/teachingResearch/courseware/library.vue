<template>
<div>
  <o-breadcrumb second="教研" third="自主上传课件库"></o-breadcrumb>
  <div class="grid-widget right">
    <Row>
      <i-col span="24">
        <i-input :size="$store.state.searchModuleSize" v-model="Search.coursewareName" @on-keyup.enter="searchForm(1)" placeholder="课件名称" style="width:150px;margin-right:2px;"></i-input>
        <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
      </i-col>
    </Row>
  </div>
  <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>
</div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {TEACHING_RESEARCH} from 'common/api/teachingResearch.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';
  export default{
    data() {
      return {
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: 15,
        Search: {
          coursewareName: ''
        },
        schoolList: [],
        columns: [
          {
            title: '序号',
            type: 'index',
            align:'center',
            minWidth:60,
          },
          {
            title: '课件名称',
            key: 'coursewareName',
            align:'center',
            minWidth:90,
            // render(row) {
            //   return `<a href="javascript:GLOBAL.newTab('${row.coursewarePreviewUrl}');"><strong>${row.coursewareName}</strong></a>`;
            // },
            render:(h,params) => {
              return h('div',[
                h('strong',[
                  h('a',{
                    on:{
                      click:() => {
                        GLOBAL.newTab(params.row.coursewarePreviewUrl);
                      }
                    }
                  },params.row.coursewareName)
                ])
              ])
            }
          },
          {
            title: '上传人',
            key: 'createUser',
            align:'center',
            minWidth:90,
          },
          {
            title: '放弃时间',
            key: 'createTime',
            align:'center',
            minWidth:150,
            // render (row, column, index) {
            //   return formateDate(row.createTime,'yyyy-MM-dd hh:mm:ss');
            // },
            render:(h,params) =>{
              return h('div',[
                h('span',{},formateDate(params.row.createTime,'yyyy-MM-dd hh:mm:ss'))
              ])
            }
          },
          {
            title: '操作',
            key: 'action',
            align:'center',
            minWidth:120,
            render : (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                  },
                  style: {
                    margin: '2px'
                  },
                  on: {
                    click: () => {
                      window.location.href = params.row.coursewareUrl;
                    }
                  }
                }, '下载源文件')
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
          coursewareName: this.Search.coursewareName
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?coursewareName=${search.coursewareName}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: TEACHING_RESEARCH().Library.dataGrid + param,
          success: function(response){
            _this.data = response.data.list || [];
            _this.total = response.data.total;
          }
        });
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
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
