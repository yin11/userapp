import fetch from './fetch'


/*获取品牌列表*/
const getBrandList = (data) => fetch({
	url: '/api/voip/goods/brands',
	method: 'get',
	params: data
});


/*获取商品分类列表*/
const getClassifyList = (data) => fetch({
	url: '/api/voip/goods/type',
	method: 'get',
	params: data
});


/*获取商品列表*/
const getGoodsList = (data) => fetch({
	url: '/api/voip/goods/index',
	method: 'get',
	params: data
});


/*搜索查询商品*/
const getSearchList = (data) => fetch({
	url: '/api/voip/goods/index/search',
	method: 'get',
	params: data
});



//打印错误信息
const alertMsg = (msg) => {
	//alert(msg)
}


//获取微信分享的相关信息
const getsignature = (data) =>fetch({
	url: '/api/voip/wechat/signature',
	method: 'get',
	params: data
});


//toast提示语
const toast = (msg = '', time = 2000) => {
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
 * 获取地址栏参数
 */
const getQueryString=(name) => {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]); return null;
}


const isNVL = (str,dest) =>{
	 return str||dest ;
}


export {getBrandList, getGoodsList,getClassifyList , toast ,alertMsg , getQueryString , isNVL , getsignature , getSearchList}