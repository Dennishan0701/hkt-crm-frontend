<template>
<div>
  <Modal
    v-model="addRemarkModal"
    title="历史备注"
    :mask-closable="false"
    :closable="false"
    :loading = "loading"
    @on-ok="addRemarkOk()" >
    <!--<div class="o-strong-title">历史备注</div>-->
    <table class="o-table" cellspacing="0"style="width:100%;">
      <tr>
        <th>备注时间</th>
        <th style="width:300px">内容</th>
        <th>备注人</th>
      </tr>
      <tr v-for="(item,index) in historyRemarkList" :key='index'>
        <td>{{item.createDate | formateDate}}</td>
        <td>{{item.content}}</td>
        <td>{{item.userName}}</td>
      </tr>
    </table>
  </Modal>
</div>
</template>

<script type="text/ecmascript-6">
  import {formateDate,common} from 'common/js/common.js';
  const storage = $.localStorage;
  export default{
    props: {
      historyRemarkList: {
        type: Array
      }
    },
    data() {
      return {
        data:[],
        addRemarkModal: false,
        loading: true,
        userUuid: '',
        leadsPhone: ''
      }
    },
    methods: {
      show() {
        this.date = this.historyRemarkList;
        this.userUuid = storage.get('user').uuid;
        this.addRemarkModal = true;
      },
      addRemarkOk() {
        this.addRemarkModal = false;
        this.loading = false;
      }
    },
    filters: {
      formateDate(time) {
        let date = new Date(time);
        return formateDate(date, 'yyyy-MM-dd hh:mm');
      }
    }
  };
</script>

<style>
</style>
