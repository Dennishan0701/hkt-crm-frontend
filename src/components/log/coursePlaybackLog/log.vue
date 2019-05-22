<template>
  <Modal
    v-model="modal"
    title="客户端日志"
    :closable="false"
    :mask-closable="false">
    <i-table size="small" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :current="pageIndex" :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
  </Modal>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API,apiHiCRM} from 'common/api.config.js';
  import {SYS_BUSINESS} from 'common/api/logs.js';
  import {formateDate,common} from 'common/js/common.js';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        getCourseLogInfo:this.$store.state.getCourseLogInfo,
        data: [],
        modal: false,
        total: 0,
        pageNumber: 7,
        pageIndex: 1,
        classRoomUuid: '',
        columns: [
          {
            title: '客户端',
            key: 'systemClient',
            align:'center',
          },
          {
            title: '登录用户名',
            key: 'userName',
            align:'center',
          },
          {
            title: '用户类型',
            key: 'userType',
            align:'center',
          },
          {
            title: '进入房间时间',
            key: 'enterTime',
            align:'center',
          },
          {
            title: '退出房间时间',
            key: 'leaveTime',
            align:'center',
          },
        ],
      }
    },
    methods: {
      searchForm(){
        let _this = this;
        // common.ajax({
        //   url: SYS_BUSINESS().coursePlaybackLog.getCourseLogInfo,
        //   data: {
        //     classRoomUuid: _this.classRoomUuid,
        //     pageIndex: _this.pageIndex,
        //     pageNumber: _this.pageNumber,
        //   },
        //   method:'get',
        //   success: function(res){
        //     _this.data = res.data['courseLogVos']||[];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get(SYS_BUSINESS().coursePlaybackLog.getCourseLogInfo,{
          params:{
            classRoomUuid: _this.classRoomUuid,
            pageIndex: _this.pageIndex,
            pageNumber: _this.pageNumber,
          },
        }).then(({data}) => {
          _this.data = data.data['courseLogVos']||[];
          _this.total = data.data.total;
        })
      },
      show(uuid) {
        this.modal = true;
        this.classRoomUuid = uuid=='null'?'':uuid;
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
