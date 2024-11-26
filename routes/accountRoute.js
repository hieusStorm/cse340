const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")

//log in
router.get("/login/", utilities.handleErrors(accountController.buildLogin))
// sign up view
router.get("/signUp/", utilities.handleErrors(accountController.buildSignUp))
//submit sign up
router.post('/signUp/', utilities.handleErrors(accountController.signUpAccount)) 

module.exports = router