<template>
	<div>
		<!--标题栏-->
		<header class="bg-f" :style="'padding-top:'+status_bar_height+'px'">
			<h3 class="border-buttom">会员列表</h3>
			<span class="ico-retrun" @click="back"><i class="left-arrow"></i></span>
		</header>
		<div :style="'height:'+(status_bar_height+44)+'px'"></div>
		<!--list-->
		<!--等待加载-->
		<div class="timeout" v-show="!showNull && timeoutState">
			<i class="loading"></i>
		</div>
		<div>
			<div class="nullImg" v-show="list.length == 0 && showNull"><img src="@/assets/img/null.png" width="50%"/></div>
			<div v-show="list.length != 0"  v-for=" n in hradList">
				<div class="bg-c pd-lr-10 pd-tb-5 clearfix">
					<span class="fl-l">{{n.createDateStr}}</span><span class="fl-r fc-r">共{{n.totalUser || 0}}人</span>
				</div>
				<router-link :to="{path:'/memberDetail',query:{id:item.id}}" 
					tag="div" 
					class="bg-f border-buttom list-con relative fz13" 
					v-for="item in list" 
					v-if="item.createDateStr.indexOf(n.createDateStr)>= 0">
					<img :src="imgDomain+item.ico" v-show="item.ico"/>
					<img src="@/assets/img/head.png" v-show="!item.ico"/>
					<p class="clearfix">
						<span class="fl-l fz16">
							<i class="p-hide member-name">{{item.nick}}</i>
							<i :class=" item.gender == 1 ? 'ico-man' : 'ico-girl' "></i> 
							<i :class=" item.userRole == 1 ? 'ico-vip' : ''"></i>
						</span>
						<span class="fl-r fc-c">活跃次数{{item.logonCount }}</span>
					</p>
					<p class="p-hide">{{item.cityName || '&nbsp'}}</p>
				</router-link>
			</div>
			<!--等待-->
			<div class="loading-box" v-show="showLoad">
				<i class="loading"></i>
			</div>
		</div>
	</div>
</template>

<script>
import * as comm from '@/assets/js/comm'
import * as getData from '@/assets/js/getData'	
export default {
	data () {
    	return {
    		hradList : [] ,
    		list:[] ,
    		status_bar_height :0 ,
    		lastRecordTime : 0 ,
    		pageNum : 1 ,
    		limit : 20 ,
    		count : 0 ,
    		showNull : false ,//第一次进入页面，不能先显示无记录图
    		scrollState : true ,
			showLoad : false , //是否显示滚动加载状态
			imgDomain : '' , //图片域名 
			month : '' , //当前月份
			time : this.$route.query.time || 0 , //time为0时为全部，传入对应时间，查询对应时间内列表
			timeoutState : true , // 请求超时
    	}
	},
	mounted(){
    	let _self = this ;
    	comm.postColor('ffffff'); //传递顶部的手机导航栏的色值给安卓
    	if(comm.TOKEN == ''){
			comm.getToken(); //获取token
			//定时器定时获取TOKEN
			let _setTime = setInterval(function(){
				if(comm.TOKEN != ''){
					_self.getMembeList();
					clearInterval(_setTime); //清除定时器
				}
			},500);
		}
	    window.addEventListener('scroll',function(){
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop ;
        	// 判断是否滚动到底部  
            if( (scrollTop +window.screen.availHeight) >= (document.body.offsetHeight-100)) {  
            	if(_self.scrollState == true){ //加下状态
            		_self.scrollState = false ;
            		_self.showLoad = true ;
            		_self.pageNum = _self.pageNum + 1 ;
            		setTimeout(()=>{
            			_self.scrollState = true ;
            			_self.showLoad = false ;
            			_self.getMembeList();
            		},1500);
            	}
            }
	    });
	},
	created: function(){
		let _self = this ;
		if(comm.TOKEN != ''){
			_self.getMembeList();
		}
		if(_self.thisMonth){//假如是从当月会员记录
			_self.getTime();
		}
		comm.status_bar_height ? _self.status_bar_height = Number(comm.status_bar_height) :  _self.status_bar_height = Number(comm.getQueryString('status_bar_height')) ;
	},
	methods: {
		//获取当前月份
		getTime(){
			let date = new Date();
			let y = date.getFullYear() ;
			let m = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1 ;
			this.month = y + '-' + m ;
		},
		/*返回上一页*/
		back(){
	        if (window.history.length <= 1) {
                comm.closeWebView(); //关闭webview
            } else {
            	comm.getQueryString('close') == 1 ? comm.closeWebView() : this.$router.go(-1);//返回上一层
            }
            //上面都没执行就说明卡在当前页不是最后一条， histroy记录数量大于1，又没有回退记录，只能返关闭webview
         	//如果上面都执行了 页面都跳走了，这个也就不用管了   
            /*setTimeout(() => {
                comm.closeWebView(); //关闭webview   
            },500);*/
	    },
	    //获取会员列表详情
	    getMembeList(){
	    	let _self  =this ;
   			let data = {
       			token : comm.TOKEN ,
       			time : _self.time ,
       			pageNum : _self.pageNum ,
       			limit :  _self.limit ,
       			lastRecordTime : _self.lastRecordTime , //最后一个数据的时间戳
       		};
       		//_self.hradList = [] ; //因为头部时间循环清空
	    	getData.getMembeList(data).then(res=>{
	    		let _data = res.data ;
				if(_data.state == 1){
					//_self.timeoutState = false ;
					_self.showNull = true ;
					_self.imgDomain = _data.data.imgDomain ;
					let _len = _data.data.spUserInfoList.length ;
					if(_len < _self.limit){
						_self.scrollState = false ;
					}
					if(_self.pageNum == 1){
		       			_self.list = [] ;
		       			_self.hradList = [] ;
		       		}
					/*if(_len> 0){
						let _lastData ;
						_len == 1 ? _lastData = _data.data.spUserInfoList[0].createDateStr :_lastData = _data.data.spUserInfoList[_data.data.spUserInfoList.length-1].createDateStr ;
						let j = _self.hradList.length ;
					    for( j;j<_data.data.spUserInfoCount.length;j++){
							_self.hradList = _self.hradList.concat(_data.data.spUserInfoCount[j]);
 				          	if(_data.data.spUserInfoCount[j].createDateStr == _lastData){
 				             	break  ;
 			        		}
					    }
					}*/
					_self.hradList = _self.hradList.concat(_data.data.spUserInfoCount) ;
					_self.lastRecordTime = _data.data.spUserInfoList[_data.data.spUserInfoList.length-1].createtime ;
					//_self.count =  _data.data.count ;
					_self.list = _self.list.concat(_data.data.spUserInfoList);
				}else{
					comm.toast(decodeURIComponent(_data.msg));
				}
	    	}).catch(function (error) {
	    		_self.timeoutState = false ;
	    		//comm.toast('请求超时');
			    comm.alertMsg(error);
			});
	    }
	}
}
</script>


<style scoped>
.list-con{
	padding: 15px 15px 15px 80px;
}
.list-con img{
	position: absolute;
	left: 22px;
	top: 10px;
	width: 50px;
	height: 50px;
	border-radius: 50%;
}
.member-name{
	/*max-width: 50%;
	display: inline-block;*/
}
.timeout{
	position: fixed;
	left: 50%;
	top: 50%;
	margin-left: -15px;
	margin-top: -15px;
}
</style>