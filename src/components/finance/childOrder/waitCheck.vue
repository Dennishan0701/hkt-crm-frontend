<template>
  <div>
    <o-breadcrumb second="财务" third="待审核子单"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <i-input v-model="Search.name" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="学生" style="width:150px;margin-right: 2px;r"></i-input>
          <i-input v-model="Search.phone" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="手机号" style="width:150px;margin-right:2px;"></i-input>
          <i-input v-model="Search.userName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="提交人" style="width:150px;margin-right:2px;"></i-input>
        </i-col>
        <i-col span=24 class="right">
          <Date-picker type="daterange" :size="$store.state.searchModuleSize" placement="bottom-end" @on-change="changeSubmitDate" placeholder="提交时间" style="width: 200px"></Date-picker>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">

      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>

    <Modal
      v-model="modal"
      title="拒绝原因"
      :closable="false"
      :mask-closable="false"
      :loading = "loading"
      @on-ok="reasonOk('formValidate')">
      <i-form ref="formValidate" :model="formItem" :rules="ruleValidate">
        <Form-item prop="reason">
          <i-input type="textarea" v-model="formItem.reason" :rows="4" :maxlength="500" placeholder="不要超过500字"></i-input>
        </Form-item>
      </i-form>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {FINANCE} from 'common/api/finance.js';
  import {formateDate,common,hideCharAtNumber,getFullPhone} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        modal: false,
        loading: true,
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: 15,
        payUuid: '',
        Search: {
          name: '',
          phone: '',
          userName: '',
          submitStartTime: '',
          submitEndTime: ''
        },
        formItem: {
          reason: ''
        },
        ruleValidate: {
          reason: [
            { required: true, message: '不能为空', trigger: 'change' }
          ]
        },
        columns: [
          {
            title: '子订单号',
            key: 'childOrderNo',
            align:'center',
            minWidth: 180,
          },
          {
            title: '学生',
            key: 'name',
            align:'center',
            minWidth:90,
            render : (h, params) => {
              return h('div',[
                h('strong',{},params.row.name)
              ])
//              return `<strong>${row.name}</strong>`;
            }
          },
          {
            title: '手机号',
            key: 'phone',
            align:'center',
            minWidth:120,
            render : (h, params) => {
            	if(params.row.phone) {
                return h('div',[
                  h('span',hideCharAtNumber(params.row.phone)),
                  h('i',{
                    style:{
                      margin:'2px'
                    },
                    attrs:{
                      class:'ivu-icon ivu-icon-ios-eye',
                      title:'显示全部'
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
//                return hideCharAtNumber(row.phone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.phone}')" class="eye" title="显示全部"></Icon>`;
              }else{
            		return '-';
              }
            }
          },
          {
            title: '年级',
            key: 'grade',
            align:'center',
            minWidth:90,
          },
          {
            title: '金额',
            key: 'money',
            align:'center',
            minWidth:90,
          },
          {
            title: '提交人',
            key: 'userName',
            align:'center',
            minWidth:90,
          },
          {
            title: '提交时间',
            key: 'createDate',
            align:'center',
            minWidth:180,
            render(h, params) {
              return h('span',formateDate(params.row.createDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '操作',
            align:'center',
            minWidth:90,
            render : (h, params) => {

              return h('div',[
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.pass(params.row.payUuid,params.row.leadsUuid)
                    }
                  }
                },'通过'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.reject(params.row.payUuid)
                    }
                  }
                },'拒绝')
              ])
//              return `<i-button type="success" size="small" @click="pass('${row.payUuid}','${row.leadsUuid}')">通过</i-button>
//              <i-button type="error" size="small" @click="reject('${row.payUuid}')">拒绝</i-button>`;
            }
          }
        ]
      }
    },
    mounted() {
      this.searchForm();
    },
    methods: {
      pass(payUuid, leadsUuid) {
        const _this = this;
        this.$Modal.confirm({
          title: '确认',
          content: '确认审核通过吗？',
          onOk() {
            // common.ajax({
            //   url: FINANCE().ChildOrder.WaitCheck.passCheck,
            //   data: {
            //     payUuid: payUuid,
            //     leadsUuid:　leadsUuid
            //   },
            //   success: function(response){
            //     common.notices('操作成功！');
            //     _this.searchForm();
            //   }
            // });
            this.$axios.post(FINANCE().ChildOrder.WaitCheck.passCheck,{
              payUuid: payUuid,
              leadsUuid:　leadsUuid
            }).then( () => {
              common.notices('操作成功！');
              _this.searchForm();
            })
          }
        });
      },
      reject(payUuid) {
        this.payUuid = payUuid;
        this.modal = true;
      },
      reasonOk(name) {
        const _this = this;
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            // common.ajax({
            //   url: FINANCE().ChildOrder.WaitCheck.refuseCheck,
            //   data: {
            //     payUuid: _this.payUuid,
            //     refuseCause: _this.formItem.reason
            //   },
            //   success: function(response){
            //     _this.modal = false;
            //     common.notices('操作成功！');
            //     _this.searchForm();
            //   }
            // });
            this.$axios.post(FINANCE().ChildOrder.WaitCheck.refuseCheck,{
              payUuid: _this.payUuid,
              refuseCause: _this.formItem.reason
            }).then( () => {
              _this.modal = false;
              common.notices('操作成功！');
              _this.searchForm();
            })
          } else {
            setTimeout(() => {
              this.loading = true;
            }, 0);
          }
        });
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          name: this.Search.name,
          phone: this.Search.phone,
          userName: this.Search.userName,
          submitStartTime: this.Search.submitStartTime,
          submitEndTime: this.Search.submitEndTime,
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?name=${search.name}&phone=${search.phone}&userName=${search.userName}&submitStartTime=${search.submitStartTime}&submitEndTime=${search.submitEndTime}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        // common.ajax({
        //   url: FINANCE().ChildOrder.WaitCheck.dataGrid + param,
        //   method: 'get',
        //   success: function (res) {
        //     _this.data = res.data['checkChildOrderVOs'] || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get( FINANCE().ChildOrder.WaitCheck.dataGrid + param,{
        }).then( ({data}) => {
          _this.data = data.data['checkChildOrderVOs'] || [];
          _this.total = data.data.total;
        })
      },
      getFullPhone(phone) {
        getFullPhone(phone, COMMON_API().Phone.getFullPhone);
      },
      changeSubmitDate(value) {
        this.Search.submitStartTime = value[0] || '';
        this.Search.submitEndTime = value[1] || '';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      }
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470: '';
      }
    },
    components: { OBreadcrumb,PageModel }
  };
</script>

<style>

</style>
