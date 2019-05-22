<template>
<div>
  <o-breadcrumb second="课程管理" third="测评课取消审核"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="24" class="right">
        <form id="searchForm">
          <i-input v-model="Search.thName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" size="small" placeholder="老师姓名" style="width:150px;margin-right: 2px;"></i-input>
          <i-input v-model="Search.thPhone" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" size="small" placeholder="老师号码" style="width:150px;margin-right:2px;"></i-input>
          <i-input v-model="Search.stuName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" size="small" placeholder="学生姓名" style="width:150px;margin-right:2px;"></i-input>
          <i-input v-model="Search.saleName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" size="small" placeholder="销售" style="width:150px;margin-right:2px;"></i-input>
        </form>
      </i-col>
      <i-col span='24' class="right">
        <Date-picker type="daterange" :size="$store.state.searchModuleSize" placement="bottom-end" @on-change="changeSubmitDate" placeholder="上课日期" style="width: 200px"></Date-picker>
        <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索</i-button>
      </i-col>
    </Row>
  </div>
  <i-table size="small" :height="theight" border highlight-row stripe :columns="columns" :data="data"></i-table>
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
      <Form-item prop="auditRemark">
        <i-input type="textarea" v-model="formItem.auditRemark" :rows="4" :maxlength="500" placeholder="不要超过500字"></i-input>
      </Form-item>
    </i-form>
  </Modal>
</div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {COURSE} from 'common/api/course.js';
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
        uuid: '',
        Search: {
          thName: '',
          thPhone: '',
          stuName: '',
          saleName: '',
          startDate: '',
          endDate: '',
          courseType: 0
        },
        formItem: {
          auditRemark: ''
        },
        ruleValidate: {
          auditRemark: [
            { required: true, message: '不能为空', trigger: 'change' }
          ]
        },
        columns: [
          {
            title: '课程类型',
            key: 'courseType',
            align: 'center',
            width: '90'
          },
          {
            title: '调整类型',
            key: 'leaveType',
            align: 'center',
            width: '90',
          },
          {
            title: '老师',
            key: 'thName',
            align: 'center',
            width: '90',
          },
          {
            title: '老师手机号',
            key: 'thPhone',
            align: 'center',
            width: '120',
            render : (h, params) => {

              if(row.leadsPhone) {
                return h('div',[
                  h('span',hideCharAtNumber(params.row.leadsPhone)),
                  h('i',{
                    attrs:{
                      class:'ivu-icon ivu-icon-ios-eye',
                      title:'显示全部'
                    },
                    style:{
                      margin:'2px'
                    },
                    on:{
                      click:()=>{
                        this.getFullPhone(params.row.leadsPhone)
                      }
                    }
                  })
                ])


//                return hideCharAtNumber(row.leadsPhone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.leadsPhone}')" class="eye" title="显示全部"></Icon>`;
              }else{
                return h('span','-');
              }
            }
          },
          {
            title: '学生',
            key: 'stuName',
            align: 'center',
            width: '90',
          },
          {
            title: '销售',
            key: 'saleName',
            align: 'center',
            width: '90',
          },
          {
            title: '上课日期',
            key: 'courseDate',
            align: 'center',
            width: '90',
          },
          {
            title: '上课时间',
            key: 'courseStartTime',
            align: 'center',
            width: '120',
          },
          {
            title: '下课时间',
            key: 'courseEndTime',
            align: 'center',
            width: '120',
          },
          {
            title: '年级',
            key: 'grade',
            align: 'center',
            width: '120',
          },
          {
            title: '科目',
            key: 'subject',
            align: 'center',
            width: '120',
          },
          {
            title: '提交时间',
            key: 'createDate',
            align: 'center',
            width: '180',
            render(h, params) {
              return h('span',formateDate(params.row.createDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '操作',
            align: 'center',
            width: '120',
            render : (h, params) => {
              return h('div',[
                h('Button',{
                  props:{
                    type:'success',
                    size:'small',
                  },
                  style:{
                    margin:'2px'
                  },
                  on:{
                    click:()=>{
                      this.pass(params.row.uuid)
                    }
                  }
                },'通过'),
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
                      this.reject(params.row.uuid)
                    }
                  }
                },'拒绝'),
              ])
//              return `<i-button type="success" size="small" @click="pass('${row.uuid}')">通过</i-button>
//              <i-button type="error" size="small" @click="reject('${row.uuid}')">拒绝</i-button>`;
            }
          }
        ]
      }
    },
    mounted() {
      this.searchForm();
    },
    methods: {
      pass(uuid) {
        const _this = this;
        this.$Modal.confirm({
          title: '确认',
          content: '确认审核通过吗？',
          onOk() {
            common.ajax({
              url: COURSE().cancel.cancelApproval,
              data: {
                approvalType: 1,
                uuid: uuid,
                courseType: _this.Search.courseType,
              },
              success: function(response){
                common.notices('操作成功！');
                _this.searchForm();
              }
            });
          }
        });
      },
      reject(uuid) {
        this.uuid = uuid;
        this.modal = true;
      },
      reasonOk(name) {
        const _this = this;
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            common.ajax({
              url: COURSE().cancel.cancelApproval,
              data: {
                uuid: _this.uuid,
                auditRemark: _this.formItem.auditRemark,
                courseType: _this.Search.courseType,
              },
              success: function(response){
                _this.modal = false;
                common.notices('操作成功！');
                _this.searchForm();
              }
            });
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
          thName: this.Search.thName,
          thPhone: this.Search.thPhone,
          stuName: this.Search.stuName,
          saleName: this.Search.saleName,
          startDate: this.Search.startDate,
          endDate: this.Search.endDate,
          courseType: this.Search.courseType,
        });
      },
      loadDataGrid(search) {
        let param = `?thName=${search.thName}&thPhone=${search.thPhone}&stuName=${search.stuName}&saleName=${search.saleName}&startDate=${search.startDate}&endDate=${search.endDate}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&courseType=${search.courseType}`;
        const _this = this;
        common.ajax({
          url: COURSE().cancel.cancelReview + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['cpLeaveRecordVos'] || [];
            _this.total = res.data.total;
          }
        });
      },
      getFullPhone(phone) {
        getFullPhone(phone, COMMON_API().Phone.getFullPhone);
      },
      changeSubmitDate(value) {
        this.Search.startDate = value[0] || '';
        this.Search.endDate = value[1] || '';
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
    components: {
      OBreadcrumb ,PageModel
    }
  };
</script>

<style lang="less" rel="stylesheet/less">

</style>
