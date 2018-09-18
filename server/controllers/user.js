const Users = require("../models/Users");
const { normalizeErrors } = require("../helpers/mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const config = require("../config/dev");

exports.auth = (req, res) => {
  const { email, password } = req.body;

  if (!password || !email) {
    res.status(422).send({
      errors: [
        {
          title: "Invalid Credentials!",
          detail: "Provide Username and Passsword"
        }
      ]
    });
  }

  Users.findOne({ email })
    .then(user => {
      // console.log()
      if (!user) {
        // console.log("It ran 5", user);

        res.status(422).send({
          errors: [
            {
              title: "Invalid User!",
              detail: "User does not exist"
            }
          ]
        });
      }

      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          //User Matched
          const payload = {
            userId: user.id,
            username: user.username
          };

          //Sign Token
          jwt.sign(
            payload,
            config.SECRET,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                token: token
              });
            }
          );
        } else {
          res.status(422).send({
            errors: [
              {
                title: "Incorrect Password",
                detail: "Incorrect Email or Password"
              }
            ]
          });
        }
      });
    })
    .catch(err =>
      res.status(422).send({
        errors: "Not Found"
      })
    );
};

exports.register = (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!password || !email)
    res.status(422).send({
      errors: [
        {
          title: "Invalid Credentials!",
          detail: "Provide Username and Passsword"
        }
      ]
    });

  if (password !== confirmPassword)
    res.status(422).send({
      errors: [
        {
          title: "invalid Password",
          detail: "Password and Confirm Password DOes not match"
        }
      ]
    });

  // res.send({ username, email });
  Users.findOne({ email })
    .then(user => {
      if (user) {
        return res.status(422).send({
          errors: [
            {
              title: "Invalid Email!",
              detail: "User with this Email already exists"
            }
          ]
        });
      }

      const newUser = new Users({
        username,
        email,
        password
      });

      newUser
        .save()
        .then(user => res.json({ Registered: true }))
        .catch(err =>
          res.status(422).send({
            errors: normalizeErrors(err.errors)
          })
        );
    })
    .catch(err =>
      res.status(422).send({
        errors: normalizeErrors(err.errors)
      })
    );
};

exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const user = parseToken(token);

    Users.findById(user.userId)
      .then(user => {
        if (user) {
          res.locals.user = user;
          next();
        } else {
          return res.status(422).send({
            errors: [
              {
                title: "Not Authorized",
                detail: "Please Login to access"
              }
            ]
          });
        }
      })
      .catch(err =>
        res.status(401).json({
          errors: [
            {
              title: "Not Authorized",
              detail: "Please Login to access"
            }
          ]
        })
      );
  } else {
    return res.status(401).json({
      errors: [
        {
          title: "Not Authorized",
          detail: "Please Login to access"
        }
      ]
    });
  }
};

const parseToken = token => {
  return jwt.verify(token.split(" ")[1], config.SECRET);
};

// const notAuthorized = res => {
//   return res.status(401).json({
//     errors: [
//       {
//         title: "Not Authorized",
//         detail: "Please Login to access"
//       }
//     ]
//   });
// };
