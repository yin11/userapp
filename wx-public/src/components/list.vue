<template>
	<div>
		<div class="head fc-f">
			<img src="../assets/img/bg.png" width="100%"/>
			<p class="fz18"><span class="num">{{totalmoney}}</span><span></span></p>
			<p class="fz15">话费余额（元）</p>
		</div>
		<!--tab-->
		<div>
			<ul class="flex-box">
				<li :class="{active:index == num}" class="item" v-for="(item, index) in tabList" @click='tab(index)'>
					{{item}}
				</li>
			</ul>
			<div class="list-box">
				<ul v-if=" conList.length > 0 ">
					<li class="order-item border-buttom" v-for="item in conList" >
						<p class="clearfix">
							<span class="fl-l">{{item.title}}</span>
							<span class="fl-r">{{item.transMoney}}元</span>
						</p>
						<p class="clearfix fc-c">
							<span class="fl-l">{{item.transDate}}</span>
							<span class="fl-r"></span>
						</p>
					</li>
				</ul>
				<v-blankPage v-else></v-blankPage>
			</div>
		</div>
		<!--等待-->
		<div class="loading-box" v-show="showLoad">
			<i class="loading"></i>
		</div>
	</div>
</template>

<script>
import fetch from '../assets/js/fetch'
import blankPage from './blankPage'
import * as comm from '../assets/js/comm'
export default {
  	name: 'list',
  	components:{
	    "v-blankPage":blankPage,
	}, 
	data(){
	  	return{
	  		tabList:['全部','充值记录','消费记录'] ,
	  		num : 0 ,
	  		pageNum :1 ,
	  		conList:[] ,
	  		totalmoney : comm.numberToFixed(this.$route.query.totalmoney) ,
	  		scrollState : true ,
	  		showLoad : false
	  	}
	},
	methods:{
		tab(index){
			this.num = index ;
			this.pageNum = 1;
			this.scrollState = true ;
			this.conList = [] ;
			index == 0 ? this.getAllList() : ( index == 1 ? this.getQueryList() : this.getConsumeList() );
		},
		/*获取全部列表信息*/
		getAllList(){
			let _self = this ;
			let data ={
				token: this.token,
				pageNum: this.pageNum,
				limit:10 
			}
			fetch({
		        url: '/api/voip/recharge/query/all',
		        method: 'get',
		        params: data
	    	}).then((res)=>{
	    		let _data = res.data ;
	    		if(_data.state == 1){
	    			 _data.data.length == 0 ? comm.toast("没有 更多") : self.scrollState = true ;
	    			 _self.conList = _self.conList.concat(_data.data) ;
	    			 _self.conList.forEach(function(i,v){
	    			 	i.transMoney = comm.numberToFixed(i.transMoney) ;
	    			 	console.log(i);
	    			 	console.log(v);
	    			 });
	    		}else{
	    			comm.toast(decodeURIComponent(_data.msg))
	    		}
	    	}).catch(function (error) {
				    console.log(error);
			});
		},
		/*获取充值列表信息*/
		getQueryList(){
			let _self = this ;
			let data ={
				token:this.token,
				pageNum: this.pageNum,
				limit:10
			}
			fetch({
		        url: '/api/voip/recharge/query',
		        method: 'get',
		        params: data
	    	}).then((res)=>{
	    		let _data = res.data ;
	    		if(_data.state == 1){
	    			 _data.data.length == 0 ? comm.toast("没有 更多") : self.scrollState = true ;
	    			 _self.conList = _self.conList.concat(_data.data)  ;
	    		}else{
	    			comm.toast(decodeURIComponent(_data.msg))
	    		}
	    	}).catch(function (error) {
				    console.log(error);
			});
		},
		/*获取消费列表信息*/
		getConsumeList(){
			let _self = this ;
			let data ={
				token:this.token,
				pageNum: this.pageNum,
				limit:10 ,
				transTypes :'A,B,D,E,9,11,13'
			}
			fetch({
		        url: '/api/voip/consume/detail',
		        method: 'get',
		        params: data
	    	}).then((res)=>{
	    		let _data = res.data ;
	    		if(_data.state == 1){
	    			 _data.data.length == 0 ? comm.toast("没有 更多") : self.scrollState = true ;
	    			 _self.conList = _self.conList.concat(_data.data) ;
	    		}else{
	    			comm.toast(decodeURIComponent(_data.msg))
	    		}
	    	}).catch(function (error) {
				    console.log(error);
			});
		},
		
	},
	mounted () {  
	    let self = this ;
	    let sw = true;
	    self.token = comm.getStore('accessToken') ;
	    self.getAllList();
	    window.addEventListener('scroll',function(){
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
             // 判断是否滚动到底部  
            if( (scrollTop +window.screen.availHeight) >= (document.body.offsetHeight-100)) {  
            	if(self.scrollState == true){ //加下状态
            		self.scrollState = false ;
            		self.showLoad = true ;
            		self.pageNum = self.pageNum + 1 ;
            		setTimeout(()=>{
            			self.showLoad = false ;
            			if(self.num == 0){
			            	self.getAllList();
			            }else if(self.num == 1){
			            	self.getQueryList();
			            }else{
			            	self.getConsumeList();
			            }
            		},1500);
            		
            	}
            }
	    })
	}  
}
</script>

<style scoped>
	.head{
		text-align: center;
		padding: 1.75rem 0;
	}
	.head img{
		position: absolute;
		left: 0;
		top: 0;
		z-index: -1;
	}
	.num{
		font-size: 1.45rem;
	}
	.fz18{
		font-size: .9rem;
		line-height: 2.05rem;
	}
	.fz15{
		font-size: .75rem;
		line-height: 1.35rem;
	}
	.flex-box{
		display: flex;
	}
	.item{
		flex: 1;
		text-align: center;
		line-height: 2.05rem;
		font-size: .7rem;
	}
	.active{
		color: #F7094D;
		position: relative;
	}
	.active:after{
		content: '';
		display: block;
		width: 64%;
		height: 4px;
		background: #F7094D;
		border-radius: 4px;
		position: absolute;
		left: 18%;
		bottom: 0;
	}
	.list-box{
		padding-left: .325rem;
		padding-top: .95rem;
	}
	.fc-c{
		color: #8d8d8d;
		font-size: .5rem;
		line-height: .9rem;
	}
	.order-item{
		padding: .45rem .8rem .6rem .6rem;
	}
	.order-item p:first-of-type{
		font-size: .7rem;
		line-height: 1.15rem;
	}
	.loading-box{
		padding: .25rem 0;
	}
</style>