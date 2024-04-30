import { asynchandle } from "../utils/aynchandle.js";
import { Errorhandle } from "../utils/Errorhandle.js";
import { User } from "../models/user.models.js";
const registerUser = asynchandle(async(req,res)=>{

    // this is Logic build 

  //get user details from frontend also in backend
  //validation - not empty
  //check if user already exists or not - username,email
  //check form images,avatar
  //upload images,avatar to cloudinary
  //create user objects - user entry in db
  //remove password and refresh token from response
  //check for user creation
  //return res

  //get user details, data handaling
  const {fullname, username, password, email}=req.body
  console.log("username:",username);

  //validation
  if([username,fullname,email,password].some((field)=>field?.trim()==="")){

    throw new Errorhandle(400, "All fields are required")

    
  }

  const existuser= User.findOne({
    $or: [{ username },{ email }]
  })

  if(existuser){
    throw new Errorhandle(409, "Username or Email already Exist")
  }
})

export default registerUser;