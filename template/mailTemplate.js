const mailTemplate = new Object()

mailTemplate.registration = async(data)=>{
 return `
    <!DOCTYPE html>
    <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Welcome ${data.name}</h1>
    <h1  style="text-decoration:none">Your eamail ${data.email}</h1>
    <h1>Your Password ${data.password}</h1>
</body>
</html> 
`
}

mailTemplate.otp = async(data)=>{
 return `
    <!DOCTYPE html>
    <html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Password Reset OTP</title>
</head>
<body>
    <h2>Hello ${data.name || ""}</h2>
    <p>Your OTP to reset your password is:</p>
    <h1>${data.otp}</h1>
    <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
</body>
</html>
`
}

module.exports=mailTemplate