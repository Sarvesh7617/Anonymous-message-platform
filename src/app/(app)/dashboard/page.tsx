'use client'

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { messageProps } from "@/model/message.model";
import { AcceptMessageSchema } from "@/schema/acceptmessageSchema";
import { apiResProps } from "@/Types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {z} from "zod";



const Dashboard=()=>{
    const [messages,setMessage]=useState<messageProps []>([])
    const [isloading,setLoading]=useState<boolean>(false);
    const [isSwitchloading,setSwitchloading]=useState<boolean>(false)

    const {data:session}=useSession();

    const navigate=useRouter();

    const handleDeleteMessage=async(messageId:string)=>{
        setMessage(messages.filter(m=>m._id.toString()!==messageId))
    }

    const {register,watch,setValue}=useForm<z.infer<typeof AcceptMessageSchema>>({
        resolver:zodResolver(AcceptMessageSchema)
    });

    const acceptMessage=watch('acceptMessage');

    const fetchMessage=useCallback(async(refresh:boolean=false)=>{
        setLoading(true)
        setSwitchloading(false)

        try {
            const res=await axios.get<apiResProps>("/api/get-message")
            setMessage(res.data.messages || [])

            if(refresh)
                toast.success("Refreshed Messages",{
                    description:'Showing latest messages',
                    position:"top-center",
                    className:"!bg-green-500 !text-black !font-bold !text-lg flex items-center justify-start"
            })
        } 
        catch (error) {
            const axiosError=error as AxiosError<apiResProps>

            toast.error("Error:",{
                description:axiosError.response?.data.message ?? 'Failed to fetch messages',
                position:"top-center",
                className:"!bg-red-500 !text-black !font-bold !text-lg flex items-center justify-start"
            })
        }
        finally{
            setLoading(false)
            setSwitchloading(false)
        }
    },[setMessage,setLoading]);


    const fetchAcceptMessage=useCallback(async ()=>{
        setSwitchloading(true)

        try {
            const res=await axios.get<apiResProps>(`/api/accept-message-status`)
            setValue("acceptMessage",res.data.isAcceptingMessage || false)
        } 
        catch (error) {
            const axiosError=error as AxiosError<apiResProps>

            toast.error("Error:",{
                description:axiosError.response?.data.message,
                position:"top-center",
                className:"!bg-red-500 !text-black !font-bold !text-lg flex items-center justify-start"
            })
        }
        finally{
            setSwitchloading(false)
        }
    },[setValue]);

    const SwitchChange=async()=>{
        try {
            const res=await axios.post<apiResProps>(`/api/accept-message-status`,{
                acceptMessage:!acceptMessage
            })
            setValue('acceptMessage',!acceptMessage)
            toast.success("",{
                description:res.data.message,
                position:"top-center",
                className:"!bg-green-500 !text-black !font-bold !text-lg flex items-center justify-start"
            })
        } 
        catch (error) {
            const axiosError=error as AxiosError<apiResProps>

            toast.error("Error:",{
                description:axiosError.response?.data.message ?? "Failed to update message status",
                position:"top-center",
                className:"!bg-red-500 !text-black !font-bold !text-lg flex items-center justify-start"
            })
        }
    }

    useEffect(()=>{
        if(!session || !session?.user)
            return

        fetchMessage();
        fetchAcceptMessage();
    },[session])

    const username = (session?.user as User)?.username ?? "";
    let profileURL="";
    if(session)
    {
        const baseURL=`${window.location.protocol}//${window.location.host}`
        profileURL=`${baseURL}/u/${username}`;
    }

    const copyToClipboard=()=>{
        navigator.clipboard.writeText(profileURL)
        toast.success("URL Copied!",{
            description:"Profile URL has been copied to clipboard.",
            position:"top-center",
            className:"!bg-green-500 !text-black !font-bold !text-lg flex items-center justify-start"
        })

        navigate.replace(`/u/${username}`)
    }

    return(
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
                <div className="flex items-center">
                    <Input
                        type="text"
                        value={profileURL}
                        readOnly
                        className="border-2 border-black darK:border-white bg-gray-300 text-lg font-semibold rounded-r-none border-r-0" 
                    />
                    <Button className="!bg-green-500 hover:cursor-pointer rounded-l-none font-bold text-lg" onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    {...register("acceptMessage")}
                    checked={acceptMessage}
                    onCheckedChange={SwitchChange}
                    disabled={isSwitchloading}
                    className="hover:cursor-pointer"
                />
                <span className="text-lg font-semibold">Accept Message: {acceptMessage?"On":"Off"}</span>
            </div>

            <Separator/>

            <Button className="hover:cursor-pointer mt-4" onClick={(e)=>{e.preventDefault(); fetchMessage(true)}}>
                {isloading?(
                    <Loader2 className="h-4 w-4 animate-spin"/>
                ):(
                    <RefreshCcw className="h-4 w-4"/>
                )}
            </Button>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length>0?(
                    messages.map((m,idx)=>(
                        <MessageCard
                            key={idx}
                            message={m}
                            onDelete={handleDeleteMessage}
                        />
                    ))
                ):(
                    <p className="text-center text-xl py-10 text-red-500">No message to display</p>
                )}
            </div>
        </div>
    )
}



export default Dashboard;