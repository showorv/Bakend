import { asynchandle } from "../utils/aynchandle.js";


const registerUser = asynchandle(async(req,res)=>{
   return res.status(200).json({
        message: "ok"
    })
})

export default registerUser;