const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({

    name: {
        type: String,
        default: null
    },

    description: {
        type: String,
        default: null
    },

    price: {
        type: Number,
        default: 0
    },

    sku: {
        type: String,
        default: null
    },

    image: {
        type: String,
        default: null
    },

    category: {
        type: String,
        enum: ["novel", "design et art", "life style", "travel"],
        default: null
    },

    stock: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },

    bestSale: {
        type: Boolean,
        default: false
    },

    deleted: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

const productModel = mongoose.model(
    "productDetails",
    productSchema
);

module.exports = productModel;