import { initMixin } from "./init";
import { apiMixin } from "./api";


function THCache() {
  //bind(http);
  options && this._init();
}

initMixin(THCache);
apiMixin(THCache);





export default THCache;
