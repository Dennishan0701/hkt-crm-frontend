<template>
  <div class="mc">
    <o-breadcrumb second="数据报表" third="团队分配统计"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" class="right">
            <Form-item prop="date" style="display:inline-block;margin-top: 3px;">
              <Date-picker :size="$store.state.searchModuleSize" type="daterange" v-model="formValidate.date" @on-change="changeUpdateDate" placement="bottom-end" placeholder="分配日期" style="width: 200px;"></Date-picker>
            </Form-item>
            <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm('formValidate')">搜索</i-button>
          </i-form>
        </i-col>
      </Row>
    </div>
    <i-table size="small" highlight-row stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange()"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
    <Modal
      v-model="modal"
      title="查看详情"
      width=600
      :mask-closable="false"
      :closable="false">
      <i-table size="small" highlight-row stripe :columns="columns1" :data="data1"></i-table>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API,TEACHER} from 'common/api.config.js';
  import {REPORT} from 'common/api/report.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      const validateDate = (rule, value, callback) => {
        if (!value[0]&&!value[1]) {
          callback(new Error('请选择查询的日期'));
        } else {
          callback();
        }
      };
      return {
        modal:false,
        formValidate: {
          data:'',
        },
        ruleValidate: {
          date: [
            { validator: validateDate, trigger: 'change' }
            // { required: true, message:'请选择查询的日期', trigger: 'change' }
          ],
        },
        data: [],
        data1: [],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11: 17,
        Search: {
          createDateStart: '',
          createDateEnd: '',
        },
        columns: [
          {
            title: '团队名称',
            key: 'teamName',
            align:'center',
            minWidth:90,
          },
          {
            title: '分配人数',
            key: 'leadsCount',
            align:'center',
            minWidth:90,
          },
          {
            title: '操作',
            align:'center',
            minWidth:90,
            render : (h, params) => {
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
                      this.checkDetail(params.row.teamUuid)
                    }
                  }
                },'查看详情')
              ])
            }
          },
        ],
        columns1: [
          {
            title: '销售姓名',
            key: 'saleName',
            align:'center',
            minWidth:90,
          },
          {
            title: '分配人数',
            key: 'leadsCount',
            align:'center',
            minWidth:90,
          },
        ],
      }
    },
    mounted() {
      // this.searchForm();
    },
    methods: {
      searchForm(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            // this.$Message.success('提交成功!');
            this.loadDataGrid({
              distributionStartDate: this.Search.createDateStart,
              distributionEndDate: this.Search.createDateEnd,
            });
          }else{
            console.log('Fail!');
          }
        })
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        this.$axios.post(REPORT().teamDistribution.teamDistributionList,{
          pageIndex:this.pageIndex,
          pageNumber:this.pageNumber,
          distributionStartDate: search.distributionStartDate,
          distributionEndDate: search.distributionEndDate,
        }).then( ({data}) => {
          console.log(data);
          this.data = data.data.teamDistributionList;
          this.total = data.data.total;
        })
      },
      changeUpdateDate(value) {
        this.Search.createDateStart = value[0] || '';
        this.Search.createDateEnd = value[1] || '';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm('formValidate');
      },
      checkDetail(teamUuid){
        this.modal = true;
        this.$axios.post(REPORT().teamDistribution.teamDistributionDetail,{
          pageIndex:this.pageIndex,
          pageNumber:this.pageNumber,
          distributionStartDate: this.Search.createDateStart,
          distributionEndDate: this.Search.createDateEnd,
          teamUuid: teamUuid,
        }).then( ({data}) => {
          // console.log(data);
          this.data1  = data.data.distributionDetail;
          // this.modal = false;
        })
      }
    },
    components: { OBreadcrumb,PageModel }
  };
</script>

<style>

</style>
