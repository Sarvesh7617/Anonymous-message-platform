import { connectDB } from "@/lib/dbConnect";
import { User } from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";



const POST=async(req:NextRequest)=>{
    await connectDB()
    try {
        const {username,code}=await req.json();
        
        const decodeusername=decodeURIComponent(username)                   //agr username me space hai toh %20 hota hai

        const user=await User.findOne({
            username:decodeusername
        })

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
        
        const codeCorrect=user.verifyCode==code;
        const codeNotExpire=user.verifyCodeExpiry?new Date(user.verifyCodeExpiry)>new Date():false;

        if(codeCorrect && codeNotExpire)
        {
            user.isVerified=true;
            await user.save();
            return NextResponse.json(
                {
                    success:true,
                    message:"account is verified successfully"
                },
                {
                    status:200                         //not 201 Koi naya resource create nahi ho raha.Sirf update ho raha hai (isVerified = true).
                }
            )
        }
        //code is expire
        else if(!codeNotExpire)
            return NextResponse.json(
                {
                    success:false,
                    message:"verification code has expired. Please sign up again to get a new code"
                },
                {
                    status:410                              //Resource pehle valid tha, ab expire ho gaya. but 400 also acceptable
                }
            )
        //incorrect code
        else
            return NextResponse.json(
                {
                    success:false,
                    message:"incorrect verification code."
                },
                {
                    status:401                              //bcu authentication failed
                }
            )
    } 
    catch (error) {
        console.log("Error verifying user: ",error);
        return NextResponse.json(
            {
                success:false,
                message:"Error verifying account"
            },
            {
                status:500
            }
        )    
    }
}



export {POST};