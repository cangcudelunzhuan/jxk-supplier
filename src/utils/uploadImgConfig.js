import { message } from 'antd';

const beforeUpload = (file, type) => {
  const imgsize = [
    // {
    //   width: 800,
    //   height: 800,
    // },
    // {
    //   width: 800,
    //   height: 450,
    // },
    // {
    //   width: 800,
    //   height: 553,
    // },
    1 / 1, 16 / 9, 3 / 2,
  ];
  const isPNG = (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg');
  if (!isPNG) {
    message.error('图片格式不正确，请修改后重新上传！', 0.8);
    return isPNG;
  }
  // 不能大于1M
  const isLt2M = file.size / 1024 / 1024 <= 5;
  if (!isLt2M) {
    message.error(`${file.name}图片大小超出1M，请修改后重新上传`, 0.8);
    return isLt2M;
  }
  const isSize = checkSize(file, imgsize[type - 1] || { width: 800, height: 800 }, type);
  return isPNG && isLt2M && isSize;
};

const beforeVideoUpload = (file) => {
  // 不能大于1M
  const isLt2M = file.size / 1024 / 1024 <= 50;
  if (!isLt2M) {
    message.error(`${file.name}视频大小超出${50}M，请修改后重新上传`, 0.8);
    return isLt2M;
  }
  return isLt2M;
  // mov,.mp4,.avi,.flv
  // const isVideo = (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg');
  // if (!isVideo) {
  //   message.error('图片格式不正确，请修改后重新上传！', 0.8);
  //   return isVideo;
  // }
  // 不能大于1M
  // const isLt2M = file.size / 1024 / 1024 <= 10;
  // if (!isLt2M) {
  //   message.error(`${file.name}图片大小超出10M，请修改后重新上传`, 0.8);
  //   return isLt2M;
  // }
  // const isSize = checkSize(file, videoSize[type - 1] || { width: 800, height: 800 }, type);
  // return  && isLt2M && isSize;
};

const beforeUploadFile = (file) => {
  const isLt2M = file.size / 1024 / 1024 <= 2;
  if (!isLt2M) {
    message.error(`${file.name}大小超出2M，请修改后重新上传`, 0.8);
    return isLt2M;
  }
  return isLt2M;
};


const beforeUploadOtherFile = (file) => {
  const isLt2M = file.size / 1024 / 1024 <= 100;
  if (!isLt2M) {
    message.error(`${file.name}大小超出100M，请修改后重新上传`, 0.8);
    return isLt2M;
  }
  return isLt2M;
};

// 检测尺寸
const checkSize = (file, imgsize, type) => {
  return new Promise((resolve, reject) => {
    // const width = imgsize.width;
    // const height = imgsize.height;
    const url = globalThis.URL || globalThis.webkitURL;
    const img = new Image();
    img.onload = function () {
      // const valid = (type === 4 || type === 5) ? (img.width == width) : (img.width == width && img.height == height);
      const valid = (type === 4 || type === 5) ? true : (Math.round((img.width / img.height) * 10) / 10 == Math.round(imgsize * 10) / 10);
      if (valid) {
        resolve();
      } else {
        reject();
      }
    };
    img.src = url.createObjectURL(file);
  }).then(
    () => {
      return file;
    },
    () => {
      message.error(`${file.name} 图片尺寸不符合要求，请修改后重新上传！`);
      return Promise.reject();
    }
  );
};

// 上传后交互
const backFun = (status, app) => {
  if (status === 'uploading') {
    app.setState({ loading: true });
    return;
  }
  if (status === 'error') {
    message.error('上传失败');
    return;
  }
  if (status === 'done') {
    app.setState({ loading: false });
  }
};


// 提交图片排序
const setSort = (arr = []) => {
  const list = [];
  arr.map((item) => {
    /*
    if (typeof (item) === 'string') {
      item = item.split('?')[0];
      item = `${item}?sort=${itemId}_${i + 1}.${item.split('.').pop()}`;
    } else {
      item[name] = item[name].split('?')[0];
      item[name] = `${item[name]}?sort=${itemId}_${i + 1}.${item[name].split('.').pop()}`;
    }
    */
    list.push(item);
    return item;
  });
  return list;
};


export {
  beforeUpload,
  beforeUploadFile,
  checkSize,
  backFun,
  beforeUploadOtherFile,
  setSort,
  beforeVideoUpload,
};
