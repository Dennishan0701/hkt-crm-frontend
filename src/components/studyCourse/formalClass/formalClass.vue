<template>
  <div>
    <o-breadcrumb second="教学" third="正式课排课表"></o-breadcrumb>
    <div class="grid-widget">
      <Row>

        <i-col span="4">
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="plus" @click="addModal">新增课表</i-button>
        </i-col>
        <i-col span="20" class="right">
          <form id="searchForm">
            <i-input :size="$store.state.searchModuleSize" v-model="Search.studentParams"
                     @on-keyup.enter="searchForm(1)" placeholder="学生姓名/手机号"
                     style="width:120px;margin-right:2px;"></i-input>
            <!--<i-input v-model="Search.studentPhone" @on-keyup.enter="searchForm(1)" placeholder="学生手机号" size="small"-->
            <!--style="width:100px;margin-right:2px;"></i-input>-->
            <i-input :size="$store.state.searchModuleSize" v-model="Search.teacherParams"
                     @on-keyup.enter="searchForm(1)" placeholder="老师姓名/手机号"
                     style="width:120px;margin-right:2px;"></i-input>
            <!--<i-input v-model="Search.teacherPhone" @on-keyup.enter="searchForm" placeholder="老师手机号" size="small"-->
            <!--style="width:100px;margin-right:2px;"></i-input>-->

            <i-select :size="$store.state.searchModuleSize" v-model="Search.grade" placeholder="年级" style="width:90px;">
              <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
            </i-select>

            <i-select :size="$store.state.searchModuleSize" v-model="Search.subject" placeholder="科目"
                      style="width:90px;">
              <i-option v-for="(item,index) in subjectList" :key='index' :value="item.value">{{ item.value }}</i-option>
            </i-select>

            <i-input :size="$store.state.searchModuleSize" v-model="Search.userName" @on-keyup.enter="searchForm(1)"
                     placeholder="CR姓名"
                     style="width:100px;margin-right:2px;"></i-input>

          </form>
        </i-col>
        <i-col span="24" class="right">
          <Date-picker :size="$store.state.searchModuleSize" ref="classDate" type="daterange" placement="bottom-end"
                       placeholder="上课日期"
                       @on-change="changeClassDate" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索
          </i-button>
          <i-button :size="$store.state.searchModuleSize" type="ghost" @click="clearSearchForm">重置</i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" :height="theight" stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
    <!--<input type="text" id="proLink" :value="copyValue">-->
    <textarea rows="3" cols="20" id="proLink">
    {{copyValue}}
</textarea>
    <!--批量排课Start-->
    <!--规律排课-->
    <formal-class-modal @reFresh="reFresh" ref="formalmodal"></formal-class-modal>
    <!--批量iframe排课-->
    <batch-model @reFresh="reFresh" ref="arrange"></batch-model>
    <!--批量排课可增可减-->
    <batch-formal-class-modal @reFresh="reFresh" ref="batchformalmodal"></batch-formal-class-modal>
    <!--批量排课End-->
    <add @reFresh="reFresh" ref="add"></add>
    <!--换老师-->
    <Modal
      v-model="modal"
      title="修改上课老师"
      :mask-closable="false"
      :closable="false"
      :loading="loading"
      @on-ok="confirmRevise('formValidate')">
      <i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
        <!--<Form-item label="学生">-->
        <!--<i-input disabled :value.sync="formItem.student" size="small" placeholder="手机号" style="width:200px"></i-input>-->
        <!--</Form-item>-->
        <Form-item label="老师" prop="teacher">
          <i-input v-model="formItem.teacher" size="small" placeholder="手机号" style="width:200px"></i-input>
        </Form-item>
        <!--<Form-item label="年级">-->
        <!--<i-select disabled :model.sync="formItem.grade" size="small" placeholder="请选择" style="width:200px">-->
        <!--<i-option value=""></i-option>-->
        <!--</i-select>-->
        <!--</Form-item>-->
        <!--<Form-item label="科目">-->
        <!--<i-select disabled :model.sync="formItem.subject" size="small" placeholder="请选择" style="width:200px">-->
        <!--<i-option value=""></i-option>-->
        <!--</i-select>-->
        <!--</Form-item>-->
      </i-form>
    </Modal>
    <!--换年级、科目-->
    <Modal
      v-model="classModal"
      title="修改年级科目"
      :mask-closable="false"
      :closable="false"
      :loading="loading"
      @on-ok="confirmClass('classValidate')">
      <i-form ref="classValidate" :model="formClass" :rules="ruleValidateClass" :label-width="80">
        <Form-item label="年级" prop="grade">
          <i-select v-model="formClass.grade" placeholder="请选择" style="width:200px">
            <i-option v-for="(item,index) in gradeList" :key="item.value" :value="item.value">{{item.value}}</i-option>
          </i-select>
        </Form-item>
        <Form-item label="科目" prop="subject">
          <i-select v-model="formClass.subject" placeholder="请选择" style="width:200px">
            <i-option v-for="(item,index) in subjectList" :key="item.value" :value="item.value">{{item.value}}
            </i-option>
          </i-select>
        </Form-item>
      </i-form>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {STUDY_COURSE} from 'common/api/studyCourse.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import {formateDate, common, clearSearchForm, hideCharAtNumber, getFullPhone} from 'common/js/common.js';
  import formalClassModal from 'components/studyCourse/formalClass/formalClassModal';
  import batchModel from 'components/studyCourse/formalClass/batchModel';
  import batchFormalClassModal from 'components/studyCourse/formalClass/batchFormalClassModal';
  import add from 'components/studyCourse/formalClass/add';
  import PageModel from 'dashborader/page/page.vue';

  export default {
    data () {
      const validateTeacher = (rule, value, callback) => {
        if (value === '' || value == null) {
          callback (new Error ('不能为空'));
        } else {
          var reg = /^[1][0-9]{10}$/;
          if (!reg.test (value)) {
            callback (new Error ('请输入正确的手机号'));
          }
          callback ();
        }
      };
      return {
        data: [],
        courseOrder: '',
        leads: '',
        formItem: {
          student: '',
          teacher: '',
          grade: '',
          subject: '',
        },
        formClass: {
          grade: '',
          subject: '',
        },
        ruleValidate: {
          teacher: [
            {required: true, validator: validateTeacher, trigger: 'blur',},
            // {required: true, message: '请填写老师上课时长', trigger: 'blur'}
          ]
        },
        ruleValidateClass: {
          grade: [
            {required: true, message: '请选择年级', trigger: 'change'}
          ],
          subject: [
            {required: true, message: '请选择科目', trigger: 'change'}
          ]
        },
        modal: false,
        classModal: false,
        modal2: false,
        copyValue: '',
        loading: false,
        classLoading: false,
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        Search: {
//          studentName: '',
//          studentPhone: '',
          studentParams: '',
          teacherParams: '',
//          teacherName: '',
//          teacherPhone: '',
          userName: '',
          courseDateStart: '',
          courseDateEnd: '',
          grade: '',
          subject: '',
        },
        gradeList: [],
        subjectList: [],//科目
        columns: [
          {
            title: '学生姓名',
            key: 'studentName',
            minWidth: 90,
            align: 'center',
            render: (h, params) => {
              return h ('div', [
                h ('Icon', {
                  props: {
                    type: 'person'
                  }
                }),
                h ('a', {
                  on: {
                    click: () => {
                      GLOBAL.viewLeadsDetail (params.row.leadsUuid)
                    }
                  }
                }, params.row.studentName)
              ])
//              return `<strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.leadsUuid}');">${row.studentName}</a></strong>`;
            }
          },
          {
            title: '学生手机号',
            key: 'stuPhone',
            minWidth: 120,
            align: 'center',
            render: (h, params) => {
              return h ('div', [
                h ('span', hideCharAtNumber (params.row.stuPhone)),
                h ('i', {
                  attrs: {
                    title: "显示全部",
                    class: 'ivu-icon ivu-icon-ios-eye',
                  },
                  style: {
                    margin: '2px',
                    fontSize: '18px',
                    verticalAlign: 'top',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.getFullPhone (params.row.stuPhone)
                    }
                  }
                })
              ])
            }
          },
          {
            title: '老师',
            key: 'teacherName',
            align: 'center',
            minWidth: 90
          },
          {
            title: '老师手机号',
            key: 'tcPhone',
            minWidth: 120,
            align: 'center',
            render: (h, params) => {
              return h ('div', [
                h ('span', hideCharAtNumber (params.row.tcPhone)),
                h ('i', {
                  attrs: {
                    title: "显示全部",
                    class: 'ivu-icon ivu-icon-ios-eye',
                  },
                  style: {
                    margin: '2px',
                    fontSize: '18px',
                    verticalAlign: 'top',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.getFullPhone (params.row.tcPhone)
                    }
                  }
                })
              ])
            }
          },
          {
            title: '年级',
            key: 'grade',
            align: 'center',
            minWidth: 90
          },
          {
            title: '科目',
            key: 'subject',
            align: 'center',
            minWidth: 90,
          },
          {
            title: 'CR',
            key: 'userName',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '课程计划',
            key: 'coursePlanUrl',
            align: 'center',
            minWidth: 90,
            render: (h, params) => {
              if(params.row.coursePlanUrl){
                return h ('div', [
                  h ('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs: {
                      title: ''
                    },
                    on: {
                      click: () => {
                        GLOBAL.newTab (params.row.coursePlanUrl, true);
                      }
                    }
                  },'下载')
                ])
              }else{
                return h ('div', [
                  h ('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs: {
                      title: '',
                      disabled:true
                    }
                  },'未上传')
                ])
              }
            }
          },
//          {
//            title: '首次课日期',
//            key: 'firstCourseDate',
//            align: 'center',
//            width: 120,
//            rander(row, column, index){
//              return formateDate(row.firstCourseDate, 'yyyy-MM-dd hh:mm:ss');
//            }
//          },
//          {
//            title: '课程进度',
//            key: 'courseStuNum',
//            width: 90,
//            align: 'left',
//            rander(row, column, index){
//              return row.courseStuNum+'/'+row.courseArrNum
//            }
//
//          },
          {
            title: '操作',
            minWidth: 120,
            align: 'center',
            render: (h, params) => {
              return h ('div', [
                h ('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'ios-copy-outline',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs: {
                    title: '批量排课含空闲时间'
                  },
                  on: {
                    click: () => {
                      this.formalArrange (params.row.leadsUuid, params.row.teacherUuid, params.row.courseOrderUuid, params.row.courseOrderUuid)
                    }
                  }
                }),
                h ('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    icon: 'clipboard',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs: {
                    title: '新批量排课最对排20节'
                  },
                  on: {
                    click: () => {
                      this.formalClass (params.row.crUuid, params.row.courseOrderUuid, params.row.teacherUuid, params.row.leadsUuid, params.row.courseRequestUuid, params.row.stuPhone, params.row.tcPhone, params.row.subject, params.row.teacherName, params.row.studentName)
                    }
                  }
                }),
                h ('Button', {
                  props: {
                    type: 'warning',
                    size: 'small',
                    icon: 'trash-b',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs: {
                    title: '废除'
                  },
                  on: {
                    click: () => {
                      this.abolish (params.row.courseOrderUuid)
                    }
                  }
                }),
                h ('Button', {
                  props: {
                    type: 'info',
                    size: 'small',
                    icon: 'arrow-swap',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs: {
                    title: '换老师'
                  },
                  on: {
                    click: () => {
                      this.changeTeacher (params.row.courseOrderUuid, params.row.leadsUuid, params.row.tcPhone)
                    }
                  }
                }),
                h ('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    icon: 'arrow-swap',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs: {
                    title: '换科目和年级'
                  },
                  on: {
                    click: () => {
                      this.changeClass (params.row.courseOrderUuid, params.row.grade, params.row.subject)
                    }
                  }
                }),
              ])
            }
          },
        ]
      }
    },
    mounted () {
      this.searchForm ();
      const _this = this;
      $.getJSON ("static/data.json", function (json) {
        _this.gradeList = json.gradeList;
      });
      $.getJSON ("static/data.json", function (json) {
        _this.subjectList = json.subjectList;
      });
    },
    methods: {
//      规律排课
//      formalClass(crUuid,courseOrderUuid,teacherUuid,leadsUuid,courseRequestUuid,stuPhone,tcPhone,subject,teacherName,studentName){
//        this.$refs.formalmodal.show(crUuid,courseOrderUuid,teacherUuid,leadsUuid,courseRequestUuid,stuPhone,tcPhone,subject,teacherName,studentName);
//      },
//      iframe排课
      formalArrange (leadsUuid, teacherUuid, courseOrderUuid) {
        this.$refs.arrange.show (leadsUuid, teacherUuid, courseOrderUuid);
      },
//        起始时间排课
      formalClass (crUuid, courseOrderUuid, teacherUuid, leadsUuid, courseRequestUuid, stuPhone, tcPhone, subject, teacherName, studentName) {
        this.$refs.batchformalmodal.show (crUuid, courseOrderUuid, teacherUuid, leadsUuid, courseRequestUuid, stuPhone, tcPhone, subject, teacherName, studentName);
      },
      addModal () {
        this.$refs.add.show ();
      },
      searchForm (val) {
        if (val) this.pageIndex = val;
        this.loadDataGrid ({
          studentParams: this.Search.studentParams,
          teacherParams: this.Search.teacherParams,
//          teacherName: this.Search.teacherName,
//          teacherPhone: this.Search.teacherPhone,
          userName: this.Search.userName,
          courseDateStart: this.Search.courseDateStart,
          courseDateEnd: this.Search.courseDateEnd,
          grade: this.Search.grade,
          subject: this.Search.subject,
        });
      },
      clearSearchForm () {
        clearSearchForm (this.Search, [this.$refs.classDate]);
      },
      loadDataGrid (search, orderBy = '', sortBy = '') {
        let param = `?studentParams=${search.studentParams}&teacherParams=${search.teacherParams}&userName=${search.userName}&courseDateStart=${search.courseDateStart}&courseDateEnd=${search.courseDateEnd}&grade=${search.grade}&subject=${search.subject}`
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax ({
          url: STUDY_COURSE ().formalClass.dataGrid + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['formalOrderList'] || [];
            _this.total = res.data.total;
          }
        });
      },
      changeClassDate (value) {
        this.Search.courseDateStart = value[0] || '';
        this.Search.courseDateEnd = value[1] || '';
      },
      pageChange (pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm ();
      },
      getFullPhone (phone) {
        getFullPhone (phone, COMMON_API ().Phone.getFullPhone);
      },
      //换老师
      changeTeacher (courseOrderUuid, leadsUuid, teacherPhone) {
        this.courseOrder = courseOrderUuid;
        this.leads = leadsUuid;
        this.formItem.teacher = teacherPhone;
        this.modal = true;
      },
      //换年级科目
      changeClass (courseOrderUuid, grade, subject) {
        this.courseOrder = courseOrderUuid;
        this.formClass.subject = subject || '';
        this.formClass.grade = grade || '';
        this.classModal = true;

      },
      confirmClass (name) {
        const _this = this;
        this.classLoading = false;
        this.$refs[name].validate ((valid) => {
          if (valid) {
            common.ajax ({
              url: STUDY_COURSE ().formalClass.updateCourseSchedule,
              method: 'get',
              data: {
                uuid: _this.courseOrder,
//                leadsUuid: _this.leads,
                subject: _this.formClass.subject,
                grade: _this.formClass.grade
              },
              success: function (response) {
                common.notices ('操作成功！！');
                _this.classModal = false;
                _this.searchForm ();
              }
            });
          } else {
            setTimeout (() => {
              this.classLoading = true;
              // this.modal = true;
            }, 0);
          }
        });
      },
      confirmRevise (name) {
        const _this = this;
        this.loading = false;
        this.$refs[name].validate ((valid) => {
          if (valid) {
            common.ajax ({
              url: STUDY_COURSE ().formalClass.changeCourseScheduleTeacher,
              method: 'get',
              data: {
                uuid: _this.courseOrder,
                leadsUuid: _this.leads,
                teacherPhone: _this.formItem.teacher
              },
              success: function (response) {
                common.notices ('操作成功！！');
                _this.modal = false;
                _this.searchForm ();
              }
            });
          } else {
            setTimeout (() => {
              this.loading = true;
              // this.modal = true;
            }, 0);
          }
        });
      },
      //废除课表关系
      abolish (course) {
        const _this = this;
        this.$Modal.confirm ({
          title: '确认',
          content: '确认废除该课表？',
          onOk: () => {
            common.ajax ({
              url: STUDY_COURSE ().formalClass.deleteCourseSchedule,
              method: 'get',
              data: {
                uuid: course,
              },
              success: function (response) {
                common.notices ('操作成功！！');
                _this.searchForm ();
              }
            });
          }
        });
      },
      reFresh (arg) {
        console.log (arg);
        this.searchForm ();
      }
    },
    computed: {
      theight () {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470 : '';
      }
    },
    components: {OBreadcrumb, batchFormalClassModal, formalClassModal, add, batchModel, PageModel}
  };
</script>

<style scoped>
  .ivu-btn {
    margin: 3px 0;
  }

  .ivu-modal-content {
    margin-bottom: 180px !important;
  }

  .ivu-poptip-title {
    display: none !important;
  }

  #proLink {
    position: absolute;
    left: -9999999999px;
    top: 0;
  }
</style>
