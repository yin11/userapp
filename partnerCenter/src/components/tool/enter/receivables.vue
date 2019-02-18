<template>
	<div>
		<!--二维码收款-->
		<!--标题栏-->
		<header class="bg-r fc-f" :style="'padding-top:'+status_bar_height+'px'">
			<h3 class="">二维码收款</h3>
			<span class="ico-retrun" @click="back"><i class="left-arrow"></i>返回</span>
		</header>
		<div :style="'height:'+(status_bar_height+44)+'px'"></div>
		<!---->
		<div class="bg-r" style="padding-bottom: 32px;">
			<div class="code-box bg-f">
				<h3 class="num ">￥1999</h3>
				<img :src="'data:image/gif;base64,'+qrContent" width="60%"/>
				<p class="fz16">扫二维码支付金额</p>
				<div class="flex-box">
					<div class="item">
						<input type="radio" name="payway" id="payway1" checked="checked" value="1" v-model="receiptWay" @change="allianceshop"> 
						<label for="payway1" class="radio">支付宝收款</label> 
					</div>
					<div class="item">
						<input type="radio" name="payway" id="payway2" value="2" v-model="receiptWay" @change="allianceshop"> 
						<label for="payway2" class="radio">微信收款</label>
					</div>
				</div>
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
			status_bar_height :0 ,
			receiptWay : 1 , //默认支付宝
			payerShopId : '8600000000' ,
			qrContent: '' , //付款二维码路径
			status_bar_height : 0 ,
		}
	},
	methods: {
		/*返回上一页*/
		back(){
	        this.$router.push({path:'/'});  //返回首页
	    },
	    //获取支付二维码
	    allianceshop(){
	    	let _self = this ;
	    	let _data = {
	    		token : comm.TOKEN ,
	    		receiptWay : _self.receiptWay , //收款方式 1支付宝 2微信
	    		payerShopId : _self.payerShopId , //付款方商家Id
	    	}
	    	getData.allianceshop(_data).then(res=>{
	    		let _data = res.data ;
				if(_data.state == 1){
					_self.qrContent = _data.qrContent ;
				}else{
					comm.toast(decodeURIComponent(_data.msg));
				}
	    	}).catch(function (error) {
			    comm.alertMsg(error);
			});
	    },
	    //查询商家是否已经支付成功
	    /*paySuccess(){
	   		let _self = this;
	   		let _data = {
	   			
	   		}
	   		getData.paySuccess(_data).then(res=>{
	   			let _data = res.data ;
				if(_data.state == 1){
					_self.$router.push({path:'/paySuccess'});  //跳转支付成功页面
				}else{
					comm.toast(decodeURIComponent(_data.msg));
				}
	   		}).catch(function (error) {
			    comm.alertMsg(error);
			});
	    }*/
    },
    created: function(){
		let _self = this ;
		_self.allianceshop();
		comm.status_bar_height ? _self.status_bar_height = Number(comm.status_bar_height) :  _self.status_bar_height = Number(comm.getQueryString('status_bar_height')) ;
	}
}
</script>

<style scoped>
#app{
	height: 100%;
}
.code-box{
	margin: 0 auto;	
	width: 93%;
	padding: 135px 0 0 0;
	/*height: 456px;*/
	text-align: center;
}
.code-box img{
	margin-bottom: 10px;
}
.num{
	font-size: 25px;
	margin-bottom: 30px;
}
.flex-box{
	padding: 120px 0 10px 0;
}
input[type="radio"]:checked+label{
	color: #000000;
}
</style>