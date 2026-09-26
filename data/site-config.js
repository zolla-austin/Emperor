const EMPEROR_SITE_CONFIG = Object.freeze({
  whatsappNumber: "2347041793529",
  phoneDisplay: "+234 704 179 3529",

  payment: Object.freeze({
    bank: "OPay",
    accountName: "Cletus Austine Idu",
    accountNumber: "7041793529",
  }),

  createOrderMessage(productName, displayedPrice) {
    return `Hello Emperor, I'd like to order: ${productName} - ${displayedPrice}. I have made payment to the OPay account. Please confirm.`;
  },

  instagramUrl: "https://www.instagram.com/code_with_austine",
});
