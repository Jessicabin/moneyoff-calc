<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增"
    width="30%"
    destroy-on-close
    center
  >
    <el-form ref="form" label-width="100px" :model="formModel" :rules="rules">
      <el-form-item label="商品名称" prop="productName">
        <el-input v-model="formModel.productName" />
      </el-form-item>

      <el-form-item label="品牌" prop="brandId">
        <el-select v-model="formModel.brandId" placeholder="请选择品牌">
          <el-option
            v-for="bItem in brandOptions"
            :key="bItem.value"
            :label="bItem.label"
            :value="bItem.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="价格" prop="price">
        <el-input v-model.number="formModel.price" />
      </el-form-item>

      <el-form-item label="品类券类型" prop="categoryCouponType">
        <el-select
          v-model="formModel.categoryCouponType"
          placeholder="请选择品类券类型"
        >
          <el-option
            v-for="cItem in categoryCouponOptions"
            :key="cItem.value"
            :label="cItem.label"
            :value="cItem.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="满减类型" prop="moneyOffId">
        <el-select v-model="formModel.moneyOffId" placeholder="请选择满减类型">
          <el-option
            v-for="mItem in moneyOffOptions"
            :key="mItem.value"
            :label="mItem.label"
            :value="mItem.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="商品券金额" prop="productCoupon">
        <el-input v-model.number="formModel.productCoupon" />
      </el-form-item>

      <el-form-item label="拍下立减金额" prop="cutPrice">
        <el-input v-model.number="formModel.cutPrice" />
      </el-form-item>

      <el-form-item label="定金" prop="deposit">
        <el-input v-model.number="formModel.deposit" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="handleConfirm"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import useStore from "@/stores";
import { cloneDeep } from "lodash";
import { PRODUCT_MODEL, PRODUCT_FORM_RULES } from "@/models";

export default {
  data() {
    return {
      dialogVisible: false,
      formModel: {},
      rules: PRODUCT_FORM_RULES,
    };
  },
  setup() {
    const { cart } = useStore();
    const categoryCouponOptions = cart.categoryCouponMapping.options;
    const moneyOffOptions = cart.moneyOffMapping.options;
    const brandOptions = cart.brandMapping.options;

    return { cart, categoryCouponOptions, moneyOffOptions, brandOptions };
  },
  methods: {
    initDialog({ row } = {}) {
      this.dialogVisible = true;
      this.formModel = cloneDeep(row || PRODUCT_MODEL);
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    async handleConfirm() {
      await this.$refs.form.validate((valid, fields) => {
        if (valid) {
          this.cart.addProduct(this.formModel);
          this.closeDialog();
        } else {
          console.log("error submit!", fields);
        }
      });
    },
  },
};
</script>
