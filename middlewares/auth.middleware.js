import { Errorhandle } from "../utils/Errorhandle.js";
import { asynchandle } from "../utils/aynchandle.js";
import jsonwebtoken from "jsonwebtoken"
import { User } from "../models/user.models.js";



export const verifyJWT= asynchandle(async(req,res,next)=>{
    try {
        const token= req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
    
        if(!token){
            throw new Errorhandle(400,"Unothorized Request")
        }
    
       const decodeToen= jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
       const user= await User.findById(decodeToen?._id).select("-password -refreshToken")
    
       if(!user){
        throw new Errorhandle(400,"Invalid Access Token")
       }
    
       req.user=user
       next() //next lekhar reason er kaj sesh hoile pore j ei thakuk se kaj korbe.

    } 
    
    catch (error) {
    throw new Errorhandle(401,"Invalid access token")    
    }
})