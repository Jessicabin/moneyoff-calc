export const BRAND_MODEL = {
  brandName: "",
}

export const BRAND_FORM_RULES = {
  brandName: [
    {
      required: true,
      message: "请输入品牌名称",
      trigger: "blur",
    },
  ],
}

export const PRODUCT_MODEL = {
  productName: '', //商品名
  brandId: null, //品牌ID
  price: 0, //价格
  categoryCouponType: null, //品类券类型
  moneyOffId: 0, //满减类型ID
  productCoupon: 0,  //商品券
  cutPrice: 0, //拍下立减
  deposit: 0 //定金
}

export const PRODUCT_FORM_RULES = {
  productName: [
    {
      required: true,
      message: "请输入商品名称",
      trigger: "blur",
    },
  ],
  brandId: [
    {
      required: true,
      message: '请选择品牌',
      trigger: 'change',
    },
  ],
  price: [
    { required: true, message: '请输入价格' },
    { type: 'number', message: '请输入数字' },
  ],
  productCoupon: [
    { type: 'number', message: '请输入数字' },
  ],
  cutPrice: [
    { type: 'number', message: '请输入数字' },
  ],
  deposit: [
    { type: 'number', message: '请输入数字' },
  ],
}