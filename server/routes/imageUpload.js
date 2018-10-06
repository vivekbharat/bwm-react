const express = require("express");
const router = express();
const UserController = require("../controllers/user");
const imageUpload = require("../services/imageUpload");

const singleUpload = imageUpload.single("image");

router.post("/image-upload", UserController.authMiddleware, function(req, res) {
  singleUpload(req, res, function(err) {
    if (err) {
      return res.status(422).send({
        errors: [{ title: "Image Upload Error", detail: err.message }]
      });
    }
    return res.json({ imageUrl: req.file.location });
  });
});

module.exports = router;
