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
    utilities.handleErrors(accountController.signUpAccount)
  )

// Process the login attempt
// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

//the logged in page
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccount))

//loggout
router.get("/logOut/", utilities.handleErrors(accountController.logOut))

//update account info view
router.get("/update/:account_id", utilities.handleErrors(accountController.buildUpdate))

//update account info
router.post("/update/", 
  regValidate.accountUpdateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.accountUpdate)
)
//update account password
router.post("/update/password/",
  regValidate.passwordUpdateRules(),
  regValidate.checkPasswordChange,
  utilities.handleErrors(accountController.updatePassword)
)
module.exports = router