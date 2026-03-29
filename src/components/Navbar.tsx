'use client'
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";
import Logo from "@/../public/logo.webp";
import Image from "next/image";


const Navbar=()=>{
    const {data:Session}=useSession();
    const user=Session?.user as User;
    return(
        <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
            <div className="mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center justify-center gap-x-2">
                    {Session?(
                        <Link href="/dashboard"><Image src={Logo} width={60} className="rounded-md justify-self-left" alt="logo"/></Link>
                    ):(
                        <Link href="/"><Image src={Logo} width={60} className="rounded-md justify-self-left" alt="logo"/></Link>
                    )}
                    <p className="text-xl font-bold mb-4 md:mb-0">Mystry Message</p>
                </div>
                {Session ?(
                    <>
                        <span>Welcome,{user?.username || user?.email}</span>
                        <span>
                            <Button onClick={()=>signOut({callbackUrl:"/"})} className="hover:cursor-pointer" variant="destructive">Log Out</Button>
                        </span>
                    </>
                ):(
                    <Link href="/sign-in" className="bg-green-500 p-2 rounded hover:cursor-pointer font-bold">Log In</Link>
                )}
            </div>
        </nav>
    )
}



export default Navbar;