import { connectDB } from "@/lib/dbConnect";
import { User } from "@/model/user.model";
import { usernameSchema } from "@/schema/signupSchema";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";




const usernameQuerySchema=z.object({
    username:usernameSchema
})


export const GET=async(req:NextRequest)=>{
    await connectDB()

    try {
        const {searchParams}=new URL(req.url)
        const queryParam={
            username:searchParams.get("username")
        }

        const result=usernameQuerySchema.safeParse(queryParam)

        if(!result.success)
        {
            const usernameError=result.error.format().username?._errors || []
            return NextResponse.json(
                {
                    success:false,
                    message:usernameError?.length>0?usernameError.join(", "):"invalid query parameter"
                },
                {
                    status:400
                }
            )
        }

        const {username}=result.data

        const existVerifyUser=await User.findOne({
            username,
            isVerified:true
        })

        if(existVerifyUser)
            return NextResponse.json(
                {
                    success:false,
                    message:"username already taken.Please choose different username"
                },
                {
                    status:400
                }
            )
        
        return NextResponse.json(
                {
                    success:true,
                    message:"username is available"
                },
                {
                    status:200
                }
            )
        
    } 
    catch (error) {
        console.log("Error checking username: ",error)
        return NextResponse.json(
            {
                success:false,
                message:"error checking username"
            },
            {
                status:500
            }
        )

    }
}