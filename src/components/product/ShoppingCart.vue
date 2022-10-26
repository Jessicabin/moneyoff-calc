<template>
  <el-button type="primary" @click="handleAdd">新增商品</el-button>
  <el-button type="primary" @click="cart.saveProductList">保存</el-button>

  <el-table :data="productList" style="width: 100%" max-height="300">
    <el-table-column prop="id" label="ID" width="100" />
    <el-table-column prop="productName" label="商品名" width="150" />
    <el-table-column prop="price" label="活动价" width="120" />
    <!-- <el-table-column prop="categoryCouponType" label="品类券" width="120">
      <template #default="{ row }">
        <el-tag v-if="row.categoryCouponType">{{
          categoryCouponMapping.map[row.categoryCouponType]
        }}</el-tag>
      </template>
    </el-table-column> -->
    <el-table-column prop="moneyOffId" label="满减活动" width="100">
      <template #default="{ row }">
        <el-tag v-if="row.moneyOffId !== undefined">{{
          moneyOffMapping.map[row.moneyOffId]
        }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="productCoupon" label="商品券" width="120" />
    <el-table-column prop="cutPrice" label="拍下立减" width="120" />
    <el-table-column prop="deposit" label="定金" width="120" />
    <el-table-column fixed="right" label="操作" width="120">
      <template #default="scope">
        <el-button
          link
          type="primary"
          size="small"
          @click.prevent="cart.deleteProduct(scope.$index)"
        >
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <add-product ref="add"></add-product>
</template>

<script >
import { storeToRefs } from "pinia";
import AddProduct from "./AddProduct.vue";
import useStore from "@/stores";

import { computed } from "vue";

export default {
  components: { AddProduct },
  data() {
    return {
      columns: [],
    };
  },
  setup() {
    const { cart } = useStore();

    const { productList } = storeToRefs(cart);

    const categoryCouponMapping = computed(() => cart.categoryCouponMapping);
    const moneyOffMapping = computed(() => cart.moneyOffMapping);

    return { cart, productList, categoryCouponMapping, moneyOffMapping };
  },
  methods: {
    handleAdd() {
      this.$refs.add.initDialog();
    },
  },
};
</script>
