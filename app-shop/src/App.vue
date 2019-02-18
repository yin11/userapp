<template>
  <div id="app">
  	<router-view/>
    <!--<index ></index>
    <evaluate></evaluate>-->
  </div>
</template>

<script>
import * as comm from './assets/js/comm'
export default {
  name: 'App',
  watch:{
		$route(to,from){
			if(to.path == '/paySuccess'){
				comm.PAYSTATE = 0 ;
			}
    }
	}
}
</script>

<style>
@import 'assets/css/base.css';
@import 'assets/css/cover-mint.css';
</style>
