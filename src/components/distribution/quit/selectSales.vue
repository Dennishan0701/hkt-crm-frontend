<template>
  <div>
    <Modal
      title="选择销售"
      v-model="modal"
      :mask-closable="false"
      :closable="false"
      :loading="loading"
      @on-ok="onOk"
      class-name="vertical-center-modal">
      <div class="grid-widget">
        <Row>
          <i-col span="24" class="right">
            <strong class="label">分配给：</strong>
            <i-input v-model="SearchUser.userParam" @on-keyup.enter="searchUserForm" placeholder="请输入团队\销售姓名"
                     style="width:150px;"></i-input>
            &nbsp;
            <i-button type="primary" icon="ios-search" @click="searchUserForm">搜索</i-button>
          </i-col>
        </Row>
      </div>
      <i-table size="small" highlight-row :columns="columns" :data="data"
               @on-current-change="getUserSelections"></i-table>
      <div class="gridPage">
        <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
        <!--<Page :total="total" :page-size="pageNumber" @on-change="pageChange" size="small" show-total></Page>-->
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
        loading: true,
        SearchUser: {
          userParam: ''
        },
        columns: [
          {
            title: '销售姓名',
            key: 'userName',
            render: (h, params) => {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'person'
                  }
                }),
                h('strong', {}, params.row.userName)
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
      console.log('formType', this.formType);
    },
    methods: {
      show() {
        this.modal = true;
        this.searchUserForm();
      },
      searchUserForm() {
        this.loadDataGrid({
          param: this.SearchUser.userParam
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = ''){

        let apiUrl = DISTRIBUTE().distributionLeadsToUser;
        if (this.formType === 'formalStudent') {//离职正式生
          apiUrl = DISTRIBUTE().distributionStudentToUser;
        }
        let param = `?param=${search.param}&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        // common.ajax({
        //   url: apiUrl + param,
        //   method: 'get',
        //   success: function (response) {
        //     _this.data = response.data.distributionUserVos || [];
        //     _this.total = response.data.total;
        //   },
        //   successError(response){
        //     common.notices(response.code + ":" + response.msg, '数据加载失败 ', 'error');
        //   }
        // });
        this.$axios.get(apiUrl + param,{
        }).then( ({data}) => {
          _this.data = data.data.distributionUserVos || [];
          _this.total = data.data.total;
        })
      },
      onOk() {
        this.loading = false;
        let userUuid = this.selectedUserUuid;
        let apiUrl = DISTRIBUTE().QuitLeads.distribution;
        if (this.formType === 'formalStudent') {
          apiUrl = DISTRIBUTE().QuitFormalStudent.distribution;
        }
        let _this = this;
        if (userUuid !== "") {
          let leadsAndOldUserUuid = this.getRowUUID();
          console.log(leadsAndOldUserUuid);
          // common.ajax({
          //   url: apiUrl,
          //   data: {userUuid: userUuid, leadsAndOldUserUuid: leadsAndOldUserUuid, type: _this.formType},
          //   success: function (response) {
          //     common.notices('分配成功！');
          //     _this.$emit('reFresh', 'success');
          //   }
          // });
          this.$axios.post(apiUrl,{
            userUuid: userUuid,
            leadsAndOldUserUuid: leadsAndOldUserUuid,
            type: _this.formType
          }).then( () => {
            common.notices('分配成功！');
            _this.$emit('reFresh', 'success');
          })
        } else {
          setTimeout(() => {
            this.loading = true;
          }, 0);
          common.notices('请选择一个销售', '提示', 'warning');
        }
      },
      getRowUUID() {
        let rows = $sStorage.get('selectionRows');
        let ids = '';
        if (rows && rows.length > 0) {
          let uuid;
          rows.forEach((item) => {
            uuid = item.uuid || item.leadsUuid;
            ids += uuid + ':' + item.oldUserUuid + ',';
          });
          ids = ids.slice(0, -1);
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
