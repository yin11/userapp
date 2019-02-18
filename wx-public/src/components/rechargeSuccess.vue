<template>
	<div>
		<div class="box-head">
			<img src="../assets/img/success.jpg" width="100%"/>
			<router-link :to="{path:'/List',query: {totalmoney: totalmoney}}" tag='a' class='to-link'>查看</router-link>
			<p class="fc-f fz20">成功充值{{money}}话币</p>
			<p class="fc-yellow fz12">账户余额{{totalmoney}}元</p>
		</div>
		<div class="fz12 box-list border-buttom">
			<p>订单编号：{{orderNum}}</p>
			<p>订单时间：{{orderTime}}</p>
			<p>支付方式：充值卡充值</p>
		</div>
		<router-link to='/' tag='button' class='btn'>关闭</router-link>
	</div>
</template>

<script>
import * as comm from '../assets/js/comm'
export default {
	name: 'rechargeSuccess',
	data(){
		return{
			money:this.$route.query.money ,
			totalmoney : '',
			orderNum :  '',
			orderTime : this.$route.query.orderTime
		}
	},
	created: function(){
		this.totalmoney =  Number(JSON.parse(comm.getStore('userinfo')).totalmoney) +Number(this.$route.query.money) ;
		this.orderNum = JSON.parse(comm.getStore('userinfo')).username + this.$route.query.orderTime.replace(/-/g,'').replace(/:/g,'').replace(' ','') ;
	}
}
</script>

<style scoped>
	.box-head{
		padding-top: 9rem;
		text-align: center;
		padding-bottom: 1.5rem;
		line-height: 1.5;
	}
	.to-link{
		position: absolute;
		top: 17px;
		right: 0;
		background: #fff;
		color: #F7094D;
		font-size: 13px;
		line-height: 27px;
		height: 27px;
		width: 3.5rem;
		border-top-left-radius: 27px;
		border-bottom-left-radius: 27px;
	}
	.box-head img{
		position: absolute;
		left: 0;
		top: 0;
		z-index: -1;
	}
	.fz20{
		font-size: 20px;
	}
	.fz12{
		font-size: 12px;
	}
	.box-list{
		padding: .4rem 1rem;
		line-height: 2;
	}
</style>