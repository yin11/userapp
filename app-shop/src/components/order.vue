<template>
	<div>
		<div>
			<div class="border-b-20 fz14 address bt-grey"  v-if=" areaCode != '' " @click="getAddressList">
				<p class="fz14 clearfix" style="padding-right: 2rem;"><span class="fl-l">收货人：{{defaultAddress.consignee}}</span><span class="fl-r">{{defaultAddress.phone}}</span></p>
				<p class="fz12" style="padding-right: .5rem;">收货地址：{{defaultAddress.regionInfo + defaultAddress.detailAddress}}</p>
				<i class="right-arrow"></i>
			</div>
			<div v-else class="border-b-20 fz14 address bt-grey" @click="getAddressList">
				<p class="fc-c fz12">请选择收货地址</p>
				<i class="right-arrow"></i>
			</div>
		</div>
		
		<div class="bg-f border-b-20" >
			<div class=" order-info">
				<img :src="orderGoods.imgUrl " />
				<div class="detail">
					<p class="fz14 txt-overflow">{{goodsDetail.data.goodsName}}</p>
					<p class="fz12">型号：{{orderGoods.inventoryName}}</p>
					<p class="fc-r fz12 clearfix">
						￥<span>{{orderGoods.originalPrice}}</span>
						<!--￥<span>{{orderGoods.presentPrice}}<span class="fz12">({{orderGoods.originalPrice}}减{{orderGoods.integralNum}}话呗)</span></span>-->
						<span class="fl-r">X{{number}}</span>
					</p>
				</div>
			</div>
		</div>
		
		<div class="border-b-20 fz14 address-box">
			<div class="border-buttom clearfix">
				<span class="fl-l" >支付类型</span>
				<span class="fl-r radio-box"><input type="radio" id="wx" name='payway' value="2" v-model="payWay"/><span>微信</span></span>
				<span class="fl-r radio-box"><input checked="checked" type="radio" id="zfb" name='payway'  v-model="payWay" value="1"/><span>支付宝</span></span>
			</div>
			<div class="border-buttom clearfix">
				<span class="fl-l">运费</span>
				<span class="fl-r fc-c" style="text-align: right;" v-if="goodsDetail.data.freightPrice == 0">包邮</span>
				<span class="fl-r fc-c" style="text-align: right;" v-else>￥{{goodsDetail.data.freightPrice}}</span>
			</div>
			<div class="border-buttom clearfix">
				<span class="fl-l">商品金额</span>
				<span class="fl-r">+￥{{orderGoods.originalPrice}}*{{number}}</span>
			</div>
			<div class="border-buttom clearfix">
				<span class="fl-l">抵扣话呗</span>
				<span class="fl-r" v-if="BALANCE > number">-￥{{orderGoods.integralNum}}*{{number}}</span>
				<span class="fl-r" v-else-if="BALANCE <= number && BALANCE > 0">-￥{{orderGoods.integralNum}}*{{BALANCE}}</span>
				<span class="fl-r" v-else>话呗余额不足(需{{orderGoods.integralNum*number}}话呗)</span>
			</div>
			<div class="clearfix pay-box" >
				<span class="fl-l">实付款</span>
				<span class="fl-r fz14" >
					共{{number}}件商品  总额：
					<span class="fc-r" v-if="BALANCE >= number">￥{{orderGoods.presentPrice*number + (goodsDetail.data.freightPrice || 0 )}}</span>
					<span class="fc-r" v-else-if=" BALANCE <= number && BALANCE > 0">￥{{orderGoods.presentPrice*BALANCE+orderGoods.originalPrice*(number-BALANCE) + (goodsDetail.data.freightPrice || 0 )}}</span>
					<span class="fc-r" v-else>￥{{orderGoods.originalPrice*number + (goodsDetail.data.freightPrice || 0 )}}</span>
				</span>
			</div>
		</div>
	
		<!--底部按钮-->
		<div>
			<div  class="btn-box bg-f flex-box ">
				<div class="btn-consult fz16" ><a :href="'tel:' + goodsDetail.shopinfo.legalPersonPhone" style="display: block;">在线咨询</a></div>
				<div class="btn-buy bg-r fc-f fz16" @click="postPayOrder">立即购买</div>
			</div>
		</div>
		
		<!--话呗余额不足时弹出-->
		<div v-if="noBalance"> 
			<div class="mask" style="z-index: 6;"></div>
			<div class="bg-f rechange alert-box">
				<button class="close-rechange close-btn" @click="closeRechange"></button>
				<div>
					<img src="../assets/img/ico.png" width="31%" style="margin-bottom: 15px;"/>
					<p class="fz16">当前话呗余额不足</p>
					<p class="fz12">(所需话呗{{number*orderGoods.integralNum}}，话呗余额{{totaIntegral}})</p>
					<p class="fz14 fc-r" style="line-height: 3;" v-if="BALANCE >= number">实付金额{{orderGoods.presentPrice*number+(goodsDetail.data.freightPrice || 0 )}}元</p>
					<p class="fz14 fc-r" style="line-height: 3;" v-else-if=" BALANCE <= number && BALANCE > 0">实付金额{{orderGoods.presentPrice*BALANCE+orderGoods.originalPrice*(number-BALANCE)+(goodsDetail.data.freightPrice || 0 )}}元</p>
					<p class="fz14 fc-r" style="line-height: 3;" v-else>实付金额{{orderGoods.originalPrice*number+(goodsDetail.data.freightPrice || 0 )}}元</p>
				</div>
				<div class="rechange-btn-box clearfix">
						<button class="bg-c fl-l rechange-btn fz16" @click="rechange">话呗充值</button>
						<button class="bg-yellow fl-r fc-f rechange-btn fz16" @click="submitOrder">立即购买</button>
				</div>
				<a class="fz16 rechange-link fc-f" href="/zst-wap/memberPage/showPage.html" v-if="MEMBER == 0">点击获取2000话呗</a>
			</div>
		</div>
	
	</div>
</template>

<script>
import * as comm from '../assets/js/comm'
export default{
	data(){
		return{
			areaCode:'' ,
			payWay : 1 ,
			number : this.$route.query.number ,
			totaIntegral : 0 ,//用户所有积分
			BALANCE : 0 , //用积分可兑换的商品个数
			useIntegralNum : '' ,//兑换商品需要的积分
			goodsDetail : {} ,
			orderGoods : {} ,
			defaultAddress : {},
			noBalance :false ,// 点击购买时，余额不足
			MEMBER:comm.MEMBER ,
			orderTotalPrice : 0 ,//订单总的实付价格
			usedIntegralCount : 0 , //订单扣除的话呗数
			timer : null , //支付成功跳转定时器
			timerState : false , //提交购买后再去得app放回的支付结果
		}
	},
	beforeDestroy: function () {
		comm.PAYSTATE = -1 ;
	    clearInterval(this.timer);//该处的shuffle要如何指向mounted中的shuffle
	    this.timer = null ;
	},
	beforeRouteLeave (to, from, next) {
		next();
		comm.PAYSTATE = -1 ;
	    clearInterval(this.timer);//该处的shuffle要如何指向mounted中的shuffle
	    this.timer = null ;
	},
	methods: {
		//点击跳转app的地址列表
       	getAddressList(){
       		comm.openAddressList();
       	},
       	//点击按钮购买下单
	   	postPayOrder(){
	   		let _self = this ;
	   		let _defaultAddress = _self.defaultAddress  ;
	   		if( comm.rule.empty(_defaultAddress.postCode ,'请选择收货地址') ){//是否选择了收货地址
	   			if(_self.BALANCE >= _self.number){
	   				_self.submitOrder();
	   			}else{
	   				_self.noBalance = true ;
	   			}
	   		}
	   	},
	   	//点击跳转充值
       	rechange(){
       		comm.Recharge();
       	},
       	closeRechange(){
       		this.noBalance =false ;
       	},
       	//提交订单信息给APP
	   	submitOrder(){
	   		try{
	   			if(!comm.TOKEN){
	   				comm.getToken();
	   			}
		   		let _self = this ;
		   		let _defaultAddress = _self.defaultAddress  ;
		   		let _usedIntegralCount ,_orderTotalPrice ,_goodsTotalPrice;
	   			if(_self.BALANCE >_self.number){
	   				_usedIntegralCount = _self.orderGoods.integralNum * _self.number ;
	   				_orderTotalPrice = Number(_self.number * _self.orderGoods.presentPrice) + Number(_self.goodsDetail.data.freightPrice) ;
	   			}else if (_self.BALANCE <= _self.number && _self.BALANCE> 0){
	   				_usedIntegralCount = _self.orderGoods.integralNum * _self.BALANCE ;
	   				_orderTotalPrice = Number(_self.BALANCE * _self.orderGoods.presentPrice) + Number(_self.goodsDetail.data.freightPrice) +Number((_self.number-_self.BALANCE)*_self.orderGoods.originalPrice);
	   			}else if(_self.BALANCE == 0){
	   				_usedIntegralCount = 0 ;
	   				_orderTotalPrice = _self.number * _self.orderGoods.originalPrice  + Number(_self.goodsDetail.data.freightPrice) ;
	   			}
   				_goodsTotalPrice = _orderTotalPrice - Number(_self.goodsDetail.data.freightPrice) ;
	   			let _data = {
	   				payWay :_self.payWay,//1/支付宝 2/微信app 3POS 4助商通余额 5/网银
	   				token : comm.TOKEN ,
	   				receiverName : _defaultAddress.consignee ,
	   				receiverPhone : _defaultAddress.phone  ,   
	   				receiverAddress	: _defaultAddress.regionInfo + _defaultAddress.detailAddress ,     //_self.areaName  ,
	   				goodsCount : _self.number ,
	   				shopId : _self.goodsDetail.data.shopId ,
	   				staffId	: '' ,
	   				receiverCityId : _defaultAddress.areaCode,    //_self.areaCode ,
	   				freight	: _self.goodsDetail.data.freightPrice ,
	   				goodsTotalPrice	: _goodsTotalPrice ,//商品总价格 计算方式 :商品数量 X 商品单价 
	   				orderTotalPrice	: _orderTotalPrice ,//订单总价格 计算方式: 商品总价格+运费
	   				goodsId	:  _self.orderGoods.goodsId,
	   				goodsItemNO : _self.orderGoods.itemNO ,//商品货号 
	   				goodsName :   _self.goodsDetail.data.goodsName,//商品名称
	   				singlePrice : _self.orderGoods.presentPrice,//商品单价
	   				costPrice :  _self.orderGoods.costPrice ,//成本价
	   				orderRemark :  _self.orderRemark,//订单备注
	   				usedIntegralCount : _usedIntegralCount, //订单中所使用的助商通话呗
	   				usedThirdPayment :  _orderTotalPrice ,//第三方实际支付的金额，即订单总价
	   				specParamsIds :  _self.orderGoods.specParamsIds ,//规格参数id 
	   				specParamsName :  _self.orderGoods.inventoryName ,//规格参数名称
	   				//userLeaveMsg :  _self.orderRemark ,//买家留言
	   				originalPrice : _self.goodsDetail.data.originalPrice ,//原价
	   				isMemberArea : _self.goodsDetail.data.isMemberArea ,// 会员商品标志
	   				isBuyLimited : _self.goodsDetail.data.isBuyLimited
	   			};
	   			_self.orderTotalPrice = _orderTotalPrice ;
	   			_self.usedIntegralCount = _usedIntegralCount ;
	   			if(_self.goodsDetail.data.isBuyLimited == 1){//会员商品
	   				_data.maxBuyNum = _self.goodsDetail.data.maxBuyNum ;
	   				//_data.isBuyLimited = _self.goodsDetail.data.isBuyLimited ;
	   			}
	   			_self.timerState = true ; //页面点击购买
				comm.postOrder(_data);
	   		}catch(e){
	   			comm.alertMsg(JSON.stringify(e)+e)
	   		}
	   	},
	},
	mounted() {
		let _self = this ;
		window.ZSTGetAddress = comm.ZSTGetAddress ;
		window.ZSTObtainMember = comm.ZSTObtainMember;
		window.ZSTPaySuccess = comm.ZSTPaySuccess;
		let _setTime = setInterval(function(){
			if(comm.ADDRESS){
				_self.defaultAddress = comm.ADDRESS ;
				_self.areaCode = comm.ADDRESS.postCode ; // 因为areaCode有些数据没有，所以用postCode
			}
			if(comm.MEMBER){
				_self.MEMBER = comm.MEMBER ;
			}
		},500);
		_self.timer = setInterval(function(){
			if(_self.timerState){
				//let _PAYSTATE = comm.getStore('PAYSTATE',msg); //将支付方式存入缓存
				if(comm.PAYSTATE == 1){ //支付成功的状态
					_self.$router.push({
			            path: '/paySuccess', 
			            query: {
			                realPay: _self.orderTotalPrice, 
			                deduct: _self.usedIntegralCount
			            }
			       });
			       clearInterval(_self.timer);
			       comm.PAYSTATE = 0 ;
				}
			}
		},500);
	},
	created:function(){
		let _self = this ;
		comm.getMember();
		//comm.PAYSTATE = 0 ;
		_self.goodsDetail = JSON.parse( comm.getStore('goodsDetail') ) ; //从缓存中获取商品信息
		_self.orderGoods = JSON.parse( comm.getStore('orderGoods') ) ; //从缓存中获取商品信息
		_self.useIntegralNum = _self.goodsDetail.data.integralNum ;
		if(!comm.TOKEN){
			comm.getToken();
		}
		if(comm.ADDRESS){
			_self.defaultAddress = comm.ADDRESS ;
			_self.areaCode = comm.ADDRESS.postCode ; // 因为areaCode有些数据没有，所以用postCode
		}else{
			comm.getAddress({token:comm.TOKEN}).then(res=>{
	        	let _data = res.data ;
	        	if(_data.state == 1){
	        		if(_data.data.length != 0){
	        			_self.defaultAddress = _data.data[0] ;
						_self.areaCode = _data.data[0].postCode ;
	        		}
	        	}else{
					comm.toast(decodeURIComponent(_data.msg));
				}
	        	comm.alertMsg(_data)
	        }).catch(function (error) {
			    comm.alertMsg(error);
			});
		}
		if(comm.TOKEN && comm.TOKEN != '(null)'){
			comm.getBalance({token : comm.TOKEN}).then((res)=>{
				let _data = res.data ;
		    	if(_data.state == 1){
		    		_self.totaIntegral = _data.data.totalMoney ;//用户拥有的积分
		    		_self.BALANCE = Math.floor(_data.data.totalMoney / _self.useIntegralNum); // 得到用户剩余积分可兑换商品数
		    	}else{
		    		comm.toast(decodeURIComponent(_data.msg))
		    	}
			}).catch(function (error) {
			    comm.alertMsg(error);
			});
		}
	}
}
</script>

<style scoped>
	.address{
		padding: .5rem .5rem .5rem 2rem;
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAM1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACjBUbJAAAAEHRSTlMAEPBAwKCAMNBwYCDgULCQan4SDgAAAeFJREFUWMPtVcmWgyAQHGhWweX/v3YCpNIafTRmLnNIXfQpXV298vPF/4cnmojUZ8Ypmu2JbOfb5lStGdqpW96X7QQ9jdvPupnYSA/MLjSKZVRErMfNvM9HpQx+yH6tZ+n4UbmqaYRhKiftWa0vIrIchS/28TKzoQQmEuTHqfXF5px1E7wqDe4O3M5LzFuD8RyF7geh+IgPG2NleidW0MFbQTDtaRt/liS0A4g31/C9bRpQoqlbAvha9p1HhY0qb/ksRDBXk6J+19slkyDWHYIi9vWS3n4kuOi0o4Gj/KbUowMIGq8RQHAql36mkfqFRA79KdlmTy0rUIdjiAl/YjcHgaUAYEQI1F8Fqkk5Tu6E3DmU4xozYueWRgvvmIVZMnjhNCqDXvZ46XVSgtTtucqpzKVW/L8D4mFoe9nFspORuSTvJAMXarm4FGxl6oLYh9Mwx0ryI0vRcLOrNbcLZdr9I4mAjsubyPOwiwIQ53WlkhZKwL1wLdSguSTM1zdQxGcZC48Sw7OwkSDOaycggNEgdDqlNoxZY6zDYZxBOYpwTIPHcA4jHcc5g28ctO1uEMMJGEdkAot1cJPBzEhg/zaSa3ovgZcduP7R3n5ur7RQAAkRLfkpkmQvM0T188UXEn4BicMjfVvLk74AAAAASUVORK5CYII=) no-repeat .35rem center;
		background-size: 1.5rem auto;
	}
	
	.order-info{
		padding: .5rem .5rem .5rem 6rem;
		position: relative;
        min-height: 5rem;
    	box-sizing: border-box;
	}
	.order-info .detail{
		padding: .25rem 0 .25rem .5rem;
	    height: 5rem;
    	box-sizing: border-box;
	}
	.order-info img{
		position: absolute;
		width: 5rem;
		height: 5rem;
		left: .5rem;
	    top: .5rem;
	}
	
	.address-box{
		line-height: 44px;
		padding-left: .5rem;
	}
	.address-box>div{
		padding: 0 .5rem 0 .25rem;
		position: relative;
	}
	.address-box span{
		/*width: 60px;*/
		display: inline-block;
	}
	.address-box input{
		padding: .25rem .5rem;
	    cursor: pointer;
	}
	
	/*底部按钮*/
	.btn-box{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
	    z-index: 3;
		-webkit-box-shadow: 0 2px 7px 0 hsla(0,0%,75%,.5);
    	box-shadow: 0 2px 7px 0 hsla(0,0%,75%,.5);
    	text-align: center;
		line-height: 50px;
		height: 50px;
	}
	.flex-box{
		display: flex;
	}
	.btn-consult{
		flex: 2;
	}
	.btn-buy{
		flex: 1;
	}
	
	/*立即充值*/
	.rechange{
		/*position: fixed;
	    padding-top: 37px;
		width: 78%;
		left: 11%;
		top: 50%;
		z-index: 7;
		text-align: center;
		border-radius: 4px;
	    transform: translateY(-50%);*/
	}
	.close-rechange{
		/*position: absolute;
		width: 27px;
		height: 27px;
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABACAMAAACZQlHRAAAAM1BMVEUAAAD///////////////////////////////////////////////////////////////+3leKCAAAAEHRSTlMAENBgwIDwQCCgUJDgsHAwYMlUCQAAAaNJREFUWMOtWNuSgzAIbSghd+X/v3Y7xt2trQQzmIfONOAJHAkXH+IKPiHwaxGif8bH5IoL9meL9ztSTXkC4AnMULJ721qXRkwpXgSoXP2Zbm7MV0ACMDxF/xKxd2MAV7jmoULiGkYKK7B3upl+wALTfoJiCDoRAb5Ec4oLty7QV6bqTqHT9chZCdwJAs6Eb/j2JX7BqnyUjx2g2XtU+BhAvv+fWkDu3Y0JKoWHcNqNbnr4p/cjZA/EyhJX8c2IgyiBGL+0HoLxz4yVvRK/gsAR/p7KTlDVtgvvHFITlNXNyEu/M5wFdR0WYLdGMlp3zncOACXqdHrC5oFjL9KvvyQuG1CQc5OazxA38TrIb1pGTLQxouVIGWF/uvA4z/YfGSK+vIFxrl5GCJ1JxHF+ExDuhrA7YqfT/lLtoXVPgNuvmf2y21OOPfHdkX7tRcBcippQEEEuiJw/6rJQlp18JaJQls3NQWe2GVoUU6Nkb9fsTaO9db2hgba38fZhQhKRYaQxDFa28U4+pA6GTN7NtI+6OggKA3eJs2M/97G/aWO//ePDDwSVFSA62MqfAAAAAElFTkSuQmCC) no-repeat center;
		background-size: cover;
		top: -2.4rem;
		right: -1rem;*/
	}
	.rechange-btn{
		flex: 1;
		height: 35px;
		line-height: 35px;
		width: 41%;
		border-radius: 35px;
	}
	.rechange .rechange-btn-box{
		padding: 0 8% 12px;
	}
	.rechange-link{
		background: #ff2e4b;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
		line-height: 37px;
		display: block;
		width: 100%;
		text-align: center;
	}
</style>