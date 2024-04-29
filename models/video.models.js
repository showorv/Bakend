import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new mongoose.Schema({
    videofile:{
        type: String, //url
        required: true
    },
    thumbail:{
        type: String, //url
        required: true
    },
    tittle:{
        type: String, 
        required: true
    },
    description:{
        type: String, 
        required: true
    },
  

    views:{
        type: Number,
        default:0
    },

    isPublished:{
        type:Boolean,
    default:true
    },
    owner:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})




videoSchema.plugin(mongooseAggregatePaginate)
export const Video= mongoose.model("Video",videoSchema)