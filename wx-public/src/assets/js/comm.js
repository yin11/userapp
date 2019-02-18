import fetch from './fetch'


/**
 * 获取地址栏参数
 */
export const getQueryString=(name) => {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]); return null;
}

/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.sessionStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getStore = name => {
	if (!name) return;
	return window.sessionStorage.getItem(name);
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
	if (!name) return;
	window.sessionStorage.removeItem(name);
}

/**
 * 表单校验
 */
export const rule={
  empty:function(str,mess){//不能为空
    if(str==''){
      toast(mess)
      return false
    }else{
      return true
    }
  },
  phone:function(str) {//手机号校验
    var myReg = /^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
    if (!myReg.test(str)) {
      toast('手机号码有误')
      return false
    }else{
      return true
    }
  },
  alert:function(msg){
	  alert(msg);
  }
}

/**
 * toast提示语
 */
export const toast = (msg = '', time = 2000) => {
    var toast = document.createElement('div')
    toast.className = 'common-toast common-toast-show'
    toast.innerHTML = msg
    document.body.appendChild(toast)
    toast.style.display = 'block'
    toast.style.margin = `-${toast.offsetHeight / 2}px 0 0 -${toast.offsetWidth / 2}px`
    var timer = setTimeout(() => {
      toast.className = 'common-toast common-toast-hide'
      clearTimeout(timer)
      var timer2 = setTimeout(() => {
        document.body.removeChild(toast)
        clearTimeout(timer2)
      }, 200)
    }, time)
  }

/**
 * 时间戳转为yyyy-mm-dd hh-mm-ss
 */
export const timestampToTime = (timestamp)=>{
    let date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y , M , D ,h , m , s ;
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    return Y+M+D+h+m+s;
}



/**
 * 请求
 */
export const requestAxios = (json) => {
	fetch({
        url: json.url,
        method: json.method,
        params: json.data
	}).then((res)=>{
		let _data = res.data ;
		if(_data.state == 1){
			 console.log(_data.data)
			 json.success(_data) ;
		}else{
			toast(decodeURIComponent(_data.msg))
		}
	}).catch(function (error) {
		    console.log(error);
	});
}


/**
 * 将数字补填为两位数
 */
export const numberToFixed = (number) => {
	let _num = String(number) ;
	if(_num.indexOf('.') == -1){
		_num = _num +'.00';
	}else{
		_num = Number(_num) ;
		_num = _num.toFixed(2);
	}
	return _num ;
}
