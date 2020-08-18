import { getCacheKeyOptByRequest, getCacheKeyOptByResponse ,typeMethods} from "../utils/axiosUtils"
import { commonRequestFilter, commonResponseFilter } from "./index";
import utils from "../utils/index";
export function registerAxiosFilter(axios) {
    axios = createNewAxios(axios);
    //对create方法扩展，注册绑定httpFilter
    let create = axios.create;
    axios.create = (...e) => {
        let axiosObj = create(...e);
        axiosObj = createNewAxios(axiosObj);
        registerHttpFilter(axiosObj);
        return axiosObj;
    };
    registerHttpFilter(axios);
    return axios;
}

//对axios代理拦截处理，判断请求是否有缓存，返回缓存或请求接口
function createNewAxios(axios) {
    let newAxios = function (config, ...e) {
        let { method = "get" } = config;
        let cacheKeyOpt = typeMethods[method].optRequest(config);
        console.log("cacheKeyOpt",cacheKeyOpt)
        return axiosFilter(cacheKeyOpt,()=>{
            return axios(config, ...e)
        })
    };
    utils.extend(newAxios, axios, axios)
    return newAxios;
}

//对axios对象的方法进行过滤，筛选配置过的url
function registerHttpFilter(axiosObj) {
    //请求拦截,暂无处理
    axiosObj.interceptors.request.use((config) => {
        return config;
    });
    //响应拦截
    registerResponseFilter(axiosObj);

    extendMethods(axiosObj);
}

//方法扩展
function extendMethods(axiosObj) {
    const methods = ["get", "post"];
    methods.forEach(methodName => {
        let method = axiosObj[methodName];
        axiosObj[methodName] = function (...e) {
            const cacheKeyOpt = getCacheKeyOptByRequest(e, methodName);
            return axiosFilter(cacheKeyOpt, () => {
                return method(...e)
            });

        }

    });
}
//根据请求配置判断是否有缓存，如果没有执行callback函数
/**
 * 
 * @param {*} cacheKeyOpt {url,params,type}
 * @param {*} callback 函数
 */
function axiosFilter(cacheKeyOpt, callback) {
    let type = commonRequestFilter(cacheKeyOpt);
    if (type === "no option" || type === "normal") {
        return callback();
    } else if (type === "loading") {
        return new Promise(() => { });
    } else {
        //上述条件都不是的话，type为缓存值
        return new Promise((resolve) => {
            resolve(type)
        });
    }
}

function registerResponseFilter(axiosObj) {
    let repNum = -1;
    let responseUse = axiosObj.interceptors.response.use;
    axiosObj.interceptors.response.use = function (...e) {
        let num = responseUse.call(this, ...e)
        if (e[e.length - 1] !== "useFilter") {
            axiosObj.interceptors.response.eject(repNum);
            useFilter()
        }
        return num;
    }
    useFilter();


    function useFilter() {
        repNum = axiosObj.interceptors.response.use((response) => {
            console.log("responseeeeeee",response)
            const cacheKeyOpt = getCacheKeyOptByResponse(response);
            commonResponseFilter(cacheKeyOpt, response);
            return response
        }, "useFilter");
    }
}