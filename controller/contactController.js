const contactController = new Object()
const contactDal = require("../dal/contactDal")


contactController.createContact = async (req) => {

    try {

        let body = req.body;

        // Name validation
        if (!body.name || body.name.trim() === "") {
            return {
                code: 400,
                status: false,
                message: "Name is required"
            };
        }

        // Mobile number validation
        if (!body.mobileNo || body.mobileNo.trim() === "") {
            return {
                code: 400,
                status: false,
                message: "Mobile number is required"
            };
        }

        // Mobile number format
        let mobileRegex = /^[0-9]{10}$/;

        if (!mobileRegex.test(body.mobileNo)) {
            return {
                code: 400,
                status: false,
                message: "Enter a valid 10 digit mobile number"
            };
        }

        // Email validation
        if (!body.email || body.email.trim() === "") {
            return {
                code: 400,
                status: false,
                message: "Email is required"
            };
        }

        // Email format
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
        if (!emailRegex.test(body.email)) {
            return {
                code: 400,
                status: false,
                message: "Enter a valid email address"
            };
        }

        // Message validation
        if (!body.message || body.message.trim() === "") {
            return {
                code: 400,
                status: false,
                message: "Message is required"
            };
        }

        // DAL call
        let result = await contactDal.createContact(body);

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

    } catch (err) {

        return {
            code: 500,
            status: false,
            message: err ? err.message : "Internal Server Error"
        };
    }
};

contactController.getContactDetails = async (req) => {
    try {
        let result = await contactDal.getContact(req)
        if (result) {
            return { code: 201, status: true, message: "data fetched successfully", data: result.data }
        }
        return { code: 400, status: false, message: "failed to fetch data" }
    }
    catch (err) {
        return { code: 500, status: false, message: err ? err.message : "internal server error" }
    }
}

contactController.deleteContact = async (req) => {
    try {
        let body = req.body
        let data = {
            deleted: true
        }
        let result = await contactDal.updateContact(body._id, data)
        if (result) {
            return { code: 201, status: true, message: "data deleted successfully", data: result.data }
        }
        return { code: 400, status: false, message: "failed to delete" }
    }
    catch (err) {
        return { code: 500, status: false, message: err ? err.message : "internal server error" }
    }
}


contactController.updateContact = async (req) => {
    try {
        let body = req.body;

        if (!body._id) {
            return {
                code: 400,
                status: false,
                message: "Contact id is required"
            };
        }

        let data = {
            status: body.status
        };

        let result = await contactDal.updateContact(body._id, data);

        if (result && result.status) {
            return { code: 201, status: true, message: result.message, data: result.data };
        }

        return { code: 400, status: false, message: result.message, data: {} };

    } catch (err) {
        return { code: 500, status: false, message: err ? err.message : "internal server error" };
    }
};


module.exports = contactController