<template>
  <div>
    <o-breadcrumb second="教学" third="待排课程" third-url="/study/waitCourse" four="排课"></o-breadcrumb>
    <div class="grid-widget text-center p10">
      <span>讲师：{{teacherName}}</span>
      <span>客户端：<i class="c-primary">好视通</i></span>
      上课日期：
      <Date-picker type="date" v-model="formItem.date" @on-change="changeDate" placeholder="上课日期"
                   style="width:120px"></Date-picker>
      上课时间：
      <i-select v-model="formItem.startTime" @on-change="changeStartTime" style="width:87px">
        <i-option v-for="(item,index) in startTimeList" :key='index' :value="item.value">{{ item.value }}</i-option>
      </i-select>
      &nbsp;至&nbsp;
      <i-select v-model="formItem.endTime" style="width:87px">
        <i-option v-for="(item,index) in endTimeList" :key='index' :value="item.value">{{ item.value }}</i-option>
      </i-select>
      <i-button type="primary" icon="checkmark" @click="save">提交</i-button>
    </div>
    <hr class="split"/>
    <div class="student-info">
      <h2>学生姓名：<span class="c-red">{{leadsName}}</span></h2>
      <i-table size="small" :columns="columns" :data="data"></i-table>
    </div>
    <hr class="split"/>
    <div class="student-info">
      <h2>匹配可排课老师：</h2>
      <div class="grid-widget">
        <i-input v-model="Search.nameOrPhone" placeholder="姓名/手机号"
                 style="width: 120px;margin-right: 2px;"></i-input>
        <i-select v-model="Search.sex" clearable placeholder="性别" style="width:80px">
          <i-option value="0">男</i-option>
          <i-option value="1">女</i-option>
        </i-select>
        <i-select v-model="Search.branch" clearable placeholder="师训中心" style="width:100px">
          <i-option value="1">上海</i-option>
          <i-option value="2">合肥</i-option>
        </i-select>
        <i-select v-model="Search.teachingSubject" clearable placeholder="科目" style="width:90px">
          <i-option v-for="(item,index) in subjectList" :value="item.uuid" :key='index'>{{ item.enumName }}</i-option>
        </i-select>
        <i-select v-model="Search.schoolLocationKey" filterable clearable ref="schoolLocationKey"
                  placeholder="所属院校" style="width:200px">
          <i-option v-for="(item,index) in schoolList" :key='index' :value="item.uuid">{{ item.schoolName }}</i-option>
        </i-select>
        <i-select v-model="Search.provinceKey" @on-change="changeSelectedCity" filterable clearable
                  ref="provinceKey" placeholder="高考所在省" style="width:150px">
          <i-option v-for="(item,index) in provinceList" :key='index' :value="item.areaCode">{{ item.areaName }}</i-option>
        </i-select>
        <i-select v-model="Search.cityKey" @on-change="changeSelectedArea" clearable ref="cityKey"
                  placeholder="高考所在市" style="width:100px">
          <i-option v-for="(item,index) in cityArrays" :key='index' :value="item.areaCode">{{ item.areaName }}</i-option>
        </i-select>
        <i-select v-model="Search.districtKey" clearable ref="districtKey" placeholder="高考所在区"
                  style="width:100px">
          <i-option v-for="(item,index) in areaList" :key='index' :value="item.areaCode">{{ item.areaName }}</i-option>
        </i-select>
        <i-button type="primary" icon="ios-search" @click="loadDataGrid(1)">搜索</i-button>
        <i-button @click="clearForm">重置条件</i-button>
      </div>
      <i-table size="small" highlight-row stripe :columns="canCourseColumns" :data="canCourseData"
               @on-selection-change="selectRow"></i-table>
      <div class="gridPage">
        <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
        <!--<Page :current="pageIndex" :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total-->
              <!--show-elevator></Page>-->
      </div>
    </div>
    <div class="student-info">
      <h2><span class="c-red">{{clickName}}</span>老师近期排课情况：</h2>
      <div>
        <i-table :show-header="renderHeader" border size="small" highlight-row stripe :columns="columns0"
                 :data="headerData0"></i-table>
        <i-table :show-header="renderHeader" border size="small" highlight-row stripe :columns="columns1"
                 :data="headerData1"></i-table>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {SCS} from 'common/api/scs.js';
  import {STUDY_COURSE} from 'common/api/studyCourse.js';
  import {TEACHER} from 'common/api/teacher.js';
  import {common, hideCharAtNumber, formateDate, clearSearchForm} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        renderHeader: false,
        total: 0,
        pageIndex: 1,
        pageNumber: 5,
        canCourseData: [],
        selectionRowData: [],
        clickName: '',
        teacherUuid0: '',
        num: 0,
        dataStart: '',
        dataEnd: '',
        requestUuid: sessionStorage.getItem('template_requestUuid') || '',
        leadsName: sessionStorage.getItem('template_leadsName') || '',
        type: sessionStorage.getItem('template_type') || 0,
        formItem: {
          date: '',
          startTime: '',
          endTime: '',
        },
        Search: {
          nameOrPhone: '',
          tcName: '',
          branch: '',
          phone: '',
          sex: '',
          natureOfWork: '',
          schoolLocationKey: '',
          gradePreference: '',
          teachingSubject: '',
          provinceKey: '',
          cityKey: '',
          districtKey: ''
        },
        startTimeList: [],
        endTimeList: [],
        subjectList: [],
        schoolList: [],
        provinceList: [],
        cityArrays: [],
        areaList: [],
        columns: [
          {
            title: '年级',
            key: 'grade',
            width: 70
          },
          {
            title: '课程要求',
            key: 'grade',
            width: 150,
            render : (h, params) => {
            return h('div',[
              h('p',{
              },[
                h('span',{
                  style:{
                    color:'#f50'
                  }
                },'上课时长'),
                h('span',{},(params.row.length||'-')+ '小时')
              ]),
              h('p',{
              },[
                h('span',{
                  style:{
                    color:'#f50'
                  }
                },'课程类型'),
                h('span',{},params.row.type==0?'测评课':'正式课')
              ]),
              h('p',{
              },[
                h('span',{
                  style:{
                    color:'#f50'
                  }
                },'课时级别'),
                h('span',{},params.row.level==0?'普通':'清北')
              ])
            ])
//              return `<p><span style="color:#f50">上课时长</span>：${row.length || '- '}小时</p>
//              <p><span style="color:#f50">课程类型</span>：${row.type === 0 ? '测评课' : '正式课'}</p>
//              <p><span style="color:#f50">课时级别</span>：${row.level === 0 ? '普通' : '清北'}</p>`
            }
          },
          {
            title: '上课时间要求',
            key: 'grade',
            width: 180,
            render : (h, params) => {
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
                  },'：'+ params.row.startTime || '-' + ' ~ '+ params.row.endTime || '-')
                ])
              ])
//              return `<p><span style="color:#f50">上课日期</span>：${row.dates || '-'}</p>
//              <p><span style="color:#f50">上课时间</span>：${row.startTime || '-'} ~ ${row.endTime || '-'}</p>`
            }
          },
          {
            title: '学习要求',
            key: 'grade',
            width: 300,
            render : (h, params) => {
              return h('div',[
                h('p',{
                },[
                  h('span',{
                    style:{
                      color:'#f50'
                    }
                  },'科目'),
                  h('span',{},params.row.subject||'-')
                ]),
                h('p',{
                },[
                  h('span',{
                    style:{
                      color:'#f50'
                    }
                  },'教材版本'),
                  h('span',{},params.row.subjectVersion||'-')
                ]),
              ])
//              return `<p><span style="color:#f50">科目</span>：${row.subject || '-'}</p>
//              <p><span style="color:#f50">教材版本</span>：${row.subjectVersion || '-'}</p>`
            }
          },
          {
            title: '成绩',
            key: 'grade',
            width: 100,
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
                    h('table',{},[
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
                          h('td',{},{
                            props:{
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
//                          <table>
//                            <thead>
//                              <tr>
//                                <th></th>
//                                <th>分数</th>
//                                <th>满分</th>
//                                <th>试听知识点</th>
//                              </tr>
//                            </thead>
//                            <tbody>
//                              <tr>
//                                <th>单元测验/月考</th>
//                                <td>${row.monthSocre || '-'}</td>
//                                <td>${row.fullMonthScore || '-'}</td>
//                                <td>${row.monthPoint || '-'}</td>
//                              </tr>
//                              <tr>
//                                <th>期中/期末</th>
//                                <td>${row.termScore || '-'}</td>
//                                <td>${row.fullTeamScore || '-'}</td>
//                                <td>${row.termPoint || '-'}</td>
//                              </tr>
//                              <tr>
//                                <th>其他</th>
//                                <td>${row.otherScore || '-'}</td>
//                                <td>${row.fullOtherScore || '-'}</td>
//                                <td>${row.otherPoint || '-'}</td>
//                              </tr>
//                              <tr>
//                                <th>学习情况</th>
//                                <td colspan="3" style="white-space: normal;">${row.studyStatus || '-'}</td>
//                              </tr>
//                            </tbody>
//                          </table>
//                        </div>
//                    </Poptip>`;
            }
          },
          {
            title: '老师要求',
            key: 'grade',
            width: 350,
            render (h, params) {
              let teacherSex = ''
              if (params.row.teacherSex === 0) {
                teacherSex = '无所谓';
              } else if (params.row.teacherSex === 1) {
                teacherSex = '男';
              } else if (params.row.teacherSex === 2) {
                teacherSex = '女';
              } else {
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
          {
            title: '课程情况',
            key: 'grade',
            width: 180,
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
//              return `<p><span style="color:#f50">上课形式</span>：${row.style === 0 ? '预习' : '复习'}</p>
//              <p><span style="color:#f50">正式课频率</span>：${row.hz || '-'}</p>`
            }
          },
          {
            title: '其他要求',
            key: 'otherRequest',
            width: 400,
          },
          {
            title: '销售',
            key: 'ccName',
            width: 90
          },
          {
            title: '错题',
            width: 65,
            align: 'left',
            render : (h, params) => {
              return h('div',[
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small',
                    icon: 'image',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs:{
                    title:'',
                    disabled:!params.row.fileAddress,
                  },
                  on: {
                    click: () => {
                      this.viewErrorQuestion(params.row.requestUuid)
                    }
                  }
                },'查看')
              ])
//              return `<i-button type="info" size="small" icon="image" :disabled="${!row.fileAddress}" @click="viewErrorQuestion('${row.requestUuid}')">查看</i-button>`;
            }
          }
        ],
        canCourseColumns: [
          {
            type: 'selection',
            width: 25,
            align: 'center',
          },
          {
            title: '姓名',
            key: 'tcName',
            render : (h, params) => {
              return h('div',[
                h('a',{
                  on:{
                    click:()=>{
                      this.show(params.row.uuid,params.row.tcName,params.row.uuid)
                    }
                  }
                },params.row.tcName),
                h('Icon',{
                  props:{
                    type:'arrow-down-c'
                  }
                })
              ])
//              return `<strong><a href="javascript:;" @click="show('${row.uuid}','${row.tcName}')">${row.tcName}   <Icon type="arrow-down-c"></Icon></a></strong>`;
            }
          },
          {
            title: '手机号',
            key: 'phone',
            render (h, params) {
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
//              return hideCharAtNumber(row.phone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.uuid}')" class="eye" title="显示全部"></Icon>`;
            }
          },
          {
            title: '师训中心',
            key: 'branchDesc'
          },
          {
            title: '排课备注',
            key: 'remark'
          },
          {
            title: '年级偏好',
            key: 'gradePreferenceDesc'
          },
          {
            title: '第一科目',
            key: 'teachingSubject'
          },
          {
            title: '性别',
            key: 'boyOrGirl'
          },
          {
            title: '院校',
            key: 'schoolLocation'
          },
          {
            title: '高考所在地',
            key: '',
            render(h, params) {
              return params.row.province || '-' + ' ' + params.row.city || '-' + ' ' + params.row.district || '-';
            }
          },
          {
            title: '工作性质',
            key: 'natureOfWorkDesc'
          },
          {
            title: '授课偏好',
            key: 'teachingPreference'
          }
        ],

        formalCourseVo: [],
        headerData0: [],
        headerData1: [],
        headerData: {},
        columns0: [
          {
            title: '老师',
            align: 'center',
            key: 'teacherName',
            width: 80,
            render : (h, params) => {
              return h('div',[
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small',
                    icon: 'chevron-left',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs:{
                    title:'补课'
                  },
                  on: {
                    click: () => {
                      this.getDataDown()
                    }
                  }
                })
              ])
//              return `<i-button type="info" icon='chevron-left' size="small" title="补课" @click='getDataDown()'></i-button>`
            },
          },
          {
            key: '1',
            align: 'center',
            width: 90,
            render : (h, params) => {
              return h('div',[
                h('p',{},params.row.nextFirstDayWeek),
                h('p',{},params.row.nextFirstDay),
              ])
//              return `<p>${row.nextFirstDayWeek}</p><p>${row.nextFirstDay}</p>`
            },
          },
          {
            key: '2',
            align: 'center',
            width: 90,
            render : (h, params) => {
              return h('div',[
                h('p',{},params.row.nextSecondDayWeek),
                h('p',{},params.row.nextSecondDay),
              ])
//              return `<p>${row.nextSecondDayWeek}</p><p>${row.nextSecondDay}</p>`
            },
          },
          {
            key: '3',
            align: 'center',
            width: 90,
            render : (h, params) => {
              return h('div',[
                h('p',{},params.row.nextThreeDayWeek),
                h('p',{},params.row.nextThreeDay),
              ])
//              return `<p>${row.nextThreeDayWeek}</p><p>${row.nextThreeDay}</p>`
            },
          },
          {
            key: '4',
            align: 'center',
            width: 90,
            render : (h, params) => {
              return h('div',[
                h('p',{},params.row.nextFourDayWeek),
                h('p',{},params.row.nextFourDay),
              ])
//              return `<p>${row.nextFourDayWeek}</p><p>${row.nextFourDay}</p>`
            },
          },
          {
            key: '5',
            align: 'center',
            width: 90,
            render : (h, params) => {
              return h('div',[
                h('p',{},params.row.nextFiveDayWeek),
                h('p',{},params.row.nextFiveDay),
              ])
//              return `<p>${row.nextFiveDayWeek}</p><p>${row.nextFiveDay}</p>`
            },
          },
          {
            key: '6',
            align: 'center',
            width: 90,
            render : (h, params) => {
              return h('div',[
                h('p',{},params.row.nextSixDayWeek),
                h('p',{},params.row.nextSixDay),
              ])
//              return `<p>${row.nextSixDayWeek}</p><p>${row.nextSixDay}</p>`
            },
          },
          {
            key: '7',
            align: 'center',
            width: 90,
            render : (h, params) => {
              return h('div',[
                h('p',{},params.row.nextSevenDayWeek),
                h('p',{},params.row.nextSevenDay),
              ])
//              return `<p>${row.nextSevenDayWeek}</p><p>${row.nextSevenDay}</p>`
            },
          },
          {
            title: '老师',
            align: 'center',
            key: 'teacherName',
            width: 80,
            render : (h, params) => {
              return h('div',[
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small',
                    icon: 'chevron-right',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs:{
                    title:'下一周'
                  },
                  on: {
                    click: () => {
                      this.getDataUp()
                    }
                  }
                })
              ])
//              return `<i-button type="info" icon='chevron-right' size="small" title="下一周" @click='getDataUp()'></i-button>`
            },
          },
        ],
        columns1: [
          {
            align: 'center',
            key: 'teacherName',
            width: 80,
            render(h,params){
              return ''
            }
          },
          {
            key: '1',
            align: 'center',
            width: 90,
            render : (h, params) => {
              return h('div',this.formalCourseVo.map((index,item)=>{
                if(item.courseDate == this.headerData.nextFirstDay){
                  if(item.stuName){
                    return h('Poptip',{
                      props:{
                        trigger:'hover',
                        placement:'left',
                      }
                    },[
                      h('a',{
                        props:{
                          type:'ghost',
                        },
                      },item.stuName+'('+item.grade+')'),
                      h('div',{
                        slot:'content',
                        attrs:{
                          class:'api',
                        },
                        style:{
                          maxWidth:'500px'
                        }
                      },[
                        h('p',{},'时间：'+item.startTime+'--'+item.endTime),
                        h('p',{},'CC：'+item.saleName),
                      ])
                    ])
                  }else {
                    h('span',{},item.startTime+'~'+item.endTime)
                  }
                }
              }))
//              return `
//                    <div v-for='(item,index) in formalCourseVo' :key='index'>
//                      <div v-if='item.courseDate == headerData.nextFirstDay'>
//                        <div v-if='item.stuName'>
//                          <Poptip trigger="hover" placement="left">
//                              <a type="ghost"  v-if='item.stuName'>{{item.stuName}}({{item.grade}})</a>
//                              <div class="api" slot="content" style="max-width:500px;">
//                                <p>时间：{{item.startTime}}--{{item.endTime}}</p>
//                                 <p>CC：{{item.saleName}}</p>
//                              </div>
//                          </Poptip>
//                        </div>
//                        <div v-else>
//                          <span>{{item.startTime}}~{{item.endTime}}</span>
//                        </div>
//                      </div>
//                      <div v-else></div>
//                    </div>
//                    `;
            },
          },
          {
            key: '2',
            align: 'center',
            width: 90,
            render : (h, params) => {
              return h('div',this.formalCourseVo.map((index,item)=>{
                if(item.courseDate == this.headerData.nextSecondDay){
                  if(item.stuName){
                    return h('Poptip',{
                      props:{
                        trigger:'hover',
                        placement:'left',
                      }
                    },[
                      h('a',{
                        props:{
                          type:'ghost',
                        },
                      },item.stuName+'('+item.grade+')'),
                      h('div',{
                        slot:'content',
                        attrs:{
                          class:'api',
                        },
                        style:{
                          maxWidth:'500px'
                        }
                      },[
                        h('p',{},'时间：'+item.startTime+'--'+item.endTime),
                        h('p',{},'CC：'+item.saleName),
                      ])
                    ])
                  }else {
                    h('span',{},item.startTime+'~'+item.endTime)
                  }
                }
              }))
//              return `
//                    <div v-for='(item,index) in formalCourseVo' :key='index'>
//                      <div v-if='item.courseDate == headerData.nextSecondDay'>
//                        <div v-if='item.stuName'>
//                          <Poptip trigger="hover" placement="left">
//                              <a type="ghost"  v-if='item.stuName'>{{item.stuName}}({{item.grade}})</a>
//                              <div class="api" slot="content" style="max-width:500px;">
//                                <p>时间：{{item.startTime}}--{{item.endTime}}</p>
//                                 <p>CC：{{item.saleName}}</p>
//                              </div>
//                          </Poptip>
//                        </div>
//                        <div v-else>
//                          <span>{{item.startTime}}~{{item.endTime}}</span>
//                        </div>
//                      </div>
//                      <div v-else></div>
//                    </div>
//                    `;
            },
          },
          {
            key: '3',
            align: 'center',
            width: 90,
            render : (h, params) => {
              return h('div',this.formalCourseVo.map((index,item)=>{
                if(item.courseDate == this.headerData.nextThreeDay){
                  if(item.stuName){
                    return h('Poptip',{
                      props:{
                        trigger:'hover',
                        placement:'left',
                      }
                    },[
                      h('a',{
                        props:{
                          type:'ghost',
                        },
                      },item.stuName+'('+item.grade+')'),
                      h('div',{
                        slot:'content',
                        attrs:{
                          class:'api',
                        },
                        style:{
                          maxWidth:'500px'
                        }
                      },[
                        h('p',{},'时间：'+item.startTime+'--'+item.endTime),
                        h('p',{},'CC：'+item.saleName),
                      ])
                    ])
                  }else {
                    h('span',{},item.startTime+'~'+item.endTime)
                  }
                }
              }))
//              return `
//                    <div v-for='(item,index) in formalCourseVo' :key='index'>
//                      <div v-if='item.courseDate == headerData.nextThreeDay'>
//                        <div v-if='item.stuName'>
//                          <Poptip trigger="hover" placement="left">
//                              <a type="ghost"  v-if='item.stuName'>{{item.stuName}}({{item.grade}})</a>
//                              <div class="api" slot="content" style="max-width:500px;">
//                                <p>时间：{{item.startTime}}--{{item.endTime}}</p>
//                                 <p>CC：{{item.saleName}}</p>
//                              </div>
//                          </Poptip>
//                        </div>
//                        <div v-else>
//                          <span>{{item.startTime}}~{{item.endTime}}</span>
//                        </div>
//                      </div>
//                      <div v-else></div>
//                    </div>
//                    `;
            },
          },
          {
            key: '4',
            align: 'center',
            width: 90,
            render : (h, params) => {
              return h('div',this.formalCourseVo.map((index,item)=>{
                if(item.courseDate == this.headerData.nextFourDay){
                  if(item.stuName){
                    return h('Poptip',{
                      props:{
                        trigger:'hover',
                        placement:'left',
                      }
                    },[
                      h('a',{
                        props:{
                          type:'ghost',
                        },
                      },item.stuName+'('+item.grade+')'),
                      h('div',{
                        slot:'content',
                        attrs:{
                          class:'api',
                        },
                        style:{
                          maxWidth:'500px'
                        }
                      },[
                        h('p',{},'时间：'+item.startTime+'--'+item.endTime),
                        h('p',{},'CC：'+item.saleName),
                      ])
                    ])
                  }else {
                    h('span',{},item.startTime+'~'+item.endTime)
                  }
                }
              }))
//              return `
//                    <div v-for='(item,index) in formalCourseVo' :key='index'>
//                      <div v-if='item.courseDate == headerData.nextFourDay'>
//                        <div v-if='item.stuName'>
//                          <Poptip trigger="hover" placement="left">
//                              <a type="ghost"  v-if='item.stuName'>{{item.stuName}}({{item.grade}})</a>
//                              <div class="api" slot="content" style="max-width:500px;">
//                                <p>时间：{{item.startTime}}--{{item.endTime}}</p>
//                                 <p>CC：{{item.saleName}}</p>
//                              </div>
//                          </Poptip>
//                        </div>
//                        <div v-else>
//                          <span>{{item.startTime}}~{{item.endTime}}</span>
//                        </div>
//                      </div>
//                      <div v-else></div>
//                    </div>
//                    `;
            },
          },
          {
            key: '5',
            align: 'center',
            width: 90,
            render : (h, params) => {
              return h('div',this.formalCourseVo.map((index,item)=>{
                if(item.courseDate == this.headerData.nextFiveDay){
                  if(item.stuName){
                    return h('Poptip',{
                      props:{
                        trigger:'hover',
                        placement:'left',
                      }
                    },[
                      h('a',{
                        props:{
                          type:'ghost',
                        },
                      },item.stuName+'('+item.grade+')'),
                      h('div',{
                        slot:'content',
                        attrs:{
                          class:'api',
                        },
                        style:{
                          maxWidth:'500px'
                        }
                      },[
                        h('p',{},'时间：'+item.startTime+'--'+item.endTime),
                        h('p',{},'CC：'+item.saleName),
                      ])
                    ])
                  }else {
                    h('span',{},item.startTime+'~'+item.endTime)
                  }
                }
              }))
//              return `
//                    <div v-for='(item,index) in formalCourseVo' :key='index'>
//                      <div v-if='item.courseDate == headerData.nextFiveDay'>
//                        <div v-if='item.stuName'>
//                          <Poptip trigger="hover" placement="left">
//                              <a type="ghost"  v-if='item.stuName'>{{item.stuName}}({{item.grade}})</a>
//                              <div class="api" slot="content" style="max-width:500px;">
//                                <p>时间：{{item.startTime}}--{{item.endTime}}</p>
//                                 <p>CC：{{item.saleName}}</p>
//                              </div>
//                          </Poptip>
//                        </div>
//                        <div v-else>
//                          <span>{{item.startTime}}~{{item.endTime}}</span>
//                        </div>
//                      </div>
//                      <div v-else></div>
//                    </div>
//                    `;
            },
          },
          {
            key: '6',
            align: 'center',
            width: 90,
            render : (h, params) => {
              return h('div',this.formalCourseVo.map((index,item)=>{
                if(item.courseDate == this.headerData.nextSixDay){
                  if(item.stuName){
                    return h('Poptip',{
                      props:{
                        trigger:'hover',
                        placement:'left',
                      }
                    },[
                      h('a',{
                        props:{
                          type:'ghost',
                        },
                      },item.stuName+'('+item.grade+')'),
                      h('div',{
                        slot:'content',
                        attrs:{
                          class:'api',
                        },
                        style:{
                          maxWidth:'500px'
                        }
                      },[
                        h('p',{},'时间：'+item.startTime+'--'+item.endTime),
                        h('p',{},'CC：'+item.saleName),
                      ])
                    ])
                  }else {
                    h('span',{},item.startTime+'~'+item.endTime)
                  }
                }
              }))
//              return `
//                    <div v-for='(item,index) in formalCourseVo' :key='index'>
//                      <div v-if='item.courseDate == headerData.nextSixDay'>
//                        <div v-if='item.stuName'>
//                          <Poptip trigger="hover" placement="left">
//                              <a type="ghost"  v-if='item.stuName'>{{item.stuName}}({{item.grade}})</a>
//                              <div class="api" slot="content" style="max-width:500px;">
//                                <p>时间：{{item.startTime}}--{{item.endTime}}</p>
//                                 <p>CC：{{item.saleName}}</p>
//                              </div>
//                          </Poptip>
//                        </div>
//                        <div v-else>
//                          <span>{{item.startTime}}~{{item.endTime}}</span>
//                        </div>
//                      </div>
//                      <div v-else></div>
//                    </div>
//                    `;
            },
          },
          {
            key: '7',
            align: 'center',
            width: 90,
            render : (h, params) => {
              return h('div',this.formalCourseVo.map((index,item)=>{
                if(item.courseDate == this.headerData.nextSevenDay){
                  if(item.stuName){
                    return h('Poptip',{
                      props:{
                        trigger:'hover',
                        placement:'left',
                      }
                    },[
                      h('a',{
                        props:{
                          type:'ghost',
                        },
                      },item.stuName+'('+item.grade+')'),
                      h('div',{
                        slot:'content',
                        attrs:{
                          class:'api',
                        },
                        style:{
                          maxWidth:'500px'
                        }
                      },[
                        h('p',{},'时间：'+item.startTime+'--'+item.endTime),
                        h('p',{},'CC：'+item.saleName),
                      ])
                    ])
                  }else {
                    h('span',{},item.startTime+'~'+item.endTime)
                  }
                }
              }))
//              return `
//                    <div v-for='(item,index) in formalCourseVo' :key='index'>
//                      <div v-if='item.courseDate == headerData.nextSevenDay'>
//                        <div v-if='item.stuName'>
//                          <Poptip trigger="hover" placement="left">
//                              <a type="ghost"  v-if='item.stuName'>{{item.stuName}}({{item.grade}})</a>
//                              <div class="api" slot="content" style="max-width:500px;">
//                                <p>时间：{{item.startTime}}--{{item.endTime}}</p>
//                                 <p>CC：{{item.saleName}}</p>
//                              </div>
//                          </Poptip>
//                        </div>
//                        <div v-else>
//                          <span>{{item.startTime}}~{{item.endTime}}</span>
//                        </div>
//                      </div>
//                      <div v-else></div>
//                    </div>
//                    `;
            },
          },
          {
            align: 'center',
            key: 'teacherName',
            width: 80,
            render(h,params){
              return ''
            }
          },
        ]
      }
    },
    mounted() {
//      this.getData(this.num);

      this.getWaitCourseByUuid(this.requestUuid);
      this.loadClassTime('start');
      const _this = this;
      common.ajax({
        url: TEACHER().Public.getAllSubject,
        method: 'get',
        success: function (res) {
          _this.subjectList = res.data || [];
        }
      });
      common.ajax({
        url: COMMON_API().allSchool,
        method: 'get',
        success: function (response) {
          _this.schoolList = response.data || [];
        }
      });
      common.ajax({//获取省
        url: COMMON_API().ssqAreaAll,
        method: 'get',
        data: {parentCode: 0},
        success: function (response) {
          _this.provinceList = response.data || [];
        }
      });
    },
    methods: {
      getDataUp(){
        const _this = this;
        _this.num++;
        _this.getData(_this.num)
      },
      getDataDown(){
        const _this = this;
        _this.num--;
        _this.getData(_this.num)
      },
      getData(data){
        const _this = this;
        _this.headerData0 = [];
        common.ajax({
          url: SCS().FormalCourse.getWeek + '?nextWeek=' + data,
          method: 'get',
          success: function (response) {
            _this.headerData = response.data || {};
            _this.headerData0.push(response.data);
            _this.dataStart = response.data.nextFirstDay
            _this.dataEnd = response.data.nextSevenDay
            _this.show();
          },
        });
      },
      show(uuid, name) {
        const _this = this;
        let apiUrl = SCS().WaitCourse.getTeacherTimeSchedule;
        _this.headerData1 = [];

        if (uuid && name) {
          _this.teacherUuid0 = uuid
          _this.clickName = name
          _this.headerData0 = [];
          common.ajax({
            url: SCS().FormalCourse.getWeek + '?nextWeek=0',
            method: 'get',
            success: function (response) {
              _this.headerData = response.data || {};
              _this.headerData0.push(response.data);
              _this.dataStart = response.data.nextFirstDay
              _this.dataEnd = response.data.nextSevenDay
            },
          });
        }
        common.ajax({
          url: apiUrl,
          data: {
            teacherUuid: _this.teacherUuid0,
            startDate: _this.dataStart,
            endDate: _this.dataEnd,
          },
          success: function (response) {
            _this.headerData1.push(response.data.teacherDateList[0] || [])
            _this.formalCourseVo = response.data.teacherDateList || [];
//            _this.headerData = response.data.headerData || [];
          },
        });
      },
      save() {
        let selectRow = this.selectionRowData;
        if (selectRow.length === 1) {
          if (this.formItem.date === '' || this.formItem.startTime === '' || this.formItem.endTime === '') {
            common.msg('请填写上课日期和时间！');
          } else {
            const _this = this;
            let data = this.data;
            let courseOrderUuid = '', leadsUuid = '', payUuid = '',
              courseRequestUuid = _this.requestUuid;
            if (data.length > 0) {
              courseOrderUuid = data[0].uuid;
              payUuid = data[0].payUuid;
              leadsUuid = data[0].leadsUuid;
            }
            common.ajax({
              url: STUDY_COURSE().WaitCourse.createCourse,
              data: {
                courseOrderUuid: courseOrderUuid,
                courseRequestUuid: courseRequestUuid,
                leadsUuid: leadsUuid,
                payUuid: payUuid,
                courseDate: _this.formItem.date,
                startTime: _this.formItem.startTime,
                endTime: _this.formItem.endTime,
                teacherName: _this.teacherName,
                teacherPhone: _this.teacherPhone,
                courseType: _this.type, //课程类型
                teacherUuid: _this.teacherUuid,
              },
              success: function (res) {
                common.notices('操作成功！');
                location.hash = '/study/waitCourse';
              }
            });
          }
        } else {
          common.msg('请选择一个可排课老师');
        }
      },
      getWaitCourseByUuid(requestUuid) {
        const _this = this;
        common.ajax({
          url: STUDY_COURSE().WaitCourse.getWaitCourseInfoByRequestUuid,
          data: {courseRequestUuid: requestUuid},
          success(res) {
            _this.data.push(res.data);
          }
        });
      },
      getFullPhone(teacherUuid) {
        const _this = this;
        common.ajax({
          url: TEACHER().Public.displayPhone,
          method: 'get',
          data: {uuid: teacherUuid, moduleName: '师资管理-可排课老师'},
          success: function (res) {
            _this.$Modal.info({
              content: (res.data !== null) ? res.data.phone : ''
            });
          }
        })
      },
      loadDataGrid(val) {
          let orderBy = '', sortBy = '';
          if(val) this.pageIndex = val;
        let nameOrPhone = this.Search.nameOrPhone;
        let tcName = '', phone = '';
        if (/^[1-9]\d*$/.test(nameOrPhone)) {
          phone = nameOrPhone;
        } else {
          tcName = nameOrPhone;
        }
        let param = `?tcName=${tcName}&phone=${phone}&branch=${this.Search.branch}&sex=${this.Search.sex}&natureOfWork=${this.Search.natureOfWork}&schoolLocation=${this.Search.schoolLocationKey}`;
        param += `&gradePreference=${this.Search.gradePreference}&teachingSubject=${this.Search.teachingSubject}`;
        param += `&province=${this.Search.provinceKey}&city=${this.Search.cityKey}&district=${this.Search.districtKey}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=&sortBy=`;
        const _this = this;
        _this.headerData0 = [];
        _this.headerData1 = [];
        _this.clickName = '';
        common.ajax({
          url: TEACHER().CanCourseTeacher.dataGrid + param,
          method: 'get',
          success: function (response) {
            _this.canCourseData = response.data.teacherList || [];
            _this.total = response.data.total;
          }
        });
      },
      viewErrorQuestion(courserequestUuid) {
        let a = document.createElement('a');
        a.id = 'viewErrorQuestion';
        a.innerHTML = '<span>aaaaaa</span>';
        a.href = '/static/errorQuestion.html?courserequestUuid=' + courserequestUuid;
        a.target = '_blank';
        $('body').append(a);
        $('#viewErrorQuestion span', 'body').trigger('click');
        $('#viewErrorQuestion', 'body').remove();
      },
      clearForm() {
        clearSearchForm(this.Search, [], this);
      },
      changeSelectedCity(areaName) {
        const _this = this;
        //获取城市
        common.ajax({
          url: COMMON_API().ssqAreaAll,
          method: 'get',
          data: {parentCode: areaName},
          success: function (response) {
            _this.cityArrays = response.data || [];
          }
        });
      },
      changeSelectedArea(areaName) {
        const _this = this;
        //获取城市的区域
        common.ajax({
          url: COMMON_API().ssqAreaAll,
          method: 'get',
          data: {parentCode: areaName},
          success: function (response) {
            _this.areaList = response.data || [];
          }
        });
      },
      changeStartTime(value) {
        this.loadClassTime('end', value);
      },
      loadClassTime(type, range) {
        let _this = this;
        //上课时间开始时间7-23
        if (type === 'start') {
          $.getJSON("static/data.json", function (json) {
            var list = json.courseRangTimes30;
            list = list.slice(0, list.length - 2);
            _this.startTimeList = list;
          });
        }
        //结束时间8-24
        if (type === 'end') {
          range = range || '';
          _this.endTimeList = [];
          $.getJSON("static/data.json", function (json) {
            json.courseRangTimes30.forEach((item, index) => {
              if (item.value > range) {
                _this.endTimeList.push(item);
              }
            });
          });
        }
      },
      selectRow(currentRow) {
        this.selectionRowData = currentRow;
      },
      changeDate(value) {
        this.formItem.date = value;
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.loadDataGrid();
      }
    },
    computed: {
      teacherName() {
        if (this.selectionRowData.length > 1) {
          common.msg('一次只能选择一个可排课老师');
        }
        if (this.selectionRowData.length === 0) {
          return '';
        }
        return this.selectionRowData[0].tcName;
      },
      teacherPhone() {
        if (this.selectionRowData.length > 1) {
          common.msg('一次只能选择一个可排课老师');
        }
        if (this.selectionRowData.length === 0) {
          return '';
        }
        return this.selectionRowData[0].phone;
      },
      teacherUuid() {
        if (this.selectionRowData.length > 1) {
          common.msg('一次只能选择一个可排课老师');
        }
        if (this.selectionRowData.length === 0) {
          return '';
        }
        return this.selectionRowData[0].uuid;
      }
    },
    components: {OBreadcrumb,PageModel}
  };
</script>

<style scoped>
  .p10 {
    padding: 10px 0;
  }

  .p10 span {
    font-size: 18px;
    margin: 0 10px;
    vertical-align: middle;
  }

  span i {
    font-style: normal;
  }

  .student-info {
    margin: 10px;
  }
</style>
