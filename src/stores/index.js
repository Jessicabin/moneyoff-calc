import { useCartStore } from "./cart";

// 统一导出useStore方法
export default function useStore() {
  return {
    cart: useCartStore(),
  };
}
