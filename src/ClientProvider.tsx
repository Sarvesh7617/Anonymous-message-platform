'use client'

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";




interface childrenProps{
    children:ReactNode
}

const ClientProvider=({children}:childrenProps)=>{
    return(
        <div>
            <SessionProvider>
                {children}
            </SessionProvider>
        </div>
    )
}


export default ClientProvider;