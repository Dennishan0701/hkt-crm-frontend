/**
 * Created by ShenBo on 2018/1/3.
 */
const storage = $.localStorage;
var hostname = window.location.hostname;
var API_BASE_URL = 'https://api.onlyeduhi.cn';
if(hostname === 'crm.onlyhi.cn') {  //正式环境
  API_BASE_URL = 'https://crmapi.onlyhi.cn';
} else if(hostname === 'crm.haiketang.net') {//搬迁环境
  API_BASE_URL = 'http://crmapi.onlyhi.cn';
}  else if(hostname === 'admin.onlyeduhi.cn') {//公网测试环境
  API_BASE_URL = 'https://api.onlyeduhi.cn';
} else if(hostname === 'admin.onlyhi.com') {//内网测试环境
  API_BASE_URL = 'http://api.onlyhi.com';
}else {
  // API_BASE_URL = 'https://crmapi.onlyhi.cn';
 // API_BASE_URL = 'http://192.168.0.4:8081';//明珠测试url
 //  API_ECHART_URL = 'http://172.16.21.252:8521';//仕勇测试url
 //   API_BASE_URL = 'http://172.16.21.252:8080/onlyhi-admin';//仕勇测试url
 //  API_BASE_URL = 'http://172.16.20.96:8080/onlyhi-admin';//忠星测试url
  // API_BASE_URL = 'http://192.168.0.16:8080/onlyhi-admin';//姚伟骏测试url
}

var API_ECHART_URL = 'https://getaway.onlyeduhi.cn';
if (hostname === 'crm.onlyhi.cn') {  //正式环境
  API_ECHART_URL = 'https://hkt.onlyhi.cn';
} else if (hostname === 'admin.onlyeduhi.cn') {//公网测试环境
  API_ECHART_URL = 'https://getaway.onlyeduhi.cn';
} else {//本机测试环境
  // API_ECHART_URL = 'https://hkt.onlyhi.cn';
  // API_ECHART_URL = 'http://172.16.20.94:8112';//明珠测试url
  // API_ECHART_URL = 'http://172.16.21.252:8521';//仕勇测试url
  // API_ECHART_URL = 'http://172.16.20.96:8120';//忠星测试url
  // API_ECHART_URL = 'http://172.16.21.14:8521';//仕勇测试url
  // API_ECHART_URL = 'http://172.16.20.96:8122';//忠星测试url
  // API_ECHART_URL = 'http://172.16.21.14:8521';//仕勇测试url
  // API_ECHART_URL = 'http://172.16.20.96:8114';//忠星测试url
  // API_ECHART_URL = 'http://172.16.20.96:8124';//忠星测试url
  // API_ECHART_URL = 'http://172.16.21.14:8521';//仕勇测试url
  // API_ECHART_URL = 'http://172.16.20.96:8122';//忠星测试url
  // API_ECHART_URL = 'http://172.16.21.14:8521';//仕勇测试url
  // API_ECHART_URL = 'http://172.16.20.96:8114';//忠星测试url
  // API_ECHART_URL = 'http://172.16.20.96:8111';//忠星测试url
  // API_ECHART_URL = 'http://172.16.21.252:8522';//姚伟骏测试url
}

function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null)return unescape(r[2]);
  return "";
}
