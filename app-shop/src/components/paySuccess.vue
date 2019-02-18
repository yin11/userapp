<template>
	<div>
		<div class="fc-f head-box">
			<p class="fz20">支付成功</p>
			<p class="fz15">实付￥{{realPay}} 话呗抵扣{{deduct}}</p>
			<button type="button" class="btn-link fc-f fz15" @click="goAPPIndex">返回首页</button>
			<button type="button" class="btn-link fc-f fz15" @click="goOrderList">查看订单列表</button>
		</div>
		<!--list-->
		<ul class="bg-c clearfix list">
			<div  v-if="list.length == 0" class="nomal"><img src="../assets/img/nomal.png"/><p class="fz14 fc-c">没有推荐内容</p></div>
			<li class="list-con fl-l" v-else v-for="item in list">
				<a :href="'/zst-wap/app-shop/index.html?id='+item.id">
					<div class="bg-f">
						<img :src="item.cover" width="100%"/>
						<p class="fz15 txt-overflow"><i class="ico-zst"></i>{{item.goodsName}}</p>
						<p class="fz14 clearfix">
							<span class="fl-l">￥{{item.price_after}}</span>
							<span class="fl-r fc-c">原价￥{{item.originalPriceRange }}</span>
						</p>
					</div>	
				</a>
			</li>
		</ul>
	</div>
</template>

<script>
import * as comm from '@/assets/js/comm'
export default {
	data(){
	  	return{
	  		list : [] ,
	  		realPay : this.$route.query.realPay , //实付金额
	  		deduct : this.$route.query.deduct , //抵扣金额
  		}
	},
	mounted(){
		comm.removeStore('PAYSTATE');
		comm.PAYSTATE = 0 ;
		comm.toast('成功啦333'+comm.PAYSTATE)
	},
	created: function(){
		comm.removeStore('PAYSTATE');
		comm.PAYSTATE = 0 ;
		comm.toast('成功啦'+comm.PAYSTATE)
		//this.realPay = comm.getQueryString('realPay') ;
		//this.deduct = comm.getQueryString('deduct') ;
		this.getList();
	},
	methods: { 
	    //获取推荐商品列表
	    getList(){
	    	let _self = this ;
	    	let _data = {
	    		searchPlatform : "3",
	    		pageNum : 1 , //list的页数
	  			pageSize : 6 ,
	    	};
	    	comm.getSearchList(_data).then(res=>{
	    		let _data = res.data ;
				if(_data.state == 1){
					_self.list = _data.data ;
					_self.list.forEach((i)=>{
						i.originalPriceRange = i.originalPriceRange.split('-')[0] ;
						i.integralRange = i.integralRange.split('-')[0] ;
						i.price_after = Number(i.originalPriceRange) - Number(i.integralRange) ;
					})
				}else{
					comm.toast(decodeURIComponent(_data.msg));
				}
	    	}).catch(function (error) {
			    comm.alertMsg(error);
			});
	   	},
	   	//跳转app订单列表页面
	   	goOrderList(){
	    	comm.GoOrderList();
	    },
	    //放回首页
	    goAPPIndex(){
	    	comm.GoAPPIndex();
	    }
	},
}
</script>

<style scoped>
.head-box{
	text-align: center;
	padding: 30px 0 22px 0;
	background: #F7094D;
}
.btn-link{
	border: 1px solid #fff;
	height: 23px;
	line-height: 23px;
	padding: 0 15px;
	border-radius: 23px;
	margin-top: 10px;
}
.list{
	padding: 5px;
}
.list-con{
	width: 50%;
	padding: 5px;
	box-sizing: border-box;
}
.list-con>div{
	border-radius: 5px;
	padding-bottom: 4px;
}
.list-con p{
	padding: 0 5px;
}
.txt-overflow{
	height: 43px;
	margin-bottom: 10px;
}
.ico-zst{
	display: inline-block;
	width: 15px;
	height: 15px;
	background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAA6lBMVEUAAADsJFDpB0H/uKftEknuFUv/pKT5bX/4KFn+hoX/va7+g477N2PnB0D/taP6dnr5d3r7Q2rvW2n/saDxYm3/////hYX/kor8J1r6HVb6ElH8NGD+YnP/eX7/npH/b3r9RGfzDEn9TWv/qJn9PWP+Vm7/0tTzGU/sCUT/x9L/v8n9Xnz/9fX/4OH/i6H/r5/9Z4D/7O//m6X/lpL+eYj/4+r/urz/sLn+lKT/2d7yK1b/8vn+gJz+b4L/z8f/pLHxUmb/ssH/taf9eZj1YG70SGTzOFzsPFrqG0v/v7H/i5D/Zm7rMFXsSF/4GkyjAAAAFXRSTlMA/uLljR8e5OLcjIxaU1JMGe7c2YeDlwf7AAACL0lEQVQ4y23R2XaiQBCA4Y5Rs82SWQpRUDqIG5ugkEFFjUuScZy8/+ukqhvkJPjf8p3qapph93c3jem0k9XNG2O/butM9P1GURrYFMthIS+/CWO0FVEjq5O3PRwO3fEW1f2V0W4jK7uVBzBb4aw6+71HdJaF29DzXDzxlv3cG6hKDHP7KxcIXbKnvW5gZ5gHq/EqxFuMCaEqWOG6Xhh6Y4medEyy0rhtpyHQG6HzTESKvT33KGQfbQERvT6bgT2yNyPb8Ef9Tz0qOeI+ACwAkhGUaqCaCtSbrNeTPtjLP1mPsv5iRidOO+z1hVOWD3HP7JlmvuHxeLTBptUQ/X+xODdNHgAsTd1PkmSS58LaaNMoQqjQxeBbayiiNRUDr/mPkGZh3LJhY0WzmZc168cQi7+hTNnFXNOIaT7MaCAlturhSrohRglETMOlAvzsYLruoIphohuoIkKqJlkIcbxwZWFkRgCReIJIYX/nqiqYasMihLyUJxDrlEADlUKES4nDAsrkuJIp1DJC1FRlDiws4hTeNglTXPGEmpJpIYzs0amNw+U9g4gNB62mZE0bPhRwE5PogRCxJk+TXeqLkrW/4zxTS0KtjLV24a4lz96EjmpZkjkCUQKlbioI/g7Xwe0lcwJEqHKm0RzBuEYRM3sBq9ConJHMmYzUFavKUcW0TwzRHatVSBVlrHD8R52xr0NUBSuNs74whgpnFQ1Ozef09tdoqFq1MqQeSvbiulpD8A6NOaROoXzjawAAAABJRU5ErkJggg==) no-repeat center;
	background-size: cover;
}
.nomal{
	padding: 50px;
    text-align: center;
}
</style>