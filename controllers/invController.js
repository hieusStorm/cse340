const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

// build car info by inventory ID
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getInventoryByInventoryId(inventory_id)
  const flex = await utilities.buildInventoryFlex(data)
  let nav = await utilities.getNav()
  const carName = `${data[0].inv_make} ${data[0].inv_model}`
  console.log(flex)
  res.render("./inventory/detail", {
    title: carName,
    nav,
    flex,
    errors: null,
  })
}

module.exports = invCont