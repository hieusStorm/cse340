const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = ""
  list += '<a href="/" title="Home page" class="button">Home</a>'
  data.rows.forEach((row) => {
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles" class="button">' +
      row.classification_name +
      "</a>"
  })
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid = ""
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}
// build car view HTML
Util.buildInventoryFlex = async function(data) {
  let flex ="";
  if (data.length > 0){
    flex += `<h2>${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}</h2>`
    flex += `<div class='inv-flex'>`
    flex += `<img src='${data[0].inv_image}' alt='image of a ${data[0].inv_make} ${data[0].inv_model}'>`
    flex += `<p><strong>Price</strong> $${new Intl.NumberFormat('en-US').format(data[0].inv_price)}</p>`
    flex += `<div>`
    flex += `<h4>Details</h4>`
    flex += `<p><strong>Make</strong> ${data[0].inv_make}</p>`
    flex += `<p><strong>Model</strong> ${data[0].inv_model}</p>`
    flex += `<p><strong>Year</strong> ${data[0].inv_year}</p>`
    flex += `<p><strong>Price</strong> ${ new Intl.NumberFormat('en-US').format(data[0].inv_price)}</p>`
    flex += `<p><strong>Color</strong> ${data[0].inv_color}</p>`
    flex += `<p><strong>Mileage</strong> ${ new Intl.NumberFormat('en-US').format(data[0].inv_miles)}</p>`
    flex += `<p><strong>Decription</strong> ${data[0].inv_description}</p>`
    flex += `</div>`
    flex += `</div>`
  } else {
    flex += `<p class="notice">Sorry, no matching vehicle could be found.</p>`;
  }
  return flex;
}


Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

//  check account type
Util.checkAccountType = (req, res, next) => {
  const token = req.cookies.jwt
  const jwtInfo = jwt.decode(token)
  if (jwtInfo.account_type == "Admin" || jwtInfo.account_type == "Employee"){
    next()
  } else {
    req.flash("notice", "You are not an employee or admin please login with as an employee or admin to continue")
    return res.redirect("/account/login")
  }
}  

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util