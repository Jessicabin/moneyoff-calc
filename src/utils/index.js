import { customAlphabet } from 'nanoid';

export const createId = () => {
  const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 8);
  return nanoid(8);
};


export const sum = (arr = []) => {
  let total = 0;
  arr.filter(i => i).forEach((i) => (total = total + i));
  return total;
};

export const subsetsWithDup = function (nums) {
  console.time('subsets')

  nums.sort((a, b) => a - b);
  let t = [], ans = [];
  const n = nums.length;
  for (let mask = 0; mask < (1 << n); ++mask) {
    t = [];
    let flag = true;
    for (let i = 0; i < n; ++i) {
      if ((mask & (1 << i)) != 0) {
        if (i > 0 && (mask >> (i - 1) & 1) == 0 && nums[i] == nums[i - 1]) {
          flag = false;
          break;
        }
        t.push(nums[i]);
      }
    }
    if (flag && t.length) {
      ans.push(t.slice());
    }
  }
  console.timeEnd('subsets')
  console.log(ans.length);

  return ans;
};

export const subsets = (items = []) => {
  console.time('subset')
  const res = [];
  const len = items.length;

  items = items.sort((a, b) => a.price - b.price);

  for (let i = 0; i < 1 << len; i++) {
    const itemList = [];
    for (let j = 0; j < len; j++) {
      if (i & (1 << j)) {
        itemList.push(items[j]);
      }
    }
    const isAllMoneyOff = !itemList.find((i) => !i.isMoneyOff)

    if (itemList.length && isAllMoneyOff) {
      res.push({ itemList, total: sum(itemList.map((i) => i.price)) });
    }
  }
  console.timeEnd('subset')
  console.log(res.length);
  return res;
}

export const downloadFile = (data, fileType, filename = '') => {
  const blob = new Blob([data], { type: `application/${fileType}` });
  filename = `${filename}.${fileType}`;

  if (window.navigator.msSaveOrOpenBlob) {
    // IE保存Blob对象
    navigator.msSaveBlob(blob, filename);
  } else {
    // 其他浏览器
    const link = document.createElement('a');
    const body = document.querySelector('body');
    /* window.URL.createObjectURL可以用于在浏览器上预览本地图片或者视频,创建一个url*/
    link.href = window.URL.createObjectURL(blob);// 为Blob对象创建一个url地址
    link.download = filename;
    /*
    如果不设置download属性的话，呢么如果是jpg、txt等浏览器支持打开的属性，就会在浏览器打开该文件而不是下载下来
    */

    // fix Firefox
    link.style.display = 'none';
    body.appendChild(link);

    link.click();
    body.removeChild(link);

    window.URL.revokeObjectURL(link.href);// 释放地址
  }
};

export const arrayToMap = ({ array = [], map = {}, key = 'id', value = 'item' }) => {
  array.forEach((item) => {
    const _key = key ? item[key] : item;
    const _value = value === 'item' ? item : item[value];
    map[_key] = _value;
  });
  return map;
};
