import { connectDB } from "@/lib/dbConnect";
import { getServerSession} from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/option";
import { User } from "@/model/user.model";





export const POST=async(req:NextRequest)=>{
    await connectDB

    const session=await getServerSession(authOptions)

    if(!session || !session?.user)
        return NextResponse.json(
            {
                success:false,
                message:"user not authenticated"
            },
            {
                status:401
            }
        )
    
    const userId=session.user._id
    const {acceptMessage}=await req.json();

    try {
        const updateAcceptMessageStatus=await User.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessage:acceptMessage
            },
            {
                new:true
            }
        )

        if(!updateAcceptMessageStatus)
            return NextResponse.json(
                {
                    success:false,
                    message:"unable to update user message acceptance status"
                },
                {
                    status:404
                }
            )
        return NextResponse.json(
            {
                success:true,
                message:"message acceptance status updated successfully"
            },
            {
                status:200
            }
        )
    } 
    catch (error) {
        console.log("Error updating message acceptance status: ",error);
        return NextResponse.json(
            {
                success:false,
                message:"Error updating message acceptance status"
            },
            {
                status:500
            }
        )
    }
}





export const GET=async ()=>{
    await connectDB()

    const session=await getServerSession(authOptions)

    if(!session || !session?.user)
        return NextResponse.json(
            {
                success:false,
                message:"user not authenticated"
            },
            {
                status:401
            }
        )
    
    const userId=session.user._id

    try {
        const user=await User.findById(userId)

        if(!user)
            return NextResponse.json(
                {
                    success:false,
                    message:"user not found"
                },
                {
                    status:404
                }
            )
        return NextResponse.json(
            {
                success:true,
                isAcceptingMessage:user.isAcceptingMessage
            },
            {
                status:200
            }
        )
    } 
    catch (error) {
        console.log("Error finding message acceptance status: ",error)
        return NextResponse.json(
            {
                success:false,
                message:"Error finding message acceptance status"
            },
            {
                status:500
            }
        )
    }
}