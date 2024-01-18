import "./validate.js";

const app = Vue.createApp({
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      apiUrl: "https://ec-course-api.hexschool.io/v2",
    };
  },
  methods: {
    login() {
      axios
        .post(`${this.apiUrl}/admin/signin`, this.user)
        .then((res) => {
          alert(res.data.message);
          const { token, expired } = res.data;
          document.cookie = `vueWeek3Token=${token}; expires=${new Date(
            expired
          )}`;
          window.location = "product.html";
        })
        .catch((err) => alert(err.data.message));
    },
  },
});

app.component("VForm", VeeValidate.Form);
app.component("VField", VeeValidate.Field);
app.component("ErrorMessage", VeeValidate.ErrorMessage);

app.mount("#app");
