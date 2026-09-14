const express = require("express");

const orderRoute = express.Router();

const orderController = require("../controller/orderController");


// Create Order
orderRoute.post(
    "/create",
    async (req, res) => {

        let result =
            await orderController.createOrder(req);

        res.status(result.code).send(result);
    }
);


// Get All Orders
orderRoute.get(
    "/get",
    async (req, res) => {

        let result =
            await orderController.getOrders(req);

        res.status(result.code).send(result);
    }
);


// Get Single Order
orderRoute.get(
    "/get/:id",
    async (req, res) => {

        let result =
            await orderController.getOrderById(req);

        res.status(result.code).send(result);
    }
);


// Get User Orders
orderRoute.get(
    "/user/:userId",
    async (req, res) => {

        let result =
            await orderController.getUserOrders(req);

        res.status(result.code).send(result);
    }
);


// Update Order Status
orderRoute.put(
    "/update/:id",
    async (req, res) => {

        let result =
            await orderController.updateOrderStatus(req);

        res.status(result.code).send(result);
    }
);


// Cancel Order
orderRoute.put(
    "/cancel/:id",
    async (req, res) => {

        let result =
            await orderController.cancelOrder(req);

        res.status(result.code).send(result);
    }
);


module.exports = orderRoute;