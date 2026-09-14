            const mongoose = require("mongoose");
            const { Schema } = mongoose;

            const orderSchema = new Schema(
                {
                    userId: {
                        type: Schema.Types.ObjectId,
                        ref: "userDetails",
                        required: true
                    },

                    items: [
                        {
                            productId: {
                                type: Schema.Types.ObjectId,
                                ref: "productDetails",
                                required: true
                            },

                            name: {
                                type: String,
                                required: true
                            },

                            image: {
                                type: String,
                                default: null
                            },

                            price: {
                                type: Number,
                                required: true
                            },

                            quantity: {
                                type: Number,
                                required: true,
                                min: 1
                            },

                            subtotal: {
                                type: Number,
                                required: true
                            }
                        }
                    ],

                    subtotal: {
                        type: Number,
                        required: true
                    },

                    shippingCharge: {
                        type: Number,
                        default: 0
                    },

                    totalAmount: {
                        type: Number,
                        required: true
                    },

                    shippingAddress: {
                        fullName: {
                            type: String,
                            required: true
                        },

                        phone: {
                            type: String,
                            required: true
                        },

                        address: {
                            type: String,
                            required: true
                        },

                        city: {
                            type: String,
                            required: true
                        },

                        state: {
                            type: String,
                            required: true
                        },

                        pincode: {
                            type: String,
                            required: true
                        }
                    },

                    paymentMethod: {
                        type: String,
                        enum: ["COD", "ONLINE"],
                        default: "COD"
                    },

                    paymentStatus: {
                        type: String,
                        enum: ["Pending", "Paid", "Failed", "Refunded"],
                        default: "Pending"
                    },

                    orderStatus: {
                        type: String,
                        enum: [
                            "Pending",
                            "Confirmed",
                            "Processing",
                            "Shipped",
                            "Out for Delivery",
                            "Delivered",
                            "Cancelled"
                        ],
                        default: "Pending"
                    },

                    paymentId: {
                        type: String,
                        default: null
                    },

                    orderDate: {
                        type: Date,
                        default: Date.now
                    }
                },
                {
                    timestamps: true
                }
            );

            const orderModel = mongoose.model(
                "orderDetails",
                orderSchema
            );

            module.exports = orderModel;