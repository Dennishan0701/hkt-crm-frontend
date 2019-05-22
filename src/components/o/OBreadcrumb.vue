<template>
<div>
  <!--面包屑导航-->
  <Breadcrumb>
    <router-link :to='firstUrl' style="border-left: 2px solid #09C;padding-left: 5px;">
      <BreadcrumbItem>
        <!--<Icon type="ios-home-outline"></Icon> -->
        {{first}}
      </BreadcrumbItem>
    </router-link>

    <router-link to=''>
      <BreadcrumbItem v-show="second">
        <!--<Icon type="social-buffer-outline"></Icon> -->
        {{second}}
      </BreadcrumbItem>
    </router-link>

    <router-link to=''>
      <BreadcrumbItem v-show="third">
        <!--<Icon type="pound"></Icon> -->
        {{third}}
      </BreadcrumbItem>
    </router-link>
    <router-link to=''>
      <BreadcrumbItem v-show="four">
        <!--<Icon type="pound"></Icon> -->
        {{four}}
      </BreadcrumbItem>
    </router-link>

  </Breadcrumb>
</div>
</template>

<script type="text/ecmascript-6">
  const $localStorage = $.localStorage;
  export default{
    props: {
      first: {
        type: String ||'',
        default: '首页'
      },
      second: String ||'',
      secondUrl: String ||'',
      third: String ||'',
      thirdUrl: String ||'',
      four: String ||'',
      fourUrl: String ||''
    },
    data() {
      return {
        firstUrl: '/'
      }
    },
    mounted() {
      let roleAlias = $localStorage.get('user').alias;
      console.log(this.firstUrl);

      if(roleAlias === "cr") {
        this.firstUrl = '/scs/crHome';
      } else if(roleAlias === "cc") {
        this.firstUrl = '/scs/ccHome';
      } else if(roleAlias === "sa") {
        this.firstUrl = '/scs/saleIndex';
      } else {
        this.firstUrl = '/scs/onlyHi';
      }
    }
  };
</script>

<style>
  .ivu-breadcrumb > .v-link-active {cursor: pointer}
  .ivu-breadcrumb-item-link{
    font-size: 15px;
  }

</style>
