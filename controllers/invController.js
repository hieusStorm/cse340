const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const { classification } = require("../utilities/inventory-validation")

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
  res.render("./inventory/detail", {
    title: carName,
    nav,
    flex,
    errors: null,
  })
}

// build management view
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()

  res.render("./inventory/management", {
    title: "Management",
    nav,
    classificationSelect,
    errors: null
  })
}

// BUild add classification page
invCont.buildAddClassifaction = async (req, res, next) => {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  })
}

// add classifcation to table
invCont.addClassification = async (req, res) => {
  const { classification_name } = req.body
  const reqResult = await invModel.addClassification(classification_name)
  let nav = await utilities.getNav()

  if (reqResult) {
    const classificationSelect = await utilities.buildClassificationList()

    req.flash(
      "notice",
      `Congratulations, you\'ve added ${classification_name} as a classification.`
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      classificationSelect,
    })
  } else {
    req.flash("notice", "Sorry, failed adding the classification.")
    res.status(501).render("inventory/add-classification", {
      title: "Registration",
      nav,
    })
  }
}

// build add inventory page
invCont.buildAddInventory = async (req, res, next) => {
  let nav = await utilities.getNav()
  let classifications = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classifications,
    errors: null
  })
}

// add inventory
invCont.addInventory = async (req, res) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id } = req.body
  const reqResult = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id)
  let nav = await utilities.getNav()

  if (reqResult) {
    const classificationSelect = await utilities.buildClassificationList()
    req.flash(
      "notice",
      `Congratulations, you\'ve added ${inv_make} ${inv_model}.`
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      classificationSelect,
    })
  } else {
    const classifications = await utilities.buildClassificationList()
    req.flash("notice", "Sorry, failed adding Inventory.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

// build edit inventory page
invCont.buildEditInventory = async (req, res, next) => {
  let inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  let inventoryData = await invModel.getInventoryByInventoryId(inv_id)
  let classifications = await utilities.buildClassificationList(inventoryData[0].classification_id)
  let itemName = `${inventoryData[0].inv_make} ${inventoryData[0].inv_model}`
  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classifications,
    errors: null,
    inv_id: inventoryData[0].inv_id,
    inv_make: inventoryData[0].inv_make,
    inv_model: inventoryData[0].inv_model,
    inv_year: inventoryData[0].inv_year,
    inv_description: inventoryData[0].inv_description,
    inv_image: inventoryData[0].inv_image,
    inv_thumbnail: inventoryData[0].inv_thumbnail,
    inv_price: inventoryData[0].inv_price,
    inv_miles: inventoryData[0].inv_miles,
    inv_color: inventoryData[0].inv_color,
    classification_id: inventoryData[0].classification_id
  })
}

// Edit inventory
invCont.updateInventory = async (req, res, next) => {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("../inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classifications: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

module.exports = invCont