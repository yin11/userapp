<template>
	<div>
		<div class="bg-yellow fc-f fz15 tip-box">
			<span class="fz16 tip">温馨提示</span>
			<p>退款成功后，订单内所需话呗一并返还</p>
			<p>订单一旦取消，无法恢复</p>
		</div>
		<!--退款商品信息-->
		<div class="bg-f mb-6 fz15 pd-lr-17 info-box">
			<p class="title">退款商品</p>
			<div>
				<img src="@/assets/img/head.png"/>
				<p class="txt-overflow">商品的名称商品的名称商品的名称商品的名称商品的名称商品的名称商品的名称商品的名称商品的名称商品的名称商品的名称</p>
				<span class="fc-c bg-c fz12">商品规格:vhufjhckm</span>
			</div>
		</div>
		<div class="bg-f bt-grey pd-lr-17 mb-6 fz15 list" @click="showFormat">
			<p class="clearfix"><span class="fl-l">退款原因</span><span class="fl-r reason">{{reason}}</span></p>
			<i class="right-arrow"></i>
		</div>
		<div class="bg-f mb-6 pd-lr-17 list">
			<p class="clearfix">
				<span class="fl-l">退款总金额：</span>
				<span class="fl-r fc-r">￥33333</span>
			</p>
			<p class="clearfix">
				<span class="fl-l">退款总话呗：</span>
				<span class="fl-r fc-r">33333</span>
			</p>
		</div>
		<div class="bg-f mb-6 pd-lr-17 list">
			<p class="clearfix">
				<span class="fl-l">退款联系人</span>
				<input type="text" placeholder="请输入姓名" v-model="name" class="fl-r"/>
			</p>
			<p class="clearfix">
				<span class="fl-l">退款联系电话</span>
				<input type="tel" placeholder="请输入手机号" v-model="phone" maxlength="11"  class="fl-r"/>
			</p>
			<p class="clearfix bt-grey" @click="showExpress">
				<span class="fl-l">快递类型</span>
				<span class="fl-r express">{{express}}</span>
				<i class="right-arrow"></i>
			</p>
			<p class="clearfix">
				<span class="fl-l">物流单号</span>
				<input type="number" placeholder="请输入物流单号" v-model="logisticsNum" class="fl-r"/>
			</p>
		</div>
		<div class="bg-f bt-grey pd-lr-17 mb-6 fz15 list clearfix">
			<span class="fl-l">备注</span>
			<textarea placeholder="填写备注" class="fl-r" ></textarea>
		</div>
		<div class="bg-f pd-lr-17 mb-6 upload">
			<p class="title fz14">上传凭证</p>
			<div class="clearfix">
				<div class="upload-box fl-l" v-for="(item,i) in list">
					<input type="file" accept="image/*" class="btn-file" @change="showImg('btn-file'+item)" :id="'btn-file'+item"/>
					<img :src="img" width="100%" height="100%" v-for="(img,k) in imgSrc" v-if="i == k && img != '' "/>
					<i class="ico-add" ></i>
					<p class="fz14" >上传凭证{{i}}</p>
				</div>
			</div>
		</div>
		<!--底部按钮-->
		<div style="height: 52px;"></div>
		<div class="flex-box fc-f btn-box">
			<a href="tel:8090775" class="btn-phone bg-yellow fc-f fz15"><i class="ico-phone"></i>联系商家</a>
			<div class="btn-apply bg-r fz18" @click="testForm">申请退款</div>
		</div>
		<!--退款原因弹出层-->
		<mt-popup v-model="popupFormat" position="bottom"  >
			<div class="service-popup">
				<div class="popup-title">退款原因</div>
				<div class="popup-con popup-con-parameter">
					<div class="fz14 ">
				      	<div class="border-buttom  radio-box" @click="hideFormat">
				      		<input type="radio" id="checkbox1" name="eeason" v-model="reason" value="原因1"/>
				      		<span>退款原因</span>
				      	</div>
				      	<div class="border-buttom  radio-box" @click="hideFormat">
				      		<input type="radio" id="checkbox2" name="eeason" v-model="reason" value="原因2"/>
				      		<span>退款原因</span>
				      	</div>
				      	
				      	<div class="border-buttom  radio-box" @click="hideFormat">
				      		<input type="radio" id="checkbox3" name="eeason" v-model="reason" value="原因3"/>
				      		<span>退款原因</span>
				      	</div>
				      	<div class="radio-box" @click="hideFormat">
				      		<input type="radio" id="checkbox4" name="eeason" v-model="reason" value="原因4"/>
				      		<span>退款原因</span>
				      	</div>
			      	</div>
				</div>
			</div>
		</mt-popup>
		<!--选择快递弹出层-->
		<mt-popup v-model="popupExpress" position="bottom"  >
			<div class="service-popup">
				<div class="popup-title">选择快递类型</div>
				<div class="popup-con popup-con-parameter">
					<div class="fz14 ">
				      	<div class="border-buttom  radio-box" @click="hideExpress">
				      		<input type="radio" id="express1" name="express" v-model="express" value="快递1"/>
				      		<span>快递1</span>
				      	</div>
				      	<div class="border-buttom  radio-box" @click="hideExpress" >
				      		<input type="radio" id="express2" name="express" v-model="express" value="快递2"/>
				      		<span>快递1</span>
				      	</div>
				      	
				      	<div class="border-buttom  radio-box" @click="hideExpress" >
				      		<input type="radio" id="express3" name="express" v-model="express" value="快递3"/>
				      		<span>快递1</span>
				      	</div>
				      	<div class="radio-box" @click="hideExpress" >
				      		<input type="radio" id="express4" name="express" v-model="express" value="快递4"/>
				      		<span>快递1</span>
				      	</div>
			      	</div>
				</div>
			</div>
		</mt-popup>	
	</div>
</template>

<script>
import * as comm from '../assets/js/comm'
export default{
	data(){
		return{
			popupFormat : false ,
			popupExpress : false ,
			reason : '' ,
			name : '' ,
			phone : '' ,
			express : '顺丰' ,
			logisticsNum : '' ,
			imgSrc : '' , //上传的图片显示路径
			list : [1] , //上传图片的框
			imgSrc : [] , //上传图片路径
		}
	},
	methods:{
		//显示选择快递弹出层
		showExpress(){
			this.popupExpress = true ;
		},
		//隐藏选择快递弹出层
		hideExpress(){
			this.popupExpress = false ;
		},
		//显示选择退款原因弹出层
		showFormat(){
			this.popupFormat = true ;
		},
		//隐藏选择退款原因弹出层
		hideFormat(){
			this.popupFormat = false ;
		},
		//选择图片后显示所选图片
		showImg(id){
			try{
				let _self = this ;
				let _file = document.getElementById(id).files[0];//创建用来读取此文件的对象
 				_self.verificationPicFile(_file,function(ImgUrl){
 					if(_self.list.length<3){ //上传图片不能超过3张
 						_self.list = _self.list.concat(_self.list.length+1) ;
 					}
 					_self.imgSrc = _self.imgSrc.concat(ImgUrl) ;
					console.log(_self.imgSrc)
 			    });
			}catch(e){
				comm.alertMsg(e);
			}
		},
		//判断上传的图片是否超过2M
		verificationPicFile(fileObj , callback){
			try{
				let _self = this ;
			    let fileMaxSize = 2048;//2M
			    let _size = fileObj.size / 1024;
			    let ImgUrl = '' ;
			    let reader = new FileReader();
			    if (_size > fileMaxSize) {
			        comm.toast("文件大小大于2M，请耐心等待");
			        reader.readAsDataURL(fileObj);
			        reader.onload=function(){
			        	var re = this.result;
			        	_self.canvasDataURL(re,{quality: 0.2},function(base64Codes){
		                	if( base64Codes.length / 1024 > 150 ){
		                		let _file = _self.dataURLtoFile(base64Codes , 'file');
		                		_self.verificationPicFile(_file , callback);
		                	}else{
		                		ImgUrl = base64Codes ;
		                		callback(ImgUrl);
		                	}
		               });
			        }
			    }else if (_size <= 0) {
			        comm.toast("文件大小不能为0M！");
			        return false;
			    }else{
			    	let URL = window.URL || window.webkitURL;
				    let imgURL = URL.createObjectURL(fileObj);
				    ImgUrl = imgURL ;
				    callback(ImgUrl);
			    }
		    }catch(e){
				comm.alertMsg(e)
			}
		},
		//将图片压缩成base64
		canvasDataURL(path, obj, callback){
			try{
				let img = new Image();
			    img.src = path;
			    img.onload = function(){
			        let that = this;
			        // 默认按比例压缩
			        let w = that.width,
			            h = that.height,
			            scale = w / h;
			        w = obj.width || w;
			        h = obj.height || (w / scale);
			        let quality = 0.7;  // 默认图片质量为0.7
			        //生成canvas
			        let canvas = document.createElement('canvas');
			        let ctx = canvas.getContext('2d');
			        // 创建属性节点
			        let anw = document.createAttribute("width");
			        anw.nodeValue = w;
			        let anh = document.createAttribute("height");
			        anh.nodeValue = h;
			        canvas.setAttributeNode(anw);
			        canvas.setAttributeNode(anh);
			        ctx.drawImage(that, 0, 0, w, h);
			        // 图像质量
			        if(obj.quality && obj.quality <= 1 && obj.quality > 0){
			            quality = obj.quality;
			        }
			        // quality值越小，所绘制出的图像越模糊
			        var base64 = canvas.toDataURL('image/jpeg', quality);
			        // 回调函数返回base64的值
			        callback(base64);
			    }
			}catch(e){
				comm.alertMsg(e);
			}
		},
		//dataURL转换为File对象
		dataURLtoFile(dataurl, filename) {
			try{
			    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
			        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
			    while(n--){
			        u8arr[n] = bstr.charCodeAt(n);
			    }
			    return new File([u8arr], filename, {type:mime});
		    }catch(e){
				comm.alertMsg(e);
			}
		},
		//点击申请退款验证输入的退款信息是否正确
		testForm(){
			let _self = this ;
			console.log(_self.phone)
			if(comm.rule.empty(_self.name,'退款人姓名不能为空') && comm.rule.empty(_self.phone,'退款人电话不能为空') && comm.rule.phone(_self.phone) && comm.rule.phone(_self.logisticsNum , '物流单号不能为空')){
				
			}
		}
	}
}
</script>

<style scoped>
/*退款提示*/
.tip-box{
	padding: 14px 29px 17px 90px;
	position: relative;
}
.tip-box .tip{
	position: absolute;
	left: 33px;
	width: 36px;
	display: block;
}
.tip-box .tip:after,.tip-box .tip:before{
	content: '';
	display: block;
	width: 5px;
	height: 5px;
	background: #fff;
	border-radius: 50%;
	position: absolute;
}
.tip-box .tip:after{
	top: 6px;
	right: -11px;
}
.tip-box .tip:before{
	bottom: 6px;
	right: -11px;
}
/*退款商品*/
.title{
	line-height: 42px;
}
.info-box>div{
	position: relative;
	padding-left: 90px;
	padding-bottom: 18px;
}
.info-box>div img{
	position: absolute;
	left: 0;
	width: 84px;
	height: 84px;
}
.info-box>div p{
	line-height: 25px;
	margin-bottom: 14px;
	height: 50px;
}

/*请求退款相关信息*/
.list{
	line-height: 40px;
	font-size: 15px;
}
.list p input{
	padding: 10px 0;
	text-align: right;
	width: 70%;
	height: 20px;
	line-height: 20px;
}
textarea{
	padding: 20px 0;
	text-align: right;
	width: 75%;
}
.reason,.express{
	padding-right: 12px;
}
.express+.right-arrow{
	right: 0;
}


/*上传凭证*/
.upload{
	padding-bottom: 20px;
	padding-top: 10px;
}
.upload-box{
	border: 1px solid #d4d8e5;
	width: 104px;
	height: 104px;
	position: relative;
	text-align: center;
	margin-right: 8px;
	margin-bottom: 8px;
}
.upload-box img{
	position: absolute;
	left: 0;
	top: 0;
}
.upload-box input{
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	opacity: .5;
}
.upload-box .ico-add{
	display: block;
	width: 100%;
	height: 24px;
	background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAA9BAMAAADsTHzaAAAAG1BMVEUAAACapMGapMGapMGapMGapMGapMGapMGapMGICMXtAAAACXRSTlMAgD9wKGB4HlfEbZenAAAARUlEQVQ4y2NABW1pSQz4QKCg0Kj8qPyoPNHyLC7IwFBQAoXvwFAoiA8I0Fy+2BgZJAqKofANBjz8RuVH5UeOvJOSOqoAAElCMXXlfNG7AAAAAElFTkSuQmCC) no-repeat center;
	background-size: auto 100%; 
	margin: 37px auto 12px;
}


/*底部按钮*/
.btn-box{
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 3;
}
.flex-box{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    text-align: center;
    line-height: 55px;
}
.btn-box .btn-phone{
	flex: 1;
}
.btn-box .btn-apply{
	flex: 2;
}
.btn-box .ico-phone{
	display: inline-block;
	width: 18px;
	height: 18px;
	background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAQlBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////8IX9KGAAAAFXRSTlMA9sewmEo559BjC9u7oIArjW9YHBOPNQxzAAAAuklEQVQ4y4WTWxKDIAwAE1B5iOIr979qVWxahAz7yw5DMgucbJbGAWQ6OsEeJGa6QemOnh6MrwuBvsx1YWTB1AVDzFEVFJ8jVFlYcI0pJhDAdK7lRfKQAjEJCkR0MjZR2DFNuYvGSjcWRGxrkNhaBbjH6ERjaRq6aSjKXhoDmjVrzNvHsFecPd4JZZ0eXEZwSzUBH6gk/w1TKYzvpRdAzvCLXKpgRvoDIxQck/RGZu+QGhF5p5FQXXv6APRbGftxhd73AAAAAElFTkSuQmCC) no-repeat center;
	background-size: cover;
	vertical-align: middle;
	margin-right: 3px;
}



/*退款原因弹窗*/
.popup-con{
	line-height: 32px;
}
.radio-box{
	display: block;
}
.radio-box span:before{
	left: 94%;
}
.radio-box span{
	padding-left: 0;
}


.mb-6{
	border-bottom: 6px solid #f2f2f2 ;
}
.pd-lr-17{
	padding-left: 17px;
	padding-right: 17px;
}
</style>