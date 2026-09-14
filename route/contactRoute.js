const express = require("express");

const contactRoute = express.Router();

const contactController = require("../controller/contactController");


// Create Contact
contactRoute.post("/create", async (req, res) => {

    let result = await contactController.createContact(req);

    res.status(result.code).send(result);

});


// Get Contact
contactRoute.get("/get", async (req, res) => {

    let result = await contactController.getContactDetails(req);

    res.status(result.code).send(result);

});


// Update Contact
contactRoute.put("/update", async (req, res) => {

    let result = await contactController.updateContact(req);

    res.status(result.code).send(result);

});


// Delete Contact
contactRoute.put("/delete", async (req, res) => {

    let result = await contactController.deleteContact(req);

    res.status(result.code).send(result);

});


module.exports = contactRoute;