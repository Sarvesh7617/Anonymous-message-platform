import {Schema,Document} from "mongoose";



export interface messageProps extends Document{
    content:string
    createdAt: Date;
}



export const messageSchema:Schema<messageProps>=new Schema({
    content:{
        type:String,
        required:true
    }
},{timestamps:{createdAt:true,updatedAt:false}})