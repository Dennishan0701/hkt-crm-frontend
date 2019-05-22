<template>
<div>
  <o-breadcrumb second="师资管理" third="回收站"></o-breadcrumb>
  <div class="grid-widget right">
    <Row>
      <i-col span="24">
        <i-input :size="$store.state.searchModuleSize" v-model="Search.tcName" @on-keyup.enter="searchForm(1)" placeholder="姓名" style="width:150px;margin-right:2px;"></i-input>
        <i-input :size="$store.state.searchModuleSize" v-model="Search.phone" @on-keyup.enter="searchForm(1)" placeholder="手机号" style="width:150px;margin-right: 2px;"></i-input>
        <i-select :size="$store.state.searchModuleSize" v-model="Search.natureOfWork" placeholder="工作性质" style="width:172px">
          <i-option :value="1">校招全职</i-option>
          <i-option :value="2">兼职</i-option>
          <i-option :value="3">社招全职</i-option>
        </i-select>
        <i-select :size="$store.state.searchModuleSize" v-model="Search.schoolLocation" filterable clearable placeholder="院校" style="width:200px">
          <i-option v-for="(item,index) in schoolList" :key='index' :value="item.uuid">{{ item.schoolName }}</i-option>
        </i-select>
        <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索</i-button>
      </i-col>
    </Row>
  </div>
  <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
    <checkbox label="phone">手机号</checkbox>
    <checkbox label="referral">推荐人</checkbox>
    <checkbox label="invitationUser">邀约人</checkbox>
    <checkbox label="interviewUser">面试人</checkbox>
    <checkbox label="natureOfWorkDesc">工作性质</checkbox>
    <checkbox label="schoolLocation">院校</checkbox>
    <checkbox label="registrationTime">首次报名时间</checkbox>
    <checkbox label="interviewResultDesc">面试结果</checkbox>
    <checkbox label="interviewRemark">面试备注</checkbox>
    <checkbox label="giveUpDate">放弃时间</checkbox>
  </checkbox-group>
  <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>
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
        tableColumnsChecked:['phone','referral','invitationUser','interviewUser','natureOfWorkDesc',
          'schoolLocation','registrationTime','interviewResultDesc','interviewRemark','giveUpDate', 'action'],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11: 17,
        Search: {
          tcName: '',
          phone: '',
          schoolLocation: '',
          natureOfWork: ''
        },
        schoolList: [],
        columns: [

        ]
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
          _this.schoolList = response.data || [];
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
          align:'center',
          width: 120,
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
          referral:{
          title: '推荐人',
            align:'center',
          key: 'referral',
          width: 90,
        },
          invitationUser:{
          title: '邀约人',
            align:'center',
          key: 'invitationUser',
          width: 90,
        },
          interviewUser:{
          title: '面试人',
            align:'center',
          key: 'interviewUser',
          width: 90,
        },
          natureOfWorkDesc:{
          title: '工作性质',
            align:'center',
          key: 'natureOfWorkDesc',
          width: 100,
        },
          schoolLocation:{
          title: '院校',
            key: 'schoolLocation',
          align:'center',
          width: 120
        },
          registrationTime:{
          title: '首次报名时间',
            key: 'registrationTime',
          align:'center',
          width: 150,
          // render (row, column, index) {
          //   return formateDate(row.registrationTime,'yyyy-MM-dd hh:mm:ss');
          // },
          render:(h,params) =>{
            return h('div',[
              h('span',{},formateDate(params.row.registrationTime,'yyyy-MM-dd hh:mm:ss'))
            ])
          }
        },
          interviewResultDesc:{
          title: '面试结果',
            key: 'interviewResultDesc',
          align:'center',
          width: 120
        },
          interviewRemark: {
          title: '面试备注',
            align:'center',
          key: 'interviewRemark',
          width: 250,
          // render (row,column,index){
          //   let content = row.interviewRemark;
          //   if(content && content.length>40) {
          //     content = content.slice(0,39)+'...';
          //     return `<span title="${row.interviewRemark}">${content}</span>`;
          //   } else {
          //     return content;
          //   }
          // },
          render: (h,params) => {
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
          giveUpDate:{
          title: '放弃时间',
            align:'center',
          key: 'giveUpDate',
          width: 180,
          // render (row, column, index) {
          //   return formateDate(row.giveUpDate,'yyyy-MM-dd hh:mm:ss');
          // },
          render:(h,params) =>{
            return h('div',[
              h('span',{},formateDate(params.row.giveUpDate,'yyyy-MM-dd hh:mm:ss'))
            ])
          }
        },
        action:{
          title: '操作',
            width: 100,
          align:'center',
          fixed:'right',
          // render (row, column, index) {
          //   return `<i-button type="warning" icon="arrow-return-right" title="回收面试" size="small" @click="interview('${row.uuid}','${row.tcName}')"></i-button>`;
          // },
          render : (h, params) => {
            return h('div',[
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small',
                  icon: 'arrow-return-right',
                },
                attrs: {
                  title: '回收面试',
                },
                style: {
                  margin: '2px',
                },
                on: {
                  click: () => {
                    this.interview(params.row.uuid,params.row.tcName);
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
      interview(uuid, tcName) {
        const _this = this;
        this.$Modal.confirm({
          title: '确认',
          content: `您确认将<span style="color: red;">【${tcName}】</span>恢复到待邀约中？`,
          onOk() {
            common.ajax({
              url: TEACHER().Recover.rollBackInterview,
              method: 'post',
              data: {
                uuid: uuid
              },
              success: function(response){
                common.notices('您可以到【招师流程】【待邀约】中查看','操作成功');
                _this.searchForm();
              }
            });
          }
        });
      },
      getFullPhone(teacherUuid) {
        const _this = this;
        common.ajax({
          url: TEACHER().Public.displayPhone,
          method: 'get',
          data: { uuid: teacherUuid, moduleName: '师资管理-回收站' },
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
          schoolLocation: this.Search.schoolLocation,
          natureOfWork: this.Search.natureOfWork
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?tcName=${search.tcName}&phone=${search.phone}&schoolLocation=${search.schoolLocation}&natureOfWork=${search.natureOfWork}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: TEACHER().Recover.dataGrid + param,
          method: 'get',
          success: function(response){
            _this.data = response.data.teacherList || [];
            _this.total = response.data.total;
          }
        });
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
    components: { OBreadcrumb ,PageModel}
  };
</script>

<style>

</style>
