//Import express for web server
const express = require("express");
//Import fileReader module
const fileReader = require("./src/fileReader");
//Import apiHandler
const apiHandler = require("./src/apiHandler");
//Import multer
const upload = require("./src/multer");
//Import path
const path = require("path");

const app = express();
const PORT = 3009;
const IP_ADDRESS = "127.0.0.1";

//Middleware for JSON req
app.use(express.json());

//Load file microservice
app.post("/load-file", upload.single("file"), async (req, res) => {
  try {
    //Params to be asked on postman
    const { originalname } = req.file;

    //read the file format extracting the original name
    const format = path.extname(originalname).toLowerCase().substring(1);

    try {
      //Process file sending name, format and delimiter
      const { original, joined } = await fileReader.processFile(
        req.file.originalname,
        format,
        req.body.delimiter
      );
      //call apiHandler
      apiHandler.getItems(original, joined, res);
    } catch (error) {
      console.error("Error handling API:", error.message);
    }

    res.json({
      message: `Processed data: successful, format: ${format} `,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: `Processed data: failed: ${error.message}` });
  }
});

//Listen app.js
app.listen(PORT, IP_ADDRESS, () => {
  console.log(`Servidor corriendo en http://${IP_ADDRESS}:${PORT}`);
});
