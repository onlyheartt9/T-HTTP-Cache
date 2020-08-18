
import { urlParamHash } from "../utils/index"; 
//对请求和响应做参数处理的方法
export const typeMethods = {
    get: {
        request: (e) => {
            let [url, { params = {} }] = e;
            params = Object.assign({}, params, urlParamHash(url));
            url = url.split("?")[0];
            return { url, params, type:"get"}
        },
        response: (response) => {
            let { config } = response;
            let type = config.method;
            let params = config.params??{};
            let url = config.url;
            params = Object.assign({}, params, urlParamHash(url));
            url = url.split("?")[0];
            return { url, params, type }
        },
        optRequest:(config) =>{
            let {url, params={}} = config;
            params = Object.assign({}, params, urlParamHash(url));
            url = url.split("?")[0];
            return { url, params, type:"get"}
        }
    },
    post: {
        request: (e) => {
            let [url, params={}] = e;
            return { url, params, type:"post" }
        },
        response:(response)=>{
            let { config } = response;
            let type = config.method;
            return { url: config.url, params: config.data??{}, type }
        },
        optRequest:(config) =>{
            let {url, data={}} = config;
            return { url, params:data, type:"post" }
        }
    }
}
//解析axios request参数，返回可以封装cachekey的参数格式
export function getCacheKeyOptByRequest(e, type) {
    return typeMethods[type].request(e);
}
//解析axios response参数，返回可以封装cachekey的参数格式
export function getCacheKeyOptByResponse(response) {
    let { config } = response;
    let type = config.method;
    return typeMethods[type].response(response);
}

export function isFilter(e, type) {
    const methods = {
        get,
        post,
    }
    function get() {
        let [url] = e;
        let opt = getOptionByUrl(url);
        return !!opt
    }

    function post() {
        let [url] = e;
        let opt = getOptionByUrl(url);
        return !!opt
    }
    return methods[type]();
}