<template>
<div>
  <div>
    <p class="txt-center" id="errorTip"><span class="c-warning">只能上传图片类型文件！</span></p>
    <table class="onlyhi-table">
      <thead>
      <tr>
        <th>ID</th>
        <th>文件ID</th>
        <th>附件名称</th>
        <th>附件</th>
        <th>更新时间</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item,index) in files" :key='index'>
        <td>{{index-1}}</td>
        <td>{{item.id}}</td>
        <td>{{item.purposeName}}</td>
        <td>
          <Poptip trigger="hover">
            <a v-bind:href="item.fileAddress" target=_blank>{{item.fileOriginalName}}</a>
            <div slot="content" style="max-height: 500px;"><img :src="item.fileAddress" style="max-height: 600px;"/></div>
          </Poptip>
        </td>
        <td>{{item.updateDate | convertDate}}</td>
        <td>
          <i-button type="text" icon="ios-cloud-upload-outline" size="small" @click="uploadBtn(item.purpose)">上传</i-button>
          <!--<Poptip confirm title="您确认删除这个附件吗？" @on-ok="downFileBtn(item.id,$key)" v-show="item.fileAddress">-->
          <!--<i-button type="text" icon="trash-b" size="small">删除</i-button>-->
          <!--</Poptip>-->
          <i-button type="primary" icon="ios-download-outline" v-show="item.fileAddress" size="small" @click="downFileBtn(item.id)">下载</i-button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>

  <input type="file" id="fileInput" @change="onChangeFileOk" style="display: none;"/>
</div>
</template>

<script type="text/ecmascript-6">
  import {TEACHER} from 'common/api/teacher.js';
  import {formateDate,common,checkImageExt,uploadAjax} from 'common/js/common.js';
  export default{
  	props: {
      teacherId: String
    },
    data() {
      return {
        fileId: '',
        files: {
        	"2": {
            purposeName: "身份证正面",
            fileAddress: '',
            id: '',
            fileOriginalName: '',
            purpose: '2',
            updateDate: ''
          },
          "3": {
            purposeName: "身份证反面",
            fileAddress: '',
            id: '',
            fileOriginalName: '',
            purpose: '3',
            updateDate: ''
          },
          "4": {
            purposeName: "银行卡正面",
            fileAddress: '',
            id: '',
            fileOriginalName: '',
            purpose: '4',
            updateDate: ''
          },
          "5": {
            purposeName: "银行卡反面",
            fileAddress: '',
            id: '',
            fileOriginalName: '',
            purpose: '5',
            updateDate: ''
          },
          "6": {
            purposeName: "兼职协议第一页",
            fileAddress: '',
            id: '',
            fileOriginalName: '',
            purpose: '6',
            updateDate: ''
          },
          "7": {
            purposeName: "兼职协议第三页",
            fileAddress: '',
            id: '',
            fileOriginalName: '',
            purpose: '7',
            updateDate: ''
          },
          "8": {
            purposeName: "信息登记表",
            fileAddress: '',
            id: '',
            fileOriginalName: '',
            purpose: '8',
            updateDate: ''
          },
          "9": {
            purposeName: "学生证/毕业证/教资",
            fileAddress: '',
            id: '',
            fileOriginalName: '',
            purpose: '9',
            updateDate: ''
          }
        }
      }
    },
    mounted() {
  		this.getAnnex();
    },
    methods: {
      uploadBtn(id) {
        this.fileId = id;
        document.getElementById('fileInput').click();
      },
      onChangeFileOk() {
        const _this = this;
        let fileInput = document.getElementById('fileInput');
        let errorTip = document.getElementById('errorTip');
        let fileVal = fileInput.value;
        let teacherId = this.teacherId;
        let fileId = this.fileId;
        if (!checkImageExt(fileVal)) {
          errorTip.innerHTML = '<span class="c-red">上传的文件格式不合法，只能上传图片</span>';
        }else{
          errorTip.innerHTML = '';
          let files = fileInput.files[0];
          uploadAjax({
            url: TEACHER().Detail.uploadFile,
            data: {
              "file": files,
              "teacherId": teacherId,
              "purpose": fileId,
            },
            success: function (res) {
              _this.getAnnex();
              errorTip.innerHTML = '<span class="c-success">上传成功！！</span>';
            }
          });
        }
      },

      downFileBtn(id) {
        const _this = this;
        let apiUrl = TEACHER().Detail.dowmFile;
        apiUrl += `?teacherUuid=${_this.teacherId}&fileId=${id}`;
        common.ajax({
          url: apiUrl,
          success(res) {
              GLOBAL.newTab(res.data.fileAddress,true);
          }
        })
      },
      getAnnex() {
        const _this = this;
        let teacherId = this.teacherId;
        if(teacherId) {
          common.ajax({
            url: TEACHER().Detail.getAnnex,
            data: {teacherId: teacherId},
            success(res) {
              let obj = res.data;
              if(obj && JSON.stringify(obj) !== '{}'){
                for(let key in obj) {
                  for(let key2 in _this.files) {
                    if(key.toString() === key2) {
                      _this.files[key2].id = obj[key].id;
                      _this.files[key2].fileAddress = obj[key].fileAddress;
                      _this.files[key2].fileOriginalName = obj[key].fileOriginalName;
                      _this.files[key2].updateDate = obj[key].updateDate;
                    }
                  }
                }
              }
            }
          });
        }else{
        	common.notices('参数teacherId等于空');
        }
      }
    },
    filters: {
      convertDate(value) {
      	return formateDate(value,'yyyy-MM-dd hh:mm:ss');
      }
    }
  };
</script>

<style scoped>
  .onlyhi-table tbody tr {height: 30px;}
  .ivu-poptip-confirm .ivu-poptip-body .ivu-icon {left: 5px;}
</style>
