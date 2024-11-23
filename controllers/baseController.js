const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

baseController.forceError = async function (req, res) {
  throw new Error("Error 500 thrown")
}
module.exports = baseController