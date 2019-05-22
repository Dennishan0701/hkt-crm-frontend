<template>
  <Modal
    title="编辑指标"
    v-model="channelModal"
    :mask-closable="false"
    :loading = "loading"
    @on-ok="onOk('formValidate')"
    :style="{top: '20px'}">
    <i-form ref="formValidate" :model="formItem" :label-width="80">
      <Form-item label="时间">
        <Date-picker @on-change='getMonth' v-model="formItem.month" type="month" placeholder="选择年月" style="width: 200px"></Date-picker>
      </Form-item>
      <Form-item label="团队">
        <table style="width: 100%;text-align: center;cellspacing:0">
          <thead>
          <tr>
            <td style='width: 33%'>团队</td>
            <td style='width: 33%'>属性</td>
            <td style='width: 33%'>指标（元）</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for='(item,index) in data' :key='index'>
            <td>{{item.teamName}}</td>
            <td>{{item.teamType}}</td>
            <td><i-input v-model="item.saleTarget" placeholder="请输入..."></i-input></td>
          </tr>
          </tbody>
        </table>
      </Form-item>
    </i-form>

  </Modal>
</template>

<script type="text/ecmascript-6">
  import {TARGET} from 'common/api/target.js';
  import {common} from 'common/js/common.js';
  export default{
    data() {
      return {
        channelModal: false,
        loading: true,
        pageIndex: 1,
        pageNumber: 1000,
        currentRowData: {},
        formItem: {
          teamUuid: '',
          saleTargetId: '',
          teamName: '',
          teamType: '',
          saleTarget: '',
          month: '',
        },
        data: [],
      }
    },
    methods: {
      loadDataGrid(search, orderBy = '', sortBy = '') {
        // let param = `?month=${search.month}&pageIndex=${this.pageIndex}&pageNumber=${this.pageNumber}&orderBy=${orderBy}&sortBy=${sortBy}`;
        // let apiUrl = TARGET().target.dataGrid+param;
        // const _this = this;
        // common.ajax({
        //   url: apiUrl,
        //   method: 'get',
        //   success: function(res){
        //     _this.data = res.data['saleTargetVos'] || [];
        //   }
        // });
        this.$axios.get(TARGET().target.dataGrid,{
          params:{
            month : search.month,
            pageIndex : this.pageIndex,
            pageNumber : this.pageNumber,
            orderBy : orderBy,
            sortBy : sortBy,
          },
        }).then( ({data}) => {
          this.data = data.data['saleTargetVos']|| [];
        })
      },
      getMonth(value){
        this.month = value;
        this.loadDataGrid({ month: value});
      },
      show() {
        this.channelModal = true;
      },
      currentData(currentRow) {
        this.currentRowData = currentRow;
      },
      onOk(name) {
        this.loading = false;
        const _this = this;
        let saleTargets='';
        this.data.forEach(function (v, i) {
          saleTargets += v.teamUuid+','+v.month+','+v.saleTarget+';'
        })
        // common.ajax({
        //   url: TARGET().target.changeAllTarget,
        //   data: {
        //     saleTargets: saleTargets
        //   },
        //   success: function (response) {
        //     _this.channelModal = false;
        //     common.notices('操作成功！！');
        //     _this.$emit('reFresh', 'success');
        //   }
        // });

        this.$axios.post(TARGET().target.changeAllTarget,{
            saleTargets : saleTargets,
        }).then( () => {
          this.channelModal = false;
          common.notices('操作成功！！');
          this.$emit('reFresh', 'success');
        })
      },
    }
  };
</script>

<style scoped>
  table{
    border-collapse: collapse;
  }
  table td{
    border:1px solid #e3e8ee;
    margin:0;
    padding:0;
  }
</style>
