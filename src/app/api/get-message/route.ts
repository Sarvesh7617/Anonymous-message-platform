import { connectDB } from "@/lib/dbConnect"
import { getServerSession } from "next-auth"
import {NextResponse } from "next/server"
import { authOptions } from "../auth/[...nextauth]/option"
import mongoose from "mongoose"
import { User } from "@/model/user.model"







export const GET=async()=>{
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
    
    const userId=new mongoose.Types.ObjectId(session.user._id);
    console.log("Session user id:", session.user._id);

    try {
        const user=await User.aggregate(
            [
                {$match:{_id:userId}},
                {$unwind:'$messages'},
                {$sort:{'messages.createdAt':-1}},
                {$group:{_id:'$_id',messages:{$push:'$messages'}}}
            ]
        )

        if(!user || user.length === 0)
            return NextResponse.json(
                {
                    success:false,
                    message:"user not found or no message"
                },
                {
                    status:404
                }
            )

        return NextResponse.json(
            {
                success:true,
                messages:user[0].messages
            },
            {
                status:200
            }
        )
    } 
    catch (error) {
        console.log("Error while accessing messages: ",error)
        return NextResponse.json(
            {
                success:false,
                message:"internal server error"
            },
            {
                status:500
            }
        )
    }
}