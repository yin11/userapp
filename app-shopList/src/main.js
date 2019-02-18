import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import './assets/js/rem'

Vue.use(router)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})


Vue.use(VueLazyLoad,{
    error:'http://zst.tenzhao.com/zst-wap/app-shopList/img/error.png',
    loading:'http://zst.tenzhao.com/zst-wap/app-shopList/img/loading.png'
});


