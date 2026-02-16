'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    //check if user exists in the table mabey hash this when table leaks all usernames emails leak!
    const { data: isAlreadyRegistered } = await supabase
      .from('user_collection')
      .select('*')
      .or(`username.ilike.%${username}%,email.ilike.%${email}%`)
      .maybeSingle();

    if (isAlreadyRegistered != null) {
      alert('User already registered!');
      return;
    } else if (username == '' || password == '' || email == '') {
      alert("Form can't be empty");
      return;
    }

    //General security notes:
    //The api ensures that the email and passwords are hashed and stored securly.
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    //the supabase free tier only allows really low requests a day so just continue when no more is availale.
    if (error) {
      console.log(error);
    }

    await supabase.from('user_collection').insert({
      username: username,
      email: email,
      coins: 1000,
      inventory: [],
    });

    router.push('/'); //redirect to the landing page!
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSignup}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username....."
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
