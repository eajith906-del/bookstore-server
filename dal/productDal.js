const productDal = new Object();

const productModel = require("../model/productModel");


// Create Product

   productDal.createProduct = async (body) => {
       console.log("Incoming body:", body);   // confirm req.body is arriving intact
       try {
           let payload = new productModel(body);
        let result = await payload.save();

        if (result) {
            return { status: true, message: "created", data: result };
        }

        return { status: false, message: "failed", data: {} };
    }
    catch (err) {
        return { status: false, message: err ? err.message : "Internal Server Error", data: {} };
    }
};


// Get Product
productDal.getProduct = async (req) => {

    try {

        let result = await productModel.find({
            deleted: false
        });

        if (result) {

            return {
                status: true,
                message: "success",
                data: result
            };

        }

        return {
            status: false,
            message: "failed",
            data: {}
        };

    }
    catch (err) {

        return {
            status: false,
            message: err ? err.message : "Internal Server Error",
            data: {}
        };

    }

};


// Update Product
productDal.updateProduct = async (id, data) => {

    try {

        let result = await productModel.findByIdAndUpdate(
            { _id: id },
            data,
            { new: true }
        );

        if (result) {

            return {
                status: true,
                message: "Success",
                data: result
            };

        }

        return {
            status: false,
            message: "failed",
            data: {}
        };

    }
    catch (err) {

        return {
            status: false,
            message: err ? err.message : "Internal Server Error",
            data: {}
        };

    }

};


module.exports = productDal;