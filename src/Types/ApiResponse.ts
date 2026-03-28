import { messageProps } from "@/model/message.model";

export interface apiResProps{
    success:boolean,
    message:string,
    isAcceptingMessage?:boolean,
    messages?:Array<messageProps>
}