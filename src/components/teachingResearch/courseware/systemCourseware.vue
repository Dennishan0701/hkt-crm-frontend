<template>
  <div>
    <o-breadcrumb second="教研" third="系统课件管理"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="4">
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="plus" @click="showAdd">新增课件</i-button>
        </i-col>
        <i-col span="20" class="right">
          <i-input :size="$store.state.searchModuleSize" v-model="Search.coursewareName" @on-keyup.enter="searchForm(1)" placeholder="课件名称" clearable style="width:150px;margin-right:2px;"></i-input>
          <i-select class="" :size="$store.state.searchModuleSize" v-model="Search.grade" multiple clearable @on-change='getSearchVersionList' placeholder="年级(可多选)" style="width:180px;text-align: left">
            <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>

          <i-select :size="$store.state.searchModuleSize" v-model="Search.version" clearable placeholder="版本" style="width:80px">
            <i-option v-for="(item,index) in Search.versionList" :key='index' :value="item.uuid">{{ item.version }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.subject" clearable placeholder="科目" style="width:80px">
            <i-option v-for="(item,index) in subjectList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.courseClasses" clearable placeholder="类别" style="width:80px">
            <i-option value="1">普通</i-option>
            <i-option value="2">精品</i-option>
          </i-select>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" :height="theight" stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :current="pageIndex" :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>

    <Modal
      v-model="modal"
      :mask-closable="false"
      :closable="false"
      :title="modalTitle">
      <i-form ref="formValidateModal" :model="validateItem" :rules="ruleValidate" :label-width="100">
        <Form-item label="课件名称" prop="coursewareName">
          <i-input v-model="validateItem.coursewareName" placeholder="课件名称" style="width: 200px"></i-input>
        </Form-item>
        <Form-item label="科目" prop="subject">
          <i-select v-model="validateItem.subject" clearable placeholder="科目" style="width:80px">
            <i-option v-for="(item,index) in subjectList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
        </Form-item>
        <Form-item label="年级" prop="grade">
          <i-select v-model="validateItem.grade" clearable placeholder="年级" style="width:80px">
            <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
        </Form-item>
        <Form-item label="版本" prop="version">
          <i-select v-model="validateItem.version" clearable placeholder="版本" style="width:80px">
            <i-option v-for="(item,index) in versionList" :key='index' :value="item.uuid">{{ item.version }}</i-option>
          </i-select>
        </Form-item>
        <Form-item label="知识点" prop="courseKnowledgeUuids">
          <Cascader :data="courseKnowledgeData" v-model="validateItem.courseKnowledgeUuids" @on-change="changeCourseKnowledge" :disabled="validateItem.subject ==='' || validateItem.grade === ''" :clearable="false"></Cascader>
        </Form-item>
        <Form-item label="课件类别" prop="courseClasses">
          <Radio-group v-model="validateItem.courseClasses">
            <Radio label="1">普通</Radio>
            <Radio label="2">精品</Radio>
          </Radio-group>
        </Form-item>
        <Form-item :label="uploadFileLabel" prop="coursewareFile">
          <input type="file" id="coursewareFile" @change="checkFile">
          <p v-if="modalTitle === '编辑课件'">原文件：<a href="javascript:;" @click.stop="viewFile">{{validateItem.originalName}}</a></p>
          <Alert show-icon>请上传doc、docx、ppt、pptx、pdf格式的课件，上传后系统会自动转换为PDF格式文件</Alert>
        </Form-item>
        <Form-item label="备注" prop="remark">
          <i-input type="textarea" v-model="validateItem.remark" :maxlength="500" :rows="4" placeholder="口才这么好不说点什么真浪费...，就算你很会写也不能超过500字！"></i-input>
        </Form-item>
      </i-form>
      <div slot="footer" style="text-align: right">
        <i-button type="text" v-show="!loading" @click="modal = false">取消</i-button>
        <i-button type="primary" :loading = "loading" @click="save('formValidateModal')">保存</i-button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {TEACHING_RESEARCH} from 'common/api/teachingResearch.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';
  export default{
    data() {
      let validateCoursewareFile = ((rule, value, callback) => {
        let fileName = document.getElementById('coursewareFile').value;
        let ext = fileName.substr(fileName.lastIndexOf('.') + 1).toLowerCase();
        if(fileName && ['doc','docx','ppt','pptx','pdf'].indexOf(ext) !== -1) {
          callback();
        }else {
          callback(new Error('请上传'+['doc','docx','ppt','pptx','pdf'].join('、')+'格式的课件'));
        }
      });
      return {
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: 15,
        Search: {
          coursewareName: '',
          grade: [],
          versionList: [],
          version: '',
          subject: '',
          courseClasses: '',
          status: '',
          coursewareType: '',
        },
        modal: false,
        loading: false,
        modalTitle: '编辑课件',
        uploadFileLabel: '上传课件',
        versionList: [],
        validateItem: {
          coursewareUuid: '',
          coursewareName: '',
          originalName: '',
          coursewarePreviewUrl: '',
          subject: '',
          grade: '',
          courseKnowledgeUuids: [],
          version: '',
          courseClasses: '1',
          remark: ''
        },
        ruleValidate: {
          coursewareName: [
            {required: true, message: '请填写课件名称', trigger: 'blur'}
          ],
          subject: [
            {required: true, message: '请选择科目', trigger: 'change'}
          ],
          grade: [
            {required: true, message: '请选择年级', trigger: 'change'}
          ],
          version: [
            {required: true, message: '请选择版本', trigger: 'change'}
          ],
          courseKnowledgeUuids: [
            {required: true, type: 'array', message: '请选择知识点', trigger: 'change'}
          ],
          coursewareFile: [
            {required: true, validator: validateCoursewareFile, trigger: 'change'}
          ]
        },
        gradeList: [],
        subjectList: [],
        columns: [
          {
            title: '序号',
            width: 40,
            align: 'center',
            type: 'index'
          },
          {
            title: '课件名称',
            key: 'coursewareName',
            align:'center',
            minWidth:120,
            // render(row) {
            //   return `<a href="javascript:;" @click="down('${row.coursewarePreviewUrl}','${row.coursewareUuid}')"><strong>${row.coursewareName}</strong></a>`;
            // },
            render:(h,params) => {
              return h('div',[
                h('a',{
                  attrs:{
                    href:"javascript:;"
                  },
                  on:{
                    click:() => {
                      this.down(params.row.coursewarePreviewUrl,params.row.coursewareUuid)
                    }
                  }
                },params.row.tcName),
                h('strong',{},params.row.coursewareName)
              ])
            }
          },
          {
            title: '年级',
            key: 'grade',
            align:'center',
            minWidth:90,
          },
          {
            title: '科目',
            key: 'subject',
            align:'center',
            minWidth:90,
          },
          {
            title: '版本',
            key: 'coursewareVersion',
            align:'center',
            minWidth:120,
          },
          {
            title: '课件类别',
            key: 'courseClasses',
            align:'center',
            minWidth:90,
            // render(row) {
            //   if(row.courseClasses === 1) {
            //     return "普通";
            //   } else if(row.courseClasses === 2) {
            //     return "精品";
            //   } else {
            //     return " ";
            //   }
            // },
            render:(h,params)=>{
              if(params.row.courseClasses === 1) {
                return h('div',[
                  h('span',{},"普通")
                ])
              } else if(params.row.courseClasses === 2) {
                return h('div',[
                  h('span',{},"精品")
                ])
              } else {
                return h('div',[
                  h('span',{},"")
                ])
              }
            }
          },
          {
            title: '知识点',
            key: 'courseKnowledgeName',
            align:'center',
            minWidth:120,
          },
          {
            title: '备注',
            key: 'remark',
            align:'center',
            minWidth:180,
            // render(row,column,index){
            //   let params = row.remark||'';
            //   if(params.length >30){
            //     params = params.slice(0,25)
            //     return `<span title=${row.remark}>${params}...</span>`
            //   }else{
            //     return row.remark;
            //   }
            // },
            render:(h,params)=>{
              let val = params.row.remark||'';
              if(val.length >30){
                val = val.slice(0,25)
                return h('div',[
                  h('span',{
                    attrs:{
                      title:params.row.remark
                    }
                  },val)
                ])
              }else{
                return h('div',[
                  h('span',{},params.row.remark)
                ])
              }
            }
          },
          {
            title: '更新时间',
            key: 'updateTime',
          align:'center',
            minWidth:180,
            // render (row, column, index) {
            //   return formateDate(row.updateTime,'yyyy-MM-dd hh:mm:ss');
            // },
            render:(h,params) =>{
              return h('div',[
                h('span',{},formateDate(params.row.updateTime,'yyyy-MM-dd hh:mm:ss'))
              ])
            }
          },
          {
            title: '操作',
            align:'center',
            fixed:'right',
            minWidth:120,
            // render (row, column, index) {
            //   return `<i-button type="error" size="small" @click="del('${row.coursewareUuid}')">删除</i-button>
            //   <i-button type="primary" size="small" @click="edit('${row.coursewareUuid}')">编辑</i-button>`;
            // },
            render : (h, params) => {
              return h('div',[
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    // icon: 'paper-airplane',
                  },
                  attrs: {
                    title: '废除',
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.del(params.row.coursewareUuid);
                    }
                  }
                },'废除'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    // icon: 'paper-airplane',
                  },
                  attrs: {
                    title: '更新',
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.edit(params.row.coursewareUuid);
                    }
                  }
                },'更新'),
              ])
            }

          }
        ]
      }
    },
    mounted() {
      this.searchForm();
      const _this = this;
      $.getJSON("static/data.json", function (json) {
        _this.gradeList = json.gradeList;
        _this.subjectList = json.subjectList;
      });
    },
    methods: {
      down(coursewarePreviewUrl,coursewareUuid){

        common.ajax({
          url: TEACHING_RESEARCH().CourseWare.downloadCourseware,
          data: {
            coursewareUuid: coursewareUuid,
          },
          success: function (res) {
            GLOBAL.newTab(coursewarePreviewUrl);
          },
        });
      },
      getSearchVersionList(value){
        //        获取版本号
        const _this = this;
        common.ajax({
          url: TEACHING_RESEARCH().CourseWare.getCourseVersionByGrades,
          data: {
            grades: value.join(','),
          },
          success: function (res) {
            _this.Search.versionList = res.data['versionList']||[];
          },
        });
      },
      del(coursewareUuid) {
        const _this = this;
        this.$Modal.confirm({
          title: '确认',
          content: '确认删除该课件？',
          onOk: function(){
            common.ajax({
              url: TEACHING_RESEARCH().CourseWare.delete,
              data: {coursewareUuid: coursewareUuid},
              success: function (res) {
                common.notices('操作成功！');
                _this.searchForm();
              }
            })
          }
        });
      },
      edit(coursewareUuid) {
        this.modalTitle = '编辑课件';
        this.modal = true;
        this.uploadFileLabel = '重新上传课件';
        const _this = this;
        common.ajax({
          url: TEACHING_RESEARCH().CourseWare.getCoursewareById,
          data: {coursewareUuid: coursewareUuid},
          isAsync: 'no',
          success: function (res) {
            let data = res.data;
            _this.validateItem.coursewareUuid = data.coursewareUuid || '';
            _this.validateItem.coursewareName = data.coursewareName || '';
            _this.validateItem.subject = data.subject || '';
            _this.validateItem.grade = data.grade || '';
            _this.validateItem.courseClasses = data.courseClasses || '';
            _this.validateItem.remark = data.remark || '';
            _this.validateItem.originalName = data.originalName || '';
            _this.validateItem.coursewarePreviewUrl = data.coursewarePreviewUrl || '';
            _this.validateItem.version = data.courseVersionUuid || '';
            let courseKnowledgeUuids = data.courseKnowledgeUuids;
            if(courseKnowledgeUuids && courseKnowledgeUuids.indexOf(',')!=-1){
              courseKnowledgeUuids = courseKnowledgeUuids.split(',');
            }else{
              courseKnowledgeUuids = [];
            }
            _this.validateItem.courseKnowledgeUuids = courseKnowledgeUuids;
          }
        });
      },
      showAdd() {
        this.modalTitle = '新增课件';
        this.modal = true;
        this.$refs['formValidateModal'].resetFields();
      },
      save(name) {
        this.loading = true;
        const _this = this;
        this.$refs[name].validate((valid) => {
          if(valid) {
            let coursewareFile = document.getElementById('coursewareFile').files[0];

            let formData = new FormData();
            formData.append("token", localStorage.getItem('token'));
            formData.append("coursewareUuid", _this.validateItem.coursewareUuid);
            formData.append("file", coursewareFile);
            formData.append("courseKnowledgeUuids", _this.validateItem.courseKnowledgeUuids.join(','));
            formData.append("coursewareName", _this.validateItem.coursewareName);
            formData.append("subject", _this.validateItem.subject);
            formData.append("grade", _this.validateItem.grade);
            formData.append("courseVersionUuid", _this.validateItem.version);
            formData.append("courseClasses", _this.validateItem.courseClasses);
            formData.append("remark", _this.validateItem.remark);

            let apiUrl = (_this.modalTitle === '新增课件') ? TEACHING_RESEARCH().CourseWare.save : TEACHING_RESEARCH().CourseWare.update;
            $.ajax({
              url: apiUrl,
              type: 'POST',
              data: formData,
              // 告诉jQuery不要去处理发送的数据
              processData: false,
              // 告诉jQuery不要去设置Content-Type请求头
              contentType: false,
              success: function (res) {
                res = JSON.parse(res);
                if (res.code === RES_STATUS_SUCCESS) {
                  common.notices('操作成功！');
                  _this.modal = false;
                  _this.searchForm();
                } else {
                  common.notices(res.msg, '操作失败！！','error');
                }
              },
              complete: function() {
                 _this.loading = false;
              }
            });
          }else{
            this.loading = false;
          }
        });
      },
      viewFile() {
        GLOBAL.newTab(this.validateItem.coursewarePreviewUrl);
      },
      getVersion(grades){
        //        获取版本号
        const _this = this;
        common.ajax({
          url: TEACHING_RESEARCH().CourseWare.getCourseVersionByGrades,
          data: {
            grades: grades,
          },
          success: function (res) {
            _this.versionList = res.data['versionList']||[];
          },
        });
      },
        getCourseKnowledgeData() {
        const _this = this;
          this.getVersion(_this.validateItem.grade)

          let data = [];


        common.ajax({
          url: TEACHING_RESEARCH().CourseWare.getKnowledgesByLevelOne,
          data: {grade: _this.validateItem.grade, subject: _this.validateItem.subject},
          isAsync: 'no',
          success: function (res) {
            data = res.data;
          },
        });
          return data;

        },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          coursewareName: this.Search.coursewareName,
          grades: this.Search.grade,
          subject: this.Search.subject,
          courseClasses: this.Search.courseClasses,
          version: this.Search.version,
          coursewareType:'SYSTEM',
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?coursewareType=${search.coursewareType}&coursewareName=${search.coursewareName}&courseVersionUuid=${search.version}&grades=${search.grades}&subject=${search.subject}&courseClasses=${search.courseClasses}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: TEACHING_RESEARCH().CourseWare.dataGrid + param,
          success: function(response){
            _this.data = response.data.list || [];
            _this.total = response.data.total;
          }
        });
      },
      checkFile() {
        this.$refs['formValidateModal'].validate();
      },
      changeCourseKnowledge(value, selectedData) {
        this.validateItem.courseKnowledgeUuids = value;
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      }
    },
    computed: {
      courseKnowledgeData() {
        if(this.validateItem.subject && this.validateItem.grade) {
          return this.getCourseKnowledgeData();
        }
        return [];
      },
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470: '';
      }
    },
    components: { OBreadcrumb ,PageModel}
  };
</script>

<style rel='stylesheet/less' lang='less' scoped>

</style>
