<template>
<div>
  <o-breadcrumb second="市场与运营" third="TMK名单导入"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="6">
        <i-button type="primary" :size="$store.state.searchModuleSize" icon="plus" @click="showAdd">导入</i-button>
      </i-col>
      <!--<i-col span="18" class="right">-->
      <!--<i-input v-model="nameValue" placeholder="渠道名称" style="width:150px;margin-right:2px;"></i-input>-->
      <!--<i-button type="primary" icon="ios-search" @click="searchForm">搜索</i-button>-->
      <!--</i-col>-->
    </Row>
  </div>
  <i-table size="small" :height="theight" stripe :columns="columns" :data="data" @on-current-change="currentData"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :current="pageIndex" :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>
  <input type="file" id="fileInput" @change="onChangeFileOk" style="display: none;"/>
</div>
</template>

<script type="text/ecmascript-6">
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import {MO} from 'common/api/mo.js';
  import {common,uploadAjax,formateDate,getFullPhone,hideCharAtNumber} from 'common/js/common.js';
  import {COMMON_API} from 'common/api.config.js';
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
            title: '渠道',
            key: 'channel',
            minWidth: 120,
            align:'center'
          },
          {
            title: '姓名',
            key: 'name',
            minWidth: 90,
            align:'center'
          },
          {
            title: '手机号',
            key: 'phone',
            minWidth: 120,
            align:'center',
            render : (h, params) => {

            return h('div',[
              h('span',hideCharAtNumber(params.row.phone)),
              h('i',{
                style:{
                  margin:'2px'
                },
                attrs:{
                  class:'ivu-icon ivu-icon-eye',
                  title:'获取号码'
                },
                style:{
                  fontSize:'18px',
                  verticalAlign:'top',
                  cursor:'pointer'
                },
                on:{
                  click:()=>{
                  this.getFullPhone(params.row.phone)
              }
          }
      })
    ])
//              return hideCharAtNumber(row.phone) + ` <Icon type="eye" @click="getFullPhone('${row.phone}')" class="call" title="获取号码"></Icon>`;
            }
          },
          {
            title: '年级',
            key: 'grade',
            minWidth: 90,
            align:'center'
          },
          {
            title: '科目',
            key: 'subject',
            minWidth: 90,
            align:'center'
          },
          {
            title: '报名时间',
            key: 'registDate',
            align:'center',
            minWidth:180,
            render(h, params) {
              return h('span',formateDate(params.row.registDate,'yyyy-MM-dd hh:mm:ss'))
            }
          },
        ]
      }
    },
    mounted() {
      this.loadDataGrid();
    },
    methods: {
      loadDataGrid(orderBy = '', sortBy = '') {
        const _this = this;
        common.ajax({
          url: MO().TMK.getWrongImportList+'?pageIndex='+this.pageIndex+'&pageNumber='+ this.pageNumber,
          method: 'get',
          success: function(res){
            _this.data = res.data['result'] || [];
            _this.total = res.data.count;
          }
        });
      },
      showAdd(){
        document.getElementById('fileInput').click();
      },

      getFullPhone(phone) {
        getFullPhone(phone, COMMON_API().getPhoneHZ);
      },
      onChangeFileOk(event) {
        const _this = this;
        let fileInput = document.getElementById('fileInput');

        let files = fileInput.files[0];
        uploadAjax({
          url: MO().TMK.uploadFile,
//          method:'get',
          data: {
            "file": files,
          },
          success: function (res) {
            event.target.value = '';
            common.notices(res.msg,'提示')
            _this.loadDataGrid();
          }
        });
      },
      currentData(currentRow) {
        this.currentRowData = currentRow;
      },
      pageChange(pageIndex){
        this.pageIndex = pageIndex;
        this.loadDataGrid({channelName: this.nameValue});
      }
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470: '';
      }
    },
    components: {
      OBreadcrumb,PageModel
    }
  };
</script>

<style>

</style>
