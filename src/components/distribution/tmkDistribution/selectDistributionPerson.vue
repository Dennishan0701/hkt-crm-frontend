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
        form:{},
        modal: false,
        flag: '',
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: 10,
        selectedUserUuid: '',
        selectedUserName: '',
        leadsUuids: '',
        SearchUser: {
          userParam: ''
        },
        columns: [
          {
            title: '销售姓名',
            key: 'name',
            align:'center',
            render : (h, params) => {
              return h('div',[
                h('Icon',{
                  props:{
                    type:'person'
                  }
                }),
                h('strong',params.row.name)
              ])
            }
          },
        ],
      }
    },
    mounted(){
      console.log('formType',this.formType);
    },
    methods:{
      show(flag,leadsUuids,form) {
        this.form = form;
        this.flag = flag;
        this.leadsUuids = leadsUuids;
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
        const _this = this;
        this.$axios.get(  DISTRIBUTE().TmkDistribution.getTmkUserList,{
          params:{
            pageIndex: pageIndex,
            pageNumber: _this.pageNumber,
            name:search.param
          },
        }).then( ({data}) => {
          console.log(data);
          _this.data = data.data.userList || [];
          _this.total = data.data.total;
        })
      },
      onOk() {
        let app = this;
        let apiUrl,param
        let userUuid = app.selectedUserUuid;
        let userName = app.selectedUserName;
        let leadsUuids = app.leadsUuids;
        if(app.flag == 'sig'){
          apiUrl = DISTRIBUTE().TmkDistribution.assignLeads;
          param = `?userUuid=${userUuid}&leadsUuid=${leadsUuids}&userName=${userName}`;
        }else if(app.flag == 'mul'){
          // let nameAndPhone = app.form.nameAndPhoneValue;
          // let name = '',phone = '';
          // if(!nameAndPhone) nameAndPhone = '';
          // if (isNaN(nameAndPhone)) {
          //   name = nameAndPhone;
          // } else {
          //   phone = nameAndPhone;
          // }
          apiUrl = DISTRIBUTE().TmkDistribution.batchAssignLeads;
          // param = `?userUuid=${userUuid}&userName=${userName}&name=${name}&phone=${phone}&subject=${app.form.subject}&grade=${app.form.grade}&signUpStartDate=${app.form.signUpStartDate}&signUpEndDate=${app.form.signUpEndDate}&channelLevel=${app.form.channelLevel}&followResult=${app.form.followResult}`;
          param = `?userUuid=${userUuid}&userName=${userName}&leadsUuids=${leadsUuids}`;
        }
        app.$axios.get(apiUrl + param,{
        }).then( ({data}) => {
          common.notices('分配成功！');
          app.modal = false;
          app.$emit('reFresh', 'success');
          console.log(app.flag);
        })

        // let _this = this;
        // if (userUuid !== "") {
        //   let leadsUuids = this.getRowUUID();
        //   console.log(userUuid);
        //   console.log(leadsUuids);
        //   this.$axios.get( apiUrl,{
        //     params:{
        //       userUuid: userUuid,
        //       leadsUuid: leadsUuids,
        //       userName:userName
        //     }
        //   }).then( () => {
        //     common.notices('分配成功！');
        //     _this.modal = false;
        //     _this.$emit('reFresh', 'success');
        //   })
        // } else {
        //   common.notices('请选择一个销售','提示','warning');
        // }
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
        this.selectedUserName = currentRow.name;
      },
    },
    components:{PageModel}
  }
</script>

<style scoped>

</style>
