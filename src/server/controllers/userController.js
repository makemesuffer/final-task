const md5 = require("md5");
const moment = require("moment");
const validator = require("email-validator");
const jwt = require("jsonwebtoken");

const config = require("../config");
const mailer = require("./../helpers/mailer");
const wrapAsync = require("../helpers/asyncErrorHandler");
const db = require("../loaders/db");

exports.registerUser = wrapAsync(async (req, res) => {
  const { login, password, firstName, lastName, birthDate } = req.body;

  if (!login || !password) {
    res.json({
      success: false,
      error: "Empty login or password"
    });
  }

  console.log(password);
  if (password.length < 8) {
    res.json({
      success: false,
      error: "Password must be at least 8 characters"
    });
  }

  if (moment().diff(birthDate, "years") < 18) {
    res.json({
      success: false,
      error: "maloy kakoe pivo tebe? S'ebal otsuda"
    });
  }

  if (!validator.validate(login)) {
    res.json({
      success: false,
      error: "login incorrect, need email format"
    });
  }

  const userData = {
    login,
    password: md5(password),
    birthDate,
    firstName,
    lastName
  };
  try {
    const result = await db.Users.create(userData);
    if (result.login) {
      const link = `http://localhost:1337/account/verify/${result._id}`;
      await mailer.send({
        source: "email-verification",
        login: userData.login,
        link
      });
      res.json({
        success: true,
        user: {
          login: result.login,
          available: result.available
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
});

exports.loginUser = wrapAsync(async (req, res) => {
  if (!req.body.password || !req.body.login) {
    res.json({
      success: false,
      error: "Password and login required"
    });
    return;
  }
  const userData = {
    login: req.body.login,
    password: md5(req.body.password)
  };
  const result = await db.Users.login(userData.login, userData.password);
  if (result) {
    const ans = {
      success: true,
      user: {
        login: result.login,
        available: result.available
      }
    };
    if (result.available) {
      const token = jwt.sign({ id: result._id }, config.jwtSECRET, {
        expiresIn: "14 days"
      });
      ans.accessTOKEN = token;
    }
    res.json(ans);
  } else {
    res.json({
      success: false,
      error: "Login or password is incorrect"
    });
  }
});