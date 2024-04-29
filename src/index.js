// require('dotenv').config({path: './env'})

import dotenv from "dotenv"

import connectDB from '../db/index.js';
import { app } from "./app.js";

dotenv.config({
    path:'./env'
})



connectDB()
.then(()=>{
    app.listen(process.env.PORT|| 5000,()=>{
        console.log(`App is listening.${
            process.env.PORT
        }`);
    })
})
.catch((error)=>{
    console.log("Error in mongodb.",error);
})

























//first approse.sob eklsthe 


// import express from "express";
// const app =express();
// (async()=>{

//     try{
//         await mongoose.connect(`${process.env.Mongodb_URI}/${DB_NAME}`)
//         app.on("error:",(error)=>{
//             console.log("error",error);
//             throw error
//         })

//         app.listen(process.env.Port,()=>{
//             console.log(`App is listening on port ${process.env.Port}`);
//         })
//     }catch(error){
//         console.error("Error:",error)
//         throw err
//     }

// })()