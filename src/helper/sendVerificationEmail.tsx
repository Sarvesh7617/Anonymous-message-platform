import { resend } from "@/lib/resend";
import { apiResProps } from "@/Types/ApiResponse";
import VerificationEmail from "../../email/verificationEmail"


const SendVerificationEmail=async(
    email:string,
    username:string,
    verifyCode:string

):Promise<apiResProps>=>{
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mystry message | Verification code',
            react: <VerificationEmail username={username} otp={verifyCode}/>,
        });
        return {
            success:true,
            message:"Verification email send successfully"
        }
    } 
    catch (error) {
        console.log("Error sending verification email: ",error)
        return {
            success:false,
            message:"failed to send verification code"
        }
    }
}



export {SendVerificationEmail};