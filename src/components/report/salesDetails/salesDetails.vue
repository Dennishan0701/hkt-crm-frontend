<template>
  <div class="mc">
    <o-breadcrumb second="数据报表" third="销售业绩明细"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <i-input :size="$store.state.searchModuleSize" v-model="Search.name" @on-keyup.enter="searchForm(1)"
                   placeholder="学生" style="width:90px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.phone" @on-keyup.enter="searchForm(1)"
                   placeholder="手机号" style="width:150px;margin-right: 2px;"></i-input>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.grade" clearable placeholder="年级"
                    style="width:100px">
            <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.subject" @on-keyup.enter="searchForm(1)"
                   placeholder="科目" style="width:90px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.buyLength" @on-keyup.enter="searchForm(1)"
                   placeholder="课时" style="width:90px;margin-right:2px;"></i-input>

          <i-input :size="$store.state.searchModuleSize" v-model.number="Search.money" @on-keyup.enter="searchForm(1)"
                   placeholder="金额" style="width:90px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.saleName" @on-keyup.enter="searchForm(1)"
                   placeholder="所属销售" style="width:90px;margin-right:2px;"></i-input>
          <!--渠道名称-->
          <i-select :size="$store.state.searchModuleSize" v-model="Search.channelUuid" filterable clearable
                    placeholder="渠道名称" style="width:150px;">
            <i-option v-for="(item,index) in allChannelList" :key='index' :value="item.uuid">{{ item.name }}</i-option>
          </i-select>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.promotionCode" @on-keyup.enter="searchForm(1)"
                   placeholder="优惠码" style="width:120px;margin-right:2px;"></i-input>
          <i-input :size="$store.state.searchModuleSize" v-model="Search.teamName" @on-keyup.enter="searchForm(1)"
                   placeholder="团队" style="width:120px;margin-right:2px;"></i-input>
        </i-col>
      </Row>
      <Row>
        <i-col span="24" class="right">
          <i-select :size="$store.state.searchModuleSize" v-model="Search.coursePriceType" clearable placeholder="课时包类型"
                    style="width:100px">
            <i-option v-for="(item,index) in coursePriceTypeList" :key='index' :value="item.coursePriceType">
              {{ item.coursePriceType }}
            </i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.isRecommend" clearable placeholder="是否推荐"
                    style="width:90px">
            <i-option value="true">是</i-option>
            <i-option value="false">否</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.courseLevel" clearable placeholder="课时级别"
                    style="width:90px">
            <i-option value="0" label="普通"><span>普通</span></i-option>
            <i-option value="1" label="清北"><span class="c-success">清北</span></i-option>
            <i-option value="2" label="明星"><span class="c-red">明星</span></i-option>
          </i-select>

          <i-select :size="$store.state.searchModuleSize" v-model="Search.checkStatus" placeholder="审核状态"
                    style="width:90px">
            <i-option value="0">待审核</i-option>
            <i-option value="1">支付成功</i-option>
            <i-option value="2">支付失败</i-option>
            <i-option value="3">已被拆单</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.payType" placeholder="付费方式"
                    style="width:100px">
            <i-option value="bank">银行转账</i-option>
            <i-option value="taobao">淘宝</i-option>
            <i-option value="alipay">支付宝</i-option>
            <i-option value="weixin">微信</i-option>
            <i-option value="kuStaging">库分期</i-option>
            <i-option value="baiduStaging">百度分期</i-option>
            <i-option value="lovehaimi">爱海米分期</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.provinceId" :label-in-value="true"
                    :clearable="true" filterable @on-change="changeSelectedCity" placeholder="省" style="width:110px">
            <i-option v-for="(item,index) in provinceList" :key='index' :value="item.id">{{ item.name }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.cityId" :label-in-value="true"
                    :clearable="true" @on-change="changeSelectedArea" placeholder="市" style="width:110px">
            <i-option v-for="(item,index) in cityArrays" :key='index' :value="item.id">{{ item.name }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.countId" :label-in-value="true"
                    :clearable="true" @on-change="changeSelectedCount" placeholder="区" style="width:110px">
            <i-option v-for="(item,index) in areaList" :key='index' :value="item.id">{{ item.name }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.schoolName" :label-in-value="true"
                    :clearable="true" placeholder="学校" style="width:150px">
            <i-option v-for="(item,index) in schoolNameList" :key='index' :value="item.schoolname">{{ item.schoolname
              }}
            </i-option>
          </i-select>
        </i-col>
        <i-col span=24  class="right">
          <i-select :size="$store.state.searchModuleSize" v-model="Search.courseActivityType" placeholder="课时包活动类别"
                    style="width:120px">
            <i-option value="常规">常规</i-option>
            <i-option value="暑秋联报">暑秋联报</i-option>
            <i-option value="常规暑秋联报">常规暑秋联报</i-option>
            <i-option value="精品暑秋联报">精品暑秋联报</i-option>
            <i-option value="寒假联报">寒假联报</i-option>
            <i-option value="夏令营">夏令营</i-option>
            <i-option value="暑期专题">暑期专题</i-option>
            <i-option value="特殊">特殊</i-option>
            <i-option value="399系列">399系列</i-option>
            <i-option value="9999系列">9999系列</i-option>
          </i-select>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-start"
                       @on-change="changePayTime" ref='payTime' placeholder="付费时间" style="width: 200px"></Date-picker>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-start"
                       @on-change="changePayCommitTime" ref='payCommitTime' placeholder="付费提交时间"
                       style="width: 200px"></Date-picker>
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" placement="bottom-end"
                       @on-change="firstDistribition" ref='DistribitionTime' placeholder="分配时间"
                       style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索
          </i-button>
          <i-button :size="$store.state.searchModuleSize" type="ghost" @click="clearSearchForm">重置</i-button>
          <i-button :size="$store.state.searchModuleSize" v-show="isShow" type="primary" icon="ios-download-outline"
                    @click="exportExcel">导出
          </i-button>
        </i-col>
      </Row>
    </div>
    <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
      <checkbox label="teamName">所属团队</checkbox>
      <checkbox label="channelName">渠道名称</checkbox>
      <checkbox label="leadsName">学生</checkbox>
      <checkbox label="leadsPhone">手机号</checkbox>
      <checkbox label="phoneLocaltion">号码归属地</checkbox>
      <checkbox label="coursePriceType">课程包类型</checkbox>
      <checkbox label="isRecommendDesc">是否推荐</checkbox>
      <checkbox label="province">省</checkbox>
      <checkbox label="city">市</checkbox>
      <checkbox label="count">区/县</checkbox>
      <checkbox label="grade">年级</checkbox>
      <checkbox label="subject">科目</checkbox>
      <checkbox label="buyLength">购买课时</checkbox>
      <checkbox label="courseLevel">购买级别</checkbox>
      <checkbox label="money">金额</checkbox>
      <checkbox label="payType">支付方式</checkbox>
      <checkbox label="courseActivitiyLevel">课时包参与活动</checkbox>
      <checkbox label="inActivities">参与活动</checkbox>
      <checkbox label="promotionCode">优惠码</checkbox>
      <checkbox label="payTime">付费时间</checkbox>
      <checkbox label="commitTime">提交时间</checkbox>
      <checkbox label="updateTime">分配时间</checkbox>
      <checkbox label="checkStatus">审核状态</checkbox>
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
  import {REPORT} from 'common/api/report.js';
  import {formateDate, common, hideCharAtNumber, clearSearchForm} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default {
    data() {
      return {
        allChannelList: [],
        data: [],
        tableColumnsChecked: ['channelName','teamName', 'leadsName', 'leadsPhone', 'phoneLocaltion', 'coursePriceType', 'isRecommendDesc',
          'province', 'city', 'count', 'grade', 'subject', 'buyLength', 'courseLevel', 'money', 'payType', 'courseActivitiyLevel',
          'inActivities', 'promotionCode', 'payTime', 'commitTime', 'updateTime', 'checkStatus'],
        total: 0,
        pageIndex: 1,
        pageNumber: (SCREEN_SIZE === 'md') ? 11 : 17,
        schoolNameList: [],//学校
        provinceList: [],
        cityArrays: [],
        areaList: [],
        coursePriceTypeList: [],
        province: '',
        city: '',
        count: '',
        isShow: '',
        Search: {
          name: '',
          phone: '',
          grade: '',
          isRecommend: '',
          coursePriceType: '',
          subject: '',
          buyLength: '',
          courseLevel: '',
          money: '',
          saleName: '',
          teamName: '',
          payType: '',
          courseActivityType: '',
          channelUuid: '',
          promotionCode: '',
          payStartTime: '',
          payEndTime: '',
          commitStartTime: '',
          commitEndTime: '',
          firstDistribitionStartTime: '',
          firstDistribitionEndTime: '',
          checkStatus: '',
          provinceId: '',
          schoolName: '',//学校
          cityId: '',
          countId: '',
        },
        gradeList: [],
        columns: []
      }
    },
    mounted() {
      this.getAllChannel();
      this.searchForm();
      this.changeTableColumns();

      const _this = this;
      $.getJSON("static/data.json", function (json) {
        _this.gradeList = json.gradeList || [];
      });
      //获取省
      common.ajax({
        url: COMMON_API().ssqAreaAllStudy,
        method: 'get',
        data: {parentid: 1},
        success: function (response) {
          _this.provinceList = response.data || [];
        }
      });
      //获取课时包类型
      common.ajax({
        url: REPORT().Sale.getCoursePriceType,
        method: 'get',
        success: function (response) {
          _this.coursePriceTypeList = response.data || [];
        }
      });
    },
    methods: {
      getTableColumns() {
        const columns = {
          saleName: {
            title: '销售',
            key: 'saleName',
            align: 'center',
            fixed: 'left',
            minWidth: 90,
            render: (h, params) => {
              return h('div', [
                h('strong', {}, params.row.saleName)
              ])
//          return `<strong>${row.saleName}</strong>`;
            }
          },
          teamName: {
            title: '所属团队',
            key: 'teamName',
            align: 'center',
            minWidth: 100,
          },
          channelName: {
            title: '渠道名称',
            key: 'channelName',
            align: 'center',
            minWidth: 90
          },
          leadsName: {
            title: '学生',
            key: 'leadsName',
            align: 'center',
            minWidth: 90,
            render: (h, params) => {
              return h('div', [
                h('a', {
                  on: {
                    click: () => {
                      GLOBAL.viewLeadsDetail(params.row.leadsUuid)
                    }
                  }
                }, params.row.leadsName)
              ])
//          return `<a href="javascript:viewLeadsDetail('${row.leadsUuid}');">${row.leadsName}</a>`;
            }
          },
          leadsPhone: {
            title: '学生手机号',
            key: 'leadsPhone',
            align: 'center',
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
          phoneLocaltion: {
            title: '号码归属地',
            minWidth: 90,
            key: 'phoneLocaltion',
            align: 'center',
          },
          coursePriceType: {
            title: '课程包类型',
            minWidth: 90,
            key: 'coursePriceType',
            align: 'center',
          },
          isRecommendDesc: {
            title: '是否推荐',
            minWidth: 90,
            key: 'isRecommendDesc',
            align: 'center',
          },
          province: {
            title: '省',
            minWidth: 90,
            key: 'province',
            align: 'center',
          },
          city: {
            title: '市',
            key: 'city',
            minWidth: 90,
            align: 'center',
          },
          count: {
            title: '区/县',
            minWidth: 90,
            key: 'count',
            align: 'center',
          },
          grade: {
            title: '年级',
            key: 'grade',
            align: 'center',
            minWidth: 90,
          },
          subject: {
            title: '科目',
            key: 'subject',
            align: 'center',
            minWidth: 90,
          },
          buyLength: {
            title: '购买课时',
            key: 'buyLength',
            align: 'center',
            minWidth: 90,
          },
          courseLevel: {
            title: '购买级别',
            key: 'courseLevel',
            align: 'center',
            minWidth: 90,
            render: (h, params) => {
              if (params.row.courseLevel === '0') {
                return h('span', '普通');
              } else if (params.row.courseLevel === '1') {
                return h('div', [
                  h('span', {
                    attrs: {
                      class: 'c-success'
                    }
                  }, '清北')
                ])
//            return '<span class="c-success">清北</span>';
              } else if (params.row.courseLevel === '2') {
                return h('div', [
                  h('span', {
                    attrs: {
                      class: 'c-red'
                    }
                  }, '明星')
                ])
//            return '<span class="c-red">明星</span>';
              } else {
                return h('span', params.row.courseLevel);
              }
            }
          },
          money: {
            title: '金额',
            key: 'money',
            align: 'center',
            minWidth: 90,
          },
          payType: {
            title: '支付方式',
            key: 'payType',
            align: 'center',
            minWidth: 100,
            render(h, params) {
              if (params.row.payType === 'bank') {
                return h('span', '银行支付');
              } else if (params.row.payType === 'taobao') {
                return h('span', '淘宝');
              } else if (params.row.payType === 'alipay') {
                return h('span', '支付宝');
              } else if (params.row.payType === 'weixin') {
                return h('span', '微信');
              } else if (params.row.payType === 'kuStaging') {
                return h('span', '库分期');
              } else if (params.row.payType === 'baiduStaging') {
                return h('span', '百度分期');
              } else if (params.row.payType === 'lovehaimi') {
                return h('span', '爱海米分期');
              } else {
                return h('span', params.row.payType);
              }
            }
          },
          courseActivitiyLevel: {
            title: '课时包参与活动',
            key: 'courseActivitiyLevel',
            align: 'center',
            minWidth: 120
          },
          inActivities: {
            title: '参与活动',
            key: 'inActivities',
            align: 'center',
            minWidth: 200
          },
          promotionCode: {
            title: '优惠码',
            key: 'promotionCode',
            align: 'center',
            minWidth: 120,
          },
          payTime: {
            title: '付费时间',
            key: 'payTime',
            minWidth: 180,
            align: 'center',
            render(h, params) {
              return h('span', formateDate(params.row.payTime, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          commitTime: {
            title: '提交时间',
            key: 'commitTime',
            minWidth: 180,
            align: 'center',
            render(h, params) {
              return h('span', formateDate(params.row.commitTime, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          updateTime: {
            title: '分配时间',
            key: 'updateTime',
            minWidth: 180,
            align: 'center',
            render(h, params) {
              return h('span', formateDate(params.row.updateTime, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          checkStatus: {
            title: '审核状态',
            key: 'checkStatus',
            align: 'center',
            minWidth: 120,
            render: (h, params) => {
              if (params.row.checkStatus === '0') {
                return h('div', [
                  h('span', {
                    attrs: {
                      class: 'o-tag yellow'
                    }
                  }, '待审核')
                ])
//            return '<span class="o-tag yellow">待审核</span>';
              } else if (params.row.checkStatus === '1') {
                return h('div', [
                  h('span', {
                    attrs: {
                      class: 'o-tag green'
                    }
                  }, '支付成功')
                ])
//            return '<span class="o-tag green">支付成功</span>';
              } else if (params.row.checkStatus === '2') {
                return h('div', [
                  h('span', {
                    attrs: {
                      class: 'o-tag red'
                    }
                  }, '支付失败')
                ])
//            return '<span class="o-tag red">支付失败</span>';
              } else if (params.row.checkStatus === '3') {
                return h('div', [
                  h('span', {
                    attrs: {
                      class: 'o-tag blue'
                    }
                  }, '已付定金')
                ])
//            return '<span class="o-tag blue">已被拆单</span>';
              } else {
                return params.row.checkStatus;
              }
            }
          },
        };
        let datas = [columns.saleName];
        this.tableColumnsChecked.forEach(col => datas.push(columns[col]));
        return datas;
      },

      exportExcel() {
        if (this.Search.commitStartTime === '') {
          const _this = this;
          this.$Modal.confirm({
            title: '导出',
            content: '没有选择付费提交时间，默认导出当月',
            onOk() {
              _this.exportData();
            }
          });
        } else {
          this.exportData();
        }
      },
      exportData() {
        let apiUrl = REPORT().Sale.exportSalesDetails;
        apiUrl += '?commitStartTime=' + this.Search.commitStartTime + '&coursePriceType=' + this.Search.coursePriceType + '&commitEndTime=' + this.Search.commitEndTime;
        apiUrl += '&token=' + localStorage.getItem('token');
        GLOBAL.newTab(apiUrl, true);
      },
      //省市区
      changeSelectedCity(areaName) {
        const _this = this;
        if (areaName.label && areaName.value) {
          _this.province = areaName.label;
          //获取城市
          common.ajax({
            url: COMMON_API().ssqAreaAllStudy,
            method: 'get',
            data: {parentid: areaName.value},
            success: function (response) {
              _this.cityArrays = response.data || [];
            }
          });
        }
      },
      changeSelectedArea(areaName) {
        const _this = this;
        //获取城市的区域
        if (areaName.label && areaName.value) {
          _this.city = areaName.label;
          common.ajax({
            url: COMMON_API().ssqAreaAllStudy,
            method: 'get',
            data: {parentid: areaName.value},
            success: function (response) {
              _this.areaList = response.data || [];
            }
          });
        }
      },
      changeSelectedCount(areaName) {
        const _this = this;
        if (areaName.label && areaName.value) {
          _this.count = areaName.label;
          //获取所有学校
          common.ajax({
            url: COMMON_API().allStudySchool,
            method: 'get',
            data: {provinceId: _this.Search.provinceId, cityId: _this.Search.cityId, countyId: areaName.value},
            success: function (response) {
              _this.schoolNameList = response.data || [];
            }
          });
        }
      },
      searchForm(val) {
        if (val) this.pageIndex = val;
        this.loadDataGrid({
          channelUuid: this.Search.channelUuid || '',
          name: this.Search.name,
          phone: this.Search.phone,
          grade: this.Search.grade,
          subject: this.Search.subject,
          coursePriceType: this.Search.coursePriceType,
          isRecommend: this.Search.isRecommend,
          buyLength: this.Search.buyLength,
          courseLevel: this.Search.courseLevel,
          money: this.Search.money,
          saleName: this.Search.saleName,
          teamName: this.Search.teamName,
          payType: this.Search.payType,
          courseActivityType: this.Search.courseActivityType,
          promotionCode: this.Search.promotionCode,
          payStartTime: this.Search.payStartTime,
          payEndTime: this.Search.payEndTime,
          commitStartTime: this.Search.commitStartTime,
          commitEndTime: this.Search.commitEndTime,
          firstDistribitionStartTime: this.Search.firstDistribitionStartTime,
          firstDistribitionEndTime: this.Search.firstDistribitionEndTime,
          checkStatus: this.Search.checkStatus,
          schoolName: this.Search.schoolName,
          province: this.province || '',
          city: this.city || '',
          count: this.count || '',
        });
      },
      clearSearchForm() {
        clearSearchForm(this.Search, [this.$refs.payTime, this.$refs.payCommitTime, this.$refs.DistribitionTime], this);
        this.province = '';
        this.city = '';
        this.count = '';
        // this.searchForm();
      },
      loadDataGrid(search, orderBy = '', sortBy = '') {
        let param = `?isRecommend=${search.isRecommend}&coursePriceType=${search.coursePriceType}&name=${search.name}&phone=${search.phone}&grade=${search.grade}&subject=${search.subject}&buyLength=${search.buyLength}&courseLevel=${search.courseLevel}&channelUuid=${search.channelUuid}`;
        param += `&money=${search.money}&saleName=${search.saleName}&teamName=${search.teamName}&payType=${search.payType}&promotionCode=${search.promotionCode}`;
        param += `&courseActivityType=${search.courseActivityType}&payStartTime=${search.payStartTime}&payEndTime=${search.payEndTime}&checkStatus=${search.checkStatus}`;
        param += `&commitStartTime=${search.commitStartTime}&commitEndTime=${search.commitEndTime}&firstDistribitionStartTime=${search.firstDistribitionStartTime}&firstDistribitionEndTime=${search.firstDistribitionEndTime}`;
        param += `&schoolName=${search.schoolName}&province=${search.province}&city=${search.city}&count=${search.count}&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        common.ajax({
          url: REPORT().Sale.salesDetails + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['detailKpiVos'] || [];
            _this.total = res.data.total;
            _this.isShow = res.data.isClose;
          }
        });
      },
      changePayCommitTime(value) {
        this.Search.commitStartTime = value[0] || '';
        this.Search.commitEndTime = value[1] || '';
      },
      firstDistribition(value) {
        this.Search.firstDistribitionStartTime = value[0] || '';
        this.Search.firstDistribitionEndTime = value[1] || '';
      },
      changePayTime(value) {
        this.Search.payStartTime = value[0] || '';
        this.Search.payEndTime = value[1] || '';
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm();
      },
      // 获取所有渠道
      getAllChannel() {
        const _this = this;
        common.ajax({
          url: COMMON_API().allChannel,
          method: 'get',
          success: function (response) {
            _this.allChannelList = response.data || [];
          }
        });
      },
      changeTableColumns() {
        this.columns = this.getTableColumns();
      }
    },
    computed: {
      theight() {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470 : '';
      }
    },
    components: {OBreadcrumb, PageModel}
  };
</script>

<style>

</style>
