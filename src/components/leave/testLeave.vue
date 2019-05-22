<template>
  <div>
    <o-breadcrumb second="请假管理" third="测评课请假审批"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <form id="searchForm">
            <i-input v-model="Search.thName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="老师姓名"
                     style="width:150px;margin-right: 2px;"></i-input>
            <i-input v-model="Search.thPhone" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="老师号码"
                     style="width:150px;margin-right:2px;"></i-input>
            <i-input v-model="Search.stuName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="学生姓名"
                     style="width:150px;margin-right:2px;"></i-input>
            <i-input v-model="Search.saleName" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="销售"
                     style="width:150px;margin-right:2px;"></i-input>
          </form>
        </i-col>
        <i-col span='24' class="right">
          <Date-picker type="daterange" :size="$store.state.searchModuleSize" placement="bottom-end" @on-change="changeSubmitDate"
                       placeholder="上课日期" style="width: 200px"></Date-picker>
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
      title="审批结果"
      :closable="false"
      :mask-closable="false"
      :loading="loading"
      @on-ok="reasonOk('formValidate')">
      <i-form ref="formValidate" :model="formItem" :rules="ruleValidate">
        <Form-item v-if='audit' prop="auditResult" label="审批结果">
          <i-select v-model="formItem.auditResult" style="width:200px">
            <i-option value="10">重排老师</i-option>
            <i-option value="20">取消课程</i-option>
          </i-select>
        </Form-item>
        <Form-item v-else prop="remark" label="拒绝原因">
          <i-input type="textarea" v-model="formItem.remark" :rows="4" :maxlength="500"
                   placeholder="不要超过500字"></i-input>
        </Form-item>
      </i-form>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {LEAVE} from 'common/api/leave.js';
  import {formateDate, common, hideCharAtNumber, getFullPhone} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        modal: false,
        rem: false,
        audit: false,
        loading: true,
        show: false,
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: 15,
        Search: {
          thName: '',
          thPhone: '',
          stuName: '',
          saleName: '',
          courseDateStart: '',
          courseDateEnd: '',
          courseType: 0
        },
        formItem: {
          uuid: '',
          auditResult: '',
          remark: '',
        },
        ruleValidate: {
          remark: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          auditResult: [
            {required: true, message: '不能为空', trigger: 'change'}
          ]
        },
        columns: [
          {
            title: '课程类型',
            key: 'courseTypeDesc',
            align: 'center',
            width: '90'
          },
          {
            title: '调整类型',
            key: 'leaveTypeDesc',
            align: 'center',
            width: '90',
          },
          {
            title: '老师',
            key: 'tcName',
            align: 'center',
            width: '90',
          },
          {
            title: '老师手机号',
            key: 'tcPhone',
            align: 'center',
            width: '120',
            render: (h, params) => {
              if (params.row.leadsPhone) {
                return h('div', [
                  h('span', hideCharAtNumber(params.row.leadsPhone)),
                  h('i', {
                    style: {
                      margin: '2px'
                    },
                    attrs: {
                      class: 'ivu-icon ivu-icon-ios-eye',
                      title: '显示全部'
                    },
                    style: {
                      fontSize: '18px',
                      verticalAlign: 'top',
                      cursor: 'pointer'
                    },
                    on: {
                      click: () => {
                        this.getFullPhone(params.row.leadsPhone)
                      }
                    }
                  })
                ])
//                return hideCharAtNumber(row.leadsPhone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.leadsPhone}')" class="eye" title="显示全部"></Icon>`;
              } else {
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
            key: 'applyTime',
            align: 'center',
            width: '180',
            render(h, params) {
              return h('span',formateDate(params.row.createDate, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '操作',
            align: 'center',
            width: '120',
            render: (h, params) => {

              return h('div', [
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
                      this.pass(params.row.uuid)
                    }
                  }
                }, '通过'),
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
                      this.reject(params.row.uuid)
                    }
                  }
                }, '拒绝')
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
      pass(uuid, auditType) {
        this.formItem.uuid = uuid;
        this.formItem.auditType = auditType;
        this.modal = true;
        this.audit = true;
        this.rem = false;
        this.show = true;
      },
      reject(uuid) {
        this.formItem.uuid = uuid;
        this.modal = true;
        this.rem = true;
        this.audit = false;
        this.show = false;
      },
      reasonOk(name) {
        const _this = this;
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (_this.show) {
              _this.formItem.remark = '';
            } else {
              _this.formItem.auditResult = '';
            }
            // common.ajax({
            //   url: LEAVE().testLeave.auditTestCourseLeave,
            //   data: {
            //     uuid: _this.formItem.uuid,
            //     auditType: 3,
            //     remark: _this.formItem.remark,
            //     auditResult: _this.formItem.auditResult,
            //   },
            //   success: function (response) {
            //     _this.modal = false;
            //     common.notices('操作成功！');
            //     _this.searchForm();
            //   }
            // });
            this.$axios.post( LEAVE().testLeave.auditTestCourseLeave,{
              uuid: _this.formItem.uuid,
              auditType: 3,
              remark: _this.formItem.remark,
              auditResult: _this.formItem.auditResult,
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
          thName: this.Search.thName,
          thPhone: this.Search.thPhone,
          stuName: this.Search.stuName,
          saleName: this.Search.saleName,
          courseDateStart: this.Search.courseDateStart,
          courseDateEnd: this.Search.courseDateEnd,
          courseType: this.Search.courseType,
        });
      },
      loadDataGrid(search) {
        let param = `?thName=${search.thName}&thPhone=${search.thPhone}&stuName=${search.stuName}&saleName=${search.saleName}&courseDateStart=${search.courseDateStart}&courseDateEnd=${search.courseDateEnd}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&courseType=${search.courseType}`;
        const _this = this;
        // common.ajax({
        //   url: LEAVE().testLeave.dataGrid + param,
        //   method: 'get',
        //   success: function (res) {
        //     _this.data = res.data['leaveList'] || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get(LEAVE().testLeave.dataGrid + param,{
        }).then( ({data}) => {
          _this.data = data.data['leaveList'] || [];
          _this.total = data.data.total;
        })
      },
      getFullPhone(phone) {
        getFullPhone(phone, COMMON_API().Phone.getFullPhone);
      },
      changeSubmitDate(value) {
        this.Search.courseDateStart = value[0] || '';
        this.Search.courseDateEnd = value[1] || '';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      }
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470 : '';
      }
    },
    components: {
      OBreadcrumb,PageModel
    }
  };
</script>

<style lang="less" rel="stylesheet/less">

</style>
