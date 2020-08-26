import { initMixin } from "./init";
import { apiMixin } from "./api";


function THCache() {
  options && this._init();
}

initMixin(THCache);
apiMixin(THCache);





export default THCache;
