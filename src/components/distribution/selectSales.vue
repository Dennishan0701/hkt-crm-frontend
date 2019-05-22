<template>
  <div>
    <Modal
      title="选择销售"
      v-model="modal"
      :mask-closable="false"
      :closable="false"
      @on-ok="onOk"
      class-name="vertical-center-modal">
      <div class="grid-widget">
        <Row>
          <i-col span="24" class="right">
            <strong class="label">分配给：</strong>
            <i-input v-model="SearchUser.userParam" size="small" @on-keyup.enter="searchUserForm(1)" placeholder="请输入团队\销售姓名" style="width:150px;"></i-input>
            &nbsp;<i-button type="primary" icon="ios-search" size="small" @click="searchUserForm(1)">搜索</i-button>
          </i-col>
        </Row>
      </div>
      <i-table size="small" highlight-row :columns="columns" :data="data" @on-current-change="getUserSelections"></i-table>
      <div class="gridPage">
        <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
        <!--<Page :current="pageIndex" :total="total" :page-size="pageNumber" @on-change="pageChange" size="small" show-total></Page>-->
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {DISTRIBUTE} from 'common/api/distribute.js';
  import {common} from 'common/js/common.js';
  import PageModel from 'dashborader/page/page.vue';
  const $sStorage = $.sessionStorage;
  export default {
    props: {
      formType: {
        type: String
      }
    },
    data(){
      return {
        modal: false,
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: 10,
        selectedUserUuid: '',
        SearchUser: {
          userParam: ''
        },
        columns: [
          {
            title: '销售姓名',
            key: 'userName',
            render : (h, params) => {
              return h('div',[
                h('Icon',{
                  props:{
                    type:'person'
                  }
                }),
                h('strong',params.row.userName)
              ])
//              return `<Icon type="person"></Icon> <strong>${row.userName}</strong>`;
            }
          },
          {
            title: '团队',
            key: 'teamName'
          },
          {
            title: '职位',
            key: 'postsName'
          },
        ],
      }
    },
    mounted(){
      console.log('formType',this.formType);
    },
    methods:{
      show() {
        this.modal = true;
        this.searchUserForm();
      },
      searchUserForm(pageNum) {
        this.loadDataGrid({
          pageNum:pageNum,
          param: this.SearchUser.userParam
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = ''){
        let pageIndex =  search.pageNum || this.pageIndex;
        if(search.pageNum){ this.pageChange(1) ;return false};
        let param = `?param=${search.param}&pageIndex=${pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        let apiUrl = DISTRIBUTE().distributionLeadsToUser;//
        if(this.formType === '2'){//正式生
          apiUrl = DISTRIBUTE().distributionStudentToUser;
        }
        // common.ajax({
        //   url: apiUrl + param,
        //   method: 'get',
        //   success: function(response){
        //     _this.data = response.data.distributionUserVos || [];
        //     _this.total = response.data.total;
        //   },
        //   successError(response){
        //     _this.notices(response.code+":"+response.msg,'数据加载失败 ','error');
        //   }
        // });
        this.$axios.get( apiUrl + param,{
        }).then( ({data}) => {
          _this.data = data.data.distributionUserVos || [];
          _this.total = data.data.total;
        })
      },
      onOk() {
        let userUuid = this.selectedUserUuid;
        let apiUrl = DISTRIBUTE().Leads.distribution;
        if(this.formType === '2') {//正式生分配
          apiUrl = DISTRIBUTE().FormallStudent.distribution;
        }else if(this.formType === '5') {//回收站分配
          apiUrl = DISTRIBUTE().Recover.distribution;
        }
        let _this = this;
        if (userUuid !== "") {
          let leadsUuids = this.getRowUUID();
          console.log(userUuid);
          console.log(leadsUuids);
          this.$axios.get( apiUrl,{
            params:{
              userUuid: userUuid,
              leadsUuids: leadsUuids,
              type: _this.formType
            }
          }).then( () => {
            common.notices('分配成功！');
            _this.modal = false;
            _this.$emit('reFresh', 'success');
          })
        } else {
          common.notices('请选择一个销售','提示','warning');
        }
      },
      getRowUUID() {
        let rows = $sStorage.get('selectionRows');
        let ids = '';
        if (rows && rows.length > 0) {
          let uuid;
          rows.forEach((item) => {
            uuid = item.uuid || item.leadsUuid;
            ids += uuid + ',';
          });
          ids = ids.slice(0,-1);
        } else if (rows && rows.length === 1) {
          ids = rows[0];
        }
        return ids;
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchUserForm();
      },
      getUserSelections(currentRow) {
        this.selectedUserUuid = currentRow.uuid;
      },
    },
    components:{PageModel}
  }
</script>

<style scoped>

</style>
