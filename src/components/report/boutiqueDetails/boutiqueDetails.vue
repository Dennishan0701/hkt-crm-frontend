<template>
  <div class="mc">
    <o-breadcrumb second="数据报表" third="精品课业绩明细"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span=24 class="right">
          <i-input :size="$store.state.searchModuleSize" v-model="Search.params" @on-keyup.enter="search(1)" clearable placeholder="学生姓名/手机号"
                   style="width:120px;margin-right:2px;"></i-input>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.subject" clearable clearable placeholder="科目" style="width:90px;">
            <i-option v-for="(item,index) in subjectList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.grade" clearable clearable placeholder="年级" style="width:90px;">
            <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.coursePriceType" clearable placeholder="课时包类型" style="width:120px">
            <i-option v-for="(item,index) in coursePriceTypeList" :key='index' :value="item.coursePriceType">{{
              item.coursePriceType }}
            </i-option>
          </i-select>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="search" @click="search(1)">搜索</i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" :height="theight" stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>


    <Modal
      v-model="model"
      :mask-closable="false"
      :closable="false"
      title="查看老师">
      <i-table size="small" :height="theight" stripe :columns="teacherColumns" :data="teacherData"></i-table>
    </Modal>

  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {REPORT} from 'common/api/report.js';
  import {common, formateDate, hideCharAtNumber, clearSearchForm, getFullPhone} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default{
    data() {
      return {
        data: [],
        total: 0,
        model: false,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        Search: {
          params: '',
          subject: '',
          grade: '',
          coursePriceType: '',
        },
        subjectList: [],
        gradeList: [],
        coursePriceTypeList: [],
        teacherData: [],
        teacherColumns: [
          {
            title: '科目',
            key: 'subject',
            align: 'center',
            width: 90
          },
          {
            title: '老师',
            key: 'teacherName',
            align: 'center',
            width: 90
          },
        ],
        columns: [
          {
            title: '销售',
            key: 'saleName',
            align: 'center',
            fixed: 'left',
            width: 90
          },
          {
            title: '所属团队',
            key: 'saleTeam',
            align: 'center',
            width: 90
          },
          {
            title: '学生',
            align: 'center',
            key: 'leadsName',
            width: 90,
          },
          {
            title: '学生手机号',
            align: 'center',
            key: 'leadsPhone',
            width: 120,
            render: (h, params) => {
              if (params.row.leadsPhone) {

                return h('div', [
                  h('span', hideCharAtNumber(params.row.leadsPhone)),
                  h('i', {
                    style: {
                      margin: '2px'
                    },
                    attrs: {
                      class: 'ivu-icon ivu-icon-ios-eye',
                      title: '显示全部'
                    },
                    style: {
                      fontSize: '18px',
                      verticalAlign: 'top',
                      cursor: 'pointer'
                    },
                    on: {
                      click: () => {
                        this.getFullPhone(params.row.leadsPhone)
                      }
                    }
                  })
                ])
//                return hideCharAtNumber(row.leadsPhone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.leadsPhone}')" class="eye" title="显示全部"></Icon>`
              } else {
                return '-';
              }
            }
          },
          {
            title: '号码归属地',
            align: 'center',
            key: 'phoneLocation',
            width: 120
          },
          {
            title: '课程包类型',
            key: 'coursePriceType',
            align: 'center',
            width: 90,
          },
          {
            title: '是否推荐',
            align: 'center',
            key: 'isRecommend',
            width: 90,
            render(h, params) {
              if (params.row.isRecommend === '0') {
                return h('span','否');
              } else if (params.row.isRecommend === '1') {
                return h('span','是');
              } else {
                return h('span','未知');
              }
            }
          },
          {
            title: '省',
            align: 'center',
            key: 'province',
            width: 90,
          },
          {
            title: '市',
            align: 'center',
            key: 'city',
            width: 90,
          },
          {
            title: '区',
            align: 'center',
            key: 'count',
            width: 90,
          },
          {
            title: '年级',
            align: 'center',
            key: 'grade',
            width: 90
          },
          {
            title: '科目',
            align: 'center',
            key: 'subject',
            width: 90
          },
          {
            title: '购买课时',
            align: 'center',
            key: 'buyLength',
            width: 90
          },
          {
            title: '购买级别',
            align: 'center',
            key: 'courseLevel',
            width: 120,
            render: (h, params) => {
              if (params.row.courseLevel === '0') {
                return h('span','普通');
              } else if (params.row.courseLevel === '1') {
                return h('div', [
                  h('span', {
                    attrs: {
                      class: 'c-success'
                    }
                  }, '清北')
                ])
//                return '<span class="c-success">清北</span>';
              } else if (params.row.courseLevel === '2') {
                return h('div', [
                  h('span', {
                    attrs: {
                      class: 'c-red'
                    }
                  }, '明星')
                ])
//                return '<span class="c-red">明星</span>';
              } else {
                return h('span',params.row.courseLevel);
              }
            }
          },
          {
            title: '金额',
            align: 'center',
            key: 'money',
            width: 90
          },
          {
            title: '支付方式',
            align: 'center',
            key: 'payType',
            width: 90,
            render(h, params) {
              if (params.row.payType === 'bank') {
                return h('span','银行支付');
              } else if (params.row.payType === 'taobao') {
                return h('span','淘宝');
              } else if (params.row.payType === 'alipay') {
                return h('span','支付宝');
              } else if (params.row.payType === 'weixin') {
                return h('span','微信');
              } else if (params.row.payType === 'kuStaging') {
                return h('span','库分期');
              } else if (params.row.payType === 'baiduStaging') {
                return h('span','百度分期');
              } else if (params.row.payType === 'lovehaimi') {
                return h('span','爱海米分期');
              } else {
                return h('span',params.row.payType);
              }
            }
          },
          {
            title: '课时包参与活动',
            align: 'center',
            key: 'courseActivitiyLevel',
            width: 120
          },
          {
            title: '参与活动',
            align: 'center',
            key: 'inActivity',
            width: 200
          },
          {
            title: '优惠码',
            align: 'center',
            key: 'promotionCode',
            width: 90
          },
          {
            title: '付费时间',
            align: 'center',
            key: 'payTime',
            width: 180,
            render(h, params) {
              return h('span',formateDate(params.row.payTime, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '提交时间',
            align: 'center',
            key: 'commitTime',
            width: 180,
            render(h, params) {
              return h('span',formateDate(params.row.commitTime, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '分配时间',
            align: 'center',
            key: 'updateTime',
            width: 180,
            render(h, params) {
              return h('span',formateDate(params.row.updateTime, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '审核状态',
            align: 'center',
            key: 'checkStatus',
            width: 120,
            render: (h, params) => {
              if (params.row.checkStatus === '0') {
                return h('div', [
                  h('span', {
                    attrs: {
                      class: 'o-tag yellow'
                    }
                  }, '待审核')
                ])
//                return '<span class="o-tag yellow">待审核</span>';
              } else if (params.row.checkStatus === '1') {
                return h('div', [
                  h('span', {
                    attrs: {
                      class: 'o-tag green'
                    }
                  }, '支付成功')
                ])
//                return '<span class="o-tag green">支付成功</span>';
              } else if (params.row.checkStatus === '2') {
                return h('div', [
                  h('span', {
                    attrs: {
                      class: 'o-tag red'
                    }
                  }, '支付失败')
                ])
//                return '<span class="o-tag red">支付失败</span>';
              } else if (params.row.checkStatus === '3') {
                return h('div', [
                  h('span', {
                    attrs: {
                      class: 'o-tag blue'
                    }
                  }, '已被拆单')
                ])
//                return '<span class="o-tag blue">已被拆单</span>';
              } else {
                return params.row.checkStatus;
              }
            }
          },
          {
            title: '操作',
            align: 'center',
            key: 'ispayDesc',
            width: 90,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small',
                    icon: 'eye',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs: {
                    title: '查看老师'
                  },
                  on: {
                    click: () => {
                      this.showTeacher(params.row.leadsUuid)
                    }
                  }
                })
              ])
//              return `<i-button type="info" icon="eye" size="small" title="查看老师" @click="showTeacher('${row.leadsUuid}')"></i-button>`;
            }
          }
        ]
      }
    },
    mounted() {
      const _this = this;
      this.search();

      $.getJSON("static/data.json", function (json) {
        _this.gradeList = json.gradeList;
        _this.subjectList = json.subjectList;
        console.log(json.subjectList);
      });

      //获取课时包类型
      common.ajax({
        url: COMMON_API().getCoursePriceType,
        method: 'get',
        success: function (response) {
          _this.coursePriceTypeList = response.data || [];
        }
      });
    },
    methods: {
      showTeacher(uuid){
        const _this = this;
        common.ajax({
          url: REPORT().boutique.getLeadsTeacher,
          data: {
            uuid: uuid
          },
          method: 'get',
          success: function (res) {
            _this.teacherData = res.data || [];
            _this.model = true;
          }
        });
      },
      search(val) {
          if(val) this.pageIndex = val;
        this.loadDataGrid({
          params: this.Search.params,
          subject: this.Search.subject,
          grade: this.Search.grade,
          coursePriceType: this.Search.coursePriceType,
        });
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?leadsParam=${search.params}&courseType=${search.coursePriceType}&subject=${search.subject}&grade=${search.grade}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: REPORT().boutique.dataGrid + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['courseServerDtos'] || [];
            _this.total = res.data['total'];
          }
        });
      },
      getFullPhone(phone) {
        getFullPhone(phone, COMMON_API().getPhoneHZ);
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.search();
      }
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470 : '';
      }
    },
    components: {OBreadcrumb ,PageModel}
  };
</script>

<style>

</style>
