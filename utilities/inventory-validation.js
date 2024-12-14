const utilities = require(".")
const invModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.classification = () => {
    return [
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a classification")
        .custom(async (classification_name) => {
            const classifiactionExists = await invModel.checkClassification(classification_name)
            console.log(classifiactionExists)
            if(classifiactionExists) {
                throw new Error("That classification already exists. Please make a new one")
            }
        })
    ]
}

validate.checkRegDataClassification = async (req, res, next) => {
    const { classification_name, } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors, 
            title: "Add Classification",
            nav,
            classification_name
        })
        return
    }
    next()
}

//check inventory data
validate.inventory = () => {
    return [
        body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a make"),
        
        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a model"),

        body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .isLength({ min: 4 })
        .withMessage("Please provide a year"),
        
        body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a description"),

        body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a price"),

        body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .isLength({ min: 4 })
        .withMessage("Please provide miles"),
        
        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a color"),

        body("classification_id")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a classification"),
    ]
}

validate.checkRegDataInventory = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id, } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classifications = await utilities.buildClassificationList(classification_id)
        res.render("inventory/add-inventory", {
            errors, 
            title: "Add Inventory",
            nav,
            classifications,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_price,
            inv_miles,
            inv_color,
        })
        return
    }
    next()
}

//check inventory data
validate.checkUpdateData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id, inv_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classifications = await utilities.buildClassificationList(classification_id)
        let itemName = `${inv_make} ${inv_model}`
        res.render("inventory/edit-inventory", {
            errors, 
            title: "Edit " + itemName,
            nav,
            classifications,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_price,
            inv_miles,
            inv_color,
            inv_id
        })
        return
    }
    next()
}

//check rating data and rules
validate.rating = () => {
    return [
        body("inv_rating")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .isLength({ min: 1 })
        .withMessage("Please provide a rating")
    ]
}
validate.checkRating = async (req, res, next) => {
    const { inv_rating } = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
        const inventory_id = req.params.inventoryId
        const data = await invModel.getInventoryByInventoryId(inventory_id)
        const flex = await utilities.buildInventoryFlex(data)
        let nav = await utilities.getNav()
        const carName = `${data[0].inv_make} ${data[0].inv_model}`
        const inv_total_rating = data[0].inv_total_rating + 1
        const inv_rating = data[0].inv_total_rating
        res.render("/inventory/detail", {
            title: carName,
            nav,
             flex,
             errors,
             inventory_id,
             inv_total_rating,
             inv_rating
            })
        return
    }
    next()
}
module.exports = validate