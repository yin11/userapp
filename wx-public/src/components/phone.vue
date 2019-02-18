<template>
	<div>
		<ul class="form-box">
			<li class="border-buttom phone">
				<input type="number" maxlength="11" placeholder="请输入手机号" v-model="phone"/>
			</li>
			<li class="border-buttom pass">
				<input :type="  type ? 'text' : 'password' " maxlength="18" placeholder="请输入6~18位新密码" v-model="pass"/>
				<i class="ico-eye" :class=" type ? 'on' : ''" @click="showPass"></i>
			</li>
			<li class="border-buttom code">
				<input type="number" placeholder="请输入验证码" v-model="code"/>
				<button class="code-btn" @click="sendMess" v-show="!computedTime">获取验证码</button>
				<button class="code-btn" v-show="computedTime">倒计时（{{computedTime}}）</button>
			</li>
		</ul>
		<button class="btn" @click="postBingPhone">确定</button>
		<p class="fz10">
			<input id="checkbox" checked="checked" type="checkbox"/><i class="chexkbox"></i>
			<label for="checkbox">我已阅读并将遵守<a class="fc-r" href="https://zst.tenzhao.com/api/protocol.html">《用户协议》</a></label>
		</p>
	</div>
</template>

<script>
import fetch from '../assets/js/fetch'
import md5 from 'js-md5'
import * as comm from '../assets/js/comm'
export default {
	name: 'phone',
	data(){
	  	return {
	  		phone:"" ,
	  		code :'' ,
	  		token: comm.getStore('accessToken')  ,
	  		type : false ,
	  		computedTime : 0
	  	}
	},
	methods:{
	  	/*绑定手机号*/
	  	postBingPhone(){
	  		let _data = {
	  			phone : this.phone ,
	  			validateCode : this.code ,
	  			pwd : md5(this.pass) ,
	  			token : this.token
	  		}
	  		if (comm.rule.phone(this.phone) && comm.rule.empty(this.pass,'密码不能为空') && comm.rule.empty(this.code,'验证码不能为空')) {
	  			fetch({
			        url: '/api/voip/user/bindphone',
			        method: 'post',
			        params: _data
		    	}).then((res)=>{
		    		let _data = res.data ;
		    		if(_data.state == 1){
						 console.log(_data.data)
						 this.$router.replace({path:'/'})
					}else{
						comm.toast(decodeURIComponent(_data.msg))
					}
		    	}).catch(function (error) {
				    console.log(error);
			  	});
	  		}
	  		
	  	},
	  	/*更换是否显示密码*/
	  	showPass(){
	  		this.type = !this.type ;
	  	},
	  	/*获取验证码*/
	  	sendMess(){
	  		let self = this ;
	  		if(comm.rule.phone(this.phone)){
	  			this.computedTime = 60;
	  			let _data = {
	  				phone : this.phone ,
	  				type : 2 ,
	  				smsType :1
	  			}
	  			fetch({
			        url: '/api/voip/v2/smsSecurityCode',
			        method: 'post',
			        params: _data
		    	}).then((res)=>{
		    		let _data = res.data ;
		    		if(_data.state == 1){
						 let _userinfo = JSON.parse(comm.getStore('userinfo')) ;
						 _userinfo.phone = self.phone ;
						 comm.setStore('userinfo', _userinfo);
					}else{
						comm.toast(decodeURIComponent(_data.msg))
					}
		    	}).catch(function (error) {
				    console.log(error);
			  	});
	            //倒计时
	            this.timer = setInterval(() => {
	              this.computedTime --;
	              if (this.computedTime == 0) {
	                clearInterval(this.timer)
	              }
	            }, 1000);
	  		}
        }
	},
	created: function() {
	   
	},
	mounted(){
      	
	}
}
</script>

<style scoped>
	.form-box{
		margin-bottom: 3rem;
	}
	.form-box li{
		padding: .8rem 4.5rem .8rem 2rem;
	}
	.phone{
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAS1BMVEUAAAC/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7/BwcG/v7+/v7+/v7+/v7/AwMDDw8O+vr6/v7+ULRawAAAAGHRSTlMAwfAPQKDQgGBP4DAgjq9vFtmX97dYBzkuJkdFAAACZElEQVRYw+1W27biIAwlUC6V3qxa+f8vnQDSzJEC7Zo1b2c/oZBkZxPSsF/8Nwwz3BwCpBHsOjpwf0EOV6N/zG+Q/GhkAWo6Sabj3ni04Yfopf+pBIOzZAye4zMjCOn/sZEN1y37Psb7AcuRkhgMONok5GdlropCw6BO0wOegCNd0a9OCap6AjdxyAzTF0liyYrA4umPdyRS2EXuijeYEsgxIIW4GkuH4p4p7U0psOC4KmcgKvUxxpVOqxwVckzsmxaVLhRBPNP0jkSHkoa6ekNULN0VB2RGWvclB7KWgmK7inM1zeJmKwXGHa9VuWw6kCG51p5wzrWi5BBUZKb8IAXPb5iEmygD1LB4DFqu+/Cyi0QLpaAwOXI11luiOVCQoqrUc4pJ5BwEoL2NS5X3kzyYm4YfrG47rU6lZYODk12KHpo574IncG17hOEOwWHUWkL8yK1a64m76KoNobkrIErRxnu8uwKmNgWbWXNY9QTKRUDdBSqVcIP7I62f3qob/YVUC8nE4Hdp7MI8FvtaY2j1Iv/KFsirYG2Wb1VfYQOGWBZFMeeda45uwr2HoYHh4NhUv+a3j7zu30f3zWF7+jsqPZM9skwesjft7ecT44+kQSZ7Qz1rod/v0Hy92rFtT/1ibxH0aF+Zfc1Dl5rXlP5d9jbVxooVun2+Y86SgMBOYrunYBAVjb74ws7CYuQlTj2pU6vsAutJEIVo90YCGzuPBWtafARVNMFdoZAY8/C52x7e4RUMGDm9HhNq4MmuQX1knAN3eUVCGlFoMFW+Hq7hnYowDHwPx1kZ9VEGwLFf/Dv+AGB6OTXzkybzAAAAAElFTkSuQmCC) no-repeat .5rem center ;
		background-size: 1rem auto;
	}
	.pass{
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAM1BMVEUAAAC/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v78/edZTAAAAEHRSTlMAwIBA8BCgYNAwILBw31CQpaCpEwAAAQxJREFUWMPtlsuOgzAMRYntPHj2/P/XTqlG6oJJ6gyLthJng4jlkzgS4g4XH49qzqr/bI7LzC/zEvvbxdgp5fEw6VSMBpZyfLhy2t/Gnv4MpOn5PiUgd/QfN1TrMIxQpsNiAecU0bDpuDwZ5rtJqWylIM4DpL8ryXeE5TnAcYjFIQikWikRHBPAVqtt8HoGhXoR1CGwetEcAmnNGZBL0BbITmCVKitB7tQsuKkKSnBQGgIdHOgl+D6BnhQEwjkBcAneLjDsnGCUcfj2b6FHYGwewYY5o0U9ZjjDTXfQieaJMKURtQTm2G6PM0hrPNbcDMEr7Yu6QeMHV7hzG5roTJNZX+c8zVIhaxwuPpEfPTYV1GD2Yk0AAAAASUVORK5CYII=) no-repeat .5rem center ;
		background-size: 1rem auto;
	}
	.code{
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAM1BMVEUAAAC/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v78/edZTAAAAEHRSTlMAQIAQ0PAwYKAgwOCQUHCwaydelwAAAg9JREFUWMPtV9lihCAMFDnCIZr//9rW0t1BsorS184byAy5CDhdQc+J2dA0CpX4B8aN8Wd+Yx6gO1N2j2NG6NnuPJvfSj482d0Xy6OGL/clNJlCsGsbTU+6xw608S+iO3pUYJasz7hq9oZf8K6xyyMnaZtVq0KbZSCt+sMGnmvEXMvHmr24s+hknxjw+LL12QgS/FzfWft1LLu7Nb763WP7Gq/fg01PjxB2Z1xV9Gp6iOWbRH8RIJyxMQH1LzAq4NYwJoCSs+4PAv7nGA4JgM92SAB8nocEwPeDQdSm8Jd+GsNM53w61MF6FMCH7ZKPdeqTQISjJ/yugFBw4AN0JpBFy3V7/0MJgvRRADeh4MuWpmsBkXA64cNVC6uR0lZBgX9EORUFAYNWgc4eOa4uqskWc8RVRS++/nSwOR92zJ8SL/n1FpjOiDoULvl6n58ACz2hEPEBIBl3jKEgq7qu19IdkQfb7BTsOT/Ag8qEpc1UqufEchKSLJKtxExlsLitYVQXCBmgLZzoQR0ihlq4fb0YdLO2tqy7+YpPk4ROqLorqFNTnb2j4C6CRdxX0AZrHiqAb8Pl241NuOD3cuVF/5L9nXpPCGS5QbYdPuLAMUjzF+7z0cft2gqX6Tu1Gsrtlqimp0d/f/Px5yEvtkwsus+FEQUxmndzVdMD5MQAPHoC2hjY8jSAsG5m92KhC9+/AIFKNgeFofF4AAAAAElFTkSuQmCC) no-repeat .5rem center;
		background-size: 1rem auto;
	}
	.form-box input{
		width: 100%;
		font-size: .75rem;
	}
	.code-btn{
		border: 1px solid #F7094D;
		color: #F7094D;
		padding: 6px .25rem;
		border-radius: 4px;
		position: absolute;
		right: .5rem;
	    top: 12px;
	}
	.fz10{
		font-size: 10px;
		text-align: center;
		line-height: 1;
	}
	.chexkbox {
		display: inline-block;
		width: 12px;
		height: 12px;
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAANlBMVEUAAAARltsSltoQldsQj98Ql9sRltsQldoRldoSldsQl98SldwRltsQltwRldsRltoQltsSltsGb0GeAAAAEXRSTlMA8KBgEEDAMNCAIJCwUODfcPZN+asAAAFrSURBVFjD7ZfbksMgCIaDIkoSm/L+L7uzszO1jYq43va7/wnh7PZFYfcHJfmFTs44qY7HJZ+Qn7DhL2nhdrO8x2kwsZMoAA8/D6KTdCecDIHQl+MpFnxXn0SWLDixkpv6Q8xAbOizTJCwDgDIDIcSABv3ZAaZJN0MkMySFQdM0HwEEvMhhfdUojV1SQpuK3iT/uYobAVDE8FevlNnEkzFG+UTLiPUpEfo5iGYmqdq9utlgGVAaGfabMB3EhWaSQBGrvVRbSiq4v246RF0A9XYxVKzz60EsGfANf45w1vBOtENcCtqeL70XiwG6iJ7gji1zpRC+lPurE7Lh1rKpVmTdCC9mQhHs4YHAynhYFSE0UBJqDYqjLcKRG3dOMNQhSR94upYX10sYXG10epyjcvrvSJMHhg1vHDizIYhbG1o5cyz+wB+8dSNa8c24eq5PyaXrfLvN0tS5DbicXfj9Dj97GMiEJFEjsP2pc8PxhSYTgGzXkEAAAAASUVORK5CYII=);
		background-size: cover;
		vertical-align: middle;
		opacity: .5;
	}
	.ico-eye{
		display: block;
		width: 1rem;
		height: 1rem;
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAM1BMVEUAAAC/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v78/edZTAAAAEHRSTlMAEMBg0OCggEAg8LBQkDBweN7k7QAAAWFJREFUWMPtld2OhCAMhQUKFP+m7/+0K6x6goQRkr3ZhO+OMeejU6VMg8FgMPhr2BvVl1i9mYATka0vLyJ07xkkEjryapaD9V4mgesQfFKC77XuLcHKwYy2cRIsnQX4CZBETGN+l7MAYH5/Cm0dJBTw6AKpFoGTiFXFe4GhIS9cfhnJsL/VrwV/IGOTxLx+7589N6qXJouqb+9F0ICaQGZfURgrF6aeTwrHxfOwIQ7DMw+sMzvC60YCYCjylHtIRyg3exjKvJqY5BuzP1oBQ5k/8JUs3lBh2JBPtjoWR0cwAMKdx4qczUtftETWzOCwwjFw15eu2PhksR8Ol1hnx9fe8wV5lT3RVwhmGNCEfaEt5tFCUwhQwglr7SvjFgVA0Dw5UUApYDSubdxC0F6CwbDIBBg6L1fYggIeAtRnXwV+qgkMhlGFQPlg/VxCbGBfpiZzfgU8boudoW+Dj8Rg8A/4ActHJ0P5Nlm6AAAAAElFTkSuQmCC) no-repeat;
		background-size: cover;
	    position: absolute;
	    right: 1rem;
	    top: 1rem;
	}
	.ico-eye.on{
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAM1BMVEUAAAC/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v78/edZTAAAAEHRSTlMAPzDwENDAcKAgf2Cv4JBQHGOc1wAAATZJREFUWMPtlUmWgzAMRJHnCdD9T9v9gBdjyQNhG/9lQhWyq6Isk8nkJwDYQ4gA6oXWx7TiB2mC+EatokaG3PxTeZBYx8ATPZETi+FJYMU+QfVfj0N0ZwhlyMAWhABLPpWxpRdr47yeWNiGXrafsljgHujJnJE4DPVpIThyioFesrCUxN6EinR3u2wTYrruciNZlGkmLDk7u+PBfprRPih+yZliank+hFibMptzAyjnQUr+aRmklHPFuoFhEWXKwUTdwDUyyPdm7m8CJOh7imvV3B/G2tdixFV1eoTSX/E4Z1mReA+4A69y4nrq0C27ZXqG523OBN5CjjKtHQzkm6QebkQd4J9AQ7bDnTxequ/XsgzLAO+wg/PLGO8G8jHKamRoq777e3f6JnbRLy8QcOCXyWTyC/wB2WQ+xAgHBmkAAAAASUVORK5CYII=) no-repeat center;
		background-size: cover;
	}
	input[type='checkbox']{
		opacity: 0;
	}
	input:checked~.chexkbox{
		opacity: 1;
	}
	.btn{
		font-size: .8rem;
	}
</style>