<template>
  <div id="app">
  	<router-view/>
  	<!--<transition>
    	
    </transition>-->
  </div>
</template>

<script>
	
import * as comm from '@/assets/js/comm'
export default {
	name: 'App',
	mounted () {  
		window.ZSTObtainParameter = comm.ZSTObtainParameter;
		comm.getToken(); //获取token
 		comm.noRefresh(); 
 		comm.postColor('ffffff'); //传递顶部的手机导航栏的色值给安卓
 		//定时器定时获取TOKEN
		let _settime = setInterval(function(){
			if(comm.TOKEN == ''){
				comm.getToken(); //获取token
			}else{
				//comm.toast(comm.TOKEN)
				clearInterval(_settime); //清除定时器
			}
		},500);
  },
}
</script>

<style>
	@import 'assets/css/base.css';
	/*#app{
		height: 100%;
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}*/
</style>
