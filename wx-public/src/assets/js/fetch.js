import axios from 'axios'; 
//import VueAxios from 'vue-axios'
//Vue.prototype.axios = axios;  
//Vue.use(VueAxios, axios);
import md5 from 'js-md5';

// 创建axios实例
const service = axios.create({
  //baseURL: process.env.BASE_API, // api的base_url
  headers: {
  	'content-type': 'application/x-www-form-urlencoded' ,
  	'userAgent':' zst-android-broswer',
  	"miniProgram":"ios",//新增的判断为安卓还是ios
  	//"sec": md5(_myself.asciiSort(json.data))
  },
  timeout: 10000, // 请求超时时间
});

/**
 * 参数排序
 */
const asciiSort=(json) => {
  let arr = [], _json = {}, str = "",  reg = /\,/;
    for (i in json) {
      if (json[i] !== "" && json[i] !== undefined) {
        arr.push(i);
      }
    }
    arr.sort();
    for (var i = 0; i < arr.length; i++) {
      var name = arr[i];
      str += name + "=" + json[name] + "&";
    }
    _json = str + "key=1hehe^_^haha!ysyhl9t@flzx3000c";
    return _json;
}


// request拦截器
service.interceptors.request.use(config => {
	console.log(config)
	if(config.url == '/api/voip/v2/smsSecurityCode'){
		let key = '1hehe^_^haha!ysyhl9t@flzx3000c' ;
		let date = new Date();
		let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    let _time =  String(date.getFullYear()) + month + strDate ;
		let data = key + _time + config.params.phone ;
		console.log(data)
		config.headers['sec'] = md5(data);
	}else{
		config.headers['sec'] = md5(asciiSort(config.params));
	}
  //console.log("这里是请求拦截器")
  // Do something before request is sent
//   if (window.localStorage.getItem("token")) {
    // config.headers['sec'] = window.localStorage.getItem("token"); // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
//   }
  //console.log(config);
  return config;
}, error => {
  // Do something with request error
  //console.log(error); // for debug
  Promise.reject(error);
})

export default service;


