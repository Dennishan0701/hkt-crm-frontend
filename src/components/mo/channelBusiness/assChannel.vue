<template>
  <Modal
    class="assChannelmodal"
    title="关联渠道"
    v-model="modal"
    :mask-closable="false"
    :closable="false"
    :loading="loading"
    @on-ok="onOk('formValidate')"
    @on-cancel="cancel"
    class-name="vertical-center-modal">
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <form>
            <i-input v-model="Search.param" @on-keyup.enter="searchForm(1)" placeholder="渠道名称" :size="$store.state.searchModuleSize"
                     style="width:200px;margin-right:2px;"></i-input>
            <i-button type="primary" icon="ios-search" :size="$store.state.searchModuleSize" @click="searchForm(1)">搜索</i-button>
          </form>
        </i-col>
      </Row>
    </div>
    <!--<i-table size="small" highlight-row stripe :columns="columns" :data="data"></i-table>-->

    <table class="onlyhi-table" style="margin: 10px 0;">
      <tr>
        <th colspan=4 style="text-align: left;padding-left: 5px">
          已选
        </th>
      </tr>
      <tr v-for="(item,index) in data0" :key='index'>
        <td>
          {{index+1}}
        </td>
        <td>
          {{item.name}}
        </td>
        <td>
          {{item.adid}}
        </td>
        <td>
          <i-button @click="del(index)":size="$store.state.searchModuleSize" type="warning">删除</i-button>
        </td>
      </tr>
    </table>
    选择学生添加
    <table class="onlyhi-table">
      <tr>
        <th>序号</th>
          <th>渠道名称</th>
          <th>ADID</th>
          <th>操作</th>
      </tr>
      <tr v-for="(item,index) in data" :key='index'>
        <td>
          {{index+1}}
        </td>
        <td>
          {{item.name}}
        </td>
        <td>
          {{item.adid}}
        </td>
        <td>
          <i-button @click="add(index)" :size="$store.state.searchModuleSize" type="success">添加</i-button>
        </td>
      </tr>
    </table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :current="pageIndex" :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>

    <!--<i-table size="small"  :columns="columns0" :data="data0"></i-table>-->

  </Modal>
</template>

<script type="text/ecmascript-6">
  import {MO} from 'common/api/mo.js';
  import {common} from 'common/js/common.js';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        loading: true,
        modal: false,
        Search: {
          param: '',
        },
        data: [],
        data0: [],
        total: 0,
        courseUuid: '',
        pageIndex: 1,
        pageNumber: 3,
      }
    },
    methods: {
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          param: this.Search.param,
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?channelName=${search.param}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: MO().channelBusiness.getPageChannel + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['channelVos'] || [];
            _this.total = res.data.total;
          }
        });
      },
      show() {
//        console.log(channelVos);
//        this.data0 = channelVos || [];
//        console.log(this.data0);
        this.searchForm();
        this.modal = true;
      },
      add(index){
        this.data0.push(this.data[index]);
        console.log(this.data0);
        this.data.splice(index, 1)
      },
      del(index){
        this.data0.splice(index, 1)
      },
      onOk(name) {
        this.loading = false;
        const _this = this;
        let channelUuids = '';
        let channels = '';
        _this.data0.forEach(function (v, i) {
          channelUuids +=v.uuid+',';
          channels +=v.name+',';
        })
          sessionStorage.setItem("addChannelUuids",channelUuids);
          sessionStorage.setItem("channels",channels);
        _this.$emit('reFresh', 'getLeads');
        _this.data0 = [];
          _this.modal = false;
      },
      cancel(){
//          sessionStorage.setItem("addChannelUuids",leadsUuids);
          this.$emit('reFresh', 'success');
          this.data0 = [];
          this.modal = false;
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      }
    },
    components:{PageModel}
  };
</script>

<style lang=less>
  .assChannelmodal{
    .ivu-modal-body{
      max-height: 600px;
      overflow-y: auto;
      height: auto;
    }
  }
</style>
