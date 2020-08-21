import { registerAxiosFilter } from "./axios/axiosFilter";
import { http } from "./index";

//对axios方法进行扩展封装并返回
export function TBindAxios(axios) {
    http.lib = axios;
    http.type = "axios";
    axios = registerAxiosFilter(axios);
    return axios;
}