<template>
  <div>
    <o-breadcrumb second="课耗管理" third="完课管理"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <i-select v-model="Search.courseCastType" :size="$store.state.searchModuleSize" clearable placeholder="课耗日志状态" style="width:100px">
            <i-option value="0">失败</i-option>
            <i-option value="1">成功</i-option>
            <i-option value="2">待反馈（调试中）</i-option>
            <i-option value="3">异常</i-option>
            <i-option value="4">已处理</i-option>
          </i-select>
          <i-select v-model="Search.courseType" :size="$store.state.searchModuleSize" clearable placeholder="课程类型" style="width:100px">
            <i-option value="0">测评课</i-option>
            <i-option value="1">正式课</i-option>
          </i-select>
          <i-input v-model="Search.leadsParam" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="
学生姓名/手机号"
                   style="width:150px;margin-right: 2px;"></i-input>
          <i-input v-model="Search.teacherParam" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)" placeholder="
老师姓名/手机号" style="width:200px;margin-right:2px;"></i-input>

        </i-col>
        <i-col span="24" class="right">
          <Date-picker type="daterange" :size="$store.state.searchModuleSize" placement="bottom-end" @on-change="changeUpdateDate"
                       placeholder="上课日期" style="width: 200px"></Date-picker>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
      <checkbox label="courseCastType">课耗日志状态</checkbox>
      <checkbox label="castLength">扣除上课时长</checkbox>
      <checkbox label="teacherCheckLength">老师课时审核</checkbox>
      <checkbox label="teacherLength">老师上课时长</checkbox>
      <checkbox label="studentLength">学生上课时长</checkbox>
      <checkbox label="realLength">实际上课时长</checkbox>
      <checkbox label="courseDate">上课日期</checkbox>
      <checkbox label="courseStartTime">上课开始时间</checkbox>
      <checkbox label="courseEndTime">上课结束时间</checkbox>
      <checkbox label="leadsName">学生姓名</checkbox>
      <checkbox label="teacherName">老师姓名</checkbox>
      <checkbox label="teacherPhone">老师手机号</checkbox>
      <checkbox label="courseType">课程类型</checkbox>
      <checkbox label="updateTime">更新时间</checkbox>
    </checkbox-group>
    <i-table size="small" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>

    <edit @reFresh="reFresh" ref="edit"></edit>
    <log @reFresh="reFresh" ref="log"></log>
  </div>

</template>

<script type="text/ecmascript-6">
  import {Course_Cast} from 'common/api/teacher.js';
  import {formateDate, common, hideCharAtNumber} from 'common/js/common.js';
  import edit from 'components/courseCast/edit';
  import log from 'components/courseCast/log';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';
  const $sStorage = $.sessionStorage;

  export default{
    data() {
      return {
        data: [],
        tableColumnsChecked: ['courseCastType', 'castLength', 'teacherCheckLength', 'teacherLength', 'studentLength', 'realLength', 'courseDate', 'courseStartTime', 'courseEndTime', 'leadsName', 'teacherName', 'teacherPhone', 'courseType', 'updateTime'],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        Search: {
          courseCastType: '',
          leadsParam: '',
          teacherParam: '',
          courseStartDate: '',
          courseEndDate: '',
          courseType: '',
        },
        columns: [],
      }
    },
    mounted() {
      this.searchForm();
      this.changeTableColumns();
    },
    methods: {
      getTableColumns () {
        const columns = {
          courseCastType: {
            title: '课耗日志状态',
            key: 'courseCastType',
            width: 90,
            align: 'center',
            render(h, params){
              if (params.row.courseCastType == '成功') {
                return h('div', [
                  h('span', {
                    attrs: {
                      class: 'o-tag green'
                    }
                  }, params.row.courseCastType)
                ])
//            return `<span class="o-tag green">${row.courseCastType}</span>`
              } else if (params.row.courseCastType == '待反馈') {
                return h('div', [
                  h('span', {
                    attrs: {
                      class: 'o-tag grey'
                    }
                  }, params.row.courseCastType)
                ])
//            return `<span class="o-tag grey">${row.courseCastType}</span>`
              } else if (params.row.courseCastType == '异常') {
                return h('div', [
                  h('span', {
                    attrs: {
                      class: 'o-tag yellow'
                    }
                  }, params.row.courseCastType)
                ])
//            return `<span class="o-tag yellow">${row.courseCastType}</span>`
              } else if (params.row.courseCastType == '已处理') {
                return h('div', [
                  h('span', {
                    attrs: {
                      class: 'o-tag blue'
                    }
                  }, params.row.courseCastType)
                ])
//            return `<span class="o-tag blue">${row.courseCastType}</span>`
              } else {
                return h('div', [
                  h('span', {
                    attrs: {
                      class: 'o-tag red'
                    }
                  }, params.row.courseCastType)
                ])
//            return `<!--<span class="o-tag red">${row.courseCastType}</span>-->`
              }
            }
          },
          castLength: {
            title: '扣除上课时长（min）',
            key: 'castLength',
            align: 'center',
            width: 150,
          },
          teacherCheckLength: {
            title: '老师课时审核（min）',
            key: 'teacherCheckLength',
            align: 'center',
            width: 150
          },
          teacherLength: {
            title: '老师上课时长（min）',
            key: 'teacherLength',
            align: 'center',
            width: 150
          },
          studentLength: {
            title: '学生上课时长（min）',
            key: 'studentLength',
            align: 'center',
            width: 150
          },
          realLength: {
            title: '实际上课时长（min）',
            key: 'realLength',
            align: 'center',
            width: 150
          },
          courseDate: {
            title: '上课日期',
            key: 'courseDate',
            align: 'center',
            width: 180,
            render(h, params) {
              return h('span',formateDate(params.row.courseDate, 'yyyy-MM-dd'));
            },
          },
          courseStartTime: {
            title: '上课开始时间',
            key: 'courseStartTime',
            align: 'center',
            width: 120
          },
          courseEndTime: {
            title: '上课结束时间',
            key: 'courseEndTime',
            align: 'center',
            width: 120
          },
          leadsName: {
            title: '学生姓名',
            key: 'leadsName',
            align: 'center',
            width: 120
          },
          teacherName: {
            title: '老师姓名',
            key: 'teacherName',
            align: 'center',
            width: 100
          },
          teacherPhone: {
            title: '老师手机号',
            key: 'teacherPhone',
            align: 'center',
            width: 120
          },
          courseType: {
            title: '课程类型',
            key: 'courseType',
            align: 'center',
            width: 90
          },
          updateTime: {
            title: '更新时间',
            key: 'updateTime',
            align: 'center',
            render(h, params) {
              return h('span',formateDate(params.row.updateTime, 'yyyy-MM-dd hh:mm:ss'));
            },
            width: 180,
          },
          action: {
            title: '操作',
            width: 100,
            align: 'center',
            fixed: 'right',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small',
                    icon: 'edit',
                  },
                  attrs: {
                    title: '编辑'
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.reMaterial(params.row.courseUuid, params.row.realLength, params.row.studentLength, params.row.teacherLength, params.row.castLength, params.row.teacherCheckLength)
                    }
                  }
                }),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    icon: 'eye',
                  },
                  attrs: {
                    title: '查看日志'
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.log(params.row.courseUuid)
                    }
                  }
                })
              ])
//          return `<i-button type="info" size="small" icon="edit" title="编辑" @click="reMaterial('${row.courseUuid}','${row.realLength}','${row.studentLength}','${row.teacherLength}','${row.castLength}','${row.teacherCheckLength}')"></i-button>
//                      <i-button type="success" size="small" icon="eye" title="查看日志" @click="log('${row.courseUuid}')"></i-button>`;
            }
          }
        };
        let datas = [columns.action];
        this.tableColumnsChecked.forEach(col => datas.push(columns[col]));
        return datas;
      },
      reMaterial(uuid, realLength, studentLength, teacherLength, castLength, teacherCheckLength) {
        this.$refs.edit.show(uuid, realLength, studentLength, teacherLength, castLength, teacherCheckLength)
      },
      log(uuid) {
        this.$refs.log.show(uuid);
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          courseCastType: this.Search.courseCastType|| '',
          leadsParam: this.Search.leadsParam|| '',
          teacherParam: this.Search.teacherParam|| '',
          courseStartDate: this.Search.courseStartDate|| '',
          courseType: this.Search.courseType || '',
          courseEndDate: this.Search.courseEndDate|| '',
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?courseCastType=${search.courseCastType}&courseType=${search.courseType}&leadsParam=${search.leadsParam}&teacherParam=${search.teacherParam}&courseStartDate=${search.courseStartDate}&courseEndDate=${search.courseEndDate}`
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        // common.ajax({
        //   url: Course_Cast().getPageWaitCourse + param,
        //   method: 'get',
        //   success: function (res) {
        //     _this.data = res.data['courseCastVos'] || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get(Course_Cast().getPageWaitCourse,{
          params:{
            courseCastType:search.courseCastType,
            courseType:search.courseType,
            leadsParam:search.leadsParam,
            teacherParam:search.teacherParam,
            courseStartDate:search.courseStartDate,
            courseEndDate:search.courseEndDate,
            pageIndex:this.pageIndex,
            pageNumber:this.pageNumber,
            orderBy:orderBy,
            sortBy:sortBy,
          }
        }).then( ({data}) => {
          _this.data = data.data['courseCastVos'] || [];
          _this.total = data.data.total;
        })
      },
      changeUpdateDate(value) {
        this.Search.courseStartDate = value[0] || '';
        this.Search.courseEndDate = value[1] || '';
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
    components: {OBreadcrumb, edit, log ,PageModel}
  };
</script>

<style>
  .ivu-select-dropdown-list {
    text-align: left;
  }
</style>
