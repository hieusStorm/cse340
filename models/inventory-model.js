const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

// get all inventory items
async function getInventory() {
  return await pool.query("SELECT * FROM public.inventory")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

// get details about a specific car
async function getInventoryByInventoryId(inventoryId) {
  try {
    const data = await pool.query(`SELECT * FROM public.inventory WHERE inv_id = ${inventoryId}`)
    return data.rows
  } catch (error) {
    console.error("getInventoryById " + error)
  }
}

// check if a classification exists
async function checkClassification(classification_name) {
  try {
    const sql = "SELECT * FROM public.classification WHERE classification_name = $1"
    const classifiaction = await pool.query(sql, [classification_name])
    return classifiaction.rowCount
  } catch (error) {
    return error.message
  }
}

async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
    return pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const sql = "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, '/images/vehicles/no-image.png', '/images/vehicles/no-image-tn.png', $5, $6, $7, $8) RETURNING *"
    return pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id])
  } catch (error) {
    return error.message
  }
}

module.exports = {getClassifications, getInventory, getInventoryByClassificationId, getInventoryByInventoryId, checkClassification, addClassification, addInventory}