const express = require("express");
const router = express.Router();
// const User = require("../models/Users");

const Users = require("../controllers/user");

router.post("/auth", Users.auth);

router.post("/register", Users.register);

module.exports = router;
// Q7uV0tZ*pIbK
// S9aU5f[%wDpN
