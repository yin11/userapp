<template>
	<div>
		<div class="head-bg" >
			<!--标题栏-->
			<div class="border-buttom" id="head-bg" :style="'height:'+(status_bar_height+44)+'px'"></div>
			<header class="fc-f " :style="'padding-top:'+status_bar_height+'px'">
				<h3 >服务商中心</h3>
				<span class="ico-retrun" @click="closeWeb"><i class="left-arrow"></i></span>
			</header>
			<div :style="'height:'+(status_bar_height+44)+'px'"></div>
			<!--顶部个人信息-->
			<div class="head fc-f">
				<router-link :to="{path:'/partnerInfo'}" class="fz14 fc-f6" tag="p">
					<span class="ico-vip">助商通服务商</span>ID({{userIfo.username}}){{userIfo.realname}}，你好
				</router-link>
				<div class="relative">
					<p class="fz13 fc-f6">可提现金额</p>
					<p class="fz30" v-if="Number(frozenMoney).toFixed(2) > 0">{{Number(frozenMoney).toFixed(2)  }}</p>
					<p class="fz30" v-else>0</p>
					<router-link :to="{path:'/putCash'}" class="btn-cash bg-f fc-r" tag="button" >一键提现</router-link>
					<!--<button type="button" class="btn-cash bg-f fc-r btn-opcity" v-else >一键提现</button>-->
					<img src="@/assets/img/ico1.png" />
				</div>
			</div>
		</div>
		<!--收益相关信息列表-->
		<div class="bg-f">
			<!--本月收益-->
			<div class="mb-5 ">
				<p class="profit-title fc-c fz12">当月收益状况({{time}})</p>
				<div class="flex-box profit-box">
					<router-link to="/profitList" tag="div" class="item border-right">
						<p class="fz12">本月收益</p>
						<p class="fz15">￥{{infoList.thisMonthProfit || "0"}}</p>
					</router-link>
					<router-link :to="{path:'/profitList',query:{entryType:2}}" tag="div" class="item border-right">
						<p class="fz12">本月预估收益</p>
						<p class="fz15">￥{{infoList.thisMonthEstimateProfit || "0"}}</p>
					</router-link>
					<router-link :to="{path:'/profitList',query:{entryType:2}}" tag="div" class="item">
						<p class="fz12">上月预估收益</p>
						<p class="fz15">￥{{infoList.lastMonthSettlementProfit || "0"}}</p>
					</router-link>
				</div>
			</div>
			<!--本月经营-->
			<div class="mb-5 ">
				<p class="profit-title fc-c fz12">当月经营状况({{time}})</p>
				<div class="flex-box profit-box">
					<router-link :to="{path:'/businessList',query:{time:(dayNum- 1)}}" tag="div" class="item border-right">
						<p class="fz12">本月新增商家</p>
						<p class="fz15">{{infoList.thisMonthNewShop || "0"}}</p>
					</router-link>
					<router-link :to="{path:'/memberList',query:{time:(dayNum- 1)}}" tag="div" class="item border-right">
						<p class="fz12">本月新增会员</p>
						<p class="fz15">{{infoList.thisMonthNewMember || "0"}}</p>
					</router-link>
					<router-link :to="{path:'/currentSaleCard',query:{time:(dayNum-1)}}" tag="div" class="item">
						<p class="fz12">本月售卡</p>
						<p class="fz15">{{infoList.thisMonthSaleCard || "0"}}</p>
					</router-link>
				</div>
			</div>
			<!--数据统计-->
			<div class="mb-5 ">
				<p class="profit-title fc-c fz12">数据统计</p>
				<div class="flex-box profit-box">
					<router-link to="/businessCount" tag="div" class="item border-right">
						<p class="fz12">累计商家统计</p>
						<p class="fz15">{{infoList.totalShopNumber || "0"}}</p>
					</router-link>
					<router-link to="/menberCount" tag="div" class="item border-right">
						<p class="fz12">累计会员统计</p>
						<p class="fz15">{{infoList.totalMemberNumber || "0"}}</p>
					</router-link>
					<router-link to="saleCard" tag="div" class="item">
						<p class="fz12">售卡统计</p>
						<p class="fz15">{{infoList.totalSaleCardNumber || "0"}}</p>
					</router-link>
				</div>
				<div class=" border-top total">
					<p class="clearfix">
						<span class="fl-l fz12 ico-total">累计收益总额</span>
						<span class="fl-r fc-r fw-6 fz16">￥{{infoList.totalProfitNumber || "0"}}</span>
					</p>
					<!--<router-link to="/profitCount" tag="p" class="clearfix">
						<span class="fl-l fz12 ico-total">累计收益总额</span>
						<span class="fl-r fc-r fw-6 fz16">￥{{infoList.totalProfitNumber || "0"}}</span>
					</router-link>-->
				</div>
			</div>
		</div>
		<!--实用工具-->
		<div class="mb-5 bg-f">
			<div class="title fz14">实用工具</div>
			<div class="flex-box fz12 fc-c tool-box">
				<!--<router-link to="/buyCard" tag="div"  class="item">
					<img src="@/assets/img/icon1.png" width="40%"/>
					<p>在线购卡</p>
				</router-link>
				<router-link :to="{path:'/information',query:{username:userIfo.username}}" tag="div"  class="item">
					<img src="@/assets/img/icon2.png" width="40%"/>
					<p>新增商家</p>
				</router-link>
				<router-link to="/staff" tag="div"  class="item">
					<img src="@/assets/img/icon3.png" width="40%"/>
					<p>职员管理</p>
				</router-link>-->
				<div  class="item" @click="toBeDevelp">
					<img src="@/assets/img/icon1.png" width="40%"/>
					<p>在线购卡</p>
				</div>
				<div class="item" @click="toBeDevelp">
					<img src="@/assets/img/icon2.png" width="40%"/>
					<p>新增商家</p>
				</div>
				<div class="item" @click="toBeDevelp">
					<img src="@/assets/img/icon3.png" width="40%"/>
					<p>职员管理</p>
				</div>
				<div class="item" @click="toBeDevelp">
					<img src="@/assets/img/icon4.png" width="40%"/>
					<p>更多</p>
				</div>
			</div>
		</div>
		<!--推广专区-->
		<div class="bg-f">
			<div class="title fz14">推广专区</div>
			<div class="flex-box fz12 fc-c tool-box">
				<div class="item" @click="getExtension">
					<img src="@/assets/img/icon5.png" width="50%"/>
					<p>专属推广码</p>
				</div>
				<div  class="item" @click="toBeDevelp">
					<img src="@/assets/img/icon6.png" width="50%"/>
					<p>推荐联盟商家</p>
				</div>
				<div class="item" @click="toBeDevelp">
					<img src="@/assets/img/icon7.png" width="50%"/>
					<p>推荐服务商</p>
				</div>
				<div class="item" @click="toBeDevelp">
					<img src="@/assets/img/icon8.png" width="50%"/>
					<p>更多</p>
				</div>
			</div>
			<div class="border-top total">
				<p class="clearfix ">
					<span class="fl-l fz12 ico-referee">我推荐的服务商(个)</span>
					<span class="fl-r fc-r fz16 fw-6">共{{infoList.nominateAgAgent || "0"}}人</span>
				</p>
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
			headRgba : 0 , //导航栏随滚动条滚动的背景色透明度
			infoList : {} ,
			userIfo : {} ,
			ZFBphone : '' , //用户默认的支付宝提现账号
			time : '' , //当前的时间（月）
			status_bar_height : 0 ,
			frozenMoney : 0 ,
			dayNum : '' , //当前月的第几天
		}
	},
	methods:{
		//获取当前月份
		getTime(){
			let date = new Date();
			let y = date.getFullYear() ;
			let m = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1 ;
			this.time = y + '-' + m ;
			this.dayNum = date.getDate();
		},
		/*获取收益信息*/
		getSumInfo(){
			let _self = this ;
			let _data = {
				token : comm.TOKEN
			};
			getData.getAgZstMenuData(_data).then(res=>{
				let _data = res.data ;
				_self.presenState = false ;
				if(_data.state == 1){
					_self.infoList =  _data.data.accountInfo;
					_self.frozenMoney = _data.data.frozenMoney ;
				}else{
					comm.toast(decodeURIComponent(_data.msg));
				}
			}).catch(function (error) {
			    comm.alertMsg(error);
			});
		},
		/*获取用户信息*/
		getUserInfo(){
			let _self = this ;
			let _data = {
				token : comm.TOKEN
			};
			getData.getUserInfo(_data).then(res=>{
				let _data = res.data ;
				_self.presenState = false ;
				if(_data.state == 1){
					_self.userIfo =  _data.data;
					_self.ZFBphone = comm.isNVL(_data.data.accountNum[0].accountNum,"") ;
					comm.setStore('buyUnitPrice', _data.data.buyUnitPrice || 0);// 购卡单价存入
					comm.setStore('buyNumber', _data.data.buyNumber || 0);// 最少购卡数
				}else{
					comm.toast(decodeURIComponent(_data.msg));
				}
			}).catch(function (error) {
			    comm.alertMsg(error);
			});
		},
		/*待开发功能*/
		toBeDevelp(){
			comm.toast('正在开发中');
		},
		/*关闭webview*/
		closeWeb(){
			comm.closeWebView();
		},
		/*点击推广码*/
		getExtension(){
			comm.getExtension();
		}
	},
	created: function(){
		let _self = this ;
		comm.status_bar_height ? _self.status_bar_height = Number(comm.status_bar_height) :  _self.status_bar_height = Number(comm.getQueryString('status_bar_height')) ;
		_self.getTime();
		if(comm.TOKEN){
			_self.getSumInfo();
			_self.getUserInfo();
		}
	},
	mounted () {  
		window.ZSTObtainParameter = comm.ZSTObtainParameter;
		comm.getToken(); //获取token
		comm.postColor('ff966e'); //传递顶部的手机导航栏的色值给安卓
	    let _self = this ;
	    window.addEventListener('scroll',function(){
	    	let _head_h = document.querySelector('.head-bg').clientHeight ; //渐变背景色的div高度
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop ;
            let header = document.querySelector('#head-bg');
    		_self.headRgba = scrollTop / _head_h ;
    		header.style.opacity = _self.headRgba;
        	document.querySelector('header').setAttribute("class", "fc-black");
        	if(_self.headRgba == 0){
        		document.querySelector('header').setAttribute("class", "fc-f");
        	}
	    });
	    //定时器定时获取TOKEN
		let _setTime = setInterval(function(){
			if(comm.TOKEN){
				_self.getSumInfo();
				_self.getUserInfo();
				clearInterval(_setTime); //清除定时器
			}
		},500);
	}  
}
</script>

<style scoped>
.head-bg{
	background: linear-gradient(#ff966e, #ff1f56);
}
.head{
	padding: 0 30px;
	line-height: 1.5;
}
.head>p{
	padding: 16px 0 21px;
}
.head>div{
}
.head img{
	height: 90px;
	position: absolute;
	right: 0;
	top: 0;
}
.btn-cash{
	padding: 0 15px;
	line-height: 27px;
	border-radius: 4px;
	margin: 7px 0 15px 0;
}
.ico-vip{
	background: linear-gradient(#ffe551, #fda313);
	color: #910021;
	font-size: 8px;
	padding: 0 5px;
	line-height: 15px;
	margin-right: 7px;
	border-radius: 3px;
}

/*收益相关信息列表*/
.profit-title{
	line-height: 37px;
	padding-left: 14px;
}
.profit-box {
	margin-bottom: 3px;
}
.profit-box .item{
	padding: 13px 0;
}
.profit-box .fz12{
	line-height: 15px;
}
.profit-box .fz15{
	line-height: 24px;
	font-weight: 600;
}
.total{
	margin: 0 8px;
	height: 52px;
	line-height: 52px;
}
.ico-total{
	padding-left: 32px;
	background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAqCAMAAAD26OlUAAAAolBMVEUAAAD/wj7/xEX/xEz/wTv/yEj+tSz/0mf/0Fn9piD/xUn/34L/12X/34P/23T+w0n/2G38pCD+yE79uzz8pCD/ujb/2nn/123/123/2HP/0F//3Hr/xkz+wkT/34X9qiP/66H/1WL/vjj9qyT+xk/+vDz/4ID/y1H9riz/7KX/7ar/7q7/x0T/1WX/z1X9rCT/vzX/33X+ti3/6pv/5of/7akoYflGAAAALHRSTlMAShoj8vTwM/Lu5opePbFw9ePWvXhY3dG/n417e2NRNurj2tjArKWfkmjBo/42WCgAAAGsSURBVDjLjdHZdoIwEAbgEKgIirjvW7VuLYNG8P1frTNJoKBC+l/InPFjkjkwY4Kf7YWZc/l+PB6JSfHWNiGXrA0uTdOEkh7roS2ESCmia9pjKigA0GaGuKDSMcE2QEwB23BLZFEY+nHM6+EnxJGPT8swsEMDXWZMC3DgXF61duuFwIFfVE1AzAyuT5UFIKD6XO007FbuoZyGogoGY30/DQGaVceiOzEDDCY0LlqyHOI3fIXuUbKPEauF7oxOjaIBfTM+X+Two8TWHcX8lf7SovMGBq0xKmLLfAchuIKRhnydqWgXFpcFmwpsE2zPp11skXIOFpEC5H+wH9MkyiDEdnHZErQVcgarXK1CDTGFiYfbbXC2CpNOABMJaUABMpuzUujE4Bk67DVNhFYddN3/wSXATEHcIYO3NxAwcqaP/RpoE5TLOxm8YbguHBTqahyXjRXE/hvYBphKGGGqYYP5sRrEqS1h436/S3jHcF0gxEEjgtSugzs9iF8xCurCog7XRUO+PyrB6zMcUcH2+LPJ/rep8HRhU4caG3x6bLP3zoxi9bxhuRh6PSsvfgG6sVcIjrdqGQAAAABJRU5ErkJggg==) no-repeat left 8px center;
	background-size: auto 20px; 
}
/*工具类目*/
.title{
	padding-left:11px ;
	line-height: 32px;
}
.tool-box{
	margin:13px 0 5px 0 ;
	line-height: 26px;
}
.ico-referee{
	padding-left: 33px;
	background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAiCAMAAAD4Z3BAAAAATlBMVEUAAAD/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shrpkF4BAAAAGXRSTlMA7WY+C/fSq6BZEzCLceG3lRuASCXJwHhQnfI6rQAAAbVJREFUOMuNk9mWhCAMRAtERBT3pfP/PzpC0u06PXNfXA5UJRWAoDuPL6wrThiivOvxjAkNUYYjgTYUnlloY8YRRRs5PmSr6wadHdZTdZUnjWrMIsESY13IJkz8fpVXqOiJFV16jnijRb7LlVJ0JYe5GDRSvTcGjm7o9HOPqBTbiKc7SgwkIsPyXkpjiuJkwF/jTR4DK27WlboZ2EP1BgmOYkilWXpTikH2ka/B2ONsit2glw5EnrzMlYsHs4f1QstC0qA7RtWeBi8GExuIZw9Bt0UJQQQkGstD8nUeC9ALnslyijSoonNszLvFbDYdLmg26huJqE6rhSnf/pyxVJiU6xwL2dd+kgna44BxpDLJVdyvnakJR17vudR0by+kKnc/HWufyfa84YUzIx8EA6Gm1vN5ShtpwAmfy2A689mQNMecnDcLZbiWKoQ9+dSlKShPB+CqL9hoUNaHgFpqX7hSLXPNe5QdMZCNUel0L2bCI9V+w6G5z6mhRnExd3pFpN63oWqo6NMYVY1f8Kt2EtOYDn9pHFX4hiOhlJux4Cu9pbYgxk6hDfiLKY06DLY2+CdDofELP9IhOKDi4lc8AAAAAElFTkSuQmCC) no-repeat left 4px center;
	background-size: auto 18px; 
}

</style>