<template>
  <div class="mc">
    <o-breadcrumb second="数据报表" third="正式生数据"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span=24 class="right">
          <i-input :size="$store.state.searchModuleSize" v-model="Search.name" @on-keyup.enter="search(1)" placeholder="学生姓名" style="width:100px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.phone" @on-keyup.enter="search(1)" placeholder="手机号" style="width:100px;margin-right:2px;"></i-input>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.keyPoint" clearable placeholder="状态" style="width:120px;">
            <!--<i-option value="0">暂未被标记</i-option>-->
            <i-option value="0" label="未被标记"><span><Icon type="record"></Icon> 未被标记</span></i-option>
            <i-option value="1" label="本月可维护"><span><Icon type="record" class="c-primary"></Icon> 本月可维护</span></i-option>
            <i-option value="2" label="本月可续费"><span><Icon type="record" class="c-warning"></Icon> 本月可续费</span></i-option>
            <i-option value="3" label="常规维护"><span><Icon type="record" class="c-grey"></Icon> 常规维护</span></i-option>
            <i-option value="4" label="本月重点维护"><span><Icon type="record" class="c-error"></Icon> 本月重点维护</span></i-option>
            <i-option value="5" label="退费"><span><Icon type="record" class="c-error"></Icon> 退费</span></i-option>
            <i-option value="6" label="结课"><span><Icon type="record" class="c-error"></Icon> 结课</span></i-option>
            <i-option value="7" label="停课"><span><Icon type="record" class="c-error"></Icon> 停课</span></i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.grade" clearable placeholder="年级" style="width:80px;">
            <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.subject" clearable placeholder="科目" style="width:80px;">
            <i-option v-for="(item,index) in subjectList" :key='index' :value="item">{{ item }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.ccTeam" clearable placeholder="所属CC团队" style="width:80px;">
            <i-option v-for="(item,index) in ccTeamList" :key='index' :value="item.name">{{ item.name }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.crTeam" clearable placeholder="所属CR团队" style="width:80px;">
            <i-option v-for="(item,index) in crTeamList" :key='index' :value="item.name">{{ item.name }}</i-option>
          </i-select>

          <!--<i-input v-model="Search.crTeam" @on-keyup.enter="search" size="small" placeholder="所属CR团队" style="width:100px;margin-right:2px;"></i-input>-->
        </i-col>
        <i-col span=24 class="right">
          <i-input :size="$store.state.searchModuleSize" v-model="Search.ccName" @on-keyup.enter="search(1)" placeholder="签单CC" style="width:100px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.crName" @on-keyup.enter="search(1)" placeholder="跟进CR" style="width:100px;margin-right:2px;"></i-input>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" @on-change="changeHandOutDate" placement="bottom-end" ref="handeout" placeholder="移交时间" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="search" @click="search(1)">搜索</i-button>
          <i-button :size="$store.state.searchModuleSize" type="ghost" @click="clearSearch">重置</i-button>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-download-outline" @click="exportExcel">导出</i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
    <hand-out-remark ref="handOutRemark"></hand-out-remark>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {REPORT} from 'common/api/report.js';
  import {common, formateDate, hideCharAtNumber, clearSearchForm} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import handOutRemark from 'components/sc/contractStudents/handOutRemark';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        crTeamList:[],
        ccTeamList:[],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md'?11: 15,
        Search: {
          name: '',
          phone: '',
          subject: '',
          grade: '',
          ccName: '',
          crName: '',
          crTeam: '',
          ccTeam: '',
          keyPoint: '',
          handOutStartTime: '',
          handOutEndTime: ''
        },
        subjectList: [],
        gradeList: [],
        columns: [
          {
            title: '标记状态',
            align:'center',
            key: 'keyPoint',
            minWidth: 90
          },
          {
            title: '学生姓名',
            key: 'leadsName',
            align:'center',
            minWidth: 90
          },
          {
            title: '手机号',
            key: 'leadsPhone',
            align:'center',
            minWidth: 120,
            render : (h, params) => {
              if(params.row.leadsPhone) {
                return h('div',[
                  h('span',hideCharAtNumber(params.row.leadsPhone)),
                ])
              }else{
                return '-';
              }
            }
          },
          {
            title: '年级',
            key: 'grade',
            align:'center',
            minWidth: 90
          },
          {
            title: '科目',
            key: 'subject',
            align:'center',
            minWidth: 90
          },
          {
            title: '签单CC',
            key: 'ccName',
            align:'center',
            minWidth: 90
          },
          {
            title: '所属CC团队',
            key: 'ccTeam',
            align:'center',
            minWidth: 90
          },
          {
            title: '跟进CR',
            key: 'crName',
            align:'center',
            minWidth: 90
          },
          {
            title: '所属CR团队',
            key: 'crTeam',
            align:'center',
            minWidth: 90
          },
          {
            title: '移交备注',
            key: 'handOutRemark',
            align:'center',
            minWidth: 120,
            render : (h, params) => {

            return h('div',[
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                  icon: 'ios-eye',
                },
                style: {
                  margin: '2px',
                },
                attrs:{
                  title:'查看移交表'
                },
                on: {
                  click: () => {
                  this.getHandOutRemark(params.row.leadsUuid)
              }
          }
      })
    ])
//              return `<i-button type="success" icon="ios-eye" title="查看移交表" size="small" @click="getHandOutRemark('${row.leadsUuid}')"></i-button>`
//              let content = row.handOutRemark;
//              if(content && content.length>38) {
//                content = content.slice(0,37)+'...';
//                return `<span title="${row.handOutRemark}">${content}</span>`;
//              } else {
//                return content;
//              }
            }
          },
          {
            title: '移交时间',
            key: 'handOutTime',
            align:'center',
            minWidth: 150,
            render(h, params) {
              return h('span',formateDate(params.row.handOutTime,'yyyy-MM-dd hh:mm:ss'));
            }
          },
        ]
      }
    },
    mounted() {
      const _this = this;
      this.search();
      common.ajax({
        url: COMMON_API().allSubject,
        method: 'get',
        success: function (res) {
          _this.subjectList = res.data || [];
        }
      });
//      获取cc团队
      common.ajax({
        url: COMMON_API().ccTeamList,
        method: 'get',
        success: function (res) {
          _this.ccTeamList = res.data || [];
        }
      });
//      获取cr团队
      common.ajax({
        url: COMMON_API().crTeamList,
        method: 'get',
        success: function (res) {
          _this.crTeamList = res.data || [];
        }
      });
      $.getJSON("static/data.json", function (json) {
        _this.gradeList = json.gradeList;
      });
    },
    methods: {
      exportExcel() {
        if(this.Search.commitStartTime === '') {
          const _this = this;
          this.$Modal.confirm({
            title: '导出',
            content: '没有选择付费提交时间，默认导出当月',
            onOk() {
              _this.exportData();
            }
          });
        }else{
          this.exportData();
        }
      },
      exportData() {
        let apiUrl = REPORT().Leads.exportSalesDetails;
        apiUrl += '?keyPoint='+ this.Search.keyPoint+'&name='+this.Search.name+'&phone='+this.Search.phone+'&grade='+this.Search.grade+'&subject='+this.Search.subject+'&ccName='+this.Search.ccName+'&ccTeam='+this.Search.ccTeam+'&crName='+this.Search.crName+'&crTeam='+this.Search.crTeam+'&handOutStartTime='+this.Search.handOutStartTime+'&handOutEndTime='+this.Search.handOutEndTime+'&handOutStartTime='+this.Search.handOutStartTime;
        apiUrl += '&token=' + localStorage.getItem('token');
        console.log(apiUrl);
        GLOBAL.newTab(apiUrl,true);
      },
//      查看移交表
      getHandOutRemark(leadsUuid){
        this.$refs.handOutRemark.show(leadsUuid,'get');
      },
      search(val) {
          if(val) this.pageIndex = val;
        this.loadDataGrid({
          name: this.Search.name,
          phone: this.Search.phone,
          subject: this.Search.subject,
          grade: this.Search.grade,
          ccName: this.Search.ccName,
          crName: this.Search.crName,
          crTeam: this.Search.crTeam,
          ccTeam: this.Search.ccTeam,
          keyPoint: this.Search.keyPoint,
          handOutStartTime: this.Search.handOutStartTime,
          handOutEndTime: this.Search.handOutEndTime
        });
      },
      clearSearch() {
        clearSearchForm(this.Search, [this.$refs.handeout]);
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?keyPoint=${search.keyPoint}&name=${search.name}&phone=${search.phone}&subject=${search.subject}&grade=${search.grade}&ccName=${search.ccName}&crName=${search.crName}`;
        param += `&crTeam=${search.crTeam}&ccTeam=${search.ccTeam}&handOutStartTime=${search.handOutStartTime}&handOutEndTime=${search.handOutEndTime}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: REPORT().Leads.getStudentInfo + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['studentVos'] || [];
            _this.total = res.data['total'];
          }
        });
      },
      changeHandOutDate(value) {
        this.Search.handOutStartTime = value[0] || '';
        this.Search.handOutEndTime = value[1] || '';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.search();
      }
    },
    components: { OBreadcrumb ,handOutRemark,PageModel}
  };
</script>

<style>

</style>
