<template>
  <div>
    <o-breadcrumb second="教学" third="已排课程"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <form id="searchForm">
            <i-input :size="$store.state.searchModuleSize" v-model="Search.studentName" @on-keyup.enter="searchForm(1)"
                     placeholder="学生姓名" style="width:100px;margin-right:2px;"></i-input>
            <i-input :size="$store.state.searchModuleSize" v-model="Search.teacherName" @on-keyup.enter="searchForm(1)"
                     placeholder="老师姓名" style="width:100px;margin-right:2px;"></i-input>
            <i-input :size="$store.state.searchModuleSize" v-model="Search.saleName" @on-keyup.enter="searchForm(1)"
                     placeholder="销售姓名" style="width:100px;margin-right:2px;"></i-input>
            <i-input :size="$store.state.searchModuleSize" v-model="Search.managerTeacherName"
                     @click.enter="searchForm(1)" placeholder="排课负责人" style="width:100px;margin-right:2px;"></i-input>
            <i-input :size="$store.state.searchModuleSize" v-model="Search.subject" @on-keyup.enter="searchForm(1)"
                     placeholder="科目" style="width:100px;margin-right:3px;"></i-input>
            <i-select :size="$store.state.searchModuleSize" v-model="Search.grade" placeholder="年级" style="width:90px;">
              <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
            </i-select>
            <i-select :size="$store.state.searchModuleSize" v-model="Search.courseType" placeholder="课程类型" clearable
                      style="width:90px;">
              <i-option value='0'>测评课</i-option>
              <i-option value='1'>正式课</i-option>
            </i-select>
            <i-select :size="$store.state.searchModuleSize" v-model="Search.feedbackStaus" placeholder="课程反馈状态"
                      style="width:150px;">
              <i-option value="0" label="暂无反馈"><span><Icon type="record" class="c-grey"></Icon> 暂无反馈</span></i-option>
              <i-option value="1" label="待跟进"><span><Icon type="record" class="c-warning"></Icon> 待跟进</span></i-option>
              <i-option value="2" label="转化成功"><span><Icon type="record" class="c-success"></Icon> 转化成功</span>
              </i-option>
              <i-option value="3" label="转化成功，换老师"><span><Icon type="record" class="c-primary"></Icon> 转化成功，换老师</span>
              </i-option>
              <i-option value="4" label="换老师，转化成功"><span><Icon type="record" class="c-primary"></Icon> 换老师，转化成功</span>
              </i-option>
              <i-option value="5" label="转化失败"><span><Icon type="record" class="c-error"></Icon> 转化失败</span></i-option>
              <i-option value="6" label="老师放鸽子"><span><Icon type="record" class="c-error"></Icon>老师放鸽子</span></i-option>
              <i-option value="7" label="学生放鸽子"><span><Icon type="record" class="c-error"></Icon>学生放鸽子</span></i-option>
            </i-select>
          </form>
        </i-col>
        <i-col span="24" class="right">
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-start"
                       placeholder="上课日期" ref="classDate" @on-change="changeClassDate"
                       style="width: 200px"></Date-picker>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-start"
                       placeholder="排课日期" ref="courseDate" @on-change="changeCourseDate"
                       style="width: 200px"></Date-picker>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-end" placeholder="提交日期"
                       ref="submitDate" @on-change="changeSubmitDate" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索
          </i-button>
          <i-button :size="$store.state.searchModuleSize" type="ghost" @click="clearSearchForm">重置</i-button>
          <i-button :size="$store.state.searchModuleSize" v-show='isClose' type="primary" icon="ios-download-outline"
                    @click="exportExcel">导出
          </i-button>
        </i-col>
      </Row>
    </div>
    <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
      <checkbox label="ccName">销售</checkbox>
      <checkbox label="grade">年级</checkbox>
      <checkbox label="course">课程要求</checkbox>
      <checkbox label="study">学习要求</checkbox>
      <checkbox label="result">成绩</checkbox>
      <checkbox label="teacher">老师要求</checkbox>
      <checkbox label="courseStatus">课程情况</checkbox>
      <checkbox label="type">课程类型</checkbox>
      <checkbox label="otherRequest">其他要求</checkbox>
      <checkbox label="courseLength">上课时间</checkbox>
      <checkbox label="courseTeacher">上课老师</checkbox>
      <checkbox label="paike">排课负责人及时间</checkbox>
      <checkbox label="submitTime">提交时间</checkbox>
      <checkbox label="feedbackDesc">课程反馈状态</checkbox>
      <checkbox label="ispay">付费</checkbox>
      <checkbox label="hstRoomName">好视通账号</checkbox>
    </checkbox-group>
    <i-table size="small" :height="theight" stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
    <!--<input type="text" id="proLink" :value="copyValue">-->
    <textarea rows="3" cols="20" id="proLink">
    {{copyValue}}
</textarea>
  </div>
</template>

<script type="text/ecmascript-6">
  import {STUDY_COURSE} from 'common/api/studyCourse.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import {formateDate, common, clearSearchForm} from 'common/js/common.js';
  import PageModel from 'dashborader/page/page.vue';

  export default {
    data () {
      return {
        data: [],
        tableColumnsChecked: ['ccName', 'grade', 'course', 'study', 'result', 'teacher', 'courseStatus', 'type', 'otherRequest', 'courseLength', 'courseTeacher', 'paike', 'submitTime', 'feedbackDesc', 'ispay', 'hstRoomName', 'action'],
        copyValue: '',
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        isClose: '',
        Search: {
          studentName: '',
          teacherName: '',
          saleName: '',
          managerTeacherName: '',
          subject: '',
          grade: '',
          feedbackStaus: '',
          startDate: '',
          endDate: '',
          courseManagerStartDate: '',
          courseManagerEndDate: '',
          submitStartTime: '',
          submitEndTime: '',
          courseType: '',
        },
        gradeList: [],
        columns: []
      }
    },
    mounted () {
      const _this = this;
      $.getJSON ("static/data.json", function (json) {
        _this.gradeList = json.gradeList;
      });
      this.changeTableColumns ();
      this.searchForm ();
    },
    methods: {
      getTableColumns () {
        const columns = {
          leadsName: {
            title: '学生姓名',
            key: 'leadsName',
            width: 120,
            fixed: 'left',
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
                }, params.row.leadsName)
              ])
//          return `<strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.leadsUuid}');">${row.leadsName}</a></strong>`;
            }
          },
          ccName: {
            title: '销售',
            key: 'ccName',
            align: 'center',
            width: 90
          },
          grade: {
            title: '年级',
            key: 'grade',
            align: 'center',
            width: 70
          },
          course: {
            title: '课程要求',
            key: 'course',
            align: 'left',
            width: 150,
            render: (h, params) => {
              let type = params.row.type === 0 ? '测评课' : '正式课';
              let level = params.row.level == 0 ? '普通' : '清北';
              return h ('div', [
                h ('p', {}, [
                  h ('span', {
                    style: {
                      color: '#f50'
                    }
                  }, '上课时长'),
                  h ('span', {}, '：' + (params.row.length || '-') + '小时')
                ]),
                h ('p', {}, [
                  h ('span', {
                    style: {
                      color: '#f50'
                    }
                  }, '课程类型'),
                  h ('span', {}, '：' + type)
                ]),
                h ('p', {}, [
                  h ('span', {
                    style: {
                      color: '#f50'
                    }
                  }, '课时级别'),
                  h ('span', {}, '：' + level)
                ])
              ])
//          return `<p><span style="color:#f50">上课时长</span>：${row.length  || '- '}小时</p>
//              <p><span style="color:#f50">课程类型</span>：${row.type == 0 ? '测评课': '正式课'}</p>
//              <p><span style="color:#f50">课时级别</span>：${row.level == 0 ? '普通': '清北'}</p>`
            }
          },
          study: {
            title: '学习要求',
            key: 'study',
            align: 'left',
            width: 150,
            render: (h, params) => {
              return h ('div', [
                h ('p', {}, [
                  h ('span', {
                    style: {
                      color: '#f50'
                    }
                  }, '科目'),
                  h ('span', {}, params.row.subject || '-')
                ]),
                h ('p', {}, [
                  h ('span', {
                    style: {
                      color: '#f50'
                    }
                  }, '教材版本'),
                  h ('span', {}, params.row.subjectVersion || '-')
                ]),
              ])
//          return `<p><span style="color:#f50">科目</span>：${row.subject || '-'}</p>
//              <p><span style="color:#f50">教材版本</span>：${row.subjectVersion || '-'}</p>`
            }
          },
          result: {
            title: '成绩',
            key: 'result',
            align: 'center',
            width: 90,
            render: (h, params) => {
              return h ('div', [
                h ('Poptip', {
                  props: {
                    trigger: 'hover',
                    placement: 'left',
                  }
                }, [
                  h ('Button', {
                    props: {
                      type: 'ghost',
                      icon: 'eye',
                    }
                  }),
                  h ('div', {
                    attrs: {
                      class: 'api'
                    },
                    slot: 'content',
                    style: {
                      maxWidth: '550px'
                    }
                  }, [
                    h ('table', {
                      style: {
                        width: '400px',
                        tableLayout: 'auto'
                      }
                    }, [
                      h ('thead', {}, [
                        h ('tr', {}, [
                          h ('th', {}),
                          h ('th', {}, '分数'),
                          h ('th', {}, '满分'),
                          h ('th', {}, '试听知识点'),
                        ])
                      ]),
                      h ('tbody', {}, [
                        h ('tr', {}, [
                          h ('th', {}, '单元测验/月考'),
                          h ('td', {}, params.row.monthSocre || '-'),
                          h ('td', {}, params.row.fullMonthScore || '-'),
                          h ('td', {}, params.row.monthPoint || '-'),
                        ]),
                        h ('tr', {}, [
                          h ('th', {}, '期中/期末'),
                          h ('td', {}, params.row.termScore || '-'),
                          h ('td', {}, params.row.fullTeamScore || '-'),
                          h ('td', {}, params.row.termPoint || '-'),
                        ]),
                        h ('tr', {}, [
                          h ('th', {}, '其他'),
                          h ('td', {}, params.row.otherScore || '-'),
                          h ('td', {}, params.row.fullOtherScore || '-'),
                          h ('td', {}, params.row.otherPoint || '-'),
                        ]),
                        h ('tr', {}, [
                          h ('th', {}, '学习情况'),
                          h ('td', {
                            attrs: {
                              colspan: '3'
                            },
                            style: {
                              whiteSpace: 'normal',
                            }
                          }, params.row.studyStatus || '-'),
                        ])
                      ])
                    ])
                  ])
                ])
              ])
//          return `<Poptip trigger="hover" placement="left">
//                        <i-button type="ghost" icon="eye" size="small"></i-button>
//                        <div class="api" slot="content" style="max-width:550px;">
//                            <table>
//                                <thead>
//                                    <tr>
//                                        <th></th>
//                                        <th>分数</th>
//                                        <th>满分</th>
//                                        <th>试听知识点</th>
//                                    </tr>
//                                </thead>
//                                <tbody>
//                                    <tr>
//                                        <th>单元测验/月考</th>
//                                        <td>${row.monthSocre || '-'}</td>
//                                        <td>${row.fullMonthScore || '-'}</td>
//                                        <td>${row.monthPoint || '-'}</td>
//                                    </tr>
//                                    <tr>
//                                        <th>期中/期末</th>
//                                        <td>${row.termScore || '-'}</td>
//                                        <td>${row.fullTeamScore || '-'}</td>
//                                        <td>${row.termPoint || '-'}</td>
//                                    </tr>
//                                    <tr>
//                                        <th>其他</th>
//                                        <td>${row.otherScore || '-'}</td>
//                                        <td>${row.fullOtherScore || '-'}</td>
//                                        <td>${row.otherPoint || '-'}</td>
//                                    </tr>
//                                    <tr>
//                                      <th>学习情况</th>
//                                      <td colspan="3" style="white-space: normal;">${row.studyStatus || '-'}</td>
//                                    </tr>
//                                </tbody>
//                            </table>
//                        </div>
//                    </Poptip>`;
            }
          },
          teacher: {
            title: '老师要求',
            key: 'teacher',
            width: 300,
            align: 'left',
            render: (h, params) => {
              let teacherSex = ''
              if (params.row.teacherSex == 0) {
                teacherSex = '无所谓';
              } else if (params.row.teacherSex == 1) {
                teacherSex = '男';
              } else if (params.row.teacherSex == 2) {
                teacherSex = '女';
              }
              return h ('div', [
                h ('p', [
                  h ('span', {
                    style: {
                      color: '#f50'
                    }
                  }, '性别'),
                  h ('span', '：' + teacherSex)
                ]),
                h ('p', [
                  h ('span', {
                    style: {
                      color: '#f50'
                    }
                  }, '授课要求'),
                  h ('span', '：' + params.row.teachRequest || '-')
                ]),
                h ('p', [
                  h ('span', {
                    style: {
                      color: '#f50'
                    }
                  }, '建议老师'),
                  h ('span', '：' + params.row.offerTeacher || '-')
                ])
              ])
//          return `<p><span style="color:#f50">性别</span>：${teacherSex}</p>
//              <p><span style="color:#f50">授课要求</span>：${row.teachRequest || '-'}</p>
//              <p><span style="color:#f50">建议老师</span>：${row.offerTeacher || '-'}</p>`
            }
          },
          courseStatus: {
            title: '课程情况',
            key: 'courseStatus',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h ('div', [
                h ('p', [
                  h ('span', {
                    style: {
                      color: '#f50'
                    }
                  }, '上课形式'),
                  h ('span', '：' + params.row.style == 0 ? '预习' : '复习')
                ]),
                h ('p', [
                  h ('span', {
                    style: {
                      color: '#f50'
                    }
                  }, '正式课频率'),
                  h ('span', '：' + params.row.hz || '-')
                ]),
              ])
//          return `<p><span style="color:#f50">上课形式</span>：${row.style == 0 ? '预习' :'复习'}</p>
//              <p><span style="color:#f50">正式课频率</span>：${row.hz || '-'}</p>`
            }
          },
          type: {
            title: '课程类型',
            align: 'center',
            key: 'type',
            width: 150,
            render (h, params) {
              if (params.row.type == 0) {
                return h ('span', {}, '测评课');
              } else if (params.row.type == 1) {
                return h ('span', {}, '正式课');
              }
            }
          },
          otherRequest: {
            title: '其他要求',
            key: 'otherRequest',
            align: 'center',
            width: 400,
          },
          courseLength: {
            title: '上课时间',
            key: 'courseLength',
            width: 180,
            align: 'center',
            render: (h, params) => {
              let courseTime = (params.row.startTime || '-') + ' ~ ' + (params.row.endTime || '-');
              return h ('div', [
                h ('p', '日期：' + params.row.dates || '-'),
                h ('p', {style: {color: '#f50'}}, '时间：' + courseTime),
              ])
//          return `<p>${row.dates || '-'}</p>
//              <p style="color:#f50">${row.startTime || '-'} ~ ${row.endTime || '-'}</p>`
            }
          },
          courseTeacher: {
            title: '上课老师',
            key: 'courseTeacher',
            width: 120,
            align: 'center',
            render: (h, params) => {
              return h ('div', [
                h ('p', params.row.teacherName || '-'),
                h ('p', {style: {color: '#f50'}}, params.row.teacherPhone || '-'),
              ])
//          return `<p>${row.teacherName || '-'}</p>
//              <p style="color:#f50">${row.teacherPhone || '-'}</p>`
            }
          },
          paike: {
            title: '排课负责人及时间',
            key: 'paike',
            width: 180,
            render: (h, params) => {
              return h ('div', [
                h ('p', params.row.studyTeacherName || '-'),
                h ('p', {style: {color: '#f50'}}, params.row.handleTime || '-'),
              ])
//          return `<p>${row.studyTeacherName || '-'}</p>
//              <p style="color:#f50">${row.handleTime || '-'}</p>`;
            }
          },
          submitTime: {
            title: '提交时间',
            key: 'submitTime',
            width: 150,
            align: 'center',
            render (h, params) {
              return h ('span', formateDate (params.row.submitTime, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          feedbackDesc: {
            title: '课程反馈状态',
            key: 'feedbackDesc',
            align: 'center',
            width: 155,
            render: (h, params) => {
              if (params.row.feedbackStaus == 0) {
                return h ('div', [
                  h ('span', {
                    attrs: {
                      class: 'o-tag grey'
                    }
                  }, '暂无反馈')
                ])
              } else if (params.row.feedbackStaus == 1) {
                return h ('div', [
                  h ('span', {
                    attrs: {
                      class: 'o-tag yellow'
                    }
                  }, '待跟进')
                ])
              } else if (params.row.feedbackStaus == 2) {
                return h ('div', [
                  h ('span', {
                    attrs: {
                      class: 'o-tag green'
                    }
                  }, '转化成功')
                ])
              } else if (params.row.feedbackStaus == 3) {
                return h ('div', [
                  h ('span', {
                    attrs: {
                      class: 'o-tag blue'
                    }
                  }, '转化成功，换老师')
                ])
              } else if (params.row.feedbackStaus == 4) {
                return h ('div', [
                  h ('span', {
                    attrs: {
                      class: 'o-tag blue'
                    }
                  }, '换老师，转化成功')
                ])
              } else if (params.row.feedbackStaus == 5) {
                return h ('div', [
                  h ('span', {
                    attrs: {
                      class: 'o-tag red'
                    }
                  }, '转化失败')
                ])
              } else if (params.row.feedbackStaus == 6) {
                return h ('div', [
                  h ('span', {
                    attrs: {
                      class: 'o-tag red'
                    }
                  }, '老师放鸽子')
                ])
              } else if (params.row.feedbackStaus == 7) {
                return h ('div', [
                  h ('span', {
                    attrs: {
                      class: 'o-tag red'
                    }
                  }, '学生放鸽子')
                ])
              } else {
                return h ('div', [
                  h ('span', {}, '-')
                ])
              }
            }
          },
          ispay: {
            title: '付费',
            key: 'ispay',
            width: 100,
            align: 'center',
            render: (h, params) => {
              if (params.row.ispay) {
                return h ('div', [
                  h ('span', {
                    attrs: {
                      class: 'o-tag green'
                    }
                  }, '已支付'),
                ])
//            return '<span class="o-tag green">已支付</span>';
              } else {
                return h ('div', [
                  h ('span', {
                    attrs: {
                      class: 'o-tag grey'
                    }
                  }, '未支付'),
                ])
//            return '<span class="o-tag grey">未支付</span>';
              }
            }
          },
          hstRoomName: {
            title: '好视通账号',
            align: 'center',
            key: 'hstRoomName',
            width: 240,
            render: (h, params) => {
              return h ('div', [
                h ('p', {}, params.row.hstRoomName),
                h ('p', {}, params.row.hstRoomTeacherAccont),
                h ('p', {}, params.row.hstRoomStudentAccont),
              ])
//          return `<p>${row.hstRoomName}</p><p>${row.hstRoomTeacherAccont}</p><p>${row.hstRoomStudentAccont}</p>`
            }
          },
          action: {
            title: '操作',
            width: 240,
            align: 'center',
            fixed: 'right',
            render: (h, params) => {
//          if(params.row.isSendMessage == 1){
              return h ('div', [
                h ('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    icon: 'forward',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs: {
                    title: ''
                  },
                  on: {
                    click: () => {
                      this.confirm (params.row.leadsPhone, params.row.teacherPhone, params.row.leadsName, params.row.teacherName, params.row.courseUuid, params.row.dates, params.row.startTime, params.row.endTime, params.row.hstRoomTeacherAccont, params.row.hstRoomStudentAccont, params.row.saleUserUuid, params.row.subject)
                    }
                  }
                }, params.row.isSendMessage == 1 ? '已通知' : '通知'),
                h ('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    icon: 'reply',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs: {
                    title: '',
                    disabled: params.row.isBackOut !== 1,
                  },
                  on: {
                    click: () => {
                      this.backOut (params.row.requestUuid, params.row.cpCourseUuid, params.row.uuid)
                    }
                  }
                }, '撤销'),
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
                    title: '',
                    disabled: params.row.isBackOut !== 1,
                  },
                  on: {
                    click: () => {
                      this.copy (params.row.teacherUuid)
                    }
                  }
                }, '复制')
              ])
            }
          },
        };
        let datas = [columns.leadsName];
        this.tableColumnsChecked.forEach (col => datas.push (columns[col]));
        return datas;
      },
      copy (uuid) {
        const _this = this;
        common.ajax ({
          url: STUDY_COURSE ().AlreadyCourse.copyTeacherInfo,
          data: {
            teacherUuid: uuid,
          },
          success: function (res) {
            _this.copyValue = res.data
//            common.notices('通知成功！');
          }
        });
        setTimeout (function () {
          _this.copy1 ();
        }, 500)
      },
      copy1 () {
        var url = document.getElementById ("proLink");
        url.select ();
        document.execCommand ("copy");
        common.notices ('<p>复制成功！</p>为避免错误，请务必再次核对!!!');
      },
      confirm (leadsPhone, teacherPhone, leadsName, teacherName, courseUuid, courseDate, startTime, endTime, hstRoomTeacherAccont, hstRoomStudentAccont, saleUserUuid, subject) {
        const _this = this;
        _this.$Modal.confirm ({
          title: '发送短息提醒',
          content: '<p>是否要发送短信提醒</p>',
          onOk: () => {
            common.ajax ({
              url: STUDY_COURSE ().WaitCourse.sendMessage + `?leadsPhone=${leadsPhone}&teacherPhone=${teacherPhone}&leadsName=${leadsName}&teacherName=${teacherName}&courseUuid=${courseUuid}&courseDate=${courseDate}&startTime=${startTime}&endTime=${endTime}&hstRoomTeacherAccont=${hstRoomTeacherAccont}&hstRoomStudentAccont=${hstRoomStudentAccont}&saleUserUuid=${saleUserUuid}&subject=${subject}`,
              success: function (res) {
                common.notices ('通知成功！');
                _this.searchForm ();
              }
            });
          },
          onCancel: () => {
            common.notices ('取消通知！');
          }
        });
      },
      isSearchNull () {
        const _this = this;

        if (!_this.Search.studentName && !_this.Search.teacherName && !_this.Search.saleName && !_this.Search.managerTeacherName
          && !_this.Search.subject && !_this.Search.grade && !_this.Search.feedbackStaus && !_this.Search.startDate
          && !_this.Search.endDate && !_this.Search.courseManagerStartDate && !_this.Search.courseManagerEndDate
          && !_this.Search.submitStartTime && !_this.Search.submitEndTime) {
          return true;
        } else {
          return false;
        }
      },
      exportExcel () {
        let isSearchNull = this.isSearchNull ();
        if (isSearchNull) {
          const _this = this;
          this.$Modal.confirm ({
            title: '导出',
            content: '没有选择任何筛选条件，将导出全部数据',
            onOk () {
              _this.exportData ();
            }
          });
        } else {
          this.exportData ();
        }
      },
      exportData () {
        const _this = this;
        let apiUrl = STUDY_COURSE ().AlreadyCourse.queryExportHaveCourse;
        apiUrl += `?token=${localStorage.getItem ('token')}&submitStartTime=${_this.Search.submitStartTime}&submitEndTime=${_this.Search.submitEndTime}`;
        apiUrl += `&name=${_this.Search.studentName}&teacherName=${_this.Search.teacherName}&saleName=${_this.Search.saleName}&managerTeacherName=${_this.Search.managerTeacherName}`;
        apiUrl += `&subject=${_this.Search.subject}&grade=${_this.Search.grade}&feedbackStaus=${_this.Search.feedbackStaus}&startDate=${_this.Search.startDate}`;
        apiUrl += `&endDate=${_this.Search.endDate}&courseManagerStartDate=${_this.Search.courseManagerStartDate}&courseManagerEndDate=${_this.Search.courseManagerEndDate}`;
        GLOBAL.newTab (apiUrl, true);
      },
      backOut (requestUuid, cpCourseUuid, courseOrderUuid) {
        const _this = this;
        this.$Modal.confirm ({
          title: '撤销操作确认',
          content: '<p>排课撤销后不可恢复！请再次确认！</p>',
          onOk: function () {
            common.ajax ({
              url: STUDY_COURSE ().AlreadyCourse.backOut,
              data: {
                requestUuid: requestUuid,
                cpCourseUuid: cpCourseUuid,
                courseOrderUuid: courseOrderUuid
              },
              success: function (res) {
                common.notices ('操作成功！');
                _this.searchForm ();
              }
            });
          }
        });
      },
      searchForm (val) {
        if (val) this.pageIndex = val;
        this.loadDataGrid ({
          studentName: this.Search.studentName,
          teacherName: this.Search.teacherName,
          saleName: this.Search.saleName,
          managerTeacherName: this.Search.managerTeacherName,
          subject: this.Search.subject,
          grade: this.Search.grade,
          feedbackStaus: this.Search.feedbackStaus,
          startDate: this.Search.startDate,
          endDate: this.Search.endDate,
          courseManagerStartDate: this.Search.courseManagerStartDate,
          courseManagerEndDate: this.Search.courseManagerEndDate,
          submitStartTime: this.Search.submitStartTime,
          submitEndTime: this.Search.submitEndTime,
          courseType: this.Search.courseType,
        });
      },
      clearSearchForm () {
        clearSearchForm (this.Search, [this.$refs.classDate, this.$refs.courseDate, this.$refs.submitDate]);
      },
      loadDataGrid (search, orderBy = '', sortBy = '') {
        let param = `?name=${search.studentName}&teacherName=${search.teacherName}&courseType=${search.courseType}&saleName=${search.saleName}&managerTeacherName=${search.managerTeacherName}&subject=${search.subject}&grade=${search.grade}&feedbackStaus=${search.feedbackStaus}&startDate=${search.startDate}&endDate=${search.endDate}&courseManagerStartDate=${search.courseManagerStartDate}&courseManagerEndDate=${search.courseManagerEndDate}`;
        param += `&submitStartTime=${search.submitStartTime}&submitEndTime=${search.submitEndTime}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax ({
          url: STUDY_COURSE ().AlreadyCourse.dataGrids + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['courseVos'] || [];
            _this.isClose = res.data['isClose'] || 0;
            _this.total = res.data.total;
          }
        });
      },
      changeClassDate (value) {
        this.Search.startDate = value[0] || '';
        this.Search.endDate = value[1] || '';
      },
      changeCourseDate (value) {
        this.Search.courseManagerStartDate = value[0] || '';
        this.Search.courseManagerEndDate = value[1] || '';
      },
      changeSubmitDate (value) {
        this.Search.submitStartTime = value[0] || '';
        this.Search.submitEndTime = value[1] || '';
      },
      pageChange (pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm ();
      },
      changeTableColumns () {
        this.columns = this.getTableColumns ();
      }
    },
    computed: {
      theight () {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470 : '';
      }
    },
    components: {OBreadcrumb, PageModel}
  };
</script>

<style scoped>
  .ivu-btn {
    margin: 3px 0;
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
