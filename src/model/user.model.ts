import mongoose,{Schema,Document} from "mongoose";
import { messageProps, messageSchema } from "./message.model";



interface UserProps extends Document{
  username:string
  email:string
  password?:string
  verifyCode?:string
  isVerified:boolean
  verifyCodeExpiry?:Date
  isAcceptingMessage:boolean
  messages:messageProps[]
  authProvider: "credentials" | "google";
}



const userSchema:Schema<UserProps>=new Schema({
  username:{
    type:String,
    required:[true,"username is required"],
    trim:true,
    unique:true
  },
  email:{
    type:String,
    required:[true,"email is required"],
    unique:true,
    match:[/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,"please use valid email address"]
  },
  authProvider:{
    type:String,
    enum:["credentials","google"],
    default:"credentials"
  },
  password:{
    type:String,
    required:function(){
      return this.authProvider === "credentials"
    }
  },
  verifyCode:{
    type:String,
    required:function(){
      return this.authProvider === "credentials"
    }
  },
  isVerified:{
    type:Boolean,
    default:false
  },
  isAcceptingMessage:{
    type:Boolean,
    default:true
  },
  messages:[messageSchema]
},{timestamps:true})


export const User=mongoose.models.User as mongoose.Model<UserProps>|| mongoose.model<UserProps>("User",userSchema)