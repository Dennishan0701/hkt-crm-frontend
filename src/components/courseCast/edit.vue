<template>
  <Modal
    v-model="modal"
    title="编辑基本资料"
    :closable="false"
    :mask-closable="false"
    :loading = "loading"
    @on-ok="onOk('formValidate')">
    <i-table size="small" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :current="pageIndex" :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>

    <i-form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="170">
      <Form-item label="扣除上课时长（min）：" prop="castLength">
        <i-input v-model="formItem.castLength" placeholder="扣除上课时长" style="width: 300px"></i-input>
      </Form-item>
      <Form-item label="老师上课时长（min）：" prop="teacherLength">
        <i-input v-model="formItem.teacherLength" placeholder="老师上课时长" style="width: 300px"></i-input>
      </Form-item>
      <Form-item label="学生上课时长（min）：" prop="studentLength">
        <i-input v-model="formItem.studentLength" placeholder="学生上课时长" style="width: 300px"></i-input>
      </Form-item>
      <Form-item label="实际上课时长（min）：" prop="realLength">
        <i-input v-model="formItem.realLength" placeholder="实际上课时长" style="width: 300px"></i-input>
      </Form-item>
      <Form-item label="老师课时审核（min）：" prop="teacherCheckLength">
        <i-input v-model="formItem.teacherCheckLength" placeholder="老师课时审核" style="width: 300px"></i-input>
      </Form-item>
    </i-form>
  </Modal>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {Course_Cast} from 'common/api/teacher.js';
  // import {common} from 'common/js/common.js';
  import PageModel from 'dashborader/page/page.vue';
  import {formateDate, common, hideCharAtNumber} from 'common/js/common.js';

  export default{
    data() {
      let qqRemark = (rule, value, callback) => {
        if(value === "") {
          callback(new Error('不能为空，请输入'));
        } else {
          callback();
        }
      };
      return {
        data:[],
        loading: true,
        modal: false,
        teacherUuid: '',
        pageIndex: 1,
        total: 0,
        pageNumber: 3,
        errorTip: '',
        scrollAll: [],
        formItem:{
          uuid: '',
          realLength: '',
          studentLength: '',
          teacherLength: '',
          castLength: '',
          teacherCheckLength: '',
        },
        columns: [
          {
            title: '客户端',
            key: 'systemClient',
            align:'center',
            minWidth:90,
          },
          {
            title: '登录用户名',
            key: 'loginName',
            align:'center',
            minWidth:90,
          },
          {
            title: '用户类型',
            key: 'userType',
            align:'center',
            minWidth:90,
          },
          {
            title: '进出类型',
            key: 'recordType',
            align:'center',
            minWidth:90,
          },
          {
            title: '进入房间时间',
            key: 'enterTime',
            align:'center',
            minWidth:130,
          },
          {
            title: '退出房间时间',
            key: 'leaveTime',
            align:'center',
            minWidth:130,
          },
        ],
        ruleValidate: {
          realLength: [
            {required: true, message: '请填写实际上课时长', trigger: 'blur'}
          ],
          studentLength: [
            {required: true, message: '请填写学生上课时长', trigger: 'blur'}
          ],
          teacherLength: [
            {required: true, message: '请填写老师上课时长', trigger: 'blur'}
          ],
          castLength: [
            {required: true, message: '请填写扣除上课时长', trigger: 'blur'}
          ],
          teacherCheckLength: [
            {required: true, message: '请填写老师课时审核', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      show(uuid,realLength,studentLength,teacherLength,castLength,teacherCheckLength) {
        let _this = this;
        _this.formItem.uuid = uuid;
        _this.formItem.realLength = realLength =='null'?'':realLength;
        _this.formItem.studentLength = studentLength =='null'?'':studentLength;
        _this.formItem.teacherLength = teacherLength =='null'?'':teacherLength;
        _this.formItem.castLength = castLength =='null'?'':castLength;
        _this.formItem.teacherCheckLength = teacherCheckLength =='null'?'':teacherCheckLength;
        this.modal = true;
        this.searchForm();
      },
      onOk(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            // common.ajax({
            //   url: Course_Cast().editCourseLength,
            //   data: {
            //     uuid: _this.formItem.uuid,
            //     realLength: _this.formItem.realLength,
            //     leadsLength: _this.formItem.studentLength,
            //     teacherLength: _this.formItem.teacherLength,
            //     castLength: _this.formItem.castLength,
            //     teacherCheckLength: _this.formItem.teacherCheckLength,
            //   },
            //   success: function(response){
            //     _this.modal = false;
            //     common.notices('操作成功！！');
            //     _this.$emit('reFresh', 'success');
            //   }
            // });
            this.$axios.post(Course_Cast().editCourseLength,{
              uuid: _this.formItem.uuid,
              realLength: _this.formItem.realLength,
              leadsLength: _this.formItem.studentLength,
              teacherLength: _this.formItem.teacherLength,
              castLength: _this.formItem.castLength,
              teacherCheckLength: _this.formItem.teacherCheckLength,
            }).then( () => {
              _this.modal = false;
              common.notices('操作成功！！');
              _this.$emit('reFresh', 'success');
            })
          } else {
            setTimeout(() => {
              this.loading = true;
            }, 0);
          }
        });
      },

      searchForm(){
        let _this = this;
        // common.ajax({
        //   url: Course_Cast().queryCourseLog,
        //   data: {
        //     courseUuid: _this.formItem.uuid,
        //     pageIndex: _this.pageIndex,
        //     pageNumber: _this.pageNumber,
        //   },
        //   success: function(res){
        //     _this.data = res.data['allCourseLogVos']||[];
        //     _this.total = res.data.total
        //   }
        // });
        this.$axios.post(Course_Cast().queryCourseLog,{
          courseUuid: _this.formItem.uuid,
          pageIndex: _this.pageIndex,
          pageNumber: _this.pageNumber,
        }).then( ({data}) => {
          _this.data = data.data['allCourseLogVos']||[];
          _this.total = data.data.total
        })
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
    }
    ,components:{PageModel}
  };
</script>

<style scoped>

.gridPage{
  margin-bottom: 24px;
}

</style>
