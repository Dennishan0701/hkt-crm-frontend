<template>
  <Modal
    v-model="addRemarkModal"
    title="查看课表"
    :loading = "loading"
    width='800'
    @on-cancel="cancel"
    @on-ok="addRemarkOk('formValidateRemark')">
      <div v-html="iframe">
      </div>

  </Modal>
</template>

<script type="text/ecmascript-6">
  import {TEACHER} from 'common/api/teacher.js';
  import {formateDate,common} from 'common/js/common.js';

  export default{
    props: {
      historyRemarkList: {
        type: Array
      }
    },
    data() {
      return {
        addRemarkModal: false,
        loading: true,
        teacherUuid:'',
        url:'',
        iframe:'',
      }
    },
    methods: {
      show(uuid) {
        this.iframe = `<iframe id="childFree" src="../../../../static/timetable.html?uuid=${uuid}" frameborder="0" width=100% height=600px frameborder=auto></iframe>`;
        this.teacherUuid = uuid;
        this.addRemarkModal = true;
      },
      addRemarkOk() {
        this.loading = false;
        this.addRemarkModal = false;
        this.iframe = '';
      },
      cancel(){
        this.iframe = '';
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
  .ivu-modal{
    top: 0;
  }
</style>
