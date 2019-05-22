<template>
  <Modal
    v-model="modal"
    title="查看资料"
    :closable="false"
    :mask-closable="false"
    @on-ok="onOk('formValidate')">
    <i-table size="small" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :current="pageIndex" :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
  </Modal>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {Course_Cast} from 'common/api/teacher.js';
  // import {formateDate,common} from 'common/js/common.js';
  import PageModel from 'dashborader/page/page.vue';
  import {formateDate, common, hideCharAtNumber} from 'common/js/common.js';


  export default{
    data() {
      return {
        data: [],
        modal: false,
        pageIndex: 1,
        total: 0,
        pageNumber: 3,
        courseUuid: '',
        teacherUuid: '',
        errorTip: '',
        scrollAll: [],
        columns: [
          {
            title: '客户端',
            key: 'systemClient',
            align:'center',
            minWidth:90,
          },
          {
            title: '登录用户名',
            key: 'loginName',
            align:'center',
            minWidth:90,
          },
          {
            title: '用户类型',
            key: 'userType',
            align:'center',
            minWidth:90,
          },
          {
            title: '进出类型',
            key: 'recordType',
            align:'center',
            minWidth:90,
          },
          {
            title: '进入房间时间',
            key: 'enterTime',
            align:'center',
            minWidth:130,
          },
          {
            title: '退出房间时间',
            key: 'leaveTime',
            align:'center',
            minWidth:130,
          },
        ],
      }
    },
    methods: {
      searchForm(){
        let _this = this;
        // common.ajax({
        //   url: Course_Cast().queryCourseLog,
        //   data: {
        //     courseUuid: _this.courseUuid,
        //     pageIndex: _this.pageIndex,
        //     pageNumber: _this.pageNumber,
        //   },
        //   success: function(res){
        //     _this.data = res.data['allCourseLogVos']||[];
        //     _this.total = res.data.total
        //   }
        // });
        this.$axios.post(Course_Cast().queryCourseLog,{
          courseUuid: _this.courseUuid,
          pageIndex: _this.pageIndex,
          pageNumber: _this.pageNumber,
        }).then( ({data}) => {
          _this.data = data.data['allCourseLogVos']||[];
          _this.total = data.data.total
        })
      },
      show(uuid) {
        this.modal = true;
        this.courseUuid = uuid;
        this.searchForm();
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      }
    },
    components:{PageModel}
  };
</script>

<style>

</style>
