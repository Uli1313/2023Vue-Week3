import "./validate.js";

let productModal = "";
let delProductModal = "";

const app = Vue.createApp({
  data() {
    return {
      apiUrl: "https://ec-course-api.hexschool.io/v2",
      products: [],
      isNew: false, // 用來控制 modal 的標題以及 API 請求種類 -> 編輯(put)或新增(post)產品
      tempProduct: {
        imagesUrl: [],
      },
    };
  },
  mounted() {
    // 取得 token 來進行驗證
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)vueWeek3Token\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common["Authorization"] = token;
    this.checkLogin();

    // 建立實體 modal
    productModal = new bootstrap.Modal(document.querySelector("#productModal"));
    delProductModal = new bootstrap.Modal(
      document.querySelector("#delProductModal")
    );
  },
  methods: {
    // 驗證 token
    checkLogin() {
      const url = `${this.apiUrl}/api/user/check`;
      axios
        .post(url)
        .then((res) => this.getProductData())
        .catch((err) => {
          alert(err.data.message);
          window.location = "index.html";
        });
    },
    // 取得產品資料
    getProductData() {
      const url = `${this.apiUrl}/api/uli01/admin/products/all`;
      axios
        .get(url)
        .then((res) => (this.products = res.data.products))
        .catch((err) => console.log(err));
    },
    // 新增 / 編輯產品資料
    updateProduct() {
      // isNew 為 true 時是新增產品
      let url = `${this.apiUrl}/api/uli01/admin/product`;
      let http = "post";

      //  isNew 為 false 時是編輯產品
      if (!this.isNew) {
        url = `${this.apiUrl}/api/uli01/admin/product/${this.tempProduct.id}`;
        http = "put";
      }

      axios[http](url, { data: this.tempProduct })
        .then((res) => {
          alert(res.data.message);
          productModal.hide();
          this.getProductData();
        })
        .catch((err) => {
          alert(err.data.message.join(", "));
        });
    },
    // 依照 modal 種類開啟相對應的 modal
    // 並在 tempProduct 帶入相關資料來進行後續的操作
    openModal(type, item) {
      if (type === "new") {
        // 新增產品
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      } else if (type === "edit") {
        // 編輯產品
        // 拷貝一份讓使用者在編輯中的時候不會直接變動到原本的資料
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
      } else if (type === "delete") {
        // 刪除產品
        this.tempProduct = { ...item };
        delProductModal.show();
      }
    },
    // 刪除單一產品
    delProduct() {
      const url = `${this.apiUrl}/api/uli01/admin/product/${this.tempProduct.id}`;
      axios
        .delete(url)
        .then((res) => {
          alert(res.data.message);
          // 隱藏 modal 並重新獲取產品資料
          delProductModal.hide();
          this.getProductData();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    // 尚無圖片時新增一個陣列
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push("");
    },
  },
});

app.component("VForm", VeeValidate.Form);
app.component("VField", VeeValidate.Field);
app.component("ErrorMessage", VeeValidate.ErrorMessage);

app.mount("#app");
