<<<<<<< HEAD
const port = process.env.PORT || 3001,
  express = require("express"),
  upload = require("express-fileupload"),
  fs = require("fs"),
  path = require("path"),
  serveWith = express();
=======
const http = require("http"),
      port = 3001,
      express = require("express"), // express framework for nodejs
      upload = require("express-fileupload"), // uploader library used ----> https://www.npmjs.com/package/express-fileupload
      fs = require("fs"),
      path = require("path"),
      serveWith = express();


>>>>>>> 98a284588fefbe6aa2dc7e3cce92b7cf9e857271
serveWith.listen(port);
serveWith.use(upload());
console.log("Server is now running at http://localhost:3001/");


// getting file names for fetch purposes 

serveWith.get("/getFiles", (req, res) => {
  const uploadedFiles = fs.readdirSync("./uploads", (err, files) => {
    if (err) throw err;
  });
  res.send({
    uploadedFiles: uploadedFiles
  });
});

// getting file names for download purposes 

serveWith.get("/download", (req, res) => {
  const file = req.query.filename;
  var filePath = path.join(__dirname, `uploads/${req.query.filename}`);
  console.log(filePath);
  res.download(filePath);
});

// uploading files 
serveWith.post("/", (req, res) => {
  const fileName = req.files.file.name;
  req.files.file.mv(`./uploads/${fileName}`, function(err) {
    if (err) return res.status(500).send(err);
    res.send({
      message: "File uploaded!"
    });
  });
});
module.exports = serveWith;
