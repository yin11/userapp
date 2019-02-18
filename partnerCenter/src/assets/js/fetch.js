import axios from 'axios'; 
import md5 from 'js-md5';

// 创建axios实例
const service = axios.create({
  //baseURL: process.env.BASE_API, // api的base_url
  headers: {
  	'content-type': 'application/x-www-form-urlencoded',
  	'userAgent':' XXXXXXX',
  	"miniProgram":"ios",//新增的判断为安卓还是ios
  	//"sec": md5(_myself.asciiSort(json.data))
  },
  timeout: 30000, // 请求超时时间
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
    _json = str + "key=XXXXXXX";
    return _json;
}


// request拦截器
service.interceptors.request.use(config => {
	/*if(config.method == "get"){
		config.headers['sec'] = md5(asciiSort(config.data));
	}if(config.method == "post"){
		config.headers['sec'] = md5(asciiSort(config.params));
	}*/
		config.headers['sec'] = md5(asciiSort(config.params));
  //console.log("这里是请求拦截器")
  // Do something before request is sent
//   if (window.localStorage.getItem("token")) {
    // config.headers['sec'] = window.localStorage.getItem("token"); // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
//   }
  //console.log(config);
  return config;
}, error => {
  Promise.reject(error);
})

export default service;


