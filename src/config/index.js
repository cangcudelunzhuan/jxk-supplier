/*
 * @Author: 福虎
 * @Date: 2019-12-19 16:41:31
 * @Description: 数据、字段配置文件
 */
import order from './order';

// 获取环境变量
const getEnv = () => {
  const envValue = process.projectConfig.env || 4;
  return ({
    // 生产环境
    1: 'production',
    // 预发环境
    2: 'pre', // staging
    // 测试环境
    3: 'test',
    // 开发环境
    4: 'development',
  })[envValue];
};

const helpers = {
  // 取值
  getValues(dataName, key) {
    const dn = this[dataName];
    if (dn) {
      return dn.map((v) => v[key]);
    }
    return dn;
  },
  // 由id取对应的文案
  getCurrent(gatherName, value, label = true) {
    const curr = this[gatherName];
    if (curr) {
      const ic = curr.find((v) => `${v.value}` === `${value}`) || {};
      return label ? ic.label : ic;
    }
  },
};

Object.assign(order, helpers);

export default {
  getEnv,
  // 图片访问域名
  imgHost: 'production,pre'.indexOf(getEnv()) > -1 ? 'https://jxkcdn.jingxiaokang.com' : 'https://test-static.jdxiaokang.com',
  // 文件下载域名
  downImgHost: 'https://public-jingxiaokang.oss-accelerate.aliyuncs.com',
  order,
};
