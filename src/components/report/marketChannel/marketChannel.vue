<template>
  <div class="mc">
    <o-breadcrumb second="数据报表" third="市场渠道报表"></o-breadcrumb>
    <div class="grid-widget">
      <!--<Row>-->
        <!--<i-col span=24 class="right">-->
          <!--<i-select v-model="Search.channelName" size="small" placeholder="渠道等级" style="width:172px" clearable>-->
            <!--<i-option v-for="(item,index) in channelLevelList" :key='index' :value="item.value">{{ item.value }}</i-option>-->
          <!--</i-select>-->
          <!--<i-select v-model="Search.channelLevel" size="small" placeholder="渠道名称" style="width:172px" clearable filterable>-->
            <!--<i-option v-for="(item,index) in allChannelList" :key='index' :value="item.uuid">{{ item.name }}</i-option>-->
          <!--</i-select>-->
          <!--<Date-picker type="daterange" @on-change="changeDate" size="small" placement="bottom-end" placeholder="选择日期" style="width: 200px"></Date-picker>-->
          <!--<i-button type="primary" icon="search" size="small" @click="search">查询</i-button>-->
        <!--</i-col>-->
      <!--</Row>-->
      <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" class="right">
        <Form-item style="margin-bottom: 6px;">
          <Row>
            <i-col span=24 class="right">
              <!--<i-select v-model="Search.channelLevel" size="small" placeholder="渠道等级" style="width:172px" clearable>-->
                <!--<i-option v-for="(item,index) in channelLevelList" :key='index' :value="item">{{ item }}</i-option>-->
              <!--</i-select>-->
              <i-input :size="$store.state.searchModuleSize" v-model="Search.channelLevel" placeholder="渠道等级" style="width:100px;margin-right:2px;"></i-input>
              <i-select :size="$store.state.searchModuleSize" v-model="Search.channelName" placeholder="渠道名称" style="width:172px" clearable filterable>
                <i-option v-for="(item,index) in allChannelList" :key='index' :value="item.name">{{ item.name }}</i-option>
              </i-select>
              <Form-item prop="date" style="display:inline-block;margin-top: 3px;">
                <Date-picker :size="$store.state.searchModuleSize" type="daterange" v-model="formValidate.date" @on-change="changeDate" placement="bottom-end" placeholder="选择日期" style="width: 200px;"></Date-picker>
              </Form-item>
              <i-button :size="$store.state.searchModuleSize" type="primary" icon="search" @click="search('formValidate')">搜索</i-button>
            </i-col>
          </Row>
        </Form-item>
      </i-form>
    </div>
    <i-table size="small" highlight-row stripe :columns="columns" :data="data"></i-table>
    <!--<div class="gridPage">-->
      <!--<Page :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
    <!--</div>-->
    <Modal
      v-model="courseStatusModal"
      :loading = "loading"
      :closable = "false"
      title="渠道报名年级分布"
      @on-ok="hide()"
      width=700>
        <!--<i-table size="small" highlight-row stripe :columns="columns2" :data="data2" width=300 style="display: inline-block; height:500px;"></i-table>-->
        <!--<div id="main" style="width:360px;height:500px;display: inline-block;padding:0 5px;"></div>-->
        <i-table size="small" highlight-row stripe :columns="columns2" :data="data2" width=300 style="display: inline-block; height:450px;"></i-table>
        <div id="main" style="width:360px;height:450px;display: inline-block;padding:0 5px;"></div>
        <!--<div class="btn-tools">-->
         <!--<i-button icon="ios-arrow-back" @click="close" style="width:100px">返回</i-button>-->
        <!--</div>-->
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API} from 'common/api.config.js';
  import {REPORT} from 'common/api/report.js';
  import {common} from 'common/js/common.js';
  // import {ECHARTS} from 'common/api/echarts.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  // import Gradeechart from 'components/echarts/gradeEachart';
  let echarts = require('echarts/lib/echarts');

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
        formValidate: {
          data:'',
        },
        ruleValidate: {
          date: [
            { validator: validateDate, trigger: 'change' }
            // { required: true, message:'请选择查询的日期', trigger: 'change' }
          ],
        },
        loading:false,
        courseStatusModal:false,
        // channelLevelList:[],
        allChannelList:[],
        startTime: '',
        endTime: '',
        data: [],
        data2: [],
        dataPic:[],
        arr:[],
        aModel:{
          value: '',
          name: ''
        },
        pageIndex:1,
        pageNumber:1000,
        total: 0,
        Search:{
          channelName:'',
          channelLevel:''
        },
        columns: [
          {
            title: '渠道名称',
            align:'center',
            key: 'channelName',
            fixed:'left',
            minWidth: 90,
          },
          {
            title: '渠道等级',
            align:'center',
            key: 'channelLevel',
            minWidth: 90,
          },
          {
            title: '报名人数',
            align:'center',
            key: 'signUpNumber',
            minWidth: 90,
            render(h, params) {
                return h('span',params.row.signUpNumber||0)
            }
          },
          {
            title: '重复人数',
            align:'center',
            key: 'repetitionSignUpNumber',
            minWidth: 90,
            render(h, params) {
              return h('span',params.row.repetitionSignUpNumber||0)
            }
          },
          {
            title: '重复报名率',
            align:'center',
            key: 'repetitionSignUp',
            minWidth: 90,
            render(h, params) {
              return h('span',params.row.repetitionSignUp||0)
            }
          },
          {
            title: '已分配人数',
            align:'center',
            key: 'haveDistributeLeadsNumber',
            minWidth: 90,
            render(h, params) {
              return h('span',params.row.haveDistributeLeadsNumber||0)
            }
          },
          {
            title: '排课数',
            align:'center',
            key: 'arrangeCourseNumber',
            minWidth: 90,
            render(h, params) {
              return h('span',params.row.arrangeCourseNumber||0)
            }
          },
          {
            title: '排课率',
            align:'center',
            key: 'arrangeCourseRate',
            minWidth: 90,
            render(h, params) {
              return h('span',params.row.arrangeCourseRate||0)
            }
          },
          {
            title: '名单内排课数',
            align:'center',
            key: 'signUpNumberhaveArrangeTestNumber',
            minWidth: 90,
            render(h, params) {
              return h('span',params.row.signUpNumberhaveArrangeTestNumber||0)
            }
          },
          {
            title: '名单内排课率',
            align:'center',
            key: 'signUpNumberhaveArrangeTestRate',
            minWidth: 90,
            render(h, params) {
              return h('span',params.row.signUpNumberhaveArrangeTestRate||0)
            }
          },
          {
            title: '付费数',
            align:'center',
            key: 'havePayLeadsNumber',
            minWidth: 90,
            render(h, params) {
              return h('span',params.row.havePayLeadsNumber||0)
            }
          },
          {
            title: '转化率',
            align:'center',
            key: 'changeRate',
            minWidth: 90,
            render(h, params) {
              return h('span',params.row.changeRate||0)
            }
          },
          {
            title: '付费金额',
            align:'center',
            key: 'havePayMoneyNumber',
            minWidth: 90,
            render(h, params) {
              return h('span',params.row.havePayMoneyNumber||0)
            }
          },
          {
            title: '操作',
            align: 'center',
            minWidth: 200,
            fixed: 'right',
            render :(h, params) =>{

            return h('div',[
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                },
                style: {
                  margin: '2px',
                },
                on: {
                  click: () => {
                  this.pass(params.row.channelUuid)
              }
          }
      },'报名地区分布'),
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                },
                style: {
                  margin: '2px',
                },
                on: {
                  click: () => {
                    this.showPic(params.row.channelUuid)
                  }
                }
              },'报名年级分布')
            ])
//              return `<i-button type="success" size="small" @click="pass('${row.channelUuid}')">报名地区分布</i-button>
//                    <i-button size="small" @click="showPic('${row.channelUuid}')">报名年级分布</i-button>`;
            }
          }
        ],
        columns2:[
          {
            title: '年级',
            align:'center',
            key: 'grade',
            width: 30,
          },
          {
            title: '报名人数',
            align:'center',
            key: 'gradeRegistCount',
            width: 40,
          },
          {
            title: '占比',
            align:'center',
            key: 'regestCountRate',
            width: 50,
          },
        ]
      }
    },
    mounted(){
      this.getAllChannel();
      // this.getAllChannelLevel();
      // this.paint();
    },
    methods: {
      // 获取所有渠道
      getAllChannel(){
        const _this = this;
        common.ajax({
          url: COMMON_API().allChannel,
          method: 'get',
          success: function(response){
            _this.allChannelList = response.data || [];
            // _this.searchForm(_this.searchForms.channel);
          }
        });
      },
      // 获取渠道等级
      // getAllChannelLevel(){
      //   const _this = this;
      //   common.ajax({
      //     url: COMMON_API().allChannelLevel,
      //     method: 'get',
      //     success: function(response){
      //       console.log(response.data);
      //       _this.channelLevelList = response.data || []
      //     }
      //   });
      // },
      pass(uuid){
        let startTime = this.startTime
        let endTime = this.endTime;
        let changeUuid = uuid;
        location.hash = `/echarts/mapEachart?startTime=${startTime}&endTime=${endTime}&changeUuid=${changeUuid}&map=marketChannel`;
      },
      search(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            // this.$Message.success('提交成功!');
            this.loadDataGrid({
              startTime: this.startTime,
              endTime: this.endTime,
              level: this.Search.channelLevel,
              name: this.Search.channelName,
            });
          }else{
            // this.$Message.error('Fail!');
          }
        })
      },
      loadDataGrid(search) {
        // let param = `?startTime=${search.startTime}&endTime=${search.endTime}&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}`;
        let param = `?startTime=${search.startTime}&endTime=${search.endTime}&level=${search.level}&name=${search.name}`;
        const _this = this;
        common.ajax({
          url: REPORT().MarketChannel.market + param,
          method: 'get',
          success: function (res) {
            _this.data = res.data['marketChannelKpiVos'] || [];
            // _this.total = res.data.total;
          }
        });
      },
      changeDate(value) {
        this.startTime = value[0] || '';
        this.endTime = value[1] || '';
      },
      // pageChange(pageIndex){
      //   console.log(1);
      //   this.pageIndex = pageIndex;
      //   this.search();
      // },
      hide(){
        this.courseStatusModal = false;
      },
      showPic(uuid){
        this.arr=[];
        this.aModel={
          value: '',
          name: ''
        };
        const _this = this;
        common.ajax({
          url: REPORT().MarketChannel.getGradeCount,
          data:{
            startDate:_this.startTime,
            endDate:_this.endTime,
            channelUuid: uuid
          },
          method: 'get',
          success: function (res) {
            _this.data2 = res.data['gradeCountList'] || [];
            if(_this.data2){
              _this.data2.forEach(item => {
                _this.aModel = {
                  value: item.regestCountRate,
                  name: item.grade
                };
                _this.arr.push(_this.aModel);
              });
              paint(_this);
            }
            // _this.data2.forEach(function (item,index) {
            //   aModel = {
            //     value: item.regestCountRate,
            //     name: item.grade
            //   }
            //   arr.push(aModel);
            //   paint();
            // })
          }
        });
        this.courseStatusModal = true;
        function paint(that) {
          var option = {
            tooltip: {
              trigger: 'item',
              formatter: "{b}"
            },
            calculable : true,
            series: [
              {
                name:'年级分布',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                // roseType : 'radius',
                lableLine: {
                  normal: {
                    show: false
                  },
                  emphasis: {
                    show: true
                  }
                },
                data:that.arr
              }
            ]
          };
          var myChart = echarts.init(document.getElementById('main'));
          myChart.clear();
          myChart.setOption(option,true);
        }
      },
    },
    computed: {
      iTableHeight() {
        if (SCREEN_SIZE === 'md' && this.data.length > 12) {
          return 510;
        } else if (SCREEN_SIZE === 'lg' && this.data.length > 19) {
          return 820;
        } else {
          return '';
        }
      }
    },
    components: { OBreadcrumb }
  };
</script>

<style lang="less" rel="stylesheet/less">

</style>
