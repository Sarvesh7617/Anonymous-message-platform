import {z} from 'zod';


export const usernameSchema=z
    .string()
    .min(4,{message:"username atleast 4 character"})
    .max(24,{message:"username atmost 24 character"})
    .regex(/^[A-Za-z0-9]+$/,{message:"username must be valid format"})





export const signUpSchema=z.object({
    username:usernameSchema,
    email:z.string().regex(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,{message:"invalid email address"}),
    password:z.string().min(8,{message:"password must be atleast 8 character"})
})