const userController = new Object()
require("dotenv").config()
const bcrypt = require("bcrypt")
const userDal = require("../dal/userDal")
const validator = require("validator")
const tokenHelper = require("../Helper/tokenHelper")
const key = process.env.SECRET_KEy
const mailHelper = require ("../Helper/mailHelper")
const randomNumber = require ("../Helper/randomNumberHelper")
const mailTemplate = require ("../template/mailTemplate")

//login
userController.userLogin = async (req) => {
    try {
        let body = req.body
        console.log(body, "body")
        if (!body.email) {
            return { code: 400, status: false, message: "email is required" }
        }
        if (!body.password) {
            return { code: 400, status: false, message: "password is required" }
        }
        let result = await userDal.findMail(body.email)
        if (!result.data) {
            return { code: 400, status: false, message: "email not found" }
        }
        let isMatch = await bcrypt.compare(body.password, result.data.password)
        if (isMatch) {
            let token = await tokenHelper.generateAccessToken(result.data._id, result.data.email, key)
            let resultData = result.data.toObject()
            resultData.token = token
            return { code: 200, status: true, message: "login successfull", data: resultData }
        }
        return { code: 400, status: false, message: "enter the correct password" }
    }
    catch (err) {
        return { code: 500, status: false, message: err ? err.message : "internal server error" }
    }

}

//forgot password - send OTP
//forgot password - send OTP
userController.forgotPassword = async (req) => {
    try {
        let body = req.body
        if (!body.email) {
            return { code: 400, status: false, message: "email is required" }
        }
        let emailFind = await userDal.findMail(body.email)
        if (!emailFind.data) {
            return { code: 400, status: false, message: "Enter the valid Email" }
        }

        let otp = await randomNumber.generateRandomDigitString(6)   // 👈 4 la irundhu 6 ah maathinom
        let expireTime = new Date(Date.now() + 10 * 60 * 1000) // 10 mins validity

        let updateData = {
            resetPasswordToken: otp,
            resetPasswordTokenExpire: expireTime
        }
        let updateResult = await userDal.updateUser(emailFind.data._id, updateData)
        if (!updateResult.status) {
            return { code: 400, status: false, message: "failed to generate otp" }
        }

        let mailData = {
            name: emailFind.data.name,
            email: emailFind.data.email,
            otp: otp
        }
        let mailTemplates = await mailTemplate.otp(mailData)
        await mailHelper.sendMail(emailFind.data.email, "Password Reset OTP", mailTemplates)

        return { code: 200, status: true, message: "OTP sent successfully to your email" }
    }
    catch (err) {
        return { code: 500, status: false, message: err ? err.message : "internal server error" }
    }
}

//verify otp
userController.verifyOtp = async (req) => {
    try {
        let body = req.body
        if (!body.email) {
            return { code: 400, status: false, message: "email is required" }
        }
        if (!body.otp) {
            return { code: 400, status: false, message: "otp is required" }
        }
        let emailFind = await userDal.findMail(body.email)
        if (!emailFind.data) {
            return { code: 400, status: false, message: "Enter the valid Email" }
        }
        if (emailFind.data.resetPasswordToken !== body.otp) {
            return { code: 400, status: false, message: "Invalid OTP" }
        }
        if (new Date() > new Date(emailFind.data.resetPasswordTokenExpire)) {
            return { code: 400, status: false, message: "OTP expired" }
        }
        return { code: 200, status: true, message: "OTP verified successfully" }
    }
    catch (err) {
        return { code: 500, status: false, message: err ? err.message : "internal server error" }
    }
}

//reset password
userController.resetPassword = async (req) => {
    try {
        let body = req.body
        if (!body.email) {
            return { code: 400, status: false, message: "email is required" }
        }
        if (!body.newPassword) {
            return { code: 400, status: false, message: "new password is required" }
        }
        let emailFind = await userDal.findMail(body.email)
        if (!emailFind.data) {
            return { code: 400, status: false, message: "Enter the valid Email" }
        }
        let salt = await bcrypt.genSalt()
        let hashPassword = await bcrypt.hash(body.newPassword, salt)
        let updateData = {
            password: hashPassword,
            resetPasswordToken: null,
            resetPasswordTokenExpire: null
        }
        let result = await userDal.updateUser(emailFind.data._id, updateData)
        if (result.status) {
            return { code: 200, status: true, message: "Password reset successfully" }
        }
        return { code: 400, status: false, message: "failed to reset password" }
    }
    catch (err) {
        return { code: 500, status: false, message: err ? err.message : "internal server error" }
    }
}   


//sineup
userController.createUser = async (req) => {
    try {
        let body = req.body
        if (!body.email) {
            return { code: 400, status: false, message: "email is required" }
        }
        if (!body.password) {
            return { code: 400, status: false, message: "password is required" }
        }
        if (!validator.isEmail(body.email)) {
            return { code: 400, status: false, message: "Invalid email format" };
        }
        // ✅ minimum length check (correct direction)

        let salt = await bcrypt.genSalt()
        let hashPassword = await bcrypt.hash(body.password, salt)
        body["password"] = hashPassword

        let result = await userDal.createUser(body)
        if (result.status) {
            let resultData = result.data.toObject()
            delete resultData.password   // password hash frontend ku anupa vendam

            // ✅ token generate pannuvom, login mாதிri
            let token = await tokenHelper.generateAccessToken(resultData._id, resultData.email, key)
            resultData.token = token

            return { code: 200, status: true, message: result.message, data: resultData }
        }
        return { code: 400, status: false, message: result.message, data: {} }
    }
    catch (err) {
        return { code: 500, status: false, message: err ? err.message : "Internal Server error" }
    }
}

userController.getUser = async (req) => {
    try {
        let result = await userDal.getUser(req)
        if (result) {
            return { code: 200, status: true, message: result.message, data: result.data }
        }
        return { code: 400, status: false, message: result.message }
    }
    catch (err) {
        return { code: 500, status: false, message: err ? err.message : "internal server error" }
    }
}

userController.updateUser = async (req) => {
    try {
        let body = req.body
        let result = await userDal.updateUser(body._id, body)
        if (result) {
            return { code: 200, status: true, message: result.message, data: result.data }
        }
        return { code: 400, status: false, message: result.message, data: {} }
    }
    catch (err) {
        return { code: 500, status: false, message: err ? err.message : "Internal Server Error" }
    }
}

//log out
userController.logoutUser = async (req, res) => {
    try {
        let result = await userDal.logoutUser()
        if (result.status) {
            res.clearCookie("token", {
                httpOnly: true,
                secure: false
            })
            res.clearCookie("userId", {
                httpOnly: true,
                secure: false
            })
            return { code: 200, status: true, message: "Logged out successfully" }
        }
        return { code: 400, status: false, message: result.message }

    } catch (err) {
        return {
            code: 500,
            status: false,
            message: err ? err.message : "Logout error"
        }
    }
}


userController.deleteUser = async (req) => {
    try {
        let body = req.body
        let data = {
            deleted: true
        }
        let result = await userDal.updateUser(body._id, data)
        if (result) {
            return { code: 200, status: true, message: "deleted successfully", data: result.data }
        }
        return { code: 400, status: false, message: "deleted failed" }
    }
    catch (err) {
        return { code: 500, message: err ? err.message : "Internal Server Error" }
    }
}
module.exports = userController