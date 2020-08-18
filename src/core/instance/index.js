import { initMixin } from "./init";
import { apiMixin } from "./api";


function THCache(options) {
    //bind(http);
    options&&this._init(options);
}

initMixin(THCache);
apiMixin(THCache);





export default THCache;