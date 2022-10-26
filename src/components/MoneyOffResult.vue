<template>
  <div>
    <el-button @click="handleCalcMoneyOff">极限满减方案</el-button>
    <div class="sln__wrapper">
      <el-table-v2
        v-loading="loading"
        :columns="columns"
        :data="sln"
        :width="1800"
        :height="380"
      />
    </div>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { sum, subsets,  } from "@/utils";
import { moneyOff, shoppingCouponList } from "@/constants/coupon";
import useStore from "@/stores";

export default {
  data() {
    return {
      sln: [],
      loading: false,
      columns: [],
    };
  },
  setup() {
    const { cart } = useStore();

    const { productList } = storeToRefs(cart);

    return { productList };
  },
  created() {
    this.loading = false;
    this.generateColumns();
  },
  methods: {
    async handleCalcMoneyOff() {
      const list = JSON.parse(JSON.stringify(this.productList));

      this.loading = true;
      this.sln = await this.calc(list);
      console.log(this.loading);
      this.loading = false;
    },
    async calc(list) {
      const _subsets = subsets(list);
      // subsetsWithDup(list.map((i) => i.price));

      const moneyOffSubsets = await this.getMoneyOffSubset(_subsets);

      // const shoppingCartCouponSubset = await this.getShoppingCartSubset(
      //   moneyOffSubsets
      // );

      const result = this.getBalanceSubsets(moneyOffSubsets)
        .sort((a, b) => a.balance - b.balance)
        .map((v, i) => Object.assign(v, { i }));

      return Promise.resolve(result);
    },
    //满减子集
    getMoneyOffSubset(list = []) {
      const { money, off } = moneyOff;

      const result = list
        .map((v) => {
          const moneyOffTotal = Math.round(v.total / money) * off; //订单满减金额
          const difference = v.total % money;
          return Object.assign(v, { difference, moneyOffTotal });
        })
        .filter((v) => v.difference === 0)
        .sort((a, b) => a.difference - b.difference);

      return Promise.resolve(result);
    },

    getShoppingCartSubset(arr = []) {
      const result = [];
      arr.forEach((subset) => {
        const { itemList } = subset;
        // const priceTotal = sum(itemList.map(i => i.price))
        shoppingCouponList.forEach((coupon) => {
          const { couponType, threshold, value } = coupon;
          const total = sum(
            itemList
              .filter((i) => i.categoryCouponType === couponType)
              .map((i) => i.price)
          );
          if (total && total > threshold) {
            result.push(
              Object.assign(subset, {
                shoppingCoupon: couponType,
                shoppingCouponTotal: value,
              })
            );
          }
        });
      });
      return Promise.resolve(result);
    },
    getBalanceSubsets(arr = []) {
      const result = [];
      arr.forEach((v) => {
        const { total, itemList, moneyOffTotal, shoppingCouponTotal = 0 } = v;
        const depositTotal = sum(itemList.map((i) => i.deposit));
        const productCouponTotal = sum(itemList.map((i) => i.productCoupon));
        const cutPriceTotal = sum(itemList.map((i) => i.cutPrice ?? 0));

        //实付 = 活动价总价-满减总金额-品类券-商品券/店铺券总金额-直降
        const balance =
          total -
          moneyOffTotal -
          shoppingCouponTotal -
          productCouponTotal -
          cutPriceTotal;

        if (balance >= 1000 && balance - 1000 < 50) {
          result.push(
            Object.assign(v, {
              balance,
              productCouponTotal,
              cutDeposit: balance - depositTotal,
              products: itemList.map((i) => i.productName).join("|"),
            })
          );
        }
      });

      return result;
    },
    generateColumns() {
      const columns = [
        {
          key: "i",
          title: "序号",
          width: 50,
        },
        {
          key: "products",
          title: "订单商品",
          width: 800,
        },
        {
          key: "total",
          title: "总计",
          width: 100,
        },
        {
          key: "balance",
          title: "实付",
          width: 100,
        },
        {
          key: "shoppingCoupon",
          title: "使用品类券",
          width: 100,
        },
      ];

      this.columns = columns.map((v) => {
        const { key } = v;
        return Object.assign(v, { props: key, dataKey: key });
      });
    },
  },
};
</script>

