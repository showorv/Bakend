import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app=express();


app.use(cors({
    origin:process.env.Cors_origin,
    credentials:true
}))

app.use(express.json({limit:"16kbh"}))
app.use(express.urlencoded({extended:true , limit:"16kb"}))
app.use(express.static("public")); //public file e ja thkbe ta sby show korbe

app.use(cookieParser())

export{app};