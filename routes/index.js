var express = require("express");
const { append } = require("express/lib/response");
const { default: mongoose } = require("mongoose");
const information = require("../public/javascripts/information");
var router = express.Router();
const multer = require("multer");
router.use(express.urlencoded());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg")
      cb(null, "public/images/");
    else if (file.mimetype == "application/pdf") cb(null, "public/pdf/");
  },
  filename: (req, file, cb) => {
    var extension = file.originalname.split(".");
    var ext = extension[extension.length - 1];

    var uploaded_file_name =
      file.fieldname +
      "-" +
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      "." +
      ext;

    cb(null, uploaded_file_name);
  },
});

const upload = multer({
  storage: storage,

  fileFilter: (req, file, callback) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "application/pdf"
    ) {
      callback(null, true);
    } else callback(null, false);
  },
  limits: 1024 * 1024 * 5,
});

mongoose
  .connect("mongodb://localhost:27017/firstmongodb")
  .then(result => {
    // console.log(result);
  })
  .catch(error => {
    console.log(error);
  });

/* GET home page. */
router.get("/", auth, function (req, res, next) {
  res.render("index");
});

router.get("/user", auth, (req, res) => {
  Product.find().then(reslut => {
    //console.log(allProducts.length);

    res.render("user_info", { products: reslut });
  });
});

router.post(
  "/user",
  upload.fields([{ name: "image" }, { name: "cv" }]),
  function (req, res) {
    const i = new information({
      name: req.body.name,
      email: req.body.email,
      image: req.files["image"][0].filename,
      cv: req.files["cv"][0].filename,
    });
    i.save((error, result) => {
      if (error) console.log(error);
      else console.log(result);
    });
    // console.log(req.files["cv"][0].filename);
    res.end();
    console.log("data inserted successful");
  }
);

function auth(req, res, next) {
  next();
}
module.exports = router;
