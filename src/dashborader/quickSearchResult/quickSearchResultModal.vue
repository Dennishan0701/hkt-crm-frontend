<template>
  <div>
    <Modal
      title="搜索结果"
      v-model="modal"
      :mask-closable="false"
      :closable="true"
      width="800"
      class-name="vertical-center-modal">
      <div class="grid-widget">
        <i-button type="primary" size="small" icon="checkmark" :disabled="isMark" @click="markToSign">标记为S名单</i-button>
      </div>
      <i-table size="small" :loading="loading" highlight-row :columns="columns" :data="data" @on-current-change="getCurrentData"></i-table>
      <div class="gridPage">
        <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
        <!--<Page :current="pageIndex" :total="total" :page-size="10" size="small" show-total @on-change="pageChange"></Page>-->
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {common,hideCharAtNumber} from 'common/js/common.js';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        modal: false,
        param: '',
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: 10,
        isMark: true,
        currentPhone: '',
        loading:false,
        columns: [
          {
            title: '身份',
            key: 'teacherStatus',
            align:'center',
            render(h,params) {
              return h('span',params.row.identity==2? '老师': '学生')
            }
          },
          {
            title: '姓名',
            align:'center',
            key: 'name',
          },
          {
            title: '手机号',
            align:'center',
            key: 'phone',
            render (h, params) {
              return h('span',hideCharAtNumber(params.row.phone));
            }
          },
          {
            title: '所属销售',
            key: 'ccName',
            align:'center',
            render (h, params) {
              if (params.row.crName) {
                return h('span',params.row.crName);
              } else {
                return h('span',params.row.ccName);
              }
            }
          },
          {
            title: '学生状态',
            align:'center',
            key: 'studentStatus',
            render : (h, params) => {
              if (params.row.studentStatus == 0) {
                return h('span',{
                  attrs:{
                    class:'o-tag blue'
                  }
                },'新名单')
              }else if(params.row.studentStatus == 1){
        return h('span',{
          attrs:{
            class:'o-tag blue'
          }
        },'藏经阁')
//                return '<span class="o-tag blue">藏经阁</span>'
              }else if(params.row.studentStatus == 2){
        return h('span',{
          attrs:{
            class:'o-tag yellow'
          }
        },'离职leads')
//                return '<span class="o-tag yellow">离职leads</span>'
              }else if(params.row.studentStatus == 3){
        return h('span',{
          attrs:{
            class:'o-tag red'
          }
        },'离职正式生')
//                return '<span class="o-tag red">离职正式生</span>'
              }else {
                return h('span','--')
              }
            }
          },
          {
            title: '老师状态',
            align:'center',
            key: 'teacherStatus',
            render : (h, params) => {
              if (params.row.teacherStatus == 1) {
                return h('span',{
                  attrs:{
                    class:'o-tag blue'
                  }
                },'待面试')
//                return '<span class="o-tag blue">待面试</span>'
              }else if(params.row.teacherStatus == 2){
                return h('span',{
                  attrs:{
                    class:'o-tag blue'
                  }
                },'待培训')
//                return '<span class="o-tag blue">待培训</span>'
              }else if(params.row.teacherStatus == 3){
                return h('span',{
                  attrs:{
                    class:'o-tag blue'
                  }
                },'待完善资料')
//                return '<span class="o-tag blue">待完善资料</span>'
              }else if(params.row.teacherStatus == 4){
                return h('span',{
                  attrs:{
                    class:'o-tag blue'
                  }
                },'待二次培训')
//                return '<span class="o-tag blue">待二次培训</span>'
              }else if(params.row.teacherStatus == 5){
                return h('span',{
                  attrs:{
                    class:'o-tag blue'
                  }
                },'讲师可排课')
//                return '<span class="o-tag blue">讲师可排课</span>'
              }else if(params.row.teacherStatus == 6){
                return h('span',{
                  attrs:{
                    class:'o-tag yellow'
                  }
                },'不可排课')
//                return '<span class="o-tag yellow">不可排课</span>'
              }else if(params.row.teacherStatus == 20){
                return h('span',{
                  attrs:{
                    class:'o-tag red'
                  }
                },'回收站')
//                return '<span class="o-tag red">回收站</span>'
              }else {
                return h('span','--')
              }
            }
          },
          {
            title: '销售手机号',
            align:'center',
            key: 'ccPhone',
            render (h, params) {
              if ( params.row.crPhone) {
                return h('span',params.row.crPhone);
              } else {
                return h('span',params.row.ccPhone);
              }
            }
          },
          {
            title: 'S名单',
            align:'center',
            key: 'signStatus',
            render (h, params) {
              if(!params.row.teacherStatus){
                if(params.row.signStatus) {
                  return h('span',{
                    attrs:{
                      class:'o-tag red'
                    }
                  },'是')
//                  return '<span class="o-tag red">是</span>';
                }else{
                  return h('span',{
                    attrs:{
                      class:'o-tag grey'
                    }
                  },'否')
//                  return '<span class="o-tag grey">否</span>'
                }
              }else {
                return h('span','--')
              }
            }
          }
        ]
      }
    },
    methods: {
      show(param) {
        this.param = param;
        this.loadDataGrid();
      },
      loadDataGrid(orderBy = '', sortBy = '') {
        this.loading = true;
//        let parameter = `?param=${this.param}&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&
//        orderBy=${orderBy}&sortBy=${sortBy}&type=1`;
        const _this = this;
        common.ajax({
          url: COMMON_API().quickSearch.search,
//          method: 'get',
          data:{
            word:_this.param,
            pageIndex:_this.pageIndex,
            pageNumber:_this.pageNumber,
            orderBy:orderBy,
            sortBy:sortBy,
            type:1
          },
          success: function (res) {
            _this.loading = false;
            _this.modal = true;
            _this.data = res.data['list'];
            _this.total = res.data.total;

          }
        });
      },
      markToSign() {
        let phone = this.currentPhone;
        if(phone) {
          const _this = this;
          common.ajax({
            url: COMMON_API().quickSearch.markToS,
            data: { phone: phone},
            success: function (res) {
              common.notices('操作成功');
              _this.loadDataGrid();
            }
          });
        }else{
          common.msg('请选择一行数据');
        }
      },
      getCurrentData(currentRow) {
        if(currentRow.signStatus.toString() === '1') {
          this.isMark = true;
        }else if(currentRow.signStatus.toString() === '0'){
          this.isMark = false;
        }
        this.currentPhone = currentRow.phone;
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.loadDataGrid();
      }
    },
    components:{PageModel}
  };
</script>

<style>

</style>
