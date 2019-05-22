<template>
  <div style="height:100%;height: 100%;
    display: flex;
    flex-direction: column;">
    <!-- 头部 Start -->
    <oHeader ref="oheader" :user="user" :col-span="colSpan"></oHeader>
    <!-- 头部 End -->
    <Layout>
      <Sider ref="side1" hide-trigger collapsible :collapsed-width="44" v-model="isCollapsed">
        <div @click="collapsedSider" class="toggle-wrap" style="padding: 4px 0px;background: #394555;cursor:pointer;">
          <Icon :class="rotateIcon" style="color:#aeb9c2" type="navicon-round" size="20"></Icon>
        </div>
        <div id="silderBar" class="silderBar">
          <Menu id="menu-set" :class="menuitemClasses" theme="dark" @on-select="selectMenuItem" accordion>
            <Submenu v-for="(menuTree,index) in menuTreeList" :key="menuTree.id" :name='menuTree.id'>
              <template slot="title">
                <Tooltip transfer :content="menuTree.name" :disabled="!isCollapsed" placement="left">
                  <Icon type="chevron-up" size="14" class="icon-arrow"></Icon>
                  <!--<Icon type="ios-keypad" class="icon-pad"></Icon>-->
                  <span>{{menuTree.name}}</span>
                </Tooltip>
              </template>
              <template v-if="menuTree.childMenu">
                <MenuItem v-for="(children,index1) in menuTree.childMenu" :key="children.url" :name='children.url'>
                  <router-link :to="children.url">
                    <template>
                      <!--<Tooltip transfer :content="children.name" :disabled="!isCollapsed" placement="right">-->
                        <!--<Icon type="document-text" class="icon-arrow2"></Icon>-->
                      <!--</Tooltip> -->
                      <!--<span>{{children.name}}</span>-->
                      <Tooltip transfer :content="children.name" :disabled='children.name.length>=9?false:true' placement="left">
                        <Icon type="document-text" class="icon-arrow2"></Icon>
                        <span>{{children.name}}</span>
                      </Tooltip>
                    </template>
                  </router-link>
                </MenuItem>
              </template>
            </Submenu>
          </Menu>
        </div>
      </Sider>
      <Layout>
        <div class="dashborad-wrapper">
          <Spin size="large" class="loding-spin"></Spin>
          <!-- 路由出口 -->
          <transition name="slide-fade">
            <router-view></router-view>
          </transition>
        </div>
      </Layout>
    </Layout>
  </div>
</template>

<script type="text/ecmascript-6">
  import {COMMON_API,apiBase} from './common/api.config.js';
  import {AUTHORITY} from './common/api/authority.js';
  import {storeEnabled, common} from './common/js/common.js';
  import oHeader from './dashborader/header/oHeader';

  const $localStorage = $.localStorage;
  export default {
    data() {
      return {
        isShowSpin: true,
        isCollapsed: false,
        user: $localStorage.get('user') || '',
        userToken: $localStorage.get('token') || '',
        colSpan: {
          asideColSpan: 3,
          wrapperAsideColSpan: 21
        },
        menuTreeList: [],
        MenuTrees:this.$store.state.MenuTrees,
      };
    },
    mounted() {
      GLOBAL.init();
      document.getElementsByClassName("ivu-menu")[0].style.width = "100%";
      if (!storeEnabled()) {
        alert('浏览器不支持本地存储。 请停用“私人模式、隐身模式”，或升级到现代浏览器。');
        return;
      }
      if (this.user && this.userToken) {
        let roleAlias = this.user.alias;
//        console.log(roleAlias);
        if (sessionStorage.getItem("menuName")) {
          location.hash = sessionStorage.getItem("menuName")
        } else {
          if (location.hash === '#/') {
            if (sessionStorage.getItem('lock') == 1) {
              if (roleAlias === "cr") {
                location.hash = '/scs/crHome';
              } else if (roleAlias === "cc") {
                location.hash = '/scs/ccHome';
              } else if (roleAlias === "sa") {
                location.hash = '/scs/saleIndex';
              } else {
                location.hash = '/scs/onlyHi';
              }
            } else {
              location.hash = '/scs/onlyHi';
            }
          }
        }

        // const _this = this;
        // common.ajax({
        //   url: AUTHORITY().MenuTree + "?systemType=0",
        //   method: 'get',
        //   success: function (res) {
        //     _this.menuTreeList = res.data;
        //   },
        //   complete() {
        //     _this.isShowSpin = false;
        //   }
        // });

        this.$axios.get(this.MenuTrees,{
            params:{
              systemType : 0
            },
        }).then( ({data}) => {
          this.menuTreeList = data.data;
          this.isShowSpin = false;
        }).catch(error=>{
          //超时之后在这里捕抓错误信息.
          if (error.response) {
            console.log('error.response')
            console.log(error.response);
          } else if (error.request) {
            console.log(error.request)
            console.log('error.request')
            if(error.request.readyState == 4 && error.request.status == 0){
              //我在这里重新请求
            }
          } else {
            console.log('Error', error.message);
          }
          console.log(error.config);
        });

        // this.$get(this.MenuTrees,{
        //   systemType : 0
        // }).then(({data})=> {
        //   this.menuTreeList = res.data.data;
        //   this.isShowSpin = false;
        // });
      } else {
        location.href = '/static/login.html'
      }
      this.touterLinkStyle();
      // 发送上机请求
      this.$axios.post (COMMON_API ().Phone.RYonWork, {
        uuid: this.user.uuid,
      }).then ((res) => {
        // common.msg ('拨打成功', 'success');
        console.log ('------上机成功------');
      })
    },
    methods: {
      collapsedSider () {
        this.$refs.side1.toggleCollapse();
      },
      link(url){
        var mywin = window.open();
        common.ajax({
          url: AUTHORITY().xkw.dataGrid,
          data: {
            url: url,
            platformValue: 1,
          },
          method: 'get',
          success: function (res) {
            mywin.location.href = res.data;
          },
          successError: function (res) {
            common.notices('token校验失败，无法跳转', '提示', 'error');
          }
        });
      },
      selectMenuItem(key){
//        console.log(key);
        if (key == '/zxxk') {
          this.link('http://www.zxxk.com')
        } else if (key == '/zxzj') {
          this.link('http://zujuan.xkw.com')
        } else if (key == '/xxxk') {
          this.link('http://www.xuekeedu.com')
        } else if (key == '/xxzj') {
          this.link('http://xxzj.xkw.com')
        } else if (key !== '/weixin') {
          window.location.hash = key;
        } else {
          var mywin = window.open();
          common.ajax({
            url: AUTHORITY().SystemUser.getByToken,
            method: 'get',
            success: function (res) {

              mywin.location.href = '//mkt.hicourses.com/login/login?token=' + localStorage.getItem('token');

            },
            successError: function (res) {
              common.notices('token校验失败，无法跳转', '提示', 'error');
            }
          });
        }
        sessionStorage.setItem("menuName", name)
      },
      touterLinkStyle: function () {
        var a = document.getElementsByClassName("router-link-active");
        setTimeout(function () {
          for (let i = 0; i < a.length; i++) {
            a[i].parentNode.parentNode.parentNode.firstChild.click();
            a[i].parentNode.click();
          }
        }, 500)
      }
    },
    computed: {
      rotateIcon () {
        return [
          'menu-icon',
          this.isCollapsed ? 'rotate-icon' : ''
        ];
      },
      menuitemClasses () {
        return [
          'menu-item',
          this.isCollapsed ? 'collapsed-menu' : ''
        ]
      },
    },
    components: {oHeader}
  };
</script>

<style lang="less" rel="stylesheet/less">
  @import "style/app";
</style>
