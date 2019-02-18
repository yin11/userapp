// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/js/rem'
import axios from 'axios'; 
import VueAxios from 'vue-axios'
//Vue.prototype.axios = axios;  
Vue.use(VueAxios, axios);



import VueBarcode from '@xkeshi/vue-barcode'; //引入条形码组件
Vue.component('barcode', VueBarcode);  //声明条形码组件

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  router,
  components: { App  },
  template: '<App/>' ,
})
