import { asynchandle } from "../utils/aynchandle.js";
import { Errorhandle } from "../utils/Errorhandle.js";
import { User } from "../models/user.models.js";
import { uploadOncloudinary } from "../utils/cloudinary.js";
import { Apiresponse } from "../utils/Apiresponse.js";



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
  console.log("FULL NAME:",fullname);
  console.log("Email:",email);

  //validation
  if([username,fullname,email,password].some((field)=>field?.trim()==="")){

    throw new Errorhandle(400, "All fields are required")

    
  }

  //user already exist or not
  const existuser= await User.findOne({
    $or: [{ username },{ email }]
  })

  if(existuser){
    throw new Errorhandle(409, "Username or Email already Exist")
  }


  console.log(req.files);

  //check for avatar or coverimage
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImagePath= req.files?.coverImage[0]?.path; //evbe rkhle coverimage na dile error ashbe.jehetu mandatory na tai onnovbe likhte hbe

  let coverImagePath;
   if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length>0){
    coverImagePath= req.files.coverImage[0].path;
   }

  if(!avatarLocalPath){
    throw new Errorhandle(404, "Avatar file is required")
  }

  //upload in cloudinary

  const avatar= await uploadOncloudinary(avatarLocalPath);
  const coverImage= await uploadOncloudinary(coverImagePath);

  if(!avatar){
    throw new Errorhandle(404,"Not find ");
  }


  //create db

 const user= await User.create({
    fullname,
    avatar: avatar.url, // db te avatar er url boshbe
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })

  const createdUser= await User.findById(user._id).select(
    "-password -refreshToken" //here password and refreshtoken remove from response
  )
//check for user creation
  if (!createdUser) {
    throw new Errorhandle(404,"something went wrong")
    
  }

//return response for this import apiresponse

  return res.status(201).json(
    new Apiresponse(200, createdUser, "User registration successful")
  )

})

export default registerUser;