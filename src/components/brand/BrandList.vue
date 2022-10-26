<template>
  <el-button type="primary" @click="handleAdd">新增品牌</el-button>
  <el-button type="primary" @click="cart.saveBrandList">保存</el-button>

  <el-table :data="brandList" style="width: 100%" max-height="300">
    <el-table-column prop="id" label="ID" width="120" />
    <el-table-column prop="brandName" label="品牌名" width="150" />
    <el-table-column label="操作" width="120">
      <template #default="scope">
        <el-button
          link
          type="primary"
          size="small"
          @click.prevent="cart.deleteBrand(scope.$index)"
        >
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <add-brand ref="add"></add-brand>
</template>

<script >
import { storeToRefs } from "pinia";
import useStore from "@/stores";
import AddBrand from "./AddBrand.vue";

export default {
  components: { AddBrand },
  data() {
    return {
      columns: [],
    };
  },
  setup() {
    const { cart } = useStore();

    const { brandList } = storeToRefs(cart);

    return { cart, brandList };
  },
  methods: {
    handleAdd() {
      this.$refs.add.initDialog();
    },
  },
};
</script>
