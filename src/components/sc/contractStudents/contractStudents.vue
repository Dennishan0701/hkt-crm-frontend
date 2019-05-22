<template>
  <div class="waitFollowedManager">
    <o-breadcrumb second="销售与客服" third="我签约的学生"></o-breadcrumb>
    <div class="grid-widget">
      <Row>
        <i-col span="24" class="right">
          <i-input :size="$store.state.searchModuleSize" v-model="Search.paramStr" @on-keyup.enter="searchForm(1)"
                   placeholder="学生\手机号" style="width:150px;margin-right: 2px;"></i-input>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.grade" clearable placeholder="年级"
                    style="width:80px;">
            <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{ item.value }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.provinceId" :label-in-value="true"
                    :clearable="true" filterable @on-change="changeSelectedCity" placeholder="省" style="width:150px">
            <i-option v-for="(item,index) in provinceList" :key='index' :value="item.id">{{ item.name }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.cityId" :label-in-value="true"
                    @on-change="changeSelectedArea" :clearable="true" placeholder="市" style="width:150px">
            <i-option v-for="(item,index) in cityArrays" :value="item.id" :key='index'>{{ item.name }}</i-option>
          </i-select>
          <i-select :size="$store.state.searchModuleSize" v-model="Search.countId" :label-in-value="true"
                    @on-change="changeSelectedCount" :clearable="true" placeholder="区" style="width:150px">
            <i-option v-for="(item,index) in areaList" :key='index' :value="item.id">{{ item.name }}</i-option>
          </i-select>
        </i-col>
        <i-col span="24" class="right">
          <Date-picker :size="$store.state.searchModuleSize" type="daterange" @on-change="changeDate" ref="daterange"
                       placement="bottom-end" placeholder="负责时间" style="width: 200px"></Date-picker>
          <i-button :size="$store.state.searchModuleSize" type="primary" icon="ios-search" @click="searchForm(1)">搜索
          </i-button>
          <i-button :size="$store.state.searchModuleSize" type="ghost" @click="clearSarchForm">重置</i-button>
        </i-col>
      </Row>
    </div>
    <i-table size="small" :height="theight" stripe :columns="columns" :data="data"></i-table>
    <div class="gridPage">
      <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    </div>
    <hand-out-remark @reFresh="reFresh" ref="handOutRemark"></hand-out-remark>
    <Modal
      v-model="addRecommendLeadsModal"
      title="新增推荐Leads"
      :loading="loading"
      :mask-closable="false"
      :closable="false">
      <i-form ref='formValidate' :model="formValidate" :rules="ruleValidate" :label-width="100">
        <Form-item label="学生姓名" prop="leadsName">
          <i-input :size="$store.state.searchModuleSize" v-model="formValidate.leadsName" placeholder="请输入学生姓名"
                   style="width:200px"></i-input>
        </Form-item>
        <Form-item label="手机号码" prop="leadsPhone">
          <i-input :size="$store.state.searchModuleSize" v-model="formValidate.leadsPhone" placeholder="请输入学生手机号码"
                   style="width:200px"></i-input>
        </Form-item>
        <Form-item label="年级" prop="grade">
          <i-select :size="$store.state.searchModuleSize" v-model="formValidate.grade" style="width:200px">
            <i-option v-for="(item,index) in gradeList" :key='index' :value="item.value">{{item.value}}</i-option>
          </i-select>
        </Form-item>
        <Form-item label="科目" prop="subject">
          <i-select :size="$store.state.searchModuleSize" v-model="formValidate.subject" style="width:200px">
            <i-option v-for="(item,index) in subjectList" :key='index' :value="item">{{ item }}</i-option>
          </i-select>
        </Form-item>
        <!--<Form-item label="推荐CC" prop="recommendCcUuid">-->
        <!--<i-select :size="$store.state.searchModuleSize" v-model="formValidate.recommendCcUuid" @on-change="changeRecommendCc" label-in-value filterable style="width:200px">-->
        <!--<i-option v-for="(item,index) in ccUserList" :key='index' :value="item.uuid" :label="item.name">{{item.name}}</i-option>-->
        <!--</i-select>-->
        <!--</Form-item>-->
        <Form-item label="在读介绍人" prop="introducer">
          <i-input :disabled="true" :size="$store.state.searchModuleSize" v-model="formValidate.introducer"
                   @on-change="getIntroducerbyPhone" placeholder="请输入在读介绍人手机号码" style="width:200px"></i-input>
          <span class="introducer-name">{{introducerName}}</span>
        </Form-item>
        <!--<Form-item label="非在读介绍人" prop="introducer2">-->
        <!--<i-input :disabled="introducerDisable2" :size="$store.state.searchModuleSize" v-model="formValidate.introducer2" @on-change="getIntroducerbyPhone2" placeholder="请输入非在读介绍人手机号码" style="width:200px"></i-input>-->
        <!--<span class="introducer-name">{{introducerName2}}</span>-->
        <!--</Form-item>-->
        <Form-item label="备注" prop="remark">
          <i-input :size="$store.state.searchModuleSize" type="textarea" v-model="formValidate.remark" :rows="4"
                   placeholder="请输入备注" style="width:250px"></i-input>
        </Form-item>

        <!--<Form-item>-->
        <!--<i-button :size="$store.state.searchModuleSize" type="primary" icon="checkmark" @click="handleSubmit('formValidate')">提交</i-button>-->
        <!--&lt;!&ndash;<i-button :size="$store.state.searchModuleSize" type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</i-button>&ndash;&gt;-->
        <!--</Form-item>-->
      </i-form>
      <div slot="footer" style="text-align: right">
        <i-button :size="$store.state.searchModuleSize" type="primary" icon="checkmark"
                  @click="handleSubmit('formValidate')">提交
        </i-button>
        <i-button type="ghost" @click="addRecommendLeadsModal = false">取消</i-button>
        <!--<i-button type="primary" @click="addSave('formValidate','save')">保存草稿</i-button>-->
        <!--<i-button type="success" @click="addSave('formValidate','online')">保存并上线</i-button>-->
      </div>
    </Modal>
  </div>

</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {SCS} from 'common/api/scs.js';
  import {
    formateDate,
    common,
    hideCharAtNumber,
    hideCharAtStr,
    getFullPhone,
    clearSearchForm
  } from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import handOutRemark from 'components/sc/contractStudents/handOutRemark';
  import PageModel from 'dashborader/page/page.vue';

  const $localStorage = $.localStorage;
  export default {
    data () {
      let validatePhone = (rule, value, callback) => {
        if (value === "") {
          callback (new Error ('手机号码不能为空'));
        } else if (!(/^1\d{10}$/.test (value))) {
          callback (new Error ('请填写合法的手机号码'));
        } else {
          callback ();
        }
      };
      let validatePhone2 = (rule, value, callback) => {
        if (value === "") {
          callback ();
        } else if (!(/^1\d{10}$/.test (value))) {
          callback (new Error ('请填写合法的手机号码'));
        } else {
          callback ();
        }
      };
      return {
        addRecommendLeadsModal: false,
        loading: false,
        data: [],
        total: 0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        alias: $localStorage.get ('user').alias,
        gradeList: [],//年级
        provinceList: [],//省
        cityArrays: [],//市
        areaList: [],//区
        province: '',//省
        city: '',//市
        count: '',//区
        Search: {
          paramStr: '',
          grade: '',//年级
          startDate: '',
          endDate: '',
          provinceId: '',
          cityId: '',
          countId: '',
        },
        columns: [
          {
            title: '序号',
            type: 'index',
            minWidth: 60,
            fixed: 'left',
            align: 'center'
          },
          {
            title: '订单号',
            key: 'orderNo',
            align: 'center',
            minWidth: 120
          },
          {
            title: '学生',
            key: 'leadsName',
            minWidth: 90,
            fixed: 'left',
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
                      GLOBAL.viewLeadsDetail (params.row.leadsUuid, '', 'cr')
                    }
                  }
                }, params.row.leadsName)
              ])
//              return `<strong><a href="javascript:GLOBAL.viewLeadsDetail('${row.leadsUuid}','','cr')">${row.leadsName}</a></strong>`;
            }
          },
          {
            title: '手机号',
            key: 'leadsPhone',
            align: 'center',
            minWidth: 120,
            render: (h, params) => {
              if (params.row.leadsPhone) {
                return h ('div', [
                  h ('span', hideCharAtNumber (params.row.leadsPhone)),
                  h ('i', {
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
                        this.getFullPhone (params.row.leadsPhone)
                      }
                    }
                  })
                ])
//                return hideCharAtNumber(row.leadsPhone) + ` <Icon type="ios-eye" @click="getFullPhone('${row.leadsPhone}')" class="eye" title="显示全部"></Icon>`;
              } else {
                return h ('span', '-');
              }
            }
          },
          {
            title: '负责CR',
            key: 'crName',
            align: 'center',
            minWidth: 90
          },
          {
            title: '年级',
            key: 'grade',
            align: 'center',
            minWidth: 90
          },
          {
            title: '省',
            key: 'province',
            align: 'center',
            minWidth: 90
          },
          {
            title: '市',
            key: 'city',
            align: 'center',
            minWidth: 90
          },
          {
            title: '区',
            key: 'district',
            align: 'center',
            minWidth: 90
          },
          {
            title: '业绩提交时间',
            key: 'inChargeDate',
            align: 'center',
            minWidth: 150,
            render (h, params) {
              return h ('span', formateDate (params.row.inChargeDate, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '是否续费',
            key: 'keyPointDesc',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            fixed: 'right',
            minWidth: 90,
            render: (h, params) => {
              return h ('div', [
                h ('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    icon: 'ios-eye',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs: {
                    title: '查看移交表'
                  },
                  on: {
                    click: () => {
                      this.getHandOutRemark (params.row.leadsUuid)
                    }
                  }
                }),
                h ('Button', {
                  props: {
                    type: 'info',
                    size: 'small',
                    icon: 'plus-round',
                  },
                  style: {
                    margin: '2px',
                  },
                  attrs: {
                    title: '新增推荐Leads',
                    disabled:this.dealDate (formateDate (params.row.inChargeDate, 'yyyy-MM-dd'))>30
                  },
                  on: {
                    click: () => {
                      this.addRecommendLeads (params.row.leadsPhone, params.row.leadsName, params.row.leadsUuid, params.row.payRequestUuid, formateDate (params.row.inChargeDate, 'yyyy-MM-dd'))
                    }
                  }
                })
              ])
            }
          }
        ],
        formValidate: {
          leadsName: '',
          leadsPhone: '',
          grade: '',
          subject: '',
          recommendCcUuid: '',
          recommendCcName: '',
          introducer: '',        //介绍人
          introducer2: '',        //介绍人
          remark: ''
        },
        introduceType: '',
        introducerDisable: false,
        introducerDisable2: false,
        introducerName: '',
        introducerName2: '',
        gradeList: [],
        subjectList: [],
        ccUserList: [],
        payRequestUuid: '',
        leadsUuid: '',
        inChargeDate: '',
        ruleValidate: {
          leadsName: [
            {required: true, message: '姓名不能为空', trigger: 'blur'}
          ],
          leadsPhone: [
            {required: true, validator: validatePhone, trigger: 'blur'}
          ],
          grade: [
            {required: true, message: '请选择年级', trigger: 'change'}
          ],
          subject: [
            {required: true, message: '请选择科目', trigger: 'change'}
          ],
          recommendCcUuid: [
            {required: true, message: '推荐CC不能为空', trigger: 'change'}
          ],
          introducer: [
            {required: false, validator: validatePhone2, trigger: 'blur'}
          ],
          introducer2: [
            {required: false, validator: validatePhone2, trigger: 'blur'}
          ],
          remark: [
            {type: 'string', max: 500, message: '备注不能大于500个字', trigger: 'change'}
          ]
        }
      }
    },
    mounted () {
      const _this = this;
      this.searchForm ();
      $.getJSON ("static/data.json", function (json) {
        _this.gradeList = json.gradeList;
      });
      this.$axios.get (COMMON_API ().ssqAreaAllStudy, {
        params: {
          parentid: 1
        },
      }).then (({data}) => {
        _this.provinceList = data.data || [];
      })
    },
    watch: {
      'formValidate.introducer' (value) {
        if (value) {
          this.introducerDisable2 = true;
        } else if (value === '') {
          this.introducerDisable2 = false;
        }
      },
      'formValidate.introducer2' (value) {
        if (value) {
          this.introducerDisable = true;
        } else if (value === '') {
          this.introducerDisable = false;
        }
      }
    },
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate ((valid) => {
          if (valid) {
            const _this = this;
            if (this.formValidate.introducer === '' && this.formValidate.introducer2 === '') {
              common.notices ('请输入在读介绍人或非在读介绍人手机号', '提示', 'warning');
            } else {
              this.$axios.post (SCS ().Leads.addRecommendLeads, {
                leadsName: _this.formValidate.leadsName,
                leadsPhone: _this.formValidate.leadsPhone,
                grade: _this.formValidate.grade,
                subject: _this.formValidate.subject,
                // recommendCcUuid: _this.formValidate.recommendCcUuid,
                // recommendCcName: _this.formValidate.recommendCcName,
                introducer: _this.formValidate.introducer,
                // introduceType: _this.introduceType,
                remark: _this.formValidate.remark,
                payRequestUuid: _this.payRequestUuid
              }).then (() => {
                common.notices ('新增成功');
                this.addRecommendLeadsModal = false
                this.handleReset ('formValidate')
              })
            }
          } else {
            common.msg ('表单验证失败!');
          }
        });
      },
      handleReset (name) {
        this.$refs[name].resetFields ();
      },
      getIntroducerbyPhone (value) {
        // this.introducerName = ''
        // let phone = value.target.value;
        // if(phone && phone.length === 11) {
        //   const _this = this;
        //   this.$axios.get(SCS().Leads.getLeadsByPhone,{
        //     params:{
        //       phone: phone
        //     }
        //   }).then( ({data}) => {
        //     _this.introducerName = data.data;
        //   })
        // }
      },
      getIntroducerbyPhone2 (value) {
        console.log (value);
      },
      changeRecommendCc (value) {
        this.formValidate.recommendCcName = value.label;
      },
      //省市区
      changeSelectedCity (areaName) {
        const _this = this;
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
      },
      getFullPhone (phone) {
        getFullPhone (phone, COMMON_API ().getPhoneHZ);
      },
      getHandOutRemark (leadsUuid) {
        this.$refs.handOutRemark.show (leadsUuid, 'get');
      },
      // 新增推荐Leads
      addRecommendLeads (leadsPhone, leadsName, leadsUuid, payRequestUuid, inChargeDate) {
        //获取科目列表
        const _this = this;
        this.$axios.get (COMMON_API ().allSubject, {}).then (({data}) => {
          _this.subjectList = data.data || [];
        })
        this.$axios.get (COMMON_API ().getAllCcInfo, {}).then (({data}) => {
          _this.ccUserList = data.data || [];
        })
        this.addRecommendLeadsModal = true
        this.formValidate.introducer = leadsPhone
        this.introducerName = leadsName
        this.leadsUuid = leadsUuid
        this.payRequestUuid = payRequestUuid
        this.inChargeDate = inChargeDate
      },
      searchForm (val) {
        if (val) this.pageIndex = val;
        this.loadDataGrid ({
          leadsParams: this.Search.paramStr,
          startDate: this.Search.startDate,
          grade: this.Search.grade,
          province: this.province,
          city: this.city,
          count: this.count,
          endDate: this.Search.endDate
        });
      },
      loadDataGrid (search, orderBy = '', sortBy = '') {
        let param = `?leadsParams=${search.leadsParams}&grade=${search.grade}&province=${search.province}&city=${search.city}&district=${search.count}&startDate=${search.startDate}&endDate=${search.endDate}`;
        param += `&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        const _this = this;
        // common.ajax({
        //   url: SCS().MyStudent.getCcMySignStudent + param,
        //   method: 'get',
        //   success: function(response){
        //     _this.data = response.data.signStudentList || [];
        //     _this.total = response.data.total;
        //   }
        // });
        this.$axios.get (SCS ().MyStudent.getCcMySignStudent, {
          params: {
            leadsParams: search.leadsParams,
            grade: search.grade,
            province: search.province,
            city: search.city,
            district: search.count,
            startDate: search.startDate,
            endDate: search.endDate,
            pageIndex: this.pageIndex,
            pageNumber: this.pageNumber,
            orderBy: orderBy,
            sortBy: sortBy,
          }
        }).then (({data}) => {
          _this.data = data.data.signStudentList || [];
          _this.total = data.data.total;
        })
      },
      clearSarchForm () {
        clearSearchForm (this.Search, [this.$refs.daterange]);
      },
      pageChange (pageIndex) {
        this.pageIndex = pageIndex;
        this.searchForm ();
      },
      changeDate (value) {
        this.Search.startDate = value[0] || '';
        this.Search.endDate = value[1] || '';
      },
      reFresh () {
        this.searchForm ();
      },
      dealDate (date) {
        console.log (date);
        let date1,date2,iDays
        date2 = new Date();
        date1 = new Date(Date.parse(date.replace(/-/g,   "/")));
        iDays = parseInt(Math.abs(date2.getTime()- date1.getTime()) /1000/60/60/24);
        return iDays;
      },
    },
    computed: {
      theight () {
        return (SCREEN_SIZE === 'md' && this.data.length > 11) ? 470 : '';
      }
    },
    components: {OBreadcrumb, handOutRemark, PageModel}
  };
</script>

<style>

  .ivu-input-disabled, .ivu-select-selected-value {
    color: rgba(0, 0, 0, 1) !important;
    /*font-weight: bold;*/
  }

  input::-webkit-input-placeholder, textarea::-webkit-input-placeholder, .ivu-select-placeholder {
    color: rgba(0, 0, 0, .6) !important;
  }

  input::-moz-placeholder, textarea::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: rgba(0, 0, 0, .6) !important;
  }

  input:-moz-placeholder, textarea:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: rgba(0, 0, 0, .6) !important;
  }

  input:-ms-input-placeholder, textarea:-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: rgba(0, 0, 0, .6) !important;
  }
</style>
