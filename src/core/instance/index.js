import { apiMixin } from "./api";

function THCache(options) {
    options&&this.setOptions(options);
}

apiMixin(THCache);


export default THCache;
