const port = 3001,
  express = require("express"),
  upload = require("express-fileupload"),
  fs = require("fs"),
  path = require("path"),
  serveWith = express();
serveWith.listen(port);
serveWith.use(upload());
console.log("Server is now running at http://localhost:3001/");

serveWith.get("/getFiles", (req, res) => {
  const uploadedFiles = fs.readdirSync("./uploads", (err, files) => {
    if (err) throw err;
  });
  res.send({
    uploadedFiles: uploadedFiles
  });
});
serveWith.get("/download", (req, res) => {
  const file = req.query.filename;
  var filePath = path.join(__dirname, `uploads/${req.query.filename}`);
  console.log(filePath);
  res.setHeader("Content-Type", "application/pdf");
  res.download(filePath);
});
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
