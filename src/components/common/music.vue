<template>

  <div class="roleManager">
    <o-breadcrumb second="公众管理" third="音乐播放"></o-breadcrumb>

    <div class="music">

      <i-button type="success" size="large" icon="play" v-show="play" @click="togglePlay">点我就能控制音乐</i-button>

      <i-button type="success" size="large" icon="pause" v-show="!play"  @click="togglePlay">点我就能控制音乐</i-button>

    </div>

  </div>

</template>

<script type="text/ecmascript-6">
  import {common,formateDate} from 'common/js/common.js';
  import {COMMON_API} from 'common/api.config';
  import OBreadcrumb from 'components/o/OBreadcrumb';

  export default{
    data() {
      return {
        play:true,
      };
    },
    mounted() {

      this.playLoad()

    },
    methods: {
      playLoad () {
        const _this = this;
        // common.ajax({
        //   url: COMMON_API().Music.getFormalMusicSwitch,
        //   success: function (res) {
        //       if(res.data == 1){
        //         _this.play = false;
        //       }else if(res.data == 0){
        //         _this.play = true;
        //       }
        //   }
        // });

      },
      togglePlay () {
        const _this = this;
        let isOn;
        if(_this.play == true){
          isOn = 1;
        }else {
            isOn = 0;
        }
        // common.ajax({
        //   url: COMMON_API().Music.editFormalMusicSwitch,
        //   data:{
        //       isOn: isOn
        //   },
        //   success: function (res) {
        //
        //     if(res.data == 1){
        //       _this.play = false;
        //     }else if(res.data == 0){
        //       _this.play = true;
        //     }
        //
        //     common.notices(res.msg);
        //   }
        // });
        this.$axios.post(COMMON_API().Music.editFormalMusicSwitch,{
          isOn: isOn
        }).then( ({data}) => {
          if(data.data == 1){
            _this.play = false;
          }else if(data.data == 0){
            _this.play = true;
          }
          common.notices(data.msg);
        })
      },
    },
    components: { OBreadcrumb }
  };
</script>

<style scoped>
  .music {
    position: absolute;
    left:50%;
    top:50%;
    -webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
  }
  .music button{
    font-size: 30px;

  }
</style>
