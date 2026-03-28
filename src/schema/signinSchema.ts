import {z} from 'zod';


export const signInSchema=z.object({
    identifier:z.string(),
    password:z.string().regex(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/g,{message:"Ensure that password is 8 to 64 characters long and contains a mix of upper and lower case characters, one numeric and one special character"})
})