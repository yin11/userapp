<template>
	<div>
		<!--标题栏-->
		<header class="fc-f bg-f">
			<!--<div class="ico-retrun fz14" @click="back"><i class="left-arrow" ></i></div>-->
			<div class="search-box fz15 border-buttom" > 
				<form action="javascript:return true;">
					<input type="search" placeholder="请输入商品名称" v-model="search" />
					<button type="button" class="fc-f fz15" @click="searchList">搜索</button>
				</form>
			</div>
		</header>
		<div  style="height:79px;"></div>
		<!---->
		<div class="bg-f ">
			<!--tab-->
			<div class="flex-box border-buttom fz14 tab" :style="'top: '+(44+navHeight)+'px;'">
				<div class="item" @click="showSelect">
					<span>综合</span>
				</div>
				<div class="item" @click="selectList(5)">
					<span>销量</span>
				</div>
				<div class="item" @click="selectList(1)">
					<span>价格</span>
				</div>
			</div>
			<!--list-->
			<ul>
				<div v-if="list.length == 0" class="nomal"><img src="@/assets/img/no.png" width="50%"/></div>
				<li class="bg-f border-buttom list-con" v-else v-for='item in list' v-if="!(tgjVIPState == 1 && item.isMemberArea == 1)">
					<a :href="'/zst-wap/app-shop/index.html?id='+item.id">
						<img :src="item.cover" v-if="item.cover"/>
						<img src="@/assets/img/loading.png" v-else/>
						<p class="fz14 txt-overflow goodsName"><i class="ico-zst"></i>{{item.goodsName}}</p>
						<p class="fc-c fz12">供应商：</p>
						<p class="fz10 price"><span class="bg-yellow fc-f" v-if="item.isMemberArea == 1">VIP会员特卖</span><span>话呗抵扣{{item.integralRange}}元</span></p>
						<p class=""><span class="fz14 fc-r">￥{{item.price_after.toFixed(2)}}</span><span class="fz10 fc-c">原价{{item.originalPriceRange}}元</span></p>
						<div class="flex-box fz10 fc-c">
							<div class="item" v-if="item.isFreefreight == 1">包邮</div>
							<div class="item">{{item.commentCount}}条评论</div>
							<div class="item" >{{item.goodCommentRate}}%好评</div>
						</div>
					</a>
				</li>
			</ul>
			<!--等待-->
			<div class="loading-box" v-show="showLoad">
				<i class="loading"></i>
			</div>
		</div>
		<!--选择弹出框-->
		<div class="mask" v-show="selectState" @click="hideSelect"></div>
		<div class="popup" v-show="selectState">
			<!--综合-->
			<div class="bg-f fz14">
				<div class="border-buttom popup-item">
					<input type="radio" name="radio1" @change="selectType()"/>
					<span>综合</span>
				</div>
				<div class="border-buttom popup-item">
					<input type="radio" name="radio1" @change="selectType(4,'asc')"/>
					<span>话呗抵扣额度最低</span>
				</div>
				<div class="border-buttom popup-item">
					<input type="radio" name="radio1" @change="selectType(4,'desc')"/>
					<span>话呗抵扣额度最高</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import * as comm from '@/assets/js/comm'	
export default {
	data(){
		return{
			showLoad : false ,
			scrollState : true ,
			selectShow : false , //筛选弹窗
			list : [] ,//职员列表
      		pageNum :1 , //list的页数
	  		pageSize : 20 ,
	  		search : "" ,
	  		selectState : false ,
	  		sort : '' , 
	  		sortby : '' ,
	  		navHeight : 0 ,//不同屏幕设备顶部导航栏的高度
	  		tgjVIPState : 0 , //是否位于糖公鸡app内，若位于糖公鸡内为1，不显示VIP商品
		}
	},
	created: function(){
		if(navigator.userAgent.indexOf("tgj-android-broswer") >= 0 || navigator.userAgent.indexOf("tgj-ios-broswer") >= 0){ //此时页面在糖公鸡app内
			this.tgjVIPState = 1 ;
		}
		this.getList();
		this.navHeight = Number(comm.getQueryString('status_bar_height')) || 0 ;
	},
	methods: { 
		//返回上一页*/
		back(){
	        this.$router.go(-1);//返回上一层
	    },
	    //显示选择弹窗
	    showSelect(){
	    	this.selectState = true ;
	    },
	    //隐藏选择弹窗
	    hideSelect(){
	    	this.selectState = false ;
	    },
	    //选择条件
	    selectType(sort,sortby){
	    	this.sort = sort ;
	    	this.sortby = sortby ;
	    	this.pageNum = 1 ;
	   		this.getList();
	   		this.hideSelect();
	    },
	    //选择销量或者价格
	    selectList(sort){
	    	this.sortby = '' ,
	    	this.sort = sort ;
	    	this.pageNum = 1 ;
	   		this.getList();
	    },
	    //获取列表
	    getList(){
	    	let _self = this ;
	    	let _data = {
	    		searchPlatform : "3",
	    		pageNum : _self.pageNum , //list的页数
	  			pageSize : _self.pageSize ,
	  			keyword : _self.search ,
	  			sort : _self.sort ,// 1  价格  2 优惠券金额  3热度  4  话呗抵扣额度 5销量
	  			sortby : _self.sortby , //asc   升序  ,desc  降序
	    	};
	    	if(_self.pageNum == 1){
	    		_self.list = [] ;
	    	}
	    	comm.getSearchList(_data).then(res=>{
	    		let _data = res.data ;
				if(_data.state == 1){
					_data.data.forEach((i)=>{
						i.originalPriceRange = i.originalPriceRange.split('-')[0] ;
						i.integralRange = i.integralRange.split('-')[0] ;
						i.price_after = Number(i.originalPriceRange) - Number(i.integralRange) ;
					});
					if(_data.data.length < _self.pageSize){
						_self.scrollState = false ;
					}
					_self.list = _self.list.concat(_data.data) ;
				}else{
					comm.toast(decodeURIComponent(_data.msg));
				}
	    	}).catch(function (error) {
			    comm.alertMsg(error);
			});
	    },
	    //搜索内容
	    searchList(){
	   		this.pageNum = 1 ;
	   		this.getList();
	    }
	},
	mounted(){
    	let _self = this ;
	    window.addEventListener('scroll',function(){
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop ;
        	// 判断是否滚动到底部  
            if( (scrollTop +window.screen.availHeight) >= (document.body.offsetHeight-100)) {  
            	if(_self.scrollState == true){ //加下状态
            		_self.scrollState = false ;
            		_self.showLoad = true ;
            		_self.pageNum = _self.pageNum + 1 ;
            		setTimeout(()=>{
            			_self.showLoad = false ;
            			_self.getList();
            		},1500);
            	}
            }
	    });
	},
}
</script>

<style scoped>
/*搜索*/
.search-box{
	padding: 6px 0 6px 42px;
}	
.search-box input{
	background: #f1f1f1 url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAoCAMAAABKKxPSAAAAP1BMVEUAAAANDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8I3WivAAAAFXRSTlMA/Q/db8x/smVWPyzppRuPIrs1Spxgy9eAAAABOUlEQVQ4y82T23KFIAxF2SQhXERF/f9v7ZS26ggefex+0sxyAQmaPTY6lQGDqIvW3CYo4S+k4YZcNgIoO/bscn1cujIB1Mf522LnyApIaDFPIJdOheQI5BsbQdZ2BboYF4FEc00USDoXbK5fNlkJ+bKqM70whnjSKTR1uSRQe9az6ccDh2ECxRtuGXD0RpHHG25UTPvC9RT9WAfdHQCbu3jIfHD+gXvve95f2fdXPpw3Y7NH/+Suf+k8gvBxHvHNfAuKNc9CD4TL/Vs7WCSovRTK0l6CAlma30jj1VaA7dpPHiB+PlVmLwCkmSgTkEOyP5+lkFHTHnBVADJxCIEnAaAbdUHLgiPCo+G+0djVKQGgMq114q6C3rTkOKclzaP9fa3gwOY+/wa0j+BUQWfegTDvQDIvQDcIfwFXcgn8c9H55QAAAABJRU5ErkJggg==) no-repeat left 10px center;
	background-size: auto 15px; 
	width: 280px;
	padding: 7px 10px 7px 39px;
	border-radius: 15px;
}

	
.flex-box{
	display: flex;
}
.flex-box .item{
	flex: 1;
	text-align: center;
}

.tab{
	line-height: 35px;
	position: fixed;
	left: 0;
	top: 44px;
	width: 100%;
	background: #FFFFFF;
	z-index: 3;
}

/*list*/
.nomal{
	padding: 50px 0;
	text-align: center;
}
.list-con{
	padding: 10px 10px 10px 145px;
	position: relative;
}
.goodsName{
	height: 42px;
}
.ico-zst{
	display: inline-block;
	width: 16px;
	height: 16px;
	background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAA6lBMVEUAAADsJFDpB0H/uKftEknuFUv/pKT5bX/4KFn+hoX/va7+g477N2PnB0D/taP6dnr5d3r7Q2rvW2n/saDxYm3/////hYX/kor8J1r6HVb6ElH8NGD+YnP/eX7/npH/b3r9RGfzDEn9TWv/qJn9PWP+Vm7/0tTzGU/sCUT/x9L/v8n9Xnz/9fX/4OH/i6H/r5/9Z4D/7O//m6X/lpL+eYj/4+r/urz/sLn+lKT/2d7yK1b/8vn+gJz+b4L/z8f/pLHxUmb/ssH/taf9eZj1YG70SGTzOFzsPFrqG0v/v7H/i5D/Zm7rMFXsSF/4GkyjAAAAFXRSTlMA/uLljR8e5OLcjIxaU1JMGe7c2YeDlwf7AAACL0lEQVQ4y23R2XaiQBCA4Y5Rs82SWQpRUDqIG5ugkEFFjUuScZy8/+ukqhvkJPjf8p3qapph93c3jem0k9XNG2O/butM9P1GURrYFMthIS+/CWO0FVEjq5O3PRwO3fEW1f2V0W4jK7uVBzBb4aw6+71HdJaF29DzXDzxlv3cG6hKDHP7KxcIXbKnvW5gZ5gHq/EqxFuMCaEqWOG6Xhh6Y4medEyy0rhtpyHQG6HzTESKvT33KGQfbQERvT6bgT2yNyPb8Ef9Tz0qOeI+ACwAkhGUaqCaCtSbrNeTPtjLP1mPsv5iRidOO+z1hVOWD3HP7JlmvuHxeLTBptUQ/X+xODdNHgAsTd1PkmSS58LaaNMoQqjQxeBbayiiNRUDr/mPkGZh3LJhY0WzmZc168cQi7+hTNnFXNOIaT7MaCAlturhSrohRglETMOlAvzsYLruoIphohuoIkKqJlkIcbxwZWFkRgCReIJIYX/nqiqYasMihLyUJxDrlEADlUKES4nDAsrkuJIp1DJC1FRlDiws4hTeNglTXPGEmpJpIYzs0amNw+U9g4gNB62mZE0bPhRwE5PogRCxJk+TXeqLkrW/4zxTS0KtjLV24a4lz96EjmpZkjkCUQKlbioI/g7Xwe0lcwJEqHKm0RzBuEYRM3sBq9ConJHMmYzUFavKUcW0TwzRHatVSBVlrHD8R52xr0NUBSuNs74whgpnFQ1Ozef09tdoqFq1MqQeSvbiulpD8A6NOaROoXzjawAAAABJRU5ErkJggg==) no-repeat center;
	background-size: cover;
    vertical-align: sub;
    margin-right: 5px;
}
.list-con img{
	position: absolute;
	left: 10px;
	top: 10px;
	height: 125px;
	width: 125px;
}
.list-con .flex-box .item{
	text-align: left;
}
.price{
	border: 1px solid #ffa919;
	display: inline-block;
	border-radius: 3px;
	overflow: hidden;
}
.price span{
	display: inline-block;
	padding: 0 4px;
}
.bg-yellow{
	background: #ffa919;
	color: #fff;
}

/*弹出层*/
.popup{
	position: fixed;
	top: 79px;
	width: 100%;
	z-index: 2;
}
.popup-item{
	padding: 0 10px;
	line-height: 32px;
	position: relative;
}
.popup-item input[type='radio']{
	position: absolute;
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;
	opacity: 0;
}
.popup-item input[type='radio']+span:after,.popup-item input[type='radio']:checked+span:after{
	content: '';
	display: block;
	width: 14px;
	height: 14px;
	position: absolute;
	right: 15px;
	top: 9px;
}
.popup-item input[type='radio']+span:after{
	background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAM1BMVEUAAADZ2dnZ2dna2trf39/b29vY2Nja2trZ2dnZ2dnX19fY2NjZ2dnZ2dnZ2dnY2NjZ2dlO6j+4AAAAEHRSTlMA8KBgEEDAMNCAIOCQsFBwqRsPEwAAAWhJREFUWMPtl0lyAyEMRVsMAvXkf//TplKpMrYBIcLWb//Vas1sXxR2f3LGL3zJHSbV6TzwDvsJG/5AC7eb5T0ug4mdoUAy/DxBJ+tOOAyh2JeHCxZ8V5+BJQsOVu6m/oQZSg39jQlyqANAmOFUAmDjM5kRk+QPA4xZbsUBEzwfgSxyovCaymBNXUbBbQVv0n84SlvB0ES0l+/UmSRT8Sa8I2WEmvSBunmIpuapmv14GhAMiO1Mmw34TqJiMwkkQWp9UhuKq3gfH/pAuoFq7IZSs4+tBLBnwDX++aaXgnXQDUgrauF66j0sBuoiexCcWmdKIf0pd1Gn5aGWcmnWjA6sNxOH0ayRwUDKYTAq4mig5KA2Ko23CiVt3TjDUKWMPml1rK8ulri42nh1uabl9V4RJw+MGlk4cWbDELc2vHLm2X0gv3jqprVjm8PquT/mPlD455slm+X2R9flw/SzT5gJQGYncfvS5wcruI+kgteC+AAAAABJRU5ErkJggg==) no-repeat 50%;
	background-size: cover;
}
.popup-item input[type='radio']:checked+span:after{
	background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAANlBMVEUAAAD/phr/phr/pRj/rxD/pxj/phn/pRX/pRr/pRr/pxj/phn/phn/phr/pRn/phn/phn/phq2rJNNAAAAEXRSTlMA8KBgEEDAMNCAIJCwUODfcPZN+asAAAFrSURBVFjD7ZfbksMgCIaDIkoSm/L+L7uzszO1jYq43va7/wnh7PZFYfcHJfmFTs44qY7HJZ+Qn7DhL2nhdrO8x2kwsZMoAA8/D6KTdCecDIHQl+MpFnxXn0SWLDixkpv6Q8xAbOizTJCwDgDIDIcSABv3ZAaZJN0MkMySFQdM0HwEEvMhhfdUojV1SQpuK3iT/uYobAVDE8FevlNnEkzFG+UTLiPUpEfo5iGYmqdq9utlgGVAaGfabMB3EhWaSQBGrvVRbSiq4v246RF0A9XYxVKzz60EsGfANf45w1vBOtENcCtqeL70XiwG6iJ7gji1zpRC+lPurE7Lh1rKpVmTdCC9mQhHs4YHAynhYFSE0UBJqDYqjLcKRG3dOMNQhSR94upYX10sYXG10epyjcvrvSJMHhg1vHDizIYhbG1o5cyz+wB+8dSNa8c24eq5PyaXrfLvN0tS5DbicXfj9Dj97GMiEJFEjsP2pc8PxhSYTgGzXkEAAAAASUVORK5CYII=) no-repeat 50%;
	background-size: cover;
}
.mask{
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,0.3);
	z-index: 1;
}
</style>