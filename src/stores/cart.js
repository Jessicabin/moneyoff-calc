import { defineStore } from "pinia";
import { downloadFile, createId, arrayToMap } from '@/utils';
import { ElMessage } from 'element-plus'
import { last } from 'lodash'
import Mapping from "@/utils/mapping";

export const useCartStore = defineStore("cart", {
  state: () => ({
    productList: [],
    brandList: [],
    categoryCouponList: [
      { id: 0, couponName: "美妆惊喜券", couponType: "makeup", threshold: 1200, off: 110 },
      { id: 1, couponName: "精致生活券", couponType: "life", threshold: 200, off: 15 }
    ], //品类券
    moneyOffList: [
      { id: 0, label: '300-50', threshold: 300, off: 50, },
      { id: 1, label: '200-30', threshold: 200, off: 30, }
    ], //满减活动
    productNextId: 0
  }),
  getters: {
    brandMapping: (state) =>
      new Mapping({ map: arrayToMap({ array: state.brandList, key: 'id', value: 'brandName' }) }),
    categoryCouponMapping: (state) =>
      new Mapping({ map: arrayToMap({ array: state.categoryCouponList, key: 'couponType', value: 'couponName' }) }),
    moneyOffMapping: (state) =>
      new Mapping({
        map: arrayToMap({ array: state.moneyOffList, key: 'id', value: 'label' }),
        config: arrayToMap({ array: state.moneyOffList, key: 'id', value: 'item' }),
      }),
  },
  actions: {
    addProduct(data) {
      const productItem = { ...data, id: this.productNextId }
      const { productName } = productItem

      const sameItem = this.productList.find(i => i.productName === productName)
      if (!sameItem) {
        this.productList.push(productItem);
        this.productNextId = this.productNextId + 1
      } else {
        ElMessage.error('重复添加！')
      }
    },
    deleteProduct(index) {
      this.productList.splice(index, 1);
    },
    saveProductList() {
      downloadFile(JSON.stringify(this.productList, null, 2), 'json', 'shoppingCart')
    },
    importProductList(data) {
      this.productList = data
      const lastId = last(data.sort((a, b) => a.id - b.id)).id
      this.productNextId = lastId + 1
    },
    addBrand(data) {
      const brandItem = { ...data, id: createId() }
      const { brandName } = brandItem
      const sameItem = this.brandList.find(i => i.brandName === brandName)
      if (!sameItem) {
        this.brandList.push(brandItem)
      } else {
        ElMessage.error('重复添加！')
      }
    },
    deleteBrand(index) {
      this.brandList.splice(index, 1);
    },
    saveBrandList() {
      downloadFile(JSON.stringify(this.brandList, null, 2), 'json', 'brandList')
    },

  },
  persist: true,
});
