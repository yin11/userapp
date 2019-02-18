<template>
	<div>
		<!--标题栏-->
		<header class="bg-f " :style="'padding-top:'+status_bar_height+'px'">
			<h3 class="border-buttom">职员详情</h3>
			<span class="ico-retrun" @click="back"><i class="left-arrow"></i></span>
			<router-link class="icon fc-r" tag="i" :to="{path:'/addStaff',query:{id:id}}">编辑</router-link>
		</header>
		<div :style="'height:'+(status_bar_height+44)+'px'"></div>
		<!---->
		<div class="bg-f mb-5 ">
			<div class="head-box relative">
				<div class="img-box">
					<img :src="staffInfo.staffImage" width="100%" height="100%"  v-if="staffInfo.staffImage"/>
					<img src="@/assets/img/head.png" width="100%" v-else/>
				</div>
				<p class="fz20">{{staffInfo.realName}}<i :class="staffInfo.gender == 1 ? 'ico-man' : 'ico-girl' "></i></p>
				<p class="fz12 fc-c">ID : {{staffInfo.userName}}</p>
			</div>
			<div class="flex-box fz10 pd-tb-5">
				<div class="item pd-tb-5">
					<p class="fw-6 fz17">{{zstAmounts || 0}}</p>
					<p>账户余额</p>
				</div>
				<div class="item border-right pd-tb-5">
					<p class="fw-6 fz17">{{totalmoney || 0}}</p>
					<p>话呗余额</p>
				</div>
				<div class="item pd-tb-5">
					<p class="fw-6 fz17">{{vipCount || 0}}</p>
					<p>推广会员</p>
				</div>
				<div class="item pd-tb-5">
					<p class="fw-6 fz17">{{biShopCount || 0}}</p>
					<p>推广商家</p>
				</div>
			</div>
		</div>
		<!---->
		<ul class="list bg-f">
			<li class="border-buttom clearfix">
				<span class="fl-l">电话</span>
				<span class="fl-r fc-c">{{staffInfo.phone}}</span>
			</li>
			<li class="border-buttom clearfix">
				<span class="fl-l">生日</span>
				<span class="fl-r fc-c">{{staffInfo.birthDay}}</span>
			</li>
			<li class="border-buttom clearfix">
				<span class="fl-l">录入时间</span>
				<span class="fl-r fc-c">{{staffInfo.createTime}}</span>
			</li>
			<li class="border-buttom clearfix">
				<span class="fl-l">VIP</span>
				<span class="fl-r fc-c">是</span>
			</li>
			<li class="border-buttom clearfix">
				<span class="fl-l">到期时间</span>
				<span class="fl-r fc-c">{{memberExpiryDate || ''}}</span>
			</li>
			<li class="border-buttom clearfix">
				<span class="fl-l">状态</span>
				<span class="fl-r fc-c">{{staffInfo.promoteState == 0 ? '注销' : '激活'}}</span>
			</li>
			<li class="border-buttom clearfix">
				<span class="fl-l">备注信息</span>
				<span class="fl-r fc-c remark">{{staffInfo.remark}}</span>
			</li>
		</ul>
		<!---->
		<!--<div style="height: 52px;"></div>-->
		<!--<div v-show="EditState">
			<button type="button" class="btn" v-if="staffInfo.promoteState == 0" @click="setStaffState">激活</button>
			<button type="button" class="btn bg-c" v-else-if="staffInfo.promoteState == 1" @click="setStaffState">注销</button>
		</div>-->
	</div>
</template>

<script>
import * as comm from '@/assets/js/comm'
import * as getData from '@/assets/js/getData'	
export default {
	data () {
		return {
			status_bar_height : 0 ,
      		staffInfo : {} ,
      		id : this.$route.query.id ,
      		zstAmounts : '' , //账户余额
      		totalmoney : '' , //话呗余额
      		biShopCount : '' , //推广商家
      		vipCount : '' , //推广会员
      		memberExpiryDate : '' , //会员到期时间
    	}
	},
	mounted(){
    	
	},
	created: function(){
		let _self = this ;
		comm.status_bar_height ? _self.status_bar_height = Number(comm.status_bar_height) :  _self.status_bar_height = Number(comm.getQueryString('status_bar_height')) ;
		_self.getStaffDetail();
	},
	methods: {
		/*返回上一页*/
		back(){
	        this.$router.go(-1);//返回上一层
	    },
	    //点击更改，使得页面可编辑
	    setEditState(){
	    	this.EditState = true ;
	    },
	    //获取职员详情
	    getStaffDetail(){
	    	let _self = this ;
	   		let _data ={
	   			token : comm.TOKEN ,
	   			id : _self.id //职员id
	   		};
	    	getData.getStaffDetail(_data).then(res=>{
	    		let _data = res.data ;
				if(_data.state == 1){
					_self.memberExpiryDate = _data.data.memberExpiryDate ;
					_self.zstAmounts = _data.data.zstAmounts ; //账户余额
		      		_self.totalmoney = _data.data.totalmoney ; //话呗余额
		      		_self.biShopCount = _data.data.biShopCount ; //推广商家
		      		_self.vipCount = _data.data.vipCount ; //推广会员
					_self.staffInfo = _data.data.staff ;
					_self.staffInfo.createTime = comm.timestampToTime(_data.data.staff.createTime);
				}else{
					comm.toast(decodeURIComponent(_data.msg));
				}
	    	}).catch(function (error) {
			    comm.alertMsg(error);
			});
	    },
	    //注销或者激活该职员
	    setStaffState(){
	    	let _self = this ;
	   		let _data = {
	   			token : comm.TOKEN ,
	   			id : _self.id ,//职员id
	   			state : _self.staffInfo.state , //0离职  1在职
 	   			promoteState : _self.staffInfo.promoteState, //是否有推广功能  1是  0否
	   		}
	   		getData.setStaffState(_data).then(res=>{
	    		let _data = res.data ;
				if(_data.state == 1){
					_self.getStaffDetail();//注销或者激活后，再次获取职员详情回填
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
header .icon{
	line-height: 44px;
}
.head-box{
	padding: 20px 10px 20px 138px;
}
.head-box .fz20{
	line-height: 2;
}	
.head-box .img-box{
	position: absolute;
	left: 35px;
	width: 65px;
	height: 65px;
	border-radius: 50%;
	overflow: hidden;
}
.head-box i{
	margin-left: 10px;
}

	
	
.list{
	padding-left: 13px;
	line-height: 56px;
}
.list li{
	padding-right: 15px;
}
.btn{
	width: 100%;
	margin: 0;
	position: fixed;
	left: 0;
	bottom: 0;
	border-radius: 0;
	line-height: 50px;
	font-size: 19px;
	z-index: 10;
}
.btn.bg-c{
	background: #D8D8D8;
}
.remark{
	width: 70%;
	line-height: 1.2;
	text-align: right;
    padding: 16px 0;
}
</style>
