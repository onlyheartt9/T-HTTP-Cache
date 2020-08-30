import { } from "../index";
import { setOptions } from "../../option/index";
import { options } from "../../option/__test__/data";

describe('test http-filter api', () => {

  it("测试setOption and getOptionByKey", () => {
    setOptions(options);
    options.forEach((option) => {
      // let optKey = setOptions([option]);
      // expect(getOptionByKey(optKey)).toEqual(option);
    });
  });

})

