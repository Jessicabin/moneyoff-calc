<template>
  <div class="page_wrapper">
    <div class="main__wrapper">
      <el-tabs v-model="activeName">
        <el-tab-pane label="购物车" name="cart">
          <shopping-cart></shopping-cart>
        </el-tab-pane>
        <el-tab-pane label="品牌" name="brand">
          <brand-list></brand-list>
        </el-tab-pane>
      </el-tabs>
    </div>

    <money-off-result class="money-off-wrapper"></money-off-result>
  </div>
</template>

<script>
import ShoppingCart from "@/components/product/ShoppingCart.vue";
import BrandList from "@/components/brand/BrandList.vue";
import MoneyOffResult from "@/components/MoneyOffResult.vue";

export default {
  data() {
    return {
      activeName: "cart",
    };
  },
  components: { ShoppingCart, MoneyOffResult, BrandList },
  methods: {
    
  },
};
</script>

<style>
.page_wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.main__wrapper {
  overflow: hidden;
  flex: 1;
}
.money-off-wrapper {
  height: 400px;
  margin-top: 15px;
}
</style>


