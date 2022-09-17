const mongoose = require("mongoose");
const { stringify } = require("querystring");
mongoose.connect("mongodb://127.0.0.1:27017/bagus", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
});

//  Menambahkan 1 Data Contact
// const contact1 = new Contact({
//   nama: "Annisa Armaynda",
//   nim: "G.111.20.0047",
//   email: "annisa@gmail.com",
// });

// contact1.save().then((contact) => console.log(contact));
