const productController = new Object();

const productDal = require("../dal/productDal");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");


// Create Product
productController.createProduct = async (req) => {

  try {

    let body = req.body;

    // Upload image to Cloudinary FIRST if a file was sent
    if (req.file) {

      try {

        let uploadResult = await cloudinary.uploader.upload(
          req.file.path,
          {
            folder: "products"
          }
        );

        body.image = uploadResult.secure_url;

        fs.unlinkSync(req.file.path);

      }
      catch (uploadErr) {

        return {
          code: 500,
          status: false,
          message:
            "Image upload failed: " +
            (uploadErr ? uploadErr.message : "")
        };

      }

    }


    // Name validation
    if (!body.name || body.name.trim() === "") {

      return {
        code: 400,
        status: false,
        message: "Product name is required"
      };

    }


    // Description validation
    if (!body.description || body.description.trim() === "") {

      return {
        code: 400,
        status: false,
        message: "Description is required"
      };

    }


    // Price validation
    if (
      body.price === undefined ||
      body.price === null ||
      body.price === ""
    ) {

      return {
        code: 400,
        status: false,
        message: "Price is required"
      };

    }


    // SKU validation
    if (!body.sku || body.sku.trim() === "") {

      return {
        code: 400,
        status: false,
        message: "SKU is required"
      };

    }


    // Image validation
    if (!body.image || body.image.trim() === "") {

      return {
        code: 400,
        status: false,
        message: "Image URL is required"
      };

    }


    // Category validation
    if (!body.category || body.category.trim() === "") {

      return {
        code: 400,
        status: false,
        message: "Category is required"
      };

    }


    // Stock validation
    if (
      body.stock === undefined ||
      body.stock === null ||
      body.stock === ""
    ) {

      return {
        code: 400,
        status: false,
        message: "Stock is required"
      };

    }


    // DAL call
    let result = await productDal.createProduct(body);

    if (result && result.status) {

      return {
        code: 201,
        status: true,
        message: result.message,
        data: result.data
      };

    }

    return {
      code: 400,
      status: false,
      message: result.message,
      data: {}
    };

  }
  catch (err) {

    return {
      code: 500,
      status: false,
      message: err
        ? err.message
        : "Internal Server Error"
    };

  }

};


// Get Product
productController.getProductDetails = async (req) => {

  try {

    let result = await productDal.getProduct(req);

    if (result) {

      return {
        code: 200,
        status: true,
        message: "data fetched successfully",
        data: result.data
      };

    }

    return {
      code: 400,
      status: false,
      message: "failed to fetch data"
    };

  }
  catch (err) {

    return {
      code: 500,
      status: false,
      message: err
        ? err.message
        : "Internal Server Error"
    };

  }

};


// Update Product
productController.updateProduct = async (req) => {

  try {

    let body = req.body;


    if (!body._id) {

      return {
        code: 400,
        status: false,
        message: "Product id is required"
      };

    }


    // Upload NEW image to Cloudinary if a new file was selected
    if (req.file) {

      try {

        let uploadResult = await cloudinary.uploader.upload(
          req.file.path,
          {
            folder: "products"
          }
        );

        body.image = uploadResult.secure_url;

        // Remove temporary uploaded file
        fs.unlinkSync(req.file.path);

      }
      catch (uploadErr) {

        return {
          code: 500,
          status: false,
          message:
            "Image upload failed: " +
            (uploadErr
              ? uploadErr.message
              : "")
        };

      }

    }


    let data = {

      name: body.name,
      description: body.description,
      price: body.price,
      sku: body.sku,

      // New Cloudinary URL if image changed,
      // otherwise existing image URL
      image: body.image,

      category: body.category,
      stock: body.stock,
      status: body.status,
      bestSale: body.bestSale

    };


    let result = await productDal.updateProduct(
      body._id,
      data
    );


    if (result && result.status) {

      return {
        code: 200,
        status: true,
        message: result.message,
        data: result.data
      };

    }


    return {
      code: 400,
      status: false,
      message: result.message,
      data: {}
    };

  }
  catch (err) {

    return {
      code: 500,
      status: false,
      message: err
        ? err.message
        : "Internal Server Error"
    };

  }

};


// Delete Product
productController.deleteProduct = async (req) => {

  try {

    let body = req.body;


    if (!body._id) {

      return {
        code: 400,
        status: false,
        message: "Product id is required"
      };

    }


    let data = {

      deleted: true

    };


    let result = await productDal.updateProduct(
      body._id,
      data
    );


    if (result && result.status) {

      return {
        code: 200,
        status: true,
        message: "data deleted successfully",
        data: result.data
      };

    }


    return {
      code: 400,
      status: false,
      message: "failed to delete"
    };

  }
  catch (err) {

    return {
      code: 500,
      status: false,
      message: err
        ? err.message
        : "Internal Server Error"
    };

  }

};


module.exports = productController;