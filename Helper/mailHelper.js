const nodemailer = require("nodemailer")
require ("dotenv").config()
const mailHelper = new Object()

const emailId = process.env.sender_mail
const password = process.env.sender_password

console.log(emailId,password,'....')

mailHelper.sendMail = async(email,subject,template)=>{
    let config = {
        service:"gmail",
        auth:{
            user:emailId,
            pass:password
        }
    }
    let transpoter =nodemailer.createTransport(config)
    let message = {
        from:emailId,
        to:`${email}`,
        subject:`${subject}`,
        html:`${template}`
    }
    transpoter.sendMail(message)
    .then(()=>{console.log("Mail Send")})
    .catch(err=>{console.log("failed",err)})
}

module.exports=mailHelper