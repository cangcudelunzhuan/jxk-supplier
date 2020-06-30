
/**
 * @method formatDateTime 时间戳转年月日时分秒格式
 * @param dates 时间戳
 * @return xxxx-xx-xx xx:xx:xx
 */
const formatDateTime = (dates) => {
  const date = new Date(dates);
  const y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? (`0${m}`) : m;
  let d = date.getDate();
  d = d < 10 ? (`0${d}`) : d;
  const h = date.getHours();
  let minute = date.getMinutes();
  minute = minute < 10 ? (`0${minute}`) : minute;
  let s = date.getSeconds();
  s = s < 10 ? (`0${s}`) : s;
  return `${y}-${m}-${d} ${h}:${minute}:${s}`;
};

/**
 * @method formatDate 年月日
 * @param dates 时间戳
 * @return xxxx-xx-xx
 */
const formatDate = (dates) => {
  const date = new Date(dates);
  const y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? (`0${m}`) : m;
  let d = date.getDate();
  d = d < 10 ? (`0${d}`) : d;
  return `${y}-${m}-${d}`;
};

/**
 * @method formatPoint 小数点精度计算
 * @param f 被计算数
 * @param digit 精确到小数点后几位
 * @return xx.xxxx
 */
const formatPoint = (f, digit) => {
  if (f === 'NaN') return '--';
  const d = digit || 2;
  // eslint-disable-next-line no-restricted-properties
  const m = Math.pow(10, d);
  const res = Math.round(f * m, 10) / m;
  // return res.toFixed(d);
  return res;
};

/**
 * @method formatThousands 千位符格式化
 * @param num 格式化字段
 * @return 123 456 789
 */
const formatThousands = (num) => {
  if (!num && num !== 0) {
    return '';
  }
  const res = num.toString().replace(/\d+/, (n) => { // 先提取整数部分
    n = `${n - 0}`.substr(0, 15); // 整数最大15位
    return n.replace(/(\d)(?=(\d{3})+$)/g, ($1) => {
      return `${$1},`;
    });
  });
  const s = res.indexOf('.'); // 计算小数点位置 取小数点后两位
  return s === -1 ? res : res.substr(0, s + 3);
};

/**
 * @method formatBankNumber 4位分割
 * @param value 格式化字段
 * @return 1234 5678 9000
 */
const formatBankNumber = (value) => {
  if (!value) {
    return '';
  }
  return `${value}`.replace(/\s/g, '').replace(/[^\d]/g, '').substr(0, 25).replace(/(\d{4})(?=\d)/g, '$1 ');
};

export {
  formatDateTime,
  formatDate,
  formatPoint,
  formatThousands,
  formatBankNumber,
};
