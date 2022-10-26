<template>
  <div>
    <div class="calc-btn__wrapper">
      <el-form ref="form" label-width="100px" :inline="true">
        <el-form-item label="满减类型">
          <el-select
            v-model="calcCon.moneyOffId"
            placeholder="请选择满减类型"
            style="width: 100px"
          >
            <el-option
              v-for="mItem in moneyOffOptions"
              :key="mItem.value"
              :label="mItem.label"
              :value="mItem.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="满减精度">
          <el-input v-model="calcCon.surplus" style="width: 100px" />
        </el-form-item>
      </el-form>

      <el-button @click="handleCalcMoneyOff">极限满减方案</el-button>
    </div>
    <div class="sln__wrapper">
      <el-table-v2
        v-loading="loading"
        :columns="columns"
        :data="sln"
        :width="1800"
        :height="300"
      />
    </div>
  </div>
</template>

<script>
import { toRaw } from "vue";
import { sum, subsetsWithDup, arrayToMap } from "@/utils";
import useStore from "@/stores";
import { sumBy, groupBy } from "lodash";

export default {
  data() {
    return {
      sln: [],
      loading: false,
      columns: [],
      calcCon: {
        //计算条件
        moneyOffId: 0,
        surplus: 0,
      },
    };
  },
  setup() {
    const { cart } = useStore();
    const { options: moneyOffOptions, config: moneyOffConfig } =
      cart.moneyOffMapping;
    const productList = toRaw(cart.productList);

    return {
      cart,
      moneyOffOptions,
      moneyOffConfig,
      productList,
      productMap: arrayToMap({ array: productList, key: "id", value: "item" }),
    };
  },
  created() {
    this.loading = false;
    this.generateColumns();
  },
  methods: {
    async handleCalcMoneyOff() {
      this.loading = true;
      this.sln = await this.calc(this.productList);
      this.loading = false;
    },
    async calc(list) {
      const ids = list.map((item) => item.id); //通过id 进行子集穷举
      const idSubsets = subsetsWithDup(ids);
      const orders = await this.getProductSubset(idSubsets);

      const moneyOffSubsets = await this.calcMoneyOff(orders);
      console.log(moneyOffSubsets);
      // // const shoppingCartCouponSubset = await this.getShoppingCartSubset(
      // //   moneyOffSubsets
      // // );

      // const result = this.getBalanceSubsets(moneyOffSubsets)
      //   .sort((a, b) => a.balance - b.balance)
      //   .map((v, i) => Object.assign(v, { i }));

      // return Promise.resolve(result);
      return Promise.resolve(moneyOffSubsets);
    },
    judgeSameBrandProduct(order) {
      let flag = false;

      const groupByBrand = groupBy(order, (item) => item.brandId);
      for (const brandId in groupByBrand) {
        const products = groupByBrand[brandId];
        if (products.length > 1) {
          const productCoupons = products
            .map((i) => i.productCoupon)
            .filter((i) => i);
          if (productCoupons.length > 1) {
            flag = true;
          }
        }
      }

      return flag;
    },
    getProductSubset(list = []) {
      //将id子集还原为商品列表，并检查同店铺是否有两个
      return new Promise((resolve) => {
        const result = [];
        list.forEach((item) => {
          const order = item.map((id) => this.productMap[id]);

          if (order.length && !this.judgeSameBrandProduct(order)) {
            result.push({
              order,
              total: sumBy(order, (item) => item.price),
              products: order.map((i) => i.productName).join("|"),
            });
          }
        });

        resolve(result);
      });
    },
    //满减子集
    calcMoneyOff(list = []) {
      const { threshold, off } = this.moneyOffConfig[this.calcCon.moneyOffId];

      const result = list
        .map((v) => {
          const moneyOffTotal = Math.round(v.total / threshold) * off; //订单满减金额
          const difference = v.total % threshold; //总金额与满减倍数差值
          return Object.assign(v, { difference, moneyOffTotal });
        })
        .filter((v) => v.difference <= this.calcCon.surplus)
        .sort((a, b) => a.difference - b.difference);
        
      return Promise.resolve(result);
    },
    // getShoppingCartSubset(arr = []) {
    //   const result = [];
    //   arr.forEach((subset) => {
    //     const { itemList } = subset;
    //     // const priceTotal = sum(itemList.map(i => i.price))
    //     shoppingCouponList.forEach((coupon) => {
    //       const { couponType, threshold, value } = coupon;
    //       const total = sum(
    //         itemList
    //           .filter((i) => i.categoryCouponType === couponType)
    //           .map((i) => i.price)
    //       );
    //       if (total && total > threshold) {
    //         result.push(
    //           Object.assign(subset, {
    //             shoppingCoupon: couponType,
    //             shoppingCouponTotal: value,
    //           })
    //         );
    //       }
    //     });
    //   });
    //   return Promise.resolve(result);
    // },
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

<style scoped>
.calc-btn__wrapper {
  display: flex;
}
</style>
