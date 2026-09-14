const orderController = new Object();

const orderDal = require("../dal/orderDal");


// Create Order
orderController.createOrder = async (req) => {

    try {

        let body = req.body;

        // User validation
        if (!body.userId) {

            return {
                code: 400,
                status: false,
                message: "User id is required"
            };
        }

        // Items validation
        if (
            !body.items ||
            !Array.isArray(body.items) ||
            body.items.length === 0
        ) {

            return {
                code: 400,
                status: false,
                message: "Order items are required"
            };
        }

        // Address validation
        if (!body.shippingAddress) {

            return {
                code: 400,
                status: false,
                message: "Shipping address is required"
            };
        }

        let address = body.shippingAddress;

        if (!address.fullName) {
            return {
                code: 400,
                status: false,
                message: "Full name is required"
            };
        }

        if (!address.phone) {
            return {
                code: 400,
                status: false,
                message: "Phone is required"
            };
        }

        if (!address.address) {
            return {
                code: 400,
                status: false,
                message: "Address is required"
            };
        }

        if (!address.city) {
            return {
                code: 400,
                status: false,
                message: "City is required"
            };
        }

        if (!address.state) {
            return {
                code: 400,
                status: false,
                message: "State is required"
            };
        }

        if (!address.pincode) {
            return {
                code: 400,
                status: false,
                message: "Pincode is required"
            };
        }

        let result = await orderDal.createOrder(body);

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
            message: err ? err.message : "Internal Server Error"
        };
    }
};


// Get All Orders
orderController.getOrders = async (req) => {

    try {

        let result = await orderDal.getOrders();

        return {
            code: 200,
            status: true,
            message: result.message,
            data: result.data
        };

    }
    catch (err) {

        return {
            code: 500,
            status: false,
            message: err ? err.message : "Internal Server Error"
        };
    }
};


// Get Single Order
orderController.getOrderById = async (req) => {

    try {

        let id = req.params.id;

        if (!id) {

            return {
                code: 400,
                status: false,
                message: "Order id is required"
            };
        }

        let result = await orderDal.getOrderById(id);

        if (result && result.status) {

            return {
                code: 200,
                status: true,
                message: result.message,
                data: result.data
            };
        }

        return {
            code: 404,
            status: false,
            message: result.message,
            data: {}
        };

    }
    catch (err) {

        return {
            code: 500,
            status: false,
            message: err ? err.message : "Internal Server Error"
        };
    }
};


// Get User Orders
orderController.getUserOrders = async (req) => {

    try {

        let userId = req.params.userId;

        if (!userId) {

            return {
                code: 400,
                status: false,
                message: "User id is required"
            };
        }

        let result = await orderDal.getUserOrders(userId);

        return {
            code: 200,
            status: true,
            message: result.message,
            data: result.data
        };

    }
    catch (err) {

        return {
            code: 500,
            status: false,
            message: err ? err.message : "Internal Server Error"
        };
    }
};


// Update Order Status
orderController.updateOrderStatus = async (req) => {

    try {

        let id = req.params.id;
        let status = req.body.orderStatus;

        if (!id) {

            return {
                code: 400,
                status: false,
                message: "Order id is required"
            };
        }

        if (!status) {

            return {
                code: 400,
                status: false,
                message: "Order status is required"
            };
        }

        let result =
            await orderDal.updateOrderStatus(id, status);

        if (result && result.status) {

            return {
                code: 200,
                status: true,
                message: result.message,
                data: result.data
            };
        }

        return {
            code: 404,
            status: false,
            message: result.message,
            data: {}
        };

    }
    catch (err) {

        return {
            code: 500,
            status: false,
            message: err ? err.message : "Internal Server Error"
        };
    }
};


// Cancel Order
orderController.cancelOrder = async (req) => {

    try {

        let id = req.params.id;

        if (!id) {

            return {
                code: 400,
                status: false,
                message: "Order id is required"
            };
        }

        let result = await orderDal.cancelOrder(id);

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
            message: err ? err.message : "Internal Server Error"
        };
    }
};


module.exports = orderController;