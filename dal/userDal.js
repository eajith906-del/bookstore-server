const userDal = new Object();

const userModel = require("../model/userModel");
const contactModel = require("../model/contactModel");


// Create User
userDal.createUser = async (body) => {
    try {

        let payload = new userModel(body);

        let result = await payload.save();

        if (result) {
            return {
                status: true,
                message: "User created successfully",
                data: result
            };
        }

        return {
            status: false,
            message: "User creation failed",
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


// Create Contact
userDal.createContact = async (body) => {
    try {

        let payload = new contactModel(body);

        // Default status
        payload.status = "Pending";

        let result = await payload.save();

        if (result) {
            return {
                status: true,
                message: "Contact created successfully",
                data: result
            };
        }

        return {
            status: false,
            message: "Contact creation failed",
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


// Find User Email
userDal.findMail = async (email) => {
    try {

        let query = [
            { deleted: false },
            { email: email }
        ];

        let result = await userModel.find({
            $and: query
        });

        if (result) {
            return {
                status: true,
                message: "Email find successfully",
                data: result[0]
            };
        }

        return {
            status: false,
            message: "Failed",
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


// Get Users
userDal.getUser = async (req) => {
    try {

        let result = await userModel.find({
            deleted: false
        });

        if (result) {
            return {
                status: true,
                message: "User get successfully",
                data: result
            };
        }

        return {
            status: false,
            message: "Failed",
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


// Update User
userDal.updateUser = async (id, data) => {
    try {

        let result = await userModel.findByIdAndUpdate(
            id,
            data,
            { new: true }
        ).exec();

        if (result) {
            return {
                status: true,
                message: "Updated Successfully",
                data: result
            };
        }

        return {
            status: false,
            message: "Failed",
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


// Logout
userDal.logoutUser = async () => {
    try {

        return {
            status: true,
            message: "Logout successful"
        };

    }
    catch (err) {

        return {
            status: false,
            message: err ? err.message : "Logout failed"
        };
    }
};


module.exports = userDal;