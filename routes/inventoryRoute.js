// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invValidation = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

//Route to build car info by inventory view
router.get("/detail/:inventoryId", invController.buildByInventoryId)

//Route to build management page
router.get("/inv/", invController.buildManagement)

// route to build new classifiaction page
router.get("/inv/add-classification", invController.buildAddClassifaction)

// add new classification
router.post("/inv/add-classification",)

module.exports = router;