const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

//log in
router.get("/login/", utilities.handleErrors(accountController.buildLogin))
// sign up view
router.get("/signUp/", utilities.handleErrors(accountController.buildSignUp))
//submit sign up
router.post(
    "/signUp/",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router