<template>
	<div>
		<!--APP站外打开时显示-->
		<div v-if="ZSTState">
			<!--助商通-->
			<div class="download-prompt fz14 fc-f" v-if="!tgj"> 
				<img src="../assets/img/logo.png" style="height:23px;margin-top: 8px;margin-left: 20px;"/>
				<a class="download-prompt-link fc-f fz12" :href="url">立即打开</a>
			</div>
			<!--糖公鸡-->
			<div class="download-prompt fz14 fc-f" v-else> 
				<img src="../assets/img/tgj.png" style="height:23px;margin-top: 8px;margin-left: 20px;"/>
				<a class="download-prompt-link fc-f fz12" href="http://www.tenzhao.com/tgj/index.html?from=singlemessage">立即打开</a>
			</div>
		</div>
		<!--swiper-->
		<div style="position: relative;">
			<div v-show="pulledState" class="pulledState" ><img src="@/assets/img/pulled.png" width="100%"/></div>
			<mt-swipe :auto="4000" @change="handleChange" :show-indicators="false" class="swiper-box clearfix" >
			  <mt-swipe-item v-for='item in goodsDetail.lstBiGoodsimgs' ><img :src="item.imgUrl" width="100%"/></mt-swipe-item>
			</mt-swipe>
			<img src="../assets/img/VIP.png" class="VIP" v-if="MENBERGOODS == 1"/>
			<div>
				<div class="swipe-indicator fz14">{{swiperIndex}}/{{goodsDetail.lstBiGoodsimgs.length}}</div>
			</div>
		</div>
		<!--商品信息-->
		<div class="border-buttom commodity-box bg-f">
			<p class="fz16 commodity-title txt-overflow">{{goodsDetail.data.goodsName+goodsDetail.data.inventoryName}}</p>
			<div>
				<p class="fc-r fz14 commodity-detail">{{goodsDetail.data.goodsRemark}}</p>
			</div>
			<div>
				<span class="fc-r fz20 ">
					￥<span class="fz36">{{goodsDetail.data.presentPrice}}</span>
					<span class="fz12 bt-grey"><span class="VIP-txt" v-if="MENBERGOODS == 1">VIP会员</span>({{goodsDetail.data.originalPrice}}减{{goodsDetail.data.integralNum}}话呗)</span>
				</span>   
				<span class="fz10 _money bt-grey" v-if="linkArr.length > 0">
					<span @click="linkAlert" >点击参考第三方价格</span>
					<div class="mask" v-show="linkAlertState"></div>
					<div class="link-alert bg-f fz12" v-show="linkAlertState">
						<div class="link-head">第三方链接</div>
						<div class="border-buttom link-con">
							<p v-for="item in linkArr" >
								<a  @click='toLink(item.platform,item.link,item.desc)'>
									<img src="../assets/img/tb.png" v-if="item.platform == 1"/>
									<img src="../assets/img/jd.png" v-else-if="item.platform == 2"/>
									<img src="../assets/img/tm.png" v-else-if="item.platform == 3"/>
									<span class="_money">{{item.desc}}</span>
								</a>
							</p>
						</div>
						<button class=" close-alert fz16" @click="linkAlert">取消</button>
					</div>
				</span>
			</div>
			<p class="fz10">原价：{{goodsDetail.data.originalPrice}}</p>
			
			<div class="clearfix fz10 fc-c">
				<span class="fl-l" v-if="goodsDetail.data.freightPrice == 0">包邮</span>
				<span class="fl-l" v-else>运费：￥{{goodsDetail.data.freightPrice}}元</span>
			</div>
		</div>
		<!--服务-->
		<div class="border-b-20 fz10  service bg-f" @click="ServiceClick">
			<div class="bt-grey top" style="overflow: hidden;">
				<img :src="goodsDetail.shopinfo.supplierLogo" />
				<div class="border-left">
					<div class="bt-grey">
						<a :href="goodsDetail.shopinfo.shopUrl">
							<p class="txt-ellipsis fz14">供应商：{{goodsDetail.shopinfo.shopName}}</p>
							<p class="fz14"><a :href="'tel:' + goodsDetail.shopinfo.legalPersonPhone">{{goodsDetail.shopinfo.legalPersonPhone}}</a><i class="ico-phone"></i></p>
							<i class="right-arrow"></i>
						</a>
					</div>
					<div class="fc-c fz14">
						<div v-if="goodsDetail.data.goodsServices != null" class="item" v-for="item in goodsDetail.data.goodsServices.split('-')">{{item}}</div>
					</div>
				</div>
			</div>
		</div>
	    <!--购物流程-->
	    <div class="border-b-20 flow-box bg-f">
	    	<img src="../assets/img/liucheng.png" width="100%"/>
	    	<p class="fc-r fz12">支付金额  = 商品价格 - 话呗抵扣价格</p>
	    	<p class="fz10">如话呗不够，需原价购买，如何得话呗<a class="_money" href="http://m.tenzhao.com/?s=portal/question/index">请点击</a></p>
	    	<p class="fz10">如需退货，请拨打客服电话联系客服</p>
	    </div>
		<!--商品参数-->
		<button class="border-b-20 parameter fz16 bt-grey bg-f" @click="ParameterClick">
			<p>商品参数</p>
			<i class="right-arrow"></i>
		</button>
	    <mt-popup v-model="popupParameter" position="bottom"  >
			<div class="service-popup">
				<div class="popup-title">商品参数</div>
				<div class="popup-con popup-con-parameter">
					<div class="fz14 ">
				      	<div class="border-buttom" v-for=" item in goodsDetail.lstBiGoodsAttr">
				      		<span>{{item.attrName}}</span>
				      		<span>{{item.attrValue}}</span>
				      	</div>
			      	</div>
				</div>
		      	<button class="popup-btn fc-f fz16" @click="hideParameterClick">完成</button>
			</div>
	    </mt-popup>
		<!--商品评价-->
		<div v-if="goodsDetail.commentCount == 0" class="border-b-20 bg-f fz16 evaluate-box">
			<p style="text-align: center;">暂无评价</p>
		</div>
		<div class="fz14 bg-f evaluate-box" v-else>
			<div class="clearfix">
				<span class="fl-l">商品评价（{{goodsDetail.commentCount}}）</span>
			</div>
			<div class="border-buttom evaluate-list">
				<div class="item">
					<div class="evaluate-head">
						<img :src="goodsDetail.imgDomain+goodsDetail.comment.ico" v-if="goodsDetail.comment.ico"/>
						<img src="../assets/img/head.png" v-else/>
						<p class="fz12">{{goodsDetail.comment.nick}} &nbsp;</p>
						<p class="fz12 fc-c">{{goodsDetail.comment.createTimeStr}} &nbsp;</p>
					</div>
					<div>
						<p>{{goodsDetail.comment.content}} &nbsp;</p>
						<p class="fc-c fz10">{{goodsDetail.comment.inventoryName}} &nbsp;</p>
					</div>
				</div>
			</div>
			<router-link :to="{path:'/evaluate'}" tag='div' class='to-all bt-grey'>
				查看全部评价<i class="right-arrow"></i>
			</router-link>
		</div>
		<!--店铺信息-->
		<!--<div class="border-b-20">
			<div class="shop-info">
				<img src="https://sf1-ttcdn-tos.pstatp.com/obj/temai/FqVEiObIpQ8QqwHnfVzjkigLhQh7.jpg" width="40"/>
				<span class="fz14">店铺名称</span>
			</div>
			<div class="flex-box fz12 shop-info-box">
				<div class="item border-right">
					<p>2</p>
					<p>全部商品</p>
				</div>
				<div class="item">
					<p>2</p>
					<p>全部商品</p>
				</div>
			</div>
		</div>-->
		<!--商品参数-->
		<div>
			<div class="desc-tit bg-c fz16">商品参数</div>
			<div class="parameters-box bg-f">
				<div class="fz12 border-right border-left">
					<div class="parameters-item border-buttom border-top" v-for="item in goodsDetail.lstBiGoodsAttr">
						<span class="border-right">{{item.attrName}}</span>
						<span>{{item.attrValue}}</span>
					</div>
				</div>
			</div>
		</div>
		<!--图文详情-->
		<div>
			<div class="desc-tit bg-c fz16">图文详情</div>
			<div class="tuwen-box" v-html="goodsDetail.data.detailMobile" style="width: 100%;"></div>
		</div>
		<div></div>
		<!--选择规格的弹窗-->
		<mt-popup v-model="popupFormat" position="bottom"  >
			<div>
				<div class="bg-f ">
					<div class=" order-info">
						<img :src="orderGoods.imgUrl " />
						<div class="detail">
							<button class="close-prompt" @click="hideFormatClick"></button>
							<p class="fc-r">￥<span class="fz20">{{orderGoods.presentPrice}}<span class="fz12">({{orderGoods.originalPrice}}减{{orderGoods.integralNum}}话呗)</span></span></p>
							<p class="fz12 fc-c clearfix"><span>原价：{{orderGoods.originalPrice}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span v-if="goodsDetail.data.isShowInventory == 1">库存：{{orderGoods.inventoryNum}}件</span></p>
							<p class="fz12">已选  <span v-for="item in specParamNameSelect">{{item}}</span></p>
						</div>
					</div>
				</div>
				<div class=" format-box fz14 ">
					<div  class="border-buttom" v-for="(item,index) in goodsDetail.goodsSpecsParams" >
						<p class="spec-title">{{item.specName}}</p>
						<div class="clearfix">
							<div class="fl-l item" v-for="val in item.lstGoodsspecparams" @click="selectSort(val.specParamName , val.id , index)" >
								<input type="radio" :name="item.id" :id="val.id" :checked="specParamIdSelect[index] == val.id ? 'true' : ''">
								<label for="val.id">{{val.specParamName}}</label>
							</div>
							
							<!--<button class="item" :class="activeType == index ? 'active' : '' " @click="selectSort(val.specParamName)" v-for="(val,index) in item.lstGoodsspecparams">{{val.specParamName}}</button>-->
						</div>
					</div>
					<!--<div class="border-buttom">
						<p class="spec-title">型号</p>
						<div class="">
							<button class="item " :class="activeType == index ? 'active' : '' " @click="selectType(item.id,index)" v-for="(item,index) in goodsDetail.lstBiGoodsInventory" :data-id='item.id' v-if="item.inventoryNum > 0">{{item.inventoryName}}</button>
						</div>
					</div>-->
				</div>
				<div class="clearfix buy-box border-buttom">
					<span class="fl-l fz14" style="line-height: 44px;">购买数量</span>
					<div class="fl-r fz16">
						<span class="item" :class="devideDisable? 'disabled' : ''" @click="devideGoods">-</span>
						<span class="item">{{number}}</span>
						<span class="item disabled" v-if="addDisable">+</span>
						<span class="item" @click="addGoods" v-else>+</span>
					</div>
				</div>
				<!--超出购买上限-->
				<div class="btn bg-c fz16" v-if="addLimited">{{addLimitedTxt}}</div>
				<!--没有库存-->
				<!--<button type="button" class="btn fz16" disabled="disabled" v-else-if="noStock">确定</button>-->
				<router-link :to="{path:'/order',query: {number: number}}" tag='button' class='btn fz16' v-else>确定</router-link>
			</div>
	    </mt-popup>
		
		<!--底部按钮-->
		<div >
			<div style="height: 60px;"></div>
			<div>
				<div  class="btn-box bg-f flex-box ">
					<div class="fz12 collect-box border-right" @click="clickCollection" v-show="!hideCollection"><i :class="CollectionState == 0 ? 'ico-collect' : 'ico-collect-on'"></i><span v-if="CollectionState == 1">取消收藏</span><span v-else>收藏</span></div>
					<div class="btn-consult fz16" ><a :href="'tel:' + goodsDetail.shopinfo.legalPersonPhone" style="display: block;">在线咨询</a></div>
					<!--判断商品是否已经下架-->
					<button class="bg-c btn-buy fz16" type="button" v-show="pulledState">已下架</button>
					<!--商品未下架-->
					<div class="bg-c  fz16" @click="showLootAll" v-if="lootAll" v-show="!pulledState">已抢光</div>
					<div class="btn-buy bg-r fc-f fz16" @click="rollOrder" v-show="!pulledState" v-else>立即购买</div>
				</div>
			</div>
		</div>
		<!--站外下载蒙层-->
		<div class="mask" style="text-align: right;" v-if="showMask" @click="hideShowMask">
			<img src="../assets/img/now.png" width="73.33333%" style="margin-top: 40px;padding-right: .5rem;"/>
		</div>
		<!--本活动只支持VIP会员-->
		<div v-if="showAlert">
			<div class="mask" style="z-index: 6;"></div>
			<div class="alert-box bg-f">
				<button class="close-btn" @click="closeAlert"></button>
				<div v-if="MEMBER == 0">
					<div class="alert-con">
						<img src="../assets/img/suo.png" width="50%" style="margin-bottom: 15px;"/>
						<p class="fz16">本活动只支持VIP会员</p>
					</div>
					<a class="fz16 rechange-link fc-f btn-r" href="/zst-wap/memberPage/showPage.html" >升级为VIP会员</a>
				</div>
				<div v-if="LIMITED">
					<div  class="alert-con">
						<img src="../assets/img/enjoy.png" width="50%" style="margin-bottom: 15px;"/>
						<p v-if="lootAll">该商品已被抢光</p>
						<p class="fz16" v-else>您已参加过本次活动<br />不能重复参加</p>
					</div>
					<a class="fz16 rechange-link fc-f btn-r" :href="recommendGoodsUrl" >查看非限购商品</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import * as comm from '../assets/js/comm'
import fetch from '../assets/js/fetch'
import picker from './picker'
import popup from './popup'
export default {
	data(){
	  	return{
	  		url : '' ,
	  		recommendGoodsUrl:"",
	  		isReadOnly : 'readonly',
	  		linkAlertState : false ,
	  		ZSTState : true ,
	  		readyState :true ,
		  	swiperIndex : 1 ,
		  	popupParameter:false ,
		  	popupService : false ,
		  	popupFormat : false , //选择商品规格弹窗
		  	number : 1 ,
		  	goodsFixed : false ,
		  	goodsOffsetTop : 0 ,
		  	showBottonBtn : true ,
		  	goodsDetail : {} ,
		  	defaultAddress : {} ,
		  	activeType : 0 ,
		  	showPickerState : false ,
		  	areaName :"请选择地址" ,
		  	areaCode : '' ,
		  	orderGoods : {} ,
		  	addDisable : false ,
		  	devideDisable : true ,
		  	orderRemark : '' ,
		  	payWay : 1 ,
		  	totaIntegral : 0 ,//用户所有积分
		  	useIntegralNum : '' ,//兑换商品需要的积分
		  	BALANCE : 0 , //用积分可兑换的商品个数
		  	linkArr :[] ,
		  	showMask :false , // 站外下载蒙层
		  	tgj:false , //糖公鸡站外分享状态
		  	showAlert :false , // VIP弹窗显示
		  	MENBERGOODS : 0 , //会员商品1  ，非会员商品0
		  	ISBUYLIMITED: 0 ,//限购
		  	LIMITED : false ,// 会员用户已经达到购买上限
		  	goodinventoryId : '' , // 选中的商品规格的id ，即specParamsIds 参数
		  	addLimited :false ,//是否超出购买上限
		  	addLimitedTxt : '超出购买上限', // 禁止购买的按钮的提示文字
		  	lootAll :false ,//商品已被抢光
		  	specParamIdSelect:[],//查询库存所用的选中的所有的商品规格id
		  	specParamNameSelect:[] ,//查询库存所用的选中的所有的商品规格名称
		  	//noStock : false , //没有库存状态
		  	pulledState : false , //该商品是否已经下架
		  	CollectionState : 0 , // 收藏状态   0未收藏  1收藏
		  	hideCollection : false , //是否隐藏收藏
	  	}
	},
	components : {
		'v-popup':popup ,
		'v-picker':picker ,
	},
	created: function(){
		let _self = this ;
		comm.getMember();
		if(comm.getQueryString('apptype') == 2){
			_self.tgj = true ;
		}
		if(navigator.userAgent.indexOf('ios-broswer') >= 0 || navigator.userAgent.indexOf('android-broswer') >= 0){
			comm.getUserId();
			_self.ZSTState = false ;
		}
		comm.getToken();
		let _data = {
			'id' : comm.getQueryString('id').replace('#/','')
		};
		comm.getStoreDetail(_data).then(res => {
			let _data = res.data ;
			if(_data.state == 1){
				try{
					_self.goodsDetail = _data ;
					_self.orderGoods = _data.lstBiGoodsInventory[0] ;
					_self.goodinventoryId = _data.lstBiGoodsInventory[0].specParamsIds ;
					_self.readyState = false ;
					if( _data.lstBiGoodsInventory[0].inventoryNum == 0 ){
						_self.addLimited = true ;
       					_self.addLimitedTxt = '确定';
					}
					//pulledState(商品是否下架)   data中的state  商品状态（0/下架 1/上架 2/回收站 3/软删除）
					_data.data.state == 1 ? _self.pulledState = false : _self.pulledState = true ;
					_self.useIntegralNum = _data.data.integralNum ; // 将商品需要的积分存入
					_self.recommendGoodsUrl = '/zst-wap/app-shop/index.html?id='+_data.data.recommendGoodsId ; // 推荐商品id链接
					_data.data.totalInventory == 0 ? _self.lootAll = true : _self.lootAll = false ;//是否已被抢光
					_self.MENBERGOODS = _data.data.isMemberArea ;
					_self.ISBUYLIMITED = _data.data.isBuyLimited ;
					_self.specParamNameSelect = _data.data.inventoryName.split("|");//默认选中的商品规格名称
					_self.specParamIdSelect = _data.data.specParamsIds.split("|");//默认选中的商品规格id
					let _linkStr = _data.data.compareLink , _linkArr = [];
					_linkStr = eval(_linkStr);
					_linkStr.forEach(function(i,n){
						_linkArr.push(i);
					});
					_self.linkArr = _linkArr ;
					comm.postImgAndroid(_data.data.imgUrl);
					if(_data.data.goodsRemark){
						comm.postStrAndroid(comm.isNVL(_data.data.goodsRemark,' '));
					}
				    comm.setStore('goodsDetail' , _data);
				    comm.setStore('orderGoods' , _data.lstBiGoodsInventory[0]);
					document.title = _data.data.goodsName + '原价'+_data.data.originalPrice +'元可抵扣'+ _data.data.integralNum+'话呗 ';
					let oMeta = document.createElement('meta');
					oMeta.charset = 'description';
					oMeta.name = 'description';
					oMeta.content = comm.isNVL(_data.data.goodsRemark,'');
					let first = document.getElementsByTagName('head')[0].firstChild;//得到页面的第一个元素。  
					document.getElementsByTagName('head')[0].insertBefore(oMeta , first);
					comm.postTitleIOS(_data.data.goodsName + '原价'+_data.data.originalPrice +'元可抵扣'+ _data.data.integralNum+'话呗 ');
				}catch(e){
					comm.alertMsg(e);
				}
			}else{
				comm.toast(decodeURIComponent(_data.msg));
			}
        }).catch(function (error) {
		    comm.alertMsg(error);
		});
	},
	mounted() {
		let _self = this ;
		let _type = comm.getUserAgentType();
		if(_type == 3){//站外
			_self.hideCollection = true ;
		}
		window.ZSTObtainParameter = comm.ZSTObtainParameter;
		window.ZSTObtainUserId = comm.ZSTObtainUserId;
		window.ZSTObtainMember = comm.ZSTObtainMember;
		_self.url = 'https://ax4eod.mlinks.cc/AekI?userId='+comm.getQueryString('userId') + '&id='+comm.getQueryString('id').replace('#/','');
		/*滚动监听*/
		//window.addEventListener('scroll', this.menu) ;
		if(comm.TOKEN){
            _self.stateCollection();//查询商品是否收藏
        }else{
        	let _settime = setInterval(function(){
        		if(comm.TOKEN){
		            _self.stateCollection();//查询商品是否收藏
		            clearInterval(_settime);
	            }
        	},1000);
        }
        
		
  	},
	methods: {
		handleChange(index){
			let _self  = this ;
			_self.swiperIndex = index + 1 ;
		},
		ParameterClick() {
        	this.popupParameter = true ;
       	},
       	hideParameterClick(){
       		this.popupParameter = false ;
       	},
       	hideFormatClick(){
       		this.popupFormat = false ;
       	},
       	ServiceClick(){
       		this.popupService = true ;
       	},
       	hideServiceClick(){
       		this.popupService = false ;
       	},
       	//点击显示隐藏link弹窗
       	linkAlert(){
       		this.linkAlertState = !this.linkAlertState ;
       	},
       	closeAlert(){
       		this.showAlert = false ;
       	},
       	hideShowMask(){
       		this.showMask = false ;
       	},
       	//点击已抢光
       	showLootAll(){
       		this.showAlert = true ;
       		this.LIMITED = true;
       	},
       	//点击告诉app链接
       	toLink(key,link,desc){
       		let _data = {
       			link: link,
       			platform : key ,
       			desc : desc
       		};
       		if(navigator.userAgent.indexOf('ios-broswer') >= 0 || navigator.userAgent.indexOf('android-broswer') >= 0){
       			comm.postLink(_data);
       		}else{
       			window.location.href = link ;
       		}
       	},
       	//获取该会员用户今日是否已经购买过该商品
       	getMemberLimited(){
       		let _self = this ;
       		let _data = {
       			maxBuyNum : _self.goodsDetail.data.maxBuyNum ,
       			token : comm.TOKEN ,
       			goodsId : comm.getQueryString('id').replace('#/','') ,
       			isBuyLimited : _self.ISBUYLIMITED ,
       			goodsId : comm.getQueryString('id').replace('#/','')
       		};
       		comm.getLimited(_data).then((res) => {
       			if(res.data.state == 1){//可以购买
       				_self.popupFormat = true ;
       			}else if(res.data.state == 914024 ){//已经达到上限
					_self.showAlert = true ;
					_self.LIMITED = true ;
				}else{
					comm.toast(decodeURIComponent(res.data.msg));
				}
       		}).catch(function (error) {
			    comm.alertMsg(error);
			});
       	},
       	//点击购买，滚到订单部分
       	rollOrder(){
	       	let _self = this ;
	       	if(!comm.TOKEN || comm.TOKEN == '(null)'){
	       		if(navigator.userAgent.indexOf('ios-broswer') >= 0 || navigator.userAgent.indexOf('android-broswer') >= 0){
   					comm.GoLogin();
   				}else{
   					_self.showMask = true ;
   				}
   			}else{
				_self.MEMBER = comm.MEMBER ;
       			if(comm.MEMBER == 0 && _self.MENBERGOODS == 1){//是会员商品且用户非会员
       				_self.showAlert = true ;
       			}else if(comm.MEMBER == 1 && _self.MENBERGOODS == 1  ){//是会员商品,用户是会员
       				//_self.getMemberLimited();
       				let _data={
       					//id : comm.getQueryString('id').replace('#/',''), //验证商品总库存时，才需要提交商品id
       					maxBuyNum : _self.goodsDetail.data.maxBuyNum ,
		       			token : comm.TOKEN ,
		       			specParamsIds : _self.goodinventoryId  ,
		       			isBuyLimited : 1 , //_self.ISBUYLIMITED
		       			goodsId : comm.getQueryString('id').replace('#/','') ,
		       			isMemberArea : _self.MENBERGOODS
       				};
       				comm.getGoodInventory(_data).then((res)=>{
		       			if(res.data.state == 1 ){ 
		       				_self.popupFormat = true ;
		       				_self.orderGoods = res.data.data ;
		       				comm.setStore('orderGoods' , res.data.data);
		       			}else if(res.data.state == 914024 ){//已经达到上限
							_self.showAlert = true ;
							_self.LIMITED = true ;
						}else if(res.data.state == 914015 && res.data.totalInventory != 0 && res.data.totalInventory != null){
							//默认规格商品已经没有库存，但是商品总库存totalInventory不为0
							_self.popupFormat = true ;
		       				//_self.orderGoods = res.data.data ;
		       				//comm.setStore('orderGoods' , res.data.data);
						}else{
							comm.toast(decodeURIComponent(res.data.msg));
						}
		       		});
       			}else if(_self.MENBERGOODS == 0){// 非会员商品
       				_self.popupFormat = true ;
       			}
   			}
       	},
       	//点击选择各个产品分类
       	selectSort(name,id,index){
       		let _self = this ;
       		_self.specParamIdSelect[index] = id ;
       		_self.specParamNameSelect[index] = name ;
       		if(_self.specParamIdSelect.length == _self.goodsDetail.goodsSpecsParams.length){
       			let _id = _self.specParamIdSelect.join("|");
       			_self.selectType(_id);
       		}
       	},
       	//选择商品类型得到商品库存
       	selectType(id){
       		let _self = this ;
       		_self.number = 1 ;
       		_self.goodinventoryId = id ;
       		let _data ={
       			token : comm.TOKEN ,
       			specParamsIds:id
       		};
       		if(_self.ISBUYLIMITED){
       			_data.isBuyLimited = _self.ISBUYLIMITED ;
       		}
       		if(_self.MENBERGOODS){
       			_data.isMemberArea = _self.MENBERGOODS ;
       		}
       		if(_self.goodsDetail.data.maxBuyNum){
       			_data.maxBuyNum = _self.goodsDetail.data.maxBuyNum ;
       		}
       		comm.getGoodInventory(_data).then((res)=>{
       			if(res.data.state == 1){
       				_self.orderGoods = res.data.data ;
       				_self.addDisable = false ;
       				_self.addLimited = false ;
       				_self.addLimitedTxt = '超出购买上限';
       				comm.setStore('orderGoods' , res.data.data);
       			}else{//没货的状态
       				//_self.orderGoods = {};
       				//_self.orderGoods = res.data.data ;
       				_self.addDisable = true ;
       				_self.addLimited = true ;
       				_self.addLimitedTxt = '确定';
					comm.toast(decodeURIComponent(res.data.msg));
				}
       		});
       	},
       	addGoods(){
       		let _self = this ;
       		if(_self.MENBERGOODS == 1){
       			let _data = {
	       			specParamsIds: _self.goodinventoryId ,
	       			isBuyLimited :  _self.ISBUYLIMITED,
	       			maxBuyNum :  _self.goodsDetail.data.maxBuyNum,
	       			token : comm.TOKEN ,
	       			isMemberArea : _self.MENBERGOODS
	       		};
	       		comm.getGoodInventory(_data).then((res)=>{
	       			if(res.data.state == 1){
	       				_self.orderGoods = res.data.data ;
	       				comm.setStore('orderGoods' , res.data.data);
	       			}else{
						comm.toast(decodeURIComponent(res.data.msg));
					}
	       		});
       		}
       		if(_self.goodsDetail.data.maxBuyNum && _self.goodsDetail.data.maxBuyNum > 0){//有购买上限时
       			if(_self.orderGoods.inventoryNum > _self.number && _self.goodsDetail.data.maxBuyNum > _self.number ){
       				++_self.number ;
	       			_self.devideDisable = false ;
       			}else{
		       		_self.addDisable = true ;
		       		if(_self.goodsDetail.data.maxBuyNum < _self.number || _self.orderGoods.inventoryNum < _self.number){
		       			comm.toast('超出购买上限');
		       			_self.addLimited = true ;
		       		}
		       	}
       		}else{
       			if(_self.orderGoods.inventoryNum > _self.number  ){
	       			++_self.number ;
	       			_self.devideDisable = false ;
	       		}else{
		       		_self.addDisable = true ;
		       		if(_self.goodsDetail.data.maxBuyNum < _self.number || _self.orderGoods.inventoryNum < _self.number){
		       			comm.toast('超出库存');
		       			_self.addLimited = true ;
		       		}
		       	}
       		}
       	},
       	devideGoods(){
       		let _self = this ;
	       	if(_self.number !== 1){
	       		--_self.number ;
	       		_self.addDisable = false ;
	       		if(_self.number <= _self.goodsDetail.data.maxBuyNum){
	       			_self.addLimited = false ;
	       		}
	       	}else{
	       		_self.devideDisable = true ;
	       	}
       	},
       	showPicker(){
       		this.showPickerState = true ;
       	},
       	hidePicker() {
	    	this.showPickerState = false;
	    },
       	menu(){
       		let _self = this ;
		    let scrollTop  = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop ;
		    let offsetTop = document.querySelector('.order-info').offsetTop ;
		    let _clientHeight = document.documentElement.clientHeight ;
		    if(_self.goodsOffsetTop == 0 && !_self.goodsFixed){
	    		_self.goodsOffsetTop = offsetTop ;
	    	}
	    	if(scrollTop  > _self.goodsOffsetTop -_clientHeight +50 ){
        		_self.goodsFixed = true ; 
        		_self.showBottonBtn = false ;
        	}else {
    			_self.goodsFixed = false ;
		    	_self.showBottonBtn = true ;
		  	}
        	if( document.documentElement.scrollHeight - scrollTop == _clientHeight ){//已经到底部
        		_self.showBottonBtn = false ;
        	}
	   	},
	   	//点击收藏按钮
	   	clickCollection(){
	   		if(comm.TOKEN){ // 已经登录
	   			this.CollectionState == 1 ? this.cancelCollection() : this.addCollection() ;
	   		}else{ //未登录
	   			let _type = comm.getUserAgentType();
	   			if(_type == 3){//站外
	   				this.hideCollection = true ;
	   			}else{
	   				comm.GoLogin();
	   			}
	   		}
	   	},
	   	//新增收藏
	   	addCollection(){
	   		let _self = this ;
	   		let _data = {
	   			token : comm.TOKEN ,
	   			platform : 3  , //商品平台  1淘宝  2京东 3助商通   4拼多多
	   			goodsId : _self.goodsDetail.data.goodsId, //商品id
	   			goodsUrl : window.location.href.replace('#/',''),//商品url
	   			goodsName : _self.goodsDetail.data.goodsName , //商品标题
	   			state : _self.goodsDetail.data.state , //上下架状态
	   			originalPrice : _self.orderGoods.originalPrice , //原价
	   			discountPrice : _self.orderGoods.originalPrice-_self.orderGoods.integralNum , //折扣价
	   			offerContent : _self.orderGoods.integralNum+'话呗' , //优惠内容
	   			cover : _self.goodsDetail.data.imgUrl , //商品图片
	   		};
	   		comm.addCollection(_data).then(res=>{
	   			if(res.data.state == 1){
	   				_self.CollectionState = 1 ;// 收藏状态   0未收藏  1收藏
	   			}else{
	   				comm.toast(decodeURIComponent(_data.msg));
	   			}
	   		}).catch(function (error) {
			    comm.alertMsg(error);
			});
	   	},
	   	//取消收藏
	   	cancelCollection(){
	   		let _self = this ;
	   		let _data = {
	   			token : comm.TOKEN ,
	   			platform : 3  , //商品平台  1淘宝  2京东 3助商通   4拼多多
	   			goodsId : _self.goodsDetail.data.goodsId, //商品id
	   		};
	   		comm.cancelCollection(_data).then(res=>{
	   			if(res.data.state == 1){
	   				_self.CollectionState = 0 ;// 收藏状态   0未收藏  1收藏
	   			}else{
	   				comm.toast(decodeURIComponent(_data.msg));
	   			}
	   		}).catch(function (error) {
			    comm.alertMsg(error);
			});
	   	},
	   	//查询商品是否被收藏
	   	stateCollection(){
	   		let _self = this ;
	   		let _data = {
	   			token : comm.TOKEN ,
	   			platform : 3  , //商品平台  1淘宝  2京东 3助商通   4拼多多
	   			goodsId : _self.goodsDetail.data.goodsId, //商品id
	   		};
	   		comm.stateCollection(_data).then(res=>{
	   			if(res.data.state == 1){
	   				_self.CollectionState = res.data.data ;// 收藏状态   0未收藏  1收藏
	   			}else{
	   				comm.toast(decodeURIComponent(_data.msg));
	   			}
	   		}).catch(function (error) {
			    comm.alertMsg(error);
			});
	   	}
	}
}
	
</script>

<style scoped>
	.VIP{
		position: absolute;
		z-index: 5;
		width: 41px;
		left: 9px;
		top: 10px;
	}
	.VIP-txt{
		color: #770022;
		width: 64px;
		text-align: center;
		display: block;
		font-size: 8px;
		padding: 3px 0;
	    left: 0;
		position: absolute;
    	top: -20px;
		background: -webkit-linear-gradient(left, #ffe42d , #ffb04a); /* Safari 5.1 - 6.0 */
		background: -o-linear-gradient(right, #ffe42d, #ffb04a); /* Opera 11.1 - 12.0 */
		background: -moz-linear-gradient(right, #ffe42d, #ffb04a); /* Firefox 3.6 - 15 */
		background: linear-gradient(to right, #ffe42d , #ffb04a); /* 标准的语法 */
	}
	.swiper-box{
		height: 18.75rem;
		width: 100%;
		overflow-x: hidden;
	}
	.swipe-indicator{
		position: absolute;
		background: rgba(244,245,246,.8);
	    top: 16.5rem;
	    right: 1rem;
	    width: 32px;
	    height: 32px;
	    border-radius: 50%;
	    text-align: center;
	    line-height: 32px;
	}
	._money {
		padding:0 1rem 0 2rem;
	    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAKlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKE86IAAAADXRSTlMAYPCgMJ+wIMDg0HBQ7H7hNQAAANFJREFUKM9jQIAypRQGZMCoe/euALKA7N27dy8iK7h7dwWKElmgNBAjKxCAEFBwFigJUnYFymfXBcqB1F2DCjBDda+9BBXgvCvA4oAswHGRIfYqshZuAda7dx2AhqrD7Y0FCsCsZY/sZgAquAx32CEgDVRgAFMAolEUyOJWoIOigGHH5AKYAhaQAhgoAipgAZmwASqQCzLJFmhCA1RA9waQYAE6cgJM4BrUaAOEFrDRlwqgAr7QsLuDGbqY4Y9Q0gVRgBmHCCWXBFDi3U0pHcEBANrJd5LTTcr0AAAAAElFTkSuQmCC) no-repeat 1rem center;
	    background-size: auto 13px; 
	}
	.link-alert{
		position: fixed;
		top: 50%;
		left: 12.5%;
		text-align: center;
		border: 1px solid #d6d8dd;
		border-radius: 4px;
	    box-shadow: 0 0 10px rgba(0,0,0,.3);
	    width: 75%;
	    z-index: 6;
        margin-top: -106px;
	}
	.link-con{
		padding: 1rem 0;
	}
	.link-con>p{
		display: inline-block;
		width: 33.3333%;
	}
	.link-con img{
		width: 1.85rem;
		height: 1.85rem;
		display: block;
		margin: 0 auto .25rem; 
	}
	.link-head{
		line-height: 1;
		padding: 1.2rem .5rem;
		font-size: 17px;
	}
	.close-alert{
		line-height: 44px;
		height: 44px;
		width: 100%;
	}
	.commodity-box{
		padding:.25rem .5rem .45rem;
	}
	.commodity-title{
		font-weight: 700;
	}
	.commodity-detail{
		/*padding: .5rem 0;*/
	}
	.parameter{
		padding: .5rem;
	    width: 100%;
    	box-sizing: border-box;
	}
	.service .top{
		padding: .4rem .4rem .4rem 6.5rem;
		overflow: hidden;
	}
	.service .top p{
		line-height: 27px;
		padding: 0 .45rem;
	}
	.ico-phone{
		display: inline-block;
		width: 12px;
		height: 12px;
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAANlBMVEUAAAD3CEz/AFD3CEz2CUz3CE33CU34B0v6BUr2CUz3CEj3CE33CE35Bk32CUz3CEz3CE33CU1ebi2dAAAAEXRSTlMA4BBAsGDwcDDQIMCgUJCAn7jCLFsAAAEASURBVEjHvdXbsoMgDAVQwlVBbff//+yZTkc4GCXhpeuxTQRzac3P2ETwiz7eET6CNj4BmMl4o3Ka+ANNtHL8jv+8XJ+IjpNfuEdGQKh0lQImjwDjZhOECSm4eJmxgM7qxD50bduNbMOJdPOdWXnURxilHGs9lV742owWzR7hzibU9dEu3dso2bXOttISZzNC695k++JyLXrxbjznge+8t6MXR+JjEMNzRv/ArX02GCqQY6OMdbkpLuF0fB/o0cR9dCvQ5+tD/MmyHhUVwsV+O+sD5XZ042SCyQWMsGLp6ZD8uOYed5L8vypfqAnE4iWJ2H0kobBJkuTkCat35mf+AEORKodBO2I7AAAAAElFTkSuQmCC) no-repeat center;
		background-size: cover;
		vertical-align: middle;
		margin-left: .25rem;
	}
	.service .top img{
		position: absolute;
		left: .4rem;
		width: 5.85rem;
		top: 50%;
    	transform: translateY(-50%);
	}
	.service .bottom{
		padding: .4rem .4rem .4rem 3rem;
	}
	.service .title{
		position: absolute;
		left: 1rem;
		top: .65rem;
	}
	.service .item{
		padding: .4rem .8rem 0  1.2rem;
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAnCAMAAAC7faEHAAAAVFBMVEUAAAD5Wlr6Wlr5WVn5Wlr/c3P5WVn5Wlr/bW34Wlr5Wlr/YWH6XFz5Wlr5Wlr5WVn5Wlr5WVn6Wlr/W1v/Wlr5WVn5W1v5Wlr5XFz7XFz7WVn4WVmXJvbnAAAAG3RSTlMAtWX5TQXVbQqYiRcwf+/Lx6aRHBGjeVJWPTxN7R5+AAABLUlEQVQ4y52U25aDIAxFC+IFZKytjp1p//8/mxBpmoJlKS8qbJNzAuR0cHTe6EUb332Deq2qB41K6X6Dmt0KRdTNOawdwmqjrLOqCe9Dm+q64MLYTuv31I44cek+lJ0xlBFzBoOeexENsWv9kaO+IvgeEZJWOqNZV5D6zQL8x5gAYeVlZh4g6UaxIPUQy+PAQr3B1WDGrV5BhHAqXYP0PmoYs6H+/vExRu2KpQoM5j2ZVKF2kHbKYsRNkBhr6MHFBvYTXhviDcYN43ZLMdJlyIaNzn4z2MmSkQUKFDkEGePyLhwPfySQMY7H+hhkjPWxXwYlRn65fgwKjOsn98NKLO5Hur9WYLy/yXm5+/S87Dp/5fO8536U79v++1vuB+X+cqBflftfuZ+W+/Ox8QTx0CQNT9caegAAAABJRU5ErkJggg==) .4rem .6rem no-repeat;
		background-size: .7rem;
		display: inline-block;
	}
	
	.shop-info{
		padding: .5rem;
	}
	.shop-info span{
		line-height: 40px;
		vertical-align: top;
	}
	.shop-info-box{
		padding: .5rem;
	}
	.shop-info-box .item{
		flex: 1;
		text-align: center;
	}
	.desc-tit{
		text-align: center;
		line-height: 44px;
		color: #999;
		position: relative;
	}
	.desc-tit:before{
		content: "";
	    position: absolute;
	    top: 52%;
	    background: #999;
	    width: 1rem;
	    height: 1px;
	    left: 50%;
	    margin-left: -3rem;
	}
	.desc-tit:after{
		content: "";
	    position: absolute;
	    top: 52%;
	    background: #999;
	    width: 1rem;
	    height: 1px;
	    right: 50%;
	    margin-right: -3rem;
	}
	.to-all{
		text-align: center;
		line-height: 48px;
	}
	.to-all .right-arrow{
		right: 50%;
		margin-right: -3rem;
	}
	.btn-box{
		-webkit-box-shadow: 0 2px 7px 0 hsla(0,0%,75%,.5);
    	box-shadow: 0 2px 7px 0 hsla(0,0%,75%,.5);
    	text-align: center;
		line-height: 50px;
		height: 50px;
	}
	.buy-box{
		padding: 0 .5rem;
		height: 44px;
	}
	.buy-box>div{
		border: 1px solid #aaa;
		padding: 1px 0;
		height: .7rem;
	    margin-top: .7rem;
	    border-radius: 4px;
	}
	.buy-box span.item:first-of-type:after{
		position: absolute;
		content: '';
		height: 100%;
		width: 1px;
		background: #aaa;
		right: 0;
	}
	.buy-box span.item:last-of-type:after{
		position: absolute;
		content: '';
		height: 100%;
		width: 1px;
		background: #aaa;
		left: 0;
	}
	.buy-box .item{
		position: relative;
		min-width: .8rem;
	    height: .8rem;
	    line-height: .8rem;
	    color: #222;
	    text-align: center;
        display: inline-block;
        cursor: pointer;
        vertical-align: top;
	}
	.buy-box .disabled{
		color: #cacaca;
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
	.btn-box{
		position: fixed;
		bottom: 0;
		width: 100%;
	    z-index: 3;
	}
	.order-title{
	    padding: .4rem 0;
	    text-align: center;
	    color: #222;
	    font-weight: 700;
	}
	.order-info{
		padding: .5rem .5rem .5rem 6rem;
		position: relative;
        min-height: 5rem;
    	box-sizing: border-box;
	}
	.order-info .detail{
		padding: .25rem 0 .25rem .5rem;
	}
	.order-info img{
		position: absolute;
		width: 5rem;
		height: 5rem;
		left: .5rem;
	    top: -10px;
	    border: 5px solid #fff;
	    border-radius: 5px;
	}
	.order-info img:after{
		content: '';
		display: block;
		border: 1px solid #0A95FE;
	}
	.format-box{
		padding-left: .5rem;
		max-height: 12rem;
		overflow-y: auto;
	}
	.format-box .border-buttom{
		padding: .5rem 0;
	}
	.format-box .item{
		background: #ededed;
		border-radius: 4px;
		margin: .4rem .6rem 0 0;
		height: 20px;
	    display: inline-block;
	    cursor: pointer;
	    position: relative;
	}
	.format-box label{
		padding: 0 .6rem;
		border-radius: 4px;
		display: block;
	}
	.format-box input[type="radio"]{
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		opacity: 0;
	}
	.format-box input[type="radio"]:checked+label {
        background: #FF4F81;
		color: #fff;
    }
	.format-box .item.active{
		background: #FF4F81;
		color: #fff;
	}
	.btn.bg-c{
		background: #ededed;
	}
	
	.btn-sub{
		background: #FF4F81;
		color: #fff;
		width: 80%;
		line-height: 45px;
		height: 45px;
		margin: 1rem auto 3rem;
		border-radius: 5px;
		display: block;
	}
	.isFixed{
		position: fixed;
		top: 0;
		z-index: 2;
		-webkit-box-shadow: 0 0 7px 0 hsla(0,0%,75%,.5);
    	box-shadow: 0 0 7px 0 hsla(0,0%,75%,.5);
	}
	/*服务popup*/
	.popup-con-service{
		padding: .25rem 1rem;
	}
	.popup-con-service .item{
		padding-left: 2rem;
	    margin-bottom: 1rem;
		position: relative;
	}
	.popup-con-service .icon{
		position: absolute;
		width: 20px;
		height: 20px;
		left: 0;
		top: 5px;
	}
	.ico-guarantee{
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAYFBMVEUAAADYHgbYHgbYHgXZHgbZHgfZHQbZHQbYHgbZHQXZHQbZHQXZHgXYHQbYHgbYHgbZGgDYHgbZHgbZHgTZHQfYHQXYIQDYHQbYHQbaHQXYHgbYHgbYHgbWHgrZHQfYHgazuXYTAAAAH3RSTlMA71W/h0SZy+S2eV+PKPmhEt6pOx9nC6xsNPPTTBlxaWZVMgAAAdxJREFUSMfNleu6oiAUQKG8onhJyzRtvf9bDpbgZRrz/Jqz+j4s2is2bCDxSyn60wH8m41PMw7RPd/xF0AeAFDCUEFQiAPUMdkwJkR5dKoZiXnkNOIgD9RrCvlRIcQzbfNTISY4Kpw/CbVstND+TPFF8KAWATPVF0ESCyPI8E22FtJRMO1MAicjuB+JNoJr54WQt58ILZzFnrCdQ2OF2H8jqfYKp7HCTLXdGjmx68kn4XoxdITjQ89CxP218OFiAGmEiZKrWJNxMu2TyHbESGUE7b2QxErdr8nJbe93fj3Yw3rvnokRetZYoYLBPGpo3UYSiR0hYiRPg4s7LlfktBmUcBjBVjwzr9DdFIvlaYhXwhSvSlREWCwXSU0jZcVG8CAYV6mVlNViCq0928+VMJxN/HtZdQTKZfRw78qVkIKydSjczhk6nvOOu69SavxF4exXKdJlfiEqZuFzpXWGWn6Iv98Y0WKJ1ZjULimc1hdI5u/FJ2xur6LcNU7Ymju0pOt3fv+xveBfJfI+x3tQDh+u/wfE9d/9OoTzID5wy6FT204vg/SfuUqI7stwNfb0O/8xASbAmxLTqQTSm9hD5xhCpVvvAWSBkb9QT6dzHus7fT6mHvjiB/it+F/8AVbnM8wk1W3yAAAAAElFTkSuQmCC) no-repeat center;
		background-size: cover;
	}
	.ico-qualityGoods{
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAZlBMVEUAAADYHQXYHgbZHgbYHgbYHgbYHgbZHQTYHQbZHgXYHgXZHQbYHwfZHQjYHgXZHQfZHgbZHgbZHQbZHgXYHgbaHQfVHQDYHQXYHgbYHQbZHgbZHgDYHgbZHQbYHQbYHgfYHgbYHgYQh1GyAAAAIXRSTlMAZfKH3fl3O6Uxv8eWGbhEgdUp584iCI5bTbIQ4qudb1V2g6T6AAABiElEQVRIx9WU2XKEIBBFoRURGNzXWXP//ydTyeiQckCpytOcF5uuexAshH0Kj45IT9Fxa2CqpIbu4/KciP88M6IsIl4adOpZ9hr1VyB2UUrJkld5iyt37SkF5RUvpVLNwBxNgSdU55sp53tNeJL3rzxRMpelVDbwEZQsyzkhapZGISSLQOK8VGRYFB0tBYo4QYv/C5J7kGFhEPAghvAbSr5yg9l/w5YMeXgPQscJhpai7VxzbqegUF+XIq1dM8EpKFzXXNdGCe5EFBg8AqUL1foL4LZUI5o9IXsdvlXl+IpZEsfk1BhhhFqqgUyMUNOrPMMeCxb5ZnUHAgd3stDHQkcXN7ihORIk7u+jFF6655zqr69/hzzxwl9XhkNBs12M2NzMJzz28hWqTWeohQrnS5i3XkNtH8orIuuZRaTWn29akr7+LFrlXQ+t+S2SiHuuA3EN7q43OPeb5RsUloXJSJyaP/EcxNku9i5wnoef8jJp0GjZEbZqQcU4aoH0cWFRyNEQ6Uqyz+AbLxIgZIylYyEAAAAASUVORK5CYII=) no-repeat center;
		background-size: cover;
	}
	.ico-sf{
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAXVBMVEUAAADYHgbYHQXYIADYHgbZHQbYHQbYHgbYHQXYHgjZHQfYHgbYHgXZHQTZHQbZHQfZHgbZHQbZHQbZHAfZHgbYHQXYHgXYHgbYHgbZHgXZHQbYHgbYIAbYGwDYHgZbKRpjAAAAHnRSTlMAqmEK8KDg12cXb869OVgglnd/R+k/joi3MsdOKBIwvvl/AAACAUlEQVRIx9VV2aKrIAwURUBxAXe7zP9/5rVyABXLPa9nXgox00wypk3+BNpULZIxuUxp+//souM4gOsinq6w4TGnfV33YnoAoFOEUtItO8184C0kQNMv6e9lSx+v0V4CJLvtlQPl3QMNyOImn4Gt96XrATxgvDm4H2L4ZfKqioC1EWsGkHNEAGsSwQg0p/nTrd8oOrCjqAk8iSPj6E4F+p+BKDlQTkz5tVSEqLLeLw2oL1FC2sIGH4E9tRe2z5TDOy4hjKvYwCsO6CRJ4fAy/lVOEWB8yQH6EdBOpSEMZO5yZggtYDU1VlEFN+6dUJmM1nww22gyQ1n3MLwOhPzirXan0pYCqPhG6Ny9QuNOG+R4ILzIbAnC6ZVOXEbwQZ45Qs7YaFt1Y3rg6eo++V6kCCUZgpfk4x9KFRC8JN++Nx6oA4Ifpm/fDxD6bqyl1Q1mDnXhCF1IGGDbz4DWaGFi5wFoAsIK6s4VOiueLqoCwLKAMJ1eG2adNmBrMKVswPN4Sc3qEgqAd844jxLscNN+Y4v25/QSYjwtpTjWY1BJFPll63tsCiNIgfocmUDr6M9Sd40tEUZPQYJg9gBt7vOFWdaAsQD5O4wXxP5BBJiBobw8yjQF9Nfe+EaZ6kNAUUD6QAjBsL9PWgitqt32NInjSSgcaN4nv8Aq5pyQfE7X5E/gH3sQLbwFqExXAAAAAElFTkSuQmCC) no-repeat center;
		background-size: cover;
	}
	.ico-invoice{
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAY1BMVEUAAADYHgXVHQDZHgXUGgDYHgbYHgbYHgbYHgbZHQXZHQTZHQfXHQXYHQfZHgbYHgbYHQbYHgXYHgXZHgbZHQfZHQbVIAvYHgbYHgbYHgbaGwnYHQXYHgbZHQfZHQXZHgbYHga16EuyAAAAIHRSTlMAZRDuCcvd1PS8PXEvIYZ45Y5cTUesF8WjVBuUs5pqf3+ApiYAAAHWSURBVEjH1ZTZtqMgEEWRUgHjgLPGDOf/v7LtFgcuYvLW6+43k7OLkkLYfyMMv47ycVIaM1rlzWetaTFDIoqEBEBDeh2PAF3W3fKUVU8ClF/hLaAa+1UqAZSexhINkTCHihBlZ/laekrxB3R6kgcq5iEHOUYiUTMvBfSdWXTa1PdQorfbbVGySxQKa/8hPsz0TvK4VQIJ+8ANw3GH1LKBVXBCuoxQY1/iYRbocUpqlnhvk0G8FAEGp35BuC0bOacMI3IjiLPmjcDU1tMTjREiFvIfsGAVCgRG6ME34QUbsQsNJiMQsU0IyEbtwh3KCBC74GAEO9d/J8j4O4HGZhPclqrY5sHqQCK062liF7uUSNNThsd2dDv/HOZ8sZ64cvs6RvcdwmU2e57lqNiqTkaQySYoSuw8i3Bfi0kKlwkees9n28pnh/UH01Otoo3hDRmYvOnotl8ZpwMoRBfveU6SHz/x8cRIw/R4N5XHv6A5uyQFWYkJ7WU+FAh+/vC+ElqnYEa4+fNPCO40Sch9/bSI15nZhupO31dAmLxNFoFezo3Jc6DlnqVzIL5xq0hOoIB5yQYAqki6fw9N3gOydMvbJTX+QrScwaJjH0lfTyXiWKipythv4A9Xkim8UAc1mwAAAABJRU5ErkJggg==) no-repeat center;
		background-size: cover;
	}
	/*商品参数部分*/
	.parameters-box{
		padding: .5rem;
		text-align: center;
		line-height: 32px;
	}
	.parameters-item span:first-of-type{
		width: 34.5%;
		display: inline-block;
		background: #f4f5f6;
	}
	.parameters-item span:last-of-type{
		width: 63.5%;
		display: inline-block;
	}
	/*商品规格popup*/
	.popup-con-parameter{
		padding: .25rem .8rem;
		line-height: 40px;
	}
	.popup-con-parameter span:first-of-type{
		width: 35%;
		display: inline-block;
	}
	.popup-con-parameter span:last-of-type{
		width: 63%;
		display: inline-block;
	}
	
	/*旋转动画*/
	.right-arrow.rotate  {
		-webkit-animation:bouncedelay .5s  ease-in-out;
		animation:bouncedelay .5s  ease-in-out;
		-webkit-transform: rotate(135deg);
	    -ms-transform: rotate(135deg);
	    transform: rotate(135deg);
	}
	@keyframes bouncedelay{
		from{transform:rotate(45deg);}
		to{transform:rotate(135deg);}
	}
	@-webkit-keyframes bouncedelay{
		from{-webkit-transform:rotate(45deg);}
		to{-webkit-transform:rotate(135deg);}
	}
	.bounDown{
		-webkit-animation:down .5s  ease-in-out;
		animation:down .5s  ease-in-out;
		position: relative;
		z-index: 0;
	}
	@keyframes down{
		0%{transform: translateY(-100%);opacity: 0;}
		50%{opacity: 0;}
		100%{transform: translateY(0);opacity: 1;}
	}
	/*评价列表*/
	.evaluate-box{
		padding: .5rem .6rem ;
	}
	.summary-box{
		padding: .5rem 0;
	}
	.summary-box .item{
		padding: 0 .5rem;
		line-height: 28px;
		height: 28px;
		display: inline-block;
		border-radius: 28px;
		margin: 6px .8rem 0 0;
	}
	.evaluate-list{
		padding-bottom: .5rem;
	}
	.evaluate-list .evaluate-head{
		position: relative;
		padding-left: 1.8rem;
	}
	.evaluate-list .evaluate-head img{
		position: absolute;
		left: 0;
		top: 0;
		width: 1.2rem;
		height: 1.2rem;
		border-radius: 50%;
		top: 5px;
	}
	/*图文详情*/
	.tuwen-box >>> img{
		width: 100%;
		display: block;
	}
	/*站外显示的横幅*/
	.download-prompt{
		position: fixed;
	    background:rgba(0,0,0,.9);
	    top: 0;
	    left: 0;
	    z-index: 6;
	    width: 100%;
        height: 40px;
    	line-height: 40px;
    	padding: 0 0 0 .4rem;
    	box-sizing: border-box;
	}
	.close-prompt{
		display: inline-block;
		width: 20px;
		height: 20px;
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAANlBMVEUAAACPj4+KioqKioqJiYmKioqLi4uKioqKioqKioqKioqKioqHh4eJiYmKioqKioqJiYmKiopYcXZfAAAAEXRSTlMAENDwoDBAgMDgYJAgULCfcH/BtoYAAAJRSURBVFjDtZfblsMgCEWbeNeYy///7CytSB16EudheGkb3QdEtOT1b7bY0/lqh7PbX2mT1muwcMRl3rcLTLKpw07h23FB83bCe5+9apdtsTN5lnjIhqXgdV7GgUQj7o5v7sPXhFnfIttg+L7hcG/eE5QB/Hvn0t125VAVIuaVfUjyXr1ExK/P1XJWhSyeV14zjy1+zUOqPISkQhh95Rr/BMwK+5AARZrQZLzx9wMzxXLGFDvchhI1/gCxbPu+fBCpD+iygP4roN006ro8FX0LgeVsn0b1IPkCsZsSNAfgeaJnBcHzQuNHCGUkw5pkniqFQ4hdK4Cqxvwr9VrYKaFCAfGcuYVWYMDJQjzVQm5ZV/BsYv6VWuQnrQUqMC/Oj28l4fD9AHhKQtv2/MIKxEtrWfRUhkAB8kSGqoMViIcCbSVIAfNYgM1WXi3zArL+aS+wQAnTQJ4UoAB9QF6vUGGtZD1LEfPgdFMdwErk+gMKfIhiKWnMAwUCqaQxjxU0hV5KMQMeKRBnSUkjHivYkgL+tgAeK7Bfvl8ljxUWxSt347UciJcKdHcxxGJnn9l4oPDJxK42ZMETLxV4ZKcAWG7vv04LO4vIW0BBc+NEg9hGj6toGMwMy/+/Rv51b5P88aVnjuDMIl6eP117NzPDA19adLqo10Wr1fw6gM0E6lOhwmpv3Kf3FHP/vnFsAD/V9ZBrq5pElmOba4PpKUXVQsrD7eFWGnhKsw38ouiTK+ZXfuRmevE2n43xyX7cavUF91Hi2HIa4gg6woOCzVhXLd/m7QcqIz7zLTW6+QAAAABJRU5ErkJggg==) no-repeat center;
		background-size: cover;
		position: absolute;
    	right: .5rem;
	}
	.download-prompt-link{
		display: inline-block;
    	height: 100%;
    	/*padding: 0 .75rem;*/
		width: 6rem;
		font-weight: 800;
		text-align: center;
	    float: right;
	    background: #F7094D;
	}
	.a-area{
		display: inline-block;
	    width: 60%;
	    height: 44px;
	    vertical-align: top;
        padding: 0 .5rem;
        box-sizing: border-box;
        overflow:hidden;
	    text-overflow:ellipsis;
	    white-space:nowrap
	}
	/*流程*/
	.flow-box{
		text-align: center;
		padding-bottom: .5rem;
	}
	.flow-box p{
		padding: .15rem 0;
	}
	.flow-box ._money{
		padding: 0 1rem 0 0;
    	background-position-x: right;
	}
	/*弹窗*/
	.alert-box{
		padding-bottom: 20px;
	}
	.alert-btn{
		flex: 1;
		height: 35px;
		line-height: 35px;
		width: 41%;
		border-radius: 35px;
	}
	.alert-con{
		padding-bottom: 40px;
	}
	.btn-r{
	    background: red;
	    border-radius: 35px;
	    line-height: 35px;
	    height: 35px;
	    display: block;
	    width: 80%;
	    margin: 0 auto;
	}
	
	/*商品下架，商品图片遮罩层*/
	.pulledState{
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 5;
	}
	/*收藏*/
	.collect-box{
		flex: 1;
		line-height: 1.2;
		padding-top: 10px;
	}
	.ico-collect{
		width: 20px;
		height: 20px;
		display: block;
		background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAjCAMAAAAkGTMsAAAAXVBMVEUAAACanaWanaWanaWanaWanaWcn6aanaWanaWanaWanaWanaWanaWanaWanaWanaWbnqb///+anaX19fa2ub6eoanm5+nY2dzOz9Osr7Wlp6/t7e/HyM3Cw8jf3+IZI8m6AAAAEXRSTlMA4b/tgFAIXRWmjjMo0MhqIUedqYMAAAFJSURBVDjLhZRZsoMgFAWZNJqZBkQwyf6X+TL4tBxi+s+qruvlcFTMOSrUVfzgqgH5SzvjnUdtSzuysy6z25JKSbTWRuT2qGRfpM1hZ+LbilubHQj2Q+Dw1dpz6607+6+WpOmtZrl/VZhanaSUZPtP5vl8UrUpqrdTKAZug3VjQBVCGAi+jU3nntgR96RrYusDXISmtdu06H7jdcaTGNIPK2FeV+c3JY8sn7XT+E1JH9/3oknui+MS+tCXWJKb9cUz8jiErwjtWgYBVYkRA35lJYyYcCEvrMBFTDHcF9YdM7MUj4X14DyVSoJdEqgmVoFfTbSYdXlMwo1JzHqtxmbcxi42s09J00/oEpC6fuqs/TCkfdrJ4SZg5Ygxw74U5R5y/Fjl9I2diwnOnwIcTpCi69CTN9a8kLvxjyF5UU+sSiHrYhphLYdG/AEDhTKFXfQEOwAAAABJRU5ErkJggg==) no-repeat center;
		background-size: cover;
	    margin: 0 auto 2px;
	}
	.ico-collect-on{
		width: 20px;
		height: 20px;
		display: block;
		background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAjCAMAAAAkGTMsAAAARVBMVEUAAAD/tBX/tBX/tBX/tBX/tBX/tBX/tBX/tBX/tBX/tBX/tBX/tBX/tBX/tBX/tBX/tBX/tBX/tBX/tBX/tBX/tBX/tBUEN2Q+AAAAFnRSTlMA4PHHCb3oF6eCX1hONSzYiyLPk3pnIXsLygAAANZJREFUOMuF0lkOwyAQA1Czk31p6vsfta1oQ4kg8/4iWWRgjKvN0W0QbJ6kl2KGHwa3eiY97igmygpHJb00lTTZzGxCy8rsIcyeeFyEoYtuV0rx3/t7d7EbAj5Gw3tmBA7KDmjKNDxlHh1lK+wihhYLzFqaasbbpO9D03d9im1qxldwzZALyFo37VB4VkNPlA7hqKQ+2Y6CZV0oUmMjNRSpBwuNXptWA4uUb62nNfzSL8xsPbVa2LWeOnttUgEmU/sjYtp/vviQehKRnK3wcSyfMHr9a8QL1n89x140coMAAAAASUVORK5CYII=) no-repeat center;
		background-size: cover;
		margin: 0 auto 2px;
	}
</style>