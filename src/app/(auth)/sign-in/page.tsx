'use client'
import { signIn} from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {z} from "zod";
import {signInSchema} from '@/schema/signinSchema'
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Logo from "@/../public/logo.webp";
import Image from "next/image";




const Login=()=>{

    const form=useForm<z.infer<typeof signInSchema>>({
        resolver:zodResolver(signInSchema),
        defaultValues:{
            identifier:"",
            password:""
        }
    });

    const navigate=useRouter();


    const [loading,setLoading]=useState<boolean>(false)

    const SignInForm=async (data:z.infer<typeof signInSchema>)=>{
        setLoading(true)

        const res=await signIn('credentials',{
            identifier:data.identifier,
            password:data.password,
            redirect:false
        })

        if(!res?.ok)
        {
            toast.error("",{
                description:res?.error,
                position:"top-center",
                className:"!bg-red-500 !text-black !font-bold !text-lg flex items-center justify-start"
            })
            setLoading(false);
        }

        else if(res.url=="http://localhost:3000/sign-in")
        {
            toast.success("Login Successfully",{
                description:res?.error,
                position:"top-center",
                className:"!bg-green-500 !text-black !font-bold !text-lg flex items-center justify-start"
            })
            form.reset();
            setLoading(false);
            const timer=setTimeout(()=>navigate.replace("/dashboard"),1500)
            return ()=>clearTimeout(timer);
        }
    }
    return(
        <div className="flex items-center justify-center w-full dark:bg-black min-h-screen">
            <div className="w-full max-w-md dark:bg-gray-600 bg-gray-300 rounded-xl p-5 border-black/10 m-8 relative z-50 dark:text-white">
                <div className="flex justify-center">
                    <Image src={Logo} width={60} className="rounded-md" alt="logo"/>
                </div>
                <h2 className="text-center font-bold text-2xl leading-tight">Sign in to your account</h2>
                <p className="text-center text-md p-2 leading-tight">
                    Don't have any account?&nbsp;
                    <Link href='/sign-up' className="text-blue-500 font-semibold underline">
                        Sign Up
                    </Link>
                </p>
                <form onSubmit={form.handleSubmit(SignInForm)} className="space-y-3">
                
                    <Controller
                        name='identifier'
                        control={form.control}
                        render={({field,fieldState})=>(
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Email or Username*</FieldLabel>
                            <Input 
                                {...field}
                                id="identifier" 
                                type="text"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter email or username" 
                                className="border-2 border-black dark:border-white focus:bg-gray-200"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                        )}
                    />
                    <Controller
                        name='password'
                        control={form.control}
                        render={({field,fieldState})=>(
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Password*</FieldLabel>
                            <Input 
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid} 
                                type={field.name}
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
                    >{loading?(<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Processing...</>):"Sign In"}</Button>
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
                    Sign In with Google
                </button>
            </div>
        </div>
    )
}



export default Login;
