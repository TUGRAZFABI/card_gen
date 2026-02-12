'use client'

import {useEffect, useState} from 'react';
import {supabase} from '../lib/supabase'

export default function Register ()
{
    const[username, setUsername] = useState<string>('');
    const[email, setEmail] = useState<string>('');
    const[password, setPassword] = useState<string>('');

    const handleSignup = async() => 
    {
        //check if user exists in the table mabey hash this when table leaks all usernames emails leak!
        const {data: isAlreadyRegistered} = await supabase.from('user_collection').select('*').or(`username.ilike.%${username}%,email.ilike.%${email}%`)
        .maybeSingle();
        console.log(isAlreadyRegistered);
        if(isAlreadyRegistered == null)
        {
            alert('User already registered!')
            return;
        }
        //General security notes: 
        //The api ensures that the email and passwords are hashed and stored securly.
        /*  
        const { data, error : onError} = await supabase.auth.signUp({
        email: 'example@email.com',
        password: 'example-password',
        })

        if (onError) {
            alert(`Signup failed: ${onError.message}`);
            return
        }
        */

        const{error} = await supabase.from('user_collection').insert({
            username: username,
            email : email,
            coins: 1000,
            inventory: [],
        })

        if(error)
        {
            throw error;
        }
        alert('Signup successful!');
    }


    return(
        <div>
             <h1>Sign Up</h1>
            <form onSubmit={handleSignup}>
                <input 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Username....." 
                />
                <p/>
                <input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email....." 
                type="email" 
                />
                <input 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password....." 
                type="password" 
                />
                <p/>
                <button type="submit">Sign Up</button>
            </form>

        </div>
    )
}