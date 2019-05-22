<template>
  <Modal
    v-model="addRemarkModal"
    title="课表"
    :loading="loading"
    width='800'
    @on-cancel="cancel"
    @on-ok="addRemarkOk()">
      <div v-html="iframe">
        <!--<iframe ref="free" id="childFree" src="../../../../static/batchSchedule.html" frameborder="0"></iframe>-->
      </div>
  </Modal>
</template>
<script type="text/ecmascript-6">
  // import {TEACHER} from 'common/api/teacher.js';
  import {formateDate, common} from 'common/js/common.js';

  export default{

    data() {
      return {
        addRemarkModal: false,
        loading: true,
        teacherUuid: '',
        url: '',
        iframe: '',
      }
    },
    mounted(){
      // let i=0;
      // window.addEventListener("message", function( e ) {
      //   if(i==0){
      //     if(e.data.type){
      //       common.notices(e.data.msg,'提示','error')
      //
      //     }else{
      //       common.notices(e.data.msg,'提示')
      //     }
      //   }
      //   console.log(i);
      //   i++;
      // }, false );
    },
    methods: {
      loaded() {
        console.log('zhiz');
        //vm.func1()
      },
      show(leadsUuid, teacherUuid, courseOrderUuid) {
//        this.iframe = `<!--<iframe id="childFree" src="../../../../static/timetable.html?uuid=${uuid}" frameborder="0" width=100% height=600px frameborder=auto></iframe>-->`;
        this.iframe = `<iframe id="childFree" src="../../../../static/checkSchedule.html?leadsUuid=${leadsUuid}&teacherUuid=${teacherUuid}&courseOrderUuid=${courseOrderUuid}" frameborder="0" width=100% height=600px frameborder=auto></iframe>`;
//        this.teacherUuid = uuid;
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
  .ivu-modal {
    top: 0;
  }
</style>
