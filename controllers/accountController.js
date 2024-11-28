const utilities = require("../utilities/")
const accountModel = require("../models/account-model")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildSignUp(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/signUp", {
      title: "Sign Up",
      nav,
      errors: null,
    })
  }
  /* ****************************************
*  Process Registration
* *************************************** */
async function signUpAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
  
    const regResult = await accountModel.signUpAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re signed up  ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the sign up failed.")
      res.status(501).render("account/signUp", {
        title: "Registration",
        nav,
      })
    }
  }
  module.exports = { buildLogin, buildSignUp, signUpAccount }