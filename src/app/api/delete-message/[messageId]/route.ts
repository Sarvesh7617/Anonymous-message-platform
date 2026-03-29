import { connectDB } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/model/user.model";




interface MessageIdProps {
    params: Promise<{
        messageId: string;
    }>;
}


export const DELETE=async(req:NextRequest,{params}:MessageIdProps)=>{

    const {messageId}=await params

    await connectDB()

    const session=await getServerSession(authOptions);

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

    try {
        const updateResult=await User.updateOne(
            {
                _id:session.user._id
            },
            {
                $pull:{
                    messages:{
                        _id:messageId
                    }
                }
            }
        )
    
        if(updateResult.modifiedCount==0)            //how much document modify
            return NextResponse.json(
                {
                    success:false,
                    message:"message not found or already deleted"
                },
                {
                    status:404
                }
            )
    
        return NextResponse.json(
            {
                success:true,
                message:"message deleted successfully"
            },
            {
                status:200
            }
        )
    } 
    catch (error) {
       console.log("Error while deleting message: ",error)
       
        return NextResponse.json(
            {
                success:false,
                message:"Error deleting message"
            },
            {
                status:500
            }
        )
    }
}
