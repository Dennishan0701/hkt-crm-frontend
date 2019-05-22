<template>
<div>
  <o-breadcrumb second="销售与客服" third="移交正式生"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="24" class="right">
        <i-input :size="$store.state.searchModuleSize" v-model="paramStr" placeholder="学生\手机号" style="width:150px;margin-right: 2px;"></i-input>
        <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
      </i-col>
    </Row>
  </div>
  <i-table size="small" stripe :columns="columns" :data="data"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>

  <!--<push-student ref="pushstudent"></push-student>-->
  <Modal
    v-model="pushModal"
    title="移交正式生"
    width="600"
    :closable="false"
    :mask-closable="false"
    @on-ok="onOk"
    @on-cancel="cancel">
    <table class="onlyhi-table">
      <tr style="height: 40px;">
        <th style="width: 100px;">是否转介绍</th>
        <td>
          <Radio-group v-model="isIntroduced" type="button">
            <Radio label="0">是</Radio>
            <Radio label="1">否</Radio>
          </Radio-group>
        </td>
      </tr>
      <tr v-show="isIntroduced == 0">
        <th style="width: 100px;">转接人介绍</th>
        <td><input type="text" class="o-input" id="introducedUser" placeholder="输入转介绍人姓名：手机号" style="width:100%;vertical-align: bottom"></td>
      </tr>
      <tr>
      <tr v-show="isIntroduced == 0">
        <th style="width: 100px;">推荐 CR</th>
        <td style="text-align: left">
          <i-select v-model="CrUuid" clearable filterable label-in-value  @on-change="changeCoursePriceType" style="width:200px">
            <i-option v-for="(item,index) in CrList" :key='index' :value="item.uuid">{{item.name}}</i-option>
          </i-select>
        </td>
      </tr>
      <tr>
        <th>参与活动</th>
        <td>
          <input type="text" class="o-input" id="introducedText" placeholder="参与活动内容：活动、优惠、赠送等" style="width:100%;vertical-align: bottom">
        </td>
      </tr>
      <tr>
        <th>是否绑定账号</th>
        <td>
          <Radio-group v-model="isBound" type="button">
            <Radio label="0">是</Radio>
            <Radio label="1">否</Radio>
          </Radio-group>
        </td>
      </tr>
      <tr>
        <th style="vertical-align: text-top;">其他备注</th>
        <td>
          <textarea class="o-input" id="handoutDes" maxlength="500" style="width:400px;height: 100px;"></textarea>
        </td>
      </tr>
    </table>
  </Modal>
</div>
</template>

<script type="text/ecmascript-6">
  import {SCS} from 'common/api/scs.js';
  import {common,formateDate,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';
  export default{
    data() {
      return {
        pushModal: false,
        isIntroduced: 0,
        isBound: 0,
        stuNo: '',
        leadUuid: '',
        paramStr: '',
        pageIndex: 1,
        pageNumber: 15,
        data: [],
        total: 0,
        CrName:'',
        CrUuid:'',
        CrList:[],
        columns: [
          {
            title: '学生姓名',
            key: 'name',
            align:'center',
            minWidth:90 ,
            render : (h, params) => {
              return h('div',[
                h('Icon',{
                  props:{
                    type:'person'
                  }
                }),
                h('a',{
                  on:{
                    click:()=>{
                      GLOBAL.viewLeadsDetail(params.row.leadUuid)
                    }
                  }
                },params.row.name)
              ])
//              return `<Icon type="person"></Icon> <strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.leadUuid}');">${row.name}</a></strong>`;
            }
          },
          {
            title: '手机号',
            key: 'phone',
            align:'center',
            minWidth:120 ,
            render(h, params) {
              return h('span',hideCharAtNumber(params.row.phone));
            }
          },
          {
            title: '年级',
            align:'center',
            key: 'grade',
            minWidth:90 ,
          },
          {
            title: '科目',
            align:'center',
            key: 'subject',
            minWidth:90 ,
          },
          {
            title: '付费时间',
            align:'center',
            key: 'createDate',
            minWidth:150,
            render(h, params) {
              return h('span',formateDate(params.row.createDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title:'操作',
            key: 'action',
            align:'center',
            minWidth:120 ,
            render : (h, params) => {
              return h('div',[
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'paper-airplane',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs:{
                    title:''
                  },
                  on: {
                    click: () => {
                      this.handOutStudent(params.row.stuNo,params.row.leadUuid)
                    }
                  }
                },'移交')
              ])
//              return `<i-button type="primary" size="small" icon="paper-airplane" @click="handOutStudent('${row.stuNo}','${row.leadUuid}')">移交</i-button>`;
            }
          }
        ]
      }
    },
    mounted() {
      this.searchForm();
      const _this = this;
      // common.ajax({
      //   url: SCS().WaitHandOutStudnt.getAllCrInfo,
      //   method: 'get',
      //   type: 'get',
      //   success: function(res){
      //     _this.CrList = res.data||[];
      //   }
      // });
      this.$axios.get(SCS().WaitHandOutStudnt.getAllCrInfo,{
      }).then( ({data}) => {
        _this.CrList = data.data||[];
      })
    },
    methods: {
      handOutStudent(stuNo,leadUuid) {
        this.stuNo = stuNo;
        this.leadUuid = leadUuid;
        this.pushModal = true;
      },
      changeCoursePriceType(params) {
        this.CrName = params.label;
        this.CrUuid = params.value;
      },
      onOk() {
        let isIntroduced = this.isIntroduced;
        let introducedUser = $('#introducedUser').val();
        let introducedText = $('#introducedText').val();
        let isBound = this.isBound;
        let handoutDes = $('#handoutDes').val();
        if(isIntroduced == 0 && introducedUser == "") {
          common.msg('输入转介绍人姓名：手机号');
          return false;
        }
        if(isIntroduced == 0 && this.CrName == "") {
          common.msg('请选择CR 推荐人');
          return false;
        }
        const that = this;
        // common.ajax({
        //   url: SCS().WaitHandOutStudnt.handOutStudent,
        //   data: {
        //     leadUuid: this.leadUuid,
        //     stuNo: this.stuNo,
        //     isIntroduced: isIntroduced,
        //     introducer: isIntroduced == 0?introducedUser:'',
        //     isBound: isBound,
        //     handoutDes: handoutDes,
        //     recommendCrUuid: isIntroduced ==0?this.CrUuid:'',
        //     recommendCrName: isIntroduced==0?this.CrName:'',
        //     inActivity:introducedText
        //   },
        //   success: function(response){
        //     common.notices('操作成功！');
        //     that.CrUuid = '';
        //     that.CrName = '';
        //     that.searchForm();
        //     that.cancel();
        //   }
        // });
        this.$axios.post(SCS().WaitHandOutStudnt.handOutStudent,{
          leadUuid: this.leadUuid,
          stuNo: this.stuNo,
          isIntroduced: isIntroduced,
          introducer: isIntroduced == 0?introducedUser:'',
          isBound: isBound,
          handoutDes: handoutDes,
          recommendCrUuid: isIntroduced ==0?this.CrUuid:'',
          recommendCrName: isIntroduced==0?this.CrName:'',
          inActivity:introducedText
        }).then( () => {
          common.notices('操作成功！');
          that.CrUuid = '';
          that.CrName = '';
          that.searchForm();
          that.cancel();
        })
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?name=${search.name}&phone=${search.phone}&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        let apiUrl = SCS().WaitHandOutStudnt.dataGrid+param;
        const that = this;
        // common.ajax({
        //   url: apiUrl,
        //   method: 'get',
        //   success: function(res){
        //     that.data = res.data.students || [];
        //     that.total = res.data.total;
        //   }
        // });
        this.$axios.get(apiUrl,{
        }).then( ({data}) => {
          that.data = data.data.students || [];
          that.total = data.data.total;
        })
      },
      searchForm(val) {
        if(val) this.pageIndex = val;
        let paramStr = this.paramStr;
        let name = '',phone = '';
        if(!paramStr) paramStr = '';
        if (isNaN(paramStr)) {
          name = paramStr;
        } else {
          phone = paramStr;
        }
        this.loadDataGrid({
          name: name,
          phone: phone
        });
      },
      pageChange(pageIndex){
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      cancel() {
        this.isIntroduced = 0;
        this.isBound = 0;
        $('#handoutDes').val('');
        $('#introducedUser').val('');
      }
    },
    components: {
      OBreadcrumb,PageModel
    }
  };
</script>
<style>
  table.onlyhi-table tr{
    height:40px;
  }
  table.onlyhi-table tr input{
    height:30px;
    border:0;
    padding-left: 10px;
    border-bottom: 1px solid #CCC;
  }
</style>
