<template>
  <div>
    <o-breadcrumb second="分配管理" third="新名单分配"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="4">
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="paper-airplane" @click="showSalesModal">
            批量分配
          </i-button>
        </i-col>
        <i-col span="20" class="right">
          <!--<Radio-group v-model="radioType">-->
          <!--<Radio value="S名单"></Radio>-->
          <!--<Radio value="推荐"></Radio>-->
          <!--</Radio-group>-->
          <i-select v-model="Search.signStatus" :size="$store.state.searchModuleSize" clearable placeholder="是否S名单"
                    style="width:120px;">
            <i-option value="1" style="color:#3399ff;">是S名单</i-option>
            <i-option value="0" style="color:#ff6600;">不是S名单</i-option>
          </i-select>
          <i-select v-model="Search.isRecommend" :size="$store.state.searchModuleSize" clearable placeholder="是否为推荐"
                    style="width:120px;">
            <i-option value="1" style="color:#3399ff;">是推荐</i-option>
            <i-option value="0" style="color:#ff6600;">不是推荐</i-option>
          </i-select>
          <i-input v-model="Search.nameAndPhoneValue" :size="$store.state.searchModuleSize"
                   @on-keyup.enter="searchForm(1)" placeholder="学生姓名 \ 手机号码"
                   style="width:150px;margin-right:2px;"></i-input>
          <i-select v-model="Search.grade" :size="$store.state.searchModuleSize" clearable placeholder="年级"
                    style="width:80px;">
            <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
          <i-select v-model="Search.subject" :size="$store.state.searchModuleSize" clearable placeholder="科目"
                    style="width:80px;">
            <i-option v-for="(item,index) in subjectList" :value="item" :key='index'>{{ item }}</i-option>
          </i-select>
          <i-input v-model="Search.channelLevel" :size="$store.state.searchModuleSize" @on-keyup.enter="searchForm(1)"
                   placeholder="渠道等级，如A,B,C..." style="width:150px;margin-right:2px;"></i-input>
          <i-input v-model="Search.recommendCcName" :size="$store.state.searchModuleSize"
                   @on-keyup.enter="searchForm(1)" placeholder="推荐CC姓名" style="width:120px;margin-right:2px;"></i-input>
          <i-input v-model="Search.recommendCrName" :size="$store.state.searchModuleSize"
                   @on-keyup.enter="searchForm(1)" placeholder="推荐CR姓名" style="width:120px;margin-right:2px;"></i-input>
          <i-select v-model="Search.provinceId" :size="$store.state.searchModuleSize" :label-in-value="true"
                    :clearable="true" filterable @on-change="changeSelectedCity" placeholder="省" style="width:150px">
            <i-option v-for="(item,index) in provinceList" :key='index' :value="item.id">{{ item.name }}</i-option>
          </i-select>
          <i-select v-model="Search.cityId" :size="$store.state.searchModuleSize" :label-in-value="true"
                    @on-change="changeSelectedArea" :clearable="true" placeholder="市" style="width:150px">
            <i-option v-for="(item,index) in cityArrays" :value="item.id" :key='index'>{{ item.name }}</i-option>
          </i-select>
          <i-select v-model="Search.countId" :size="$store.state.searchModuleSize" :label-in-value="true"
                    @on-change="changeSelectedCount" :clearable="true" placeholder="区" style="width:150px">
            <i-option v-for="(item,index) in areaList" :value="item.id" :key='index'>{{ item.name }}</i-option>
          </i-select>
          <i-select v-model="Search.schoolName" :size="$store.state.searchModuleSize" :label-in-value="true"
                    :clearable="true" placeholder="学校" style="width:150px">
            <i-option v-for="(item,index) in schoolNameList" :value="item.schoolname" :key='index'>{{ item.schoolname
              }}
            </i-option>
          </i-select>
          <i-select v-model="Search.gradeRank" :size="$store.state.searchModuleSize" :clearable="true"
                    placeholder="年级排名" style="width:150px">
            <i-option v-for="(item,index) in gradeRankList" :value="item.enumValue" :key='index'>{{ item.enumName }}
            </i-option>
          </i-select>
          <Date-picker type="daterange" :size="$store.state.searchModuleSize" placement="bottom-end"
                       @on-change="changeSignupDate" ref="signupDate" placeholder="报名时间"
                       style="width: 200px"></Date-picker>
          <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchForm(1)">搜索
          </i-button>
          <i-button type="ghost" :size="$store.state.searchModuleSize" @click="clearForm">重置</i-button>
        </i-col>
      </Row>
    </div>
    <checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
      <checkbox label="phone">手机号</checkbox>
      <checkbox label="phoneLocaltion">号码归属地</checkbox>
      <checkbox label="province">省</checkbox>
      <checkbox label="city">市</checkbox>
      <checkbox label="count">区/县</checkbox>
      <checkbox label="schoolName">学校</checkbox>
      <checkbox label="grade">年级</checkbox>
      <checkbox label="gradeRank">年级排班</checkbox>
      <checkbox label="subject">科目</checkbox>
      <checkbox label="signupDate">报名时间</checkbox>
      <checkbox label="channelLevel">渠道等级</checkbox>
      <!--<checkbox label="channelName">渠道名称</checkbox>-->
      <checkbox label="recommendCcName">推荐cc</checkbox>
    </checkbox-group>
    <i-table size="small" :height="theight" highlight-row stripe :columns="columns" :data="data"
             @on-selection-change="getSelections" @on-select-all="getSelectionAll"
             @on-sort-change="sortChange"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
    <select-sales @reFresh="reFresh" ref="sales" form-type="0"></select-sales>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {DISTRIBUTE} from 'common/api/distribute.js';
  import {formateDate, common, hideCharAtNumber, clearSearchForm} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import selectSales from '../selectSales';
  import PageModel from 'dashborader/page/page.vue';

  const $sStorage = $.sessionStorage;
  export default {
    data () {
      return {
        data: [],
        tableColumnsChecked: ['name', 'phone', 'phoneLocaltion', 'province', 'city', 'count', 'schoolName', 'grade', 'gradeRank', 'subject', 'signupDate', 'channelLevel', 'recommendCcName', 'action'],
        columns: [],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        orderBy: '',
        sortBy: '',
        leadsNum: '',
        selectionRows: [],
        schoolNameList: [],//学校
        gradeRankList: [],//年级排名
        provinceList: [],
        cityArrays: [],
        areaList: [],
        province: '',
        city: '',
        count: '',
        Search: {
          nameAndPhoneValue: '',
          channelLevel: '',                //渠道等级
          grade: '',
          subject: '',
          startDate: '',
          endDate: '',
          recommendCcName: '',
          recommendCrName: '',
          provinceId: '',
          schoolName: '',//学校
          gradeRank: '',//年级排名
          cityId: '',
          countId: '',
          signStatus: '',
          isRecommend: '',
        },
        gradeList: [],
        subjectList: [],
      }
    },
    mounted () {
      this.searchForm ();
      this.changeTableColumns ();
      const _this = this;
      // common.ajax({
      //   url: COMMON_API().allSubject,
      //   method: 'get',
      //   success: function (res) {
      //     _this.subjectList = res.data || [];
      //   }
      // });
      this.$axios.get (COMMON_API ().allSubject, {}).then (({data}) => {
        _this.subjectList = data.data || [];
      })
      //获取省
      // common.ajax({
      //   url: COMMON_API().ssqAreaAllStudy,
      //   method: 'get',
      //   data: {parentid: 1},
      //   success: function (response) {
      //     _this.provinceList = response.data || [];
      //   }
      // });
      this.$axios.get (COMMON_API ().ssqAreaAllStudy, {
        params: {
          parentid: 1
        }
      }).then (({data}) => {
        _this.provinceList = data.data || [];
      })
      //获取年级排名
      // common.ajax({
      //   url: COMMON_API().getGradeRank,
      //   method: 'get',
      //   data: {parentid: 1},
      //   success: function (response) {
      //     _this.gradeRankList = response.data || [];
      //   }
      // });
      this.$axios.get (COMMON_API ().getGradeRank, {
        params: {
          parentid: 1
        }
      }).then (({data}) => {
        _this.gradeRankList = data.data || [];
      })
      $.getJSON ("static/data.json", function (json) {
        _this.gradeList = json.gradeList;
      });
    },
    methods: {
      getTableColumns () {
        const columns = {
          selection: {
            fixed: 'left',
            type: 'selection',
            width: 40,
            align: 'center',
          },
          name: {
            fixed: 'left',
            title: '学生',
            key: 'name',
            width: 90,
            align: 'center',
            render: (h, params) => {
              return h ('div', [
                h ('Icon', {
                  props: {
                    type: 'person'
                  }
                }),
                h ('a', {
                  on: {
                    click: () => {
                      GLOBAL.viewLeadsDetail (params.row.uuid)
                    }
                  }
                }, params.row.name)
              ])
//              return `<Icon type="person"></Icon> <strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.uuid}');">${row.name}</a></strong>`;
            }
          },
          phone: {
            title: '手机号',
            key: 'phone',
            width: 120,
            align: 'center',
            render (h, params) {
              return h ('span', hideCharAtNumber (params.row.phone));
            }
          },
          phoneLocaltion: {
            title: '号码归属地',
            width: 90,
            key: 'phoneLocaltion',
            align: 'center',
          },
          province: {
            title: '省',
            width: 90,
            key: 'province',
            align: 'center',
          },
          city: {
            title: '市',
            key: 'city',
            width: 90,
            align: 'center',
          },
          count: {
            title: '区/县',
            width: 90,
            key: 'count',
            align: 'center',
          },
          schoolName: {
            title: '学校',
            width: 90,
            key: 'schoolName',
            align: 'center',
          },
          grade: {
            title: '年级',
            key: 'grade',
            width: 90,
            align: 'center',
          },
          gradeRank: {
            title: '年级排名',
            key: 'gradeRank',
            width: 90,
            align: 'center',
          },
          subject: {
            title: '科目',
            key: 'subject',
            width: 90,
            align: 'center',
          },
          signupDate: {
            title: '报名时间',
            key: 'signupDate',
            width: 180,
            align: 'center',
            sortable: true,
            render (h, params) {
              return h ('span', formateDate (params.row.signupDate, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          channelLevel: {
            title: '渠道等级',
            key: 'channelLevel',
            width: 90,
            align: 'center',
          },
          // channelName:{
          //   title: '渠道名称',
          //     key: 'channelName',
          //   width: 90,
          //   align: 'center',
          // },
          recommendCcName: {
            title: '推荐CC',
            key: 'recommendCcName',
            width: 90,
            align: 'center',
          },
          recommendCrName: {
            title: '推荐CR',
            key: 'recommendCrName',
            width: 90,
            align: 'center',
          },
          action: {
            title: '操作',
            key: 'action',
            align: 'center',
            fixed: 'right',
            width: 90,
            render: (h, params) => {
              return h ('div', [
                h ('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'paper-airplane',
                  },
                  style: {
                    margin: '2px',
                  },
                  on: {
                    click: () => {
                      this.distribution (params.row.uuid)
                    }
                  }
                }, '分配')
              ])
//              return `<i-button type="primary" size="small" icon="paper-airplane" @click="distribution('${row.uuid}')">分配</i-button>`;
            }
          }
        };
        let datas = [columns.selection];
        this.tableColumnsChecked.forEach (col => {
          datas.push (columns[col]);
          // console.log(datas);
        });
        return datas;
      },
      showSalesModal () {
        let row = this.selectionRows;
        if (row.length > 0) {
          this.$refs.sales.show ();
        } else {
          common.msg ('请选择名单', 'warning');
        }
      },
      distribution (leadsIds) {
        this.selectionRows.length = 1;
        this.selectionRows[0] = {"uuid": leadsIds};
        $sStorage.set ('selectionRows', this.selectionRows);
        this.showSalesModal ();
      },
      //省市区
      changeSelectedCity (areaName) {
        const _this = this;
        console.log (areaName.label);
        _this.province = areaName.label;
        //获取城市
        // common.ajax({
        //   url: COMMON_API().ssqAreaAllStudy,
        //   method: 'get',
        //   data: {parentid: areaName.value},
        //   success: function (response) {
        //     _this.cityArrays = response.data || [];
        //   }
        // });
        this.$axios.get (COMMON_API ().ssqAreaAllStudy, {
          params: {
            parentid: areaName.value
          }
        }).then (({data}) => {
          _this.cityArrays = data.data || [];
        })
      },
      changeSelectedArea (areaName) {
        const _this = this;
        //获取城市的区域
        console.log (areaName.label);
        _this.city = areaName.label;
        // common.ajax({
        //   url: COMMON_API().ssqAreaAllStudy,
        //   method: 'get',
        //   data: {parentid: areaName.value},
        //   success: function (response) {
        //     _this.areaList = response.data || [];
        //   }
        // });
        this.$axios.get (COMMON_API ().ssqAreaAllStudy, {
          params: {
            parentid: areaName.value
          }
        }).then (({data}) => {
          _this.areaList = data.data || [];
        })
      },
      changeSelectedCount (areaName) {
        const _this = this;
        console.log (areaName.label);
        _this.count = areaName.label;
        //获取所有学校
        console.log (areaName);
        // common.ajax({
        //   url: COMMON_API().allStudySchool,
        //   method: 'get',
        //   data: {provinceId:_this.Search.provinceId,cityId: _this.Search.cityId,countyId:areaName.value},
        //   success: function (response) {
        //     _this.schoolNameList = response.data || [];
        //   }
        // });
        this.$axios.get (COMMON_API ().allStudySchool, {
          params: {
            provinceId: _this.Search.provinceId,
            cityId: _this.Search.cityId,
            countyId: areaName.value
          }
        }).then (({data}) => {
          _this.schoolNameList = data.data || [];
        })
      },
      searchForm (val) {
        if (val) this.pageIndex = val;
        let nameAndPhone = this.Search.nameAndPhoneValue;
        let name = '', phone = '';
        if (!nameAndPhone) nameAndPhone = '';
        if (isNaN (nameAndPhone)) {
          name = nameAndPhone;
        } else {
          phone = nameAndPhone;
        }
        let channelLevel = this.Search.channelLevel;
        if (channelLevel) channelLevel = channelLevel.toLocaleUpperCase ();
        this.loadDataGrid ({
          signStatus: this.Search.signStatus,
          isRecommend: this.Search.isRecommend,
          name: name,
          phone: phone,
          grade: this.Search.grade,
          subject: this.Search.subject,
          channelLevel: channelLevel,
          startDate: this.Search.startDate,
          endDate: this.Search.endDate,
          recommendCcName: this.Search.recommendCcName,
          recommendCrName: this.Search.recommendCrName,
          schoolName: this.Search.schoolName,
          gradeRank: this.Search.gradeRank,
          province: this.province || '',
          city: this.city || '',
          count: this.count || '',
        });
      },
      loadDataGrid (search) {
        let param = `?signStatus=${search.signStatus}&name=${search.name}&phone=${search.phone}&grade=${search.grade}&subject=${search.subject}&channelLevel=${search.channelLevel}&startDate=${search.startDate}&endDate=${search.endDate}`;
        param += `&isRecommend=${search.isRecommend}&recommendCcName=${search.recommendCcName}&recommendCrName=${search.recommendCrName}`;
        param += `&schoolName=${search.schoolName}&gradeRank=${search.gradeRank}&province=${search.province}&city=${search.city}&count=${search.count}&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${this.orderBy}&sortBy=${this.sortBy}&type=1`;
        const _this = this;
        // common.ajax({
        //   url: DISTRIBUTE().Leads.dataGrid + param,
        //   method: 'get',
        //   success: function (res) {
        //     if(_this.leadsNum <=0){
        //       if(res.data.outTimeTotal>0){
        //         _this.leadsNum =res.data.outTimeTotal
        //         _this.$Modal.warning({
        //           title: '超时跟进提醒',
        //           content: '当前有'+ _this.leadsNum +'名leads将超时联系请尽快分配给CC联系'
        //         });
        //       }
        //     }else {
        //         }
        //
        //     _this.data = res.data['data'] || [];
        //     _this.total = res.data.total;
        //   }
        // });
        this.$axios.get (DISTRIBUTE ().Leads.dataGrid + param, {}).then (({data}) => {
          if (_this.leadsNum <= 0) {
            if (data.data.outTimeTotal > 0) {
              _this.leadsNum = data.data.outTimeTotal
              _this.$Modal.warning ({
                title: '超时跟进提醒',
                content: '当前有' + _this.leadsNum + '名leads将超时联系请尽快分配给CC联系'
              });
            }
          } else {
          }
          console.log (data);
          _this.data = data.data['data'] || [];
          _this.total = data.data.total;
        })
      },
      clearForm () {
        clearSearchForm (this.Search, [this.$refs.signupDate], this);
        this.radioType = '';
      },
      getSelections (selection) {
        $sStorage.set ('selectionRows', selection);
        this.selectionRows = selection;
      },
      getSelectionAll (selection) {
        $sStorage.set ('selectionRows', selection);
        this.selectionRows = selection;
      },
      pageChange (pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm ();
      },
      sortChange (obj) {
        this.orderBy = obj.key;
        this.sortBy = obj.order;
        this.searchForm ();
      },
      changeSignupDate (value) {
        this.Search.startDate = value[0] || '';
        this.Search.endDate = value[1] || '';
      },
      changeTableColumns () {
        this.columns = this.getTableColumns ();
      },
      reFresh () {
        this.searchForm ();
      }
    },
    computed: {
      theight () {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470 : '';
      }
    },
    components: {OBreadcrumb, selectSales, PageModel}
  };
</script>

<style>

</style>
