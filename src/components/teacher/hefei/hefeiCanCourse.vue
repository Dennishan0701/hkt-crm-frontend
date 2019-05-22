<template>
<div>
  <o-breadcrumb second="师资管理" third="合肥-可排课老师"></o-breadcrumb>
  <div class="grid-widget right">
    <Row>
      <i-col span="24" class="right">
        <i-input :size="$store.state.searchModuleSize" v-model="Search.tcName" @on-keyup.enter="searchForm(1)" placeholder="姓名" style="width:90px;margin-right:2px;"></i-input>
        <i-input :size="$store.state.searchModuleSize" v-model="Search.hourlyWage" @on-keyup.enter="searchForm(1)" placeholder="时薪" style="width:90px;margin-right:2px;"></i-input>
        <i-select :size="$store.state.searchModuleSize" v-model="Search.gradePreference" clearable placeholder="年级偏好" style="width:120px">
          <i-option v-for="(item,index) in gradePreferenceList" :key='index' :value="item.value">{{ item.text }}</i-option>
        </i-select>
        <i-select :size="$store.state.searchModuleSize" v-model="Search.teachingSubject" clearable placeholder="第一科目" style="width:90px">
          <i-option v-for="(item,index) in subjectList" :key='index' :value="item.uuid">{{ item.enumName }}</i-option>
        </i-select>
        <i-select :size="$store.state.searchModuleSize" v-model="Search.sex" clearable placeholder="性别" style="width:60px">
          <i-option value="0">男</i-option>
          <i-option value="1">女</i-option>
        </i-select>
        <i-select :size="$store.state.searchModuleSize" v-model="Search.natureOfWork" clearable placeholder="工作性质" style="width:90px">
          <i-option value="1">社招全职</i-option>
          <i-option value="2">兼职</i-option>
          <i-option value="3">校招全职</i-option>
        </i-select>
        <!--<i-select v-model="Search.branch" clearable size="small" placeholder="师训中心" style="width:172px">-->
        <!--<i-option value="1">上海</i-option>-->
        <!--<i-option value="2">合肥</i-option>-->
        <!--</i-select>-->
        <i-select :size="$store.state.searchModuleSize" v-model="Search.schoolLocation" filterable clearable placeholder="院校" style="width:200px">
          <i-option v-for="(item,index) in schoolList" :key='index' :value="item.uuid">{{ item.schoolName }}</i-option>
        </i-select>
        <i-select :size="$store.state.searchModuleSize" v-model="Search.province" @on-change="changeSelectedCity" filterable clearable placeholder="高考所在省" style="width:150px">
          <i-option v-for="(item,index) in provinceList" :key='index' :value="item.areaCode">{{ item.areaName }}</i-option>
        </i-select>
        <i-select :size="$store.state.searchModuleSize" v-model="Search.city" @on-change="changeSelectedArea" clearable placeholder="高考所在市" style="width:100px">
          <i-option v-for="(item,index) in cityArrays" :key='index' :value="item.areaCode">{{ item.areaName }}</i-option>
        </i-select>
        <i-select :size="$store.state.searchModuleSize" v-model="Search.district" clearable placeholder="高考所在区" style="width:100px">
          <i-option v-for="(item,index) in areaList" :key='index' :value="item.areaCode">{{ item.areaName }}</i-option>
        </i-select>
      </i-col>
      <i-col span=24 class="right">
        <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-end" @on-change="changePushDate" placeholder="入库时间" style="width: 200px"></Date-picker>
        <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
      </i-col>
    </Row>
  </div>
  <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
    <checkbox label="phone">手机号</checkbox>
    <checkbox label="wechat">微信号</checkbox>
    <checkbox label="gradePreferenceDesc">年级偏好</checkbox>
    <checkbox label="teachingSubject">第一科目</checkbox>
    <checkbox label="boyOrGirl">性别</checkbox>
    <checkbox label="schoolLocation">院校</checkbox>
    <checkbox label="examLocation">高考所在地</checkbox>
    <checkbox label="interviewRemark">面试评价</checkbox>
    <checkbox label="teacherNotes">监课备注</checkbox>
    <checkbox label="natureOfWorkDesc">工作性质</checkbox>
    <checkbox label="branchDesc">师训中心</checkbox>
    <checkbox label="teachingPreference">授课偏好</checkbox>
    <checkbox label="remark">排课备注</checkbox>
    <checkbox label="inventoryDate">入库时间</checkbox>
    <checkbox label="updateDate">更新时间</checkbox>
    <checkbox label="hourlyWage">时薪</checkbox>
  </checkbox-group>
  <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data" @on-current-change="changeCurrentRow"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>

  <Modal
    v-model="remarkModal"
    :loading = "loading"
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
        tableColumnsChecked:['phone','wechat','gradePreferenceDesc','teachingSubject','boyOrGirl',
          'schoolLocation','examLocation','interviewRemark','teacherNotes','natureOfWorkDesc',
          'branchDesc','teachingPreference','remark','inventoryDate','updateDate','hourlyWage','action'],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11: 17,
        currentRowData: {},
        Search: {
          tcName: '',
          sex: '',
          hourlyWage:'',
          natureOfWork: '',
          branch: '2',
          schoolLocation: '',
          gradePreference: '',
          teachingSubject: '',
          province: '',
          city: '',
          district: '',
          inventoryDateStart: '',
          inventoryDateEnd: '',
        },
        schoolList: [],
        subjectList: [],
        gradePreferenceList: [],
        provinceList: [],
        cityArrays: [],
        areaList: [],
        remarkModal: false,
        loading: true,
        validateRemark: {
          remark: ''
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
        url: TEACHER().Public.getAllSubject,
        method: 'get',
        success: function (res) {
          _this.subjectList = res.data || [];
        }
      });
      $.getJSON("static/data.json", (json) => {
        _this.gradePreferenceList = json.gradePreferenceList;
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
      getTableColumns () {
        const columns = {
          tcName:{
          title: '姓名',
            key: 'tcName',
          width: 90,
          fixed: 'left',
          align:'center',
          // render (row, column, index) {
          //   return `<strong><a href="javascript:;" @click="viewDetail('${row.natureOfWorkDesc}','${row.uuid}')">${row.tcName}</a></strong>`;
          // },
            render:(h,params) => {
              return h('div',[
                h('strong',[
                  h('a',{
                    on:{
                      click:() => {
                        this.viewDetail(params.row.natureOfWorkDesc,params.row.uuid)
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
          align:'center',
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
          wechat:{
          title: '微信号',
            key: 'wechat',
          align:'center',
          width: 100
        },
          gradePreferenceDesc:{
          title: '年级偏好',
            key: 'gradePreferenceDesc',
          align:'center',
          width: 100
        },
          teachingSubject:{
          title: '第一科目',
            key: 'teachingSubject',
          align:'center',
          width: 100
        },
          boyOrGirl:{
          title: '性别',
            key: 'boyOrGirl',
          align:'center',
          width: 50
        },
          schoolLocation: {
          title: '院校',
            key: 'schoolLocation',
          align:'center',
          width: 120
        },
          examLocation:{
          title: '高考所在地',
            key: 'examLocation',
          width: 130,
          align:'center',
          // render(row) {
          //   return row.province || '-' +' '+ row.city || '-' +' '+row.district || '-';
          // },
          render:(h,params) =>{
            return h('div',[
              h('span',{},params.row.province || '-' +' '+ params.row.city || '-' +' '+ params.row.district || '-')
            ])
          }
        },
          interviewRemark:{
          title: '面试评价',
            key: 'interviewRemark',
          align:'center',
          width: 350,
          // render (row,column,index){
          //   let content = row.interviewRemark;
          //   if(content && content.length>40) {
          //     content = content.slice(0,39)+'...';
          //     return `<span title="${row.interviewRemark}">${content}</span>`;
          //   } else {
          //     return content;
          //   }
          // },
          render: (h, params) => {
            let content = params.row.interviewRemark;
            if (content && content.length > 40) {
              content = content.slice(0, 39) + '...';
              return h('div', [
                h('span', {
                  attrs: {
                    title: params.row.interviewRemark
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
          width: 250,
          align:'center',
          // render (row, column, index) {
          //   let content = row.teacherNotes;
          //   if(content && content.length>40) {
          //     content = content.slice(0,39)+'...';
          //     return `<span title="${row.teacherNotes}">${content}</span>`;
          //   } else {
          //     return content;
          //   }
          // },
          render: (h, params) => {
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
        natureOfWorkDesc:{
          title: '工作性质',
            key: 'natureOfWorkDesc',
          align:'center',
          width: 100,
        },
        branchDesc:{
          title: '师训中心',
            key: 'branchDesc',
          align:'center',
          width: 100,
        },
        teachingPreference:{
          title: '授课偏好',
            key: 'teachingPreference',
          align:'center',
          width: 120
        },
        remark:{
          title: '排课备注',
            key: 'remark',
          align:'center',
          width: 250,
          // render (row,column,index){
          //   let content = row.remark;
          //   if(content && content.length>40) {
          //     content = content.slice(0,39)+'...';
          //     return `<span title="${row.remark}">${content}</span>`;
          //   } else {
          //     return content;
          //   }
          // },
          render: (h, params) => {
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
        inventoryDate:{
          title: '入库时间',
            key: 'inventoryDate',
          align:'center',
          width: 180,
          // render (row, column, index) {
          //   return formateDate(row.inventoryDate,'yyyy-MM-dd hh:mm:ss');
          // },
          render:(h,params) =>{
            return h('div',[
              h('span',{},formateDate(params.row.inventoryDate,'yyyy-MM-dd hh:mm:ss'))
            ])
          }
        },
        updateDate:{
          title: '更新时间',
            key: 'updateDate',
          align:'center',
          width: 180,
          // render (row, column, index) {
          //   return formateDate(row.updateDate,'yyyy-MM-dd hh:mm:ss');
          // },
          render:(h,params) =>{
            return h('div',[
              h('span',{},formateDate(params.row.updateDate,'yyyy-MM-dd hh:mm:ss'))
            ])
          }
        },
        hourlyWage:{
          title: '时薪',
            key: 'hourlyWage',
          align:'center',
          width: 100
        },
        action:{
          title: '操作',
          width: 90,
          fixed:'right',
          align:'center',
          // render (row, column, index) {
          //   return `<i-button type="info" icon="ios-chatboxes" title="编辑排课备注" size="small" @click="editRemark('${row.remark}')"></i-button>`;
          // },
          render : (h, params) => {
            return h('div',[
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small',
                  icon: 'ios-chatboxes',
                },
                attrs: {
                  title: '编辑排课备注',
                },
                style: {
                  margin: '2px',
                },
                on: {
                  click: () => {
                    this.editRemark(params.row.remark);
                  }
                }
              })
            ])
          }
        }
        };
        let datas = [columns.tcName];
        this.tableColumnsChecked.forEach(col => datas.push(columns[col]));
        return datas;
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
      editRemark(remark) {
        this.remarkModal = true;
        this.validateRemark.remark = (remark === null || remark === 'null') ? '': remark;
      },
      editRemarkOk(name) {
        const _this = this;
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            common.ajax({
              url: TEACHER().CanCourseTeacher.updateRemark,
              data: {
                uuid: _this.currentRowData.uuid,
                remark: _this.validateRemark.remark
              },
              success: function (response) {
                _this.remarkModal = false;
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
      getFullPhone(teacherUuid) {
        const _this = this;
        common.ajax({
          url: TEACHER().Public.displayPhone,
          method: 'get',
          data: { uuid: teacherUuid, moduleName: '师资管理-可排课老师' },
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
          sex: this.Search.sex,
          natureOfWork: this.Search.natureOfWork,
          branch: this.Search.branch,
          schoolLocation: this.Search.schoolLocation,
          gradePreference: this.Search.gradePreference,
          teachingSubject: this.Search.teachingSubject,
          province: this.Search.province,
          city: this.Search.city,
          district: this.Search.district,
          hourlyWage: this.Search.hourlyWage,
          inventoryDateStart:this.Search.inventoryDateStart,
          inventoryDateEnd:this.Search.inventoryDateEnd
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?tcName=${search.tcName}&branch=${search.branch}&hourlyWage=${search.hourlyWage}&sex=${search.sex}&natureOfWork=${search.natureOfWork}&schoolLocation=${search.schoolLocation}`;
        param += `&gradePreference=${search.gradePreference}&teachingSubject=${search.teachingSubject}`;
        param += `&inventoryDateStart=${search.inventoryDateStart}&inventoryDateEnd=${search.inventoryDateEnd}&province=${search.province}&city=${search.city}&district=${search.district}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: TEACHER().CanCourseTeacher.dataGrid + param,
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
      changeCurrentRow(currentRow, oldCurrentRow) {
        this.currentRowData = currentRow;
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      changePushDate(value) {
        this.Search.inventoryDateStart = value[0] || '';
        this.Search.inventoryDateEnd = value[1] || '';
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
