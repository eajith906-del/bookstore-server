const orderDal = new Object();

const orderModel = require("../model/orderModel");
const productModel = require("../model/productModel");


// Create Order
orderDal.createOrder = async (body) => {

    try {

        let items = [];
        let subtotal = 0;

        for (let item of body.items) {

            let product = await productModel.findOne({
                _id: item.productId,
                deleted: false,
                status: "Active"
            });

            if (!product) {

                return {
                    status: false,
                    message: "Product not found",
                    data: {}
                };
            }

            if (product.stock < item.quantity) {

                return {
                    status: false,
                    message: `${product.name} has only ${product.stock} items available`,
                    data: {}
                };
            }

            let itemSubtotal =
                product.price * item.quantity;

            subtotal += itemSubtotal;

            items.push({
                productId: product._id,
                name: product.name,
                image: product.image,
                price: product.price,
                quantity: item.quantity,
                subtotal: itemSubtotal
            });
        }

        let shippingCharge = subtotal >= 1000 ? 0 : 50;

        let totalAmount =
            subtotal + shippingCharge;

        let orderData = {
            userId: body.userId,
            items,
            subtotal,
            shippingCharge,
            totalAmount,
            shippingAddress: body.shippingAddress,
            paymentMethod: body.paymentMethod || "COD",
            paymentStatus: "Pending",
            orderStatus: "Pending"
        };

        let payload = new orderModel(orderData);

        let result = await payload.save();

        if (result) {

            for (let item of items) {

                await productModel.findByIdAndUpdate(
                    item.productId,
                    {
                        $inc: {
                            stock: -item.quantity
                        }
                    }
                );
            }

            return {
                status: true,
                message: "Order created successfully",
                data: result
            };
        }

        return {
            status: false,
            message: "Order creation failed",
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


// Get All Orders
orderDal.getOrders = async () => {

    try {

        let result = await orderModel
            .find()
            .populate("userId", "name email")
            .populate("items.productId", "name price image");

        return {
            status: true,
            message: "Orders fetched successfully",
            data: result
        };

    }
    catch (err) {

        return {
            status: false,
            message: err ? err.message : "Internal Server Error",
            data: []
        };
    }
};


// Get Single Order
orderDal.getOrderById = async (id) => {

    try {

        let result = await orderModel
            .findById(id)
            .populate("userId", "name email")
            .populate(
                "items.productId",
                "name price image category"
            );

        if (result) {

            return {
                status: true,
                message: "Order fetched successfully",
                data: result
            };
        }

        return {
            status: false,
            message: "Order not found",
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


// Get User Orders
orderDal.getUserOrders = async (userId) => {

    try {

        let result = await orderModel
            .find({
                userId: userId
            })
            .sort({
                createdAt: -1
            });

        return {
            status: true,
            message: "User orders fetched successfully",
            data: result
        };

    }
    catch (err) {

        return {
            status: false,
            message: err ? err.message : "Internal Server Error",
            data: []
        };
    }
};


// Update Order Status
orderDal.updateOrderStatus = async (id, status) => {

    try {

        let result = await orderModel.findByIdAndUpdate(
            id,
            {
                orderStatus: status
            },
            {
                new: true
            }
        );

        if (result) {

            return {
                status: true,
                message: "Order status updated successfully",
                data: result
            };
        }

        return {
            status: false,
            message: "Order not found",
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


// Cancel Order
orderDal.cancelOrder = async (id) => {

    try {

        let order = await orderModel.findById(id);

        if (!order) {

            return {
                status: false,
                message: "Order not found",
                data: {}
            };
        }

        if (
            order.orderStatus === "Shipped" ||
            order.orderStatus === "Out for Delivery" ||
            order.orderStatus === "Delivered"
        ) {

            return {
                status: false,
                message: "Order cannot be cancelled",
                data: {}
            };
        }

        order.orderStatus = "Cancelled";

        let result = await order.save();

        for (let item of order.items) {

            await productModel.findByIdAndUpdate(
                item.productId,
                {
                    $inc: {
                        stock: item.quantity
                    }
                }
            );
        }

        return {
            status: true,
            message: "Order cancelled successfully",
            data: result
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


module.exports = orderDal;