import utils from '../../utils/index';

//解析axios request参数，返回可以封装cachekey的参数格式
export function getCacheKeyOptByRequest(config) {
  let { url, params = {}, data = {}, method } = config;
  let cacheKeyOpt = { url, params:utils.clone(params), method, data:utils.clone(data) }
  if(utils.isString(params)){
    cacheKeyOpt.params = JSON.parse(params)
  }
  if(utils.isString(data)){
    cacheKeyOpt.data = JSON.parse(data)
  }
  return cacheKeyOpt;
}

//解析axios response参数，返回可以封装cachekey的参数格式
export function getCacheKeyOptByResponse(response) {
  let { url, params = {}, data = {}, method } = response.config;
  let cacheKeyOpt = { url, params:utils.clone(params), method, data:utils.clone(data) }
  if(utils.isString(params)){
    cacheKeyOpt.params = JSON.parse(params)
  }
  if(utils.isString(data)){
    cacheKeyOpt.data = JSON.parse(data)
  }
  return cacheKeyOpt
}

