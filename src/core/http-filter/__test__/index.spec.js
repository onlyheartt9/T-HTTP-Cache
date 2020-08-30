import {} from "../index";
import { setOptions } from "../../option/index";
import { options } from "../../option/__test__/data";

setOptions(options);
test("测试setOption and getOptionByKey", () => {
  options.forEach((option) => {
    let optKey = setOption(option);
    expect(getOptionByKey(optKey)).toEqual(option);
  });
});
