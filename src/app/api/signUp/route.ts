import { SendVerificationEmail } from "@/helper/sendVerificationEmail";
import { connectDB } from "@/lib/dbConnect"
import { User } from "@/model/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";




export const POST=async(req:NextRequest)=>{
    await connectDB();

    try {
        const {email,username,password}=await req.json()

        const existUserByUsername=await User.findOne({
            username,
            isVerified:true
        })

        if(existUserByUsername)
            return NextResponse.json(
                {
                    success:false,
                    message:"Username already taken"
                },
                {
                    status:400
                }
            )
        
        const existUserByEmail=await User.findOne({email})
        const verifyCode=Math.floor(100000+Math.random()*900000).toString()
        
        if(existUserByEmail)
        {
            if(existUserByEmail.isVerified)
                return NextResponse.json(
                    {
                        success:false,
                        message:`User already exist with this ${email}`
                    },
                    {
                        status:400
                    }
                )

            else
            {
                const hashedPassword=await bcrypt.hash(password,10)
                existUserByEmail.password=hashedPassword
                existUserByEmail.verifyCode=verifyCode
                existUserByEmail.verifyCodeExpiry=new Date(Date.now()+3600000)
                await existUserByEmail.save();
            }
        }
        else
        {
            const hashedPassword=await bcrypt.hash(password,10)
            const codeExpiryDate=new Date(Date.now()+3600000)

            const user=await User.create(
                {
                    username,
                    email,
                    password:hashedPassword,
                    verifyCode,
                    isVerified:false,
                    verifyCodeExpiry:codeExpiryDate,
                    isAcceptingMessage:true,
                    messages:[]
                }
            )

            if(!user)
                return NextResponse.json(
                    {
                        success:false,
                        message:'User registering failed.Please try again'
                    },
                    {
                        status:500
                    }
                )
        }

        //send verification code
        const emailRes=await SendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if(!emailRes.success)
            return NextResponse.json(
                {
                    success:false,
                    message:emailRes.message
                },
                {
                    status:500
                }
            )
        return NextResponse.json(
            {
                success:true,
                message:"User verification code send,Please verify your account"
            },
            {
                status:201
            }
        )
    } 
    catch (error) {
        console.log("Error registering user: ",error)
        return NextResponse.json(
            {
                success:false,
                message:"Error registering user"
            },
            {
                status:500
            }
        )
    }
}