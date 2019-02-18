<template>
	<div>
		<div class="fz14 box">
			<div class="border-buttom">
				<p>商家名称</p>
				<p class="fc-c">{{storeName}}</p>
			</div>
			<div class="border-buttom">
				<p>订单编号</p>
				<p class="fc-c">{{orderNum}}</p>
			</div>
			<div>
				<p>订单时间</p>
				<p class="fc-c">{{consumeTime}}</p>
			</div>
		</div>
		<div class="fz14 box">
			<p><span>应付金额</span><span class="fl-r fc-c">￥{{totalMoney}}</span></p>
			<p><span>话币抵扣</span><span class="fl-r fc-c">-￥{{integralConvertCash}}</span></p>
			<p><span>还需付款</span><span class="fl-r fc-r">￥{{shouldPayMoney}}</span></p>
		</div>
		<div class="fz14 ">
			<p class="title">选择支付方式</p>
			<div class="flex-box">
				<div class="item">
					<img src="../assets/img/wx.png" width="70"/>
					<br />
					<input v-model="paytype" name="paytype" checked="" id="wx" type="radio" value="wx"/><i class="chexkbox"></i><label for="wx">微信支付</label>
				</div>
				<div class="item">
					<img src="../assets/img/money.png" width="70"/>
					<br />
					<input  v-model="paytype" name="paytype" id="xj" type="radio" value="xj"/><i class="chexkbox"></i><label for="xj">现金支付</label>
				</div>
			</div>
		</div>
		<button class="btn" @click="wxPay">确认支付</button>
	</div>
</template>

<script>
import * as comm from '../assets/js/comm'
export default {
	name:'payItem',
	data(){
		return{
			orderNum : this.$route.query.orderNum ,
			storeName : this.$route.query.storeName ,
			consumeTime : comm.timestampToTime(this.$route.query.consumeTime) ,
			shouldPayMoney : this.$route.query.shouldPayMoney ,
			integralConvertCash : this.$route.query.integralConvertCash ,
			totalMoney : this.$route.query.totalMoney ,
			paytype : ''
		}
	},
	methods:{
		/*微信支付*/
		wxPay(){
			if(this.paytype == ''){
				comm.toast('请选择支付方式');
			}else{
				if(this.paytype == 'wx'){
					console.log("微信")
					comm.toast('请前往微信钱包进行支付');
				}else if(this.paytype == 'xj'){
					console.log("现金")
					this.$router.replace({path:'/'});
				}
				/*if (typeof WeixinJSBridge == "undefined"){
				   if( document.addEventListener ){
				       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
				   }else if (document.attachEvent){
				       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
				       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
				   }
				}else{
				   onBridgeReady();
				}*/
			}
		},
		/*h5调起微信支付*/
		/*onBridgeReady(){
		   WeixinJSBridge.invoke(
		       'getBrandWCPayRequest', {
		           "appId":"wx2421b1c4370ec43b",     //公众号名称，由商户传入     
		           "timeStamp":"1395712654",         //时间戳，自1970年以来的秒数     
		           "nonceStr":"e61463f8efa94090b1f366cccfbbb444", //随机串     
		           "package":"prepay_id=u802345jgfjsdfgsdg888",     
		           "signType":"MD5",         //微信签名方式：     
		           "paySign":"70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名 
		       },
		       function(res){     
		           if(res.err_msg == "get_brand_wcpay_request:ok" ) {}     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
		       }
		   ); 
		}*/
		
	},
	mounted(){
		console.log(this.$route.query)
		console.log(this.paytype)
	}
}
	
</script>

<style scoped>
	.fz14{
		font-size: 14px;
	}
	.box{
		padding: .5rem;
		border-bottom: 2px solid #D6D8DD;
		line-height: 1.5;
	}
	.flex-box{
		display: flex;
	}
	.box>div{
		padding: .25rem 0;
	}
	.item{
		flex: 1;
		text-align: center;
	}
	.title{
		padding: 0 .5rem;
		line-height: 2;
	}
	input[type='radio']{
	    opacity: 0;
	}
	.chexkbox {
		display: inline-block;
		width: 14px;
		height: 14px;
		border: 1px solid #8D8D8D;
		background-size: cover;
		vertical-align: middle;
	    border-radius: 50%;
	}
	input:checked~.chexkbox{
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAANlBMVEUAAAARltsSltoQldsQj98Ql9sRltsQldoRldoSldsQl98SldwRltsQltwRldsRltoQltsSltsGb0GeAAAAEXRSTlMA8KBgEEDAMNCAIJCwUODfcPZN+asAAAFrSURBVFjD7ZfbksMgCIaDIkoSm/L+L7uzszO1jYq43va7/wnh7PZFYfcHJfmFTs44qY7HJZ+Qn7DhL2nhdrO8x2kwsZMoAA8/D6KTdCecDIHQl+MpFnxXn0SWLDixkpv6Q8xAbOizTJCwDgDIDIcSABv3ZAaZJN0MkMySFQdM0HwEEvMhhfdUojV1SQpuK3iT/uYobAVDE8FevlNnEkzFG+UTLiPUpEfo5iGYmqdq9utlgGVAaGfabMB3EhWaSQBGrvVRbSiq4v246RF0A9XYxVKzz60EsGfANf45w1vBOtENcCtqeL70XiwG6iJ7gji1zpRC+lPurE7Lh1rKpVmTdCC9mQhHs4YHAynhYFSE0UBJqDYqjLcKRG3dOMNQhSR94upYX10sYXG10epyjcvrvSJMHhg1vHDizIYhbG1o5cyz+wB+8dSNa8c24eq5PyaXrfLvN0tS5DbicXfj9Dj97GMiEJFEjsP2pc8PxhSYTgGzXkEAAAAASUVORK5CYII=);
		background-size: 14px 14px;
		border: none;
	}
	
</style>