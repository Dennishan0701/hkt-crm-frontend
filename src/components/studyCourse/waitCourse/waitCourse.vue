<template>
<div>
  <o-breadcrumb second="教学" third="待排课程"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="24" class="right">
        <form id="searchForm">
          <i-input :size="$store.state.searchModuleSize" v-model="Search.name" @on-keyup.enter="searchForm(1)" placeholder="姓名" style="width:100px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.saleName" @on-keyup.enter="searchForm(1)" placeholder="销售姓名" style="width:100px;margin-right:2px;"></i-input>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.grade" clearable placeholder="年级" style="width:100px">
            <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.subject" @on-keyup.enter="searchForm(1)" placeholder="科目" style="width:150px;margin-right:3px;"></i-input>
        </form>
      </i-col>
      <i-col span="24" class="right">
        <Date-picker :size="$store.state.searchModuleSize" placement="bottom-start" type="daterange" ref="classdate" @on-change="changeDate" placeholder="上课日期" style="width: 200px"></Date-picker>
        <Time-picker :size="$store.state.searchModuleSize" format="HH:mm" type="timerange" ref="classTime" @on-change="changeCourseTime" @on-clear="clearCourseTime" placement="bottom-start" placeholder="上课时间" style="width: 168px"></Time-picker>
        <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
        <i-button :size="$store.state.searchModuleSize" type="ghost" @click="clearSearchForm">重置</i-button>
      </i-col>
    </Row>
  </div>
  <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
    <checkbox label="ccName">销售</checkbox>
    <checkbox label="grade">年级</checkbox>
    <checkbox label="course">课程要求</checkbox>
    <checkbox label="courseLength">上课时间要求</checkbox>
    <checkbox label="study">学习要求</checkbox>
    <checkbox label="result">成绩</checkbox>
    <checkbox label="teacher">老师要求</checkbox>
    <checkbox label="courseStatus">课程情况</checkbox>
    <checkbox label="otherRequest">其他要求</checkbox>
    <checkbox label="submitTime">提交时间</checkbox>
  </checkbox-group>
  <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>
  <!--<input type="text" id="proLink" :value="copyValue">-->
  <textarea rows="3" cols="20" id="alreadyProLink">
    {{copyValue}}
  </textarea>

  <arrange-course  @reFresh="reFresh" ref="arrange"></arrange-course>
  <reject @reFresh="reFresh" ref="rejects"></reject>
</div>
</template>

<script type="text/ecmascript-6">
  import {STUDY_COURSE} from 'common/api/studyCourse.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import arrangeCourse from 'components/studyCourse/waitCourse/arrangeCourse';
  import reject from 'components/studyCourse/waitCourse/reject';
  import {formateDate,common,clearSearchForm} from 'common/js/common.js';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        tableColumnsChecked:['ccName','grade','course','courseLength','study','result',
          'teacher','courseStatus','otherRequest','submitTime','action'],
        copyValue:'',
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11: 17,
        gradeList: [],
        Search: {
          name: '',
          saleName:'',
          grade: '',
          subject: '',
          startDate: '',
          endDate: '',
          courseStartTime: '',
          courseEndTime: ''
        },
        columns: []
      }
    },
    mounted() {
      this.searchForm();
      this.changeTableColumns();

      const _this = this;
      $.getJSON("static/data.json", function (json) {
        _this.gradeList = json.gradeList;
      });
    },
    methods: {
      getTableColumns () {
        const columns = {
          leadsName:{
            title: '学生姓名',
            key: 'leadsName',
            align:'center',
            width: 90,
            fixed: 'left',
            render : (h, params) => {
            return h('div',[
              h('Icon',{
                props:{
                  type:'person'
                }
              }),
              h('a',{
                on:{
                  click:()=>{
                  GLOBAL.viewLeadsDetail(params.row.leadsUuid)
              }
          }
        },params.row.leadsName)
      ])
//              return `<strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.leadsUuid}');">${row.leadsName}</a></strong>`;
            }
          },
          ccName:{
            title: '销售',
            align:'center',
            key: 'ccName',
            width: 90
          },
          grade:{
            title: '年级',
            align:'center',
            key: 'grade',
            width: 70
          },
          course:{
            title: '课程要求',
            align:'center',
            key: 'course',
            width: 150,
              render : (h, params) => {
                let type = params.row.type===0?'测评课':'正式课';
                let level = params.row.level==0?'普通':'清北';
              return h('div',[
                h('p',{
                },[
                  h('span',{
                    style:{
                      color:'#f50'
                    }
                  },'上课时长'),
                  h('span',{},'：'+(params.row.length||'-')+ '小时')
                ]),
                h('p',{
                },[
                  h('span',{
                    style:{
                      color:'#f50'
                    }
                  },'课程类型'),
                  h('span',{},'：'+type)
                ]),
                h('p',{
                },[
                  h('span',{
                    style:{
                      color:'#f50'
                    }
                  },'课时级别'),
                  h('span',{},'：'+level)
                ])
              ])
//              return `<p><span style="color:#f50">上课时长</span>：${row.length  || '- '}小时</p>
//              <p><span style="color:#f50">课程类型</span>：${row.type === 0 ? '测评课': '正式课'}</p>
//              <p><span style="color:#f50">课时级别</span>：${row.level === 0 ? '普通': '清北'}</p>`
            }
          },
          courseLength: {
            title: '上课时间要求',
            align:'left',
            key: 'courseLength',
            width: 180,
              render : (h, params) => {
              let courseTime = (params.row.startTime || '-') + ' ~ ' + (params.row.endTime || '-');

              return h('div',[
                h('p',{},[
                  h('span',{
                    style:{
                      color:'#f50'
                    }
                  },'上课日期'),
                  h('span',{
                  },'：'+params.row.dates || '-')
                ]),
                h('p',{},[
                  h('span',{
                    style:{
                      color:'#f50'
                    }
                  },'上课时间'),
                  h('span',{
                  },'：' + courseTime)
                ])
              ])
//              return `<p><span style="color:#f50">上课日期</span>：${row.dates || '-'}</p>
//              <p><span style="color:#f50">上课时间</span>：${row.startTime || '-'} ~ ${row.endTime || '-'}</p>`
            }
          },
          study:{
            title: '学习要求',
            align:'left',
            key: 'study',
            width: 150,
              render : (h, params) => {
              return h('div',[
                h('p',{},[
                  h('span',{
                    style:{
                      color:'#f50'
                    }
                  },'科目'),
                  h('span',{
                  },'：' + params.row.subject || '-')
                ]),
                h('p',{},[
                  h('span',{
                    style:{
                      color:'#f50'
                    }
                  },'教材版本'),
                  h('span',{
                  },'：' + params.row.subjectVersion || '-')
                ])
              ])
//              return `<p><span style="color:#f50">科目</span>：${row.subject || '-'}</p>
//              <p><span style="color:#f50">教材版本</span>：${row.subjectVersion || '-'}</p>`
            }
          },
          result:{
            title: '成绩',
            key: 'result',
            align:'center',
            width: 60,
              render : (h, params) => {
              return h('div',[
                h('Poptip',{
                  props:{
                    trigger:'hover',
                    placement:'left',
                  }
                },[
                  h('Button',{
                    props:{
                      type:'ghost',
                      icon:'eye',
                    }
                  }),
                  h('div',{
                    attrs:{
                      class:'api'
                    },
                    slot:'content',
                    style:{
                      maxWidth:'550px'
                    }
                  },[
                    h('table',{
                      style:{
                        width:'400px',
                        tableLayout:'auto'
                      }
                    },[
                      h('thead',{},[
                        h('tr',{},[
                          h('th',{}),
                          h('th',{},'分数'),
                          h('th',{},'满分'),
                          h('th',{},'试听知识点'),
                        ])
                      ]),
                      h('tbody',{},[
                        h('tr',{},[
                          h('th',{},'单元测验/月考'),
                          h('td',{},params.row.monthSocre||'-'),
                          h('td',{},params.row.fullMonthScore||'-'),
                          h('td',{},params.row.monthPoint||'-'),
                        ]),
                        h('tr',{},[
                          h('th',{},'期中/期末'),
                          h('td',{},params.row.termScore||'-'),
                          h('td',{},params.row.fullTeamScore||'-'),
                          h('td',{},params.row.termPoint||'-'),
                        ]),
                        h('tr',{},[
                          h('th',{},'其他'),
                          h('td',{},params.row.otherScore||'-'),
                          h('td',{},params.row.fullOtherScore||'-'),
                          h('td',{},params.row.otherPoint||'-'),
                        ]),
                        h('tr',{},[
                          h('th',{},'学习情况'),
                          h('td',{
                            attrs:{
                              colspan:'3'
                            },
                            style:{
                              whiteSpace: 'normal',
                            }
                          },params.row.studyStatus||'-'),
                        ])
                      ])
                    ])
                  ])
                ])
              ])
//              return `<Poptip trigger="hover" placement="left">
//                        <i-button type="ghost" icon="eye" size="small"></i-button>
//                        <div class="api" slot="content" style="max-width:500px;">
//                            <table>
//                                <thead>
//                                    <tr>
//                                        <th style="width: 90px"></th>
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
//                                      <td colspan="3" style="white-space: normal;font-size: 12px;">${row.studyStatus || '-'}</td>
//                                    </tr>
//                                </tbody>
//                            </table>
//                        </div>
//                    </Poptip>`;
            }
          },
          teacher:{
            title: '老师要求',
            key: 'teacher',
            align:'left',
            width: 350,
            render :(h, params)=> {
              let teacherSex = ''
              if (params.row.teacherSex === 0) {
                teacherSex = '无所谓';
              } else if(params.row.teacherSex === 1) {
                teacherSex = '男';
              } else if(params.row.teacherSex === 2) {
                teacherSex = '女';
              }else{
                teacherSex = params.row.teacherSex;
              }
              return h('div',[
                h('p',[
                  h('span',{
                    style:{
                      color:'#f50'
                    }
                  },'性别'),
                  h('span','：'+ teacherSex)
                ]),
                h('p',[
                  h('span',{
                    style:{
                      color:'#f50'
                    }
                  },'授课要求'),
                  h('span','：'+ params.row.teachRequest||'-')
                ]),
                h('p',[
                  h('span',{
                    style:{
                      color:'#f50'
                    }
                  },'建议老师'),
                  h('span','：'+ params.row.offerTeacher||'-')
                ])
              ])
//              return `<p><span style="color:#f50">性别</span>：${teacherSex}</p>
//              <p><span style="color:#f50">授课要求</span>：${row.teachRequest || '-'}</p>
//              <p><span style="color:#f50">建议老师</span>：${row.offerTeacher || '-'}</p>`
            }
          },
          courseStatus:{
            title: '课程情况',
            key: 'courseStatus',
            align:'left',
            width: 150,
              render : (h, params) => {
              return h('div',[
                h('p',[
                  h('span',{
                    style:{
                      color:'#f50'
                    }
                  },'上课形式'),
                  h('span','：'+ params.row.style == 0?'预习' :'复习')
                ]),
                h('p',[
                  h('span',{
                    style:{
                      color:'#f50'
                    }
                  },'正式课频率'),
                  h('span','：'+ params.row.hz||'-')
                ]),
              ])
//              return `<p><span style="color:#f50">上课形式</span>：${row.style === 0 ? '预习' :'复习'}</p>
//              <p><span style="color:#f50">正式课频率</span>：${row.hz || '-'}</p>`
            }
          },
          otherRequest:{
            title: '其他要求',
            key: 'otherRequest',
            align:'left',
            width: 400,
          },
          submitTime:{
            title: '提交时间',
            key: 'submitTime',
            align:'center',
            width: 180,
              render(h, params) {
              return h('span',formateDate(params.row.submitTime,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          action:{
            title: '操作',
            width: 160,
            align: 'center',
            fixed:'right',
              render : (h, params) => {
              if(params.row.fileAddress) {
                return h('div',[
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small',
                      icon: 'checkmark',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs:{
                      title:'排课'
                    },
                    on: {
                      click: () => {
                      this.gearCourse(params.row.requestUuid,params.row.leadsName,params.row.type)
                  }
              }
              }),
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small',
                      icon: 'close',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs:{
                      title:'拒绝'
                    },
                    on: {
                      click: () => {
                      this.reject(params.row.requestUuid)
                  }
              }
              }),
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                      icon: 'ios-copy-outline',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs:{
                      title:'复制课程要求信息'
                    },
                    on: {
                      click: () => {
                      this.copy(params.row.requestUuid)
                  }
              }
              }),
                  h('Button', {
                    props: {
                      type: 'info',
                      size: 'small',
                      icon: 'images',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs:{
                      title:'查看错题'
                    },
                    on: {
                      click: () => {
                      this.viewErrorQuestion(params.row.requestUuid)
                  }
              }
              })
              ])
//                return `<i-button type="success" icon="checkmark" size="small" @click="gearCourse('${row.requestUuid}','${row.leadsName}','${row.type}')" title="排课"></i-button>
//                    <i-button type="error" icon="close" size="small" @click="reject('${row.requestUuid}')" title="拒绝"></i-button>
//                    <i-button type="primary" icon="ios-copy-outline" size="small" @click="copy('${row.requestUuid}')" title='复制课程要求信息'></i-button>
//                    <i-button type="info" icon="images" size="small" @click="viewErrorQuestion('${row.requestUuid}')" title="查看错题"></i-button>`;
              } else {

                return h('div',[
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small',
                      icon: 'checkmark',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs:{
                      title:'排课'
                    },
                    on: {
                      click: () => {
                      this.gearCourse(params.row.requestUuid,params.row.leadsName,params.row.type)
                  }
              }
              }),
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small',
                      icon: 'close',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs:{
                      title:'拒绝'
                    },
                    on: {
                      click: () => {
                      this.reject(params.row.requestUuid)
                  }
              }
              }),
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                      icon: 'ios-copy-outline',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs:{
                      title:'复制课程要求信息'
                    },
                    on: {
                      click: () => {
                      this.copy(params.row.requestUuid)
                  }
              }
              })
              ])
//                return `<i-button type="success" icon="checkmark" size="small" @click="gearCourse('${row.requestUuid}','${row.leadsName}','${row.type}')" title="排课"></i-button>
//                    <i-button type="error" icon="close" size="small" @click="reject('${row.requestUuid}')" title="拒绝"></i-button>
//                    <i-button type="primary" icon="ios-copy-outline" size="small" @click="copy('${row.requestUuid}')" title='复制课程要求信息'></i-button>`;
              }
            }
          }
        };
        let datas = [columns.leadsName];
        this.tableColumnsChecked.forEach(col => datas.push(columns[col]));
        return datas;
      },

      copy(uuid){
        const _this = this;
        common.ajax({
          url: STUDY_COURSE().WaitCourse.copyCourseRequest,
          data:{
            requestUuid:uuid,
          },
          success: function (res) {
            _this.copyValue = res.data
//            common.notices('通知成功！');
            console.log(_this.copyValue);
          },
        });
        setTimeout(function () {
          _this.copy1();
        },500)
      },
      copy1(){
        console.log("OK");
        var url = document.getElementById("alreadyProLink");
        url.select();
        document.execCommand("copy");
        common.notices('<p>复制成功！</p>为避免错误，请务必再次核对!!!');
      },
      arrangeCourse(leadsUuid,courserequestUuid,courseorderUuid,payUuid) {
        this.$refs.arrange.show(leadsUuid,courserequestUuid,courseorderUuid,payUuid);
      },
      gearCourse(requestUuid, leadsName,type) {
      	sessionStorage.setItem('template_leadsName', leadsName+'');
      	sessionStorage.setItem('template_requestUuid', requestUuid);
      	sessionStorage.setItem('template_type', type);
        window.location.hash = '/study/gearCourse';
      },
      reject(courserequestUuid) {
        this.$refs.rejects.show(courserequestUuid);
      },
      viewErrorQuestion(courserequestUuid) {
        let url = '/static/errorQuestion.html?courserequestUuid=' + courserequestUuid;
        GLOBAL.newTab(url);
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          name: this.Search.name,
          saleName: this.Search.saleName,
          grade: this.Search.grade,
          subject: this.Search.subject,
          startDate: this.Search.startDate,
          endDate: this.Search.endDate,
          courseStartTime: this.Search.courseStartTime,
          courseEndTime: this.Search.courseEndTime
        });
      },
      clearSearchForm() {
        clearSearchForm(this.Search, [this.$refs.classDate, this.$refs.classTime]);
      },
      loadDataGrid(search,orderBy = '', sortBy = '') {
        let param = `?name=${search.name}&saleName=${search.saleName}&grade=${search.grade}&subject=${search.subject}&startDate=${search.startDate}&endDate=${search.endDate}&courseStartTime=${search.courseStartTime}&courseEndTime=${search.courseEndTime}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: STUDY_COURSE().WaitCourse.dataGrid + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['courseVos'] || [];
            _this.total = res.data.total;
          }
        });
      },
      changeDate(value) {
          this.Search.startDate = value[0] || '';
          this.Search.endDate = value[1] || '';
       },
      changeCourseTime(value) {
        this.Search.courseStartTime = value[0] || '';
        this.Search.courseEndTime = value[1] || '';
      },
      clearCourseTime() {
        this.Search.courseStartTime = '';
        this.Search.courseEndTime = '';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      changeTableColumns () {
        this.columns = this.getTableColumns();
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
      OBreadcrumb,arrangeCourse,reject,PageModel
    }
  };
</script>

<style>
  .ivu-btn { margin: 3px 0;}
  .ivu-poptip .ivu-poptip-title{display:none !important;}
  .ivu-poptip .ivu-poptip-body {padding: 3px !important;}
  #alreadyProLink{
    position: absolute;
    left:-9999999999px;
    top:0;
  }
</style>
