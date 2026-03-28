import CredentialsProvider from "next-auth/providers/credentials"
import { connectDB } from "@/lib/dbConnect"
import { User } from "@/model/user.model"
import bcrypt from "bcryptjs"
import { NextAuthOptions } from "next-auth"
import Google from "next-auth/providers/google"





const authOptions:NextAuthOptions={
    providers:[
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                email:{ label: "Email or Username", type: "text", placeholder: "Enter your email/Username" },
                password:{ label: "Password", type: "password", placeholder: "Enter Password" }
            },
            async authorize(credentials:any):Promise<any>{
                const email=credentials?.identifier
                const password=credentials?.password

                if(!email || !password)
                    throw new Error("email or password field is missing")

                await connectDB()

                try {
                    const user=await User.findOne({
                        $or:[
                            {email},
                            {username:credentials.identifier}
                        ]})
                    
                        if(!user)
                            throw new Error("user not found")

                        if(user.authProvider!="credentials" || !user.password)
                            throw new Error("please login using Google")

                        if(!user.isVerified)
                            throw new Error("please verify your account before login")
                        
                        const matchPassword=await bcrypt.compare(credentials.password,user.password)

                        if(!matchPassword)
                            throw new Error("incorrect password")

                        return user;
                } 
                catch (error:any) {
                    throw new Error(error)
                }
            }
        }),
        Google({
            clientId:process.env.CLIENT_ID!,
            clientSecret:process.env.CLIENT_SECRET!
        })
    ],
    callbacks:{

        //for google login
        async signIn({account,user})
        {
            if(account?.provider=='google')
            {
                await connectDB()
                let existUser=await User.findOne({email:user?.email})

                if(!existUser)
                {
                    existUser=await User.create({
                        email:user.email as string,
                        username:user.name as string,
                        isVerified:true,
                        authProvider:"google"
                    })
                }
                user._id = existUser._id.toString()
                user.username = existUser.username
                user.isVerified=existUser.isVerified
                user.isAcceptingMessage=existUser.isAcceptingMessage
            }
            return true;
        },
        async jwt({token,user}){
            if(user)
            {
                token._id=user._id,
                token.isVerified=user.isVerified,
                token.isAcceptingMessage=user.isAcceptingMessage,
                token.username=user.username
            }
            return token;
        },

        async session({session,token}){
            if(token)
            {
                session.user._id=token._id as string,
                session.user.isVerified=token.isVerified as boolean
                session.user.isAcceptingMessage=token.isAcceptingMessage as boolean,
                session.user.username=token.username as string
            }
            return session;
        }
    },
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy:"jwt",
        maxAge:30*24*60*60          //30days
    },
    secret:process.env.NEXTAUTH_SECRET
}




export {authOptions};