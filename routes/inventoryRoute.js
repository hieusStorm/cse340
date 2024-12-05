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
router.get("/", utilities.handleErrors(invController.buildManagement))

// route to build new classifiaction page
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassifaction))

// add new classification
router.post("/add-classification", 
    invValidation.classification(), 
    invValidation.checkRegDataClassification, 
    utilities.handleErrors(invController.addClassification)
)

// route build add inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// add new inventory
router.post("/add-inventory",
    invValidation.inventory(), 
    invValidation.checkRegDataInventory, 
    utilities.handleErrors(invController.addInventory)
)

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//edit inventory view
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInventory))

//edit inventory
router.post("/update/", utilities.handleErrors(invController.updateInventory))

//delete inventory view
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDelete))

//delete for reals
router.post("/delete/", utilities.handleErrors(invController.deleteItem))

module.exports = router;