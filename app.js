const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const { body, validationResult, check } = require("express-validator");
const methodOverride = require("method-override");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

require("./utils/db");
const Contact = require("./model/contact");

const app = express();
const port = 3000;

// Set-up method override
app.use(methodOverride("_method"));

// Set-up EJS
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Konfigurasi flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

// Halaman Home
app.get("/", (req, res) => {
  const mahasiswa = [
    {
      nama: "Bagus Setiawan",
      nim: "G.111.20.0050",
    },
    {
      nama: "Annisa Armaynda",
      nim: "G.111.20.0047",
    },
    {
      nama: "Eka Octa Difa",
      nim: "G.111.20.0013",
    },
  ];
  res.render("index", {
    nama: "Bagus Setiawan",
    title: "Halaman Home",
    mahasiswa,
    layout: "layouts/main-layout",
  });
});

// Halaman About
app.get("/about", (req, res) => {
  res.render("about", {
    layout: "layouts/main-layout",
    title: "Halaman About",
  });
});

// Halaman Contact
app.get("/contact", async (req, res) => {
  const contacts = await Contact.find();

  res.render("contact", {
    layout: "layouts/main-layout",
    title: "Halaman Contact",
    contacts,
    msg: req.flash("msg"),
  });
});

//  Halaman Tambah data contact
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "From Tambah Data Contact",
    layout: "layouts/main-layout",
  });
});

//  Proses tambah data contact
app.post(
  "/contact",
  [
    body("nama").custom(async (value) => {
      const duplikat = await Contact.findOne({ nama: value });
      if (duplikat) {
        throw new Error("Nama Contact Sudah ada..!");
      }
      return true;
    }),
    check("email", "Email tidak valid..").isEmail(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", {
        title: "From Tambah Data Contact",
        layout: "layouts/main-layout",
        errors: errors.array(),
      });
    } else {
      Contact.insertMany(req.body, (error, result) => {
        //  Kirimka Flash
        req.flash("msg", "Data contact berhasil ditambahkan!");
        res.redirect("/contact");
      });
    }
  }
);

//  Proses delete contact
app.get("/contact/delete/:nim", async (req, res) => {
  const contact = await Contact.findOne({ nim: req.params.nim });
  if (!contact) {
    res.status("404");
    res.send("<h1>404</h1>");
  } else {
    Contact.deleteOne({ nim: req.params.nim }).then((result) => {
      req.flash("msg", "Data contact berhasil dihapus!");
      res.redirect("/contact");
    });
  }
});

// app.delete("/contact", (req, res) => {
//   Contact.deleteOne({ nim: req.body.nim }).then((result) => {
//     req.flash("msg", "Data contact berhasil dihapus!");
//     res.redirect("/contact");
//   });
// });

//  Halaman Ubah data contact
app.get("/contact/edit/:nim", async (req, res) => {
  const contact = await Contact.findOne({ nim: req.params.nim });
  res.render("edit-contact", {
    title: "From Ubah Data Contact",
    layout: "layouts/main-layout",
    contact,
  });
});

// Proses Ubaha data
app.put(
  "/contact",
  [
    body("nama").custom(async (value, { req }) => {
      const duplikat = await Contact.findOne({ nama: value });
      if (value !== req.body.oldNama && duplikat) {
        throw new Error("Nama Contact Sudah ada..");
      }
      return true;
    }),
    check("email", "Email tidak valid..").isEmail(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("edit-contact", {
        title: "From Ubah Data Contact",
        layout: "layouts/main-layout",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      Contact.updateOne(
        { _id: req.body._id },
        {
          $set: {
            nama: req.body.nama,
            nim: req.body.nim,
            email: req.body.email,
          },
        }
      ).then((result) => {
        //  Kirimkan Flash
        req.flash("msg", "Data contact berhasil diubah!");
        res.redirect("/contact");
      });
    }
  }
);

//  Halaman detail contact
app.get("/contact/:nim", async (req, res) => {
  const contact = await Contact.findOne({ nim: req.params.nim });
  res.render("detail", {
    layout: "layouts/main-layout",
    title: "Halaman Contact",
    contact,
  });
});

app.listen(port, () => {
  console.log(`Mongo Contact App | listening at http://localhost:${port}`);
});
