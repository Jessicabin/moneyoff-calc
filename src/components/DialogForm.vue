<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增"
    width="30%"
    destroy-on-close
    center
  >
    <span>This is a message</span>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="handleConfirm"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
    initDialog() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    handleConfirm() {
      this.closeDialog();
    },
  },
};
</script>
