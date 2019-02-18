<template>
	<div class="bg-box">
		<div class="box">
			<div class="printOrder" v-for="(v,k) in list">
			   <barcode :value="v.barcodes" :options="barcode_option" tag="svg" ></barcode>
			</div>
			<div id="qrcode"></div>
			<p class="refresh"><button class="refresh-btn" @click="getCodeNum"></button>每一分钟刷新一次，请当面使用，勿泄漏</p>
		</div>
		<P class="fc-f fz15">话币使用规则请点<a class="fc-f" href="https://www.tenzhao.com/zst-wap/qrcodeguide/use.html">击查看详情</a></P>
		<P class="fc-f fz10">仅限助商通商盟商家使用</P>
	</div>
</template>

<script>
import QRCode from 'qrcodejs2' 
import fetch from '../assets/js/fetch'
import * as comm from '../assets/js/comm'


export default {
	name: 'card',
	data(){
	    return{
	      	barcode_option:{
		        displayValue: true, //是否默认显示条形码数据
				//textPosition  :'top', //条形码数据显示的位置
				background: '#fff', //条形码背景颜色
				valid: function (valid) {
					
				},
				width:'2px',
				height: '90px',
				fontSize: '16px' //字体大小
			},
	  		list:[{barcodes:''}] ,
	  		token:'',
	  		cardNum:'' ,
    	}
  	},
	methods: {  
    	qrcode (cardNum) {  
    		/*QRCode.clear();*/
	    	let qrcode = new QRCode('qrcode', {  
				width: 160,  
				height: 160, // 高度  
				text: cardNum // 二维码内容  
				// render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）  
				// background: '#f0f'  
				// foreground: '#ff0'  
			})  
		},
		getCodeNum () {  
			let _self = this ;
			document.getElementById('qrcode').innerHTML = "";
			fetch({
		        url: '/api/voip/active/barcode',
		        method: 'get',
		        params: {
		        	token: this.token ,
		        	activeType:"1"
		        }
	    	}).then((res)=>{
	    		let _data = res.data ;
	    		debugger
	    		if( _data.state == 1){
	    			_self.cardNum = _data.data ;
	    			_self.list[0].barcodes = _data.data ;
	    			_self.qrcode(_data.data);
	    		}else{
	    			comm.toast(decodeURIComponent(_data.msg));
	    		}
	    	}).catch(function (error) {
			    console.log(error);
		  	});
		},
		getBarcodeState(){
			let data ={
				token:this.token,
				barCode: this.cardNum,
			}
			fetch({
		        url: '/api/voip/integral/barcode/state',
		        method: 'get',
		        params: data
	    	}).then((res)=>{
	    		let _data = res.data ;
	    		if(_data.state == 1){
	    			 if(_data.data.state == 3){ //  2未消费3已消费
	    			 	console.log(_data)
	    			 	let _order = _data.data.order ;
	    			 	this.$router.replace({path:'/payItem',query: {
	    			 		orderNum : _order.orderNum ,
	    			 		totalMoney : _order.totalMoney ,
	    			 		shouldPayMoney : _order.shouldPayMoney ,
	    			 		integralConvertCash : _order.integralConvertCash ,
	    			 		consumeTime : _order.consumeTime ,
	    			 		storeName : _order.storeName
	    			 	}});
	    			 }
	    		}else{
	    			//comm.toast(decodeURIComponent(_data.msg))
	    		}
	    	}).catch(function (error) {
				    console.log(error);
			});
		},
		
  	}, 
	mounted () {  
		let self = this ;
		self.token = comm.getStore('accessToken')  ;
		self.getCodeNum(self.cardNum);
		window.myTime = setInterval(function(){
			//QRCode.clear()
			self.getCodeNum(self.cardNum);
		},60000);
		Window.getState = setInterval(function(){
			self.getBarcodeState();
		},1000);
	},
	destroyed () {
		console.log("离开当前组件")
		clearInterval(window.myTime) ;//销毁定时器
		clearInterval(Window.getState) ;//销毁定时器
	},
	
}
</script>

<style scoped>
	.bg-box{
	    width: 100%;
	    /*background-image: linear-gradient(135deg, #ff8b8b 100px, #f7094d 200px);*/
	    background: -webkit-linear-gradient(left top, #ff8b8b , #f7094d); /* Safari 5.1 - 6.0 */
	    background: -o-linear-gradient(bottom right, #ff8b8b, #f7094d); /* Opera 11.1 - 12.0 */
	    background: -moz-linear-gradient(bottom right, #ff8b8b, #f7094d); /* Firefox 3.6 - 15 */
	    background: linear-gradient(to bottom right, #ff8b8b , #f7094d); /* 标准的语法（必须放在最后） */
	    height: 100%;
	    position: fixed;
	    text-align: center;
	} 
	.printOrder{
		margin-bottom: 1.2rem;
	}
	.box{
		background: #FFFFFF;
		width: 86.4%;
		margin: 2.5rem auto 0;
		border-radius: 5px;
		padding: 2.5rem 0 1.3rem 0;
	}
	.fc-f{
		font-size: .75rem;
		line-height: 1.5;
	}
	#qrcode{
		width: 8rem;
		height: 8rem;
		margin: 0 auto;
	}
	.refresh{
		font-size: 12px;
		line-height: 1;
		padding-top: 1.4rem;
		text-align: center;
	}
	.refresh-btn{
		background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAALVBMVEUAAACNjpiNjpeKj5qPj5+NjZiMjpiNjpiMjpeNjZmLj5eNjZmPj5eMjZeNjpg26KMoAAAADnRSTlMA8MAwENCQgKBQQHAg4IfjEogAAACzSURBVCjPYyAX8GyKe6huwMDAGgDhc+m9A4JHCxj4HkAE8h52GrDMkHsGE3B6WAKi3N+FQAX0hCEKDZ/6gQXYHjpABFju5YEF1gnDLLN7BxbQK4AJsIMFeKA6WIE2gwW4XzAgBEAOY3qJ5mzWx6h8oOswBPBocUxAM3SeAsRaOOjbAHMY1DNyBmhOf8SA5rlXDCjeZ5ZLYEALICCBGoRAEh7IzKBAhgBENKBE1FttA3KjGQCLu0cx4vPGpwAAAABJRU5ErkJggg==) no-repeat left top;
  		background-size: cover;
  		width: 15px;
		height: 15px;
	}
	.fz15{
		font-size: 15px;
		line-height: 21px;
		padding-top: 13px;
	}
	.fz10{
		font-size: 10px;
		line-height: 35px;
	}
</style>