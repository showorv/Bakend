import { asynchandle } from "../utils/aynchandle.js";
import { Errorhandle } from "../utils/Errorhandle.js";
import { User } from "../models/user.models.js";
import { uploadOncloudinary } from "../utils/cloudinary.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import jsonwebtoken from "jsonwebtoken"

//refresh and accesstoken

const accessandRefreshTokens= async(userId)=>{
  try {
    
    const user= await User.findById(userId)
   
    const accessToken= await User.generateAccessToken()
    const refreshToken=await User.generateRefreshToken()

    user.refreshToken=refreshToken
    await user.save({ validateBeforeSave:false })
     return { accessToken,refreshToken };




  } catch (error) {
   
    throw new Errorhandle(400,"Something went wrong")
  }
}

//todos 
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

//login todos

//req.body- data
//check username or email, password
//check password
//accesstoken and refreshtoken
//send cookie
//return res
const loginUser= asynchandle(async(req,res)=>{
  const {username,email, password}=req.body

  if(!(username || email)){
    throw new Errorhandle(400,"Username or email required")
  }

  const user=await User.findOne({
    $or: [{username},{email}]
  })

  if(!user){
    throw new Errorhandle(404,"User does not exist")
  }

  //check password by bcrypt

 const ispassword= await user.isPasswordCorrect(password);
 if(!ispassword){
  throw new Errorhandle(400,"password not correct")
 }
//declare access and refreshtoken here
  const {accessToken,refreshToken}= await accessandRefreshTokens(user._id)

  //password and refrershtoken remove

  const loginUser= await User.findById(user._id).select("-password -refreshToken")


  //send cookies

const options = {
  httpOnly: true,  //cookies k mby default j keu modify korte pare frontend e bt egula true kore dewai shudhu server theke modify hbe
  secure: true
}


return res.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(
  new Apiresponse(
    200,
  {
    user: loginUser, accessToken, refreshToken //hoyto user nij theke egula save korte chay tai user er mddhe access refresh diye dibo
  },
  "User loggedin Successfully"

)
)
  


})

//log out

const logoutUser= asynchandle(async(req,res)=>
  {
    await User.findByIdAndUpdate(
     
      req.user._id,

      {
        refreshToken:undefined //jehetu logout korar age refresh token muche dite hbe
      },

      {
        new: true //new refresh token ashar jnne
      }
    )

    const options = {
      httpOnly: true,  //cookies k mby default j keu modify korte pare frontend e bt egula true kore dewai shudhu server theke modify hbe
      secure: true
    }

   return res.status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json(
    new Apiresponse(200,{},"Logged Out")
   )
  })

  //access and refreshtoken end point

  const refreshAccessToken= asynchandle(async(req,res)=>{
      const incomingRefreshToken= req.cookies.refreshToken || req.body.refreshToken

      if(!incomingRefreshToken){
        throw new Errorhandle(401,"unauthorized token")
      }
//verify decodedtoken
     try {
      const decodedToken= jsonwebtoken.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
 
         const user= await User.findById(decodedToken?._id)
         
         if(!user){
           throw new Errorhandle(400,"Invalid refresh token")
         }
 
         if(incomingRefreshToken !== user){
           throw new Errorhandle(400,"Invalid refresh token or used")
         }
 
         const options={
           httpOnly: true,
           secure: true
         }
 
     const {accessToken, newrefreshToken} = await  accessAndRefreshTokens(user._id)
 
       return res.status(200)
       .cookie("accessToken",accessToken, options)
       .cookie("refreshToken",newrefreshToken , options)
       .json(
         new Apiresponse(200,
           {accessToken, refreshToken: newrefreshToken},
           "Access Token refresh successfully"
         )
       )
     } catch (error) {
      throw new Errorhandle(401,"Invalid")
     }


  })


  //password change proccess
  const oldNewPass = asynchandle(async(req,res)=>{

    const {oldPassword, newPassword}= req.body

    const user= await User.findById(req.user?._id)
    const ispasscorrect= await user.isPasswordCorrect(oldPassword)

    if(!ispasscorrect){
      throw new Errorhandle(400,"Invalid old password")

    }

    user.password= newPassword

    await user.save({ validateBeforeSave: false})

    return res.status(200)
    .json(
      new Apiresponse(400, {}, "Password Changed Successfully")
    )


  })

  //currrent user defined
  const currentUser = asynchandle(async(req,res)=>{

    return res.status(200).
    json(new Apiresponse(200, req.user, "User defined Successfully"))
  })


//update account
  const updateAccountDetials= asynchandle(async(req,res)=>{

    const {fullname, email}= req.body

    if(!(fullname || email)){
      throw new Errorhandle(404,"fullname or email required")
    }

    const user = await  User.findByIdAndUpdate(
      req.user?._id,
      {
        $set:{
          fullname, //fullname: fullname evbe duivbei likha jay
          email: email
        }
      },
      {new: true}
    ).select("-password")


    return res.status(200).
    json(new Apiresponse(200, user, "Account updated Successfully"))

  })

  //update avatar
  const updateAvatar= asynchandle(async(req,res)=>{
    const avatarLocalPath= req.file?.path

    if(!avatarLocalPath){
      throw new Errorhandle(404,"Avatar file is missing")
    }

    //todo : delete previous avatar. Eta shikhte hbe....... Ekta util banaite hbe

   const avatar= await uploadOncloudinary(avatarLocalPath)

   if(!avatar.url){
    throw new Errorhandle(404,"Error while uploading")
   }

  const user= await User.findByIdAndUpdate(

    req.user?._id,
    {
      $set:{
        avatar: avatar.url
      }
    },
    {new: true}
   ).select("-password")

   return res.status(200).
   json(new Apiresponse(200, user,"Avatar image updated successfully" ))
   
  })

  const updateCoverImage= asynchandle(async(req,res)=>{
    const coverImageLocalPath= req.file?.path

    if(!coverImageLocalPath){
      throw new Errorhandle(404,"Cover file is missing")
    }

   const coverImage= await uploadOncloudinary(coverImageLocalPath)

   if(!coverImage.url){
    throw new Errorhandle(404,"Error while uploading")
   }

   const user= await User.findByIdAndUpdate(

    req.user?._id,
    {
      $set:{
        coverImage: coverImage.url
      }
    },
    {new: true}
   ).select("-password")

   return res.status(200).
   json(new Apiresponse(200, user,"Cover image updated successfully" ))
   
  })




export {registerUser,
  loginUser,
  logoutUser,
refreshAccessToken,
accessandRefreshTokens,
oldNewPass,
currentUser,
updateAccountDetials,
updateAvatar,
updateCoverImage} ;
