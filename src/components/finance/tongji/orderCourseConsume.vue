<template>
  <div>
    <o-breadcrumb second="财务" third="订单课耗"></o-breadcrumb>
    <Row :gutter="15">
      <i-col span="12">
        <div class="grid-widget">
          <Row>
            <i-col span="24" class="left">
              <form>
                <i-input v-model="Search.orderNo" :size="$store.state.searchModuleSize" placeholder="订单号" style="width:150px;margin-right:2px;"></i-input>
                <i-input v-model="Search.studentName" :size="$store.state.searchModuleSize" placeholder="学生姓名" style="width:150px;margin-right:2px;"></i-input>
                <i-input v-model="Search.studentPhone" :size="$store.state.searchModuleSize" placeholder="学生手机号" style="width:150px;margin-right:2px;"></i-input>
                <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search"
                          @click="searchFormLeft(1)">搜索
                </i-button>
              </form>
            </i-col>
          </Row>
        </div>
        <i-table size="small" :height="theightLeft" highlight-row stripe :columns="columnsLeft"
                 :data="dataLeft" @on-row-click="queryCourseByOrder"></i-table>
        <div class="gridPage">
          <PageModel :total="totalLeft" :pageSize="pageNumberLeft" :currentPage="pageIndexLeft"
                     @pageChange="pageChangeLeft"></PageModel>
        </div>
        <Row>
          <i-col span="24" class="left">
            <form>
              <i-button type="primary" :size="$store.state.searchModuleSize" @click="correlationOrderLeft">重新关联</i-button>
              <i-button type="primary" :size="$store.state.searchModuleSize" @click="cancelCorrelationOrder">取消关联</i-button>
            </form>
          </i-col>
        </Row>
        <i-table size="small" :height="theightLeft2" highlight-row stripe :columns="columnsLeft2"
                 :data="dataLeft2" @on-selection-change="selectRowLeft"></i-table>
        <div class="gridPage">
          <PageModel :total="totalLeft2" :pageSize="pageNumberLeft2" :currentPage="pageIndexLeft2"
                     @pageChange="pageChangeLeft2"></PageModel>
        </div>
      </i-col>

      <i-col span="12">
        <!--right1-->
        <div class="grid-widget">
          <Row>
            <i-col span="24" class="left">
              <form>
                <i-input v-model="Search.studentNameRight" :size="$store.state.searchModuleSize" placeholder="学生姓名" style="width:90px;margin-right:2px;"></i-input>
                <i-input v-model="Search.studentPhoneRight" :size="$store.state.searchModuleSize" placeholder="学生手机号" style="width:130px;margin-right:2px;"></i-input>
                <i-input v-model="Search.teacherNameRight" :size="$store.state.searchModuleSize" placeholder="老师姓名" style="width:90px;margin-right:2px;"></i-input>
                <date-picker type="daterange" @on-change="changeCourseDate" placeholder="上课日期"
                             style="width: 200px"></date-picker>
                <i-button type="primary" :size="$store.state.searchModuleSize" icon="ios-search" @click="searchFormRight(1)">
                  搜索
                </i-button>
                <i-button type="primary" :size="$store.state.searchModuleSize" @click="correlationOrder">关联订单号</i-button>
              </form>
            </i-col>
          </Row>
        </div>
        <i-table size="small" :height="theightRight" highlight-row stripe :columns="columnsRight1"
                 :data="dataRight1" @on-selection-change="selectRow" @on-row-click="queryCourseByOrder2"></i-table>
        <div class="gridPage">
          <PageModel :total="totalRight" :pageSize="pageNumberRight" :currentPage="pageIndexRight"
                     @pageChange="pageChangeRight"></PageModel>
        </div>
        <!--right2-->
        <div class="grid-widget">
          <Row>
            <i-col span="24" class="left">
              <form>
                <i-button type="primary" :size="$store.state.searchModuleSize" @click="createCourseSchedule">新建排课</i-button>
                <i-button type="primary" :size="$store.state.searchModuleSize" @click="courseToSchedule">课程关联排课</i-button>
                <i-button type="primary" :size="$store.state.searchModuleSize" @click="updateCourseLeadsByPhone">课程重新关联学生</i-button>
              </form>
            </i-col>
          </Row>
        </div>
        <i-table size="small" :height="theightRight2" highlight-row stripe :columns="columnsRight2"
                 :data="dataRight2" @on-selection-change="selectRowRight2"></i-table>
        <div class="gridPage">
          <PageModel :total="totalRight2" :pageSize="pageNumberRight2" :currentPage="pageIndexRight2"
                     @pageChange="pageChangeRight2"></PageModel>
        </div>
      </i-col>
    </Row>
    <Modal
      v-model="correlationOrderModal"
      title="关联订单号"
      :loading="loading"
      width="300"
    >
      <i-form ref="formValidateCorrelation" :model="FormDataCorrelation" :rules="ruleValidateCorrelation">
        <Form-item prop="orderNum" label="">
          <i-select v-model="FormDataCorrelation.orderNum" :size="$store.state.searchModuleSize" style="width:250px" placeholder="请选择单号" clearable>
            <i-option v-for="(item,index) in orderNoList" :key='index' :value="item.uuid">{{item.orderNo}}</i-option>
          </i-select>
        </Form-item>
      </i-form>
      <div slot="footer">
        <Button type="primary" :size="$store.state.searchModuleSize" @click="correlationOk('formValidateCorrelation')">确定</Button>
      </div>
    </Modal>

    <Modal
      v-model="courseConnectCourseOrderModal"
      title="课程关联排课"
      :loading="loading"
      width="500"
    >
      <i-table size="small"  highlight-row stripe :columns="columnsCourseConnectCourseOrder"
               :data="dataCourseConnectCourseOrder" @on-row-click="selectCourseConnectCourseOrder"></i-table>
      <div slot="footer">
        <Button type="primary" :size="$store.state.searchModuleSize" @click="courseConnectCourseOrderOk">确定</Button>
      </div>
    </Modal>

    <Modal
      v-model="updateCourseLeadsByPhoneModal"
      title="课程重新关联学生"
      :loading="loading"
      width="300"
    >
      <i-form ref="formValidateUpdate" :model="FormDataUpdate" :rules="ruleValidateUpdate">
        <Form-item prop="stuPhoneNumber" label="">
          <i-input v-model="FormDataUpdate.stuPhoneNumber" :size="$store.state.searchModuleSize" placeholder="请输入学生手机号" style="width:200px;margin-right:2px;"></i-input>
        </Form-item>
      </i-form>
      <div slot="footer">
        <Button type="primary" :size="$store.state.searchModuleSize" @click="updateOk('formValidateUpdate')">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {FINANCE} from 'common/api/finance.js';
  import {formateDate, common, hideCharAtNumber, getFullPhone} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';
// 排课列表
// 课程列表

  export default {
    data () {
      return {
        courseOrderUuid: '',
        courseOrderUuidConnect: '',
        courseOrderUuidUpdate: '',
        payUuid: '',
        uuidList:[],
        uuidListConnect:[],
        uuidListUpdate:[],
        selectionRowData: [],
        selectionRowDataRight2: [],
        selectionRowDataLeft: [],
        orderNoList: [],
        totalAmountLeft: '',
        totalAmountRight: '',
        modal: false,
        formItem: {
          receiptNum: '',
          payUuid: ''
        },
        ruleValidateCorrelation: {
          orderNum: [
            {required: true, message: '请选择订单号' ,trigger: 'change'}
          ]
        },
        ruleValidateUpdate: {
          stuPhoneNumber: [
            {required: true, message: '学生手机号不能为空' ,trigger: 'blur'}
          ]
        },
        columnsLeft: [
          {
            title: '订单号',
            key: 'payNo',
            align: 'center',
            fixed: 'left',
            minWidth: 190,
          },
          {
            title: '学生',
            key: 'leadsName',
            align: 'center',
            minWidth: 90,
            render: (h, params) => {
              return h ('div', [
                h ('strong', {}, params.row.leadsName)
              ])
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
                  h ('span', {}, hideCharAtNumber (params.row.leadsPhone)),
                ])
              } else {
                return '-';
              }
            }
          },
          {
            title: '年级',
            key: 'grade',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '课时',
            key: 'courseHour',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '赠送课时',
            key: 'giveLength',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '总课时',
            key: 'sumLength',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '剩余课时',
            key: 'remainingLength',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '金额',
            key: 'money',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '所属销售',
            key: 'submitter',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '渠道',
            key: 'channelName',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '退费金额',
            key: 'refundAmount',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '退费时间',
            key: 'refundDate',
            align: 'center',
            minWidth: 160,
            render (h, params) {
              return h ('span', formateDate (params.row.refundDate, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
        ],
        columnsLeft2: [
          {
            type: 'selection',
            align: 'center',
            fixed: 'left',
            minWidth: 40,
          },
          {
            title: '学生',
            key: 'stuName',
            align: 'center',
            minWidth: 90,
            render: (h, params) => {
              return h ('div', [
                h ('strong', {}, params.row.stuName)
              ])
            }
          },
          {
            title: '手机号',
            key: 'stuPhone',
            align: 'center',
            minWidth: 100,
            render: (h, params) => {
              if (params.row.stuPhone) {
                return h ('div', [
                  h ('span', {}, hideCharAtNumber (params.row.stuPhone)),
                ])
              } else {
                return '-';
              }
            }
          },
          {
            title: '老师姓名',
            key: 'tcName',
            align: 'center',
            minWidth: 100,
          },
          {
            title: '课时',
            key: 'length',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '上课日期',
            key: 'courseDate',
            align: 'center',
            minWidth: 160,
          },
          {
            title: '上课开始日期',
            key: 'couseStartTime',
            align: 'center',
            minWidth: 160,
          },
          {
            title: '上课结束日期',
            key: 'courseEndTime',
            align: 'center',
            minWidth: 160,
          },
          {
            title: '老师手机号',
            key: 'tcPhone',
            align: 'center',
            minWidth: 100,
            render: (h, params) => {
              if (params.row.tcPhone) {
                return h ('div', [
                  h ('span', {}, hideCharAtNumber (params.row.tcPhone)),
                ])
              } else {
                return '-';
              }
            }
          },
          {
            title: '年级',
            key: 'grade',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '科目',
            key: 'subject',
            align: 'center',
            minWidth: 90,
          },
        ],
        columnsRight1: [
          {
            type: 'selection',
            align: 'center',
            fixed: 'left',
            minWidth: 40,
          },
          {
            title: '学生',
            key: 'stuName',
            align: 'center',
            minWidth: 90,
            render: (h, params) => {
              return h ('div', [
                h ('strong', {}, params.row.stuName)
              ])
            }
          },
          {
            title: '手机号',
            key: 'stuPhone',
            align: 'center',
            minWidth: 100,
            render: (h, params) => {
              if (params.row.stuPhone) {
                return h ('div', [
                  h ('span', {}, hideCharAtNumber (params.row.stuPhone)),
                ])
              } else {
                return '-';
              }
            }
          },
          {
            title: '老师姓名',
            key: 'tcName',
            align: 'center',
            minWidth: 100,
          },
          {
            title: '总课时数',
            key: 'courseSum',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '排课时间',
            key: 'createDate',
            align: 'center',
            minWidth: 160,
            render (h, params) {
              return h ('span', formateDate (params.row.createDate, 'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '老师手机号',
            key: 'tcPhone',
            align: 'center',
            minWidth: 100,
            render: (h, params) => {
              if (params.row.tcPhone) {
                return h ('div', [
                  h ('span', {}, hideCharAtNumber (params.row.tcPhone)),
                ])
              } else {
                return '-';
              }
            }
          },
          {
            title: '年级',
            key: 'grade',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '科目',
            key: 'subject',
            align: 'center',
            minWidth: 90,
          },
        ],
        columnsRight2: [
          {
            type: 'selection',
            align: 'center',
            fixed: 'left',
            minWidth: 40,
          },
          {
            title: '学生',
            key: 'stuName',
            align: 'center',
            minWidth: 90,
            render: (h, params) => {
              return h ('div', [
                h ('strong', {}, params.row.stuName)
              ])
            }
          },
          {
            title: '手机号',
            key: 'stuPhone',
            align: 'center',
            minWidth: 100,
            render: (h, params) => {
              if (params.row.stuPhone) {
                return h ('div', [
                  h ('span', {}, hideCharAtNumber (params.row.stuPhone)),
                ])
              } else {
                return '-';
              }
            }
          },
          {
            title: '老师姓名',
            key: 'tcName',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '课时',
            key: 'length',
            align: 'center',
            minWidth: 40,
          },
          {
            title: '上课日期',
            key: 'courseDate',
            align: 'center',
            minWidth: 100,
          },
          {
            title: '上课开始时间',
            key: 'couseStartTime',
            align: 'center',
            minWidth: 100,
          },
          {
            title: '上课结束时间',
            key: 'courseEndTime',
            align: 'center',
            minWidth: 80,
          },
          {
            title: '老师手机号',
            key: 'tcPhone',
            align: 'center',
            minWidth: 80,
            render: (h, params) => {
              if (params.row.tcPhone) {
                return h ('div', [
                  h ('span', {}, hideCharAtNumber (params.row.tcPhone)),
                ])
              } else {
                return '-';
              }
            }
          },
          {
            title: '年级',
            key: 'grade',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '科目',
            key: 'subject',
            align: 'center',
            minWidth: 90,
          },
        ],
        columnsCourseConnectCourseOrder: [
          {
            title: '老师姓名',
            key: 'tcName',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '老师手机号',
            key: 'tcPhone',
            align: 'center',
            minWidth: 80,
            render: (h, params) => {
              if (params.row.tcPhone) {
                return h ('div', [
                  h ('span', {}, hideCharAtNumber (params.row.tcPhone)),
                ])
              } else {
                return '-';
              }
            }
          },
          {
            title: '年级',
            key: 'grade',
            align: 'center',
            minWidth: 90,
          },
          {
            title: '科目',
            key: 'subject',
            align: 'center',
            minWidth: 90,
          },
        ],
        dataLeft: [],
        dataLeft2: [],
        dataRight1: [],
        dataRight2: [],
        dataCourseConnectCourseOrder: [],
        loading: false,
        FormDataCorrelation: {
          orderNum: '',
        },
        FormDataUpdate:{
          stuPhoneNumber: '',
        },
        correlationOrderModal: false,
        courseConnectCourseOrderModal: false,
        updateCourseLeadsByPhoneModal: false,
        totalLeft: 0,
        totalLeft2: 0,
        totalRight: 0,
        totalRight2: 0,
        pageIndexLeft: 1,
        pageIndexLeft2: 1,
        pageIndexRight: 1,
        pageIndexRight2: 1,
        pageNumberLeft: 8,
        pageNumberLeft2: 50,
        pageNumberRight: 5,
        pageNumberRight2: 50,
        Search: {
          studentName: '',
          studentPhone: '',
          orderNo: '',
          studentNameRight: '',
          studentPhoneRight: '',
          teacherNameRight: '',
          courseStartDate: '',
          courseEndDate: '',
        },
        params: '',
        ruleValidateRefund: {
          refund: [
            {required: true, type: 'number', message: '请输入金额', trigger: 'blur'},
          ],
          refundDate: [
            {required: true, message: '请选择日期', trigger: 'change'}
          ]
        },
      }
    },
    mounted () {
      this.searchFormLeft ();
      this.searchFormRight ();
    },
    methods: {
      // 新建排课
      createCourseSchedule(){
        const _this = this;
        let row = this.selectionRowDataRight2;
        console.log (row);
        if(row.length === 0) {
          common.msg('至少选择一条数据','warning');
        }else if (row.length > 1) {
          common.msg( '一次只能操作一条数据', 'warning');
        }else{
          this.$Modal.confirm({
            title: '',
            content: '确认新建排课？',
            onOk: function () {
              this.$axios.get (FINANCE ().orderCourseConsume.createCourseOrder, {
                params: {
                  leadsUuid: row[0].leadsUuid,
                  teacherUuid:  row[0].teacherUuid,
                }
              }).then ((res) => {
                if (res.data.code == '100') {
                  common.notices ('新建排课成功！！');
                }
                // _this.searchFormLeft2 ();
                _this.searchFormRight2 ();
                _this.selectionRowDataRight2 = []
              })
            }
          });
        }
      },
      // 课程关联排课
      courseToSchedule(){
        const _this = this;
        this.courseOrderUuidConnect = ''
        this.uuidListConnect = []
        let row = this.selectionRowDataRight2;
        let uuidList=[]
        row.forEach((item,index)=>{
          uuidList.push(item.uuid)
        })
        this.uuidListConnect = uuidList.join(',')
        console.log (row);
        console.log ( this.uuidListConnect);
        if(row.length === 0) {
          common.msg('至少选择一个学生','warning');
        }else{
          this.$axios.post(FINANCE ().orderCourseConsume.queryUnrelatedCourseOrder,{
            stuPhone: row[0].stuPhone,
            pageIndex:1,
            pageNumber:100
          }).then( ({data}) => {
            this.dataCourseConnectCourseOrder = data.data['courseOrderList'] || [];
          })
          this.courseConnectCourseOrderModal = true
        }
      },
      // 课程重新关联学生
      updateCourseLeadsByPhone(){
        const _this = this;
        this.courseOrderUuidUpdate = ''
        this.uuidListUpdate = []
        let row = this.selectionRowDataRight2;
        let uuidList=[]
        row.forEach((item,index)=>{
          uuidList.push(item.uuid)
        })
        this.uuidListUpdate = uuidList.join(',')
        console.log (row);
        console.log ( this.uuidListUpdate);
        if(row.length === 0) {
          common.msg('至少选择一个学生','warning');
        }else{
          // this.$axios.post(FINANCE ().orderCourseConsume.queryUnrelatedCourseOrder,{
          //   stuPhone: row[0].stuPhone,
          //   pageIndex:1,
          //   pageNumber:100
          // }).then( ({data}) => {
          //   this.dataCourseConnectCourseOrder = data.data['courseOrderList'] || [];
          // })
          this.updateCourseLeadsByPhoneModal = true
        }
      },
      selectRow(selection) {
        this.selectionRowData = selection;
      },
      selectRowRight2(selection) {
        this.selectionRowDataRight2 = selection;
      },
      selectRowLeft(selection) {
        this.selectionRowDataLeft = selection;
      },
      // 关联订单号
      correlationOrder(){
        const _this = this;
        let row = this.selectionRowData;
        let uuidList=[]
        row.forEach((item,index)=>{
          uuidList.push(item.uuid)
        })
        this.uuidList = uuidList.join(',')
        console.log (row);
        console.log ( this.uuidList);
        if(row.length === 0) {
          common.msg('至少选择一个学生','warning');
        }else{
          this.$axios.post(FINANCE ().orderCourseConsume.getOrderNoByLeadsUuid,{
            leadsUuid:row[0].leadsUuid
          }).then( ({data}) => {
            this.orderNoList = data.data.orderNoList
          })
          this.correlationOrderModal = true
        }
      },
      // 重新关联
      correlationOrderLeft(){
        const _this = this;
        let row = this.selectionRowDataLeft;
        let uuidList=[]
        row.forEach((item,index)=>{
          uuidList.push(item.uuid)
        })
        this.uuidList = uuidList.join(',')
        console.log (row);
        console.log ( this.uuidList);
        if(row.length === 0) {
          common.msg('至少选择一个学生','warning');
        }else{
          this.$axios.post(FINANCE ().orderCourseConsume.getOrderNoByLeadsUuid,{
            leadsUuid:row[0].leadsUuid
          }).then( ({data}) => {
            this.orderNoList = data.data.orderNoList
          })
          this.correlationOrderModal = true
        }
      },
      // 取消关联
      cancelCorrelationOrder(){
        const _this = this;
        let row = this.selectionRowDataLeft;
        console.log (row);
        if(row.length === 0) {
          common.msg('至少选择一个学生','warning');
        }else if (row.length > 1) {
          common.msg( '一次只能操作一条数据', 'warning');
        }else{
          this.$Modal.confirm({
            title: '',
            content: '确认取消关联？',
            onOk: function () {
              this.$axios.get (FINANCE ().orderCourseConsume.cancelConnectOrder, {
                params: {
                  payUuid: row[0].payUuid,
                  uuids:  row[0].uuid,
                }
              }).then ((res) => {
                if (res.data.code == '100') {
                  common.notices ('取消成功！！');
                }
                _this.searchFormLeft2 ();
                _this.searchFormRight ();
                _this.selectionRowDataLeft = []
              })
            }
          });
        }
      },
      // 选择搜索上课日期
      changeCourseDate(value){
        this.Search.courseStartDate = value[0] || '';
        this.Search.courseEndDate = value[1] || '';
      },
      // 获取已关联订单课程
      queryCourseByOrder(params,index){
        console.log (params, index);
        this.payUuid = params.payUuid
        this.searchFormLeft2()
      },
      searchFormLeft2(){
        let _this = this
        this.$axios.post (FINANCE ().orderCourseConsume.queryCourseByOrder, {
          payUuid:this.payUuid ,
          pageIndex:this.pageIndexLeft2,
          pageNumber:this.pageNumberLeft2
        }).then (({data}) => {
          _this.dataLeft2 = data.data['courseList'] || [];
          _this.totalLeft2 = data.data.total;
          // console.log (_this.dataLeft2);
        })
      },
      queryCourseByOrder2(params,index){
        console.log (params, index);
        this.courseOrderUuid = params.uuid
        this.searchFormRight2()
      },
      selectCourseConnectCourseOrder(params,index){
        console.log (params, index);
        this.courseOrderUuidConnect = params.uuid
        // this.searchFormRight2()
      },
      searchFormRight2(){
        let _this = this
        this.$axios.post (FINANCE ().orderCourseConsume.queryUnrelatedCourse, {
          courseOrderUuid:this.courseOrderUuid ,
          pageIndex:this.pageIndexRight2,
          pageNumber:this.pageNumberRight2
        }).then (({data}) => {
          _this.dataRight2 = data.data['unrelatedCourseList'] || [];
          _this.totalRight2 = data.data.total;
          console.log (_this.dataRight2);
        })
      },
      reasonOk (name) {
        const _this = this;
        this.loading = false;
        this.$refs[name].validate ((valid) => {
          if (valid) {
            this.$axios.post (FINANCE ().invoice.writeInvoice, {
              cpPayRequestUuid: _this.formItem.payUuid,
              receiptNum: _this.formItem.receiptNum,
              // receiptStatus:　1
            }).then (() => {
              _this.modal = false;
              common.notices ('操作成功！');
              _this.searchFormLeft ();
            })
          } else {
            setTimeout (() => {
              this.loading = true;
            }, 0);
          }
        });
      },
      searchFormLeft (val) {
        if (val) this.pageIndexLeft = val
        this.loadDataGridLeft ()
      },
      searchFormRight (val) {
        if (val) this.pageIndexRight = val
        this.loadDataGridRight ()
      },
      loadDataGridLeft () {
        let _this = this;
        this.$axios.get (FINANCE ().orderCourseConsume.queryOfflineDeesPage, {
          params: {
            studentName: this.Search.studentName,
            orderNo: this.Search.orderNo,
            studentPhone: this.Search.studentPhone,
            pageIndex:this.pageIndexLeft,
            pageNumber:this.pageNumberLeft
          },
        }).then (({data}) => {
          _this.dataLeft = data.data['deesInfoVos'] || [];
          _this.totalAmountLeft = data.data['totalAmount'] || '';
          _this.totalLeft = data.data.total;
        })
      },
      loadDataGridRight () {
        let _this = this;
        this.$axios.get (FINANCE ().orderCourseConsume.queryUnrelatedCourseOrder, {
          params: {
            stuName: this.Search.studentNameRight,
            tcName: this.Search.teacherNameRight,
            stuPhone: this.Search.studentPhoneRight,
            courseStartDate:this.Search.courseStartDate,
            courseEndDate:this.Search.courseEndDate,
            pageIndex:this.pageIndexRight,
            pageNumber:this.pageNumberRight
          },
        }).then (({data}) => {
          _this.dataRight1 = data.data['courseOrderList'] || [];
          _this.totalRight = data.data.total;
        })
      },
      isSearchNull () {
        let startTime = '', endTime = '';
        let studentName = this.Search.studentName;
        let orderNo = this.Search.orderNo;
        let studentPhone = this.Search.studentPhone;
        let payStartTime = this.Search.payStartTime;
        let payEndTime = this.Search.payEndTime;
        let payType = this.Search.payType;
        let saleName = this.Search.saleName;
        let teamName = this.Search.teamName;
        let channelName = this.Search.channelName;

        startTime = this.Search.submitStartTime;
        endTime = this.Search.submitEndTime;
        console.log (startTime);
        console.log (endTime);
        if (!startTime && !startTime && !studentName && !orderNo && !studentPhone && !payStartTime && !payEndTime && !payType && !saleName && !teamName && !channelName) {
          return true;
        } else {
          return false;
        }
      },
      getFullPhone (phone) {
        getFullPhone (phone, COMMON_API ().Phone.getFullPhone);
      },
      changeShDate (value) {
        this.Search.checkStartTime = value[0] || '';
        this.Search.checkEndTime = value[1] || '';
      },
      changePayDate (value) {
        this.Search.payStartTime = value[0] || '';
        this.Search.payEndTime = value[1] || '';
      },
      pageChangeLeft (pageIndex) {
        this.pageIndexLeft = pageIndex;
        this.searchFormLeft ();
      },
      pageChangeLeft2 (pageIndex) {
        this.pageIndexLeft2 = pageIndex;
        this.searchFormLeft2 ();
      },
      pageChangeRight (pageIndex) {
        this.pageIndexRight = pageIndex;
        this.searchFormRight ();
      },
      pageChangeRight2 (pageIndex) {
        this.pageIndexRight2 = pageIndex;
        this.searchFormRight2 ();
      },
      correlationOk (name) {
        let _this = this;
        this.loading = false;
        this.$refs[name].validate ((valid) => {
          if (valid) {
            this.$axios.get (FINANCE ().orderCourseConsume.connectOrder, {
              params: {
                payUuid: _this.FormDataCorrelation.orderNum,
                uuids:  _this.uuidList,
              }
            }).then ((res) => {
              if (res.data.code == '100') {
                common.notices ('关联成功！！');
              }
              _this.correlationOrderModal = false;
              _this.searchFormRight ();
              _this.searchFormLeft2 ();
              _this.FormDataCorrelation.orderNum = ''
              _this.selectionRowData = []
              _this.selectionRowDataLeft = []
              _this.uuidList = []
              _this.courseOrderUuid = ''
            })
          } else {
            setTimeout (() => {
              this.loading = true;
            }, 0);
          }
        });
      },
      updateOk (name) {
        let _this = this;
        this.loading = false;
        this.$refs[name].validate ((valid) => {
          if (valid) {
            this.$axios.get (FINANCE ().orderCourseConsume.updateCourseLeadsByPhone, {
              params: {
                phone: _this.FormDataUpdate.stuPhoneNumber,
                uuid:  _this.uuidListUpdate,
              }
            }).then ((res) => {
              if (res && res.data.code == '100') {
                common.notices ('关联成功！！');
              }
              _this.updateCourseLeadsByPhoneModal = false;
              _this.searchFormRight2 ();
              _this.selectionRowDataRight2 = []
              _this.uuidListUpdate = []
              _this.courseOrderUuidConnect = ''
            })
          } else {
            setTimeout (() => {
              this.loading = true;
            }, 0);
          }
        });
      },
      courseConnectCourseOrderOk(){
        let _this = this
        if(this.uuidListConnect.length && this.courseOrderUuidConnect) {
          this.$axios.post (FINANCE ().orderCourseConsume.courseConnectCourseOrder, {
            courseOrderUuid: _this.courseOrderUuidConnect,
            uuids: _this.uuidListConnect,
          }).then (() => {
            _this.courseConnectCourseOrderModal = false;
            common.notices ('关联成功！');
            _this.uuidListConnect = []
            _this.courseOrderUuidConnect = ''
            _this.searchFormRight2();
          })
        }else{
          common.notices ('请点选要关联的那一条数据！！');
        }
      },
    },
    computed: {
      theightLeft () {
        return (SCREEN_SIZE === 'md' && this.dataLeft.length > 11) ? 470 : '';
      },
      theightLeft2 () {
        return (SCREEN_SIZE === 'md' && this.dataLeft2.length > 11) ? 470 : '';
      },
      theightRight () {
        return (SCREEN_SIZE === 'md' && this.dataRight1.length > 11) ? 470 : '';
      },
      theightRight2 () {
        return (SCREEN_SIZE === 'md' && this.dataRight2.length > 11) ? 470 : '';
      }
    },
    components: {OBreadcrumb, PageModel}
  };
</script>

<style>
  .payImg {
    display: block;
    width: 300px;
  }
</style>
