const randomNumber = new Object()

//to genarate ramdam number
randomNumber.generateRandomDigitString = async (length = 4) => {
    return Math.floor(Math.random() * Math.pow(10, length))
        .toString()
        .padStart(length, "0");
};
module.exports=randomNumber