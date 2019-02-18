<template>
	<div>
		<!--标题栏-->
		<!--<div class="" ></div>
			<header class="fc-f">
				<h3 class="border-buttom bg-f" :style="'padding-top: '+(navHeight)+'px;'">话呗特惠对话</h3>
				<span class="icon">
					<router-link to="/search" tag="i" class=" ico-search"></router-link>
				</span>
			</header>
		<div :style="'height: '+(44+navHeight)+'px;'"></div>-->
		<!--搜索框-->
		<div class="bg-f search-box border-buttom">
			<div><a href="/zst-wap/app-shopList/index.html#/search">输入搜索内容</a></div>
		</div>
		<div style="height: 44px;"></div>
		<div class="main ">
			<!--左边导航栏-->
			<div class="nav-box bg-f" :style="'padding-top: '+(44)+'px;'">
				<ul class="bg-f nav fz14">
					<li v-for="(item, index) in Category" :class= 'item.idPath == current ? "active" : "" ' @click="selectCategory(index ,item.id , item.idPath)">{{item.typeName}}</li>
				</ul>
			</div>
			<div style="min-height: 100%;" class="bg-f">
				<!--右边顶部横向滚动品牌列表-->
				<div class="brand-box" v-if="classifyList.length != 0">
					<div class="clearfix bg-f brand-head">
						<span class="fl-l fz16">当前品牌<span class="fz7">-{{selectName}}</span></span>
						<!--<span class="fl-r fz12 bt-grey" @click="showAllBrand()" v-if="classifyList.length > 6">更多<i :class="brandLen == 6 ? 'down-arrow' : 'up-arrow'"></i></span>-->
					</div>
					<ul class="clearfix brand bg-f fz14">
						<li class="fl-l border-buttom border-right" 
							:class= 'item.goodsBrandId == classifyOn ? "fc-r" : "" ' 
							v-for="(item, index) in classifyList" 
							@click="selectBrand(item.brandName,item.goodsBrandId,item.goodsTypeId)" 
							>
							<img :src="item.brandLogo " v-if="item.brandLogo"/>
							<span v-else>{{item.brandName}}</span>
						</li>
					</ul>
				</div>
				
				<!--右边商品列表-->
				<div v-if="classifyList.length == 0" >
					<div class="no-supplier">
						<img src="@/assets/img/gys.png" width="50%"/>
						<p class="fz16 tip">当前栏目还没有供应商产品</p>
						<div class="line"></div>
						<ul class="fc-c fz12 require">
							<Li>
								<P class="bold">您可以申请成为我们的供应商</P>
								<P>供应商要求</P>
								<P>品牌一级代理商或工厂</P>
							</Li>
							<Li>
								<P class="bold">助商通的价格体系</P>
								<p>出厂价+话呗=市场价</p>
							</Li>
						</ul>
						<!--<div>
							<input id="mailUrl" type="text" value="huangyq@tenzhao.com"/>
						</div>-->
						<a href="mailto:huangyq@tenzhao.com" class="btn fz12" >邮箱:huangyq@tenzhao.com</a>
						<!--<button type="button" class="btn fz12 btn-f fc-r" @click="copyMail">复制邮箱</button>-->
						<a href="tel:4008090775" class="btn fz12 btn-f fc-r">400-8090775</a>
					</div>
				</div>
				<div v-if="goodsList.length == 0 && classifyList.length != 0" class="no bg-f" style="padding: 20px 0 120px;">
					<img src="@/assets/img/no.png" width="50%" />
				</div>
				<div class="bg-f" v-else >
					<div class="goods-item " v-for="item in goodsList" v-if="!(tgjVIPState == 1 && item.isMemberArea == 1)">
						<a :href='"/zst-wap/app-shop/index.html?id="+item.id'>
							<img src="@/assets/img/VIP.png" class="VIP" v-if="item.isMemberArea == 1"/>
							<div class="item-pic-box">
								<img class="item-pic" v-lazy="item.cover" :key="item.cover"/>
							</div>
							<p class="txt-overflow fz12 name">{{item.goodsName}}</p>
							<!--<p class="fz14">￥{{Number(item.salePriceMin-Number(item.integralRange.split('-')[0])).toFixed(2)}}{{item.salePriceMin}}</p>-->
							<p class="fz14">￥{{item.salePriceMin}}</p>
							<p class="fc-c fz12 through">原价￥{{item.originalPriceRange.split('-')[0]}}</p>
							<!--<p class="fc-c fz7">话呗抵扣{{item.integralRange}}</p>-->
						</a>
					</div>
				</div>
				<!--等待-->
				<div class="loading-box" v-show="showLoad">
					<i class="loading"></i>
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
			Category : [] ,
			current : 0 ,
			goodsList : [] ,
			pageNum : 1 ,
			pageSize : 20,
			scrollState : true ,
			showLoad :false ,
			goodsBrandId :'',
			goodsTypeId : '' ,
			classifyList :[] ,
			selectName :"全部",
			classifyOn : -1 ,
			brandLen : 6 ,
			navHeight : 0 ,//不同屏幕设备顶部导航栏的高度
			tgjVIPState : 0 , //是否位于糖公鸡app内，若位于糖公鸡内为1，不显示VIP商品
		}
	},
	created: function(){
		if(navigator.userAgent.indexOf("tgj-android-broswer") >= 0 || navigator.userAgent.indexOf("tgj-ios-broswer") >= 0){ //此时页面在糖公鸡app内
			this.tgjVIPState = 1 ;
		}
		this.getBrand({typeIdPath : comm.getQueryString('typeIdPath')});
		this.navHeight = Number(comm.getQueryString('status_bar_height')) || 0 ;
	},
	methods: { 
		//点击类目
		selectCategory(i,typeId ,idPath){
			this.current = idPath ;
			this.pageNum = 1;
			this.goodsTypeId = typeId ;
			this.goodsBrandId = "" ;
			this.selectName = '全部' ;
			this.scrollState = true ;
			this.classifyOn = -1 ;
			this.brandLen = 6 ;
			this.idPath = idPath ;
			this.getBrand({typeIdPath   : typeId}); 
		},
		//点击选择品牌
		selectBrand(goodsBrandName,goodsBrandId,goodsTypeId){
			this.scrollState = true ;
			this.selectName = goodsBrandName ;
			this.pageNum = 1;
			this.goodsBrandId = goodsBrandId ;
			this.classifyOn = goodsBrandId ;
			this.getGoods(goodsBrandId , this.idPath);
		},
		//点击复制邮箱
		copyMail(){
			console.log(document.getElementById('mailUrl'))
			document.getElementById('mailUrl').select();
			document.execCommand('Copy');
		},
		//点击更多显示所有品牌
		showAllBrand(){
			if(this.brandLen == 6){
				this.brandLen = this.classifyList.length ;
			}else{
				this.brandLen = 6 ;
			}
		},
		//获取商品的列表
		getGoods(goodsBrandId,typeIdPath){
			let _self = this ;
			let _data ={
				typeIdPath : typeIdPath ,//分类路径
				brandId : goodsBrandId ,//品牌Id
				pageNum  : _self.pageNum  ,
				pageSize : _self.pageSize
			}
			comm.getGoodsList(_data).then(res => {
				let _data = res.data ;
				if(_data.state == 1){
					if(_self.pageNum == 1){
						_self.goodsList = _data.data ;
					}else{
						_self.goodsList = _self.goodsList.concat(_data.data) ;
						if(_data.data.length < _self.pageSize){
							_self.scrollState = false ;
						}
					}
	        	}else{
					comm.toast(decodeURIComponent(_data.msg));
				}
			}).catch(function (error) {
			    comm.alertMsg(error);
			});
		},
		//获取商品分类列表
		getClassify(pId){
			debugger
			let _self = this ;
			let _data ={
				pId:pId
			};
			comm.getClassifyList(_data).then(res => {
				let _data = res.data ;
				if(_data.state == 1){
					_self.Category = _data.data;
					if(comm.getQueryString('typeIdPath')){
						_self.idPath = comm.getQueryString('typeIdPath') ;
						_self.current = comm.getQueryString('typeIdPath') ;
						_self.getBrand({typeIdPath : comm.getQueryString('typeIdPath')});
					}else{
						_self.idPath = _data.data[0].idPath ;
						_self.current = _data.data[0].idPath ;
						_self.getBrand({typeIdPath : _data.data[0].idPath});
					}
	        	}else{
					comm.toast(decodeURIComponent(_data.msg));
				}
			}).catch(function (error) {
			    comm.alertMsg(error);
			});
		},
		//获取商品品牌 的列表
		getBrand(data){
			let _self = this;
			comm.getBrandList(data).then(res => {
				let _data = res.data ;
				if(_data.state == 1){
	        		_self.classifyList = _data.data ;
	        		_data.data.forEach((n)=>{
	        			n.goodsBrandId == _self.goodsBrandId ? _self.selectName = n.brandName : '' ;
	        		});
	        		if(_data.data.length == 0){
	        			_self.goodsList = [];
						_self.scrollState = false ;
	        		}else{
	        			_self.getGoods(_self.goodsBrandId , _self.idPath);
	        		}
	        	}else{
					comm.toast(decodeURIComponent(_data.msg));
				}
			}).catch(function (error) {
			    comm.alertMsg(error);
			});
		}
	},
	mounted () {  
	    let _self = this ;
		_self.getClassify("");
		_self.classifyOn = comm.isNVL(comm.getQueryString('brandId') , '') ;
		_self.goodsBrandId = comm.isNVL(comm.getQueryString('brandId') , '') ;
		_self.idPath = comm.isNVL(comm.getQueryString('typeIdPath') , '') 
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
            			_self.scrollState = true ;
            			_self.getGoods(_self.goodsBrandId ,_self.idPath );
            		},1500);
            	}
            }
	    })
	}  
}


</script>

<style scoped>
	/*搜索*/
	.search-box{
		padding: 6px 0;
		z-index: 3;
		position: fixed;
		width: 100%;
		left: 0;
		top: 0;
		text-align: center;
	}	
	.search-box a{
		display: block;
		background: #f1f1f1 url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAoCAMAAABKKxPSAAAAP1BMVEUAAAANDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8I3WivAAAAFXRSTlMA/Q/db8x/smVWPyzppRuPIrs1Spxgy9eAAAABOUlEQVQ4y82T23KFIAxF2SQhXERF/f9v7ZS26ggefex+0sxyAQmaPTY6lQGDqIvW3CYo4S+k4YZcNgIoO/bscn1cujIB1Mf522LnyApIaDFPIJdOheQI5BsbQdZ2BboYF4FEc00USDoXbK5fNlkJ+bKqM70whnjSKTR1uSRQe9az6ccDh2ECxRtuGXD0RpHHG25UTPvC9RT9WAfdHQCbu3jIfHD+gXvve95f2fdXPpw3Y7NH/+Suf+k8gvBxHvHNfAuKNc9CD4TL/Vs7WCSovRTK0l6CAlma30jj1VaA7dpPHiB+PlVmLwCkmSgTkEOyP5+lkFHTHnBVADJxCIEnAaAbdUHLgiPCo+G+0djVKQGgMq114q6C3rTkOKclzaP9fa3gwOY+/wa0j+BUQWfegTDvQDIvQDcIfwFXcgn8c9H55QAAAABJRU5ErkJggg==) no-repeat left 10px center;
		background-size: auto 15px; 
		width: 280px;
		height: 15px;
		padding: 7px 10px 7px 39px;
		border-radius: 15px;
		margin: 0 auto;
		font-size: 12px;
	    line-height: 15px;
	    text-align: left;
	    color: #808080;
	}
	
	.ico-search{
	    width: 18px;
		height: 100%;
		display: block;
		background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAoCAMAAABKKxPSAAAAP1BMVEUAAAANDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8I3WivAAAAFXRSTlMA/Q/db8x/smVWPyzppRuPIrs1Spxgy9eAAAABOUlEQVQ4y82T23KFIAxF2SQhXERF/f9v7ZS26ggefex+0sxyAQmaPTY6lQGDqIvW3CYo4S+k4YZcNgIoO/bscn1cujIB1Mf522LnyApIaDFPIJdOheQI5BsbQdZ2BboYF4FEc00USDoXbK5fNlkJ+bKqM70whnjSKTR1uSRQe9az6ccDh2ECxRtuGXD0RpHHG25UTPvC9RT9WAfdHQCbu3jIfHD+gXvve95f2fdXPpw3Y7NH/+Suf+k8gvBxHvHNfAuKNc9CD4TL/Vs7WCSovRTK0l6CAlma30jj1VaA7dpPHiB+PlVmLwCkmSgTkEOyP5+lkFHTHnBVADJxCIEnAaAbdUHLgiPCo+G+0djVKQGgMq114q6C3rTkOKclzaP9fa3gwOY+/wa0j+BUQWfegTDvQDIvQDcIfwFXcgn8c9H55QAAAABJRU5ErkJggg==) no-repeat center;
		background-size: 100% auto;
	}
	.main{
		padding-left: 3.75rem;
		height: 100%;
		box-sizing: border-box;
	}
	.nav-box{
		padding-top: 59px;
		height: 100%;
		position: fixed;
		width: 3.5rem;
		left: 0;
		text-align: center;
		line-height: 55px;
		top: 0;
	    overflow-y: auto;
	}
	.no{
		text-align: center;
		height: 100%;
	}
	.no img{
		transform: translateY(50%);
	}
	.name{
		height: 1.8rem;
	}
	.title{
		position: relative;
		vertical-align: middle;
		line-height: 46px;
		height: 46px;
		padding-left: .65rem;
	}
	.title img{
	    vertical-align: middle;
	    width: 1rem;
	}
	.goods-box{
		width: 100%;
		overflow-x: auto;
		height:125px;
		padding-bottom: 10px;
		overflow-x:scroll;
        overflow-y:hidden;
	}
	.goods-wrap{
		width: auto;
    	display: flex;
	    padding: 0 .5rem;
	}
	.goods-item{
		padding: .5rem .3rem;
		text-align: center;
		width: 4.2rem;
		display: inline-block;
		position: relative;
		/*flex:1;*/
	}
	.item-pic-box{
		max-height: 4.2rem;
		overflow-y: hidden;
	}
	.goods-item img{
		width: 4.2rem;
	}
	.goods-item .VIP{
		width: 20%;
		position: absolute;
		left: 10px;
		top: 10px;
	}
	.border-b-15{
		border-bottom: 7px solid #f2f2f2;
	}
	.active{
		background: #f2f2f2;
		color: #f7094d;
		position: relative;
	}
	.active:after{
		content: '';
		display: block;
		width: 80%;
		height: 2px;
		background: #F7094D;
		border-radius: 2px;
		position: absolute;
		bottom: 0;
		left: 10%;
	}
	/*无供应商列表*/
	.no-supplier{
		padding: 63px 27px 65px;
	}
	.no-supplier img{
		display: block;
		margin: 0 auto 18px;
	}
	.line{
		width: 100%;
		height: 1px;
		background: #767676;
	}
	.tip{
		text-align: center;
		line-height: 48px;
	}
	.require{
		line-height: 25px;
		padding: 32px 0 0 25px;
	}
	.require li{
		padding-bottom: 31px;
	}
	.require .bold{
		position: relative;
		font-weight: 500;
	}
	.require .bold:before{
		content: "";
		display: block;
		width: 6px;
		height: 6px;
		background: #e2134b;
		border-radius: 50%;
		position: absolute;
		left: -12px;
		top: 10px;
	}
	.no-supplier .btn{
		line-height: 35px;
		height: 35px;
	}
	.no-supplier .btn-f{
		background: transparent;
		color: #FF4F81;
		border: 1px solid #FF4F81;
	}
	/*复制到剪贴板*/
	#mailUrl{
		opacity: 0;
		position: absolute;
	}
</style>