import mongoose from "mongoose";
import { DB_NAME } from "../src/constants.js";
// import bodyparserJsonError from "bodyparser-json-error";

const connectDB = async()=>{
    try{
        const connectionins= await mongoose.connect(`${process.env.Mongodb_URI}/${DB_NAME}`);
        console.log(`\n mongodb conneted.. Db host:${connectionins.connection.host}`);
    }catch(error){
        console.log("Error",error);
        process.exit(1);
    }
}


export default connectDB;





//process hcche current application er reference