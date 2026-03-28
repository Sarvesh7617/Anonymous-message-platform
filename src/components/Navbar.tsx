'use client'
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";


const Navbar=()=>{
    const {data:Session}=useSession();
    const user=Session?.user as User;
    return(
        <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <a href="#" className="text-xl font-bold mb-4 md:mb-0">Mystry Message</a>
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