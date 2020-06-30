
import React from 'react';

/**
 * @method fgetSKUList 根据返回的数据生成表格可用的sku表格
 * @param skuList 需处理数组 columns 表格列头 specs动态列
 * @return list 数组  culumns 列
 */
const getSKUList = (skuList = [], columns = [], specs = []) => {
  const list = [];
  (skuList).map((item, i) => {
    const o = {};
    item.propsValue.map((it) => {
      if (!o[it.specsName]) {
        o[it.specsName] = [];
      }
      o[it.specsName].push(
        it.propertyValue
      );
      return '';
    });
    item = {
      ...item,
      ...o,
      isAct: true,
      index: i,
    };
    list.push(item);
    return '';
  });
  const col = deepCopy(columns);
  specs.map((item, i) => {
    const x = col.findIndex((r) => r.dataIndex === item.specsName);
    if (x >= 0) {
      return;
    }
    col.splice(i, 0,
      {
        title: item.specsName,
        dataIndex: item.specsName,
        width: (item.specsName).length * 40,
        render: (it) => (
          /^((?!.jpg|.jpeg|.png|.gif).)*$/.test(it)
            ? (
              <span style={{ marginRight: '10px' }}>
                {it}
              </span>
            )
            : (
              <img src={it} alt="" width="60" />

            )

        ),
      }
    );
    return col;
  });
  return { list, col };
};

// 深拷贝
const deepCopy = (obj, cache = []) => {
  // typeof [] => 'object'
  // typeof {} => 'object'
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  // 如果传入的对象与缓存的相等, 则递归结束, 这样防止循环
  /**
   * 类似下面这种
   * var a = {b:1}
   * a.c = a
   */
  const hit = cache.filter((c) => c.original === obj)[0];
  if (hit) {
    return hit.copy;
  }

  const copy = Array.isArray(obj) ? [] : {};
  // 将copy首先放入cache, 因为我们需要在递归deepCopy的时候引用它
  cache.push({
    original: obj,
    copy,
  });
  Object.keys(obj).forEach((key) => {
    copy[key] = deepCopy(obj[key], cache);
  });

  return copy;
};


export {
  getSKUList,
  deepCopy,
};
