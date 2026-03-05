'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import { CurrentUser, useUser } from '../lib/userContext';

export default function Register() {
  const [registerUser, setregisterUser] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const router = useRouter();
  const { setUserId, setUsername } = useUser();

  const crypto = require('crypto');

  function privateSHA256() {
    const uuid = `${email}-${Date.now()}-${Math.random()}`;
    return crypto.createHash('sha256').update(uuid).digest('hex');
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    //check if user exists in the table mabey hash this when table leaks all registerUsers emails leak!
    const { data: isAlreadyRegistered, error: test2 } = await supabase
      .from('user_collection')
      .select('*')
      .or(`username.ilike.%${registerUser}%,email.ilike.%${email}%`)
      .maybeSingle();

    console.log(test2);

    if (isAlreadyRegistered != null) {
      alert('User already registered!');
      return;
    } else if (registerUser == '' || password == '' || email == '') {
      alert("Form can't be empty");
      return;
    }

    //General security notes:
    //The api ensures that the email and passwords are hashed and stored securly.
    /*
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    const user_id = data ? data.user?.id : privateSHA256(); //I know this is a huge security issue and also then the native /login doesnt work.
    */

    const user_id = privateSHA256();

    const { data: data } = await supabase
      .from('user_collection')
      .insert({
        username: registerUser,
        email: email,
        coins: 1000,
        inventory: [],
        authID: user_id,
      })
      .select();

    if (data == null) {
      console.log('Fail');
      return;
    }

    setUsername(registerUser);
    setUserId(data[0].id);
    console.log('test', data[0].id);
    router.push('/'); //redirect to the landing page!
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSignup}>
        <input
          value={registerUser}
          onChange={(e) => setregisterUser(e.target.value)}
          placeholder="registerUser....."
        />
        <p />
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
        <p />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          type="submit"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
