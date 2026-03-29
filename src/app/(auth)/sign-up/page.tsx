'use client'

import { useEffect, useState } from "react";
import { useDebounceCallback } from 'usehooks-ts'
import axios,{AxiosError} from 'axios';
import {apiResProps} from "@/Types/ApiResponse";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod";
import { signUpSchema } from "@/schema/signupSchema";
import { toast } from "sonner"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import {Loader2} from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Logo from "@/../public/logo.webp";



const SignUP=()=>{
    const [username,setUsername]=useState("");
    const [usernameMessage,setUsernameMess]=useState("")
    const [isCheckUsername,setCheckUsername]=useState(false);
    const [loading,setLoading]=useState(false);
    
    const debounced=useDebounceCallback(setUsername,500);

    const navigate=useRouter()

    const form=useForm<z.infer<typeof signUpSchema>>({
        resolver:zodResolver(signUpSchema),
        defaultValues:{
            username:"",
            email:"",
            password:""
        }
    })

    useEffect(()=>{
        const checkUsernameUnique=async()=>{
            if(username)
            {
                setCheckUsername(true);
                setUsernameMess("")

                try {
                    const res=await axios.get<apiResProps>(`/api/check-username-unique?username=${username}`)
                    setUsernameMess(res.data.message);
                } 
                catch (error) {
                    const axiosError=error as AxiosError<apiResProps>;

                    setUsernameMess(axiosError.response?.data.message ?? "Error checking username unique")
                }
                finally{
                    setCheckUsername(false);
                }
            }
        }
        checkUsernameUnique();
    },[username])

    const SignUpForm=async (data:z.infer<typeof signUpSchema>)=>{
        setLoading(true)

        try {
            const res=await axios.post<apiResProps>('/api/signUp',data)

            toast.success("",{
                description:res.data.message,
                position:"top-center",
                className:"!bg-green-500 !text-black !text-lg flex items-center justify-start"
            })

            form.reset();
            navigate.replace(`/verify/${username}`)
        } 
        catch (error) {
            console.log("Error while signUp: ",error)

            const axiosError=error as AxiosError<apiResProps>

            toast.error("",{
                description:axiosError.response?.data.message,
                position:"top-center",
                className:"!bg-red-500 !text-black !font-bold !text-lg flex items-center justify-start"
            })
        }
        finally{
            setLoading(false)
        }
    }

    return(
        <div className="flex items-center justify-center w-full dark:bg-black min-h-screen">
            <div className="w-full max-w-md dark:bg-gray-600 bg-gray-300 rounded-xl p-5 border-black/10 m-8 relative z-50 dark:text-white">
                <div className="flex justify-center">
                    <Image src={Logo} width={60} className="rounded-md" alt="logo"/>
                </div>
                <h2 className="text-center font-bold text-2xl leading-tight">Sign up to create account</h2>
                <p className="text-center text-md p-2 leading-tight">
                    Already have an account?&nbsp;
                    <Link href='/sign-in' className="text-blue-500 font-semibold underline">
                        Sign In
                    </Link>
                </p>
                <form onSubmit={form.handleSubmit(SignUpForm)} className="space-y-3">
                
                    <Controller
                        name='username'
                        control={form.control}
                        render={({field,fieldState})=>(
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Username*</FieldLabel>
                            <Input 
                                {...field}
                                id="username" 
                                type="text"
                                aria-invalid={fieldState.invalid}
                                placeholder="Username" 
                                className="border-2 border-black dark:border-white focus:bg-gray-200"
                                onChange={(e)=>{
                                    field.onChange(e) 
                                    debounced(e.target.value)
                                }}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            {isCheckUsername && <Loader2 className="animate-spin"/>}
                            {!fieldState.invalid && <p className={`text-sm ${usernameMessage==="username is available"?"text-green-700":"text-red-500"}`}>{usernameMessage}</p>}
                        </Field>
                        )}
                    />
                    <Controller
                        name='email'
                        control={form.control}
                        render={({field,fieldState})=>(
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Email*</FieldLabel>
                            <Input 
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid} 
                                type={field.name}
                                placeholder="Enter email" 
                                className="border-2 border-black dark:border-white focus:bg-gray-200"
                            />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                        )}
                    />
                    <Controller
                        name="password"
                        control={form.control}
                        render={({field,fieldState})=>(
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Password*</FieldLabel>
                            <Input 
                                {...field}
                                id={field.name} 
                                aria-invalid={fieldState.invalid}
                                type="password" 
                                placeholder="Enter password" 
                                className="border-2 border-black dark:border-white focus:bg-gray-200"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                        )}
                    />
                    <Button
                        type="submit"
                        className="w-full font-bold text-md mt-3 hover:cursor-pointer"
                    >{loading?(<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Processing...</>):"Sign Up"}</Button>
                </form>
                <div className="flex items-center justify-center w-full my-3">
                    <hr className="flex-grow border border-gray-400"/>
                    <span>OR</span>
                    <hr className="flex-grow border-gray-400"/>
                </div>

                <button
                    className="hover:cursor-pointer bg-white border-2 border-blue-400 w-full p-2 rounded-md text-black font-semibold flex items-center justify-center gap-2"
                    onClick={()=>signIn('google',{callbackUrl:"/dashboard"})}
                >
                    <FcGoogle size={22}/>
                    Sign Up with Google
                </button>
            </div>
        </div>
    )
}


export default SignUP;