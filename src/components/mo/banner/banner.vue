<template>
 <div>
   <div>
     <p class="txt-center" id="errorTip"><span class="c-warning">只能上传图片类型文件！</span></p>
     <table class="onlyhi-table">
       <thead>
       <tr>
         <th>序号</th>
         <th>状态</th>
         <th>名称</th>
         <th>排序</th>
         <th>链接URL</th>
         <th>创建时间</th>
         <th>更新时间</th>
         <th>预览图片</th>
         <th>上传图片</th>
         <th>操作</th>
       </tr>
       </thead>
       <tbody>
       <tr v-for="(item,index) in files1" :key='index'>
         <td>{{index}}</td>

         <td v-if="item.enabled==1">上线</td>
         <td v-else>下线</td>

         <td>{{item.bannerName}}</td>

         <td v-show="item.bannerSort == 'min'">
           <p>
             <a href="javascript:;" @click="Sort(item.id,'down')">
               <Icon type="arrow-down-a"></Icon>
             </a>
           </p>
         </td>
         <td v-show="item.bannerSort == 'middle'">
           <p>
             <a href="javascript:;" @click="Sort(item.id,'up')">
               <Icon type="arrow-up-a" ></Icon>
             </a>
           </p>
           <!--<i-button style="line-height: 20px" type="text" icon="arrow-up-a" size="large" ></i-button></p>-->
           <p>
             <a href="javascript:;" @click="Sort(item.id,'down')">
               <Icon type="arrow-down-a"></Icon>
             </a>
           </p>
         </td>
         <td v-show="item.bannerSort == 'max'">
           <p>
             <a href="javascript:;" @click="Sort(item.id,'up')">
               <Icon type="arrow-up-a"></Icon>
             </a>
           </p>
         </td>
         <td>
           <a :href="item.bannerUrl" target=_blank>{{item.bannerUrl}}</a>
         </td>
         <td>{{item.createDate | convertDate}}</td>
         <td>{{item.updateDate | convertDate}}</td>
         <td>
           <Poptip trigger="hover">
             <a v-bind:href="'javascript:GLOBAL.newTab(\'' + item.fileAddress + '\')'">{{item.fileName}}</a>
             <div slot="content" style="max-height: 500px;"><img :src="item.fileAddress" style="max-width: 150px;"/>
             </div>
           </Poptip>
         </td>
         <td>
           <i-button type="text" icon="ios-cloud-upload-outline" size="small" @click="uploadBtn(item.id)">上传</i-button>
         </td>
         <td>

           <i-button type="primary" icon="edit" size="small" @click="show(item.id,item.bannerName,item.bannerUrl)">编辑
           </i-button>
           <i-button v-if="item.enabled == 0" type="error" icon="arrow-down-a" size="small"
                     @click="downFileBtn(item.id,1)">
             上线
           </i-button>
           <i-button v-else-if="item.enabled == 1" type="error" icon="arrow-down-a" size="small"
                     @click="downFileBtn(item.id,0)">
             下线
           </i-button>
           <i-button v-else type="error" icon="arrow-down-a">
             未知
           </i-button>
         </td>
       </tr>
       </tbody>
     </table>
   </div>
   <Modal
     v-model="modal"
     title="编辑图片"
     :closable="false"
     :mask-closable="false"
     :loading="loading"
     @on-ok="onOk('formValidate')">
     <i-form ref='formValidate' :model="formItem" :rules="ruleValidate" :label-width="80">
       <Form-item label="名称" prop="name">
         <i-input v-model="formItem.name"></i-input>
       </Form-item>
       <Form-item label="URL" prop="name">
         <i-input v-model="formItem.url">
         </i-input>
       </Form-item>
     </i-form>
   </Modal>
   <input type="file" id="fileInput" @change="onChangeFileOk" style="display: none;"/>
 </div>
</template>

<script type="text/ecmascript-6">
  import {MO} from 'common/api/mo.js';
  import {formateDate, common, checkImageExt, uploadAjax} from 'common/js/common.js';
  export default{
    data() {
      return {
        modal: false,
        loading: true,
        fileId: '',
        teacherId: '',
        formItem: {
          name: '',
          url: '',
        },
        modalImg: {
          url: '',
          id: '',
          name: '',
          show: false,
        },
        files: {
          "0": {
            sort: "",
            enabled: "",
            enabled0: "",
            purposeName: "",
            bannerUrl: '',
            bannerName: '',
            fileAddress: '',
            id: '',
            fileOriginalName: '',
            createDate: '',
            updateDate: '',
            fileName: '',
            down: true,
            toBannerUrl: '',
          },
          "1": {
            sort: "",
            enabled: "",
            enabled0: "",
            purposeName: "",
            bannerUrl: '',
            bannerName: '',
            fileAddress: '',
            id: '',
            fileOriginalName: '',
            createDate: '',
            updateDate: '',
            fileName: '',
            up: true,
            down: true,
            toBannerUrl: '',
          },
          "2": {
            sort: "",
            enabled: "",
            enabled0: "",
            purposeName: "",
            bannerUrl: '',
            bannerName: '',
            fileAddress: '',
            id: '',
            fileOriginalName: '',
            createDate: '',
            updateDate: '',
            fileName: '',
            up: true,
            down: true,
            toBannerUrl: '',
          },
          "3": {
            sort: "",
            enabled: "",
            enabled0: "",
            purposeName: "",
            bannerUrl: '',
            bannerName: '',
            fileAddress: '',
            id: '',
            fileOriginalName: '',
            createDate: '',
            updateDate: '',
            fileName: '',
            up: true,
            down: true,
            toBannerUrl: '',
          },
          "4": {
            sort: "",
            enabled: "",
            enabled0: "",
            purposeName: "",
            bannerUrl: '',
            bannerName: '',
            fileAddress: '',
            id: '',
            fileOriginalName: '',
            createDate: '',
            updateDate: '',
            fileName: '',
            up: true,
            down: true,
            toBannerUrl: '',
          },
          "5": {
            sort: "",
            enabled: "",
            enabled0: "",
            purposeName: "",
            bannerUrl: '',
            bannerName: '',
            fileAddress: '',
            id: '',
            fileOriginalName: '',
            createDate: '',
            updateDate: '',
            fileName: '',
            up: true,
            down: true,
            toBannerUrl: '',
          },
          "6": {
            sort: "",
            enabled: "",
            enabled0: "",
            purposeName: "",
            bannerUrl: '',
            bannerName: '',
            fileAddress: '',
            id: '',
            fileOriginalName: '',
            createDate: '',
            updateDate: '',
            fileName: '',
            up: true,
            toBannerUrl: '',
          },
        },
        files1:[],
        ruleValidate: {
          name: [
            {required: true, message: '请输入内容', trigger: 'blur'}
          ],
        },
      }
    },
    mounted() {
      this.getAnnex();
    },
    methods: {
      show(id, name, url){
        this.modalImg.id = id;
        this.formItem.name = name;
        this.formItem.url = url;
        this.modal = true
      },
      Sort(id, str){
        const _this = this;
        common.ajax({
          url: MO().banner.updateBannnerSort,
          data: {
            id: id,
            status: str
          },
          success: function (response) {
            _this.getAnnex();
          }
        });
      },
      onOk(name) {
        this.loading = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            common.ajax({
              url: MO().banner.saveWebSiteBanner,
              data: {
                bannerName: _this.formItem.name,
                id: _this.modalImg.id,
                bannerUrl: _this.formItem.url,
              },
              success: function (response) {
                _this.modal = false;
                _this.getAnnex();
                common.notices('操作成功！！');
              }
            });
          } else {
            setTimeout(() => {
              this.loading = true;
            }, 0);
          }
        });
      },
      uploadBtn(id) {
        this.fileId = id;
        document.getElementById('fileInput').click();
      },
      onChangeFileOk(event) {
        const _this = this;
        let fileInput = document.getElementById('fileInput');
        let errorTip = document.getElementById('errorTip');
        let fileVal = fileInput.value;
        let fileId = this.fileId;
        if (!checkImageExt(fileVal)) {
          errorTip.innerHTML = '<span class="c-red">上传的文件格式不合法，只能上传图片</span>';
        } else {
          errorTip.innerHTML = '';
          let files = fileInput.files[0];
          uploadAjax({
            url: MO().banner.uploadFile,
            data: {
              "file": files,
              "id": fileId
            },
            success: function (res) {
              errorTip.innerHTML = '<span class="c-success">上传成功！！</span>';
              setTimeout(function () {
                errorTip.innerHTML = '<span class="c-success"></span>';
              }, 3000)
              event.target.value = '';
              _this.getAnnex();
            }
          });
        }
      },
      downFileBtn(id, enabled) {
        const _this = this;
        let apiUrl = MO().banner.editWebSiteBannerStatus;
        console.log(enabled);
        common.ajax({
          url: apiUrl,
          data: {
            id: id,
            enabled: enabled
          },
          success(res) {
//            GLOBAL.newTab(res.data.fileAddress, true);
            _this.getAnnex();
          }
        })
      },
      getAnnex() {
        const _this = this;
        common.ajax({
          url: MO().banner.getWebSiteBannerDetail,
//            data: {status: "下架"},
          success(res) {
            let obj = res.data['webSiteBannerVoList'] || [];
            _this.files1 = res.data['webSiteBannerVoList'] || [];
//            if (obj && JSON.stringify(obj) !== '{}') {
//              for (let key in obj) {
//                for (let key2 in _this.files) {
//                  if (key.toString() === key2) {
//                    _this.files[key2].sort = obj[key2].sort;
//                    _this.files[key2].enabled = obj[key2].enabled == 0 ? '下架' : '上架';
//                    _this.files[key2].enabled0 = obj[key2].enabled == 0 ? '上架' : '下架';
//                    _this.files[key2].id = obj[key2].id;
//                    _this.files[key2].bannerUrl = obj[key2].bannerUrl;
//                    _this.files[key2].toBannerUrl = obj[key2].bannerUrl;
//                    _this.files[key2].fileAddress = obj[key2].fileAddress;
//                    _this.files[key2].bannerName = obj[key2].bannerName;
//                    _this.files[key2].fileName = obj[key2].fileName;
//                    _this.files[key2].createDate = obj[key2].createDate;
//                    _this.files[key2].updateDate = obj[key2].updateDate;
//                  }
//                }
//              }
//            }
          }
        });
      }
    },
    filters: {
      convertDate(value) {
        return formateDate(value, 'yyyy-MM-dd hh:mm:ss');
      }
    }
  };
</script>

<style scoped>
  .onlyhi-table tbody tr {
    height: 30px;
  }

  .ivu-poptip-confirm .ivu-poptip-body .ivu-icon {
    left: 5px;
  }

  .table.onlyhi-table td {
    padding: 5px 4px
  }
</style>
