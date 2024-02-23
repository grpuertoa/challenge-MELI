//Import multer module
const multer = require("multer");
//Import path
const path = require("path");

//Config the directory where the files are being stored
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //Uploads folder for storage
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

//Export upload multer
module.exports = upload;
