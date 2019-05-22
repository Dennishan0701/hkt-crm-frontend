<template>
	<div>
    <o-breadcrumb second="招师代理" third="老师列表"></o-breadcrumb>
    <div class="grid-widget">
      <i-input v-model="Search.params" placeholder="姓名/手机号" style="width:200px;margin-right:2px;"></i-input>
      <i-button type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
    </div>
    <Tabs active-key="key1">
      <Tab-pane label="未入库" icon="ios-filing" key="key1">
        <i-table size="small" highlight-row stripe :columns="columns" :data="data1"></i-table>
        <div class="gridPage">
          <!--<PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>-->
          <Page :total="total1" :page-size="pageNumber" size="small" @on-change="pageChange1" show-total show-elevator></Page>
        </div>
      </Tab-pane>
      <Tab-pane label="已入库" icon="log-in" key="key2">
        <i-table size="small" highlight-row stripe :columns="columns" :data="data2"></i-table>
        <div class="gridPage">
          <Page :total="total2" :page-size="pageNumber" size="small" @on-change="pageChange2" show-total show-elevator></Page>
        </div>
      </Tab-pane>
      <Tab-pane label="回收站" icon="trash-a" key="key3">
        <i-table size="small" highlight-row stripe :columns="columns" :data="data3"></i-table>
        <div class="gridPage">
          <Page :total="total3" :page-size="pageNumber" size="small" @on-change="pageChange3" show-total show-elevator></Page>
        </div>
      </Tab-pane>
    </Tabs>

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
        data1: [],
        data2: [],
        data3: [],
        total1: 0,
        total2: 0,
        total3: 0,
        pageIndex1: 1,
        pageIndex2: 1,
        pageIndex3: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11: 17,
        Search: {
          params: ''
        },
        columns: [
          {
            title: '姓名',
            key: 'tcName',
            width: 90
          },
          {
            title: '手机号',
            key: 'phone',
            width: 120,
          },
          {
            title: '邮箱',
            key: 'email',
            width: 180,
          },
          {
            title: '代理学校',
            key: 'schoolLocation',
            width: 200,
          },
          {
            title: 'QQ',
            key: 'qq',
            width: 120,
          },
          {
            title: '微信',
            key: 'wechat',
            width: 120,
          },
          {
            title: '工作性质',
            key: 'natureOfWorkDesc',
            width: 120,
          },
          {
            title: '科目',
            key: 'teachingSubject',
            width: 70
          },
          {
            title: '报名时间',
            key: 'registrationTime',
            width: 150,
            render(h, params) {
              return h('span',formateDate(params.row.registrationTime,'yyyy-MM-dd hh:mm:ss'));
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
          params: this.Search.params
        });
      },
      loadDataGrid(search) {
        let param = `?params=${search.params}`;
        param += `&pageIndex=${this.pageIndex1}&pageNumber=${this.pageNumber}`;
        const _this = this;
        common.ajax({
          url: ZHAO_TEACHER().Agent.teacherList + param + '&queryType=1',
          method: 'get',
          success: function (res) {
          	_this.data1 = res.data['teacherList'] || [];
          	_this.total1 = res.data.total;
          }
        });
        common.ajax({
          url: ZHAO_TEACHER().Agent.teacherList + param + '&queryType=2',
          method: 'get',
          success: function (res) {
            _this.data2 = res.data['teacherList'] || [];
            _this.total2 = res.data.total;
          }
        });
        common.ajax({
          url: ZHAO_TEACHER().Agent.teacherList + param + '&queryType=3',
          method: 'get',
          success: function (res) {
            _this.data3 = res.data['teacherList'] || [];
            _this.total3 = res.data.total;
          }
        });
      },
      pageChange1(pageIndex) {
        this.pageIndex1 = pageIndex;
        this.searchForm();
      },
      pageChange2(pageIndex) {
        this.pageIndex2 = pageIndex;
        this.searchForm();
      },
      pageChange3(pageIndex) {
        this.pageIndex3 = pageIndex;
        this.searchForm();
      }
    },
		components: { OBreadcrumb,PageModel}
	};
</script>

<style scoped>

</style>
