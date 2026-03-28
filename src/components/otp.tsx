'use client';

import { useRef } from "react"
import { Input } from "@/components/ui/input";



interface OTPInputProps{
    value:string
    onChange:(value:string)=>void;
}

const OTPInput=({value,onChange}:OTPInputProps)=>{
    const inputRef=useRef<Array<HTMLInputElement | null>>([])

    const otp=(value??"").split("").concat(Array(6).fill("")).slice(0,6)

    const handleChange=(val:string,idx:number)=>{
        if(/^[0-9]?$/.test(val))
        {
            let newOtp=[...otp]
            newOtp[idx]=val
            let finalOtp=newOtp.join("");
            onChange(finalOtp);
        }

        if(val && idx <5)
            inputRef.current[idx+1]?.focus();
    }


    const handleDown=(e:React.KeyboardEvent<HTMLInputElement>,idx:number)=>{
        if(e.key==="Backspace" && !otp[idx] && idx>0)
            inputRef.current[idx-1]?.focus();
    }


    return(
        <div className="flex gap-2 justify-center">
            {Array.from({length:6}).map((_,idx)=>(
                <Input
                    key={idx}
                    ref={e=>{inputRef.current[idx]=e}}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value?.[idx] ?? ""}
                    onChange={e=>handleChange(e.target.value,idx)}
                    className="w-12 h-12 text-center text-lg border-2 border-black dark:border-white"
                    onKeyDown={e=>handleDown(e,idx)}
                />
            ))}
        </div>
    )
}



export default OTPInput;