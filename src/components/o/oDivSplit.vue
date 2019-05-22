<template>
  <!--div分割组件-->
  <div class="split">
    <h2 v-if="text">{{text}}</h2>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    props: {
      text: String
    }
  };
</script>

<style scoped>
.split{
    position: relative;
    padding: 0;
    height: 26px;
    border-bottom: 2px solid #e5e5e5;
    line-height: 26px;
    margin: 10px 10px 20px 10px;
}
.split h2{
    position: absolute;
    padding: 0 10px;
    border-bottom: 2px solid #59bc5e;
    color: #3C3C3C;
    font-weight: bold;
    font-size: 16px;
    top: -2px;
    left: 0;
}
</style>
