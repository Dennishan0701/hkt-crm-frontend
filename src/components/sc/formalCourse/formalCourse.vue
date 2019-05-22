<template>
  <div>
    <o-breadcrumb second="销售与客服" third="正式课排课表"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">

          <i-input :size="$store.state.searchModuleSize" v-model="Search.name" @on-keyup.enter="searchForm(1)" placeholder="学生姓名"
                   style="width:120px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.phone" @on-keyup.enter="searchForm(1)" placeholder="学生手机号"
                   style="width:120px;margin-right:2px;"></i-input>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <div style="min-width: 1000px">
      <i-table :show-header="renderHeader" border size="small" highlight-row stripe :columns="columns0"
               :data="headerData0"></i-table>
      <i-table :show-header="renderHeader" border size="small" highlight-row stripe :columns="columns"
               :data="data"></i-table>
    </div>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
    <create-course @reFresh="reFresh" ref="create"></create-course>
    <make-up-course @reFresh="reFresh" ref="makeup"></make-up-course>
  </div>

</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {SCS} from 'common/api/scs.js';
  import {formateDate, common, hideCharAtNumber} from 'common/js/common.js';
  import createCourse from './createCourse';
  import makeUpCourse from './makeUpCourse';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        renderHeader: false,
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: 15,
        Search: {
          name: '',
          phone: '',
        },
        formalCourseVo: [],
        headerData0: [],
        headerData: {},
        columns0: [
          {
            title: '老师',
            align: 'center',
            width: 70,
            render: (h, params) => {
              return h('div', '老师')
            }
          },
          {
            key: '1',
            align: 'center',
            width: 120,
            render: (h, params) => {
              return h('div', [
                h('p', {}, params.row.nextFirstDayWeek),
                h('p', {}, params.row.nextFirstDay),
              ])
//              return `<p>${row.nextFirstDayWeek}</p><p>${row.nextFirstDay}</p>`
            },
          },
          {
            key: '2',
            align: 'center',
            width: 120,
            render: (h, params) => {
              return h('div', [
                h('p', {}, params.row.nextSecondDayWeek),
                h('p', {}, params.row.nextSecondDay),
              ])
//              return `<p>${row.nextSecondDayWeek}</p><p>${row.nextSecondDay}</p>`
            },
          },
          {
            key: '3',
            align: 'center',
            width: 120,
            render: (h, params) => {
              return h('div', [
                h('p', {}, params.row.nextThreeDayWeek),
                h('p', {}, params.row.nextThreeDay),
              ])
//              return `<p>${row.nextThreeDayWeek}</p><p>${row.nextThreeDay}</p>`
            },
          },
          {
            key: '4',
            align: 'center',
            width: 120,
            render: (h, params) => {
              return h('div', [
                h('p', {}, params.row.nextFourDayWeek),
                h('p', {}, params.row.nextFourDay),
              ])
//              return `<p>${row.nextFourDayWeek}</p><p>${row.nextFourDay}</p>`
            },
          },
          {
            key: '5',
            align: 'center',
            width: 120,
            render: (h, params) => {
              return h('div', [
                h('p', {}, params.row.nextFiveDayWeek),
                h('p', {}, params.row.nextFiveDay),
              ])
//              return `<p>${row.nextFiveDayWeek}</p><p>${row.nextFiveDay}</p>`
            },
          },
          {
            key: '6',
            align: 'center',
            width: 120,
            render: (h, params) => {
              return h('div', [
                h('p', {}, params.row.nextSixDayWeek),
                h('p', {}, params.row.nextSixDay),
              ])
//              return `<p>${row.nextSixDayWeek}</p><p>${row.nextSixDay}</p>`
            },
          },
          {
            key: '7',
            align: 'center',
            width: 120,
            render: (h, params) => {
              return h('div', [
                h('p', {}, params.row.nextSevenDayWeek),
                h('p', {}, params.row.nextSevenDay),
              ])
//              return `<p>${row.nextSevenDayWeek}</p><p>${row.nextSevenDay}</p>`
            },
          },
        ],
        columns: [
          {
            align: 'center',
            key: 'teacherName',
            width: 70,
            render: (h, params) => {
              return h('div', [
                h('p', {}, params.row.teacherName),
                h('p', {}, params.row.subject),
                h('p', {}, [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                    },
                    on: {
                      click: () => {
                        this.createCourse(params.row.courseOrderUuid, params.row.courseRequestUuid, params.row.teacherUuid, params.row.leadsName, params.row.teacherName, params.row.subject)
                      }
                    }
                  }, '批量开课')
                ]),
              ])
//                return `<p>${row.teacherName}</p><p>(${row.subject})</p><p><i-button type="primary" size="small" @click="createCourse('${row.courseOrderUuid}','${row.courseRequestUuid}','${row.teacherUuid}','${row.leadsUuid}','${row.leadsName}','${row.teacherName}','${row.subject}')">批量开课</i-button></p>`
            }
          },
          {
            key: '1',
            align: 'center',
            width: 120,
            render: (h, params) => {
              return h('div', this.formalCourseVo[params.index].formalCourseVo.map(item => {
                if (item.freeDate == this.headerData.nextFirstDay) {
                  if (item.studentName) {
                    return h('div', [
                      h('Poptip', {
                        props: {
                          trigger: 'hover',
                          placement: 'left',
                        }
                      }, [
                        h('div', {
                          slot: 'content',
                          attrs: {
                            class: 'api'
                          },
                          style: {
                            maxWidth: '500px'
                          }
                        }, [
                          h('p', {}, '时间：' + item.freeStartTime + '--' + item.freeEndTime),
                          h('p', {}, 'CC：' + item.saleName)
                        ]),
                        h('span', {
                          props: {
                            type: 'ghost'
                          }
                        }, item.studentName + '(' + item.grade + ')')
                      ])
                    ])
                  } else {
                    return h('div', [
                      h('a', {
                        on: {
                          click: () => {
                            this.makeUpCourse(params.row.courseOrderUuid,params.row.courseRequestUuid,params.row.teacherUuid,params.row.leadsUuid)
                          }
                        }
                      }, item.freeStartTime + '~' + item.freeEndTime)
                    ])
                  }
                } else {
                  return h('div')
                }
              }))
//              return `
//                    <div v-for='(item,index) in formalCourseVo[${index}].formalCourseVo'  :key='index'>
//                      <div v-if='item.freeDate == headerData.nextFirstDay'>
//                        <div v-if='item.studentName'>
//                          <Poptip trigger="hover" placement="left">
//                              <span type="ghost"  v-if='item.studentName'>{{item.studentName}}({{item.grade}})</span>
//                              <div class="api" slot="content" style="max-width:500px;">
//                                <p>时间：{{item.freeStartTime}}--{{item.freeEndTime}}</p>
//                                 <p>CC：{{item.saleName}}</p>
//                              </div>
//                          </Poptip>
//                        </div>
//                        <div v-else>
//                          <a @click=makeUpCourse('${row.courseOrderUuid}','${row.courseRequestUuid}','${row.teacherUuid}','${row.leadsUuid}')>{{item.freeStartTime}}~{{item.freeEndTime}}</a>
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
            width: 120,
            render: (h, params) => {
              return h('div', this.formalCourseVo[params.index].formalCourseVo.map(item => {
                if (item.freeDate == this.headerData.nextSecondDay) {
                  if (item.studentName) {
                    return h('div', [
                      h('Poptip', {
                        props: {
                          trigger: 'hover',
                          placement: 'left',
                        }
                      }, [
                        h('div', {
                          slot: 'content',
                          attrs: {
                            class: 'api'
                          },
                          style: {
                            maxWidth: '500px'
                          }
                        }, [
                          h('p', {}, '时间：' + item.freeStartTime + '--' + item.freeEndTime),
                          h('p', {}, 'CC：' + item.saleName)
                        ]),
                        h('span', {
                          props: {
                            type: 'ghost'
                          }
                        }, item.studentName + '(' + item.grade + ')')
                      ])
                    ])
                  } else {
                    return h('div', [
                      h('a', {
                        on: {
                          click: () => {
                            this.makeUpCourse(params.row.courseOrderUuid,params.row.courseRequestUuid,params.row.teacherUuid,params.row.leadsUuid)
                          }
                        }
                      }, item.freeStartTime + '~' + item.freeEndTime)
                    ])
                  }
                } else {
                  return h('div')
                }
              }))
//              return `
//                    <div v-for='(item,index) in formalCourseVo[${index}].formalCourseVo' :key='index'>
//                      <div v-if='item.freeDate == headerData.nextSecondDay'>
//                        <div v-if='item.studentName'>
//                          <Poptip trigger="hover" placement="left">
//                              <span type="ghost"  v-if='item.studentName'>{{item.studentName}}({{item.grade}})</span>
//                              <div class="api" slot="content" style="max-width:500px;">
//                                <p>时间：{{item.freeStartTime}}--{{item.freeEndTime}}</p>
//                                 <p>CC：{{item.saleName}}</p>
//                              </div>
//                          </Poptip>
//                        </div>
//                        <div v-else>
//                          <a @click=makeUpCourse('${row.courseOrderUuid}','${row.courseRequestUuid}','${row.teacherUuid}','${row.leadsUuid}')>{{item.freeStartTime}}~{{item.freeEndTime}}</a>
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
            width: 120,
            render: (h, params) => {
              return h('div', this.formalCourseVo[params.index].formalCourseVo.map(item => {
                if (item.freeDate == this.headerData.nextThreeDay) {
                  if (item.studentName) {
                    return h('div', [
                      h('Poptip', {
                        props: {
                          trigger: 'hover',
                          placement: 'left',
                        }
                      }, [
                        h('div', {
                          slot: 'content',
                          attrs: {
                            class: 'api'
                          },
                          style: {
                            maxWidth: '500px'
                          }
                        }, [
                          h('p', {}, '时间：' + item.freeStartTime + '--' + item.freeEndTime),
                          h('p', {}, 'CC：' + item.saleName)
                        ]),
                        h('span', {
                          props: {
                            type: 'ghost'
                          },
                          style:{
                            display:item.studentName?'block':'none'
                          }
                        }, item.studentName + '(' + item.grade + ')')
                      ])
                    ])
                  } else {
                    return h('div', [
                      h('a', {
                        on: {
                          click: () => {
                            this.makeUpCourse(params.row.courseOrderUuid,params.row.courseRequestUuid,params.row.teacherUuid,params.row.leadsUuid)
                          }
                        }
                      }, item.freeStartTime + '~' + item.freeEndTime)
                    ])
                  }
                } else {
                  return h('div')
                }
              }))
//              return `
//                    <div v-for='(item,index) in formalCourseVo[${index}].formalCourseVo' :key='index'>
//                      <div v-if='item.freeDate == headerData.nextThreeDay'>
//                        <div v-if='item.studentName'>
//                          <Poptip trigger="hover" placement="left">
//                              <span type="ghost"  v-if='item.studentName'>{{item.studentName}}({{item.grade}})</span>
//                              <div class="api" slot="content" style="max-width:500px;">
//                                <p>时间：{{item.freeStartTime}}--{{item.freeEndTime}}</p>
//                                 <p>CC：{{item.saleName}}</p>
//                              </div>
//                          </Poptip>
//                        </div>
//                        <div v-else>
//                          <a @click=makeUpCourse('${row.courseOrderUuid}','${row.courseRequestUuid}','${row.teacherUuid}','${row.leadsUuid}')>{{item.freeStartTime}}~{{item.freeEndTime}}</a>
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
            width: 120,
            render: (h, params) => {
              return h('div', this.formalCourseVo[params.index].formalCourseVo.map(item => {
                if (item.freeDate == this.headerData.nextFourDay) {
                  if (item.studentName) {
                    return h('div', [
                      h('Poptip', {
                        props: {
                          trigger: 'hover',
                          placement: 'left',
                        }
                      }, [
                        h('div', {
                          slot: 'content',
                          attrs: {
                            class: 'api'
                          },
                          style: {
                            maxWidth: '500px'
                          }
                        }, [
                          h('p', {}, '时间：' + item.freeStartTime + '--' + item.freeEndTime),
                          h('p', {}, 'CC：' + item.saleName)
                        ]),
                        h('span', {
                          props: {
                            type: 'ghost'
                          },
                          style:{
                            display:item.studentName?'block':'none'
                          }
                        }, item.studentName + '(' + item.grade + ')')
                      ])
                    ])
                  } else {
                    return h('div', [
                      h('a', {
                        on: {
                          click: () => {
                            this.makeUpCourse(params.row.courseOrderUuid,params.row.courseRequestUuid,params.row.teacherUuid,params.row.leadsUuid)
                          }
                        }
                      }, item.freeStartTime + '~' + item.freeEndTime)
                    ])
                  }
                } else {
                  return h('div')
                }
              }))
//              return `
//                    <div v-for='(item,index) in formalCourseVo[${index}].formalCourseVo' :key='index'>
//                      <div v-if='item.freeDate == headerData.nextFourDay'>
//                        <div v-if='item.studentName'>
//                          <Poptip trigger="hover" placement="left">
//                              <span type="ghost"  v-if='item.studentName'>{{item.studentName}}({{item.grade}})</span>
//                              <div class="api" slot="content" style="max-width:500px;">
//                                <p>时间：{{item.freeStartTime}}--{{item.freeEndTime}}</p>
//                                 <p>CC：{{item.saleName}}</p>
//                              </div>
//                          </Poptip>
//                        </div>
//                        <div v-else>
//                          <a @click=makeUpCourse('${row.courseOrderUuid}','${row.courseRequestUuid}','${row.teacherUuid}','${row.leadsUuid}')>{{item.freeStartTime}}~{{item.freeEndTime}}</a>
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
            width: 120,
            render: (h, params) => {
              return h('div', this.formalCourseVo[params.index].formalCourseVo.map(item => {
                if (item.freeDate == this.headerData.nextFiveDay) {
                  if (item.studentName) {
                    return h('div', [
                      h('Poptip', {
                        props: {
                          trigger: 'hover',
                          placement: 'left',
                        }
                      }, [
                        h('div', {
                          slot: 'content',
                          attrs: {
                            class: 'api'
                          },
                          style: {
                            maxWidth: '500px'
                          }
                        }, [
                          h('p', {}, '时间：' + item.freeStartTime + '--' + item.freeEndTime),
                          h('p', {}, 'CC：' + item.saleName)
                        ]),
                        h('span', {
                          props: {
                            type: 'ghost'
                          },
                          style:{
                            display:item.studentName?'block':'none'
                          }
                        }, item.studentName + '(' + item.grade + ')')
                      ])
                    ])
                  } else {
                    return h('div', [
                      h('a', {
                        on: {
                          click: () => {
                            this.makeUpCourse(params.row.courseOrderUuid,params.row.courseRequestUuid,params.row.teacherUuid,params.row.leadsUuid)
                          }
                        }
                      }, item.freeStartTime + '~' + item.freeEndTime)
                    ])
                  }
                } else {
                  return h('div')
                }
              }))
//              return `
//                    <div v-for='(item,index) in formalCourseVo[${index}].formalCourseVo' :key='index'>
//                      <div v-if='item.freeDate == headerData.nextFiveDay'>
//                        <div v-if='item.studentName'>
//                          <Poptip trigger="hover" placement="left">
//                              <span type="ghost"  v-if='item.studentName'>{{item.studentName}}({{item.grade}})</span>
//                              <div class="api" slot="content" style="max-width:500px;">
//                                <p>时间：{{item.freeStartTime}}--{{item.freeEndTime}}</p>
//                                 <p>CC：{{item.saleName}}</p>
//                              </div>
//                          </Poptip>
//                        </div>
//                        <div v-else>
//                          <a @click=makeUpCourse('${row.courseOrderUuid}','${row.courseRequestUuid}','${row.teacherUuid}','${row.leadsUuid}')>{{item.freeStartTime}}~{{item.freeEndTime}}</a>
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
            width: 120,
            render: (h, params) => {
              return h('div', this.formalCourseVo[params.index].formalCourseVo.map(item => {
                if (item.freeDate == this.headerData.nextSixDay) {
                  if (item.studentName) {
                    return h('div', [
                      h('Poptip', {
                        props: {
                          trigger: 'hover',
                          placement: 'left',
                        }
                      }, [
                        h('div', {
                          slot: 'content',
                          attrs: {
                            class: 'api'
                          },
                          style: {
                            maxWidth: '500px'
                          }
                        }, [
                          h('p', {}, '时间：' + item.freeStartTime + '--' + item.freeEndTime),
                          h('p', {}, 'CC：' + item.saleName)
                        ]),
                        h('span', {
                          props: {
                            type: 'ghost'
                          },
                          style:{
                            display:item.studentName?'block':'none'
                          }
                        }, item.studentName + '(' + item.grade + ')')
                      ])
                    ])
                  } else {
                    return h('div', [
                      h('a', {
                        on: {
                          click: () => {
                            this.makeUpCourse(params.row.courseOrderUuid,params.row.courseRequestUuid,params.row.teacherUuid,params.row.leadsUuid)
                          }
                        }
                      }, item.freeStartTime + '~' + item.freeEndTime)
                    ])
                  }
                } else {
                  return h('div')
                }
              }))

//              return `
//                    <div v-for='(item,index) in formalCourseVo[${index}].formalCourseVo' :key='index'>
//                      <div v-if='item.freeDate == headerData.nextSixDay'>
//                        <div v-if='item.studentName'>
//                          <Poptip trigger="hover" placement="left">
//                              <span type="ghost"  v-if='item.studentName'>{{item.studentName}}({{item.grade}})</span>
//                              <div class="api" slot="content" style="max-width:500px;">
//                                <p>时间：{{item.freeStartTime}}--{{item.freeEndTime}}</p>
//                                 <p>CC：{{item.saleName}}</p>
//                              </div>
//                          </Poptip>
//                        </div>
//                        <div v-else>
//                          <a @click=makeUpCourse('${row.courseOrderUuid}','${row.courseRequestUuid}','${row.teacherUuid}','${row.leadsUuid}')>{{item.freeStartTime}}~{{item.freeEndTime}}</a>
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
            width: 120,
            render: (h, params) => {
              return h('div', this.formalCourseVo[params.index].formalCourseVo.map(item => {
                if (item.freeDate == this.headerData.nextSevenDay) {
                  if (item.studentName) {
                    return h('div', [
                      h('Poptip', {
                        props: {
                          trigger: 'hover',
                          placement: 'left',
                        }
                      }, [
                        h('div', {
                          slot: 'content',
                          attrs: {
                            class: 'api'
                          },
                          style: {
                            maxWidth: '500px'
                          }
                        }, [
                          h('p', {}, '时间：' + item.freeStartTime + '--' + item.freeEndTime),
                          h('p', {}, 'CC：' + item.saleName)
                        ]),
                        h('span', {
                          props: {
                            type: 'ghost'
                          },
                          style:{
                            display:item.studentName?'block':'none'
                          }
                        }, item.studentName + '(' + item.grade + ')')
                      ])
                    ])
                  } else {
                    return h('div', [
                      h('a', {
                        on: {
                          click: () => {
                            this.makeUpCourse(params.row.courseOrderUuid,params.row.courseRequestUuid,params.row.teacherUuid,params.row.leadsUuid)
                          }
                        }
                      }, item.freeStartTime + '~' + item.freeEndTime)
                    ])
                  }
                } else {
                  return h('div')
                }
              }))
//              return `
//                    <div v-for='(item,index) in formalCourseVo[${index}].formalCourseVo' :key='index'>
//                      <div v-if='item.freeDate == headerData.nextSevenDay'>
//                        <div v-if='item.studentName'>
//                          <Poptip trigger="hover" placement="left">
//                              <span type="ghost"  v-if='item.studentName'>{{item.studentName}}({{item.grade}})</span>
//                              <div class="api" slot="content" style="max-width:500px;">
//                                <p>时间：{{item.freeStartTime}}--{{item.freeEndTime}}</p>
//                                 <p>CC：{{item.saleName}}</p>
//                              </div>
//                          </Poptip>
//                        </div>
//                        <div v-else>
//                          <a @click=makeUpCourse('${row.courseOrderUuid}','${row.courseRequestUuid}','${row.teacherUuid}','${row.leadsUuid}')>{{item.freeStartTime}}~{{item.freeEndTime}}</a>
//                        </div>
//                      </div>
//                      <div v-else></div>
//                    </div>
//                    `;
            },
          },
        ]
      }
    },
    mounted() {
      const _this = this;
      // common.ajax({
      //   url: SCS().FormalCourse.getWeek + '?nextWeek=0',
      //   method: 'get',
      //   success: function (response) {
      //     _this.headerData = response.data || {};
      //     _this.headerData0.push(response.data)
      //   },
      // });
      this.$axios.get(SCS().FormalCourse.getWeek,{
        params:{
          nextWeek:0,
        },
      }).then( ({data}) => {
        _this.headerData = data.data || {};
        _this.headerData0.push(data.data)
      })
    },
    methods: {
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          name: this.Search.name,
          phone: this.Search.phone,
        });
      },
      createCourse(courseOrderUuid, courseRequestUuid, teacherUuid, leadsUuid, leadsName, teacherName, subject) {
        this.$refs.create.show(courseOrderUuid, courseRequestUuid, teacherUuid, leadsUuid, leadsName, teacherName, subject);
      },
      makeUpCourse(courseOrderUuid, courseRequestUuid, teacherUuid, leadsUuid) {
        this.$refs.makeup.show(courseOrderUuid, courseRequestUuid, teacherUuid, leadsUuid);
      },
      loadDataGrid(search) {
        let param = `?leadsName=${search.name}&leadsPhone=${search.phone}&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}`;
        let apiUrl = SCS().FormalCourse.getFormalCourseInfo + param;
        const _this = this;
//         common.ajax({
//           url: apiUrl,
//           method: 'get',
//           success: function (response) {
//             _this.data = response.data || [];
//             _this.formalCourseVo = response.data || [];
// //            _this.headerData = response.data.headerData || [];
//           },
//         });
        this.$axios.get(SCS().FormalCourse.getFormalCourseInfo,{
          params:{
            leadsName:search.name,
            leadsPhone:search.phone,
            pageIndex:this.pageIndex,
            pageNumber:this.pageNumber,
          },
        }).then( ({data}) => {
          _this.data = data.data || [];
          _this.formalCourseVo = data.data || [];
        })
      },
      pageChange(pageIndex){
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      reFresh(){
        this.searchForm();
      }
    },
    components: {
      OBreadcrumb, createCourse, makeUpCourse,PageModel
    }
  };
</script>

<style lang="less" rel="stylesheet/less">
  #headerTitle {
    display: table;
    width: 990px;
    table-layout: fixed;
    width: 100% !important;
    thead {
      display: table-row-group;
      tr {
        display: table-row;
        vertical-align: inherit;
        border-color: inherit;
        width: inherit;
        height: 100%;
        max-width: 100%;
        overflow: hidden;
        color: #657180;
        font-size: 12px;
        background-color: #fff;
        box-sizing: border-box;
        height: 40px;
        td, th {
          height: 40px;
          display: table-cell;
          white-space: nowrap;
          overflow: hidden;
          background-color: #f5f7f9;
          height: 100%;
          min-width: 0;
          height: 48px;
          box-sizing: border-box;
          text-align: center;
          text-overflow: ellipsis;
          vertical-align: middle;
          border-bottom: 1px solid #e3e8ee;
        }
      }

    }
  }
</style>
