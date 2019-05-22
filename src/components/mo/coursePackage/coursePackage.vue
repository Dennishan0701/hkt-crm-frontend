<template>
<div>
  <o-breadcrumb second="市场与运营" third="课程包管理"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="6">
        <i-button type="primary" :size="$store.state.searchModuleSize" @click="addModal = true">新增课程包</i-button>
      </i-col>
      <i-col span="18" class="right">
        <form id="searchForm">
          <i-select v-model="Search.type" :size="$store.state.searchModuleSize" style="width:200px">
            <i-option v-for="(item,index) in coursePriceTypeList" :key='index' :value="item.value">{{item.value}}</i-option>
          </i-select>
          <i-select v-model="Search.level" :size="$store.state.searchModuleSize" clearable placeholder="课时级别" style="width:100px">
            <i-option value="0">普通</i-option>
            <i-option value="1">清北</i-option>
            <i-option value="2">明星</i-option>
          </i-select>
          <i-select v-model="Search.status" :size="$store.state.searchModuleSize" clearable placeholder="状态" style="width:100px">
            <i-option value="0">未发布</i-option>
            <i-option value="1">已上线</i-option>
            <i-option value="2">已下线</i-option>
          </i-select>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索</i-button>
        </form>
      </i-col>
    </Row>
  </div>
  <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
    <checkbox label="level">课时级别</checkbox>
    <checkbox label="length">课时数</checkbox>
    <checkbox label="originalUnitPrice">原单价</checkbox>
    <checkbox label="originalPrice">原价</checkbox>
    <checkbox label="nowUnitPrice">现单价</checkbox>
    <checkbox label="nowPrice">现价</checkbox>
    <checkbox label="activityType">课时包活动类别</checkbox>
    <checkbox label="updateDate">更新时间</checkbox>
    <checkbox label="createDate">创建时间</checkbox>
    <checkbox label="onlineStatus">状态</checkbox>
  </checkbox-group>
  <i-table size="default" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>

  <Modal
    v-model="addModal"
    title="新增课程包"
    :loading="loading"
    :mask-closable="false"
    :closable="false">
    <i-form ref="formValidate" :model="addFormItem" :rules="formItemValidate" :label-width="80">
      <Form-item label="课程包类别" prop="type">
        <i-select v-model="addFormItem.type" @on-change="changeCoursePriceTypeForAdd" style="width:200px">
          <i-option v-for="(item,index) in coursePriceTypeList" :key='index' :value="item.value">{{item.value}}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="课时级别" prop="level">
        <Radio-group v-model="addFormItem.level" placeholder="课时级别" style="width:200px;">
          <Radio label="0">普通</Radio>
          <Radio label="1">清北</Radio>
          <Radio label="2">明星</Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="课时数" prop="length">
        <Input-number :min="1" v-model="addFormItem.length" placeholder="请填写数字（小时）" ></Input-number> h
      </Form-item>
      <Form-item label="原单价" prop="originalUnitPrice">
        <Input-number :min="1" v-model="addFormItem.originalUnitPrice" placeholder="请填写数字（元）" ></Input-number> 元
      </Form-item>
      <Form-item label="现单价" prop="nowUnitPrice">
        <Input-number :min="1" v-model="addFormItem.nowUnitPrice" placeholder="请填写数字（元）" ></Input-number> 元
      </Form-item>
    </i-form>
    <div slot="footer" style="text-align: center">
      <i-button type="ghost" @click="addModal = false">取消</i-button>
      <i-button type="primary" @click="addSave('formValidate','save')">保存草稿</i-button>
      <i-button type="success" @click="addSave('formValidate','online')">保存并上线</i-button>
    </div>
  </Modal>
  <Modal
    v-model="editModal"
    title="编辑课程包"
    :loading="loadingEdit"
    :mask-closable="false"
    :closable="false">
    <i-form ref="formValidateEdit" :model="formItem" :rules="formItemValidate" :label-width="80">
      <Form-item label="课程包类别" prop="type">
        <i-select v-model="formItem.type" @on-change="changeCoursePriceType" style="width:200px">
          <i-option v-for="(item,index) in coursePriceTypeList" :key='index' :value="item.value">{{item.value}}</i-option>
        </i-select>
      </Form-item>
      <Form-item label="课时级别" prop="level">
        <Radio-group v-model="formItem.level" placeholder="课时级别" style="width:200px;">
          <Radio label="0">普通</Radio>
          <Radio label="1">清北</Radio>
          <Radio label="2">明星</Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="课时数" prop="length">
        <Input-number :min="1" v-model="formItem.length" placeholder="请填写数字（小时）" ></Input-number> h
      </Form-item>
      <Form-item label="原单价" prop="originalUnitPrice">
        <Input-number :min="1" v-model="formItem.originalUnitPrice" placeholder="请填写数字（元）" ></Input-number> 元
      </Form-item>
      <Form-item label="现单价" prop="nowUnitPrice">
        <Input-number :min="1" v-model="formItem.nowUnitPrice" placeholder="请填写数字（元）" ></Input-number> 元
      </Form-item>
    </i-form>
    <div slot="footer" style="text-align: center">
      <i-button type="ghost" @click="editModal = false">取消</i-button>
      <i-button type="primary" @click="editSave('formValidateEdit','save')">保存草稿</i-button>
      <i-button type="success" @click="editSave('formValidateEdit','online')">保存并上线</i-button>
    </div>
  </Modal>
</div>
</template>

<script type="text/ecmascript-6">
  import {MO} from 'common/api/mo.js';
  import {formateDate,common} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        tableColumnsChecked:['level','length','originalUnitPrice','originalPrice','nowUnitPrice',
          'nowPrice','activityType','updateDate','createDate','onlineStatus','coursePriceUuid'],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        coursePriceUuid: '',
        Search: {
          type: '',
          level: '',
          status: ''
        },
        addFormItem: {
          type: '小学',
          level: 0,
          length:  1,
          originalUnitPrice: 1,
          nowUnitPrice: 1
        },
        formItem: {
          type: '小学',
          level: 0,
          length:  1,
          originalUnitPrice: 1,
          nowUnitPrice: 1
        },
        coursePriceTypeList: [],
        formItemValidate: {
          length: [
            { required: true, type: "number", message: '不能为空，请填写数字', trigger: 'blur' }
          ],
          originalUnitPrice: [
            { required: true, type: "number", message: '不能为空，请填写数字', trigger: 'blur' }
          ],
          nowUnitPrice: [
            { required: true, type: "number", message: '不能为空，请填写数字', trigger: 'blur' }
          ]
        },
        loading: true,
        loadingEdit: true,
        addModal: false,
        editModal: false,
        columns: []
      }
    },
    mounted() {
      this.searchForm();
      this.changeTableColumns();
      const _this = this;
      $.getJSON("static/data.json", function (json) {
        _this.coursePriceTypeList = json.coursePriceTypeList;//购买课时包
      });
    },
    methods: {
      getTableColumns () {
        const columns = {
          type:{
          title: '课程包类别',
            key: 'type',
          align:'center',
          width:90,
          fixed:'left'
        },
          level:{
          title: '课时级别',
            key: 'level',
          width:90,
          align:'center'
        },
          length:{
          title: '课时数',
            key: 'length',
          width:90,
          align:'center'
        },
          originalUnitPrice:{
          title: '原单价',
            key: 'originalUnitPrice',
          width:90,
          align:'center'
        },
          originalPrice:{
          title: '原价',
            key: 'originalPrice',
          width:90,
          align:'center'
        },
          nowUnitPrice:{
          title: '现单价',
            width:90,
          key: 'nowUnitPrice',
          align:'center'
        },
          nowPrice:{
          title: '现价',
            key: 'nowPrice',
          width:90,
          align:'center'
        },
          activityType:{
          title: '课时包活动类别',
            key: 'activityType',
          width:120,
          align:'center'
        },
          updateDate:{
          title: '更新时间',
            key: 'updateDate',
          align:'center',
          width:180,
            render(h, params) {
          return h('span',formateDate(params.row.updateDate,'yyyy-MM-dd hh:mm:ss'));
        }
        },
          createDate:{
          title: '创建时间',
            key: 'createDate',
          align:'center',
          width:180,
            render(h, params) {
          return h('span',formateDate(params.row.createDate,'yyyy-MM-dd hh:mm:ss'));
        }
        },
          onlineStatus:{
          title: '状态',
            key: 'onlineStatus',
          align:'center',
          width:90,
            render : (h, params) => {
          if(params.row.onlineStatus == 0) {
            return h('div',[
              h('span',{
                attrs:{
                  class:'o-tag yellow'
                }
              },'未发布')
            ])
//            return '<span class="o-tag yellow">未发布</span>';
          } else if(params.row.onlineStatus == 1) {
          return h('div',[
            h('span',{
              attrs:{
                class:'o-tag green'
              }
            },'已上线')
          ])
//            return '<span class="o-tag green">已上线</span>';
          }  else if(params.row.onlineStatus == 2) {
          return h('div',[
            h('span',{
              attrs:{
                class:'o-tag black'
              }
            },'已下线')
          ])
//            return '<span class="o-tag black">已下线</span>';
          } else {
            return params.row.onlineStatus;
          }
        }
        },
          coursePriceUuid:{
          title: '操作',
            key:'coursePriceUuid',
          align: 'center',
          width:90,
          fixed:'right',
              render : (h, params) => {
          if(params.row.onlineStatus == 0) {

            return h('div',[
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                },
                style: {
                  margin: '2px',
                },
                on: {
                  click: () => {
                  this.editShow(params.row.coursePriceUuid)
              }
          }
          },'编辑'),
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                },
                style: {
                  margin: '2px',
                },
                on: {
                  click: () => {
                  this.online(params.row.coursePriceUuid)
              }
          }
          },'上线')
          ])



//            return `<i-button type="primary" size="small" @click="editShow('${row.coursePriceUuid}')">编辑</i-button>
//                  <i-button type="success" size="small" @click="online('${row.coursePriceUuid}')">上线</i-button>`;
          } else if(params.row.onlineStatus == 1) {

            return h('div',[
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                },
                style: {
                  margin: '2px',
                },
                on: {
                  click: () => {
                  this.offline(params.row.coursePriceUuid)
              }
          }
          },'下线')
          ])
//            return `<i-button type="error" size="small" @click="offline('${row.coursePriceUuid}')">下线</i-button>`;
          } else if(params.row.onlineStatus == 2) {

            return h('div',[
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                },
                style: {
                  margin: '2px',
                },
                on: {
                  click: () => {
                  this.online(params.row.coursePriceUuid)
              }
          }
          },'上线')
          ])
//            return `<i-button type="success" size="small" @click="online('${row.coursePriceUuid}')">上线</i-button>`;
          }
        }
        },
        };
        let datas = [columns.type];
        this.tableColumnsChecked.forEach(col => datas.push(columns[col]));
        return datas;
      },

      editShow(coursePriceUuid) {
        this.coursePriceUuid = coursePriceUuid;
        this.editModal = true;
        const _this = this;
        common.ajax({
          url: MO().CoursePackage.getByUuid,
          method: 'get',
          data: { coursePriceUuid:　coursePriceUuid },
          success: function (res) {
            if(res) {
              let data = res.data;
              _this.formItem.type = data.type;
              _this.formItem.level = data.level;
              _this.formItem.length = data['length'];
              _this.formItem.originalUnitPrice = data.originalUnitPrice;
              _this.formItem.nowUnitPrice = data.nowUnitPrice;
            }
          }
        });
      },
      editSave(name, flag) {
        const _this = this;
        this.loadingEdit = false;
        this.$refs[name].validate((valid) => {
          if(valid) {
            common.ajax({
              url: MO().CoursePackage.createAndUpdate,
              data: {
                uuid: _this.coursePriceUuid,
                type: _this.formItem.type,
                level: _this.formItem.level,
                length: _this.formItem.length,
                originalUnitPrice: _this.formItem.originalUnitPrice,
                nowUnitPrice: _this.formItem.nowUnitPrice,
                onlineStatus: (flag === 'online') ? 1 : 0
              },
              success: function (response) {
                common.notices('操作成功！！');
                _this.editModal = false;
                _this.searchForm();
                _this.reset();
              }
            });
          } else {
            setTimeout(() => {
              this.loadingEdit = true;
            }, 0);
          }
        });
      },
      addSave(name, flag) {
        const _this = this;
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if(valid) {
            common.ajax({
              url: MO().CoursePackage.createAndUpdate,
              data: {
                type: _this.addFormItem.type,
                level: _this.addFormItem.level,
                length: _this.addFormItem.length,
                originalUnitPrice: _this.addFormItem.originalUnitPrice,
                nowUnitPrice: _this.addFormItem.nowUnitPrice,
                onlineStatus: (flag === 'online') ? 1 : 0
              },
              success: function (response) {
                common.notices('操作成功！！');
                _this.addModal = false;
                _this.searchForm();
                _this.reset();
              }
            });
          } else {
            setTimeout(() => {
              this.loading = true;
            }, 0);
          }
        });
      },
      offline(coursePriceUuid) {
        const _this = this;
        this.$Modal.confirm({
          title: '下线',
          content: '确认下线该课程包吗？',
          onOk() {
            common.ajax({
              url: MO().CoursePackage.offline,
              data: { coursePriceUuid: coursePriceUuid },
              success: function (res) {
                common.notices("操作成功！");
                _this.searchForm();
              }
            });
          }
        });
      },
      online(coursePriceUuid) {
        const _this = this;
        this.$Modal.confirm({
          title: '上下线',
          content: '确认上线该课程包吗？',
          onOk() {
            common.ajax({
              url: MO().CoursePackage.online,
              data: { coursePriceUuid: coursePriceUuid },
              success: function (res) {
                common.notices("操作成功！");
                _this.searchForm();
              }
            });
          }
        });
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          type: this.Search.type,
          level: this.Search.level,
          status: this.Search.status
        });
      },
      reset() {
        this.formItem.length = 1;
        this.formItem.originalUnitPrice = 1;
        this.formItem.nowUnitPrice = 1;
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?type=${search.type}&level=${search.level}&status=${search.status}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: MO().CoursePackage.dataGrid + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['coursePriceVos'] || [];
            _this.total = res.data.total;
          }
        });
      },
      changeCoursePriceTypeForAdd(value) {
        if(value === '清北') {
          this.addFormItem.level = 1;
        }else if(value === '明星') {
          this.addFormItem.level = 2;
        }else{
          this.addFormItem.level = 0;
        }
      },
      changeCoursePriceType(value) {
        if(value === '清北') {
          this.formItem.level = 1;
        }else if(value === '明星') {
          this.formItem.level = 2;
        }else{
          this.formItem.level = 0;
        }
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
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

<style lang="less" rel="stylesheet/less">

</style>
