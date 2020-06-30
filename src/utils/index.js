import React from 'react';
import Loadable from 'react-loadable';
import { message, Spin } from 'antd';
import Config from '@/config';

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};
/**
 * @description: 校验图片格式
 * @param {object}
 * @return: 错误信息
 */
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('图片格式不正确，请修改后重新上传');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小超出限制，请修改后重新上传');
  }
  return isJpgOrPng && isLt2M;
};
const beforeUploadMany = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('图片格式不正确，请修改后重新上传');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小超出限制，请修改后重新上传');
  }
  return isJpgOrPng && isLt2M;
};
/**
 * @description: 去除所有的空字符串
 * @param {String}
 * @return: value
 */

const trimAllSpace = (value) => {
  const trimValue = value.replace(/\s+/g, '');
  return trimValue;
};

/**
 * @description: 上传之前判断文件大小
 * @param {type} 文件file size MB
 * @return: boolean
 */
const isXM = (file, size = 1) => {
  const isLtXM = file.size / 1024 / 1024 <= size;
  if (!isLtXM) {
    message.error(`${file.name}大小超出限制，请修改后重新上传`);
    return isLtXM;
  }
  return isLtXM;
};

/**
 * @description: 时间戳转时间
 * @param {number}
 * @return: 具体时间
 */
const timeStampTurnTime = (timeStamp) => {
  if (timeStamp > 0) {
    const date = new Date();
    date.setTime(timeStamp);
    const y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? (`0${m}`) : m;
    let d = date.getDate();
    d = d < 10 ? (`0${d}`) : d;
    // let h = date.getHours();
    // h = h < 10 ? (`0${h}`) : h;
    // let minute = date.getMinutes();
    // let second = date.getSeconds();
    // minute = minute < 10 ? (`0${minute}`) : minute;
    // second = second < 10 ? (`0${second}`) : second;
    return `${y}/${m}/${d}`;
  }
  return '';
  // return new Date(parseInt(time_stamp) * 1000).toLocaleString().replace(/年|月/g, "/").replace(/日/g, " ");
};


/**
 * @description: 时间戳转时间
 * @param {number}
 * @return: 具体时间
 */
const timeStampTurnTimeDetail = (timeStamp) => {
  if (timeStamp > 0) {
    const date = new Date();
    date.setTime(timeStamp);
    const y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? (`0${m}`) : m;
    let d = date.getDate();
    d = d < 10 ? (`0${d}`) : d;
    let h = date.getHours();
    h = h < 10 ? (`0${h}`) : h;
    let minute = date.getMinutes();
    const second = date.getSeconds();
    minute = minute < 10 ? (`0${minute}`) : minute;
    // second = second < 10 ? (`0${second}`) : second;
    return `${y}/${m}/${d} ${h}:${minute}:${second}`;
  }
  return '';
  // return new Date(parseInt(time_stamp) * 1000).toLocaleString().replace(/年|月/g, "/").replace(/日/g, " ");
};

// 上传图片路径
const baseUrl = 'https://api.jdxiaokang.com/productservice/img/upload';
// 图片下载路径配置
const downLoadurl = 'https://web-service.jingxiaokang.com/common/download';
/**
 * 去除前后空格
 */
const trim = (s) => {
  return s && s.replace(/(^\s*)|(\s*$)/g, '');
};

const Loading = function ({ error, pastDelay }) {
  const styles = {
    backgroundImage: 'url(https://jxkcdn.jingxiaokang.com/assets/images/1591601686504_3801.png)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundColor: '#00baff',
    height: '100vh',
  };
  if (error) {
    return <div style={styles} title="系统正处于发布中,请稍后刷新或清缓存后重新登录再试" />; // 'Oh Nooess!';
  } if (pastDelay) {
    return <Spin tip="Loading..." style={{ position: 'absolute', left: '50%', top: '50%' }} />;
  }
  return null;
};

const loadRouter = function (callLoad) {
  // webpackChunkName: "fileName"
  return Loadable({
    loader: callLoad,
    loading: Loading,
  });
};

/**
 * 获取完整的文件URL路径
 * @param {String} v 文件路径
 */
const getFileUrl = function (v) {
  const p = `/${v}`.replace(/^\/+/, '/');
  return v && (`${v}`.indexOf('//') > -1 ? v : `${Config.imgHost}${p}`);
};

/**
 * 获取一串url中的pathname
 * @param {String} v
 */
const getPathName = function (v) {
  const iUrl = `${v}`;
  if (iUrl.indexOf('//') > -1) {
    return iUrl.replace(/.*\/\//, '').replace(/[^/]+\//, '/');
  }
  return v;
};

/**
 * 获取文件下载路径
 * @param {String} v 文件下载路径
 */
const downloadFileUrl = function (v) {
  const p = `/${v}`.replace(/^\/+/, '/');
  return v && (`${v}`.indexOf('//') > -1 ? v : `${Config.downImgHost}${p}`);
};

/**
 * 获取文件的排序 序列号
 * @param {String} v 文件原始名称
 */
const getUploadImgSort = function (v) {
  const ret = /(?:_|-)(\d+)\.[a-z]+$/.exec(v);
  return ret && ret[1];
};

/**
 * 文件导出 做异常信息提示兼容处理
 */
const download = function (data, success, error) {
  data.text().then((data2) => {
    const ident = data2.slice(0, 2);
    if (ident === '{"') {
      const msg = JSON.parse(data2).message;
      error(msg);
    } else {
      success(data);
    }
  });
};

export default {
  trim,
  getBase64,
  beforeUpload,
  trimAllSpace,
  isXM,
  baseUrl,
  beforeUploadMany,
  timeStampTurnTime,
  timeStampTurnTimeDetail,
  getFileUrl,
  getPathName,
  downloadFileUrl,
  loadRouter,
  getUploadImgSort,
  download,
};

export { loadRouter };
export { getFileUrl };
export { getPathName };
export { downloadFileUrl };
export { getUploadImgSort };
export { downLoadurl };
export { download };
