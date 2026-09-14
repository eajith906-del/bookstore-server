const contactDal = new Object()
const contactModel = require("../model/contactModel")

contactDal.createContact = async (req) => {
    try {
        let payload = contactModel(req)
        let result = await payload.save()
        if (result) {
            return { status: true, message: "created", data: result }
        }
        return { status: false, message: "failed", data: {} }
    }
    catch (err) {
        return { status: false, message: err ? err.message : "Interl Server Error", data: {} }
    }
}

contactDal.getContact= async (req)=>{
    try{
        let result = await contactModel.find({deleted:false}) 
        if(result){
            return {status:true,message:"success",data:result}
        }
            return {status:false,message:"failed",data:{}}
    }
    catch(err){
        return {status:false,message:err?err.message:"Internel Server Error",data:{}}
    }
}

contactDal.updateContact= async (id,data)=>{
    try{
        let result = await contactModel.findByIdAndUpdate({_id:id},data,{new:true})
        if (result) {
            return { status: true, message: "Success", data: result}
        }
        return { status: false, message: "failed", data: {} }
    }
    catch (err) {
        return { status: false, message: err ? err.message : "Inernal Server Error", data: {} }
    }
}

module.exports = contactDal