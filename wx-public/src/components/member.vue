<template>
  <div>
  	<div>
  		<img src="../assets/img/VIP.png" width="100%" class="user-bg"/>
  		<div class="user-box fc-f">
  			<img :src="userinfo.ico" class="user-logo" v-if="userinfo.ico "/>
  			<img src="../assets/img/head.png" class="user-logo" v-else/>
  			<p class="user-id">ID:{{userinfo.username}}</p>
  		</div>
  	</div>
  	<ul class="list-box">
  		<li class='clearfix border-buttom' v-if="userinfo.phone">
  			<div class="fl-l">
					<i class="ico-phone icon"></i>
					<span>手机号</span>
				</div>
				<div class="fl-r">
					<span>{{userinfo.phone}}</span>
				</div>
  		</li>
			<router-link to='/Phone' tag='li' class='clearfix border-buttom' v-else>
				<div class="fl-l">
					<i class="ico-phone icon"></i>
					<span>手机号</span>
				</div>
				<div class="fl-r">
					<span class="bind-phone" >点击绑定手机号</span>
				</div>
			</router-link>
			<router-link :to="{path:'/List',query: {totalmoney: userinfo.totalmoney}}" tag='li' class='clearfix border-buttom'>
				<div class="fl-l">
					<i class="ico-list icon"></i>
					<span>话币明细</span>
				</div>
				<div class="fl-r">{{userinfo.totalmoney}}</div>
			</router-link>
			<router-link to='/Recharge' tag='li' class='clearfix border-buttom'>
				<div class="fl-l">
					<i class="ico-cz icon"></i>
					<span>充值</span>
				</div>
				<div class="fl-r">
					助商通卡充值
				</div>
			</router-link>
			<router-link to='/Card' tag='li' class='clearfix border-buttom'>
				<div class="fl-l">
					<i class="ico-card icon"></i>
					<span>电子会员卡</span>
				</div>
				<div class="fl-r">
					&nbsp;					  
				</div>
			</router-link>
  	</ul>
  </div>
</template>

<script>
import fetch from '../assets/js/fetch'
import * as comm from '../assets/js/comm'
export default {
  name: 'member',
  data(){
	  return{
	  	userinfo : {} ,
	  	token : ''
	  }
	},
	created: function(){
		//console.log(comm.getQueryString('wxServiceNumOpenId'))
		if(comm.getStore('accessToken')){
			this.userinfo = JSON.parse(comm.getStore('userinfo')) ;
			console.log(JSON.parse(comm.getStore('userinfo')))
			return ;
		}else{
			this.getUserInfo();
		}
	},
	methods: {
	  getUserInfo() {
	  	let _self = this ;
	  	let data = {
	  		wxServiceNumOpenId: comm.getQueryString('wxServiceNumOpenId'),
				noLoginType:1,
				version:'3.2.04' ,
				device:'oppor9m'
	  	};
			fetch({
        url: '/api/voip/login',
        method: 'post',
        params: data
    	}).then((res)=>{
    		let _data = res.data ;
    		if(_data.state == 1){
    			_self.userinfo = _data.userinfo ;
    			_self.userinfo.totalmoney = comm.numberToFixed(_self.userinfo.totalmoney) ;
    			_self.token = _data.token ;
    			comm.setStore('accessToken', _data.token);
    			comm.setStore('userinfo', _data.userinfo);
    			/*comm.setStore('username', _data.userinfo.username);
    			comm.setStore('nick', _data.userinfo.nick); 
    			comm.setStore('userico', _data.userinfo.ico);
    			comm.setStore('totalmoney', _data.userinfo.totalmoney);*/
    		}else{
    			comm.toast(decodeURIComponent(_data.msg));
    		}
    	}).catch(function (error) {
		    console.log(error);
		  });
    }
	},
}
</script>

<style scoped>
	.user-bg {
		position: absolute;
		left: 0;
		top: 0;
		z-index: -1;
	}
	.user-box{
		text-align: center;
		padding: 2rem 0 1.3rem 0 ;
	}
	.user-logo{
		width: 4.15rem;
		border-radius: 50%;
		border: 3px solid rgba(255,255,255,.5);
	}
	.user-id{
		font-size: 12px;
		line-height: 1.75;
	}
	.list-box{
		padding-left: .625rem;
		font-size: 15px;
		line-height: 53px;
	}
	.icon{
		display: inline-block;
		width: 1.25rem;
		height: 1.25rem;
		margin-right: .3rem;
		vertical-align: middle;
	}
	.ico-phone{
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAsVBMVEUAAAD/yDH/yDL/yDL/1D7/1D7/uyb/uiT/10D/uST/uST/1kD/zjj/uCP/10D/vCb/1D3/vCf/0z3/wy7/zDb/yzX/xjD/vyr/xTD/1T//uiX/1T7/xTD/10L/0z7/uyf/zzn/wCv/xzL/uCL/yDL/zTb/0Tv/vyn/uyT/xC3/1j7/////9df/8sn/02P/7rz/9t7/2Gb/8ML/+/H/2HH//vj/56P/zlz/35P/3YL/yUjjTE4SAAAAJHRSTlMAHggYlaWll+/v2di7u7pXVjEw8e7c27uTf3xgYPnGxrCwf18GjcYbAAACDklEQVRIx43WaXOCMBCA4Y2geN9ar95ADBFtvXr8/x9WNildA4n2xZHRyTMb80WgHFv63Vb9/r7e6vpLBjdj81Zi1JpfV8NqYqk6dAKPQBF5dtGvJ87qfQuo+HGcJLG6bPmVkmjHOifsVgriIdaRK7GHin0GRfOsc/z4SuR8Ev34ZomqnwtvHGH/cHUPdNWIugGrWgyjy5JUYpv9Xt1PX6YZKvJkkLNUnd+PB6kyyRMKFhlt5GaXlabpHu8nTSiWkZcoCrOLyHt0USoLP3CekQkuVyq0E4xcC4CFukhBJyHHYKUAOUXCEqGWMAvNkNBGLcSHdpnQRm2kDdMS2dIHJHoiNYFRGIpQFAiVyvxgcjgGgcuVEg6iIhiBwMg5CTkYCepviigRagxTYYaENmohE7grEz0QoY20YcY5F4IbJE9N0fOoGaw4Rk4RSk8RF24FLFuML52F6Ds5BtDEpeQ28psLaicLJzoFgAWnFPn82GYdj1vsTRPqJSOsSMyKhEHWs43sv48nqcIN04k+AzYwyF6qvjg/5ESnyQBUtTWnPqTu/DtuZ5xoDXReY43lZveGHQ74vvnMFys38uC33prirtD24K+AiMvhdwFQlY4hHO7O/Bt7LIKyeyRBc5zRDMME66sFJKheww0aPbDm1Vyi5oGrQc0KBnAttmia65uL/zySvQadZiPbf7MTvFrW/wB7yiouCHaz2AAAAABJRU5ErkJggg==);
		background-size: cover;
	}
	.ico-list{
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAqFBMVEUAAAD/gJf/gZn/gZn/kqn/bof/b4j/k6n/k6n/boj/f5f/l6z/bYb/lqz/gZn/kaf/cYv/cYr/cov/kKf/gZn/e5P/hp3/iJ//jKP/do7/k6n/cIj/f5b/k6n/fZX/hZv/cIn/kaj/cYr/bYb/////cYn/iJ//gJf/eJH/j6X/lKr/+vv/xc//2N//vMj/s8H/z9j/4ef/nK//7O//qrr/5uv/pLT/8vXb6ULYAAAAJHRSTlMAHQsGle+XWe/Z3Ne7urWjo1cxMBbx7dq7u6ysk39+Yl/Gxn3eg46mAAACwUlEQVRIx4WVB5LqMAxAnU/vZdnedxPbSZxeuP/NvuREhngJPA9tRg/Jkg3sL85kuFpMg2C6WA0nDruJ874IOizer1t3L8EFXu56hcPGDs5hIZvDZWMyDXqZTi4Ig6Gv6ZOGA9v49+QTPeLqn2V8U3C/991xBpTjqrc6r23o36Ddz1mvOOLf9kzfnAet2F6toiIMj1ka+8SUTsIGQ8khr8xcw1GRs2lPCQXiIjl2O1TkNGdnbeXAT6VrEbXKi94JBAmKJTtybSgN7uaD2/gXlJA68w7Ko8Ak7RMR2EpKX/cIdQkNRVOJedgxFDc47BOi9UKMlSU8PUlVyTNO3fxkb6KBNED3OOEcZplVUZpA70OXE0O2JqGxyIzcMKagGpoRcErzxObiMkkBbSqyKDviVHjCiUd2b4X6eaJUkkOqPKPjEkChpjUPTAgJq0GKuArbOWSlEFiHAPLKjU/9ZFKCIBuxLrrnSvAyL+MIvqU86yi7lyihJ/I/E/fbOQp+NC19YHMUmkdlKRBaKoUJarcwg5izZx0v8Mm1qQQSxEc3E4Y1e5MalCJbUUK5mlgoo7yxL2ngRdfIJCpFWuNkjfLJHOmREsv03IhlIpoC4IrWgkbhMDaThKskj6s2A4RnR5nHKoLxhzXGa2uOV0xKTy9ZuxUHEy8OvMDx95vtFaBr0PsAxZEEXqwQDy4PEowF1S/rnOtgvQCHAa+e12wn5GebCWNZF6abgt6sGbL3WiI3h1SJSlNVQkwCDaCijbhnmi05lRsmvC1SwfBR6LKlH9gROc3kCrwiYEOIJd07rGXnETJJixDvVlqakrxTcTtmGHu9UBpUx+zEYOkhN8TnQeeP78e7yY/9Z7m8ZTyTYRiMrxtjrMpmN+oXRjt2kcO2z9geWB/7Vw+x0r3u2TWc31k3fvbrsJs4X+PlbAS5Zsvx14X4/yrqK3BD+o5lAAAAAElFTkSuQmCC);
		background-size: cover;
	}
	.ico-cz{
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAA+VBMVEUAAABft/9Xhf9gu/9amP9Vf/9Wfv9bnv9Vff9VfP9gvP9hw/9VeP9hwf9es/9gwf9Zlv9fuf9Xg/9dqP9iw/9ak/9Vef9cn/9Yi/9hvf9fs/9amP9guv9Xgv9Yjv9erv9guv9bnv9dqv9Zkv9hwf9eq/9ZkP9hwv9Vev9hxP9bmf////9Wgv9hv/9ft/9esf9dqv9bn/9ZlP9We/9amf9Zjv9Yif9cpP/x9//T5f+21/+bxP+Auf/D2f+evf+Guv97qv/e7P/F4f/k8f/n7/9to/9kn/+Gs/90s//a5v/M5f+iyP+Uu//5+/+e0P+Aw/+Mwf+x0f+Osf/Vnlz6AAAAK3RSTlMAHh4MB7tZF6WVVtnXu7iWlDEw8e/u7tzAopZi7+/b2ca6q6uqf359fV/W45+SLgAAAtBJREFUSMeF1dlW4kAQgOEC2UE2911nXCdIFhJNos4AAiK4v//DTFWlO93GoB/HQw70b6U7F8BX2UI5X1vv9dZr+XIhCz/Kntd6n9TOv6/apV6KUnthUCx1Op1ealRMLwp7nViyWS+kBLmyCtK6ci5ZLOWTQbLLLyWKTfz2il9pUprc5lXk2zCv31tTFKJbpKydlefJ5R8DPyEYqyY+t+KaR6jrG189e3GylxXJby8WGime1AZLwNqO48jkLi35q22wHQ1xJE5Gj4/PBqPrwKdEwlOjIiuW48txMAk8ry8LnDviRKHdnLqOQjfWd5zHKPnwvDndGJZxcorJH5epZOA4fTlkYnBCRLeP9+VqMEEPjhOI91AmShZ2bFtrOBnRGJ42NjjBnSo70LQjMiEPrhvwkKFIiOyacETL8cVE4rvu2Lh3XZzFiTxQtgkbtsAZJb5vPLnuDP8CvFZTRLgPK9e2Brc7nEzG4+hGx+PJZGDgP0BxtgbWNcHu+mY+v8EFoa24vKn3PlJPAixCHW6VDW7Ig22/8cVIfBzGDwJWKKDKUCi07WfjE5mswYElBOKr4B+Z2vYtX9zLj+WT2IA6TaE5pmhC6sUGUSCKiS0cwbYVG0Zf3pKpZU35Ippypx5EEyqmaeEIbkIjNrMsXCy9a09iBzKmQM2LIQ0ta2BIc3mjJANwYGre0pI3i0XdBgCcmLpXXx6CPEL/1hInxE4A6M5002gL92HoRxdTCsQYfM8Aqne7XT0KDE3Ae1RjfgFpdZnqhqoYmogOVJYtYFscaGF82KHJZMdDWGa3myAO+8VMWCmCULlMNq8z35+9mkkViDUuSZfLJK3YBiW3zAVb3NVzoFk6xLVy1IKBh8kfS5yjdFPm1bnQ5RqqUPNUt52DryqryUgN3K1AquLW5QJbRVikdZwWHLfgO5mz6uf11bMM/Chz0Viu4r5Wq8uNi5T1/wE25XMezaH5wAAAAABJRU5ErkJggg==);
		background-size: cover;
	}
	.ico-card{
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAA3lBMVEUAAAB2fPB2fe9zj/l5auZ5aOVykvp6Z+Vzi/d5Z+V1g/J6ZeNylPt5ZuRyk/t3cel3duxzjvh5a+Zzjfh3dux1g/J3eO14bOd0ifZzkPlzkPl5aeVzkPl3ee1zjvh2fO92fO94cOhzkPp5bOh0ifZ5Z+V2e+91gvL+/v94dOz3+P+dn/Tq6/3y8v7i5P2Rje/Iyvrb3Pu9wPi0u/mCj/XL0PuQnfaXpfjR0/rGxPeztPZ7ivSKhu6dq/iCfe2srfSNlfSXl/KDhe+/xvqmrfaGl/a8uvWlp/Sns/idl+9ktTFoAAAAInRSTlMAGwiVpVnv76aW2tnXu7q1lVYxMPHu3MO7rH98YGDGun/WqcLaPwAAA3VJREFUSMeNloly2jAQQEWA5mySJmnaXD2wsWRdtsA3N+FI/v+Huha2DAG3fWJkRuxjtevR2GifxnPz8uJTp/Pp4rL53ED/pPF40dnh4vHv1u1D5wAPt/UZTjo1nNRk+gL7r+PTlwPCURN+sfU4SPNoz/hu6+jK++heHn0wfti5YhvvgPTj6EOOEuOVU02epjEqb2+jUM9Wr2wbQ8hhr0Brpm+Nr7ZG0BK/E0nat2OzIopel/fnBEMWGJQQQmk+J51YkFd7lC8AMBf7PNkYt1iTK+otjuM+J+EgeOtHoFB/FMejV7pRgNsiSQGlMY5GSzsBxQZA4csgjoOAE7vgQVeCKyWKpVCBD8pg9LYERS59IcKlNIqdV/NrW1lQIqag4EgKKJ/ISBGYtpRHUM4wdowShLI30AonfQxK8CZlPwAFF+PM7Cu3KMlwEAwCRfyNwoiIB7AS6VrMzl4cDdYKV6EfKkrCUiEyCcNEEooBncV+RteOgZKSZDBY9Kd4ZBZA0YDSRD8rJeu/+q99oMewJoDvPizBhA3f0X2lMDbH84jlLDKGp9mCsQhEFgWDSjlDd5XCOXNminMBH5rgNRFcyAD6rQJc8RW520o2XVEIzIuSrAezkOtpj9DFtOwqgFyNVmYslILQyTTJC+aCEM6YkvlVQXxpoTvXgVF4IcRyz+mRAunMOdE4OcXG7nV04XmTyYQ5jpf1NOkE40lP4xjO0JVrWK/ZbDZj6wmbO/X8RNeVIkhJ6kBejwFjuORUyjV6qRRKqFRKQcPCMSi6Y1AYLBNRKS+osa2shkNv6Cnij925F+adYl5CAFopcGB+W5ZVKNQb91Tm+sR3hz4kk8NZwqlWzJ24h/PyZBXkChOED1NQvLy5yh0WPRbmVvwCpQHBeligvHMi51qRRK1W2UoQP6XUz1wNWA0EXFkarbhZylx/kyVz3wX8/3DMheeWXKGcG6OQ1APeZV5Lqpg7y48Ym/CEGecGaVpGIVQIAZdwbLlj12LQ5HFCEk+JwmihDY3jjcLpBkFTVy+8Uzm0UpqOFd0Yd+YB2O52rX1A2wGUNjKcdnPqRLds6TWqOPrcrbDq+Lb7GPvW3aXW2M9TL14Zwzi6nnrvFIw92sfdWo7bNS8krTqj1UB13LQOCjfobzSeznfjz5/+55Wsffr5HOo6Pv982j4Q/wf4PTVTS/60NAAAAABJRU5ErkJggg==);
		background-size: cover;
	}
	.list-box .fl-r{
		padding-right: 1.4rem;
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAFVBMVEUAAADV1dXS0tLS0tLT09PT09PT09MVOTk0AAAABnRSTlMAMPCwr8A+RDU2AAAAQklEQVRIx2MYBcMUiDgSUGCWJIBfQViaIn4FQmkEjGBUGzVi6BmRTK4ChBUEHTlqwGA3gMEsTZHCAkTYkGEUDG8AAAymG4pq2NqFAAAAAElFTkSuQmCC) no-repeat center right;
		background-size: auto 1.2rem; 
	}
	.bind-phone{
		color: #ffa73f;
	}
</style>
