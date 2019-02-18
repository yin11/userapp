<template>
	<div>
		<div class="border-buttom user-box">
			<p>{{userinfo.username}}</p>
			<p class="fc-c">昵称：{{userinfo.nick}}</p>
			<img :src="userinfo.ico" v-if="userinfo.ico "/>
  			<img src="../assets/img/head.png" v-else/>
		</div>
		<div  class="border-buttom input-box">
			<div>
				<span>充值卡号：</span>
				<input type="number" class="" placeholder="请输入卡片序列号" v-model="cardnum"/>
				<i class="icon ico-csan" @click="scanGetCard"></i>
			</div>
			<div>
				<span>充值密码：</span>
				<input type="password" class="" placeholder="请输入密码" v-model="cardpwd"/>
			</div>
		</div>
		<button class="btn" @click="postCardRecharge">立即充值</button>
	</div>
</template>

<script>
import fetch from '../assets/js/fetch'
import * as comm from '../assets/js/comm'
import wx from 'weixin-js-sdk'
export default {
	name: 'recharge',
  	data(){
		return{
			userinfo : {} ,
			username : '' ,
			nick : '' ,
			cardnum:'' ,
			cardpwd:''
		}
	},
	methods:{
		postCardRecharge(){
			if(comm.rule.empty(this.cardnum,'充值卡号不能为空') && comm.rule.empty(this.cardpwd,'充值卡密码不能为空')){
				let data ={
					token: comm.getStore('accessToken') ,
					cardnum: this.cardnum,
					cardpwd: this.cardpwd
				}
				fetch({
			        url: '/api/voip/recharge/card',
			        method: 'post',
			        params: data
		    	}).then((res)=>{
		    		let _data = res.data ;
		    		console.log(this.getTime())
		    		if(_data.state == 1){
		    			this.$router.replace({path:'/rechargeSuccess',query: {money: _data.money ,orderTime : this.getTime() }});
		    		}else{
		    			comm.toast(decodeURIComponent(_data.msg))
		    		}
		    	}).catch(function (error) {
			    	console.log(error);
			  	});
			}
		},
		getTime(){
			let date = new Date();
		    let seperator1 = "-";
		    let seperator2 = ":";
		    let month = date.getMonth() + 1;
		    let strDate = date.getDate();
		    if (month >= 1 && month <= 9) {
		        month = "0" + month;
		    }
		    if (strDate >= 0 && strDate <= 9) {
		        strDate = "0" + strDate;
		    }
		    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
		            + " " + date.getHours() + seperator2 + date.getMinutes()
		            + seperator2 + date.getSeconds();
		    return currentdate;
		},
		//点击扫一扫自动获取卡号
		scanGetCard(){
			fetch({
		        url: "/api/voip/wechat/signature?url="+encodeURIComponent(encodeURIComponent(window.location.href)),
		        method: 'get',
		        params: {}
	    	}).then((res)=>{
	    		let _data = res.data ;
	    		wx.config({
		            debug : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		            debug : true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		            appId : _data.appid , // 必填，公众号的唯一标识
		            timestamp : _data.timestamp , // 必填，生成签名的时间戳
		            nonceStr :  _data.nonceStr , // 必填，生成签名的随机串
		            signature : _data.signature ,// 必填，签名，见附录1
		            jsApiList : ['checkJsApi', 'scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		        });
		        wx.ready(function() {
		            wx.scanQRCode({   
		                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
		                scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
		                success: function (res) {
		                	var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
		                    console.log(res);
		                    alert(res);
		                    
		                    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
		                    //sessionStorage.setItem('saomiao_result',result);
		                    //其它网页调用二维码扫描结果： 
		                    //var result=sessionStorage.getItem('saomiao_result');
		                }
		            });
		        });
	    	}).catch(function (error) {
		    	console.log(error);
		  	});
		}
	},
	created: function() {
	   this.username = JSON.parse(comm.getStore('userinfo')).username ;
	   this.userinfo = JSON.parse(comm.getStore('userinfo')) ;
	   this.nick = JSON.parse(comm.getStore('userinfo')).nick ;
	},
}
</script>

<style scoped>
	.user-box{
		padding: .95rem .5rem .5rem .5rem;
		position: relative;
		height: 3rem;
		font-size: .7rem;
		line-height: 1.25rem;
	}
	img{
		position: absolute;
		width: 3.375rem;
		height: 3.375rem;
		right: .54rem;
		top: .5rem;
	}
	.input-box{
		padding:  .5rem;
		font-size: .75rem;
	}
	.input-box div{
		padding: 1.1rem 0;
	}
	.input-box input{
		width: 70%;
		font-size: .75rem;
	}
	.btn{
		font-size: .8rem;
	}
	.ico-csan{
		width: 22px;
		height: 22px;
		background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAM1BMVEUAAAD3CEz3CE33CEz/AFD3CEz3CU34B0v3CEz6BUr2CUz3CEj2CUz2CUz3CE35Bk33CU3Mrrp1AAAAEHRSTlMAf8BAEODwcF8wjyDQsJ9QjILj3AAAAI1JREFUWMPt1TkOwzAMRFGKWqjFdub+p00Z0FUmSCEYfJ0KfTUCKQ9SemJkuRkVnLP49yuaEg5gukBHG8IwwJ0TVCgFyGzAi0AEIvDUwAsmnKMWCf/Uk0PvN8OvhtuLPI2vsJehWTjzkr0mUgQiEIFdAoZWhNEBd2E11Jm+dwF6KzZw6hJvJSWcFlvt4w3+6RdqyrI46AAAAABJRU5ErkJggg==) no-repeat center;
		background-size: cover;
		display: block;
	    position: absolute;
	    right: .5rem;
	    top: 1.6rem;
	}
</style>