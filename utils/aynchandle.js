//promise resolve reject
const asynchandle=(requestHandle)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandle(req,res,next)).
        catch((err)=>next(err));
    }
}

export {asynchandle}


// const asynchandle=()=>{}
// const asynchandle=(fn)=>()=>{}
// const asynchandle=(func)=> async()=>{}


//try catch
// const asynchandle=(func)=>async(req,res,next)=>{
//     try{
//         await func(req,res,next)
//     }catch(error){
//         res.status(err.code ||404).json({
//             success:false,
//             message:err.message
//         })
        
//     }
// }