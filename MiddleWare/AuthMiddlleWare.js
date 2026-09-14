const tokenHelper = require("../Helper/tokenHelper");
const userModel = require("../model/userModel");
const allowedPath = require("../Helper/allowedPath");
const url = require('url'); 
require('dotenv').config();
const secretKey = process.env.SECRET_KEy

const AuthMiddleWare = async (req, res, next) => {
  try {
    const pathname = url.parse(req.originalUrl).pathname;

    if (allowedPath.includes(pathname)) {
      return next()
    }

    const token = req.cookies.token
    const userId = req.cookies.userId

    if (!token || !userId) {
      return res.status(401).send({
        status: false,
        message: "Authentication required",
      });
    }

    const decoded = tokenHelper.verifyAccessToken(token, secretKey);
    if (!decoded || decoded.userId !== userId) {
      return res.status(401).send({
        status: false,
        message: "Invalid token",
      });
    }

    const userData = await userModel.findById(userId)
    if (!userData || userData.deleted) {
      return res.status(401).send({
        status: false,
        message: "User not found",
      });
    }

    //admin
    if ((pathname.startsWith("/product") || pathname.startsWith("/contact"))  && userData.role !== "admin") {
      return res.status(403).send({
        status: false,
        message: "Admin access only",
      });
    }
    

    req.user = userData

    next();

  }

  catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        code: 401,
        status: false,
        message: "Token expired, please login again",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({
        code: 403,
        status: false,
        message: "Invalid token",
      });
    }

    return res.status(500).json({
      code: 500,
      status: false,
      message: "AuthMiddlewareError",
      data: error.message,
    });
  }
}

module.exports = AuthMiddleWare
