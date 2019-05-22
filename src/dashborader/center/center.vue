<template>
  <div class="notices">
    <Card >
      <div slot="title" icon="person" name="personal">
        <span>个人资料</span>
      </div>
      <personal-center ref="personalCenter"></personal-center>
      <!--<TabPane label="消息中心" icon="android-drafts" name="message">-->
        <!--<msg-center ref="msgCenter"></msg-center>-->
      <!--</TabPane>-->
    </Card>
  </div>
</template>

<script type="text/ecmascript-6">
  // import {} from 'common/api.config.js';
  // import msgCenter from 'dashborader/center/msgCenter';
  import personalCenter from 'dashborader/center/personalCenter';
  export default{
    data() {
      return {
        showKey: this.$route.params.name
      }
    },
    mounted() {
      console.log(this.$route.params.name);
    },
    methods: {},
    components: {personalCenter}
  };
</script>

<style lang="less" rel="stylesheet/less">

</style>
