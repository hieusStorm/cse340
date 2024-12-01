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
  const classifications = await invModel.getClassifications()
  const inventoryItems = await invModel.getInventory()
  let nav = await utilities.getNav()
  let classificationList = "<ul>"
  let inventoryList = "<ul>"

  classifications.rows.forEach(classification => {
    classificationList += `<li>${classification.classification_name}</li>`
  })
  classificationList += "</ul>"

  inventoryItems.rows.forEach(inventoryItem => {
    inventoryList += `<li>${inventoryItem.inv_make} ${inventoryItem.inv_model}</li>`
  })
  inventoryList += "</ul>"

  res.render("./inventory/management", {
    title: "Management",
    nav,
    classification: classificationList,
    inventory: inventoryList,
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
    const classifications = await invModel.getClassifications()
    const inventoryItems = await invModel.getInventory()
    let classificationList = "<ul>"
    let inventoryList = "<ul>"
    classifications.rows.forEach(classification => {
      classificationList += `<li>${classification.classification_name}</li>`
    })
    classificationList += "</ul>"
    
    inventoryItems.rows.forEach(inventoryItem => {
      inventoryList += `<li>${inventoryItem.inv_make} ${inventoryItem.inv_model}</li>`
    })
    inventoryList += "</ul>"

    req.flash(
      "notice",
      `Congratulations, you\'ve added ${classification_name} as a classification.`
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      classification: classificationList,
      inventory: inventoryList,
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
    const classifications = await invModel.getClassifications()
    const inventoryItems = await invModel.getInventory()
    let classificationList = "<ul>"
    let inventoryList = "<ul>"
    classifications.rows.forEach(classification => {
      classificationList += `<li>${classification.classification_name}</li>`
    })
    classificationList += "</ul>"
    
    inventoryItems.rows.forEach(inventoryItem => {
      inventoryList += `<li>${inventoryItem.inv_make} ${inventoryItem.inv_model}</li>`
    })
    inventoryList += "</ul>"

    req.flash(
      "notice",
      `Congratulations, you\'ve added ${inv_make} ${inv_model}.`
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      classification: classificationList,
      inventory: inventoryList,
    })
  } else {
    const classifications = await utilities.buildClassificationList()
    req.flash("notice", "Sorry, failed adding Inventory.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classifications
    })
  }
}

module.exports = invCont