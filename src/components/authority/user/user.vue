<template>
  <div>
    <div class="userManager">
      <o-breadcrumb second="权限管理" third="用户管理"></o-breadcrumb>
      <div class="grid-widget">
        <Row>
          <i-col span="4">
            <i-button type="primary" :size="$store.state.searchModuleSize" icon="android-person-add" @click="addUser">新增</i-button>
          </i-col>
          <i-col span="20" class="right">
            <i-input v-model="paramStr" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="姓名\团队" style="width:150px"></i-input>
            <Date-picker type="daterange" :size="$store.state.searchModuleSize" placement="bottom-end" v-model="createDate" @on-change="changeCreateDate" placeholder="创建时间" style="width: 200px"></Date-picker>
            <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索</i-button>
          </i-col>
        </Row>
      </div>
      <i-table :height="theight" size="small" highlight-row stripe :columns="columns" :data="data"></i-table>
      <div class="gridPage">
        <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
        <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
      </div>
    </div>
    <add-user @reFresh="reFresh" ref='add'></add-user>
    <edit-user @reFresh="reFresh" ref='edit'></edit-user>
    <tian-run @reFresh="reFresh" ref='tianRun'></tian-run>
    <rong-ying @reFresh="reFresh" ref='rongYing'></rong-ying>
    <rong-ying2 @reFresh="reFresh" ref='rongYing2'></rong-ying2>
    <anLai @reFresh="reFresh" ref='anLai'></anLai>
  </div>
</template>
<script type="text/ecmascript-6">
  import {AUTHORITY} from 'common/api/authority.js';
  import {formateDate,common} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import addUser from './addUser.vue';
  import editUser from './editUser.vue';
  import tianRun from './tianRun.vue';
  import rongYing from './rongYing.vue';
  import rongYing2 from './rongYing2.vue';
  import anLai from './anLai.vue';
  import PageModel from 'dashborader/page/page.vue';
  export default{
    data() {
      return {
        data: [],
        total: 0,
        paramStr: '',
        createDate: [],
        userModal: false,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        columns: [
          {
            title: '姓名',
            key: 'name',
            align:'center',
            minWidth: 90,
            render :(h,params) => {
              return h('div',[
                h('strong',{
                },params.row.name)
              ])
//              return `<!--<strong>${row.name}</strong>-->`;
            }
          },
          {
            title: '登录名',
            key: 'loginName',
            align:'center',
            minWidth: 100
          },
          {
            title: '所属部门',
            key: 'organizationName',
            align:'center',
            minWidth: 90
          },
          {
            title: '职位',
            minWidth: 90,
            align:'center',
            key: 'postsName'
          },
          {
            title: '性别',
            key: 'sex',
            align:'center',
            minWidth: 65,
            render (h, params) {
              return h('span',params.row.sex ? '男': '女')
            }
          },
          {
            title: '电话',
            align:'center',
            minWidth: 120,
            key: 'phone'
          },
          {
            title: '角色',
            width: 90,
            align:'center',
            key: 'roleName'
          },
          {
            title: '团队',
            align:'center',
            minWidth: 100,
            key: 'teamName'
          },
          {
            title: '用户类型',
            align:'center',
            minWidth: 90,
            key: 'userType',
            render (h,params) {
              if (params.row.userType == 0) {
                return h('span','普通用户');
              } else {
                return h('span','系统管理员');
              }
            }
          },
          {
            title: '创建时间',
            align:'center',
            key: 'createDate',
            minWidth: 180,
            render (h, params) {
              return h('span',formateDate(params.row.createDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '操作',
            key: 'action',
            align:'center',
            minWidth: 240,
            fixed:'right',
            render : (h, params) => {
              let seatsNo = params.row.seatsNo;
              let anLaiNo = params.row.userLogin||'';
              return h('div',[
                h('Button',{
                  props:{
                    type:'primary',
                    size:'small',
                  },
                  style:{
                    margin:'2px'
                  },
                  on:{
                    click:()=>{
                      console.log (params.row);
                      // this.bindTianRun(params.row.uuid,params.row.hotlinePhone,params.row.seatsNo,params.row.seatsPassword)
                      this.bingRY2(params.row.uuid,params.row.hotlinePhone,params.row.seatsNo,params.row.seatsPassword)
                    }
                  }
                },'绑定融营axn'),
                h('Button',{
                  props:{
                    type:anLaiNo?'primary':'info',
                    size:'small',
                  },
                  style:{
                    margin:'2px'
                  },
                  on:{
                    click:()=>{
                      if(anLaiNo){
                        this.bindAnLai(params.row.loginName,params.row.uuid,params.row.userLevel,params.row.userGroup,'edit')
                      }else{
                        this.bindAnLai(params.row.loginName,params.row.uuid,params.row.userLevel,params.row.userGroup,'add')
                      }
                    }
                  }
                },anLaiNo?'编辑安莱':'注册安莱'),
                h('Button',{
                  props:{
                    type:seatsNo?'primary':'info',
                    size:'small',
                  },
                  style:{
                    margin:'2px'
                  },
                  on:{
                    click:()=>{
                      this.bindTianRun(params.row.uuid,params.row.hotlinePhone,params.row.seatsNo,params.row.seatsPassword)
                    }
                  }
                },seatsNo?'编辑天润':'绑定天润'),
                h('Button',{
                  props:{
                    type:'primary',
                    size:'small',
                  },
                  style:{
                    margin:'2px'
                  },
                  on:{
                    click:()=>{
                      console.log (params.row);
                      // this.bindTianRun(params.row.uuid,params.row.hotlinePhone,params.row.seatsNo,params.row.seatsPassword)
                      this.bingRY(params.row.uuid,params.row.hotlinePhone,params.row.seatsNo,params.row.seatsPassword)
                    }
                  }
                },'绑定融营'),
                h('Button',{
                  props:{
                    type:'primary',
                    size:'small',
                  },
                  style:{
                    margin:'2px'
                  },
                  on:{
                    click:()=>{
                      this.edit(params.row.uuid)
                    }
                  }
                },'编辑'),
                h('Button',{
                  props:{
                    type:'error',
                    size:'small',
                  },
                  style:{
                    margin:'2px'
                  },
                  on:{
                    click:()=>{
                      this.del(params.row.uuid)
                    }
                  }
                },'删除')
              ])
//                  return `<i-button type="info" size="small" @click="bindTianRun('${row.uuid}','${row.hotlinePhone}','${row.seatsNo}','${row.seatsPassword}')">编辑天润</i-button>
//              <i-button type="primary" size="small" @click="edit('${row.uuid}')">编辑</i-button>
//              <i-button type="error" size="small" @click="del('${row.uuid}')">删除</i-button>`;
            }
          }
        ]
      };
    },
    mounted() {
      this.searchForm();
    },
    methods: {
      bingRY2(uuid) {
        console.log (uuid);
        this.$refs.rongYing2.show(uuid);
      },
      bingRY(uuid) {
        console.log (uuid);
        this.$refs.rongYing.show(uuid);
      },
      bindTianRun(uuid,hotlinePhone,seatsNo,seatsPassword) {
        this.$refs.tianRun.show(uuid,hotlinePhone,seatsNo,seatsPassword);
      },
      bindAnLai(userLogin,uuid,userLevel,userGroup,status){
        this.$refs.anLai.show(userLogin,uuid,userLevel,userGroup,status);
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          param: this.paramStr,
          startDate: this.createDate[0] || '',
          endDate: this.createDate[1] || ''
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?param=${search.param}&startDate=${search.startDate}&endDate=${search.endDate}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        // common.ajax({
        //   url: AUTHORITY().SystemUser.dataGrid+param,
        //   method: 'get',
        //   success: function(res){
        //     _this.data = res.data['userDtos'] || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get(AUTHORITY().SystemUser.dataGrid,{
          params:{
            param:search.param,
            startDate:search.startDate,
            endDate:search.endDate,
            pageIndex:this.pageIndex,
            pageNumber:this.pageNumber,
            orderBy:orderBy,
            sortBy:sortBy,
          }
        }).then( ({data}) => {
          _this.data = data.data['userDtos'] || [];
          _this.total = data.data.total;
        });
      },
      addUser() {
        this.$refs.add.show();
      },
      del(uuid) {
        let _this = this;
        this.$Modal.confirm({
          title: '确认',
          content: '请谨慎使用，您确认要删除该用户吗？如果手误赶快点击取消哦！',
          onOk: function() {
            // common.ajax({
            //   url: AUTHORITY().SystemUser.delete,
            //   data: {uuid: uuid},
            //   success: function(response){
            //     common.notices('操作成功');
            //     _this.searchForm();
            //   }
            // });
            this.$axios.post(AUTHORITY().SystemUser.delete,{
              uuid:uuid,
            }).then( () => {
              common.notices('操作成功');
              _this.searchForm();
            });
          }
        });
      },
      edit(uuid) { this.$refs.edit.show(uuid);},
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      changeCreateDate(value) {
        this.createDate = value || [];
      },
      reFresh(){
        this.searchForm();
      }
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470: '';
      }
    },
    components: {
      OBreadcrumb, addUser, editUser, tianRun, rongYing,rongYing2, anLai ,PageModel
    }
  };
</script>
<style>
</style>
