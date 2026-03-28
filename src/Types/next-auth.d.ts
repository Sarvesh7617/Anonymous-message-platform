import 'next-auth'
import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth'{
    interface User extends DefaultUser{
        _id?:string
        isVerified?:boolean
        isAcceptingMessage?:boolean
        username?:string
    }
}



declare module 'next-auth'{
    interface Session extends DefaultSession{
        user:{
            _id?:string
            isVerified?:boolean
            isAcceptingMessage?:boolean
            username?:string
        }
    }
}