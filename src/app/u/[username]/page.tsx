'use client'

import { useState } from "react";
import { useCompletion } from '@ai-sdk/react';
import { Controller, useForm } from "react-hook-form";
import {z} from "zod";
import { MessageSchema } from "@/schema/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { apiResProps } from "@/Types/ApiResponse";
import { toast } from "sonner";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

type paramsProps={
        username:string
}


const SendMessage=()=>{
    const params=useParams<paramsProps>();
    const username=decodeURIComponent(params.username);
    const [isLoading,setloading]=useState<boolean>(false);

    const initialMessageString ="What's your favorite movie?||Do you have any pets?||What's your dream job?";

    const { complete, completion, isLoading:isSuggestLoading, error } = useCompletion({
        api: "/api/suggest-message",
        initialCompletion: initialMessageString,
        streamProtocol:"text"
    }); 

    const form=useForm<z.infer<typeof MessageSchema>>({
        resolver:zodResolver(MessageSchema)
    })

    const messContent=form.watch('content');

    const SendMessage=async(data:z.infer<typeof MessageSchema>)=>{
        setloading(true)
        try {
            const res=await axios.post<apiResProps>('/api/send-message',{
                content:data.content,
                username
            })
            toast.success("",{
                description:res.data.message,
                position:"top-center",
                className:"!bg-green-500 !text-black !font-bold !text-lg flex items-center justify-start"
            })
            form.reset({...form.getValues(),content:""})
        } 
        catch (error) {
            const axiosError=error as AxiosError<apiResProps>
            toast.error("",{
                description:axiosError.response?.data.message ?? "Failed to send message",
                position:"top-center",
                className:"!bg-red-500 !text-black !font-bold !text-lg flex items-center justify-start"
            })
        }
        finally{
            setloading(false);
        }
    }


    const fetchMessage = async () => {
        try {
            complete("generate"); 
        } 
        catch (error) {
            console.log("Error fetching messages:", error);
            const err=error instanceof Error?error.message : String(error)
            toast.error("Fetching error",{
                description:err,
                position:"top-center",
                className:"!bg-red-500 !text-black !font-bold !text-lg flex items-center justify-start"
            })
        }
    };

    const handleMessageClick=(message:string)=>{
        form.setValue('content',message)
    }

    const parseStringMessages=(message:string):string[]=>{
       return message.split("||");
    }

    return(
        <div className="container mx-auto my-8 p-6 rounded max-w-4xl">
            <h1 className="text-4xl font-bold mb-6 text-center">
                Public Profile Link
            </h1>
            <form onSubmit={form.handleSubmit(SendMessage)} className="space-y-6">
                <Controller
                    name="content"
                    control={form.control}
                    render={({field,fieldState})=>(
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Send Anonymous Message to @{username}</FieldLabel>
                            <Textarea
                                placeholder="Write your anonymous message here"
                                className="resize-none"
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                        </Field>
                    )}
                />
                <div className="flex justify-center">
                    {isLoading?(
                        <Button disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                            Please wait
                        </Button>
                    ):(
                        <Button
                            type="submit"
                            disabled={isLoading || !messContent}
                            className="hover:cursor-pointer"
                        >
                            Send It
                        </Button>
                    )}
                </div>
            </form>

            <div className="space-y-4 my-8">
                <div className="space-y-2">
                    <Button
                        onClick={fetchMessage}
                        disabled={isSuggestLoading}
                        className="my-4 hover:cursor-pointer"
                    >
                        Suggest Message
                    </Button>
                    <p>Click on any message below to select it.</p>
                </div>
                <Card>
                    <CardHeader className="text-xl font-semibold">Messages</CardHeader>
                    <CardContent className="flex flex-col gap-y-4">
                        {error?(
                            <p className="text-red-500">{error.message}</p>
                        ):isSuggestLoading?(
                            <div className="flex w-full flex-col gap-2">
                                <Skeleton className="h-4 w-full bg-gray-500"/>
                                <Skeleton className="h-4 w-full bg-gray-500"/>
                                <Skeleton className="h-4 w-full bg-gray-500"/>
                            </div>
                        ):(
                            parseStringMessages(completion).map((mess,idx)=>(
                                <Button
                                    key={idx}
                                    variant={"outline"}
                                    onClick={()=>handleMessageClick(mess)}
                                    className="mb-2 hover:cursor-pointer whitespace-normal break-words py-6"
                                >
                                    {mess}
                                </Button>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
            <Separator className="my-6"/>
            <div className="text-center">
                <div className="mb-4">Get Your Message Board</div>
                <Link href={'/sign-up'}>
                    <Button className="hover:cursor-pointer">Create Your Account</Button>
                </Link>
            </div>
        </div>
    )
}



export default SendMessage;