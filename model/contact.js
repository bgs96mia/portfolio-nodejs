const mongoose = require("mongoose");
//  Membuat Schema
const Contact = mongoose.model("Contact", {
  nama: {
    type: String,
    required: true,
  },
  nim: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
});

module.exports = Contact;
