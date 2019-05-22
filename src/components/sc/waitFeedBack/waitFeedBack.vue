<template>
  <div>
    <o-breadcrumb second="销售与客服" third="待反馈"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <i-input :size="$store.state.searchModuleSize" v-model="paramStr" @on-keyup.enter="searchForm(1)" placeholder="学生\手机号"
                   style="width:150px;margin-right:2px;"></i-input>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageSize" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageSize" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>

    <Modal
      v-model="submitModal"
      title="提交课程反馈"
      :mask-closable="false"
      :closable="false"
      :loading="loading"
      @on-ok="onOk('formValidate')">
      <i-form ref="formValidate" :model="formItem" :rules="ruleValidateModel" :label-width="80">
        <Form-item label="课程反馈" prop="status">
          <i-select v-model="formItem.status" style="width:200px">
            <i-option value="1" label="待跟进"><span><Icon type="record" class="c-warning"></Icon> 待跟进</span></i-option>
            <i-option value="2" label="转化成功"><span><Icon type="record" class="c-success"></Icon> 转化成功</span></i-option>
            <i-option value="3" label="转化成功，换老师"><span><Icon type="record" class="c-success"></Icon> 转化成功，换老师</span>
            </i-option>
            <i-option value="4" label="换老师，转化成功"><span><Icon type="record" class="c-success"></Icon> 换老师，转化成功</span>
            </i-option>
            <i-option value="5" label="转化失败"><span><Icon type="record" class="c-error"></Icon> 转化失败</span></i-option>
            <i-option value="6" label="老师放鸽子"><span><Icon type="record" class="c-error"></Icon> 老师放鸽子</span></i-option>
            <i-option value="7" label="学生放鸽子"><span><Icon type="record" class="c-error"></Icon> 学生放鸽子</span></i-option>
          </i-select>
        </Form-item>
        <Form-item label="备注" prop="remark">
          <i-input type="textarea" v-model="formItem.remark" :rows="4" :maxlength="500"
                   placeholder="不要超过500字"></i-input>
        </Form-item>
      </i-form>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {STUDY_COURSE} from 'common/api/studyCourse.js';
  import {SCS} from 'common/api/scs.js';
  import {common, formateDate, hideCharAtNumber, getFullPhone} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';
  let $localStorage = $.localStorage;
  export default {
    data() {
      return {
        loading: true,
        data: [],
        total: 0,
        pageIndex: 1,
        pageSize: 15,
        paramStr: '',
        submitModal: false,
        formItem: {
          status: '',
          remark: ''
        },
        ruleValidateModel: {
          status: [
            {required: true, message: '请选择内容', trigger: 'change'}
          ],
          remark: [
            {required: true, message: '请填写内容', trigger: 'blur'}
          ]
        },
        courseUuid: '',
        columns: [
          {
            title: '学生姓名',
            key: 'name',
            align: 'center',
            minWidth: 90,
            render: (h, params) => {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'person'
                  }
                }),
                h('a', {
                  on: {
                    click: () => {
                      GLOBAL.viewLeadsDetail(params.row.uuid)
                    }
                  }
                }, params.row.name)
              ])
//              return `<Icon type="person"></Icon> <strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.uuid}');">${row.name}</a></strong>`;
            }
          },
          {
            title: '手机号',
            key: 'phone',
            align: 'center',
            minWidth: 120,
            render: (h, params) => {
              return h('div', [
                h('span', hideCharAtNumber(params.row.phone)),
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
                      this.getFullPhone(params.row.phone)
                    }
                  }
                })
              ])
//              return hideCharAtNumber(row.phone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.phone}')" class="eye" title="显示全部"></Icon>`;
            }
          },
          {
            title: '科目',
            align: 'center',
            minWidth: 90,
            key: 'subject'
          },
          {
            title: '课程类型',
            align: 'center',
            key: 'type',
            minWidth: 90,
            render(h, params) {
              if (params.row.type == 0) return h('span','测评课');
              if (params.row.type == 1) return h('span','正式课');
            }
          },
          {
            title: '课程时长',
            align: 'center',
            minWidth: 90,
            key: 'length',
            render(h, params) {
              return h('span',params.row.length + "小时");
            }
          },
          {
            title: '上课日期',
            align: 'center',
            minWidth: 120,
            key: 'dates'
          },
          {
            title: '上课时间',
            align: 'center',
            minWidth: 120,
            key: 'startTime',
            render(h, params) {
              return h('span',params.row.startTime+' ~ '+params.row.endTime);
            }
          },
          {
            title: '试听地址',
            align: 'center',
            minWidth: 150,
            key: 'invitedLnk',
            render(h, params) {
              return h('span',params.row.invitedLnk);
            }
          },
          {
            title: '老师姓名',
            align: 'center',
            minWidth: 90,
            key: 'teacherName'
          },
          {
            title: '老师简介',
            align: 'center',
            minWidth: 120,
            key: 'teacherDes'
          },
          {
            title: '测评课账号',
            align: 'center',
            key: 'hstRoomName',
            minWidth: 180,
            render: (h, params) => {
              return h('div', [
                h('p', {}, params.row.hstRoomName),
                h('p', {}, params.row.hstRoomTeacherAccont),
                h('p', {}, params.row.hstRoomStudentAccont)
              ])
//              return `<p>${row.hstRoomName}</p><p>${row.hstRoomTeacherAccont}</p><p>${row.hstRoomStudentAccont}</p>`
            }
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            fixed:'right',
            minWidth: 120,
            render: (h, params) => {
              if (params.row.isSendMessage == 1) {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'success',
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
                        this.confirm(params.row.phone, params.row.teacherDes, params.row.name, params.row.teacherName, params.row.courseOrderUuid, params.row.dates, params.row.startTime, params.row.endTime, params.row.hstRoomTeacherAccont, params.row.hstRoomStudentAccont, params.row.userUuid, params.row.subject)
                      }
                    }
                  }, '已通知'),
                  h('Button', {
                    props: {
                      type: 'info',
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
                        this.feedBack(params.row.courseOrderUuid)
                      }
                    }
                  }, '反馈'),
                ])
//                return `<i-button type="success" icon="forward" size="small" @click="confirm('${row.phone}','${row.teacherDes}','${row.name}','${row.teacherName}','${row.courseUuid}','${row.dates}','${row.startTime}','${row.endTime}','${row.hstRoomTeacherAccont}','${row.hstRoomStudentAccont}','${row.userUuid}','${row.subject}')">已通知</i-button>
//                    <i-button type="info" size="small" @click="feedBack('${row.courseUuid}')">反馈</i-button>`;
              } else {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'success',
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
                        this.confirm(params.row.phone, params.row.teacherDes, params.row.name, params.row.teacherName, params.row.courseOrderUuid, params.row.dates, params.row.startTime, params.row.endTime, params.row.hstRoomTeacherAccont, params.row.hstRoomStudentAccont, params.row.userUuid, params.row.subject)
                      }
                    }
                  }, '通知'),
                  h('Button', {
                    props: {
                      type: 'info',
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
                        this.feedBack(params.row.courseOrderUuid)
                      }
                    }
                  }, '反馈'),
                ])
//                return `<i-button type="success" icon="forward" size="small" @click="confirm('${row.phone}','${row.teacherDes}','${row.name}','${row.teacherName}','${row.courseUuid}','${row.dates}','${row.startTime}','${row.endTime}','${row.hstRoomTeacherAccont}','${row.hstRoomStudentAccont}','${row.userUuid}','${row.subject}')">通知</i-button>
//                    <i-button type="info" size="small" @click="feedBack('${row.courseUuid}')">反馈</i-button>`;
              }
            }
          }

        ]
      }
    },
    mounted() {
      this.searchForm();
    },
    methods: {
      confirm (leadsPhone, teacherPhone, leadsName, teacherName, courseUuid, courseDate, startTime, endTime, hstRoomTeacherAccont, hstRoomStudentAccont, saleUserUuid, subject) {
        const _this = this;
        _this.$Modal.confirm({
          title: '发送短息提醒',
          content: '<p>是否要发送短信提醒</p>',
          onOk: () => {
            // common.ajax({
            //   url: STUDY_COURSE().WaitCourse.sendMessage + `?leadsPhone=${leadsPhone}&teacherPhone=${teacherPhone}&leadsName=${leadsName}&teacherName=${teacherName}&courseUuid=${courseUuid}&courseDate=${courseDate}&startTime=${startTime}&endTime=${endTime}&hstRoomTeacherAccont=${hstRoomTeacherAccont}&hstRoomStudentAccont=${hstRoomStudentAccont}&saleUserUuid=${saleUserUuid}&subject=${subject}`,
            //   success: function (res) {
            //     common.notices('通知成功！');
            //     _this.searchForm();
            //   }
            // });
            this.$axios.post(STUDY_COURSE().WaitCourse.sendMessage,{
              leadsPhone:leadsPhone,
              teacherPhone:teacherPhone,
              leadsName:leadsName,
              teacherName:teacherName,
              courseUuid:courseUuid,
              courseDate:courseDate,
              startTime:startTime,
              endTime:endTime,
              hstRoomTeacherAccont:hstRoomTeacherAccont,
              hstRoomStudentAccont:hstRoomStudentAccont,
              saleUserUuid:saleUserUuid,
              subject:subject,
            }).then( () => {
              common.notices('通知成功！');
              _this.searchForm();
            })
          },
          onCancel: () => {
            common.notices('取消通知！');
          }
        });
      },
      getFullPhone(phone) {
        getFullPhone(phone, COMMON_API().getPhoneHZ, function () {
        });
      },
      feedBack(courseUuid) {
        this.courseUuid = courseUuid;
        this.submitModal = true;
      },
      onOk(name) {
        this.loading = false;
        const _this = this;
        console.log (1);
        console.log (_this.courseUuid);
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$axios.post(SCS().WaiteFeedBack.addFeedback,{
              courseOrderUuid: _this.courseUuid,
              feedbackStatus: _this.formItem.status,
              feedbackDes: _this.formItem.remark
            }).then( () => {
              _this.submitModal = false;
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
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?nameOrPhone=${search.nameOrPhone}&pageIndex=${this.pageIndex}&pageNumber=${this.pageSize}`;
        let paramCr = `?nameOrPhone=${search.nameOrPhone}&pageIndex=${this.pageIndex}&pageNumber=${this.pageSize}`;
        let roleName = $localStorage.get('user').roleName;
        let apiUrl = "";
        // if (roleName === "班主任") {
        //   apiUrl = SCS().WaiteFeedBack.cr_dataGrid + paramCr;
        // } else {
        apiUrl = SCS().WaiteFeedBack.dataGrid + param;
        // }
        const _this = this;
        this.$axios.get(apiUrl,{
        }).then( ({data}) => {
          _this.data = data.data.FeedBackCourseVo ||[];
          _this.total = data.data.total;
        })
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          nameOrPhone: this.paramStr,
        },this.pageIndex);
      },
      pageChange(pageIndex){
        this.pageIndex = pageIndex;
        this.searchForm();
      },
    },

    computed: {
      iTableHeight() {
        if (this.data.length > 13) {
          return 500;
        } else {
          return '';
        }
      }
    },
    components: {OBreadcrumb,PageModel}
  };
</script>

<style>
</style>
