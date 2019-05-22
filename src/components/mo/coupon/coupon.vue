<template>
<div>
  <o-breadcrumb second="市场与运营" third="兑换码管理"></o-breadcrumb>
  <Row class="row1-coupon">
    <i-col >
      <i-form ref='searchformValidate' :size="$store.state.searchModuleSize" :model="searchForms" :rules="ruleSearch" :label-width="40" style="width: 300px;">
        <Form-item label="渠道:" prop="channel" style="margin-bottom:10px;">
          <i-select v-model="searchForms.channel" :size="$store.state.searchModuleSize" style="width:150px" placeholder="全部" clearable filterable>
            <i-option v-for="(item,index) in allChannelList" :key='index' :value="item.uuid">{{item.name}}</i-option>
          </i-select>
          <i-button type="primary" :size="$store.state.searchModuleSize" @click="searchForm(1)" style="margin-left:20px">搜索</i-button>
        </Form-item>
      </i-form>
    </i-col>
  </Row>
  <Row class="row2-coupon">
    <i-col span="24">
      <i-button size="small" :size="$store.state.searchModuleSize" type="primary"  @click="checkAddBtn">新增</i-button>
      <i-button size="small" :size="$store.state.searchModuleSize" type="primary" @click="downloadBtn">下载code</i-button>
    </i-col>
  </Row>
  <i-table size="default" highlight-row stripe :columns="columns" :data="searchdata"></i-table>
  <div class="gridPage">
    <PageModel :total="total" :pageSize="pageNumber" :currentPage="pageIndex" @pageChange="pageChange"></PageModel>
    <!--<Page :current="pageIndex" :total="total" :page-size="pageNumber" size="small" @on-change="pageChange" show-total show-elevator></Page>-->
  </div>
  <!--新增兑换码-->
  <Modal
    v-model="addModal"
    title="新增兑换码"
    :loading="loading"
    :mask-closable="false"
    :closable="false">
    <i-form ref='formValidate' :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="兑换码数量" prop="count">
        <Input v-model="formValidate.count" placeholder="" ></Input>
        <span style="float:right">最多1000个</span>
      </FormItem>
      <Form-item label="关联渠道" prop="channel">
        <i-select v-model="formValidate.channel" style="width:200px" placeholder="请选择" filterable clearable>
          <i-option v-for="(item,index) in allChannelList" :key='index' :value="item.uuid">{{item.name}}</i-option>
        </i-select>
      </Form-item>
    </i-form>
    <div slot="footer" style="text-align: center">
      <i-button type="success" @click="addCoupon('formValidate')">提交</i-button>
      <i-button type="ghost" @click="addModal = false">关闭</i-button>
    </div>
  </Modal>
  <!--下载兑换码-->
  <Modal
    v-model="downModal"
    title="下载Code"
    :mask-closable="false"
    :closable="false">
    <i-form ref='formValidate2' :model="formValidate2" :rules="ruleValidate2" :label-width="100">
      <Form-item label="选择批次编号" prop="batchNum">
        <i-select v-model="formValidate2.batchNum" style="width:200px" placeholder="请选择" filterable clearable>
          <i-option v-for="(item,index) in allBatchNum" :key='index' :value="item">{{item}}</i-option>
        </i-select>
      </Form-item>
    </i-form>
    <div slot="footer" style="text-align: center">
      <a :href="add"><i-button type="success" @click="downloadCode('formValidate2')">下载</i-button></a>
      <i-button type="ghost" @click="downModal = false">关闭</i-button>
    </div>
  </Modal>
</div>
</template>

<script>
  import {MO} from 'common/api/mo.js';
  import {COMMON_API} from 'common/api.config.js';
  import {formateDate,common,hideCharAtNumber} from 'common/js/common.js';
  import OBreadcrumb from 'components/o/OBreadcrumb';
  import PageModel from 'dashborader/page/page.vue';

  export default {
    data(){
      const validatorCount  = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value > 1000 || value < 1 ) {
              callback(new Error('必须为1-1000'));
            } else {
              callback();
            }
          }
        }, 500);
      };
      const ruleSearchs = (rule, value, callback) => {
        // if (value === '') {
        //   callback(new Error('不能为空'));
        // }
      };
      const validatorChannel  = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('不能为空'));
        }
      };
      return{
        allChannelList:'',
        allBatchNum:'',
        searchdata: [],
        channel:'',
        total:0,
        pageIndex: 1,
        pageNumber: SCREEN_SIZE === 'md' ? 11 : 17,
        Search:'',
        add:'javascript:;',
        addModal: false,
        downModal: false,
        loading: true,
        // downloading: true,
        searchForms:{
          channel:'',
        },
        formValidate:{
          channel:'',
          count:'',
        },
        formValidate2:{
          batchNum:''
        },
        ruleSearch:{
          channel: [
            { validator: ruleSearchs, trigger: 'change' }
          ]
        },
        ruleValidate:{
          count: [
            // { validator: validatorCount, trigger: 'blur' }
            {  required: true, message: '请填写1-1000的数字', trigger: 'blur' ,type: 'number',min: 1,max:1000}
          ],
          channel: [
            // { validator: validatorChannel, trigger: 'change' }
            { required: true, message: '请选择渠道', trigger: 'change' }
          ]
        },
        ruleValidate2:{
          batchNum: [
            { required: true, message: '请选择', trigger: 'change' }
          ]
        },
        columns: [
          {
            title: '批次ID',
            key: 'batchNumber',
            align:'center',
            minWidth:150,
          },
          {
            title: 'Coupon Code',
            key: 'couponCode',
            minWidth:120,
            align:'center'
          },
          {
            title: '渠道',
            key: 'channelName',
            minWidth:120,
            align:'center'
          },
          {
            title: '是否使用',
            key: 'isUseDesc',
            minWidth:90,
            align:'center'
          },
          {
            title: '创建时间',
            key: 'createDate',
            align:'center',
            minWidth:180,
            render(h, params) {
              return h('span',formateDate(params.row.createDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '使用时间',
            minWidth:150,
            key: 'useTime',
            align:'center',
            render(h, params) {
              return h('span',formateDate(params.row.createDate,'yyyy-MM-dd hh:mm:ss'));
            }
          },
          {
            title: '学生姓名',
            key: 'leadsName',
            minWidth:90,
            align:'center'
          },
          {
            title: '学生手机号',
            key: 'leadsPhone',
            minWidth:120,
            align:'center',
            render : (h, params) => {
              if(params.row.leadsPhone) {
                return h('div',[
                  h('span',hideCharAtNumber(params.row.leadsPhone)),
                ])
              }else{
                return '-';
              }
            }
          }
        ]
      }
    },
    mounted() {
      this.getAllChannel();
      console.log(this.searchForms.channel);
    },
    methods:{
      // 获取所有渠道
      getAllChannel(){
        const _this = this;
        common.ajax({
          url: COMMON_API().allChannel,
          method: 'get',
          success: function(response){
            _this.allChannelList = response.data || [];
            _this.searchForm(_this.searchForms.channel);
          }
        });
      },
      // 点击查询按钮
      searchForm(val) {
        if(val) this.pageIndex = val;
        this.loadDataGrid({
          channelUuid:this.searchForms.channel
        });
      },
      loadDataGrid(param) {
        let param1 = `?channelUuid=${param.channelUuid}&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}`;
        // let param1 = `?channelUuid=A8F57CEE-A2A1-460F-A4F5-FDF9527F2318&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}`;
        const _this = this;
        common.ajax({
          url: MO().coupon.queryChannelPage + param1,
          method: 'get',
          success: function (res) {
            console.log(res);
            _this.searchdata = res.data['couponCodeList'] || [];
            _this.total = res.data.total;
          }
        });
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.loadDataGrid({channelUuid:this.searchForms.channel});
      },
      checkAddBtn(){
        this.addModal = true;
        // this.getAllChannel();
      },
      // 添加兑换码
      addCoupon(name){
        console.log(this.formValidate.channel);
        const _this = this;
        this.loading = false;

        this.$refs[name].validate((valid) => {
          if (valid) {
            // this.$Message.success('提交成功!');
            common.ajax({
              url: MO().coupon.addCouponCode,
              data:{
                channelUuid: _this.formValidate.channel,
                count: _this.formValidate.count
              },
              method: 'get',
              success: function(response){
                common.notices('操作成功！！');
                _this.addModal = false;
                _this.searchForm(_this.formValidate.channel);
                // _this.reset();
              }
            });
          } else {
            // this.$Message.error('表单验证失败!');
          }
        })
      },
      // 点击下载按钮
      downloadBtn(){
        this.downModal = true;
        // this.downloading = false;
        const _this = this;
        common.ajax({
          url: MO().coupon.getAllBatchNumber,
          method: 'get',
          success: function(response){
            // console.log(response);
            _this.allBatchNum = response.data.batchNumber;
          }
        });
      },
      // 下载兑换码
      downloadCode(names){
        this.$refs[names].validate((valid) => {
          if (valid) {
            this.add = `${MO().coupon.downCouponCode}?batchNumber=${this.formValidate2.batchNum}`;
            this.downModal = false;
          } else {
            // this.$Message.error('表单验证失败!');
          }
        })
      },
    },
    computed: {
      // theight() {
      //   return (SCREEN_SIZE === 'md' && this.searchdata.length > 11) ? 470: '';
      // }
    },
    components:{
      OBreadcrumb,PageModel
    }
  }
</script>

<style scoped>
  .row1-coupon{

  }
  .row2-coupon{
    padding: 10px 0;
  }
  .channel-span{
    display: inline-block;
    height: 24px;
    line-height: 24px;
  }
</style>
