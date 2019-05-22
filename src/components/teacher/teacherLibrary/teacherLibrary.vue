<template>
<div>
  <o-breadcrumb second="师资管理" third="师资库"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="24" class="right">
        <i-input :size="$store.state.searchModuleSize" v-model="Search.tcName" @on-keyup.enter="searchForm(1)" placeholder="姓名" style="width:150px;margin-right:2px;"></i-input>
        <i-input :size="$store.state.searchModuleSize" v-model="Search.phone" @on-keyup.enter="searchForm(1)" placeholder="手机号" style="width:150px;margin-right: 2px;"></i-input>
        <i-select :size="$store.state.searchModuleSize"  v-model="Search.sex" clearable placeholder="性别" style="width:80px">
          <i-option value="0">男</i-option>
          <i-option value="1">女</i-option>
        </i-select>
        <i-select :size="$store.state.searchModuleSize" v-model="Search.natureOfWork" clearable placeholder="工作性质" style="width:100px">
          <i-option value="1">社招全职</i-option>
          <i-option value="2">兼职</i-option>
          <i-option value="3">校招全职</i-option>
        </i-select>
        <i-select :size="$store.state.searchModuleSize" v-model="Search.branch" clearable placeholder="师训中心" style="width:172px">
          <i-option value="1">上海</i-option>
          <i-option value="2">合肥</i-option>
        </i-select>
        <i-select :size="$store.state.searchModuleSize" v-model="Search.schoolLocation" filterable clearable placeholder="院校" style="width:200px">
          <i-option v-for="(item,index) in schoolList" :key='index' :value="item.uuid">{{ item.schoolName }}</i-option>
        </i-select>
        <i-input :size="$store.state.searchModuleSize" v-model="Search.referral" @on-keyup.enter="searchForm(1)" placeholder="推荐人" style="width:100px;margin-right:2px;"></i-input>
        <i-select :size="$store.state.searchModuleSize" v-model="Search.gradePreference" clearable placeholder="年级偏好" style="width:120px">
          <i-option v-for="(item,index) in gradePreferenceList" :key='index' :value="item.value">{{ item.text }}</i-option>
        </i-select>
        <i-select :size="$store.state.searchModuleSize" v-model="Search.teachingSubject" clearable placeholder="第一科目" style="width:90px">
          <i-option v-for="(item,index) in subjectList" :key='index' :value="item.uuid">{{ item.enumName }}</i-option>
        </i-select>
        <i-select :size="$store.state.searchModuleSize" v-model="Search.province" @on-change="changeSelectedCity" filterable clearable placeholder="高考所在省" style="width:150px">
          <i-option v-for="(item,index) in provinceList" :key='index' :value="item.areaCode">{{ item.areaName }}</i-option>
        </i-select>
        <i-select :size="$store.state.searchModuleSize" v-model="Search.city" @on-change="changeSelectedArea" filterable clearable placeholder="高考所在市" style="width:150px">
          <i-option v-for="(item,index) in cityArrays" :key='index' :value="item.areaCode">{{ item.areaName }}</i-option>
        </i-select>
        <i-select :size="$store.state.searchModuleSize" v-model="Search.district" filterable clearable placeholder="高考所在区" style="width:150px">
          <i-option v-for="(item,index) in areaList" :key='index' :value="item.areaCode">{{ item.areaName }}</i-option>
        </i-select>
        <i-select :size="$store.state.searchModuleSize" v-model="Search.artsOrScience" clearable placeholder="高中文理科" style="width:100px">
          <i-option value="1">文科</i-option>
          <i-option value="2">理科</i-option>
        </i-select>
        <i-select :size="$store.state.searchModuleSize" v-model="Search.teacherStatus" clearable placeholder="排课状态" style="width:100px">
          <i-option value="5">可排课</i-option>
          <i-option value="6">不可排课</i-option>
        </i-select>
      </i-col>
      <i-col span="24" class="right">
        <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-end" @on-change="changePushDate" placeholder="入库时间" style="width: 200px"></Date-picker>
        <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
      </i-col>
    </Row>
  </div>
  <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
    <checkbox label="phone">手机号</checkbox>
    <checkbox label="email">邮箱</checkbox>
    <checkbox label="schoolLocation">院校</checkbox>
    <checkbox label="qq">QQ</checkbox>
    <checkbox label="natureOfWorkDesc">工作性质</checkbox>
    <checkbox label="referral">推荐人</checkbox>
    <checkbox label="teachingSubject">第一科目</checkbox>
    <checkbox label="courseStatus">排课状态</checkbox>
    <checkbox label="branchDesc">师训中心</checkbox>
    <checkbox label="remark">排课备注</checkbox>
    <checkbox label="teacherNotes">监课备注</checkbox>
    <checkbox label="createDate">入库时间</checkbox>
    <checkbox label="updateDate">更新时间</checkbox>
  </checkbox-group>
  <!--<i-table size="small" :height="theight" stripe :columns="columns" :data="data" @on-current-change="changeCurrentRow"></i-table>-->
  <i-table size="small" highlight-row :height="theight" stripe :columns="columns" :data="data" @on-current-change="changeCurrentRow"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>

  <Modal
    v-model="courseStatusModal"
    :loading = "loading"
    :title="currentRowData.teacherStatus == 5 ? '停止排课': '恢复排课'"
    @on-ok="updateCourseStatusOk('formValidateCourseStatus')">
    <i-form ref="formValidateCourseStatus" :model="validateStatus" :rules="ruleValidateStatus" :label-width="80">
      <Form-item>
        <h2 style="color: red;">姓名：{{currentRowData.tcName}}</h2>
      </Form-item>
      <Form-item label="排课备注" prop="remark">
        <i-input type="textarea" v-model="validateStatus.remark" :rows="4" :maxlength="500" placeholder="不要超过500字"></i-input>
      </Form-item>
    </i-form>
  </Modal>
  <Modal
    v-model="editRemarkModal"
    :loading = "editRemarkModalLoading"
    title="编辑排课备注"
    @on-ok="editRemarkOk('formValidateRemark')">
    <i-form ref="formValidateRemark" :model="validateRemark" :rules="ruleValidateRemark" :label-width="80">
      <Form-item label="姓名">
        {{currentRowData.tcName}}
      </Form-item>
      <Form-item label="排课状态">
        {{currentRowData.teacherStatus == 5 ? '可排课': '不可排课'}}
      </Form-item>
      <Form-item label="排课备注" prop="remark">
        <i-input type="textarea" v-model="validateRemark.remark" :rows="4" :maxlength="500" placeholder="不要超过500字"></i-input>
      </Form-item>
    </i-form>
  </Modal>
  <Modal
    v-model="leaveRemarkModal"
    :loading = "leaveRemarkModalLoading"
    title="离职备注"
    @on-ok="leaveRemarkOk('formValidateLeave')">
    <i-form ref="formValidateLeave" :model="validateLeave" :rules="ruleValidateLeave" :label-width="80">
      <Form-item label="离职备注" prop="remark">
        <i-input type="textarea" v-model="validateLeave.remark" :rows="4" :maxlength="500" placeholder="不要超过500字"></i-input>
      </Form-item>
    </i-form>
  </Modal>
</div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {TEACHER} from 'common/api/teacher.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';
  export default{
    data() {
      return {
        data: [],
        tableColumnsChecked:['phone','email','schoolLocation','qq','natureOfWorkDesc',
          'referral','teachingSubject','courseStatus','branchDesc','remark',
          'teacherNotes','createDate','updateDate','action'],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11: 17,
        currentRowData: {},
        Search: {
          tcName: '',
          phone: '',
          sex: '',
          natureOfWork: '',
          branch: '',
          schoolLocation: '',
          referral: '',
          createDateStart: '',
          createDateEnd: '',
          gradePreference: '',
          teachingSubject: '',
          province: '',
          city: '',
          district: '',
          artsOrScience: '',
          teacherStatus: '',
        },
        schoolList: [],
        subjectList: [],
        provinceList: [],
        cityArrays: [],
        areaList: [],
        gradePreferenceList: [],
        courseStatusModal: false,
        editRemarkModal: false,
        leaveRemarkModal: false,
        loading: true,
        editRemarkModalLoading: true,
        leaveRemarkModalLoading: true,
        validateStatus: {
          remark: ''
        },
        validateRemark: {
          remark: ''
        },
        validateLeave: {
          uuid: '',
          payGrade: '',
          tcName: '',
          remark: '',
        },
        ruleValidateLeave: {
          remark: [
            {required: true, message: '请填写内容', trigger: 'blur'}
          ]
        },
        ruleValidateStatus: {
          remark: [
            {required: true, message: '请填写内容', trigger: 'blur'}
          ]
        },
        ruleValidateRemark: {
          remark: [
            {required: true, message: '请填写内容', trigger: 'blur'}
          ]
        },
        columns: []
      }
    },
    mounted() {
      this.searchForm();
      this.changeTableColumns();
      const _this = this;
      common.ajax({
        url: COMMON_API().allSchool,
        method: 'get',
        success: function (response) {
          _this.schoolList = response.data;
        }
      });
      common.ajax({//获取省
        url: COMMON_API().ssqAreaAll,
        method: 'get',
        data: {parentCode: 0},
        success: function (response) {
          _this.provinceList = response.data;
        }
      });
      common.ajax({
        url: TEACHER().Public.getAllSubject,
        method: 'get',
        success: function (res) {
          _this.subjectList = res.data;
        }
      });
      $.getJSON("static/data.json", (json) => {
        _this.gradePreferenceList = json.gradePreferenceList;
      });
    },
    methods: {
      getTableColumns () {
        const columns = {
          tcName:{
            title: '姓名',
            key: 'tcName',
            width: 90,
            fixed: 'left',
            align: 'center',
            // render (row, column, index) {
            //   return `<strong><a href="javascript:;" @click="viewDetail('${row.natureOfWorkDesc}','${row.uuid}')">${row.tcName}</a></strong>`;
            // },
            render:(h,params) => {
              return h('div',[
                h('strong',[
                  h('a',{
                    on:{
                      click:() => {
                        this.viewDetail(params.row.natureOfWorkDesc,params.row.uuid);
                      }
                    }
                  },params.row.tcName)
                ])
              ])
            }
          },
          phone:{
            title: '手机号',
            key: 'phone',
            width: 120,
            align: 'center',
            // render (row, column, index) {
            //   return hideCharAtNumber(row.phone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.uuid}')" class="eye" title="显示全部"></Icon>`;
            // },
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
                        this.getFullPhone(params.row.uuid)
                      }
                    }
                  })
                ])
              }else{
                return '-';
              }
            }
          },
          email:{
            title: '邮箱',
            key: 'email',
            align: 'center',
            width: 180
          },
          schoolLocation:{
            title: '院校',
            key: 'schoolLocation',
            align: 'center',
            width: 120
          },
          qq:{
            title: 'QQ',
            key: 'qq',
            align: 'center',
            width: 120
          },
          natureOfWorkDesc:{
            title: '工作性质',
            key: 'natureOfWorkDesc',
            align: 'center',
            width: 100,
          },
          referral:{
            title: '推荐人',
            key: 'referral',
            align: 'center',
            width: 100,
          },
          teachingSubject:{
            title: '第一科目',
            key: 'teachingSubject',
            align: 'center',
            width: 100
          },
          courseStatus:{
            title: '排课状态',
            key: 'courseStatus',
            align: 'center',
            width: 100
          },
          branchDesc:{
            title: '师训中心',
            key: 'branchDesc',
            align: 'center',
            width: 100
          },
          remark:{
            title: '排课备注',
            align: 'center',
            key: 'remark',
            width: 250,
            // render (row, column, index) {
            //   let content = row.remark;
            //   if (content && content.length > 40) {
            //     content = content.slice(0, 39) + '...';
            //     return `<span title="${row.remark}">${content}</span>`;
            //   } else {
            //     return content;
            //   }
            // },
            render: (h,params) => {
              let content = params.row.remark;
              if (content && content.length > 40) {
                content = content.slice(0, 39) + '...';
                return h('div', [
                  h('span', {
                    attrs: {
                      title: params.row.remark
                    },
                    style: {
                      margin: '2px',
                    },
                  }, content)
                ])
              } else {
                return h('div', [
                  h('span', {
                    style: {
                      margin: '2px',
                    },
                  }, content)
                ])
              }
            }
          },
          teacherNotes:{
            title: '监课备注',
            key: 'teacherNotes',
            align: 'center',
            width: 250,
            // render (row, column, index) {
            //   let content = row.teacherNotes;
            //   if (content && content.length > 40) {
            //     content = content.slice(0, 39) + '...';
            //     return `<span title="${row.teacherNotes}">${content}</span>`;
            //   } else {
            //     return content;
            //   }
            // },
            render: (h,params) => {
              let content = params.row.teacherNotes;
              if (content && content.length > 40) {
                content = content.slice(0, 39) + '...';
                return h('div', [
                  h('span', {
                    attrs: {
                      title: params.row.teacherNotes
                    },
                    style: {
                      margin: '2px',
                    },
                  }, content)
                ])
              } else {
                return h('div', [
                  h('span', {
                    style: {
                      margin: '2px',
                    },
                  }, content)
                ])
              }
            }
          },
          createDate:{
            title: '入库时间',
            key: 'createDate',
            align: 'center',
            width: 180,
            // render (row, column, index) {
            //   return formateDate(row.createDate, 'yyyy-MM-dd hh:mm:ss');
            // },
            render:(h,params) =>{
              return h('div',[
                h('span',{},formateDate(params.row.createDate,'yyyy-MM-dd hh:mm:ss'))
              ])
            }
          },
          updateDate:{
            title: '更新时间',
            key: 'updateDate',
            align: 'center',
            width: 180,
            // render (row, column, index) {
            //   return formateDate(row.updateDate, 'yyyy-MM-dd hh:mm:ss');
            // },
            render:(h,params) =>{
              return h('div',[
                h('span',{},formateDate(params.row.updateDate,'yyyy-MM-dd hh:mm:ss'))
              ])
            }
          },
          action:{
            title: '操作',
            width: 160,
            align: 'center',
            fixed: 'right',
            // render (row, column, index) {
            //   if (row.teacherStatus == 5) {//可排课
            //     return `<i-button type="error" size="small" icon="pause" title="停止排课" @click="courseStatusModal = true"></i-button>
            //     <i-button type="info" size="small" icon="compose" title="编辑排课备注" @click="editRemark"></i-button>
            //     <i-button type="primary" size="small" icon="edit" title="编辑老师详情" @click="editTeacherDetail('${row.natureOfWorkDesc}','${row.uuid}','${row.id}')"></i-button>
            //     <i-button type="success" size="small" icon="ios-eye" title="查看课程" @click="viewCourseCr('${row.uuid}','${row.tcName}')"></i-button>
            //     <i-button type="error" size="small" icon="android-remove-circle" title="老师离职" @click="del('${row.uuid}','${row.payGrade}','${row.tcName}')"></i-button>`;
            //   } else if(row.teacherStatus == 6){//不可排课
            //     return `<i-button type="success" size="small" icon="play" title="恢复排课" @click="courseStatusModal = true"></i-button>
            //     <i-button type="info" size="small" icon="compose" title="编辑排课备注" @click="editRemark"></i-button>
            //     <i-button type="primary" size="small" icon="edit" title="编辑老师详情" @click="editTeacherDetail('${row.natureOfWorkDesc}','${row.uuid}','${row.id}')"></i-button>
            //     <i-button type="success" size="small" icon="ios-eye" title="查看课程" @click="viewCourseCr('${row.uuid}','${row.tcName}')"></i-button>
            //     <i-button type="error" size="small" icon="android-remove-circle" title="老师离职" @click="del('${row.uuid}','${row.payGrade}','${row.tcName}')"></i-button>`;
            //   }
            // },
            render : (h, params) => {
              if (params.row.teacherStatus == 5) {//可排课
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small',
                      icon: 'pause',
                    },
                    attrs: {
                      title: '停止排课',
                    },
                    style: {
                      margin: '2px',
                    },
                    on: {
                      click: () => {
                        this.courseStatusModal= true;
                      }
                    }
                  }),
                  h('Button', {
                    props: {
                      type: 'info',
                      size: 'small',
                      icon: 'compose',
                    },
                    attrs: {
                      title: '编辑排课备注',
                    },
                    style: {
                      margin: '2px',
                    },
                    on: {
                      click: () => {
                        this.editRemark();
                      }
                    }
                  }),
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                      icon: 'edit',
                    },
                    attrs: {
                      title: '编辑老师详情',
                    },
                    style: {
                      margin: '2px',
                    },
                    on: {
                      click: () => {
                        this.editTeacherDetail(params.row.natureOfWorkDesc,params.row.uuid,params.row.id);
                      }
                    }
                  }),
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small',
                      icon: 'ios-eye',
                    },
                    attrs: {
                      title: '查看课程',
                    },
                    style: {
                      margin: '2px',
                    },
                    on: {
                      click: () => {
                        this.viewCourseCr(params.row.uuid,params.row.tcName);
                      }
                    }
                  }),
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small',
                      icon: 'android-remove-circle',
                    },
                    attrs: {
                      title: '老师离职',
                    },
                    style: {
                      margin: '2px',
                    },
                    on: {
                      click: () => {
                        this.del(params.row.uuid,params.row.payGrade,params.row.tcName);
                      }
                    }
                  }),
                ])
              } else if (params.row.teacherStatus == 6) {//不可排课
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small',
                      icon: 'play',
                    },
                    attrs: {
                      title: '恢复排课',
                    },
                    style: {
                      margin: '2px',
                    },
                    on: {
                      click: () => {
                        this.courseStatusModal = true;
                      }
                    }
                  }),
                  h('Button', {
                    props: {
                      type: 'info',
                      size: 'small',
                      icon: 'compose',
                    },
                    attrs: {
                      title: '编辑排课备注',
                    },
                    style: {
                      margin: '2px',
                    },
                    on: {
                      click: () => {
                        this.editRemark();
                      }
                    }
                  }),
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                      icon: 'edit',
                    },
                    attrs: {
                      title: '编辑老师详情',
                    },
                    style: {
                      margin: '2px',
                    },
                    on: {
                      click: () => {
                        this.editTeacherDetail(params.row.natureOfWorkDesc,params.row.uuid,params.row.id);
                      }
                    }
                  }),
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small',
                      icon: 'ios-eye',
                    },
                    attrs: {
                      title: '查看课程',
                    },
                    style: {
                      margin: '2px',
                    },
                    on: {
                      click: () => {
                        this.viewCourseCr(params.row.uuid,params.row.tcName);
                      }
                    }
                  }),
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small',
                      icon: 'android-remove-circle',
                    },
                    attrs: {
                      title: '老师离职',
                    },
                    style: {
                      margin: '2px',
                    },
                    on: {
                      click: () => {
                        this.del(params.row.uuid,params.row.payGrade,params.row.tcName);
                      }
                    }
                  }),
                ])
              }
            }

          }
        };
        let datas = [columns.tcName];
        this.tableColumnsChecked.forEach(col => datas.push(columns[col]));
        return datas;
      },
//      离职备注
//      离职备注
      leaveRemarkOk(name) {
        const _this = this;
        this.leaveRemarkModalLoading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            common.ajax({
              url: TEACHER().Library.teacherLeave,
              data: {
                uuid: _this.validateLeave.uuid,
                payGrade: _this.validateLeave.payGrade,
                name: _this.validateLeave.tcName,
                remark: _this.validateLeave.remark,
              },
              success: function (response) {
                _this.leaveRemarkModal = false;
                common.notices('您可以到【离职库】中查看', '操作成功');
                _this.searchForm();
              }
            });
          } else {
            setTimeout(() => {
              this.leaveRemarkModalLoading = true;
            }, 0);
          }
        });
      },
      del(uuid, payGrade, tcName) {
        this.validateLeave={
          uuid: uuid,
          payGrade: payGrade=='null'?0:payGrade,
          tcName: tcName,
          remark: '',
        }
        this.leaveRemarkModal = true;
//        this.$Modal.confirm({
//          title: '确认',
//          content: `您确认将<span style="color: red;">【${tcName}】</span>离职嘛？`,
//          onOk() {
//            common.ajax({
//              url: TEACHER().Library.teacherLeave,
//              method: 'post',
//              data: {
//              },
//              success: function (response) {
//              }
//            });
//          }
//        });
      },
      viewDetail(natureOfWorkDesc, uuid) {
        if(natureOfWorkDesc && natureOfWorkDesc.indexOf('兼职') !== -1) {
          GLOBAL.redirectTo('/teacher/viewTeacherDetailByJianzhi',uuid);
        }else if(natureOfWorkDesc && natureOfWorkDesc.indexOf('全职') !== -1) {
          GLOBAL.redirectTo('/teacher/viewTeacherDetailByQuanzhi',uuid);
        }else{
          common.msg('工作性质为空，无法查看详情');
        }
      },
      updateCourseStatusOk(name) {
        const _this = this;
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            common.ajax({
              url: TEACHER().Library.updateCourseStatus,
              data: {
                uuid: _this.currentRowData.uuid,
                remark: _this.validateStatus.remark,
                teacherStatus: this.currentRowData.teacherStatus == 5 ? 6: 5
              },
              success: function (response) {
                _this.courseStatusModal = false;
                common.notices('操作成功！！');
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
      editRemark() {
        this.editRemarkModal = true;
        this.validateRemark.remark = this.currentRowData.remark;
      },
      editTeacherDetail(natureOfWorkDesc, uuid, id) {
        sessionStorage.setItem('template_uuid',uuid);
        sessionStorage.setItem('template_id',id);
        if(natureOfWorkDesc.indexOf('兼职') !== -1) {
          location.hash = '/teacher/teacherDetailByJianzhi';
        }else if(natureOfWorkDesc.indexOf('全职') !== -1) {
          location.hash = '/teacher/teacherDetailByQuanzhi/library';
        }else{
          common.msg('工作性质为空，无法编辑');
        }
      },
      editRemarkOk(name) {
        const _this = this;
        this.editRemarkModalLoading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            common.ajax({
              url: TEACHER().Library.updateRemark,
              data: {
                uuid: _this.currentRowData.uuid,
                remark: _this.validateRemark.remark
              },
              success: function (response) {
                _this.editRemarkModal = false;
                common.notices('操作成功！！');
                _this.searchForm();
              }
            });
          } else {
            setTimeout(() => {
              this.editRemarkModalLoading = true;
            }, 0);
          }
        });
      },
      getFullPhone(teacherUuid) {
        const _this = this;
        common.ajax({
          url: TEACHER().Public.displayPhone,
          method: 'get',
          data: { uuid: teacherUuid, moduleName: '师资管理-讲师库' },
          success: function (res) {
            _this.$Modal.info({
              content: (res.data !== null) ? res.data.phone : ''
            });
          }
        })
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          tcName: this.Search.tcName,
          phone: this.Search.phone,
          sex: this.Search.sex,
          natureOfWork: this.Search.natureOfWork,
          branch: this.Search.branch,
          schoolLocation: this.Search.schoolLocation,
          referral: this.Search.referral,
          createDateStart: this.Search.createDateStart,
          createDateEnd: this.Search.createDateEnd,
          gradePreference: this.Search.gradePreference,
          teachingSubject: this.Search.teachingSubject,
          province: this.Search.province,
          city: this.Search.city,
          district: this.Search.district,
          artsOrScience: this.Search.artsOrScience,
          teacherStatus: this.Search.teacherStatus
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?tcName=${search.tcName}&branch=${search.branch}&phone=${search.phone}&sex=${search.sex}&natureOfWork=${search.natureOfWork}&schoolLocation=${search.schoolLocation}`;
        param += `&referral=${search.referral}&createDateStart=${search.createDateStart}&createDateEnd=${search.createDateEnd}&gradePreference=${search.gradePreference}&teachingSubject=${search.teachingSubject}`;
        param += `&province=${search.province}&city=${search.city}&district=${search.district}&artsOrScience=${search.artsOrScience}&teacherStatus=${search.teacherStatus}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: TEACHER().Library.dataGrid + param,
          method: 'get',
          success: function(response){
            _this.data = response.data.teacherList || [];
            _this.total = response.data.total;
          }
        });
      },
      changeSelectedCity(areaName) {
        const _this = this;
        //获取城市
        common.ajax({
          url: COMMON_API().ssqAreaAll,
          method: 'get',
          data: {parentCode: areaName},
          success: function (response) {
            _this.cityArrays = response.data;
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
            _this.areaList = response.data;
          }
        });
      },
      viewCourseCr(uuid,name) {
        sessionStorage.setItem('template_Schedule', uuid);
        sessionStorage.setItem('template_teacherName', name);
        location.hash = '/teacher/teacherSchedule';
      },
      changeCurrentRow(currentRow, oldCurrentRow) {
        this.currentRowData = currentRow;
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      changePushDate(value) {
        this.Search.createDateStart = value[0] || '';
        this.Search.createDateEnd = value[1] || '';
      },
      changeTableColumns () {
        this.columns = this.getTableColumns();
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
