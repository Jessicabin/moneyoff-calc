export default class Mapping {
  constructor(config = {}) {
    Object.assign(this, config);

    this.map = this.map ?? {};
    this.options = this.getOptions();
  }
  getOptions() {
    const arr = [];
    if (Object.keys(this.map).length) {
      for (let key in this.map) {
        // 如果是数字，转为number类型
        if (/^[0-9]*$/.test(key)) key = +key;
        // 默认都是下拉框的options
        let temp = {
          label: this.map[key],
          value: key,
        };

        arr.push(temp);
      }
    }

    return arr;
  }
}
