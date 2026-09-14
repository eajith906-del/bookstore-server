const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactDetailsSchema = new Schema({
    name: {
        type: String,
        default: null
    },

    mobileNo: {
        type: String,
        default: null
    },

    email: {
        type: String,
        default: null
    },

    message: {
        type: String,
        default: null
    },

    status: {
        type: String,
        enum: ["Pending", "Read", "Replied"],
        default: "Pending"
    },

    deleted: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

const contactModel = mongoose.model(
    "contactDetails",
    contactDetailsSchema
);

module.exports = contactModel;