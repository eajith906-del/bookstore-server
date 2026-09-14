const jwt = require("jsonwebtoken")
const tokenHelper = new Object()
require("dotenv").config()
const expireTime= process.env.JWT_EXPIRES_TIME

tokenHelper.generateAccessToken = async (userid, email, secretKey) => {                   
  const accessToken = await jwt.sign({ userId: userid, email: email }, secretKey, { expiresIn: expireTime});
  return accessToken;
}

tokenHelper.verifyAccessToken = (token, secretKey) => {            
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    return null
  }
}

tokenHelper.decodeAccessToken = (token) => {                       
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

module.exports=tokenHelper