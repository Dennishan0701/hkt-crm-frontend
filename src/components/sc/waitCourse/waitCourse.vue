<template>
<div>
  <o-breadcrumb second="销售与客服" third="待排课"></o-breadcrumb>
  <div class="grid-widget">
    <Row>
      <i-col span="24" class="right">
        <i-input :size="$store.state.searchModuleSize" v-model="paramStr" @on-keyup.enter="searchForm(1)" placeholder="学生\手机号" style="width:150px;margin-right:2px;"></i-input>
        <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
      </i-col>
    </Row>
  </div>
  <i-table size="small" highlight-row stripe :columns="columns" :data="data" @on-current-change="currentData"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>
</div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {SCS} from 'common/api/scs.js';
  import {common,hideCharAtNumber,getFullPhone} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';
  const localStorage = $.localStorage;

  export default{
    data() {
      return {
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: 10,
        currentRowData: {},
        paramStr: '',
        columns: [
          {
            title: '学生姓名',
            key: 'name',
            minWidth: 90,
            align: 'center',
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
                      GLOBAL.viewLeadsDetail(params.row.leadsUuid)
                    }
                  }
                },params.row.name)
              ])

//              return `<Icon type="person"></Icon> <strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.leadsUuid}');">${row.name}</a></strong>`;
            }
          },
          {
            title: '手机号',
            key: 'phone',
            align: 'center',
            minWidth: 160,
            render : (h, params) => {
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
                      this.getFullPhone(params.row.phone)
                    }
                  }
                })
              ])
//              return hideCharAtNumber(row.phone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.phone}')" class="eye" title="显示全部"></Icon>`;
            }
          },
          {
            title: '年级',
            align: 'center',
            key: 'grade',
            minWidth: 90,
          },
          {
            title: '预约课程类型',
            key: 'type',
            align: 'center',
            minWidth: 90,
            render(h, params) {
              if (params.row.type == 0) return h('span','测评课');
              if (params.row.type == 1) return h('span','正式课');
            }
          },
          {
            title: '课程时长',
            key: 'length',
            align: 'center',
            minWidth: 90,
            render(h, params) {
              return h('span',params.row.length || 0 +"小时");
            }
          },
          {
            title: '科目',
            align: 'center',
            key: 'subject',
            minWidth: 90,
          },
          {
            title: '操作提示',
            key: 'requestStatus',
            align: 'center',
            minWidth: 200,
            render : (h, params) => {
              let status = params.row.requestStatus;
              if(status == "0") { //拒绝
                let content = params.row.requestRefusecContent;
                if(content && content.length>19) {
                  content = content.slice(0,18)+'...';
                  return h('div',[
                    h('p',{
                      attrs:{
                        title:params.row.requestRefusecContent
                      }},[
                        h('span',{
                          attrs:{
                            class:'c-red'
                          }
                        },'拒绝原因：'+content)
                    ])
                  ])
//                  return `<p title="${row.requestRefusecContent}"><span class="c-red">拒绝原因：${content}</span></p>`;
                } else {
                  return h('div',[
                    h('span',{
                      attrs:{
                        class:'c-red'
                      }
                    },'拒绝原因：'+ content)
                  ])
//                  return `<span class="c-red">拒绝原因：${content}</span>`;
                }
                //return `<span style='color:red'>拒绝原因：${row.requestRefusecContent}</span>`;
              }else if(status == "1") {
                return h('span',"已发要求，待安排");
              } else if(status == "3") {
                return h('span','未发要求');
              } else {
                return h('span',"未知状态");
              }
            }
          },
          {
            title:'操作',
            key: 'action',
            align: 'center',
            minWidth: 100,
            fixed: 'right',
            render : (h, params) => {
              let status = params.row.requestStatus;
              if(status == "0" || status == "3") { //拒绝
                return h('div',[
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                      icon: 'ios-compose',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs:{
                      title:'提交要求'
                    },
                    on: {
                      click: () => {
                        this.addRequirements(params.row.uuid)
                      }
                    }
                  }),
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small',
                      icon: 'trash-b',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs:{
                      title:'放弃'
                    },
                    on: {
                      click: () => {
                        this.giveUpCourse(params.row.uuid)
                      }
                    }
                  })
                ])
//                return `<i-button type="primary" size="small" icon="ios-compose" title="提交要求" @click="addRequirements('${row.uuid}')"></i-button>
//                <i-button type="error" size="small" icon="trash-b" title="放弃" @click="giveUpCourse('${row.uuid}')"></i-button>`;
              } else if(status == "1") {
                return h('div',[
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small',
                      icon: 'eye',
                    },
                    style: {
                      margin: '2px',
                    },
                    attrs:{
                      title:'查看要求'
                    },
                    on: {
                      click: () => {
                        this.viewRequirements(params.row.uuid)
                      }
                    }
                  })
                ])
//                return `<i-button type="success" size="small" icon="eye" title="查看要求" @click="viewRequirements('${row.uuid}')"></i-button>`;
              } else {
                return '';
              }
            }
          }
        ]
      }
    },
    mounted() {
      this.searchForm();
    },
    methods: {
      searchForm(val) {
        if(val) this.pageIndex = val;
        let paramStr = this.paramStr, name = '', phone = '';;
        if(!paramStr) paramStr = '';
        if (isNaN(paramStr)) {
          name = paramStr;
        } else {
          phone = paramStr;
        }
        this.loadDataGrid({
          nameOrPhone: paramStr,
          name: name,
          phone: phone,
        },this.pageIndex);
      },
      getFullPhone(phone) {
        getFullPhone(phone, COMMON_API().getPhoneHZ, function(){});
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        // let param = `?name=${search.name}&phone=${search.phone}&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}`;
        let param = `?nameOrPhone=${search.nameOrPhone}&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}`;
        let paramCr = `?name=${search.name}&phone=${search.phone}&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}`;
        let roleName = localStorage.get('user').roleName;
        let apiUrl = "";
        if(roleName === "班主任"){
          apiUrl = SCS().WaitCourse.cr_dataGrid + paramCr;
        }else {
          apiUrl = SCS().WaitCourse.dataGrid + param;
        }
        const that = this;
        // common.ajax({
        //   url: apiUrl,
        //   method: 'get',
        //   success: function(response){
        //     that.data = response.data.courseOrderVos || [];
        //     that.total = response.data.total;
        //   }
        // });
        this.$axios.get(apiUrl,{
        }).then( ({data}) => {
          that.data = data.data.courseOrderVos || [];
          that.total = data.data.total;
        })
      },
      addRequirements(uuid) {
        sessionStorage.setItem('waitCourse_addRequirements_courseUuid',uuid);
        window.location.hash = '/scs/ccAddRequirements';
      },
      viewRequirements(uuid) {
        sessionStorage.setItem('waitCourse_viewRequirements_courseUuid',uuid);
        window.location.hash = '/scs/ccViewRequirements';
      },
      giveUpCourse(uuid) {
        const that = this;
        this.$Modal.confirm({
          title: '提示',
          content: '放弃课程后预约，不可恢复！',
          onOk: function() {
            // common.ajax({
            //   url: SCS().WaitCourse.giveUpCourse,
            //   data: {courseOrderUuid: uuid},
            //   success: function(response){
            //     common.notices('操作成功！');
            //     that.searchForm();
            //   }
            // });
            this.$axios.post(SCS().WaitCourse.giveUpCourse,{
              courseOrderUuid: uuid
            }).then( () => {
              common.notices('操作成功！');
              that.searchForm();
            })
          }
        });
      },
      currentData(currentRow) { this.currentRowData = currentRow;},
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      }
    },
    components: { OBreadcrumb,PageModel }
  };
</script>

<style>

</style>
