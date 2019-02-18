<template>
	<div>
		<!---->
		<div class="evaluate-list">
			<div class="evaluate-item bg-f" v-for="item in list">
				<div class="evaluate-head">
					<img :src="src+item.ico" v-if="item.ico "/>
  					<img src="../assets/img/head.png" v-else/>	
					<p class="fz12">{{item.nick}} &nbsp;</p>
					<p class="fz12 fc-c">{{item.createTimeStr}} &nbsp;</p>
				</div>
				<div>
					<p class="fz14">{{item.content}} &nbsp;</p>
					<!--<img src="../assets/img/jd.png" width="80"/>-->
					<p class="fc-c fz10">{{item.inventoryName}} &nbsp;</p>
				</div>
			</div>
		</div>
		<!--等待-->
		<div class="loading-box" v-show="showLoad">
			<i class="loading"></i>
		</div>
	</div>
</template>

<script>
	import * as comm from '../assets/js/comm'
export default{
	data(){
	  	return{
	  		pageNum : 1 ,
	  		limit : 10 ,
	  		totalNum : 0 ,
	  		list :[] ,
	  		scrollState : true ,
	  		showLoad : false ,
	  		src : ''
	  	}
	},
	methods:{
		getAll(){
			let _self = this ;
			let _data = {
				'goodsId' : Number( comm.getQueryString('id') ),
				'pageNum' : _self.pageNum ,
				'limit' : _self.limit
			};
			console.log(typeof _data.id)
			comm.getEvaluate(_data).then(res => {
				let _data = res.data ;
				if(_data.state == 1){
					_data.data.length == 0 ? comm.toast("没有 更多") : self.scrollState = true ;
	    			 _self.list = _self.list.concat(_data.data) ;
	    			 _self.src = _data.imgDomain ;
				}else{
					comm.toast(decodeURIComponent(_data.msg));
				}
	        }).catch(function (error) {
			    comm.alertMsg(error);
			});
		}
	},
	mounted () {  
	    let _self = this ;
	    let sw = true;
	    _self.getAll();
	    window.addEventListener('scroll',function(){
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop ;
             // 判断是否滚动到底部  
            if( (scrollTop +window.screen.availHeight) >= (document.body.offsetHeight-100)) { 
            	if(_self.scrollState ){ //加下状态
            		_self.scrollState = false ;
            		_self.showLoad = true ;
            		_self.pageNum = _self.pageNum + 1 ;
            		setTimeout(()=>{
            			_self.showLoad = false ;
            			_self.getAll();
            		},1000);
            	}
            }
	    })
	}  
}
</script>

<style scoped>
	.evaluate-item{
		padding: .5rem;
		border-bottom: 4px solid #F4F5F6;
	}
	.evaluate-head{
		position: relative;
		padding-left: 1.8rem;
	}
	.evaluate-head img{
		position: absolute;
		left: 0;
		top: 0;
		width: 1.2rem;
		height: 1.2rem;
		border-radius: 50%;
		top: 5px;
	}
</style>