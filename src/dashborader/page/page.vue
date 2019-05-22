<template>
    <div class="page">
      <Page :total="total" :page-size="pageSize" :current="currentPage" size="small" @on-change="pageChange" show-total show-elevator></Page>
    </div>
</template>

<script>
  export default {
    name: 'page',
    props:{
      total:Number,
      pageSize:Number,
      currentPage:Number,
    },
    data () {
      return {}
    },
    mounted() {
    },
    methods: {
      pageChange(pageIndex) {
        this.$emit('pageChange',pageIndex);
      },
    },
    computed: {},
    components: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped rel='stylesheet/less'>

</style>
