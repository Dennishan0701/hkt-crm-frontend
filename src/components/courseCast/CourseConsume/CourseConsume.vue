<template>
<div>
  <o-breadcrumb second="课耗管理" third="课时管理"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span=24 class="right">
        <form id="searchForm">
          <i-input v-model="Search.leadsName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="学生姓名" style="width:150px;margin-right: 2px;"></i-input>
        </form>
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
    title="总消耗课时"
    :closable="false"
    :mask-closable="false"
    :loading = "loading"
    @on-ok="onOk('formValidate')">
    <i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100">
      <Form-item label="总消耗课时" prop="courseLength">
        <i-input v-model="formItem.courseLength" size="small" placeholder="总消耗课时" style="width:150px;margin-right: 2px;"></i-input>
      </Form-item>
    </i-form>
  </Modal>
  <Modal
    v-model="modalRecord"
    title="消耗课时">
    <i-table size="small" :height="theight" highlight-row stripe :columns="columnsRecord" :data="dataRecord"></i-table>
  </Modal>
</div>

</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {Course_Cast} from 'common/api/teacher.js';
  import {formateDate,common,hideCharAtNumber,getFullPhone} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        loading: true,
        modal: false,
        modalRecord: false,
        data: [],
        dataRecord: [],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        Search: {
          leadsName: '',
        },
        formItem: {
          courseLength: '',
          leadsUuid: '',
          payUuid: '',
        },
        ruleValidate: {
          courseLength: [
            {required: true,message:'课时不能为空' , trigger: 'blur'},
          ]
        },
        columns: [
          {
            title: '序号',
            align:'center',
            type:'index',
            width:40,
          },
          {
            title: '学生姓名',
            key: 'leadName',
            align:'center',
            width:90,
          },
          {
            title: '学生手机号',
            key: 'phone',
            align:'center',
            width:120,
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
                return h('span','-');
              }
            }
          },
          {
            title: '购买课时（h）',
            key: 'buyLength',
            align:'center',
            width:90,
          },
          {
            title: '赠送课时（h）',
            key: 'giveLength',
            align:'center',
            width:90,
          },
          {
            title: '消耗购买课时（h）',
            key: 'havebuyCourseLength',
            align:'center',
            width:90,
          },
          {
            title: '消耗赠送课时（h）',
            key: 'haveGiveLength',
            align:'center',
            width:90,
          },
          {
            title: '剩余课时（h）',
            key: 'remainderCourseLength',
            align:'center',
            width:90,
          },
          {
            title: '更新时间',
            key: 'updateDate',
            align:'center',
            width:160,
            render(h, params) {
              return h('span',formateDate(params.row.updateDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '操作',
            width: 120,
            key: 'payUuid',
            align:'center',
            render : (h, params) => {
              return h('div',[
                h('Button',{
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'arrow-swap',
                  },
                  attrs: {
                    title: '编辑课时'
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                    this.show(params.row.leadsUuid,params.row.payUuid)
                    }
                  }
                }),
                h('Button',{
                  props: {
                    type: 'success',
                    size: 'small',
                    icon: 'clipboard',
                  },
                  attrs: {
                    title: '日志记录'
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                    this.showRecord(params.row.leadsUuid)
                   }
                }
                })
              ])
//                return `<i-button type="primary" size="small" icon="arrow-swap" title="编辑课时" @click="show('${row.leadsUuid}','${row.payUuid}')"></i-button>
//                        <i-button type="success" size="small" icon="clipboard" title="日志记录" @click="showRecord('${row.leadsUuid}')"></i-button>`;
            }
          }
        ],
        columnsRecord: [
          {
            title: '序号',
            align:'center',
            type:'index',
            width:40,
          },
          {
            title: '修改者姓名',
            key: 'name',
            align:'center',
            width:90,
          },
          {
            title: '更新时间',
            key: 'updateDate',
            align:'center',
            width:160,
            render(h, params) {
              return h('span',formateDate(params.row.updateDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '消耗课时',
            key: 'consumeCourseLength',
            align:'center',
            width:90,
          },
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
          leadsName: this.Search.leadsName,
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?leadName=${search.leadsName}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        // common.ajax({
        //   url: Course_Cast().CourseConsume.dataGrid + param,
        //   method: 'get',
        //   success: function (res) {
        //     _this.data = res.data['courseConsumeVos'] || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get(Course_Cast().CourseConsume.dataGrid,{
          params:{
            leadName:search.leadsName,
            pageIndex:this.pageIndex,
            pageNumber:this.pageNumber,
            orderBy:orderBy,
            sortBy:sortBy,
          }
        }).then( ({data}) => {
          _this.data = data.data['courseConsumeVos'] || [];
          _this.total = data.data.total;
        })
      },
      //      编辑课时
      show(leadsUuid,payUuid) {
        this.modal = true;
        this.formItem.leadsUuid = leadsUuid;
        this.formItem.payUuid = payUuid;
      },
//      编辑课时
      onOk(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            // common.ajax({
            //   url: Course_Cast().CourseConsume.editCourseConsume,
            //   data: {
            //     leadsUuid: _this.formItem.leadsUuid,
            //     payUuid: _this.formItem.payUuid,
            //     haveCourseLength: _this.formItem.courseLength,
            //   },
            //   success: function(response){
            //     _this.modal = false;
            //     common.notices('操作成功！！');
            //     _this.searchForm();
            //   }
            // });
            this.$axios.post(Course_Cast().CourseConsume.editCourseConsume,{
              leadsUuid: _this.formItem.leadsUuid,
              payUuid: _this.formItem.payUuid,
              haveCourseLength: _this.formItem.courseLength,
            }).then( () => {
              _this.modal = false;
              common.notices('操作成功！！');
              _this.searchForm();
            })
          } else {
            setTimeout(() => {
              this.loading = true;
            }, 0);
          }
        });
      },

//      显示日志
      showRecord(leadUuid) {
        const _this = this;
        // common.ajax({
        //   url: Course_Cast().CourseConsume.getCourseLengthRecord,
        //   data: {
        //     leadUuid: leadUuid,
        //   },
        //   method:'get',
        //   success: function(response){
        //     _this.dataRecord = response.data['cpCourseLengthRecordVos'];
        //     _this.modalRecord = true;
        //   }
        // });
        this.$axios.get(Course_Cast().CourseConsume.getCourseLengthRecord,{
          params:{
            leadUuid: leadUuid,
          }
        }).then( ({data}) => {
          _this.dataRecord = data.data['cpCourseLengthRecordVos'];
          _this.modalRecord = true;
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
    components: {
      OBreadcrumb,PageModel
    }
  };
</script>

<style>

</style>
