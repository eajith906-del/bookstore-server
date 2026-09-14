const express = require("express");
const multer = require("multer");

const productRoute = express.Router();
const productController = require("../controller/productController");

const upload = multer({ dest: "uploads/" });

productRoute.post("/create", upload.single("image"), async (req, res) => {
    let result = await productController.createProduct(req);
    res.status(result.code).send(result);
});


// Get Product
productRoute.get("/get", async (req, res) => {

    let result = await productController.getProductDetails(req);

    res.status(result.code).send(result);

});


// Update Product
productRoute.put("/update", async (req, res) => {

    let result = await productController.updateProduct(req);

    res.status(result.code).send(result);

});


// Delete Product
productRoute.put("/delete", async (req, res) => {

    let result = await productController.deleteProduct(req);

    res.status(result.code).send(result);

});


module.exports = productRoute;