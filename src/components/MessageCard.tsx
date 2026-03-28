'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { InfoIcon, X } from "lucide-react";
import { Button } from "./ui/button";
import axios, { AxiosError } from "axios";
import { messageProps } from "@/model/message.model";
import { toast } from "sonner";
import { apiResProps } from "@/Types/ApiResponse";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import dayjs from 'dayjs'



interface MessageCardProps{
    message:messageProps
    onDelete:(messageId:string)=>void
}


const MessageCard=({message,onDelete}:MessageCardProps)=>{
    const handleDeleteConfirm=async()=>{
        try {
            const res=await axios.delete<apiResProps>(`/api/delete-message/${message._id}`)
    
            toast.success("",{
                description:res.data.message,
                position:"top-center",
                className:"!bg-green-500 !text-black !font-bold !text-lg flex items-center justify-start"
            })

            onDelete(message._id.toString());
        } 
        catch (error) {
            const axiosError=error as AxiosError<apiResProps>

            toast.error("",{
                description:axiosError.response?.data.message ?? "Failed to delete message",
                position:"top-center",
                className:"!bg-red-500 !text-black !font-bold !text-lg flex items-center justify-start"
            })
        }
    }
    return(
        <Card className="card-bordered">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>{message.content}</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant={"destructive"} className="hover:cursor-pointer">
                                <X className="w-5 h-5"/>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete
                                    this message.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="hover:cursor-pointer">
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm} className="hover:cursor-pointer">
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <div className="text-sm">
                    {dayjs(message.createdAt).format("MMM D,YYYY h:mm A")}
                </div>
            </CardHeader>
            {/* <CardContent>
                <p>Card Content</p>
            </CardContent> */}
        </Card>
    )
}


export default MessageCard;