VeeValidate.defineRule("email", VeeValidateRules["email"]);
VeeValidate.defineRule("required", VeeValidateRules["required"]);

VeeValidateI18n.loadLocaleFromURL(
  "https://unpkg.com/@vee-validate/i18n@4.5.8/dist/locale/zh_TW.json"
);

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize("zh_TW"),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});
