<template>
  <div>
    <Modal
      title="选择可分配人员"
      v-model="modal"
      :mask-closable="false"
      :closable="false"
      @on-ok="onOk"
      class-name="vertical-center-modal">
      <!--<div class="grid-widget">-->
        <!--<Row>-->
          <!--<i-col span="24" class="right">-->
            <!--<strong class="label">分配给：</strong>-->
            <!--<i-input v-model="SearchUser.userParam" size="small" @on-keyup.enter="searchUserForm" placeholder="请输入团队\销售姓名" style="width:150px;"></i-input>-->
            <!--&nbsp;<i-button type="primary" icon="ios-search" size="small" @click="searchUserForm">搜索</i-button>-->
          <!--</i-col>-->
        <!--</Row>-->
      <!--</div>-->
      <i-table size="small" highlight-row :columns="columns" :data="data" @on-current-change="getUserSelections"></i-table>
      <div class="gridPage">
        <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
        <!--<Page :current="pageIndex" :total="total" :page-size="pageNumber" @on-change="pageChange" size="small" show-total></Page>-->
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {common} from 'common/js/common.js';
  import {ZHAO_TEACHER, TEACHER} from 'common/api/teacher.js';
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
        params: {},
        total: 0,
        pageIndex: 1,
        pageNumber: 10,
        selectedUserUuid: '',
        selectedUserName: '',
        SearchUser: {
          userParam: ''
        },
        temp:'',
        columns: [
          {
            title: '销售姓名',
            key: 'userName',
            // render (row, column, index) {
            //   return `<Icon type="person"></Icon> <strong>${row.name}</strong>`;
            // },
            render:(h,params) => {
              return h('div',[
                h('Icon',{
                  props:{
                    type:'person',
                  },
                  attrs:{
                    title: params.row.name
                  },
                  style:{
                    margin:'2px'
                  }
                }),
                h('strong',{
                  props:{
                    type:'',
                    size:'',
                    icon:''
                  },
                  attrs:{
                    title:''
                  },
                  style:{
                    margin:'2px'
                  },
                },params.row.name)
              ])
            }
          },
        ],
      }
    },
    mounted(){
    },
    methods:{
      show(temp,value) {
        this.temp = temp;
        this.params = value || {};
        this.modal = true;
        const _this = this;
        common.ajax({
          url: ZHAO_TEACHER().waitAssignTeacher.getUserList,
          method: 'get',
          success: function(response){
            _this.data = response.data.userList || [];
            _this.total = response.data.total;
          },
          successError(response){
            _this.notices(response.code+":"+response.msg,'数据加载失败 ','error');
          }
        });
//        this.searchUserForm();
      },
      onOk() {
        let userUuid = this.selectedUserUuid;
        let userName = this.selectedUserName;
        let _this = this;
        if(_this.temp == 'all'){
          //条件分配
          common.ajax({
            url: ZHAO_TEACHER().waitAssignTeacher.batchAssign,
            data: {
              userName:userName,
              userUuid:userUuid,
              tcName:_this.params.tcName,
              phone:_this.params.phone,
              referral:_this.params.referral,
              invitationUser:_this.params.invitationUser,
              invitationIsNull:_this.params.invitationIsNull,
              email:_this.params.email,
              createDateStart:_this.params.createDateStart,
              createDateEnd:_this.params.createDateEnd,
              updateDateStart:_this.params.updateDateStart,
              updateDateEnd:_this.params.updateDateEnd,
              teachingSubject:_this.params.teachingSubject,
            },
            success: function(response){
              common.notices('分配成功！');
              _this.modal = false;
              _this.$emit('reFresh', 'success');
            }
          });

        }else if (userUuid !== "") {
          let URL = '';
          let leadsUuids,assignList;
          if(_this.temp == 'one'){
            leadsUuids = $sStorage.get('assignTeacherRows')[0].uuid;
            assignList = {userName:userName,userUuid:userUuid,teacherUuid:leadsUuids};
            URL = ZHAO_TEACHER().waitAssignTeacher.assignInvitaion //单个分配
          }else {
            leadsUuids = _this.getRowUUID();
            assignList = {userName:userName,userUuid:userUuid,teacherUuids:leadsUuids};
            URL = ZHAO_TEACHER().waitAssignTeacher.batchAssign;//批量分配
          }
          common.ajax({
            url: URL,
            data: assignList,
            success: function(response){
              common.notices('分配成功！');
              _this.modal = false;
              _this.$emit('reFresh', 'success');
            }
          });
        } else {
          common.notices('请选择一个销售','提示','warning');
        }
      },
      getRowUUID() {
        let rows = $sStorage.get('assignTeacherRows');
        let ids = '';
        if (rows && rows.length > 0) {
          let uuid;
          rows.forEach((item) => {
            uuid = item.uuid || item.leadsUuid;
            ids += uuid + ',';
          });
          ids = ids.slice(0,-1);
        } else if (rows && rows.length === 1) {
          ids = rows[0].uuid;
        }
        return ids;
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
//        this.searchUserForm();
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
