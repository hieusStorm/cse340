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

validate.checkRegData = async (req, res, next) => {
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

module.exports = validate