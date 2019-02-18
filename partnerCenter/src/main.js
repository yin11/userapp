// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

router.beforeEach((to,form,next) =>{ /*路由变化修改title*/ 
	if(to.meta.title){ document.title=to.meta.title } next(); 
});

import './assets/js/rem'

import echarts from 'echarts'
Vue.prototype.$echarts = echarts 


import { Popup , MessageBox ,Picker , DatetimePicker  } from 'mint-ui';
import 'mint-ui/lib/style.css'
Vue.component(Popup.name, Popup);
Vue.component(Picker.name, Picker);
Vue.component(DatetimePicker.name, DatetimePicker);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
