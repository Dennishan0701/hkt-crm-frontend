<template>
<div>
  <o-breadcrumb second="客户端管理" third="客户端列表"></o-breadcrumb>
  <p class="txt-center" id="errorTip"></p>
  <div class="grid-widget">
    <Row>
      <i-col span="4">
        <i-button type="primary" :size="$store.state.searchModuleSize" icon="plus" @click="addModal = true">新增</i-button>
      </i-col>
      <i-col span='20' class="right">
        <i-select v-model="clientType" :size="$store.state.searchModuleSize" placeholder="客户端类型" filterable clearable style="width:150px">
          <i-option v-for="(item,index) in clientTypeList" :value="item.enumValue" :key='index'>{{ item.enumName }}</i-option>
        </i-select>
        <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索</i-button>
      </i-col>
    </Row>
  </div>
  <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :total="total" :page-size="pageNumber" :current="pageIndex" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>

  <input type="file" id="fileInput" @change="onChangeFileOk" style="display: none;"/>
  <input type="file" id="addFileInput" @change="onAddChangeFileOk" style="display: none;"/>

  <Modal
    title="更新"
    v-model="resModal"
    :mask-closable="false"
    :closable="false"
    :loading="loading"
    @on-ok="handleSubmitRes('formValidateRes')"
    class-name="vertical-center-modal">
    <i-form ref="formValidateRes" :model="formItemRes" :rules="ruleValidateModel" :label-width="80">
      <Form-item label="版本号">
        <i-input disabled v-model="formItemRes.clientVersion" placeholder="请输入..." style="width: 200px"></i-input>
      </Form-item>
      <Form-item label="客户端类型">
        <i-select disabled v-model="formItemRes.clientTypeDesc" size="small" placeholder="客户端类型" filterable clearable
                  style="width:200px">
          <i-option v-for="(item,index) in clientTypeList" :key='index' :value="item.enumValue">{{ item.enumName }}</i-option>
        </i-select>
      </Form-item>

      <Form-item label="更新内容" prop="remark">
        <i-input v-model="formItemRes.remark" type='textarea' placeholder="请输入..." style="width: 200px"></i-input>
      </Form-item>
      <Form-item label="已上传文件" v-show="formItemRes.fileOriginalName">
        <p>{{formItemRes.fileOriginalName}}</p>
      </Form-item>
      <Form-item>
        <i-button v-if="modalRes==0" type="success" icon="upload" size="small" @click="resBtn">上传</i-button>
        <i-button v-if="modalRes==1" type="success" icon="upload" size="small" @click="resBtn" disabled>上传中...
        </i-button>
        <i-button v-if="modalRes==2" type="success" size="small">上传成功</i-button>
      </Form-item>
    </i-form>
  </Modal>

  <Modal
    title="新增"
    v-model="addModal"
    :mask-closable="false"
    :closable="false"
    :loading="loading"
    @on-ok="handleSubmit('formValidateEdit')"
    class-name="vertical-center-modal">
    <i-form ref="formValidateEdit" :model="formItem" :rules="ruleValidateModel" :label-width="80">
      <Form-item label="版本号" prop="clientVersion">
        <i-input v-model="formItem.clientVersion" placeholder="请输入..." style="width: 200px"></i-input>
      </Form-item>
      <Form-item label="客户端类型" prop="clientType">
        <i-select v-model="formItem.clientType" size="small" placeholder="客户端类型" filterable clearable
                  style="width:200px">
          <i-option v-for="(item,index) in clientTypeList" :key='index' :value="item.enumValue">{{ item.enumName }}</i-option>
        </i-select>
      </Form-item>

      <Form-item label="更新内容" prop="remark">
        <i-input v-model="formItem.remark" type='textarea' placeholder="请输入..." style="width: 200px"></i-input>
      </Form-item>
      <Form-item label="已上传文件" v-show="formItem.fileOriginalName">
        <p>{{formItem.fileOriginalName}}</p>
      </Form-item>
      <Form-item>
        <i-button v-if="modalMsg==0" type="success" icon="upload" size="small" @click="addBtn">上传</i-button>
        <i-button v-if="modalMsg==1" type="success" icon="upload" size="small" @click="addBtn" disabled>上传中...
        </i-button>
        <i-button v-if="modalMsg==2" type="success" size="small">上传成功</i-button>
      </Form-item>
    </i-form>


  </Modal>
</div>
</template>

<script type="text/ecmascript-6">

  import {COMMON_API} from 'common/api.config.js';
  import {CLIENT} from 'common/api/client.js';
  import {formateDate, common, uploadAjax, checkClientExt} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        addModal: false,
        resModal: false,
        loading: true,
        event:'',
        ruleValidateModel: {
          clientVersion: [
            {required: true, message: '请填写角色名称', trigger: 'blur'},
          ],
          clientType: [
            {required: true, message: '请选择客户端类型', trigger: 'change'},
          ],
          remark: [
            {required: true, message: '请填写更新内容', trigger: 'blur'},
          ]
        },
        total: 0,
        pageIndex: 1,
        pageNumber: 15,
        clientTypeList: [],
        clientType: '',
        index: '',
        id: '',
        formItem: {
          clientType: '',
          clientVersion: '',
          remark: '',
          fileAddress: '',
          fileName: '',
          fileOriginalName: '',
        },
        formItemRes: {
          clientVersion: '',
          clientTypeDesc: '',
          remark: '',
          fileOriginalName: '',
        },
        upFormItem: {
          fileAddress: '',
          fileName: '',
          fileOriginalName: '',
        },

        modalMsg: '0',
        modalRes: '0',
        columns: [
          {
            title: '序号',
            type: 'index',
            align: 'center',
            minWidth: 60
          },
          {
            title: '版本号',
            key: 'clientVersion',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '客户端类型',
            key: 'clientTypeDesc',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '文件',
            key: 'fileOriginalName',
            align: 'center',
            minWidth: 120,
          },
//          {
//            title: '下载地址',
//            key: 'fileAddress',
//            align: 'center',
//            width: '120',
//          },
          {
            title: '更新内容',
            key: 'content',
            align: 'center',
            minWidth: 120,
            render : (h, params) => {
              let content = params.row.content=='null'?'':params.row.content;
              if(content && content.length>38) {
                content = content.slice(0,37)+'...';
                  h('div',[
                    h('Button',{
                      attrs:{
                        title: params.row.content
                      },
                    },content)
                  ])

//                return `<span title="${row.content}">${content}</span>`;
              } else {
                return h('span',content);
              }
            }
          },
          {
            title: '更新时间',
            key: 'updateDate',
            align: 'center',
            minWidth: 120,
            render(h, params) {
              return h('span',formateDate(params.row.updateDate, 'yyyy-MM-dd hh:mm:ss'))
            }
          },
          {
            title: '操作',
            align: 'center',
            minWidth: 120,
            render : (h, params) => {
                if(params.row.uploading){

                  return h('div',[
                    h('Button',{
                      props:{
                        type:'success',
                        size:'small',
                      },
                      style:{
                        margin:'2px'
                      },
                      on:{
                        click:()=>{
                          this.downFileBtn(params.row.id)
                        }
                      }
                    },'下载'),
                    h('Button',{
                      props:{
                        type:'success',
                        size:'small',
                      },
                      style:{
                        margin:'2px'
                      },
                      on:{
                        click:()=>{
                          this.uploadBtn(params.index,params.row.id)
                        }
                      }
                    },'正在上传...')
                  ])
                }else {

                  return h('div',[
                    h('Button',{
                      props:{
                        type:'success',
                        size:'small',
                      },
                      style:{
                        margin:'2px'
                      },
                      on:{
                        click:()=>{
                          this.downFileBtn(params.row.id)
                        }
                      }
                    },'下载'),
                    h('Button',{
                      props:{
                        type:'error',
                        size:'small',
                      },
                      style:{
                        margin:'2px'
                      },
                      on:{
                        click:()=>{
                          this.uploadBtn(params.row.clientVersion,params.row.clientType,params.row.content=='null'?'':params.row.content,params.row.fileOriginalName,params.index,params.row.id)
                        }
                      }
                    },'更新')
                  ])
                }

//              return `<i-button type="success" size="small" @click="downFileBtn('${row.id}')">下载</i-button>
//              <i-button v-if="${row.upLoading}" type="success" size="small" @click="uploadBtn('${index}','${row.id}')" disabled>正在上传...</i-button>
//              <i-button v-else type="error" size="small" @click="uploadBtn('${row.clientVersion}','${row.clientType}','${row.content=='null'?'':row.content}','${row.fileOriginalName}','${index}','${row.id}')">更新</i-button>
//              `;
            }
          }
        ]
      }
    },
    mounted() {
      this.searchForm();
//        获取客户端类型
      const _this = this;
      // common.ajax({
      //   url: CLIENT().ClientFile.getClientType,
      //   method: 'get',
      //   success: function (res) {
      //     _this.clientTypeList = res.data['typeList'] || [];
      //   }
      // });
      this.$axios.get(CLIENT().ClientFile.getClientType,{
      }).then( ({data}) => {
        _this.clientTypeList = data.data['typeList'] || [];
      })
    },
    methods: {
//        添加
      addBtn(){
        document.getElementById('addFileInput').click();
      },
      onAddChangeFileOk(){
        const _this = this;
        let addFileInput = document.getElementById('addFileInput');
        let addFileVal = addFileInput.value;
        if (!checkClientExt(addFileVal)) {
        } else {
          let files = addFileInput.files[0];
          _this.modalMsg = 1;
          console.log(3);
          uploadAjax({
            url: CLIENT().ClientFile.uploadClientFile,
            data: {
              "file": files,
            },
            success: function (res) {
              _this.modalMsg = 0;
              _this.event.target.value = '';
              _this.formItem.fileAddress = res.data.fileAddress
              _this.formItem.fileName = res.data.fileName
              _this.formItem.fileOriginalName = res.data.fileOriginalName
            }
          });
        }

      },
      handleSubmit(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            // common.ajax({
            //   url: CLIENT().ClientFile.addClientFile,
            //   data: {
            //     clientType: _this.formItem.clientType,
            //     clientVersion: _this.formItem.clientVersion,
            //     fileAddress: _this.formItem.fileAddress,
            //     fileName: _this.formItem.fileName,
            //     fileOriginalName: _this.formItem.fileOriginalName,
            //     content: _this.formItem.remark,
            //   },
            //   success: function (res) {
            //     common.notices(res.msg);
            //     _this.loading = false;
            //     _this.addModal = false;
            //     _this.searchForm();
            //   }
            // });
            this.$axios.post(CLIENT().ClientFile.addClientFile,{
              clientType: _this.formItem.clientType,
              clientVersion: _this.formItem.clientVersion,
              fileAddress: _this.formItem.fileAddress,
              fileName: _this.formItem.fileName,
              fileOriginalName: _this.formItem.fileOriginalName,
              content: _this.formItem.remark,
            }).then( ({data}) => {
              common.notices(data.msg);
              _this.loading = false;
              _this.addModal = false;
              _this.searchForm();
            })
          } else {
            setTimeout(() => {
              this.loading = true;
            }, 0);
          }
        });
      },
//      更新
      handleSubmitRes(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            // common.ajax({
            //   url: CLIENT().ClientFile.updateClientFile,
            //   data: {
            //     id: _this.id,
            //     fileAddress: _this.formItemRes.fileAddress,
            //     fileName: _this.formItemRes.fileName,
            //     fileOriginalName: _this.formItemRes.fileOriginalName,
            //     content: _this.formItemRes.remark,
            //   },
            //   success: function (res) {
            //     common.notices(res.msg);
            //     if(_this.event){
            //       _this.event.target.value = '';
            //     }
            //     _this.loading = false;
            //     _this.resModal = false;
            //     _this.modalRes = 0
            //     _this.searchForm();
            //   }
            // });
            this.$axios.post(CLIENT().ClientFile.updateClientFile,{
              id: _this.id,
              fileAddress: _this.formItemRes.fileAddress,
              fileName: _this.formItemRes.fileName,
              fileOriginalName: _this.formItemRes.fileOriginalName,
              content: _this.formItemRes.remark,
            }).then( ({data}) => {
              common.notices(data.msg);
              if(_this.event){
                _this.event.target.value = '';
              }
              _this.loading = false;
              _this.resModal = false;
              _this.modalRes = 0
              _this.searchForm();
            })
          } else {
            setTimeout(() => {
              this.loading = true;
            }, 0);
          }
        });
      },
      resBtn(){
        document.getElementById('fileInput').click();
      },
      uploadBtn(clientVersion,clientTypeDesc,remark,fileOriginalName,index, id) {
        this.formItemRes.clientVersion=clientVersion;
        this.formItemRes.clientTypeDesc=clientTypeDesc;
        this.formItemRes.remark=remark;
        this.formItemRes.fileOriginalName=fileOriginalName;
        this.index = index;
        this.id = id;
        this.resModal = true;
      },
      onChangeFileOk(event){
        const _this = this;
        _this.event = event;
        let fileInput = document.getElementById('fileInput');
        let errorTip = document.getElementById('errorTip');
        let fileVal = fileInput.value;
        if (!checkClientExt(fileVal)) {
          errorTip.innerHTML = '<span class="c-red">上传的文件格式不合法，只能上传客户端类型</span>';
          console.log(2);
        } else {
          _this.modalRes = 1
          errorTip.innerHTML = '<span class="c-red">正在上传...</span>';
          let files = fileInput.files[0];

          _this.data.forEach(function (v, i) {
            if (i == _this.index) {
              v.upLoading = true;
            }
          })
          uploadAjax({
            url: CLIENT().ClientFile.uploadClientFile,
            data: {
              "file": files,
            },
            success: function (res) {
              _this.modalRes = 2
              _this.formItemRes.fileAddress = res.data.fileAddress
              _this.formItemRes.fileName = res.data.fileName
              _this.formItemRes.fileOriginalName = res.data.fileOriginalName
//              common.ajax({
//                url: CLIENT().ClientFile.updateClientFile,
//                data: {
//                  id: _this.id,
//                  fileAddress: fileAddress,
//                  fileName: fileName,
//                  fileOriginalName: fileOriginalName,
//                },
//                success: function (res) {
//                  common.notices(res.msg);
//                  _this.searchForm();
//                  event.target.value = '';
//                  errorTip.innerHTML = '<span class="c-success">上传成功！！</span>';
//                }
//              });
              this.$axios.post(CLIENT().ClientFile.updateClientFile,{
                 id: _this.id,
                 fileAddress: fileAddress,
                 fileName: fileName,
                 fileOriginalName: fileOriginalName,
              }).then( ({data}) => {
                common.notices(data.msg);
               _this.searchForm();
               event.target.value = '';
               errorTip.innerHTML = '<span class="c-success">上传成功！！</span>';
              })
            }
          });
        }

      },
//      下载
      downFileBtn(id) {
        console.log(id);
        // let apiUrl = CLIENT().ClientFile.downloadClientFile;
        // apiUrl += `?id=${id}`;
        // common.ajax({
        //   url: apiUrl,
        //   success(res) {
        //     GLOBAL.newTab(res.data.fileAddress, true);
        //   }
        // })
        this.$axios.post(CLIENT().ClientFile.downloadClientFile,{
          id:id
        }).then( ({data}) => {
          GLOBAL.newTab(data.data.fileAddress, true);
        })
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          clientType: this.clientType,
        });
      },
      loadDataGrid(search) {
        let param = `?clientType=${search.clientType}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}`;
        const _this = this;
        // common.ajax({
        //   url: CLIENT().ClientFile.dataGrid + param,
        //   method: 'get',
        //   success: function (res) {
        //     if(res.data['clientFileList']){
        //       res.data['clientFileList'].forEach(function (v, i) {
        //         v.upLoading = false;
        //       })
        //     }
        //
        //     _this.data = res.data['clientFileList'] || [];
        //     _this.total = res.data.total;
        //
        //   }
        // });
        this.$axios.get(CLIENT().ClientFile.dataGrid,{
          params:{
            clientType: search.clientType,
            pageIndex: this.pageIndex,
            pageNumber: this.pageNumber,
          }
        }).then( ({data}) => {
          _this.data = data.data['clientDownloadList'] || [];
          _this.total = data.data.total;
        })
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      }
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470 : '';
      }
    },
    components: {
      OBreadcrumb ,PageModel
    }
  };
</script>

<style lang="less" rel="stylesheet/less">

</style>
