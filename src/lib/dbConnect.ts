import { DB_name } from "../Constant";
import mongoose from "mongoose";

let cached=global.mongoose

if(!cached)
    cached=global.mongoose={conn:null,promise:null}


//agr phle se koi db connect nhi hai
const connectDB=async()=>{

    //agr phle se connection hai
    if(cached.conn)
    {
        console.log("Already db connect")
        return cached.conn;
    }
    
    //agr connection ho raha ho
    if(!cached.promise)
    {
        cached.promise=mongoose.connect(`${process.env.MONGOOSE_URL}/${DB_name}`)
        .then((connectionInstant) =>connectionInstant.connection
        )
        .catch((err) => {
            console.log("MongoDB connection failed",err)
            process.exit(1);
        });
    }

    //first time connection
    try {
        cached.conn=await cached.promise
        console.log("DB connect successfully")
    } 
    catch (error) {
        throw error
    }

}



export {connectDB};