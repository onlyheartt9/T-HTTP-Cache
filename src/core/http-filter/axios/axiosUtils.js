
//解析axios request参数，返回可以封装cachekey的参数格式
export function getCacheKeyOptByRequest(config) {
    let { url, params = {}, data = {}, method } = config
    return { url, params, method, data };
}

//解析axios response参数，返回可以封装cachekey的参数格式
export function getCacheKeyOptByResponse(response) {
    let { url, params = {}, data = {}, method } = response.config;
    return { url, params, method, data }
}

