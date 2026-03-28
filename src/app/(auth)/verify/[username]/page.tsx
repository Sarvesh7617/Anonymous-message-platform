'use client'

import { Controller, useForm } from "react-hook-form"
import {z} from "zod"
import {VerifySchema} from "@/schema/verifycodeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { apiResProps } from "@/Types/ApiResponse";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import OTPInput from "@/components/otp";
import { useParams, useRouter } from "next/navigation";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";



type VerifyAccountProps={ 
    username: string; 
};





const VerifyAccount=()=>{

    const form=useForm<z.infer<typeof VerifySchema>>({
        resolver:zodResolver(VerifySchema),
    })
    const [loading,setLoading]=useState<boolean>(false);
    const [res,setRes]=useState<boolean>(false);
    
    const codeVal=form.watch("code");
    const navigate=useRouter();

    const params=useParams<VerifyAccountProps>();

    const formSubmit=async (data:z.infer<typeof VerifySchema>)=>{
        setLoading(true);
        try {
            const res=await axios.post<apiResProps>("/api/verify-code",{
                username:params.username,
                code:data.code
            })

            toast.success("",{
                description:res.data.message,
                position:"top-center",
                className:"!bg-green-500 !text-black !font-bold !text-lg flex items-center justify-start"
            })

            navigate.replace("/sign-in");
            
        } 
        catch (error) {
            console.log("Error while verifyCode: ",error)

            const axiosError=error as AxiosError<apiResProps>

            toast.error("",{
                description:axiosError.response?.data.message,
                position:"top-center",
                className:"!bg-red-500 !text-black !font-bold !text-lg flex items-center justify-start"
            })

            if(axiosError.response?.data.message=="verification code has expired. Please sign up again to get a new code")
                setRes(true);
        }
        finally{
            setLoading(false)
        }
    }

    return(
        <div className="flex items-center justify-center w-full dark:bg-black min-h-screen">
            <div className="w-full max-w-md dark:bg-gray-600 bg-gray-300 rounded-xl p-5 border-black/10 m-8 relative z-50 dark:text-white">
                <div className="flex justify-center">
                    <span>
                        {/* <Logo/> */}LOGO
                    </span>
                </div>
                <h2 className="text-center font-bold text-2xl leading-tight">Account Verification</h2>
                    
                <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-3">
                        
                    <Controller
                        name="code"
                        control={form.control}
                        render={({field,fieldState})=>(
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name} className="text-md mt-5">Enter Code*</FieldLabel>
                                <OTPInput value={field.value} onChange={field.onChange}/>
                            
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Button
                        type="submit"
                        disabled={codeVal?.length!==6}
                        className="w-full font-bold text-md mt-3 hover:cursor-pointer"
                    >{loading?(<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Verifying...</>):"Verify"}</Button>
                </form>
                {res && 
                    <p onClick={()=>navigate.replace('/sign-up')} className="w-full text-blue-500 font-semibold underline text-center mt-5 hover:cursor-pointer">
                        Sign In
                    </p>
                }
            </div>
        </div>
    )
}


export default VerifyAccount;