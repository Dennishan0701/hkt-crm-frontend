import Vue from 'vue';
import App from './App';
import router from './router.config';
import iView from 'iview';
import '../my-theme/dist/iview.css';
import store from './vuex/store';
import {post,fetch} from './common/js/common';
import axios from './axios/index'
import VueClipboard from 'vue-clipboard2'
// import 'iview/dist/styles/iview.css';    // 使用 CSS
Vue.use(iView);
Vue.use(VueClipboard)

Vue.config.productionTip = false

// Vue.prototype.$post = post;
// Vue.prototype.$get = fetch;
Vue.prototype.$axios = axios;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})


router.beforeEach((to,from,next) => {
  next()
})
