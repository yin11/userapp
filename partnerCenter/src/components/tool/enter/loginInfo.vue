<template>
	<div>
		<!--导航头-->
		<v-subnav></v-subnav>
		<!---->
		<!--商户登录信息-->
		<div class="info-box bg-f">
			<h4 class="fz18 title" @click="aa">商户登录信息</h4>
			<ul class="fz14">
				<li class="border-buttom">
					<span>商家登入账户：</span>
					<input type="tel" maxlength="11" placeholder="只能设置手机号码" v-model="userName" @blur="testUserName"/>
				</li>
				<li class="border-buttom code-box">
					<span>验证码：</span>
					<input type="number" maxlength="6" placeholder="请输入验证码" v-model="code" @blur="testCode"/>
					<button type="button" class="btn-code btn " @click="sendMess" v-show="!computedTime">获取验证码</button>
					<button type="button" class="btn-code btn bg-c" v-show="computedTime">倒计时（{{computedTime}}）</button>
				</li>
				<li class="border-buttom">
					<span>商家登入密码：</span>
					<input type="password" maxlength="10" placeholder="设置商家登录密码（6-10位）" v-model="password" @blur="testPassWord"/>
				</li>
				<li class="border-buttom">
					<span>确认登录密码：</span>
					<input type="password"  maxlength="10" placeholder="确认商家登录密码" v-model="repassword" @blur="testRePassWord"/>
				</li>
				<li class="">
					<span>联系电话：</span>
					<input type="tel" maxlength="11" placeholder="设置商家联系手机号码" v-model="contactPhone" @blur="testContactPhone"/>
				</li>
			</ul>
		</div>
		<!--下一步-->
		<div>
			<button type="button" v-if="next != '1-1-1-1-1'" class="btn btn-layer fz18">下一步</button>
			<button type="button" class="btn fz18" @click="subFormate" :disabled="disabled" v-else>下一步</button>
			<!--<router-link to='/aptitude' tag='button' class="btn bg-blue fz18" v-else >下一步</router-link>-->
		</div>
	</div>
</template>

<script>
import subnav from './subnav'
import * as comm from '@/assets/js/comm'
import * as getData from '@/assets/js/getData'	
import axios from 'axios'; 
import md5 from 'js-md5';
import Qs from 'qs'
export default {
	data () {
		return {
      		next : '0-0-0-0-0' ,
     		userName : '' ,
     		code :'' ,
     		password :'' ,
     		repassword : '' ,
     		contactPhone : '' ,
     		computedTime : 0
    	}
	},
	components : {
		'v-subnav':subnav ,
	},
	mounted(){
    	
	},
	created: function(){
		
	},
	methods: {
		/*返回上一页*/
		back(){
	        this.$router.go(-1);//返回上一层
	    },
	    aa(){
	    	console.log(this.next)
	    },
	    testUserName(){
			let _self  = this ;
			if(comm.rule.empty(_self.userName,'商家登录账号不能为空') ){
				_self.next = comm.replaceNext(_self.next , '1' , 0);
				comm.USERINFO.userName = _self.userName ;
				//comm.setStore('userinfo', comm.USERINFO);
			}else{
				_self.next = comm.replaceNext(_self.next , '0' , 0);
			}
		},
		testCode(){//验证验证码是否填写正确
			let _self  = this ;
			if(comm.rule.empty(_self.code,'验证码不能为空') ){
				_self.next = comm.replaceNext(_self.next , '1' , 8);
				comm.USERINFO.smsSecurityCode = _self.code ;
				//comm.setStore('userinfo', comm.USERINFO);
			}else{
				_self.next = comm.replaceNext(_self.next , '0' , 8);
			}
		},
		testPassWord(){
			let _self  = this ;
			if(comm.rule.empty(_self.password,'商家登录密码不能为空') && comm.rule.testLength(_self.password,6) ){
				_self.next = comm.replaceNext(_self.next , '1' , 2);
				comm.USERINFO.password = _self.password ;
				//comm.setStore('userinfo', comm.USERINFO);
			}else{
				_self.next = comm.replaceNext(_self.next , '0' , 2);
			}
		},
		testRePassWord(){
			let _self  = this ;
			if(comm.rule.empty(_self.repassword,'确认商家登录密码不能为空') ){
				if(_self.password.length == _self.repassword.length){
					if(_self.password == _self.repassword){
					_self.next = comm.replaceNext(_self.next , '1' , 4);
						comm.USERINFO.repassword = _self.repassword ;
						//comm.setStore('userinfo', comm.USERINFO);
					}else{
						comm.toast('输入内容和登入密码不同');			
						_self.next = comm.replaceNext(_self.next , '0' , 4);
					}
				}else{
					_self.next = comm.replaceNext(_self.next , '0' , 4);
				}
			}else{
				_self.next = comm.replaceNext(_self.next , '0' , 4);
			}
		},
		testContactPhone(){
			let _self  = this ;
			if(comm.rule.empty(_self.contactPhone,'商家联系电话不能为空') && comm.rule.phone(_self.contactPhone)){
				_self.next = comm.replaceNext(_self.next , '1' , 6);
				comm.USERINFO.contactPhone = _self.contactPhone ;
				//comm.setStore('userinfo', comm.USERINFO);
			}else{
				_self.next = comm.replaceNext(_self.next , '0' , 6);
			}
		},
		/*获取验证码*/
	  	sendMess(){
	  		let self = this ;
	  		if(comm.rule.phone(this.userName)){
	  			this.computedTime = 60;
	  			let _data = {
	  				userName : self.userName ,
	  				phone : self.userName ,
	  				type : 11 , //  11创业合伙人入住
	  				smsType :1
	  			};
	  			let _time = comm.getNowFormatDate() ;
	  			let _sec = md5('1hehe^_^haha!ysyhl9t@flzx3000c' + _time + _data.phone);
	  			_data = Qs.stringify(_data);
	  			axios.post( '/api/voip/v2/smsSecurityCode',
	                _data,
	                {
	                headers: {
	                    'Content-Type': 'application/x-www-form-urlencoded' ,
	                    'sec':_sec
	                }
	              }
	            ).then(function(res){
		    		let _data = res.data ;
		    		if(_data.state == 1){
						 let _userinfo = JSON.parse(comm.getStore('userinfo')) ;
						 _userinfo.phone = self.phone ;
						 comm.setStore('userinfo', _userinfo);
					}else{
						comm.toast(decodeURIComponent(_data.msg))
					}
		        })
		        .catch(function(error){
		           comm.alertMsg(error);
		        });
	            //倒计时
	            this.timer = setInterval(() => {
	              this.computedTime --;
	              if (this.computedTime == 0) {
	                clearInterval(this.timer)
	              }
	            }, 1000);
	  		}
        },
        //跳转第三部
        subFormate(){
        	let _self  = this ;
			if(_self.next == '1-1-1-1-1'){
				comm.setStore('userinfo', comm.USERINFO);
				_self.$router.push({path:'/address'}); 
			}
        }
   }
}	
</script>

<style scoped>
	@import '../../../assets/css/enter.css';
	.btn-code{
    	position: absolute;
	    right: 15px;
	    top: 12px;
	    width: 100px;
        margin: 0;
        height: 35px;
        line-height: 35px;
	}
</style>