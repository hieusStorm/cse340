const utilities = require(".")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
*  Registration Data Validation Rules
* ********************************* */
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a first name."), // on error this message is sent.
  
    // lastname is required and must be string
    body("account_lastname")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage("Please provide a last name."), // on error this message is sent.
  
    // valid email is required and cannot already exist in the database
    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email)
      if (emailExists){
        throw new Error("Email exists. Please log in or use different email")
      }
    }),
  
    // password is required and must be strong password
    body("account_password")
    .trim()
    .notEmpty()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
* Check data and return errors or continue to registration
* ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/signUp", {
      errors,
      title: "Sign Up",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()

}

// check login data
validate.loginRules = () => {
  return [
    //must be a valid email
    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("A valid email is required."),

    //must be a valid password
    body("account_password")
    .trim()
    .notEmpty()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password does not meet requirements."),
  ]
}

validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "login",
      nav,
      account_email,
    })
    return
  }
  next()

}

// rules for updating account info
validate.accountUpdateRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a first name."), // on error this message is sent.
  
    // lastname is required and must be string
    body("account_lastname")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage("Please provide a last name."), // on error this message is sent.
  
    // valid email is required and cannot already exist in the database
    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email)
      const currentEmail = await accountModel.getAccountByEmail(account_email)
      const emailChange = (currentEmail.account_email == account_email) ? false : true
      if (emailExists && emailChange){
        throw new Error("Email exists. Please log in or use different email")
      }
    }),
  ]
}

validate.checkUpdateData = async(req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    res.render("account/update", {
      nav,
      title: "update",
      errors,
      account_firstname,
      account_lastname,
      account_email,
      account_id: jwt.decode(req.cookies.jwt).account_id
  })
    return
  }
  next()
}

validate.passwordUpdateRules = () => {
  return [
    // password is required and must be strong password
    body("account_password")
    .trim()
    .notEmpty()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password does not meet requirements."),
  ]
}

validate.checkPasswordChange = async(req, res, next) => {
  const {account_password} = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    const jwtInfo = jwt.decode(req.cookies.jwt)
    const account_firstname = jwtInfo.account_firstname
    const account_lastname = jwtInfo.account_lastname
    const account_email = jwtInfo.account_email
    const account_id = jwtInfo.account_id
    const nav = await utilities.getNav()
    res.render("account/update", {
      nav,
      title: "Update",
      errors,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
    return
  }
  next()
}
  
module.exports = validate