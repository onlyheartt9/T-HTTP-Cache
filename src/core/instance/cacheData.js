let cache = Object.create(null);
window.ttt = cache;
export function getCacheData(moduleName){
    if(!cache[moduleName]){
        cache[moduleName] = {};
    }
    return cache[moduleName]
}