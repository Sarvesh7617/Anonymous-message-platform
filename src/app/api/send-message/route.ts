import { connectDB } from "@/lib/dbConnect";
import { User } from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import {messageProps} from "@/model/message.model";




export const POST=async(req:NextRequest)=>{
    await connectDB()

    const {username,content}=await req.json();

    try {
        const user=await User.findOne({username})

        if(!user)
            return NextResponse.json(
                {
                    success:false,
                    message:"user not found"
                }
            )
        
        //now check if user accept message
        const acceptMessage=user.isAcceptingMessage

        if(!acceptMessage)
            return NextResponse.json(
                {
                    success:false,
                    message:"user not accepting message"
                },
                {
                    status:403
                }
            )
        user.messages.push({content} as messageProps);
        await user.save();

        return NextResponse.json(
            {
                success:true,
                message:"message send successfully"
            },
            {
                status:201
            }
        )
    } 
    catch (error) {
        console.log("Error while sending message: ",error)
        return NextResponse.json(
            {
                success:false,
                message:"sending message failed"
            },
            {
                status:500
            }
        )
    }
}