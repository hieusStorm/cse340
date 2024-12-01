// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invValidation = require("../utilities/inventory-validation")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

//Route to build car info by inventory view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId))

//Route to build management page
router.get("/inv/", utilities.handleErrors(invController.buildManagement))

// route to build new classifiaction page
router.get("/inv/add-classification", utilities.handleErrors(invController.buildAddClassifaction))

// add new classification
router.post("/inv/add-classification", 
    invValidation.classification(), 
    invValidation.checkRegDataClassification, 
    utilities.handleErrors(invController.addClassification)
)

// route build add inventory
router.get("/inv/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// add new inventory
router.post("/inv/add-inventory",
    invValidation.inventory(), 
    invValidation.checkRegDataInventory, 
    utilities.handleErrors(invController.addInventory)
)

module.exports = router;