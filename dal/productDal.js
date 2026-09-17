const productDal = new Object();
const productModel = require("../model/productModel");

productDal.createProduct = async (body) => {
    try {
        let result = await productModel.create(body);
        return { status: true, message: "Product created successfully", data: result };
    }
    catch (err) {
        return { status: false, message: err ? err.message : "Failed to create product" };
    }
};

productDal.getProduct = async (req) => {
    try {
        let result = await productModel.find({ deleted: false });
        return { status: true, data: result };
    }
    catch (err) {
        return { status: false, message: err ? err.message : "Failed to fetch products" };
    }
};

productDal.updateProduct = async (id, data) => {
    try {
        let result = await productModel.findByIdAndUpdate(id, data, { new: true });

        if (!result) {
            return { status: false, message: "Product not found" };
        }

        return { status: true, message: "Product updated successfully", data: result };
    }
    catch (err) {
        return { status: false, message: err ? err.message : "Failed to update product" };
    }
};

module.exports = productDal;