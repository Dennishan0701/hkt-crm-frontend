<template>
 <div>
   <o-breadcrumb second="师资管理" third="发送邮件"></o-breadcrumb>
   <div class="grid-widget">
     <Row>
       <i-col span="24">
         <i-input :size="$store.state.searchModuleSize" v-model="Search.tcName" @on-keyup.enter="searchForm(1)" placeholder="姓名" style="width:150px;margin-right:2px;"></i-input>
         <i-input :size="$store.state.searchModuleSize" v-model="Search.phone" @on-keyup.enter="searchForm(1)" placeholder="手机号" style="width:150px;margin-right: 2px;"></i-input>
         <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
       </i-col>
     </Row>
   </div>
   <i-table size="small" highlight-row stripe :columns="columns" :data="data"></i-table>
   <div class="gridPage">
     <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
     <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
   </div>
   <Modal
     v-model="modal"
     title="请选择模板"
     :closable="false"
     :mask-closable="false"
     :loading = "loading"
     class-name="center"
     @on-ok="onOk('formValidate')"
     @on-cancel="cancel('formValidate')">
     <i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="120">
       <Form-item label="发送邮件模板" prop="template">
         <i-select v-model="formItem.template" placeholder="选择发送邮件模板" style="width:300px">
           <i-option v-for='(item,index) in enumList' :key='index' :disabled='item.enumValue == natureOfWork' :value="item.enumValue">{{item.enumName}}</i-option>
         </i-select>
       </Form-item>
     </i-form>
   </Modal>
 </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {TEACHER} from 'common/api/teacher.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';
  export default{
    data() {
      return {
        loading: true,
        modal: false,
        data: [],
        enumList:[],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        teacherUuid:'',
        tcName:'',
        email:'',
        phone:'',
        natureOfWork:'',
        Search: {
          tcName: '',
          phone: '',
        },
        formItem: {
          template: '',
        },
        ruleValidate: {
          template: [
            {required: true, message: '请选择内容', trigger: 'change'}
          ]
        },
        columns: [
          {
            title: '姓名',
            key: 'tcName',
            align:'center',
            // render (row, column, index) {
            //   return `<strong><a href="javascript:;" @click="viewDetail('${row.natureOfWorkDesc}','${row.uuid}')">${row.tcName}</a></strong>`;
            // },
            render:(h,params) => {
              return h('div',[
                h('strong',[
                  h('a',{
                    on:{
                      click:() => {
                        this.viewDetail(params.row.natureOfWorkDesc,params.row.uuid);
                      }
                    }
                  },params.row.tcName)
                ])
              ])
            }
          },
          {
            title: '手机号',
            key: 'phone',
            align:'center',
            // render (row, column, index) {
            //   return hideCharAtNumber(row.phone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.uuid}')" class="eye" title="显示全部"></Icon>`;
            // },
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
                        this.getFullPhone(params.row.uuid)
                      }
                    }
                  })
                ])
              }else{
                return '-';
              }
            }
          },
          {
            title: '邮箱',
            key: 'email',
            align:'center',
          },
          {
            title: '工作性质',
            key: 'natureOfWork',
            align:'center',
            // render (row,column,index){
            //   if(row.natureOfWork == 1){
            //     return "全职"
            //   }else if(row.natureOfWork == 2) {
            //     return "兼职"
            //   }else {
            //       return "--"
            //   }
            // },
            render:(h,params) =>{
              if(params.row.natureOfWork == 1){
                return h('div',[
                  h('span',{},'全职')
                ])
              }else if(params.row.natureOfWork == 2) {
                return h('div',[
                  h('span',{},'兼职')
                ])
              }else {
                return h('div',[
                  h('span',{},'--')
                ])
              }
            }
          },
          {
            title: '操作',
            align:'center',
            // render (row, column, index) {
            //     return `<i-button type="info" size="small" icon="email" title="发送邮箱" @click="show('${row.uuid}','${row.tcName}','${row.phone}','${row.email}','${row.natureOfWork}')">发送邮件</i-button>`
            // },
            render : (h, params) => {
              return h('div',[
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small',
                    icon: 'email',
                  },
                  attrs: {
                    title: '发送邮箱',
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.show(params.row.uuid,params.row.tcName,params.row.phone,params.row.email,params.row.natureOfWork);
                    }
                  }
                })
              ])
            }

          }
        ]
      }
    },
    mounted() {
      this.searchForm();
    },
    methods: {
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          tcName: this.Search.tcName,
          phone: this.Search.phone,
        });
      },
      viewDetail(natureOfWorkDesc, uuid) {
        if(natureOfWorkDesc && natureOfWorkDesc.indexOf('兼职') !== -1) {
          GLOBAL.redirectTo('/teacher/viewTeacherDetailByJianzhi',uuid);
        }else if(natureOfWorkDesc && natureOfWorkDesc.indexOf('全职') !== -1) {
          GLOBAL.redirectTo('/teacher/viewTeacherDetailByQuanzhi',uuid);
        }else{
          common.msg('工作性质为空，无法查看详情');
        }
      },
      getFullPhone(teacherUuid) {
        const _this = this;
        common.ajax({
          url: TEACHER().Public.displayPhone,
          method: 'get',
          data: { uuid: teacherUuid, moduleName: '师资管理-发送邮件' },
          success: function (res) {
            _this.$Modal.info({
              content: (res.data !== null) ? res.data.phone : ''
            });
          }
        })
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?tcName=${search.tcName}&phone=${search.phone}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: TEACHER().Library.getTeacherPage + param,
          method: 'get',
          success: function(response){
            _this.data = response.data.teacherList;
            _this.total = response.data.total;
          }
        });
      },
      show(uuid,tcName,phone,email,natureOfWork) {
        const _this = this;
        this.teacherUuid = uuid;
        this.tcName = tcName;
        this.phone = phone;
        this.email = email;
        if(natureOfWork == 1){
          this.natureOfWork = 2
        }else if(natureOfWork == 2){
          this.natureOfWork = 1
        }
        this.modal = true;
        common.ajax({
          url: TEACHER().Library.getMailPurpose,
          success: function(response){
            _this.enumList = response.data || [];
            console.log(_this.enumList);
          }
        });
      },
      onOk(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            common.ajax({
              url: TEACHER().Library.sendMail,
              data: {
                teacherUuid: _this.teacherUuid,
                tcName: _this.tcName,
                email: _this.email,
                purpose: _this.formItem.template,
                phone: _this.phone
              },
              success: function(response){
                common.notices('发送成功！！');
                _this.modal = false;
                _this.formItem.template = '';

              }
            });
          } else {
            setTimeout(() => {
              this.loading = true;
              _this.formItem.template = '';
            }, 0);
          }
        });
      },
      cancel(name){
        this.formItem.template = ''
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
    },
    components: {
      OBreadcrumb,PageModel
    }
  };
</script>

<style>

</style>
