<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增"
    width="30%"
    destroy-on-close
    center
  >
    <el-form ref="form" label-width="100px" :model="formModel" :rules="rules">
      <el-form-item label="品牌名称" prop="brandName">
        <el-input v-model="formModel.brandName" />
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
import { BRAND_MODEL,BRAND_FORM_RULES } from "@/models";

export default {
  data() {
    return {
      dialogVisible: false,
      formModel: {},
      rules: BRAND_FORM_RULES
    };
  },
  setup() {
    const { cart } = useStore();
    return { cart };
  },
  methods: {
    initDialog() {
      this.dialogVisible = true;
      this.formModel = cloneDeep(BRAND_MODEL);
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    async handleConfirm() {
      await this.$refs.form.validate((valid, fields) => {
        if (valid) {
          this.cart.addBrand(this.formModel);
          this.closeDialog();
        } else {
          console.log("error submit!", fields);
        }
      });
    },
  },
};
</script>
